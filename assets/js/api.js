// ===== fetch 封装：自动携带 token、统一错误处理 =====
const Api = {
  TOKEN_KEY: "express_token",
  USER_KEY: "express_user",

  getToken() { return localStorage.getItem(this.TOKEN_KEY); },
  getUser() {
    try { return JSON.parse(localStorage.getItem(this.USER_KEY) || "null"); }
    catch { return null; }
  },
  setAuth(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },
  clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },
  isLoggedIn() { return !!this.getToken(); },

  async request(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let resp;
    try {
      resp = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch (e) {
      throw { status: 0, detail: "网络连接失败，请检查后端服务是否启动" };
    }

    if (resp.status === 401) {
      // 未登录或 token 过期：子目录页面需用 ../ 回到根目录的 auth.html，否则会 404
      if (!location.pathname.endsWith("auth.html")) {
        const base = (typeof navBase === "function") ? navBase() : "";
        location.href = base + "auth.html?next=" + encodeURIComponent(location.pathname + location.search);
      }
      throw { status: 401, detail: "请先登录" };
    }

    let data = null;
    try { data = await resp.json(); } catch { /* 无 JSON 响应 */ }

    if (!resp.ok) {
      throw { status: resp.status, detail: (data && data.detail) || `请求失败（${resp.status}）` };
    }
    return data;
  },

  get(path) { return this.request(path); },
  post(path, body) { return this.request(path, { method: "POST", body: JSON.stringify(body) }); },
  put(path, body) { return this.request(path, { method: "PUT", body: JSON.stringify(body) }); },
  del(path) { return this.request(path, { method: "DELETE" }); },
};

// 相对时间
function relativeTime(isoStr) {
  if (!isoStr) return "";
  const t = new Date(isoStr);
  const diff = Date.now() - t.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} 天前`;
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

// 心情 emoji
const MOOD_EMOJI = { 1: "😞", 2: "😔", 3: "😐", 4: "🙂", 5: "😊" };
function moodEmoji(level) { return MOOD_EMOJI[level] || ""; }
