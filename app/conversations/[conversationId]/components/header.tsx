"use client";

import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useMemo } from "react";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "@/app/components/Avatar";
import GroupUserIcon from "./GroupUserIcon";

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  },
  toggleSettings: () => void,
  currentUser: User,
}

const Header: React.FC<HeaderProps> = ({ conversation, toggleSettings, currentUser }) => {
  const otherUser = useOtherUser(conversation);
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return 'Active';
  }, [conversation]);

  const conversationName = useMemo(() => {
    if (conversation.isGroup) {
      return conversation.name ? conversation.name : conversation.users.filter(user => user.id !== currentUser.id).map(user => user.name).join(", ");
    } else {
      return otherUser.name
    }
  }, [conversation.id]);

  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          href="/conversations">
          <HiChevronLeft size={32} />
        </Link>
        {conversation.users.length > 0 ? <GroupUserIcon users={conversation.users} size="sm" /> : <Avatar user={otherUser} />}
        <div className="flex flex-col">
          <div className="truncate">
            {conversationName}
          </div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <HiEllipsisHorizontal
        className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        size={32}
        onClick={toggleSettings}
      />
    </div>

  )
};

export default Header;
