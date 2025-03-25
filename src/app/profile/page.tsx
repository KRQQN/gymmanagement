"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Mail, Calendar, Key } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
            <UserCircle className="h-16 w-16 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{session?.user?.name || "User"}</h1>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <UserCircle className="h-5 w-5" />
                <span>Name: {session?.user?.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>Email: {session?.user?.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>Member since: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
              >
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Membership Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Plan:</span>
                <span className="font-medium">Basic</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next Payment:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/membership")}
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 