// pre-merge-doc-lib-theo-kit.test.mjs — hồ sơ pre-merge-doc-lib-theo-kit (vòng vá 2.36.1,
// gốc onehub-quy-hang/_acceptance/bao-ro-ngay-ban-sai/).
// Tên ca = «LK<k> <tên>»; chiều đỏ «LK<k>-do <tên>». Ca đỏ chạy CHÍNH lưới trước gộp trên bản gốc thật (main
// c8870a49, dựng trọn thư mục bằng git archive) hoặc trên bản sao bị tiêm ở khối marker KIT-LIB-THEO-CHO-CAI —
// SAU khi bản chưa tiêm xanh trên cùng fixture — và ghim thông điệp.
//   LK1  kho không có lib/ (cài kit theo đường plugin) — hồ sơ machine-cleared hợp lệ qua lưới, ba cách gọi
//   LK2  kho có lib/ chép (lớp CI) — qua lưới như bản gốc, cả khi gọi bản chép trong kho
//   LK3  kho có lib/ chép hỏng hoặc chép một phần — lưới đọc thư viện cạnh script
//   LK4  script không có thư viện cạnh nó — lùi về lib/ của gốc kho, BẰNG bản gốc
//   LK5  quét lớp trên các tệp shell của kit — ma trận hình dạng viết trước
// Fixture do CODE SINH trong lượt: hợp đồng rút CONTRACT-FRONTMATTER-TEMPLATE; đường dẫn suy từ vị trí tệp.
// Chọn ca: đối số dòng lệnh (`node pre-merge-doc-lib-theo-kit.test.mjs LK1 LK3`) hoặc LK_CASES=a,b.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'lk-'));
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const CHON = [...process.argv.slice(2), ...(process.env.LK_CASES ? process.env.LK_CASES.split(',') : [])];
const want = name => !CHON.length || CHON.includes(name) || CHON.includes(name.split(' ')[0]);
const ca = async (name, fn) => { if (!want(name)) return; try { const r = await fn(); if (r && r.loi) bad(name, r.loi); else ok(name, r && r.msg ? r.msg : ''); } catch (e) { bad(name, loi(e)); } };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 }).trim();

// Hai thông điệp fail-closed của lưới — ghim nguyên văn, mỗi dòng đọc thư viện một thông điệp.
const MSG_KL = 'không đọc được mục «Known limits» (fail-closed)';
const MSG_OOC = 'không đọc được review-findings.md × sổ quyết định (fail-closed)';
// Bản gốc thật: main ngay trước vòng (lỗi có từ 2f8de63a). CI của kit checkout fetch-depth: 0.
const GOC_SHA = 'c8870a49';

// ── Kho thử: một hồ sơ machine-cleared xanh-sạch (khuôn khoLanV của hskt / dinh-tuyen-theo-ma-muc) ──────
const { fileFromTemplate } = await import(pathToFileURL(path.join(KIT, 'tests', 'fixtures', 'from-template.mjs')).href);
const CONTRACT_TPL = path.join(KIT, 'skills', 'acceptance', 'references', 'contract-template.md');
const hopDong = slug => fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier: 'T2', surfaces: 'cli', status: 'machine-cleared' },
  `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n\n## Notes\n`)
  .replace(/^approved_at:.*$/m, m => [m, 'veto_state: mo', 'veto_opened_at: 2026-10-31T09:00:00Z'].join('\n'));
const baoCao = (slug, vc) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${vc}\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff: \n---\n\n# Evidence Report: ${slug}\n\n## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-10-31\n\n## Known limits\n\n## Ngoài hợp đồng\n\n`;
// lib: 'khong' (cài theo plugin) · 'chep' (lớp CI chép trọn lib/ + scripts/) · 'hong' (bản chép hai tệp ném lỗi
// khi nạp) · 'mot-phan' (bản chép có md-section.cjs mà thiếu out-of-contract.cjs).
function kho(slug, lib) {
  const R = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', R]); git(R, 'config', 'user.email', 'x@y.z'); git(R, 'config', 'user.name', 'x');
  mkdirSync(path.join(R, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n');
  writeFileSync(path.join(R, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  mkdirSync(path.join(R, 'src'), { recursive: true }); writeFileSync(path.join(R, 'src', 'app.js'), 'v1\n');
  if (lib !== 'khong') cpSync(path.join(KIT, 'lib'), path.join(R, 'lib'), { recursive: true });
  if (lib === 'chep') cpSync(path.join(KIT, 'scripts'), path.join(R, 'scripts'), { recursive: true });
  if (lib === 'hong') for (const f of ['md-section.cjs', 'out-of-contract.cjs']) writeFileSync(path.join(R, 'lib', f), "'use strict';\nthrow new Error('ban chep hong');\n");
  if (lib === 'mot-phan') rmSync(path.join(R, 'lib', 'out-of-contract.cjs'));
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c1'); git(R, 'branch', 'basepoint');
  writeFileSync(path.join(R, 'src', 'app.js'), 'v2\n');
  const d = path.join(R, '_acceptance', slug);
  writeFileSync(path.join(d, 'contract.md'), hopDong(slug));
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c2');
  writeFileSync(path.join(d, 'evidence-report.md'), baoCao(slug, git(R, 'rev-parse', 'HEAD')));
  // review-findings.md có mặt để dòng đọc out-of-contract.cjs thật sự chạy (vắng tệp thì vế ấy im).
  writeFileSync(path.join(d, 'review-findings.md'), '# Review findings\n\n## Ngoài hợp đồng\n\n');
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c3');
  return R;
}
// Ba cách gọi (trục D):
//   'tuyet-doi' — script tuyệt đối, ROOT = đường tuyệt đối của kho, cwd = thư mục khác kho
//   'ci-plugin' — đúng hình dạng CI của kho cài theo plugin: cwd = kho, `bash <kit tuyệt đối>/scripts/… . --base`
//   'tuong-doi' — cwd = thư mục máy, script gọi bằng đường tương đối `scripts/pre-merge-check.sh`, ROOT tuyệt đối
//   'ban-chep'  — đúng hình dạng CI của kho có lớp chép: cwd = kho, `bash scripts/pre-merge-check.sh . --base`
function luoi(R, may = KIT, cach = 'tuyet-doi') {
  const sh = path.join(may, 'scripts', 'pre-merge-check.sh');
  const [argv, cwd] = {
    'tuyet-doi': [[sh, R], TMP],
    'ci-plugin': [[sh, '.'], R],
    'tuong-doi': [['scripts/pre-merge-check.sh', R], may],
    'ban-chep': [['scripts/pre-merge-check.sh', '.'], R],
  }[cach];
  const o = spawnSync('bash', [...argv, '--base', 'basepoint'], { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { status: o.status, out: (o.stdout || '') + (o.stderr || '') };
}
const dongCua = (out, slug) => out.split('\n').filter(l => l.includes(`[${slug}]`));
// Qua lưới = mã 0, dòng OK làn V của hồ sơ, và không dòng VIOLATION nào của nó.
const qua = (o, slug) => o.status === 0 && dongCua(o.out, slug).some(l => l.startsWith(`OK [${slug}]: PASS — làn V`)) && !dongCua(o.out, slug).some(l => l.startsWith('VIOLATION'));
const tomTat = (o, slug) => `thoat ${o.status}: ${dongCua(o.out, slug).slice(0, 3).join(' | ')}`;
// Chặn đúng = mã ≠ 0 và dòng VIOLATION của hồ sơ mang ĐÚNG thông điệp ghim.
const chanDung = (o, slug, msg) => o.status !== 0 && dongCua(o.out, slug).some(l => l.startsWith(`VIOLATION [${slug}]: status machine-cleared`) && l.includes(msg));

const THU_MUC_MAY = ['scripts', 'lib', 'skills', 'commands'];
// Bản sao máy (trọn thư mục — luật «bản base lấy trọn thư mục»): tiêm = [[rel, neo, thay]]; mỗi neo khớp đúng
// một lần, và bản tiêm phải khác bản gốc.
function banSaoMay(tiem = [], boLib = []) {
  const cp = mkdtempSync(path.join(TMP, 'may-'));
  for (const d of THU_MUC_MAY) cpSync(path.join(KIT, d), path.join(cp, d), { recursive: true });
  for (const [rel, neo, thay] of tiem) {
    const p = path.join(cp, rel); const src = readFileSync(p, 'utf8');
    const k = src.split(neo).length - 1;
    if (k !== 1) throw new Error(`neo mutant khop ${k} lan trong ${rel}: «${neo.slice(0, 80)}»`);
    const moi = src.replace(neo, thay);
    if (moi === src) throw new Error(`ban tiem trung ban goc: ${rel}`);
    writeFileSync(p, moi);
  }
  for (const f of boLib) rmSync(path.join(cp, 'lib', f));
  return cp;
}
// Bản gốc thật, trọn thư mục, dựng một lần trong lượt.
let _goc = null;
function banGoc(boLib = []) {
  if (!_goc) {
    try { git(KIT, 'cat-file', '-e', `${GOC_SHA}^{commit}`); } catch { throw new Error(`khong co commit ban goc ${GOC_SHA} trong lich su (checkout nong?)`); }
    _goc = mkdtempSync(path.join(TMP, 'goc-'));
    execFileSync('bash', ['-c', `git -C "$1" archive ${GOC_SHA} ${THU_MUC_MAY.join(' ')} | tar -x -C "$2"`, '_', KIT, _goc]);
    if (!existsSync(path.join(_goc, 'scripts', 'pre-merge-check.sh'))) throw new Error('ban goc thieu scripts/pre-merge-check.sh');
  }
  if (!boLib.length) return _goc;
  const cp = mkdtempSync(path.join(TMP, 'goc-bo-'));
  for (const d of THU_MUC_MAY) cpSync(path.join(_goc, d), path.join(cp, d), { recursive: true });
  for (const f of boLib) rmSync(path.join(cp, 'lib', f));
  return cp;
}
const PM = 'scripts/pre-merge-check.sh';
const KHOI_RE = /# <<<KIT-LIB-THEO-CHO-CAI\n([\s\S]*?)# KIT-LIB-THEO-CHO-CAI>>>/;
const khoi = src => { const m = src.match(KHOI_RE); if (!m) throw new Error('khong rut duoc khoi KIT-LIB-THEO-CHO-CAI tu pre-merge-check.sh'); return m[1]; };
// Khối bộ giải rút LÚC CHẠY ca (không ở đầu tệp): trên cây trước vòng khối chưa có, nên ca đột biến đỏ có tên
// còn LK1 vẫn chạy và đỏ đúng thông điệp — chiều đỏ trong lịch sử đọc được.
const dongGiai = () => {
  const l = khoi(readFileSync(path.join(KIT, PM), 'utf8')).split('\n').find(x => x.startsWith('kit_lib()'));
  if (!l) throw new Error('khoi KIT-LIB-THEO-CHO-CAI khong co dong kit_lib()');
  return l;
};
// Đột biến, neo vào đúng dòng của bộ giải và chỗ gọi:
//   chi-goc-kho — bộ giải luôn trả lib/ của gốc kho
//   dao-thu-tu  — bộ giải hỏi gốc kho trước, thư viện cạnh script sau
//   ooc-goc-kho — riêng chỗ gọi out-of-contract.cjs còn đọc theo gốc kho
const CHI_GOC_KHO = () => [PM, dongGiai(), `kit_lib() { printf '%s' "$ROOT/lib/$1"; }`];
const DAO_THU_TU = () => [PM, dongGiai(), `kit_lib() { if [ -f "$ROOT/lib/$1" ]; then printf '%s' "$ROOT/lib/$1"; else printf '%s' "$HERE/../lib/$1"; fi; }`];
const CHO_GOI_OOC = '"$(kit_lib out-of-contract.cjs)"';
const OOC_GOC_KHO = [PM, CHO_GOI_OOC, '"$ROOT/lib/out-of-contract.cjs"'];

const KHO = { khong: kho('lk1', 'khong'), chep: kho('lk2', 'chep'), hong: kho('lk3', 'hong'), motPhan: kho('lk3m', 'mot-phan') };
const CACH_LK1 = ['tuyet-doi', 'ci-plugin', 'tuong-doi'];

await ca('LK1 kho-khong-lib', () => {
  const sai = CACH_LK1.map(c => [c, luoi(KHO.khong, KIT, c)]).filter(([, o]) => !qua(o, 'lk1')).map(([c, o]) => `${c}: ${tomTat(o, 'lk1')}`);
  return sai.length ? { loi: sai.join(' ; ') } : { msg: `— kho không có lib/: hồ sơ machine-cleared qua lưới ở ${CACH_LK1.length}/${CACH_LK1.length} cách gọi (${CACH_LK1.join(', ')})` };
});
await ca('LK1-do ban-goc', () => {
  const goc = banGoc();
  const sai = CACH_LK1.map(c => [c, luoi(KHO.khong, goc, c)]).filter(([, o]) => !chanDung(o, 'lk1', MSG_KL)).map(([c, o]) => `${c}: ${tomTat(o, 'lk1')}`);
  return sai.length ? { loi: `ban goc ${GOC_SHA} khong chan dung: ${sai.join(' ; ')}` } : { msg: `— bản gốc ${GOC_SHA}: «${MSG_KL}» ở ${CACH_LK1.length}/${CACH_LK1.length} cách gọi` };
});
await ca('LK1-do chi-goc-kho', () => {
  if (!qua(luoi(KHO.khong, banSaoMay()), 'lk1')) return { loi: 'ban sao chua tiem do truoc' };
  const o = luoi(KHO.khong, banSaoMay([CHI_GOC_KHO()]));
  return chanDung(o, 'lk1', MSG_KL) ? { msg: `— bộ giải chỉ trả gốc kho: «${MSG_KL}»` } : { loi: `mutant khong chan dung: ${tomTat(o, 'lk1')}` };
});
await ca('LK1-do ooc-goc-kho', () => {
  if (!qua(luoi(KHO.khong, banSaoMay()), 'lk1')) return { loi: 'ban sao chua tiem do truoc' };
  const o = luoi(KHO.khong, banSaoMay([OOC_GOC_KHO]));
  return chanDung(o, 'lk1', MSG_OOC) && !o.out.includes(MSG_KL) ? { msg: `— riêng dòng mục ngoài hợp đồng theo gốc kho: «${MSG_OOC}»` } : { loi: `mutant khong chan dung: ${tomTat(o, 'lk1')}` };
});
await ca('LK2 kho-co-lib-chep', () => {
  // Kho có lớp chép xanh ở bản sửa VÀ bản gốc thật, khi gọi script của kit; và khi gọi bản chép trong kho
  // (đúng hình dạng CI của kho có lớp chép) thì bản chép đọc thư viện chép của chính nó.
  const sua = luoi(KHO.chep), goc = luoi(KHO.chep, banGoc()), banChep = luoi(KHO.chep, KHO.chep, 'ban-chep');
  const sai = [['ban sua', sua], [`ban goc ${GOC_SHA}`, goc], ['ban chep trong kho', banChep]].filter(([, o]) => !qua(o, 'lk2')).map(([t, o]) => `${t}: ${tomTat(o, 'lk2')}`);
  return sai.length ? { loi: sai.join(' ; ') } : { msg: `— kho có lib/ chép: qua lưới ở bản sửa, bản gốc ${GOC_SHA} và bản chép trong kho` };
});
await ca('LK3 kho-lib-chep-hong', () => {
  const sai = [['hong', KHO.hong, 'lk3'], ['mot-phan', KHO.motPhan, 'lk3m']].map(([t, R, s]) => [t, luoi(R), s]).filter(([, o, s]) => !qua(o, s)).map(([t, o, s]) => `${t}: ${tomTat(o, s)}`);
  return sai.length ? { loi: sai.join(' ; ') } : { msg: '— bản chép hỏng hoặc thiếu ở gốc kho không được đọc: lưới dùng thư viện cạnh script' };
});
await ca('LK3-do dao-thu-tu', () => {
  if (!qua(luoi(KHO.hong, banSaoMay()), 'lk3')) return { loi: 'ban sao chua tiem do truoc' };
  const o = luoi(KHO.hong, banSaoMay([DAO_THU_TU()]));
  return chanDung(o, 'lk3', MSG_KL) ? { msg: `— hỏi gốc kho trước: đọc bản chép hỏng, «${MSG_KL}»` } : { loi: `mutant khong chan dung: ${tomTat(o, 'lk3')}` };
});
await ca('LK4 lui-ve-goc-kho', () => {
  // Bản sửa và bản gốc thật, cùng bỏ đúng hai tệp thư viện cạnh script, chạy trên kho có lib/ chép (kho LK2) và
  // kho không có lib/ (kho LK1): phải BẰNG nhau — cùng mã thoát, cùng tập dòng của hồ sơ.
  const BO = ['md-section.cjs', 'out-of-contract.cjs'];
  const sua = banSaoMay([], BO), goc = banGoc(BO);
  const sai = [];
  for (const [R, s] of [[KHO.chep, 'lk2'], [KHO.khong, 'lk1']]) {
    const a = luoi(R, sua), b = luoi(R, goc);
    const da = dongCua(a.out, s).sort(), db = dongCua(b.out, s).sort();
    if (a.status !== b.status || JSON.stringify(da) !== JSON.stringify(db)) sai.push(`${s}: sua thoat ${a.status} [${da.join(' | ').slice(0, 160)}] ≠ goc thoat ${b.status} [${db.join(' | ').slice(0, 160)}]`);
  }
  if (sai.length) return { loi: sai.join(' ; ') };
  // Đối chứng: hai kết cục phải KHÁC nhau (kho có lib/ qua, kho không lib/ đỏ đúng tên) — nếu không, «bằng
  // nhau» có thể chỉ là hai bản cùng hỏng một kiểu.
  const co = luoi(KHO.chep, sua), khong = luoi(KHO.khong, sua);
  if (!qua(co, 'lk2')) return { loi: `kho co lib/ khong qua khi thieu thu vien canh script: ${tomTat(co, 'lk2')}` };
  if (!chanDung(khong, 'lk1', MSG_KL)) return { loi: `kho khong lib/ khong do dung ten: ${tomTat(khong, 'lk1')}` };
  return { msg: `— thiếu thư viện cạnh script: bản sửa bằng bản gốc ${GOC_SHA} trên hai kho (kho có lib/ qua · kho không lib/ «${MSG_KL}»)` };
});

// ── LK5: quét lớp trên các tệp shell của kit — ma trận hình dạng viết trước ────────────────────────────────
// Lớp: một tệp shell của kit truyền một tệp của kit theo đường gốc kho. Ba mẫu, trên dòng không phải chú thích
// và không phải echo/printf (thông điệp nhắc tên tệp không phải chỗ đọc), ngoài khối bộ giải:
//   (1) chữ trong nháy kép bắt đầu ngay bằng tiền tố gốc kho ($ROOT, ${ROOT…}, ./ hoặc không gì) rồi lib/|scripts/
//   (2) từ không nháy bắt đầu bằng $ROOT / ${ROOT…} rồi lib/|scripts/
//   (3) `node` ở VỊ TRÍ LỆNH (đầu dòng, sau ; & | ( hoặc mở $( ) theo sau là đường tương đối lib/… hoặc scripts/…
//       — chữ «node lib/…» nằm trong một lời báo lỗi không phải chỗ đọc (S3: bản đầu bắt nhầm đúng một dòng như thế)
const MAU_LOP = [
  /"(\$\{?ROOT[^"/]*\}?\/|\.\/)?(lib|scripts)\/[\w.-]+"/,
  /(^|[\s=(])\$\{?ROOT[^\s/"]*\}?\/(lib|scripts)\//,
  /(^|[;&|(]|\$\()\s*node\s+(\.\/)?(lib|scripts)\//,
];
const THU_MUC_SHELL = ['scripts', 'hooks'];
function tepShell(dir) {
  const out = [];
  for (const d of THU_MUC_SHELL) { const p = path.join(dir, d); if (existsSync(p)) for (const f of readdirSync(p)) if (f.endsWith('.sh')) out.push(`${d}/${f}`); }
  return out.sort();
}
function quet(dir) {
  const sai = []; const giai = [];
  for (const rel of tepShell(dir)) {
    const ngoai = readFileSync(path.join(dir, rel), 'utf8').replace(KHOI_RE, '');
    ngoai.split('\n').forEach(l => {
      const t = l.trim();
      if (/^(#|echo\b|printf\b)/.test(t)) return;
      if (MAU_LOP.some(re => re.test(l))) sai.push(`${rel}: ${t.slice(0, 100)}`);
    });
    for (const m of ngoai.matchAll(/\$\(kit_lib ([\w.-]+)\)/g)) giai.push(m[1]);
  }
  return { sai, giai: giai.sort() };
}
const GIAI_KHAI = ['md-section.cjs', 'out-of-contract.cjs'];
// Ma trận hình dạng của lớp, viết trước — mỗi hình dạng tiêm riêng vào một bản sao: sáu hình dạng đối số thay chỗ
// gọi out-of-contract.cjs (mẫu 1 và 2), một hình dạng lệnh chèn ngay sau khối bộ giải (mẫu 3).
// [tên, neo, thay, chuỗi phải có trong dòng quét ra]
const HINH_DANG = [
  ['nhay-root', CHO_GOI_OOC, '"$ROOT/lib/out-of-contract.cjs"'],
  ['khong-nhay', CHO_GOI_OOC, '$ROOT/lib/out-of-contract.cjs'],
  ['ngoac-root', CHO_GOI_OOC, '"${ROOT}/lib/out-of-contract.cjs"'],
  ['mac-dinh', CHO_GOI_OOC, '"${ROOT:-.}/lib/out-of-contract.cjs"'],
  ['tuong-doi', CHO_GOI_OOC, '"lib/out-of-contract.cjs"'],
  ['cham-gach', CHO_GOI_OOC, '"./lib/out-of-contract.cjs"'],
  ['node-lenh', '# KIT-LIB-THEO-CHO-CAI>>>\n', '# KIT-LIB-THEO-CHO-CAI>>>\n_x="$(node lib/out-of-contract.cjs 2>/dev/null)"\n', 'node lib/out-of-contract.cjs'],
];
await ca('LK5 quet-lop', () => {
  const tep = tepShell(KIT);
  if (!tep.includes(PM)) return { loi: `pham vi quet khong co ${PM}: ${tep.join(', ')}` };
  const { sai, giai } = quet(KIT);
  if (sai.length) return { loi: `con cho doc theo goc kho: ${sai.join(' ; ')}` };
  if (JSON.stringify(giai) !== JSON.stringify(GIAI_KHAI)) return { loi: `cho goi bo giai ${JSON.stringify(giai)}, khai truoc ${JSON.stringify(GIAI_KHAI)}` };
  return { msg: `— ${tep.length} tệp shell (${THU_MUC_SHELL.join(', ')}): 0 chỗ đọc thư viện theo gốc kho · ${giai.length}/${GIAI_KHAI.length} chỗ gọi đi qua bộ giải` };
});
await ca('LK5-do hinh-dang', () => {
  const sai = [];
  for (const [ten, neo, thay, dau = thay] of HINH_DANG) {
    const { sai: ra } = quet(banSaoMay([[PM, neo, thay]]));
    if (!(ra.length === 1 && ra[0].startsWith(`${PM}:`) && ra[0].includes(dau))) sai.push(`${ten}: quet ra ${JSON.stringify(ra)}`);
  }
  return sai.length ? { loi: sai.join(' ; ') } : { msg: `— ${HINH_DANG.length}/${HINH_DANG.length} hình dạng (${HINH_DANG.map(h => h[0]).join(', ')}): mỗi bản tiêm bắt đúng một dòng` };
});

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
