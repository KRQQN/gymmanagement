import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Members from './collections/Members';
import CheckIns from './collections/CheckIns';
import Payments from './collections/Payments';
import MembershipPlans from './collections/MembershipPlans';
import Media from './collections/Media';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Gym Manager CMS',
    },
    components: {
      // Add custom dashboard components here if needed
    },
  },
  collections: [
    Users,
    Members,
    CheckIns,
    Payments,
    MembershipPlans,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
}); 