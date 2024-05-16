"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { FullConversationType, FullMessageType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import { User } from "@prisma/client";
import { FaEdit } from "react-icons/fa";
import { pusherClient } from "@/app/libs/pusher";
import ConversationSearch from "./ConversationSearch";
import axios from "axios";

interface ConversationListProps {
  initialItems: FullConversationType[],
  currentUser: User,
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, currentUser }) => {
  const [conversations, setConversations] = useState(initialItems);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  useEffect(() => {
    pusherClient.subscribeAll();
    pusherClient.bind_global((event: string, data: { conversation: FullConversationType, message: FullMessageType }) => {
      const { conversation } = data;
      switch (event) {
        case "conversation:update":
          newConversationUpdateHandler(conversation);
          break;
        default:
          return
      }
    });

    return () => {
      pusherClient.unbind_global();
    }
  }, [conversations]);

  useEffect(() => {
    if (query.length > 0) {
      axios.get(`/api/conversations`, {
        params: {
          query: query
        }
      }).then((data) => {
        const { data: conversations } = data;
        console.log(data);
        setConversations(conversations);
      });
    }
  }, [query]);

  const newConversationUpdateHandler = (conversation: FullConversationType) => {
    const existingConversastion = conversations.find(conv => conv.id === conversation.id);

    if (existingConversastion) {
      return;
    }

    setConversations((current) => [conversation, ...current]);
  };

  return (
    <aside className={clsx(
      "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
      isOpen ? "hidden" : "block w-full left-0"
    )}>
      <div className="px-5">
        <div className="flex justify-between mb-2 pt-4">
          <div className="text-2xl font-bold text-neutral-800">
            Chat
          </div>
          <div
            className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            onClick={() => router.push('/conversations/new')}
          >
            <FaEdit size={20} />
          </div>
        </div>
        <ConversationSearch onChange={setQuery} />
        {conversations.map((conversation) => (
          <ConversationBox
            key={conversation.id}
            data={conversation}
            selected={conversationId === conversation.id}
            currentUser={currentUser}
          />
        ))}
      </div>
    </aside>
  )
};

export default ConversationList;
