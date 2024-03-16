import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/CoversationList";

import getConversations from "../actions/getConversations";

const ConversationsLayout= async ({ children } : { children : React.ReactNode}) => {
  const conversations = await getConversations();
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList 
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  )
};

export default ConversationsLayout;