"use client";

import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <QueryProvider>
        <div className="relative min-h-screen flex flex-col text-white overflow-hidden">
          {/* Background base gradient */}
          <div className="background-base"></div>
          
          {/* Dot pattern overlay */}
          <div className="dot-pattern"></div>

          {/* Content */}
          <Navbar />
          <main className="content-wrapper container mx-auto px-4 py-8 relative z-10">
            {children}
          </main>
        </div>
        <Toaster />
      </QueryProvider>
    </AuthProvider>
  );
} 