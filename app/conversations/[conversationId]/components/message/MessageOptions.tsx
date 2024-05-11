import clsx from "clsx";
import { FaAngry, FaEllipsisV, FaHeart, FaReply, FaSadTear, FaThumbsUp } from "react-icons/fa";
import { FaFaceLaughSquint, FaFaceSurprise, FaCirclePlus, FaRegFaceSmile } from "react-icons/fa6";
import MessageOption from "./MessageOption";

interface MessageOptionsProps {
  className?: string,
  messageId: string,
}

const MessageOptions: React.FC<MessageOptionsProps> = ({ className, messageId }) => {
  const ellipsesOptions = [
    {
      text: "Reply",
      onClick: () => { },
    },
    {
      text: "Remove",
      onClick: () => { },
    },
    {
      text: "Pin",
      onClick: () => { },
    }
  ];

  const emojis = [
    {
      icon: <FaHeart size={30} color="#FF4033" />,
      reaction: "heart",
    },
    {
      icon: <FaFaceLaughSquint size={30} color="#FCDC34" />,
      reaction: "laugh",
    },
    {
      icon: <FaFaceSurprise size={30} color="#FCDC34" />,
      reaction: "wow"
    },
    {
      icon: <FaSadTear size={30} color="#FCDC34" />,
      reaction: "sad"
    },
    {
      icon: <FaAngry size={30} color="#FCDC34" />,
      reaction: "angry",
    },
    {
      icon: <FaThumbsUp size={30} color="#FCDC34" />,
      reaction: "thumbsup"
    },
  ];

  // TODO: Push reaction to database and display
  const addReaction = (messageId: string, reaction: string) => {

  };

  return (
    <div className={clsx(
      "flex text-gray-500",
      className,
    )}>
      <MessageOption
        icon={<FaEllipsisV />}
        hoverText="More"
      >
        <div className={clsx(
          "absolute bottom-[115%] left-1/2 transform -translate-x-1/2",
          "flex flex-col shadow-lg rounded-lg text-black"
        )}>
          {ellipsesOptions.map(option => (
            <div className="p-2 pr-16 m-1 rounded-lg hover:bg-gray-100 hover:cursor-pointer" onClick={option.onClick}>
              {option.text}
            </div>
          ))}
        </div>
      </MessageOption>

      <MessageOption
        icon={<FaReply />}
        hoverText="Reply"
      />

      <MessageOption
        icon={<FaRegFaceSmile />}
        hoverText="React"
      >
        <div className={clsx(
          "absolute bottom-[115%] left-1/2 transform -translate-x-1/2",
          "flex flex-row p-3 z-10 gap-2 shadow-lg bg-white rounded-full"
        )}>
          {emojis.map(emoji => (
            <span
              className="hover:cursor-pointer"
              onClick={() => addReaction(messageId, emoji.reaction)}
            >
              {emoji.icon}
            </span>
          ))}
          <FaCirclePlus size={30} className="rounded-full bg-gradient-radial from-black to-white" color="#E3E4E6" />
        </div>
      </MessageOption>
    </div>
  )
};

export default MessageOptions;
