// ra-soat-lo-trinh.test.mjs — hồ sơ ra-soat-lo-trinh (hàng RM1, vòng 1 của gói road-map), ca RS-<n> = AC-n của hợp đồng
// (AC-9 ở ra-soat-lo-trinh-crm.mjs). Mỗi eval của evals.yaml ghim đúng dòng «PASS: RS-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm, commit ghim ngày bằng GIT_COMMITTER_DATE/GIT_AUTHOR_DATE,
// hồ sơ dựng theo hình dạng ô bản đồ). Giá trị mong đợi viết sẵn trong ca, không rút từ đầu ra của hàm rà soát.
// «Bộ máy gốc» = `git archive <gốc so> scripts lib skills commands`, gốc so đọc từ _acceptance/ra-soat-lo-trinh/goc-so.
// Ca gác RS-0 chạy trước: commit chạm mã sau gốc so phải thuộc vòng — không thì mọi ca so với bộ máy gốc không được tính.
// Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO của vật (nhát tiêm khớp đúng một lần), SAU khi bản lành xanh trên cùng kho thử,
// và ghim thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = readFileSync(path.join(KIT, '_acceptance', 'ra-soat-lo-trinh', 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ra-soat-')));
const HOM_NAY = '2026-10-14';
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.RS_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ═══ RS-0: gốc so đi theo nền ════════════════════════════════════════════════════════════════════
// Quan hệ, không đếm commit: mã khác gốc (diff gốc..HEAD) chỉ được nằm ở tệp do commit CỦA VÒNG sửa, và mọi commit thường
// chạm mã sau gốc phải thuộc vòng. Commit gộp nhánh chính không bị tính tên — phần mã nó mang vào đã ở dưới gốc thì diff
// không thấy; mang vào thứ gốc chưa có thì tệp ấy lộ ở vế thứ nhất (14/10, gộp main sau MC1).
const MA = ['scripts', 'lib', 'skills', 'commands'];
function gocLech(kho, goc, nhan) {
  const ds = git(kho, 'log', '--no-merges', '--format=%h %s', `${goc}..HEAD`, '--', ...MA).split('\n').filter(Boolean);
  const la = ds.filter(l => !l.includes(nhan));
  const tepVong = new Set(git(kho, 'log', '--no-merges', '--fixed-strings', `--grep=${nhan}`, '--format=', '--name-only', `${goc}..HEAD`, '--', ...MA).split('\n').filter(Boolean));
  const tepLa = git(kho, 'diff', '--name-only', goc, 'HEAD', '--', ...MA).split('\n').filter(t => t && !tepVong.has(t));
  return [...la.map(l => `commit không thuộc vòng: ${l}`), ...tepLa.map(t => `tệp khác gốc mà vòng không sửa: ${t}`)];
}
// Gác gốc so chỉ có vai LÚC VÒNG CÒN MỞ (sửa 15/10 sau chữ ký, rút Task 1 của hồ sơ ap-chinh-sach-lo-trinh): khi hồ sơ
// đã ký và gộp, `gốc..HEAD` là merge-base SỐNG — mọi PR sửa mã về sau (của vòng nào cũng vậy) làm RS-0 đỏ dù không đụng
// lời hứa nào của vòng. Đã ký → không kiểm commit; mỗi ca so byte với bộ máy gốc vẫn tự gọi tên chỗ lệch.
// «Đã ký» đọc qua hằng một nguồn của lib (DA_THONG_CONG_2) — không chép tên trạng thái vào tệp ca (RT13 canh bộ đọc).
const rq = createRequire(import.meta.url);
const { DA_THONG_CONG_2 } = rq(path.join(KIT, 'lib', 'workspace-record.cjs'));
const { frontmatterField } = rq(path.join(KIT, 'lib', 'evidence-core.cjs'));
const daKy = txt => DA_THONG_CONG_2.includes(String(frontmatterField(String(txt), 'status') || '').toLowerCase());
const gacGoc = (kho, contractTxt, goc, nhan) => (daKy(contractTxt) ? [] : gocLech(kho, goc, nhan));
function rs0() {
  // Chiều đỏ trong bộ kiểm — mỗi vế một ca CÔ LẬP (Cổng Bằng chứng 15/10, Ngoài-1/5/6), kho tạm dựng trong lượt:
  //  · vế tệp: commit lạ thêm tệp vòng không sửa, vào qua commit gộp → đỏ gọi tên tệp;
  //  · vế commit: commit lạ sửa ĐÚNG tệp vòng cũng sửa (vế tệp bỏ qua tệp đó) → đỏ gọi tên commit, không câu tệp nào;
  //  · đặc hiệu: nhánh vòng gộp nhánh chính, gốc = đỉnh nhánh chính → XANH (lý do của lần sửa 14/10).
  let n = 0;
  const khoTam = () => {
    const k = path.join(TMP, `rs0-${++n}`); mkdirSync(path.join(k, 'scripts'), { recursive: true });
    git(k, 'init', '-q', '-b', 'main'); git(k, 'config', 'user.email', 'x@y.z'); git(k, 'config', 'user.name', 'x');
    writeFileSync(path.join(k, 'scripts', 'a.mjs'), '1\nx\ny\nz\n'); git(k, 'add', '-A'); git(k, 'commit', '-qm', 'nen');
    return { k, g: git(k, 'rev-parse', 'HEAD') };
  };
  const ghi = (k, tep, noi, tin) => { writeFileSync(path.join(k, 'scripts', tep), noi); git(k, 'add', '-A'); git(k, 'commit', '-qm', tin); };
  const vong = k => ghi(k, 'a.mjs', '2\nx\ny\nz\n', 'feat(vong-thu): a');
  const sai = [];
  // Lành: chỉ commit vòng.
  { const { k, g } = khoTam(); vong(k); const x = gocLech(k, g, 'vong-thu'); if (x.length) sai.push(`bản lành chưa xanh: ${x.join(' | ')}`); }
  // Vế tệp.
  { const { k, g } = khoTam(); git(k, 'checkout', '-qb', 'la'); ghi(k, 'la.mjs', 'x\n', 'viec khac');
    git(k, 'checkout', '-q', 'main'); vong(k); git(k, 'merge', '-q', '--no-ff', '--no-edit', 'la');
    const x = gocLech(k, g, 'vong-thu'); if (!x.includes('tệp khác gốc mà vòng không sửa: scripts/la.mjs')) sai.push(`vế tệp: commit lạ vào qua gộp mà không đỏ đúng tệp: ${JSON.stringify(x)}`); }
  // Vế commit, cô lập.
  { const { k, g } = khoTam(); git(k, 'checkout', '-qb', 'la'); ghi(k, 'a.mjs', '1\nx\ny\nZ\n', 'viec khac 2');
    git(k, 'checkout', '-q', 'main'); vong(k); git(k, 'merge', '-q', '--no-ff', '--no-edit', 'la');
    const x = gocLech(k, g, 'vong-thu');
    if (!x.some(l => l.startsWith('commit không thuộc vòng: ') && l.endsWith(' viec khac 2'))) sai.push(`vế commit: commit lạ sửa tệp của vòng mà không đỏ gọi tên commit: ${JSON.stringify(x)}`);
    if (x.some(l => l.startsWith('tệp khác gốc'))) sai.push(`vế commit không cô lập — vế tệp cũng đỏ: ${JSON.stringify(x)}`); }
  // Đặc hiệu: gộp nhánh chính, gốc dời lên đỉnh nhánh chính.
  { const { k } = khoTam(); git(k, 'checkout', '-qb', 'vong'); vong(k);
    git(k, 'checkout', '-q', 'main'); ghi(k, 'b.mjs', 'b\n', 'main tien'); const g = git(k, 'rev-parse', 'HEAD');
    git(k, 'checkout', '-q', 'vong'); git(k, 'merge', '-q', '--no-ff', '--no-edit', 'main');
    const x = gocLech(k, g, 'vong-thu'); if (x.length) sai.push(`đặc hiệu: gộp nhánh chính với gốc = đỉnh nhánh chính mà vẫn đỏ: ${x.join(' | ')}`); }
  if (sai.length) { bad('RS-0-do', sai.join(' ; ')); return false; }
  ok('RS-0-do', 'lành xanh · commit lạ qua gộp → đỏ gọi tên tệp · commit lạ sửa tệp vòng → đỏ gọi tên commit (cô lập) · gộp nhánh chính, gốc = đỉnh → xanh');
  // RS-0-ky — cùng một kho: vòng đã gộp, rồi một PR khác sửa mã sau gốc. Chiều đỏ: luật merge-base sống (gocLech, như
  // trước 15/10) PHẢI đỏ gọi tên commit lạ; đối chứng dương: gacGoc với hồ sơ đã ký xanh; hồ sơ chưa ký vẫn bị gác.
  { const { k, g } = khoTam(); vong(k); ghi(k, 'pr-khac.mjs', 'x\n', 'feat(vong-khac): sua ma sau ky');
    const ky = `---\nslug: x\nstatus: ${DA_THONG_CONG_2[0]}\n---\n# body status: verified\n`; const chua = '---\nslug: x\nstatus: verified\n---\n';
    const song = gocLech(k, g, 'vong-thu'); const sau = gacGoc(k, ky, g, 'vong-thu'); const mo = gacGoc(k, chua, g, 'vong-thu');
    const s2 = [];
    if (!song.some(l => l.startsWith('commit không thuộc vòng: ') && l.endsWith(' feat(vong-khac): sua ma sau ky'))) s2.push(`luật merge-base sống không đỏ với PR sửa mã sau ký: ${JSON.stringify(song)}`);
    if (sau.length) s2.push(`hồ sơ đã ký mà vẫn gác: ${JSON.stringify(sau)}`);
    if (!mo.length) s2.push('hồ sơ chưa ký (verified) mà thôi gác');
    if (s2.length) { bad('RS-0-ky', s2.join(' ; ')); return false; }
    ok('RS-0-ky', 'PR sửa mã sau ký: luật merge-base sống đỏ gọi tên commit · đã ký → xanh · chưa ký (verified) → vẫn gác'); }
  const ct = readFileSync(path.join(KIT, '_acceptance', 'ra-soat-lo-trinh', 'contract.md'), 'utf8');
  if (daKy(ct)) { ok('RS-0', 'hồ sơ đã ký: gác gốc so chỉ áp lúc vòng còn mở'); return true; }
  const la = gacGoc(KIT, ct, GOC, 'ra-soat-lo-trinh');
  if (la.length) { bad('RS-0', `gốc so thiếu nền — ${la.join(' | ')}`); return false; }
  ok('RS-0', `mã khác gốc ${GOC.slice(0, 8)} chỉ ở tệp do commit của vòng sửa`); return true;
}
const GOC_XANH = rs0();

// ── Hồ sơ theo ô bản đồ — rút từ mô-đun dựng kho thử DÙNG CHUNG (cùng cách ca MC-*) ──────────────────────────────
const KT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-kho-thu.mjs')).href);
const thay1 = (t, cu, moi) => { if (t.split(cu).length !== 2) throw new Error(`khuôn hồ sơ đổi: «${cu.slice(0, 40)}» khớp ${t.split(cu).length - 1} lần`); return t.replace(cu, moi); };
const oppQuyet = (dec, ma) => { let o = KT.HO_SO['can-nhac']()['opportunity.md'];
  o = thay1(o, 'stage: discovery\ndecision: \ndecided_by: \ndecided_at: \n', `stage: decided\ndecision: ${dec}\ndecided_by: M\ndecided_at: 2026-09-01T00:00:00Z\n`);
  return ma ? thay1(o, '\nstage:', `\nlo_trinh_ma: ${ma}\nstage:`) : o; };
const HO_SO = {
  ...KT.HO_SO,
  'sap-mo': (s, ma) => ({ 'opportunity.md': oppQuyet('build', ma) }),
  'xep-lai': () => ({ 'opportunity.md': oppQuyet('park') }),
  'da-bac': () => ({ 'opportunity.md': oppQuyet('kill') }),
  'hong': s => ({ 'contract.md': thay1(KT.HO_SO['cho-duyet'](s)['contract.md'], 'status: draft', 'status: khong-co-trang-thai-nay') }),
};
const TEP = 'docs/lo-trinh.json';
let khoN = 0;
// `phienBan`: [{ ngay, data, nhan }] — mỗi phần tử MỘT commit ghim ngày; `cfg` null = không khai lộ trình;
// `chuaCommit`: ghi tệp lộ trình SAU commit (tệp chưa từng vào git).
function kho({ phienBan = [], data = null, hoSo = {}, cfg = undefined, ten = null, chuaCommit = false } = {}) {
  const r = path.join(TMP, ten || `kho-${++khoN}`); mkdirSync(r, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  const khoi = cfg !== undefined ? (cfg || '') : `lo_trinh:\n  tep: ${TEP}\n`;
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\n${khoi}`);
  for (const [slug, spec] of Object.entries(hoSo)) {
    const [hinh, ma] = Array.isArray(spec) ? spec : [spec];
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    for (const [f, t] of Object.entries(HO_SO[hinh](slug, ma))) writeFileSync(path.join(d, f), t);
  }
  const ghi = d => { const p = path.join(r, TEP); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(d, null, 2) + '\n'); };
  const pb = phienBan.length ? phienBan : [{ ngay: '2026-09-01', data, nhan: 'c1' }];
  const sha = {};
  pb.forEach((v, i) => {
    if (v.data != null && !chuaCommit) ghi(v.data);
    const env = { ...process.env, GIT_AUTHOR_DATE: `${v.ngay}T12:00:00Z`, GIT_COMMITTER_DATE: `${v.ngay}T12:00:00Z` };
    execFileSync('git', ['-C', r, 'add', '-A'], { env }); execFileSync('git', ['-C', r, 'commit', '-qm', `pb ${i}`, '--allow-empty'], { env });
    sha[v.nhan || `c${i + 1}`] = git(r, 'rev-parse', 'HEAD');
  });
  if (chuaCommit) ghi(pb[pb.length - 1].data);
  return { r, sha };
}
const H = (ma, o = {}) => ({ ma, cau_giao: `«câu giao ${ma}»`, ...o });

// Bản sao của vật: trọn scripts lib skills commands feature-loop road-map .claude-plugin của `goc`; nhát tiêm thay ĐÚNG một lần.
let bsN = 0;
function banSao(tiem = [], goc = KIT) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'commands', 'feature-loop', 'road-map', '.claude-plugin']) if (existsSync(path.join(goc, d))) cpSync(path.join(goc, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
let gocDir = null;
function banGoc() {
  if (gocDir) return gocDir;
  const d = path.join(TMP, 'goc-so'); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', '--format=tar', GOC, 'scripts', 'lib', 'skills', 'commands'], { maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  if (!existsSync(path.join(d, 'scripts', 'lo-trinh.mjs'))) throw new Error(`bộ máy gốc ${GOC} không bung được scripts/lo-trinh.mjs`);
  return (gocDir = d);
}
let napN = 0;
const nap = async kit => ({
  LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${++napN}`),
  PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${napN}`),
});
const rsJson = (kit, r, env = {}) => {
  const x = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--ra-soat', '--json'], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY, ...env } });
  if (x.status !== 0) throw new Error(`--ra-soat --json của ${kit} thoát ${x.status}: ${x.stderr.slice(0, 200)}`);
  return JSON.parse(x.stdout);
};
const quet = (kit, r) => {
  const x = node([path.join(kit, 'scripts', 'start-scan.mjs'), '--root', r], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  if (x.status !== 0) throw new Error(`start-scan của ${kit} thoát ${x.status}: ${x.stderr.slice(0, 200)}`);
  return x.stdout;
};
const chuanKit = (s, kit) => [realpathSync(kit), kit].reduce((x, g) => x.split(g).join('<kit>'), s);
const ve = async (kit, r, today) => {
  const cu = process.env.ACCEPTANCE_TODAY; process.env.ACCEPTANCE_TODAY = today;
  try { const M = await nap(kit); return M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS }); }
  finally { if (cu === undefined) delete process.env.ACCEPTANCE_TODAY; else process.env.ACCEPTANCE_TODAY = cu; }
};
const giaiMa = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const chuTron = s => giaiMa(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const coTrang = html => [...html.matchAll(/<ul class="co-ds">([\s\S]*?)<\/ul>/g)].flatMap(u => [...u[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])));
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 220)}`);
  } catch (e) { bad(id, loi(e)); }
};

// Hồ sơ road-map-de-dung (RD1) đổi CÓ CHỦ Ý trang, khối dữ liệu, bản xem chữ, thẻ khởi động và giờ máy. Các ca so «giống bộ máy
// gốc»/«khuôn viết sẵn» dưới đây chạy trên bản TẮT đúng các khối RD1 (tests/scripts/tat-rd1.mjs, tự kiểm bằng ca RD-tat) — lời
// hứa gốc (phần còn lại không đổi) giữ nguyên nghĩa; khối mới do road-map-de-dung.test.mjs đo. Chiều đỏ: nhát tiêm áp SAU bộ tắt.
const { tatRD1 } = await import(pathToFileURL(path.join(HERE, 'tat-rd1.mjs')).href);
const KIT_TAT = () => tatRD1(KIT);
const chayDoTat = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT_TAT()); if (lanh.length) { bad(id, `bản lành (tắt RD1) chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(tatRD1(KIT, tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 260)}`);
  } catch (e) { bad(id, loi(e)); }
};
const rsTap = rs => rs.flatMap(t => t.de_xuat.map(m => `${m.ma}|${m.de_xuat}|${m.luat}`));

// ═══ RS-1 (AC-1): ba luật sự thật — ma trận 6 vị trí × 8 trạng thái ═════════════════════════════════════════════
const VT = ['ph-qua', 'khong-loai-qua', 'ph-toi', 'ngoai-qua', 'han-cung-qua', 'ngoai-moc'];
const TT = ['chua-ho-so', 'dang-mo', 'da-giao', 'xep-lai-ho-so', 'xep-lai-tu-khai', 'da-bac', 'hong', 'khong-suy'];
const MOC_1 = {
  'ph-qua': { ten: 'Phát hành qua', ngay: '2026-09-01', loai: 'phat-hanh' },
  'khong-loai-qua': { ten: 'Không khai loại', ngay: '2026-09-01' },
  'ph-toi': { ten: 'Phát hành tới', ngay: '2026-12-01', loai: 'phat-hanh' },
  'ngoai-qua': { ten: 'Việc người', ngay: '2026-09-01', loai: 'ngoai', ai: 'M' },
  'han-cung-qua': { ten: 'Hạn cứng', ngay: '2026-09-01', loai: 'han-cung', ai: 'M' },
};
const MONG_1 = new Set(['RS1-ph-qua-chua-ho-so|doi-moc|moc-qua-ngay',
  ...VT.flatMap(v => [`RS1-${v}-xep-lai-ho-so|cho-dieu-kien|xep-lai`, `RS1-${v}-xep-lai-tu-khai|cho-dieu-kien|xep-lai`, `RS1-${v}-da-bac|bac|ho-so-bac`])]);
let kho1 = null;
const KHO_1 = () => kho1 || (kho1 = (() => {
  const hang = []; const hoSo = {}; const moc = Object.fromEntries(Object.entries(MOC_1).map(([k, m]) => [k, { ...m, hang: [] }]));
  for (const v of VT) for (const t of TT) {
    const ma = `RS1-${v}-${t}`; const s = `s-${v}-${t}`; let h = H(ma);
    // «Hồ sơ đang mở» ở nhóm CHƯA BẮT ĐẦU (sắp mở vòng): ô duy nhất mà bỏ chốt «có hồ sơ thì không đụng» sinh đề xuất sai.
    if (t === 'dang-mo') { h.slug = s; hoSo[s] = 'sap-mo'; }
    if (t === 'da-giao') { h.slug = s; hoSo[s] = 'da-ship'; }
    if (t === 'xep-lai-ho-so') { h.slug = s; hoSo[s] = 'xep-lai'; }
    if (t === 'xep-lai-tu-khai') h = H(ma, { trang_thai: 'Xếp lại sau' });
    if (t === 'da-bac') { h.slug = s; hoSo[s] = 'da-bac'; }
    if (t === 'hong') { h.slug = s; hoSo[s] = 'hong'; }
    if (t === 'khong-suy') { hoSo[`${s}-a`] = ['sap-mo', ma]; hoSo[`${s}-b`] = ['sap-mo', ma]; }
    hang.push(h); if (moc[v]) moc[v].hang.push(ma);
  }
  // Hàng phụ RS-1-ngay-sai: mốc phát hành ngày sai dạng không kích hoạt luật mốc qua ngày.
  hang.push(H('RS1-ngay-sai')); moc['ngay-sai'] = { ten: 'Ngày sai', ngay: 'sớm thôi', loai: 'phat-hanh', hang: ['RS1-ngay-sai'] };
  return kho({ ten: 'kho-rs1', data: { schema: 1, ten: 'Ma trận', moc: Object.values(moc), hang }, hoSo }).r;
})());
async function rs1(kit) {
  const sai = []; const rs = rsJson(kit, KHO_1()); const tap = new Set(rsTap(rs));
  if (!tap.size) return ['đối chứng: --ra-soat --json trả mảng rỗng'];
  for (const x of tap) if (!MONG_1.has(x)) {
    const [ma] = x.split('|');
    if (ma.includes('-ngoai-qua-') || ma.includes('-han-cung-qua-') || ma.includes('-khong-loai-qua-')) sai.push(`hàng mốc ngoài nhận đề xuất: ${ma}`);
    else if (ma.endsWith('-dang-mo')) sai.push(`hàng có hồ sơ đang mở nhận đề xuất: ${ma}`);
    else sai.push(`đề xuất thừa: ${x}`);
  }
  for (const x of MONG_1) if (!tap.has(x)) sai.push(`thiếu đề xuất: ${x}`);
  return sai;
}
if (want('RS-1') && await chayCa('RS-1', rs1)) ok('RS-1', `${MONG_1.size} đề xuất đúng tập viết sẵn trên ma trận 6 × 8 (+ mốc ngày sai không kích hoạt)`);
if (want('RS-1-do')) await chayDo('RS-1-do', rs1, [['scripts/lo-trinh.mjs', "const MOC_CHIEN_DICH = m => chuoi(m.loai) === 'phat-hanh';", "const MOC_CHIEN_DICH = m => ['phat-hanh', 'ngoai'].includes(chuoi(m.loai));"]], 'hàng mốc ngoài nhận đề xuất: RS1-ngoai-qua-chua-ho-so', 'bản sao coi mốc ngoai là mốc chiến dịch');
if (want('RS-1-do2')) await chayDo('RS-1-do2', rs1, [['scripts/lo-trinh.mjs', '      if (d.coHoSo) continue;\n', '']], 'hàng có hồ sơ đang mở nhận đề xuất: RS1-ph-qua-dang-mo', 'bản sao bỏ điều kiện hồ sơ đang mở');

// ═══ RS-2 (AC-2): chính sách tuổi + trần ═════════════════════════════════════════════════════════════════════════
// `tuKhai`: thêm ba hàng chưa hồ sơ tự khai đã bác / đang làm / ngoài phạm vi, tuổi 100 (Cổng Bằng chứng 15/10, Ngoài-4/13).
const TU_KHAI_2 = [['TKB', 'Đã bác từ khám phá'], ['TKD', 'Đang làm'], ['TKN', 'Ngoài phạm vi đã ký']];
const PB_2 = (cs, tuKhai = false) => {
  const csx = cs === undefined ? {} : { chinh_sach: cs };
  const D = ['D100a', 'D100b', 'D100c'].map(m => H(m, { trang_thai: 'Đã giao' }))
    .concat(tuKhai ? TU_KHAI_2.map(([m, tt]) => H(m, { trang_thai: tt })) : []);
  const v = hang => ({ schema: 1, ten: 'Chính sách', ...csx, moc: [], hang });
  return [
    { ngay: '2026-07-06', data: v([...D]) },
    { ngay: '2026-08-30', data: v([...D, H('K45')]) },
    { ngay: '2026-09-14', data: v([...D, H('K45'), H('K30')]) },
    { ngay: '2026-09-15', data: v([...D, H('K45'), H('K30'), H('K29')]) },
    { ngay: '2026-10-04', data: v([...D, H('K45'), H('K30'), H('K29'), H('K10')]) },
  ];
};
const kho2 = {};
const KHO_2 = (ten, cs, tuKhai = false) => kho2[ten] || (kho2[ten] = kho({ ten: `kho-rs2-${ten}`, phienBan: PB_2(cs, tuKhai) }).r);
const MONG_2 = new Set(['K45|cho-dieu-kien|tuoi', 'K30|cho-dieu-kien|tuoi', 'K29|cho-dieu-kien|tran']);
async function rs2(kit) {
  const sai = []; const rs = rsJson(kit, KHO_2('dung', { tuoi_ngay: 30, tran_ke_tiep: 1 })); const tap = new Set(rsTap(rs));
  const tran = rs[0].de_xuat.find(m => m.luat === 'tran');
  if (tran && tran.can_cu.k !== 4) sai.push(`K = ${tran.can_cu.k}, cần 4`);
  if (tran && tran.can_cu.tran !== 1) sai.push(`trần = ${tran.can_cu.tran}, cần 1`);
  if (!tap.has('K30|cho-dieu-kien|tuoi')) sai.push('hàng tuổi 30 thiếu đề xuất tuoi');
  for (const x of tap) if (!MONG_2.has(x)) sai.push(`đề xuất thừa: ${x}`);
  for (const x of MONG_2) if (!tap.has(x)) sai.push(`thiếu đề xuất: ${x}`);
  return sai;
}
if (want('RS-2') && await chayCa('RS-2', rs2)) ok('RS-2', 'tuổi ≥ 30 ở K30, K45; trần 1 đẩy K29; K = 4, ba hàng đã giao không đếm');
if (want('RS-2-khong-chinh-sach') && await chayCa('RS-2-khong-chinh-sach', async kit => {
  const rs = rsJson(kit, KHO_2('vang', undefined)); const x = rsTap(rs).filter(s => /\|(tuoi|tran)$/.test(s));
  return x.length ? [`không khai chính sách mà có đề xuất: ${x.join(', ')}`] : [];
})) ok('RS-2-khong-chinh-sach', 'không khai chính sách → 0 đề xuất tuổi/trần');
const CAU_SAI = 'chính sách tuoi_ngay phải là số nguyên dương';
if (want('RS-2-sai-kieu') && await chayCa('RS-2-sai-kieu', async kit => {
  const r = KHO_2('sai', { tuoi_ngay: '30', tran_ke_tiep: 1 }); const sai = [];
  const html = await ve(kit, r, HOM_NAY); const M = await nap(kit); const d = M.LT.docDuLieu(html).duLieu;
  const nTrang = coTrang(html).filter(x => x.includes(CAU_SAI)).length; const nKhoi = d.lo_trinh[0].can_sua.filter(c => c.chu === CAU_SAI).length;
  if (nTrang !== 1) sai.push(`mục «Cần sửa» có ${nTrang} câu «${CAU_SAI}», cần 1`);
  if (nKhoi !== 1) sai.push(`can_sua của khối có ${nKhoi} câu, cần 1`);
  const x = rsTap(rsJson(kit, r)).filter(s => /\|(tuoi|tran)$/.test(s)); if (x.length) sai.push(`chính sách sai mà vẫn có đề xuất: ${x.join(', ')}`);
  return sai;
})) ok('RS-2-sai-kieu', 'tuoi_ngay chuỗi → một cờ khuôn trên trang và khối, 0 đề xuất chính sách');
const KE_TIEP = '      if (!trongCD.has(ma) && chuaLam.has(d.chu)) keTiep.push(g);';
if (want('RS-2-do')) await chayDo('RS-2-do', rs2, [['scripts/lo-trinh.mjs', KE_TIEP, '      if (!trongCD.has(ma)) keTiep.push(g);']], 'K = 7, cần 4', 'bản sao đếm cả hàng đã giao vào K');
if (want('RS-2-do2')) await chayDo('RS-2-do2', rs2, [['scripts/lo-trinh.mjs', 'tuoi >= cs.tuoi_ngay', 'tuoi > cs.tuoi_ngay']], 'hàng tuổi 30 thiếu đề xuất tuoi', 'bản sao so tuổi bằng «>»');
// «Kế tiếp» chỉ là việc CHƯA BẮT ĐẦU: hàng tự khai bác / đang làm / ngoài phạm vi không đếm vào K, không nhận đề xuất.
async function rs2tk(kit) {
  const sai = []; const rs = rsJson(kit, KHO_2('tu-khai', { tuoi_ngay: 30, tran_ke_tiep: 1 }, true)); const tap = new Set(rsTap(rs));
  for (const [m] of TU_KHAI_2) { const x = rs[0].de_xuat.filter(d => d.ma === m); if (x.length) sai.push(`hàng tự khai ${m} nhận đề xuất ${x.map(d => d.luat).join(',')}`); }
  const tran = rs[0].de_xuat.find(m => m.luat === 'tran'); if (tran && tran.can_cu.k !== 4) sai.push(`K = ${tran.can_cu.k}, cần 4`);
  for (const x of MONG_2) if (!tap.has(x)) sai.push(`thiếu đề xuất: ${x}`);
  return sai;
}
if (want('RS-2-tu-khai') && await chayCa('RS-2-tu-khai', rs2tk)) ok('RS-2-tu-khai', 'ba hàng tự khai đã bác / đang làm / ngoài phạm vi: K vẫn 4, không đề xuất');
if (want('RS-2-do3')) await chayDo('RS-2-do3', rs2tk, [['scripts/lo-trinh.mjs', KE_TIEP, '      if (!trongCD.has(ma) && !daGiao.has(d.chu)) keTiep.push(g);']], 'hàng tự khai TKB', 'bản sao đếm mọi hàng chưa giao vào K');

// ═══ RS-3 (AC-3): tuổi theo lịch sử, sống qua đánh lại mã ═══════════════════════════════════════════════════════
const PB_3 = () => {
  const N = (hang = []) => ({ ten: 'Mốc người', ngay: '2026-12-01', loai: 'ngoai', ai: 'M', hang });
  const v = (hang, n = []) => ({ schema: 1, ten: 'Lịch sử', chinh_sach: { tuoi_ngay: 1 }, moc: [N(n)], hang });
  const X = H('X'); const Y = H('Y'); const Y2 = H('Y', { vi_sao: 'đã sửa' }); const Z = H('Z'); const Z2 = { ...H('Z'), ma: 'Z2' };
  const W = H('W'); const W2 = { ma: 'W2', cau_giao: '«câu giao mới của W»' };
  return [
    { ngay: '2026-09-01', nhan: 'c1', data: v([X, Y, Z, W]) },
    { ngay: '2026-09-10', nhan: 'c2', data: v([X, Y2, Z, W]) },
    { ngay: '2026-09-20', nhan: 'c3', data: v([X, Y2, Z2, W]) },
    { ngay: '2026-09-25', nhan: 'c4', data: v([X, Y2, Z2, W], ['X']) },
    { ngay: '2026-10-01', nhan: 'c5', data: v([X, Y2, Z2, W]) },
    { ngay: '2026-10-05', nhan: 'c6', data: v([X, Y2, Z2, W2]) },
  ];
};
let kho3 = null;
const KHO_3 = () => kho3 || (kho3 = kho({ ten: 'kho-rs3', phienBan: PB_3() }));
const MONG_3 = { X: [13, 'c5', '2026-10-01'], Y: [34, 'c2', '2026-09-10'], Z2: [43, 'c1', '2026-09-01'], W2: [9, 'c6', '2026-10-05'] };
async function rs3(kit) {
  const { r, sha } = KHO_3(); const sai = []; const ds = rsJson(kit, r)[0].de_xuat;
  for (const [ma, [tuoi, nhan, ngay]] of Object.entries(MONG_3)) {
    const m = ds.find(x => x.ma === ma && x.luat === 'tuoi');
    if (!m) { sai.push(`${ma}: thiếu đề xuất tuoi`); continue; }
    if (m.can_cu.tuoi !== tuoi) sai.push(`${ma}: tuổi ${m.can_cu.tuoi}, cần ${tuoi}`);
    if (!m.can_cu.cham_cuoi || m.can_cu.cham_cuoi.sha !== sha[nhan] || m.can_cu.cham_cuoi.ngay !== ngay) sai.push(`${ma}: lần chạm cuối ${JSON.stringify(m.can_cu.cham_cuoi)}, cần ${nhan} ${ngay}`);
  }
  return sai;
}
if (want('RS-3') && await chayCa('RS-3', rs3)) ok('RS-3', 'X 13/c5 · Y 34/c2 · Z2 43/c1 (đổi mã không chạm) · W2 9/c6 (hàng mới)');
if (want('RS-3-do')) await chayDo('RS-3-do', rs3, [['scripts/lo-trinh.mjs', 'const khopHang = (p, r) => (p.ma === r.ma && p.cau === r.cau) ? 3 : (p.cau === r.cau ? 2 : (p.ma === r.ma ? 1 : 0));', 'const khopHang = (p, r) => (p.ma === r.ma ? 3 : 0);']], 'Z2: tuổi 24, cần 43', 'bản sao theo dấu hàng bằng mã');
if (want('RS-3-cut') && await chayCa('RS-3-cut', async kit => {
  const { r } = KHO_3(); const c = path.join(TMP, 'clone-nong'); execFileSync('git', ['clone', '-q', '--depth', '1', `file://${r}`, c]);
  const t = rsJson(kit, c)[0]; const sai = [];
  if (t.lich_su_cut !== true) sai.push(`clone nông mà không cờ lich_su_cut: ${JSON.stringify(t.lich_su_cut)}`);
  const z = t.de_xuat.find(x => x.ma === 'Z2'); if (!z || z.can_cu.tuoi !== 9) sai.push(`clone nông: Z2 tuổi ${z && z.can_cu.tuoi}, cần 9 (tuổi tối thiểu từ commit duy nhất)`);
  return sai;
})) ok('RS-3-cut', 'clone nông → lich_su_cut và tuổi tối thiểu, không ném');
if (want('RS-3-chua-commit') && await chayCa('RS-3-chua-commit', async kit => {
  const { r } = kho({ ten: 'kho-rs3-cc', chuaCommit: true, data: { schema: 1, ten: 'Mới', chinh_sach: { tuoi_ngay: 1 }, moc: [], hang: [H('M1')] } });
  const x = rsTap(rsJson(kit, r)).filter(s => s.endsWith('|tuoi')); return x.length ? [`tệp chưa từng commit mà có đề xuất tuổi: ${x.join(', ')}`] : [];
})) ok('RS-3-chua-commit', 'tệp lộ trình chưa từng commit → không đề xuất tuổi, không ném');

// ═══ RS-4 (AC-4): thẻ khởi động ═════════════════════════════════════════════════════════════════════════════════
const P8 = Array.from({ length: 8 }, (_, i) => `P${i + 1}`);
let kho4 = null;
const KHO_4 = () => kho4 || (kho4 = kho({ ten: 'kho-rs4', data: { schema: 1, ten: 'Tám', moc: [{ ten: 'Phát hành một', ngay: '2026-09-01', loai: 'phat-hanh', hang: P8 }], hang: P8.map(m => H(m)) } }).r);
const DONG_4 = [
  'Rà soát: 8 đề xuất — 8 dời mốc · 0 chờ điều kiện · 0 bác',
  ...P8.slice(0, 5).map(m => `  · ${m} — dời mốc: mốc «Phát hành một» đã qua ngày 01/09/2026`),
];
const DONG_4_CON = '  … còn 3 — xem: ';
async function rs4(kit) {
  const sai = []; const j = JSON.parse(quet(kit, KHO_4())); const dong = j.loTrinh.dong;
  const i = dong.indexOf(DONG_4[0]);
  if (i < 0) return [`thiếu dòng tổng «${DONG_4[0]}»: ${JSON.stringify(dong)}`];
  if (!deq(dong.slice(i, i + DONG_4.length), DONG_4)) sai.push(`dòng rà soát khác viết sẵn: ${JSON.stringify(dong.slice(i, i + DONG_4.length))}`);
  if (!(dong[i + DONG_4.length] || '').startsWith(DONG_4_CON)) sai.push(`thiếu dòng «${DONG_4_CON}…»: ${JSON.stringify(dong[i + DONG_4.length])}`);
  const ke = dong[i + DONG_4.length + 1] || '';
  if (!(ke.startsWith('Lộ trình có ') || ke.startsWith('Trang lộ trình'))) sai.push(`dòng sau khối rà soát là «${ke}», cần «Lộ trình có …» hoặc «Trang lộ trình …»`);
  if (dong.filter(d => d.startsWith('Rà soát:')).length !== 1) sai.push('dòng tổng không duy nhất');
  if (!deq(j.loTrinh.ds[0].raSoat, rsJson(kit, KHO_4())[0].de_xuat)) sai.push('ds[0].raSoat khác --ra-soat --json');
  return sai;
}
// Lệnh trong dòng «… còn 3 — xem:» chạy NGUYÊN VĂN ở kho thử (không có thư mục scripts/) — Cổng Bằng chứng 15/10, Ngoài-8.
async function rs4lenh(kit) {
  const r = KHO_4(); if (existsSync(path.join(r, 'scripts'))) return ['kho thử có thư mục scripts/ — ca không đo được kho tiêu thụ'];
  const d = JSON.parse(quet(kit, r)).loTrinh.dong.find(x => x.startsWith(DONG_4_CON));
  if (!d) return [`thiếu dòng «${DONG_4_CON}…»`];
  const x = spawnSync('bash', ['-c', d.slice(DONG_4_CON.length)], { cwd: r, encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  const loi1 = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--ra-soat'], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  if (!loi1.stdout.trim() || loi1.status !== 0) return ['đối chứng lõi không chạy'];
  return x.status === 0 && x.stdout === loi1.stdout ? [] : [`lệnh xem không chạy được ở kho tiêu thụ (thoát ${x.status}: ${(x.stderr || '').slice(0, 120)})`];
}
if (want('RS-4-lenh') && await chayCa('RS-4-lenh', rs4lenh)) ok('RS-4-lenh', 'lệnh «xem» rút từ thẻ chạy nguyên văn ở kho không có scripts/ → ra đúng lõi');
if (want('RS-4-lenh-do')) await chayDo('RS-4-lenh-do', rs4lenh, [['scripts/lo-trinh.mjs', "export const LENH_RA_SOAT = `node \"${path.join(__dirname, 'lo-trinh.mjs')}\" --root . --ra-soat`;", "export const LENH_RA_SOAT = 'node scripts/lo-trinh.mjs --root . --ra-soat';"]], 'lệnh xem không chạy được ở kho tiêu thụ', 'bản sao in đường tương đối');
if (want('RS-4') && await chayCa('RS-4', rs4)) ok('RS-4', 'dòng tổng + 5 dòng chi tiết + «còn 3», đặt trước dòng cờ/trang; ds[0].raSoat == --ra-soat --json');
const KHO_4B = () => [
  ['khong-khai', kho({ ten: 'kho-rs4-kk', cfg: null, data: { schema: 1, ten: 'x', moc: [], hang: [H('A')] } }).r],
  ['khong-moc', kho({ ten: 'kho-rs4-km', data: { schema: 1, ten: 'Không mốc', moc: [], hang: [H('A'), H('B')] } }).r],
  ['moc-toi', kho({ ten: 'kho-rs4-mt', data: { schema: 1, ten: 'Mốc tới', moc: [{ ten: 'Tới', ngay: '2026-12-01', loai: 'phat-hanh', hang: ['A'] }], hang: [H('A'), H('B')] } }).r],
];
let kho4b = null;
async function rs4byte(kit) {
  if (!GOC_XANH) return ['RS-0 đỏ — gốc so không tin được, không so byte'];
  const sai = []; const goc = banGoc(); kho4b = kho4b || KHO_4B();
  for (const [ten, r] of kho4b) {
    const a = quet(goc, r); const b = quet(kit, r);
    if (!a.trim()) { sai.push(`đối chứng gốc không chạy: gốc ${ten}`); continue; }
    if (!b.trim()) { sai.push(`đối chứng gốc không chạy: cây ${ten}`); continue; }
    if (chuanKit(a, goc) !== chuanKit(b, kit)) sai.push(`khác bộ máy gốc: ${ten}`);
  }
  return sai;
}
if (want('RS-4-byte') && await chayCa('RS-4-byte', rs4byte, KIT_TAT())) ok('RS-4-byte', 'ba kho 0 đề xuất: stdout thẻ start giống từng byte bộ máy gốc');
if (want('RS-4-do')) await chayDoTat('RS-4-do', rs4byte, [['scripts/lo-trinh.mjs', '  if (!t.raSoat) return [];', "  if (!t.raSoat) return ['Rà soát: 0 đề xuất'];"]], 'khác bộ máy gốc: khong-moc', 'bản sao in «Rà soát: 0 đề xuất» khi rỗng');
if (want('RS-4-hai') && await chayCa('RS-4-hai', async kit => {
  const { r } = kho({ ten: 'kho-rs4-hai', cfg: 'lo_trinh:\n  tep:\n    - docs/a.json\n    - docs/b.json\n' });
  for (const [t, ten, ma] of [['docs/a.json', 'Lộ A', 'A1'], ['docs/b.json', 'Lộ B', 'B1']]) { mkdirSync(path.join(r, 'docs'), { recursive: true }); writeFileSync(path.join(r, t), JSON.stringify({ schema: 1, ten, moc: [{ ten: `Mốc ${ma}`, ngay: '2026-09-01', loai: 'phat-hanh', hang: [ma] }], hang: [H(ma)] }, null, 2) + '\n'); }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'hai');
  const dong = JSON.parse(quet(kit, r)).loTrinh.dong; const ia = dong.indexOf('Lộ trình Lộ A:'); const ib = dong.indexOf('Lộ trình Lộ B:');
  const ra = dong.findIndex(d => d.startsWith('  · A1 — ')); const rb = dong.findIndex(d => d.startsWith('  · B1 — '));
  return ia >= 0 && ib > ia && ra > ia && ra < ib && rb > ib ? [] : [`dòng rà soát không nằm dưới đúng lộ trình: ${JSON.stringify(dong)}`];
})) ok('RS-4-hai', 'hai lộ trình: mỗi khối rà soát nằm dưới đúng tiêu đề lộ trình');

// ═══ RS-5 (AC-5): lệnh --ra-soat — đủ năm luật, chỉ đọc ═════════════════════════════════════════════════════════
let kho5 = null;
const KHO_5 = () => kho5 || (kho5 = (() => {
  const cs = { tuoi_ngay: 60, tran_ke_tiep: 0 };
  const moc = [{ ten: 'Phát hành qua', ngay: '2026-09-01', loai: 'phat-hanh', hang: ['Q1'] }];
  const goc = [H('Q1'), H('XH', { slug: 's-xh' }), H('XT', { trang_thai: 'Xếp lại sau' }), H('BH', { slug: 's-bh' }), H('T1')];
  return kho({ ten: 'kho-rs5', hoSo: { 's-xh': 'xep-lai', 's-bh': 'da-bac' }, phienBan: [
    { ngay: '2026-08-01', data: { schema: 1, ten: 'Năm luật', chinh_sach: cs, moc, hang: goc } },
    { ngay: '2026-10-01', data: { schema: 1, ten: 'Năm luật', chinh_sach: cs, moc, hang: [...goc, H('T2')] } },
  ] }).r;
})());
const HINH_5 = {
  'moc-qua-ngay': c => typeof c.moc === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c.ngay),
  'xep-lai': c => (c.nguon === 'ho-so' && typeof c.ho_so === 'string') || (c.nguon === 'tu-khai' && typeof c.chu === 'string'),
  'ho-so-bac': c => typeof c.ho_so === 'string' && typeof c.o === 'string',
  tuoi: c => Number.isInteger(c.tuoi) && c.cham_cuoi && /^\d{4}-\d{2}-\d{2}$/.test(c.cham_cuoi.ngay) && /^[0-9a-f]{40}$/.test(c.cham_cuoi.sha),
  tran: c => Number.isInteger(c.k) && Number.isInteger(c.tran),
};
async function rs5(kit) {
  const r = KHO_5(); const sai = []; const p = path.join(r, TEP); const mt = statSync(p).mtimeMs;
  const ds = rsJson(kit, r)[0].de_xuat;
  const chu = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--ra-soat'], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  if (chu.status !== 0) sai.push(`--ra-soat chữ thoát ${chu.status}`);
  const luat = new Set(ds.map(m => m.luat)); for (const l of Object.keys(HINH_5)) if (!luat.has(l)) sai.push(`thiếu luật ${l}`);
  for (const m of ds) {
    for (const k of ['ma', 'cau_giao', 'de_xuat', 'luat', 'can_cu']) if (!(k in m)) sai.push(`${m.ma}: thiếu khoá ${k}`);
    if (HINH_5[m.luat] && !HINH_5[m.luat](m.can_cu)) sai.push(`${m.ma}: căn cứ sai hình cho ${m.luat}: ${JSON.stringify(m.can_cu)}`);
  }
  const dongChu = chu.stdout.split('\n').filter(Boolean);
  if (dongChu.length !== ds.length) sai.push(`bản chữ ${dongChu.length} dòng, JSON ${ds.length} mục`);
  const the = JSON.parse(quet(kit, r)).loTrinh.dong.filter(d => d.startsWith('  · '));
  the.forEach((d, i) => { if (dongChu[i] !== d) sai.push(`dòng chữ ${i} khác thẻ: «${dongChu[i]}» / «${d}»`); });
  const ban = git(r, 'status', '--porcelain'); if (ban) sai.push(`lệnh rà soát ghi tệp: ${ban.split('\n').map(l => l.slice(3)).join(', ')}`);
  if (statSync(p).mtimeMs !== mt) sai.push('mtime tệp lộ trình đổi');
  return sai;
}
if (want('RS-5') && await chayCa('RS-5', rs5)) ok('RS-5', 'đủ năm luật, căn cứ đúng hình, chữ = thẻ, không ghi tệp');
if (want('RS-5-loi') && await chayCa('RS-5-loi', async kit => {
  const sai = []; const L = path.join(kit, 'scripts', 'lo-trinh.mjs'); const env = { ...process.env, ACCEPTANCE_TODAY: HOM_NAY };
  const kk = kho({ ten: 'kho-rs5-kk', cfg: null, data: { schema: 1, moc: [], hang: [] } }).r;
  const a = node([L, '--root', kk, '--ra-soat'], { env }); if (a.status !== 1 || !a.stderr.includes('lo_trinh.tep')) sai.push(`kho không khai: thoát ${a.status} «${a.stderr.trim()}»`);
  const b = node([L, '--root', KHO_5(), '--ra-soat', '--hang', 'Q1'], { env }); if (b.status !== 2) sai.push(`--ra-soat --hang: thoát ${b.status}`);
  const c = node([L, '--root', KHO_5(), '--ra-soat'], { env: { ...env, ACCEPTANCE_TODAY: '14-10-2026' } }); if (c.status !== 2 || !c.stderr.includes('ACCEPTANCE_TODAY')) sai.push(`ACCEPTANCE_TODAY sai dạng: thoát ${c.status}`);
  return sai;
})) ok('RS-5-loi', 'kho không khai → 1; đi cùng --hang → 2; ACCEPTANCE_TODAY sai dạng → 2');
if (want('RS-5-do')) await chayDo('RS-5-do', rs5, [['scripts/lo-trinh.mjs', "  if (raSoatCo) {\n", "  if (raSoatCo) {\n    writeFileSync(path.join(root, '.ra-soat-tam'), '');\n"]], 'lệnh rà soát ghi tệp: .ra-soat-tam', 'bản sao ghi tệp trong lúc rà soát');

// ═══ RS-6 (AC-6): trang tất định ════════════════════════════════════════════════════════════════════════════════
const GM_BO = await import(pathToFileURL(path.join(HERE, 'lo-trinh-gio-may-bo.mjs')).href);
async function rs6(kit) {
  if (!GOC_XANH) return ['RS-0 đỏ — gốc so không tin được, không so byte'];
  const sai = []; const goc = banGoc();
  for (const [ten, r, ma] of [['rs1', KHO_1(), 'RS1-ph-qua-chua-ho-so'], ['rs2', KHO_2('dung', { tuoi_ngay: 30, tran_ke_tiep: 1 }), 'K45']]) {
    const a = await ve(kit, r, HOM_NAY); const b = await ve(kit, r, '2026-12-31'); const g = await ve(goc, r, HOM_NAY);
    for (const [ben, h] of [['cây', a], ['gốc', g]]) if (!h || !h.includes(ma)) sai.push(`đối chứng: trang ${ben} ${ten} rỗng hoặc thiếu ${ma}`);
    if (a !== b) sai.push(`trang đổi theo ngày: ${ten}`);
    // Giờ máy (hồ sơ lo-trinh-gio-may) hiện mặc định ở mọi kho: so phần còn lại sau khi bỏ ĐÚNG phần giờ máy; đối chứng là
    // trang cây có cột giờ máy.
    if (!GM_BO.coGioMayTrang(a)) sai.push(`đối chứng: trang cây ${ten} thiếu cột giờ máy`);
    if (GM_BO.boGioMayTrang(a) !== g) sai.push(`trang khác bộ máy gốc: ${ten}`);
  }
  return sai;
}
if (want('RS-6') && await chayCa('RS-6', rs6, KIT_TAT())) ok('RS-6', 'trang hai kho: không đổi theo ngày, giống từng byte bộ máy gốc');
if (want('RS-6-do')) await chayDoTat('RS-6-do', rs6, [['scripts/lo-trinh.mjs', 'export function veHtml(cacTep, sections = null, tinHieu = null) {', "export function veHtml(cacTep, sections = null, tinHieu = null) { return veHtmlGoc(cacTep, sections, tinHieu) + '<p>Rà soát</p>'; }\nfunction veHtmlGoc(cacTep, sections = null, tinHieu = null) {"]], 'trang khác bộ máy gốc: rs1', 'bản sao đưa rà soát vào trang');
if (want('RS-6-check') && await chayCa('RS-6-check', async kit => {
  const c = path.join(TMP, 'clone-rs6'); execFileSync('git', ['clone', '-q', KHO_1(), c]);
  const PMm = path.join(kit, 'scripts', 'product-map.mjs'); const env = { ...process.env, ACCEPTANCE_TODAY: HOM_NAY };
  node([PMm, '--root', c], { env }); const x = node([PMm, '--root', c, '--check'], { env: { ...env, ACCEPTANCE_TODAY: '2026-12-31' } });
  return x.status === 0 ? [] : [`--check thoát ${x.status} khi ngày đổi: ${x.stdout.slice(0, 160)}`];
})) ok('RS-6-check', 'vẽ hôm nay rồi --check ngày khác → thoát 0');

// ═══ RS-7 (AC-7): cắt lượt — việc mới gắn mốc đang chạy ════════════════════════════════════════════════════════
let kho7 = null;
const KHO_7 = () => kho7 || (kho7 = (() => {
  const hang = [H('A0', { dot: 'd1' }), H('C0', { dot: 'd1' }), H('N0', { dot: 'd1' }),
    H('A2', { dot: 'd2', phu: ['m-a'] }), H('B2', { dot: 'd2', phu: ['m-b'] }), H('C2', { dot: 'd2', phu: ['m-c'] }), H('N2', { dot: 'd2', phu: ['m-n'] })];
  const moc = [
    { ten: 'Mốc A', ngay: '2026-12-01', loai: 'phat-hanh', hang: ['A0', 'A2'] },
    { ten: 'Mốc B', ngay: '2026-12-01', loai: 'phat-hanh', hang: ['B2'] },
    { ten: 'Mốc C', ngay: '2026-09-01', loai: 'phat-hanh', hang: ['C0', 'C2'] },
    { ten: 'Mốc N', ngay: '2026-12-01', loai: 'ngoai', ai: 'M', hang: ['N0', 'N2'] },
  ];
  const { r } = kho({ ten: 'kho-rs7', data: { schema: 1, ten: 'Cắt', moc, hang } });
  writeFileSync(path.join(r, 'docs', 'pham-vi-d2.md'), '---\ndot: d2\ndang: chuoi\nnguon: thu\n---\n\n- `m-a` — một\n- `m-b` — hai\n- `m-c` — ba\n- `m-n` — bốn\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'pham vi'); return r;
})());
const catLuot = (kit, r, args) => node([path.join(kit, 'scripts', 'cat-luot.mjs'), '--root', r, ...args], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
async function rs7(kit) {
  if (!GOC_XANH) return ['RS-0 đỏ — gốc so không tin được, không so mã thoát'];
  const r = KHO_7(); const sai = []; const goc = banGoc(); const a = ['--pham-vi', 'docs/pham-vi-d2.md', '--lo-trinh', TEP];
  const phu = catLuot(kit, r, a); const co = catLuot(kit, r, ['--co']);
  const gPhu = catLuot(goc, r, a); const gCo = catLuot(goc, r, ['--co']);
  if (gPhu.status == null || !gPhu.stdout.includes('bảng phủ')) sai.push('đối chứng: răng phủ của bộ máy gốc không chạy');
  const dong = [...phu.stdout.split('\n'), ...co.stdout.split('\n')].filter(l => l.includes('[gan-moc-dang-chay]'));
  if (dong.length !== 1) sai.push(`${dong.length} dòng [gan-moc-dang-chay], cần 1: ${JSON.stringify(dong)}`);
  else if (!(dong[0].includes('A2') && dong[0].includes('Mốc A'))) sai.push(`dòng cờ không nêu A2 và Mốc A: ${dong[0]}`);
  for (const ma of ['B2', 'C2', 'N2']) if (dong.some(l => l.includes(`hàng ${ma} `))) sai.push(`hàng gắn mốc mới bị cờ: ${ma}`);
  if (phu.status !== gPhu.status) sai.push(`răng phủ thoát ${phu.status}, gốc ${gPhu.status}`);
  if (co.status !== gCo.status) sai.push(`--co thoát ${co.status}, gốc ${gCo.status}`);
  return sai;
}
if (want('RS-7') && await chayCa('RS-7', rs7)) ok('RS-7', 'đúng một cờ gan-moc-dang-chay ở A2/Mốc A; B (mốc mới), C (đã qua), N (mốc người) im; mã thoát bằng gốc');
if (want('RS-7-do')) await chayDo('RS-7-do', rs7, [['scripts/cat-luot.mjs', ' || !ds.some(x => dotCua.get(x) !== pv.dot)', '']], 'hàng gắn mốc mới bị cờ: B2', 'bản sao bỏ điều kiện mốc đã có hàng ngoài đợt');

// ═══ RS-8 (AC-8): chữ «chờ điều kiện» ══════════════════════════════════════════════════════════════════════════
const CU = 'chân trời'; const MOI = 'chờ điều kiện';
const TEP_8 = ['scripts/cat-luot.mjs', 'scripts/lo-trinh.mjs', 'scripts/tin-hieu.mjs', 'skills/cat-luot/SKILL.md', 'skills/gom-tin-hieu/SKILL.md',
  'skills/acceptance/references/pham-vi-template.md', 'skills/acceptance/references/tin-hieu-template.md', 'skills/acceptance/references/lo-trinh-du-lieu.md'];
async function rs8(kit) {
  const sai = []; const L = 'docs/lo-trinh.json';
  const { r } = kho({ ten: `kho-rs8-${++khoN}`, data: { schema: 1, ten: 'Chữ', moc: [], hang: [H('A', { dot: 'd9', phu: ['x-1'] })], chan_troi: [{ ma: 'CT1', dot: 'd9', cau_giao: '«sau»', phu: ['x-2'] }] } });
  writeFileSync(path.join(r, 'docs', 'pv.md'), '---\ndot: d9\ndang: chuoi\nnguon: thu\n---\n\n- `x-1` — một\n- `x-2` — hai\n- `x-3` — ba\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'pv');
  const x = catLuot(kit, r, ['--pham-vi', 'docs/pv.md', '--lo-trinh', L]);
  const cau = x.stdout.split('\n').filter(l => l.startsWith('lỗi:') && /ly_do|x-3/.test(l));
  if (cau.length < 2) sai.push(`không phát đủ hai câu (thiếu ly_do · mã không ở đâu): ${JSON.stringify(x.stdout.slice(0, 300))}`);
  for (const c of cau) { if (c.includes(CU)) sai.push(`câu còn chữ cũ: ${c}`); if (!c.includes(MOI)) sai.push(`câu thiếu «${MOI}»: ${c}`); }
  const M = await nap(kit); const k = M.LT.kiemKhuon({ schema: 1, moc: [], hang: [], chan_troi: 'x' });
  const dich = k.co.map(c => M.LT.dichCo(c).chu).filter(c => /chan_troi|điều kiện|chân trời/.test(c));
  if (!dich.length) sai.push('khuôn chan_troi sai không phát câu cờ nào');
  for (const c of dich) { if (c.includes(CU)) sai.push(`câu còn chữ cũ: ${c}`); if (!c.includes(MOI)) sai.push(`câu thiếu «${MOI}»: ${c}`); }
  return sai;
}
if (want('RS-8') && await chayCa('RS-8', rs8)) ok('RS-8', 'răng phủ + bộ đọc khuôn nói «chờ điều kiện», không còn «chân trời»');
// Khối TIN-HIEU-CAU-CAM là DANH SÁCH TỪ CẤM trong câu gửi người dùng — giữ «chân trời» ở đó là cấm tên cũ lọt ra ngoài,
// không phải một lần dùng chữ; phép quét bỏ khối này.
const boKhoiCam = txt => txt.replace(/<!-- <<<TIN-HIEU-CAU-CAM -->[\s\S]*?<!-- TIN-HIEU-CAU-CAM>>> -->/g, '');
const quetChu = goc => TEP_8.concat(['CONTEXT.md']).flatMap(t => {
  const p = path.join(goc, t); if (!existsSync(p)) return [];
  return boKhoiCam(readFileSync(p, 'utf8')).split('\n').map((l, i) => [t, i + 1, l])
    .filter(([, , l]) => !/^\s*(\/\/|#|\*)/.test(l) && l.toLowerCase().includes(CU) && !/_?[Aa]void_?/.test(l));
});
if (want('RS-8-quet') && await chayCa('RS-8-quet', async kit => {
  const sai = []; const goc = banGoc(); const gocCtx = path.join(TMP, 'goc-ctx'); mkdirSync(gocCtx, { recursive: true });
  writeFileSync(path.join(gocCtx, 'CONTEXT.md'), execFileSync('git', ['-C', KIT, 'show', `${GOC}:CONTEXT.md`], { encoding: 'utf8', maxBuffer: 1 << 26 }));
  for (const t of TEP_8) { const s = path.join(goc, t); if (existsSync(s)) { mkdirSync(path.dirname(path.join(gocCtx, t)), { recursive: true }); cpSync(s, path.join(gocCtx, t)); } }
  const truoc = quetChu(gocCtx); if (!truoc.length) sai.push('đối chứng: bộ máy gốc quét ra 0 chữ cũ — phép quét không chạy');
  const sau = quetChu(kit); for (const [t, n, l] of sau) sai.push(`${t}:${n} còn «${CU}»: ${l.trim().slice(0, 100)}`);
  return sai;
})) ok('RS-8-quet', 'quét chữ: gốc > 0, cây = 0 ngoài khoá và chú thích');
if (want('RS-8-do')) await chayDo('RS-8-do', rs8, [['scripts/cat-luot.mjs', '`chờ điều kiện ${chuoi(c.ma) || \'?\'}: thiếu ly_do`', '`chân trời ${chuoi(c.ma) || \'?\'}: thiếu ly_do`']], `câu còn chữ cũ: lỗi: ${CU}`, 'bản sao trả một thông báo về chữ cũ');

// ═══ RS-10 (AC-10): gói road-map ═══════════════════════════════════════════════════════════════════════════════
async function rs10(kit) {
  const sai = []; const doc = p => JSON.parse(readFileSync(path.join(kit, p), 'utf8'));
  const mk = doc('.claude-plugin/marketplace.json'); const m = (mk.plugins || []).find(p => p.name === 'road-map');
  if (!m) return ['marketplace không có gói road-map'];
  if (m.source !== './road-map') sai.push(`source ${m.source}, cần ./road-map`);
  if (!(m.tags || []).includes('bat-theo-lua-chon')) sai.push('thiếu tag bat-theo-lua-chon');
  const v = p => doc(p).version; const rm = v('road-map/.claude-plugin/plugin.json');
  for (const p of ['.claude-plugin/plugin.json', 'feature-loop/.claude-plugin/plugin.json', 'dieu-phoi/.claude-plugin/plugin.json']) if (v(p) !== rm) sai.push(`road-map ${rm} ≠ ${p} ${v(p)}`);
  const xem = readFileSync(path.join(kit, 'road-map', 'commands', 'xem.md'), 'utf8');
  if (/disable-model-invocation/.test(xem.split('\n---')[0])) sai.push('lệnh xem (chỉ đọc) bị khoá model-invocation');
  const khoi = xem.match(/<!-- <<<RM-XEM-LENH -->\s*```\s*\n([^\n]+)\n```\s*<!-- RM-XEM-LENH>>> -->/);
  if (!khoi) return [...sai, 'xem.md thiếu khối RM-XEM-LENH'];
  const lenh = khoi[1].replace(/"\$AG/g, `"${kit}`);
  const x = spawnSync('bash', ['-c', lenh], { cwd: KHO_5(), encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  const loi1 = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', KHO_5(), '--ra-soat'], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  // Con trỏ thay thế (hồ sơ ap-chinh-sach-lo-trinh): lệnh xem thành bản đồ — lời hứa «xem in đúng rà soát của lõi» đọc là
  // mọi dòng của `--ra-soat` có mặt trong đầu ra lệnh xem, đúng thứ tự.
  const dong = t => t.split('\n').filter(Boolean); const can = dong(loi1.stdout); let k = 0; for (const l of dong(x.stdout)) if (l === can[k]) k += 1;
  if (x.status !== 0 || !can.length || k !== can.length) sai.push(`dòng lệnh của xem.md ra khác lệnh lõi (thoát ${x.status})`);
  return sai;
}
if (want('RS-10') && await chayCa('RS-10', rs10)) ok('RS-10', 'gói road-map trong marketplace, cùng số, lệnh xem không khoá, dòng lệnh rút từ tệp chạy ra đúng lõi');
if (want('RS-10-do')) await chayDo('RS-10-do', rs10, [['.claude-plugin/marketplace.json', '"name": "road-map"', '"name": "road-map-bo"']], 'marketplace không có gói road-map', 'bản sao marketplace bỏ gói road-map');

// ═══ RS-11 (AC-11): rà soát không bao giờ im khi không đọc được (Cổng Bằng chứng 15/10) ═══════════════════════════
const CANH_TUOI = 'không đọc được tuổi hàng — luật tuổi không chạy';
const CANH_CUT = 'lịch sử cụt — tuổi hàng là tuổi tối thiểu';
const LOI_TEP = 'lo-trinh: không đọc được tệp ý định — ';
const rsRaw = (kit, r, json) => node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--ra-soat', ...(json ? ['--json'] : [])], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
const motDong = (ds, cau) => ds.filter(d => d.includes(cau)).length;
let kho11h = null;
const KHO_11H = () => kho11h || (kho11h = (() => {
  const { r } = kho({ ten: 'kho-rs11-hong', cfg: 'lo_trinh:\n  tep:\n    - docs/a.json\n    - docs/b.json\n' });
  mkdirSync(path.join(r, 'docs'), { recursive: true });
  writeFileSync(path.join(r, 'docs/a.json'), JSON.stringify({ schema: 1, ten: 'Lành', moc: [{ ten: 'Mốc A', ngay: '2026-09-01', loai: 'phat-hanh', hang: ['A1'] }], hang: [H('A1')] }, null, 2) + '\n');
  writeFileSync(path.join(r, 'docs/b.json'), '{bad\n'); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'hai tệp'); return r;
})());
async function rs11hong(kit) {
  const r = KHO_11H(); const sai = [];
  const c = rsRaw(kit, r, false); const dl = c.stderr.split('\n').filter(l => l.startsWith(LOI_TEP));
  if (c.status === 0 || dl.length !== 1 || !dl[0].includes('docs/b.json')) sai.push(`tệp hỏng mà lệnh im: docs/b.json (thoát ${c.status}, ${dl.length} dòng lỗi)`);
  if (!c.stdout.includes('  · A1 — dời mốc')) sai.push('tệp lành không còn in đề xuất khi tệp kia hỏng');
  const j = rsRaw(kit, r, true); let ds = null; try { ds = JSON.parse(j.stdout); } catch { sai.push(`JSON không đọc được: ${j.stdout.slice(0, 80)}`); }
  const b = ds && ds.find(x => x.tep === 'docs/b.json');
  if (j.status === 0 || !b || typeof b.loi !== 'string' || !b.loi || (b.de_xuat || []).length) sai.push(`JSON: tệp hỏng mà lệnh im: docs/b.json (thoát ${j.status}, phần tử ${JSON.stringify(b)})`);
  return sai;
}
if (want('RS-11-hong') && await chayCa('RS-11-hong', rs11hong)) ok('RS-11-hong', 'tệp hỏng → một dòng lỗi có tên tệp, thoát 1; tệp lành vẫn in; JSON mang loi');
if (want('RS-11-do')) await chayDo('RS-11-do', rs11hong, [['scripts/lo-trinh.mjs', 'process.exit(rs.some(t => t.loi) ? 1 : 0);', 'process.exit(0);']], 'tệp hỏng mà lệnh im: docs/b.json', 'bản sao trả tệp hỏng về im');
// Lộ trình trong thư mục con: cùng nội dung, đặt ở gốc kho (đối chứng dương) và ở `sub/` — tuổi phải bằng nhau.
const DATA_11 = { schema: 1, ten: 'Tuổi', chinh_sach: { tuoi_ngay: 30 }, moc: [], hang: [H('C1')] };
const CFG_11 = `schema_version: 1\nlo_trinh:\n  tep: ${TEP}\n`;
const dungCon = (r, con) => {
  const g = path.join(r, con); mkdirSync(path.join(g, '_acceptance'), { recursive: true }); mkdirSync(path.join(g, 'docs'), { recursive: true });
  writeFileSync(path.join(g, '_acceptance', 'config.yaml'), CFG_11); writeFileSync(path.join(g, TEP), JSON.stringify(DATA_11, null, 2) + '\n');
};
// Hai kho RIÊNG: gốc kho có tệp ở gốc, kho con CHỈ có tệp trong `sub/` — đọc nhầm đường từ gốc kho không thể trúng tệp.
const KHO_11C = {};
const kho11 = con => KHO_11C[con] || (KHO_11C[con] = (() => {
  const r = path.join(TMP, `kho-rs11-${con === '.' ? 'goc' : 'con'}`); mkdirSync(r, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  dungCon(r, con);
  const env = { ...process.env, GIT_AUTHOR_DATE: '2026-09-01T12:00:00Z', GIT_COMMITTER_DATE: '2026-09-01T12:00:00Z' };
  execFileSync('git', ['-C', r, 'add', '-A'], { env }); execFileSync('git', ['-C', r, 'commit', '-qm', 'c1'], { env }); return path.join(r, con);
})());
async function rs11con(kit) {
  const tuoi = g => (rsJson(kit, g)[0].de_xuat.find(m => m.ma === 'C1' && m.luat === 'tuoi') || {}).can_cu;
  const goc = tuoi(kho11('.')); if (!goc || goc.tuoi !== 43) return [`đối chứng gốc kho chưa xanh: ${JSON.stringify(goc)}`];
  const con = tuoi(kho11('sub'));
  return con && con.tuoi === 43 ? [] : [`thư mục con: thiếu đề xuất tuoi C1 (${JSON.stringify(con)})`];
}
if (want('RS-11-con') && await chayCa('RS-11-con', rs11con)) ok('RS-11-con', 'lộ trình trong thư mục con: tuổi 43 bằng ở gốc kho');
if (want('RS-11-do2')) await chayDo('RS-11-do2', rs11con, [['scripts/lo-trinh.mjs', 'g(\'show\', `${sha}:./${tep}`)', 'g(\'show\', `${sha}:${tep}`)']], 'thư mục con: thiếu đề xuất tuoi C1', 'bản sao đọc phiên bản cũ bằng <sha>:<tệp>');
// Không phải kho git / clone nông: cảnh báo đúng một dòng ở JSON, lệnh chữ và thẻ start.
const baMat = (kit, r, cau) => {
  const sai = []; const j = rsJson(kit, r)[0];
  if (!(j.canh_bao || []).some(c => c.includes(cau))) sai.push(`JSON thiếu canh_bao «${cau}»: ${JSON.stringify(j.canh_bao)}`);
  const c = rsRaw(kit, r, false); if (c.status !== 0) sai.push(`lệnh chữ thoát ${c.status}`);
  if (motDong(c.stdout.split('\n'), cau) !== 1) sai.push(`lệnh chữ có ${motDong(c.stdout.split('\n'), cau)} dòng «${cau}», cần 1`);
  const d = JSON.parse(quet(kit, r)).loTrinh.dong; if (motDong(d, cau) !== 1) sai.push(`thẻ start có ${motDong(d, cau)} dòng «${cau}», cần 1`);
  return sai;
};
if (want('RS-11-khong-git') && await chayCa('RS-11-khong-git', async kit => {
  const r = path.join(TMP, 'kho-rs11-kg'); if (!existsSync(r)) { mkdirSync(r, { recursive: true }); dungCon(r, '.'); }
  return baMat(kit, r, CANH_TUOI);
})) ok('RS-11-khong-git', `không phải kho git → «${CANH_TUOI}» đúng một dòng ở JSON, lệnh chữ, thẻ start`);
async function rs11cut(kit) {
  const c = path.join(TMP, 'clone-nong-11'); if (!existsSync(c)) execFileSync('git', ['clone', '-q', '--depth', '1', `file://${KHO_3().r}`, c]);
  const sai = rsJson(kit, c)[0].lich_su_cut === true ? [] : ['clone nông mà không lich_su_cut'];
  const m = baMat(kit, c, CANH_CUT); return m.length ? [...sai, 'lịch sử cụt mà không cảnh báo', ...m] : sai;
}
if (want('RS-11-cut') && await chayCa('RS-11-cut', rs11cut)) ok('RS-11-cut', `clone nông → «${CANH_CUT}» đúng một dòng ở JSON, lệnh chữ, thẻ start`);
if (want('RS-11-do3')) await chayDo('RS-11-do3', rs11cut, [['scripts/lo-trinh.mjs', '    if (cut) canh.push(CANH_CUT);\n', '']], 'lịch sử cụt mà không cảnh báo', 'bản sao bỏ cảnh báo lịch sử cụt');

console.log(`\nResults: ${pass} passed, ${fail} failed (ra-soat-lo-trinh)`);
process.exit(fail ? 1 : 0);
