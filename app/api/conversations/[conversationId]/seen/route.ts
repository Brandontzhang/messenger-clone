import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

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

    // TODO: There is a bug with the seen, each user has too many seen messages tracked on it that can't be sent through pusher 
    const updatedMessage = await prisma.message.update({
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

    // WARN: Wiping out so pusher can send, but on receiving the push even cannot expect the seen message ids. This is going against the types...
    // Not good design. 
    updatedMessage.sender.seenMessageIds = [];

    await pusherServer.trigger(conversation.id, 'seen:update', updatedMessage);

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGE_SEEN");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
