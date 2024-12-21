/*
  # Waitlist System Schema

  1. New Tables
    - `waitlist_entries`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `approved` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `waitlist_entries`
    - Policies for:
      - Public insert access (anyone can join waitlist)
      - Authenticated users can view their own entries
*/

CREATE TABLE IF NOT EXISTS waitlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can create waitlist entries"
  ON waitlist_entries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist entry"
  ON waitlist_entries
  FOR SELECT
  TO public
  USING (email = auth.jwt() ->> 'email');

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_entries_email_idx ON waitlist_entries(email);