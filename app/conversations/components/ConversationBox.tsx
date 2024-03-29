"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean,
  currentUser: User,
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected, currentUser }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  // TODO if empty?
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

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
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a Conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg troansition cursor-pointer px-2 py-2`,
        selected ? 'bg-neutral-100' : 'bg-white',
      )}
    >
      <Avatar user={otherUser} />
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
            {lastMessage.sender.id === currentUser.id ? "You" : lastMessage.sender.name}: {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  )
};

export default ConversationBox;
