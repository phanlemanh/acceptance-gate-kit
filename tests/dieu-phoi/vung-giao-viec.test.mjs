// Hồ sơ vung-giao-viec-tu-cat-luot — vùng giao việc đi từ cắt lượt. Ca VG-<n> = AC-<n> (VG-1 là phần gói của AC-1).
// Mỗi ca có cặp đối chứng trên CÙNG fixture: đổi đúng một thứ (vùng, tiến độ, khai tay) thì kết luận đổi theo. Thư mục đợt,
// worktree và kho tạm do code sinh trong lượt; bản phát lại ẩn danh ở tests/dieu-phoi/fixtures/dot-chong-vung/ là ĐẦU VÀO
// như một lượt cắt viết — ca đưa nó qua răng phủ thật và bộ đọc gói thật trước khi chạy lịch. Ca đỏ («-do») tiêm vào bản
// sao TRỌN thư mục dieu-phoi (hoặc bản phát lại) SAU khi bản sao lành xanh, và ghim thông điệp. Đường suy từ vị trí tệp.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi', 'scripts');
const FX = path.join(KIT, 'tests', 'dieu-phoi', 'fixtures', 'dot-chong-vung');
const GOC_SO = fs.readFileSync(path.join(KIT, '_acceptance', 'vung-giao-viec-tu-cat-luot', 'goc-so'), 'utf8').trim();
const NOW = Date.parse('2026-10-28T03:00:00Z');
let n = 0;
const nap = (goc, tep) => import(pathToFileURL(path.join(goc, tep)).href + `?v=${++n}`);
const tam = (p = 'vg-') => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), p)));
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2)); };
const suKien = (d) => (fs.existsSync(path.join(d, 'su-kien.jsonl')) ? fs.readFileSync(path.join(d, 'su-kien.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((x) => JSON.parse(x)) : []);
const tiep = (d, id) => docJ(path.join(d, 'tiep', `${id}.json`));
const hangCua = (d, slug) => docJ(path.join(d, 'hang-viec.json')).hang.find((h) => h.slug === slug);
function banSaoGoi() {
  const d = tam('vg-goi-');
  fs.cpSync(GOI, path.join(d, 'scripts'), { recursive: true });
  return path.join(d, 'scripts');
}
function tiem(tep, cu, moi) {
  const t = fs.readFileSync(tep, 'utf8');
  assert.equal(t.split(cu).length - 1, 1, `nhát tiêm phải khớp đúng một lần ở ${tep}`);
  fs.writeFileSync(tep, t.replace(cu, moi));
}
const CFG = {
  nhanh_chinh: 'main',
  han_thue_phut: { s4: 90, 'ghim-lai': 40, 'duong-nen': 40, merge: 120 },
  nhip_cu_phut: 10,
  suc_khoe: { swap_gb: 8, ap_luc_muc: 2, rss_gb: 8 },
  bao_ve: [],
  s4_tran_gom_phut: 60,
};
// Thư mục đợt tạm + io giả: `gop` là tập slug đã gộp vào nhánh chính; hợp đồng của hàng đang làm nằm ở worktree dãy.
function dotTam(hangViec, { cfg = {}, gh = () => '[]', diff = () => '' } = {}) {
  const d = tam('vg-dot-');
  const w = {};
  for (const day of hangViec.day) { w[day.id] = tam(`vg-w${day.id}-`); day.worktree = w[day.id]; }
  ghiJ(path.join(d, 'dieu-phoi.config.json'), { ...CFG, ...cfg });
  ghiJ(path.join(d, 'hang-viec.json'), hangViec);
  for (const x of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(d, x));
  const gop = new Set();
  const io = {
    nowMs: () => NOW,
    chay: (cmd, args) => {
      if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M';
      if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
      if (cmd === 'sysctl') return '{ 3.00 2.00 1.00 }';
      if (cmd === 'ps') return '102400 node\n';
      if (cmd === 'gh') return gh();
      if (cmd === 'git' && args[0] === '-C') return `feat/${Object.keys(w).find((k) => w[k] === args[1]) ?? 'x'}\n`;
      if (cmd === 'git' && args[0] === 'diff') return diff(args);
      if (cmd === 'git' && args[0] === 'show') {
        const slug = /_acceptance\/([^/]+)\/contract\.md$/.exec(args[1])?.[1];
        if (slug && gop.has(slug)) return '---\nstatus: machine-cleared\n---\n';
        throw new Error('not found');
      }
      return '';
    },
  };
  const batDau = (day, slug, status = 'implemented') => {
    fs.mkdirSync(path.join(w[day], '_acceptance', slug), { recursive: true });
    fs.writeFileSync(path.join(w[day], '_acceptance', slug, 'contract.md'), `---\nslug: ${slug}\nstatus: ${status}\n---\n`);
  };
  return { d, w, io, gop, batDau };
}

// ---------- VG-1: hàng mẫu của khuôn lộ trình qua bộ đọc gói thành ranh_gioi = vung (AC-1, E2) ----------
function goiTuKhuon(goc, { boVung = false } = {}) {
  const kho = tam('vg-kho-');
  const tpl = docJ(path.join(KIT, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'));
  if (boVung) for (const h of tpl.hang) delete h.vung;
  ghiJ(path.join(kho, 'lo-trinh.json'), tpl);
  const g = path.join(kho, 'goi');
  ghiJ(path.join(g, 'dieu-phoi.config.json'), { ...CFG, nguon_hang: tpl.hang.map((h) => `lo-trinh.json:${h.ma}`) });
  ghiJ(path.join(g, 'hang-viec.json'), { dot: 'mau', day: [{ id: 'P1', worktree: '/CHUA-CO-WORKTREE/P1' }], hang: tpl.hang.map((h, i) => ({ ma: h.ma, slug: `s${i}`, day: 'P1', uu_tien: i })) });
  fs.writeFileSync(path.join(g, 'LUAT-rieng.md'), '# riêng\n');
  return { kho, g, tpl };
}
test('VG-1 khuon-qua-goi: mỗi hàng mẫu của khuôn thành ranh_gioi đúng bằng vung; đối chứng khuôn bỏ vung → không ranh_gioi', async () => {
  const { docGoi } = await nap(KIT, 'dieu-phoi/scripts/goi-dot.mjs');
  const { kho, g, tpl } = goiTuKhuon();
  const hv = docGoi(g, { gocKho: kho }).hangViec;
  assert.ok(tpl.hang.length >= 3 && tpl.hang.every((h) => Array.isArray(h.vung) && h.vung.length), 'khuôn phải có vung ở mọi hàng mẫu');
  for (const h of tpl.hang) assert.deepEqual(hv.hang.find((x) => x.ma === h.ma)?.ranh_gioi, h.vung, `hàng ${h.ma}`);
  const doi = goiTuKhuon(null, { boVung: true });
  for (const h of docGoi(doi.g, { gocKho: doi.kho }).hangViec.hang) assert.equal(h.ranh_gioi, undefined, `hàng ${h.ma} không vung mà có ranh_gioi`);
});

// ---------- VG-4: gói đợt chép vùng, khai tay thắng, lộ trình không vùng y như trước (AC-4, E6) ----------
function goiBa() {
  const kho = tam('vg-kho-');
  ghiJ(path.join(kho, 'lt.json'), { schema: 1, hang: [
    { ma: 'A', cau_giao: 'a', slug: 'a', vung: ['app/a/**'] },
    { ma: 'B', cau_giao: 'b', slug: 'b', vung: ['app/b/**'] },
    { ma: 'C', cau_giao: 'c', slug: 'c' },
  ] });
  const g = path.join(kho, 'goi');
  ghiJ(path.join(g, 'dieu-phoi.config.json'), { ...CFG, nguon_hang: ['lt.json:A', 'lt.json:B', 'lt.json:C'] });
  ghiJ(path.join(g, 'hang-viec.json'), { dot: 't', day: [{ id: 'P1', worktree: '/x/P1' }], hang: [
    { ma: 'A', day: 'P1', uu_tien: 1 }, { ma: 'B', day: 'P1', uu_tien: 2, ranh_gioi: ['tay/**'] }, { ma: 'C', day: 'P1', uu_tien: 3 },
  ] });
  fs.writeFileSync(path.join(g, 'LUAT-rieng.md'), '# riêng\n');
  return { kho, g };
}
async function vg4(goc) {
  const sai = [];
  const { docGoi } = await nap(goc, 'goi-dot.mjs');
  const { docHangLoTrinh } = await nap(goc, 'nguon-hang.mjs');
  const { kho, g } = goiBa();
  const hv = docGoi(g, { gocKho: kho }).hangViec;
  const rg = (ma) => hv.hang.find((h) => h.ma === ma);
  if (JSON.stringify(rg('A')?.ranh_gioi) !== '["app/a/**"]') sai.push(`VG-4-do: A khong nhan vung (${JSON.stringify(rg('A'))})`);
  if (JSON.stringify(rg('B')?.ranh_gioi) !== '["tay/**"]') sai.push(`B mất vùng tay: ${JSON.stringify(rg('B'))}`);
  if (rg('C') && 'ranh_gioi' in rg('C')) sai.push(`C không vung mà có ranh_gioi: ${JSON.stringify(rg('C'))}`);
  const lt = docHangLoTrinh(kho, ['lt.json:A', 'lt.json:B', 'lt.json:C']).hang;
  if (JSON.stringify(lt.map((r) => r.vung ?? null)) !== JSON.stringify([['app/a/**'], ['app/b/**'], null])) sai.push(`docHangLoTrinh vung: ${JSON.stringify(lt)}`);
  return sai;
}
test('VG-4 chep-vung: A nhận vung, B giữ vùng tay, C không vung không ranh_gioi', async () => {
  assert.deepEqual(await vg4(GOI), []);
});
test('VG-4-do bo-dong-chep', async () => {
  const sao = banSaoGoi();
  assert.deepEqual(await vg4(sao), [], 'bản sao lành phải xanh');
  tiem(path.join(sao, 'goi-dot.mjs'), '...(h.ranh_gioi === undefined && ung[0].vung ? { ranh_gioi: ung[0].vung } : {})', '');
  const sai = await vg4(sao);
  assert.ok(sai.some((s) => s.startsWith('VG-4-do: A khong nhan vung')), JSON.stringify(sai));
});

// ---------- VG-5: hang them bằng mã lộ trình mang vùng của nó (AC-5, E7) ----------
function dotThem() {
  const kho = tam('vg-kho-');
  ghiJ(path.join(kho, 'lt.json'), { schema: 1, hang: [
    { ma: 'A', cau_giao: 'a', slug: 'a', vung: ['app/a/**'] },
    { ma: 'M', cau_giao: 'm', slug: 'm', vung: ['app/m/**'] },
  ] });
  const hv = { dot: 't', day: [{ id: 'P1' }, { id: 'P2' }], hang: [
    { ma: 'A', slug: 'a', day: 'P1', uu_tien: 1, ranh_gioi: ['app/a/**'] },
    { ma: 'Y', slug: 'y', day: 'P2', uu_tien: 1, ranh_gioi: ['app/m/a.tsx'] },
  ] };
  const t = dotTam(hv, { cfg: { goc_kho: kho, nguon_hang: ['lt.json:A'] } });
  ghiJ(path.join(t.d, 'trang-thai.json'), { day: [{ id: 'P2', hang: 'y', tien_do: 'dang' }] });
  return t;
}
test('VG-5 them-theo-ma: M nhận vung lộ trình và sau Y; --ranh-gioi thắng; mã ngoài lộ trình như cũ', async () => {
  const { themHang } = await nap(KIT, 'dieu-phoi/scripts/hang.mjs');
  const { d } = dotThem();
  const kq = themHang(d, 'M', 'P1');
  const m = docJ(path.join(d, 'hang-viec.json')).hang.find((h) => h.day === 'P1' && h.ranh_gioi?.includes('app/m/**'));
  assert.ok(m, `không có hàng mới mang vung lộ trình: ${JSON.stringify(docJ(path.join(d, 'hang-viec.json')).hang)}`);
  assert.deepEqual([m.ranh_gioi, m.sau, kq.sau], [['app/m/**'], ['Y'], ['Y']]);
  const tay = dotThem();
  const kt = themHang(tay.d, 'M', 'P1', { ranhGioi: ['app/khac/**'] });
  const mt = docJ(path.join(tay.d, 'hang-viec.json')).hang.find((h) => h.day === 'P1' && h.slug !== 'a');
  assert.deepEqual([mt.ranh_gioi, mt.sau, kt.sau], [['app/khac/**'], undefined, []]);
  const ngoai = dotThem();
  const kn = themHang(ngoai.d, 'Q', 'P1');
  assert.match(kn.canhBao.join('\n'), /không khai ranh_gioi/);
});

// ---------- VG-6: phát lại đợt chồng vùng (AC-6, E8) ----------
const CAP_MONG = ['H2-H3', 'H2-H4', 'H2-H5', 'H2-H8', 'H2-H9', 'H2-H10', 'H2-H11', 'H2-H12', 'H2-H13', 'H3-H5', 'H3-H8', 'H3-H9', 'H3-H10', 'H4-H10', 'H5-H7', 'H5-H8', 'H5-H9', 'H5-H10', 'H8-H9', 'H8-H10', 'H9-H10', 'H10-H11', 'H10-H12', 'H10-H13', 'H11-H12'];
const TRAN_CAP = 45;
async function capChong(fx) {
  const { mauGiao } = await nap(KIT, 'dieu-phoi/scripts/trung-tep.mjs');
  const hang = docJ(path.join(fx, 'lo-trinh.json')).hang;
  const cap = [];
  for (let i = 0; i < hang.length; i++) for (let j = i + 1; j < hang.length; j++) if (hang[i].vung.some((a) => hang[j].vung.some((b) => mauGiao(a, b)))) cap.push(`${hang[i].ma}-${hang[j].ma}`);
  const tong = (hang.length * (hang.length - 1)) / 2;
  const sai = [];
  if (cap.length > TRAN_CAP) sai.push(`VG-6-do: cap chong ${cap.length}/${tong} vuot tran ${TRAN_CAP}`);
  else if (JSON.stringify(cap) !== JSON.stringify(CAP_MONG)) sai.push(`cặp chồng lệch danh sách viết trước: ${JSON.stringify(cap)}`);
  return { sai, k: cap.length, tong };
}
async function phatLai(fx, { boVung = false } = {}) {
  const kho = tam('vg-kho-');
  const lt = docJ(path.join(fx, 'lo-trinh.json'));
  if (boVung) for (const h of lt.hang) delete h.vung;
  ghiJ(path.join(kho, 'lo-trinh.json'), lt);
  const { docGoi } = await nap(KIT, 'dieu-phoi/scripts/goi-dot.mjs');
  const { hangViec } = docGoi(path.join(fx, 'goi'), { gocKho: kho });
  const { motNhip } = await nap(KIT, 'dieu-phoi/scripts/phat-lich.mjs');
  const t = dotTam(hangViec);
  await motNhip(t.d, t.io);
  const dau = ['V1', 'V2', 'V3'].map((id) => tiep(t.d, id).hang);
  ['V1', 'V2', 'V3'].forEach((id, i) => t.batDau(id, dau[i]));
  t.gop.add('hang-1'); t.gop.add('hang-6');
  await motNhip(t.d, t.io);
  await motNhip(t.d, t.io);
  return { ...t, dau, hangViec };
}
test('VG-6 phat-lai: lộ trình qua răng không lỗi vùng; gói đọc ra vùng; hàng dáng VK8 (H5) chờ hàng dáng VK6 (H10); không vùng thì không', async () => {
  const C = await nap(KIT, 'scripts/cat-luot.mjs');
  const lt = docJ(path.join(FX, 'lo-trinh.json'));
  const r = C.kiemCo({ dot: 'phat-lai' }, lt, C.napKhoang());
  assert.deepEqual([...r.loi, ...r.canhBao].filter((x) => /vung/.test(x)), [], 'răng phủ trên bản phát lại');
  const { sai, k, tong } = await capChong(FX);
  console.log(`  VG-6 cặp chồng: ${k}/${tong}`);
  assert.deepEqual(sai, []);
  const p = await phatLai(FX);
  assert.equal(p.hangViec.hang.length, 14);
  for (const h of p.hangViec.hang) assert.deepEqual(h.ranh_gioi, lt.hang.find((x) => x.ma === h.ma).vung, `ranh_gioi ${h.ma}`);
  assert.deepEqual(p.dau, ['hang-1', 'hang-6', 'hang-10'], 'nhịp đầu: hàng đầu mỗi dãy');
  assert.ok((hangCua(p.d, 'hang-5').sau ?? []).includes('H10'), `H5 phải chờ H10: ${JSON.stringify(hangCua(p.d, 'hang-5'))}`);
  assert.ok(suKien(p.d).some((s) => s.loai === 'doi-ke-hoach' && s.kieu === 'them-sau' && s.hang === 'hang-5' && s.sau.includes('H10')));
  const doi = await phatLai(FX, { boVung: true });
  assert.equal(hangCua(doi.d, 'hang-5').sau, undefined, 'không vùng: H5 không có sau');
  assert.equal(tiep(doi.d, 'V1').hang, 'hang-2', 'không vùng: V1 nhận H2');
});
test('VG-6-do vung-cap-khu', async () => {
  const sao = tam('vg-fx-');
  fs.cpSync(FX, sao, { recursive: true });
  assert.deepEqual((await capChong(sao)).sai, [], 'bản sao lành phải xanh');
  const lt = docJ(path.join(sao, 'lo-trinh.json'));
  for (const h of lt.hang) h.vung = ['app/khu/**'];
  ghiJ(path.join(sao, 'lo-trinh.json'), lt);
  assert.deepEqual((await capChong(sao)).sai, [`VG-6-do: cap chong 91/91 vuot tran ${TRAN_CAP}`]);
});

// Bản phát lại chỉ mang tên tổng hợp — danh sách CHO PHÉP, không danh sách cấm.
const DOAN = /^(app|api|ui|tro-ly|khu|khu-chu|man-[a-z]|\*\*|khu-\*\.ts)$/;
const CHO_PHEP = [
  /^H\d+$/, /^P\d+$/, /^hang-\d+$/, /^V\d$/, /^\/CHUA-CO-WORKTREE\/V\d$/, /^$/, /^lo-trinh\.json$/, /^lo-trinh\.json:H\d+$/,
  /^main$/, /^Người dùng$/, /^Người dùng mở màn của hàng \d+$/, /^Phát lại$/, /^T2$/, /^phat-lai$/, /^Lộ trình phát lại$/,
  (s) => s.includes('/') && s.split('/').every((x) => DOAN.test(x)),
];
function laTongHop(s) { return CHO_PHEP.some((m) => (typeof m === 'function' ? m(s) : m.test(s))); }
function chuoiLa(fx) {
  const la = [];
  const di = (v, tep) => {
    if (typeof v === 'string') { if (!laTongHop(v)) la.push(`${tep}: «${v}»`); }
    else if (Array.isArray(v)) v.forEach((x) => di(x, tep));
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => di(x, tep));
  };
  const quet = (d) => {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f); const rel = path.relative(fx, p);
      if (fs.statSync(p).isDirectory()) quet(p);
      else if (f.endsWith('.json')) di(docJ(p), rel);
      else if (f.endsWith('.md')) {
        for (const dong of fs.readFileSync(p, 'utf8').split('\n')) if (!['', '# Luật riêng của đợt phát lại', 'Không có luật riêng.'].includes(dong)) la.push(`${rel}: «${dong}»`);
      } else la.push(`${rel}: tệp lạ`);
    }
  };
  quet(fx);
  return la;
}
test('VG-6-an-danh: mọi chuỗi của bản phát lại khớp khuôn tên tổng hợp', () => {
  assert.deepEqual(chuoiLa(FX), []);
});
test('VG-6-an-danh-do', () => {
  const sao = tam('vg-fx-');
  fs.cpSync(FX, sao, { recursive: true });
  assert.deepEqual(chuoiLa(sao), [], 'bản sao lành phải xanh');
  const p = path.join(sao, 'goi', 'hang-viec.json');
  const hv = docJ(p); hv.hang[4].slug = 'so-do-that'; ghiJ(p, hv);
  assert.deepEqual(chuoiLa(sao), ['goi/hang-viec.json: «so-do-that»']);
});

// ---------- VG-7, VG-8: khai vùng ở Cổng Phạm vi (AC-7, AC-8 — E10, E11) ----------
// Kho git thật làm worktree của P1 (lệnh tìm thư mục đợt qua .acceptance-runs/dieu-phoi-hien-tai của kho chính).
function dotCoKho({ z2 = ['app/b/d.tsx'], y = null } = {}) {
  const hv = { dot: 't', day: [{ id: 'P1' }, { id: 'P2' }], hang: [
    { ma: 'X', slug: 'x', day: 'P1', uu_tien: 1, ranh_gioi: ['app/a/**'] },
    ...(y ? [{ ma: 'Y', slug: 'y', day: 'P2', uu_tien: 0, ranh_gioi: y.rg }] : []),
    { ma: 'Z2', slug: 'z2', day: 'P2', uu_tien: 1, ranh_gioi: z2 },
    { ma: 'Z', slug: 'z', day: 'P2', uu_tien: 2, ranh_gioi: ['app/b/c.tsx'] },
    { ma: 'ZK', slug: 'zk', day: 'P2', uu_tien: 3, ranh_gioi: ['app/khac/k.ts'] },
  ] };
  const t = dotTam(hv);
  const k = t.w.P1;
  execFileSync('git', ['init', '-q', '-b', 'main', k]);
  fs.mkdirSync(path.join(k, '.acceptance-runs'));
  fs.symlinkSync(t.d, path.join(k, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  t.batDau('P1', 'x');
  if (y) {
    t.batDau('P2', 'y', y.status === 'ky' ? 'machine-cleared' : 'implemented');
    ghiJ(path.join(t.d, 'trang-thai.json'), { day: [{ id: 'P1', hang: 'x', tien_do: 'dang' }, { id: 'P2', hang: 'y', tien_do: y.status }] });
  }
  return t;
}
const khoiMarker = (t, m) => { const r = t.match(new RegExp(`<!-- <<<${m} -->\\n([\\s\\S]*?)<!-- ${m}>>> -->`)); return r ? r[1] : null; };
function lenhKhaiVung() {
  const skill = fs.readFileSync(path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const tdot = khoiMarker(skill, 'TRONG-DOT');
  const khoi = tdot && khoiMarker(tdot.replace(/^ {2}/gm, ''), 'TRONG-DOT-VUNG');
  const lenh = khoi && (/`(node [^`]*hang vung[^`]*)`/.exec(khoi) || [])[1];
  assert.ok(lenh, 'SKILL thiếu khối TRONG-DOT-VUNG (trong TRONG-DOT) có dòng lệnh hang vung');
  return (slug, vung) => lenh.replace('<thư mục đợt>/loi/', `${GOI}/`).replace('<slug>', slug).replace('<glob,glob>', vung);
}
const chayLenh = (cmd, cwd) => spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8' });
test('VG-7 khai-vung: lệnh rút từ SKILL gộp vùng, một dòng Nhật ký; hàng chưa mở và hàng kế đã chọn ở P2 trùng vùng mới nhận sau', async () => {
  const lenh = lenhKhaiVung();
  const { motNhip } = await nap(KIT, 'dieu-phoi/scripts/phat-lich.mjs');
  const t = dotCoKho();
  await motNhip(t.d, t.io);
  assert.equal(tiep(t.d, 'P2').hang, 'z2', 'trước khai: z2 là hàng kế của P2');
  const x = chayLenh(lenh('x', 'app/b/**'), t.w.P1);
  assert.equal(x.status, 0, x.stderr);
  assert.deepEqual(hangCua(t.d, 'x').ranh_gioi, ['app/a/**', 'app/b/**']);
  const nk = fs.readFileSync(path.join(t.d, 'LUAT.md'), 'utf8').split('\n').filter((l) => l.includes('app/b/**'));
  assert.equal(nk.length, 1, `một dòng Nhật ký: ${JSON.stringify(nk)}`);
  assert.match(nk[0], /\bx\b/);
  await motNhip(t.d, t.io);
  assert.deepEqual([hangCua(t.d, 'z2').sau, hangCua(t.d, 'z').sau, tiep(t.d, 'P2').hang], [['X'], ['X'], 'zk']);
  const truoc = [fs.readFileSync(path.join(t.d, 'hang-viec.json'), 'utf8'), fs.readFileSync(path.join(t.d, 'LUAT.md'), 'utf8')];
  const lai = chayLenh(lenh('x', 'app/b/**'), t.w.P1);
  assert.equal(lai.status, 0, lai.stderr);
  assert.match(lai.stdout, /không đổi gì/);
  assert.deepEqual([fs.readFileSync(path.join(t.d, 'hang-viec.json'), 'utf8'), fs.readFileSync(path.join(t.d, 'LUAT.md'), 'utf8')], truoc, 'chạy lại không đổi byte');
  for (const rong of ['**', '*.ts']) {
    const r = chayLenh(lenh('x', rong), t.w.P1);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /không có thư mục tĩnh/);
    assert.deepEqual([fs.readFileSync(path.join(t.d, 'hang-viec.json'), 'utf8'), fs.readFileSync(path.join(t.d, 'LUAT.md'), 'utf8')], truoc, `«${rong}» không ghi byte`);
  }
  // Đối chứng: z2 khai vùng khác → vẫn là hàng kế, không sau.
  const doi = dotCoKho({ z2: ['app/khac/**'] });
  await motNhip(doi.d, doi.io);
  assert.equal(chayLenh(lenh('x', 'app/b/**'), doi.w.P1).status, 0);
  await motNhip(doi.d, doi.io);
  assert.deepEqual([tiep(doi.d, 'P2').hang, hangCua(doi.d, 'z2').sau], ['z2', undefined]);
});
test('VG-8 bao-dang-do: hàng đang làm/đã ký ở P2 chồng vùng mới → đúng một sự kiện trung-tep cong-pham-vi, không sau, không đụng khoá', async () => {
  const { khaiVung } = await nap(KIT, 'dieu-phoi/scripts/hang.mjs');
  const anh = (d) => ['khoa', 'xin'].map((x) => fs.readdirSync(path.join(d, x)).join(','));
  for (const status of ['dang', 'ky']) {
    const t = dotCoKho({ y: { rg: ['app/b/c.tsx'], status } });
    const truoc = anh(t.d);
    const kq = khaiVung(t.d, 'x', ['app/b/**']);
    const tt = suKien(t.d).filter((s) => s.loai === 'trung-tep');
    assert.equal(tt.length, 1, `${status}: ${JSON.stringify(tt)}`);
    assert.deepEqual([tt[0].luc, tt[0].hang, tt[0].voi, tt[0].khoa, tt[0].can_phan], ['cong-pham-vi', 'x', 'hang', 'Y', false]);
    assert.equal(kq.canhBao.filter((c) => /\by\b/.test(c)).length, 1, JSON.stringify(kq.canhBao));
    assert.deepEqual([hangCua(t.d, 'x').sau, hangCua(t.d, 'y').sau], [undefined, undefined]);
    assert.deepEqual(anh(t.d), truoc, 'khoa/ và xin/ không đổi');
  }
  const doi = dotCoKho({ y: { rg: ['app/khac/**'], status: 'dang' } });
  khaiVung(doi.d, 'x', ['app/b/**']);
  assert.equal(suKien(doi.d).filter((s) => s.loai === 'trung-tep').length, 0);
});

// ---------- VG-9: kho không khai vùng giữ y bản gốc (AC-9, E12) ----------
function banGoc() {
  const d = tam('vg-goc-');
  execFileSync('bash', ['-c', `git -C "${KIT}" archive ${GOC_SO} dieu-phoi | tar -x -C "${d}"`]);
  const s = path.join(d, 'dieu-phoi', 'scripts');
  for (const f of ['trung-tep.mjs', 'lich.mjs', 'phat-lich.mjs', 'goi-dot.mjs']) assert.ok(fs.statSync(path.join(s, f)).size > 0, `bản gốc thiếu ${f}`);
  return s;
}
const hvKhongVung = () => ({ dot: 't', day: [{ id: 'P1' }, { id: 'P2' }, { id: 'P3' }], hang: [
  { ma: 'A', slug: 'a', day: 'P1', uu_tien: 1, ranh_gioi: ['_acceptance/a/**'] },
  { ma: 'B', slug: 'b', day: 'P1', uu_tien: 2 },
  { ma: 'C', slug: 'c', day: 'P2', uu_tien: 1, ranh_gioi: ['_acceptance/c/**'] },
  { ma: 'D', slug: 'd', day: 'P2', uu_tien: 2, ranh_gioi: ['_acceptance/d/**'] },
  { ma: 'E', slug: 'e', day: 'P3', uu_tien: 1 },
  { ma: 'F', slug: 'f', day: 'P3', uu_tien: 2, ranh_gioi: ['_acceptance/f/**'] },
] });
const boGio = (t) => t.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/g, '<giờ>');
async function chayNamNhip(goi) {
  const { motNhip } = await nap(goi, 'phat-lich.mjs');
  const t = dotTam(hvKhongVung(), { gh: () => '[{"headRefName":"feat/ngoai"}]', diff: () => 'apps/x.ts\n_acceptance/a/contract.md\n' });
  const buoc = [() => {}, () => { t.batDau('P1', 'a'); t.batDau('P2', 'c'); }, () => { t.gop.add('a'); }, () => { t.batDau('P1', 'b'); t.gop.add('c'); }, () => { t.gop.add('b'); t.batDau('P3', 'e'); }];
  for (const b of buoc) { b(); await motNhip(t.d, t.io); }
  const ra = { hv: fs.readFileSync(path.join(t.d, 'hang-viec.json'), 'utf8').replace(/"worktree": "[^"]*"/g, '"worktree": "<w>"') };
  for (const id of ['P1', 'P2', 'P3']) ra[`tiep-${id}`] = fs.readFileSync(path.join(t.d, 'tiep', `${id}.json`), 'utf8');
  ra.luat = fs.existsSync(path.join(t.d, 'LUAT.md')) ? boGio(fs.readFileSync(path.join(t.d, 'LUAT.md'), 'utf8')) : '';
  ra.suKien = suKien(t.d).map(({ luc, ...s }) => JSON.stringify(s)).join('\n');
  return ra;
}
async function vg9(goiMoi, goiGoc) {
  const sai = [];
  const a = await chayNamNhip(goiGoc); const b = await chayNamNhip(goiMoi);
  for (const k of Object.keys(a)) if (a[k] !== b[k]) sai.push(`lech ${k}`);
  const { kho, g } = (() => {
    const kho = tam('vg-kho-');
    ghiJ(path.join(kho, 'lt.json'), { schema: 1, hang: [{ ma: 'A', cau_giao: 'a', slug: 'a' }, { ma: 'C', cau_giao: 'c', slug: 'c' }] });
    const g = path.join(kho, 'goi');
    ghiJ(path.join(g, 'dieu-phoi.config.json'), { ...CFG, nguon_hang: ['lt.json:A', 'lt.json:C'] });
    ghiJ(path.join(g, 'hang-viec.json'), { dot: 't', day: [{ id: 'P1', worktree: '/x/P1' }], hang: [{ ma: 'A', day: 'P1', uu_tien: 1, ranh_gioi: ['_acceptance/a/**'] }, { ma: 'C', day: 'P1', uu_tien: 2 }] });
    fs.writeFileSync(path.join(g, 'LUAT-rieng.md'), '# riêng\n');
    return { kho, g };
  })();
  const ga = (await nap(goiGoc, 'goi-dot.mjs')).docGoi(g, { gocKho: kho });
  const gb = (await nap(goiMoi, 'goi-dot.mjs')).docGoi(g, { gocKho: kho });
  if (JSON.stringify(ga) !== JSON.stringify(gb)) sai.push('VG-9-do: lech hang-viec');
  return sai;
}
test('VG-9 vi-phan: thư mục đợt không vùng qua năm nhịp — bản gốc và bản mới cho cùng tiep, hang-viec, LUAT, sự kiện; docGoi y nhau', async () => {
  assert.deepEqual(await vg9(GOI, banGoc()), []);
});
test('VG-9-do chep-vung-ca-khi-khong-vung', async () => {
  const goc = banGoc();
  const sao = banSaoGoi();
  assert.deepEqual(await vg9(sao, goc), [], 'bản sao lành phải xanh');
  tiem(path.join(sao, 'goi-dot.mjs'), 'ung[0].vung ? { ranh_gioi: ung[0].vung } : {}', "true ? { ranh_gioi: ung[0].vung ?? ['app/**'] } : {}");
  assert.ok((await vg9(sao, goc)).includes('VG-9-do: lech hang-viec'));
});
