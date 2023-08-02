"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" themes={["light", "dark"]}>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
