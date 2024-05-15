import clsx, { ClassValue } from "clsx";
import { twMerge } from "tw-merge";

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(args));
}
