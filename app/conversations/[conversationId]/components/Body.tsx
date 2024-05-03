import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import MessageList from "./MessageList";
import { useEffect, useRef, useState } from "react";
import { pusherClient, pusherServer } from "@/app/libs/pusher";
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
    // On focus, update any new seen messages
    window.addEventListener("focus", () => {
      try {
        axios.post(`/api/conversations/${conversationId}/seen`);
      } catch (err) {
        console.log(err);
      }
    });

    pusherClient.bind('seen:update', (updatedMessages: FullMessageType) => {
      // console.log(updatedMessages);
      // TODO: the old message state has not been updated when this event is triggered. Need to reconsider how seen states are handled
      // console.log(messages);
    });

    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

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

    pusherClient.bind('messages:new', messageHandler);
    bottomRef?.current?.scrollIntoView();

  }, [conversationId]);

  useEffect(() => {
  }, [conversationId]);

  return (
    <div className="h-full">
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
