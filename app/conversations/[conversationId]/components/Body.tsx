import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import MessageList from "./MessageList";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import { find } from "lodash";
import axios from "axios";


interface BodyProps {
  initialMessages: FullMessageType[],
  currentUser: User | null,
  users: User[],
}

const Body: React.FC<BodyProps> = ({ initialMessages, currentUser, users }) => {
  const [messages, setMessages] = useState(initialMessages);
  users = users.filter(u => u.id !== currentUser!.id);
  const [lastMessageSeenBy, setLastMessageSeenBy] = useState(calculateLastMessageSeenBy(messages, users));
  const { conversationId } = useConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSeenOnFocus = () => {
      window.addEventListener("focus", () => {
        try {
          axios.post(`/api/conversations/${conversationId}/seen`);
        } catch (err) {
          console.log(err);
        }
      });
    };

    const seenUpdateEvent = (updatedMessage: FullMessageType) => {
      const updatedSeenUsers = updatedMessage.seen;
      setLastMessageSeenBy(current => {
        let updatedSeen: { [messageId: string]: User[] } = {};
        Object.entries(current).forEach(seenData => {
          let [messageId, seenUsers] = seenData;

          seenUsers = seenUsers.filter(user => !updatedSeenUsers.find(updatedUser => updatedUser.id == user.id));
          if (seenUsers.length > 0) {
            updatedSeen[messageId] = seenUsers;
          }
        });
        updatedSeen[updatedMessage.id] = updatedSeenUsers.filter(user => user.id != currentUser!.id);
        return updatedSeen;
      });
    };

    const messageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => {
        let existingMessage = find(current, (m: FullMessageType) => m.id === newMessage.id);
        if (existingMessage) {
          return current;
        }

        let newMessages = [newMessage, ...current];
        setLastMessageSeenBy(calculateLastMessageSeenBy(newMessages, users));

        return newMessages;
      });
    };

    updateSeenOnFocus();
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    pusherClient.bind('seen:update', seenUpdateEvent);
    pusherClient.bind('messages:new', messageHandler);
    bottomRef?.current?.scrollIntoView();

    return () => {
      pusherClient.unbind("messages:new");
      pusherClient.unbind("seen:update");
      pusherClient.unsubscribe(conversationId);
    }
  }, [conversationId]);

  return (
    <div className="h-full overflow-y-scroll ">
      <MessageList initialMessages={messages} lastMessageSeenBy={lastMessageSeenBy} />
      <div ref={bottomRef} />
    </div>
  )
};

const calculateLastMessageSeenBy = (messages: FullMessageType[], users: User[]) => {
  const lastMessageSeenBy: { [messageId: string]: User[] } = {};
  let remainingUsers = [...users];

  messages.forEach(message => {
    if (remainingUsers.length === 0) {
      return;
    }

    const intersection = remainingUsers.filter(user => message.seenIds.includes(user.id));
    if (intersection.length > 0) {
      lastMessageSeenBy[message.id] = intersection;

      remainingUsers = remainingUsers.filter(userId => !intersection.includes(userId));
    };
  });

  return lastMessageSeenBy;
}

export default Body;
