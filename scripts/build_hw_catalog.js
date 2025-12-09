const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const hwRoot = path.join(root, 'Zona-Hardware');

const CATEGORY_MAP = new Map([
  ['cpu', 'procesadores'],
  ['gpu', 'tarjetas-graficas'],
  ['almacenamiento', 'almacenamiento'],
  ['monitores', 'monitores'],
  ['perifericos', 'perifericos'],
  ['Gabinetes', 'gabinetes'],
  ['fuente-de-poder', 'fuentes'],
  ['ram', 'memoria'],
  ['motherboard', 'motherboard'],
]);

function listSubdirs(dir){
  try{
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(dir, d.name));
  }catch(e){ return []; }
}

function readFirstTxt(dir){
  const txts = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.txt'));
  if(txts.length === 0) return '';
  try{ return fs.readFileSync(path.join(dir, txts[0]), 'utf8').trim(); }catch(e){ return ''; }
}

function firstImage(dir){
  const exts = ['.jpg','.jpeg','.png','.webp','.avif','.gif'];
  const files = fs.readdirSync(dir);
  const found = files.find(f => exts.includes(path.extname(f).toLowerCase()));
  return found ? found : '';
}

function slugify(str){
  return String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-zA-Z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .toLowerCase();
}

function relPath(p){
  return path.relative(root, p).split(path.sep).join('/');
}

function collectCategory(catDir, catKey){
  const out = [];
  const slugCat = CATEGORY_MAP.get(catKey) || catKey;
  // Algunos tienen subcarpetas especiales (p.ej. monitores/monitores (...))
  // Tomamos todas las carpetas hijas y también carpetas hijas de segundo nivel si la primera capa es un agrupador.
  const firstLevel = listSubdirs(catDir);
  for(const dir of firstLevel){
    const subdirs = listSubdirs(dir);
    if(subdirs.length > 0 && path.basename(catDir) === 'monitores'){
      // Caso monitores: monitores/monitores (...)
      for(const sub of subdirs){
        const img = firstImage(sub);
        const txt = readFirstTxt(sub);
        if(!img && !txt) continue;
        const title = img ? path.basename(img, path.extname(img)) : (txt.split('\n')[0] || path.basename(sub));
        out.push({
          id: `${slugCat}-${slugify(title).slice(0,60)}`,
          title: title,
          category: slugCat,
          image: relPath(path.join(sub, img)),
          desc: txt
        });
      }
    } else {
      const img = firstImage(dir);
      const txt = readFirstTxt(dir);
      if(!img && !txt) continue;
      const title = img ? path.basename(img, path.extname(img)) : (txt.split('\n')[0] || path.basename(dir));
      out.push({
        id: `${slugCat}-${slugify(title).slice(0,60)}`,
        title: title,
        category: slugCat,
        image: relPath(path.join(dir, img)),
        desc: txt
      });
    }
  }
  return out;
}

function build(){
  const items = [];
  for(const [catDirName] of CATEGORY_MAP){
    const catDir = path.join(hwRoot, catDirName);
    if(!fs.existsSync(catDir)) continue;
    const collected = collectCategory(catDir, catDirName);
    items.push(...collected);
  }
  const json = { items };
  const outFile = path.join(hwRoot, 'catalogo.json');
  fs.writeFileSync(outFile, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Escrito catálogo con ${items.length} items en ${outFile}`);
}

build();
