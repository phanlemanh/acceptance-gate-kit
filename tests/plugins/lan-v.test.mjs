// Ca của hồ sơ lan-v-khong-phai-cho-ky (LV1–LV8) — một vật: máy quét vào phiên.
//
// Câu hỏi duy nhất đang đo: với hồ sơ `verified` chưa ký, máy quét có trả lời
// ĐÚNG câu lưới trước-merge hỏi không — «hồ sơ này còn cần người không?».
// Vòng một của hồ sơ đo sai câu (khoá vào veto_state) và lệch ngược chiều an
// toàn: hồ sơ chưa sạch biến mất khỏi danh sách chờ ký trong khi lưới vẫn chặn.
//
// Hai thước, cố ý tách:
//   · LV4 — BẢNG SỰ-THẬT viết tay (kỳ vọng độc lập với vị từ đang kiểm).
//   · LV5 — ĐẲNG THỨC với CHÍNH scripts/pre-merge-check.sh trên kho git fixture
//     code-sinh: bash và JS là hai bản dựng độc lập, nên phép so này không
//     hằng-đúng theo cấu trúc — đột biến bên nào cũng đỏ.
//
// Chạy một phần: LV_CASES=LV1,LV4 node tests/plugins/lan-v.test.mjs
// Bộ lọc có SÀN ĐẾM: tên không khớp ca nào → exit 1 (không xanh với 0 assertion).
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, copyFileSync, readFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const { fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const PREMERGE = path.join(ROOT, 'scripts', 'pre-merge-check.sh');

let failures = 0;
let matched = 0;
const only = (process.env.LV_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => { const w = only.length === 0 || only.includes(id); if (w) matched++; return w; };
const pass = (id, name) => console.log(`PASS: ${id} ${name}`);
const fail = (id, msg) => { console.log(`FAIL: ${id} ${msg}`); failures++; };

// ─── Fixture code-sinh ───────────────────────────────────────────────────────
// Hợp đồng rút từ khuôn CANONICAL (bên VIẾT). Hai khoá làn V và tên người duyệt
// TIÊM SAU vào frontmatter đã có — đúng như đời thật.
function contractText(slug, { status, veto, opened, tier, approvedBy, gate1Skipped }) {
  let t = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier: tier, surfaces: 'cli', status },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`);
  if (approvedBy) {
    t = t.replace(/^approved_by:.*$/m, `approved_by: ${approvedBy}`)
         .replace(/^approved_at:.*$/m, 'approved_at: 2026-08-20');
  }
  const extra = [];
  if (gate1Skipped) extra.push('gate1_skipped: true');
  if (veto != null) extra.push(`veto_state: ${veto}`);
  if (opened != null) extra.push(`veto_opened_at: ${opened}`);
  if (extra.length) t = t.replace(/^approved_at:.*$/m, m => [m, ...extra].join('\n'));
  return t;
}

// Báo cáo bằng chứng theo ĐÚNG khuôn lưới đọc (recheck strict: run_id · exit 0 ·
// verifier có thật). Known limit #5 của hồ sơ: khuôn bên viết chưa có marker để
// rút — vật viết tay này là chỗ trôi có thể xảy ra, ghi sổ chứ không giấu.
// sach: 'sach' | 'bypass' | 'uncertain' | 'kl-co' | 'nhd-co' | 'kl-vang' | 'nhd-vang' | 'enf-off' | 'kl-h1-co'
function evidenceText(slug, { verdict, signoff, sach, verifiedCommit }) {
  const kl = sach === 'kl-co' ? '## Known limits\n\n- còn một lỗ chưa đóng\n'
           : sach === 'kl-h1-co' ? '# Known limits\n\n- còn một lỗ chưa đóng (tiêu đề h1)\n'
           : sach === 'kl-vang' ? ''
           : '## Known limits\n\n';
  const nhd = sach === 'nhd-co' ? '## Ngoài hợp đồng\n\n- một finding ngoài phạm vi\n'
            : sach === 'nhd-vang' ? ''
            : '## Ngoài hợp đồng\n\n';
  const unc = sach === 'uncertain' ? '- eval: E2\n  run_id: ' + slug + '-E2-001\n  exit_code: 0\n  verifier: verify.sh\n  verdict: UNCERTAIN\n' : '';
  return `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: ${verdict}\n` +
    `verified_commit: ${verifiedCommit}\nenforcement_mode: ${sach === 'enf-off' ? 'off' : 'strict'}\n` +
    `bypass_used: ${sach === 'bypass' ? 'true' : 'false'}\n` +
    `human_signoff:${signoff ? ' ' + signoff : ''}\n---\n\n# Evidence Report: ${slug}\n\n` +
    `## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-21\n${unc}\n` +
    kl + '\n' + nhd;
}

function mkRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'lanv-'));
  mkdirSync(path.join(root, '_acceptance'), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\nenforcement: strict\n');
  writeFileSync(path.join(root, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  return root;
}

function mkWorkspace(root, slug, o) {
  const dir = path.join(root, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'contract.md'), contractText(slug, o));
  if (o.verdict != null) {
    writeFileSync(path.join(dir, 'evidence-report.md'),
      evidenceText(slug, { ...o, verifiedCommit: o.verifiedCommit || '0'.repeat(40) }));
  }
  return dir;
}

function scan(root) {
  const j = JSON.parse(execFileSync('node', [SCAN, '--root', root], { encoding: 'utf8' }));
  return {
    gates: new Set((j.groups.gates || []).map(g => g.slug)),
    done: new Map((j.groups.done || []).map(d => [d.slug, d.state])),
    inProgress: new Set((j.groups.inProgress || []).map(p => p.slug)),
    broken: new Set((j.broken || []).map(b => b.slug)),
  };
}
const oCua = (s, slug) => s.broken.has(slug) ? 'broken'
  : s.gates.has(slug) ? 'gates'
  : s.inProgress.has(slug) ? 'inProgress'
  : (s.done.get(slug) ?? '(khong o dau)');

const withRepo = fn => { const root = mkRepo(); try { return fn(root); } finally { rmSync(root, { recursive: true, force: true }); } };

// Hồ sơ sạch, máy đóng Cổng 1 đúng vết.
const V_SACH = { status: 'verified', veto: 'mo', opened: '2026-08-21T09:00:00Z', tier: 'T2', approvedBy: '', verdict: 'PASS', signoff: '', sach: 'sach' };
// Hồ sơ sạch, người duyệt Cổng 1 (không khoá veto).
const NGUOI_SACH = { ...V_SACH, veto: null, opened: null, approvedBy: 'Manh Phan' };

// ─── LV1 — sạch + chưa ký ⇒ đã giao, hai biến thể ────────────────────────────
if (want('LV1')) {
  const errs = [];
  for (const [ten, o, kyVong] of [['V-co-vet', V_SACH, 'lan-v-mo'], ['nguoi-duyet', NGUOI_SACH, 'xanh-sach'],
                                  ['nguoi-duyet+cua-veto-mo', { ...V_SACH, approvedBy: 'Manh Phan' }, 'lan-v-mo']]) {
    withRepo(root => {
      mkWorkspace(root, 'lv1', o);
      const s = scan(root);
      if (s.gates.has('lv1')) errs.push(`sach ma van o gates: ${ten}`);
      if (s.done.get('lv1') !== kyVong) errs.push(`${ten}: state ky vong ${kyVong} thuc te ${oCua(s, 'lv1')}`);
    });
  }
  if (errs.length) fail('LV1', errs.join(' · '));
  else pass('LV1', 'sach + chua ky -> done (lan-v-mo khi cua veto mo, ke ca nguoi da duyet Cong 1 · xanh-sach khi khong co cua veto)');
}

// ─── LV2 — V-mở nhưng CHƯA SẠCH ⇒ vẫn là cổng (lỗ vòng một) ──────────────────
if (want('LV2')) {
  const errs = [];
  // kl-h1-co: h1 «Known limits» có nội dung — bash và máy quét cùng nói «VẮNG» (ranh #{2,6},
  // duong-lui-phai-song AC-3); ca này nay CÓ trong LV5.
  for (const sach of ['bypass', 'uncertain', 'kl-co', 'nhd-co', 'kl-vang', 'nhd-vang', 'enf-off', 'kl-h1-co']) {
    withRepo(root => {
      mkWorkspace(root, 'lv2', { ...V_SACH, sach });
      const s = scan(root);
      if (s.done.has('lv2')) errs.push(`chua sach ma thanh done: ${sach} (${s.done.get('lv2')})`);
      if (!s.gates.has('lv2')) errs.push(`chua sach ma khong o gates: ${sach} (${oCua(s, 'lv2')})`);
    });
  }
  if (errs.length) fail('LV2', errs.join(' · '));
  else pass('LV2', 'V-mo + PASS + T2 nhung CHUA SACH -> van o gates (8 bien the)');
}

// ─── LV3 — da-veto ⇒ không bao giờ đã giao ────────────────────────────────────
if (want('LV3')) {
  withRepo(root => {
    mkWorkspace(root, 'lv3', { ...NGUOI_SACH, veto: 'da-veto', opened: '2026-08-21T09:00:00Z' });
    const s = scan(root);
    if (s.done.has('lv3')) fail('LV3', `da-veto thanh done (${s.done.get('lv3')})`);
    else if (!s.gates.has('lv3')) fail('LV3', `da-veto khong o gates: ${oCua(s, 'lv3')}`);
    else pass('LV3', 'da-veto -> KHONG done du bang chung sach');
  });
}

// ─── LV4 — bảng sự-thật viết trước, 240 ô ────────────────────────────────────
if (want('LV4')) {
  const VETO = [
    ['vang',        { veto: null,      opened: null,                   approvedBy: 'Manh Phan' }],
    ['mo-vet-ok',   { veto: 'mo',      opened: '2026-08-21T09:00:00Z', approvedBy: '' }],
    ['mo-vet-hong', { veto: 'mo',      opened: 'hom-qua',              approvedBy: '' }],
    ['da-veto',     { veto: 'da-veto', opened: '2026-08-21T09:00:00Z', approvedBy: 'Manh Phan' }],
  ];
  const VERDICT = [['PASS', 'PASS'], ['PENDING-JUDGMENT', 'PENDING-JUDGMENT'],
                   ['REJECT', 'REJECT'], ['BLOCKED', 'BLOCKED'], ['vang-evidence', null]];
  const HANG = ['T2', 'T3'];
  const KY = [['chua-ky', ''], ['da-ky', 'Manh 2026-08-21']];
  const SACH = ['sach', 'bypass', 'kl-co'];

  // Kỳ vọng viết tay — suy từ LUẬT, độc lập với vị từ đang kiểm:
  //  · verified mà vắng bằng chứng = hồ sơ hỏng
  //  · chữ ký thắng mọi thứ ⇒ signed-off
  //  · da-veto ⇒ không bao giờ done; verdict chốt (PASS/PENDING) ⇒ gates, còn lại inProgress
  //  · done CHỈ khi: PASS · T2 · sạch · (V mở có vết ⇒ lan-v-mo | người duyệt ⇒ xanh-sach)
  //  · mọi ca còn lại: PASS/PENDING ⇒ gates; REJECT/BLOCKED ⇒ inProgress
  const kyVong = (veto, verdict, hang, ky, sach) => {
    if (verdict === null) return 'broken';
    if (ky !== '') return 'signed-off';
    const chot = verdict === 'PASS' || verdict === 'PENDING-JUDGMENT';
    if (veto === 'da-veto') return chot ? 'gates' : 'inProgress';
    if (verdict === 'PASS' && hang === 'T2' && sach === 'sach') {
      if (veto === 'mo-vet-ok') return 'lan-v-mo';
      if (veto === 'vang') return 'xanh-sach';
    }
    return chot ? 'gates' : 'inProgress';
  };

  const errs = []; let oDem = 0, oDone = 0;
  for (const [bTen, bOver] of VETO) for (const [cTen, cVal] of VERDICT) for (const d of HANG)
    for (const [eTen, eVal] of KY) for (const f of SACH) {
      oDem++;
      const kv = kyVong(bTen, cVal, d, eVal, f);
      if (kv === 'lan-v-mo' || kv === 'xanh-sach') oDone++;
      withRepo(root => {
        mkWorkspace(root, 'lv4', { status: 'verified', ...bOver, tier: d, verdict: cVal, signoff: eVal, sach: f });
        const tt = oCua(scan(root), 'lv4');
        if (tt !== kv) errs.push(`(veto=${bTen}, verdict=${cTen}, hang=${d}, ky=${eTen}, sach=${f}) ky vong ${kv} thuc te ${tt}`);
      });
    }
  if (oDem !== 240) errs.push(`so o dem duoc ${oDem} != 240 khai truoc`);
  if (oDone !== 2) errs.push(`bang ky vong co ${oDone} o done, khai truoc dung 2`);
  if (errs.length) fail('LV4', `${errs.length} loi — ${errs.slice(0, 5).join(' · ')}`);
  else pass('LV4', `bang su-that ${oDem} o: ${oDone} o done khop ham ky vong`);
}

// Mục ngoài hợp đồng RÚT từ khuôn bên viết (cùng cách P55) — ho-so-khep-thoi-hoi AC-4.
const OOC_TPL = (() => {
  const wf = readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('khong rut duoc OOC-ITEM-TEMPLATE');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
})();
const mucOoc = i => OOC_TPL.replace(/\{(\w+)\}/g, (_, k) => ({ title: `loi ${i}`, plain: `Người dùng thấy ${i}.`, file: `src/a${i}.js`, severity: 'low', proposal: 'known-limits' }[k]));
const OOC_2 = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n' + mucOoc(1) + '\n' + mucOoc(2) + '\n';
const gate2Line = q => JSON.stringify({ id: 'd-20260922T010000Z-1', type: 'descope', stage: 'gate2', at: '2026-09-22T01:00:00Z', decision: q, impact: 'x' });

// ─── LV5 — đẳng thức với CHÍNH lưới trước-merge ───────────────────────────────
// Kho git fixture: c1 (config · code · verify.sh) → nhánh basepoint → c2 (code
// đổi + hợp đồng verified) → c3 (bằng chứng ghim verified_commit = c2). Lưới
// chạy `--base basepoint`; «còn cần người» = có dòng `VIOLATION [slug]`.
function mkGitRepo(slug, o) {
  const R = mkdtempSync(path.join(tmpdir(), 'lanv-git-'));
  const git = (...a) => execFileSync('git', ['-c', 'user.name=lv', '-c', 'user.email=lv@x', '-C', R, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  mkdirSync(path.join(R, 'src'), { recursive: true });
  mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  git('init', '-q');
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'),
    'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v1\n');
  writeFileSync(path.join(R, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  // Kho tiêu thụ chép đúng bộ file này khi /acceptance-init (commands/acceptance-init.md).
  // Thiếu lib/md-section.cjs thì lưới KHÔNG BAO GIỜ thấy hồ sơ sạch (fail-closed) —
  // LV5 từng đỏ ở chính đối chứng dương vì fixture chưa chép, đúng như đời thật.
  mkdirSync(path.join(R, 'lib'), { recursive: true }); mkdirSync(path.join(R, 'scripts'), { recursive: true });
  for (const f of ['evidence-core.cjs', 'gap-probe.cjs', 'workspace-record.cjs', 'ac-line.cjs', 'md-section.cjs', 'out-of-contract.cjs'])
    copyFileSync(path.join(ROOT, 'lib', f), path.join(R, 'lib', f));
  copyFileSync(path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
  git('add', '-A'); git('commit', '-qm', 'c1');
  git('branch', 'basepoint');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v2\n');
  mkdirSync(path.join(R, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(R, '_acceptance', slug, 'contract.md'), contractText(slug, o));
  git('add', '-A'); git('commit', '-qm', 'c2');
  const c2 = git('rev-parse', 'HEAD').trim();
  writeFileSync(path.join(R, '_acceptance', slug, 'evidence-report.md'), evidenceText(slug, { ...o, verifiedCommit: c2 }));
  // Tệp phát hiện + sổ cạnh báo cáo (hồ sơ ho-so-khep-thoi-hoi AC-4): hai bản dựng phải đọc CÙNG.
  if (o.findings != null) writeFileSync(path.join(R, '_acceptance', slug, 'review-findings.md'), o.findings);
  if (o.ledger != null) writeFileSync(path.join(R, '_acceptance', slug, 'decisions.jsonl'), o.ledger + '\n');
  git('add', '-A'); git('commit', '-qm', 'c3');
  return R;
}
function luoi(R, slug) {
  const env = { ...process.env }; delete env.PRE_MERGE_BASE;
  const r = spawnSync('bash', [PREMERGE, R, '--base', 'basepoint'], { encoding: 'utf8', env });
  const out = (r.stdout || '') + (r.stdout && r.stderr ? '\n' : '') + (r.stderr || '');
  const chanSlug = new RegExp(`^VIOLATION \\[${slug}\\]`, 'm').test(out);
  const chanKhac = /^VIOLATION /m.test(out) && !chanSlug;
  return { status: r.status, chanSlug, chanKhac, out };
}

const TRONG_HD_DUOI = '\n## Ngoài hợp đồng — người quyết ở Gate 2\n';
const TRONG_HD_1 = `## Trong hợp đồng\n\n- **Loi mau**\n  severity: medium\n  AC: AC-1\n${TRONG_HD_DUOI}`;
const TRONG_HD_RONG = `## Trong hợp đồng\n\nKhông có finding nào.\n${TRONG_HD_DUOI}`;
const TRONG_HD_NGO = `## Trong hợp đồng\n\n### Loi khuon cu\n\nchu mo ta\n${TRONG_HD_DUOI}`;
const KY_VONG_CHAN = { 'V-trong-hd': true, 'nguoi-trong-hd': true, 'V-trong-hd-rong': false, 'V-trong-hd-ngo': true };

if (want('LV5')) {
  // Mặt cắt: nơi sáu điều kiện + hai nhánh Cổng 1 + da-veto phân biệt được nhau.
  const MAT_CAT = [
    ['V-sach',            V_SACH],
    ['V-bypass',          { ...V_SACH, sach: 'bypass' }],
    ['V-uncertain',       { ...V_SACH, sach: 'uncertain' }],
    ['V-kl-co',           { ...V_SACH, sach: 'kl-co' }],
    ['V-nhd-co',          { ...V_SACH, sach: 'nhd-co' }],
    ['V-kl-vang',         { ...V_SACH, sach: 'kl-vang' }],
    ['V-nhd-vang',        { ...V_SACH, sach: 'nhd-vang' }],
    ['V-vet-hong',        { ...V_SACH, opened: 'hom-qua' }],
    ['V-T3',              { ...V_SACH, tier: 'T3' }],
    ['V-pending',         { ...V_SACH, verdict: 'PENDING-JUDGMENT' }],
    ['nguoi-sach',        NGUOI_SACH],
    ['nguoi-T3',          { ...NGUOI_SACH, tier: 'T3' }],
    ['nguoi-pending',     { ...NGUOI_SACH, verdict: 'PENDING-JUDGMENT' }],
    ['nguoi-vet-hong',    { ...NGUOI_SACH, veto: 'mo', opened: 'hom-qua' }],
    ['V-enf-off',         { ...V_SACH, sach: 'enf-off' }],
    ['nguoi-enf-off',     { ...NGUOI_SACH, sach: 'enf-off' }],
    ['skip-sach',         { ...NGUOI_SACH, approvedBy: '', gate1Skipped: true }],
    ['skip-kl-co',        { ...NGUOI_SACH, approvedBy: '', gate1Skipped: true, sach: 'kl-co' }],
    ['nguoi-kl-co',       { ...NGUOI_SACH, sach: 'kl-co' }],
    ['khong-ai-duyet',    { ...NGUOI_SACH, approvedBy: '' }],
    ['da-veto-sach',      { ...NGUOI_SACH, veto: 'da-veto', opened: '2026-08-21T09:00:00Z' }],
    ['V-kl-h1-co',        { ...V_SACH, sach: 'kl-h1-co' }],
    // ho-so-khep-thoi-hoi AC-4: tệp phát hiện × sổ gate2 (mục rút từ khuôn bên viết).
    ['V-ooc-chua',        { ...V_SACH, findings: OOC_2 }],
    ['V-ooc-mot-phan',    { ...V_SACH, findings: OOC_2, ledger: gate2Line('Ngoài-1: ghi Known limits') }],
    ['V-ooc-du',          { ...V_SACH, findings: OOC_2, ledger: gate2Line('Ngoai-1 den Ngoai-2: ghi Known limits') }],
    ['V-ooc-ngo',         { ...V_SACH, findings: '## Ngoài hợp đồng — người quyết ở Gate 2\n\n- **sai khuon** khong truong\n' }],
    // Lỗi trong hợp đồng còn mở: PASS không có nghĩa là không ai phải đọc lỗi.
    ['V-trong-hd',        { ...V_SACH, findings: TRONG_HD_1 }],
    ['nguoi-trong-hd',    { ...NGUOI_SACH, findings: TRONG_HD_1 }],
    ['V-trong-hd-rong',   { ...V_SACH, findings: TRONG_HD_RONG }],
    ['V-trong-hd-ngo',    { ...V_SACH, findings: TRONG_HD_NGO }],
  ];
  const SO_MAT_CAT = 30;  // khai trước — bớt phần tử là đỏ, không xanh im lặng
  if (MAT_CAT.length !== SO_MAT_CAT) { fail('LV5', `MAT_CAT co ${MAT_CAT.length} phan tu, khai truoc ${SO_MAT_CAT}`); }
  const errs = []; let n = 0; let doiChung = false;
  for (const [ten, o] of MAT_CAT) {
    const R = mkGitRepo('lv5', o);
    try {
      const l = luoi(R, 'lv5');
      if (l.status == null || l.status === 2 || l.chanKhac) {
        errs.push(`ha tang: ${ten} luoi exit ${l.status} / VIOLATION ngoai slug — ${l.out.split('\n').filter(x => /VIOLATION|ERROR|fatal/.test(x)).slice(0, 2).join(' | ')}`);
        continue;
      }
      if (ten === 'V-sach') {
        // Đối chứng dương: fixture sạch-V phải đi qua lưới KHÔNG VIOLATION kèm NOTE
        // xanh-sạch — không có nó, «khớp» ở các ô khác chỉ là hai bên cùng đỏ.
        doiChung = l.status === 0 && !l.chanSlug && /xanh-sạch/.test(l.out);
        if (!doiChung) errs.push(`doi chung duong V-sach: exit ${l.status}, chanSlug=${l.chanSlug}, NOTE xanh-sach=${/xanh-sạch/.test(l.out)}`);
      }
      // LV5 chỉ so hai bản dựng với nhau: hai bên cùng cho qua vẫn «khớp». Bốn ô này cần kỳ vọng tuyệt đối.
      if (ten in KY_VONG_CHAN && l.chanSlug !== KY_VONG_CHAN[ten])
        errs.push(`${ten}: mong luoi ${KY_VONG_CHAN[ten] ? 'chan' : 'cho qua'}, thay ${l.chanSlug ? 'chan' : 'cho qua'}`);
      const s = scan(R);
      const mayQuetDone = s.done.has('lv5');
      n++;
      if (mayQuetDone === l.chanSlug)
        errs.push(`lech ${ten}: luoi=${l.chanSlug ? 'chan' : 'qua'} may-quet=${mayQuetDone ? 'done' : oCua(s, 'lv5')}`);
    } finally { rmSync(R, { recursive: true, force: true }); }
  }
  if (n !== SO_MAT_CAT) errs.push(`so fixture da so ${n} != ${SO_MAT_CAT} khai truoc`);
  if (errs.length) fail('LV5', `${errs.length} loi — ${errs.slice(0, 6).join(' · ')}`);
  else pass('LV5', `dang thuc voi luoi: ${n} fixture, may quet == pre-merge o ca ${n}`);
}

// ─── LV7 — hồ sơ ĐÃ được máy cho qua từ trước khi có luật lỗi trong hợp đồng ──────
// Lưới quét mọi hồ sơ, kể cả hồ sơ PR không chạm. Áp thẳng thì mọi PR của kho có hồ sơ cũ còn lỗi đều đỏ
// ngay khi cập nhật kit. Chỉ xét lại khi chính hồ sơ có đổi trong PR.
if (want('LV7')) {
  const errs = [];
  const MC = { ...V_SACH, status: 'machine-cleared', findings: TRONG_HD_1 };
  const hsCu = R => {
    execFileSync('git', ['-C', R, 'branch', '-f', 'basepoint', 'HEAD']);
    mkdirSync(path.join(R, 'docs'), { recursive: true });
    writeFileSync(path.join(R, 'docs', 'ghi-chu.md'), 'doi tai lieu\n');
    execFileSync('git', ['-c', 'user.name=lv', '-c', 'user.email=lv@x', '-C', R, 'add', '-A']);
    execFileSync('git', ['-c', 'user.name=lv', '-c', 'user.email=lv@x', '-C', R, 'commit', '-qm', 'pr chi doi tai lieu']);
  };
  for (const [ten, chuanBi, chan] of [['ngoai PR -> khong xet lai', hsCu, false], ['trong PR -> xet', () => {}, true]]) {
    const R = mkGitRepo('lv7', MC);
    try {
      chuanBi(R);
      const l = luoi(R, 'lv7');
      if (l.chanSlug !== chan) errs.push(`${ten}: mong ${chan ? 'chan' : 'cho qua'}, thay exit ${l.status} — ${l.out.split('\n').filter(x => /VIOLATION/.test(x)).slice(0, 2).join(' | ').slice(0, 240)}`);
      if (chan && !/lỗi trong hợp đồng/.test(l.out)) errs.push(`${ten}: VIOLATION phai neu ten dieu kien «lỗi trong hợp đồng»`);
      if (scan(R).broken.has('lv7')) errs.push(`${ten}: may quet coi ho so cu la hong`);
    } finally { rmSync(R, { recursive: true, force: true }); }
  }
  // Đối chứng: cùng hồ sơ ở status verified không được miễn — miễn trừ chỉ dành cho lời khai đã có từ trước.
  { const R = mkGitRepo('lv7', { ...V_SACH, findings: TRONG_HD_1 });
    try { hsCu(R); const l = luoi(R, 'lv7'); if (!l.chanSlug) errs.push('verified ngoai PR phai van bi chan — mien tru chi cho machine-cleared'); }
    finally { rmSync(R, { recursive: true, force: true }); } }
  if (errs.length) fail('LV7', errs.slice(0, 5).join(' · '));
  else pass('LV7', 'machine-cleared cu: ngoai PR khong xet lai, trong PR xet, verified khong duoc mien');
}

// ─── LV8 — bộ đọc mục «Trong hợp đồng» trên từng hình dạng thật ──────────────────
if (want('LV8')) {
  const errs = [];
  const { loiTrongHopDong, lyDoTrongHopDong } = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'out-of-contract.cjs'));
  const CA = [
    ['tep rong', '', 0, false],
    ['null', null, 0, false],
    ['khong co muc', '## Ngoài hợp đồng\n\n- **x**\n', 0, false],
    ['cau khong co loi', TRONG_HD_RONG, 0, false],
    ['cau khong co trong ngoac', '## Trong hợp đồng\n\n(không có finding nào map được vào AC)\n', 0, false],
    ['mot muc', TRONG_HD_1, 1, false],
    ['nhan luot', '## Trong hợp đồng\n\n- **a** (r1)\n  severity: low\n- **b**\n', 2, false],
    ['CRLF', '## Trong hợp đồng\r\n\r\n- **a**\r\n', 1, false],
    ['muc ngoai khong tinh', '## Trong hợp đồng\n\nKhông có.\n\n## Ngoài hợp đồng\n\n- **x**\n', 0, false],
    ['khuon cu h3', TRONG_HD_NGO, 0, true],
    ['gach dau dong tran', '## Trong hợp đồng\n\n- loi khong in dam\n', 0, true],
    ['in dam giua cau', '## Trong hợp đồng\n\nCó **một** lỗi.\n', 0, true],
  ];
  for (const [ten, vao, so, ngo] of CA) {
    const r = loiTrongHopDong(vao);
    if (r.findings.length !== so || r.suspect_empty !== ngo) errs.push(`${ten}: mong ${so}/${ngo}, thay ${r.findings.length}/${r.suspect_empty}`);
    const ly = lyDoTrongHopDong(vao);
    if (!!ly !== (so > 0 || ngo)) errs.push(`${ten}: ly do «${ly}» lech voi ket qua doc`);
  }
  if (!/Trong-1/.test(lyDoTrongHopDong(TRONG_HD_1))) errs.push('ly do phai goi ten loi bang nhan Trong-N');
  if (errs.length) fail('LV8', errs.join(' · '));
  else pass('LV8', `bo doc muc trong hop dong: ${CA.length} hinh dang`);
}

// ─── LV6 — sàn đếm của chính bộ lọc ──────────────────────────────────────────
if (want('LV6')) {
  const r1 = spawnSync('node', [__filename], { encoding: 'utf8', env: { ...process.env, LV_CASES: 'LVX' } });
  const r2 = spawnSync('node', [__filename], { encoding: 'utf8', env: { ...process.env, LV_CASES: 'LV3' } });
  const errs = [];
  if (r1.status === 0) errs.push('LV_CASES=LVX van exit 0 (xanh voi 0 assertion)');
  if (!/LV_CASES=LVX khong khop ca nao/.test(r1.stdout || '')) errs.push('LVX: khong in dong neu ten da khai');
  if (r2.status !== 0) errs.push(`doi chung duong LV_CASES=LV3 exit ${r2.status}`);
  if ((r2.stdout || '').split('\n').filter(l => /^PASS: /.test(l)).length !== 1) errs.push('doi chung duong: khong dung mot dong ca');
  if (errs.length) fail('LV6', errs.join(' · '));
  else pass('LV6', 'san dem bo loc: ten sai -> exit 1 co thong diep; ten dung -> dung mot dong ca');
}

if (only.length && matched === 0) {
  console.log(`LV_CASES=${only.join(',')} khong khop ca nao — go sai ten? (fail de khong xanh gia)`);
  process.exit(1);
}
process.exit(failures ? 1 : 0);
