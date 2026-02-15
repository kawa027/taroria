(function () {
  const IMAGE_BASE = './assets/wikimedia_rws/normalized';

  const majorArcana = [
    ['愚者', 'The Fool', '新的开始与勇气'],
    ['魔术师', 'The Magician', '主动创造与掌控资源'],
    ['女祭司', 'The High Priestess', '直觉与内在智慧'],
    ['皇后', 'The Empress', '滋养、丰盛与创造'],
    ['皇帝', 'The Emperor', '秩序、边界与责任'],
    ['教皇', 'The Hierophant', '信念、学习与传统'],
    ['恋人', 'The Lovers', '选择、关系与一致性'],
    ['战车', 'The Chariot', '意志、推进与胜利'],
    ['力量', 'Strength', '温柔坚定与自我掌控'],
    ['隐者', 'The Hermit', '独处、反思与洞察'],
    ['命运之轮', 'Wheel of Fortune', '周期转动与转折机会'],
    ['正义', 'Justice', '平衡、因果与判断'],
    ['倒吊人', 'The Hanged Man', '暂停、换位与看见新角度'],
    ['死神', 'Death', '结束旧阶段与重生'],
    ['节制', 'Temperance', '调和、节奏与整合'],
    ['恶魔', 'The Devil', '执念、束缚与欲望'],
    ['高塔', 'The Tower', '突变、打破与真相显现'],
    ['星星', 'The Star', '希望、疗愈与信任'],
    ['月亮', 'The Moon', '潜意识、迷雾与感受'],
    ['太阳', 'The Sun', '清晰、活力与成长'],
    ['审判', 'Judgement', '觉醒、召唤与复盘'],
    ['世界', 'The World', '完成、整合与新循环']
  ].map(([name, englishName, meaning]) => ({
    name,
    englishName,
    meaning,
    arcana: '大阿尔卡那'
  }));

  const suitDefs = [
    { zh: '圣杯', en: 'Cups', domain: '情感与关系' },
    { zh: '星币', en: 'Pentacles', domain: '现实与资源' },
    { zh: '宝剑', en: 'Swords', domain: '思维与决断' },
    { zh: '权杖', en: 'Wands', domain: '行动与热情' }
  ];

  const rankDefs = [
    { zh: '王牌', en: 'Ace', focus: '新的起点' },
    { zh: '二', en: 'Two', focus: '选择与平衡' },
    { zh: '三', en: 'Three', focus: '协作与扩展' },
    { zh: '四', en: 'Four', focus: '稳定与防守' },
    { zh: '五', en: 'Five', focus: '冲突与调整' },
    { zh: '六', en: 'Six', focus: '修复与流动' },
    { zh: '七', en: 'Seven', focus: '评估与坚持' },
    { zh: '八', en: 'Eight', focus: '变化与加速' },
    { zh: '九', en: 'Nine', focus: '收获与检视' },
    { zh: '十', en: 'Ten', focus: '阶段结果与压力' },
    { zh: '侍从', en: 'Page', focus: '学习与消息' },
    { zh: '骑士', en: 'Knight', focus: '执行与推进' },
    { zh: '皇后', en: 'Queen', focus: '滋养与支持' },
    { zh: '国王', en: 'King', focus: '掌控与定调' }
  ];

  const minorArcana = suitDefs.flatMap((suit) => {
    return rankDefs.map((rank) => ({
      name: `${suit.zh}${rank.zh}`,
      englishName: `${rank.en} of ${suit.en}`,
      arcana: '小阿尔卡那',
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
    if (card.arcana === '大阿尔卡那') {
      if (reversed) {
        return `逆位提示：${card.meaning}的能量暂时受阻，先放慢节奏，修正后再前进。`;
      }
      return `正位提示：${card.meaning}正在发挥作用，顺势推进你此刻最重要的事。`;
    }

    if (reversed) {
      return `逆位提示：${card.domain}出现卡点，${card.focus}需要先理顺，再做决定。`;
    }
    return `正位提示：${card.domain}主题活跃，适合围绕${card.focus}主动布局。`;
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
