(function () {
  const IMAGE_BASE = './assets/wikimedia_rws/normalized';

  const majorArcana = [
    ['愚者', 'The Fool', '新的開始與勇氣'],
    ['魔術師', 'The Magician', '主動創造與掌控資源'],
    ['女祭司', 'The High Priestess', '直覺與內在智慧'],
    ['皇后', 'The Empress', '滋養、豐盛與創造'],
    ['皇帝', 'The Emperor', '秩序、邊界與責任'],
    ['教皇', 'The Hierophant', '信念、學習與傳統'],
    ['戀人', 'The Lovers', '選擇、關係與一致性'],
    ['戰車', 'The Chariot', '意志、推進與勝利'],
    ['力量', 'Strength', '溫柔堅定與自我掌控'],
    ['隱者', 'The Hermit', '獨處、反思與洞察'],
    ['命運之輪', 'Wheel of Fortune', '週期轉動與轉折機會'],
    ['正義', 'Justice', '平衡、因果與判斷'],
    ['倒吊人', 'The Hanged Man', '暫停、換位與看見新角度'],
    ['死神', 'Death', '結束舊階段與重生'],
    ['節制', 'Temperance', '調和、節奏與整合'],
    ['惡魔', 'The Devil', '執念、束縛與欲望'],
    ['高塔', 'The Tower', '突變、打破與真相顯現'],
    ['星星', 'The Star', '希望、療癒與信任'],
    ['月亮', 'The Moon', '潛意識、迷霧與感受'],
    ['太陽', 'The Sun', '清晰、活力與成長'],
    ['審判', 'Judgement', '覺醒、召喚與復盤'],
    ['世界', 'The World', '完成、整合與新循環']
  ].map(([name, englishName, meaning]) => ({
    name,
    englishName,
    meaning,
    arcana: '大阿爾卡那'
  }));

  const suitDefs = [
    { zh: '聖杯', en: 'Cups', domain: '情感與關係' },
    { zh: '星幣', en: 'Pentacles', domain: '現實與資源' },
    { zh: '寶劍', en: 'Swords', domain: '思維與決斷' },
    { zh: '權杖', en: 'Wands', domain: '行動與熱情' }
  ];

  const rankDefs = [
    { zh: '王牌', en: 'Ace', focus: '新的起點' },
    { zh: '二', en: 'Two', focus: '選擇與平衡' },
    { zh: '三', en: 'Three', focus: '協作與擴展' },
    { zh: '四', en: 'Four', focus: '穩定與防守' },
    { zh: '五', en: 'Five', focus: '衝突與調整' },
    { zh: '六', en: 'Six', focus: '修復與流動' },
    { zh: '七', en: 'Seven', focus: '評估與堅持' },
    { zh: '八', en: 'Eight', focus: '變化與加速' },
    { zh: '九', en: 'Nine', focus: '收穫與檢視' },
    { zh: '十', en: 'Ten', focus: '階段結果與壓力' },
    { zh: '侍從', en: 'Page', focus: '學習與消息' },
    { zh: '騎士', en: 'Knight', focus: '執行與推進' },
    { zh: '皇后', en: 'Queen', focus: '滋養與支持' },
    { zh: '國王', en: 'King', focus: '掌控與定調' }
  ];

  const minorArcana = suitDefs.flatMap((suit) => {
    return rankDefs.map((rank) => ({
      name: `${suit.zh}${rank.zh}`,
      englishName: `${rank.en} of ${suit.en}`,
      arcana: '小阿爾卡那',
      suit: suit.zh,
      suitEn: suit.en,
      domain: suit.domain,
      focus: rank.focus
    }));
  });

  // Order must match downloaded RWS image files: 01..22 majors, 23..36 Cups,
  // 37..50 Pentacles, 51..64 Swords, 65..78 Wands.
  const fullDeck = [...majorArcana, ...minorArcana].map((card, index) => ({
    ...card,
    image: `${IMAGE_BASE}/${String(index + 1).padStart(2, '0')}.jpg`
  }));

  function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function buildMeaning(card, reversed) {
    if (card.arcana === '大阿爾卡那') {
      if (reversed) {
        return `逆位提示：${card.meaning}的能量暫時受阻，先放慢節奏，修正後再前進。`;
      }
      return `正位提示：${card.meaning}正在發揮作用，順勢推進你此刻最重要的事。`;
    }

    if (reversed) {
      return `逆位提示：${card.domain}出現卡點，${card.focus}需要先理順，再做決定。`;
    }
    return `正位提示：${card.domain}主題活躍，適合圍繞${card.focus}主動佈局。`;
  }

  function withOrientation(card) {
    const reversed = Math.random() < 0.5;
    return {
      ...card,
      direction: reversed ? '逆位' : '正位',
      reversed,
      meaning: buildMeaning(card, reversed)
    };
  }

  function draw(count) {
    const safeCount = Math.max(1, Math.min(count, fullDeck.length));
    return shuffle(fullDeck).slice(0, safeCount).map(withOrientation);
  }

  window.TAROT = {
    size: fullDeck.length,
    cardBackImage: `${IMAGE_BASE}/back.jpg`,
    draw
  };
})();
