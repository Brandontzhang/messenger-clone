import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";
import MessageBox from "./MessageBox";

interface MessageListProps {
  messages: FullMessageType[],
  currentUser: User | null,
  lastMessageSeenBy: User[][],
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, lastMessageSeenBy }) => {
  return (
    <div className="flex-1 flex flex-col-reverse overflow-y-auto py-2">
      {messages.map((message: FullMessageType, index: number) => (
        <MessageBox
          key={message.id}
          message={message}
          currentUser={currentUser}
          lastMessageSeenBy={lastMessageSeenBy[index]}
          displayAvatar={index === 0 ? message.senderId !== currentUser?.id : message.senderId !== messages[index - 1].senderId}
        />
      ))}
    </div>
  )
};

export default MessageList;
