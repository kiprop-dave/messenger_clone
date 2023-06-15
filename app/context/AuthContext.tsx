"use client";

import { SessionProvider } from "next-auth/react";

interface AuthContextprops {
  children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextprops) {
  return <SessionProvider>{children}</SessionProvider>;
}
