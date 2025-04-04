/**
 * @author Mikiyas Birhanu And AI
 * @description API Demo component showcasing React Query
 */
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table } from '@packages/ui';
import { defaultApiClient } from '@packages/libs';

// Types for the demo
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function ApiDemo() {
  const [userId, setUserId] = useState('');
  const [postId, setPostId] = useState('');
  
  // Query for users
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    enabled: true, // Auto-fetch on mount
  });

  // Query for posts by user id
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery<Post[]>({
    queryKey: ['posts', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    },
    enabled: !!userId, // Only fetch when userId is provided
  });

  // Query for single post details
  const {
    data: postDetails,
    isLoading: postDetailsLoading,
    error: postDetailsError,
  } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) throw new Error('No post ID provided');
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
      return response.json();
    },
    enabled: !!postId, // Only fetch when postId is provided
  });

  // Handle user selection
  const handleUserSelect = (id: number) => {
    setUserId(id.toString());
    setPostId(''); // Reset post selection when user changes
  };

  // Handle post selection
  const handlePostSelect = (id: number) => {
    setPostId(id.toString());
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Users</h2>
          <Button
            onClick={() => refetchUsers()}
            variant="outline"
            disabled={usersLoading}
          >
            {usersLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {usersError ? (
          <div className="p-4 border rounded-md bg-red-50 text-red-700">
            Error loading users: {(usersError as Error).message}
          </div>
        ) : (
          <Table
            data={users || []}
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Username', accessor: 'username' },
              { header: 'Email', accessor: 'email' },
              {
                header: 'Actions',
                accessor: (user: User) => (
                  <Button
                    onClick={() => handleUserSelect(user.id)}
                    variant="outline"
                    size="sm"
                  >
                    View Posts
                  </Button>
                ),
              },
            ]}
            isLoading={usersLoading}
          />
        )}
      </section>

      {userId && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Posts by User {users?.find(u => u.id.toString() === userId)?.name || userId}
            </h2>
            <Button
              onClick={() => refetchPosts()}
              variant="outline"
              disabled={postsLoading}
            >
              {postsLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {postsError ? (
            <div className="p-4 border rounded-md bg-red-50 text-red-700">
              Error loading posts: {(postsError as Error).message}
            </div>
          ) : (
            <Table
              data={posts || []}
              columns={[
                { header: 'Title', accessor: 'title' },
                {
                  header: 'Body',
                  accessor: (post: Post) => (
                    <div className="truncate max-w-md">{post.body}</div>
                  ),
                },
                {
                  header: 'Actions',
                  accessor: (post: Post) => (
                    <Button
                      onClick={() => handlePostSelect(post.id)}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                  ),
                },
              ]}
              isLoading={postsLoading}
            />
          )}
        </section>
      )}

      {postId && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Post Details</h2>

          {postDetailsError ? (
            <div className="p-4 border rounded-md bg-red-50 text-red-700">
              Error loading post details: {(postDetailsError as Error).message}
            </div>
          ) : postDetailsLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : postDetails ? (
            <Card>
              <CardHeader>
                <CardTitle>{postDetails.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{postDetails.body}</p>
              </CardContent>
            </Card>
          ) : null}
        </section>
      )}

      <section className="space-y-4 pt-8 border-t">
        <h2 className="text-lg font-semibold">API Configuration</h2>
        <div className="bg-muted p-4 rounded-md overflow-x-auto">
          <pre className="text-sm">
            {`// Using ApiClient from @packages/libs
const apiClient = defaultApiClient;

// Example GET request
apiClient.get<User[]>('/users')
  .then(response => {
    if (response.success && response.data) {
      // Handle successful response
      console.log(response.data);
    } else {
      // Handle error
      console.error(response.error);
    }
  });

// Example POST request with validation
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

apiClient.requestWithValidation('POST', '/users', userSchema, {
  name: 'John Doe',
  email: 'john@example.com',
})
  .then(validatedUser => {
    // This user is validated against the schema
    console.log(validatedUser);
  })
  .catch(error => {
    console.error(error);
  });`}
          </pre>
        </div>
      </section>
    </div>
  );
}
