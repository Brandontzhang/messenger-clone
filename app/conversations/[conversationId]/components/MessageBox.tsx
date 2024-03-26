"use client";

import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import SeenBox from "./SeenBox";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";

interface MessageBoxProps {
  message: FullMessageType,
  lastMessageSeenBy: User[],
  displayAvatar: boolean,
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, lastMessageSeenBy, displayAvatar }) => {
  const session = useSession();
  const isOwn = session.data?.user?.email === message.sender.email;
  const [hover, setHover] = useState(false);

  const styles = {
    messageBox: clsx(
      "flex flex-row gap-x-3 py-1 px-4 w-full items-center",
      displayAvatar ? "py-2" : "py-0.5",
      isOwn ? "justify-end" : "justify-start"
    ),
    messageBody: clsx(
      "flex items-center rounded-2xl max-w-[60%]",
      !isOwn && "bg-gray-100",
      isOwn && "bg-sky-500 text-white"
    ),
    timeHover: clsx(
      "flex items-center bg-gray-600 text-white h-fit py-1 px-4 rounded-md",
      isOwn ? "order-first" : "order-last",
      !hover && "hidden"
    ),
    avatarPadding: clsx(
      "h-9 w-9 md:h-11 md:w-11",
      isOwn && "hidden",
    )
  }

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-col items-center" >
        <div className={styles.messageBox} >
          {displayAvatar && !isOwn ? <Avatar user={message.sender} /> : <div className={styles.avatarPadding} ></div>}
          <div className={styles.messageBody} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
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
          </div>
          <div className={styles.timeHover}>
            {format(new Date(message.createdAt), "EEEE p")}
          </div>
        </div>
      </div>
      <SeenBox users={lastMessageSeenBy} />
    </div>
  )

};

export default MessageBox;
