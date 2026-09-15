import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type AppTableFeatures,
  DataTable,
  DataTableColumnHeader,
} from '@/components/ui/data-table';
import DebouncedInput from '@/components/ui/debounced-input';
import MultiSelectPicker from '@/components/ui/multi-select-picker';
import { HStack } from '@/components/utilities';
import { PAGE_SIZE_OPTIONS } from '@/constant';
import type { Option } from '@/types';
import { formatDate } from '@/utils';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

type UserStatus = 'pending' | 'active' | 'suspended';
type UserRole = 'admin' | 'editor' | 'viewer';

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

const MOCK_USERS: DemoUser[] = [
  {
    id: 'USR-001',
    name: 'Alice Nguyen',
    email: 'alice.nguyen@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-12T08:30:00.000Z',
  },
  {
    id: 'USR-002',
    name: 'Brian Tran',
    email: 'brian.tran@example.com',
    role: 'editor',
    status: 'pending',
    createdAt: '2026-02-03T11:15:00.000Z',
  },
  {
    id: 'USR-003',
    name: 'Chloe Pham',
    email: 'chloe.pham@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2026-02-18T14:45:00.000Z',
  },
  {
    id: 'USR-004',
    name: 'David Le',
    email: 'david.le@example.com',
    role: 'editor',
    status: 'suspended',
    createdAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: 'USR-005',
    name: 'Emma Vo',
    email: 'emma.vo@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2026-03-22T16:20:00.000Z',
  },
  {
    id: 'USR-006',
    name: 'Frank Hoang',
    email: 'frank.hoang@example.com',
    role: 'admin',
    status: 'pending',
    createdAt: '2026-04-05T07:40:00.000Z',
  },
  {
    id: 'USR-007',
    name: 'Grace Dang',
    email: 'grace.dang@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2026-04-19T13:10:00.000Z',
  },
  {
    id: 'USR-008',
    name: 'Henry Bui',
    email: 'henry.bui@example.com',
    role: 'viewer',
    status: 'suspended',
    createdAt: '2026-05-02T10:55:00.000Z',
  },
  {
    id: 'USR-009',
    name: 'Ivy Do',
    email: 'ivy.do@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2026-05-28T18:05:00.000Z',
  },
  {
    id: 'USR-010',
    name: 'Jack Vu',
    email: 'jack.vu@example.com',
    role: 'viewer',
    status: 'pending',
    createdAt: '2026-06-11T12:25:00.000Z',
  },
  {
    id: 'USR-011',
    name: 'Kelly Ngo',
    email: 'kelly.ngo@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-07-04T15:35:00.000Z',
  },
  {
    id: 'USR-012',
    name: 'Liam Phan',
    email: 'liam.phan@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2026-07-20T08:50:00.000Z',
  },
  {
    id: 'USR-013',
    name: 'Mia Huynh',
    email: 'mia.huynh@example.com',
    role: 'viewer',
    status: 'suspended',
    createdAt: '2026-08-08T19:15:00.000Z',
  },
  {
    id: 'USR-014',
    name: 'Noah Cao',
    email: 'noah.cao@example.com',
    role: 'editor',
    status: 'pending',
    createdAt: '2026-08-25T06:05:00.000Z',
  },
  {
    id: 'USR-015',
    name: 'Olivia Mai',
    email: 'olivia.mai@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2026-09-10T17:40:00.000Z',
  },
];

const STATUS_OPTIONS: Option<string>[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
];

const getStatusVariant = (status: UserStatus): 'pending' | 'confirmed' | 'failed' => {
  if (status === 'active') return 'confirmed';
  if (status === 'pending') return 'pending';
  return 'failed';
};

const columns: ColumnDef<AppTableFeatures, DemoUser>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({ row }) => <span className='capitalize'>{row.original.role}</span>,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getStatusVariant(status)} className='capitalize'>
          {status}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({ row }) => formatDate(row.original.createdAt),
    enableSorting: true,
  },
];

function compareValues(a: string | number, b: string | number, desc: boolean) {
  if (a === b) return 0;
  if (a > b) return desc ? -1 : 1;
  return desc ? 1 : -1;
}

export function DemoTable() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    let result = MOCK_USERS.filter((user) => {
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(user.status);
      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });

    const sort = sorting[0];
    if (sort) {
      const { id, desc } = sort;
      result = [...result].sort((left, right) => {
        const leftValue = left[id as keyof DemoUser];
        const rightValue = right[id as keyof DemoUser];
        return compareValues(leftValue, rightValue, desc);
      });
    }

    return result;
  }, [searchValue, selectedStatuses, sorting]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount);

  const paginatedUsers = useMemo(() => {
    const start = (safePageIndex - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safePageIndex, pageSize]);

  const pagination = {
    pageIndex: safePageIndex,
    pageSize,
    pageCount,
    hasNext: safePageIndex < pageCount,
    hasPrev: safePageIndex > 1,
  };

  const handleSearchChange = (value: string | number) => {
    setSearchValue(String(value));
    setPageIndex(1);
  };

  const handleStatusChange = (value?: string[]) => {
    setSelectedStatuses(value ?? []);
    setPageIndex(1);
  };

  const handleSortingChange = (nextSorting: SortingState) => {
    setSorting(nextSorting);
    setPageIndex(1);
  };

  const handlePaginationChange = (page: number, nextPageSize: number, action: 'pagination' | 'limiting') => {
    if (action === 'limiting') {
      setPageSize(nextPageSize);
      setPageIndex(1);
      return;
    }
    setPageIndex(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-bold text-2xl'>Mock Users Data Table</CardTitle>
        <p className='text-muted-foreground'>
          Client-side search, status filter, sorting, and pagination on top of the shared DataTable (TanStack Table v9).
        </p>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={paginatedUsers}
          pagination={pagination}
          onSortingChange={handleSortingChange}
          onPaginationChange={handlePaginationChange}
        >
          <div className='mb-2'>
            <HStack spacing={12} className='flex-wrap'>
              <DebouncedInput
                placeholder='Search by id, name, email, role...'
                value={searchValue}
                onChange={handleSearchChange}
                className='h-10! w-60 md:w-80'
              />
              <MultiSelectPicker
                title='Status'
                options={STATUS_OPTIONS}
                value={selectedStatuses}
                onChange={handleStatusChange}
              />
            </HStack>
          </div>
        </DataTable>
      </CardContent>
    </Card>
  );
}
