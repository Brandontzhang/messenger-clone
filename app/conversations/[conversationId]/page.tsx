import { cn } from "@/util/common";

import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "../../components/EmptyState";
import Header from "./components/header";
import Body from "./components/Body";
import Form from "./components/Form";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  conversationId: string
}

const Conversation = async ({ params }: { params: IParams }) => {
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

  return (
    <div className={cn(
      "lg:pl-80 h-full lg:block"
    )}>
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body messages={messages} user={currentUser} />
        <Form />
      </div>
    </div>
  )
};

export default Conversation;
