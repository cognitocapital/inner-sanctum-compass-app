-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add protocol tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN current_week INTEGER DEFAULT 1,
ADD COLUMN protocol_started_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create week_progress table for tracking weekly completion
CREATE TABLE public.week_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_number INTEGER NOT NULL,
  chapter_completed BOOLEAN DEFAULT FALSE,
  practice_completed BOOLEAN DEFAULT FALSE,
  reflection_completed BOOLEAN DEFAULT FALSE,
  reflection_text TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_number)
);

-- Enable Row Level Security
ALTER TABLE public.week_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for week_progress
CREATE POLICY "Users can view their own week progress" 
ON public.week_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own week progress" 
ON public.week_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own week progress" 
ON public.week_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at trigger for week_progress
CREATE TRIGGER update_week_progress_updated_at
BEFORE UPDATE ON public.week_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();