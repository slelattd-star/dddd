"""Genera index.html (autocontenido) a partir de src/template.html, incrustando las fotos de assets/."""
import base64, pathlib, re

root = pathlib.Path(__file__).parent
tpl = "".join((root / "src" / f).read_text(encoding="utf-8") for f in ("head.html", "app.html", "models.js", "engine.js"))

def img(m):
    path = next((root / "assets").glob(m.group(1) + ".*"))
    mime = "image/png" if path.suffix == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

body = re.sub(r"\{\{IMG:(\w+)\}\}", img, tpl)
(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "artifact.html").write_text(body, encoding="utf-8")
page = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '</head>\n<body>\n' + body + '\n</body>\n</html>\n')
(root / "index.html").write_text(page, encoding="utf-8")
print("index.html", len(page) // 1024, "KB")
