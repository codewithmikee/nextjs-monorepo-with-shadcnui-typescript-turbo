import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to the App</h1>
      
      {user ? (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">User Profile</h2>
          <p className="mb-2">Logged in as: <span className="font-medium">{user.username}</span></p>
          <p className="mb-4">Email: {user.email}</p>
          <button
            onClick={() => logoutMutation.mutate()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="mb-4">You need to login to access all features.</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Feature 1</h2>
          <p>Description of feature 1 goes here.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Feature 2</h2>
          <p>Description of feature 2 goes here.</p>
        </div>
      </div>
    </div>
  );
}