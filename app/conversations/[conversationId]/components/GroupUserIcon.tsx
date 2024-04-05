import UserIcon from "@/app/components/UserIcon";
import { User } from "@prisma/client";

interface GroupUserIconProps {
  users: User[]
}

const GroupUserIcon: React.FC<GroupUserIconProps> = ({ users }) => {
  if (users.length === 1) {
    return (
      <div className="absolute w-[7rem] h-[7rem] flex justify-center items-center">
        <UserIcon
          className="md:h-16 md:w-16"
          user={users[0]}
        />
      </div>
    )
  }

  return (
    <div className="absolute w-[7rem] h-[7rem] flex justify-center items-center">
      <UserIcon
        className="absolute md:h-14 md:w-14 left-4 bottom-6 z-10 outline outline-white outline-2"
        user={users[0]}
      />
      <UserIcon
        className="absolute md:h-14 md:w-14 right-3 top-1"
        user={users[1]}
      />
      <span className="absolute block rounded-full bg-green-500 ring-2 ring-white bottom-6 right-3 h-2 w-2 md:h-3 md:w-3" />
    </div>
  )
};

export default GroupUserIcon;
