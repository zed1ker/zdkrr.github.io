#!/usr/bin/env python3
"""Сборка без зависимостей: python3 build.py. Запуск из любой папки."""
from pathlib import Path
import base64
root=Path(__file__).resolve().parent
html=(root/'src/template.html').read_text(encoding='utf-8')
font=base64.b64encode((root/'assets/fonts/Unbounded.ttf').read_bytes()).decode()
css=(root/'src/styles.css').read_text(encoding='utf-8').replace("../assets/fonts/Unbounded.ttf",'data:font/ttf;base64,'+font)
html=html.replace('<!-- INLINE_STYLE -->','<style>\n'+css+'\n</style>')
html=html.replace('<!-- INLINE_SCRIPT -->','<script>\n'+(root/'src/script.js').read_text(encoding='utf-8')+'\n</script>')
(root/'index.html').write_text(html.replace('<!-- CONFIG_SCRIPT -->','<script src="config.js"></script>'),encoding='utf-8')
preview=html.replace('<!-- CONFIG_SCRIPT -->','<script>\n'+(root/'config.js').read_text(encoding='utf-8')+'\n</script>')
# Preview embeds future local photos too, so it remains a truly independent file.
for photo in (root/'photos').glob('*'):
 if photo.suffix.lower() in ['.jpg','.jpeg','.png','.webp','.avif']:
  mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif'}[photo.suffix.lower()]
  uri='data:'+mime+';base64,'+base64.b64encode(photo.read_bytes()).decode()
  # Data images are explicitly enabled only in the generated standalone preview.
  preview=preview.replace('photos/'+photo.name,uri)
preview=preview.replace("if(/^photos\\/", "if(src.startsWith('data:image/') || /^photos\\/")
(root/'offline-preview.html').write_text(preview,encoding='utf-8')
print('Built index.html + offline-preview.html')
