import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const updateSeenByConversationId = async (conversationId: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.email || !currentUser?.id) {
    return null;
  }

  let conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      messages: true
    }
  });

  if (!conversation) {
    return null;
  }

  // Only need to update the last message that was seen in the conversation by the user
  let lastMessage = conversation.messages[conversation.messages.length - 1];

  if (!lastMessage) {
    return null;
  }

  let updatedMessage = await prisma.message.update({
    where: {
      id: lastMessage.id
    },
    include: {
      sender: true,
      seen: true
    },
    data: {
      seen: {
        connect: {
          id: currentUser.id
        }
      }
    }
  });
};

export default updateSeenByConversationId;
