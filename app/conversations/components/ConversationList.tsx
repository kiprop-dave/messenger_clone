"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { User } from "@prisma/client";
import { MdOutlineGroupAdd } from "react-icons/md";
import { pusherClient } from "@/app/libs/pusher";
import useConverstion from "@/app/hooks/useConversation";
import { ConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "@/app/components/modals/GroupChatModal";

interface ConversationListProps {
  users: User[];
  initialConvs: ConversationType[];
}

export default function ConversationList({ users, initialConvs }: ConversationListProps) {
  const [conversations, setConversations] = useState(initialConvs);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();
  const { isOpen, conversationId } = useConverstion();

  const pusherChannel = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherChannel) return;
    pusherClient.subscribe(pusherChannel);

    const newConversationHandler = (newConversation: ConversationType) => {
      setConversations((prev) => {
        if (prev.some((conv) => conv.id === newConversation.id)) return prev;
        return [newConversation, ...prev];
      })
    };

    const updatedMessageHandler = (updatedConversation: ConversationType) => {
      setConversations((prev) => prev.map((conv) => {
        if (conv.id === updatedConversation.id) {
          return {
            ...conv,
            messages: updatedConversation.messages
          }
        }
        return conv;
      }))
    };

    const deleteConversationHandler = (deletedConversation: ConversationType) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== deletedConversation.id));
      if (conversationId === deletedConversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newConversationHandler);
    pusherClient.bind("conversation:updated", updatedMessageHandler);
    pusherClient.bind("conversation:delete", deleteConversationHandler);

    return () => {
      pusherClient.unsubscribe(pusherChannel);
      pusherClient.unbind("conversation:new", newConversationHandler);
      pusherClient.unbind("conversation:updated", updatedMessageHandler);
      pusherClient.unbind("conversation:delete", deleteConversationHandler);
    }
  }, [pusherChannel, router, conversationId]);
  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0",
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5 flex flex-col">
          <div className="my-2 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900">Messages</h3>
            <div className="text-gray-600 cursor-pointer rounded-full hover:opacity-75 p-2 bg-gray-100" onClick={() => setIsModalOpen(true)}>
              <MdOutlineGroupAdd />
            </div>
          </div>
          {conversations.map((conv) => (
            <ConversationBox key={conv.id} conversation={conv} />
          ))}
        </div>
      </aside>
    </>
  );
}
