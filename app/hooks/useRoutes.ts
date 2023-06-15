import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useConverstion from "./useConversation";

const useRoutes = () => {
  const path = usePathname();

  const { converstionId } = useConverstion();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        isActive: path === "/conversations" || !!converstionId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        isActive: path === "/users",
      },
      {
        label: "Logout",
        href: "#",
        icon: HiArrowLeftOnRectangle,
        onClick: () => signOut(),
      },
    ],
    [path, converstionId]
  );

  return routes;
};

export default useRoutes;
