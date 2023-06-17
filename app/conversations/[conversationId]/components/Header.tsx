"use client";

import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { useMemo } from "react";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export default function Header({ conversation }: HeaderProps) {
  const otherUser = useOtherUser(conversation);

  const statusText = useMemo(() => {
    if (conversation.isGroup) return `${conversation.users.length} members`;

    return "Active now"; // TODO: implement active status
  }, [conversation]);

  return (
    <div className="bg-white flex items-center justify-between px-4 py-3 w-full lg:px-6 border-b-[1px] shadow-sm">
      <div className="flex items-center gap-3">
        <Link
          href="/conversations"
          className="lg:hidden cursor-pointer text-sky-500 hover:text-sky-600 transition"
        >
          <HiChevronLeft size={32} />
        </Link>
        <Avatar user={otherUser} />
        <div className="flex flex-col">
          <div>{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500">{statusText}</div>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        className="text-sky-500 cursor-pointer hover:text-sky-600"
        onClick={() => {}} // implement profile drawer
      />
    </div>
  );
}
