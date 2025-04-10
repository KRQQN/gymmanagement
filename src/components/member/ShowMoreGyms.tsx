"use client";
import { useEffect, useState } from "react";

import GymInfo from "../gym/GymInfo";

const fetchGyms = async (gymId: string) => {
  const gymsResponse = await fetch(`/api/gyms`, { cache: "force-cache" });
  const gyms = await gymsResponse.json();
  return gyms.filter((gym: any) => gym.id !== gymId);
};

const ShowMoreGyms = ({ gymId }: { gymId: string }) => {
  const [gyms, setGyms] = useState<any[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (showMore && gyms.length === 0) {
      fetchGyms(gymId)
        .then(setGyms)
        .catch((err) => console.error("Failed to fetch gyms:", err));
    }
  }, [showMore, gymId]);

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowMore(!showMore)}
        className="text-primary hover:text-primary/80 transition-colors mb-6"
      >
        {showMore ? "Hide Other Gyms" : "Show Other Gyms"}
      </button>

      {showMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.length > 0 ? (
            gyms.map((gym) => (
              <GymInfo key={gym.id} gym={gym} />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              Loading gyms...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowMoreGyms;