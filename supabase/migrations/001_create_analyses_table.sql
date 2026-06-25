-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  resume_snippet TEXT,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  match_level TEXT NOT NULL CHECK (match_level IN ('strong', 'moderate', 'weak')),
  analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast history lookups
CREATE INDEX idx_analyses_created_at ON analyses (created_at DESC);

-- Enable Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and reads for demo
CREATE POLICY "Allow anonymous inserts" ON analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous reads" ON analyses FOR SELECT USING (true);
