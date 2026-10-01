import { useEffect, useId, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type BusinessHour = {
  day_of_week: number;
  open_time: string; // "HH:MM:SS"
  close_time: string;
  is_closed: boolean;
  is_24h?: boolean;
};

export type BusinessStatus = {
  loading: boolean;
  isOpen: boolean;
  todayHour: BusinessHour | null;
  label: string; // ex: "Aberto até 23:00" / "Fechado • abre seg 18:00"
  allHours: BusinessHour[];
};

const DAY_LABEL = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function hhmm(t: string) {
  return t.slice(0, 5);
}

function compute(hours: BusinessHour[]): Omit<BusinessStatus, "loading" | "allHours"> {
  const now = new Date();
  const today = now.getDay();
  const todayHour = hours.find((h) => h.day_of_week === today) ?? null;

  if (todayHour && !todayHour.is_closed) {
    if (todayHour.is_24h) {
      return {
        isOpen: true,
        todayHour,
        label: "Aberto 24 horas",
      };
    }

    const [oH, oM] = todayHour.open_time.split(":").map(Number);
    const [cH, cM] = todayHour.close_time.split(":").map(Number);
    const cur = now.getHours() * 60 + now.getMinutes();
    const open = oH * 60 + oM;
    const close = cH * 60 + cM;
    // suporte a fechamento depois da meia-noite (ex: 18:00 → 02:00)
    const isOpen = close > open ? cur >= open && cur < close : cur >= open || cur < close;
    if (isOpen) {
      return {
        isOpen: true,
        todayHour,
        label: `Aberto agora • até ${hhmm(todayHour.close_time)}`,
      };
    }
  }

  // achar próxima abertura
  for (let i = 0; i < 7; i++) {
    const d = (today + i) % 7;
    const h = hours.find((x) => x.day_of_week === d);
    if (!h || h.is_closed) continue;
    if (i === 0) {
      const [oH, oM] = h.open_time.split(":").map(Number);
      const cur = now.getHours() * 60 + now.getMinutes();
      if (cur < oH * 60 + oM) {
        return {
          isOpen: false,
          todayHour,
          label: h.is_24h ? `Fechado • abre hoje 24h` : `Fechado • abre hoje ${hhmm(h.open_time)}`,
        };
      }
      continue;
    }
    return {
      isOpen: false,
      todayHour,
      label: h.is_24h ? `Fechado • abre ${DAY_LABEL[d]} 24h` : `Fechado • abre ${DAY_LABEL[d]} ${hhmm(h.open_time)}`,
    };
  }

  return { isOpen: false, todayHour, label: "Fechado" };
}

export function useBusinessStatus(refreshMs = 60_000): BusinessStatus {
  const channelId = useId();
  const [hours, setHours] = useState<BusinessHour[] | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("business_hours")
        .select("day_of_week, open_time, close_time, is_closed, is_24h");
      if (mounted) setHours((data as BusinessHour[]) ?? []);
    };
    load();

    // realtime: refletir mudanças do admin imediatamente
    const channel = supabase
      .channel(`business_hours_changes_${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "business_hours" }, () =>
        load(),
      )
      .subscribe();

    const interval = setInterval(() => setTick((t) => t + 1), refreshMs);

    return () => {
      mounted = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [channelId, refreshMs]);

  // referenciamos `tick` só pra forçar recálculo a cada minuto
  void tick;
  if (!hours) {
    return { loading: true, isOpen: false, todayHour: null, label: "...", allHours: [] };
  }
  return { loading: false, allHours: hours, ...compute(hours) };
}

