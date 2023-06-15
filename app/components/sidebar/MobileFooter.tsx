"use client";

import useConverstion from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

export default function MobileFooter() {
  const routes = useRoutes();
  const { isOpen } = useConverstion();

  if (isOpen) return null;

  return (
    <div className="fixed flex justify-between w-full items-center bottom-0 z-40 bg-white border-t-[1px] lg:hidden">
      <nav className="flex justify-between w-full">
        <ul role="list" className="flex flex-row justify-between w-full">
          {routes.map((route, index) => (
            <MobileItem key={index} {...route} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
