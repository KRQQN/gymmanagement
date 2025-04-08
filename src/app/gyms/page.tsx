import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from 'next/headers';

export default async function Gyms({ searchParams }: { searchParams: Promise<{ type: string }> }) {
  const { type } = await searchParams;
  const gyms = await prisma.gym.findMany();

  if (gyms.length === 1) redirect(`/gyms/${gyms[0].id}/${type}`);

  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Our Gyms</h1>
        <p className="text-muted-foreground">Select a gym to view its memberships and services</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {gyms.map((gym) => (
          <Link 
            href={`/gyms/${gym.id}/${type}`}
            key={gym.id}
            className=" group card glass-effect"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                {gym.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                View memberships and services
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
