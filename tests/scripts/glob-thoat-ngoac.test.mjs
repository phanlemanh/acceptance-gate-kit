// GT — mục `paths` viết theo thành ngữ thoát ngoặc của glob (hồ sơ glob-thoat-ngoac, 09/10/2026).
//
// `[[]` là dấu `[` thật, `[]]` là dấu `]` thật (fast-glob/micromatch/bash). crm viết thư mục động
// Next.js `[slug]` là `[[]slug]`; kit đọc theo nghĩa đen nên mục không khớp tệp nào: làn ghim lại gắn
// oan `evals_not_machine_touched` (crm dien-thoai-ca-nhan, repin-20261009T051019Z-68477), lưới hoá cũ
// rơi về luật cũ, và kế hoạch mang sang S4 mang eval sang dù tệp của nó đã đổi (xanh giả).
//
// Luật đo:
//  - Bảng glob × tệp và kỳ vọng VIẾT TRƯỚC (hằng dưới), không tính từ mã sản phẩm.
//  - Kho mẫu là kho git THẬT dựng trong lần chạy; pin do CHÍNH `repin-lane.mjs --write` ghi.
//  - Mỗi ca là một hàm của gốc kit: chạy trên kit thật phải không lỗi; năm đột biến (GT5a–e) chạy
//    CÙNG hàm trên bản sao trọn `lib/ scripts/ feature-loop/` bị tiêm đúng một kim (kim khớp đúng
//    một lần) và phải ra đúng thông điệp ghim.
//  - Đường dẫn suy từ vị trí tệp này. Mỗi ca in ĐÚNG MỘT dòng `PASS: GTx …` / `FAIL: GTx … (DO: …)`.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const req = createRequire(import.meta.url);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gtn-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const cut = (s, n = 200) => (String(s).length > n ? String(s).slice(0, n) + '…' : String(s));
const lib = (kit) => req(path.join(kit, 'lib', 'evidence-core.cjs'));
const carry = (kit) => import(pathToFileURL(path.join(kit, 'feature-loop', 'scripts', 'carry-plan.mjs')).href);

// ── bảng viết trước (AC-1) ──────────────────────────────────────────────────
const G = ['a/[[]slug]/c/**', 'a/[[]slug]/c/x.tsx', 'a/[]]/x', 'a/[slug]/c/**', 'a/(app)/[[]slug]/[[]id]/*.tsx'];
const P = ['a/[slug]/c/x.tsx', 'a/s/c/x.tsx', 'a/[[]slug]/c/x.tsx', 'a/]/x', 'a/(app)/[slug]/[id]/p.tsx'];
// KY[g][p] = 1 khi glob g phải khớp tệp p. Hàng 4 («[slug]» trần) là hành vi HÔM NAY, không đổi.
const KY = [
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1],
];

// Khối paths NGUYÊN VĂN của ô E1, crm `_acceptance/dien-thoai-ca-nhan/evals.yaml` @ f58f27802 (AC-3).
const CRM_SLUG = 'dien-thoai-ca-nhan';
const CRM_PATHS_E1 = `    paths:
      - "apps/app/components/crm/record-sheet/quick-add.tsx"
      - "apps/app/app/(app)/[[]slug]/contacts/**"
      - "apps/app/lib/messages/contacts.ts"
      - "apps/app/lib/messages/record-sheet.ts"
      - "apps/api/src/contacts/**"
      - "packages/validation/src/so-dien-thoai.ts"
      - "packages/db/src/so-dien-thoai.ts"
      - "_acceptance/dien-thoai-ca-nhan/rang/do-man.mjs"
`;
const TEP_THAT = 'apps/app/app/(app)/[slug]/contacts/x.tsx';
const TEP_CRM = ['apps/app/components/crm/record-sheet/quick-add.tsx', TEP_THAT, 'apps/app/lib/messages/contacts.ts',
  'apps/app/lib/messages/record-sheet.ts', 'apps/api/src/contacts/a.ts', 'packages/validation/src/so-dien-thoai.ts',
  'packages/db/src/so-dien-thoai.ts', '_acceptance/dien-thoai-ca-nhan/rang/do-man.mjs', 'packages/db/src/khac.ts', 'other/z.js'];

// ── kho mẫu: hồ sơ đã ký, pin do writer thật ghi ────────────────────────────
const W = (root, rel, txt) => { const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, txt); };
function dungKho(kit, { slug, evalsYaml, tep, staleScope }) {
  const R = mk('kho-');
  const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const rt = ['risk_tiers:', '  t1_skip_globs:', '    - "docs/**"', ...(staleScope ? [`  stale_scope: ${staleScope}`] : [])];
  W(R, '_acceptance/config.yaml', ['schema_version: 1', 'enforcement: strict', 'recheck: strict', 'gap_probe: off',
    'feature_loop:', '  suite_keys:', '    - executors.test.s0', 'executors:', '  test:', '    s0: "true"', '  script:', '    rang_ok: "true"',
    '  ui:', '    x: "echo ui"', ...rt, ''].join('\n'));
  for (const t of tep) W(R, t, 'v1\n');
  W(R, `_acceptance/${slug}/contract.md`, `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [ui]\nstatus: implemented\napproved_by: Nguoi Ky\n---\n`);
  W(R, `_acceptance/${slug}/evals.yaml`, evalsYaml);
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const H1 = git('rev-parse', 'HEAD');
  W(R, `_acceptance/${slug}/run-log.jsonl`, JSON.stringify({ ts: '2026-10-01T00:00:00Z', kind: 'eval', run_id: 'r1-E2', sha: H1, eval: 'E2', exit_code: 0 }) + '\n');
  W(R, `_acceptance/${slug}/evidence-report.md`, `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Nguoi Ky 2026-10-01\n---\n\n## Evidence\n- eval: E2\n  run_id: r1-E2\n  exit_code: 0\n  verifier: config:executors.script.rang_ok\n  verified_at: 2026-10-01\n\n## Iterations\n\nRound 1 — PASS.\n`);
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const w = chayLan(kit, R, slug);
  if (w.status !== 0) throw new Error(`kho mẫu: writer thật không ghi được pin (exit ${w.status}) ${cut(w.stderr, 300)}`);
  git('add', '-A'); git('commit', '-qm', 'repin');
  const doi = (ds) => { for (const t of ds) fs.appendFileSync(path.join(R, t), '# v2\n'); git('add', '-A', '--', ...ds); git('commit', '-qm', 'diff sau pin'); };
  return { R, slug, doi, log: path.join(R, '_acceptance', slug, 'run-log.jsonl') };
}
const chayLan = (kit, R, slug) => spawnSync(process.execPath, [path.join(kit, 'feature-loop', 'scripts', 'repin-lane.mjs'),
  '--root', R, '--ag-root', kit, '--slug', slug, '--reason', 'ca GT', '--write'], { encoding: 'utf8' });
const dongRepinCuoi = (log) => JSON.parse(fs.readFileSync(log, 'utf8').split('\n').filter(l => l.includes('"kind":"repin"')).pop());
const chayPremerge = (kit, R) => { const r = spawnSync('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), R], { encoding: 'utf8' }); return (r.stdout || '') + (r.stderr || ''); };

// ── các phép phán: (kit) → mảng lỗi ─────────────────────────────────────────
async function phanBoDich(kit, ca) {
  const L = lib(kit); const { globToRe } = await carry(kit);
  const loi = []; let o = 0;
  G.forEach((g, i) => P.forEach((p, j) => {
    o++;
    const a = L.pathGlobToRe(g).test(p) ? 1 : 0; const b = globToRe(g).test(p) ? 1 : 0;
    if (ca === 'GT1' && a !== KY[i][j]) loi.push(`pathGlobToRe «${g}» ~ «${p}» = ${a}, ky vong ${KY[i][j]}`);
    if (ca === 'GT1b' && b !== KY[i][j]) loi.push(`globToRe «${g}» ~ «${p}» = ${b}, ky vong ${KY[i][j]}`);
    if (ca === 'GT1c' && a !== b) loi.push(`hai bo dich lech o «${g}» ~ «${p}»: lib ${a}, carry-plan ${b}`);
  }));
  if (o !== G.length * P.length) loi.push(`so o ${o} != ${G.length * P.length}`);
  return loi;
}
function phanPhanLoai(kit, ca) {
  const L = lib(kit); const cay = L.dungCayPaths([TEP_THAT, 'other/z.js']);
  const pl = (m) => L.phanLoaiMucPaths(m, cay);
  const nhanVaKhop = (m) => { const x = pl(m); return x.nhan && L.pathGlobToRe(x.glob).test(TEP_THAT); };
  if (ca === 'GT2') return nhanVaKhop('apps/app/app/(app)/[[]slug]/contacts/**') ? [] : [`muc thanh ngu co ** bi tu choi: ${JSON.stringify(pl('apps/app/app/(app)/[[]slug]/contacts/**'))}`];
  if (ca === 'GT2b') return nhanVaKhop('apps/app/app/(app)/[[]slug]/contacts/x.tsx') ? [] : [`muc khong * bi tu choi: ${JSON.stringify(pl('apps/app/app/(app)/[[]slug]/contacts/x.tsx'))}`];
  if (ca === 'GT2c') {
    const loi = [];
    if (!nhanVaKhop('apps/app/app/(app)/[slug]/contacts/**')) loi.push(`[slug] tran doi ket qua: ${JSON.stringify(pl('apps/app/app/(app)/[slug]/contacts/**'))}`);
    const x = pl('apps/khong-co'); if (x.nhan || x.ma !== 'paths-khong-tro-toi-tep') loi.push(`thu muc khong co doi ket qua: ${JSON.stringify(x)}`);
    return loi;
  }
  const x = pl('apps/app/app/(app)/[[]slugg]/contacts/x.tsx');
  return !x.nhan && x.ma === 'paths-khong-tro-toi-tep' ? [] : [`muc go sai duoc nhan: ${JSON.stringify(x)}`];
}
const EVALS_LAN = `schema_version: 1
slug: ${CRM_SLUG}

evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    cmd: config:executors.ui.x
${CRM_PATHS_E1}    expected: >
      Nhin frame.
  - id: E2
    criterion: AC-2
    executor: script
    cmd: config:executors.script.rang_ok
    paths: ["other/**"]
    expected: >
      Xanh.
  - id: E18
    criterion: AC-3
    executor: ui-check
    cmd: config:executors.ui.x
    paths:
      - "packages/db/src/khac.ts"
    expected: >
      Nhin frame.
`;
function phanLan(kit, ca) {
  const k = dungKho(kit, { slug: CRM_SLUG, evalsYaml: EVALS_LAN, tep: TEP_CRM });
  k.doi(ca === 'GT3' ? ['other/z.js'] : [TEP_THAT]);
  const r = chayLan(kit, k.R, k.slug);
  if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 300)}`];
  const d = dongRepinCuoi(k.log);
  if (ca === 'GT3') return 'evals_not_machine_touched' in d ? [`gan oan: diff khong cham apps/ ma touched = ${JSON.stringify(d.evals_not_machine_touched)}`] : [];
  return JSON.stringify(d.evals_not_machine_touched) === '["E1"]' ? [] : [`diff cham [slug] ma touched = ${JSON.stringify(d.evals_not_machine_touched)} (ky vong ["E1"])`];
}
async function phanMangSang(kit, ca) {
  const { plan } = await carry(kit);
  const evalsText = `schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_ok\n    paths: ["apps/app/app/(app)/[[]slug]/contacts/**"]\n`;
  const runLogText = JSON.stringify({ ts: '2026-10-01T00:00:00Z', sha: 'a'.repeat(40), round: 1, evalId: 'E1', run_id: 'r1-E1', exit_code: 0, cmd: 'true' }) + '\n';
  const r = plan({ runLogText, evalsText, contractText: '## Criteria\n\n- AC-1: x\n', deltaFiles: ca === 'GT4' ? [TEP_THAT] : ['other/z.js'], round: 2, agRoot: kit });
  const ly = (r.reason || {}).E1 || '';
  const carried = (r.carriedEvals || []).some(c => c.id === 'E1');
  if (ca === 'GT4') return !carried && ly.startsWith('diff-fix chạm ' + TEP_THAT) ? [] : [`khong chay lai du diff cham: carried=${carried}, ly do «${ly}»`];
  return carried && ly === 'paths không chạm diff-fix, round trước xanh' ? [] : [`doi chung khong mang sang: carried=${carried}, ly do «${ly}»`];
}
function phanHoaCu(kit, ca) {
  const k = dungKho(kit, { slug: 'feat', staleScope: 'paths', tep: [TEP_THAT, 'other/z.js'],
    evalsYaml: 'schema_version: 1\nevals:\n  - id: E2\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_ok\n    paths: ["apps/app/app/(app)/[[]slug]/contacts/**"]\n' });
  k.doi(ca === 'GT6' ? [TEP_THAT] : ['other/z.js']);
  const out = chayPremerge(kit, k.R);
  if (!/pre-merge-check: (clean|\d+ violation)/.test(out) || !/\[feat\]/.test(out)) return [`luoi khong chay toi ho so: ${cut(out, 300)}`];
  const stale = /VIOLATION \[feat\]: evidence is stale/.test(out);
  if (ca === 'GT6') return stale && out.includes(`    ${TEP_THAT}`) ? [] : [`diff cham [slug] ma khong hoa cu: ${cut(out, 300)}`];
  return !stale ? [] : [`hoa cu oan khi chi cham tep ngoai paths: ${cut(out, 300)}`];
}

// ── bản sao bị tiêm (AC-6) ──────────────────────────────────────────────────
function banSao(tep, tu, thanh) {
  const D = mk('sao-');
  for (const d of ['lib', 'scripts', 'feature-loop']) fs.cpSync(path.join(KIT, d), path.join(D, d), { recursive: true });
  const p = path.join(D, tep); const s = fs.readFileSync(p, 'utf8');
  const n = s.split(tu).length - 1;
  if (n !== 1) throw new Error(`tiem hut: kim «${cut(tu, 70)}» xuat hien ${n} lan trong ${tep}`);
  fs.writeFileSync(p, s.replace(tu, thanh));
  return D;
}
const KIM_DICH = "else if (c === '[' && (g.startsWith('[[]', i) || g.startsWith('[]]', i))) { re += '\\\\' + g[i + 1]; i += 2; }";
const DOT_BIEN = [
  { id: 'GT5a', title: 'gỡ thành ngữ ở pathGlobToRe → làn ghim lại gắn oan (chiều im GT3 đỏ)', tep: 'lib/evidence-core.cjs', tu: KIM_DICH, thanh: '', phan: (k) => phanLan(k, 'GT3'), ghim: 'gan oan' },
  { id: 'GT5b', title: 'gỡ thành ngữ ở globToRe → mang sang eval đã chạm (GT4 đỏ)', tep: 'feature-loop/scripts/carry-plan.mjs', tu: KIM_DICH, thanh: '', phan: (k) => phanMangSang(k, 'GT4'), ghim: 'carried=true' },
  { id: 'GT5c', title: 'gỡ nhánh «thành ngữ là glob» ở phanLoaiMucPaths → mục không * bị từ chối (GT2b đỏ)', tep: 'lib/evidence-core.cjs', tu: 'if (/[*?]|\\[\\[\\]|\\[\\]\\]/.test(v)) {', thanh: 'if (/[*?]/.test(v)) {', phan: (k) => phanPhanLoai(k, 'GT2b'), ghim: 'muc khong * bi tu choi' },
  { id: 'GT5d', title: 'nhánh thành ngữ bỏ kiểm tồn tại → mục gõ sai được nhận (GT2d đỏ)', tep: 'lib/evidence-core.cjs',
    tu: "if (cay.dsThuMuc.some(d => re.test(d))) return { nhan: false, ma: 'dang-khai-la' };\n    return coTep ? { nhan: true, glob: v } : { nhan: false, ma: 'paths-khong-tro-toi-tep' };",
    thanh: "if (cay.dsThuMuc.some(d => re.test(d))) return { nhan: false, ma: 'dang-khai-la' };\n    return { nhan: true, glob: v };", phan: (k) => phanPhanLoai(k, 'GT2d'), ghim: 'muc go sai duoc nhan' },
  { id: 'GT5e', title: 'bộ đọc chung cắt ở «]» đầu tiên (không nhận vỏ nháy) → khứ hồi paths của carry-plan đỏ (GT4 đỏ)', tep: 'lib/evidence-core.cjs',
    tu: "if (dauMuc && (ch === '\"' || ch === \"'\")) { q = ch; dauMuc = false; continue; }", thanh: '', phan: (k) => phanMangSang(k, 'GT4'), ghim: 'thiếu paths' },
];

// ── chạy ────────────────────────────────────────────────────────────────────
const CA = [
  ['GT1', 'bảng 5 glob × 5 tệp viết trước qua pathGlobToRe (lib)', (k) => phanBoDich(k, 'GT1')],
  ['GT1b', 'cùng bảng qua globToRe (carry-plan)', (k) => phanBoDich(k, 'GT1b')],
  ['GT1c', 'hai bộ dịch cho cùng kết quả ở cả 25 ô', (k) => phanBoDich(k, 'GT1c')],
  ['GT2', 'mục thoát ngoặc có ** → nhận, glob khớp tệp [slug] thật', (k) => phanPhanLoai(k, 'GT2')],
  ['GT2b', 'mục thoát ngoặc không * → nhận, glob khớp tệp thật', (k) => phanPhanLoai(k, 'GT2b')],
  ['GT2c', 'chiều im: [slug] trần nhận như hôm nay; thư mục không có vẫn bị từ chối cùng mã', (k) => phanPhanLoai(k, 'GT2c')],
  ['GT2d', 'mục thành ngữ trỏ tệp không có → paths-khong-tro-toi-tep', (k) => phanPhanLoai(k, 'GT2d')],
  ['GT3', 'làn ghim lại, khối paths nguyên văn crm E1, diff không chạm apps/ → không gắn touched', (k) => phanLan(k, 'GT3')],
  ['GT3b', 'làn ghim lại, diff chạm tệp trong [slug] thật → touched đúng ["E1"]', (k) => phanLan(k, 'GT3b')],
  ['GT4', 'carry-plan đọc evals.yaml văn bản; diff chạm [slug] thật → chạy lại «diff-fix chạm»', (k) => phanMangSang(k, 'GT4')],
  ['GT4b', 'đối chứng: diff không chạm → mang sang', (k) => phanMangSang(k, 'GT4b')],
  ['GT6', 'lưới hoá cũ (stale_scope: paths): diff chạm [slug] thật → hoá cũ, gọi tên tệp', (k) => phanHoaCu(k, 'GT6')],
  ['GT6b', 'chiều im: diff chỉ chạm tệp ngoài paths → không hoá cũ', (k) => phanHoaCu(k, 'GT6b')],
];
const LOC = process.env.GTN_CASES ? new Set(process.env.GTN_CASES.split(',')) : null;
let pass = 0, fail = 0;
const bao = (id, title, loi) => {
  if (loi.length) { fail++; console.log(`  FAIL: ${id} ${title} (DO: ${cut(loi.join(' | '), 600)})`); } else { pass++; console.log(`  PASS: ${id} ${title}`); }
};
for (const [id, title, f] of CA) {
  if (LOC && !LOC.has(id)) continue;
  let loi; try { loi = await f(KIT); } catch (e) { loi = [`nem loi: ${cut(e.message, 300)}`]; }
  bao(id, title, loi);
}
for (const m of DOT_BIEN) {
  if (LOC && !LOC.has(m.id)) continue;
  let loi = [];
  try {
    const D = banSao(m.tep, m.tu, m.thanh);
    const ra = await m.phan(D);
    if (!ra.some(x => x.includes(m.ghim))) loi.push(`ban sao tiem khong do dung thong diep «${m.ghim}»: ${cut(JSON.stringify(ra), 300)}`);
  } catch (e) { loi = [`nem loi: ${cut(e.message, 300)}`]; }
  bao(m.id, m.title, loi);
}
if (pass + fail === 0) { console.log('  FAIL: bo loc GTN_CASES khop 0 ca'); process.exit(1); }
console.log(`\nResults: ${pass} passed, ${fail} failed (glob-thoat-ngoac)`);
process.exit(fail ? 1 : 0);
