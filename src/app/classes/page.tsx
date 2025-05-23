'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ClassService, type Class } from '@/lib/services/class.service';
import ShowMoreGyms from '@/components/member/ShowMoreGyms';
import ShowMoreClasses from '@/components/member/ShowMoreClasses';
import { GymService } from '@/lib/services/gym.service';
import { Gym, GymClass } from '@prisma/client';

type ScheduleSlot = {
  day: string;
  time: string;
};

type GymClassWithGym = GymClass & {
  gym: Gym;
  schedule: ScheduleSlot[];
};

type GymWithClasses = Gym & {
  classes: GymClassWithGym[];
};

export default function ClassesPage({
  params
}: {
  params: Promise<{ gymId: string }>;
}) {
  const { gymId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [gyms, setGyms] = useState<GymWithClasses[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const f = await fetch(`/api/gyms?includeClasses=true`);
        const fetchedClasses = await f.json();

        setGyms(fetchedClasses);
      } catch (error) {
        console.error('Error fetching classes:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
          console.log('Unauthorized error, redirecting to sign in...');
          router.push('/auth/signin');
          return;
        }
        toast({
          title: 'Error',
          description: 'Failed to load classes. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [status, router, toast]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (gyms.length < 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">No classes found for {gymId}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Available Gym Classes</h1>
        <p className="mt-2 text-muted-foreground">
          Choose from our diverse range of fitness classes led by expert instructors
        </p>
      </div>

      {gyms.map((gym) => (
        <div className="container mx-auto px-4 " key={gym.id}>
          <h1 className="text-3xl font-bold ml-2">{gym.name}</h1>
          <p className="text-muted-foreground mb-5 ml-2">{gym.address}</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gym.classes.map((cls) => (
              <div
                key={cls.id}
                className="flex flex-col rounded-lg border  p-6 glass-effect"
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
                      Instructor: {cls.instructor}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={() => {
                    toast({
                      title: 'Coming Soon',
                      description: 'Class booking feature will be available soon!'
                    });
                  }}
                >
                  Book Class
                </Button>
              </div>
            ))}
          </div>
            <hr className="my-10 glass-effect" />
        </div>
      ))}
      {/* //TODO: Use if loged in */}
      {/* <ShowMoreClasses gymId={gymId} /> */}
    </div>
  );
}
