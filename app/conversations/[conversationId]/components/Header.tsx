"use client";

import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useIsActive from "@/app/hooks/useIsActive";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export default function Header({ conversation }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const otherUser = useOtherUser(conversation);
  const isActive = useIsActive(otherUser);
  const statusText = useMemo(() => {
    if (conversation.isGroup) return `${conversation.users.length} members`;

    return isActive ? "Active now" : "offline";
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        conversation={conversation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <div className="bg-white flex items-center justify-between px-4 py-3 w-full lg:px-6 border-b-[1px] shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="lg:hidden cursor-pointer text-sky-500 hover:text-sky-600 transition"
          >
            <HiChevronLeft size={32} />
          </Link>
          {
            conversation.isGroup ?
              (
                <AvatarGroup users={conversation.users} />
              ) : (
                <Avatar user={otherUser} />
              )
          }
          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">{statusText}</div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          className="text-sky-500 cursor-pointer hover:text-sky-600"
          onClick={() => {
            setIsDrawerOpen(true);
          }} // implement profile drawer
        />
      </div>
    </>
  );
}
