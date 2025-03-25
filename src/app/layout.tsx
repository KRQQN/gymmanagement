import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "<your gym>",
  description: "Manage your gym membership and classes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
