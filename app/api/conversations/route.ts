import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name,
      message
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (isGroup && (!members || members.length < 2)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      // TODO: Pull existing group conversation
      // When creating a new conversation, the user creating the conversation should be added as well
      // The included parameter makes it so that the newConversation object includes the user fields as well (sort of like a join instead of just getting foreign key)
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: User) => ({
                id: member.id
              })),
              {
                id: currentUser.id
              }
            ]
          }
        },
        include: {
          users: true,
          messages: true,
        }
      });

      return NextResponse.json(newConversation);
    }

    // TODO: He adds the two to prevent a bug, not sure why this is happening, but perhaps something to look into
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    console.log(error);
    return new NextResponse('Internal Errror', { status: 500 })
  }
}
