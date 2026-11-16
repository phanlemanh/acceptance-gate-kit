#!/usr/bin/env node
// giu-khoa-3.test.mjs — bộ tự kiểm phần thuần của thước vòng ba (E10). `--tinh` gọi tệp này; đỏ → mọi chế độ dừng.
// Mỗi phép đo một cặp: vật lành → xanh (đối chứng dương), vật phá → đỏ với thông điệp ghim. Fixture sinh trong lần chạy.
import { lechLuatTuDung } from '../../phan-du-bo-cuc-moi/rang/giu-khoa.mjs';
import { apVa, chanNgoaiVong, docDoiSo, docRaLop, dongNghiThuc, NGHI_THUC, SLUG, tepVongSua, thieuMuc, MUC_GUI_B2, vaThuaTu } from './giu-khoa-3.mjs';

let pass = 0; let fail = 0;
const ca = (id, dk, msg) => { if (dk) { pass++; console.log(`  PASS: ${id}`); } else { fail++; console.log(`  FAIL: ${id} — ${msg}`); } };
const RB = NGHI_THUC[0];
const hunk = (...dong) => [`diff --git a/${RB} b/${RB}`, `--- a/${RB}`, `+++ b/${RB}`, '@@ -1,0 +2,1 @@', ...dong].join('\n');
const dongKy = `+${SLUG}\thoi=Ngoài-1|ký hay trả\tbao=cắt/hoãn|Treo`;

// TK-NT: dòng nghi thức ký — chỉ thêm đúng dòng của vòng thì bỏ qua; mọi đổi khác thì không.
ca('TK-NT-lanh chỉ thêm dòng của vòng → nghi thức', dongNghiThuc(hunk(dongKy)), 'dòng ký của vòng không được nhận');
ca('TK-NT-do-khac-ho-so thêm dòng hồ sơ khác → không phải nghi thức', !dongNghiThuc(hunk('+phan-du-bo-cuc-moi\thoi=x')), 'dòng hồ sơ khác bị nhận là nghi thức');
ca('TK-NT-do-tien-to slug là tiền tố của slug khác → không phải nghi thức', !dongNghiThuc(hunk(`+${SLUG}-2\thoi=x`)), 'slug có hậu tố bị nhận nhầm');
ca('TK-NT-do-xoa xoá một dòng cũ → không phải nghi thức', !dongNghiThuc(hunk(dongKy, '-release-2-39-0\thoi=x')), 'xoá dòng cũ bị bỏ qua');
ca('TK-NT-do-rong diff rỗng → không phải nghi thức', !dongNghiThuc(''), 'diff rỗng bị nhận là nghi thức');

// TK-SUA: tập tệp vòng sửa — tệp nghi thức chỉ rời tập khi đúng dòng ký; luật danh sách đỏ đúng câu khi rời.
const ds = ['tests/scripts/a.test.mjs', RB];
const sach = tepVongSua(ds, { [RB]: hunk(dongKy) });
const ban = tepVongSua(ds, { [RB]: hunk('+khac\tx') });
ca('TK-SUA-lanh dòng ký → tệp nghi thức rời tập', sach.length === 1 && sach[0] === ds[0], `được ${JSON.stringify(sach)}`);
ca('TK-SUA-do sửa khác → tệp nghi thức ở lại tập', ban.includes(RB), `được ${JSON.stringify(ban)}`);
const lech = lechLuatTuDung(ban, ['tests/scripts/a.test.mjs'], []);
ca('TK-SUA-do-cau luật danh sách gọi tên tệp nghi thức bị sửa', lech.length === 1 && lech[0] === `${RB}: vòng sửa mà không khai tự đúng đường, cũng không khai còn đi bước 6`, `được ${JSON.stringify(lech)}`);
ca('TK-SUA-lanh-luat tập sạch khớp khối khai → không lệch', lechLuatTuDung(sach, ['tests/scripts/a.test.mjs'], []).length === 0, 'lệch dù khớp');
const thua = lechLuatTuDung(['tests/scripts/a.test.mjs', 'tests/scripts/b.test.mjs'], ['tests/scripts/a.test.mjs'], []);
ca('TK-SUA-do-chua-khai tệp sửa mà không khai → đỏ đúng câu', thua.length === 1 && thua[0].startsWith('tests/scripts/b.test.mjs: vòng sửa mà không khai'), `được ${JSON.stringify(thua)}`);

// TK-RL: bảng rà lớp — đọc đúng cột nhóm; dòng sai khuôn không lọt.
const bang = ['| Tệp | Nhóm | Dòng | Căn cứ |', '|---|---|---|---|', '| `tests/scripts/x.test.mjs` | A | 1 | c |', '| `tests/plugins/run-tests.sh` | B | 2 | c |', '| tests/khong-nhay.mjs | C | 3 | c |'].join('\n');
const rl = docRaLop(bang);
ca('TK-RL-lanh hai dòng đúng khuôn đọc được với nhóm', rl.size === 2 && rl.get('tests/scripts/x.test.mjs') === 'A' && rl.get('tests/plugins/run-tests.sh') === 'B', `được ${JSON.stringify([...rl])}`);
ca('TK-RL-do dòng thiếu nháy ngược không lọt vào bảng', !rl.has('tests/khong-nhay.mjs'), 'dòng sai khuôn lọt');

// TK-MUC: gui-b2.md bốn mục.
const du = MUC_GUI_B2.map(m => `${m} …`).join('\n\n');
ca('TK-MUC-lanh đủ bốn mục → không thiếu', thieuMuc(du).length === 0, `thiếu ${thieuMuc(du).join(',')}`);
ca('TK-MUC-do bỏ mục 3 → gọi tên mục 3', JSON.stringify(thieuMuc(du.replace(MUC_GUI_B2[2], '## 3. khác'))) === JSON.stringify([MUC_GUI_B2[2]]), 'không gọi đúng mục');

// TK-VA: mục vá thừa = mục trên tệp khai tự đúng đường, giữ nguyên chuỗi `cu` và `so_lan`.
const va = [{ tep: 'tests/a', cu: 'x', moi: 'y', so_lan: 2 }, { tep: 'tests/b', cu: 'z', moi: 'w', so_lan: 1 }];
const vt = vaThuaTu(va, ['tests/a']);
ca('TK-VA-lanh một mục thừa đúng tệp', vt.tong === 2 && vt.thua.length === 1 && vt.thua[0].tep === 'tests/a' && vt.thua[0].so_lan === 2 && vt.thua[0].ly_do === 'tệp tự đúng đường', JSON.stringify(vt));
ca('TK-VA-do khai rỗng → không mục thừa', vaThuaTu(va, []).thua.length === 0, 'có mục thừa khi không khai');

// TK-DS: đối số — chế độ lạ, cụm lạ, --cum ngoài --moi đều bị từ chối.
ca('TK-DS-lanh --moi --cum K4-LT nhận', JSON.stringify(docDoiSo(['--moi', '--cum', 'K4-LT'])) === JSON.stringify({ cheDo: 'moi', cum: 'K4-LT' }), 'không nhận');
ca('TK-DS-do cụm ngoài vòng bị từ chối', docDoiSo(['--moi', '--cum', 'K4-DN']) === null, 'nhận cụm ngoài vòng');
ca('TK-DS-do --cum thiếu giá trị bị từ chối', docDoiSo(['--moi', '--cum']) === null, 'nhận cờ thiếu giá trị');
ca('TK-DS-do --cum đi với --cu bị từ chối', docDoiSo(['--cu', '--cum', 'K4-LT']) === null, 'nhận --cum ngoài --moi');

// TK-VAAP: vá chỉ áp khi khớp đúng so_lan lần.
ca('TK-VAAP-lanh khớp đúng 2 lần → thay cả hai', apVa('a x b x', { cu: 'x', moi: 'y', so_lan: 2 }) === 'a y b y', 'không thay');
ca('TK-VAAP-do khớp 1 lần mà khai 2 → không áp (null)', apVa('a x b', { cu: 'x', moi: 'y', so_lan: 2 }) === null, 'áp dù lệch số lần');

// TK-NV: khoá cấp tệp chỉ được miễn khi MỌI ca đỏ khác trong tệp là khoá cụm ngoài vòng của chính tệp ấy.
const doiId = k => k;
const hangNV = [{ cum: 'B2', tepKiem: 'x.test.mjs', bo: 'scripts', khoa: 'KM-1' }, { cum: 'K4-LT', tepKiem: 'x.test.mjs', bo: 'scripts', khoa: 'x.test.mjs' }];
const rTep = { cum: 'K4-LT', tepKiem: 'x.test.mjs', bo: 'scripts', khoa: 'x.test.mjs' };
ca('TK-NV-lanh chỉ KM-1 (cụm B2) đỏ → miễn, gọi tên KM-1', chanNgoaiVong(rTep, { do: new Map([['KM-1', 1], ['x.test.mjs', 1]]) }, hangNV, doiId) === 'KM-1', 'không miễn');
ca('TK-NV-do thêm một ca đỏ trong vòng → không miễn', chanNgoaiVong(rTep, { do: new Map([['KM-1', 1], ['LT-9', 1], ['x.test.mjs', 1]]) }, hangNV, doiId) === null, 'miễn dù có ca đỏ trong vòng');
ca('TK-NV-do khoá không phải cấp tệp → không miễn', chanNgoaiVong({ ...rTep, khoa: 'LT-9' }, { do: new Map([['KM-1', 1]]) }, hangNV, doiId) === null, 'miễn khoá thường');

console.log(`giu-khoa-3 tự kiểm: ${pass}/${pass + fail} ca`);
process.exit(fail ? 1 : 0);
