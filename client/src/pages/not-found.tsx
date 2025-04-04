import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
            Go Back Home
          </span>
        </Link>
      </div>
    </div>
  );
}