// evals-sat-le-lib.mjs — bộ trợ giúp của hồ sơ evals-sat-le-doc-du, dùng chung cho tệp ca
// (evals-sat-le.test.mjs) và CLI vi phân bảy kho (evals-sat-le-vi-phan.mjs).
//
// Bản base: `git archive BASE` của MỘT hằng BASE_DIRS (trọn thư mục, không danh sách tệp tay — P150).
// Mọi fixture do mã sinh trong lượt chạy; mọi đường dẫn suy từ vị trí tệp này.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.join(HERE, '..', '..');
export const BASE = '3200ba3a';
// feature-loop/workflows + skills/acceptance/references: s4-args của base đọc bảng trường bắt buộc của
// workflow và đòi các tệp luật ở --ag-root — thiếu thì base đỏ vì hạ tầng (ruling Task 2).
export const BASE_DIRS = ['feature-loop/scripts', 'feature-loop/workflows', 'lib', 'scripts', 'skills/acceptance/references'];
// Các tệp mà một chiều đỏ gọi trên bản base — vắng là đỏ vì HẠ TẦNG, phải nói ra trước.
const BASE_CAN = ['lib/evidence-core.cjs', 'lib/eval-yaml.cjs', 'feature-loop/scripts/s4-args.mjs',
  'feature-loop/scripts/carry-plan.mjs', 'scripts/acceptance-gold.mjs', 'scripts/gate-card.js'];
export const DANH_SACH_4 = ['steps', 'inputs', 'paths', 'evidence_required'];
const require = createRequire(import.meta.url);
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
export const tam = ten => mkdtempSync(path.join(tmpdir(), `esl-${ten}-`));

// ── bản base ─────────────────────────────────────────────────────────────────
let BASE_DIR = null;
export function dungBase() {
  if (BASE_DIR) return BASE_DIR;
  try { git(KIT, 'rev-parse', '--verify', `${BASE}^{commit}`); } catch { throw new Error(`base không giải được: ${BASE}`); }
  let khac = true;
  try { execFileSync('git', ['-C', KIT, 'diff', '--quiet', BASE, '--', ...BASE_DIRS], { stdio: 'ignore' }); khac = false; } catch { khac = true; }
  if (!khac) throw new Error('base trùng cây');
  const d = tam('base');
  execFileSync('bash', ['-c', `git -C "$1" archive "$2" ${BASE_DIRS.map(x => `"${x}"`).join(' ')} | tar -x -C "$3"`, '_', KIT, BASE, d]);
  for (const t of BASE_CAN) if (!existsSync(path.join(d, t))) throw new Error(`base thiếu tệp: ${t}`);
  BASE_DIR = d;
  return d;
}

// ── bản sao lib có đột biến (kim phải khớp đúng soLan lần) ───────────────────────
// Chép TRỌN lib/ và skills/acceptance/references/ (s4-args đòi cả hai ở --ag-root).
export function dungBanSaoLib(kim, thay, soLan = 1) {
  const d = tam('lib');
  cpSync(path.join(KIT, 'lib'), path.join(d, 'lib'), { recursive: true });
  cpSync(path.join(KIT, 'skills', 'acceptance', 'references'), path.join(d, 'skills', 'acceptance', 'references'), { recursive: true });
  if (kim != null) {
    const f = path.join(d, 'lib', 'evidence-core.cjs');
    const src = readFileSync(f, 'utf8');
    const n = src.split(kim).length - 1;
    if (n !== soLan) throw new Error(`kim đột biến khớp ${n} lần (cần ${soLan}): ${kim}`);
    writeFileSync(f, src.split(kim).join(thay));
  }
  return d;
}

// ── mô hình tiêu chí → ba cách viết ─────────────────────────────────────────────
// Mỗi tiêu chí: trường đơn + trường danh sách. Một mục có nháy + chú thích cuối dòng (Review Focus 3).
export const MO_HINH = [
  { id: 'S1', criterion: 'AC-1', executor: 'script', cmd: 'config:executors.script.cli', expected: 'x',
    ds: { paths: ['src-demo.js', 'lib/**'], evidence_required: ['run_id', 'exit_code'] } },
  { id: 'J1', criterion: 'AC-2', executor: 'judgment', question: 'cau hoi du dai de doc',
    ds: { inputs: ['README.md'], paths: ['src-demo.js'] } },
  { id: 'U1', criterion: 'AC-3', executor: 'ui-check', expected: 'trang hien',
    ds: { steps: ['mo trang', 'chup anh'], paths: ['src-demo.js'] } },
];
export const CACH = ['thut4', 'satle', 'muc-ngang-khoa'];
export function vietMoHinh(cach, moHinh = MO_HINH) {
  const idCol = cach === 'satle' ? 0 : 2;
  const p = ' '.repeat(idCol), k = ' '.repeat(idCol + 2);
  const it = ' '.repeat(cach === 'thut4' ? idCol + 4 : idCol + 2);
  let s = 'schema_version: 1\nfeature_slug: demo\nevals:\n';
  for (const tc of moHinh) {
    s += `${p}- id: ${tc.id}\n`;
    for (const [key, v] of Object.entries(tc)) if (!['id', 'ds'].includes(key)) s += `${k}${key}: ${v}\n`;
    for (const [key, arr] of Object.entries(tc.ds || {})) {
      s += `${k}${key}:\n`;
      arr.forEach((x, i) => { s += i === 0 ? `${it}- "${x}"   # ghi chu\n` : `${it}- ${x}\n`; });
    }
  }
  return s;
}

// ── kho git do mã sinh + chạy s4-args ───────────────────────────────────────────
export function dungKho(evalsText) {
  const d = tam('kho');
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), evalsText);
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'r1');
  git(d, 'checkout', '-qb', 'v');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vat');
  return d;
}
export function chayS4(d, { agRoot = KIT, s4 = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs') } = {}) {
  const out = path.join(d, 'args.json');
  const r = spawnSync(process.execPath, [s4, '--slug', 'demo', '--root', d, '--ag-root', agRoot, '--out', out, '--diff-base', 'main'], { encoding: 'utf8' });
  const args = r.status === 0 && existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null;
  return { rc: r.status, stderr: String(r.stderr || ''), args, coTep: existsSync(out) };
}

// ── bảng trường bắt buộc rút từ bên đọc (khối EVAL-REQUIRED-FIELDS của workflow) ──
export function evalRequired() {
  const src = readFileSync(path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = src.match(/<<<EVAL-REQUIRED-FIELDS([\s\S]*?)EVAL-REQUIRED-FIELDS>>>/);
  if (!m) throw new Error('không rút được EVAL-REQUIRED-FIELDS');
  const out = {};
  for (const l of m[1].split('\n')) {
    const r = l.match(/^\s*'([\w-]+)':\s*\{\s*str:\s*\[([^\]]*)\],\s*arr:\s*\[([^\]]*)\]/);
    if (r) out[r[1]] = { arr: r[3].split(',').map(x => x.trim().replace(/^'|'$/g, '')).filter(Boolean) };
  }
  return out;
}

// ── bộ đọc danh sách của MỘT bản s4-args (rút khối `{ // list fields` … `\n}\n`) ──
// Chạy chính khối mã của bản đó (bên viết thật), không chép luật.
export function docDanhSachS4(srcS4, evalsText, ids, parseFlowValue) {
  const a = srcS4.indexOf('{ // list fields');
  if (a < 0) throw new Error('không thấy khối list fields trong s4-args');
  const b = srcS4.indexOf('\n}\n', a);
  const body = srcS4.slice(srcS4.indexOf('\n', a) + 1, b);
  const evals = ids.map(id => ({ id }));
  const uniq = x => [...new Set(x)];
  const REQ_ARR = [...new Set(Object.values(evalRequired()).flatMap(v => v.arr))];
  new Function('evalsText', 'evals', 'uniq', 'REQ_ARR', 'parseFlowValue', body)(evalsText, evals, uniq, REQ_ARR, parseFlowValue);
  return new Map(evals.map(e => [e.id, e]));
}

const chuan = v => (Array.isArray(v) && v.length ? JSON.stringify(v) : null);
// Bộ đọc «cũ» = base: khối danh sách của s4-args base + evalPathsOf base.
export function docBase(baseDir) {
  const core = require(path.join(baseDir, 'lib', 'evidence-core.cjs'));
  const src = readFileSync(path.join(baseDir, 'feature-loop', 'scripts', 's4-args.mjs'), 'utf8');
  return (text, ids) => {
    const m = docDanhSachS4(src, text, ids, core.parseFlowValue);
    return new Map(ids.map(id => {
      const e = m.get(id) || {};
      const o = {}; for (const k of DANH_SACH_4) o[k] = chuan(e[k]);
      o['paths@lib'] = chuan(core.evalPathsOf(text, id));
      return [id, o];
    }));
  };
}
// Bộ đọc «mới» = evalListsOf + evalPathsOf của một gốc lib.
export function docLib(root) {
  const core = require(path.join(root, 'lib', 'evidence-core.cjs'));
  return (text, ids) => {
    const { byId } = core.evalListsOf(text, DANH_SACH_4);
    return new Map(ids.map(id => {
      const f = byId.get(id) || {};
      const o = {}; for (const k of DANH_SACH_4) o[k] = chuan(f[k]);
      o['paths@lib'] = chuan(core.evalPathsOf(text, id));
      return [id, o];
    }));
  };
}

// ── vi phân trên mọi `_acceptance/*/evals.yaml` của các kho ─────────────────────
export function viPhan({ khos, cu, moi }) {
  const { parseEvals } = require(path.join(KIT, 'lib', 'eval-yaml.cjs'));
  let hoSo = 0, tieuChi = 0; const lech = []; const theoKho = [];
  for (const kho of khos) {
    const acc = path.join(kho, '_acceptance');
    let n = 0, m = 0;
    for (const s of (existsSync(acc) ? readdirSync(acc) : []).sort()) {
      const f = path.join(acc, s, 'evals.yaml');
      if (!existsSync(f)) continue;
      const text = readFileSync(f, 'utf8');
      const ids = [...new Set(parseEvals(text, ['executor']).map(e => e.id))];
      const a = cu(text, ids), b = moi(text, ids);
      n++; m += ids.length;
      const satLe = /^- id:/m.test(text);
      for (const id of ids) for (const k of Object.keys(a.get(id))) {
        const x = a.get(id)[k], y = b.get(id)[k];
        if (x === y) continue;
        const rac = x && JSON.parse(x).every(v => /^[&*]/.test(String(v)));
        lech.push({ kho: path.basename(kho), hoSo: s, id, key: k, cu: x, moi: y, satLe, chieu: (!x || rac) && y ? 'doc-them' : 'khac' });
      }
    }
    hoSo += n; tieuChi += m; theoKho.push({ kho, hoSo: n, tieuChi: m });
  }
  return { hoSo, tieuChi, lech, theoKho };
}
