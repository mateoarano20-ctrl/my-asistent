module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ reply: "Método no permitido" });
  try {
    const { messages } = req.body || {};
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5-5",
        max_tokens: 400,
        system:
          "Eres Nova, una asistente personal tipo inteligencia artificial futurista, elegante y eficiente, que habla por voz. Responde en español, en frases cortas y naturales, sin listas, sin markdown y sin emojis. Sé cálida y directa.",
        messages: (messages || []).slice(-20),
      }),
    });
    const data = await r.json();
    const reply = data.content?.map((b) => b.text || "").join("") || data.error?.message || "No pude responder.";
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ reply: "Error en el servidor: " + e.message });
  }
};
