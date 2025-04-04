/**
 * @author Mikiyas Birhanu And AI
 * @description Data table demo component showing pagination, sorting, and filtering
 */
'use client';

import { useState, useEffect } from 'react';
import { Table, Input, Button } from '@packages/ui';
import { Search } from 'lucide-react';

// Define the data structure for the table
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

// Sample data for demonstration - in a real application, this would come from an API
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2023-10-15T14:30:00',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '2023-10-14T09:15:00',
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    role: 'Editor',
    status: 'Inactive',
    lastActive: '2023-10-10T16:45:00',
  },
  {
    id: '4',
    name: 'Dave Brown',
    email: 'dave@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '2023-10-13T11:20:00',
  },
  {
    id: '5',
    name: 'Eve Davis',
    email: 'eve@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2023-10-15T10:30:00',
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'User',
    status: 'Inactive',
    lastActive: '2023-10-05T14:15:00',
  },
  {
    id: '7',
    name: 'Grace Wilson',
    email: 'grace@example.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2023-10-14T13:45:00',
  },
  {
    id: '8',
    name: 'Henry Garcia',
    email: 'henry@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '2023-10-12T09:30:00',
  },
  {
    id: '9',
    name: 'Ivy Chen',
    email: 'ivy@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2023-10-11T16:20:00',
  },
  {
    id: '10',
    name: 'Jack Rodriguez',
    email: 'jack@example.com',
    role: 'User',
    status: 'Inactive',
    lastActive: '2023-10-08T11:40:00',
  },
  {
    id: '11',
    name: 'Kelly Lee',
    email: 'kelly@example.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2023-10-13T14:10:00',
  },
  {
    id: '12',
    name: 'Liam Martinez',
    email: 'liam@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '2023-10-14T15:35:00',
  },
];

export default function DataTableDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Status badge renderer
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusClass = () => {
      switch (status) {
        case 'Active':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'Inactive':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
        {status}
      </span>
    );
  };

  // Table columns configuration
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Status',
      accessor: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      header: 'Last Active',
      accessor: (user: User) => formatDate(user.lastActive),
    },
  ];

  // Filter data based on search term
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      const filtered = demoUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page when search changes
      setIsLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchTerm('')}>
          Reset
        </Button>
      </div>

      <Table
        data={getCurrentPageData()}
        columns={columns}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        isLoading={isLoading}
        noResultsMessage="No users found. Try a different search term."
      />
    </div>
  );
}
