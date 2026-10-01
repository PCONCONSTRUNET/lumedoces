import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, description, payerName, payerEmail, payerCpf, externalReference } = await req.json();

    // Init Supabase admin client to read config
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get MP Config from app_config table
    const { data: dbConfig, error: configError } = await supabaseClient
      .from("app_config")
      .select("value")
      .eq("key", "mp_gateway_config")
      .single();

    if (configError || !dbConfig || !dbConfig.value?.active || !dbConfig.value?.accessToken) {
      throw new Error("Mercado Pago não está configurado ou está inativo.");
    }

    const accessToken = dbConfig.value.accessToken;

    // Prepare MP Payload
    const payerIdentification = payerCpf?.replace(/\D/g, "").length >= 11 ? {
      type: payerCpf.replace(/\D/g, "").length === 14 ? "CNPJ" : "CPF",
      number: payerCpf.replace(/\D/g, "")
    } : undefined;

    const payload = {
      transaction_amount: amount,
      description: description,
      payment_method_id: "pix",
      external_reference: externalReference,
      payer: {
        email: payerEmail || "lumeartesanaisc@gmail.com",
        first_name: payerName,
        identification: payerIdentification
      }
    };

    const idempotencyKey = externalReference || `req-${Date.now()}`;

    // Call Mercado Pago API
    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify(payload)
    });

    if (!mpRes.ok) {
      const errorText = await mpRes.text();
      console.error("Erro no Mercado Pago:", errorText);
      throw new Error(`Erro Mercado Pago: ${mpRes.statusText}`);
    }

    const mpData = await mpRes.json();
    const qrCodeBase64 = mpData?.point_of_interaction?.transaction_data?.qr_code_base64;
    const qrCode = mpData?.point_of_interaction?.transaction_data?.qr_code;

    return new Response(JSON.stringify({ qrCodeBase64, qrCode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro interno:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
