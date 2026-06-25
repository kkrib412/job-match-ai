import JobForm from "@/components/JobForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🎯 JobMatch AI
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Paste a job listing and your resume. Get tailored bullets, a cover letter, and interview prep in seconds.
        </p>
      </div>

      {/* Form / Results */}
      <JobForm />

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
          <div className="text-2xl mb-2">📝</div>
          <h3 className="text-white font-medium mb-1">Tailored Bullets</h3>
          <p className="text-gray-400 text-sm">
            Resume bullets mapped to the specific role
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
          <div className="text-2xl mb-2">📄</div>
          <h3 className="text-white font-medium mb-1">Cover Letter</h3>
          <p className="text-gray-400 text-sm">
            Professional draft tailored to the posting
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
          <div className="text-2xl mb-2">💬</div>
          <h3 className="text-white font-medium mb-1">Interview Prep</h3>
          <p className="text-gray-400 text-sm">
            Likely questions with answer strategies
          </p>
        </div>
      </div>
    </div>
  );
}
