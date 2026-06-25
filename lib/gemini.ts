import { GoogleGenAI } from "@google/genai";

function getClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export interface JobMatchResult {
  score: number;
  matchLevel: "strong" | "moderate" | "weak";
  summary: string;
  tailoredBullets: string[];
  coverLetterDraft: string;
  interviewQuestions: string[];
  missingSkills: string[];
  strengths: string[];
}

export async function analyzeJobListing(
  jobListing: string,
  resume: string
): Promise<JobMatchResult> {
  const client = getClient();

  const prompt = `You are an expert career coach and ATS (Applicant Tracking System) optimizer.
Analyze the provided resume against the job listing and produce a detailed match report.

Evaluate:
1. Overall match score (0-100)
2. Top strengths where the candidate aligns well
3. Missing or weak skills compared to requirements
4. Tailored resume bullet points that map the candidate's experience to the job
5. A professional cover letter draft (3-4 paragraphs)
6. Likely interview questions with brief answer strategies

Respond in valid JSON matching this exact schema:
{
  "score": number (0-100),
  "matchLevel": "strong" | "moderate" | "weak",
  "summary": string (2-3 sentence overview),
  "tailoredBullets": string[] (5-8 bullets mapping experience to job requirements),
  "coverLetterDraft": string (3-4 paragraphs, use [Company Name] as placeholder),
  "interviewQuestions": string[] (5 questions with suggested answer direction),
  "missingSkills": string[],
  "strengths": string[]
}

JOB LISTING:

${jobListing}

---

RESUME:

${resume}`;

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text = response.text || "{}";
  // Strip markdown code fences if Gemini wraps the response
  const jsonStr = text.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "");
  const result = JSON.parse(jsonStr);
  return result as JobMatchResult;
}
