"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import { FullConversationType, FullMessageType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";
import GroupUserIcon from "../[conversationId]/components/GroupUserIcon";

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean,
  currentUser: User,
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected, currentUser }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<FullMessageType[]>(data.messages);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }, [messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) {
      return false;
    }

    const seenArray = lastMessage.seen || [];
    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    } else if (lastMessage?.body) {
      return lastMessage.body;
    } else {
      return "Start a Conversation";
    }
  }, [lastMessage]);

  useEffect(() => {
    const conversationUpdateHandler = (updateData: { id: string, messages: FullMessageType[] }) => {
      const { id, messages } = updateData;
      if (id === data.id) {
        setMessages((current: FullMessageType[]) => {
          return [...current, ...messages];
        });
      };
    };

    const seenUpdateHandler = (lastMessage: FullMessageType) => {
      if (lastMessage.conversationId === data.id) {
        setMessages((current: FullMessageType[]) => {
          return [...current, lastMessage];
        });
      }
    }

    if (userEmail) {
      pusherClient.subscribeAll();
      pusherClient.bind_global((event: string, data: any) => {
        switch (event) {
          case "conversation:update":
            const { conversation, messages } = data as { conversation: FullConversationType, messages: FullMessageType[] };
            conversationUpdateHandler({
              id: conversation.id,
              messages: messages
            });
            break;
          case "seen:update":
            const message = data as FullMessageType;
            seenUpdateHandler(message);
            break;
        }
      });
    }
    return () => {
      pusherClient.unbind_global();
    };
  }, [userEmail]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg troansition cursor-pointer px-2 py-2`,
        selected ? 'bg-neutral-100' : 'bg-white',
      )}
    >
      {data.users.length > 2 ? <GroupUserIcon users={data.users} size="sm" /> : <Avatar user={otherUser} />}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">{data.name || otherUser.name}</p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">{format(new Date(lastMessage.createdAt), 'p')}</p>
            )}
          </div>
          <p className={clsx(
            `truncate text-sm`,
            hasSeen ? 'text-gray-500' : 'text-black font-medium'
          )}>
            {lastMessage ? `${lastMessage?.sender.id === currentUser.id ? "You" : lastMessage?.sender.name}: ${lastMessageText}` : "Start a conversation"}
          </p>
        </div>
      </div>
    </div>
  )
};

export default ConversationBox;
