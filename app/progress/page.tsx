export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Progress Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Progress tracking functionality is being updated. Please check back soon.
        </p>
        <div className="mt-8">
          <a href="/agc-demo" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View AGC Demo
          </a>
        </div>
      </div>
    </div>
  );
}