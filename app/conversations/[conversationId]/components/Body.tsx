"use client";

import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import { User } from "@prisma/client";


interface BodyProps {
  messages: FullMessageType[],
  user: User | null
}

const Body: React.FC<BodyProps> = ({ messages, user }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageBox message={message} user={user} />
      ))}
    </div>
  )
};

export default Body;
