"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { SocialSignInButton } from "@/components/auth/SocialSignInButton";
import { EmailSignInForm } from "@/components/auth/EmailSignInForm";

interface MembershipSignUpProps {
  gymId: string;
  planId: string;
  planName: string;
  planPrice: number;
}

export function MembershipSignUp({ gymId, planId, planName, planPrice }: MembershipSignUpProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(`/gyms/${gymId}/memberships/checkout?planId=${planId}`);
    }
  }, [status, planId, router]);

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: `/gyms/${gymId}/memberships/checkout?planId=${planId}`,
      });
      
      if (result?.error) {
        toast({
          title: "Error",
          description: `Failed to sign in with ${provider}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: `/gyms/${gymId}/memberships/checkout?planId=${planId}`,
      });
      
      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Complete Your Membership
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in or create an account to continue with your {planName} membership
          </p>
          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="text-lg font-semibold">
              {planName} - ${planPrice}/month
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <SocialSignInButton
              provider="google"
              isLoading={isLoading}
              onClick={() => handleSocialSignIn("google")}
            />
            <SocialSignInButton
              provider="facebook"
              isLoading={isLoading}
              onClick={() => handleSocialSignIn("facebook")}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <EmailSignInForm
            isLoading={isLoading}
            onSubmit={handleEmailSignIn}
          />
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
} 