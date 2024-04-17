import { ReactNode } from "react";

interface SettingOptionsProps {
  title: string,
  text?: string,
  icon?: ReactNode,
}

const SettingOption: React.FC<SettingOptionsProps> = ({ title, text, icon }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="rounded-full p-2 bg-slate-200 leading-none">{icon}</span>
      <div className="flex flex-col">
        {title}
        <span className="text-[0.75rem] font-light">{text}</span>
      </div>
    </div>
  )
};

export default SettingOption;
