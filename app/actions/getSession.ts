import { getServerSession } from "next-auth";
import { authOptions } from "@/app/libs/options";

const getSession = async () => {
  return getServerSession(authOptions);
}

export default getSession;
