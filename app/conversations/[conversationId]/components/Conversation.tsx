"use client";
import { useState } from "react";
import clsx from "clsx";

import Form from "./Form";
import Body from "./Body";
import Header from "./header";
import ConversationSettings from "./ConversationSettings";

import { FullMessageType } from "@/app/types";
import { Conversation, User } from "@prisma/client";


interface ConversationProps {
  conversation: Conversation & {
    users: User[]
  },
  messages: FullMessageType[],
  currentUser: User | null,
}

const Conversation: React.FC<ConversationProps> = ({ conversation, messages, currentUser }) => {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <div className="h-full w-full flex flex-row">
      <div className="h-full w-full flex flex-col">
        <Header
          conversation={conversation}
          toggleSettings={() => setOpenSettings((isOpen) => !isOpen)}
        />
        <Body messages={messages}
          currentUser={currentUser}
          users={conversation.users}
        />
        <Form />
      </div>
      <ConversationSettings
        className={clsx(!openSettings && "hidden")}
        conversation={conversation}
        currentUser={currentUser}
      />
    </div>
  )
};

export default Conversation;
