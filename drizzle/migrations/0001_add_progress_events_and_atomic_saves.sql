CREATE TABLE public.progress_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL DEFAULT auth.uid(),
 kind text NOT NULL CHECK (kind IN ('lesson_completed','quiz_answered','conversation_completed')),
 item_id text NOT NULL CHECK (length(item_id) BETWEEN 1 AND 200),
 correct boolean,
 score integer CHECK (score BETWEEN 0 AND 100),
 created_at timestamptz NOT NULL DEFAULT now(),
 attempt_id uuid,
 lesson_id text,
 CONSTRAINT quiz_answer_has_result CHECK (kind <> 'quiz_answered' OR correct IS NOT NULL)
);
GRANT SELECT, INSERT, DELETE ON public.progress_events TO authenticated;
GRANT ALL ON public.progress_events TO service_role;
ALTER TABLE public.progress_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY progress_events_select_own ON public.progress_events FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY progress_events_insert_own ON public.progress_events FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY progress_events_delete_own ON public.progress_events FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE INDEX progress_events_user_created_idx ON public.progress_events(user_id,created_at DESC,id);
CREATE UNIQUE INDEX progress_events_complete_once_idx ON public.progress_events(user_id,kind,item_id) WHERE kind IN ('lesson_completed','conversation_completed');
CREATE UNIQUE INDEX progress_events_answer_once_idx ON public.progress_events(user_id,attempt_id,item_id) WHERE kind = 'quiz_answered' AND attempt_id IS NOT NULL;
CREATE POLICY own_completions_delete ON public.lesson_completions FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY own_attempts_delete ON public.quiz_attempts FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
GRANT DELETE ON public.lesson_completions, public.quiz_attempts TO authenticated;
CREATE FUNCTION public.save_quiz_progress(p_lesson_id text,p_attempt_id uuid,p_results jsonb) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE owner_id uuid := auth.uid(); completion_item text;
BEGIN
 IF owner_id IS NULL THEN RAISE EXCEPTION 'Please sign in to save progress.' USING ERRCODE = '42501'; END IF;
 IF p_attempt_id IS NULL OR p_lesson_id IS NULL OR length(p_lesson_id) NOT BETWEEN 1 AND 200 OR jsonb_typeof(p_results) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid quiz submission' USING ERRCODE = '23514'; END IF;
 IF jsonb_array_length(p_results) NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Invalid quiz length' USING ERRCODE = '23514'; END IF;
 IF EXISTS (SELECT 1 FROM jsonb_array_elements(p_results) r WHERE jsonb_typeof(r->'correct') IS DISTINCT FROM 'boolean' OR jsonb_typeof(r->'questionId') IS DISTINCT FROM 'string' OR length(r->>'questionId') NOT BETWEEN 1 AND 200) OR (SELECT count(DISTINCT r->>'questionId') FROM jsonb_array_elements(p_results) r) <> jsonb_array_length(p_results) THEN RAISE EXCEPTION 'Invalid quiz answers' USING ERRCODE = '23514'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(owner_id::text || p_attempt_id::text,0));
 IF EXISTS (SELECT 1 FROM public.progress_events WHERE user_id=owner_id AND attempt_id=p_attempt_id) THEN RETURN; END IF;
 completion_item := CASE WHEN p_lesson_id='daily' THEN p_results->0->>'questionId' ELSE p_lesson_id END;
 IF p_lesson_id='daily' AND EXISTS(SELECT 1 FROM public.progress_events WHERE user_id=owner_id AND kind='lesson_completed' AND item_id=completion_item) THEN RETURN; END IF;
 INSERT INTO public.progress_events(user_id,kind,item_id,correct,attempt_id,lesson_id)
 SELECT owner_id,'quiz_answered',r->>'questionId',(r->>'correct')::boolean,p_attempt_id,p_lesson_id FROM jsonb_array_elements(p_results) r;
 INSERT INTO public.progress_events(user_id,kind,item_id,score,attempt_id,lesson_id)
 SELECT owner_id,'lesson_completed',completion_item,round(100.0 * count(*) FILTER(WHERE (r->>'correct')::boolean) / count(*))::integer,p_attempt_id,p_lesson_id FROM jsonb_array_elements(p_results) r
 ON CONFLICT (user_id,kind,item_id) WHERE kind IN ('lesson_completed','conversation_completed') DO NOTHING;
END; $$;
REVOKE ALL ON FUNCTION public.save_quiz_progress(text,uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.save_quiz_progress(text,uuid,jsonb) TO authenticated;
CREATE FUNCTION public.reset_learner_progress() RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Please sign in first.' USING ERRCODE = '42501'; END IF;
 DELETE FROM public.progress_events WHERE user_id=auth.uid();
 DELETE FROM public.lesson_completions WHERE user_id=auth.uid();
 DELETE FROM public.quiz_attempts WHERE user_id=auth.uid();
END; $$;
REVOKE ALL ON FUNCTION public.reset_learner_progress() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.reset_learner_progress() TO authenticated;