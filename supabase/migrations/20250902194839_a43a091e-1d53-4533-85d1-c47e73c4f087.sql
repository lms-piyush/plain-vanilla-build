-- Tutor analytics: monthly engagement aggregation and rating trends view

-- 1) Aggregated table for monthly student engagement per tutor
CREATE TABLE IF NOT EXISTS public.tutor_monthly_engagement (
  tutor_id uuid NOT NULL,
  month_start date NOT NULL,
  enrollments_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (tutor_id, month_start)
);

-- Enable RLS for the aggregation table
ALTER TABLE public.tutor_monthly_engagement ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view the aggregated engagement data
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'tutor_monthly_engagement' AND policyname = 'Anyone can view tutor monthly engagement'
  ) THEN
    CREATE POLICY "Anyone can view tutor monthly engagement"
    ON public.tutor_monthly_engagement
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- 2) Trigger function to maintain the aggregation table on student_enrollments changes
CREATE OR REPLACE FUNCTION public.update_tutor_monthly_engagement()
RETURNS trigger AS $$
DECLARE
  v_tutor_id uuid;
  v_month_start date;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    SELECT c.tutor_id INTO v_tutor_id FROM public.classes c WHERE c.id = NEW.class_id;
    IF v_tutor_id IS NULL THEN RETURN NEW; END IF;

    v_month_start := date_trunc('month', COALESCE(NEW.enrollment_date, NEW.created_at))::date;

    INSERT INTO public.tutor_monthly_engagement AS tme (tutor_id, month_start, enrollments_count)
    VALUES (v_tutor_id, v_month_start, 1)
    ON CONFLICT (tutor_id, month_start)
    DO UPDATE SET enrollments_count = tme.enrollments_count + 1;

    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    SELECT c.tutor_id INTO v_tutor_id FROM public.classes c WHERE c.id = OLD.class_id;
    IF v_tutor_id IS NULL THEN RETURN OLD; END IF;

    v_month_start := date_trunc('month', COALESCE(OLD.enrollment_date, OLD.created_at))::date;

    UPDATE public.tutor_monthly_engagement
    SET enrollments_count = GREATEST(enrollments_count - 1, 0)
    WHERE tutor_id = v_tutor_id AND month_start = v_month_start;

    RETURN OLD;

  ELSIF (TG_OP = 'UPDATE') THEN
    -- If class or month changed, adjust counts accordingly
    IF (OLD.class_id IS DISTINCT FROM NEW.class_id)
       OR (date_trunc('month', COALESCE(OLD.enrollment_date, OLD.created_at))
           IS DISTINCT FROM date_trunc('month', COALESCE(NEW.enrollment_date, NEW.created_at))) THEN

      -- Decrement old bucket
      SELECT c.tutor_id INTO v_tutor_id FROM public.classes c WHERE c.id = OLD.class_id;
      IF v_tutor_id IS NOT NULL THEN
        v_month_start := date_trunc('month', COALESCE(OLD.enrollment_date, OLD.created_at))::date;
        UPDATE public.tutor_monthly_engagement
        SET enrollments_count = GREATEST(enrollments_count - 1, 0)
        WHERE tutor_id = v_tutor_id AND month_start = v_month_start;
      END IF;

      -- Increment new bucket
      SELECT c.tutor_id INTO v_tutor_id FROM public.classes c WHERE c.id = NEW.class_id;
      IF v_tutor_id IS NOT NULL THEN
        v_month_start := date_trunc('month', COALESCE(NEW.enrollment_date, NEW.created_at))::date;
        INSERT INTO public.tutor_monthly_engagement AS tme (tutor_id, month_start, enrollments_count)
        VALUES (v_tutor_id, v_month_start, 1)
        ON CONFLICT (tutor_id, month_start)
        DO UPDATE SET enrollments_count = tme.enrollments_count + 1;
      END IF;
    END IF;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3) Triggers on student_enrollments
DROP TRIGGER IF EXISTS trg_tme_insert ON public.student_enrollments;
CREATE TRIGGER trg_tme_insert
AFTER INSERT ON public.student_enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_tutor_monthly_engagement();

DROP TRIGGER IF EXISTS trg_tme_update ON public.student_enrollments;
CREATE TRIGGER trg_tme_update
AFTER UPDATE ON public.student_enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_tutor_monthly_engagement();

DROP TRIGGER IF EXISTS trg_tme_delete ON public.student_enrollments;
CREATE TRIGGER trg_tme_delete
AFTER DELETE ON public.student_enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_tutor_monthly_engagement();

-- 4) Backfill existing data into aggregation table
INSERT INTO public.tutor_monthly_engagement (tutor_id, month_start, enrollments_count)
SELECT c.tutor_id,
       date_trunc('month', COALESCE(se.enrollment_date, se.created_at))::date AS month_start,
       COUNT(*)::int AS enrollments_count
FROM public.student_enrollments se
JOIN public.classes c ON c.id = se.class_id
GROUP BY c.tutor_id, date_trunc('month', COALESCE(se.enrollment_date, se.created_at))::date
ON CONFLICT (tutor_id, month_start) DO UPDATE
SET enrollments_count = EXCLUDED.enrollments_count;

-- 5) View for tutor rating trends (monthly average)
CREATE OR REPLACE VIEW public.tutor_rating_trends AS
SELECT
  tutor_id,
  date_trunc('month', created_at)::date AS month_start,
  AVG(rating)::numeric(4,2) AS avg_rating,
  COUNT(*)::int AS review_count
FROM public.tutor_reviews
GROUP BY tutor_id, date_trunc('month', created_at)::date;