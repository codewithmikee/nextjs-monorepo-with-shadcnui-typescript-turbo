import Head from 'next/head';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: 'Success!',
      description: 'This is a success toast notification.',
      variant: 'success',
    });
  };

  const showErrorToast = () => {
    toast({
      title: 'Error!',
      description: 'This is an error toast notification.',
      variant: 'error',
    });
  };

  const showWarningToast = () => {
    toast({
      title: 'Warning!',
      description: 'This is a warning toast notification.',
      variant: 'warning',
    });
  };

  const showDefaultToast = () => {
    toast({
      title: 'Information',
      description: 'This is a default toast notification.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <Head>
        <title>Toast Demo App</title>
        <meta name="description" content="A toast notification demo in Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Toast Notification Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <p className="text-gray-700 mb-6">
            Click the buttons below to display different types of toast notifications.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={showSuccessToast}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Show Success Toast
            </button>
            
            <button
              onClick={showErrorToast}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Show Error Toast
            </button>
            
            <button
              onClick={showWarningToast}
              className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
            >
              Show Warning Toast
            </button>
            
            <button
              onClick={showDefaultToast}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Show Default Toast
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About Toast Notifications</h2>
            <p className="text-gray-700">
              Toast notifications provide a simple way to display alerts and feedback to users. They're 
              non-blocking, allowing users to continue interacting with the application while displaying 
              important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}