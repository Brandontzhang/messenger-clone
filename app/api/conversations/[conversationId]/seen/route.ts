import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { cleanMessage, pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string
}
export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        messages: {
          include: {
            seen: true
          }
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse('Invalid Id', { status: 400 });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const isLastMessageSeen = lastMessage?.seenIds?.includes(currentUser.id);

    if (!lastMessage || isLastMessageSeen) {
      return NextResponse.json(conversation);
    }

    let updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    // Cleaning message to reduce payload before sending through pusher
    updatedMessage = cleanMessage(updatedMessage);
    console.log(updatedMessage.seenIds);

    await pusherServer.trigger(conversation.id, 'seen:update', updatedMessage).
      catch((e: any) => {
        console.log(`Seen Update error: ${e}`);
        console.log(updatedMessage);
      });

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGE_SEEN");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
