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

// ── Task B2 — mọi bảng phản biện theo chữ ký sáu cột (AC-7) ──
// Chữ ký bảng rút từ câu định nghĩa ở feature-loop SKILL S1#7 (bên VIẾT) — không chép tay.
const CHU_KY = (() => { const m = readFileSync(FL_SKILL, 'utf8').match(/bảng `(\| Sev \| Artifact \|[^`]*\|)`/g); assert(m && m.length === 1, `cau dinh nghia bang trong SKILL khop ${m ? m.length : 0} lan`); return m[0].slice(6, -1); })();
const hangP = (n, tag) => Array.from({ length: n }, (_, i) => `| P${i % 3} | contract | ${tag} ${i + 1} | kb | do | fixed: x |`).join('\n');
const PROBE2 = (tong) => `---\nslug: g\nat: 2026-09-25T15:40:00Z\nverdict: findings\np0: ${tong}\np1: 0\np2: 0\n---\n\n## Findings\n\n${CHU_KY}\n|---|---|---|---|---|---|\n${hangP(5, 'bang1')}\n\n## Soát lại sau Cổng Phạm vi (hai chỗ sửa, 2026-09-25)\n\n${CHU_KY}\n|---|---|---|---|---|---|\n${hangP(5, 'bang2')}\n\n## Khác\n\n| A | B |\n|---|---|\n| la 1 | x |\n| la 2 | y |\n`;
await ca('CK-AC7', async () => {
  assert(SRC.includes(`const GP_HEADER = '${CHU_KY}';`), 'gate-card GP_HEADER lech chu ky SKILL');
  const r = mkWs('g', hoSo(PROBE2(5)));
  const x = extract(r, 'g');
  assert(x.gap_probe.rows.length === 10 && x.gap_probe.rows.some(o => o.summary === 'bang2 5') && !x.gap_probe.rows.some(o => /la \d/.test(o.summary)), `rows ${x.gap_probe.rows.length}`);
  const h = card(r, 'g').stdout;
  assert(h.includes('bảng phản biện ngoài khai báo: 10 &gt; 5') || h.includes('bảng phản biện ngoài khai báo: 10 > 5'), 'thieu co 10 > 5');
  const r2 = mkWs('g', hoSo(PROBE2(10)));
  assert(!card(r2, 'g').stdout.includes('bảng phản biện ngoài khai báo'), 'doi chung tong 10 van co co');
  return '(10 hang · co 10>5 · doi chung 0 co)';
});
await ca('CK-AC7-clean', async () => {
  const P = `---\nslug: g\nat: 2026-09-25T15:40:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n${CHU_KY}\n|---|---|---|---|---|---|\n| — | — | Không còn lỗ đáng kể | — | — | — |\n`;
  const r = mkWs('g', hoSo(P));
  const h = card(r, 'g').stdout;
  assert(!h.includes('bảng phản biện ngoài khai báo'), 'co gia tren ho so clean');
  assert(extract(r, 'g').gap_probe.rows.filter(o => /^P[0-2]$/.test(o.sev)).length === 0, 'clean co hang phat hien');
  return '(0 co · 0 phat hien)';
});
await ca('CK-AC7-dot-bien', async () => {
  const KIM = 'for (const l of probeT.split(/\\r?\\n/))';
  assert(SRC.split(KIM).length - 1 === 1, 'kim quet bang khong khop');
  const gc1 = banSao(s => s.replace(KIM, "for (const l of section(probeT, 'Findings'))"));
  const r = mkWs('g', hoSo(PROBE2(5)));
  const x = JSON.parse(chayGc(gc1, r, 'g', ['--extract']).stdout);
  assert(!x.gap_probe.rows.some(o => o.summary === 'bang2 1'), 'thieu hang bang 2 — ban sao van doc bang 2');
  const KIM2 = 'gpRows.filter(r => /^P[0-2]$/.test(r.sev)).length';
  assert(SRC.split(KIM2).length - 1 === 1, 'kim dem phat hien khong khop');
  const gc2 = banSao(s => s.replace(KIM2, 'gpRows.length'));
  const P = `---\nslug: g\nat: x\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n${CHU_KY}\n|---|---|---|---|---|---|\n| — | — | Không còn lỗ đáng kể | — | — | — |\n`;
  const r2 = mkWs('g', hoSo(P));
  assert(chayGc(gc2, r2, 'g').stdout.includes('bảng phản biện ngoài khai báo'), 'co gia tren ho so clean — ban sao dem moi hang ma van im');
  return '(thieu hang bang 2 · co gia tren ho so clean)';
});

rmSync(TMP, { recursive: true, force: true });
console.log(`ckdl-the: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
