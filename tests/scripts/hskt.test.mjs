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
// Trạng thái «đã ký» rút từ lib (MỘT nguồn — nếp owner chọn 17/09 ở hồ sơ ra-co-ten-lam-va-trao):
// tệp ca không mang chuỗi trạng thái của riêng nó, nên không phải khai gạch ở RT13.
const DA_KY = WR.DA_THONG_CONG_2[0];

// ── Khuôn fixture ─────────────────────────────────────────────────────────────
const hopDong = (slug, o = {}) => {
  const f = { schema_version: 1, slug, feature: `viec ${slug}`, owner: 'x@y.z', risk_tier: 'T2', surfaces: '[cli]',
    status: DA_KY, approved_by: 'M', approved_at: '2026-09-01T00:00:00Z', ...o };
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
  ['nghi-du', { status: DA_KY, ledger: dongNghi(), report: baoCao('a', { human_signoff: KY }) }, 'nghi'],
  ['nghi-chua-ky', { status: 'verified', ledger: dongNghi(), report: baoCao('b') }, null],
  ['thuc-te-du', { status: 'da-cham-boi-thuc-te', ledger: dongTT(), report: baoCao('c') }, 'thuc-te'],
  ['thuc-te-thieu', { status: 'da-cham-boi-thuc-te', ledger: dongTT({ build_sha: '' }), report: baoCao('d') }, null],
  ['song', { status: DA_KY, ledger: '', report: baoCao('e', { human_signoff: KY }) }, null],
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
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, d), path.join(cp, d), { recursive: true });
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

// ── AC-4: làn V đọc review-findings.md × sổ gate2 ──────────────────────────────
const { fileFromTemplate } = await import(pathToFileURL(path.join(KIT, 'tests', 'fixtures', 'from-template.mjs')).href);
const CONTRACT_TPL = path.join(KIT, 'skills', 'acceptance', 'references', 'contract-template.md');
// Khuôn mục ngoài hợp đồng RÚT từ bên VIẾT (prompt synthesize) — cùng cách P55.
const OOC_TPL = (() => {
  const wf = readFileSync(path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('khong rut duoc OOC-ITEM-TEMPLATE tu acceptance-verify.js');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
})();
const HEAD_OOC = '## Ngoài hợp đồng — người quyết ở Gate 2\n\nCác lỗi dưới đây nằm ngoài phạm vi đã duyệt.\n\n';
const mucOoc = i => OOC_TPL.replace(/\{(\w+)\}/g, (_, k) => ({ title: `loi that so ${i}`, plain: `Người dùng thấy lỗi ${i}.`, file: `src/a${i}.js:1`, severity: 'low', proposal: 'known-limits' }[k]));
const FINDINGS_2 = '# Review findings\n\n## Trong hợp đồng\n\n' + HEAD_OOC + mucOoc(1) + '\n' + mucOoc(2) + '\n';
const FINDINGS_0 = '# Review findings\n\n## Trong hợp đồng\n\n' + HEAD_OOC.replace('Các lỗi dưới đây nằm ngoài phạm vi đã duyệt.\n\n', '(rỗng — không có lỗi ngoài phạm vi)\n');
const FINDINGS_NGO = '# Review findings\n\n' + HEAD_OOC + '- **mot muc viet sai khuon** khong co dong truong nao\n';
const dongGate2 = (quyet, n = 1) => JSON.stringify({ id: `d-20260922T010000Z-${n}`, type: 'descope', stage: 'gate2', at: '2026-09-22T01:00:00Z', decision: quyet, impact: 'x' });
// Ma trận sáu hàng (viết trước): [tên, findings, sổ, sạch?, cụm phải có trong why | null]
const MA_TRAN_AC4 = [
  ['chua-ai-quyet', FINDINGS_2, '', false, 'chưa người định tuyến: Ngoài-1, Ngoài-2'],
  ['quyet-mot-phan', FINDINGS_2, dongGate2('Ngoài-1: ghi Known limits'), false, 'chưa người định tuyến: Ngoài-2'],
  ['quyet-du-khoang', FINDINGS_2, dongGate2('Ngoai-1 den Ngoai-2: ghi Known limits, ship ban nay'), true, null],
  ['khong-muc', FINDINGS_0, '', true, null],
  ['vang', null, '', true, null],
  ['sai-khuon', FINDINGS_NGO, '', false, 'không đọc ra mục nào'],
];
const hopDongV = slug => {
  let t = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier: 'T2', surfaces: 'cli', status: 'verified' },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`);
  return t.replace(/^approved_at:.*$/m, m => [m, 'veto_state: mo', 'veto_opened_at: 2026-08-21T09:00:00Z'].join('\n'));
};
const baoCaoV = (slug, vc) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${vc}\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff:\n---\n\n# Evidence Report: ${slug}\n\n## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-21\n\n## Known limits\n\n## Ngoài hợp đồng\n\n`;
// Kho git làn V đủ vết cho lưới (cùng hình dạng LV5): c1 → basepoint → c2 (hợp đồng) → c3 (bằng chứng).
function khoLanV(slug, findings, ledger) {
  const R = khoMoi();
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n');
  writeFileSync(path.join(R, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  mkdirSync(path.join(R, 'src'), { recursive: true }); writeFileSync(path.join(R, 'src', 'app.js'), 'v1\n');
  // Kho tiêu thụ mang lớp CI vendored (lưới đọc lib theo gốc kho — cùng lý do LV5 chép).
  cpSync(path.join(KIT, 'lib'), path.join(R, 'lib'), { recursive: true });
  mkdirSync(path.join(R, 'scripts'), { recursive: true });
  cpSync(path.join(KIT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c1'); git(R, 'branch', 'basepoint');
  writeFileSync(path.join(R, 'src', 'app.js'), 'v2\n');
  hoSo(R, slug, { contract: hopDongV(slug) });
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c2');
  const c2 = git(R, 'rev-parse', 'HEAD');
  hoSo(R, slug, { report: baoCaoV(slug, c2), findings: findings ?? undefined, ledger: ledger ? ledger : undefined });
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c3');
  return R;
}
const docTep = (R, slug, f) => { try { return readFileSync(path.join(R, '_acceptance', slug, f), 'utf8'); } catch { return null; } };
async function kiemMjs(may = KIT) {
  const KCN = await import(pathToFileURL(path.join(may, 'scripts', 'khong-can-nguoi.mjs')).href + `?v=${Math.random()}`);
  const sai = []; let n = 0;
  for (const [ten, fd, so, sach, cum] of MA_TRAN_AC4) {
    const r = KCN.xanhSach(hopDongV('x'), baoCaoV('x', '0'.repeat(40)), { findings: fd, ledger: so || null });
    n++;
    if (r.clean !== sach) sai.push(`${ten}: clean=${r.clean} (${r.why})`);
    else if (cum && !String(r.why).includes(cum)) sai.push(`${ten}: why «${r.why}» thieu «${cum}»`);
    else if (ten === 'quyet-mot-phan' && String(r.why).includes('Ngoài-1,')) sai.push(`${ten}: why con neu Ngoài-1`);
  }
  return { sai, n };
}

if (want('HK-AC4-ma-tran')) {
  try {
    const { sai, n } = await kiemMjs();
    if (n !== 6) bad('HK-AC4-ma-tran', `so hang ${n}, khai truoc 6`);
    else if (sai.length) bad('HK-AC4-ma-tran', sai.join(' ; '));
    else ok('HK-AC4-ma-tran', '— 6/6 hàng đúng: chưa ai quyết / quyết một phần / sai khuôn → còn cần người; quyết đủ (khoảng, không dấu) / 0 mục / vắng → sạch');
  } catch (e) { bad('HK-AC4-ma-tran', loi(e)); }
}

if (want('HK-AC4-bash')) {
  try {
    const sai = [];
    for (const [ten, fd, so, sach] of MA_TRAN_AC4) {
      const slug = 'lv-' + ten; const R = khoLanV(slug, fd, so);
      const o = spawnSync('bash', [path.join(KIT, 'scripts', 'pre-merge-check.sh'), R, '--base', 'basepoint'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      const out = (o.stdout || '') + (o.stderr || '');
      const chan = new RegExp(`^VIOLATION \\[${slug}\\]`, 'm').test(out);
      const noteV = new RegExp(`^NOTE \\[${slug}\\]: làn V — máy đi trước`, 'm').test(out);
      if (o.status == null || o.status === 2) sai.push(`${ten}: luoi exit ${o.status}`);
      else if (sach && (chan || !noteV)) sai.push(`${ten}: ky vong NOTE lan V, nhan chan=${chan} note=${noteV} — ${out.split('\n').filter(l => l.includes(slug)).slice(0, 2).join(' | ')}`);
      else if (!sach && !chan) sai.push(`${ten}: ky vong VIOLATION, luoi khong chan`);
      // Dòng NOTE xanh-sạch đọc TỪ kết quả vị từ: mục đã định tuyến thì in số mục, không gọi «rỗng».
      const note = out.split('\n').find(l => l.startsWith(`NOTE [${slug}]: xanh-sạch`)) || '';
      if (ten === 'quyet-du-khoang' && (!note.includes('Ngoài hợp đồng: 2 mục, đã người định tuyến qua sổ') || note.includes('Ngoài hợp đồng rỗng'))) sai.push(`${ten}: NOTE «${note}»`);
      if (ten === 'khong-muc' && !note.includes('Ngoài hợp đồng rỗng')) sai.push(`${ten}: NOTE «${note}»`);
      // Đẳng thức với bộ quét (bản dựng mjs): hồ sơ lưới chặn thì bộ quét KHÔNG xếp «máy đi tiếp».
      const j = quet(R); const d = (j.groups.done || []).find(x => x.slug === slug);
      if (chan === !!d) sai.push(`${ten}: lech hai ban dung — luoi ${chan ? 'chan' : 'qua'}, bo quet ${d ? d.stateKey : 'khong o done'}`);
    }
    if (sai.length) bad('HK-AC4-bash', sai.join(' ; ')); else ok('HK-AC4-bash', '— lưới chặn đúng hàng 1, 2, 6; NOTE làn V ở hàng 3, 4, 5; bộ quét khớp lưới trên cả sáu');
  } catch (e) { bad('HK-AC4-bash', loi(e)); }
}

const theExtract = (R, slug) => JSON.parse(execFileSync(process.execPath, [path.join(KIT, 'scripts', 'gate-card.js'), '--root', R, '--slug', slug, '--extract'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
if (want('HK-AC4-the')) {
  try {
    const sai = [];
    const h1 = theExtract(khoLanV('lv-a', FINDINGS_2, ''), 'lv-a').routing.hoi;
    if (!h1.includes('ký hay trả') || h1.includes('veto hay để yên')) sai.push(`chua-ai-quyet: hoi=${JSON.stringify(h1)}`);
    const h3 = theExtract(khoLanV('lv-b', FINDINGS_2, dongGate2('Ngoai-1 den Ngoai-2: ghi Known limits')), 'lv-b').routing.hoi;
    if (!h3.includes('veto hay để yên') || h3.includes('ký hay trả')) sai.push(`quyet-du: hoi=${JSON.stringify(h3)}`);
    if (sai.length) bad('HK-AC4-the', sai.join(' ; ')); else ok('HK-AC4-the', '— chưa ai quyết → «ký hay trả»; đã quyết đủ → «veto hay để yên»');
  } catch (e) { bad('HK-AC4-the', loi(e)); }
}

if (want('HK-AC4-dot-bien')) {
  try {
    const NEO = '  return { chua, tong: f.findings.length, suspect: !!f.suspect_empty };';
    const may = banSaoMay([['lib/out-of-contract.cjs', NEO, "  return { chua: [], tong: f.findings.length, suspect: false };"]]);
    const { sai } = await kiemMjs(may);
    if (!sai.some(x => x.startsWith('chua-ai-quyet: clean=true'))) bad('HK-AC4-dot-bien', `mutant vi tu luon rong khong lam hang 1 do: ${JSON.stringify(sai)}`);
    else ok('HK-AC4-dot-bien', `— vị từ luôn rỗng → ${sai[0]}`);
  } catch (e) { bad('HK-AC4-dot-bien', loi(e)); }
}

// ── AC-6: thẻ hồ sơ đã khép in 0 ô hỏi ─────────────────────────────────────────
// Ba hồ sơ CÙNG tệp phát hiện (1 mục) và cùng báo cáo đã ký: nghỉ đủ vế · thực tế đủ vế · sống.
const FINDINGS_1 = '# Review findings\n\n## Trong hợp đồng\n\n' + HEAD_OOC + mucOoc(1) + '\n';
function khoKhep() {
  const r = khoMoi();
  hoSo(r, 'hs-nghi', { contract: hopDong('hs-nghi'), report: baoCao('hs-nghi', { human_signoff: KY }), ledger: dongNghi(), findings: FINDINGS_1 });
  hoSo(r, 'hs-thuc-te', { contract: hopDong('hs-thuc-te', { status: 'da-cham-boi-thuc-te' }), report: baoCao('hs-thuc-te', { human_signoff: KY }), ledger: dongTT(), findings: FINDINGS_1 });
  hoSo(r, 'hs-song', { contract: hopDong('hs-song'), report: baoCao('hs-song', { human_signoff: KY }), findings: FINDINGS_1 });
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'fixture');
  return r;
}
const theHtml = (R, slug) => execFileSync(process.execPath, [path.join(KIT, 'scripts', 'gate-card.js'), '--root', R, '--slug', slug], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const CAU_KHEP = 'không còn câu hỏi nào cho người';
let _khoKhep = null; const khoK = () => (_khoKhep ||= khoKhep());
for (const [ca, slug] of [['HK-AC6-nghi', 'hs-nghi'], ['HK-AC6-thuc-te', 'hs-thuc-te']]) {
  if (!want(ca)) continue;
  try {
    const R = khoK(); const j = theExtract(R, slug); const h = theHtml(R, slug);
    const sai = [];
    if ((j.routing.hoi || []).length) sai.push(`routing.hoi=${JSON.stringify(j.routing.hoi)}`);
    if (j.one_shot != null) sai.push(`one_shot=${JSON.stringify(j.one_shot)}`);
    if (!h.includes(CAU_KHEP)) sai.push(`HTML thieu «${CAU_KHEP}»`);
    if (sai.length) bad(ca, sai.join(' ; ')); else ok(ca, `— ${slug}: 0 ô hỏi, không câu gộp, thẻ nói «${CAU_KHEP}»`);
  } catch (e) { bad(ca, loi(e)); }
}
if (want('HK-AC6-song')) {
  try {
    const R = khoK(); const hoi = theExtract(R, 'hs-song').routing.hoi || [];
    if (!hoi.includes('Ngoài-1') || theHtml(R, 'hs-song').includes(CAU_KHEP)) bad('HK-AC6-song', `hoi=${JSON.stringify(hoi)}`);
    else ok('HK-AC6-song', `— đối chứng: hồ sơ sống cùng tệp phát hiện vẫn hỏi ${JSON.stringify(hoi)}`);
  } catch (e) { bad('HK-AC6-song', loi(e)); }
}
if (want('HK-AC6-baseline')) {
  try {
    const REL = 'tests/scripts/fixtures/routing-baseline.txt';
    const dong = t => new Map(t.split('\n').filter(l => l && !l.startsWith('#')).map(l => [l.split('\t')[0], l]));
    const moi = dong(readFileSync(path.join(KIT, REL), 'utf8'));
    const base = git(KIT, 'merge-base', 'HEAD', 'origin/main');
    const cu = dong(git(KIT, 'show', `${base}:${REL}`));
    const khep = new Set(execFileSync(process.execPath, [path.join(KIT, 'lib', 'workspace-record.cjs'), '--da-khep', '--root', KIT], { encoding: 'utf8' }).split('\n').filter(Boolean));
    const sai = []; let nKhep = 0, nRong = 0;
    for (const [slug, l] of moi) {
      if (khep.has(slug)) { nKhep++; if (/\thoi=\t/.test(l + '\t') || /\thoi=(\t|$)/.test(l)) nRong++; else sai.push(`${slug} khép mà hoi khác rỗng: ${l}`); }
      if (cu.has(slug) && cu.get(slug) !== l && !khep.has(slug)) sai.push(`${slug} đổi dòng mà không khép`);
    }
    // Tập khép rút trên cây thật phải ≥ 16 (15 nghỉ + release-2-0-0); bản ghi mốc chỉ ghim hồ sơ
    // ĐÃ KÝ (LM20), nên release-2-0-0 (làn V, không chữ ký) đứng ngoài bản ghi — đúng thiết kế.
    if (khep.size < 16) sai.push(`tập --da-khep chỉ ${khep.size} (kỳ vọng ≥ 16)`);
    if (nKhep < 15) sai.push(`chỉ ${nKhep} hồ sơ khép trong bản ghi mốc (kỳ vọng ≥ 15)`);
    if (sai.length) bad('HK-AC6-baseline', sai.join(' ; ')); else ok('HK-AC6-baseline', `— khép: ${nKhep} · hoi rỗng: ${nRong}; mọi dòng đổi đều là hồ sơ khép`);
  } catch (e) { bad('HK-AC6-baseline', loi(e)); }
}

// ── AC-7: hai bộ đo đổi khuôn — gỡ bộ lọc khép khỏi BẢN SAO tệp ca → đỏ đúng thông điệp ─────────
// Bản sao nằm CẠNH tệp gốc (cùng thư mục, đuôi không phải .test.mjs nên suite không nhặt) để
// KIT/SELF_ROOT của nó suy ra đúng kho này; xoá ngay sau lượt chạy.
function chayBanSaoCa(ten, neo, env) {
  const goc = path.join(HERE, ten); const src = readFileSync(goc, 'utf8');
  const n = src.split(neo).length - 1;
  if (n !== 1) throw new Error(`neo mutant khop ${n} lan trong ${ten}`);
  const sao = path.join(HERE, `.hskt-mutant-${process.pid}-${ten.replace('.test.mjs', '.mjs')}`);
  writeFileSync(sao, src.replace(neo, ''));
  try { return spawnSync(process.execPath, [sao], { encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 64 * 1024 * 1024 }); }
  finally { rmSync(sao, { force: true }); }
}
if (want('HK-AC7-dot-bien')) {
  try {
    const sai = [];
    const a = chayBanSaoCa('ntr-trang-thai.test.mjs',
      "    for (const k of khep) rmSync(path.join(du, '_acceptance', k), { recursive: true, force: true });\n",
      { NTR_CASES: 'NS-AC9-cu' });
    const outA = (a.stdout || '') + (a.stderr || '');
    if (a.status === 0 || !/FAIL: NS-AC9-cu — (bo quet|ban do) ban sau vong khac ban truoc vong/.test(outA)) sai.push(`NS-AC9-cu mutant: exit ${a.status}, «${outA.split('\n').find(l => l.includes('NS-AC9-cu')) || ''}»`);
    const b = chayBanSaoCa('lan-status-not-run.test.mjs',
      "  for (const k of require(path.join(SELF_ROOT, 'lib', 'workspace-record.cjs')).slugDaKhep(corpusSaoCha))\n    fs.rmSync(path.join(corpusSao, k), { recursive: true, force: true });\n",
      { LSNR_CASES: 'L05' });
    const outB = (b.stdout || '') + (b.stderr || '');
    if (b.status === 0 || !/bản sao TRƯỚC khi tiêm đã có hồ sơ đỏ \(release-2-0-0\)/.test(outB)) sai.push(`L05 mutant: exit ${b.status}, «${outB.split('\n').filter(l => l.includes('L05')).slice(-1)[0] || ''}»`);
    if (sai.length) bad('HK-AC7-dot-bien', sai.join(' ; '));
    else ok('HK-AC7-dot-bien', '— gỡ bộ lọc khép: NS-AC9-cu đỏ «… bản sau vòng khác bản trước vòng», L05 đỏ «bản sao TRƯỚC khi tiêm đã có hồ sơ đỏ (release-2-0-0)»');
  } catch (e) { bad('HK-AC7-dot-bien', loi(e)); }
}

// ── AC-5: chiều im trên cây `_acceptance/` thật ───────────────────────────────────────────────
// Bản base = `git archive <merge-base>` scripts lib skills; HEAD = kho này. Cùng một dữ liệu
// (cây thật, chỉ đọc). Mỗi khác biệt phải giải thích được bằng vật: khép theo vị từ, hoặc có mục
// ngoài hợp đồng chưa định tuyến trên hồ sơ chưa ký. Tập kỳ vọng rút từ vật, không danh sách tên.
const OOC = require(path.join(KIT, 'lib', 'out-of-contract.cjs'));
const BASE_SHA = (() => { try { return git(KIT, 'merge-base', 'HEAD', 'origin/main'); } catch { return null; } })();
function banBase() {
  if (!BASE_SHA) throw new Error('khong tinh duoc merge-base HEAD origin/main');
  const d = mkdtempSync(path.join(TMP, 'base-'));
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', BASE_SHA, 'scripts', 'lib', 'skills'], { maxBuffer: 512 * 1024 * 1024 }) });
  return d;
}
const oCuaTat = j => { const m = new Map(); for (const g of ['gates', 'inProgress', 'considering', 'done']) for (const x of (j.groups[g] || [])) m.set(x.slug, x.stateKey); for (const b of (j.broken || [])) m.set(b.slug, 'ho-so-hong'); return m; };
function giaiThich(slug) {
  const d = path.join(KIT, '_acceptance', slug);
  const rd = f => { try { return readFileSync(path.join(d, f), 'utf8'); } catch { return null; } };
  const c = rd('contract.md') || '';
  const st = (/^status:[ \t]*(\S+)/m.exec(c) || [])[1] || '';
  if (WR.hoSoDaKhep({ status: st, ledgerText: rd('decisions.jsonl'), reportText: rd('evidence-report.md') })) return 'khep';
  const ky = /^human_signoff:[ \t]*\S/m.test(rd('evidence-report.md') || '');
  if (!ky && rd('review-findings.md') != null && OOC.mucChuaDinhTuyen(rd('review-findings.md'), rd('decisions.jsonl')).chua.length) return 'chua-dinh-tuyen';
  return null;
}
function soSanhIm(may) {
  const b = quet(KIT, banBase()), h = quet(KIT, may);
  const mb = oCuaTat(b), mh = oCuaTat(h);
  const doi = new Set();
  for (const [slug, k] of mh) if (mb.get(slug) !== k) doi.add(slug);
  for (const slug of mb.keys()) if (!mh.has(slug)) doi.add(slug);
  const vb = new Set(b.vetoOpenUnsigned || []), vh = new Set(h.vetoOpenUnsigned || []);
  for (const x of vb) if (!vh.has(x)) doi.add(x);
  for (const x of vh) if (!vb.has(x)) doi.add(x);
  const dem = { khep: 0, 'chua-dinh-tuyen': 0 }, la = [];
  for (const slug of doi) { const g = giaiThich(slug); if (g) dem[g]++; else la.push(slug); }
  return { n: mh.size, dem, la };
}
if (want('HK-AC5-im')) {
  try {
    const r = soSanhIm(KIT);
    // Chiều đỏ: bản sao HEAD làm danh sách veto rỗng vô cớ → các hồ sơ làn V sống rời danh sách mà
    // không lý do nào đọc được từ vật → ca phải gọi tên chúng «không giải thích».
    const mut = banSaoMay([['scripts/start-scan.mjs', NEO_QUET, 'vetoOpen.filter(v => false)']]);
    const rm = soSanhIm(mut);
    if (r.n < 50) bad('HK-AC5-im', `sanity: chi ${r.n} ho so`);
    else if (r.la.length) bad('HK-AC5-im', `doi khong giai thich: ${r.la.join(', ')}`);
    else if (!rm.la.length) bad('HK-AC5-im', 'mutant ep danh sach veto rong ma ca van im');
    else ok('HK-AC5-im', `— ${r.n} hồ sơ thật; đổi: ${r.dem.khep} khép · ${r.dem['chua-dinh-tuyen']} chưa định tuyến · 0 không giải thích; mutant → không giải thích: ${rm.la.join(', ')}`);
  } catch (e) { bad('HK-AC5-im', loi(e)); }
}
if (want('HK-AC5-note')) {
  try {
    const tenNote = may => (dongVeto(KIT, may).split(':').slice(2).join(':').trim().split(/\s+/).filter(Boolean));
    const khep = new Set(WR.slugDaKhep(KIT));
    const h = tenNote(KIT), b = tenNote(banBase());
    const giao = h.filter(x => khep.has(x));
    if (giao.length) bad('HK-AC5-note', `NOTE HEAD con ho so khep: ${giao.join(', ')}`);
    else if (!b.some(x => khep.has(x))) bad('HK-AC5-note', `doi chung: NOTE ban base khong co ho so khep nao (${b.join(' ')})`);
    else ok('HK-AC5-note', `— NOTE HEAD: ${h.join(' ') || '(không)'} · 0 hồ sơ khép; bản base có ${b.filter(x => khep.has(x)).join(', ')}`);
  } catch (e) { bad('HK-AC5-note', loi(e)); }
}

// ── AC-8: mọi bên gọi luật xanh-sạch truyền tệp phát hiện + sổ ───────────────────────────────
// Danh sách bên gọi RÚT bằng quét scripts/ (không gõ tay). Mỗi bên gọi có một ca trên fixture
// hàng một của AC-4 và một mutant «bỏ truyền findings»; bên gọi mới chưa có ca → ĐỎ.
const BEN_GOI_RE = /\b(xanhSach|khongCanNguoi)\(/;
const benGoi = () => readdirSync(path.join(KIT, 'scripts')).filter(f => /\.(mjs|cjs|js)$/.test(f))
  .filter(f => BEN_GOI_RE.test(readFileSync(path.join(KIT, 'scripts', f), 'utf8'))).sort();
const hopDongMC = slug => hopDongV(slug).replace(/^status:[ \t]*verified/m, 'status: machine-cleared');
function khoMC(slug) {
  const R = khoLanV(slug, FINDINGS_2, '');
  writeFileSync(path.join(R, '_acceptance', slug, 'contract.md'), hopDongMC(slug));
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'machine-cleared');
  return R;
}
const CA_BEN_GOI = {
  'start-scan.mjs': {
    neo: "  findings: read(path.join(dir, 'review-findings.md')).t ?? null,", thay: '  findings: null,',
    kiem: may => { const j = quet(khoLanV('bg-q', FINDINGS_2, ''), may); const d = (j.groups.done || []).find(x => x.slug === 'bg-q');
      return d && /^may-di-tiep/.test(d.stateKey) ? `bo quet xep bg-q vao ${d.stateKey}` : null; } },
  'product-map.mjs': {
    neo: "{ findings: readRecord(path.join(dir, 'review-findings.md')).t ?? null, ledger: ledgerTxt ?? null }", thay: '{ findings: null, ledger: null }',
    kiem: async may => { const R = khoMC('bg-m'); const { renderProductMap } = await import(pathToFileURL(path.join(may, 'scripts', 'product-map.mjs')).href + `?v=${Math.random()}`);
      return /`bg-m` — không đọc được hồ sơ/.test(renderProductMap(R)) ? null : 'ban do khong goi bg-m la ho so hong'; } },
  'khong-can-nguoi.mjs': {
    neo: "  const ctx = { findings: docCanh('review-findings.md'), ledger: docCanh('decisions.jsonl') };", thay: "  const ctx = { findings: null, ledger: docCanh('decisions.jsonl') };",
    kiem: may => { const R = khoLanV('bg-c', FINDINGS_2, ''); const o = spawnSync(process.execPath, [path.join(may, 'scripts', 'khong-can-nguoi.mjs'), '--check', '--root', R, '--slug', 'bg-c'], { encoding: 'utf8' });
      return o.status === 2 && /chưa người định tuyến/.test(o.stderr) ? null : `CLI --check exit ${o.status}: ${(o.stderr || '').trim()}`; } },
};
if (want('HK-AC8-ben-goi') || want('HK-AC8-dot-bien')) {
  const ds = benGoi(); const thieuCa = ds.filter(f => !CA_BEN_GOI[f]);
  if (want('HK-AC8-ben-goi')) {
    try {
      const sai = [];
      if (!ds.length) sai.push('quet scripts/ ra 0 ben goi — phep rut hong');
      if (thieuCa.length) sai.push(`ben goi chua co ca: ${thieuCa.join(', ')}`);
      for (const f of ds) if (CA_BEN_GOI[f]) { const e = await CA_BEN_GOI[f].kiem(KIT); if (e) sai.push(`${f}: ${e}`); }
      if (sai.length) bad('HK-AC8-ben-goi', sai.join(' ; ')); else ok('HK-AC8-ben-goi', `— ${ds.length} bên gọi rút từ quét (${ds.join(', ')}), cả ${ds.length} ra «còn cần người» trên fixture chưa định tuyến`);
    } catch (e) { bad('HK-AC8-ben-goi', loi(e)); }
  }
  if (want('HK-AC8-dot-bien')) {
    try {
      const sai = [];
      for (const f of ds) { const c = CA_BEN_GOI[f]; if (!c) continue;
        const may = banSaoMay([[`scripts/${f}`, c.neo, c.thay]]);
        if (!(await c.kiem(may))) sai.push(`${f}: mutant bo truyen findings ma ca van xanh`); }
      if (sai.length) bad('HK-AC8-dot-bien', sai.join(' ; ')); else ok('HK-AC8-dot-bien', `— bỏ truyền tệp phát hiện ở từng bên gọi (${ds.length}) → ca của bên ấy đỏ`);
    } catch (e) { bad('HK-AC8-dot-bien', loi(e)); }
  }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (hskt)`);
process.exit(fail ? 1 : 0);
