"use client";

import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import SeenBox from "./SeenBox";
import clsx from "clsx";

interface MessageBoxProps {
  message: FullMessageType,
  currentUser: User | null,
  lastMessageSeenBy: User[],
  displayAvatar: boolean,
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, currentUser, lastMessageSeenBy, displayAvatar }) => {
  if (message.sender.id !== currentUser?.id) {
    return (
      <div className="flex flex-col">
        <div className={clsx(
          "flex flex-row justify-start gap-x-3 py-1 px-4",
          displayAvatar ? "py-2" : "py-0.5"
        )}>
          {displayAvatar ? <Avatar user={message.sender} /> : <div className="h-9 w-9 md:h-11 md:w-11"></div>}
          <div className="flex items-center rounded-2xl bg-gray-100 max-w-[60%]">
            <p className="px-4 py-2">{message.body}</p>
          </div>
        </div>
        <SeenBox users={lastMessageSeenBy} />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col">
        <div className={clsx(
          "flex flex-row justify-end gap-x-3 py-1 px-4",
          displayAvatar ? "py-2" : "py-0.5"
        )}>
          <div className="flex items-center rounded-2xl bg-sky-500 text-white max-w-[60%]">
            <p className="px-4 py-2">{message.body}</p>
          </div>
        </div>
        <SeenBox users={lastMessageSeenBy} />
      </div>
    )
  }
};

export default MessageBox;
