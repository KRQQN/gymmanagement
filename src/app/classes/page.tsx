"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClassService, type Class } from "@/lib/services/class.service";

export default function ClassesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status === "unauthenticated") {
      console.log("Redirecting to sign in...");
      router.push("/auth/signin");
      return;
    }

    const fetchClasses = async () => {
      try {
        console.log("Fetching classes...");
        const fetchedClasses = await ClassService.getAllClasses();
        console.log("Fetched classes:", fetchedClasses);
        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
          console.log("Unauthorized error, redirecting to sign in...");
          router.push("/auth/signin");
          return;
        }
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      console.log("Authenticated, fetching classes...");
      fetchClasses();
    }
  }, [status, router, toast]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Gym Classes</h1>
        <p className="mt-2 text-muted-foreground">
          Join our diverse range of fitness classes led by expert instructors
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col rounded-lg border bg-card p-6"
          >
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{cls.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cls.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {cls.category} • {cls.difficulty}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {cls.bookedSpots}/{cls.capacity} spots
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Schedule</h3>
                <ul className="space-y-1">
                  {cls.schedule.map((slot, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {slot.day} at {slot.time}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Equipment Needed</h3>
                <ul className="space-y-1">
                  {cls.equipment.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Requirements</h3>
                <ul className="space-y-1">
                  {cls.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Instructor: {cls.instructor.name}
                </p>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Class booking feature will be available soon!",
                });
              }}
            >
              Book Class
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 