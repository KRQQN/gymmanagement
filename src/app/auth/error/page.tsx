"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    OAuthAccountNotLinked: "This email is already registered with a different sign-in method. Please sign in with your email and password.",
    OAuthCallback: "There was a problem with the Google sign-in. Please try again or use email sign-in.",
    Default: "An error occurred during authentication. Please try again.",
  };

  const errorMessage = error ? errorMessages[error as keyof typeof errorMessages] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
        </div>

        <div className="grid gap-4">
          <Button asChild>
            <Link href="/auth/signin">
              Try Again
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 