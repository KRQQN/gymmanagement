import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "&lt;your gym&gt; Gym",
  description: "Modern gym management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <div className="relative min-h-screen flex flex-col bg-background text-foreground">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
