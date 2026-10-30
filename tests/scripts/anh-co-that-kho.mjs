#!/usr/bin/env node
// anh-co-that-kho.mjs — hồ sơ anh-co-that-trong-ho-so, AC-9: luật ảnh mới đổi cờ lớp nhìn-thấy trên bao nhiêu hồ sơ của MỘT
// kho tiêu thụ (luật 26/09: sửa kit vì sự cố một kho phải cân trên mọi kho). So thẻ bản `main` trước vòng (git archive của
// gốc vòng, bung trong lượt) với thẻ của cây này trên từng hồ sơ có eval ui-check, rồi đếm ĐỘC LẬP — luật viết riêng ở
// đây, không gọi scripts/anh-ho-so.cjs — số hồ sơ phải đổi. Hai số lệch → thoát 1.
//
// Kho khai bằng KHO_DO hoặc — khi biến vắng hẳn — tệp cục bộ .acceptance-runs/kho-do (thư mục ấy nằm trong .gitignore);
// không có đường mặc định.
// Chỉ in SỐ và nguyên nhân gộp: kho kit công khai, tên hồ sơ và đường máy của kho tiêu thụ không vào báo cáo.
//   KHO_DO=<kho> node tests/scripts/anh-co-that-kho.mjs [--goc <gốc kit>]
// Thoát: 0 khớp · 1 lệch · 2 không có kho để đo / không dựng được bản cũ.
import { existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { cpus, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const gi = a.indexOf('--goc');
const ROOT = gi >= 0 ? path.resolve(a[gi + 1]) : path.resolve(__dirname, '..', '..');
const BASE = 'adab9a82'; // gốc vòng anh-co-that-trong-ho-so
const require = createRequire(import.meta.url);
const LNT = require(path.join(ROOT, 'lib', 'lop-nhin-thay.cjs'));

const het = (ma, chu) => { process.stderr.write(`anh-co-that-kho: ${chu}\n`); process.exit(ma); };
// KHO_DO có mặt (kể cả rỗng) thắng tệp cục bộ: ca đo đặt KHO_DO='' để chứng nhánh «không khai» trên mọi máy.
let kho = (process.env.KHO_DO || '').trim();
if (process.env.KHO_DO === undefined) { try { kho = readFileSync(path.join(ROOT, '.acceptance-runs', 'kho-do'), 'utf8').trim(); } catch (_) {} }
if (!kho || !existsSync(path.join(kho, '_acceptance'))) het(2, 'không có kho để đo — đặt KHO_DO hoặc ghi đường kho vào .acceptance-runs/kho-do');

const banCu = mkdtempSync(path.join(tmpdir(), 'anh-kho-'));
const ar = spawnSync('bash', ['-c', `git -C "${ROOT}" archive ${BASE} scripts lib skills | tar -x -C "${banCu}"`], { encoding: 'utf8' });
if (ar.status !== 0 || !existsSync(path.join(banCu, 'scripts', 'gate-card.js'))) het(2, `không dựng được bản main trước vòng (${BASE})`);
const GC = { cu: path.join(banCu, 'scripts', 'gate-card.js'), moi: path.join(ROOT, 'scripts', 'gate-card.js') };
// Thẻ mất ~15 s mỗi hồ sơ trên một kho lớn (đo 22/10: 338 lượt tuần tự = 91 phút) — các hồ sơ độc lập nên chạy song song.
const uo = (ban, slug) => new Promise(res => { const c = spawn('node', [GC[ban], '--root', kho, '--slug', slug, '--gate', '2', '--extract']); let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.resume(); c.on('close', code => { if (code !== 0) return res(null); try { res(JSON.parse(out).ui_observed || null); } catch (_) { res(null); } }); });
const SONG = Math.max(2, Math.min(8, Math.floor(cpus().length / 2)));
async function moiHoSo(ds, f) { const kq = new Array(ds.length); let i = 0; await Promise.all(Array.from({ length: SONG }, async () => { while (i < ds.length) { const k = i++; kq[k] = await f(ds[k]); } })); return kq; }

// Luật đếm độc lập: khối `- eval: <id>` của báo cáo → exit_code + screenshot; ảnh thật = tệp thường > 0 byte dưới
// evidence/ của hồ sơ (đường thật vẫn ở đó), đến từ giá trị tương đối không thư mục con, hoặc tệp evidence/<id>[-_.]*.ảnh.
const ANH = /\.(png|jpe?g|gif|webp)$/i;
function khoiBaoCao(txt) {
  const o = {}; let cur = null;
  for (const l of String(txt).split('\n')) {
    if (/^#{1,6}\s/.test(l)) { cur = null; continue; }
    const em = l.match(/^-\s+eval:\s*(\S+)/); if (em) { cur = o[em[1]] = {}; continue; }
    if (/^-\s+\w+\s*:/.test(l)) { cur = null; continue; }
    const m = cur && l.match(/^\s+(exit_code|screenshot):\s*(.*)$/); if (m) cur[m[1]] = m[2].trim();
  }
  return o;
}
function tepThat(evDir, ten) {
  try { const p = path.join(evDir, ten); const st = statSync(p); return st.isFile() && st.size > 0 && realpathSync(p).startsWith(realpathSync(evDir) + path.sep); } catch (_) { return false; }
}
function coAnhThat(hs, id, giaTri) {
  const evDir = path.join(hs, 'evidence');
  let v = giaTri; if (/^["']/.test(v)) v = v.slice(1, v.indexOf(v[0], 1) > 0 ? v.indexOf(v[0], 1) : undefined); else v = v.replace(/\s+#.*$/, '');
  v = v.trim();
  const tuongDoi = !/^(\/|~|[A-Za-z]:[\\/]|\\\\)/.test(v) && !/^(\.\/)?\.acceptance-runs[\\/]/.test(v);
  const ten = v.replace(/^\.\//, '').replace(/^evidence\//, '');
  if (tuongDoi && ten && !/[\\/:]/.test(ten) && ANH.test(ten) && tepThat(evDir, ten)) return true;
  let ds = []; try { ds = readdirSync(evDir); } catch (_) {}
  const re = new RegExp('^' + id.replace(/[^\w]/g, '') + '[-_.]', 'i');
  return ds.some(f => re.test(f) && ANH.test(f) && tepThat(evDir, f));
}

let tron = 0, hoSoUi = 0, cuCo = 0, moiCo = 0, doi = 0, duKien = 0, duAnh = 0, duAnhGiu = 0, loiDoc = 0;
const lyDo = {};
const chon = [];
for (const slug of readdirSync(path.join(kho, '_acceptance')).sort()) {
  const hs = path.join(kho, '_acceptance', slug);
  let evalsTxt, rep;
  try { evalsTxt = readFileSync(path.join(hs, 'evals.yaml'), 'utf8'); rep = readFileSync(path.join(hs, 'evidence-report.md'), 'utf8'); } catch (_) { continue; }
  const ids = LNT.uiCheckIds(LNT.parseEvalsText(evalsTxt)); if (!ids.length) continue;
  const c = LNT.classify(hs); if (!c.applicable) continue;
  chon.push({ slug, hs, ids, rep });
}
const the = await moiHoSo(chon, async h => [await uo('cu', h.slug), await uo('moi', h.slug)]);
for (const [k, { hs, ids, rep }] of chon.entries()) {
  hoSoUi++;
  const [uc, um] = the[k];
  if (!uc || !um) { loiDoc++; continue; }
  const cu = uc.present === true; const moiP = um.present === true;
  if (cu) cuCo++; if (moiP) moiCo++; if (cu && !moiP) doi++;
  for (const t of um.thieu_anh || []) lyDo[t.ly_do] = (lyDo[t.ly_do] || 0) + 1;
  const kb = khoiBaoCao(rep);
  const khai = ids.filter(i => kb[i] && String(kb[i].exit_code || '') === '0' && (kb[i].screenshot || '').replace(/^["']+|["']+$/g, '').replace(/\s+#.*$/, '').trim());
  const coAnh = khai.some(i => coAnhThat(hs, i, kb[i].screenshot));
  const coThieu = khai.some(i => !coAnhThat(hs, i, kb[i].screenshot));
  if (cu && !coAnh) duKien++;
  if (coAnh && coThieu) tron++;
  // «đủ ảnh» = ít nhất một eval khai ảnh có ảnh thật — đủ để thẻ tính đạt; kết luận của hồ sơ ấy không được đổi
  if (coAnh) { duAnh++; if (cu === moiP) duAnhGiu++; }
}
const lech = doi !== duKien || duAnhGiu !== duAnh;
console.log(`anh-co-that-kho: ho-so-ui ${hoSoUi} · cu-co-anh ${cuCo} · moi-co-anh ${moiCo} · doi ${doi} · du-kien ${duKien}`);
console.log(`khong-doi-khi-du-anh ${duAnhGiu}/${duAnh} · tron ${tron}`);
console.log('ly-do ' + (Object.keys(lyDo).length ? Object.entries(lyDo).sort().map(([k, n]) => `«${k}»:${n}`).join(' · ') : '(không)'));
if (loiDoc) console.log(`loi-doc ${loiDoc} (thẻ --extract thoát khác 0 ở một trong hai bản — không đếm)`);
process.exit(lech ? 1 : 0);
