"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { cn } from "@/util/common";
import { useState } from "react";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import { FaXmark } from "react-icons/fa6";
import clsx from "clsx";

interface NewGroupMemberSearchInputProps {
  className?: string,
  users: User[],
  addedUsers: User[],
  onChange: (event: any) => void,
  addUser: (user: User) => void,
  removeUser: (user: User) => void,
}

const NewGroupMemberSearchInput: React.FC<NewGroupMemberSearchInputProps> = ({ className, users, addedUsers, onChange, addUser, removeUser }) => {
  const [displayOptions, setDisplayOptions] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className={clsx("flex flex-row w-full items-center gap-2", className)}>
      <label className='block text-gray-900' htmlFor='id'>To:</label>
      <ul className="flex flex-row gap-2 max-w-[50%] flex-wrap">
        {addedUsers.map(user => (
          <li
            key={user.id}
            className="flex flex-row items-center bg-gray-100 gap-1 p-1 rounded-md"
          >
            <span className="whitespace-nowrap">{user.name}</span>
            <span className="hover:cursor-pointer" onClick={() => removeUser(user)}><FaXmark /></span>
          </li>
        ))}
      </ul>

      <div className="relative">
        <input
          value={query}
          onFocus={() => setDisplayOptions(true)}
          onBlur={() => setDisplayOptions(false)}
          onChange={(event) => {
            onChange(event);
            setQuery(event.target.value);
          }}
          className={cn(
            "form-input border-0 focus:border-0 ring-0 focus:ring-0 block w-full rounded-md py-1.5 text-gray-900",
            "placeholder:text-gray-400",
          )}
        />
        <ul
          onClick={(event) => event.preventDefault()}
          className={cn(
            !displayOptions && "hidden",
            "absolute top-[115%] w-80 h-[30rem] bg-white border-2 rounded-md shadow-md overflow-y-scroll",
          )}
        >
          {users.map(user => (
            <li
              key={user.id}
              className="flex flex-row p-2 m-1 rounded-md items-center gap-3 hover:cursor-pointer hover:bg-gray-200"
              onMouseDown={(event) => {
                event.preventDefault();
                addUser(user)
                setQuery("");
              }}
            >
              <Avatar user={user} />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div >
  )
};

export default NewGroupMemberSearchInput;
