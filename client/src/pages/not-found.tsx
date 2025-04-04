import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="mb-6">Sorry, the page you are looking for doesn't exist or has been moved.</p>
      <Link href="/">
        <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer">
          Go Home
        </span>
      </Link>
    </div>
  );
}