"use client";
import { cn } from "@/util/common";

import getConversationById from "@/app/actions/getConversationById";
import EmptyState from "../../components/EmptyState";
import Conversation from "./components/Conversation";
import getCurrentUser from "@/app/actions/getCurrentUser";
import updateSeenByConversationId from "@/app/actions/updateSeenByConversationId";
import getInitialMessages from "@/app/actions/getInitialMessages";
import NewState from "@/app/components/newconversation/NewState";

interface IParams {
  conversationId: string
}

const ConversationPage = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getInitialMessages(params.conversationId);
  const currentUser = await getCurrentUser();

  if (params.conversationId === "new" && currentUser) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <NewState
            currentUser={currentUser}
          />
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  updateSeenByConversationId(conversation.id);

  return (
    <div className={cn(
      "lg:pl-80 h-full lg:block"
    )}>
      <Conversation
        conversation={conversation}
        messages={messages}
        currentUser={currentUser}
      />
    </div>
  )
};

export default ConversationPage;
