"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClassService, type Class } from "@/lib/services/class.service";

interface GymWithClasses {
  id: string;
  name: string;
  classes: Class[];
}

const fetchGyms = async (gymId: string) => {
  const gymsResponse = await fetch(`/api/gyms`, { cache: "force-cache" });
  const gyms = await gymsResponse.json();
  return gyms.filter((gym: any) => gym.id !== gymId);
};

const ShowMoreClasses = ({ gymId }: { gymId: string }) => {
  const [gyms, setGyms] = useState<GymWithClasses[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showMore && gyms.length === 0) {
      setLoading(true);
      fetchGyms(gymId)
        .then(async (gymsData) => {
          const gymsWithClasses = await Promise.all(
            gymsData.map(async (gym: any) => {
              try {
                const response = await fetch(`/api/gyms/${gym.id}/classes`);
                if (!response.ok) {
                  throw new Error("Failed to fetch classes");
                }
                const data = await response.json();
                return {
                  ...gym,
                  classes: data.map((cls: any) => ({
                    ...cls,
                    schedule: typeof cls.schedule === 'string' ? JSON.parse(cls.schedule) : cls.schedule,
                  })),
                };
              } catch (error) {
                console.error(`Failed to fetch classes for gym ${gym.id}:`, error);
                return {
                  ...gym,
                  classes: [],
                };
              }
            })
          );
          setGyms(gymsWithClasses);
        })
        .catch((err) => {
          console.error("Failed to fetch gyms:", err);
          toast({
            title: "Error",
            description: "Failed to load gyms. Please try again later.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showMore, gymId, toast]);

  return (
    <div className="mt-8">
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-primary hover:text-primary/80 transition-colors text-lg font-bold"
        >
          {showMore ? "Hide Other Gyms' Classes" : "Show Other Gyms' Classes"}
        </button>
      </div>

      {showMore && (
        <div className="space-y-8">
          {loading ? (
            <div className="col-span-full text-center text-muted-foreground">
              Loading gyms and classes...
            </div>
          ) : (
            gyms.map((gym) => (
              <div key={gym.id} className="space-y-4">
                <h2 className="text-2xl font-bold text-white">{gym.name}</h2>
                {gym.classes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {gym.classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex flex-col rounded-lg border p-6 glass-effect"
                      >
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold">{cls.name}</h3>
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
                              {Array.isArray(cls.schedule) && cls.schedule.map((slot, index) => (
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
                              Instructor: {cls.instructor}
                            </p>
                          </div>
                        </div>

                        <Button
                          className="w-full mt-6"
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: "Cross-gym class booking feature will be available soon!",
                            });
                          }}
                        >
                          Book Class
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No classes available at this gym.</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ShowMoreClasses; 