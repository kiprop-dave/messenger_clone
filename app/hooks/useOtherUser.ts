import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { ConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: ConversationType | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const userEmail = session?.data?.user?.email;

    return conversation.users.filter((user) => user.email !== userEmail)[0];
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
