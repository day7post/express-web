// ===== 内容安全：危机词引导 + 敏感词预检 =====
// 在前端输入失焦/提交时调用 checkTextSafety，命中危机词弹出安抚卡片

function renderCrisisCard() {
  const hotlines = CRISIS_HOTLINES.map(h =>
    `<div class="hotline">${h.name}：${h.number}</div>`
  ).join("");
  return `
    <div class="crisis-card">
      <h3>🌱 你并不孤单</h3>
      <p>从你写下的话里，我们感受到了你的沉重。这一刻也许很难，但请先停下来，深呼吸。</p>
      <p>如果你正处于极度痛苦中，或有过伤害自己的想法，请一定联系专业支持——他们一直在等你：</p>
      ${hotlines}
      <p class="mt-16" style="font-size:13px;color:var(--text-faint)">
        紧急情况请拨打 120 或前往最近的医院。<br>
        这里的内容已安全保存，不会有人因此评判你。
      </p>
      <div class="mt-16" style="display:flex;gap:10px">
        <a href="safety.html" class="btn">查看心理资源</a>
        <button class="btn btn-ghost" onclick="this.closest('.crisis-card').style.display='none'">我没事，继续</button>
      </div>
    </div>`;
}

// 防抖预检：返回 Promise<{action, crisis, sensitive}>
let _checkTimer = null;
function precheckContent(text, containerId) {
  clearTimeout(_checkTimer);
  return new Promise((resolve) => {
    if (!text || !text.trim()) { resolve({ action: "ok" }); return; }
    _checkTimer = setTimeout(async () => {
      try {
        const res = await Api.post("/content/check", { text, source: "frontend" });
        if (res.action === "warn" && containerId) {
          const el = document.getElementById(containerId);
          if (el && !el.querySelector(".crisis-card")) {
            el.insertAdjacentHTML("afterbegin", renderCrisisCard());
          }
        }
        resolve(res);
      } catch (e) {
        // block 由后端 400 返回，这里展示错误
        if (containerId) showError(document.getElementById(containerId), e.detail || "内容检查未通过");
        resolve({ action: "block", sensitive: [e.detail] });
      }
    }, 600);
  });
}
