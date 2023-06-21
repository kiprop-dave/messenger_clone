"use client";

import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
  users?: User[];
}

export default function AvatarGroup({ users = [] }: AvatarGroupProps): JSX.Element {
  const firstThreeUsers = users?.map((user) => ({ id: user.id, image: user?.image })).slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    3: "bottom-0 right-0",
  };
  return (
    <div className="relative h-11 w-11">
      {firstThreeUsers?.map((user, i) => (
        <div
          key={user.id}
          className={`
            absolute inline-block
            rounded-full overflow-hidden
            h-[21px] w-[21px] ${positionMap[i as keyof typeof positionMap]}
          `}
        >
          <Image src={user.image || "/images/placeholder.png"} alt="avatar" fill />
        </div>
      ))}
    </div>
  );
}
