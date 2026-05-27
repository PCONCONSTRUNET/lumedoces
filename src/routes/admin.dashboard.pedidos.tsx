import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard/pedidos")({
  component: PedidosPage,
});

function PedidosPage() {
  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl text-foreground">Pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe os pedidos recebidos.
          </p>
        </div>
      </header>

      <div className="rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">
          Nenhum pedido ainda. Quando começarem a chegar, eles aparecem aqui.
        </p>
      </div>
    </div>
  );
}
