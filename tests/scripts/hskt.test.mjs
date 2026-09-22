// hskt.test.mjs — hồ sơ ho-so-khep-thoi-hoi (vòng meta 2.18.1). Tên ca = tên AC.
//   HK-AC1*  vị từ «hồ sơ đã khép» (lib/workspace-record.cjs) + CLI --da-khep
//   HK-AC2*  bộ đếm cửa veto (start-scan + lưới trước-merge) bỏ hồ sơ khép
//   HK-AC4*  làn V đọc review-findings.md × sổ gate2 (hai bản dựng + thẻ)
//   HK-AC5*  chiều im trên cây `_acceptance/` thật của kit
//   HK-AC6*  thẻ hồ sơ khép: 0 ô hỏi; bản ghi mốc định tuyến hai chiều
//   HK-AC7*  mutant cho hai bộ đo đổi khuôn (NS-AC9-cu, L05)
//   HK-AC8*  mọi bên gọi luật xanh-sạch truyền tệp phát hiện + sổ
// Mọi fixture là kho git do CODE SINH trong lượt. Dòng sổ nghỉ/thực tế rút danh sách vế từ lib
// (NGHI_VE ngầm qua hoSoNghi, THUC_TE_VE tường minh); mục ngoài hợp đồng rút từ khối marker
// OOC-ITEM-TEMPLATE của feature-loop/workflows/acceptance-verify.js. Đường dẫn suy từ vị trí tệp.
// Chọn ca: đối số dòng lệnh (`node hskt.test.mjs HK-AC1 HK-AC2-quet`) hoặc HSKT_CASES=a,b.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'hskt-'));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const CHON = [...process.argv.slice(2), ...(process.env.HSKT_CASES ? process.env.HSKT_CASES.split(',') : [])];
const want = name => !CHON.length || CHON.includes(name);
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const WR = require(path.join(KIT, 'lib', 'workspace-record.cjs'));

// ── Khuôn fixture ─────────────────────────────────────────────────────────────
const hopDong = (slug, o = {}) => {
  const f = { schema_version: 1, slug, feature: `viec ${slug}`, owner: 'x@y.z', risk_tier: 'T2', surfaces: '[cli]',
    status: 'signed-off', approved_by: 'M', approved_at: '2026-09-01T00:00:00Z', ...o };
  return `---\n${Object.entries(f).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
};
const baoCao = (slug, o = {}) => {
  const f = { schema_version: 2, feature_slug: slug, verdict: 'PASS', failed_evals: '[]', reason: '', verified_by: 'fresh',
    enforcement_mode: 'strict', bypass_used: 'false', verified_commit: '0'.repeat(40), human_signoff: '', ...o };
  return `---\n${Object.entries(f).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\n\n# Evidence Report: ${slug}\n\n## Evidence\n\n- eval: E1\n\n## Known limits\n\n## Ngoài hợp đồng\n\n## Iterations\n`;
};
const KY = 'Manh Phan 2026-09-02';
const dongNghi = (o = {}) => JSON.stringify({ id: 'd-20260920T100000Z-1', type: 'nghi', stage: 'nghi', by: 'M', at: '2026-09-20T10:00:00Z', decision: 'tien de ngoai da chet', ...o });
const dongTT = (o = {}) => JSON.stringify({ id: 'd-20260921T100000Z-1', type: 'thuc-te', stage: 'thuc-te',
  ...Object.fromEntries(WR.THUC_TE_VE.map(k => [k, { id: 'd-20260921T100000Z-1', by: 'M', at: '2026-09-21T09:00:00Z', build_sha: 'f'.repeat(40), decision: 'chay tren prod' }[k]])), ...o });

function khoMoi() {
  const r = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n');
  return r;
}
function hoSo(r, slug, { contract, report, ledger, findings } = {}) {
  const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
  if (contract != null) writeFileSync(path.join(d, 'contract.md'), contract);
  if (report != null) writeFileSync(path.join(d, 'evidence-report.md'), report);
  if (ledger != null) writeFileSync(path.join(d, 'decisions.jsonl'), ledger + '\n');
  if (findings != null) writeFileSync(path.join(d, 'review-findings.md'), findings);
  return d;
}

// Ma trận năm hồ sơ của AC-1 (viết trước): [tên, văn bản, kỳ vọng vi].
const MA_TRAN_AC1 = [
  ['nghi-du', { status: 'signed-off', ledger: dongNghi(), report: baoCao('a', { human_signoff: KY }) }, 'nghi'],
  ['nghi-chua-ky', { status: 'verified', ledger: dongNghi(), report: baoCao('b') }, null],
  ['thuc-te-du', { status: 'da-cham-boi-thuc-te', ledger: dongTT(), report: baoCao('c') }, 'thuc-te'],
  ['thuc-te-thieu', { status: 'da-cham-boi-thuc-te', ledger: dongTT({ build_sha: '' }), report: baoCao('d') }, null],
  ['song', { status: 'signed-off', ledger: '', report: baoCao('e', { human_signoff: KY }) }, null],
];
const hoiKhep = (fn, x) => { const k = fn({ status: x.status, ledgerText: x.ledger, reportText: x.report }); return k ? k.vi : null; };
function kiemAC1(fn) {
  const sai = [];
  MA_TRAN_AC1.forEach(([ten, x, ky], i) => { const v = hoiKhep(fn, x); if (v !== ky) sai.push(`o ${i + 1} (${ten}): nhan ${v}, ky vong ${ky}`); });
  return sai;
}

if (want('HK-AC1')) {
  try {
    if (typeof WR.hoSoDaKhep !== 'function') throw new Error('lib khong co hoSoDaKhep');
    const sai = kiemAC1(WR.hoSoDaKhep);
    // Chiều đỏ: bản sao lib đổi vế thực tế thành «status thôi» → ô 4 phải lật.
    const cp = mkdtempSync(path.join(TMP, 'lib-'));
    cpSync(path.join(KIT, 'lib'), path.join(cp, 'lib'), { recursive: true });
    const p = path.join(cp, 'lib', 'workspace-record.cjs'); const src = readFileSync(p, 'utf8');
    const NEO = "const tt = thucTe(ledgerText); if (tt && tt.kieu === 'dong-so') return { vi: 'thuc-te' };";
    if (!src.includes(NEO)) throw new Error('neo mutant khong khop — ve thuc te cua hoSoDaKhep da doi');
    writeFileSync(p, src.replace(NEO, "return { vi: 'thuc-te' };"));
    const saiDot = kiemAC1(createRequire(p)(p).hoSoDaKhep);
    if (sai.length) bad('HK-AC1', sai.join(' ; '));
    else if (!saiDot.some(s => s.startsWith('o 4'))) bad('HK-AC1', `mutant «status thoi» khong lam o 4 lat: ${JSON.stringify(saiDot)}`);
    else ok('HK-AC1', `— 5/5 ô đúng; mutant bỏ đòi dòng đủ vế → ${saiDot[0]}`);
  } catch (e) { bad('HK-AC1', loi(e)); }
}

if (want('HK-AC1-cli')) {
  try {
    const r = khoMoi();
    MA_TRAN_AC1.forEach(([ten, x]) => hoSo(r, ten, { contract: hopDong(ten, { status: x.status }), report: x.report, ledger: x.ledger }));
    const out = execFileSync(process.execPath, [path.join(KIT, 'lib', 'workspace-record.cjs'), '--da-khep', '--root', r], { encoding: 'utf8' });
    const got = out.split('\n').filter(Boolean).sort();
    const ky = MA_TRAN_AC1.filter(([, , v]) => v).map(([t]) => t).sort();
    if (got.join(',') !== ky.join(',')) bad('HK-AC1-cli', `in «${got}», ky vong «${ky}»`);
    else ok('HK-AC1-cli', `— CLI in đúng ${got.length} slug khép: ${got.join(', ')}`);
  } catch (e) { bad('HK-AC1-cli', loi(e)); }
}

// ── AC-2: bộ đếm cửa veto bỏ hồ sơ khép ────────────────────────────────────────
// Hai hồ sơ CÙNG frontmatter veto (mo + vết), không chữ ký: một khép (thực tế đủ vế), một sống.
function khoVeto() {
  const r = khoMoi();
  const vet = { veto_state: 'mo', veto_opened_at: '2026-09-01T00:00:00Z', approved_by: '' };
  hoSo(r, 'hs-khep', { contract: hopDong('hs-khep', { status: 'da-cham-boi-thuc-te', ...vet }), report: baoCao('hs-khep'), ledger: dongTT() });
  hoSo(r, 'hs-song', { contract: hopDong('hs-song', { status: 'verified', ...vet }), report: baoCao('hs-song') });
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'fixture');
  return r;
}
// Bản sao bộ máy (scripts + lib) để tiêm mutant; trả gốc bản sao.
function banSaoMay(tiem = []) {
  const cp = mkdtempSync(path.join(TMP, 'may-'));
  for (const d of ['scripts', 'lib']) cpSync(path.join(KIT, d), path.join(cp, d), { recursive: true });
  for (const [rel, neo, thay] of tiem) {
    const p = path.join(cp, rel); const src = readFileSync(p, 'utf8');
    const n = src.split(neo).length - 1;
    if (n !== 1) throw new Error(`neo mutant khop ${n} lan trong ${rel}: «${neo.slice(0, 60)}»`);
    writeFileSync(p, src.replace(neo, thay));
  }
  return cp;
}
const quet = (r, may = KIT) => JSON.parse(execFileSync(process.execPath, [path.join(may, 'scripts', 'start-scan.mjs'), '--root', r], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const dongVeto = (r, may = KIT) => {
  const o = spawnSync('bash', [path.join(may, 'scripts', 'pre-merge-check.sh'), r], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return ((o.stdout || '') + (o.stderr || '')).split('\n').find(l => l.startsWith('NOTE: cửa veto đang mở')) || '';
};
const NEO_QUET = 'vetoOpen.filter(v => !v.humanSignoff && !v.daKhep)';
const NEO_LUOI = 'if [ "$vstate" = "mo" ] && khep_slug "$slug"; then vstate="mo-da-khep"; fi';

if (want('HK-AC2-quet')) {
  try {
    const j = quet(khoVeto());
    const vo = Object.fromEntries((j.vetoOpen || []).map(v => [v.slug, v]));
    const sai = [];
    if (JSON.stringify(j.vetoOpenUnsigned) !== JSON.stringify(['hs-song'])) sai.push(`vetoOpenUnsigned=${JSON.stringify(j.vetoOpenUnsigned)}`);
    if (!vo['hs-khep'] || vo['hs-khep'].daKhep !== true) sai.push(`vetoOpen hs-khep=${JSON.stringify(vo['hs-khep'])}`);
    if (!vo['hs-song'] || vo['hs-song'].daKhep !== false) sai.push(`vetoOpen hs-song=${JSON.stringify(vo['hs-song'])}`);
    if (sai.length) bad('HK-AC2-quet', sai.join(' ; ')); else ok('HK-AC2-quet', '— vetoOpenUnsigned chỉ còn hồ sơ sống; vetoOpen giữ cả hai, daKhep đúng');
  } catch (e) { bad('HK-AC2-quet', loi(e)); }
}

if (want('HK-AC2-luoi')) {
  try {
    const l = dongVeto(khoVeto());
    if (!/— 1 hồ sơ/.test(l) || !l.includes('hs-song') || l.includes('hs-khep')) bad('HK-AC2-luoi', `dong NOTE: «${l}»`);
    else ok('HK-AC2-luoi', `— «${l.trim()}»`);
  } catch (e) { bad('HK-AC2-luoi', loi(e)); }
}

if (want('HK-AC2-dot-bien')) {
  try {
    const r = khoVeto(); const sai = [];
    const mq = banSaoMay([['scripts/start-scan.mjs', NEO_QUET, 'vetoOpen.filter(v => !v.humanSignoff)']]);
    const jq = quet(r, mq);
    if (!(jq.vetoOpenUnsigned || []).includes('hs-khep')) sai.push(`mutant bo quet: hs-khep khong quay lai (${JSON.stringify(jq.vetoOpenUnsigned)})`);
    const ml = banSaoMay([['scripts/pre-merge-check.sh', NEO_LUOI, ':']]);
    const ll = dongVeto(r, ml);
    if (!ll.includes('hs-khep')) sai.push(`mutant luoi: hs-khep khong quay lai dong NOTE («${ll}»)`);
    if (sai.length) bad('HK-AC2-dot-bien', sai.join(' ; ')); else ok('HK-AC2-dot-bien', '— gỡ bộ lọc ở mỗi bên → tên hs-khep quay lại đúng dòng ấy');
  } catch (e) { bad('HK-AC2-dot-bien', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (hskt)`);
process.exit(fail ? 1 : 0);
