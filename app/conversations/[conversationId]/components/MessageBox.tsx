"use client";

import { useSession } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";
import { MessageType } from "@/app/types";
import Avatar from "@/app/components/Avatar";
import format from "date-fns/format";
import ImageModal from "./ImageModal";
import { useState } from "react";

interface MessageBoxProps {
  message: MessageType;
  isLastMessage: boolean;
}

export default function MessageBox({ message, isLastMessage }: MessageBoxProps): JSX.Element {
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const session = useSession();

  const isOwnMessage = message?.sender?.email === session?.data?.user?.email;
  const seenBy = (message.seen ?? [])
    .filter((user) => user?.email !== session?.data?.user?.email)
    .map((user) => user.name)
    .join(", ");

  const messageContainerClass = clsx("flex, gap-2 p-4", isOwnMessage && "justify-end");
  const avatar = clsx("w-11", isOwnMessage && "order-2");
  const messageBodyContainer = clsx("flex flex-col gap-2", isOwnMessage && "items-end");
  const imageMessage = clsx(
    "text-sm w-fit overflow-hidden",
    isOwnMessage ? "bg-sky-500 text-white" : "bg-gray-100",
    message.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <>
      <ImageModal src={message.image!} onClose={() => setImageModalOpen(false)} isOpen={imageModalOpen} />
      <div className={messageContainerClass}>
        <div className={avatar}>{!isOwnMessage && <Avatar user={message.sender} />}</div>
        <div className={messageBodyContainer}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">{!isOwnMessage && message.sender.name}</div>
            <div className="text-xs text-gray-400">
              {format(new Date(message.createdAt), "dd/MM/yyyy HH:mm")}
            </div>
          </div>
          <div className={imageMessage}>
            {message.image ? (
              <Image
                alt="image"
                src={message.image}
                height={250}
                width={250}
                className="cursor-pointer object-cover hover:scale-110 transition"
                onClick={() => setImageModalOpen(true)}
              />
            ) : (
              <div>{message.body}</div>
            )}
          </div>
          {isLastMessage && isOwnMessage && seenBy.length > 0 && (
            <div className="text-xs text-gray-400 font-light">{`Seen by ${seenBy}`}</div>
          )}
        </div>
      </div>
    </>
  );
}
