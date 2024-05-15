'use client';
import clsx from "clsx";

import { User } from "@prisma/client";
import UserIcon from "./UserIcon";

interface AvatarProps {
  user?: User,
  className?: string,
}
const Avatar: React.FC<AvatarProps> = ({ user, className }) => {
  return (
    <div className={clsx(
      "relative",
      className
    )}>
      <UserIcon
        user={user!}
      />
      <span className="absolute block rounded-full bg-green-500 ring-2 ring-white bottom-1 right-0 h-2 w-2 md:h-3 md:w-3" />
    </div>
  )
}

export default Avatar;
