"""批量替换前端站点名：表达空间→语滞，ExpressSpace→Yuzhi"""
import pathlib

root = pathlib.Path(r"D:\Creation\express-web")
count = 0
for f in root.rglob("*"):
    if f.is_file() and f.suffix in (".html", ".css", ".md", ".js"):
        text = f.read_text(encoding="utf-8")
        new = (
            text.replace("表达空间 ExpressSpace", "语滞 Yuzhi")
            .replace("表达空间", "语滞")
            .replace("ExpressSpace", "Yuzhi")
        )
        if new != text:
            f.write_text(new, encoding="utf-8")
            count += 1
            print(f"已更新: {f.relative_to(root)}")
print(f"共更新 {count} 个文件")
