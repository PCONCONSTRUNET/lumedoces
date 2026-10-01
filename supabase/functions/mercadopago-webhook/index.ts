import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Webhook MP recebido:", JSON.stringify(body));

    if (body.type !== "payment" || !body.data?.id) {
      return new Response(JSON.stringify({ ok: true, msg: "ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentId = String(body.data.id);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: configRows } = await supabaseAdmin
      .from("app_config")
      .select("value")
      .eq("key", "mp_gateway_config")
      .maybeSingle();

    let accessToken = null;
    if (configRows?.value) {
      try {
        const cfg = typeof configRows.value === "string" ? JSON.parse(configRows.value) : configRows.value;
        accessToken = cfg.accessToken ?? null;
      } catch (_) {}
    }

    if (!accessToken) {
      return new Response(JSON.stringify({ ok: false, error: "no token" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mpRes = await fetch(https://api.mercadopago.com/v1/payments/, {
      headers: { Authorization: Bearer  },
    });

    if (!mpRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: "mp_api_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mpPayment = await mpRes.json();
    const orderId = mpPayment.external_reference;

    if (!orderId) {
      return new Response(JSON.stringify({ ok: true, msg: "no external_reference" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mpPayment.status === "approved") {
      await supabaseAdmin
        .from("orders")
        .update({ status: "confirmed", updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .eq("status", "pending");
    }

    return new Response(JSON.stringify({ ok: true, status: mpPayment.status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
