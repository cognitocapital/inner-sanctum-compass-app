-- Private bucket for personal brain scans
INSERT INTO storage.buckets (id, name, public)
VALUES ('brain-scans', 'brain-scans', false)
ON CONFLICT (id) DO NOTHING;

-- Strict per-user folder RLS on the bucket
CREATE POLICY "Users can view their own brain scans"
ON storage.objects FOR SELECT
USING (bucket_id = 'brain-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own brain scans"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brain-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own brain scans"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brain-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own brain scans"
ON storage.objects FOR DELETE
USING (bucket_id = 'brain-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Metadata table for uploaded scans
CREATE TABLE public.brain_scan_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  original_filename TEXT,
  mime_type TEXT,
  scan_kind TEXT NOT NULL DEFAULT 'image', -- 'image' | 'dicom' | 'nifti'
  label TEXT,
  opacity NUMERIC NOT NULL DEFAULT 0.7 CHECK (opacity >= 0 AND opacity <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brain_scan_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scan uploads"
ON public.brain_scan_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scan uploads"
ON public.brain_scan_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scan uploads"
ON public.brain_scan_uploads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scan uploads"
ON public.brain_scan_uploads FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER brain_scan_uploads_set_updated_at
BEFORE UPDATE ON public.brain_scan_uploads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Manual marker pins on the atlas
CREATE TABLE public.brain_scan_markers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  upload_id UUID REFERENCES public.brain_scan_uploads(id) ON DELETE CASCADE,
  region_id TEXT, -- atlas region id (nullable: free pins allowed)
  position_x NUMERIC NOT NULL,
  position_y NUMERIC NOT NULL,
  position_z NUMERIC NOT NULL DEFAULT 0,
  severity TEXT NOT NULL DEFAULT 'noted', -- 'noted' | 'mild' | 'moderate' | 'severe'
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brain_scan_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own markers"
ON public.brain_scan_markers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own markers"
ON public.brain_scan_markers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own markers"
ON public.brain_scan_markers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own markers"
ON public.brain_scan_markers FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER brain_scan_markers_set_updated_at
BEFORE UPDATE ON public.brain_scan_markers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_brain_scan_markers_user ON public.brain_scan_markers(user_id);
CREATE INDEX idx_brain_scan_markers_upload ON public.brain_scan_markers(upload_id);