import useActiveList from "./useActiveList";
import { User } from "@prisma/client"

const useIsActive = (user: User): boolean => {
  const { members } = useActiveList();

  return members.indexOf(user.email!) !== -1;
};

export default useIsActive;
