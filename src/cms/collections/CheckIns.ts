import { CollectionConfig } from 'payload/types';

const CheckIns: CollectionConfig = {
  slug: 'check-ins',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['member', 'checkInTime', 'checkOutTime'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      required: true,
    },
    {
      name: 'checkInTime',
      type: 'date',
      required: true,
    },
    {
      name: 'checkOutTime',
      type: 'date',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};

export default CheckIns; 