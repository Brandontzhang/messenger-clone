"use client";

import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";
import MessageBox from "./MessageBox";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useParams } from "next/navigation";

interface MessageListProps {
  initialMessages: FullMessageType[],
  lastMessageSeenBy: User[][],
}

const MessageList: React.FC<MessageListProps> = ({ initialMessages, lastMessageSeenBy }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null); // Used to scroll to the bottom 
  const session = useSession();

  const { conversationId } = useParams<{ conversationId: string }>();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId])

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return (
    <div className="h-full flex-1 flex flex-col-reverse overflow-y-auto py-2">
      {messages.map((message: FullMessageType, index: number) => (
        <MessageBox
          key={message.id}
          message={message}
          lastMessageSeenBy={lastMessageSeenBy[index]}
          displayAvatar={index === 0 ? message.sender.email !== session.data?.user?.email : message.senderId !== messages[index - 1].senderId}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
};

export default MessageList;
