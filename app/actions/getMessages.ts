import prisma from "@/app/libs/prismadb";

const getMessages = async (conversationId: string, messageId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      take: 20,
      skip: 1,
      cursor: {
        id: messageId
      },
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
