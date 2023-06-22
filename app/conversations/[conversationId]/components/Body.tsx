"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageType } from "@/app/types";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";
import useConverstion from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";

interface BodyProps {
  initialMessages: MessageType[];
  currentUser: User | null;
}

export default function Body({ initialMessages, currentUser }: BodyProps): JSX.Element {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConverstion();

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length && messages.at(-1)?.seen.some((user) => user.id === currentUser?.id)) {
      return;
    }
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });

    const newMessageHandler = (newMessage: MessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) return prev;

        return [...prev, newMessage];
      })

      latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const updateMessageHandler = (updatedMessage: MessageType) => {
      setMessages((prev) => prev.map((msg) => msg.id === updatedMessage.id ? updatedMessage : msg));
    }

    pusherClient.bind("messages:new", newMessageHandler);
    pusherClient.bind("messages:updated", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", newMessageHandler);
      pusherClient.unbind("messages:updated,updateMessageHandler");
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, i) => (
        <MessageBox key={msg.id} message={msg} isLastMessage={i === messages.length - 1} />
      ))}
      <div ref={latestMessageRef} className="pt-10" />
    </div>
  );
}
