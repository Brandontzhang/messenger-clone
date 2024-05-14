"use client";

import axios from "axios";
import NewGroupMemberSearchInput from "./NewGroupMemberSearchInput";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Conversation, User } from "@prisma/client";
import Form from "@/app/conversations/[conversationId]/components/Form";
import { FieldValues } from "react-hook-form";

interface NewStateProps {
  currentUser: User,
}

const NewState: React.FC<NewStateProps> = ({ currentUser }) => {
  // TODO: Add new conversation box (can also be deleted), go to next conversation? previously opened... how does it even track that?
  const [query, setQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  const [userDropdown, setUserDropdown] = useState<User[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (query.length > 0) {
      axios.get(`/api/users`, {
        params: {
          query: query
        }
      }).then((data) => {
        const { data: users } = data;
        setUserDropdown(() => {
          const selectedIds = addedUsers.map(u => u.id);
          return users.filter((u: User) => !selectedIds.includes(u.id) && u.id !== currentUser.id);
        });
      })
    }
    // TODO: On selecting a person, wipe out the drop down as well
  }, [query]);

  const onChange = (event: any) => {
    setQuery(event.target.value);
  }

  // TODO: After creating the new conversation, also send the message
  const addNewConversation = async (data: FieldValues) => {
    const { data: conversation }: { data: Conversation } = await axios.post("/api/conversations", {
      ...data,
      userId: currentUser.id,
      isGroup: addedUsers.length > 1,
      members: [...addedUsers],
    });

    router.push(`/conversations/${conversation.id}`);
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <NewGroupMemberSearchInput
          onChange={onChange}
          users={userDropdown}
          addedUsers={addedUsers}
          addUser={(user: User) => {
            setAddedUsers(current => [...current, user])
            setUserDropdown(current => current.filter(u => u.id !== user.id))
          }}
          removeUser={(user: User) => { setAddedUsers(current => current.filter(u => u.id !== user.id)) }}
        />
      </div>
      <div className="h-full" />
      <Form
        addNewConversation={addNewConversation}
      />
    </div>
  )
}

export default NewState;
