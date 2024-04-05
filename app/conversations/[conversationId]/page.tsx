import { cn } from "@/util/common";

import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "../../components/EmptyState";
import Conversation from "./components/Conversation";
import Header from "./components/header";
import Body from "./components/Body";
import Form from "./components/Form";
import getCurrentUser from "@/app/actions/getCurrentUser";
import updateSeenByConversationId from "@/app/actions/updateSeenByConversationId";

interface IParams {
  conversationId: string
}

const ConversationPage = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const currentUser = await getCurrentUser();

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
