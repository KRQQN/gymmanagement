import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ShowMoreGyms from '@/components/member/ShowMoreGyms';
import GymInfo from '@/components/gym/GymInfo';


export default async function Gyms({
  searchParams
}: {
  searchParams: { type: string };
}) {
  const session = await getServerSession(authOptions);
  const gymId = session?.user.gymId;
  const { type } = searchParams;

  const userMemberAt = await prisma.gym.findMany({
    where: {
      id: gymId
    },
    include: {
      classes: true,
      _count: {
        select: {
          users: true,
          classes: true
        }
      }
    }
  });

  


  //if (userMemberAt.length === 1) redirect(`/gyms/${gyms[0].id}/${type}`);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Choose a gym</h1>
        <p className="text-muted-foreground">
          Select a gym to view its memberships and services
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search gyms..."
            className="w-full h-10 pl-10 pr-4 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select className="h-10 px-4 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="members">Most Members</option>
          <option value="classes">Most Classes</option>
        </select>
      </div>

        <h1 className='text-white text-2xl font-bold mb-4 ml-2'>Your Memberships</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {userMemberAt.map((gym) => (
          <GymInfo key={gym.id} gym={gym} />
        ))}
      </div>
      
      <ShowMoreGyms gymId={gymId || ""} />

      
    </div>
  );
}


