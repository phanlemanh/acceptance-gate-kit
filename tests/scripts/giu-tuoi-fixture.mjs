// giu-tuoi-fixture.mjs — kho git code-sinh cho các ca của hồ sơ ho-so-da-ky-giu-tuoi (hàng K-A). KHÔNG phải tệp
// ca (run-tests.sh chỉ chạy *.test.mjs); tệp ca dùng chung là tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs.
//
// Kho có NHIỀU hồ sơ đã ký (mặc định H1..H6), mỗi hồ sơ có eval máy canh MỘT tệp vật riêng
// (`vat/<slug>-<E>.txt`): nội dung dòng đầu «ok» → eval in `(pass) <ca> [0.10ms]`, thoát 0; khác → eval in
// nguyên nội dung tệp (một dòng lỗi + dòng `(fail) <ca> [1.00ms]` kiểu bun, để rutTenCa rút được tên ca), thoát 1.
// Một suite chung `suite.sh` (đỏ khi có tệp `vat/suite-hong`). Pin đầu do CHÍNH repin-lane.mjs --write ghi (writer
// thật, như gia-lan-fixture.mjs). Dấu vết lệnh ghi ra thư mục NGOÀI kho (biến GG_DAU) — một tệp git theo dõi làm
// dấu thì mỗi lượt chạy làm cây khác pin.
//
// Nhánh chính tên `main`; gộp PR = commit gộp `Merge pull request #<n> from x/pr-<n>` (hoặc kiểu nén
// `feat: … (#<n>)`). «Bản trước vòng» = `git archive 8fe79f1f (gốc so sau khi gộp #382, 18/10) feature-loop lib scripts skills commands hooks` bung
// vào thư mục tạm — dùng cho chiều đỏ. Mọi đường dẫn suy từ vị trí tệp này.
//
// Export: ROOT · LANE · BAN_TRUOC_VONG · BAN_LUOT_1 · mkKhoGiuTuoi(opts) · banTai(sha) · banTruocVong() · banLuot1() ·
// noiDungDo({ca, loi}) · donDep().
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(HERE, '..', '..');
export const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
export const RECHECK = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');
export const BAN_TRUOC_VONG = '8fe79f1f41f5c060399f5b09ca2fd49137d9faef';

const tmp = [];
const thuMuc = (tien) => { const d = mkdtempSync(path.join(tmpdir(), tien)); tmp.push(d); return d; };
export function donDep() { while (tmp.length) rmSync(tmp.pop(), { recursive: true, force: true }); _ban = null; }

// Nội dung tệp vật làm eval đỏ: dòng lỗi TRƯỚC dòng ca (bun in lỗi trước «(fail)»).
export const noiDungDo = ({ ca = 'ca-do', loi = 'expected 3 got 4' } = {}) => `${loi}\n(fail) ${ca} [1.00ms]\n`;

// «Bản lượt chấm 1» = vật NGAY TRƯỚC nhát sửa ba ô duyệt thêm 18/10 (AC-4 ô 5 · AC-5 ô 4 · AC-7 ô giả 4) — chiều đỏ
// của ba ô ấy chạy trên bản này. Commit của nhánh vòng; gộp kiểu merge commit giữ nó trong lịch sử main.
export const BAN_LUOT_1 = '18f307d208a68b9eb3cc7f5513864f1c1a27b756';

// Bản bộ máy ở một commit, bung MỘT lần mỗi tiến trình. → { dir, lane, agRoot, recheck }
let _ban = null;
export function banTai(sha) {
  if (!_ban) _ban = new Map();
  if (_ban.has(sha)) return _ban.get(sha);
  const dir = thuMuc('gt-ban-');
  const tar = execFileSync('git', ['-C', ROOT, 'archive', sha, 'feature-loop', 'lib', 'scripts', 'skills', 'commands', 'hooks'], { maxBuffer: 1 << 30 });
  const x = spawnSync('tar', ['-x', '-C', dir], { input: tar });
  if (x.status !== 0) throw new Error(`bung bản ${sha} thất bại: ${String(x.stderr)}`);
  const b = { dir, lane: path.join(dir, 'feature-loop', 'scripts', 'repin-lane.mjs'), agRoot: dir, recheck: path.join(dir, 'scripts', 'recheck-evidence.cjs') };
  _ban.set(sha, b);
  return b;
}
export const banTruocVong = () => banTai(BAN_TRUOC_VONG);
export const banLuot1 = () => banTai(BAN_LUOT_1);

const khoaExec = (slug, id) => `${slug}_${id}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
const chuanHoSo = (h) => {
  const o = typeof h === 'string' ? { slug: h } : h;
  const evals = (o.evals || [{ id: 'E1' }]).map(e => Object.assign({ ca: `ca-${o.slug.toLowerCase()}-${e.id.toLowerCase()}` }, e));
  return { slug: o.slug, evals };
};

// opts: { hoSo: [slug | {slug, evals:[{id, ca?, paths?}]}] (mặc định H1..H6, mỗi hồ sơ một E1),
//         khoa: giá trị feature_loop.do_san_tren_nen (undefined → vắng dòng), staleScope: 'paths' | null,
//         config: dòng YAML thêm dưới feature_loop (thụt 2), status: trạng thái hợp đồng (mặc định implemented),
//         ghimDau: false → không chạy pin đầu }
// e.paths vắng → ["vat/<slug>-<E>*", "rang/<slug>-<E>.sh"]; e.paths === null → không khai paths.
// e.than (chuỗi) → thân rang/<slug>-<E>.sh thay thân mặc định (vd eval cần một thư viện cài sẵn của kho).
// opts.truocHoSo(api) → chạy sau commit gốc, TRƯỚC khi dựng hồ sơ đầu (vd tạo .gitignore + thư mục phụ thuộc).
export function mkKhoGiuTuoi(opts = {}) {
  const root = thuMuc('gt-kho-');
  const dau = thuMuc('gt-dau-');
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ghi = (rel, nd) => { const p = path.join(root, rel); if (nd === null) { rmSync(p, { force: true }); return; } mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, nd); };
  const doc = (rel) => readFileSync(path.join(root, rel), 'utf8');
  const hoSo = []; // danh sách hồ sơ đã dựng (để dựng lại config khi thêm)
  let khoa = opts.khoa;
  const q = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  const dungConfig = () => {
    const scripts = hoSo.flatMap(h => h.evals.map(e => `    ${khoaExec(h.slug, e.id)}: ${q(`sh rang/${h.slug}-${e.id}.sh`)}`)).join('\n');
    return `schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\n`
      + `${khoa === undefined ? '' : `  do_san_tren_nen: ${khoa}\n`}${opts.config || ''}`
      + `executors:\n  test:\n    suite: ${q('sh suite.sh')}\n  script:\n${scripts || '    _rong: "true"'}\n`
      + `risk_tiers:\n${opts.staleScope === null ? '' : `  stale_scope: ${opts.staleScope || 'paths'}\n`}  t1_skip_globs:\n    - "docs/**"\n`;
  };
  const datKhoa = (v) => { khoa = v; ghi('_acceptance/config.yaml', dungConfig()); };
  const khaiPaths = (h, e) => {
    const p = e.paths === undefined ? [`vat/${h.slug}-${e.id}*`, `rang/${h.slug}-${e.id}.sh`] : e.paths;
    return Array.isArray(p) ? `    paths:\n${p.map(x => `      - "${x}"\n`).join('')}` : '';
  };
  const evalsYaml = (h) => `schema_version: 1\nfeature_slug: ${h.slug}\nevals:\n${h.evals.map(e => `  - id: ${e.id}\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.${khoaExec(h.slug, e.id)}\n    expected: exit 0\n${khaiPaths(h, e)}    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`).join('')}`;
  const thanEval = (h, e) => (typeof e.than === 'string' ? e.than : thanMacDinh(h, e));
  const thanMacDinh = (h, e) => `[ -n "$GG_DAU" ] && echo ran >> "$GG_DAU/${h.slug}-${e.id}.txt"\nf=vat/${h.slug}-${e.id}.txt\nif [ "$(head -n 1 "$f")" = ok ]; then echo "(pass) ${e.ca} [0.10ms]"; exit 0; fi\ncat "$f"\nexit 1\n`;
  // Dựng tệp của các hồ sơ (chưa commit) — `ghi` mọi thứ trừ pin.
  const dungTep = (hs) => {
    for (const h of hs) {
      const ws = `_acceptance/${h.slug}`;
      for (const e of h.evals) { ghi(`rang/${h.slug}-${e.id}.sh`, thanEval(h, e)); ghi(`vat/${h.slug}-${e.id}.txt`, 'ok\n'); }
      ghi(`${ws}/contract.md`, `---\nschema_version: 1\nfeature: ${h.slug}\nslug: ${h.slug}\nrisk_tier: T2\nsurfaces: [api]\nstatus: ${opts.status || 'implemented'}\napproved_by: Manh Phan\n---\n`);
      ghi(`${ws}/evals.yaml`, evalsYaml(h));
    }
  };
  const ghiBangChung = (hs, sha) => {
    for (const h of hs) {
      const ws = `_acceptance/${h.slug}`;
      ghi(`${ws}/run-log.jsonl`, h.evals.map(e => JSON.stringify({ ts: '2026-10-01T00:00:00Z', kind: 'eval', run_id: `r1-${e.id}`, sha, eval: e.id, exit_code: 0 })).join('\n') + '\n');
      ghi(`${ws}/evidence-report.md`, `---\nschema_version: 1\nfeature_slug: ${h.slug}\nverdict: PASS\nverified_commit: ${sha}\nhuman_signoff: Manh 2026-10-01\n---\n\n## Evidence\n${h.evals.map(e => `- eval: ${e.id}\n  run_id: r1-${e.id}\n  exit_code: 0\n  verifier: config:executors.script.${khoaExec(h.slug, e.id)}\n  verified_at: 2026-10-01\n`).join('')}\n## Iterations\n\nRound 1 — PASS.\n`);
    }
  };
  const envOf = (extra) => ({ ...process.env, GG_DAU: dau, ...(extra || {}) });
  // Chạy làn ghim lại cho `slugs`. o.laneFile / o.agRoot: bản làn khác (bản trước vòng) trên CÙNG kho.
  const lane = (slugs, args = [], o = {}) => spawnSync(process.execPath,
    [o.laneFile || LANE, '--root', root, '--ag-root', o.agRoot || ROOT, ...[].concat(slugs).flatMap(s => ['--slug', s]), ...args],
    { encoding: 'utf8', env: envOf(o.env), timeout: o.timeout || 300000, killSignal: 'SIGKILL', maxBuffer: 256 * 1024 * 1024 });
  const recheck = (slug, o = {}) => spawnSync(process.execPath, [o.recheck || RECHECK, path.join(root, '_acceptance', slug, 'evidence-report.md')], { encoding: 'utf8', cwd: root });
  // Thêm hồ sơ ở HEAD hiện tại: commit mã + hồ sơ, commit bằng chứng (verified_commit = commit mã), rồi pin đầu
  // bằng CHÍNH làn (--write) và commit. ghimDau=false → dừng sau bằng chứng.
  const themHoSo = (dsHoSo, { ghimDau = true, thongDiep = 'them ho so' } = {}) => {
    const hs = [].concat(dsHoSo).map(chuanHoSo);
    hoSo.push(...hs);
    ghi('_acceptance/config.yaml', dungConfig());
    dungTep(hs);
    git('add', '-A'); git('commit', '-qm', `${thongDiep}: impl`);
    ghiBangChung(hs, git('rev-parse', 'HEAD'));
    git('add', '-A'); git('commit', '-qm', `${thongDiep}: evidence`);
    if (ghimDau) {
      const r = lane(hs.map(h => h.slug), ['--reason', 'pin dau', '--write']);
      if (r.status !== 0) throw new Error(`pin đầu đỏ (${r.status}): ${r.stderr.split('\n').slice(-12).join('\n')}`);
      git('add', '-A'); git('commit', '-qm', `${thongDiep}: repin`);
    }
    return hs.map(h => h.slug);
  };
  // Gộp PR #n vào main. sua = {đường: nội dung | null (xoá)}. kieu 'merge' → commit gộp «Merge pull request #n
  // from x/pr-n»; 'nen' → một commit trên main tiêu đề `tieuDe` (mặc định «feat: pr n (#n)»).
  // → { pr, sha_truoc (cha đầu), sha_sau (commit gộp) }
  const gop = (n, sua, { kieu = 'merge', nhanh = `x/pr-${n}`, tieuDe } = {}) => {
    git('checkout', '-q', 'main');
    const truoc = git('rev-parse', 'HEAD');
    if (kieu === 'merge') {
      git('checkout', '-q', '-b', nhanh);
      for (const [p, nd] of Object.entries(sua)) ghi(p, nd);
      git('add', '-A'); git('commit', '-qm', `pr ${n}`);
      git('checkout', '-q', 'main');
      git('merge', '-q', '--no-ff', '-m', `Merge pull request #${n} from ${nhanh}`, nhanh);
    } else {
      for (const [p, nd] of Object.entries(sua)) ghi(p, nd);
      git('add', '-A'); git('commit', '-qm', tieuDe || `feat: pr ${n} (#${n})`);
    }
    return { pr: n, sha_truoc: truoc, sha_sau: git('rev-parse', 'HEAD') };
  };
  // Commit thẳng (không gộp) trên nhánh hiện tại.
  const commit = (sua, thongDiep = 'sua') => { for (const [p, nd] of Object.entries(sua)) ghi(p, nd); git('add', '-A'); git('commit', '-qm', thongDiep); return git('rev-parse', 'HEAD'); };
  const docLog = (slug) => { const p = path.join(root, '_acceptance', slug, 'run-log.jsonl'); return existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return { kind: '?hong', raw: l }; } }) : []; };
  const docReport = (slug) => doc(`_acceptance/${slug}/evidence-report.md`);
  const vc = (slug) => (docReport(slug).match(/^verified_commit\s*:\s*(\S+)/m) || [])[1];
  const docDau = (ten) => { const p = path.join(dau, ten); return existsSync(p) ? readFileSync(p, 'utf8') : ''; };
  const dem = (ten) => docDau(ten).split('\n').filter(Boolean).length;
  const xoaDau = () => { rmSync(dau, { recursive: true, force: true }); mkdirSync(dau, { recursive: true }); };
  // Bên viết dòng nền đỏ khi lệnh giữ tươi CHƯA có (Task 2): chép `lenh_do` (mục eval) + `dinh_nghia` từ dòng
  // `repin-do` cuối do CHÍNH làn ghi — thông điệp băm là của writer thật, không viết tay. Trả chuỗi dòng.
  const dongNenTuDauDo = (slug, { runId = 'giu-tuoi-gt-1', tu, ketCuc = 'do-khoang', quyVe = [] } = {}) => {
    const d = docLog(slug).filter(l => l.kind === 'repin-do').pop();
    if (!d) throw new Error(`${slug}: không có dòng repin-do để chép dòng nền`);
    return JSON.stringify({ ts: d.ts, kind: 'nen-do', run_id: runId, sha: d.sha, tu: tu || d.sha, ket_cuc: ketCuc,
      lenh_do: d.lenh_do.filter(m => m && m.eval !== undefined), quy_ve: quyVe, dinh_nghia: d.dinh_nghia });
  };
  const noiDong = (slug, dong) => { const rel = `_acceptance/${slug}/run-log.jsonl`; const cu = existsSync(path.join(root, rel)) ? doc(rel) : ''; ghi(rel, cu + (cu && !cu.endsWith('\n') ? '\n' : '') + dong + '\n'); };

  git('init', '-q', '-b', 'main');
  ghi('suite.sh', `[ -n "$GG_DAU" ] && echo ran >> "$GG_DAU/suite.txt"\nif [ -f vat/suite-hong ]; then echo "(fail) suite-chung [1.00ms]"; exit 1; fi\nexit 0\n`);
  ghi('docs/README.md', 'kho thu\n');
  const dau0 = (opts.hoSo || ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
  const api = { root, dau, git, ghi, doc, lane, recheck, themHoSo, gop, commit, docLog, docReport, vc, docDau, dem, xoaDau, datKhoa, dongNenTuDauDo, noiDong, hoSo };
  if (opts.truocHoSo) {
    ghi('_acceptance/config.yaml', dungConfig()); git('add', '-A'); git('commit', '-qm', 'goc');
    opts.truocHoSo(api);
    if (dau0.length) themHoSo(dau0, { ghimDau: opts.ghimDau !== false, thongDiep: 'ho so dau' });
  } else if (dau0.length) themHoSo(dau0, { ghimDau: opts.ghimDau !== false, thongDiep: 'goc' });
  else { ghi('_acceptance/config.yaml', dungConfig()); git('add', '-A'); git('commit', '-qm', 'goc'); }
  return api;
}
