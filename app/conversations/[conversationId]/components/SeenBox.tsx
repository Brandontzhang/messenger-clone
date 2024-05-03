'use client';
import Image from "next/image";

import { User } from "@prisma/client";

interface SeenProps {
  users?: User[]
}

const SeenBox: React.FC<SeenProps> = ({ users }) => {
  if (!users || users.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-row flex-end ml-auto gap-x-3 px-4 py-2">
      {users?.map(user => (
        <div key={user.id} className="relative inline-block rounded-full overflow-hidden h-4 w-4">
          <Image alt="Avatar" src={user?.image || '/images/placeholder.jpg'} fill />
        </div>
      ))}
    </div>
  )
};

export default SeenBox;
