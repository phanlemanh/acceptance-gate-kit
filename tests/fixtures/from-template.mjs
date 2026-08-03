// Helper test: fixture PHẢI rút từ khuôn canonical (marker trong references/),
// không được tự gõ frontmatter theo khuôn bên đọc. Nếu khuôn VIẾT trôi khỏi
// khuôn MÁY ĐỌC thì mọi case dùng helper này đỏ — đó là mục đích của nó
// (hình dạng 3 của "thước phải gắn vào vật được giao").
import { readFileSync } from 'node:fs';

export function blockFromTemplate(absPath, marker) {
  const txt = readFileSync(absPath, 'utf8');
  const m = txt.match(new RegExp(`<<<${marker} -->\\n([\\s\\S]*?)<!-- ${marker}>>>`));
  if (!m) throw new Error(`không rút được khối ${marker} từ ${absPath}`);
  const body = m[1].replace(/^```yaml\n/m, '').replace(/```\s*$/m, '');
  return body.trim() + '\n';
}

export function fillTemplate(block, values) {
  let out = block;
  for (const [k, v] of Object.entries(values))
    out = out.split(`{${k}}`).join(String(v));
  return out;
}

export function fileFromTemplate(absPath, marker, values, body = '# fixture\n') {
  return fillTemplate(blockFromTemplate(absPath, marker), values) + body;
}
