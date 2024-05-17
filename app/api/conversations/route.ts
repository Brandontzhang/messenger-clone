import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";
import { cleanConversation, pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
    } = body;



    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (isGroup && (!members || members.length < 2)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      return createGroupConversation(body, currentUser);
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
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  try {
    const currentUser = await getCurrentUser();
    // TODO: test these queries... especially the user one
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: query ? query : "",
              mode: "insensitive",
            },
          },
          {
            users: {
              some: {
                name: {
                  startsWith: query ? query : "",
                  mode: "insensitive",
                }
              }
            }
          }
        ],
        users: {
          some: {
            id: currentUser!.id
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
      },
    });

    return NextResponse.json(conversations.map(conversation => cleanConversation(conversation)));
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

const createGroupConversation = async (body: any, currentUser: User) => {
  const {
    userId,
    isGroup,
    members,
    name,
    message
  } = body;

  const groupMembers = [...members, currentUser];
  // Handle existing conversations
  let existingConversation = await prisma.conversation.findFirst({
    where: {
      userIds: {
        hasEvery: groupMembers.map((member: User) => member.id),
      }
    }
  });

  if (existingConversation) {
    return NextResponse.json(existingConversation);
  }

  // The included parameter makes it so that the newConversation object includes the user fields as well
  // (sort of like a join instead of just getting foreign key)
  let newConversation = await prisma.conversation.create({
    data: {
      name,
      isGroup,
      users: {
        connect: [
          ...groupMembers.map((member: User) => ({
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
      messages: {
        include: {
          seen: true,
          sender: true,
        }
      }
    },
  });

  // Cleaning data to reduce payload for pusher 
  newConversation = cleanConversation(newConversation);
  newConversation.messages = [message];

  await pusherServer.trigger(userId, 'conversation:new', {
    conversation: newConversation,
    message: message
  });
  return NextResponse.json(newConversation);
}
