'use client';

import Link from "next/link";

import { cn } from "@/util/common";

interface DesktopItemProps {
  href: string,
  label: string,
  icon: any,
  active?: boolean,
  onClick?: () => void
}
const DesktopItem: React.FC<DesktopItemProps> = ({ href, label, icon: Icon, active, onClick }) => {
  const handleClick = ((e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (onClick) {
      return onClick();
    }
  })

  return (
    <li onClick={handleClick}>
      <Link href={href} className={cn(
        "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
        active && "bg-gray-100 text-black"
      )}>
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  )
}

export default DesktopItem;
