import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <Head>
        <title>Next.js Simple App</title>
        <meta name="description" content="A simple Next.js app with TailwindCSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Welcome to Next.js Simple App
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <p className="text-gray-700 mb-4">
            This is a simple Next.js app with TailwindCSS styling, part of a monorepo setup.
          </p>
          
          <div className="flex justify-center mt-8">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors mx-2"
            >
              Documentation
            </a>
            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors mx-2"
            >
              GitHub
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}