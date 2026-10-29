// duong-nen.test.mjs — đường nền hạ tầng bốn chân (feature-loop/scripts/duong-nen.mjs),
// hồ sơ thuoc-co-cua AC-6 (E8: NEN0 NEN1 NEN2 NEN3 NEN4 NEN4b NEN8) và AC-7
// (E9: NEN5 NEN5-IM NEN6 NEN6-IM NEN7 NEN9); hồ sơ nen-cong-cu-lenh-shell AC-1 AC-3
// AC-4 AC-5 AC-6 AC-9 (NEN-TD1…NEN-TD6 — luật «từ đầu phải là TÊN CHƯƠNG TRÌNH mới tra»);
// hồ sơ nen-cong-cu-gan-bang-lenh-con AC-1…AC-5 (NEN-LC1…NEN-LC3 — lệnh chỉ-gán mang lệnh con);
// hồ sơ cong-cu-xet-tep-ton-tai AC-1…AC-5 (NEN-TT1…NEN-TT5 — từ đầu là đường tệp thì xét tệp có tồn tại).
// NEN-DK1…NEN-DK6: tệp CÓ ĐIỀU KIỆN của danh sách chép (thẻ `[only-if-declared: <khoá>]`) — hồ sơ
// nen-dieu-kien-va-static-khong-do-duoc AC-1…AC-5 (crm-onehub#375: crm không khai tin_hieu nên không
// chép ba tệp tin_hieu, đường nền đỏ engine ở mọi dãy).
// NEN-TV1…NEN-TV8: dòng của CHÍNH vòng vào mục «Dòng vàng» — hồ sơ nen-khong-tinh-tep-cua-vong AC-1…AC-8,
// AC-10 (crm-onehub#375: S1 soạn song song với nền → «CAY BAN SAU SUITE» đỏ giả; 233/233 dòng lịch sử).
// NEN-ENV1…NEN-ENV4: lệnh chạy bằng MÔI TRƯỜNG NGƯỜI GỌI, không bằng profile đăng nhập
// (báo động giả đo ở crm@onehub 24/09, vòng mot-duong-ghi-phong-ban).
//
// Mọi ca chạy trên kho do `dungKho()` SINH trong lượt (tests/scripts/duong-nen-fixture.mjs),
// cùng một fixture lành, mỗi ca đỏ chỉ đổi MỘT biến. Đối chứng dương NEN0 chạy trước.
// Mọi lần chạy truyền `--cache-root` trỏ vào cache DO CA DỰNG — không ca nào đọc plugin
// cache thật của máy; không ca nào ghi vào `_acceptance/` của kho kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, renameSync, cpSync, mkdirSync, existsSync, chmodSync, statSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { KIT, DUONG_NEN, CONFIG_LANH, dungKho, dungCache, chayNen, tamDir, donDep, hoSoViPham } from './duong-nen-fixture.mjs';

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
// Bullet của MỘT mục, cắt tới tiêu đề kế — tệp từ hồ sơ nen-khong-tinh-tep-cua-vong có thêm mục
// «Dòng vàng» sau «Dòng đỏ»; đọc tới hết tệp là đếm lẫn hai mục.
const muc = (tep, ten) => {
  const d = String(tep || '').split('\n'); const i = d.findIndex(l => l === `## ${ten}`);
  if (i < 0) return null;
  const sau = d.slice(i + 1); const j = sau.findIndex(l => /^#{1,6}\s/.test(l));
  return (j < 0 ? sau : sau.slice(0, j)).filter(l => l.startsWith('- ')).map(l => l.slice(2));
};
const bullets = tep => muc(tep, 'Dòng đỏ');
const bulletsVang = tep => muc(tep, 'Dòng vàng');
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

// ── NEN-CB* — chân suite gọi đúng tên TỆP ĐÃ THEO DÕI mà suite làm bẩn ──────────
// Hồ sơ nen-cay-ban-dong-dau. NEN3 chỉ đo tệp chưa theo dõi (`?? …`, không dấu cách đầu) nên
// không chạm lỗi trim() dòng đầu. Mỗi ca tự chụp porcelain THÔ trước/sau lượt và kiểm tiền điều
// kiện «dòng đích đứng đầu» — thiếu nó thì ca xanh cả trên bản chưa vá (gap-probe F1).
const porcelainTho = dir => execFileSync('git', ['-C', dir, 'status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const dongCayBan = tep => (bullets(tep) || []).filter(x => x.startsWith('nen suite: CAY BAN SAU SUITE '));
const CAN_README = JSON.stringify(['nen suite: CAY BAN SAU SUITE README.md']);
const VAT_BAN_SAN = 'vat cua vong\nban san truoc luot\n';

/** chayCB({ giuaA, banSan, script }) — kho lành của NEN0; banSan làm bẩn `vat.txt` TRƯỚC lượt. */
function chayCB({ giuaA = '', banSan = false, script } = {}) {
  const k = dungKho({ giuaA });
  if (banSan) writeFileSync(path.join(k.dir, 'vat.txt'), VAT_BAN_SAN);
  const truoc = porcelainTho(k.dir);
  const r = chayNen(k, { cache: CACHE, script });
  return { r, truoc, sau: porcelainTho(k.dir), b: dongCayBan(r.tep) };
}
// Kiểm chung cho ca «suite làm bẩn README.md»: tiền điều kiện rồi tập dòng BẰNG ĐÚNG mong đợi.
// Trả null khi đạt, hoặc chuỗi lỗi có tên ca.
function kiemReadme(ten, x, truocCan, dongDauCan) {
  if (JSON.stringify(x.truoc) !== JSON.stringify(truocCan)) return `${ten} fixture khong ${truocCan.length ? 'ban san' : 'sach'} truoc luot (${JSON.stringify(x.truoc)})`;
  if (x.sau[0] !== dongDauCan) return `${ten} dong dau sau luot khong phai «${dongDauCan}» — ca khong cham duoc loi (${JSON.stringify(x.sau)})`;
  if (JSON.stringify(x.b) !== CAN_README) return `${ten} tap dong cay ban khac mong doi (${JSON.stringify(x.b)})`;
  if (x.r.code !== 1 || fm(x.r.tep, 'suite') !== 'do') return `${ten} chan suite phai do, ma 1 (${tomTat(x.r)})`;
  return null;
}
const KB_CB1 = { giuaA: 'echo x >> README.md\n' };
const KB_CB2 = { giuaA: 'echo x >> README.md\n', banSan: true };

// ── NEN-CB1 / NEN-CB4 — suite SỬA / XOÁ tệp đã theo dõi, cây sạch trước lượt ──
{
  const loi = kiemReadme('NEN-CB1', chayCB(KB_CB1), [], ' M README.md');
  if (loi) bad(loi); else ok('NEN-CB1 suite sua README.md — dung mot dong «nen suite: CAY BAN SAU SUITE README.md»');
}
{
  const loi = kiemReadme('NEN-CB4', chayCB({ giuaA: 'rm README.md\n' }), [], ' D README.md');
  if (loi) bad(loi); else ok('NEN-CB4 suite xoa README.md — dung mot dong «nen suite: CAY BAN SAU SUITE README.md»');
}

// ── NEN-CB2 — vat.txt bẩn SẴN, suite sửa README.md (sắp trước) → không đổ oan vat.txt ──
{
  const loi = kiemReadme('NEN-CB2', chayCB(KB_CB2), [' M vat.txt'], ' M README.md');
  if (loi) bad(loi); else ok('NEN-CB2 tep ban san khong bi do cho suite — chi README.md duoc goi ten');
}

// ── NEN-CB3 — chiều im: vat.txt bẩn sẵn, suite không ghi gì → chân suite XANH ──
{
  const x = chayCB({ banSan: true });
  const bSuite = (bullets(x.r.tep) || []).filter(l => l.startsWith('nen suite:'));
  if (JSON.stringify(x.truoc) !== JSON.stringify([' M vat.txt'])) bad('NEN-CB3 fixture khong ban san truoc luot', JSON.stringify(x.truoc));
  else if (bSuite.length) bad('NEN-CB3 tep ban san bi goi ten du suite khong ghi gi', JSON.stringify(bSuite));
  else if (fm(x.r.tep, 'suite') !== 'xanh') bad('NEN-CB3 chan suite phai xanh', tomTat(x.r));
  else ok('NEN-CB3 tep ban san, suite khong ghi — chan suite xanh, 0 dong');
}

/** banDotBienCB() — bản chép `feature-loop` với khối SUITE-TRANG-THAI đọc lại qua gitTry() (có trim). */
function banDotBienCB() {
  const d = tamDir('duong-nen-cb-mut-');
  cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
  const f = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
  const src = readFileSync(f, 'utf8');
  const MO = '// <<<SUITE-TRANG-THAI', DONG = '// SUITE-TRANG-THAI>>>';
  const nMo = src.split(MO).length - 1, nDong = src.split(DONG).length - 1;
  if (nMo !== 1 || nDong !== 1) throw new Error(`marker SUITE-TRANG-THAI khop ${nMo}/${nDong} lan (can dung 1/1)`);
  const i = src.indexOf('\n', src.indexOf(MO)) + 1, j = src.lastIndexOf('\n', src.indexOf(DONG)) + 1;
  const thay = "  const trangThai = () => new Set((gitTry('status', '--porcelain', '--untracked-files=all') || '').split('\\n').filter(Boolean));\n";
  writeFileSync(f, src.slice(0, i) + thay + src.slice(j));
  if (readFileSync(f, 'utf8') === src) throw new Error('ban dot bien TRUNG ban goc — buoc tiem chua chay');
  return f;
}

// ── NEN-CB5 — chiều đỏ trong lượt: đặt lại trim() thì CB1 và CB2 phải ĐỎ đúng dấu vết ──
{
  try {
    const d = tamDir('duong-nen-cb-base-');
    cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
    const fSach = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
    const loiSach = kiemReadme('NEN-CB5', chayCB({ ...KB_CB1, script: fSach }), [], ' M README.md')
      || kiemReadme('NEN-CB5', chayCB({ ...KB_CB2, script: fSach }), [' M vat.txt'], ' M README.md');
    if (loiSach) bad('NEN-CB5 ban chep hong — luot CHUA TIEM khong xanh, ket luan do cua luot tiem vo nghia', loiSach);
    else {
      const fMut = banDotBienCB();
      const m1 = chayCB({ ...KB_CB1, script: fMut }), m2 = chayCB({ ...KB_CB2, script: fMut });
      if (!m1.b.some(l => l.endsWith(' EADME.md'))) bad('NEN-CB5 dot bien: CB1 khong do voi «EADME.md» — phep do khong treo vao ban va', JSON.stringify(m1.b));
      else if (!m2.b.some(l => l.endsWith(' vat.txt'))) bad('NEN-CB5 dot bien: CB2 khong do oan «vat.txt» — phep do khong treo vao ban va', JSON.stringify(m2.b));
      else ok('NEN-CB5 dot bien dat lai trim() — luot chua tiem xanh, CB1 do «EADME.md», CB2 do oan «vat.txt»');
    }
  } catch (e) { bad('NEN-CB5 khong dung duoc ban dot bien', String(e.message || e)); }
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
    if (!/for \(const/.test(thanThat) || !/bashNguoiGoi\(/.test(thanThat)) throw new Error('than vung SUITE-TUAN-TU khong con la vong bashNguoiGoi — mui tiem mat vat');
    const songSong =
      'async function chaySuite(root, lenh) {\n' +
      "  const { spawn } = await import('node:child_process');\n" +
      '  return Promise.all(lenh.map(({ khoa, cmd }) => new Promise((res) => {\n' +
      "    const c = spawn('bash', ['-c', cmd], { cwd: root, env: process.env, stdio: ['ignore', 2, 2] });\n" +
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

// ── NEN-LC* — lệnh CHỈ-GÁN mang lệnh con: tra chương trình TRONG lệnh con ─────────
// Hồ sơ nen-cong-cu-gan-bang-lenh-con. `B=$(git merge-base …) && …` phải tra `git`, không
// phải `merge-base` (lệnh con của git) hay `&&`. Khoá đo nằm ở nhóm `script`, NGOÀI
// suite_keys, nên chân suite không chạy chuỗi đang đo. Mỗi lượt có thêm khoá đối chứng chắc
// chắn bỏ-tra: bộ dò phải thấy ĐÚNG MỘT dòng bỏ-tra nguyên văn của nó trước khi «0 dòng» cho
// khoá đang đo được tin — assertion âm tính không đứng một mình (gap-probe F1).

// Giá trị YAML THÔ của executors.script.zqw_giu_nqz ở crm@onehub 64d7c593 (nháy đơn giữ
// nguyên). sha256 ghim ở contract: lệch băm = hằng chép sai, ca tự đỏ trước khi đo (F2).
const CRM_ZQW_YAML = `'B=$(git merge-base HEAD origin/onehub) && { git diff --quiet "$B" -- apps/agent/test/nhac-qua-zalo.integration.spec.ts || { echo "spec da ky cua nhac-qua-zalo bi sua" >&2; exit 1; }; } && bun run test -- "cd apps/agent && bun test test/nhac-qua-zalo.integration.spec.ts"'`;
const CRM_ZQW_SHA256 = '652e6eccb66fa661478ede817b496b72cae36638e024bff9da48fb6165d64379';
const DOI_CHUNG = '${X_KHONG_CO:-git} --version';
const DONG_DOI_CHUNG = 'cong-cu: bo qua executors.script.lc_doi_chung — tu dau «${X_KHONG_CO:-git}» dung cu phap shell, khong phai ten chuong trinh';
const { resolveConfigKey } = createRequire(import.meta.url)(path.join(KIT, 'lib', 'evidence-core.cjs'));

// Dòng bỏ-tra của ĐÚNG khoá đã cho (so tiền tố có khoảng trắng — `executors.script.lc` là
// tiền tố chữ của `executors.script.lc_doi_chung`, `includes` sẽ đếm lẫn).
const boQuaKhoa = (stderr, khoa) => String(stderr || '').split('\n').filter(l => l.startsWith(`cong-cu: bo qua ${khoa} `));
const bulletCongCuMoi = tep => (bullets(tep) || []).filter(x => x.startsWith('nen cong-cu:'));
const yamlCmd = cmd => ({ yaml: JSON.stringify(cmd), cmd });

/**
 * chayLC(khoa) — fixture lành của NEN0 thêm nhóm `executors.script` gồm các khoá đã cho
 * ({ ten: { yaml, cmd } }) cùng khoá đối chứng. Round-trip TRƯỚC khi chạy: mọi khoá phải
 * được `resolveConfigKey` đọc lại đúng `cmd`; lệch → { lech } và ca tự đỏ, không chạy.
 */
function chayLC(khoa) {
  const tat = { ...khoa, lc_doi_chung: yamlCmd(DOI_CHUNG) };
  const dong = Object.entries(tat).map(([k, v]) => `    ${k}: ${v.yaml}\n`).join('');
  const config = CONFIG_LANH.replace('feature_loop:\n', `  script:\n${dong}feature_loop:\n`);
  const lech = Object.entries(tat).filter(([k, v]) => resolveConfigKey(config, `executors.script.${k}`) !== v.cmd).map(([k]) => k);
  if (lech.length) return { lech };
  const r = chayNen(dungKho({ config }), { cache: CACHE });
  const dc = boQuaKhoa(r.stderr, 'executors.script.lc_doi_chung');
  return { lech, r, doiChung: dc.length === 1 && dc[0] === DONG_DOI_CHUNG ? null : JSON.stringify(dc) };
}

// ── NEN-LC1 — chuỗi NGUYÊN VĂN của crm@onehub → chân công cụ XANH, tra `git` ─────
{
  const sha = createHash('sha256').update(CRM_ZQW_YAML).digest('hex');
  const x = sha === CRM_ZQW_SHA256 ? chayLC({ lc: { yaml: CRM_ZQW_YAML, cmd: CRM_ZQW_YAML.slice(1, -1) } }) : null;
  if (!x) bad('NEN-LC1 hang CRM_ZQW_YAML lech dong that cua crm@onehub 64d7c593', sha);
  else if (x.lech.length) bad('NEN-LC1 fixture khong round-trip', x.lech.join(','));
  else if (x.doiChung) bad('NEN-LC1 doi chung: khong thay dung 1 dong bo-tra nguyen van cho lc_doi_chung', x.doiChung);
  else if (bulletCongCuMoi(x.r.tep).length) bad('NEN-LC1 chuoi crm van sinh bullet cong-cu', JSON.stringify(bulletCongCuMoi(x.r.tep)));
  else if (boQuaKhoa(x.r.stderr, 'executors.script.lc').length) bad('NEN-LC1 chuoi crm roi vao nhanh bo-tra — im nham thay vi tra git', JSON.stringify(boQuaKhoa(x.r.stderr, 'executors.script.lc')));
  else if (x.r.code !== 0 || fm(x.r.tep, 'cong_cu') !== 'xanh') bad('NEN-LC1 chuoi crm phai cho ma 0 va chan cong_cu xanh', tomTat(x.r));
  else ok('NEN-LC1 chuoi nguyen van crm@onehub zqw_giu_nqz — ma 0, cong_cu xanh, 0 bullet, 0 dong bo-tra (doi chung: dung 1 dong)');
}

// ── NEN-LC2 — cùng fixture, chương trình THẬT SỰ vắng → ĐỎ, gọi đúng tên ─────────
{
  const x = chayLC({ lc: yamlCmd('khong-co-that --x') });
  const can = ['nen cong-cu: THIEU khong-co-that (khoa executors.script.lc)'];
  const b = x.r ? bulletCongCuMoi(x.r.tep) : [];
  if (x.lech.length) bad('NEN-LC2 fixture khong round-trip', x.lech.join(','));
  else if (x.doiChung) bad('NEN-LC2 doi chung: khong thay dung 1 dong bo-tra nguyen van cho lc_doi_chung', x.doiChung);
  else if (JSON.stringify(b) !== JSON.stringify(can)) bad('NEN-LC2 bullet cong-cu khac dung mot dong ghim', JSON.stringify(b));
  else if (x.r.code !== 1 || fm(x.r.tep, 'cong_cu') !== 'do') bad('NEN-LC2 phai ma 1 va chan cong_cu do', tomTat(x.r));
  else ok(`NEN-LC2 chuong trinh vang that — do, ghim «${can[0]}»`);
}

// ── NEN-LC3 — ma trận viết trước: {$(…), "$(…)", `…`, chỉ-gán trần} × {có, vắng} ──
// Tám chuỗi và bốn bullet ghim NGUYÊN VĂN ở evals.yaml E3–E5; so BẰNG NHAU, không includes.
{
  const MA_TRAN = {
    lc_tran_co: 'B=$(git rev-parse HEAD) && echo "$B"',
    lc_nhay_co: 'B="$(git rev-parse "HEAD")" && echo "$B"',
    lc_huyen_co: 'B=`git rev-parse HEAD`; echo $B',
    lc_gan_co: 'A=1; git --version',
    lc_tran_thieu: 'B=$(khong-co-that-lc1 --x) && echo "$B"',
    lc_nhay_thieu: 'B="$(khong-co-that-lc2 "--x")" && echo "$B"',
    lc_huyen_thieu: 'B=`khong-co-that-lc3 --x`; echo $B',
    lc_gan_thieu: 'A=1 && khong-co-that-lc4 --x',
  };
  const MONG = [
    'nen cong-cu: THIEU khong-co-that-lc1 (khoa executors.script.lc_tran_thieu)',
    'nen cong-cu: THIEU khong-co-that-lc2 (khoa executors.script.lc_nhay_thieu)',
    'nen cong-cu: THIEU khong-co-that-lc3 (khoa executors.script.lc_huyen_thieu)',
    'nen cong-cu: THIEU khong-co-that-lc4 (khoa executors.script.lc_gan_thieu)',
  ].sort();
  const x = chayLC(Object.fromEntries(Object.entries(MA_TRAN).map(([k, v]) => [k, yamlCmd(v)])));
  const b = x.r ? bulletCongCuMoi(x.r.tep).sort() : [];
  const roiBoQua = x.r ? Object.keys(MA_TRAN).filter(k => boQuaKhoa(x.r.stderr, `executors.script.${k}`).length) : [];
  if (Object.keys(MA_TRAN).length !== 8 || MONG.length !== 4) bad('NEN-LC3 ma tran khai sai kich thuoc (can 8 khoa, 4 bullet)', `${Object.keys(MA_TRAN).length}/${MONG.length}`);
  else if (x.lech.length) bad('NEN-LC3 fixture khong round-trip', x.lech.join(','));
  else if (x.doiChung) bad('NEN-LC3 doi chung: khong thay dung 1 dong bo-tra nguyen van cho lc_doi_chung', x.doiChung);
  else if (JSON.stringify(b) !== JSON.stringify(MONG)) bad('NEN-LC3 tap bullet cong-cu khac tap mong doi', JSON.stringify(b));
  else if (roiBoQua.length) bad('NEN-LC3 khoa roi vao nhanh bo-tra', roiBoQua.join(','));
  else if (fm(x.r.tep, 'cong_cu') !== 'do') bad('NEN-LC3 chan cong_cu phai do', tomTat(x.r));
  else ok('NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)');
}

// ── NEN-ENV — lệnh chạy bằng MÔI TRƯỜNG CỦA NGƯỜI GỌI, không bằng profile đăng nhập ──
// crm@onehub 24/09: `bash -lc` nạp lại profile, PATH về /usr/local/bin (node 22) trong khi
// người gọi đứng trên fnm (node 24) → build đỏ «eve requires Node.js >=24» trên cây chưa
// chạm. Fixture dựng đúng cơ chế đó, không phụ thuộc máy: HOME tạm có `.bash_profile`
// ĐẶT LẠI PATH, công cụ chỉ nằm trong PATH của người gọi. Cặp ENV1/ENV2 cùng fixture,
// chỉ khác MỘT biến: công cụ có hay không. ENV4 là HÌNH DẠNG THẬT của crm: công cụ có ở
// cả hai nơi, profile tìm thấy bản khác trước (mồi `exit 42`) — chân công cụ vẫn xanh,
// chỉ chân suite đỏ.
const CONG_CU_RIENG = 'nen-cong-cu-rieng-xyz';
function moiTruongNguoiGoi({ coCongCu, moi = false }) {
  const home = tamDir('duong-nen-home-');
  let pathDangNhap = '/usr/bin:/bin';
  if (moi) {
    const heThong = tamDir('duong-nen-he-thong-');
    writeFileSync(path.join(heThong, CONG_CU_RIENG), '#!/bin/sh\nexit 42\n');
    chmodSync(path.join(heThong, CONG_CU_RIENG), 0o755);
    pathDangNhap = `${heThong}:${pathDangNhap}`;
  }
  writeFileSync(path.join(home, '.bash_profile'), `export PATH=${pathDangNhap}\n`);
  const bin = tamDir('duong-nen-bin-');
  if (coCongCu) {
    writeFileSync(path.join(bin, CONG_CU_RIENG), '#!/bin/sh\nexit 0\n');
    chmodSync(path.join(bin, CONG_CU_RIENG), 0o755);
  }
  return { HOME: home, PATH: `${bin}${path.delimiter}${process.env.PATH}` };
}
const LENH_ENV = `${CONG_CU_RIENG} --chay`;
const DONG_ENV_CONG_CU = `nen cong-cu: THIEU ${CONG_CU_RIENG} (khoa executors.test.a)`;
const DONG_ENV_SUITE = 'nen suite: DO SAN executors.test.a ma 127';
const DONG_ENV_MOI = 'nen suite: DO SAN executors.test.a ma 42';
const BON_CHAN = ['cong_cu', 'suite', 'luoi', 'engine'];
const bangNhau = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
// Bốn chân của lượt ENV phải BẰNG của NEN0 (không đổi HOME): HOME tạm không được đổi màu
// chân lưới hay chân engine — nếu đổi, fixture đã khác đối chứng thêm một biến.
const chanKhacNEN0 = (r) => BON_CHAN.filter(c => fm(r.tep, c) !== fm(r0.tep, c)).map(c => `${c}=${fm(r.tep, c)}/NEN0=${fm(r0.tep, c)}`);

/**
 * banDotBienDangNhap() — bản chép `feature-loop` + script CHƯA tiêm và script đã đổi
 * khối BASH-NGUOI-GOI về shell đăng nhập (`['-c',` → `['-lc',`). Marker khớp khác 1/1,
 * thân không có đúng 1 `['-c',`, hay tệp không đổi → ném, ca tự đỏ.
 */
function banDotBienDangNhap() {
  const d = tamDir('duong-nen-env-mut-');
  cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
  const fSach = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
  const fMut = path.join(d, 'feature-loop', 'scripts', 'duong-nen-dang-nhap.mjs');
  const src = readFileSync(fSach, 'utf8');
  const MO = '// <<<BASH-NGUOI-GOI\n', DONG = '// BASH-NGUOI-GOI>>>\n';
  const nMo = src.split(MO).length - 1, nDong = src.split(DONG).length - 1;
  if (nMo !== 1 || nDong !== 1) throw new Error(`marker BASH-NGUOI-GOI khop ${nMo}/${nDong} lan (can dung 1/1)`);
  const i = src.indexOf(MO) + MO.length, j = src.indexOf(DONG);
  const than = src.slice(i, j);
  const nC = than.split("['-c',").length - 1;
  if (nC !== 1) throw new Error(`than BASH-NGUOI-GOI co ${nC} lan «['-c',» (can dung 1) — mui tiem mat vat`);
  writeFileSync(fMut, src.slice(0, i) + than.replace("['-c',", "['-lc',") + src.slice(j));
  if (readFileSync(fMut, 'utf8') === src) throw new Error('ban dot bien TRUNG ban goc — buoc tiem chua chay');
  return { fSach, fMut };
}

// ── NEN-ENV1 — đối chứng dương: công cụ có trong PATH người gọi, profile đặt lại PATH → XANH ──
{
  const k = dungKho({ config: cfgVoi(LENH_ENV) });
  const r = chayNen(k, { cache: CACHE, env: moiTruongNguoiGoi({ coCongCu: true }) });
  const b = bullets(r.tep) || [];
  const lech = chanKhacNEN0(r);
  if (r.code !== 0) bad('NEN-ENV1 cong cu co trong PATH nguoi goi phai ma 0', tomTat(r));
  else if (fm(r0.tep, 'nen') !== 'xanh') bad('NEN-ENV1 doi chung NEN0 khong xanh — khong so duoc', tomTat(r0));
  else if (lech.length) bad('NEN-ENV1 bon chan khac NEN0', lech.join(' '));
  else if (!bangNhau(b, ['không có'])) bad('NEN-ENV1 phai dung mot bullet «không có»', JSON.stringify(b));
  else ok('NEN-ENV1 cong cu chi co trong PATH nguoi goi, profile dat lai PATH — ma 0, bon chan bang NEN0, mot bullet «không có»');
}

// ── NEN-ENV2 — chiều đỏ cùng fixture: công cụ THẬT SỰ vắng → đỏ, ghim tên khoá ở cả hai chân ──
{
  const k = dungKho({ config: cfgVoi(LENH_ENV) });
  const r = chayNen(k, { cache: CACHE, env: moiTruongNguoiGoi({ coCongCu: false }) });
  const b = bullets(r.tep) || [];
  if (r.code !== 1) bad('NEN-ENV2 cong cu vang phai ma 1', tomTat(r));
  else if (!bangNhau(b, [DONG_ENV_CONG_CU, DONG_ENV_SUITE])) bad('NEN-ENV2 tap bullet khac dung hai dong ghim', JSON.stringify(b));
  else ok(`NEN-ENV2 cong cu vang that — tap bullet == «${DONG_ENV_CONG_CU}» + «${DONG_ENV_SUITE}»`);
}

// ── NEN-ENV3 — đột biến: trả khối BASH-NGUOI-GOI về shell đăng nhập thì ENV1 phải ĐỎ ──
// Hai lượt trên CÙNG bản chép: lượt chưa tiêm phải XANH trước, rồi mới tin đỏ của lượt tiêm.
{
  try {
    const { fSach, fMut } = banDotBienDangNhap();
    const rSach = chayNen(dungKho({ config: cfgVoi(LENH_ENV) }), { cache: CACHE, script: fSach, env: moiTruongNguoiGoi({ coCongCu: true }) });
    if (rSach.code !== 0) {
      bad('NEN-ENV3 ban chep hong — luot CHUA TIEM khong xanh, ket luan do cua luot tiem vo nghia', tomTat(rSach));
    } else {
      const rMut = chayNen(dungKho({ config: cfgVoi(LENH_ENV) }), { cache: CACHE, script: fMut, env: moiTruongNguoiGoi({ coCongCu: true }) });
      const b = bullets(rMut.tep) || [];
      if (rMut.code !== 1) bad('NEN-ENV3 ban dot bien (shell dang nhap) KHONG do — phep do khong treo vao moi truong nguoi goi', tomTat(rMut));
      else if (!bangNhau(b, [DONG_ENV_CONG_CU, DONG_ENV_SUITE])) bad('NEN-ENV3 tap bullet khac dung hai dong ghim', JSON.stringify(b));
      else ok('NEN-ENV3 dot bien -c → -lc — luot chua tiem xanh, luot tiem do dung hai dong (cong-cu + suite)');
    }
  } catch (e) { bad('NEN-ENV3 khong dung duoc ban dot bien', String(e.message || e)); }
}

// ── NEN-ENV4 — hình dạng thật của crm: công cụ CÓ ở cả hai nơi, profile tìm thấy bản khác trước ──
// Bản thật: bản của người gọi chạy → xanh. Bản đột biến đăng nhập: `command -v` vẫn thấy công
// cụ (chân công cụ XANH) nhưng suite chạy bản mồi `exit 42` → ĐÚNG một dòng suite, mã 42.
// Một bản vá giữ `-lc` rồi nối PATH người gọi vào CUỐI vẫn qua ENV1 và ENV2 nhưng đỏ ở đây
// (phá thử tay 24/09: fixture ENV1 mã 0, fixture ENV4 mã 1 «DO SAN … ma 42»).
{
  try {
    const kThat = dungKho({ config: cfgVoi(LENH_ENV) });
    const rThat = chayNen(kThat, { cache: CACHE, env: moiTruongNguoiGoi({ coCongCu: true, moi: true }) });
    const bThat = bullets(rThat.tep) || [];
    const { fSach, fMut } = banDotBienDangNhap();
    const rSach = chayNen(dungKho({ config: cfgVoi(LENH_ENV) }), { cache: CACHE, script: fSach, env: moiTruongNguoiGoi({ coCongCu: true, moi: true }) });
    if (rThat.code !== 0 || !bangNhau(bThat, ['không có'])) bad('NEN-ENV4 ban that phai ma 0, mot bullet «không có» khi co ban moi o profile', tomTat(rThat));
    else if (chanKhacNEN0(rThat).length) bad('NEN-ENV4 bon chan khac NEN0', chanKhacNEN0(rThat).join(' '));
    else if (rSach.code !== 0) bad('NEN-ENV4 ban chep hong — luot CHUA TIEM khong xanh', tomTat(rSach));
    else {
      const rMut = chayNen(dungKho({ config: cfgVoi(LENH_ENV) }), { cache: CACHE, script: fMut, env: moiTruongNguoiGoi({ coCongCu: true, moi: true }) });
      const b = bullets(rMut.tep) || [];
      if (rMut.code !== 1) bad('NEN-ENV4 ban dot bien KHONG do — ban moi cua profile khong bi phat hien', tomTat(rMut));
      else if (fm(rMut.tep, 'cong_cu') !== 'xanh') bad('NEN-ENV4 ban dot bien: chan cong_cu phai XANH (cong cu co o ca hai noi)', tomTat(rMut));
      else if (!bangNhau(b, [DONG_ENV_MOI])) bad('NEN-ENV4 tap bullet khac dung mot dong ghim', JSON.stringify(b));
      else ok(`NEN-ENV4 cong cu co o ca hai noi, profile tim ban moi truoc — ban that xanh, dot bien do dung «${DONG_ENV_MOI}»`);
    }
  } catch (e) { bad('NEN-ENV4 khong dung duoc ban dot bien', String(e.message || e)); }
}

// ── NEN-DK* — tệp CÓ ĐIỀU KIỆN của danh sách chép ─────────────────────────────────
// Tập tệp mang thẻ RÚT từ khối INIT-CI-COPY-LIST của kho đang kiểm (bộ đọc độc lập với
// duong-nen.mjs; NEN-DK5 chứng script đọc thẻ từ khối chứ không từ danh sách trong mã).
const khoiInit = (txt) => (txt.split('<<<INIT-CI-COPY-LIST')[1] || '').split('INIT-CI-COPY-LIST>>>')[0];
const theDieuKien = (txt) => {
  const ra = new Map();
  for (const l of khoiInit(txt).split('\n')) {
    const m = l.match(/\$\{CLAUDE_PLUGIN_ROOT\}\/((?:scripts|lib)\/[^`]+)`.*\[only-if-declared: ([a-z_]+)\]\s*$/);
    if (m) ra.set(m[1], m[2]);
  }
  return ra;
};
const THE = theDieuKien(readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8'));
const TEP_THE = [...THE.keys()];
const tepCua = khoa => TEP_THE.filter(t => THE.get(t) === khoa).sort();
const dongDkBoQua = (stderr) => String(stderr || '').split('\n').filter(l => l.startsWith('engine: bo-qua '));
const dongLech = (tep) => (bullets(tep) || []).filter(x => x.startsWith('nen engine: LECH '));
const tepLech = (tep) => dongLech(tep).map(x => x.replace(/^nen engine: LECH (\S+) .*$/, '$1')).sort();
const bangTap = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const dongDkMong = t => `engine: bo-qua ${t} — tệp có điều kiện, kho không khai ${THE.get(t)}`;

let rDK1 = null;
// ── NEN-DK1 (chiều IM) — gỡ MỌI tệp mang thẻ, config không khai ổ cắm → engine xanh, một dòng bo-qua mỗi tệp ──
{
  if (tepCua('tin_hieu').length < 3 || tepCua('lo_trinh').length < 2) bad('NEN-DK1 doi chung: khoi INIT-CI-COPY-LIST rut duoc qua it tep mang the', JSON.stringify([...THE]));
  else {
    const k = dungKho({ bo: TEP_THE });
    rDK1 = chayNen(k, { cache: CACHE });
    const bq = dongDkBoQua(rDK1.stderr);
    if (rDK1.code !== 0) bad('NEN-DK1 tep co dieu kien vang, kho khong khai — phai ma 0', tomTat(rDK1));
    else if (fm(rDK1.tep, 'engine') !== 'xanh') bad('NEN-DK1 chan engine phai xanh', tomTat(rDK1));
    else if (!bangTap(bq, TEP_THE.map(dongDkMong))) bad('NEN-DK1 tap dong bo-qua khac tap tep mang the', JSON.stringify({ bq, can: TEP_THE.map(dongDkMong) }));
    else if (dongDkBoQua(r0.stderr).length) bad('NEN-DK1 doi chung: luot NEN0 (du tep) ma van in bo-qua', dongDkBoQua(r0.stderr).join(' | '));
    else ok(`NEN-DK1 go ${TEP_THE.length} tep mang the, khong khai — engine xanh, ${bq.length} dong «engine: bo-qua …»`);
  }
}

// ── NEN-DK2 (chiều ĐỎ) — cùng kho, khai MỘT ổ cắm → đúng các tệp của ổ đó đỏ, ổ kia vẫn bỏ qua ──
for (const [khoa, them] of [['tin_hieu', 'tin_hieu:\n  nguon: [x]\n  gom: y\n'], ['lo_trinh', 'lo_trinh:\n  tep: x.json\n']]) {
  // Ô dương TRƯỚC chiều đỏ: khai ổ cắm, mọi tệp có mặt và khớp → xanh, không LECH, không bo-qua.
  const rDuong = chayNen(dungKho({ config: CONFIG_LANH + them }), { cache: CACHE });
  const k = dungKho({ bo: TEP_THE, config: CONFIG_LANH + them });
  const r = chayNen(k, { cache: CACHE });
  const khac = TEP_THE.filter(t => THE.get(t) !== khoa);
  if (rDuong.code !== 0 || fm(rDuong.tep, 'engine') !== 'xanh' || dongLech(rDuong.tep).length || dongDkBoQua(rDuong.stderr).length) bad(`NEN-DK2 ${khoa} o duong: khai + du tep phai ma 0, khong LECH, khong bo-qua`, tomTat(rDuong));
  else if (r.code !== 1) bad(`NEN-DK2 ${khoa} khai ma tep vang — phai ma 1`, tomTat(r));
  else if (fm(r.tep, 'engine') !== 'do') bad(`NEN-DK2 ${khoa} chan engine phai do`, tomTat(r));
  else if (!bangTap(tepLech(r.tep), tepCua(khoa))) bad(`NEN-DK2 ${khoa} tap tep LECH khac tap tep the ${khoa}`, JSON.stringify({ lech: tepLech(r.tep), can: tepCua(khoa) }));
  else if (dongLech(r.tep).some(x => !x.endsWith('(vendored ≠ dang-chay)'))) bad(`NEN-DK2 ${khoa} dong LECH khong ghim cap vendored ≠ dang-chay`, JSON.stringify(dongLech(r.tep)));
  else if (!bangTap(dongDkBoQua(r.stderr), khac.map(dongDkMong))) bad(`NEN-DK2 ${khoa} o kia khong con bo-qua dung tap`, JSON.stringify(dongDkBoQua(r.stderr)));
  else ok(`NEN-DK2 khai ${khoa}: du tep → xanh; tep vang — ma 1, LECH dung ${tepCua(khoa).length} tep ${khoa}, ${khac.length} tep o kia van bo-qua`);
}

// ── NEN-DK3 (chiều ĐỎ) — không khai: (a) tệp mang thẻ CÓ mặt mà lệch một byte · (b) gỡ tệp KHÔNG thẻ ──
{
  const tepA = tepCua('tin_hieu')[0];
  const kA = dungKho();
  const fA = path.join(kA.dir, tepA);
  writeFileSync(fA, readFileSync(fA, 'utf8') + '\n// lech mot dong\n');
  git(kA.dir, 'commit', '-qam', 'lech tep co dieu kien');
  const rA = chayNen(kA, { cache: CACHE });
  const tepB = 'scripts/trang-thai-ho-so.cjs';
  const rB = THE.has(tepB) ? null : chayNen(dungKho({ bo: [tepB] }), { cache: CACHE });
  const canA = [`nen engine: LECH ${tepA} (vendored ≠ dang-chay)`], canB = [`nen engine: LECH ${tepB} (vendored ≠ dang-chay)`];
  if (rA.code !== 1 || !bangTap(dongLech(rA.tep), canA)) bad('NEN-DK3a tep mang the co mat ma lech — phai ma 1, dung mot dong LECH', JSON.stringify({ code: rA.code, b: dongLech(rA.tep) }));
  else if (!rB) bad('NEN-DK3b doi chung: trang-thai-ho-so.cjs khong duoc mang the', '');
  else if (rB.code !== 1 || !bangTap(dongLech(rB.tep), canB)) bad('NEN-DK3b go tep KHONG the — phai ma 1, dung mot dong LECH', JSON.stringify({ code: rB.code, b: dongLech(rB.tep) }));
  else ok(`NEN-DK3 khong khai — tep the co mat ma lech: «${canA[0]}»; go tep khong the: «${canB[0]}»`);
}

// ── NEN-DK4 (round-trip) — bản sao ag-root gỡ thẻ khỏi dòng tin-hieu-khoa.cjs → DK1 đỏ đúng tệp đó ──
{
  try {
    const ag = tamDir('duong-nen-ag-dk-');
    for (const d of ['commands', 'lib', 'scripts']) cpSync(path.join(KIT, d), path.join(ag, d), { recursive: true });
    mkdirSync(path.join(ag, 'skills', 'acceptance', 'references'), { recursive: true });
    cpSync(path.join(KIT, 'skills', 'acceptance', 'references', 'duong-nen-template.md'),
      path.join(ag, 'skills', 'acceptance', 'references', 'duong-nen-template.md'));
    const f = path.join(ag, 'commands', 'acceptance-init.md');
    const s0 = readFileSync(f, 'utf8');
    const dong = khoiInit(s0).split('\n').filter(l => l.includes('scripts/tin-hieu-khoa.cjs`') && l.includes('[only-if-declared: tin_hieu]'));
    if (dong.length !== 1) throw new Error(`dong tin-hieu-khoa.cjs mang the khop ${dong.length} lan (can 1)`);
    writeFileSync(f, s0.replace(dong[0], dong[0].replace(/\s*\[only-if-declared: tin_hieu\]\s*$/, '')));
    const r = chayNen(dungKho({ bo: TEP_THE }), { cache: CACHE, agRoot: ag });
    const can = ['nen engine: LECH scripts/tin-hieu-khoa.cjs (vendored ≠ dang-chay)'];
    if (!rDK1 || rDK1.code !== 0) bad('NEN-DK4 doi chung: DK1 (khoi nguyen ven) chua xanh', rDK1 ? tomTat(rDK1) : 'chua chay');
    else if (r.code !== 1 || !bangTap(dongLech(r.tep), can)) bad('NEN-DK4 go the khoi khoi ma script van bo qua — dieu kien khong doc tu khoi', JSON.stringify({ code: r.code, b: dongLech(r.tep) }));
    else ok(`NEN-DK4 go the khoi dong tin-hieu-khoa.cjs trong khoi — «${can[0]}»`);
  } catch (e) { bad('NEN-DK4 khong dung duoc ban sao ag-root', String(e.message || e)); }
}

// ── NEN-DK5 — chẵn lẻ với BỘ NẠP THẬT: trên mọi biến thể config, khi các tệp mang thẻ vắng,
// «đường nền xanh» ⇒ «product-map.mjs vendored chạy được». Phép thử `^khoá:` là xấp xỉ DƯỚI: đã bỏ
// qua thì bộ nạp chắc chắn không cần (product-map chỉ đọc khối cột 0); thừa đỏ thì được, xanh giả thì
// không. Đột biến trên bản sao: `khoKhai` luôn false → biến thể khai đủ: đường nền xanh mà product-map
// chết → CHÍNH phép đo đỏ nêu biến thể. Đối chứng đỏ của bộ nạp: gỡ thêm trang-thai-ho-so.cjs.
const pmChay = (dir) => spawnSync(process.execPath, [path.join(dir, 'scripts', 'product-map.mjs'), '--root', dir], { encoding: 'utf8' });
const pmSong = r => r.status === 0 && !/MODULE_NOT_FOUND|Cannot find module|thiếu scripts\//.test(r.stderr);
const BIEN_THE = [
  ['khong-khai', CONFIG_LANH],
  ['chu-thich', CONFIG_LANH + '# tin_hieu:\n# lo_trinh:\n#   tep: x.json\n'],
  ['thut-trong-khoi-khac', CONFIG_LANH + '  tin_hieu: thut\n  lo_trinh: thut\n'],
  ['khai-du', CONFIG_LANH + 'lo_trinh:\n  tep: x.json\ntin_hieu:\n  nguon: [x]\n  gom: y\n'],
];
function doChanLe(script) {
  const loi = [], bang = [];
  for (const [ten, cfg] of BIEN_THE) {
    const k = dungKho({ bo: TEP_THE, config: cfg });
    const r = chayNen(k, { cache: CACHE, ...(script ? { script } : {}) });
    const xanh = fm(r.tep, 'engine') === 'xanh';
    const pm = pmChay(k.dir);
    bang.push(`${ten}: engine ${fm(r.tep, 'engine')} · product-map ${pm.status}`);
    if (xanh && !pmSong(pm)) loi.push(`${ten}: đường nền xanh mà product-map vendored chết (mã ${pm.status})`);
  }
  return { loi, bang };
}
{
  try {
    const that = doChanLe(null);
    const soXanh = that.bang.filter(b => b.includes('engine xanh')).length;
    const kDo = dungKho({ bo: [...TEP_THE, 'scripts/trang-thai-ho-so.cjs'] });
    const rDo = pmChay(kDo.dir);
    const d = tamDir('duong-nen-mut-dk-');
    cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
    const f = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
    const src = readFileSync(f, 'utf8');
    const muiTiem = "const khoKhai = khoa => new RegExp(`^${khoa}:`, 'm').test(configText);";
    if (src.split(muiTiem).length !== 2) throw new Error('mui tiem khoKhai khop khac 1 lan');
    writeFileSync(f, src.replace(muiTiem, 'const khoKhai = () => false;'));
    const dot = doChanLe(f);
    if (that.loi.length) bad('NEN-DK5 duong nen xanh ma bo nap that chet', that.loi.join(' | '));
    else if (soXanh < 3 || !that.bang.some(b => b.startsWith('khai-du: engine do'))) bad('NEN-DK5 doi chung: ma tran khong trai du hai mau', that.bang.join(' ; '));
    else if (pmSong(rDo) || !/trang-thai-ho-so\.cjs/.test(rDo.stderr)) bad('NEN-DK5 doi chung do cua bo nap: go tep khong the ma product-map khong chet neu ten', `ma ${rDo.status}`);
    else if (!dot.loi.some(l => l.startsWith('khai-du: đường nền xanh mà product-map vendored chết'))) bad('NEN-DK5 dot bien khoKhai-luon-false ma phep do chan le khong do', dot.loi.join(' | ') || dot.bang.join(' ; '));
    else ok(`NEN-DK5 chan le voi product-map — ${that.bang.join(' ; ')}; dot bien khoKhai luon false → «${dot.loi[0]}»`);
  } catch (e) { bad('NEN-DK5 khong dung duoc ca chan le', String(e.message || e)); }
}

// ── NEN-DK6 — không mục KHÔNG thẻ nào của danh sách nạp TĨNH một tệp mang thẻ ──
// Nạp được phép: `await import(` (nhánh có điều kiện) hoặc `require` bọc `try {` cùng dòng (nạp khoan
// dung). Đối chứng đỏ: bản sao product-map tiêm một dòng import tĩnh → phép quét nêu đúng tệp và dòng.
function quetNapTinh(goc, chiSo) {
  const ten = TEP_THE.map(t => path.basename(t));
  const khongThe = [...khoiInit(readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8')).matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/((?:scripts|lib)\/[^`]+)`/g)]
    .map(m => m[1]).filter(t => !THE.has(t));
  const loi = [];
  for (const t of khongThe) {
    const dong = readFileSync(chiSo[t] || path.join(goc, t), 'utf8').split('\n');
    dong.forEach((l, n) => {
      const cham = ten.find(b => l.includes(`'./${b}'`) || l.includes(`"./${b}"`) || l.includes(`'${b}'`) || l.includes(`"${b}"`));
      if (!cham || !/\bimport\b|\brequire\(/.test(l)) return;
      if (l.includes('await import(') || (l.includes('require(') && l.includes('try {'))) return;
      loi.push(`${t}:${n + 1} nạp tĩnh ${cham}`);
    });
  }
  return { loi, soTep: khongThe.length };
}
{
  try {
    const that = quetNapTinh(KIT, {});
    const d = tamDir('duong-nen-nap-');
    const src = readFileSync(path.join(KIT, 'scripts', 'product-map.mjs'), 'utf8');
    writeFileSync(path.join(d, 'pm.mjs'), src.replace("import { createRequire } from 'node:module';\n", "import { createRequire } from 'node:module';\nimport { docPhamVi } from './cat-luot.mjs';\n"));
    const dot = quetNapTinh(KIT, { 'scripts/product-map.mjs': path.join(d, 'pm.mjs') });
    if (that.loi.length) bad('NEN-DK6 muc khong the nap tinh tep mang the', that.loi.join(' | '));
    else if (that.soTep < 10) bad('NEN-DK6 doi chung: rut duoc qua it muc khong the', String(that.soTep));
    else if (!dot.loi.some(l => /^scripts\/product-map\.mjs:\d+ nạp tĩnh cat-luot\.mjs$/.test(l))) bad('NEN-DK6 dot bien import tinh ma phep quet khong neu', dot.loi.join(' | ') || 'im');
    else ok(`NEN-DK6 ${that.soTep} muc khong the khong nap tinh tep mang the; dot bien → «${dot.loi.find(l => l.includes('cat-luot'))}»`);
  } catch (e) { bad('NEN-DK6 khong dung duoc phep quet', String(e.message || e)); }
}

// ══ NEN-TV* — hồ sơ nen-khong-tinh-tep-cua-vong: dòng của CHÍNH vòng vào mục «Dòng vàng» ══════════
const TCV = path.join(KIT, 'feature-loop', 'scripts', 'lib', 'tep-cua-vong.mjs');
const napTcv = async () => { try { return await import(TCV); } catch (e) { return { loi: String(e.message || e) }; } };

// ── NEN-TV8 — phát lại 230 dòng CAY BAN lịch sử thật qua CHÍNH vị từ (AC-10) ──
{
  const TSV = path.join(KIT, 'tests', 'scripts', 'fixtures', 'duong-nen-cay-ban-lich-su.tsv');
  const mod = await napTcv();
  const dong = existsSync(TSV) ? readFileSync(TSV, 'utf8').split('\n').filter(l => l && !l.startsWith('#')) : [];
  if (mod.loi || typeof mod.tepCuaVong !== 'function') bad('NEN-TV8 khong nap duoc lib/tep-cua-vong.mjs', mod.loi || 'thieu tepCuaVong');
  else if (dong.length !== 230) bad('NEN-TV8 tep du lieu phai co dung 230 dong', `${dong.length}`);
  else {
    const dem = {}; const goc = [];
    for (const l of dong) {
      const [slug, lop, duong] = l.split('\t');
      const v = mod.tepCuaVong(duong, slug, () => false);
      const k = `${lop}:${v ? 'vang' : 'do'}`; dem[k] = (dem[k] || 0) + 1;
      if (slug === 'dai-luu-tru-dung-chung') goc.push(v);
    }
    const mong = { 'GIA-S1:vang': 197, 'KHAC:vang': 3, 'KHAC:do': 26, 'CAT:do': 4 };
    const lech = Object.keys({ ...mong, ...dem }).filter(k => dem[k] !== mong[k]);
    if (lech.length) bad('NEN-TV8 dem lop lech', `${JSON.stringify(dem)} — mong ${JSON.stringify(mong)}`);
    else if (goc.length !== 7 || goc.some(x => !x)) bad('NEN-TV8 ca Goc dai-luu-tru-dung-chung phai 7/7 vang', JSON.stringify(goc));
    else ok(`NEN-TV8 phat lai 230 dong lich su — ${JSON.stringify(dem)}, ca Goc 7/7 vang`);
  }
}
// ── NEN-TV8b — slug có dấu chấm thoát regex; thư mục có sẵn ở HEAD; tiền tố VIOLATION phải có «]:» ──
{
  const mod = await napTcv();
  if (mod.loi || typeof mod.tepCuaVong !== 'function' || typeof mod.viPhamCuaVong !== 'function') bad('NEN-TV8b khong nap duoc vi tu', mod.loi || 'thieu ham');
  else {
    const o = [
      [mod.tepCuaVong('_acceptance/a.b/contract.md', 'a.b', () => true), true, 'ho so cua vong (ke ca khi da co o HEAD)'],
      [mod.tepCuaVong('docs/superpowers/specs/2026-10-14-a.b-design.md', 'a.b', () => false), true, 'spec khuon ten'],
      [mod.tepCuaVong('docs/superpowers/plans/2026-10-14-a.b.md', 'a.b', () => false), true, 'plan khuon ten'],
      [mod.tepCuaVong('docs/superpowers/specs/2026-10-14-aXb-design.md', 'a.b', () => false), false, 'a.b khong khop aXb'],
      [mod.tepCuaVong('_acceptance/a.b-2/x.md', 'a.b', () => false), false, 'tien to thu muc ho so'],
      [mod.tepCuaVong('_acceptance/config.yaml', 'a.b', () => true), true, 'config.yaml'],
      [mod.tepCuaVong('apps/api/x.ts', 'api', d => d === 'apps/api'), false, 'thu muc co san o HEAD'],
      [mod.tepCuaVong('apps/proto/api/x.ts', 'api', d => d === 'apps/api'), true, 'thu muc moi bang slug'],
      [mod.tepCuaVong('README.md', 'a.b', () => false), false, 'tep thuong'],
      [mod.viPhamCuaVong('VIOLATION [a.b]: x', 'a.b'), true, 'vi pham cua vong'],
      [mod.viPhamCuaVong('VIOLATION [a.b-2]: x', 'a.b'), false, 'vi pham tien to slug'],
      [mod.viPhamCuaVong('VIOLATION [demo]: x _acceptance/a.b/ y', 'a.b'), false, 'slug giua dong'],
    ];
    const sai = o.filter(([got, want]) => got !== want).map(([, , ten]) => ten);
    if (sai.length) bad('NEN-TV8b vi tu sai o', sai.join(', '));
    else ok(`NEN-TV8b vi tu dung ${o.length}/${o.length} o (slug co dau cham, thu muc co san, tien to VIOLATION)`);
  }
}

// ── NEN-TV7 — khuôn mục «Dòng vàng» một nguồn: rỗng → «không có»; mã/khối vắng → mã 2, không ghi tệp (AC-6) ──
{
  const ag = tamDir('duong-nen-ag-tv7-');
  for (const d of ['skills', 'commands', 'lib', 'scripts']) cpSync(path.join(KIT, d), path.join(ag, d), { recursive: true });
  const KHUON = path.join(ag, 'skills', 'acceptance', 'references', 'duong-nen-template.md');
  const goc = readFileSync(KHUON, 'utf8');
  const loi = [];
  const ka = dungKho(); const ra = chayNen(ka, { cache: CACHE, agRoot: ag });
  if (ra.code !== 0) loi.push(`(a) kho lanh tren ag ban sao phai ma 0: ${tomTat(ra)}`);
  else if (JSON.stringify(bulletsVang(ra.tep)) !== JSON.stringify(['không có'])) loi.push(`(a) muc vang phai dung «không có»: ${JSON.stringify(bulletsVang(ra.tep))}`);
  else if (/DUONG-NEN-/.test(ra.tep)) loi.push('(a) dong marker lot vao tep');
  const tiem = (ten, re, can) => {
    const n = (goc.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || []).length;
    if (n !== 1) { loi.push(`(${ten}) cho tiem lech: khop ${n} lan`); return; }
    writeFileSync(KHUON, goc.replace(re, ''));
    const k = dungKho(); const r = chayNen(k, { cache: CACHE, agRoot: ag });
    writeFileSync(KHUON, goc);
    if (r.code !== 2) loi.push(`(${ten}) phai ma 2: ${tomTat(r)}`);
    else if (!r.stderr.includes(can)) loi.push(`(${ten}) stderr thieu «${can}»: ${r.stderr.slice(-300)}`);
    else if (existsSync(r.tepPath)) loi.push(`(${ten}) van ghi duong-nen.md`);
  };
  tiem('b', /^- suite-tep-cua-vong: .*\n/m, 'khuôn dòng vàng thiếu mã «suite-tep-cua-vong»');
  tiem('c', /<!-- <<<DUONG-NEN-DONG-VANG -->[\s\S]*?<!-- DUONG-NEN-DONG-VANG>>> -->\n?/, 'DUONG-NEN-DONG-VANG');
  tiem('d', /^- luoi-cua-vong: .*\n/m, 'khuôn dòng vàng thiếu mã «luoi-cua-vong»');
  if (loi.length) bad('NEN-TV7 khuon dong vang', loi.join(' | '));
  else ok('NEN-TV7 muc vang rong → «không có»; go ma suite-tep-cua-vong / luoi-cua-vong / ca khoi → ma 2, khong ghi tep');
}

// Bản GỐC v2.30.0 cho chiều đỏ của các ca NEN-TV: rút TRỌN thư mục bằng git archive (không chép danh
// sách tệp tay — luật «bản base lấy trọn thư mục»). Không rút được (clone nông, thiếu tag) → ca nói ra.
const BAN_GOC = (() => {
  const d = tamDir('duong-nen-goc-');
  try {
    execFileSync('bash', ['-c', `git -C "$1" archive v2.30.0 feature-loop skills commands lib scripts | tar -x -C "$2"`, '_', KIT, d], { stdio: ['ignore', 'ignore', 'pipe'] });
    return { dir: d, script: path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs') };
  } catch (e) { return { loi: String(e.stderr || e.message || e).split('\n')[0] }; }
})();
const SL = 'vong-thu';
const tap = a => JSON.stringify([...(a || [])].sort());
const cb = t => `nen suite: CAY BAN SAU SUITE ${t}`;
const tv = t => `nen suite: TEP CUA VONG ${t} (khong tinh)`;
const ghi = (...ds) => ds.map(d => `mkdir -p "$(dirname '${d}')" && echo x > '${d}'\n`).join('');
// Mỗi ca: dựng kho (một hàm), kiểm (một hàm trả chuỗi lỗi hoặc null) — NEN-TV6 chạy lại đúng hai hàm
// ấy trên bản sao đột biến, nên phép đo của đột biến là CHÍNH phép đo của ca.
const KHO_TV = {
  tv1: () => dungKho({ giuaA: ghi(`_acceptance/${SL}/contract.md`, `_acceptance/${SL}/decisions.jsonl`) }),
  tv2: () => dungKho({ giuaA: ghi(`docs/superpowers/specs/2026-10-14-${SL}-design.md`, `docs/superpowers/plans/2026-10-14-${SL}.md`) + "printf 'them: 1\\n' >> _acceptance/config.yaml\n" }),
  tv3a: () => dungKho({ giuaA: ghi(`apps/proto/${SL}/index.tsx`) }),
  tv3b: () => dungKho({ coSan: [`goi/${SL}/giu.txt`], giuaA: ghi(`goi/${SL}/rac.txt`) }),
  tv4: () => dungKho({ giuaA: 'echo sua >> README.md\n' + ghi(`_acceptance/${SL}/a.md`, '_acceptance/demo/rac.md', `_acceptance/${SL}-2/a.md`, `docs/superpowers/specs/2026-10-14-${SL}x-design.md`) }),
};
const vangXanh = (r, want) => {
  if (r.code !== 0 || fm(r.tep, 'nen') !== 'xanh' || fm(r.tep, 'suite') !== 'xanh') return `phai ma 0, nen/suite xanh: ${tomTat(r)}`;
  if (tap(bullets(r.tep)) !== tap(['không có'])) return `dong do phai «không có»: ${JSON.stringify(bullets(r.tep))}`;
  if (tap(bulletsVang(r.tep)) !== tap(want)) return `tap dong vang ${JSON.stringify(bulletsVang(r.tep))} ≠ ${JSON.stringify(want)}`;
  return null;
};
const KIEM_TV = {
  tv1: r => vangXanh(r, [tv(`_acceptance/${SL}/contract.md`), tv(`_acceptance/${SL}/decisions.jsonl`)]),
  tv2: r => vangXanh(r, [tv(`docs/superpowers/specs/2026-10-14-${SL}-design.md`), tv(`docs/superpowers/plans/2026-10-14-${SL}.md`), tv('_acceptance/config.yaml')]),
  tv3a: r => vangXanh(r, [tv(`apps/proto/${SL}/index.tsx`)]),
  tv3b: r => {
    if (r.code !== 1 || fm(r.tep, 'suite') !== 'do') return `thu muc co san phai ma 1, suite do: ${tomTat(r)}`;
    if (tap(bullets(r.tep)) !== tap([cb(`goi/${SL}/rac.txt`)])) return `tap dong do ${JSON.stringify(bullets(r.tep))}`;
    if (tap(bulletsVang(r.tep)) !== tap(['không có'])) return `muc vang phai «không có»: ${JSON.stringify(bulletsVang(r.tep))}`;
    return null;
  },
  tv4: r => {
    if (r.code !== 1 || fm(r.tep, 'suite') !== 'do') return `lan voi do that phai ma 1, suite do: ${tomTat(r)}`;
    const wantDo = [cb('README.md'), cb('_acceptance/demo/rac.md'), cb(`_acceptance/${SL}-2/a.md`), cb(`docs/superpowers/specs/2026-10-14-${SL}x-design.md`)];
    if (tap(bullets(r.tep)) !== tap(wantDo)) return `tap dong do ${JSON.stringify(bullets(r.tep))} ≠ ${JSON.stringify(wantDo)}`;
    if (tap(bulletsVang(r.tep)) !== tap([tv(`_acceptance/${SL}/a.md`)])) return `tap dong vang ${JSON.stringify(bulletsVang(r.tep))}`;
    return null;
  },
};
const chayTV = (ca, o = {}) => chayNen(KHO_TV[ca](), { cache: CACHE, slug: SL, ...o });
// Chiều đỏ trên bản gốc: ca mà bản gốc cũng xanh thì phép đo không phân biệt được gì.
const docGoc = ca => {
  if (BAN_GOC.loi) return `ban goc v2.30.0 khong rut duoc (${BAN_GOC.loi})`;
  const r = chayTV(ca, { script: BAN_GOC.script, agRoot: BAN_GOC.dir });
  return r.code === 1 && (bullets(r.tep) || []).some(l => l.startsWith('nen suite: CAY BAN SAU SUITE ')) ? null : `ban goc khong do — phep do khong phan biet: ${tomTat(r)}`;
};
for (const [ten, cas, goc] of [['NEN-TV1', ['tv1'], true], ['NEN-TV2', ['tv2'], true], ['NEN-TV3', ['tv3a'], true], ['NEN-TV3', ['tv3b'], false], ['NEN-TV4', ['tv4'], false]]) {
  const ca = cas[0];
  const loi = KIEM_TV[ca](chayTV(ca)) || (goc ? docGoc(ca) : null);
  if (loi) bad(`${ten} (${ca})`, loi);
  else ok(`${ten} (${ca}) ${{ tv1: 'hai tep moi duoi _acceptance/<slug>/ → nen xanh, hai dong TEP CUA VONG; ban goc do', tv2: 'spec + plan khuon ten + config.yaml → vang; ban goc do', tv3a: 'thu muc moi bang slug → vang; ban goc do', tv3b: 'thu muc bang slug CO SAN o HEAD → do «CAY BAN SAU SUITE goi/<slug>/rac.txt»', tv4: 'bon tep khong cua vong van do (dang thuc tap), dong vang khong che dong do' }[ca]}`);
}

// ── NEN-TV5 — chân lưới: vi phạm của CHÍNH hồ sơ vào mục vàng khi lưới tự giải thích mã thoát (AC-5) ──
// Suite ghi hồ sơ của vòng `status: verified` thiếu evidence → lưới trước-merge THẬT gọi tên nó.
const ghiHoSoVong = `mkdir -p '_acceptance/${SL}' && cp "$NEN_DAU/hs.md" '_acceptance/${SL}/contract.md'\n`;
const datHs = k => { writeFileSync(path.join(k.dau, 'hs.md'), hoSoViPham(SL)); return k; };
const viVong = l => l.startsWith(`VIOLATION [${SL}]:`);
Object.assign(KHO_TV, {
  tv5a: () => datHs(dungKho({ giuaA: ghiHoSoVong })),
  tv5b: () => dungKho({ noLuoi: true }),
  tv5c: () => datHs(dungKho({ noLuoi: true, giuaA: ghiHoSoVong })),
  tv5d: () => dungKho({ thayLuoi: `#!/usr/bin/env bash\necho "VIOLATION [${SL}]: luoi gia"\nkhong-co-lenh-nay-${SL}\nexit 1\n` }),
  tv5e: () => dungKho({ noLuoi: true, noLuoiSlug: `${SL}-2` }),
});
Object.assign(KIEM_TV, {
  tv5a: r => {
    if (r.code !== 0 || fm(r.tep, 'luoi') !== 'xanh') return `chi vi pham cua vong phai ma 0, luoi xanh: ${tomTat(r)}`;
    const v = bulletsVang(r.tep) || [];
    if (!v.includes('nen luoi: 1 vi pham cua chinh vong (khong tinh)') || v.filter(viVong).length !== 1) return `muc vang thieu dong luoi: ${JSON.stringify(v)}`;
    if ((bullets(r.tep) || []).some(l => l.includes('LOI CHAY'))) return 'lot LOI CHAY';
    return null;
  },
  tv5b: r => {
    const d = bullets(r.tep) || [];
    if (r.code !== 1 || fm(r.tep, 'luoi') !== 'do') return `ho so khac vi pham phai ma 1, luoi do: ${tomTat(r)}`;
    if (!d.includes('nen luoi: 1 vi pham co san') || d.filter(l => l.startsWith('VIOLATION [no-cu]:')).length !== 1) return `dong do luoi: ${JSON.stringify(d)}`;
    return null;
  },
  tv5c: r => {
    const d = bullets(r.tep) || []; const v = bulletsVang(r.tep) || [];
    if (r.code !== 1 || fm(r.tep, 'luoi') !== 'do') return `ca hai phai ma 1, luoi do: ${tomTat(r)}`;
    if (!d.includes('nen luoi: 1 vi pham co san') || d.some(viVong)) return `dong do phai dem dung 1, khong lan vi pham cua vong: ${JSON.stringify(d)}`;
    if (v.filter(viVong).length !== 1) return `vi pham cua vong phai o muc vang: ${JSON.stringify(v)}`;
    return null;
  },
  tv5d: r => {
    const d = bullets(r.tep) || [];
    if (r.code !== 1 || fm(r.tep, 'luoi') !== 'do') return `luoi chet sau khi in vi pham phai ma 1, luoi do: ${tomTat(r)}`;
    if (!d.includes('nen luoi: LOI CHAY ma 1')) return `thieu «nen luoi: LOI CHAY ma 1»: ${JSON.stringify(d)}`;
    return null;
  },
  tv5e: r => {
    const d = bullets(r.tep) || [];
    if (r.code !== 1 || fm(r.tep, 'luoi') !== 'do') return `ho so tien to slug phai ma 1, luoi do: ${tomTat(r)}`;
    if (!d.includes('nen luoi: 1 vi pham co san') || d.filter(l => l.startsWith(`VIOLATION [${SL}-2]:`)).length !== 1) return `dong do: ${JSON.stringify(d)}`;
    if (tap(bulletsVang(r.tep)) !== tap(['không có'])) return `vi pham [${SL}-2] lot vao muc vang: ${JSON.stringify(bulletsVang(r.tep))}`;
    return null;
  },
});
{
  // Fixture phải sống: lưới THẬT trên kho tv5a sau khi chép hồ sơ phải gọi tên hồ sơ của vòng.
  const k = KHO_TV.tv5a();
  const p = path.join(k.dir, '_acceptance', SL); mkdirSync(p, { recursive: true });
  writeFileSync(path.join(p, 'contract.md'), hoSoViPham(SL));
  const base = git(k.dir, 'merge-base', 'main', 'HEAD');
  const lr = spawnSync('bash', [path.join(k.dir, 'scripts', 'pre-merge-check.sh'), k.dir, '--base', base, '--no-t1-escape'], { encoding: 'utf8' });
  const song = `${lr.stdout}${lr.stderr}`.split('\n').some(viVong);
  if (!song) bad('NEN-TV5 fixture: luoi that khong thay ho so cua vong', `${lr.status} ${(lr.stdout || '').slice(-300)}`);
  else for (const ca of ['tv5a', 'tv5b', 'tv5c', 'tv5d', 'tv5e']) {
    const loi = KIEM_TV[ca](chayTV(ca));
    if (loi) bad(`NEN-TV5 (${ca})`, loi);
    else ok(`NEN-TV5 (${ca}) ${{ tv5a: 'chi vi pham cua vong → luoi xanh, dong luoi o muc vang', tv5b: 'ho so khac vi pham → do nhu truoc vong', tv5c: 'ca hai → do dem dung 1, vi pham cua vong o muc vang', tv5d: 'luoi chet sau khi in vi pham cua vong → LOI CHAY ma 1', tv5e: 'ho so tien to slug → do, khong lot vao vang' }[ca]}`);
  }
}

// ── NEN-TV6 — bốn đột biến trên bản sao vị từ; phép đo là CHÍNH hàm kiểm của TV1/TV4/TV3b/TV5e (AC-8) ──
{
  const sao = tamDir('duong-nen-dot-bien-');
  cpSync(path.join(KIT, 'feature-loop', 'scripts'), path.join(sao, 'scripts'), { recursive: true });
  const LIB = path.join(sao, 'scripts', 'lib', 'tep-cua-vong.mjs');
  const goc = readFileSync(LIB, 'utf8');
  const script = path.join(sao, 'scripts', 'duong-nen.mjs');
  const loi = [];
  const MO_HAM = 'export function tepCuaVong(duong, slug, coOHead) {\n';
  const DOT = [
    ['a', 'tv1', MO_HAM, MO_HAM + '  return false;\n', `_acceptance/${SL}/contract.md`],
    ['b', 'tv4', MO_HAM, MO_HAM + '  return true;\n', 'README.md'],
    ['c', 'tv3b', " && !coOHead(doan.slice(0, i + 1).join('/'))", '', `goi/${SL}/rac.txt`],
    ['d', 'tv5e', '`VIOLATION [${slug}]:`', '`VIOLATION [${slug}`', `[${SL}-2]`],
  ];
  // Bản lành (bản sao chưa tiêm) chạy trước trên cùng bốn kho: bốn hàm kiểm phải trả null.
  for (const [ten, ca] of DOT) { const e = KIEM_TV[ca](chayTV(ca, { script })); if (e) loi.push(`(${ten}) ban lanh khong xanh: ${e}`); }
  if (!loi.length) for (const [ten, ca, tim, thay, can] of DOT) {
    const n = goc.split(tim).length - 1;
    if (n !== 1) { loi.push(`(${ten}) cho tiem lech: khop ${n} lan`); continue; }
    writeFileSync(LIB, goc.replace(tim, thay));
    const e = KIEM_TV[ca](chayTV(ca, { script }));
    writeFileSync(LIB, goc);
    if (!e) loi.push(`(${ten}) dot bien ma phep do ${ca} van xanh`);
    else if (!e.includes(can)) loi.push(`(${ten}) phep do do nhung khong neu «${can}»: ${e.slice(0, 200)}`);
  }
  if (loi.length) bad('NEN-TV6 dot bien', loi.join(' | '));
  else ok('NEN-TV6 ban lanh xanh; bon dot bien (luon sai · luon dung · bo ve HEAD · bo «]») deu do dung ten tep/ho so');
}

// ── NEN-TT* — từ đầu là ĐƯỜNG TỆP thì xét tệp có tồn tại, không xét quyền chạy ───────
// Hồ sơ cong-cu-xet-tep-ton-tai. Khuôn của `executors.design.ui_check` là một đường tệp .js
// không có quyền chạy; `command -v` trên nó thoát 1 nên chân công cụ đỏ «THIEU» dù tệp có
// trên đĩa. Hai lượt trên fixture lành của NEN0: «có» (mọi khoá trỏ tệp có thật — chân phải
// XANH, mã 0) và «vắng» (tập bullet so BẰNG NHAU với tập viết trước). Mỗi lượt có khoá đối
// chứng bỏ-tra; đường nền chạy từ một cwd KHÁC gốc kho, PATH thêm một thư mục tạm.
const TT_DOI_CHUNG = 'cong-cu: bo qua executors.script.tt_doi_chung — tu dau «${X_KHONG_CO:-git}» dung cu phap shell, khong phai ten chuong trinh';
const TT_KHUON = '${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js';
const DONG_TT_KHUON = `cong-cu: bo qua executors.script.tt_khuon — tu dau «${TT_KHUON}» dung cu phap shell, khong phai ten chuong trinh`;
// Ngoài mọi kho: tệp tuyệt đối không quyền chạy (đúng hình dạng sự cố), thư mục PATH, cwd người gọi.
const ttNgoai = tamDir('duong-nen-tt-ngoai-');
mkdirSync(path.join(ttNgoai, 'scripts'));
const TT_TUYET_DOI = path.join(ttNgoai, 'scripts', 'design-scan.js');
writeFileSync(TT_TUYET_DOI, '// tay cam bo kiem giao dien\n');
chmodSync(TT_TUYET_DOI, 0o644);
const TT_VANG = path.join(ttNgoai, 'khong-co', 'design-scan.js');
const ttBin = tamDir('duong-nen-tt-bin-');
writeFileSync(path.join(ttBin, 'cong-cu-tt-path.mjs'), '#!/bin/sh\nexit 0\n');
chmodSync(path.join(ttBin, 'cong-cu-tt-path.mjs'), 0o755);
const ttCwd = tamDir('duong-nen-tt-cwd-');
const TT_ENV = { PATH: `${ttBin}${path.delimiter}${process.env.PATH}` };
const TT_CO_SAN = ['tools/kiem-giao-dien.js', 'kiem-goc.js', 'kiem-goc.mjs', 'kiem-goc.cjs'];

const TT_CO = {
  design: { ui_check: TT_TUYET_DOI },
  script: {
    tt_tuong_doi_co: 'tools/kiem-giao-dien.js --x',
    tt_tran_js: 'kiem-goc.js',
    tt_tran_mjs: 'kiem-goc.mjs',
    tt_tran_cjs: 'kiem-goc.cjs',
    tt_tran_path: 'cong-cu-tt-path.mjs --x',
    tt_khuon: TT_KHUON,
  },
};
const TT_KHOA_CO = ['executors.design.ui_check', ...['tt_tuong_doi_co', 'tt_tran_js', 'tt_tran_mjs', 'tt_tran_cjs', 'tt_tran_path'].map(k => `executors.script.${k}`)];
const TT_VANG_KHOA = {
  script: {
    tt_tuyet_doi_vang: TT_VANG,
    tt_tuong_doi_vang: 'tools/vang.mjs',
    tt_thu_muc: 'tools/',
    tt_tran_vang: 'khong-co-tt-vang.mjs',
    tt_ten_vang: 'khong-co-that-tt --x',
  },
};
const MONG_VANG = {
  tt_tuyet_doi_vang: `nen cong-cu: THIEU ${TT_VANG} (khoa executors.script.tt_tuyet_doi_vang)`,
  tt_tuong_doi_vang: 'nen cong-cu: THIEU tools/vang.mjs (khoa executors.script.tt_tuong_doi_vang)',
  tt_thu_muc: 'nen cong-cu: THIEU tools/ (khoa executors.script.tt_thu_muc)',
  tt_tran_vang: 'nen cong-cu: THIEU khong-co-tt-vang.mjs (khoa executors.script.tt_tran_vang)',
};
const MONG_TEN = 'nen cong-cu: THIEU khong-co-that-tt (khoa executors.script.tt_ten_vang)';

/**
 * chayTT(nhom, { script }) — fixture lành của NEN0 thêm các nhóm executor đã cho ({ nhóm: { khoá: lệnh } })
 * cùng khoá đối chứng `script.tt_doi_chung`, và bốn tệp TT_CO_SAN ở nhánh gốc. Round-trip TRƯỚC khi
 * chạy: mọi khoá phải được `resolveConfigKey` đọc lại đúng lệnh; lệch → { lech } và ca tự đỏ.
 */
function chayTT(nhom, o = {}) {
  const tat = { ...nhom, script: { ...(nhom.script || {}), tt_doi_chung: DOI_CHUNG } };
  const khoi = Object.entries(tat).map(([n, ks]) => `  ${n}:\n${Object.entries(ks).map(([k, v]) => `    ${k}: ${JSON.stringify(v)}\n`).join('')}`).join('');
  const config = CONFIG_LANH.replace('feature_loop:\n', `${khoi}feature_loop:\n`);
  const lech = Object.entries(tat).flatMap(([n, ks]) => Object.entries(ks)
    .filter(([k, v]) => resolveConfigKey(config, `executors.${n}.${k}`) !== v).map(([k]) => `${n}.${k}`));
  if (lech.length) return { lech };
  const r = chayNen(dungKho({ config, coSan: TT_CO_SAN }), { cache: CACHE, script: o.script, cwd: ttCwd, env: TT_ENV });
  const dc = boQuaKhoa(r.stderr, 'executors.script.tt_doi_chung');
  return { lech, r, doiChung: dc.length === 1 && dc[0] === TT_DOI_CHUNG ? null : JSON.stringify(dc) };
}
const tienDeTT = x => (x.lech.length ? `fixture khong round-trip: ${x.lech.join(',')}`
  : x.doiChung ? `doi chung: khong thay dung 1 dong bo-tra nguyen van cho tt_doi_chung ${x.doiChung}` : null);
// Mỗi hàm trả null khi đạt, chuỗi lý do khi không — dùng lại ở NEN-TT5 trên bản sao.
const KIEM_TT = {
  co: (x) => {
    const e = tienDeTT(x); if (e) return e;
    const b = bulletCongCuMoi(x.r.tep);
    if (b.length) return `luot «co» van co bullet cong-cu ${JSON.stringify(b)}`;
    const roi = TT_KHOA_CO.filter(k => boQuaKhoa(x.r.stderr, k).length);
    if (roi.length) return `khoa roi vao nhanh bo-tra: ${roi.join(',')}`;
    if (x.r.code !== 0 || fm(x.r.tep, 'cong_cu') !== 'xanh') return `luot «co» phai ma 0 va chan cong_cu xanh — ${tomTat(x.r)}`;
    return null;
  },
  vang: (x) => {
    const e = tienDeTT(x); if (e) return e;
    const b = bulletCongCuMoi(x.r.tep);
    const sai = Object.entries(MONG_VANG).filter(([k, can]) =>
      JSON.stringify(b.filter(l => l.endsWith(`(khoa executors.script.${k})`))) !== JSON.stringify([can])).map(([k]) => k);
    if (sai.length) return `khoa khong co dung mot bullet ghim: ${sai.join(',')} — ${JSON.stringify(b)}`;
    if (x.r.code !== 1 || fm(x.r.tep, 'cong_cu') !== 'do') return `luot «vang» phai ma 1 va chan cong_cu do — ${tomTat(x.r)}`;
    return null;
  },
};

const xCo = chayTT(TT_CO);
const xVang = chayTT(TT_VANG_KHOA);

// ── NEN-TT1 — lượt «có»: tệp có thật, không quyền chạy → chân XANH, mã 0 ──────────
{
  const che = statSync(TT_TUYET_DOI).mode & 0o111;
  const cv = spawnSync('bash', ['-c', 'command -v "$1"', '_', TT_TUYET_DOI], { stdio: 'ignore' }).status;
  const e = KIEM_TT.co(xCo);
  if (che !== 0) bad('NEN-TT1 tien de: tep tuyet doi co quyen chay — ca khong do dung su co', che.toString(8));
  else if (cv === 0) bad('NEN-TT1 tien de: command -v tren tep tuyet doi thoat 0 — luat cu cung xanh, ca khong phan biet', String(cv));
  else if (e) bad('NEN-TT1', e);
  else ok('NEN-TT1 luot «co» (ui_check tuyet doi, tuong doi, ten tran .js/.mjs/.cjs o goc kho, .mjs tren PATH) — ma 0, cong_cu xanh, 0 bullet, 0 dong bo-tra (doi chung: dung 1 dong; command -v tren tep tuyet doi thoat khac 0)');
}

// ── NEN-TT2 — lượt «vắng»: đường không trỏ tệp thường → ĐỎ, mỗi khoá đúng một bullet ──
{
  const e = KIEM_TT.vang(xVang);
  if (e) bad('NEN-TT2', e);
  else ok('NEN-TT2 luot «vang» — ma 1, cong_cu do, tuyet doi vang / tuong doi vang / thu muc / ten tran .mjs vang moi khoa dung mot bullet ghim');
}

// ── NEN-TT3 — tên chương trình trần vắng VẪN đỏ; tập bullet so BẰNG NHAU ──────────
{
  const MONG = [...Object.values(MONG_VANG), MONG_TEN].sort();
  const b = xVang.r ? bulletCongCuMoi(xVang.r.tep).sort() : [];
  if (Object.keys(TT_VANG_KHOA.script).length !== 5 || MONG.length !== 5) bad('NEN-TT3 ma tran khai sai kich thuoc (can 5 khoa, 5 bullet)', `${Object.keys(TT_VANG_KHOA.script).length}/${MONG.length}`);
  else if (tienDeTT(xVang)) bad('NEN-TT3', tienDeTT(xVang));
  else if (!b.includes(MONG_TEN)) bad('NEN-TT3 ten chuong trinh tran vang khong con do', JSON.stringify(b));
  else if (JSON.stringify(b) !== JSON.stringify(MONG)) bad('NEN-TT3 tap bullet cong-cu khac tap mong doi', JSON.stringify(b));
  else ok(`NEN-TT3 ten tran vang van do «${MONG_TEN}»; tap bullet bang dung 5 dong viet truoc`);
}

// ── NEN-TT4 — khoá ở khuôn kit `${CLAUDE_PLUGIN_ROOT}/…` giữ đúng một dòng bỏ-tra ─────
{
  const dong = xCo.r ? boQuaKhoa(xCo.r.stderr, 'executors.script.tt_khuon') : null;
  const b = xCo.r ? bulletCongCuMoi(xCo.r.tep).filter(l => l.endsWith('(khoa executors.script.tt_khuon)')) : [];
  if (tienDeTT(xCo)) bad('NEN-TT4', tienDeTT(xCo));
  else if (b.length) bad('NEN-TT4 khoa khuon kit sinh bullet', JSON.stringify(b));
  else if (JSON.stringify(dong) !== JSON.stringify([DONG_TT_KHUON])) bad('NEN-TT4 khoa khuon kit khong co dung 1 dong bo-tra nguyen van', JSON.stringify(dong));
  else ok('NEN-TT4 khoa ${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js — 0 bullet, dung 1 dong bo-tra nguyen van');
}

// ── NEN-TT5 — ba đột biến ở khối CONG-CU-DUONG-TEP, mỗi đột biến làm ca đỏ có tên ──────
// Bản sao chưa tiêm chạy cả hai lượt trước: nếu nó không cho đúng kết quả NEN-TT1/TT2 thì «đỏ» của
// bản tiêm không phân biệt được với bản chép hỏng.
{
  const loi = [];
  try {
    const d = tamDir('duong-nen-tt-mut-');
    cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
    const f = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
    const goc = readFileSync(f, 'utf8');
    const MO = '// <<<CONG-CU-DUONG-TEP\n', DONG = '// CONG-CU-DUONG-TEP>>>\n';
    const nMo = goc.split(MO).length - 1, nDong = goc.split(DONG).length - 1;
    if (nMo !== 1 || nDong !== 1) throw new Error(`marker CONG-CU-DUONG-TEP khop ${nMo}/${nDong} lan (can dung 1/1)`);
    const i = goc.indexOf(MO) + MO.length, j = goc.indexOf(DONG);
    const khoi = goc.slice(i, j);
    for (const [ten, e] of [['co', KIEM_TT.co(chayTT(TT_CO, { script: f }))], ['vang', KIEM_TT.vang(chayTT(TT_VANG_KHOA, { script: f }))]]) {
      if (e) loi.push(`ban chep hong — luot «${ten}» chua tiem khong dat: ${e}`);
    }
    const DOT = [
      ['a', "const laDuongTep = (tu) => tu.includes('/') || DUOI_KICH_BAN.test(tu);", 'const laDuongTep = () => false;', TT_CO,
        b => b.includes(`nen cong-cu: THIEU ${TT_TUYET_DOI} (khoa executors.design.ui_check)`)],
      ['b', 'const coTep = (tu) =>', 'const coTep = () => true; const coTepGoc = (tu) =>', TT_VANG_KHOA,
        // Vế vắng không đứng một mình: tên trần không qua `coTep`, nên lượt đột biến chạy hết vẫn phải
        // gọi MONG_TEN — thiếu nó là bản tiêm chết sớm, không phải đột biến bị bắt.
        b => !b.some(l => l.endsWith('(khoa executors.script.tt_tuyet_doi_vang)')) && b.includes(MONG_TEN)],
      ['c', 'const DUOI_KICH_BAN = /\\.[cm]?js$/;', 'const DUOI_KICH_BAN = /\\.cjs$/;', TT_CO,
        b => b.includes('nen cong-cu: THIEU kiem-goc.js (khoa executors.script.tt_tran_js)')],
    ];
    if (!loi.length) for (const [ten, tim, thay, luot, dung] of DOT) {
      const n = khoi.split(tim).length - 1;
      if (n !== 1) { loi.push(`(${ten}) cho tiem khop ${n} lan trong khoi marker (can 1)`); continue; }
      const moi = goc.slice(0, i) + khoi.replace(tim, thay) + goc.slice(j);
      if (moi === goc) { loi.push(`(${ten}) ban tiem trung ban goc`); continue; }
      writeFileSync(f, moi);
      const x = chayTT(luot, { script: f });
      writeFileSync(f, goc);
      const b = x.r ? bulletCongCuMoi(x.r.tep) : [];
      if (!x.r) loi.push(`(${ten}) khong chay duoc: ${x.lech.join(',')}`);
      else if (!x.r.tep || ![0, 1].includes(x.r.code)) loi.push(`(${ten}) ban tiem khong chay het (khong ghi duong-nen.md hoac ma la) — ${tomTat(x.r)}`);
      else if (!dung(b)) loi.push(`(${ten}) dot bien ma ca khong do: ${JSON.stringify(b)}`);
    }
    // Đối chứng của chính phép xét (b): bản tiêm CHẾT ngay khi nạp không ghi tệp nào, và phép xét (b)
    // phải từ chối danh sách bullet rỗng ấy — nếu không, «đột biến bị bắt» và «bản tiêm không chạy»
    // cho cùng một màu (review S4-r1, assertion âm-tính-một-mình).
    if (!loi.length) {
      writeFileSync(f, `${goc.slice(0, i)}throw new Error('tiem chet');\n${goc.slice(i)}`);
      const x = chayTT(TT_VANG_KHOA, { script: f });
      writeFileSync(f, goc);
      if (!x.r) loi.push(`(chet) khong chay duoc: ${x.lech.join(',')}`);
      else if (x.r.tep) loi.push('(chet) ban tiem chet van ghi duong-nen.md — doi chung khong chet that');
      else if (DOT[1][4](bulletCongCuMoi(x.r.tep))) loi.push('(chet) phep xet (b) nhan ban tiem chet la dot bien bi bat');
    }
  } catch (e) { loi.push(String(e.message || e)); }
  if (loi.length) bad('NEN-TT5 dot bien', loi.join(' | '));
  else ok('NEN-TT5 ban chep chua tiem dat TT1/TT2; ba dot bien (khong gi la duong tep · moi tep deu co · chi nhan .cjs) deu do dung khoa; ban tiem chet bi goi khong chay het');
}

donDep();
console.log(`\nResults: ${pass} passed, ${fail} failed (duong-nen)`);
process.exit(fail ? 1 : 0);
