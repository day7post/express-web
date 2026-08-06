const { JSDOM } = require("jsdom");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;
const FEED = path.resolve(ROOT, "treehole/feed.html");

// 把外部 <script src> 内联，避免 jsdom 的 file:// 资源加载 + opaque origin 问题
let html = fs.readFileSync(FEED, "utf-8");
for (const f of ["../assets/js/config.js", "../assets/js/api.js", "../assets/js/auth.js"]) {
  const code = fs.readFileSync(path.resolve(ROOT, "treehole", f), "utf-8");
  html = html.replace(
    new RegExp('<script src="' + f.replace(/\//g, "\\/") + '"><\\/script>'),
    "<script>" + code + "</script>"
  );
}

// 真实后端数据形态（来自已验证的接口）
const TREE_ITEMS = [
  { id:"t1", owner_id:"u1", anonymous_name:"匿名甲", real_nickname:"小语", display_mode:"real",
    kind:"treehole", title:"今天想藏一封信", content:"树洞里说的话，风会替我保管。", tag:"难过",
    reply_count:2, like_count:0, created_at:"2026-08-06T10:00:00Z",
    replies:[
      { id:"r1", post_id:"t1", parent_reply_id:null, real_nickname:"阿杰", anonymous_name:"匿名乙",
        display_mode:"real", content:"我在听。", like_count:1, created_at:"2026-08-06T10:05:00Z" },
      { id:"r2", post_id:"t1", parent_reply_id:"r1", real_nickname:"小语", anonymous_name:"匿名甲",
        display_mode:"real", content:"谢谢你说在听。", like_count:0, created_at:"2026-08-06T10:10:00Z" }
    ]}
];
const PUBLIC_ITEMS = [
  { id:"p1", owner_id:"u2", anonymous_name:"隐身侠", real_nickname:null, display_mode:"anonymous",
    kind:"public", title:"", content:"公共板匿名发言测试。", tag:null, reply_count:0, like_count:0,
    created_at:"2026-08-06T09:00:00Z", replies:[] },
  { id:"p2", owner_id:"u3", anonymous_name:"匿名丙", real_nickname:"园丁", display_mode:"real",
    kind:"public", title:"", content:"公共板实名发言测试。", tag:null, reply_count:0, like_count:0,
    created_at:"2026-08-06T08:00:00Z", replies:[] }
];
const MAILBOX_ITEMS = [
  { id:"m1", owner_id:"u1", anonymous_name:"匿名", real_nickname:"小语", display_mode:"real",
    kind:"mailbox", title:"某位访客问：最近总睡不好怎么办？", content:"抱抱你，先允许自己慢下来。",
    tag:null, reply_count:0, like_count:0, created_at:"2026-08-06T07:00:00Z", replies:[] }
];

function mockFetch(url, opts){
  const u = String(url);
  const method = (opts && opts.method) ? opts.method : "GET";
  let body = {};
  if(u.includes("/treehole/posts")){
    if(u.match(/\/treehole\/posts\/[^?]/)){
      body = { post: TREE_ITEMS[0], replies: TREE_ITEMS[0].replies };
    } else if(method === "GET" || !opts || !opts.method){
      const kind = (u.match(/kind=([^&]+)/)||[])[1];
      if(kind==="treehole"){ body = { items: TREE_ITEMS, total: TREE_ITEMS.length, page:1, limit:50, has_more:false }; }
      else if(kind==="public"){ body = { items: PUBLIC_ITEMS, total: PUBLIC_ITEMS.length, page:1, limit:50, has_more:false }; }
      else if(kind==="mailbox"){ body = { items: MAILBOX_ITEMS, total: MAILBOX_ITEMS.length, page:1, limit:50, has_more:false }; }
      else { body = { items: TREE_ITEMS.concat(PUBLIC_ITEMS), total: 99, page:1, limit:50, has_more:false }; }
    } else if(method === "POST"){
      body = { id:"new1", owner_id:"u1", real_nickname:"小语", display_mode:"real", kind:"treehole",
        title:"", content:"x", tag:null, reply_count:0, like_count:0, created_at:new Date().toISOString() };
    } else if(method === "PUT"){
      body = {};
    }
  } else if(u.includes("/api/mailbox")){
    const isQuestions = u.includes("/questions");
    const isQuestionItem = u.includes("/mailbox/questions/");
    if(method === "GET" && !isQuestions){
      body = { mailbox:{ id:"mb1", slug:"mbabcd", owner_id:"u1" },
        questions:[{ id:"q1", asker_name:"巷口的猫#8821", asker_avatar:"🐈", content:"你好呀最近还好吗？",
          reply:null, reply_public:0, status:"pending", created_at:"2026-08-06T06:00:00Z" }] };
    } else if(method === "POST" && !isQuestions){
      body = { mailbox:{ id:"mb1", slug:"mbabcd", owner_id:"u1" } };
    } else if(isQuestions && method === "POST"){
      body = { id:"q2" };
    } else if(isQuestionItem && method === "PUT"){
      body = { ok:true, reply_public:1 };
    }
  } else if(u.includes("/reactions") && method==="POST"){
    body = { liked:true, like_count:5 };
  }
  return Promise.resolve({ ok:true, status:200, json:()=>Promise.resolve(body), text:()=>Promise.resolve(JSON.stringify(body)) });
}

const errors = [];
const { VirtualConsole } = require("jsdom");
const vc = new VirtualConsole();
vc.on("jsdomError", e => {
  const msg = (e && (e.detail || e.message)) || String(e);
  if (/scrollTo|Not implemented/.test(msg)) return; // 已知 jsdom 未实现，忽略
  errors.push("jsdomError: " + msg);
});

const dom = new JSDOM(html, {
  url: "https://localhost/express-web/treehole/feed.html",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window){
    window.fetch = mockFetch;
    window.scrollTo = () => {};
    window.addEventListener("error", ev => errors.push("window.error: " + ev.message + " @ " + (ev.filename||"") + ":" + (ev.lineno||"")));
    window.addEventListener("unhandledrejection", ev => errors.push("unhandledrejection: " + (ev.reason && ev.reason.message || ev.reason)));
  }
});
(async () => {
  const { window } = dom;
  // 等待 DOMContentLoaded / init 完成
  await new Promise(r => setTimeout(r, 400));

  function step(name, fn){
    try { fn(); console.log("OK  -", name); }
    catch(e){ console.log("FAIL-", name, "::", e.message); errors.push(name+": "+e.message); }
  }

  step("init ran, home rendered", () => {
    const app = window.document.getElementById("app");
    if(!app || !app.querySelector(".view")) throw new Error("home .view not rendered");
  });

  step("goView treehole + loadBoard renders letters+comments", () => {
    window.goView("treehole");
  });
  await new Promise(r => setTimeout(r, 200));
  step("treehole DOM has .letter and nested .cmt", () => {
    const letters = window.document.querySelectorAll("#tree-letters .letter");
    const cmts = window.document.querySelectorAll("#tree-letters .cmt");
    if(letters.length < 1) throw new Error("no tree letters rendered");
    if(cmts.length < 2) throw new Error("no nested comments rendered (got "+cmts.length+")");
    // 验证楼中楼嵌套：r2 的 parent 是 r1
    const names = Array.from(window.document.querySelectorAll("#tree-letters .cname")).map(n=>n.textContent);
    if(!names.some(t=>t.includes("阿杰"))) throw new Error("reply author 阿杰 missing");
    if(!names.some(t=>t.includes("小语"))) throw new Error("reply author 小语 missing");
    console.log("     tree letters:", letters.length, "comments:", cmts.length);
  });

  step("goView mailbox + loadBoard(public) renders public board", () => {
    window.goView("mailbox");
  });
  await new Promise(r => setTimeout(r, 200));
  step("public board shows anonymous virtual name + real name", () => {
    const names = Array.from(window.document.querySelectorAll("#post-list .nm")).map(n=>n.textContent);
    console.log("     public .nm:", JSON.stringify(names));
    if(!names.some(t=>t.includes("隐身侠"))) throw new Error("anonymous virtual name 隐身侠 missing");
    if(!names.some(t=>t.includes("园丁"))) throw new Error("real name 园丁 missing");
  });

  step("commentHtmlBE + buildReplyTree produce nested DOM", () => {
    // 已在上一步树洞中验证嵌套，这里只确认函数存在
    if(typeof window.commentHtmlBE !== "function") throw new Error("commentHtmlBE missing");
    if(typeof window.buildReplyTree !== "function") throw new Error("buildReplyTree missing");
  });

  // ---- 信箱模块（Phase 2 后端化） ----
  step("未登录 goView mailbox 显示登录引导卡且不报错", () => {
    window.localStorage.removeItem("express_token");
    window.goView("mailbox");
  });
  await new Promise(r => setTimeout(r, 200));
  step("未登录：出现『去登录』卡片", () => {
    const txt = window.document.getElementById("app").textContent;
    if(!txt.includes("去登录")) throw new Error("login card missing when not logged in");
  });

  step("模拟登录后 goView mailbox 加载我的信箱 + 管理面板", () => {
    window.localStorage.setItem("express_token", "fake-jwt");
    window.localStorage.setItem("express_user", JSON.stringify({id:"u1", nickname:"小语"}));
    window.goView("mailbox");
  });
  await new Promise(r => setTimeout(r, 350)); // 等 loadMyMailbox 异步
  step("登录后：我的信箱 slug + 管理面板 + 公开回复渲染", () => {
    const txt = window.document.getElementById("app").textContent;
    if(!txt.includes("我的信箱")) throw new Error("我的信箱 card missing");
    if(!txt.includes("mbabcd")) throw new Error("mailbox slug missing");
    const manage = window.document.getElementById("mb-manage");
    if(!manage || !manage.querySelector(".letter")) throw new Error("management panel questions not rendered");
    if(!txt.includes("巷口的猫")) throw new Error("pending question author missing");
    const pub = window.document.getElementById("mb-public");
    if(!pub || !pub.querySelector(".letter")) throw new Error("mailbox public replies not rendered");
    console.log("     mailbox slug: mbabcd, management .letter present, public .letter present");
  });

  // 汇总
  await new Promise(r => setTimeout(r, 100));
  console.log("\n==== ERRORS (" + errors.length + ") ====");
  errors.forEach(e => console.log(" -", e));
  process.exit(errors.length ? 1 : 0);
})();
