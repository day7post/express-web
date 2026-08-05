# 语滞 · 前端（Yuzhi Web）

帮助人们更好地表达自己的网站前端 —— 私密日记 / 匿名树洞 / 创作辅助。

纯 HTML/CSS/JS 多页应用（MPA），零构建工具，部署于 GitHub Pages。

## 本地开发

```bash
# 1. 启动后端（见 ../express-api/README.md）
cd ../express-api
.venv/Scripts/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# 2. 启动前端静态服务（本项目目录下）
python -m http.server 5500
# 或使用 VS Code Live Server

# 3. 打开 http://127.0.0.1:5500
```

后端地址在 `assets/js/config.js` 的 `API_BASE` 配置（默认 `http://127.0.0.1:8000/api`）。

## 部署到 GitHub Pages

1. 在 GitHub 创建 public 仓库（如 `express-web`）
2. 推送本目录代码到 main 分支
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
4. `.github/workflows/deploy.yml` 会自动构建部署
5. 访问 `https://<username>.github.io/express-web/`

部署前记得修改 `assets/js/config.js` 中的 `API_BASE` 为线上后端域名（HTTPS）。

## 页面结构

```
index.html         首页
auth.html          登录/注册
journal/           日记（列表/编辑/心情日历/成长曲线）
treehole/          树洞（广场/发帖/详情）
create/            创作（中心/模板/三行诗/写信/作品）
safety.html        心理资源
privacy.html       隐私政策
assets/            CSS 与公共 JS
```

## 合规说明

- 本平台为表达陪伴工具，非医疗/心理治疗服务
- 危机词触发心理援助热线引导（12356 / 400-161-9995）
- 树洞匿名展示，日记私有，创作私有
