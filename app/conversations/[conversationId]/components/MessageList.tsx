"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import axios from "axios";
import { DateTime } from "luxon";

import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";
import MessageBox from "./MessageBox";


interface MessageListProps {
  initialMessages: FullMessageType[],
  lastMessageSeenBy: { [messageId: string]: User[] },
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

  const calculateMessageDate = (message: FullMessageType, index: number) => {
    let dateString = "";
    let createdAt = DateTime.fromJSDate(message.createdAt);
    let year = createdAt.get('year');
    let month = createdAt.get('monthShort');
    let day = createdAt.get('day');
    let weekday = createdAt.get('weekdayShort');
    let hour = createdAt.get('hour');
    let minute = createdAt.get('minute');
    let period = hour >= 12 ? "PM" : "AM";

    let hourString = hour == 12 ? 12 : (hour) % 12;
    let minuteString = minute < 10 ? `0${minute}` : minute;
    dateString = `${month} ${day}, ${year} AT ${hourString}:${minuteString} ${period}`;

    let prevMessage = index != messages.length ? messages[index + 1] : null;
    if (prevMessage) {
      let prevMessageCreatedAt = DateTime.fromJSDate(prevMessage.createdAt);
      let minDif = createdAt.diff(prevMessageCreatedAt).get('milliseconds') / 60000;
      let curDif = createdAt.diffNow().get("milliseconds") / -60000;

      if (minDif <= 20) {
        dateString = "";
      } else if (curDif < 1440) {
        dateString = `${hourString}:${minuteString} ${period}`;
      } else if (curDif < 10080) {
        dateString = `${weekday}, ${hourString}:${minuteString} ${period}`;
      } else {
        dateString = `${month} ${day}, ${year} AT ${hourString}:${minuteString} ${period}`;
      }
    }

    return dateString;
  }

  const displayAvatar = (message: FullMessageType, messageIndex: number) => {
    if (messageIndex === 0) {
      // The last message sent
      return message.sender.email !== session.data?.user?.email;
    }

    // Message chain broken by date display
    if (message.senderId === messages[messageIndex - 1].senderId) {
      const prevCreatedAt = DateTime.fromJSDate(messages[messageIndex - 1].createdAt);
      const curCreatedAt = DateTime.fromJSDate(messages[messageIndex].createdAt);
      let dif = prevCreatedAt.diff(curCreatedAt).get('milliseconds') / 60000;

      return dif > 20;
    }

    return true;
  }

  return (
    <div className="h-full flex-1 flex flex-col-reverse overflow-y-auto py-2">
      {messages.map((message: FullMessageType, index: number) => (
        <MessageBox
          key={message.id}
          message={message}
          lastMessageSeenBy={lastMessageSeenBy}
          displayAvatar={displayAvatar(message, index)}
          date={calculateMessageDate(message, index)}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
};

export default MessageList;
