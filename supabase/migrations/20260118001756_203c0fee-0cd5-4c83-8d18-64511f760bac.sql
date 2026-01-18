-- Add protocol columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS protocol_type TEXT DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS protocol_phase INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS protocol_name TEXT DEFAULT NULL;

-- Add check constraint for valid protocol types
ALTER TABLE public.profiles ADD CONSTRAINT valid_protocol_type 
  CHECK (protocol_type IS NULL OR protocol_type IN ('tbi_survivor', 'peak_performance'));

-- Add check constraint for valid protocol names
ALTER TABLE public.profiles ADD CONSTRAINT valid_protocol_name 
  CHECK (protocol_name IS NULL OR protocol_name IN ('phoenix_rising', 'one_percent'));

-- Create protocol definitions table
CREATE TABLE public.protocol_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  total_weeks INTEGER NOT NULL,
  total_phases INTEGER NOT NULL,
  target_audience TEXT NOT NULL,
  icon_variant TEXT,
  gradient TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on protocol_definitions
ALTER TABLE public.protocol_definitions ENABLE ROW LEVEL SECURITY;

-- Protocol definitions are public read-only
CREATE POLICY "Protocol definitions are viewable by everyone" 
ON public.protocol_definitions 
FOR SELECT 
USING (true);

-- Insert the two protocols
INSERT INTO public.protocol_definitions (protocol_key, name, description, total_weeks, total_phases, target_audience, icon_variant, gradient)
VALUES 
  ('phoenix_rising', 'Phoenix Rising Protocol', 'A 20-week healing journey designed specifically for TBI/ABI recovery. Gentle pacing, self-compassion, and science-backed neuroplasticity.', 20, 4, 'tbi_survivor', 'phoenix', 'from-orange-500 to-red-500'),
  ('one_percent', 'The 1% Protocol', 'A 16-week elite optimization program. Flow states, deliberate discomfort, and high hard goals for those ready to level up.', 16, 4, 'peak_performance', 'zap', 'from-cyan-500 to-blue-500');