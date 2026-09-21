// duong-nen.test.mjs — đường nền hạ tầng bốn chân (feature-loop/scripts/duong-nen.mjs),
// hồ sơ thuoc-co-cua AC-6 (E8: NEN0 NEN1 NEN2 NEN3 NEN4 NEN4b NEN8) và AC-7
// (E9: NEN5 NEN5-IM NEN6 NEN6-IM NEN7 NEN9); hồ sơ nen-cong-cu-lenh-shell AC-1 AC-3
// AC-4 AC-5 AC-6 AC-9 (NEN-TD1…NEN-TD6 — luật «từ đầu phải là TÊN CHƯƠNG TRÌNH mới tra»).
//
// Mọi ca chạy trên kho do `dungKho()` SINH trong lượt (tests/scripts/duong-nen-fixture.mjs),
// cùng một fixture lành, mỗi ca đỏ chỉ đổi MỘT biến. Đối chứng dương NEN0 chạy trước.
// Mọi lần chạy truyền `--cache-root` trỏ vào cache DO CA DỰNG — không ca nào đọc plugin
// cache thật của máy; không ca nào ghi vào `_acceptance/` của kho kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, renameSync, cpSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { KIT, DUONG_NEN, CONFIG_LANH, dungKho, dungCache, chayNen, tamDir, donDep } from './duong-nen-fixture.mjs';

let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

if (!existsSync(DUONG_NEN)) {
  console.log(`  FAIL: script duong-nen.mjs khong ton tai (${path.relative(KIT, DUONG_NEN)})`);
  console.log('\nResults: 0 passed, 1 failed (duong-nen)');
  process.exit(1);
}

const fm = (tep, k) => { const m = String(tep || '').match(new RegExp(`^${k}: (.*)$`, 'm')); return m ? m[1] : null; };
const bullets = (tep) => {
  const s = String(tep || '');
  const i = s.indexOf('\n## Dòng đỏ\n');
  if (i < 0) return null;
  return s.slice(i).split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
};
const tomTat = r => `code=${r.code} stderr=${r.stderr.split('\n').slice(-4).join(' | ')} tep=${JSON.stringify((r.tep || '').slice(0, 400))}`;

// kiemTuanTu — đọc thứ tự DÒNG của thu-tu.log. Ghim ĐỦ BỐN dấu trước, rồi mới kết
// luận: mỗi suite phải kết thúc trước khi suite kia bắt đầu (không cặp nào lồng nhau).
function kiemTuanTu(dau) {
  const p = path.join(dau, 'thu-tu.log');
  const dong = existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(Boolean) : [];
  const can = ['a.start', 'a.end', 'b.start', 'b.end'];
  const thieu = can.filter(d => dong.filter(x => x === d).length !== 1);
  if (thieu.length) return `thieu dau (hoac lap): ${thieu.join(', ')} — log: ${dong.join(',')}`;
  const at = d => dong.indexOf(d);
  const tach = at('a.end') < at('b.start') || at('b.end') < at('a.start');
  if (!tach) return `suite long nhau: ${dong.join(',')}`;
  return null;
}

const CACHE = dungCache();

// ── NEN0 — đối chứng dương: kho lành → mã 0, bốn chân xanh, đúng một bullet «không có» ──
const k0 = dungKho();
const r0 = chayNen(k0, { cache: CACHE });
{
  const b = bullets(r0.tep);
  const chan = ['cong_cu', 'suite', 'luoi', 'engine'].map(c => `${c}=${fm(r0.tep, c)}`);
  if (r0.code !== 0) bad('NEN0 kho lanh phai ma 0', tomTat(r0));
  else if (!r0.tep) bad('NEN0 khong ghi duong-nen.md', tomTat(r0));
  else if (!r0.tep.startsWith('---\nslug: demo\n')) bad('NEN0 tep khong mo bang frontmatter slug', r0.tep.slice(0, 80));
  else if (/DUONG-NEN-TEMPLATE/.test(r0.tep)) bad('NEN0 dong marker lot vao tep ghi ra', r0.tep);
  else if (fm(r0.tep, 'nen') !== 'xanh') bad('NEN0 nen phai xanh', tomTat(r0));
  else if (chan.some(c => !c.endsWith('=xanh'))) bad('NEN0 bon chan phai xanh', chan.join(' '));
  else if (!/^[0-9a-f]{40}$/.test(fm(r0.tep, 'sha') || '') || fm(r0.tep, 'sha') !== git(k0.dir, 'rev-parse', 'HEAD')) bad('NEN0 sha khong phai HEAD', fm(r0.tep, 'sha'));
  else if (Number.isNaN(Date.parse(fm(r0.tep, 'at') || ''))) bad('NEN0 at khong phai thoi diem', fm(r0.tep, 'at'));
  else if (!b || b.length !== 1 || b[0] !== 'không có') bad('NEN0 phai dung mot bullet «không có»', JSON.stringify(b));
  else ok('NEN0 kho lanh — ma 0, nen xanh, bon chan xanh, dung mot bullet «không có»');
}

// ── NEN1 — một executor là lệnh KHÔNG có trên máy (kèm phép gán biến đứng trước) ──
{
  const k = dungKho({ config: CONFIG_LANH.replace('a: "bash suite-a.sh"', 'a: "NEN_X=1 khong-co-lenh-nay-xyz --x"') });
  const r = chayNen(k, { cache: CACHE });
  const b = bullets(r.tep) || [];
  const can = 'nen cong-cu: THIEU khong-co-lenh-nay-xyz (khoa executors.test.a)';
  if (r.code !== 1) bad('NEN1 nen do phai ma 1', tomTat(r));
  else if (fm(r.tep, 'cong_cu') !== 'do') bad('NEN1 chan cong_cu phai do', tomTat(r));
  else if (!b.includes(can)) bad('NEN1 thieu dong ghim', JSON.stringify(b));
  else if (b.some(x => x.startsWith('nen cong-cu:') && x !== can)) bad('NEN1 chan cong-cu goi ten thu khong hong', JSON.stringify(b));
  else ok(`NEN1 lenh khong co tren may — «${can}», ma 1`);
}

// ── NEN2 — suite-b đỏ sẵn (exit 3) ──
{
  const k = dungKho({ cuoiB: 'exit 3\n' });
  const r = chayNen(k, { cache: CACHE });
  const b = bullets(r.tep) || [];
  const can = 'nen suite: DO SAN executors.test.b ma 3';
  if (r.code !== 1) bad('NEN2 nen do phai ma 1', tomTat(r));
  else if (fm(r.tep, 'suite') !== 'do') bad('NEN2 chan suite phai do', tomTat(r));
  else if (!b.includes(can)) bad('NEN2 thieu dong ghim', JSON.stringify(b));
  else if (b.some(x => x.includes('executors.test.a'))) bad('NEN2 goi ten suite lanh', JSON.stringify(b));
  else ok(`NEN2 suite do san — «${can}»`);
}

// ── NEN3 — suite-a ghi tệp vào cây ──
{
  const k = dungKho({ giuaA: 'echo rac > rac.txt\n' });
  const r = chayNen(k, { cache: CACHE });
  const b = bullets(r.tep) || [];
  const can = 'nen suite: CAY BAN SAU SUITE rac.txt';
  if (r.code !== 1) bad('NEN3 nen do phai ma 1', tomTat(r));
  else if (fm(r.tep, 'suite') !== 'do') bad('NEN3 chan suite phai do', tomTat(r));
  else if (!b.includes(can)) bad('NEN3 thieu dong ghim', JSON.stringify(b));
  else if (b.filter(x => x.startsWith('nen suite:')).length !== 1) bad('NEN3 chan suite goi ten thua', JSON.stringify(b));
  else ok(`NEN3 suite ghi vao cay — «${can}»`);
}

// ── NEN4 — tuần tự: đủ bốn dấu, không cặp nào lồng nhau (trên lượt chạy NEN0) ──
{
  const loi = kiemTuanTu(k0.dau);
  if (loi) bad('NEN4 suite khong tuan tu', loi);
  else ok('NEN4 du bon dau a.start a.end b.start b.end — suite chay tuan tu, khong long nhau');
}

// ── NEN4b — chiều đỏ của NEN4: bản sao script chạy suite cùng lúc (Promise.all + spawn) ──
{
  try {
    const d = tamDir('duong-nen-mut-');
    cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
    const f = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
    const src = readFileSync(f, 'utf8');
    const MO = '// <<<SUITE-TUAN-TU\n', DONG = '// SUITE-TUAN-TU>>>\n';
    const nMo = src.split(MO).length - 1, nDong = src.split(DONG).length - 1;
    if (nMo !== 1 || nDong !== 1) throw new Error(`marker SUITE-TUAN-TU khop ${nMo}/${nDong} lan (can dung 1/1)`);
    const i = src.indexOf(MO) + MO.length, j = src.indexOf(DONG);
    const thanThat = src.slice(i, j);
    if (!/for \(const/.test(thanThat) || !/spawnSync\(/.test(thanThat)) throw new Error('than vung SUITE-TUAN-TU khong con la vong spawnSync — mui tiem mat vat');
    const songSong =
      'async function chaySuite(root, lenh) {\n' +
      "  const { spawn } = await import('node:child_process');\n" +
      '  return Promise.all(lenh.map(({ khoa, cmd }) => new Promise((res) => {\n' +
      "    const c = spawn('bash', ['-lc', cmd], { cwd: root, stdio: ['ignore', 2, 2] });\n" +
      '    c.on(\'close\', (code, sig) => res({ khoa, ma: code === null ? `tin-hieu-${sig}` : code }));\n' +
      '  })));\n' +
      '}\n';
    writeFileSync(f, src.slice(0, i) + songSong + src.slice(j));
    const k = dungKho();
    const r = chayNen(k, { cache: CACHE, script: f });
    const loi = kiemTuanTu(k.dau);
    if (r.code !== 0 || !r.tep) bad('NEN4b ban dot bien khong chay het (do vi ha tang, khong vi vat)', tomTat(r));
    else if (!loi) bad('NEN4b dot bien chay cung luc ma NEN4 van xanh — phep do khong nhay', readFileSync(path.join(k.dau, 'thu-tu.log'), 'utf8'));
    else if (!loi.startsWith('suite long nhau')) bad('NEN4b do sai thong diep', loi);
    else ok('NEN4b dot bien chay cung luc — suite long nhau');
  } catch (e) { bad('NEN4b khong dung duoc ban dot bien', String(e.message || e)); }
}

// ── NEN8 — thư mục không phải kho git → mã 2, KHÔNG ghi tệp ──
{
  const k = dungKho({ khongGit: true });
  const r = chayNen(k, { cache: CACHE });
  if (r.code !== 2) bad('NEN8 khong phai kho git phai ma 2', tomTat(r));
  else if (existsSync(r.tepPath)) bad('NEN8 ma 2 ma van ghi duong-nen.md', r.tepPath);
  else if (!/không phải kho git/.test(r.stderr)) bad('NEN8 stderr khong goi ten nguyen nhan', r.stderr.slice(-300));
  else ok('NEN8 khong phai kho git — ma 2, khong ghi tep nao');
}

// ── NEN5 — nhánh gốc nợ vi phạm lưới; lời gọi lưới không --slug, có --base ──
{
  const k = dungKho({ noLuoi: true });
  const pm = path.join(k.dir, 'scripts', 'pre-merge-check.sh');
  // Nguyên văn vi phạm lấy từ CHÍNH bản vendored chạy trực tiếp — ca không tự viết chuỗi.
  const base = git(k.dir, 'merge-base', 'main', 'HEAD');
  const truc = spawnSync('bash', [pm, k.dir, '--base', base, '--no-t1-escape'], { cwd: k.dir, encoding: 'utf8' });
  const viPham = (truc.stdout || '').split('\n').filter(l => l.startsWith('VIOLATION '));
  const real = path.join(k.dir, 'scripts', 'pre-merge-check.real.sh');
  renameSync(pm, real);
  const argsLog = path.join(k.dau, 'pm-args.txt');
  writeFileSync(pm, `#!/usr/bin/env bash\nprintf '%s\\n' "$@" > '${argsLog}'\nexec bash "$(dirname "$0")/pre-merge-check.real.sh" "$@"\n`);
  const r = chayNen(k, { cache: CACHE });
  const b = bullets(r.tep) || [];
  const args = existsSync(argsLog) ? readFileSync(argsLog, 'utf8').split('\n').filter(Boolean) : null;
  const iNhan = b.indexOf(`nen luoi: ${viPham.length} vi pham co san`);
  if (viPham.length === 0) bad('NEN5 fixture khong mang vi pham luoi that (doi chung hong)', (truc.stdout || '').slice(-300));
  else if (r.code !== 1) bad('NEN5 nen do phai ma 1', tomTat(r));
  else if (fm(r.tep, 'luoi') !== 'do') bad('NEN5 chan luoi phai do', tomTat(r));
  else if (iNhan < 0) bad('NEN5 thieu nhan «nen luoi: <k> vi pham co san»', JSON.stringify(b));
  else if (viPham.some((v, n) => b[iNhan + 1 + n] !== v)) bad('NEN5 dong vi pham khong nguyen van ngay duoi nhan', JSON.stringify({ viPham, b }));
  else if (!args) bad('NEN5 luoi khong duoc goi qua ban vendored', argsLog);
  else if (args.includes('--slug')) bad('NEN5 loi goi luoi mang --slug', args.join(' '));
  else if (!args.includes('--base') || args[args.indexOf('--base') + 1] !== base) bad('NEN5 loi goi luoi thieu --base merge-base nhanh goc', args.join(' '));
  else ok(`NEN5 nhanh goc no vi pham — «nen luoi: ${viPham.length} vi pham co san» + nguyen van «${viPham[0]}»; loi goi co --base, khong --slug`);
}

// ── NEN5-IM — nhánh gốc không nợ → chân lưới xanh, không dòng lưới nào (lượt NEN0) ──
{
  const b = bullets(r0.tep) || [];
  if (fm(r0.tep, 'luoi') !== 'xanh') bad('NEN5-IM chan luoi phai xanh', tomTat(r0));
  else if (b.some(x => x.startsWith('nen luoi') || x.startsWith('VIOLATION'))) bad('NEN5-IM co dong luoi tren kho khong no', JSON.stringify(b));
  else ok('NEN5-IM nhanh goc khong no — luoi xanh, khong dong nao');
}

// ── NEN6 — sửa một byte ở tệp engine vendored ──
{
  const k = dungKho();
  const f = path.join(k.dir, 'lib', 'md-section.cjs');
  const s = readFileSync(f, 'utf8');
  const i = s.indexOf('// Ranh');
  if (i < 0) bad('NEN6 khong tim thay cho tiem trong md-section.cjs', s.slice(0, 80));
  else {
    writeFileSync(f, s.slice(0, i + 3) + 'r' + s.slice(i + 4));
    git(k.dir, 'commit', '-qam', 'lech mot byte');
    const r = chayNen(k, { cache: CACHE });
    const b = bullets(r.tep) || [];
    const can = 'nen engine: LECH lib/md-section.cjs (vendored ≠ dang-chay)';
    const lech = b.filter(x => x.startsWith('nen engine:'));
    if (r.code !== 1) bad('NEN6 nen do phai ma 1', tomTat(r));
    else if (fm(r.tep, 'engine') !== 'do') bad('NEN6 chan engine phai do', tomTat(r));
    else if (lech.length !== 1 || lech[0] !== can) bad('NEN6 phai dung mot dong ghim', JSON.stringify(lech));
    else ok(`NEN6 sua mot byte engine vendored — «${can}»`);
  }
}

// ── NEN6-IM — engine khớp → xanh (lượt NEN0); kho tự host → «tu-host», không cờ ──
{
  const b0 = bullets(r0.tep) || [];
  const k = dungKho({ tuHost: true });
  const r = chayNen(k, { cache: CACHE, agRoot: k.dir });
  const b = bullets(r.tep) || [];
  if (fm(r0.tep, 'engine') !== 'xanh' || b0.some(x => x.startsWith('nen engine'))) bad('NEN6-IM engine khop phai xanh, khong dong', tomTat(r0));
  else if (r.code !== 0) bad('NEN6-IM kho tu host phai ma 0', tomTat(r));
  else if (!r.stderr.includes('nen engine: tu-host')) bad('NEN6-IM kho tu host khong in «nen engine: tu-host»', r.stderr.slice(-300));
  else if (r0.stderr.includes('nen engine: tu-host')) bad('NEN6-IM kho khong tu host ma van in tu-host', r0.stderr.slice(-300));
  else if (fm(r.tep, 'engine') !== 'xanh' || b.length !== 1 || b[0] !== 'không có') bad('NEN6-IM kho tu host phai khong co', JSON.stringify(b));
  else ok('NEN6-IM engine khop — engine xanh; kho tu host — «nen engine: tu-host», khong co');
}

// ── NEN7 — danh sách tệp RÚT từ marker INIT-CI-COPY-LIST: bỏ một dòng → số tệp băm giảm đúng một ──
{
  const soBam = r => { const m = r.stderr.match(/engine: bam (\d+) tep/); return m ? Number(m[1]) : null; };
  try {
    const ag = tamDir('duong-nen-ag-');
    for (const d of ['commands', 'lib', 'scripts']) cpSync(path.join(KIT, d), path.join(ag, d), { recursive: true });
    mkdirSync(path.join(ag, 'skills', 'acceptance', 'references'), { recursive: true });
    cpSync(path.join(KIT, 'skills', 'acceptance', 'references', 'duong-nen-template.md'),
      path.join(ag, 'skills', 'acceptance', 'references', 'duong-nen-template.md'));
    const f = path.join(ag, 'commands', 'acceptance-init.md');
    const s = readFileSync(f, 'utf8');
    const mo = s.indexOf('<<<INIT-CI-COPY-LIST'), dong = s.indexOf('INIT-CI-COPY-LIST>>>');
    const khoi = s.slice(mo, dong);
    const dongBo = khoi.split('\n').filter(l => l.includes('lib/md-section.cjs'));
    if (mo < 0 || dong < 0 || dongBo.length !== 1) throw new Error(`dong md-section trong marker khop ${dongBo.length} lan (can 1)`);
    writeFileSync(f, s.slice(0, mo) + khoi.replace(dongBo[0] + '\n', '') + s.slice(dong));
    const k = dungKho();
    const r = chayNen(k, { cache: CACHE, agRoot: ag });
    const n0 = soBam(r0), n1 = soBam(r);
    // Số mong đợi RÚT từ chính khối marker (mỗi mục một dòng «→ `…/`»), không gõ con số:
    // danh sách chép CI tăng 9 → 10 ở hồ sơ nhan-trang-thai-va-reality (lib/nhan-canh-gay.cjs).
    const soMuc = (khoi.match(/→ `(lib|scripts)\/`/g) || []).length;
    if (!soMuc || n0 !== soMuc) bad('NEN7 ban lanh phai bam du tep cua danh sach chep CI', `n0=${n0} soMuc=${soMuc} stderr=${r0.stderr.slice(-300)}`);
    else if (n1 !== n0 - 1) bad('NEN7 bo mot dong marker ma so tep bam khong giam dung mot', `n0=${n0} n1=${n1} ${tomTat(r)}`);
    else ok(`NEN7 danh sach rut tu marker — ban lanh bam ${n0} tep, bo mot dong marker con ${n1}`);
  } catch (e) { bad('NEN7 khong dung duoc ban sao ag-root', String(e.message || e)); }
}

// ── NEN9 — chiều im: không có plugin cache → vế cache bỏ-qua, chân engine KHÔNG đỏ ──
{
  const rong = tamDir('duong-nen-cache-rong-');
  const k = dungKho();
  const r = chayNen(k, { cache: rong });
  if (!r0.stderr.includes(path.join('kit-mkt', 'acceptance-gate', '9.9.9'))) bad('NEN9 doi chung: luot NEN0 khong so voi cache do ca dung', r0.stderr.slice(-300));
  else if (r0.stderr.includes('engine: cache bo-qua')) bad('NEN9 doi chung: luot co cache ma van bo-qua', r0.stderr.slice(-300));
  else if (!r.stderr.includes('engine: cache bo-qua')) bad('NEN9 khong cache ma khong in «engine: cache bo-qua»', r.stderr.slice(-300));
  else if (fm(r.tep, 'engine') !== 'xanh' || r.code !== 0) bad('NEN9 khong cache ma chan engine do', tomTat(r));
  else ok('NEN9 khong co plugin cache — «engine: cache bo-qua», chan engine xanh');
}

// ── NEN-TD* — chân công cụ: chỉ tra khi TỪ ĐẦU là một TÊN CHƯƠNG TRÌNH ──────────
// Hồ sơ nen-cong-cu-lenh-shell. Mọi ca dùng CHUNG fixture lành của NEN0, mỗi ca đổi
// ĐÚNG một biến (chuỗi lệnh của `executors.test.a`). Hai chiều luôn đi cặp: ca IM
// (không được đỏ) đứng cạnh ca ĐỎ (phải đỏ, ghim đúng tên) — một mình chiều nào
// cũng không phân biệt được «bắt đúng» với «chưa bao giờ chạy».

// Bullet chân công cụ mang khoá đã cho — dùng chung cho mọi ca dưới.
const bulletCongCu = (tep, khoa) =>
  (bullets(tep) || []).filter(x => x.startsWith('nen cong-cu:') && x.includes(`(khoa ${khoa})`));
// Số dòng lý do bỏ-tra trên stderr mang khoá đã cho.
const dongBoQua = (stderr, khoa) =>
  String(stderr || '').split('\n').filter(l => l.includes('cong-cu') && l.includes(khoa) && /bo qua|bỏ qua/.test(l));

const cfgVoi = lenh => CONFIG_LANH.replace('a: "bash suite-a.sh"', `a: ${JSON.stringify(lenh)}`);

// Ba chuỗi lệnh đo trong nhóm này. TD6 là chuỗi NGUYÊN VĂN của `executors.design.ui_check`
// ở ~/dev/crm nhánh onehub (dòng 425 của _acceptance/config.yaml, đo 2026-09-19) — ca buộc
// bản vá vào TRIỆU CHỨNG người dùng báo, không chỉ vào hàm vừa sửa.
const LENH_TD1 = '${BIEN_KHONG_CO_TREN_MAY:-$(echo /bin)}/echo chay-duoc';
const LENH_TD3 = '(cd . && echo trong-nhom)';
const LENH_CRM = '${CLAUDE_PLUGIN_ROOT:-$(node scripts/resolve-plugin.mjs --plugin acceptance-gate --require scripts/design-gate.mjs --require scripts/design-scan.js)}/scripts/design-scan.js';

// kTD1/kTD3 dùng lại ở NEN-TD4 (chiều stderr), nên dựng một lần ở đây.
const kTD1 = dungKho({ config: cfgVoi(LENH_TD1) });
const rTD1 = chayNen(kTD1, { cache: CACHE });
const kTD3 = dungKho({ config: cfgVoi(LENH_TD3) });
const rTD3 = chayNen(kTD3, { cache: CACHE });

// ── NEN-TD1 — từ đầu dựng bằng thay thế shell, lệnh CHẠY ĐƯỢC → chân công cụ IM ──
{
  const b = bulletCongCu(rTD1.tep, 'executors.test.a');
  if (fm(rTD1.tep, 'cong_cu') !== 'xanh') bad('NEN-TD1 chan cong_cu phai xanh', tomTat(rTD1));
  else if (b.length) bad('NEN-TD1 van co bullet cong-cu cho khoa lanh', JSON.stringify(b));
  else ok('NEN-TD1 tu dau dung thay the shell, lenh chay duoc — chan cong_cu xanh, 0 bullet');
}

// ── NEN-TD2 — từ đầu là TÊN chương trình thiếu, phần sau có ống dẫn → VẪN ĐỎ ──────
// Ca phân biệt hai bản của lối vá: một bản quét cú pháp shell trên CẢ chuỗi lệnh sẽ
// làm ca này IM, tức tắt một cái đèn đang sáng đúng.
{
  const k = dungKho({ config: cfgVoi('khong-co-lenh-nay-xyz --x | head -n 1') });
  const r = chayNen(k, { cache: CACHE });
  const can = 'nen cong-cu: THIEU khong-co-lenh-nay-xyz (khoa executors.test.a)';
  const b = bullets(r.tep) || [];
  if (fm(r.tep, 'cong_cu') !== 'do') bad('NEN-TD2 chan cong_cu phai do', tomTat(r));
  else if (!b.includes(can)) bad('NEN-TD2 thieu dong ghim', JSON.stringify(b));
  else if (r.code !== 1) bad('NEN-TD2 nen do phai ma 1', tomTat(r));
  else ok(`NEN-TD2 ten thieu + ong dan — van do, ghim «${can}»`);
}

// ── NEN-TD3 — từ đầu mở một NHÓM của shell → chân công cụ IM ─────────────────────
{
  const b = bulletCongCu(rTD3.tep, 'executors.test.a');
  if (fm(rTD3.tep, 'cong_cu') !== 'xanh') bad('NEN-TD3 chan cong_cu phai xanh', tomTat(rTD3));
  else if (b.length) bad('NEN-TD3 van co bullet cong-cu cho khoa mo nhom', JSON.stringify(b));
  else ok('NEN-TD3 tu dau mo nhom «(cd . && …)» — chan cong_cu xanh, 0 bullet');
}

// ── NEN-TD4 — «đèn tắt vẫn có tiếng», HAI CHIỀU trên stderr ──────────────────────
// Chiều NHẠY: TD1 và TD3 mỗi lượt đúng MỘT dòng lý do gọi đúng khoá.
// Chiều ĐẶC HIỆU: NEN0 (kho lành) và NEN1 (lệnh thiếu thật, CÓ tra và CÓ đỏ) không
// dòng nào — số dòng lý do bằng ĐÚNG số khoá bị bỏ tra, nên một bản in-cho-chắc-mọi-khoá
// sẽ làm ca này đỏ.
{
  const kNEN1 = dungKho({ config: cfgVoi('NEN_X=1 khong-co-lenh-nay-xyz --x') });
  const rNEN1 = chayNen(kNEN1, { cache: CACHE });
  const n = (r) => dongBoQua(r.stderr, 'executors.test.a').length;
  if (n(rTD1) !== 1) bad('NEN-TD4 luot TD1 phai co dung 1 dong ly do', `${n(rTD1)} · ${rTD1.stderr.slice(-300)}`);
  else if (n(rTD3) !== 1) bad('NEN-TD4 luot TD3 phai co dung 1 dong ly do', `${n(rTD3)} · ${rTD3.stderr.slice(-300)}`);
  else if (n(r0) !== 0) bad('NEN-TD4 kho lanh KHONG duoc co dong ly do', `${n(r0)} · ${r0.stderr.slice(-300)}`);
  else if (n(rNEN1) !== 0) bad('NEN-TD4 lenh thieu that KHONG duoc co dong ly do', `${n(rNEN1)} · ${rNEN1.stderr.slice(-300)}`);
  else if (fm(rNEN1.tep, 'cong_cu') !== 'do') bad('NEN-TD4 doi chung: lenh thieu that phai van do', tomTat(rNEN1));
  else ok('NEN-TD4 stderr hai chieu — 1 dong ly do o TD1 va TD3, 0 dong o NEN0 va lenh-thieu-that');
}

/**
 * banDotBien() — bản sao `feature-loop` với khối marker CONG-CU-TU-DAU bị thay bằng một
 * bản luôn nhận MỌI từ đầu là tên chương trình (tức gỡ đúng luật vòng này thêm).
 * Trả đường dẫn script đột biến. Marker khớp khác 1/1 lần → ném, ca tự đỏ.
 */
function banDotBien() {
  const d = tamDir('duong-nen-td-mut-');
  cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
  const f = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
  const src = readFileSync(f, 'utf8');
  const MO = '// <<<CONG-CU-TU-DAU\n', DONG = '// CONG-CU-TU-DAU>>>\n';
  const nMo = src.split(MO).length - 1, nDong = src.split(DONG).length - 1;
  if (nMo !== 1 || nDong !== 1) throw new Error(`marker CONG-CU-TU-DAU khop ${nMo}/${nDong} lan (can dung 1/1)`);
  const i = src.indexOf(MO) + MO.length, j = src.indexOf(DONG);
  const thay = 'const tenChuongTrinh = () => true;\n';
  writeFileSync(f, src.slice(0, i) + thay + src.slice(j));
  if (readFileSync(f, 'utf8') === src) throw new Error('ban dot bien TRUNG ban goc — buoc tiem chua chay');
  return f;
}

// ── NEN-TD5 — đột biến: gỡ luật thì ca NEN-TD1 phải ĐỎ trở lại ───────────────────
// Hai lượt trên CÙNG bản chép. Lượt chưa tiêm phải XANH, nếu không thì «đỏ» của lượt
// tiêm không phân biệt được với bản chép hỏng (thiếu tệp, sai đường dẫn, exit 127).
{
  try {
    const d = tamDir('duong-nen-td-base-');
    cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
    const fSach = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
    const kSach = dungKho({ config: cfgVoi(LENH_TD1) });
    const rSach = chayNen(kSach, { cache: CACHE, script: fSach });
    if (fm(rSach.tep, 'cong_cu') !== 'xanh') {
      bad('NEN-TD5 ban chep hong — luot CHUA TIEM khong xanh, ket luan do cua luot tiem vo nghia', tomTat(rSach));
    } else {
      const fMut = banDotBien();
      const kMut = dungKho({ config: cfgVoi(LENH_TD1) });
      const rMut = chayNen(kMut, { cache: CACHE, script: fMut });
      const b = bulletCongCu(rMut.tep, 'executors.test.a');
      if (fm(rMut.tep, 'cong_cu') !== 'do') bad('NEN-TD5 ban dot bien KHONG do — phep do khong treo vao luat vua them', tomTat(rMut));
      else if (!b.some(x => x.includes('THIEU ${BIEN_KHONG_CO_TREN_MAY:-$('))) bad('NEN-TD5 do nhung khong ghim chuoi cut mong doi', JSON.stringify(b));
      else ok('NEN-TD5 dot bien — luot chua tiem xanh, luot tiem do ghim «THIEU ${BIEN_KHONG_CO_TREN_MAY:-$(»');
    }
  } catch (e) { bad('NEN-TD5 khong dung duoc ban dot bien', String(e.message || e)); }
}

// ── NEN-TD6 — chuỗi lệnh NGUYÊN VĂN của kho tiêu thụ đang đỏ (crm@onehub) ────────
// Ca buộc bản vá vào TRIỆU CHỨNG: sau vá 0 bullet cho khoá ấy; trên bản đột biến
// (gỡ luật) thì ≥1 bullet, ghim đúng chuỗi cụt owner báo.
{
  try {
    const k = dungKho({ config: cfgVoi(LENH_CRM) });
    const r = chayNen(k, { cache: CACHE });
    const b = bulletCongCu(r.tep, 'executors.test.a');
    if (b.length) {
      bad('NEN-TD6 chuoi that cua crm VAN sinh bullet cong-cu', JSON.stringify(b));
    } else {
      const fMut = banDotBien();
      const kMut = dungKho({ config: cfgVoi(LENH_CRM) });
      const rMut = chayNen(kMut, { cache: CACHE, script: fMut });
      const bMut = bulletCongCu(rMut.tep, 'executors.test.a');
      if (!bMut.length) bad('NEN-TD6 doi chung: ban dot bien cung IM — kho nay chua bao gio do', tomTat(rMut));
      else if (!bMut.some(x => x.includes('THIEU ${CLAUDE_PLUGIN_ROOT:-$(node'))) bad('NEN-TD6 ban dot bien do nhung khong ghim chuoi cut owner bao', JSON.stringify(bMut));
      else ok('NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»');
    }
  } catch (e) { bad('NEN-TD6 khong dung duoc ban dot bien', String(e.message || e)); }
}

donDep();
console.log(`\nResults: ${pass} passed, ${fail} failed (duong-nen)`);
process.exit(fail ? 1 : 0);
