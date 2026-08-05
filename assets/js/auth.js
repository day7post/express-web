// ===== 认证与导航守卫 =====
document.addEventListener("DOMContentLoaded", () => {
  renderNav();
});

function renderNav() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const user = Api.getUser();
  const isLoggedIn = Api.isLoggedIn();

  const links = [
    '<a href="index.html">首页</a>',
    '<a href="journal/list.html">日记</a>',
    '<a href="treehole/feed.html">树洞</a>',
    '<a href="create/hub.html">创作</a>',
    '<a href="safety.html">心理资源</a>',
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
