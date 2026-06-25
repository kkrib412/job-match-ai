import { NextRequest, NextResponse } from "next/server";
import { analyzeJobListing } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobListing, resume } = body;

    if (!jobListing || !resume) {
      return NextResponse.json(
        { error: "Both jobListing and resume are required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeJobListing(jobListing, resume);

    // Try to save to Supabase if configured
    try {
      const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (envUrl && envKey) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(envUrl, envKey);

        await supabase.from("analyses").insert({
          job_title: jobListing.slice(0, 200),
          resume_snippet: resume.slice(0, 300),
          score: analysis.score,
          match_level: analysis.matchLevel,
          analysis: analysis as unknown as Record<string, unknown>,
        });
      }
    } catch {
      // Supabase not configured or error - continue without saving
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze job listing" },
      { status: 500 }
    );
  }
}
