import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
    const igUserId = Deno.env.get("INSTAGRAM_USER_ID");
    const version = Deno.env.get("INSTAGRAM_API_VERSION") || "v24.0";
    if (!token || !igUserId) throw new Error("Instagram API settings are not configured.");

    const url = `https://graph.instagram.com/${version}/${encodeURIComponent(igUserId)}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${encodeURIComponent(token)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Instagram API request failed");

    return new Response(JSON.stringify({ success: true, posts: data.data || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Instagram sync failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
