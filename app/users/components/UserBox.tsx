"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Avatar from "@/app/components/Avatar";

interface UserBoxProps {
  user: User;
}

export default function UserBox({ user }: UserBoxProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);

    axios
      .post("/api/conversations", { userId: user.id })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [user, router]);

  return (
    <div
      className="flex items-center h-14 cursor-pointer space-x-3 p-3 hover:bg-neutral-100 transition"
      onClick={handleClick}
    >
      <Avatar user={user} />
      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
    </div>
  );
}
