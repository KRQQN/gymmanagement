"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold text-xl text-white">
          &lt;your gym&gt;
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/gyms?type=classes">
            <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-secondary">
              Classes
            </Button>
          </Link>
          <Link href="/gyms?type=memberships">
            <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-secondary">
              Memberships
            </Button>
          </Link>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/20 hover:bg-primary/40 p-0 overflow-hidden">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name?.[0]?.toUpperCase() || "U"}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white text-base font-medium">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-effect border-white/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                
                {session.user?.role === "ADMIN" 
                ? (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/5">Admin Panel</DropdownMenuItem>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/5">Dashboard</DropdownMenuItem>
                  </Link>
                )}
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5">Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer hover:bg-white/5"
                  onClick={() => signOut()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-secondary">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button>
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 