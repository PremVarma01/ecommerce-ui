'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellActions } from './cell-actions';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  name: string;
  category: string;
  sizes: any;
  colors: any;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived',
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'sizes',
    header: 'Size',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <span>
          {row.original.sizes.map((size: any) => size.value).toString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'colors',
    header: 'Color',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colors.map((color: any) => (
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
