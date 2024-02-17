import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

const getSession = async () => {
  return getServerSession(authOptions);
}

export default getSession;
