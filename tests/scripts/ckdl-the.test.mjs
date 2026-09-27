// ckdl-the.test.mjs — hồ sơ cham-khong-tu-dot-luot, làn B (thẻ người ký). Tên ca = tên AC.
// Fixture do code sinh (tests/scripts/gate-fixture.mjs — cùng khuôn gate-card đòi); bản sao để
// phá thử chép TRỌN scripts/ + lib/ (P150), không chép tay danh sách tệp.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SRC, mkWs, card, extract, G1 } from './gate-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const FL_SKILL = path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const TMP = mkdtempSync(path.join(tmpdir(), 'ckdl-the-'));
let pass = 0; let fail = 0;
const ok = (n, m = '') => { pass += 1; console.log(`PASS: ${n} ${m}`.trimEnd() + ' '); };
const bad = (n, m) => { fail += 1; console.log(`FAIL: ${n} — ${m}`); };
const CHON = [...process.argv.slice(2), ...(process.env.CKDL_CASES ? process.env.CKDL_CASES.split(',') : [])];
const want = n => !CHON.length || CHON.some(c => n === c || n.startsWith(c + '-'));
const ca = async (n, fn) => { if (!want(n)) return; try { ok(n, (await fn()) || ''); } catch (e) { bad(n, String(e && e.message || e).split('\n').slice(0, 6).join(' | ')); } };
const assert = (c, m) => { if (!c) throw new Error(m); };

// Bản sao gate-card để phá thử: chép TRỌN scripts/ + lib/ (P150), rồi thay nguồn gate-card.
const banSao = (fn) => { const s = mkdtempSync(path.join(TMP, 'gc-')); cpSync(path.join(KIT, 'scripts'), path.join(s, 'scripts'), { recursive: true }); cpSync(path.join(KIT, 'lib'), path.join(s, 'lib'), { recursive: true }); writeFileSync(path.join(s, 'scripts', 'gate-card.js'), fn(SRC)); return path.join(s, 'scripts', 'gate-card.js'); };
const chayGc = (gc, root, slug, extra = []) => spawnSync('node', [gc, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });
const OOS8 = Array.from({ length: 8 }, (_, i) => `- Mục bỏ ngoài số ${i + 1} — lý do ${i + 1}`).join('\n');
const hoSo = (probe, oos = OOS8) => { const f = G1(probe); f['contract.md'] = f['contract.md'].replace(/## Out of scope[\s\S]*?(?=\n## |$)/, `## Out of scope\n\n${oos}\n`); return f; };

// ── Task B1 — mục «không làm» đủ từng dòng, id OOS-n (AC-6) ──
const liKhong = html => { const m = html.match(/Sẽ KHÔNG làm \/ sẽ chặn<\/div><div class="grp gnot">([\s\S]*?)<\/div>/); return m ? [...m[1].matchAll(/<p class="li">([\s\S]*?)<\/p>/g)].map(x => x[1]) : []; };
await ca('CK-AC6', async () => {
  const r = mkWs('g', hoSo(null));
  const x = extract(r, 'g');
  assert(Array.isArray(x.scope) && x.scope.length === 8 && x.scope.every((s, i) => s.id === `OOS-${i + 1}`), `scope: ${JSON.stringify(x.scope).slice(0, 200)}`);
  const pl = { wont_do: x.scope.map(s => ({ id: s.id, p: `Câu dịch ${s.id}` })) };
  const pf = path.join(r, 'pl.json'); writeFileSync(pf, JSON.stringify(pl));
  const li = liKhong(card(r, 'g', ['--plain', pf]).stdout);
  const thieu = x.scope.filter(s => !li.some(t => t.includes(`Câu dịch ${s.id}`))).map(s => s.id);
  assert(!thieu.length && li.length === 8, `thieu muc ${thieu.join(',')} (li ${li.length})`);
  return '(8 id · 8 cau dich · round-trip)';
});
await ca('CK-AC6-crm', async () => {
  const r = mkWs('g', hoSo(null));
  const pl = { scope_plain: 'Cập nhật trong chat, toàn cảnh và họp tuần…', wont_do: [1, 2, 3, 4, 6].map(n => ({ id: `OOS-${n}`, p: `Dịch crm ${n}` })) };
  const pf = path.join(r, 'pl.json'); writeFileSync(pf, JSON.stringify(pl));
  const html = card(r, 'g', ['--plain', pf]).stdout;
  const li = liKhong(html).filter(t => !t.startsWith('Hoãn/cắt'));
  assert(li.length === 8, `hinh crm: ${li.length} muc (khai 8)`);
  assert([1, 2, 3, 4, 6].every(n => li.some(t => t.includes(`Dịch crm ${n}`))) && [5, 7, 8].every(n => li.some(t => t.includes(`Mục bỏ ngoài số ${n}`))), 'sai chu tung muc');
  assert(!html.includes('dòng dịch không khớp mục nào'), 'hinh crm khong duoc co co');
  return '(8 muc · 5 dich + 3 chu hop dong · 0 co)';
});
await ca('CK-AC6-co-vang', async () => {
  const r = mkWs('g', hoSo(null));
  const pf = path.join(r, 'pl.json');
  writeFileSync(pf, JSON.stringify({ wont_do: [{ id: 'OOS-1', p: 'a' }, { id: 'OOS-99', p: 'b' }, { id: 'AC-99', p: 'c' }] }));
  const h = card(r, 'g', ['--plain', pf]).stdout;
  const co = (h.match(/dòng dịch không khớp mục nào: [^<]*/g) || []);
  assert(co.length === 2 && co.some(c => c.includes('OOS-99')) && co.some(c => c.includes('AC-99')), `co: ${co.join(' | ')}`);
  writeFileSync(pf, JSON.stringify({ wont_do: [{ id: 'OOS-1', p: 'a' }] }));
  assert(!card(r, 'g', ['--plain', pf]).stdout.includes('dòng dịch không khớp mục nào'), 'doi chung: co 0 id la ma van co co');
  return '(2 co · doi chung 0 co)';
});
await ca('CK-AC6-dot-bien', async () => {
  const KIM = 'oosItems.map(x => esc(scopeText(x)))';
  assert(SRC.split(KIM).length - 1 === 1, 'kim oosItems khong khop');
  const gc = banSao(s => s.replace(KIM, "(oos.length ? [esc(pl.scope_plain || oos.map(stripMd).join(' · '))] : [])"));
  const r = mkWs('g', hoSo(null));
  const pf = path.join(r, 'pl.json'); writeFileSync(pf, JSON.stringify({ scope_plain: 'tom', wont_do: [] }));
  const li = liKhong(chayGc(gc, r, 'g', ['--plain', pf]).stdout);
  const thieu = Array.from({ length: 8 }, (_, i) => i + 1).filter(n => !li.some(t => t.includes(`Mục bỏ ngoài số ${n}`)));
  assert(thieu.length > 0, 'ban sao gop scope_plain ma du muc — phep do khong do');
  return `(thieu muc OOS-${thieu[0]})`;
});

// ── (ca của Task B2 nối vào dưới) ──

rmSync(TMP, { recursive: true, force: true });
console.log(`ckdl-the: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
