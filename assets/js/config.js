// ===== API 地址单点配置 =====
// 线上：Cloudflare Tunnel 免费 HTTPS 隧道（后端在本机运行）
// 注意：隧道地址重启后会变，需要同步更新这里并重新推送
const API_BASE = "https://handed-poultry-punk-africa.trycloudflare.com/api";

// 站点显示名（定名后替换）
const SITE_NAME = "语滞";
const SITE_SLOGAN = "有些话说不出口，不代表不想说。";
const SITE_DESC = "语滞 —— 一个帮助你把心里话好好说出来的空间：私密日记、匿名树洞、创作辅助。";

// 心理援助热线（危机干预引导用）
const CRISIS_HOTLINES = [
  { name: "全国统一心理援助热线", number: "12356" },
  { name: "希望24热线（北京）", number: "400-161-9995" },
];
