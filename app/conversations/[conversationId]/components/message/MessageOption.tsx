import clsx from "clsx";
import { ReactNode, useState } from "react";

interface MessageOptionProps {
  icon: ReactNode,
  hoverText: string,
  children?: ReactNode,
};

const MessageOption: React.FC<MessageOptionProps> = ({ icon, hoverText, children }) => {
  const [hover, setHover] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(false);

  return (
    <div className="relative">
      <div
        className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
        }}
        onClick={() => setDisplayChildren(displayChildren => !displayChildren)}
      >
        {icon}
      </div>
      <div className={clsx(
        !hover && "hidden",
        // TODO: Add that arrow pointing down + some shadow 
        "text-white bg-zinc-600 p-2 rounded-md flex justify-center items-center whitespace-nowrap",
        "absolute bottom-[115%] left-1/2 transform -translate-x-1/2 z-10"
      )}>
        {hoverText}
      </div>
      <div className={clsx(
        !displayChildren && "hidden",
      )}
        onMouseLeave={() => setDisplayChildren(false)}
      >
        {children}
      </div>
    </div>
  )
};

export default MessageOption;
