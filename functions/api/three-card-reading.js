export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return json({ error: 'Missing GEMINI_API_KEY' }, 500);
    }
    const preferredModel = stripModelPrefix(context.env.GEMINI_MODEL || 'gemini-2.0-flash');
    const discoveredModels = await listGenerateModels(apiKey);
    const candidateModels = dedupe([
      preferredModel,
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      ...discoveredModels
    ]);

    const payload = await context.request.json();
    const past = payload?.past || {};
    const present = payload?.present || {};
    const future = payload?.future || {};

    const userPrompt =
      `请用简体中文，针对以下三张塔罗牌做深度解读，` +
      `并且分成「情感、工作、金钱、运势」四个段落，最后再给一句总结建议。\n\n` +
      `过去：${past.name || ''}（${past.englishName || ''}）${past.direction || ''}\n` +
      `现在：${present.name || ''}（${present.englishName || ''}）${present.direction || ''}\n` +
      `未来：${future.name || ''}（${future.englishName || ''}）${future.direction || ''}\n\n` +
      `补充牌义：\n` +
      `过去牌义：${past.meaning || ''}\n` +
      `现在牌义：${present.meaning || ''}\n` +
      `未来牌义：${future.meaning || ''}\n\n` +
      `要求：\n` +
      `1) 结合三张牌彼此关系，不要只逐张解释。\n` +
      `2) 语气要自然、像占卜师对话，但避免空泛。\n` +
      `3) 不要输出 Markdown 标题符号，直接纯文字段落。\n` +
      `4) 必须使用简体中文，不要使用繁体字。\n` +
      `5) 第一行直接进入解牌，不要任何问候语或寒暄，例如“你好”“欢迎”“让我们来看看”。`;

    let lastError = '';
    let text = '';
    for (const model of candidateModels) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${stripModelPrefix(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: '你是专业塔罗咨询师。输出必须使用简体中文，内容具体、可行、避免神秘化空话。禁止任何开场问候或寒暄，第一句必须直接解牌。' }]
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

    return json({ text: toSimplifiedText(text) });
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

async function listGenerateModels(apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
  if (!response.ok) return [];
  const data = await response.json();
  const models = data?.models || [];
  return models
    .filter((m) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map((m) => stripModelPrefix(String(m?.name || '')))
    .filter(Boolean);
}

function stripModelPrefix(name) {
  return String(name).replace(/^models\//, '');
}

function dedupe(list) {
  return [...new Set(list.filter(Boolean))];
}

function toSimplifiedText(text) {
  if (!text) return '';
  const map = {
    '體': '体', '臺': '台', '萬': '万', '與': '与', '為': '为', '這': '这', '個': '个',
    '來': '来', '時': '时', '會': '会', '裡': '里', '後': '后', '們': '们', '說': '说',
    '聽': '听', '讀': '读', '關': '关', '選': '选', '擇': '择', '點': '点', '擊': '击',
    '頁': '页', '運': '运', '勢': '势', '過': '过', '現': '现', '祕': '秘', '聖': '圣',
    '寶': '宝', '權': '权', '幣': '币', '資': '资', '訊': '讯', '開': '开', '門': '门'
  };
  return Array.from(text).map((ch) => map[ch] || ch).join('');
}
