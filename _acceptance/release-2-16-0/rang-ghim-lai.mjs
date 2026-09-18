#!/usr/bin/env node
// rang-ghim-lai.mjs — răng của hồ sơ release-2-16-0, chân `chien-dich`.
//
// Vì sao tồn tại: mốc này CHẠY chiến dịch ghim lại, thứ hai cửa sổ trước đã hoãn.
// Một chiến dịch là việc máy làm rồi kể lại bằng chữ trong hợp đồng; lời kể ấy
// không có thước thì nó là tin-suông — đúng lớp mà răng cửa sổ của mốc 2.15.0
// sinh ra để đóng cho hai lời khai khác. Răng này đóng lời khai thứ ba.
//
// KHÔNG CÓ NHÁNH «làn đỏ thì bỏ qua». Bản đầu của răng nhận chữ `khong-co` ở dòng
// sha làm lối tắt cho ca làn đỏ, và phản biện context sạch chỉ ra ngay: lối ấy bỏ
// qua chính phép so, nên nó là HẰNG ĐÚNG — một lượt ghim được ba hồ sơ rồi chết
// giữa chừng cho cùng một dòng PASS với một lượt chưa ai chạy. Nay lượt chiến dịch
// LUÔN khai ba thứ, và ba thứ ấy ràng nhau hai chiều:
//
//   sha    — HEAD mà làn chạy tại đó (làn đỏ cũng có sha; làn đỏ không có pin)
//   run_id — mã lượt làn tự đúc; đây là vật nói «đã chạy», thay cho lời khai
//   exit   — mã thoát của làn
//
// Bất biến đo được, cả hai chiều:
//   (a) tập hồ sơ ĐÃ THÔNG CỔNG mà dòng ghim lại MỚI NHẤT mang đúng `run_id` ấy
//       BẰNG danh sách khai — thiếu hay thừa đều đỏ, gọi tên;
//   (b) mỗi hồ sơ trong danh sách có dòng ghim lại mang đúng `sha` ấy VÀ có
//       `verified_commit` BẰNG chính `sha` ấy (bất biến của nghi thức ghim lại);
//   (c) exit 0 ⇒ danh sách KHÔNG rỗng (một làn xanh có ghi pin), và
//       exit khác 0 ⇒ KHÔNG hồ sơ đã ký nào mang `run_id` ấy ở bất kỳ dòng nào.
// Vế (c) là thứ giết hằng-đúng: một làn đỏ mà vẫn có pin mang run_id của nó là
// lời khai LỆCH vật, và răng gọi tên.
//
// Hai trạng thái «đã thông cổng» hỏi ĐÚNG MỘT NGUỒN — `DA_THONG_CONG_2` của
// `lib/workspace-record.cjs`, qua `hoSoDaThong` của làn ghim lại — không gõ tay.
// Bài học 2.15.0 AC-8: một bản chép mảng trạng thái là một khuôn sẽ trôi.
//
// NEO: không có. Răng đọc sha TỪ LỜI KHAI rồi đối chiếu với kho, nên nó đúng ở mọi
// HEAD tương lai và hồ sơ đã ký còn ghim lại được.
//
//   0  xanh
//   2  không có nền: không git · không rút được khối · khối thiếu dòng · sha khai
//      không có trong kho · không hồ sơ đã ký nào · không hồ sơ nào mang dòng ghim
//      lại nào (bộ đọc sổ chạy chưa sống)
//   4  tập hồ sơ mang run_id ấy KHÁC khối khai — in thiếu/thừa
//   5  hồ sơ trong khối khai có sha dòng ghim lại hoặc verified_commit khác sha khai
//   6  vế (c) gãy: làn xanh mà khai 0 hồ sơ, hoặc làn đỏ mà vẫn có hồ sơ mang run_id
//   8  thiếu cờ `--chan chien-dich`
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const SLUG = path.basename(HERE);
const out = (s) => process.stdout.write(s + '\n');
const stop = (code, msg) => { out(msg); process.exit(code); };
const argv = process.argv.slice(2);
const chan = argv.length === 2 && argv[0] === '--chan' ? argv[1] : null;
if (chan !== 'chien-dich') stop(8, 'FAIL(8): cần đúng --chan chien-dich');

const git = (...a) => { const r = spawnSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { code: r.status, out: String(r.stdout || '').trim() }; };
if (git('rev-parse', 'HEAD').code !== 0) stop(2, `FAIL(2): ${ROOT} không phải kho git`);

// ── bộ máy: một nguồn cho «đã thông cổng» ────────────────────────────────────
const require_ = createRequire(path.join(ROOT, 'x.cjs'));
let core, wsRec, hoSoDaThong;
try {
  core = require_(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  wsRec = require_(path.join(ROOT, 'lib', 'workspace-record.cjs'));
  ({ hoSoDaThong } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'chup-ho-so-da-thong.mjs')));
} catch (e) { stop(2, `FAIL(2): không nạp được bộ máy (lib + làn ghim lại): ${e.message}`); }
if (!Array.isArray(wsRec.DA_THONG_CONG_2) || !wsRec.DA_THONG_CONG_2.length) stop(2, 'FAIL(2): lib/workspace-record.cjs không cấp DA_THONG_CONG_2 — không có nguồn trạng thái');

let daKy;
try { daKy = hoSoDaThong(ROOT, core.frontmatterField, wsRec.DA_THONG_CONG_2); }
catch (e) { stop(2, `FAIL(2): không liệt kê được hồ sơ đã thông cổng: ${e.message}`); }
if (!daKy.length) stop(2, 'FAIL(2): không hồ sơ đã thông cổng nào trong kho — phép so chưa sống');

// ── khối khai của hợp đồng ───────────────────────────────────────────────────
const hd = readFileSync(path.join(HERE, 'contract.md'), 'utf8');
const khoi = hd.match(/<<<CHIEN-DICH-GHIM-LAI\n([\s\S]*?)CHIEN-DICH-GHIM-LAI>>>/);
if (!khoi) stop(2, `FAIL(2): không rút được khối CHIEN-DICH-GHIM-LAI của _acceptance/${SLUG}/contract.md`);
const dong = khoi[1].split('\n').map((l) => l.trim()).filter(Boolean);
if (dong.length < 3) stop(2, `FAIL(2): khối CHIEN-DICH-GHIM-LAI phải có ít nhất ba dòng đầu (sha · run_id · exit), thấy ${dong.length}`);
const shaKhai = dong[0];
const mRun = /^run_id:\s*(\S+)$/.exec(dong[1]);
const mExit = /^exit:\s*(\d+)$/.exec(dong[2]);
if (!/^[0-9a-f]{40}$/.test(shaKhai)) stop(2, `FAIL(2): dòng 1 của khối khai không phải sha 40 hex: ${shaKhai}`);
if (!mRun) stop(2, `FAIL(2): dòng 2 của khối khai phải là «run_id: <mã>», thấy: ${dong[1]}`);
if (!mExit) stop(2, `FAIL(2): dòng 3 của khối khai phải là «exit: <số>», thấy: ${dong[2]}`);
const runKhai = mRun[1];
const exitKhai = Number(mExit[1]);
const khai = dong.slice(3).map((l) => l.split(/\s+/)[0]).sort();
if (git('cat-file', '-e', `${shaKhai}^{commit}`).code !== 0) stop(2, `FAIL(2): sha khai ${shaKhai.slice(0, 8)} không có trong kho này`);

// ── đọc mọi dòng ghim lại của từng hồ sơ đã ký ───────────────────────────────
const docGhim = (slug) => {
  const p = path.join(ROOT, '_acceptance', slug, 'run-log.jsonl');
  if (!existsSync(p)) return [];
  const ds = [];
  for (const l of readFileSync(p, 'utf8').split('\n')) {
    const s = l.trim();
    if (!s) continue;
    let o; try { o = JSON.parse(s); } catch { continue; }
    if (o && o.kind === 'repin') ds.push(o);
  }
  return ds;
};
const coGhim = [];        // hồ sơ có dòng ghim lại BẤT KỲ — đối chứng dương của bộ đọc
const mangRun = [];       // hồ sơ có dòng ghim lại BẤT KỲ mang run_id của lượt
const cuoiLaRun = [];     // hồ sơ có dòng ghim lại MỚI NHẤT mang run_id của lượt
const shaTheoSlug = new Map();
for (const s of daKy) {
  const ds = docGhim(s);
  if (!ds.length) continue;
  coGhim.push(s);
  if (ds.some((d) => d.run_id === runKhai)) mangRun.push(s);
  const cuoi = ds[ds.length - 1];
  if (cuoi.run_id === runKhai) { cuoiLaRun.push(s); shaTheoSlug.set(s, String(cuoi.sha || '')); }
}
if (!coGhim.length) stop(2, 'FAIL(2): không hồ sơ đã ký nào mang dòng ghim lại nào — bộ đọc sổ chạy chưa sống, phép so không đo được gì');
cuoiLaRun.sort(); mangRun.sort();

// (a) tập theo run_id BẰNG khối khai
const thieu = cuoiLaRun.filter((s) => !khai.includes(s));
const thua = khai.filter((s) => !cuoiLaRun.includes(s));
if (thieu.length || thua.length) {
  stop(4, `FAIL(4): tập hồ sơ mang dòng ghim lại mới nhất của lượt ${runKhai} KHÁC khối khai —`
    + `${thieu.length ? ` có trong sổ chạy mà hợp đồng không khai: ${thieu.join(', ')};` : ''}`
    + `${thua.length ? ` hợp đồng khai mà sổ chạy không có: ${thua.join(', ')}` : ''}`);
}

// (c) hai chiều giữa mã thoát của làn và việc có pin — vế giết hằng-đúng
if (exitKhai === 0 && khai.length === 0) stop(6, `FAIL(6): khối khai nói làn XANH (exit 0) mà không ghim hồ sơ nào — một làn xanh luôn ghi pin cho hồ sơ trong phạm vi lượt`);
if (exitKhai !== 0 && mangRun.length) stop(6, `FAIL(6): khối khai nói làn ĐỎ (exit ${exitKhai}) nhưng ${mangRun.length} hồ sơ vẫn mang dòng ghim lại của lượt ${runKhai}: ${mangRun.join(', ')} — làn đỏ không được ghi gì`);

// (b) bất biến của nghi thức: sha dòng ghim lại và verified_commit đều BẰNG sha khai
for (const s of khai) {
  const shaDong = shaTheoSlug.get(s) || '';
  if (shaDong !== shaKhai) stop(5, `FAIL(5): ${s} có dòng ghim lại ở sha ${shaDong.slice(0, 8) || '(rỗng)'} khác sha khai ${shaKhai.slice(0, 8)}`);
  const rp = path.join(ROOT, '_acceptance', s, 'evidence-report.md');
  if (!existsSync(rp)) stop(5, `FAIL(5): ${s} khai đã ghim lại nhưng không có evidence-report.md để đối chiếu verified_commit`);
  const vc = String(core.frontmatterField(readFileSync(rp, 'utf8'), 'verified_commit') || '').trim();
  if (vc !== shaKhai) stop(5, `FAIL(5): ${s} có verified_commit ${vc.slice(0, 8) || '(rỗng)'} khác sha của lượt chiến dịch ${shaKhai.slice(0, 8)} — nghi thức ghim lại đòi hai giá trị BẰNG nhau`);
}

// Dòng PASS KHÔNG được chứa chuỗi «exit <số>». Lượt chấm 1 của mốc này đỏ giả đúng vì
// thế: tác tử máy đọc mã thoát của lệnh bằng cách khai một trường, và dòng PASS cũ mang
// chữ «exit 1» (mã thoát của LÀN chiến dịch, không phải của lệnh này), nên nó khai
// exitCode 1 cho một lệnh đã thoát 0. Đây là lớp «mã thoát đi qua lời khai của tác tử»
// mà mốc 2.15.0 đặt đầu danh sách gọi-tên-chưa-làm; răng không chữa được lớp ấy, nhưng
// nó không được TỰ MỜI lớp ấy vào.
out(`PASS: chien-dich lan ${runKhai} ma-thoat-lan ${exitKhai} tai sha ${shaKhai.slice(0, 8)} — ${khai.length} ho so da ky mang dong ghim lai moi nhat cua luot BANG khoi khai [${khai.join(', ') || 'rong'}] (doi chung: ${daKy.length} ho so da ky, ${coGhim.length} ho so co dong ghim lai)`);
