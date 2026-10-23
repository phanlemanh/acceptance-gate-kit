// Hồ sơ ky-den-gop, hạng C — lịch biết tệp. Mỗi ca có cặp đối chứng trên CÙNG fixture: đổi đúng một thứ (vùng tệp,
// nhánh, tiến độ) thì kết luận đổi theo; không đổi thì giữ như cũ.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chonHangKe } from '../../../dieu-phoi/scripts/lich.mjs';
import { docNhanhMo, mauGiao, xetTrungTep } from '../../../dieu-phoi/scripts/trung-tep.mjs';
import { xetYeuCau } from '../../../dieu-phoi/scripts/yeu-cau.mjs';
import { motNhip } from '../../../dieu-phoi/scripts/phat-lich.mjs';
import { themHang, themSau } from '../../../dieu-phoi/scripts/hang.mjs';
import { CFG_PHAT_LICH } from './mau-thu.mjs';

const PHIEU = 'apps/web/src/company/company-sheet.tsx';
const hv = (rgY = ['apps/web/src/company/**']) => ({
  dot: 'thu',
  day: [{ id: 'P1', worktree: '/w1' }, { id: 'P2', worktree: '/w2' }],
  hang: [
    { ma: 'X', slug: 'x', day: 'P1', uu_tien: 1, ranh_gioi: [PHIEU] },
    { ma: 'Z', slug: 'z', day: 'P1', uu_tien: 2, ranh_gioi: ['apps/api/**'] },
    { ma: 'Y', slug: 'y', day: 'P2', uu_tien: 1, ranh_gioi: rgY },
  ],
});

test('C-1 mauGiao: tệp trong thư mục, hai thư mục lồng nhau trùng; thư mục anh em và hai tệp khác không trùng', () => {
  const bang = [
    [PHIEU, 'apps/web/src/company/**', true],
    ['apps/web/src/company/**', PHIEU, true],
    ['apps/web/**', 'apps/web/src/company/*.tsx', true],
    [PHIEU, PHIEU, true],
    ['apps/a/**', 'apps/ab/**', false],
    [PHIEU, 'apps/web/src/company/company-list.tsx', false],
    ['apps/web/src/company/*.tsx', 'apps/web/src/company/sub/x.tsx', false],
  ];
  for (const [a, b, mong] of bang) assert.equal(mauGiao(a, b), mong, `${a} × ${b}`);
});

test('C-2 chonHangKe: hàng sẵn sàng trùng tệp với hàng đang làm ở dãy khác → giao hàng kế không trùng, liệt hàng bỏ qua', () => {
  const h = hv();
  const tienDo = new Map([['y', 'dang']]);
  const trung = (x) => xetTrungTep(x, { hangViec: h, tienDo });
  const kq = chonHangKe(h, 'P1', tienDo, null, trung);
  assert.equal(kq.hang, 'z');
  assert.deepEqual(kq.trung.map((t) => [t.hang, t.voi[0].voi, t.voi[0].khoa]), [['x', 'hang', 'Y']]);
  // Đối chứng 1: không hàm trùng → như cũ, hàng ưu tiên đầu.
  assert.equal(chonHangKe(h, 'P1', tienDo).hang, 'x');
  // Đối chứng 2: Y đã gộp → không còn đang dở → X được giao.
  assert.equal(chonHangKe(h, 'P1', new Map([['y', 'gop']]), null, (x) => xetTrungTep(x, { hangViec: h, tienDo: new Map([['y', 'gop']]) })).hang, 'x');
  // Đối chứng 3: Y khai vùng khác → X được giao.
  const h2 = hv(['apps/mobile/**']);
  assert.equal(chonHangKe(h2, 'P1', tienDo, null, (x) => xetTrungTep(x, { hangViec: h2, tienDo })).hang, 'x');
  // Đã ký mà chưa gộp cũng là đang dở (ca phiếu hai cột).
  const kyChuaGop = new Map([['y', 'ky']]);
  assert.equal(chonHangKe(h, 'P1', kyChuaGop, null, (x) => xetTrungTep(x, { hangViec: h, tienDo: kyChuaGop })).hang, 'z');
});

test('C-3 chonHangKe: mọi hàng sẵn sàng đều trùng → chờ «trung-tep»; phụ thuộc `sau` nhận slug của hàng không mã', () => {
  const h = hv();
  h.hang = h.hang.filter((x) => x.ma !== 'Z');
  const tienDo = new Map([['y', 'dang']]);
  const kq = chonHangKe(h, 'P1', tienDo, null, (x) => xetTrungTep(x, { hangViec: h, tienDo }));
  assert.deepEqual([kq.hang, kq.cho], [null, 'trung-tep']);
  const k = { dot: 't', day: [{ id: 'P1' }, { id: 'P2' }], hang: [{ slug: 'a', day: 'P2' }, { slug: 'b', day: 'P1', sau: ['a'] }] };
  assert.equal(chonHangKe(k, 'P1', new Map([['a', 'dang']])).cho, 'phu-thuoc');
  assert.equal(chonHangKe(k, 'P1', new Map([['a', 'gop']])).hang, 'b');
});

test('C-4 xetTrungTep: PR của CHÍNH dãy không là xung đột; PR của dãy khác quy về hàng của dãy ấy; PR ngoài đợt là «pr»', () => {
  const h = hv(['apps/mobile/**']);
  const tienDo = new Map([['y', 'dang']]);
  const nhanhMo = { theoNhanh: new Map([['feat/P1', [PHIEU]]]), loi: null };
  const cua = (p1) => new Map([['P1', p1], ['P2', 'feat/P2']]);
  assert.deepEqual(xetTrungTep(h.hang[0], { hangViec: h, tienDo, nhanhMo, nhanhCuaDay: cua('feat/P1') }).trung, []);
  // Đối chứng: nhánh ấy không phải của P1 → PR ngoài đợt.
  assert.deepEqual(xetTrungTep(h.hang[0], { hangViec: h, tienDo, nhanhMo, nhanhCuaDay: cua('feat/khac') }).trung.map((t) => [t.voi, t.nhanh]), [['pr', 'feat/P1']]);
  const nm2 = { theoNhanh: new Map([['feat/P2', [PHIEU]]]), loi: null };
  assert.deepEqual(xetTrungTep(h.hang[0], { hangViec: h, tienDo, nhanhMo: nm2, nhanhCuaDay: cua('feat/P1') }).trung.map((t) => [t.voi, t.khoa]), [['hang', 'Y']]);
  assert.equal(xetTrungTep({ slug: 'q', day: 'P1' }, { hangViec: h, tienDo }).vang, true);
});

test('C-5 docNhanhMo: gh lỗi hay diff một nhánh lỗi → `loi` nói ra (không còn tập rỗng im lặng); đọc được → loi null', () => {
  const cfg = { nhanh_chinh: 'main' };
  const ioLoi = { chay: () => { throw new Error('gh: not logged in'); } };
  assert.match(docNhanhMo(ioLoi, cfg).loi, /gh pr list lỗi: gh: not logged in/);
  const ioMot = { chay: (c, a) => (c === 'gh' ? '[{"headRefName":"a"},{"headRefName":"fork"}]' : a[2].endsWith('origin/fork') ? (() => { throw new Error('x'); })() : `${PHIEU}\n`) };
  const kq = docNhanhMo(ioMot, cfg);
  assert.equal(kq.loi, 'không đọc được tệp của nhánh fork');
  assert.deepEqual(kq.theoNhanh.get('a'), [PHIEU]);
  const ioTot = { chay: (c) => (c === 'gh' ? '[{"headRefName":"a"}]' : `${PHIEU}\n`) };
  assert.equal(docNhanhMo(ioTot, cfg).loi, null);
});

test('C-6 xét chạm tệp: không dò được nhánh mở → giám sát phán, không duyệt máy; dò được và không ai chạm → máy duyệt', () => {
  const nc = (them) => ({ hangViec: { hang: [] }, nhanhChamTep: new Map(), nhanhCua: () => 'feat/P1', yeuCauGanDay: [], ...them });
  const yc = { phien: 'P1', loai: 'cham-tep', noi_dung: { tep: ['apps/x.ts'] } };
  const cfg = { bao_ve: [] };
  const loi = xetYeuCau(yc, nc({ nhanhLoi: 'gh pr list lỗi: timeout' }), cfg);
  assert.equal(loi.ket_qua, 'can_phan');
  assert.match(loi.ly_do, /không dò được nhánh mở \(gh pr list lỗi: timeout\)/);
  assert.equal(xetYeuCau(yc, nc({ nhanhLoi: null }), cfg).ket_qua, 'duyet');
  // Nhánh của chính phiên chạm tệp → không phải xung đột (hạt giống 10/10 lỗ 2).
  assert.equal(xetYeuCau(yc, nc({ nhanhChamTep: new Map([['apps/x.ts', ['feat/P1']]]) }), cfg).ket_qua, 'duyet');
});

// ---- Bộ phát lịch thật trên thư mục đợt tạm ----
const tam = () => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp-tt-')));
const NOW = Date.parse('2026-10-23T12:00:00Z');
function dot({ rgY = ['apps/web/src/company/**'], gh = () => '[]', diff = () => '' } = {}) {
  const d = tam();
  const w1 = tam();
  const w2 = tam();
  fs.writeFileSync(path.join(d, 'dieu-phoi.config.json'), JSON.stringify(CFG_PHAT_LICH));
  const h = hv(rgY);
  h.day = [{ id: 'P1', worktree: w1 }, { id: 'P2', worktree: w2 }];
  fs.writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify(h));
  for (const x of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(d, x));
  fs.mkdirSync(path.join(w2, '_acceptance', 'y'), { recursive: true });
  fs.writeFileSync(path.join(w2, '_acceptance', 'y', 'contract.md'), '---\nslug: y\nstatus: implemented\n---\n');
  const io = {
    nowMs: () => NOW,
    chay: (cmd, args) => {
      if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M';
      if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
      if (cmd === 'sysctl') return '{ 3.00 2.00 1.00 }';
      if (cmd === 'ps') return '102400 node\n';
      if (cmd === 'gh') return gh();
      if (cmd === 'git' && args[0] === '-C') return args[1] === w1 ? 'feat/P1\n' : 'feat/P2\n';
      if (cmd === 'git' && args[0] === 'diff') return diff(args);
      if (cmd === 'git' && args[0] === 'show') throw new Error('not found');
      return '';
    },
  };
  return { d, io };
}
const suKien = (d) => fs.readFileSync(path.join(d, 'su-kien.jsonl'), 'utf8').trim().split('\n').map((x) => JSON.parse(x));
const tiep = (d, id) => JSON.parse(fs.readFileSync(path.join(d, 'tiep', `${id}.json`), 'utf8'));
const hangCua = (d, slug) => JSON.parse(fs.readFileSync(path.join(d, 'hang-viec.json'), 'utf8')).hang.find((h) => h.slug === slug);

test('C-7 bộ phát lịch: X trùng Y đang làm ở P2 → P1 nhận Z, X ghi `sau: [Y]` + một sự kiện; đối chứng Y khác vùng → P1 nhận X', async () => {
  const { d, io } = dot();
  await motNhip(d, io);
  await motNhip(d, io);
  assert.equal(tiep(d, 'P1').hang, 'z');
  assert.deepEqual(hangCua(d, 'x').sau, ['Y']);
  const them = suKien(d).filter((s) => s.loai === 'doi-ke-hoach' && s.kieu === 'them-sau');
  assert.equal(them.length, 1, 'hai nhịp chỉ một lần ghi sau');
  assert.deepEqual([them[0].hang, them[0].sau], ['x', ['Y']]);
  assert.match(fs.readFileSync(path.join(d, 'LUAT.md'), 'utf8'), /x chờ Y gộp trước \(trùng tệp\)/);
  const doi = dot({ rgY: ['apps/mobile/**'] });
  await motNhip(doi.d, doi.io);
  assert.equal(tiep(doi.d, 'P1').hang, 'x');
  assert.equal(hangCua(doi.d, 'x').sau, undefined);
});

test('C-8 bộ phát lịch: PR ngoài đợt sửa phiếu → giữ X (một sự kiện trung-tep), không ghi sau; PR của chính P1 → không giữ', async () => {
  const { d, io } = dot({ rgY: ['apps/mobile/**'], gh: () => '[{"headRefName":"feat/ngoai"}]', diff: () => `${PHIEU}\n` });
  await motNhip(d, io);
  await motNhip(d, io);
  assert.equal(tiep(d, 'P1').hang, 'z');
  assert.equal(hangCua(d, 'x').sau, undefined);
  const tt = suKien(d).filter((s) => s.loai === 'trung-tep');
  assert.equal(tt.length, 1);
  assert.deepEqual([tt[0].hang, tt[0].nhanh, tt[0].tep], ['x', 'feat/ngoai', [PHIEU]]);
  const chup = JSON.parse(fs.readFileSync(path.join(d, 'trang-thai.json'), 'utf8')).nhanh_mo;
  assert.deepEqual([chup.theo_nhanh['feat/ngoai'], chup.nhanh_day.P1], [[PHIEU], 'feat/P1']);
  const minh = dot({ rgY: ['apps/mobile/**'], gh: () => '[{"headRefName":"feat/P1"}]', diff: () => `${PHIEU}\n` });
  await motNhip(minh.d, minh.io);
  assert.equal(tiep(minh.d, 'P1').hang, 'x');
});

test('C-9 bộ phát lịch: gh lỗi → một sự kiện trung-tep-mu, lịch không đứng (vẫn so hàng của đợt); hàng không vùng tệp → ranh-gioi-vang', async () => {
  const { d, io } = dot({ rgY: ['apps/mobile/**'], gh: () => { throw new Error('gh: not found'); } });
  await motNhip(d, io);
  await motNhip(d, io);
  assert.equal(tiep(d, 'P1').hang, 'x');
  assert.equal(suKien(d).filter((s) => s.loai === 'trung-tep-mu').length, 1);
  const v = dot({ rgY: ['apps/mobile/**'] });
  const h = JSON.parse(fs.readFileSync(path.join(v.d, 'hang-viec.json'), 'utf8'));
  delete h.hang[0].ranh_gioi;
  fs.writeFileSync(path.join(v.d, 'hang-viec.json'), JSON.stringify(h));
  await motNhip(v.d, v.io);
  await motNhip(v.d, v.io);
  assert.equal(tiep(v.d, 'P1').hang, 'x', 'không khai vùng tệp không chặn');
  const vang = suKien(v.d).filter((s) => s.loai === 'ranh-gioi-vang');
  assert.deepEqual(vang.map((s) => s.hang), ['x']);
});

test('C-10 hang them: hàng mới trùng vùng của hàng đang dở (trang-thai) → tự `sau`; khác vùng → không; không vùng → cảnh báo', () => {
  const { d } = dot();
  fs.writeFileSync(path.join(d, 'trang-thai.json'), JSON.stringify({ day: [{ id: 'P2', hang: 'y', tien_do: 'dang' }] }));
  const kq = themHang(d, 'moi-phieu', 'P1', { ranhGioi: [PHIEU] });
  assert.deepEqual(kq.sau, ['Y']);
  assert.deepEqual(hangCua(d, 'moi-phieu').sau, ['Y']);
  const khac = themHang(d, 'moi-api', 'P1', { ranhGioi: ['apps/api/src/a.ts'] });
  assert.deepEqual([khac.sau, hangCua(d, 'moi-api').sau], [[], undefined]);
  const vang = themHang(d, 'moi-trong', 'P1');
  assert.match(vang.canhBao.join('\n'), /moi-trong không khai ranh_gioi/);
  // Hàng có sẵn ở dãy khác: vùng tệp đi theo.
  const chep = themHang(d, 'Z', 'P2');
  assert.deepEqual(hangCua(d, 'z') && JSON.parse(fs.readFileSync(path.join(d, 'hang-viec.json'), 'utf8')).hang.filter((h) => h.slug === 'z').map((h) => h.ranh_gioi), [['apps/api/**'], ['apps/api/**']]);
  assert.equal(chep.doi, true);
});

test('C-11 gh lỗi hẳn mà có bản chụp PR đời trước → lịch so bằng bản chụp ấy (giữ X), trung-tep-mu nêu tuổi; không bản chụp → X được giao', async () => {
  let ghHong = false;
  const { d, io } = dot({ rgY: ['apps/mobile/**'], gh: () => { if (ghHong) throw new Error('gh: auth expired'); return '[{"headRefName":"feat/ngoai"}]'; }, diff: () => `${PHIEU}\n` });
  await motNhip(d, io);
  assert.equal(tiep(d, 'P1').hang, 'z', 'nhịp 1: gh tốt, PR ngoài đợt giữ X');
  // Bản chụp già hơn một phút → nhịp sau dò lại; gh hỏng hẳn.
  const p = path.join(d, 'trang-thai.json');
  const tt = JSON.parse(fs.readFileSync(p, 'utf8'));
  tt.nhanh_mo.luc = new Date(NOW - 3 * 60_000).toISOString();
  fs.writeFileSync(p, JSON.stringify(tt));
  ghHong = true;
  await motNhip(d, io);
  await motNhip(d, io);
  assert.equal(tiep(d, 'P1').hang, 'z', 'gh hỏng: vẫn giữ X theo bản chụp cũ');
  const mu = suKien(d).filter((s) => s.loai === 'trung-tep-mu');
  assert.equal(mu.length, 1);
  assert.match(mu[0].ly_do, /gh pr list lỗi: gh: auth expired — lịch so bằng bản chụp PR cũ 3′/);
  assert.deepEqual(JSON.parse(fs.readFileSync(p, 'utf8')).nhanh_mo.theo_nhanh['feat/ngoai'], [PHIEU], 'bản chụp tốt không bị bản dò hỏng ghi đè');
  // Đối chứng: chưa từng có bản chụp → không có gì để so, X được giao (C-9).
  const moi = dot({ rgY: ['apps/mobile/**'], gh: () => { throw new Error('gh: auth expired'); } });
  await motNhip(moi.d, moi.io);
  assert.equal(tiep(moi.d, 'P1').hang, 'x');
});

test('C-12 hai hàng kế trùng vùng ở hai dãy cùng nhịp → đúng MỘT hàng mang sau, hàng kia được giao; themSau không ghi ngược khi hàng kia đã chờ hàng này', async () => {
  const { d, io } = dot();
  const h = JSON.parse(fs.readFileSync(path.join(d, 'hang-viec.json'), 'utf8'));
  h.hang = [
    { ma: 'X', slug: 'x', day: 'P1', uu_tien: 1, ranh_gioi: [PHIEU] },
    { ma: 'Y', slug: 'y2', day: 'P2', uu_tien: 1, ranh_gioi: ['apps/web/src/company/**'] },
  ];
  fs.writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify(h));
  fs.writeFileSync(path.join(d, 'tiep', 'P1.json'), JSON.stringify({ phien: 'P1', hang: 'x', moi: true, ke: { hang: 'x', moi: true } }));
  fs.writeFileSync(path.join(d, 'tiep', 'P2.json'), JSON.stringify({ phien: 'P2', hang: 'y2', moi: true, ke: { hang: 'y2', moi: true } }));
  await motNhip(d, io);
  await motNhip(d, io);
  const sau = JSON.parse(fs.readFileSync(path.join(d, 'hang-viec.json'), 'utf8')).hang.filter((x) => x.sau?.length);
  assert.equal(sau.length, 1, JSON.stringify(sau));
  const giao = [tiep(d, 'P1').hang, tiep(d, 'P2').hang].filter(Boolean);
  assert.equal(giao.length, 1);
  assert.notEqual(giao[0], sau[0].slug);
  // themSau: hàng Y đã chờ X → ghi X chờ Y bị từ chối (không dựng vòng); đối chứng: Y không chờ X → ghi được.
  const k = dot();
  const hk = JSON.parse(fs.readFileSync(path.join(k.d, 'hang-viec.json'), 'utf8'));
  hk.hang.find((x) => x.slug === 'y').sau = ['X'];
  fs.writeFileSync(path.join(k.d, 'hang-viec.json'), JSON.stringify(hk));
  assert.equal(themSau(k.d, 'x', 'P1', [{ khoa: 'Y' }]).doi, false);
  assert.equal(themSau(k.d, 'x', 'P1', [{ khoa: 'Z' }]).doi, true);
});

test('C-13 gh hỏng ĐÚNG nhịp có yêu cầu chạm tệp chờ duyệt → lịch vẫn so bằng bản chụp cũ, bản chụp tốt không bị ghi đè, yêu cầu lên giám sát', async () => {
  let ghHong = false;
  const { d, io } = dot({ rgY: ['apps/mobile/**'], gh: () => { if (ghHong) throw new Error('gh: auth expired'); return '[{"headRefName":"feat/ngoai"}]'; }, diff: () => `${PHIEU}\n` });
  await motNhip(d, io);
  const p = path.join(d, 'trang-thai.json');
  const tt = JSON.parse(fs.readFileSync(p, 'utf8'));
  tt.nhanh_mo.luc = new Date(NOW - 3 * 60_000).toISOString();
  fs.writeFileSync(p, JSON.stringify(tt));
  ghHong = true;
  // Yêu cầu chạm tệp chờ duyệt: đường xét chạm tệp dò PR TRƯỚC lịch trong cùng nhịp (ca S4-r1).
  fs.writeFileSync(path.join(d, 'yeu-cau', 'P2-1.json'), JSON.stringify({ phien: 'P2', loai: 'cham-tep', hang: null, noi_dung: { tep: ['apps/mobile/a.ts'] }, luc: new Date(NOW).toISOString() }));
  await motNhip(d, io);
  await motNhip(d, io);
  assert.equal(tiep(d, 'P1').hang, 'z', 'gh hỏng + yêu cầu chờ: vẫn giữ X theo bản chụp cũ');
  assert.deepEqual(JSON.parse(fs.readFileSync(p, 'utf8')).nhanh_mo.theo_nhanh['feat/ngoai'], [PHIEU], 'bản chụp tốt không bị bản dò hỏng ghi đè');
  const yc = suKien(d).filter((s) => s.loai === 'yeu-cau' && s.id === 'P2-1');
  assert.equal(yc.length, 1);
  assert.equal(yc[0].can_phan, true);
  assert.match(yc[0].ly_do, /không dò được nhánh mở \(gh pr list lỗi: gh: auth expired — lịch so bằng bản chụp PR cũ 3′/);
});
