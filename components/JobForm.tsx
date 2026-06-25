"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface JobMatchResult {
  score: number;
  matchLevel: "strong" | "moderate" | "weak";
  summary: string;
  tailoredBullets: string[];
  coverLetterDraft: string;
  interviewQuestions: string[];
  missingSkills: string[];
  strengths: string[];
}

export default function JobForm() {
  const [jobListing, setJobListing] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [activeTab, setActiveTab] = useState<"bullets" | "cover" | "interview">("bullets");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!jobListing.trim() || !resume.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobListing: jobListing.trim(), resume: resume.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const analysis = await res.json();
      setResult(analysis);
      // Save for history
      sessionStorage.setItem("lastAnalysis", JSON.stringify(analysis));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="w-full max-w-3xl">
        {/* Score Header */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={result.score >= 70 ? "#10b981" : result.score >= 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - result.score / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{result.score}</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Match Score: {result.score}/100
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase inline-block ${
                result.matchLevel === "strong" ? "bg-green-500/20 text-green-400" :
                result.matchLevel === "moderate" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}>
                {result.matchLevel} match
              </span>
              <p className="text-gray-400 text-sm mt-2">{result.summary}</p>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-green-900/50">
            <h3 className="text-green-400 font-semibold mb-2">✅ Strengths</h3>
            <ul className="space-y-1">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-gray-300 text-sm">• {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-red-900/50">
            <h3 className="text-red-400 font-semibold mb-2">⚠️ Missing / Weak</h3>
            <ul className="space-y-1">
              {result.missingSkills.map((s, i) => (
                <li key={i} className="text-gray-300 text-sm">• {s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex border-b border-gray-700">
            {(["bullets", "cover", "interview"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab === "bullets" ? "📝 Tailored Bullets" :
                 tab === "cover" ? "📄 Cover Letter" :
                 "💬 Interview Prep"}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "bullets" && (
              <ul className="space-y-3">
                {result.tailoredBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400 mt-0.5">→</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "cover" && (
              <div className="bg-gray-900 rounded-lg p-4 text-gray-300 whitespace-pre-wrap leading-relaxed font-serif text-sm">
                {result.coverLetterDraft}
              </div>
            )}

            {activeTab === "interview" && (
              <div className="space-y-4">
                {result.interviewQuestions.map((q, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">Q{i + 1}: {q}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Analysis */}
        <button
          onClick={() => setResult(null)}
          className="mt-6 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
        >
          Analyze Another Listing
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      {/* Job Listing */}
      <div className="mb-4">
        <label className="block text-white font-medium mb-2">
          📋 Job Listing
        </label>
        <textarea
          value={jobListing}
          onChange={(e) => setJobListing(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm"
        />
      </div>

      {/* Resume */}
      <div className="mb-4">
        <label className="block text-white font-medium mb-2">
          👤 Your Resume
        </label>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume content here..."
          rows={8}
          className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="mb-4 text-red-400 text-sm">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span> Analyzing match...
          </>
        ) : (
          <>🎯 Analyze Job Match</>
        )}
      </button>
    </form>
  );
}
