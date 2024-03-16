import { cn } from "@/util/common";

import EmptyState from "../../components/EmptyState";

const Conversation = () => {
  return (
    <div classname={cn(
      "lg:pl-80 h-full lg:block"
    )}>
      <EmptyState />
    </div>
  )
};

export default Conversation;
