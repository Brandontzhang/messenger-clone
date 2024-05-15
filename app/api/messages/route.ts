import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { cleanConversation, cleanMessage, pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId
          }
        },
        sender: {
          connect: {
            id: currentUser.id
          }
        },
        seen: {
          connect: {
            id: currentUser.id
          }
        },
      },
      include: {
        seen: true,
        sender: true,
      }
    });

    let updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          }
        }
      }
    });

    // Cleaning data before sending through pusher to prevent 413 error
    newMessage = cleanMessage(newMessage);
    updatedConversation = cleanConversation(updatedConversation);
    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    await pusherServer.trigger(conversationId, 'messages:new', newMessage).
      catch(e => {
        console.log(`New Message Error: ${e}`);
      });

    updatedConversation.users.map(user => {
      const data = {
        conversation: updatedConversation,
        messages: [lastMessage],
      };
      pusherServer.trigger(user.id!, 'conversation:update', data).
        catch((e: any) => {
          console.log(`Conversation Update Error: ${e}`);
          console.log(data);
        });
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const messageId = searchParams.get("messageId");
    const conversationId = searchParams.get("conversationId");

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId!
      },
      take: 20,
      skip: messageId ? 1 : undefined,
      cursor: messageId ? { id: messageId! } : undefined,
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Internal Error', { status: 500 });
  }

}

