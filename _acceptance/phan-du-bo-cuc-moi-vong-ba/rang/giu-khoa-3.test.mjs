#!/usr/bin/env node
// giu-khoa-3.test.mjs — bộ tự kiểm phần thuần của thước vòng ba (E10). `--tinh` gọi tệp này; đỏ → mọi chế độ dừng.
// Mỗi phép đo một cặp: vật lành → xanh (đối chứng dương), vật phá → đỏ với thông điệp ghim. Fixture sinh trong lần chạy.
import { lechLuatTuDung } from '../../phan-du-bo-cuc-moi/rang/giu-khoa.mjs';
import { apVa, chanNgoaiVong, docDoiSo, docRaLop, docRaLopDong, dongNghiThuc, lechDongRaLop, lechRaLop, lenhLichSu, NGHI_THUC, phanSauGop, SLUG, soCuTep, tepVongSua, thieuMuc, MUC_GUI_B2, vaThuaTu } from './giu-khoa-3.mjs';

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

// TK-SG: sau gộp — đỏ chỉ được xếp «môi trường» khi đối chứng trước gộp đỏ Y HỆT (cùng mã, cùng tập ca đỏ không rỗng).
const kqT = (rc, ...doK) => ({ rc, do: new Map(doK.map(k => [k, 1])), dat: new Map() });
ca('TK-SG-lanh xanh → xanh', phanSauGop(kqT(0), null) === 'xanh', 'không xanh');
ca('TK-SG-lanh đỏ y hệt ở đối chứng → môi trường', phanSauGop(kqT(1, 'KD0', 'KD1'), kqT(1, 'KD1', 'KD0')) === 'moi-truong', 'không nhận môi trường');
ca('TK-SG-do đối chứng xanh → đỏ', phanSauGop(kqT(1, 'SP x'), kqT(0)) === 'do', 'đỏ do gộp bị miễn');
ca('TK-SG-do sau gộp đỏ thêm một ca → đỏ', phanSauGop(kqT(1, 'KD0', 'SP x'), kqT(1, 'KD0')) === 'do', 'ca đỏ thêm bị miễn');
ca('TK-SG-do cả hai đỏ không ca nào (sập) → đỏ', phanSauGop(kqT(1), kqT(1)) === 'do', 'sập rỗng bị miễn');
ca('TK-SG-do không có đối chứng → đỏ', phanSauGop(kqT(1, 'KD0'), null) === 'do', 'miễn khi không đối chứng');
// Hình dạng đường thật: chay() chèn khoá cấp tệp vào `do` khi thoát ≠ 0 — tệp sập ở cả hai bên chỉ có khoá ấy.
const kqTep = (rc, ...doK) => ({ ...kqT(rc, 'x.test.mjs', ...doK), khoaTep: 'x.test.mjs' });
ca('TK-SG-do sập ở cả hai bên, chỉ khoá cấp tệp → đỏ', phanSauGop(kqTep(3), kqTep(3)) === 'do', 'tệp sập bị miễn thành môi trường');
ca('TK-SG-lanh khoá cấp tệp + ca đỏ y hệt → môi trường', phanSauGop(kqTep(1, 'KD0'), kqTep(1, 'KD0')) === 'moi-truong', 'không nhận môi trường khi có khoá tệp');

// TK-RLH: RA-LOP hai chiều.
const bRL = new Map([['tests/a', 'A'], ['tests/b', 'B']]);
ca('TK-RLH-lanh tập = bảng → không lệch', (r => !r.thieu.length && !r.thua.length)(lechRaLop(['tests/a', 'tests/b'], bRL)), 'lệch dù bằng');
ca('TK-RLH-do dòng bảng thừa → gọi tên', JSON.stringify(lechRaLop(['tests/a'], bRL).thua) === '["tests/b"]', 'không bắt dòng thừa');
ca('TK-RLH-do tệp thiếu → gọi tên', JSON.stringify(lechRaLop(['tests/a', 'tests/b', 'tests/c'], bRL).thieu) === '["tests/c"]', 'không bắt tệp thiếu');
// TK-RLD: cột «Dòng» của bảng phải trỏ dòng có chữ merge-base ở một phiên bản của tệp.
const bangD = docRaLopDong("| `tests/a` | A | 2 | x |\n| `tests/b` | B | 1/3 | y |");
const banD = f => (f === 'tests/a' ? ['dòng 1\nconst mb = merge-base', null] : ['merge-base\nz\nkhông', 'a\nb\ngit merge-base']);
ca('TK-RLD-lanh mọi số trỏ dòng merge-base (kể cả ở phiên bản thứ hai)', lechDongRaLop(bangD, banD).length === 0, JSON.stringify(lechDongRaLop(bangD, banD)));
const bangDDo = docRaLopDong("| `tests/a` | A | 1 | x |\n| `tests/b` | B |  | y |");
ca('TK-RLD-do số trỏ dòng không có merge-base · cột rỗng → gọi tên', JSON.stringify(lechDongRaLop(bangDDo, banD).map(l => l.split(' ')[0])) === '["tests/a:1","tests/b:"]', JSON.stringify(lechDongRaLop(bangDDo, banD)));

// TK-CU: hàm so chung của --cu — bản gốc có ca mà HEAD mất → đỏ; bản gốc null (tệp mới) → không thể đỏ theo túi.
const dat = (...k) => ({ rc: 0, do: new Map(), dat: new Map(k.map(x => [x, 1])), stderr: '', stdout: '' });
ca('TK-CU-lanh HEAD ⊇ gốc → xanh', soCuTep(dat('A', 'B'), dat('A', 'B', 'C'), []).xanh, 'không xanh');
ca('TK-CU-do HEAD mất một ca → mất khoá đúng tên', JSON.stringify(soCuTep(dat('A', 'B'), dat('A'), []).thieu) === '["B"]', 'không bắt mất khoá');
ca('TK-CU-do HEAD thoát khác 0 không ca đỏ → đỏ', !soCuTep(dat('A'), { ...dat('A'), rc: 1 }, []).xanh, 'thoát 1 bị bỏ qua');

// TK-LS: CHONG-RONG — lệnh đọc commit lịch sử phải qua pathspec hoặc đường bất biến.
const srcLanh = [
  "const RPT = '_acceptance/x/evidence-report.md';",
  "const tar = execFileSync('git', ['-C', KIT, 'archive', GOC, ...boPhan(['scripts'], c).map(x => pathspec(x, c))]);",
  "const a = git(KIT, 'show', `${GOC}:${pathspec(rel, c)}`);",
  "const b = git(KIT, 'show', `${ref}:tests/scripts/x.test.mjs`);",
  "const c2 = git(KIT, 'show', `${k}:${RPT}`);",
  "// git archive GOC scripts lib — chú thích, bỏ qua",
].join('\n');
const ls = lenhLichSu(srcLanh);
ca('TK-LS-lanh bốn lệnh, mọi lệnh ok', ls.length === 4 && ls.every(x => x.ok), JSON.stringify(ls));
const lsDo = lenhLichSu("x('archive', GOC, 'scripts', 'lib');\ny(KIT, 'show', `${GOC}:scripts/lo-trinh.mjs`);\nz(KIT, 'show', bien);");
ca('TK-LS-do archive trần · show đường phẳng · show không đọc được → ba lệnh hỏng', lsDo.length === 3 && lsDo.every(x => !x.ok), JSON.stringify(lsDo));
// Dạng chuỗi lệnh (`bash -c 'git … archive …'`, template) — 3/8 tệp K4-TB dùng dạng này (S4 lượt 2).
const lsChuoi = lenhLichSu("execFileSync('bash', ['-c', 'git -C \"$1\" archive \"$2\" \"${@:4}\" | tar -x -C \"$3\"', '_', KIT, mb, g, ...boPhan(['scripts'], c).map(x => pathspec(x, c))]);\nexecFileSync('bash', ['-c', `git -C \"$1\" archive ${SHA} \"\\${@:3}\"`, '_', KIT, g, ...boPhan(D, c).map(x => pathspec(x, c))]);");
ca('TK-LS-lanh archive trong chuỗi bash qua pathspec → hai lệnh ok', lsChuoi.length === 2 && lsChuoi.every(x => x.ok && x.loai === 'archive-chuoi'), JSON.stringify(lsChuoi));
const lsChuoiDo = lenhLichSu("execFileSync('bash', ['-c', 'git -C \"$1\" archive \"$2\" scripts lib | tar -x', '_', KIT, mb]);\nsh(`git -C ${KIT} show ${mb}:scripts/a.mjs`);\nconst ten = archive + 1;");
ca('TK-LS-do archive chuỗi trần · show chuỗi · chữ archive dạng lạ → ba lệnh hỏng', lsChuoiDo.length === 3 && lsChuoiDo.every(x => !x.ok) && JSON.stringify(lsChuoiDo.map(x => x.loai)) === '["archive-chuoi","show-chuoi","la"]', JSON.stringify(lsChuoiDo));

console.log(`giu-khoa-3 tự kiểm: ${pass}/${pass + fail} ca`);
process.exit(fail ? 1 : 0);
