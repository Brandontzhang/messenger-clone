import clsx from "clsx";
import { useState } from "react";

interface ConversationSearch {
  onChange: (event: any) => void,
}

const ConversationSearch: React.FC<ConversationSearch> = ({ onChange }) => {

  return (
    <div className="mb-2">
      <input
        placeholder="Search Messenger"
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className={clsx(
          "text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none",
          "placeholder:text-gray-400",
        )}
      />

    </div>
  )
};

export default ConversationSearch;
