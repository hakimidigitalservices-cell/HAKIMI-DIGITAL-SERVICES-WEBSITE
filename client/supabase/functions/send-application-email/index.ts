import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ApplicationPayload = {
  application_id: string;
  service: string;
  full_name: string;
  mobile_number: string;
  whatsapp_number: string;
  customer_email?: string;
  email?: string;
  state: string;
  city: string;
  status?: string;
};

const required = [
  "application_id",
  "service",
  "full_name",
  "mobile_number",
  "state",
  "city",
] as const;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char] ?? char));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Partial<ApplicationPayload>;

    for (const key of required) {
      if (!body[key] || String(body[key]).trim() === "") {
        return new Response(
          JSON.stringify({ error: `Missing field: ${key}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "hakimidigitalservices@gmail.com";

    if (!apiKey || !fromEmail) {
      throw new Error("Resend email settings are not configured in Supabase.");
    }

    const applicationId = escapeHtml(String(body.application_id));
    const service = escapeHtml(String(body.service));
    const fullName = escapeHtml(String(body.full_name));
    const mobile = escapeHtml(String(body.mobile_number));
    const whatsapp = escapeHtml(String(body.whatsapp_number || ""));
    const customerEmail = String(body.customer_email || body.email || "").trim();
    if (!customerEmail) throw new Error("Missing field: customer_email");
    const status = escapeHtml(String(body.status || "Application Received"));
    const state = escapeHtml(String(body.state));
    const city = escapeHtml(String(body.city));

    const trackUrl = "https://hakimidigitalservices.com/#/track";

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:650px;margin:auto">
        <h2 style="color:#0b1f3a">Hakimi Digital Services</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for applying to Hakimi Digital Services.</p>
        <div style="background:#f5f7fa;border-radius:12px;padding:18px">
          <p><strong>Application ID:</strong> ${applicationId}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
        <p style="margin-top:22px">
          <a href="${trackUrl}" style="display:inline-block;background:#d9a441;color:#0b1f3a;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold">
            Track Application
          </a>
        </p>
        <p>For help: +91 77208 49522</p>
        <p>32 Gala Market, Opp PWD Office, Dondaicha Road, Shahada</p>
        <p>Regards,<br><strong>Hakimi Digital Services</strong></p>
      </div>`;

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:650px;margin:auto">
        <h2 style="color:#0b1f3a">New Application Received</h2>
        <div style="background:#f5f7fa;border-radius:12px;padding:18px">
          <p><strong>Application ID:</strong> ${applicationId}</p>
          <p><strong>Customer:</strong> ${fullName}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
      </div>`;

    async function sendEmail(to: string, subject: string, html: string) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Resend error ${response.status}: ${text}`);
      }
      return response.json();
    }

    const customerResult = await sendEmail(
      customerEmail,
      `Hakimi Digital Services – Application ${applicationId} Received`,
      customerHtml
    );

    let adminResult = null;
    try {
      adminResult = await sendEmail(
        adminEmail,
        `Hakimi Digital Services – ${applicationId} – ${status}`,
        adminHtml
      );
    } catch (adminError) {
      console.error("Admin email failed:", adminError);
    }

    return new Response(
      JSON.stringify({ success: true, customer: customerResult, admin: adminResult }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Email sending failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
