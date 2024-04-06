import clsx from "clsx";

import { Conversation, User } from "@prisma/client";

import GroupUserIcon from "../GroupUserIcon";
import SettingButtons from "./SettingButtons";
import SettingsOptions from "./SettingsOptions";

interface ConversationSettingsProps {
  className?: string,
  conversation: Conversation & {
    users: User[]
  },
  currentUser: User | null,
}

const ConversationSettings: React.FC<ConversationSettingsProps> = ({ className, conversation, currentUser }) => {
  return (
    <div className={clsx(
      className,
      "right-0  w-[28rem] border-solid border-2",
      "flex flex-col h-full items-center gap-2 overflow-y-auto"
    )}>
      <GroupUserIcon
        users={conversation.users.filter(user => user.id !== currentUser!.id)}
      />
      <p className="font-semibold">{conversation.isGroup ? conversation.name : conversation.users.filter(user => user.id !== currentUser!.id)[0].name}</p>
      <SettingButtons />
      <SettingsOptions conversation={conversation} />
    </div>
  )
};

export default ConversationSettings;


