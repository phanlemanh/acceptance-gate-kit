#!/usr/bin/env node
// Răng đo release-2-2-0 — MỘT tiến trình Node, không có bash đếm.
//
// Vì sao viết lại bằng Node (owner chọn đường A, 18/08): bản bash trước đó dính
// BA lỗi CÙNG MỘT LỚP «bộ đếm nằm trong ống/shell con/trap → fail-open»:
//   1. `kiem_* | doc_kq` — vế cuối ống chạy trong shell con nên mọi vế ĐỎ của
//      chiều dương bị nuốt, script in XANH exit 0 trên cây SAI số phiên bản.
//   2. `trap ERR` gọi hàm có echo → chuỗi «ĐỎ» chui vào giá trị đang gán, chân
//      manifest đỏ vô điều kiện với thông điệp SAI SỰ THẬT.
//   3. `grep -c '^\(OK\||DO\)|'` (BRE) không bao giờ khớp dòng `DO|` → chỉ đếm vế xanh.
// Vòng vá thứ hai vẫn sinh lỗi cùng lớp ⇒ khuôn giải sai, không phải chi tiết
// sai (luật dừng-vá). Ở đây: mọi vế là GIÁ TRỊ trả về trong cùng một tiến trình,
// đếm trong bộ nhớ, mã thoát = số vế đỏ. Không ống, không trap, không regex vỏ.
//
// Nếp giữ nguyên: MỘT hàm kiểm nhận GỐC; cây thật và bản đột biến cùng đi qua
// chính hàm đó; chiều đỏ in vết cùng lượt và ghim đúng thông điệp.
//
//   node rang-release.mjs --chan <manifest|docs|mo-ta|ba-ca|lan-v|diff-allowlist|tu-kiem> [--root <đường dẫn>]

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const WS = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(WS, '..', '..');
const VER = '2.2.0';
const BASE_REF = process.env.DIFF_BASE || 'origin/main';

const argv = process.argv.slice(2);
const argOf = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const CHAN = argOf('--chan');
const ROOT = argOf('--root') || REPO;

// ── vế = giá trị, không phải dòng in ────────────────────────────────────────
const ok = (m) => ({ ok: true, m });
const red = (m) => ({ ok: false, m });
const tmps = [];
const tmpd = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'rang22-')); tmps.push(d); return d; };
process.on('exit', () => { for (const d of tmps) { try { fs.rmSync(d, { recursive: true, force: true }); } catch {} } });

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const sh = (cmd, args, cwd) => spawnSync(cmd, args, { cwd: cwd || ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

// ── chân manifest: SÁU vế, mỗi nguồn hỏng thành MỘT vế đỏ (không im lặng) ──
const VE_MANIFEST = 6;
function chanManifest(root, ddBase) {
  const load = (rel, ten) => { try { return { v: readJSON(path.join(root, rel)) }; } catch (e) { return { err: `${ten}: ${e.message.split('\n')[0]}` }; } };
  const A = load('.claude-plugin/plugin.json', 'manifest acceptance-gate');
  const F = load('feature-loop/.claude-plugin/plugin.json', 'manifest feature-loop');
  const D = load('diagram-design/.claude-plugin/plugin.json', 'manifest diagram-design');
  const out = [];
  out.push(A.err ? red(`khong doc duoc ${A.err}`) : A.v.version === VER ? ok(`ag-version ${VER}`) : red(`ag-version ${A.v.version}`));
  out.push(F.err ? red(`khong doc duoc ${F.err}`) : F.v.version === VER ? ok(`fl-version ${VER}`) : red(`fl-version ${F.v.version}`));
  // QUAN HỆ (không hình dạng): vendor pin KHÔNG ĐỔI so với base
  out.push(D.err ? red(`khong doc duoc ${D.err}`) : D.v.version === ddBase ? ok(`dd-version ${D.v.version} khong doi so voi base`) : red(`dd-version doi so voi base: ${ddBase} -> ${D.v.version}`));
  out.push(D.err ? red('dd-version khong kiem duoc semver (manifest hong)') : /^\d+\.\d+\.\d+$/.test(D.v.version) ? ok('dd-version hop semver') : red(`dd-version khong hop semver: ${D.v.version}`));
  out.push(A.err ? red('mo ta ag khong kiem duoc (manifest hong)') : A.v.description.includes('v' + VER) ? ok(`ag mo ta co muc v${VER}`) : red(`ag mo ta thieu muc v${VER}`));
  out.push(F.err ? red('mo ta fl khong kiem duoc (manifest hong)') : F.v.description.includes(`acceptance-gate >= ${VER}`) ? ok(`fl khai cap ag >= ${VER}`) : red(`fl khong khai cap ag >= ${VER}`));
  if (out.length !== VE_MANIFEST) out.push(red(`chân manifest trả ${out.length} vế, khai trước ${VE_MANIFEST} — chân câm không được tính xanh`));
  return out;
}

// ── chân docs: GUIDE khớp số ĐỌC TỪ manifest (một nguồn) ────────────────────
function chanDocs(root) {
  try {
    const v = (rel) => readJSON(path.join(root, rel)).version;
    const ag = v('.claude-plugin/plugin.json'), fl = v('feature-loop/.claude-plugin/plugin.json'), dd = v('diagram-design/.claude-plugin/plugin.json');
    const want = `Khớp phiên bản: acceptance-gate ${ag} · feature-loop ${fl} · diagram-design ${dd}.`;
    const g = fs.readFileSync(path.join(root, 'GUIDE.md'), 'utf8');
    return [g.includes(want) ? ok(`GUIDE khop ${ag} · ${fl} · ${dd}`) : red(`GUIDE khong chua: ${want}`)];
  } catch (e) { return [red(`chân docs không đọc được nguồn: ${e.message.split('\n')[0]}`)]; }
}

// ── chân mô tả: NĂM vế người dùng cần đọc được ở mục v2.2.0 ────────────────
const VE_MOTA = 5;
function chanMoTa(root) {
  let d;
  try { d = readJSON(path.join(root, '.claude-plugin/plugin.json')).description; }
  catch (e) { return [red(`mo ta khong doc duoc: ${e.message.split('\n')[0]}`)]; }
  const i = d.indexOf('v' + VER);
  if (i < 0) return [red(`mo ta khong co muc v${VER}`)];
  const seg = d.slice(i);
  const need = [
    ['noi hinh tai Cong 1', /Gate 1/i.test(seg) && /(diagram|figure|picture)/i.test(seg)],
    ['noi nguong nghiem thu tren the', /threshold/i.test(seg)],
    ['noi nhat-ky-vap', /stranger[- ]drive/i.test(seg)],
    ['noi S5 ban giao', /hands? off|hand-off/i.test(seg)],
    ['noi khong phai migrate', /nothing to migrate|no migration/i.test(seg)],
  ];
  const out = need.map(([n, v]) => (v ? ok(n) : red(`thieu ve: ${n}`)));
  if (out.length !== VE_MOTA) out.push(red(`chân mô tả trả ${out.length} vế, khai trước ${VE_MOTA}`));
  return out;
}

// ── chân ba-ca: ba ca kiểm của ba hồ sơ trong mốc ──────────────────────────
function chanBaCaCauTruc(runTestsSrc) {
  return ['P197', 'P198', 'P199'].map(c =>
    new RegExp(`^run "${c} `, 'm').test(runTestsSrc) ? ok(`bo kiem co ca ${c}`) : red(`thieu ca ${c} trong bo kiem`));
}

// ── chân diff: allowlist ĐÓNG + đối chứng dương (diff rỗng = chân mù) ──────
const trongAllowlist = (f) =>
  ['.claude-plugin/plugin.json', 'feature-loop/.claude-plugin/plugin.json', 'GUIDE.md', 'PRODUCT-MAP.md', '_acceptance/config.yaml'].includes(f)
  || f.startsWith('_acceptance/release-2-2-0/');

function chanDiff() {
  const out = [];
  const probe = sh('git', ['rev-parse', '--verify', '-q', BASE_REF]);
  if (probe.status !== 0) return [red(`không giải được base '${BASE_REF}' — chân fail-closed, KHÔNG bỏ qua`)];
  const d = sh('git', ['diff', '--name-only', `${BASE_REF}...HEAD`]);
  if (d.status !== 0) return [red(`git diff lỗi: ${(d.stderr || '').trim().split('\n')[0]}`)];
  const files = d.stdout.split('\n').map(s => s.trim()).filter(Boolean);
  if (files.length === 0) out.push(red(`diff RỖNG so với ${BASE_REF} — chân không kết luận được gì (đối chứng dương hỏng)`));
  else {
    out.push(ok(`diff có ${files.length} file`));
    for (const loi of ['.claude-plugin/plugin.json', 'feature-loop/.claude-plugin/plugin.json', 'GUIDE.md'])
      out.push(files.includes(loi) ? ok(`diff có vật lõi: ${loi}`) : red(`diff THIẾU vật lõi của một lần cắt số: ${loi}`));
    const ngoai = files.filter(f => !trongAllowlist(f));
    out.push(ngoai.length === 0 ? ok('diff nằm trọn trong allowlist đóng') : red(`file NGOÀI allowlist: ${ngoai.join(' ')}`));
  }
  const st = sh('git', ['status', '--porcelain']);
  const chua = st.stdout.split('\n').map(l => l.slice(3).trim()).filter(Boolean).filter(f => !trongAllowlist(f));
  out.push(chua.length === 0 ? ok('không có sửa chưa commit nào ngoài allowlist') : red(`sửa CHƯA COMMIT ngoài allowlist: ${chua.join(' ')}`));
  return out;
}

// ── tiện ích cho đột biến: bản sao manifest + GUIDE ────────────────────────
function banSao() {
  const d = tmpd();
  for (const rel of ['.claude-plugin/plugin.json', 'feature-loop/.claude-plugin/plugin.json', 'diagram-design/.claude-plugin/plugin.json']) {
    fs.mkdirSync(path.join(d, path.dirname(rel)), { recursive: true });
    fs.copyFileSync(path.join(ROOT, rel), path.join(d, rel));
  }
  fs.copyFileSync(path.join(ROOT, 'GUIDE.md'), path.join(d, 'GUIDE.md'));
  return d;
}
const suaJSON = (p, fn) => { const j = readJSON(p); fn(j); fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n'); };
const ddBaseVersion = () => {
  const r = sh('git', ['show', `${BASE_REF}:diagram-design/.claude-plugin/plugin.json`]);
  if (r.status !== 0) return null;
  try { return JSON.parse(r.stdout).version; } catch { return null; }
};

// ── kho code-sinh cho đối chứng dương của lưới trước-merge ─────────────────
function khoFixture(slug, contract, evidence) {
  const d = tmpd();
  for (const dir of ['lib', 'scripts']) {
    const r = sh('cp', ['-R', path.join(ROOT, dir), path.join(d, dir)]);
    if (r.status !== 0) return { err: `chép ${dir} thất bại: ${(r.stderr || '').trim()}` };
  }
  const ws = path.join(d, '_acceptance', slug);
  fs.mkdirSync(ws, { recursive: true });
  fs.writeFileSync(path.join(ws, 'contract.md'), contract);
  if (evidence) fs.writeFileSync(path.join(ws, 'evidence-report.md'), evidence);
  for (const a of [['init', '-q', '.'], ['add', '-A']]) { const r = sh('git', a, d); if (r.status !== 0) return { err: `git ${a[0]} lỗi` }; }
  const c = spawnSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=T', 'commit', '-qm', 'b'], { cwd: d, encoding: 'utf8' });
  if (c.status !== 0) return { err: 'git commit lỗi' };
  const run = spawnSync('bash', ['scripts/pre-merge-check.sh', '--base', 'HEAD'], { cwd: d, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return { out: (run.stdout || '') + (run.stderr || '') };
}
const CT = (slug, extra) => `---\nschema_version: 1\nfeature: f\nslug: ${slug}\nowner: o\nrisk_tier: T2\nstatus: ${extra.status}\napproved_by:\napproved_at:\nveto_state: ${extra.veto}\nveto_opened_at: 2026-08-18T00:00:00Z\n---\n\n# c\n`;
const EV_KHONGSACH = `---\nschema_version: 2\nfeature_slug: khongsach\nverdict: PASS\nfailed_evals: []\nverified_by: x\nenforcement_mode: strict\nbypass_used: false\nverified_commit: 0000000000000000000000000000000000000000\nhuman_signoff:\n---\n\n## Known limits\n\n- một giới hạn còn treo\n`;

// ── chạy từng chân: trả {ves, muts} ────────────────────────────────────────
function chay(chan) {
  const ves = [], muts = [];
  const dot = (m) => muts.push(m);

  if (chan === 'manifest') {
    const ddBase = ddBaseVersion();
    if (ddBase === null) return { ves: [red(`không đọc được số diagram-design ở base ${BASE_REF} — chân fail-closed`)], muts };
    ves.push(ok(`base ${BASE_REF} có diagram-design ${ddBase}`), ...chanManifest(ROOT, ddBase));
    let d = banSao(); suaJSON(path.join(d, '.claude-plugin/plugin.json'), j => { j.version = '2.1.0'; });
    chanManifest(d, ddBase).some(r => !r.ok && r.m.startsWith('ag-version'))
      ? dot('hạ số 2.1.0 → ĐỎ ghim ag-version (qua CHÍNH chanManifest)') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: hạ số mà chân vẫn xanh'));
    d = banSao(); suaJSON(path.join(d, 'feature-loop/.claude-plugin/plugin.json'), j => { j.description = j.description.replace(`acceptance-gate >= ${VER}`, 'acceptance-gate >= 2.1.0'); });
    chanManifest(d, ddBase).some(r => !r.ok && r.m.includes('khong khai cap'))
      ? dot('cặp cũ >= 2.1.0 → ĐỎ ghim cặp phiên bản') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: cặp lệch mà chân vẫn xanh'));
    d = banSao(); suaJSON(path.join(d, 'diagram-design/.claude-plugin/plugin.json'), j => { j.version = '9.9.9'; });
    chanManifest(d, ddBase).some(r => !r.ok && r.m.includes('doi so voi base'))
      ? dot('nâng vendor pin 9.9.9 → ĐỎ ghim «đổi so với base» (quan hệ, không hình dạng)') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: pin đổi mà chân vẫn xanh'));
    d = banSao(); fs.writeFileSync(path.join(d, '.claude-plugin/plugin.json'), '{ hong');
    const r4 = chanManifest(d, ddBase);
    (r4.length === VE_MANIFEST && r4.some(x => !x.ok && x.m.includes('khong doc duoc')))
      ? dot('manifest JSON hỏng → vẫn đủ 6 vế và có vế ĐỎ «không đọc được» (không im lặng, không mất vế)') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: manifest hỏng mà chân không đỏ đúng vế'));
  }

  else if (chan === 'docs') {
    ves.push(...chanDocs(ROOT));
    const d = banSao();
    fs.writeFileSync(path.join(d, 'GUIDE.md'), fs.readFileSync(path.join(ROOT, 'GUIDE.md'), 'utf8').replace(`acceptance-gate ${VER}`, 'acceptance-gate 2.1.0'));
    chanDocs(d).some(r => !r.ok) ? dot('GUIDE ghi số cũ → ĐỎ (một nguồn: so với manifest, không so hằng)') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: GUIDE lệch mà chân vẫn xanh'));
    const d2 = banSao(); fs.writeFileSync(path.join(d2, '.claude-plugin/plugin.json'), '{ hong');
    chanDocs(d2).some(r => !r.ok) ? dot('manifest hỏng → chân docs ĐỎ, không im lặng') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: manifest hỏng mà chân docs vẫn xanh'));
  }

  else if (chan === 'mo-ta') {
    ves.push(...chanMoTa(ROOT));
    const d = banSao(); suaJSON(path.join(d, '.claude-plugin/plugin.json'), j => { j.description = j.description.replace(/stranger[- ]drive/gi, 'XXX'); });
    chanMoTa(d).some(r => !r.ok && r.m.includes('nhat-ky-vap')) ? dot('xoá tên nhật-ký-vấp → ĐỎ ghim đúng vế') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: mô tả thiếu vế mà chân vẫn xanh'));
  }

  else if (chan === 'ba-ca') {
    const src = fs.readFileSync(path.join(ROOT, 'tests/plugins/run-tests.sh'), 'utf8');
    ves.push(...chanBaCaCauTruc(src));
    chanBaCaCauTruc(src.split('\n').filter(l => !l.startsWith('run "P199 ')).join('\n')).some(r => !r.ok && r.m.includes('P199'))
      ? dot('gỡ dòng chạy P199 → ĐỎ ghim đúng ca thiếu (qua CHÍNH chanBaCaCauTruc)') : ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: gỡ ca mà chân vẫn xanh'));
    const r = spawnSync('bash', ['tests/plugins/run-tests.sh'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const out = (r.stdout || '') + (r.stderr || '');
    ves.push(r.status === 0 ? ok('suite plugins exit 0') : red(`suite plugins exit ${r.status}`));
    for (const c of ['P197', 'P198', 'P199'])
      ves.push(out.includes(`PASS: ${c} `) ? ok(`suite in PASS: ${c}`) : red(`suite KHÔNG in PASS: ${c}`));
  }

  else if (chan === 'lan-v') {
    const b = sh('git', ['rev-parse', BASE_REF]);
    if (b.status !== 0) return { ves: [red(`không giải được base ${BASE_REF} — chân fail-closed`)], muts };
    const bsha = b.stdout.trim();
    const r = spawnSync('bash', ['scripts/pre-merge-check.sh', '--base', bsha], { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const out = (r.stdout || '') + (r.stderr || '');
    ves.push(/cửa veto đang mở[^\n]*release-2-2-0/.test(out) ? ok('NOTE cửa-veto có tên release-2-2-0') : red('NOTE cửa-veto KHÔNG có tên hồ sơ này'));
    ves.push(/^VIOLATION \[release-2-2-0\].*veto/m.test(out) ? red('luật veto nổ oan trên hồ sơ này') : ok('0 VIOLATION nhóm veto mang tên release-2-2-0'));
    const f1 = khoFixture('vpham', CT('vpham', { status: 'approved', veto: 'da-veto' }), null);
    if (f1.err) ves.push(red(`fixture da-veto dựng lỗi: ${f1.err}`));
    else /^VIOLATION \[vpham\].*veto/m.test(f1.out) ? dot('fixture da-veto thật → lưới ĐỎ đúng định dạng VIOLATION') : ves.push(red('ĐỐI CHỨNG DƯƠNG HỎNG: vi phạm veto thật mà lưới không nổ'));
    const f2 = khoFixture('khongsach', CT('khongsach', { status: 'verified', veto: 'mo' }), EV_KHONGSACH);
    if (f2.err) ves.push(red(`fixture mo+không-sạch dựng lỗi: ${f2.err}`));
    else /^VIOLATION \[khongsach\]/m.test(f2.out) ? dot('fixture mo + Known limits KHÔNG rỗng → lưới ĐỎ: quan hệ mo ⇔ xanh-sạch có răng') : ves.push(red('QUAN HỆ KHÔNG ĐƯỢC ĐO: mo mà báo cáo không sạch vẫn lọt qua lưới'));
  }

  else if (chan === 'diff-allowlist') {
    ves.push(...chanDiff());
    trongAllowlist('skills/uat-session/SKILL.md')
      ? ves.push(red('CHIỀU ĐỎ KHÔNG CHẠY: allowlist nuốt cả file engine')) : dot('đường dẫn engine giả lập bị CHÍNH hàm lọc loại');
  }

  // ── TỰ KIỂM: chính bộ đếm phải biết đỏ (lỗ đã cắn hai lần) ──────────────
  else if (chan === 'tu-kiem') {
    const self = fileURLToPath(import.meta.url);
    const chay1 = (root) => spawnSync('node', [self, '--chan', 'manifest', '--root', root], { cwd: REPO, encoding: 'utf8' });
    const good = chay1(ROOT);
    ves.push(good.status === 0 ? ok('cây thật → mã thoát 0 (đối chứng dương của chính bộ đếm)') : red(`cây thật mà mã thoát ${good.status} — bộ đếm hoặc vật hỏng`));
    const d = banSao(); suaJSON(path.join(d, '.claude-plugin/plugin.json'), j => { j.version = '2.1.0'; });
    const bad = chay1(d);
    (bad.status !== 0 && /ĐỎ/.test(bad.stdout || ''))
      ? dot(`bản sao sai số → mã thoát ${bad.status} kèm dòng ĐỎ: bộ đếm KHÔNG nuốt vế đỏ (lỗ bash cũ đã chết)`)
      : ves.push(red(`BỘ ĐẾM FAIL-OPEN: bản sao sai số mà mã thoát ${bad.status} — đúng lỗ đã cắn hai lần`));
    const d2 = banSao(); fs.writeFileSync(path.join(d2, '.claude-plugin/plugin.json'), '{ hong');
    const bad2 = chay1(d2);
    bad2.status !== 0 ? dot(`manifest hỏng → mã thoát ${bad2.status}: chân câm không lọt thành xanh`) : ves.push(red('BỘ ĐẾM FAIL-OPEN: manifest hỏng mà mã thoát 0'));
  }

  else return { ves: [red(`chân không biết: ${chan}`)], muts };

  return { ves, muts };
}

const DS = ['manifest', 'docs', 'mo-ta', 'ba-ca', 'lan-v', 'diff-allowlist', 'tu-kiem'];
const chans = CHAN ? [CHAN] : DS;
let tongDo = 0;
for (const c of chans) {
  console.log(`== chân ${c} ==`);
  const { ves, muts } = chay(c);
  for (const v of ves) console.log(v.ok ? `  OK   ${v.m}` : `  ĐỎ   ${v.m}`);
  for (const m of muts) console.log(`       [chiều đỏ] ${m}`);
  const do_ = ves.filter(v => !v.ok).length;
  console.log(`  -- chân ${c}: ${ves.length} vế, ${do_} đỏ, ${muts.length} chiều đỏ chạy thật`);
  tongDo += do_;
}
console.log(tongDo === 0 ? 'RANG-RELEASE 2.2.0: XANH' : `RANG-RELEASE 2.2.0: ${tongDo} vế ĐỎ`);
process.exit(tongDo === 0 ? 0 : 1);
