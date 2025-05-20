
-- Create material_performance table for tracking material sustainability over time
CREATE TABLE IF NOT EXISTS public.material_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id TEXT NOT NULL,
  material_name TEXT NOT NULL,
  carbon_footprint DOUBLE PRECISION NOT NULL,
  sustainability_score INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  project_id UUID REFERENCES public.projects(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_material_performance_material_name ON public.material_performance(material_name);
CREATE INDEX IF NOT EXISTS idx_material_performance_timestamp ON public.material_performance(timestamp);
CREATE INDEX IF NOT EXISTS idx_material_performance_project_id ON public.material_performance(project_id);

-- Enable row level security
ALTER TABLE public.material_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to ensure users can only access their own project's data
CREATE POLICY "Users can view their own material performance data"
  ON public.material_performance
  FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can insert their own material performance data"
  ON public.material_performance
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );
