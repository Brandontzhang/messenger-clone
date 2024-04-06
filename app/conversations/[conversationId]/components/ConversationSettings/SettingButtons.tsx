import { FaFacebook, FaBell, FaSearch } from "react-icons/fa";

interface SettingButtonsProps {

}

const SettingButtons: React.FC<SettingButtonsProps> = () => {
  return (
    <div className="flex flex-row justify-around w-1/2 m-4 gap-10">
      <div className="flex flex-col justify-center items-center gap-3">
        <FaFacebook
          className="rounded-full outline outline-slate-200 outline-8 bg-slate-200 cursor-pointer"
          size={20}
          onClick={() => { }}
        />
        <span className="font-light text-sm">Profile</span>
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <FaBell
          className="rounded-full outline outline-slate-200 outline-8 bg-slate-200 cursor-pointer"
          size={20}
          onClick={() => { }}
        />
        <span className="font-light text-sm">Mute</span>
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <FaSearch
          className="rounded-full outline outline-slate-200 outline-8 bg-slate-200 cursor-pointer"
          size={20}
          onClick={() => { }}
        />
        <span className="font-light text-sm">Search</span>
      </div>
    </div>
  )
};

export default SettingButtons;
