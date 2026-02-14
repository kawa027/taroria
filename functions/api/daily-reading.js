export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return json({ error: 'Missing GEMINI_API_KEY' }, 500);
    }
    const preferredModel = context.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const candidateModels = [preferredModel, 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

    const payload = await context.request.json();
    const card = payload?.card || {};

    const userPrompt =
      `請用繁體中文，針對以下單張塔羅牌做深度解讀，` +
      `並分成「情感、工作、金錢、運勢」四個段落，最後給一句具體行動建議。\n\n` +
      `今日牌：${card.name || ''}（${card.englishName || ''}）${card.direction || ''}\n` +
      `牌義：${card.meaning || ''}\n\n` +
      `要求：\n` +
      `1) 要結合這張牌的正逆位語氣。\n` +
      `2) 語氣自然、像對話，不空泛。\n` +
      `3) 不要輸出 Markdown 標題符號，直接純文字段落。`;

    let lastError = '';
    let text = '';
    for (const model of candidateModels) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: '你是專業塔羅諮詢師。輸出使用繁體中文，內容具體可行，避免神祕化空話。' }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }]
            }
          ]
        })
      });

      if (!response.ok) {
        lastError = await response.text();
        continue;
      }

      const data = await response.json();
      text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('').trim() || '';
      if (text) break;
      lastError = 'Empty model response';
    }

    if (!text) {
      return json({ error: `Gemini request failed: ${lastError}` }, 502);
    }

    return json({ text });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
