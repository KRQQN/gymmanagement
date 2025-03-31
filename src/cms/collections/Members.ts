import { CollectionConfig } from 'payload/types';

const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'membershipType', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'membershipType',
      type: 'select',
      required: true,
      options: [
        { label: 'Basic', value: 'BASIC' },
        { label: 'Premium', value: 'PREMIUM' },
        { label: 'VIP', value: 'VIP' },
        { label: 'Family', value: 'FAMILY' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'ACTIVE',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
    },
  ],
};

export default Members; 