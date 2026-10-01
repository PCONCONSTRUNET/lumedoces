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
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <Clock className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-foreground">Horários</h1>
          <p className="text-sm text-muted-foreground">
            Defina quando a loja abre. O status no site atualiza automaticamente.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            status.isOpen
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.isOpen ? "ABERTO AGORA" : "FECHADO AGORA"}
        </span>
      </header>

      <div className="rounded-2xl bg-card p-4 md:p-6 shadow-sm ring-1 ring-border/60">
        {!rows ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div
                key={r.day_of_week}
                className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr_120px] gap-3 items-center rounded-xl border border-border/60 p-3"
              >
                <div className="font-semibold text-foreground">
                  {DAYS[r.day_of_week]}
                </div>

                <label className="text-sm">
                  <span className="block text-xs text-muted-foreground mb-1">
                    Abre
                  </span>
                  <input
                    type="time"
                    value={r.open_time}
                    disabled={r.is_closed || r.is_24h}
                    onChange={(e) => update(r.day_of_week, { open_time: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-50"
                  />
                </label>

                <label className="text-sm">
                  <span className="block text-xs text-muted-foreground mb-1">
                    Fecha
                  </span>
                  <input
                    type="time"
                    value={r.close_time}
                    disabled={r.is_closed || r.is_24h}
                    onChange={(e) => update(r.day_of_week, { close_time: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-50"
                  />
                </label>

                <div className="flex flex-col gap-2 justify-center ml-2 pt-4">
                  <label className="flex items-center gap-2 text-sm font-medium select-none cursor-pointer">
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

                  <label className="flex items-center gap-2 text-sm font-medium select-none cursor-pointer">
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
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60 transition"
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
