#!/usr/bin/env node
// rang-cua-so.mjs — răng của hồ sơ release-2-16-0 (CHÉP nguyên thân từ release-2-15-0), hai chân `vendored` · `viec-meta`.
//
// Vì sao tồn tại (phản biện context sạch của mốc này, hai P1): hồ sơ mốc khai hai sự
// thật về cửa sổ mà không thước nào đo — «lớp CI vendored không đổi tệp nào» và «danh
// sách việc đã vào cửa sổ». Phép kiểm tay lúc dựng hồ sơ lộ đúng lỗ thứ hai: cửa sổ có
// MỘT vòng meta đã ký (guide-chep-ci-buoc-vao-writer, 16/09, trước R) mà cả hồ sơ lẫn
// finding bối cảnh đều bỏ sót.
//
// NEO suy từ kho, không ghim sha: commit mới nhất đổi dòng version của manifest
// acceptance-gate mà số TẠI commit đó KHÁC số ở cây làm việc — tức lần cắt số TRƯỚC.
// Đúng cả trước lẫn sau khi commit bước nâng số của chính mốc này.
//
// Chân `vendored`: rút danh sách tệp từ khối INIT-CI-COPY-LIST của
// commands/acceptance-init.md (một nguồn), rồi so neo với CÂY LÀM VIỆC trên đúng các
// tệp đó. Đối chứng dương: danh sách không rỗng, mọi tệp tồn tại, và cửa sổ neo..cây
// trên TOÀN kho không rỗng (phép so thật sự so được).
// Chân `viec-meta`: mọi `_acceptance/<slug>/contract.md` KHÔNG có trong cây của neo, trừ
// hồ sơ mốc `release-<x>-<y>-<z>`, phải BẰNG tập slug trong khối VIEC-META-CUA-SO của
// hợp đồng này — thiếu hay thừa đều đỏ, gọi tên. Việc không mở hồ sơ (chip chỉ có
// commit) vô hình với chân này — hợp đồng khai giới hạn đó. Kèm một dòng đọc khoá
// metaOpen của bộ quét trên cây thật: áp dụng phải là true và n phải là số.
//
//   0  xanh
//   2  không có nền: không git · manifest đọc không được · không tìm được neo · không rút
//      được khối · đối chứng dương hỏng
//   3  chân vendored: có tệp chép CI đổi kể từ neo — in từng tệp
//   4  chân viec-meta: tập hồ sơ sinh sau neo KHÁC khối khai — in thiếu/thừa
//   5  chân viec-meta: bộ quét trên cây thật không nhận kho kit hoặc không đếm được
//   6  chân viec-va: có tệp engine đổi SAU chữ ký của vòng meta mà hợp đồng không
//      khai là tệp của chính mốc — in từng tệp
//   7  chân viec-va: đối chứng dương hỏng — cửa sổ neo..chữ-ký KHÔNG chứa tệp engine
//      nào, nên bộ lọc engine chưa chứng minh được là nó thấy tệp engine
//   8  thiếu cờ `--chan vendored|viec-meta|viec-va`
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const SLUG = path.basename(HERE);
const out = (s) => process.stdout.write(s + '\n');
const stop = (code, msg) => { out(msg); process.exit(code); };
const argv = process.argv.slice(2);
const chan = argv.length === 2 && argv[0] === '--chan' ? argv[1] : null;
if (chan !== 'vendored' && chan !== 'viec-meta') stop(8, 'FAIL(8): cần đúng --chan vendored hoặc --chan viec-meta');

const git = (...a) => { const r = spawnSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { code: r.status, out: String(r.stdout || '').trim() }; };
if (git('rev-parse', 'HEAD').code !== 0) stop(2, `FAIL(2): ${ROOT} không phải kho git`);

const MAN = '.claude-plugin/plugin.json';
let soCay;
try { soCay = JSON.parse(readFileSync(path.join(ROOT, MAN), 'utf8')).version; } catch (e) { stop(2, `FAIL(2): không đọc được số ở ${MAN}: ${e.message}`); }
const catSo = git('log', '--format=%H', '-G', '"version":', '--', MAN).out.split('\n').filter(Boolean);
let neo = null, soNeo = null;
for (const c of catSo) {
  const t = git('show', `${c}:${MAN}`);
  if (t.code !== 0) continue;
  let v; try { v = JSON.parse(t.out).version; } catch { continue; }
  if (v !== soCay) { neo = c; soNeo = v; break; }
}
if (!neo) stop(2, `FAIL(2): không tìm được lần cắt số trước (số ở cây ${soCay})`);
const neo8 = neo.slice(0, 8);

if (chan === 'vendored') {
  const init = readFileSync(path.join(ROOT, 'commands', 'acceptance-init.md'), 'utf8');
  const khoi = init.match(/<<<INIT-CI-COPY-LIST -->\n([\s\S]*?)<!-- INIT-CI-COPY-LIST>>>/);
  if (!khoi) stop(2, 'FAIL(2): không rút được khối INIT-CI-COPY-LIST của commands/acceptance-init.md');
  const rutKhoi = (txt) => {
    const k = txt.match(/<<<INIT-CI-COPY-LIST -->\n([\s\S]*?)<!-- INIT-CI-COPY-LIST>>>/);
    return k ? [...new Set([...k[1].matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([A-Za-z0-9._\/-]+)/g)].map(m => m[1]))].sort() : null;
  };
  const tep = rutKhoi(init);
  if (!tep || tep.length < 5) stop(2, `FAIL(2): khối chép chỉ rút được ${tep ? tep.length : 0} tệp — nghi bộ rút hỏng`);
  // Sàn «không dưới năm tệp» MỘT MÌNH là fail-open: gỡ ba mục khỏi khối thì sáu tệp
  // còn lại vẫn không đổi và răng vẫn xanh, trong khi lớp cưỡng chế vendored vừa tắt
  // lặng ba tệp (phản biện context sạch của mốc 2.16.0, P1). Nên so DANH SÁCH ở cả hai
  // đầu cửa sổ, và đưa chính tệp mang khối chép vào tập được so không-đổi.
  const tNeo = git('show', `${neo}:commands/acceptance-init.md`);
  if (tNeo.code !== 0) stop(2, `FAIL(2): không đọc được commands/acceptance-init.md tại neo ${neo8}`);
  const tepNeo = rutKhoi(tNeo.out);
  if (!tepNeo || tepNeo.length < 5) stop(2, `FAIL(2): không rút được khối chép tại neo ${neo8} (thấy ${tepNeo ? tepNeo.length : 0} tệp)`);
  const themTep = tep.filter(t => !tepNeo.includes(t)), botTep = tepNeo.filter(t => !tep.includes(t));
  if (themTep.length || botTep.length) stop(3, `FAIL(3): DANH SÁCH chép CI đổi kể từ lần cắt số ${soNeo} (${neo8}) —${themTep.length ? ` thêm: ${themTep.join(', ')};` : ''}${botTep.length ? ` bớt: ${botTep.join(', ')}` : ''}`);
  tep.push('commands/acceptance-init.md');
  const vang = tep.filter(t => !existsSync(path.join(ROOT, t)));
  if (vang.length) stop(2, `FAIL(2): tệp trong danh sách chép không có ở cây: ${vang.join(', ')}`);
  const toanKho = git('diff', '--name-only', neo);
  if (toanKho.code !== 0 || !toanKho.out) stop(2, `FAIL(2): cửa sổ ${neo8}..cây trên toàn kho rỗng hoặc không so được — phép so chưa sống`);
  const doi = git('diff', '--name-only', neo, '--', ...tep);
  if (doi.code !== 0) stop(2, `FAIL(2): git diff trên danh sách chép thất bại`);
  if (doi.out) stop(3, `FAIL(3): tệp chép CI đổi kể từ lần cắt số ${soNeo} (${neo8}):\n${doi.out.split('\n').map(f => `  - ${f}`).join('\n')}`);
  out(`PASS: vendored ${tep.length - 1} tep chep CI + chinh tep mang khoi chep (danh sach BANG danh sach tai neo) KHONG doi ke tu lan cat so ${soNeo} (${neo8}) toi cay lam viec (doi chung: cua so tren toan kho co ${toanKho.out.split('\n').length} tep doi)`);
  process.exit(0);
}

// chân viec-meta
const RELEASE = /^release-\d+-\d+-\d+$/;
const acc = path.join(ROOT, '_acceptance');
const sinhSau = readdirSync(acc, { withFileTypes: true })
  .filter(d => d.isDirectory() && !RELEASE.test(d.name) && existsSync(path.join(acc, d.name, 'contract.md')))
  .map(d => d.name)
  .filter(s => git('cat-file', '-e', `${neo}:_acceptance/${s}/contract.md`).code !== 0)
  .sort();
const hd = readFileSync(path.join(HERE, 'contract.md'), 'utf8');
const khoi = hd.match(/<<<VIEC-META-CUA-SO\n([\s\S]*?)VIEC-META-CUA-SO>>>/);
if (!khoi) stop(2, `FAIL(2): không rút được khối VIEC-META-CUA-SO của _acceptance/${SLUG}/contract.md`);
const khai = khoi[1].split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split(/\s+/)[0]).sort();
// Đối chứng dương: hồ sơ mốc CHÍNH NÓ sinh sau neo — phép «không có ở neo» phải thấy nó.
if (git('cat-file', '-e', `${neo}:_acceptance/${SLUG}/contract.md`).code === 0) stop(2, `FAIL(2): hồ sơ mốc ${SLUG} có sẵn ở neo ${neo8} — neo sai, phép so chưa sống`);
const thieu = sinhSau.filter(s => !khai.includes(s)), thua = khai.filter(s => !sinhSau.includes(s));
if (thieu.length || thua.length) stop(4, `FAIL(4): hồ sơ vòng sinh sau lần cắt số ${soNeo} (${neo8}) KHÁC khối khai —${thieu.length ? ` có ở kho mà hợp đồng không khai: ${thieu.join(', ')}` : ''}${thua.length ? ` hợp đồng khai mà kho không có: ${thua.join(', ')}` : ''}`);
let mo;
try { mo = JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'start-scan.mjs'), '--root', ROOT], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })).metaOpen; }
catch (e) { stop(5, `FAIL(5): bộ quét không chạy được trên cây thật: ${String(e.message).split('\n')[0]}`); }
if (!mo || mo.applies !== true || typeof mo.n !== 'number') stop(5, `FAIL(5): bộ quét trên cây thật trả metaOpen=${JSON.stringify(mo)} — phải nhận kho kit và đếm được`);
out(`PASS: viec-meta ${sinhSau.length} ho so vong sinh sau lan cat so ${soNeo} (${neo8}) BANG khoi khai [${sinhSau.join(', ') || 'rong'}] · the mo phien tren cay that: vong meta dang mo n=${mo.n} [${mo.slugs.join(', ') || 'rong'}]`);
