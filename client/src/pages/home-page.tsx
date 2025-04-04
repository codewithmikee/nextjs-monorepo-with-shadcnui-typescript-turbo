import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: 'Logged out successfully',
          variant: 'success',
        });
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Home Page</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Username:</div>
            <div>{user?.username}</div>
            <div className="font-medium">Display Name:</div>
            <div>{user?.displayName || 'Not set'}</div>
            <div className="font-medium">Email:</div>
            <div>{user?.email}</div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
          <p className="mb-4">
            This is a protected page that can only be accessed by authenticated users.
          </p>
          <p>
            You can customize this page to display user-specific content, data visualizations,
            or application features.
          </p>
        </div>
      </div>
    </div>
  );
}