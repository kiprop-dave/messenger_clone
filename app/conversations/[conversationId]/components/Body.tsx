"use client";

import { useState, useRef, useEffect } from "react";
import { MessageType } from "@/app/types";
import { User } from "@prisma/client";
import useConverstion from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import axios from "axios";

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

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, i) => (
        <MessageBox key={msg.id} message={msg} isLastMessage={i === messages.length - 1} />
      ))}
      <div ref={latestMessageRef} className="pt-10" />
    </div>
  );
}
