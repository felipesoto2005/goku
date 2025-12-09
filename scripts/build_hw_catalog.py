import os, json, unicodedata

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HW_ROOT = os.path.join(ROOT, 'Zona-Hardware')

CATEGORY_MAP = {
  'cpu': 'procesadores',
  'gpu': 'tarjetas-graficas',
  'almacenamiento': 'almacenamiento',
  'monitores': 'monitores',
  'perifericos': 'perifericos',
  'Gabinetes': 'gabinetes',
  'fuente-de-poder': 'fuentes',
  'ram': 'memoria',
  'motherboard': 'motherboard',
}

IMG_EXTS = {'.jpg','.jpeg','.png','.webp','.avif','.gif'}

def list_subdirs(d):
  try:
    return [os.path.join(d, x) for x in os.listdir(d) if os.path.isdir(os.path.join(d,x))]
  except: return []

def read_first_txt(d):
  try:
    for f in os.listdir(d):
      if f.lower().endswith('.txt'):
        with open(os.path.join(d,f), 'r', encoding='utf-8', errors='ignore') as fh:
          return fh.read().strip()
  except: pass
  return ''

def first_image(d):
  try:
    for f in os.listdir(d):
      if os.path.splitext(f)[1].lower() in IMG_EXTS:
        return f
  except: pass
  return ''

def slugify(s):
  s = unicodedata.normalize('NFKD', str(s))
  s = ''.join(c for c in s if not unicodedata.combining(c))
  out = []
  prev_dash = False
  for ch in s:
    if ch.isalnum():
      out.append(ch.lower())
      prev_dash = False
    else:
      if not prev_dash:
        out.append('-')
        prev_dash = True
  slug = ''.join(out).strip('-')
  return slug[:60]

def rel_path(p):
  return os.path.relpath(p, ROOT).replace(os.sep, '/')

def collect_category(cat_dir, cat_key):
  items = []
  slug_cat = CATEGORY_MAP.get(cat_key, cat_key)
  first_level = list_subdirs(cat_dir)
  for d in first_level:
    subdirs = list_subdirs(d)
    if subdirs and os.path.basename(cat_dir) == 'monitores':
      for sub in subdirs:
        img = first_image(sub)
        txt = read_first_txt(sub)
        if not img and not txt:
          continue
        title = os.path.splitext(img)[0] if img else (txt.split('\n')[0] or os.path.basename(sub))
        items.append({
          'id': f"{slug_cat}-{slugify(title)}",
          'title': title,
          'category': slug_cat,
          'image': rel_path(os.path.join(sub, img)) if img else '',
          'desc': txt,
        })
    else:
      img = first_image(d)
      txt = read_first_txt(d)
      if not img and not txt:
        continue
      title = os.path.splitext(img)[0] if img else (txt.split('\n')[0] or os.path.basename(d))
      items.append({
        'id': f"{slug_cat}-{slugify(title)}",
        'title': title,
        'category': slug_cat,
        'image': rel_path(os.path.join(d, img)) if img else '',
        'desc': txt,
      })
  return items

def build():
  items = []
  for cat_dir_name in CATEGORY_MAP.keys():
    cat_dir = os.path.join(HW_ROOT, cat_dir_name)
    if not os.path.exists(cat_dir):
      continue
    items.extend(collect_category(cat_dir, cat_dir_name))
  data = { 'items': items }
  out_file = os.path.join(HW_ROOT, 'catalogo.json')
  with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
  print(f"Escrito catálogo con {len(items)} items en {out_file}")

if __name__ == '__main__':
  build()
