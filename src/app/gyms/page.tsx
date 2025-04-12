import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ShowMoreGyms from '@/components/member/ShowMoreGyms';
import GymInfo from '@/components/gym/GymInfo';
import ShowMoreMemberships from '@/components/member/ShowMoreMemberships';
import RenderMemberships from '@/components/member/ShowMoreMemberships';
import { GymService } from '@/lib/services/gym.service';


export default async function Gyms() {
  const session = await getServerSession(authOptions);
  const gymId = session?.user.gymId;

  const gymss = await GymService.getGyms();

  const t = gymss.map((gym) => {})


  //if (userMemberAt.length === 1) redirect(`/gyms/${gyms[0].id}/${type}`);

  return (
    <div className="container mx-auto px-4 py-8">
      

        <h1 className='text-white text-2xl font-bold mb-4 ml-2'>Memberships</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {gyms.map((gym) => (
          <GymInfo key={gym.id} gym={gym} />
        ))}
      </div> */}
        <RenderMemberships excludeGymId={gymId || ""} />
      
      {/* <ShowMoreGyms gymId={gymId || ""} /> */}

      
    </div>
  );
}


