
-- =============================================
-- YELLOW BRICK ROAD: DATABASE FOUNDATION
-- =============================================

-- 1. PROFILES TABLE - User identity and preferences
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  injury_date DATE,
  injury_type TEXT,
  current_symptoms JSONB DEFAULT '[]'::jsonb,
  primary_goals TEXT[] DEFAULT '{}',
  daily_goal_minutes INTEGER DEFAULT 10,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. USER_PROGRESS TABLE - Overall recovery tracking
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  modules_unlocked JSONB DEFAULT '["breathing", "gratitude"]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  weekly_goal_sessions INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- 3. SESSION_LOGS TABLE - Activity history
CREATE TABLE public.session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL,
  exercise_id TEXT,
  duration_seconds INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  metrics JSONB DEFAULT '{}'::jsonb,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. DAILY_CHECKINS TABLE - Mood/symptom tracking
CREATE TABLE public.daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  pain_level INTEGER CHECK (pain_level >= 1 AND pain_level <= 5),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  symptoms_today JSONB DEFAULT '[]'::jsonb,
  gratitude_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, check_date)
);

-- 5. AI_RECOMMENDATIONS TABLE - Personalized suggestions cache
CREATE TABLE public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  recommendations JSONB NOT NULL,
  priority_module TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, recommendation_date)
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - PROFILES
-- =============================================

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- RLS POLICIES - USER_PROGRESS
-- =============================================

CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - SESSION_LOGS
-- =============================================

CREATE POLICY "Users can view their own sessions"
  ON public.session_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON public.session_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.session_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - DAILY_CHECKINS
-- =============================================

CREATE POLICY "Users can view their own checkins"
  ON public.daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkins"
  ON public.daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins"
  ON public.daily_checkins FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - AI_RECOMMENDATIONS
-- =============================================

CREATE POLICY "Users can view their own recommendations"
  ON public.ai_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
  ON public.ai_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_session_logs_user_date ON public.session_logs(user_id, created_at DESC);
CREATE INDEX idx_session_logs_module ON public.session_logs(user_id, module_type);
CREATE INDEX idx_daily_checkins_user_date ON public.daily_checkins(user_id, check_date DESC);
CREATE INDEX idx_ai_recommendations_user_date ON public.ai_recommendations(user_id, recommendation_date DESC);

-- =============================================
-- TRIGGER FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_user_progress_updated
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE AND PROGRESS ON SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
