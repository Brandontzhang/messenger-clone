import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/CoversationList";

import getConversations from "../actions/getConversations";
import getCurrentUser from "../actions/getCurrentUser";

const ConversationsLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  const conversations = await getConversations();
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList
          currentUser={currentUser!}
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  )
};

export default ConversationsLayout;
