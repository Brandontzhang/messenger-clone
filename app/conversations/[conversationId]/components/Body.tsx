import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import MessageList from "./MessageList";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import { find } from "lodash";


interface BodyProps {
  initialMessages: FullMessageType[],
  currentUser: User | null,
  users: User[],
}

const Body: React.FC<BodyProps> = ({ initialMessages, currentUser, users }) => {
  const [messages, setMessages] = useState(initialMessages);
  users = users.filter(u => u.id !== currentUser!.id);
  const lastMessageSeenBy = calculateLastMessageSeenBy(messages, users);
  const { conversationId } = useConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => {
        let existingMessage = find(current, (m: FullMessageType) => m.id === newMessage.id);
        if (existingMessage) {
          return current;
        }
        return [newMessage, ...current];
      });
    };

    pusherClient.bind('messages:new', messageHandler);
    bottomRef?.current?.scrollIntoView();
    // TODO: mark message as seen
  }, [conversationId]);

  return (
    <div className="h-full">
      <MessageList initialMessages={messages} lastMessageSeenBy={lastMessageSeenBy} />
      <div ref={bottomRef} />
    </div>
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
