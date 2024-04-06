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
} from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6"

interface SettingsOptionsProps {
  conversation: Conversation & {
    users: User[]
  },

}

const SettingsOptions: React.FC<SettingsOptionsProps> = ({ conversation }) => {

  const optionSections = [
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
          icon: <span>Aa</span>
        }
      ]
    },
    {
      title: "Group options",
      isGroupOption: true,
      options: [
        {
          title: "Require admin approval",
          text: "Require an admin to approve all requests to join the group chat"
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

  return (
    <div className="w-full">
      <ul className="flex flex-col w-full px-2">
        {optionSections.map(section => {
          const displaySection = (conversation.isGroup && section.isGroupOption) || !section.isGroupOption;
          if (displaySection) {
            return (
              <li
                key={section.title}
                className="flex flex-row justify-between items-center px-2 py-3 rounded-md hover:bg-slate-50 cursor-pointer">
                <span className="font-semibold text-sm">{section.title}</span>
                <FaChevronRight />
              </li>
            )
          } else {
            return null;
          }
        })}
      </ul>
    </div>
  )
};

export default SettingsOptions;
