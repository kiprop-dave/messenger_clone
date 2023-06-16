"use client";
import { ConversationType } from "@/app/types";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, Conversation, Message } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";

interface ConversationBoxProps {
  conversation: ConversationType;
  isSelected?: boolean;
}

export default function ConversationBox({ conversation }: ConversationBoxProps) {
  const otherUser = useOtherUser(conversation);
  const router = useRouter();
  const session = useSession();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [conversation.id, router]);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  }, [conversation.messages]);

  const userEmail = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) return false;
    return lastMessage.seen.some((user) => user.email === userEmail);
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (!lastMessage) return "Start a conversation";
    if (lastMessage && lastMessage["image"]) return "Sent an image";
    return lastMessage["body"] ?? "Start a conversation";
  }, [lastMessage]);

  return (
    <div
      className={clsx(
        "relative flex items-center space-x-3 py-1 pl-1 hover:bg-neutral-100 rounded-lg cursor-pointer transition md:h-14 h-11"
      )}
      onClick={handleClick}
    >
      <Avatar user={otherUser} />
      <div className="py-1 pl-1 w-full h-full rounded-md">
        <div className="flex items-center justify-between w-full">
          <p className="text-md font-medium">{conversation?.name || otherUser?.name}</p>
          <p className="text-sm text-gray-500">
            {lastMessage && (new Date(lastMessage?.createdAt), "p")}
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-gray-500">{lastMessageText}</p>
          {!hasSeen && lastMessage && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
        </div>
      </div>
    </div>
  );
}