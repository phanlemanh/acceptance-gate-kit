#!/usr/bin/env node
// giu-khoa-4.test.mjs — bộ tự kiểm của thước vòng bốn (E8). `--tinh` gọi tệp này; đỏ → mọi chế độ dừng.
// Mỗi phép đo một cặp trên cùng fixture: vật lành → xanh, vật phá → đỏ với thông điệp ghim. Fixture sinh trong lần chạy.
import { appendFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { moCtx } from '../../phan-du-bo-cuc-moi/rang/giu-khoa.mjs';
import { soTui, tuiCu } from '../../phan-du-bo-cuc-moi/rang/tui-khoa.mjs';
import { boMot, docDoiSo, doanCa, git, GOC_VONG, lechNhanh, nhanBan, NGHI_THUC, reCa, SLUG, soLuat, tepNhanhDoi } from './giu-khoa-4.mjs';
import { dongNghiThuc } from '../../phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs';
import { hinhKhoa, tuiCuSucChua } from './tui-cu-suc-chua.mjs';

let pass = 0; let fail = 0;
const ca = (id, dk, msg) => { if (dk) { pass++; console.log(`  PASS: ${id}`); } else { fail++; console.log(`  FAIL: ${id} — ${msg}`); } };
const J = x => JSON.stringify(x);

// TK-NHANH: luật tệp — tập nhánh đổi = tập vòng khai; lệch gọi đúng tên và đúng chiều.
const K = ['tests/scripts/a.test.mjs', 'tests/scripts/b.test.mjs'];
ca('TK-NHANH-lanh tập bằng nhau → không lệch', lechNhanh([...K], K).length === 0, 'lệch dù bằng');
const l1 = lechNhanh([...K, 'tests/scripts/c.test.mjs'], K);
ca('TK-NHANH-do-thua nhánh sửa tệp không khai → đỏ đúng câu', J(l1) === J(['tests/scripts/c.test.mjs: nhánh sửa mà vòng không khai']), `được ${J(l1)}`);
const l2 = lechNhanh([K[0]], K);
ca('TK-NHANH-do-thieu vòng khai tệp nhánh không sửa → đỏ đúng câu', J(l2) === J(['tests/scripts/b.test.mjs: vòng khai mà nhánh không sửa']), `được ${J(l2)}`);

// TK-NT: luật dòng nghi thức với slug của vòng này.
const RB = NGHI_THUC[0];
const hunk = (...d) => [`--- a/${RB}`, `+++ b/${RB}`, '@@ -1,0 +2,1 @@', ...d].join('\n');
ca('TK-NT-lanh chỉ thêm dòng của vòng → nghi thức', dongNghiThuc(hunk(`+${SLUG}\thoi=x`), SLUG), 'dòng ký của vòng không được nhận');
ca('TK-NT-do dòng hồ sơ khác → không phải nghi thức', !dongNghiThuc(hunk('+phan-du-bo-cuc-moi-vong-ba\thoi=x'), SLUG), 'dòng hồ sơ khác bị nhận');

// TK-DOAN: đoạn của một ca đỏ gồm dòng thụt sau nó, dừng ở ca kế.
const OUT = ['  PASS: [KK-5]', '  FAIL: [KK-6] — ca', '    thẻ đổi khi kho không khai bản đồ', '  FAIL: [KK-7]', '    câu khác'].join('\n');
const dn = doanCa(OUT, reCa('KK-6'));
ca('TK-DOAN-lanh đoạn của ca có câu ghim, không lấn ca kế', Boolean(dn) && dn.includes('thẻ đổi khi kho không khai bản đồ') && !dn.includes('câu khác'), `được ${J(dn)}`);
ca('TK-DOAN-do ca xanh → không đoạn đỏ', doanCa(OUT, reCa('KK-5')) === null, 'ca xanh bị nhận là đỏ');

// TK-MP: hai luật so trên túi tổng hợp. `doi`: «BC old/…» → «BC new/…».
const doi = k => k.replace(/^BC old\//, 'BC new/');
const M = o => new Map(Object.entries(o));
const X = 'BC old/a'; const Y = 'BC new/a';
const hai = M({ [X]: 1, [Y]: 1 });
ca('TK-MP-tai-hien luật hiện tại thiếu tên mới khi hai cây in cả hai tên', J(soLuat(hai, hai, doi).thieu) === J([Y]), `được ${J(soLuat(hai, hai, doi).thieu)}`);
ca('TK-MP-lanh luật đề nghị thiếu 0 trên cùng túi', soLuat(hai, hai, doi, tuiCuSucChua).thieu.length === 0, `được ${J(soLuat(hai, hai, doi, tuiCuSucChua).thieu)}`);
ca('TK-MP-do-phang xoá tên phẳng → đề nghị thiếu đúng tên phẳng', J(soLuat(hai, boMot(hai, X), doi, tuiCuSucChua).thieu) === J([X]), `được ${J(soLuat(hai, boMot(hai, X), doi, tuiCuSucChua).thieu)}`);
ca('TK-MP-do-goi xoá tên mới → đề nghị thiếu đúng tên mới', J(soLuat(hai, boMot(hai, Y), doi, tuiCuSucChua).thieu) === J([Y]), `được ${J(soLuat(hai, boMot(hai, Y), doi, tuiCuSucChua).thieu)}`);
const BA = [['không đổi', M({ 'BC z': 1 }), M({ 'BC z': 1 })], ['đổi thường', M({ [X]: 1 }), M({ [Y]: 1 })], ['tên nguyên chữ', M({ [X]: 1 }), M({ [X]: 1 })], ['mất thật', M({ [X]: 1 }), M({})]];
for (const [ten, a, b] of BA) ca(`TK-MP-hinh ${ten}: hai luật cho cùng kết quả`, J(soTui(tuiCu(a, b, doi), b)) === J(soTui(tuiCuSucChua(a, b, doi), b)), `${J(soTui(tuiCu(a, b, doi), b))} ≠ ${J(soTui(tuiCuSucChua(a, b, doi), b))}`);
ca('TK-MP-hinhKhoa ba hình đọc đúng', hinhKhoa('BC z', M({ 'BC z': 1 }), doi) === 'khong-doi' && hinhKhoa(X, M({ [Y]: 1 }), doi) === 'doi-thuong' && hinhKhoa(X, M({ [X]: 1 }), doi) === 'nguyen-chu', 'sai hình');

// TK-ARG: đối số.
ca('TK-ARG-lanh --moi --nhom tb đọc được', J(docDoiSo(['--moi', '--nhom', 'tb'])) === J({ cheDo: 'moi', nhom: 'tb' }), J(docDoiSo(['--moi', '--nhom', 'tb'])));
ca('TK-ARG-do --moi thiếu nhóm / nhóm lạ / --tinh có nhóm → từ chối', docDoiSo(['--moi']) === null && docDoiSo(['--moi', '--nhom', 'x']) === null && docDoiSo(['--tinh', '--nhom', 'tb']) === null, 'nhận đối số sai');

// TK-GOP: hai ca trên bản sao do mã sinh — nhánh chính (đặt = GOC_VONG) nhận một commit lạ chạm tests/ ngoài khối và một
// dòng routing-baseline.txt của slug khác. IM: gộp commit ấy vào nhánh → tập nhánh đổi không đổi. ĐỎ: cùng thay đổi là
// commit của CHÍNH nhánh → luật tệp gọi tên hai tệp. So với tập trước gộp (không với TEP_VONG) để ca không phụ thuộc tiến độ.
const ctx = moCtx();
try {
  const h = git(path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', '..'), 'rev-parse', 'HEAD');
  const d = nhanBan(ctx, h, 'tk-gop', GOC_VONG);
  const truoc = tepNhanhDoi(d) || [];
  const la = 'tests/scripts/zz-la.test.mjs';
  const thayDoi = () => { mkdirSync(path.join(d, 'tests', 'scripts'), { recursive: true }); writeFileSync(path.join(d, la), '// tệp lạ\n'); appendFileSync(path.join(d, RB), 'slug-khac\thoi=x\n'); git(d, 'add', '-A'); git(d, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'lạ'); };
  git(d, 'checkout', '-q', '--detach', GOC_VONG); thayDoi(); const L = git(d, 'rev-parse', 'HEAD');
  git(d, 'update-ref', 'refs/remotes/origin/main', L);
  git(d, 'checkout', '-q', '--detach', h); git(d, '-c', 'commit.gpgsign=false', 'merge', '-q', '--no-ff', '--no-edit', L);
  const sau = tepNhanhDoi(d) || [];
  ca('TK-GOP-im nhánh chính có commit lạ, gộp vào nhánh → tập nhánh đổi giữ nguyên', lechNhanh(sau, truoc).length === 0 && truoc.length > 0, `lệch ${J(lechNhanh(sau, truoc))} (trước ${truoc.length} tệp)`);
  git(d, 'update-ref', 'refs/remotes/origin/main', GOC_VONG);
  git(d, 'checkout', '-q', '--detach', h); thayDoi();
  const ld = lechNhanh(tepNhanhDoi(d) || [], truoc).sort();
  ca('TK-GOP-do cùng thay đổi là commit của chính nhánh → «nhánh sửa mà vòng không khai» cho đúng hai tệp', J(ld) === J([`${RB}: nhánh sửa mà vòng không khai`, `${la}: nhánh sửa mà vòng không khai`].sort()), `được ${J(ld)}`);
} catch (e) { fail++; console.log(`  FAIL: TK-GOP hạ tầng — ${String(e.message).split('\n')[0]}`); }
finally { rmSync(ctx.tmp, { recursive: true, force: true }); }

console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
