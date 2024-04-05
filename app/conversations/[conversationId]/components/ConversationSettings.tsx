import clsx from "clsx";

interface ConversationSettingsProps {
  className?: string,
}

const ConversationSettings: React.FC<ConversationSettingsProps> = ({ className }) => {
  return (
    <div className={clsx(
      className,
      "right-0 top-0 bottom-0 w-[28rem] border-solid border-2",
    )}>
    </div>
  )
};

export default ConversationSettings;


