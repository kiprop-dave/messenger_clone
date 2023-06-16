"use client";

import clsx from "clsx";
import EmptyState from "../components/EmptyState";
import useConverstion from "../hooks/useConversation";

export default function Conversations() {
  const { isOpen } = useConverstion();

  return (
    <div className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}>
      <EmptyState />
    </div>
  );
}
