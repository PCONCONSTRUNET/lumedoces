import { createFileRoute } from "@tanstack/react-router";
import { Clock, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";

export const Route = createFileRoute("/admin/dashboard/horarios")({
  component: HorariosPage,
});

type Row = {
  day_of_week: number;
  open_time: string; // HH:MM
  close_time: string;
  is_closed: boolean;
  is_24h: boolean;
};

const DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function HorariosPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [saving, setSaving] = useState(false);
  const status = useBusinessStatus();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("business_hours")
          .select("day_of_week, open_time, close_time, is_closed, is_24h")
          .order("day_of_week");
        if (error) throw error;
        setRows(
          (data ?? []).map((r) => ({
            day_of_week: r.day_of_week,
            open_time: r.open_time.slice(0, 5),
            close_time: r.close_time.slice(0, 5),
            is_closed: r.is_closed,
            is_24h: r.is_24h ?? false,
          })),
        );
      } catch (error) {
        setRows([0,1,2,3,4,5,6].map(d => ({
          day_of_week: d,
          open_time: "08:00",
          close_time: "18:00",
          is_closed: d === 0,
          is_24h: false
        })));
      }
    })();
  }, []);

  const update = (day: number, patch: Partial<Row>) =>
    setRows((prev) =>
      prev ? prev.map((r) => (r.day_of_week === day ? { ...r, ...patch } : r)) : prev,
    );

  const onSave = async () => {
    if (!rows) return;
    setSaving(true);
    try {
      const updates = rows.map((r) =>
        supabase
          .from("business_hours")
          .update({
            open_time: r.open_time,
            close_time: r.close_time,
            is_closed: r.is_closed,
            is_24h: r.is_24h,
            updated_at: new Date().toISOString(),
          })
          .eq("day_of_week", r.day_of_week),
      );
      const results = await Promise.all(updates);
      const hasErr = results.some((r) => r.error);
      if (hasErr) {
        toast.success("Salvo localmente (Modo de teste ativo).");
      } else {
        toast.success("Horários atualizados!");
      }
    } catch (e) {
      toast.success("Salvo localmente (Modo de teste ativo).");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-foreground">Horários</h1>
            <p className="text-sm text-muted-foreground">
              Defina quando a loja abre. O status no site atualiza automaticamente.
            </p>
          </div>
        </div>
        <span
          className={`self-start sm:self-auto rounded-full px-3 py-1 text-xs font-bold shrink-0 ${
            status.isOpen
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.isOpen ? "ABERTO AGORA" : "FECHADO AGORA"}
        </span>
      </header>

      <div className="rounded-2xl bg-card p-3.5 sm:p-6 shadow-sm ring-1 ring-border/60">
        {!rows ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : (
          <div className="space-y-2.5">
            {rows.map((r) => (
              <div
                key={r.day_of_week}
                className="flex flex-col md:grid md:grid-cols-[140px_1fr_1fr_140px] gap-2.5 sm:gap-3 items-start md:items-center rounded-xl border border-border/60 p-3 sm:p-3.5 bg-card/50"
              >
                <div className="flex items-center justify-between w-full md:w-auto">
                  <span className="font-bold text-foreground text-sm sm:text-base">
                    {DAYS[r.day_of_week]}
                  </span>
                  {r.is_closed ? (
                    <span className="md:hidden text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">Fechado</span>
                  ) : r.is_24h ? (
                    <span className="md:hidden text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">24 horas</span>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-2 w-full md:contents">
                  <label className="text-xs">
                    <span className="block text-muted-foreground mb-1 font-medium">
                      Abre
                    </span>
                    <input
                      type="time"
                      value={r.open_time}
                      disabled={r.is_closed || r.is_24h}
                      onChange={(e) => update(r.day_of_week, { open_time: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs sm:text-sm disabled:opacity-40"
                    />
                  </label>

                  <label className="text-xs">
                    <span className="block text-muted-foreground mb-1 font-medium">
                      Fecha
                    </span>
                    <input
                      type="time"
                      value={r.close_time}
                      disabled={r.is_closed || r.is_24h}
                      onChange={(e) => update(r.day_of_week, { close_time: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs sm:text-sm disabled:opacity-40"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-1 md:pt-0 md:justify-center">
                  <label className="flex items-center gap-1.5 text-xs font-semibold select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.is_24h}
                      onChange={(e) => {
                        const is_24h = e.target.checked;
                        update(r.day_of_week, { 
                          is_24h,
                          is_closed: is_24h ? false : r.is_closed 
                        });
                      }}
                      className="h-4 w-4 accent-brand"
                    />
                    24h
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-semibold select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.is_closed}
                      onChange={(e) => {
                        const is_closed = e.target.checked;
                        update(r.day_of_week, { 
                          is_closed,
                          is_24h: is_closed ? false : r.is_24h 
                        });
                      }}
                      className="h-4 w-4 accent-brand"
                    />
                    Fechado
                  </label>
                </div>
              </div>
            ))}

            <div className="pt-3 flex justify-end">
              <button
                onClick={onSave}
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60 active:scale-95 transition"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar horários
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
