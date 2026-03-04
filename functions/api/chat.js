export async function onRequestPost(context) {
  const K = context.env.DEEPSEEK_API_KEY;
  if (!K) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
  try {
    const body = await context.request.json();
    const msgs = body.system
      ? [{ role: "system", content: body.system }, ...body.messages]
      : body.messages;

    const r = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + K
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        max_tokens: 1000,
        messages: msgs
      })
    });

    const d = await r.json();
    if (!r.ok) {
      return new Response(JSON.stringify({ error: d }), {
        status: r.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const content = d.choices && d.choices[0] ? d.choices[0].message.content : "";
    return new Response(JSON.stringify({ content }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
