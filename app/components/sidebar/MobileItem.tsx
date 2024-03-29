'use client';

import Link from "next/link";

import { cn } from "@/util/common";

interface MobileItemProps {
  href: string,
  label: string,
  icon: any,
  active?: boolean,
  onClick?: () => void
}

const MobileItem: React.FC<MobileItemProps> = ({ href, label, icon: Icon, active, onClick }) => {

  const handleClick = (() => {
    if (onClick) {
      return onClick();
    }
  });

  return (
    <Link href={href} onClick={handleClick} className={cn(
      "group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-400 hover:text-black hover:bg-gray-100",
      active && "bg-gray-100 text-black"
    )}>
      <Icon className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Link>
  )
}

export default MobileItem;
