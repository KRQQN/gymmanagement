import { CollectionConfig } from 'payload/types';

const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['member', 'amount', 'status', 'paymentDate'],
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
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'COMPLETED',
      options: [
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Refunded', value: 'REFUNDED' },
      ],
    },
    {
      name: 'paymentDate',
      type: 'date',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Credit Card', value: 'CREDIT_CARD' },
        { label: 'Debit Card', value: 'DEBIT_CARD' },
        { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
        { label: 'Cash', value: 'CASH' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};

export default Payments; 