"use client";

import axios from "axios";
import NewGroupMemberSearchInput from "./NewGroupMemberSearchInput";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { User } from "@prisma/client";
import Form from "@/app/conversations/[conversationId]/components/Form";

const NewState = () => {
  // TODO: Add new conversation box (can also be deleted), go to next conversation? previously opened... how does it even track that?
  const [query, setQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  const [userDropdown, setUserDropdown] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  useEffect(() => {
    // TODO: Query for users matching the search string
    if (query.length > 0) {
      axios.get(`/api/users`, {
        params: {
          query: query
        }
      }).then((data) => {
        const { data: users } = data;
        setUserDropdown(() => {
          const selectedIds = addedUsers.map(u => u.id);
          return users.filter((u: User) => !selectedIds.includes(u.id));
        });
      })
    }
  }, [query]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });

    // TODO: Add user to the current list to be added to conversation
  };

  const onChange = (event: any) => {
    setQuery(event.target.value);
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
      <Form />
    </div>
  )
}

export default NewState;
