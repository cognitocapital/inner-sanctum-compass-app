-- Create clinical_assessments table for GOSE, WPTAS, RPQ tracking
CREATE TABLE public.clinical_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('GOSE', 'WPTAS', 'RPQ', 'PHQ9', 'GAD7', 'BSI18')),
  score INTEGER,
  subscores JSONB DEFAULT '{}',
  severity TEXT,
  administered_by TEXT DEFAULT 'self' CHECK (administered_by IN ('self', 'caregiver', 'clinician')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX idx_clinical_assessments_user_type ON public.clinical_assessments(user_id, assessment_type);
CREATE INDEX idx_clinical_assessments_user_date ON public.clinical_assessments(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.clinical_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own assessments"
ON public.clinical_assessments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments"
ON public.clinical_assessments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
ON public.clinical_assessments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments"
ON public.clinical_assessments FOR DELETE
USING (auth.uid() = user_id);