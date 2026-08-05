// ===== 心之沙盘 · 数据与象征词典 =====
// 定位：借鉴沙盘疗法的投射原理，做自我探索工具（非心理治疗）
// 沙具象征：温和的、开放式的联想提示，不做任何诊断性断言

const SANDBOX_CATEGORIES = [
  {
    name: "人物",
    items: [
      { e: "👩", label: "她", symbol: "可能代表你自己，或某个重要的女性形象" },
      { e: "👨", label: "他", symbol: "可能代表权威、保护，或某个重要的男性形象" },
      { e: "👧", label: "小女孩", symbol: "内在那个纯真的、需要被照顾的部分" },
      { e: "👦", label: "小男孩", symbol: "内在那个成长的、好奇的部分" },
      { e: "👵", label: "老人", symbol: "智慧、时间的沉淀，或你敬重的长辈" },
      { e: "👪", label: "一家人", symbol: "归属感、家庭，或对「在一起」的渴望" },
      { e: "🤱", label: "怀抱", symbol: "被安抚、被温柔对待的需要" },
    ],
  },
  {
    name: "动物",
    items: [
      { e: "🦁", label: "狮子", symbol: "力量、勇气，或你想成为的那个样子" },
      { e: "🐰", label: "兔子", symbol: "敏感、温柔，有时候也代表警觉" },
      { e: "🐢", label: "乌龟", symbol: "保护自己的壳，慢下来，或安全感的需要" },
      { e: "🐺", label: "狼", symbol: "孤独、自由，或内心未被驯服的部分" },
      { e: "🐱", label: "猫", symbol: "独立、神秘，按自己节奏生活" },
      { e: "🐶", label: "狗", symbol: "忠诚、陪伴，无条件的靠近" },
      { e: "🦋", label: "蝴蝶", symbol: "蜕变、新生，从旧我到新我的过程" },
      { e: "🐟", label: "鱼", symbol: "情感深处的流动，潜意识里游动的东西" },
      { e: "🐍", label: "蛇", symbol: "转变、疗愈的古老象征，也可能让某些人不安" },
      { e: "🕊️", label: "鸽子", symbol: "和平、希望，松一口气的时刻" },
    ],
  },
  {
    name: "自然",
    items: [
      { e: "🌳", label: "树", symbol: "生长、扎根，生命力的象征" },
      { e: "🌊", label: "海", symbol: "情绪与潜意识的广阔，深不见底的部分" },
      { e: "⛰️", label: "山", symbol: "挑战、目标，或需要跨越的高度" },
      { e: "🌙", label: "月亮", symbol: "内心、夜晚、不轻易示人的部分" },
      { e: "☀️", label: "太阳", symbol: "活力、希望，照亮你的部分" },
      { e: "🌸", label: "花", symbol: "美好、绽放，也可能是容易被风吹落的部分" },
      { e: "🌧️", label: "雨", symbol: "悲伤的流动、清洗，或者一场痛快的大哭" },
      { e: "🌈", label: "彩虹", symbol: "雨后的希望，过渡与承诺" },
      { e: "⭐", label: "星星", symbol: "愿望、方向，遥远但一直在的东西" },
    ],
  },
  {
    name: "建筑",
    items: [
      { e: "🏠", label: "房子", symbol: "安全、家，内心的栖身之所" },
      { e: "🏫", label: "学校", symbol: "学习、规则，被要求的成长" },
      { e: "🏰", label: "城堡", symbol: "理想、保护，也许有点遥远的地方" },
      { e: "🌉", label: "桥", symbol: "连接、过渡，从这边到那边的路" },
      { e: "⛩️", label: "神社", symbol: "精神寄托、内心的一方净土" },
      { e: "⚓", label: "锚", symbol: "稳定、依靠，让你不漂走的重量" },
    ],
  },
  {
    name: "物件",
    items: [
      { e: "🔑", label: "钥匙", symbol: "答案、开启，或者一把还没找到的锁" },
      { e: "📖", label: "书", symbol: "知识、故事，想被讲述或想被读懂的自己" },
      { e: "✉️", label: "信", symbol: "没说出的话，或一段想重新连接的过去" },
      { e: "💡", label: "灯", symbol: "觉察、希望，黑暗中亮起的东西" },
      { e: "⏳", label: "沙漏", symbol: "时间、流逝，或正在等待的时刻" },
      { e: "🧸", label: "玩偶", symbol: "安慰、童年，一个想被抱住的部分" },
      { e: "🎁", label: "礼物", symbol: "被爱、惊喜，或者一份还没拆开的心意" },
      { e: "💍", label: "戒指", symbol: "承诺、关系，把两个名字连在一起的圆" },
    ],
  },
];

// 三步引导的问题（第二步）
const SANDBOX_REFLECTION_QUESTIONS = [
  {
    key: "first",
    question: "你最先放进沙盘的是哪个沙具？它让你想到什么？",
    placeholder: "比如：我第一个放了海，因为最近心里像海浪一样翻来覆去……",
  },
  {
    key: "distance",
    question: "有没有哪个沙具离其他沙具很远？它在你心里像谁？",
    placeholder: "可以留空，或写下你想到的",
  },
  {
    key: "voice",
    question: "如果这个沙盘会开口说话，它最想对你说什么？",
    placeholder: "试着用沙盘的声音写一句话",
  },
];

// 生成探索报告的开放式提示词（按沙具数量/类别拼装，全部为温和提问，无断言）
function buildSandboxReport(placedItems, answers) {
  const count = placedItems.length;
  const categories = new Set(placedItems.map(i => i.cat));

  let symbolLines = placedItems.map(i => {
    const name = i.label || i.e;
    return `「${i.e} ${name}」${i.symbol}`;
  });

  // 类别洞察（开放提问）
  const catTexts = [];
  if (categories.has("人物")) catTexts.push("你的沙盘里有人物——他们之间的关系，或许也在现实中上演着。");
  if (categories.has("动物")) catTexts.push("出现了动物——它们往往代表着直觉、本能，或内心那些用语言说不清的部分。");
  if (categories.has("自然")) catTexts.push("有自然元素——山、海、树、月亮，常常映照着你的情绪底色与内在力量。");
  if (categories.has("建筑")) catTexts.push("有建筑——房子、桥、城堡，往往和安全感、方向、连接有关。");
  if (categories.has("物件")) catTexts.push("还有一些物件——它们像线索，指向你最近在意的事。");

  const report = [
    `你选择了 ${count} 个沙具，搭出了属于自己的小小世界。`,
    ``,
    `▎你的沙具与它们可能的意义`,
    ...symbolLines.map(l => `· ${l}`),
    ``,
    `▎沙盘在说些什么`,
    ...catTexts,
    ``,
    `▎留给你慢慢想的问题`,
    `1. 这个沙盘里，最让你有感觉的是哪个沙具？为什么是它？`,
    `2. 如果拿走一个沙具，你会拿走哪个？剩下的画面让你安心吗？`,
    `3. 你最想让谁走进这个沙盘？TA 会站在哪里？`,
    `4. 沙盘里缺了什么？那个「缺席的东西」对你意味着什么？`,
    ``,
    `▎想对自己说的话`,
    `这个沙盘是你内心的一个缩影，没有对错。它不需要被谁评判，只需要被你自己看见。`,
    answers.first ? `你提到：「${answers.first}」。这份觉察本身，就已经是向内的第一步。` : ``,
    answers.voice ? `沙盘想对你说：「${answers.voice}」——把它记下来，也许过段时间再看，会有新的理解。` : ``,
  ].filter(l => l !== "");

  return report.join("\n");
}

// 合规提示文本
const SANDBOX_DISCLAIMER =
  "心之沙盘借鉴沙盘疗法的「投射」原理，帮助你用沙具表达和探索内心，是一种自我探索工具，不构成心理治疗或诊断。若你正经历持续的情绪困扰，请寻求专业帮助。";
