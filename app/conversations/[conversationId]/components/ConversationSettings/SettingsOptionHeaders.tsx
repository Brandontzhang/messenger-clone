import { Conversation, User } from "@prisma/client";

import {
  FaThumbtack,
  FaDotCircle,
  FaThumbsUp,
  FaPen,
  FaImage,
  FaUserPlus,
  FaRegImages,
  FaFileAlt,
  FaLink,
  FaBellSlash,
  FaExclamationTriangle,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6"
import SettingOption from "./SettingOption";
import { ReactNode, useState } from "react";
import clsx from "clsx";

interface SettingsOptionHeadersProps {
  conversation: Conversation & {
    users: User[]
  },
}

type OptionSections = {
  title: string,
  isGroupOption?: boolean,
  options: {
    title: string,
    icon?: ReactNode,
    text?: string,
    isGroupOption?: boolean,
  }[]
}

const SettingsOptionHeaders: React.FC<SettingsOptionHeadersProps> = ({ conversation }) => {
  const optionSections: OptionSections[] = [
    {
      title: "Chat Info",
      options: [
        {
          title: "View pinned messages",
          icon: <FaThumbtack />
        }
      ]
    },
    {
      title: "Customize Chat",
      options: [
        {
          title: "Change chat name",
          icon: <FaPen />
        },
        {
          title: "Change photo",
          icon: <FaImage />
        },
        {
          title: "Change theme",
          icon: <FaDotCircle />
        },
        {
          title: "Change icon",
          icon: <FaThumbsUp />
        },
        {
          title: "Edit nicknames",
          icon: <span className="text-[0.75rem] leading-none">Aa</span>
        }
      ]
    },
    // TODO: Handle no icons
    {
      title: "Group options",
      isGroupOption: true,
      options: [
        {
          title: "Require admin approval",
          text: "Require an admin to approve all requests to join the group chat",
          icon: <FaUserPlus />
        }
      ]
    },
    {
      title: "Chat members",
      isGroupOption: true,
      options: [
        {
          title: "Add people",
          icon: <FaUserPlus />
        }
      ]
    },
    {
      title: "Media, Files, and Links",
      options: [
        {
          title: "Media",
          icon: <FaRegImages />
        },
        {
          title: "Files",
          icon: <FaFileAlt />
        },
        {
          title: "Links",
          icon: <FaLink />
        }
      ]
    },
    {
      title: "Privacy and support",
      options: [
        {
          title: "Mute Notification",
          icon: <FaBellSlash />
        },
        {
          title: "Report",
          text: "Give feedback and report the conversation",
          icon: <FaExclamationTriangle />
        },
        {
          title: "Leave group",
          isGroupOption: true,
          icon: <FaArrowRightFromBracket />
        }
      ]
    }
  ]


  const [showSectionOptions, setShowSectionOptions] = useState(optionSections.map(section => false));

  return (
    <div className="w-full">
      <ul className="flex flex-col w-full px-2">
        {optionSections.map((section, index) => {
          const displaySection = (conversation.isGroup && section.isGroupOption) || !section.isGroupOption;
          if (displaySection) {
            return (
              <div key={section.title}>
                <li
                  key={section.title}
                  className="flex flex-row justify-between items-center px-2 py-3 rounded-md hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setShowSectionOptions(prev => {
                      const update = [...prev];
                      update[index] = !prev[index];
                      return update;
                    })
                  }}
                >
                  <span className="font-semibold text-sm">{section.title}</span>
                  {showSectionOptions[index]}
                  {showSectionOptions[index] ? <FaChevronDown /> : <FaChevronRight />}
                </li>
                <ul className={clsx(!showSectionOptions[index] && "hidden")}>
                  {section.options.map((option, index) => {
                    const displayOption = (conversation.isGroup && option.isGroupOption) || !option.isGroupOption;
                    if (!displayOption) {
                      return null;
                    }
                    return (
                      <li key={`${option.title} ${index}`} className="flex flex-col justify-center px-2 text-sm py-3 rounded-md hover:bg-slate-50 cursor-pointer">
                        <SettingOption title={option.title} icon={option.icon} text={option.text} />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          } else {
            return null;
          }
        })}
      </ul>
    </div>
  )
};

export default SettingsOptionHeaders;
