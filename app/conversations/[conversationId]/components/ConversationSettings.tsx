import clsx from "clsx";

import { Conversation, User } from "@prisma/client";

import GroupUserIcon from "./GroupUserIcon";

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
      "right-0 top-0 bottom-0 w-[28rem] border-solid border-2",
      "flex flex-col justify-start items-center py-16"
    )}>
      <GroupUserIcon
        users={conversation.users.filter(user => user.id !== currentUser!.id)}
      />
    </div>
  )
};

export default ConversationSettings;


