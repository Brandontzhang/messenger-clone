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
  const [messages, setMessages] = useState(initialMessages.toReversed());
  const [loadingMessages, setLoadingMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null); // Used to scroll to the bottom 
  const session = useSession();

  const { conversationId } = useParams<{ conversationId: string }>();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId])

  useEffect(() => {
    setMessages(initialMessages.toReversed());
    bottomRef.current?.scrollIntoView();
  }, [initialMessages]);

  useEffect(() => {
    if (loadingMessages) {
      axios.get(`/api/messages`, {
        params: {
          conversationId: conversationId,
          messageId: messages[0].id,
        }
      }).then((data) => {
        const { data: newMessages } = data;
        setMessages((current) => [...newMessages.toReversed(), ...current]);
      }).finally(() => {
        setLoadingMessages(false)
      });
    }
  }, [loadingMessages]);

  const calculateMessageDate = (message: FullMessageType, index: number) => {
    let dateString = "";
    let createdAt = DateTime.fromJSDate(new Date(message.createdAt));
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

    let prevMessage = index != 0 ? messages[index - 1] : null;
    let curDif = createdAt.diffNow().get("milliseconds") / -60000;
    let sameDay = createdAt.hasSame(DateTime.now(), "day");

    if (curDif < 1440 && sameDay) {
      dateString = `${hourString}:${minuteString} ${period}`;
    } else if (curDif < 10080) {
      dateString = `${weekday}, ${hourString}:${minuteString} ${period}`;
    } else {
      dateString = `${month} ${day}, ${year} AT ${hourString}:${minuteString} ${period}`;
    }

    if (prevMessage) {
      let prevMessageCreatedAt = DateTime.fromJSDate(new Date(prevMessage.createdAt));
      let minDif = createdAt.diff(prevMessageCreatedAt).get('milliseconds') / 60000;

      if (minDif <= 20) {
        dateString = "";
      }
    }

    return dateString;
  }

  const displayAvatar = (message: FullMessageType, messageIndex: number) => {
    // The last message sent
    if (messageIndex === messages.length - 1) {
      return message.sender.email !== session.data?.user?.email;
    }

    if (messageIndex != messages.length - 1 && message.senderId === messages[messageIndex + 1].senderId) {
      const curCreatedAt = DateTime.fromJSDate(new Date(messages[messageIndex].createdAt));
      const nextCreatedAt = DateTime.fromJSDate(new Date(messages[messageIndex + 1].createdAt));
      let dif = curCreatedAt.diff(nextCreatedAt).get('milliseconds') / 60000;

      return dif > 20;
    }

    return true;
  }

  const handleScroll = async (event: any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    setLoadingMessages((scrollHeight + scrollTop) <= clientHeight);
  }

  return (
    <div onScroll={(e) => handleScroll(e)} className="h-full flex-1 flex flex-col justify-end overflow-y-auto py-2">
      {messages.map((message: FullMessageType, index: number) => (
        <MessageBox
          key={message.id}
          message={message}
          lastMessageSeenBy={lastMessageSeenBy}
          displayAvatar={displayAvatar(message, index)}
          date={calculateMessageDate(message, index)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
};

export default MessageList;
