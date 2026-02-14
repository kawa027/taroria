export async function onRequestPost(context) {
  try {
    const apiKey = context.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ error: 'Missing OPENAI_API_KEY' }, 500);
    }

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

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              '你是專業塔羅諮詢師。輸出使用繁體中文，內容具體可行，避免神祕化空話。'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return json({ error: `OpenAI request failed: ${errText}` }, 502);
    }

    const data = await response.json();
    const text = data?.output_text?.trim();
    if (!text) {
      return json({ error: 'Empty model response' }, 502);
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
