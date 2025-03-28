"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
} 