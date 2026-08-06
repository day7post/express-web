// ===== 认证与导航守卫 =====
document.addEventListener("DOMContentLoaded", () => {
  renderNav();
});

// 根据当前页面深度生成相对前缀，保证子目录页面（journal/ treehole/ create/ tests/）顶部导航也能正确跳转
function navBase() {
  const segs = location.pathname.split("/").filter(Boolean);
  segs.pop(); // 去掉文件名
  return segs.length ? "../".repeat(segs.length) : "";
}

function renderNav() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const user = Api.getUser();
  const isLoggedIn = Api.isLoggedIn();

  const base = navBase();
  const links = [
    '<a href="' + base + 'index.html">首页</a>',
    '<a href="' + base + 'journal/list.html">日记</a>',
    '<a href="' + base + 'drift/index.html">信箱</a>',
    '<a href="' + base + 'create/hub.html">创作</a>',
    '<a href="' + base + 'tests/hub.html">心理测试</a>',
    '<a href="' + base + 'safety.html">心理资源</a>',
  ];

  let userHtml;
  if (isLoggedIn && user) {
    userHtml = `<span class="nav-user">你好，${user.nickname}</span>
      <button class="btn btn-soft btn-sm" onclick="logout()">退出</button>`;
  } else {
    userHtml = '<a href="auth.html" class="btn btn-sm">登录 / 注册</a>';
  }
  nav.innerHTML = links.join("") + userHtml;
}

function requireLogin() {
  if (!Api.isLoggedIn()) {
    location.href = "auth.html?next=" + encodeURIComponent(location.pathname + location.search);
    return false;
  }
  return true;
}

function logout() {
  Api.clearAuth();
  location.href = "index.html";
}

// 通用错误提示
function showError(el, msg) {
  if (!el) return;
  el.innerHTML = `<div class="alert alert-error">${msg}</div>`;
}
function showSuccess(el, msg) {
  if (!el) return;
  el.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}
function clearAlert(el) { if (el) el.innerHTML = ""; }
