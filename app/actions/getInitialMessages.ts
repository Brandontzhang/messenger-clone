import prisma from "@/app/libs/prismadb";

const getInitialMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      take: 20,
      where: {
        conversationId: conversationId
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

export default getInitialMessages;
