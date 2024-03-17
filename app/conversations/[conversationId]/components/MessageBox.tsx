"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

interface MessageBoxProps {
  message: FullMessageType,
  user: User | null
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, user }) => {
  if (message.sender.id !== user?.id) {
    return (
      <div className="flex flex-row justify-start gap-x-3 py-2 px-4">
        <Avatar user={message.sender} />
        <div className="flex items-center rounded-2xl bg-slate-400 text-white max-w-[60%]">
          <p className="px-4 py-2">{message.body}</p>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-row justify-end gap-x-3 py-2 px-4">
        <div className="flex items-center rounded-2xl bg-sky-400 text-white max-w-[60%]">
          <p className="px-4 py-2">{message.body}</p>
        </div>
        <Avatar user={message.sender} />
      </div>
    )
  }
};

export default MessageBox;
