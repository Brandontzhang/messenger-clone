import clsx from "clsx";
import Image from "next/image";

import { User } from "@prisma/client";

interface UserIconProps {
  user: User,
  className?: string,
}

const UserIcon: React.FC<UserIconProps> = ({ user, className }) => {
  return (
    <div className={clsx(
      "relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11",
      className,
    )}>
      <Image alt="Avatar" src={user.image || '/images/placeholder.jpg'} fill />
    </div>
  )
};

export default UserIcon;
