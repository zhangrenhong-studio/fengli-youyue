#!/usr/bin/env python3
"""Rebuild the zero-network single-file version from canonical source files."""
from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'style.css').read_text(encoding='utf-8')
data = (ROOT / 'data.js').read_text(encoding='utf-8')
app = (ROOT / 'app.js').read_text(encoding='utf-8')
# Isolate storage so legacy multi-file asset paths cannot leak into this export.
app = app.replace("const KEY='fengli-h5-v1';", "const KEY='fengli-h5-standalone-v1';")
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
html = html.replace('<script src="data.js"></script>', '<script>' + data.replace('</script', '<\\/script') + '</script>')
html = html.replace('<script src="app.js"></script>', '<script>' + app.replace('</script', '<\\/script') + '</script>')
cache = {}
def inline(match):
    path = match.group(0)
    if path not in cache:
        image = (ROOT / path).read_bytes()
        cache[path] = 'data:image/jpeg;base64,' + base64.b64encode(image).decode('ascii')
    return cache[path]
html = re.sub(r'assets/routes/[a-z0-9-]+\.jpg', inline, html)
assert 'assets/routes/' not in html
assert not re.search(r'<(?:script|link)[^>]+(?:src|href)=["\'](?:https?:|(?:app|data)\.js|style\.css)', html)
output = ROOT / 'standalone.html'
output.write_text(html, encoding='utf-8')
print(f'Exported {output.name}: {output.stat().st_size:,} bytes; {len(cache)} unique images embedded; zero external dependencies.')
