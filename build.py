"""Genera index.html (autocontenido) a partir de src/template.html, incrustando las fotos de assets/."""
import base64, pathlib, re

root = pathlib.Path(__file__).parent
tpl = (root / "src" / "template.html").read_text(encoding="utf-8")

def img(m):
    data = (root / "assets" / f"{m.group(1)}.jpg").read_bytes()
    return "data:image/jpeg;base64," + base64.b64encode(data).decode()

body = re.sub(r"\{\{IMG:(\w+)\}\}", img, tpl)
(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "artifact.html").write_text(body, encoding="utf-8")
page = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '</head>\n<body>\n' + body + '\n</body>\n</html>\n')
(root / "index.html").write_text(page, encoding="utf-8")
print("index.html", len(page) // 1024, "KB")
