UPDATE public.business_hours SET open_time = '14:00:00', close_time = '22:00:00', is_closed = false WHERE day_of_week IN (1,2,3,4,5);
UPDATE public.business_hours SET open_time = '14:00:00', close_time = '19:00:00', is_closed = false WHERE day_of_week = 6;
UPDATE public.business_hours SET is_closed = true WHERE day_of_week = 0;