// Ca đo của hồ sơ ten-may-mot-luat (issue #464 — một luật tên máy cho kênh liên máy). Tên ca bắt đầu «TM-». Mỗi phép
// đo là một hàm trả danh sách lỗi trên MỘT gốc gói; ca đỏ chạy CHÍNH hàm ấy trên bản sao bị tiêm (bước tiêm phải áp
// đúng một chỗ), SAU khi gói thật xanh trên cùng fixture, và ghim thông điệp của đúng lỗi được tiêm. Bên viết là CLI
// tin.mjs thật qua gh giả; bên đọc là docDongDau thật — không fixture nào viết tay đúng khuôn bên đọc.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GOI, KENH, bamCay, banSao, donDep, ghGia, git, hoSo, inMaTran, khoDot, khoKenh, nap, tam, tepKenhCua, tin } from './tin-kho-thu.mjs';

after(donDep);
const T0 = Date.parse('2026-10-18T08:00:00Z');
const D = '1810';
const LUAT = 'tên máy chỉ gồm chữ và số (thành tiền tố mã tin)';
const NGUON = "export const TEN_MAY_NGUON = '[A-Za-z0-9]+';";

const bang = () => {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  return { loi, hang, so };
};

// Bản sao của MỘT gốc gói bất kỳ (gói thật hay bản đã tiêm) với một nhát thay — áp đúng một chỗ.
function saoTu(goc, tep, cu, moi) {
  const dich = tam('tm-sao-');
  fs.cpSync(goc, dich, { recursive: true });
  const p = path.join(dich, 'scripts', tep);
  const truoc = fs.readFileSync(p, 'utf8');
  assert.equal(truoc.split(cu).length - 1, 1, `bước thay vào ${tep} phải khớp đúng một chỗ: «${cu.slice(0, 60)}»`);
  fs.writeFileSync(p, truoc.replace(cu, moi));
  assert.notEqual(fs.readFileSync(p, 'utf8'), truoc);
  return dich;
}

const khoTrong = () => {
  const kho = tam('tm-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'remote', 'add', 'origin', 'https://github.com/thu/kho-a.git');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  return fs.realpathSync(kho);
};
const daDang = (gh) => gh.ca().comments.map((c) => c.body);
const soGhi = (gh) => gh.nhatKy().filter((x) => x.lenh === 'ghi').length;

// ---------- AC-1: luật dùng chung × vòng viết→đọc ----------
const HOP_LE = ['MBP', 'MacStudio', 'M5', 'G', 'P2', 'Mac2'];
const KHONG_HOP_LE = ['Mac Studio', 'Mac-Studio', 'Máy', 'MBP ', '', 'Mac_Studio'];

async function kiemKhuHoi(gocGoi) {
  const { TEN_MAY_RE, vietDongDau, docDongDau, maMoi } = await nap(gocGoi, 'tin-doc.mjs');
  const { loi, hang, so } = bang();
  for (const t of [...HOP_LE, ...KHONG_HOP_LE]) {
    const ky = HOP_LE.includes(t);
    const nhan = Boolean(TEN_MAY_RE?.test(t));
    so(`«${t}» luật`, ky ? 'nhận' : 'từ chối', nhan ? 'nhận' : 'từ chối', nhan === ky);
    if (!nhan) continue;
    const ma = maMoi([], t, T0);
    const dd = docDongDau(vietDongDau({ khau_lenh: 'GIAO', ma, tu: t, den: t }));
    const thuc = dd ? `den=${dd.den} tu=${dd.tu} ma=${dd.ma}` : 'đọc ra null';
    so(`«${t}» viết→đọc`, `den=${t} tu=${t} ma=${ma}`, thuc, dd?.den === t && dd?.tu === t && dd?.ma === ma);
  }
  return { loi, hang };
}

test('TM-1 khu-hoi', async () => {
  const { loi, hang } = await kiemKhuHoi(GOI);
  inMaTran('TM-1', hang);
  assert.equal(hang.length, 18);
  assert.deepEqual(loi, []);
});

test('TM-1-do noi-luat', async () => {
  assert.deepEqual((await kiemKhuHoi(GOI)).loi, []);
  const goc = banSao('tin-doc.mjs', NGUON, "export const TEN_MAY_NGUON = '[A-Za-z0-9 ]+';");
  const { loi } = await kiemKhuHoi(goc);
  assert.ok(loi.some((l) => l.startsWith('«Mac Studio» viết→đọc:') && l.includes('đọc ra null')), `nới luật nhận khoảng trắng phải làm hàng «Mac Studio» đọc ra null, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-2: bên viết với tên hợp lệ — tin tới đúng máy ----------
async function kiemVietHopLe(gocGoi) {
  const { docDongDau } = await nap(gocGoi, 'tin-doc.mjs');
  const { loi, hang, so } = bang();
  const gh = ghGia({ nextId: 900 });
  const o = { gocGoi, nowMs: T0, gh: gh.lenh };
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const lenh = [
    ['GIAO', 'MacStudio', 'chạy lại bộ đọc lộ trình', '--ket-qua', 'bảng đọc lộ trình', '--kenh', KENH],
    ['HỎI', 'MacStudio', 'bản 2.36.2 đã nhận chưa', '--kenh', KENH],
    ['BÁO', 'MacStudio', 'đã gộp bản vá', '--kenh', KENH],
  ];
  for (const l of lenh) {
    gh.xoaNhatKy();
    const r = tin(mbp, l, o);
    const ghi = soGhi(gh);
    const dd = docDongDau(daDang(gh).at(-1) ?? '');
    so(`${l[0]} MacStudio`, 'thoát 0 · 1 bình luận · den=MacStudio tu=MBP', `${r.ma} · ${ghi} · den=${dd?.den} tu=${dd?.tu} ${r.err}`, r.ma === 0 && ghi === 1 && dd?.den === 'MacStudio' && dd?.tu === 'MBP');
  }
  const ms = khoKenh({ gocGoi, may: 'MacStudio', gh: gh.lenh, remote: 'https://github.com/thu/kho-b.git', loTrinh: false });
  const r = tin(ms, ['so', '--kenh', KENH, '--json'], o);
  let ds = [];
  try {
    ds = JSON.parse(r.out).filter((v) => v.den === 'MacStudio');
  } catch {}
  so('MacStudio thấy vòng gửi mình', 'GIAO,HỎI', ds.map((v) => v.khau_lenh_mo).join(','), r.ma === 0 && ds.map((v) => v.khau_lenh_mo).join(',') === 'GIAO,HỎI');
  return { loi, hang };
}

test('TM-2 viet-hop-le', async () => {
  const { loi, hang } = await kiemVietHopLe(GOI);
  inMaTran('TM-2', hang);
  assert.equal(hang.length, 4);
  assert.deepEqual(loi, []);
});

// ---------- AC-3: bên viết hỏng to với tên sai — không lời gọi gh nào, kênh không đổi ----------
const DICH_SAI = {
  'Mac Studio': `tin: đích «Mac Studio» không hợp lệ — ${LUAT}; thử «MacStudio»`,
  'MBP ': `tin: đích «MBP » không hợp lệ — ${LUAT}; thử «MBP»`,
  'Mac-Studio': `tin: đích «Mac-Studio» không hợp lệ — ${LUAT}`,
  Máy: `tin: đích «Máy» không hợp lệ — ${LUAT}`,
  '': `tin: đích «» không hợp lệ — ${LUAT}`,
};

async function kiemVietSai(gocGoi) {
  const { loi, hang, so } = bang();
  const gh = ghGia({ nextId: 950 });
  const o = { gocGoi, nowMs: T0, gh: gh.lenh };
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const cauCua = { GIAO: ['một việc', '--ket-qua', 'một kết quả'], HỎI: ['một câu hỏi'], BÁO: ['một câu'] };
  for (const kl of ['GIAO', 'HỎI', 'BÁO']) {
    for (const [dich, thongDiep] of Object.entries(DICH_SAI)) {
      gh.xoaNhatKy();
      const truoc = bamCay(path.dirname(tepKenhCua(mbp)));
      const r = tin(mbp, [kl, dich, ...cauCua[kl], '--kenh', KENH], o);
      const goi = gh.nhatKy().length;
      const sau = bamCay(path.dirname(tepKenhCua(mbp)));
      so(`${kl} «${dich}»`, `thoát 1 · «${thongDiep}» · 0 lời gọi gh · kênh không đổi`, `${r.ma} · «${r.err.trim()}» · ${goi} · ${truoc === sau ? 'không đổi' : 'ĐỔI'}`, r.ma === 1 && r.err.trim() === thongDiep && goi === 0 && truoc === sau);
    }
  }
  return { loi, hang };
}

test('TM-3 viet-sai', async () => {
  const { loi, hang } = await kiemVietSai(GOI);
  inMaTran('TM-3', hang);
  assert.equal(hang.length, 15);
  assert.deepEqual(loi, []);
});

test('TM-3-do khong-kiem', async () => {
  assert.deepEqual((await kiemVietSai(GOI)).loi, []);
  const goc = banSao('tin.mjs', '    if (sai) loi(sai);', '    if (sai && false) loi(sai);');
  const { loi } = await kiemVietSai(goc);
  assert.ok(loi.some((l) => l.startsWith('GIAO «Mac Studio»:')), `gỡ bước kiểm đích phải làm hàng GIAO «Mac Studio» đỏ, nhận: ${loi.join(' | ')}`);
  // Và đúng hiện tượng của issue: tin đăng được mà bên đọc trả null.
  const { docDongDau } = await nap(goc, 'tin-doc.mjs');
  const gh = ghGia({ nextId: 990 });
  const mbp = khoKenh({ gocGoi: goc, may: 'MBP', gh: gh.lenh });
  gh.xoaNhatKy();
  const r = tin(mbp, ['GIAO', 'Mac Studio', 'một việc', '--ket-qua', 'một kết quả', '--kenh', KENH], { gocGoi: goc, nowMs: T0, gh: gh.lenh });
  assert.equal(r.ma, 0, r.err);
  assert.equal(soGhi(gh), 1);
  assert.equal(docDongDau(daDang(gh).at(-1)), null);
});

// ---------- AC-4: nhận vai cùng luật; một nguồn cho nhận vai, bên viết và mã tin ----------
test('TM-4 vai', () => {
  const kho = khoTrong();
  const sai = tin(kho, ['vai', '--kenh', KENH, '--may', 'Mac Studio']);
  assert.equal(sai.ma, 1);
  assert.equal(sai.err.trim(), `tin: tên máy «Mac Studio» không hợp lệ — ${LUAT}; thử «MacStudio»`);
  assert.equal(fs.existsSync(tepKenhCua(kho)), false, 'vai bị từ chối không được tạo tệp trạng thái kênh');
  const dung = tin(kho, ['vai', '--kenh', KENH, '--may', 'MacStudio']);
  assert.equal(dung.ma, 0, dung.err);
  // Đối chứng dương của vế vắng mặt: tên hợp lệ tạo tệp ở ĐÚNG đường dẫn vừa dò.
  assert.equal(fs.existsSync(tepKenhCua(kho)), true, 'vai hợp lệ phải tạo tệp trạng thái kênh ở đường dẫn đã dò');
});

// Một nguồn: trên bản dẫn xuất CHỈ đổi nguồn luật để nhận gạch nối, mọi chỗ dùng tên máy phải đổi theo.
async function kiemMotNguon(gocGoi) {
  const loi = [];
  const goc = saoTu(gocGoi, 'tin-doc.mjs', NGUON, "export const TEN_MAY_NGUON = '[A-Za-z0-9-]+';");
  const { docDongDau } = await nap(goc, 'tin-doc.mjs');
  const kho = khoTrong();
  const gh = ghGia({ nextId: 1200 });
  const o = { gocGoi: goc, nowMs: T0, gh: gh.lenh };
  const v = tin(kho, ['vai', '--kenh', KENH, '--may', 'Mac-Studio'], o);
  if (v.ma !== 0) {
    loi.push(`vai không đọc luật dùng chung: ${v.err.trim()}`);
    return loi;
  }
  gh.xoaNhatKy();
  const g = tin(kho, ['GIAO', 'Mac-Studio', 'một việc', '--ket-qua', 'một kết quả', '--kenh', KENH], o);
  if (g.ma !== 0 || soGhi(gh) !== 1) {
    loi.push(`bên viết không đọc luật dùng chung: ${g.ma} ${g.err.trim()}`);
    return loi;
  }
  const dd = docDongDau(daDang(gh).at(-1));
  if (dd?.ma !== `Mac-Studio-${D}-1` || dd?.den !== 'Mac-Studio') loi.push(`mã tin không rút từ luật dùng chung: ${JSON.stringify(dd)}`);
  return loi;
}

test('TM-4 mot-nguon', async () => {
  assert.deepEqual(await kiemMotNguon(GOI), []);
});

test('TM-4-do vai-rieng', async () => {
  assert.deepEqual(await kiemMotNguon(GOI), []);
  const goc = banSao('tin-kenh.mjs', "const sai = loiTenMay(co.may, 'tên máy');", `const sai = /^[A-Za-z0-9]+$/u.test(co.may) ? null : '${LUAT}';`);
  const loi = await kiemMotNguon(goc);
  assert.ok(loi.some((l) => l.startsWith('vai không đọc luật dùng chung')), `vai giữ biểu thức tại chỗ phải bị bắt, nhận: ${loi.join(' | ')}`);
});

test('TM-4-do viet-rieng', async () => {
  assert.deepEqual(await kiemMotNguon(GOI), []);
  const goc = banSao('tin.mjs', "const sai = loiTenMay(vi[1], 'đích');", `const sai = /^[A-Za-z0-9]+$/u.test(vi[1]) ? null : \`đích «\${vi[1]}» không hợp lệ — ${LUAT}\`;`);
  const loi = await kiemMotNguon(goc);
  assert.ok(loi.some((l) => l.startsWith('bên viết không đọc luật dùng chung')), `bên viết giữ biểu thức tại chỗ phải bị bắt, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-5: chế độ đợt không đổi ----------
test('TM-5 dot-khong-doi', () => {
  const k = khoDot({ hang: [{ ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 }] });
  hoSo(k.w2, 'hang-b');
  const o = { nowMs: T0 };
  const sai = tin(k.kho, ['GIAO', 'Mac Studio', 'một việc'], o);
  assert.equal(sai.ma, 1);
  assert.ok(sai.err.includes('đích Mac Studio không có trong đợt (dãy hoặc G)'), sai.err);
  assert.ok(!sai.err.includes(LUAT), `chế độ đợt không được dùng thông điệp tên máy: ${sai.err}`);
  const dung = tin(k.kho, ['GIAO', 'P2', 'làm trọn hàng b', '--hang', 'hang-b'], o);
  assert.equal(dung.ma, 0, dung.err);
});
