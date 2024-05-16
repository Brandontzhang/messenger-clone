import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import MessageList from "./message/MessageList";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import { find, update } from "lodash";
import axios from "axios";


interface BodyProps {
  initialMessages: FullMessageType[],
  currentUser: User | null,
  users: User[],
}

const Body: React.FC<BodyProps> = ({ initialMessages, currentUser, users }) => {
  const [messages, setMessages] = useState(initialMessages);
  users = users.filter(u => u.id !== currentUser!.id);
  const { conversationId } = useConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  const calculateLastMessageSeenBy = (allMessages: FullMessageType[], users: User[]) => {
    const lastMessageSeenBy: { [messageId: string]: User[] } = {};
    let remainingUsers = users.filter(user => user.id !== currentUser!.id);

    allMessages.forEach(message => {
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
  const [lastMessageSeenBy, setLastMessageSeenBy] = useState(calculateLastMessageSeenBy(messages, users));

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

    const seenUpdateHandler = (updatedMessage: FullMessageType) => {
      setMessages((current) => {
        current.forEach(message => {
          if (message.id === updatedMessage.id) {
            message.seenIds = updatedMessage.seenIds;
          }
        });

        return current;
      });

      setLastMessageSeenBy(current => {
        let updatedSeen: { [messageId: string]: User[] } = {};
        Object.entries(current).forEach(seenData => {
          let [messageId, seenUsers] = seenData;

          seenUsers = seenUsers.filter(user => !updatedMessage.seen.find(updatedUser => updatedUser.id == user.id));
          if (seenUsers.length > 0) {
            updatedSeen[messageId] = seenUsers;
          }
        });
        updatedSeen[updatedMessage.id] = updatedMessage.seen.filter(user => user.id != currentUser!.id);
        return updatedSeen;
      });
    };

    const newMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => {
        let existingMessage = find(current, (m: FullMessageType) => m.id === newMessage.id);
        if (existingMessage) {
          return current;
        }

        let newMessages = [newMessage, ...current];

        // TODO: There's a bug affecting the seen when a new message is sent, must be an error here
        setLastMessageSeenBy(calculateLastMessageSeenBy(newMessages, users));
        return newMessages;
      });
    };

    updateSeenOnFocus();
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    pusherClient.bind_global((event: string, message: FullMessageType) => {
      switch (event) {
        case "messages:new":
          newMessageHandler(message);
          break;
        case "seen:update":
          seenUpdateHandler(message);
        default:
      }
    });

    bottomRef?.current?.scrollIntoView();

    return () => {
      pusherClient.unbind_global();
    }
  }, [conversationId]);

  return (
    <div className="h-full overflow-y-scroll ">
      <MessageList initialMessages={messages} lastMessageSeenBy={lastMessageSeenBy} />
      <div ref={bottomRef} />
    </div>
  )
};

export default Body;
