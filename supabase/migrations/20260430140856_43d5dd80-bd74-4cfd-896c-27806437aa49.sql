
-- Table des sessions d'entraînement
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  total_distance_m NUMERIC DEFAULT 0,
  total_calories NUMERIC DEFAULT 0,
  avg_bpm NUMERIC,
  max_bpm NUMERIC,
  avg_rpm NUMERIC,
  avg_force NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own sessions" ON public.sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON public.sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own sessions" ON public.sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_sessions_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_sessions_user_started ON public.sessions(user_id, started_at DESC);

-- Table des lectures de capteurs
CREATE TABLE public.sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rpm NUMERIC,
  bpm NUMERIC,
  speed_kmh NUMERIC,
  distance_m NUMERIC,
  force_n NUMERIC,
  raw JSONB
);

ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own readings" ON public.sensor_readings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own readings" ON public.sensor_readings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own readings" ON public.sensor_readings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_readings_session ON public.sensor_readings(session_id, recorded_at);
