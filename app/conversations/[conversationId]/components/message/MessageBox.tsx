"use client";

import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import SeenBox from "../SeenBox";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import MessageOptions from "./MessageOptions";

interface MessageBoxProps {
  message: FullMessageType,
  lastMessageSeenBy: { [messageId: string]: User[] },
  displayAvatar: boolean,
  date?: string,
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, lastMessageSeenBy, displayAvatar, date }) => {
  const session = useSession();
  const isOwn = session.data?.user?.email === message.sender.email;
  const [timeHover, setTimeHover] = useState(false);
  const [rowHover, setRowHover] = useState(false);

  const styles = {
    messageBox: clsx(
      "flex flex-row gap-x-3 py-1 px-4 w-full items-center py-0.5",
      isOwn ? "justify-end" : "justify-start",
    ),
    messageBody: clsx(
      "flex items-center rounded-2xl max-w-[60%] relative",
      !isOwn && "bg-gray-100",
      isOwn && "bg-sky-500 text-white"
    ),
    timeHover: clsx(
      "flex items-center bg-gray-600 text-white h-fit py-1 px-4 rounded-md absolute whitespace-nowrap",
      isOwn ? "right-full" : "left-full",
      !timeHover && "hidden"
    ),
    avatarPadding: clsx(
      "h-9 w-9 md:h-11 md:w-11",
      isOwn && "hidden",
    ),
    options: clsx(
      isOwn ? "order-first" : "order-last",
      !rowHover && "hidden"
    )
  }

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-col items-center" >
        <div className={clsx(
          !date && "hidden",
          "my-6 text-gray-500 font-light",
        )}>
          {date}
        </div>
        <div className={styles.messageBox} onMouseEnter={() => setRowHover(true)} onMouseLeave={() => setRowHover(false)}>
          {displayAvatar && !isOwn ? <Avatar user={message.sender} /> : <div className={styles.avatarPadding} />}
          <div className={styles.options}>
            <MessageOptions
              className={clsx(isOwn ? "flex-row" : "flex-row-reverse")}
              messageId={message.id}
            />
          </div>
          <div className={styles.messageBody} onMouseEnter={() => setTimeHover(true)} onMouseLeave={() => setTimeHover(false)}>
            {message.image ?
              <Image
                alt="Image"
                height="288"
                width="288"
                src={message.image}
                className="rounded-md"
              /> :
              <p className="px-4 py-2">{message.body}</p>
            }
            <span className={styles.timeHover}>
              {format(new Date(message.createdAt), "EEEE p")}
            </span>
          </div>
        </div>
      </div>
      <SeenBox users={lastMessageSeenBy[message.id]} />
    </div >
  )

};

export default MessageBox;
