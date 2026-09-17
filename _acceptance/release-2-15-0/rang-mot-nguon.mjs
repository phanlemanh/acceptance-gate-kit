#!/usr/bin/env node
// rang-mot-nguon.mjs — răng của hồ sơ release-2-15-0, chân `da-thong-cong-2`.
//
// Lời hứa (veto một nguồn, owner 17/09, commit bcd0f166): hai trạng thái «đã thông
// Cổng Bằng chứng» mà răng chụp hồ sơ dùng CHỈ sống ở DA_THONG_CONG_2 của
// lib/workspace-record.cjs. Làn ghim lại nạp nó qua bảng AG-ENGINE; hồ sơ đã ký
// ra-co-ten-lam-va-trao về ĐÚNG bản đã ký (không khai gạch hai tệp của răng); và
// RT13 im vì hai tệp ấy không còn chuỗi RT13 quét — không phải vì được miễn.
//
// Năm vế, mỗi vế một mã. Vế nào dựa vào một phép quét thì có đối chứng dương ngay
// trước nó: quét phải thấy thứ chắc chắn có, rồi mới tin «không thấy».
//   0  xanh
//   2  không có nền: không phải kho git · thiếu tệp được đo · không rút được khối
//   3  GL03 đỏ hoặc không in dòng PASS của chính nó (bảng AG-ENGINE lệch lời gọi thật)
//   4  RT13 đỏ hoặc không in dòng PASS của chính nó
//   5  khối BO-DOC-KHAI-GACH của hồ sơ đã ký còn dòng gạch cho tệp của răng chụp hồ sơ
//   6  module chụp hồ sơ gõ tay một trạng thái đã thông cổng · hoặc một trong hai tệp
//      của răng chứa chuỗi mà RT13 quét (rút từ chính tệp ca RT13, không gõ lại)
//   7  bảng AG-ENGINE không có hàng DA_THONG_CONG_2 của lib/workspace-record.cjs
//   8  thiếu cờ `--chan da-thong-cong-2`
import { spawnSync, execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const out = (s) => process.stdout.write(s + '\n');
const stop = (code, msg) => { out(msg); process.exit(code); };
const argv = process.argv.slice(2);
if (argv.length !== 2 || argv[0] !== '--chan' || argv[1] !== 'da-thong-cong-2') stop(8, 'FAIL(8): cần đúng --chan da-thong-cong-2');

try { execFileSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { stdio: 'ignore' }); } catch { stop(2, `FAIL(2): ${ROOT} không phải kho git`); }
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const CHUP = 'feature-loop/scripts/chup-ho-so-da-thong.mjs';
const CA_CHUP = 'tests/scripts/chup-ho-so-da-thong.test.mjs';
const HD_KY = path.join(ROOT, '_acceptance', 'ra-co-ten-lam-va-trao', 'contract.md');
for (const p of [LANE, path.join(ROOT, CHUP), path.join(ROOT, CA_CHUP), HD_KY]) if (!existsSync(p)) stop(2, `FAIL(2): thiếu tệp được đo ${path.relative(ROOT, p)}`);

// Chuỗi trạng thái cần soi RÚT từ lib — răng này không gõ tay nó.
const { DA_THONG_CONG_2 } = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'workspace-record.cjs'));
if (!Array.isArray(DA_THONG_CONG_2) || DA_THONG_CONG_2.length !== 2) stop(2, `FAIL(2): DA_THONG_CONG_2 của lib không đúng khuôn hai trạng thái: ${JSON.stringify(DA_THONG_CONG_2)}`);

// Vế 7 — hàng bảng. Rút khối marker của làn (một nguồn với ca GL03).
const lane = readFileSync(LANE, 'utf8');
const khoi = lane.match(/\/\/ <<<AG-ENGINE-TABLE\n([\s\S]*?)\/\/ AG-ENGINE-TABLE>>>/);
if (!khoi) stop(2, 'FAIL(2): không rút được khối AG-ENGINE-TABLE của repin-lane.mjs');
const hang = [...khoi[1].matchAll(/\{ file: '([^']+)', name: '([^']+)', kind: '([^']+)'/g)].map(m => ({ file: m[1], name: m[2], kind: m[3] }));
if (hang.length < 5) stop(2, `FAIL(2): khối AG-ENGINE-TABLE chỉ rút được ${hang.length} hàng — nghi bộ rút hỏng`);
if (!hang.some(h => h.file === 'lib/workspace-record.cjs' && h.name === 'DA_THONG_CONG_2' && h.kind === 'array')) stop(7, 'FAIL(7): bảng AG-ENGINE không có hàng { lib/workspace-record.cjs · DA_THONG_CONG_2 · array }');

// Vế 3 — GL03 chạy thật: mọi lời gọi bộ máy có hàng, mọi hàng được dùng.
const gl = spawnSync(process.execPath, [path.join(ROOT, 'tests', 'scripts', 'repin-lane-lop-cu.test.mjs')], { encoding: 'utf8', env: { ...process.env, GLLC_CASES: 'GL03' }, maxBuffer: 64 * 1024 * 1024 });
if (gl.status !== 0 || !/^\s*PASS: GL03 /m.test(gl.stdout)) stop(3, `FAIL(3): GL03 exit ${gl.status}:\n${String(gl.stdout).split('\n').filter(l => /FAIL|GL03/.test(l)).slice(-8).join('\n')}`);

// Vế 5 — khối gạch của hồ sơ đã ký. Đối chứng dương: khối rút được và không rỗng.
const hd = readFileSync(HD_KY, 'utf8');
const gach = hd.match(/<<<BO-DOC-KHAI-GACH\n([\s\S]*?)BO-DOC-KHAI-GACH>>>/);
if (!gach) stop(2, 'FAIL(2): không rút được khối BO-DOC-KHAI-GACH của hồ sơ ra-co-ten-lam-va-trao');
const dongGach = gach[1].split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split(/\s+/)[0]);
if (!dongGach.length) stop(2, 'FAIL(2): khối BO-DOC-KHAI-GACH rỗng — không phân biệt được «đã gỡ» với «rút hỏng»');
const conGach = dongGach.filter(f => f === CHUP || f === CA_CHUP);
if (conGach.length) stop(5, `FAIL(5): hồ sơ đã ký còn khai gạch: ${conGach.join(', ')}`);

// Vế 6 — phát biểu ĐÚNG điều veto chốt, không rộng hơn. (a) MODULE không gõ tay trạng
// thái nào của DA_THONG_CONG_2 — nó nhận mảng do làn truyền. (b) Cả hai tệp không chứa
// chuỗi mà RT13 quét — chuỗi ấy RÚT từ lệnh git grep trong chính tệp ca RT13. Tệp ca
// chụp hồ sơ vẫn gõ tay tên trạng thái máy-thông (tên bất biến của làn V) và điều đó
// KHÔNG trái veto; bản đầu của vế này khai «không gõ tay trạng thái nào» cho cả hai tệp
// và chính răng đỏ mã 6 lúc chạy lần đầu — lời khai rộng hơn sự thật, đã thu hẹp.
// Đối chứng dương cho mọi phép tìm: cùng phép tìm phải thấy chuỗi ở nơi nó phải sống.
const tim = (s, rel) => spawnSync('git', ['-C', ROOT, 'grep', '-l', '-F', s, '--', rel], { encoding: 'utf8' }).stdout.trim();
for (const s of DA_THONG_CONG_2) {
  if (tim(s, 'lib/workspace-record.cjs') !== 'lib/workspace-record.cjs') stop(2, `FAIL(2): phép tìm không thấy «${s}» ngay ở lib — phép tìm chưa sống`);
  if (tim(s, CHUP) === CHUP) stop(6, `FAIL(6): module chụp hồ sơ gõ tay «${s}» — bản thứ hai của DA_THONG_CONG_2 mọc lại`);
}
const RT_SRC = 'tests/plugins/ra-co-ten.test.mjs';
const rtChuoi = readFileSync(path.join(ROOT, RT_SRC), 'utf8').match(/\['-C', root, 'grep', '-l', '([^']+)'\]/);
if (!rtChuoi) stop(2, `FAIL(2): không rút được chuỗi RT13 quét từ ${RT_SRC}`);
if (tim(rtChuoi[1], RT_SRC) !== RT_SRC) stop(2, `FAIL(2): phép tìm không thấy «${rtChuoi[1]}» ngay trong tệp ca RT13 — phép tìm chưa sống`);
const coChuoiRT = [CHUP, CA_CHUP].filter(rel => tim(rtChuoi[1], rel) === rel);
if (coChuoiRT.length) stop(6, `FAIL(6): tệp của răng chụp hồ sơ chứa chuỗi RT13 quét «${rtChuoi[1]}»: ${coChuoiRT.join(', ')}`);

// Vế 4 — RT13 trên cây thật.
const rt = spawnSync(process.execPath, [path.join(ROOT, 'tests', 'plugins', 'ra-co-ten.test.mjs')], { encoding: 'utf8', env: { ...process.env, RT_CASES: 'RT13' }, maxBuffer: 64 * 1024 * 1024 });
if (rt.status !== 0 || !/^PASS: \[RT13\] /m.test(rt.stdout)) stop(4, `FAIL(4): RT13 exit ${rt.status}:\n${String(rt.stdout).split('\n').filter(l => /FAIL|RT13/.test(l)).slice(-6).join('\n').slice(0, 1200)}`);

out(`PASS: mot-nguon DA_THONG_CONG_2 — hang AG-ENGINE co (${hang.length} hang) · GL03 xanh · khoi gach ho so da ky ${dongGach.length} dong, khong dong nao cho rang chup ho so · module khong go tay trang thai, 2 tep khong chua chuoi RT13 quet (doi chung: lib va tep ca RT13 co) · RT13 xanh`);
