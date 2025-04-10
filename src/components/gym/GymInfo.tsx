"use client"
import { Mail, MapPin, Phone, Users, Dumbbell } from "lucide-react";
import Link from "next/link";

interface Gym {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  _count?: {
    users: number;
    classes: number;
  };
}

const GymInfo = ({ gym }: { gym: Gym }) => {
  return (
    <Link
      href={`/gyms/${gym.id}/`}
      key={gym.id}
      className="block w-full h-full"
    >
      <div className="group h-full p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
            {gym.name}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="h-4 w-4" />
            <span>{gym._count?.users || 0}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm line-clamp-2">{gym.address}</span>
          </div>
          {gym.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{gym.phone}</span>
            </div>
          )}
          {gym.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{gym.email}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Dumbbell className="h-4 w-4" />
            <span className="text-sm">{gym._count?.classes || 0} Classes</span>
          </div>
          <span className="text-sm text-primary group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default GymInfo;