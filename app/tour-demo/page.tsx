export default function TourDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tour System Demo
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Interactive tour system is being updated. Please check back soon.
          </p>
          <div className="mt-8">
            <a href="/agc-demo" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4">
              View AGC Demo
            </a>
            <a href="/" className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}