// t1-escape-ho-so.test.mjs — hồ sơ t1-escape-chi-ho-so: răng T1-escape của scripts/pre-merge-check.sh chỉ nhận
// HỒ SƠ THẬT — tệp dưới `_acceptance/<slug>/` của CHÍNH cổng mà `<slug>/contract.md` có ở HEAD. Ca thật: onehub-invest
// 22/10 — PR sửa app/src/** kèm một dòng `_acceptance/config.yaml` ra «clean».
//
// Luật đo:
//  - Kho mẫu là kho git THẬT dựng trong lần chạy; gọi CHÍNH scripts/pre-merge-check.sh.
//  - Ma trận + kỳ vọng VIẾT TRƯỚC (hằng HANG, COT, NOTE_MONG dưới), không tính từ mã cổng; số khẳng định = số ô.
//  - Chiều đỏ: bản sao TRỌN `scripts/` + `lib/` bị tiêm đúng một kim (kim khớp ≠ 1 lần → ca đỏ vì hạ tầng, nói tên
//    kim); bản sao nguyên vẹn cùng kho là đối chứng dương. AC-6 đo chiều đỏ trong lịch sử nhánh.
//  - Đường dẫn suy từ vị trí tệp này. Tên ca = mã AC; TEH_CASES chọn ca; mã lạ → thoát 2; 0 ca PASS → thoát 1.
//  - Mặc định (không TEH_CASES) chạy mọi ca TRỪ AC-6 (cần lịch sử git đầy đủ — CI clone nông).
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GATE = path.join(KIT, 'scripts', 'pre-merge-check.sh');
const TEP_CA = path.relative(KIT, fileURLToPath(import.meta.url));

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 't1-escape-ho-so-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const thuMuc = (p) => { const d = path.join(TMP, `${p}-${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const ghi = (root, rel, txt) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const cut = (s, n = 300) => (String(s).length > n ? `${String(s).slice(0, n)}…` : String(s));

// ── Ma trận viết trước (bảng ở hợp đồng) ────────────────────────────────────
const CAU_HINH = 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n  t3_paths:\n    - "src/billing/**"\n';
const HOP_DONG = (slug) => `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T3\nsurfaces: [api]\nstatus: draft\napproved_by:\n---\n`;
// [tên, gốc cổng (ROOT tương đối kho), tệp thêm ở gốc nhánh, tệp PR đổi (null = xoá), răng nổ?]
// Glob tính từ gốc git, nên hàng long-* (cổng ở pkg/) dùng chung cột vật với các hàng khác.
const HANG = [
  ['khong', '', {}, {}, true],
  ['config', '', {}, { '_acceptance/config.yaml': `${CAU_HINH}# sua\n` }, true],
  ['readme', '', {}, { '_acceptance/README.md': 'doc\n' }, true],
  ['slug-khong-hop-dong', '', {}, { '_acceptance/rong/notes.md': 'n\n' }, true],
  ['chi-co-hoi', '', {}, { '_acceptance/co-hoi/opportunity.md': '---\nslug: co-hoi\n---\n' }, true],
  ['ho-so-xoa', '', { '_acceptance/cu/contract.md': HOP_DONG('cu') }, { '_acceptance/cu/contract.md': null }, true],
  ['long-config', 'pkg', {}, { 'pkg/_acceptance/config.yaml': `${CAU_HINH}# sua\n` }, true],
  ['ho-so-that', '', {}, { '_acceptance/f/contract.md': HOP_DONG('f') }, false],
  ['long-ho-so', 'pkg', {}, { 'pkg/_acceptance/f/contract.md': HOP_DONG('f') }, false],
  ['ho-so-co-san', '', { '_acceptance/f/contract.md': HOP_DONG('f'), '_acceptance/f/evals.yaml': 'evals: []\n' },
    { '_acceptance/f/evals.yaml': 'evals: [] # sua\n' }, false],
  ['long-ho-so-co-san', 'pkg', { 'pkg/_acceptance/f/contract.md': HOP_DONG('f'), 'pkg/_acceptance/f/evals.yaml': 'evals: []\n' },
    { 'pkg/_acceptance/f/evals.yaml': 'evals: [] # sua\n' }, false],
  ['ho-so-va-config', '', {}, { '_acceptance/f/contract.md': HOP_DONG('f'), '_acceptance/config.yaml': `${CAU_HINH}# sua\n` }, false],
  ['fixture-ho-so', '', {}, { 'tests/fx/_acceptance/f/contract.md': HOP_DONG('f') }, true],
];
// [tên cột, tệp vật PR đổi, câu VIOLATION [PR] nguyên văn — null = cột t1, răng không bao giờ nổ]
const COT = [
  ['t3', { 'src/billing/c.js': 'charge()\n' }, 'VIOLATION [PR]: T3 paths (t3_paths) changed but the PR carries NO _acceptance/<slug>/ artifacts'],
  ['ngoai-t1', { 'src/app.js': 'v2\n' }, 'VIOLATION [PR]: non-T1 files changed (outside t1_skip_globs) but the PR carries NO _acceptance/<slug>/ artifacts'],
  ['t1', { 'docs/x.md': 'x\n' }, null],
];
const TEH_O = 39;
const CAU_NOTE = 'NOTE [PR]: các tệp dưới _acceptance/ này không phải hồ sơ của cổng (cần _acceptance/<slug>/ có contract.md) — không tính là PR có kèm hồ sơ:';
// Tập tệp NOTE mong đợi theo hàng, ở ô răng nổ có tệp bị loại (cột t3, ngoai-t1). Ô khác: không có dòng NOTE.
const NOTE_MONG = {
  config: ['_acceptance/config.yaml'],
  readme: ['_acceptance/README.md'],
  'slug-khong-hop-dong': ['_acceptance/rong/notes.md'],
  'chi-co-hoi': ['_acceptance/co-hoi/opportunity.md'],
  'ho-so-xoa': ['_acceptance/cu/contract.md'],
  'long-config': ['pkg/_acceptance/config.yaml'],
  'fixture-ho-so': ['tests/fx/_acceptance/f/contract.md'],
};
const TEH_NOTE_CO = 14;
const ten = (h, c) => `${h}×${c}`;
const O = HANG.flatMap((h) => COT.map((c) => ({ id: ten(h[0], c[0]), hang: h, cot: c, no: c[2] !== null && h[4] })));
if (O.length !== TEH_O) throw new Error(`ma trận có ${O.length} ô, hằng khai ${TEH_O}`);

function gitInit(dir) {
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'config', 'user.email', 't@t.local'); git(dir, 'config', 'user.name', 't');
  git(dir, 'config', 'commit.gpgsign', 'false');
}
function commitAll(dir, msg) { git(dir, 'add', '-A'); git(dir, 'commit', '-q', '--allow-empty', '-m', msg); }

// Kho của một ô: nhánh main = gốc; HEAD = commit PR. Trả { kho, root, base }.
const khoCache = new Map();
function khoO(o) {
  if (khoCache.has(o.id)) return khoCache.get(o.id);
  const [, goc, them, pr] = o.hang;
  const kho = thuMuc('kho');
  gitInit(kho);
  ghi(kho, path.join(goc, '_acceptance/config.yaml'), CAU_HINH);
  ghi(kho, 'src/app.js', 'base\n'); ghi(kho, 'docs/a.md', 'a\n');
  for (const [r, t] of Object.entries(them)) ghi(kho, r, t);
  commitAll(kho, 'goc');
  const base = git(kho, 'rev-parse', 'HEAD');
  git(kho, 'checkout', '-q', '-b', 'pr');
  for (const [r, t] of Object.entries({ ...pr, ...o.cot[1] })) {
    if (t === null) fs.rmSync(path.join(kho, r)); else ghi(kho, r, t);
  }
  commitAll(kho, 'pr');
  const k = { kho, root: path.join(kho, goc), base };
  khoCache.set(o.id, k);
  return k;
}

function chay(gate, root, args) {
  const e = { ...process.env };
  for (const k of ['GITHUB_OUTPUT', 'GITHUB_STEP_SUMMARY', 'PRE_MERGE_BASE']) delete e[k];
  const r = spawnSync('bash', [gate, root, ...args], { encoding: 'utf8', env: e, maxBuffer: 64 * 1024 * 1024 });
  return { status: r.status, out: `${r.stdout || ''}${r.stderr || ''}` };
}

// Dòng NOTE [PR] và các dòng thụt lề ngay sau nó → { co, tep:Set, sauDanhSach }.
function docNote(out) {
  const dong = out.split('\n');
  const i = dong.findIndex((l) => l.startsWith('NOTE [PR]:'));
  if (i < 0) return { co: false };
  const tep = new Set();
  for (let j = i + 1; j < dong.length && /^ {4}\S/.test(dong[j]); j += 1) tep.add(dong[j].trim());
  // Ngay sau danh sách tệp chịu cổng: dòng trước NOTE là dòng thụt lề của danh sách VIOLATION [PR].
  let k = i - 1; while (k >= 0 && /^ {4}\S/.test(dong[k])) k -= 1;
  return { co: true, dau: dong[i], tep, sauDanhSach: k >= 0 && dong[k].startsWith('VIOLATION [PR]') && k < i - 1 };
}

const ketQua = new Map(); // gate → Map(id → {status,out})
function chayMaTran(gate) {
  if (ketQua.has(gate)) return ketQua.get(gate);
  const m = new Map();
  for (const o of O) { const k = khoO(o); m.set(o.id, chay(gate, k.root, ['--base', k.base])); }
  ketQua.set(gate, m);
  return m;
}
// Ô sai kỳ vọng AC-1 → danh sách id (theo thứ tự ma trận).
function oSai(gate) {
  const m = chayMaTran(gate); const sai = [];
  for (const o of O) {
    const { status, out } = m.get(o.id);
    const dongPR = out.split('\n').filter((l) => l.startsWith('VIOLATION [PR]'));
    const dung = o.no ? (dongPR.length === 1 && dongPR[0].startsWith(o.cot[2]) && status === 1) : dongPR.length === 0;
    if (!dung) sai.push(o.id);
  }
  return sai;
}
const LOT = O.filter((o) => o.no && o.hang[0] !== 'khong').map((o) => o.id); // 14 ô lọt hôm nay

// Kim: thay đúng MỘT chỗ; khớp 0 hay ≥2 lần là ca hỏng hạ tầng, nói tên kim.
function kim(text, tu, thanh) {
  const n = text.split(tu).length - 1;
  if (n !== 1) throw new Error(`kim khớp ${n} lần (phải đúng 1): ${cut(JSON.stringify(tu), 120)}`);
  return text.replace(tu, thanh);
}
// Bản sao TRỌN scripts/ + lib/ của một cây; mutate(text) đổi tệp cổng. Trả đường tệp cổng.
function banSao(nguon, mutate) {
  const d = thuMuc('bansao');
  fs.cpSync(path.join(nguon, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  fs.cpSync(path.join(nguon, 'lib'), path.join(d, 'lib'), { recursive: true });
  const f = path.join(d, 'scripts', 'pre-merge-check.sh');
  if (mutate) fs.writeFileSync(f, mutate(fs.readFileSync(f, 'utf8')));
  return f;
}
const bang = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// Kim đột biến — khớp mã vá trong scripts/pre-merge-check.sh (khối «Phân loại diff-chịu-cổng»).
const KIM = {
  hoanNguyen: ['      if is_dossier_file "$f"; then', '      if true; then'],
  goHopDong: ['  git -C "$ROOT" cat-file -e "HEAD:${pre}_acceptance/${slug}/contract.md" 2>/dev/null\n', '  return 0\n'],
  chiTrongDiff: ['  git -C "$ROOT" cat-file -e "HEAD:${pre}_acceptance/${slug}/contract.md" 2>/dev/null\n',
    '  [ "${rest#*/}" = contract.md ] && git -C "$ROOT" cat-file -e "HEAD:$1" 2>/dev/null\n'],
  tienToTuDuong: ['  local pre="$ACC_PREFIX" rest slug\n', '  local pre="${1%%_acceptance/*}" rest slug\n'],
};
const ids = (hangs, cots = ['t3', 'ngoai-t1']) => O.filter((o) => hangs.includes(o.hang[0]) && cots.includes(o.cot[0])).map((o) => o.id);

// ── Ca ──────────────────────────────────────────────────────────────────────
const CA = new Map(); const CHI_GOI_TEN = new Set();
const ca = (id, fn, { chiGoiTen = false } = {}) => { CA.set(id, fn); if (chiGoiTen) CHI_GOI_TEN.add(id); };

ca('AC-1', () => {
  const sai = oSai(GATE);
  if (sai.length) throw new Error(`DO AC-1: ${sai.length}/${TEH_O} ô sai — ${sai.join(', ')}`);
  return `${TEH_O}/${TEH_O} ô đúng kỳ vọng (${O.filter((o) => o.no).length} ô răng nổ đúng câu cũ, còn lại im)`;
});

ca('AC-2', () => {
  const m = chayMaTran(GATE); const sai = []; let co = 0;
  for (const o of O) {
    const n = docNote(m.get(o.id).out);
    const mong = o.no ? NOTE_MONG[o.hang[0]] : undefined;
    if (mong) {
      co += 1;
      const tep = n.co ? [...n.tep].sort() : [];
      if (!n.co || n.dau !== CAU_NOTE || !n.sauDanhSach || !bang(tep, [...mong].sort())) {
        sai.push(`${o.id} (mong ${mong.join(' ')}; có ${n.co ? `«${cut(n.dau, 60)}» ${tep.join(' ')}${n.sauDanhSach ? '' : ' — không ngay sau danh sách'}` : 'không dòng NOTE'})`);
      }
    } else if (n.co) sai.push(`${o.id} (không được có NOTE mà có: ${[...n.tep].join(' ')})`);
  }
  if (co !== TEH_NOTE_CO) throw new Error(`ma trận NOTE có ${co} ô có mặt, hằng khai ${TEH_NOTE_CO}`);
  if (sai.length) throw new Error(`DO AC-2: ${sai.join(' · ')}`);
  return `${TEH_O} ô: ${co} ô có dòng NOTE đúng tập tệp, ${TEH_O - co} ô vắng`;
});

ca('AC-3', () => {
  const PR = [
    ['config-docs', { '_acceptance/config.yaml': `${CAU_HINH}feature_loop:\n  suite_keys: [executors.test.a]\n`, 'docs/b.md': 'b\n' }, 'ho-so', 'false'],
    ['readme', { '_acceptance/README.md': 'doc\n' }, 'ho-so', 'false'],
    ['slug-khong-hop-dong', { '_acceptance/rong/notes.md': 'n\n' }, 'ho-so', 'false'],
    ['config-t3', { '_acceptance/config.yaml': `${CAU_HINH}# sua\n`, 'src/billing/c.js': 'charge()\n' }, 'T3', 'true'],
  ];
  const sai = [];
  for (const [t, pr, hang, cham] of PR) {
    const kho = thuMuc('hp'); gitInit(kho);
    ghi(kho, '_acceptance/config.yaml', CAU_HINH); ghi(kho, 'src/app.js', 'base\n'); commitAll(kho, 'goc');
    const base = git(kho, 'rev-parse', 'HEAD'); git(kho, 'checkout', '-q', '-b', 'pr');
    for (const [r, x] of Object.entries(pr)) ghi(kho, r, x);
    commitAll(kho, 'pr');
    const { out } = chay(GATE, kho, ['--base', base, '--hang-pr']);
    const kq = Object.fromEntries(out.split('\n').map((l) => l.match(/^(hang|cham_vat)=(.*)$/)).filter(Boolean).map((x) => [x[1], x[2]]));
    if (kq.hang !== hang || kq.cham_vat !== cham) sai.push(`${t}: hang=${kq.hang} cham_vat=${kq.cham_vat} (mong ${hang}/${cham})`);
  }
  if (sai.length) throw new Error(`DO AC-3: ${sai.join(' · ')}`);
  return `bốn PR qua --hang-pr giữ nguyên (hang, cham_vat): ho-so/false ×3, T3/true`;
});

ca('AC-4', () => {
  const nguyen = oSai(banSao(KIT));
  if (nguyen.length) throw new Error(`DO AC-4: doi chung ban sao nguyen ven hong (ha tang) — ${nguyen.join(', ')}`);
  const sai = oSai(banSao(KIT, (t) => kim(t, ...KIM.hoanNguyen)));
  if (!bang(sai, LOT)) throw new Error(`DO AC-4: hoàn nguyên dòng phân loại → ô sai ${sai.join(', ') || '(không ô nào)'}; mong đúng ${LOT.length} ô ${LOT.join(', ')}`);
  return `đối chứng ${TEH_O}/${TEH_O}; hoàn nguyên → đúng ${LOT.length} ô lọt hôm nay đỏ`;
});

ca('AC-5', () => {
  const nguyen = oSai(banSao(KIT));
  if (nguyen.length) throw new Error(`DO AC-5: doi chung ban sao nguyen ven hong (ha tang) — ${nguyen.join(', ')}`);
  const MONG = [
    ['goHopDong', ids(['slug-khong-hop-dong', 'chi-co-hoi', 'ho-so-xoa'])],
    ['chiTrongDiff', ids(['ho-so-co-san', 'long-ho-so-co-san'])],
    ['tienToTuDuong', ids(['fixture-ho-so'])],
  ];
  const tom = [];
  for (const [k, mong] of MONG) {
    const sai = oSai(banSao(KIT, (t) => kim(t, ...KIM[k])));
    if (!bang(sai, mong)) throw new Error(`DO AC-5 (${k}): ô sai ${sai.join(', ') || '(không ô nào)'}; mong ${mong.join(', ')}`);
    tom.push(`${k} → ${mong.length} ô`);
  }
  return tom.join(' · ');
});

ca('AC-6', () => {
  const g = (...a) => { try { return git(KIT, ...a); } catch { return ''; } };
  const dauCa = g('log', '--diff-filter=A', '--format=%H', '--reverse', '--', TEP_CA).split('\n')[0];
  const goc = g('merge-base', 'HEAD', 'origin/main');
  const dauVa = goc ? g('log', '--format=%H', '--reverse', `${goc}..HEAD`, '--', 'scripts/pre-merge-check.sh').split('\n')[0] : '';
  if (!dauCa || !dauVa) { console.log(`  MU AC-6: không thấy commit (tệp ca ${dauCa || '?'} · vá ${dauVa || '?'}) — lịch sử nông?`); process.exit(3); }
  if (spawnSync('git', ['-C', KIT, 'merge-base', '--is-ancestor', dauCa, dauVa]).status !== 0 || dauCa === dauVa) {
    throw new Error(`DO AC-6: commit tệp ca ${dauCa.slice(0, 9)} không đứng trước commit vá ${dauVa.slice(0, 9)}`);
  }
  const chayO = (sha) => {
    const d = thuMuc(`lichsu-${sha.slice(0, 7)}`);
    execFileSync('bash', ['-c', `git -C "$1" archive "$2" scripts lib "$3" | tar -x -C "$4"`, '_', KIT, sha, TEP_CA, d]);
    const r = spawnSync('node', [path.join(d, TEP_CA)], { encoding: 'utf8', env: { ...process.env, TEH_CASES: 'AC-1' }, maxBuffer: 64 * 1024 * 1024 });
    return { status: r.status, out: `${r.stdout || ''}${r.stderr || ''}` };
  };
  const cu = chayO(dauCa);
  const m = cu.out.match(/DO AC-1: \d+\/\d+ ô sai — (.*)/);
  if (cu.status !== 1 || !m) throw new Error(`DO AC-6: ở ${dauCa.slice(0, 9)} AC-1 không đỏ đúng khuôn (mã ${cu.status}): ${cut(cu.out, 200)}`);
  const sai = m[1].trim().split(', ');
  if (!bang(sai, LOT)) throw new Error(`DO AC-6: ở ${dauCa.slice(0, 9)} ô sai ${sai.join(', ')}; mong ${LOT.join(', ')}`);
  const nay = chayO(g('rev-parse', 'HEAD'));
  if (nay.status !== 0) throw new Error(`DO AC-6: đối chứng HEAD không xanh (mã ${nay.status}): ${cut(nay.out, 200)}`);
  return `tệp ca ${dauCa.slice(0, 9)} trước vá ${dauVa.slice(0, 9)}; ở sha tệp ca AC-1 đỏ đúng ${LOT.length} ô; HEAD xanh`;
}, { chiGoiTen: true });

// ── Chạy ────────────────────────────────────────────────────────────────────
const yeuCau = (process.env.TEH_CASES || '').split(',').map((s) => s.trim()).filter(Boolean);
for (const id of yeuCau) {
  if (!CA.has(id)) { console.error(`t1-escape-ho-so.test: mã ca lạ «${id}» — có: ${[...CA.keys()].join(' ')}`); process.exit(2); }
}
const chon = yeuCau.length ? yeuCau : [...CA.keys()].filter((id) => !CHI_GOI_TEN.has(id));
let pass = 0; let fail = 0;
for (const id of chon) {
  const t0 = Date.now();
  try {
    const tom = await CA.get(id)();
    console.log(`  PASS: ${id} — ${tom} (${((Date.now() - t0) / 1000).toFixed(1)}s)`); pass += 1;
  } catch (e) {
    console.log(`  FAIL: ${id} — ${e && e.message ? e.message : e}`); fail += 1;
  }
}
console.log(`Results: ${pass} passed, ${fail} failed (t1-escape-ho-so)`);
process.exit(fail > 0 || pass === 0 ? 1 : 0);
