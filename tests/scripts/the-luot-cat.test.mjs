// the-luot-cat.test.mjs — thẻ lượt cắt (`cat-luot.mjs --the`), trường `chay_sau`, và mốc chốt phạm vi của nhịp
// (`--nhip` đọc dòng seal Cổng 1 sớm nhất của sổ quyết định). Ca TL-1…TL-9.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm); bản phạm vi viết bằng dòng mẫu rút từ khuôn
// skills/acceptance/references/pham-vi-template.md (round-trip writer/reader). Ca đỏ chạy trên BẢN SAO của vật với
// nhát tiêm khớp đúng một lần, SAU khi bản lành xanh trên cùng dữ liệu; thông điệp ghim. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'the-luot-cat-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.TL_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + ' '));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = args => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

let bsN = 0;
function banSao(tiem) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8');
    const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
const chayCa = async (id, f) => { try { const s = await f(KIT); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 200)}`);
  } catch (e) { bad(id, loi(e)); }
};

let khoN = 0;
function kho(files = {}) {
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  for (const [p, t] of Object.entries(files)) { mkdirSync(path.dirname(path.join(r, p)), { recursive: true }); writeFileSync(path.join(r, p), typeof t === 'string' ? t : JSON.stringify(t, null, 2) + '\n'); }
  writeFileSync(path.join(r, '.keep'), ''); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thu');
  return r;
}
const chayCL = (kit, r, args) => node([path.join(kit, 'scripts', 'cat-luot.mjs'), '--root', r, ...args]);

// ── Nhịp: mốc chốt phạm vi ──────────────────────────────────────────────────
// Lệnh duyệt Cổng 1 GHI ĐÈ approved_at mỗi lần mở lại cổng (commands/approve.md bước 5), còn sổ quyết định giữ mọi dòng seal
// — đo 21/10 trên crm: 36/291 hồ sơ đã ký có approved_at muộn hơn lần chốt đầu (vd agent-builder-noi-tieng-viet: 09-06 → 09-16).
const HD = (tier, approved) => `---\nschema_version: 1\nfeature: x\nslug: x\nowner: x@y.z\nrisk_tier: ${tier}\nsurfaces: [cli]\nstatus: signed-off\napproved_by: M\napproved_at: ${approved}T03:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV = ky => `---\nschema_version: 2\nfeature_slug: x\nverdict: PASS\nhuman_signoff: ${ky}\n---\n`;
const SEAL = (at, gate = 1) => JSON.stringify({ id: `d-${at.replace(/[-:]/g, '')}-1`, type: 'seal', gate, at });
async function tl1(kit) {
  const sai = [];
  // [slug, approved_at, dòng sổ, ngày ký, số ngày mong đợi]
  const CA = [
    ['mo-lai', '2026-09-10', [SEAL('2026-09-01T02:00:00Z'), SEAL('2026-09-10T02:00:00Z')], '2026-09-12', 11],
    ['khong-so', '2026-09-05', null, '2026-09-08', 3],
    ['seal-muon', '2026-09-05', [SEAL('2026-09-07T02:00:00Z')], '2026-09-09', 4],
    ['seal-cong-2', '2026-09-05', [SEAL('2026-09-01T02:00:00Z', 2), '{hỏng', JSON.stringify({ type: 'approach', at: '2026-08-01T00:00:00Z' })], '2026-09-06', 1],
  ];
  const files = {};
  for (const [s, ap, so, ky] of CA) {
    files[`_acceptance/${s}/contract.md`] = HD('T2', ap); files[`_acceptance/${s}/evidence-report.md`] = EV(`Manh Phan ${ky}`);
    if (so) files[`_acceptance/${s}/decisions.jsonl`] = so.join('\n') + '\n';
  }
  const x = chayCL(kit, kho(files), ['--nhip']); let j;
  try { j = JSON.parse(x.stdout); } catch { return [`--nhip không ra JSON: exit ${x.status} ${x.stderr.trim()}`]; }
  const a = CA.map(c => c[4]).sort((p, q) => p - q); const tv = (a[1] + a[2]) / 2;
  if (j.hang.T2.n !== 4 || j.hang.T2.trung_vi !== tv) sai.push(`T2 ${JSON.stringify(j.hang.T2)} ≠ n 4 trung vị ${tv} — mốc chốt phải là dòng seal Cổng 1 sớm nhất`);
  // Một hồ sơ mở lại: trung vị phải đúng 11 (không phải 2 của approved_at bị ghi đè).
  const x1 = chayCL(kit, kho({ '_acceptance/a/contract.md': HD('T3', '2026-09-10'), '_acceptance/a/evidence-report.md': EV('M 2026-09-12'), '_acceptance/a/decisions.jsonl': SEAL('2026-09-01T02:00:00Z') + '\n' }), ['--nhip']);
  const j1 = JSON.parse(x1.stdout); if (j1.hang.T3.trung_vi !== 11) sai.push(`hồ sơ mở lại Cổng 1: trung vị ${j1.hang.T3.trung_vi} ≠ 11 (đọc approved_at bị ghi đè)`);
  return sai;
}
if (want('TL-1') && await chayCa('TL-1', tl1)) ok('TL-1', 'nhịp tính từ dòng seal Cổng 1 sớm nhất; vắng sổ → approved_at; seal muộn hơn, seal Cổng 2, dòng hỏng không đổi mốc');
if (want('TL-1-do')) await chayDo('TL-1-do', tl1, [['scripts/cat-luot.mjs', 'const ngayChot = (c, so = null) =>', 'const ngayChot = (c, so = null, _ = so = null) =>']], 'seal Cổng 1', 'bản sao bỏ sổ quyết định khỏi mốc chốt');

console.log(`\nResults: ${pass} passed, ${fail} failed (the-luot-cat)`);
process.exit(fail ? 1 : 0);
