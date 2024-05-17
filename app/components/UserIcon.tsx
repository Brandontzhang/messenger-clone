import Image from "next/image";

import { User } from "@prisma/client";
import { cn } from "@/util/common";

interface UserIconProps {
  user: User,
  className?: string,
  size?: string
}

const UserIcon: React.FC<UserIconProps> = ({ user, className, size }) => {
  const sizeStr = size ? size : "h-9 w-9 md:h-11 md:w-11"
  return (
    <div className={cn(
      "relative inline-block rounded-full overflow-hidden",
      sizeStr,
      className,
    )}>
      {user?.image ? <Image alt="Avatar" src={user.image || '/images/placeholder.jpg'} fill /> : null}
    </div >
  )
};

export default UserIcon;
