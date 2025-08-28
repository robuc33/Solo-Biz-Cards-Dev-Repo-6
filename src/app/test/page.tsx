export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Next.js is Working!
        </h1>
        <p className="text-lg text-gray-600">
          This is a test page to verify the Next.js setup.
        </p>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
