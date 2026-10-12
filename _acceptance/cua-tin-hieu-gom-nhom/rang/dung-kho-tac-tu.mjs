#!/usr/bin/env node
// dung-kho-tac-tu.mjs — dựng KHO THỬ cho phiên gom (AC-10): tín hiệu giả của bộ vàng + hồ sơ ở đúng trạng
// thái crm lúc <trang_thai_sha> (đã giao → hợp đồng đã ký; ô cơ hội → ô; chưa có → vắng), khai cửa tín
// hiệu. KHÔNG chép bo-vang.json (đáp án) vào kho.
//
//   node dung-kho-tac-tu.mjs --bo-vang <bo-vang.json> --tin <thư mục tín hiệu> --ra <thư mục kho mới>
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

export function dungKho({ boVang, tin, ra }) {
  if (existsSync(ra) && readdirSync(ra).length) throw new Error(`thư mục kho đã có nội dung: ${ra}`);
  const bv = JSON.parse(readFileSync(boVang, 'utf8'));
  mkdirSync(path.join(ra, '_acceptance'), { recursive: true });
  const g = (...a) => execFileSync('git', ['-C', ra, ...a], { stdio: ['ignore', 'pipe', 'pipe'] });
  execFileSync('git', ['init', '-q', '-b', 'main', ra]); g('config', 'user.email', 'vang@kho.thu'); g('config', 'user.name', 'kho thu');
  writeFileSync(path.join(ra, '_acceptance', 'config.yaml'), 'schema_version: 1\ntin_hieu:\n  nguon: tin-hieu\n  gom: docs/gom\n');
  mkdirSync(path.join(ra, 'tin-hieu'), { recursive: true }); mkdirSync(path.join(ra, 'docs', 'gom'), { recursive: true });
  writeFileSync(path.join(ra, 'docs', 'gom', '.gitkeep'), '');
  for (const f of readdirSync(tin).filter(x => x.endsWith('.json')).sort()) copyFileSync(path.join(tin, f), path.join(ra, 'tin-hieu', f));
  for (const [slug, h] of Object.entries(bv.ho_so)) {
    const tt = String(h.trang_thai); const d = path.join(ra, '_acceptance', slug); const feat = JSON.stringify(h.feature || slug);
    if (tt === 'chua-co') continue;
    mkdirSync(d, { recursive: true });
    if (tt.startsWith('o-co-hoi:')) writeFileSync(path.join(d, 'opportunity.md'), `---\nschema_version: 1\nslug: ${slug}\nfeature: ${feat}\nstage: ${tt.slice('o-co-hoi:'.length)}\n---\n`);
    else {
      // Hợp đồng thật (mau/ho-so/<slug>/contract.md, cạnh bo-vang.json) khi có — phiên gom đọc tiêu chí ở đó.
      const that = path.join(path.dirname(boVang), 'ho-so', slug, 'contract.md');
      if (existsSync(that)) copyFileSync(that, path.join(d, 'contract.md'));
      else writeFileSync(path.join(d, 'contract.md'), `---\nschema_version: 1\nfeature: ${feat}\nslug: ${slug}\nstatus: ${tt}\n---\n`);
    }
  }
  g('add', '-A'); g('-c', 'commit.gpgsign=false', 'commit', '-qm', 'kho thu bo vang');
  return ra;
}

const laMain = process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname;
if (laMain) {
  const a = process.argv.slice(2); const lay = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  const boVang = lay('--bo-vang'); const tin = lay('--tin'); const ra = lay('--ra');
  if (!boVang || !tin || !ra) { process.stderr.write('dung-kho-tac-tu: cần --bo-vang --tin --ra\n'); process.exit(2); }
  try { process.stdout.write(`${dungKho({ boVang, tin, ra })}\n`); } catch (e) { process.stderr.write(`dung-kho-tac-tu: ${e.message}\n`); process.exit(2); }
}
