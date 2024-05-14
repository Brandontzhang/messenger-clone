import UserIcon from "@/app/components/UserIcon";
import { User } from "@prisma/client";
import clsx from "clsx";

interface GroupUserIconProps {
  users: User[]
  size?: "sm" | "md" | "lg",
}

const GroupUserIcon: React.FC<GroupUserIconProps> = ({ users, size }) => {
  if (users.length < 2) {
    return (
      <div className="relative w-[6rem] h-[6rem] flex justify-center items-center">
        <UserIcon
          className="md:h-16 md:w-16"
          user={users[0]}
        />
      </div>
    )
  }

  const getSize = () => {
    switch (size) {
      case "sm":
        return "h-9 w-9 md:h-11 md:w-11";
      case "md":
        return "w-[6rem] h-[6rem]";
      case "lg":
        return "w-[9rem] h-[9rem]";
      default:
        return "w-[6rem] h-[6rem]";
    }
  }

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-9 w-9"
      case "md":
        return "h-12 w-12"
      case "lg":
      default:
        return "h-12 w-12"
    }
  }

  const getLeftIconPositioning = () => {
    switch (size) {
      case "sm":
        return "-left-1 -bottom-1";
      case "md":
        return "left-3 bottom-2";
      case "lg":
      default:
        return "left-3 bottom-2";
    }
  }

  const getRightIconPositioning = () => {
    switch (size) {
      case "sm":
        return "-right-1 -top-1";
      case "md":
        return "right-3 top-2";
      case "lg":
      default:
        return "right-3 top-2";
    }
  }

  const setActiveIconPositioning = () => {
    switch (size) {
      case "sm":
        return "-bottom-1 -right-1";
      case "md":
        return "bottom-2 right-2";
      case "lg":
      default:
        return "bottom-2 right-2";
    }
  }

  return (
    <div className={clsx(
      "relative flex justify-center items-center overflow-visible",
      getSize()
    )}>
      <UserIcon
        className={clsx(
          "absolute z-10",
          getLeftIconPositioning(),
        )}
        user={users[0]}
        size={getIconSize()}
      />
      <UserIcon
        className={clsx(
          "absolute",
          getRightIconPositioning(),
        )}
        user={users[1]}
        size={getIconSize()}
      />
      <span className={clsx(
        "absolute block rounded-full bg-green-500 ring-2 ring-white h-1 w-1 md:h-3 md:w-3",
        setActiveIconPositioning()
      )} />
    </div>
  )
};

export default GroupUserIcon;
