
CREATE OR REPLACE FUNCTION public.orders_log_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.order_events (order_id, user_id, status, note)
    VALUES (NEW.id, NEW.user_id, NEW.status, 'Order received');
  ELSIF (TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status) THEN
    INSERT INTO public.order_events (order_id, user_id, status, note)
    VALUES (NEW.id, NEW.user_id, NEW.status, NULL);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.orders_touch_updated()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END;
$$;
