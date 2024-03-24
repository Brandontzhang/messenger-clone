import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import MessageList from "./MessageList";


interface BodyProps {
  messages: FullMessageType[],
  currentUser: User | null,
  users: User[],
}

const Body: React.FC<BodyProps> = ({ messages, currentUser, users }) => {
  users = users.filter(u => u.id !== currentUser!.id);
  const lastMessageSeenBy = calculateLastMessageSeenBy(messages, users);

  return (
    <MessageList initialMessages={messages} lastMessageSeenBy={lastMessageSeenBy} />
  )
};

const calculateLastMessageSeenBy = (messages: FullMessageType[], users: User[]) => {
  const lastMessageSeenBy: User[][] = [];

  messages.forEach(message => {
    const messageSeenBy: User[] = []
    users.forEach(user => {
      const seenBy = message.seen.find(u => u.id === user.id);
      if (seenBy) {
        messageSeenBy.push(user);
        users = users.filter(u => u.id !== user.id);
      }
    });
    lastMessageSeenBy.push(messageSeenBy);
  });

  return lastMessageSeenBy;
}

export default Body;
