// Ca đo của hồ sơ vong-mo-khong-mat-dau (hàng GT2 — vòng mở không mất dấu). Tên ca bắt đầu «GD-». Mỗi phép đo là một
// hàm trả {loi, hang} trên MỘT gốc gói; ca đỏ chạy CHÍNH hàm ấy trên bản sao bị tiêm (banSao kiểm bước tiêm áp) hoặc trên
// bản gói trước GT2 (git archive sha ghim), SAU khi gói thật xanh trên cùng fixture, và ghim thông điệp của đúng hàng.
// Mọi tin do lệnh `tin` sinh trong lượt; dấu máy do hook thật (lệnh rút từ hooks.json) ghi; kênh là gh giả.
import { test, after } from 'node:test';
import { spawn, execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { ENV, GOI, KENH, KIT, bamCay as bamCayThu, banSao, chayHook, chayNode as chayNodeThu, docJ, donDep, ghGia, git, inMaTran, khoDot as khoDotThu, khoKenh, nap, tam, tepKenhCua, tin } from './tin-kho-thu.mjs';

after(donDep);

// Bản gói trước GT2 cho chiều đỏ và cho tệp kênh đời trước (AC-3): origin/main lúc mở vòng.
export const SHA_TRUOC_GT2 = '33c9e64f';
let gocCuDem = null;
export function gocTruocGT2() {
  if (gocCuDem) return gocCuDem;
  const d = tam('gd-cu-');
  try {
    const tar = execFileSync('git', ['archive', SHA_TRUOC_GT2, 'dieu-phoi'], { cwd: KIT, maxBuffer: 1 << 28 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
  } catch (e) {
    throw new Error(`không dựng được bản đời trước (${SHA_TRUOC_GT2}): ${e.message.split('\n')[0]}`);
  }
  gocCuDem = path.join(d, 'dieu-phoi');
  return gocCuDem;
}

const TRE_MS = 1500;
const ngu = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function choTep(p, ms = 10_000) {
  const het = Date.now() + ms;
  while (!fs.existsSync(p)) {
    if (Date.now() > het) throw new Error(`chờ tệp mốc quá ${ms} ms: ${p}`);
    await ngu(20);
  }
  return Number(fs.readFileSync(p, 'utf8'));
}

// `tin <doiSo>` của MỘT gốc gói ở tiến trình nền; trả promise {ma, out, err}.
function tinNen(gocGoi, cwd, doiSo, gh) {
  return new Promise((ok) => {
    const c = spawn(process.execPath, [path.join(gocGoi, 'scripts', 'tin.mjs'), ...doiSo], { cwd, env: { ...ENV, DIEU_PHOI_GH: gh } });
    let out = '';
    let err = '';
    c.stdout.on('data', (b) => { out += b; });
    c.stderr.on('data', (b) => { err += b; });
    c.on('close', (ma) => ok({ ma, out, err }));
  });
}

// Chen trong khe đồng bộ: đặt trễ một lần, chạy `tin canh` nền, chờ mốc «bắt đầu đọc», chạy `viec`, chờ canh thoát.
// Trả {canh, moc: {batDau, truoc, sau, traVe}, kq} — truoc/sau là đồng hồ thật quanh `viec`.
async function chenTrongKhe(gocGoi, cwd, gh, viec, treMs = TRE_MS) {
  for (const f of ['moc-doc-bat-dau', 'moc-doc-tra-ve']) fs.rmSync(path.join(gh.dir, f), { force: true });
  gh.dat({ tre: { ms: treMs, lan: 1 } });
  const canhP = tinNen(gocGoi, cwd, ['canh', '--kenh', KENH], gh.lenh);
  const batDau = await choTep(path.join(gh.dir, 'moc-doc-bat-dau'));
  const truoc = Date.now();
  const kq = await viec();
  const sau = Date.now();
  const canh = await canhP;
  const traVe = Number(fs.readFileSync(path.join(gh.dir, 'moc-doc-tra-ve'), 'utf8'));
  return { canh, moc: { batDau, truoc, sau, traVe }, kq };
}
const trongKhe = (m) => m.batDau < m.truoc && m.sau < m.traVe;
const vietMoc = (m) => `bắt đầu đọc ${m.batDau} < ghi ${m.truoc}…${m.sau} < trả về ${m.traVe}`;

function soKenh(gocGoi, kho, gh, coMo = false) {
  const r = tin(kho, ['so', '--kenh', KENH, ...(coMo ? [] : ['--tat-ca']), '--json'], { gocGoi, gh: gh.lenh });
  if (r.ma !== 0) throw new Error(`tin so thoát ${r.ma}: ${r.err}`);
  return JSON.parse(r.out);
}

// Hai máy kênh: MBP (kho-a, có lộ trình) giao cho M5 (kho-b). Mọi tin sinh bằng lệnh tin (gói thật — vật của phía gửi
// không phải vật đang đo). Trả {gh, mbp, m5, ma}.
function haiMay(gocGoi, { m5Goc = gocGoi } = {}) {
  const gh = ghGia({ comments: [], nextId: 10 });
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const m5 = khoKenh({ gocGoi: m5Goc, may: 'M5', gh: gh.lenh, remote: 'https://github.com/thu/kho-b.git', loTrinh: false });
  const g = tin(mbp, ['GIAO', 'M5', 'đọc lộ trình nhiều kho trước mốc', '--hang', 'GT1', '--kenh', KENH, '--kho', 'thu/kho-b'], { gocGoi, gh: gh.lenh });
  assert.equal(g.ma, 0, g.err);
  return { gh, mbp, m5, ma: g.out.split('\n')[0].split(' ')[1] };
}

// ---------- AC-1: ba dấu máy sống qua đồng bộ ----------
export async function kiemDauMay(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  // (a) «đã đến» trên M5.
  {
    const { gh, m5, ma } = haiMay(gocGoi);
    soKenh(gocGoi, m5, gh);
    const k = await chenTrongKhe(gocGoi, m5, gh, async () => chayHook(gocGoi, 'PostToolUse', { cwd: m5, tool_name: 'Bash' }, { gh: gh.lenh }));
    const v = soKenh(gocGoi, m5, gh).find((x) => x.ma === ma);
    so('(a) đã đến sống qua đồng bộ', `canh 0 · trong khe · nấc 2 da-den`, `canh ${k.canh.ma} · ${vietMoc(k.moc)} · nấc ${v?.nac} ${v?.trang_thai}`, k.canh.ma === 0 && trongKhe(k.moc) && v?.nac === 2 && v?.trang_thai === 'da-den');
  }
  // (b) «chấp nhận» trên MBP.
  {
    const { gh, mbp, m5, ma } = haiMay(gocGoi);
    const n = tin(m5, ['NHẬN', ma, 'sẽ giao bộ đọc lộ trình nhiều kho', '--kenh', KENH], { gocGoi, gh: gh.lenh });
    const x = tin(m5, ['XONG', ma, '--vat', 'sha thu', '--kenh', KENH], { gocGoi, gh: gh.lenh });
    soKenh(gocGoi, mbp, gh);
    const k = await chenTrongKhe(gocGoi, mbp, gh, async () => chayHook(gocGoi, 'PostToolUse', { cwd: mbp, tool_name: 'Bash' }, { gh: gh.lenh }));
    const v = soKenh(gocGoi, mbp, gh).find((y) => y.ma === ma);
    const mo = soKenh(gocGoi, mbp, gh, true).some((y) => y.ma === ma);
    so('(b) chấp nhận sống qua đồng bộ', 'canh 0 · trong khe · da-chap-nhan · vắng sổ mở', `nhận ${n.ma} xong ${x.ma} · canh ${k.canh.ma} · ${vietMoc(k.moc)} · ${v?.trang_thai} · sổ mở ${mo ? 'còn' : 'vắng'}`, n.ma === 0 && x.ma === 0 && k.canh.ma === 0 && trongKhe(k.moc) && v?.trang_thai === 'da-chap-nhan' && !mo);
  }
  // (c) «kết lượt khi chưa nhận» trên M5 (hook dừng đang ở lượt dừng lặp → ghi dấu, cho qua).
  {
    const { gh, m5, ma } = haiMay(gocGoi);
    soKenh(gocGoi, m5, gh);
    const k = await chenTrongKhe(gocGoi, m5, gh, async () => chayHook(gocGoi, 'Stop', { cwd: m5, stop_hook_active: true }, { gh: gh.lenh }));
    const v = soKenh(gocGoi, m5, gh).find((x) => x.ma === ma);
    so('(c) kết lượt sống qua đồng bộ', 'canh 0 · trong khe · ket_luot_chua_nhan true', `canh ${k.canh.ma} · ${vietMoc(k.moc)} · ${v?.ket_luot_chua_nhan}`, k.canh.ma === 0 && trongKhe(k.moc) && v?.ket_luot_chua_nhan === true);
  }
  return { loi, hang };
}

test('GD-01 dau-may-song-qua-dong-bo', async () => {
  const { loi, hang } = await kiemDauMay(GOI);
  inMaTran('GD-01', hang);
  assert.equal(hang.length, 3);
  assert.deepEqual(loi, []);
});

test('GD-01-do ban-truoc-gt2', async () => {
  const { loi } = await kiemDauMay(gocTruocGT2());
  for (const [h, thuc] of [['(a)', 'nấc 1 chua-den'], ['(b)', 'cho-chap-nhan'], ['(c)', '· false']]) {
    assert.ok(loi.some((l) => l.startsWith(h) && l.includes(thuc)), `bản trước GT2 phải làm hàng ${h} đỏ với «${thuc}», nhận: ${loi.join(' | ')}`);
  }
});

// ---------- AC-2: hook dừng chặn đúng một lần dù đồng bộ chen giữa ----------
export async function kiemChanMotLan(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const { gh, m5 } = haiMay(gocGoi);
  soKenh(gocGoi, m5, gh);
  const k = await chenTrongKhe(gocGoi, m5, gh, async () => chayHook(gocGoi, 'Stop', { cwd: m5 }, { gh: gh.lenh }));
  so('lần Stop một', 'chặn · trong khe', `${k.kq.json?.decision ?? 'cho qua'} · ${vietMoc(k.moc)}`, k.kq.json?.decision === 'block' && trongKhe(k.moc));
  const r2 = chayHook(gocGoi, 'Stop', { cwd: m5 }, { gh: gh.lenh });
  so('lần Stop hai', 'cho qua', r2.json?.decision ?? 'cho qua', r2.json?.decision !== 'block');
  return { loi, hang };
}

test('GD-02 chan-mot-lan-qua-dong-bo', async () => {
  const { loi, hang } = await kiemChanMotLan(GOI);
  inMaTran('GD-02', hang);
  assert.equal(hang.length, 2);
  assert.deepEqual(loi, []);
});

test('GD-02-do dong-bo-ghi-de', async () => {
  const goc = banSao('tin-kenh.mjs', '  const tl = docTrangThai(p);\n  let moi = 0;', '  const tl = tt;\n  let moi = 0;');
  const { loi } = await kiemChanMotLan(goc);
  assert.ok(loi.some((l) => l.startsWith('lần Stop hai') && l.includes('nhận block')), `đồng bộ ghi lại bản cũ phải làm lần Stop hai chặn, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-3: tệp kênh đời trước ----------
export async function kiemDoiTruoc(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const cu = gocTruocGT2();
  const { gh, mbp, m5, ma: maA } = haiMay(gocGoi, { m5Goc: cu });
  // Bản đời trước đồng bộ và ghi «đã đến» của vòng A vào tệp trạng thái.
  soKenh(cu, m5, gh);
  chayHook(cu, 'PostToolUse', { cwd: m5, tool_name: 'Bash' }, { gh: gh.lenh });
  const maySuCu = docJ(tepKenhCua(m5)).may_su ?? [];
  assert.ok(maySuCu.some((d) => d.may === 'da-den' && d.ma === maA), `đối chứng dương: tệp đời trước phải có «đã đến» của ${maA} trong may_su, có: ${JSON.stringify(maySuCu)}`);
  // Bản mới: vòng B, đồng bộ, hook ghi «đã đến», thêm một dòng ghi dở vào tệp dấu.
  const g = tin(mbp, ['GIAO', 'M5', 'vòng thứ hai cho bản mới', '--hang', 'GT1', '--kenh', KENH, '--kho', 'thu/kho-b'], { gh: gh.lenh });
  assert.equal(g.ma, 0, g.err);
  const maB = g.out.split('\n')[0].split(' ')[1];
  soKenh(gocGoi, m5, gh);
  chayHook(gocGoi, 'PostToolUse', { cwd: m5, tool_name: 'Bash' }, { gh: gh.lenh });
  // Dấu thứ hai (kết lượt khi chưa nhận) để tệp dấu có hơn một dòng, rồi một dòng ghi dở ở cuối.
  chayHook(gocGoi, 'Stop', { cwd: m5, stop_hook_active: true }, { gh: gh.lenh });
  const dTin = path.dirname(tepKenhCua(m5));
  const tepDau = fs.readdirSync(dTin).filter((f) => f.startsWith('kenh-') && f.includes('.may.'));
  for (const f of tepDau) fs.appendFileSync(path.join(dTin, f), '{"may":"da-den","ma":');
  const sv = soKenh(gocGoi, m5, gh);
  const a = sv.find((v) => v.ma === maA);
  const b = sv.find((v) => v.ma === maB);
  so('vòng A (dấu đời trước)', 'da-den', a?.trang_thai, a?.trang_thai === 'da-den');
  so('vòng B (dấu mới)', 'da-den', b?.trang_thai, b?.trang_thai === 'da-den');
  let quet;
  try {
    const { cacMinh } = await nap(gocGoi, 'tin-dua.mjs');
    const kenh = cacMinh(m5).ds.filter((t) => t.loai === 'kenh');
    quet = `${kenh.length} kênh: ${kenh.map((t) => t.kenhTen).join(', ')}`;
    so('bộ quét kênh thấy đúng 1 kênh', '1 kênh: thu/kenh#308', quet, kenh.length === 1 && kenh[0].kenhTen === 'thu/kenh#308');
  } catch (e) {
    so('bộ quét kênh thấy đúng 1 kênh', '1 kênh: thu/kenh#308', `ném: ${e.message}`, false);
  }
  return { loi, hang };
}

test('GD-03 tep-kenh-doi-truoc', async () => {
  const { loi, hang } = await kiemDoiTruoc(GOI);
  inMaTran('GD-03', hang);
  assert.equal(hang.length, 3);
  assert.deepEqual(loi, []);
});

test('GD-03-do bo-doc-cu', async () => {
  const goc = banSao('tin-noi-chua.mjs', '  const ra = Array.isArray(cu) ? [...cu] : [];', '  const ra = [];');
  const { loi } = await kiemDoiTruoc(goc);
  assert.ok(loi.some((l) => l.startsWith('vòng A')), `bỏ đọc may_su cũ phải làm vòng A đỏ, nhận: ${loi.join(' | ')}`);
  assert.ok(!loi.some((l) => l.startsWith('vòng B')), `đối chứng: vòng B vẫn xanh, nhận: ${loi.join(' | ')}`);
});

test('GD-03-do quet-nham', async () => {
  const goc = banSao('tin-noi-chua.mjs', "pTrangThai.replace(/\\.json$/u, '.may.jsonl')", "pTrangThai.replace(/\\.json$/u, '.may.json')");
  const { loi } = await kiemDoiTruoc(goc);
  assert.ok(loi.some((l) => l.startsWith('bộ quét kênh thấy đúng 1 kênh')), `tệp dấu đuôi .json phải làm bộ quét đỏ, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-4: hai lần đồng bộ chồng nhau ----------
export async function kiemHaiDongBo(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const t0 = Date.now() - 600_000;
  const binh = (id, phut, body) => {
    const luc = new Date(t0 + phut * 60_000).toISOString().replace(/\.\d+Z$/u, 'Z');
    return { id, created_at: luc, updated_at: luc, body };
  };
  const gh = ghGia({ comments: [binh(1, 0, 'ghi chú một'), binh(2, 1, 'ghi chú hai')], nextId: 3 });
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const m5 = khoKenh({ gocGoi, may: 'M5', gh: gh.lenh, remote: 'https://github.com/thu/kho-b.git', loTrinh: false });
  soKenh(gocGoi, m5, gh);
  const k = await chenTrongKhe(gocGoi, m5, gh, async () => {
    const g = tin(mbp, ['GIAO', 'M5', 'việc chen giữa hai lần đồng bộ', '--hang', 'GT1', '--kenh', KENH, '--kho', 'thu/kho-b'], { gocGoi, gh: gh.lenh });
    gh.dat({ comments: [...gh.ca().comments, binh(4, 9, 'ghi chú bốn')] });
    const lanHai = tin(m5, ['canh', '--kenh', KENH], { gocGoi, gh: gh.lenh });
    gh.dat({ loi: true });
    const s1 = chayHook(gocGoi, 'Stop', { cwd: m5 }, { gh: gh.lenh });
    gh.dat({ loi: false });
    const s2 = chayHook(gocGoi, 'Stop', { cwd: m5 }, { gh: gh.lenh });
    const giua = docJ(tepKenhCua(m5));
    return { g, lanHai, s1, s2, chan: giua.chan, loiLuc: giua.kenh_loi_chan_luc };
  }, 4000);
  const tt = docJ(tepKenhCua(m5));
  const ids = tt.dong.map((d) => d.id);
  so('id trong sổ', '[1,2,3,4] · lần hai 0 · trong khe', `${JSON.stringify(ids)} · giao ${k.kq.g.ma} lần hai ${k.kq.lanHai.ma} · ${vietMoc(k.moc)}`, JSON.stringify(ids) === '[1,2,3,4]' && k.kq.g.ma === 0 && k.kq.lanHai.ma === 0 && trongKhe(k.moc));
  so('con trỏ', '4', tt.con_tro, tt.con_tro === 4);
  so('dấu chặn còn nguyên', JSON.stringify(k.kq.chan), JSON.stringify(tt.chan), k.kq.chan != null && JSON.stringify(tt.chan) === JSON.stringify(k.kq.chan));
  so('mốc lỗi kênh còn nguyên', String(k.kq.loiLuc), String(tt.kenh_loi_chan_luc), k.kq.loiLuc != null && tt.kenh_loi_chan_luc === k.kq.loiLuc);
  return { loi, hang };
}

test('GD-04 hai-dong-bo-chong', async () => {
  const { loi, hang } = await kiemHaiDongBo(GOI);
  inMaTran('GD-04', hang);
  assert.equal(hang.length, 4);
  assert.deepEqual(loi, []);
});

test('GD-04-do thay-dong', async () => {
  const goc = banSao('tin-kenh.mjs', '  const tl = docTrangThai(p);\n  let moi = 0;', '  const tl = { ...docTrangThai(p), dong: [...tt.dong] };\n  let moi = 0;');
  const { loi } = await kiemHaiDongBo(goc);
  assert.ok(loi.some((l) => l.startsWith('id trong sổ')), `thay dong bằng bản của mình phải làm «id trong sổ» đỏ, nhận: ${loi.join(' | ')}`);
});

void git;

// ---------- AC-5, AC-6: hạn chỉ nhận số phút nguyên dương ----------
// Bản sao gói với nhiều chỗ tiêm trong một tệp; mỗi chỗ phải khớp đúng một lần và đổi được nội dung.
function banSaoNhieu(tep, cap) {
  const goc = banSao(tep, cap[0][0], cap[0][1]);
  const p = path.join(goc, 'scripts', tep);
  for (const [cu, moi] of cap.slice(1)) {
    const truoc = fs.readFileSync(p, 'utf8');
    assert.equal(truoc.split(cu).length - 1, 1, `bước tiêm vào ${tep} phải khớp đúng một chỗ: «${cu.slice(0, 60)}»`);
    fs.writeFileSync(p, truoc.replace(cu, moi));
  }
  return goc;
}

const CO_HAN = [['GIAO', '--han', 'han'], ['GIAO', '--han-xong', 'han-xong'], ['HỎI', '--han', 'han']];
// Nơi chứa dựng trong lượt: đợt (G giao cho P2, P1 hỏi G) và kênh (MBP giao/hỏi M5). Trả {ten, gui(kl, co, gt), bam(), soGhi(), doc(ma)}.
function noiChua(gocGoi, loai) {
  if (loai === 'dot') {
    const k = khoDotThu(gocGoi);
    return {
      ten: 'đợt',
      gui: (kl, co, gt) => (kl === 'GIAO' ? tin(k.kho, ['GIAO', 'P2', 'việc có hạn riêng', co, gt], { gocGoi }) : tin(k.w1, ['HỎI', 'G', 'câu hỏi có hạn riêng?', co, gt], { gocGoi })),
      bam: () => bamCayThu(k.dot),
      soGhi: () => 0,
      doc: (ma) => JSON.parse(tin(k.kho, ['so', '--tat-ca', '--json'], { gocGoi }).out).find((v) => v.ma === ma),
    };
  }
  const { gh, mbp } = haiMay(gocGoi);
  return {
    ten: 'kênh',
    gui: (kl, co, gt) => (kl === 'GIAO'
      ? tin(mbp, ['GIAO', 'M5', 'việc có hạn riêng', '--hang', 'GT1', '--kenh', KENH, '--kho', 'thu/kho-b', co, gt], { gocGoi, gh: gh.lenh })
      : tin(mbp, ['HỎI', 'M5', 'câu hỏi có hạn riêng?', '--kenh', KENH, co, gt], { gocGoi, gh: gh.lenh })),
    bam: () => `${bamCayThu(path.dirname(tepKenhCua(mbp)))}|${JSON.stringify(gh.ca().comments)}`,
    soGhi: () => gh.nhatKy().filter((x) => x.lenh === 'ghi').length,
    doc: (ma) => soKenh(gocGoi, mbp, gh).find((v) => v.ma === ma),
  };
}

export async function kiemHanSai(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  for (const loai of ['dot', 'kenh']) {
    const nc = noiChua(gocGoi, loai);
    for (const gt of ['1.5', 'abc', '-5', '0', '', '1e3', ' 30']) {
      for (const [kl, co, khoa] of CO_HAN) {
        const h0 = nc.bam();
        const g0 = nc.soGhi();
        const r = nc.gui(kl, co, gt);
        const ky = `tin: --${khoa} phải là số phút nguyên dương, nhận «${gt}»`;
        const bamBang = nc.bam() === h0;
        const ghi = nc.soGhi() - g0;
        so(`${nc.ten} ${kl} ${co} «${gt}»`, `thoát 1 · «${ky}» · băm bằng · 0 lời gọi ghi`, `${r.ma} · «${r.err.trim()}» · băm ${bamBang ? 'bằng' : 'khác'} · ${ghi} lời gọi ghi`, r.ma === 1 && r.err.trim() === ky && bamBang && ghi === 0);
      }
    }
  }
  return { loi, hang };
}

test('GD-05 han-sai-bi-tu-choi', async () => {
  const { loi, hang } = await kiemHanSai(GOI);
  inMaTran('GD-05', hang);
  assert.equal(hang.length, 42);
  assert.deepEqual(loi, []);
});

test('GD-05-do bo-kiem-han', async () => {
  const goc = banSao('tin.mjs', "  const hanNhan = phutNguyenDuong(co, 'han', 30);", '  const hanNhan = co.han != null ? Number(co.han) : 30;');
  const { loi } = await kiemHanSai(goc);
  assert.ok(loi.some((l) => / --han «/u.test(l)), `bỏ kiểm --han phải làm hàng --han đỏ, nhận: ${loi.slice(0, 3).join(' | ')}`);
  assert.ok(!loi.some((l) => / --han-xong «/u.test(l)), `đối chứng: hàng --han-xong vẫn xanh, nhận: ${loi.filter((l) => l.includes('--han-xong')).slice(0, 2).join(' | ')}`);
});

test('GD-05-do kiem-sau-ghi', async () => {
  const goc = banSaoNhieu('tin.mjs', [
    ["  const hanNhan = phutNguyenDuong(co, 'han', 30);", '  const hanNhan = co.han != null ? Number(co.han) : 30;'],
    ["  const hanXong = phutNguyenDuong(co, 'han-xong', null);", "  const hanXong = co['han-xong'] != null ? Number(co['han-xong']) : null;"],
    ['  await nc.them({ text, luc: new Date(nowMs).toISOString() });\n  return text;\n}\n\nasync function dap(', "  await nc.them({ text, luc: new Date(nowMs).toISOString() });\n  phutNguyenDuong(co, 'han', 30);\n  phutNguyenDuong(co, 'han-xong', null);\n  return text;\n}\n\nasync function dap("],
  ]);
  const { loi } = await kiemHanSai(goc);
  assert.ok(loi.some((l) => l.startsWith('đợt ') && l.includes('băm khác')), `kiểm sau khi ghi phải làm hàng đợt đỏ ở «băm», nhận: ${loi.slice(0, 2).join(' | ')}`);
  assert.ok(loi.some((l) => l.startsWith('kênh ') && l.includes('1 lời gọi ghi')), `kiểm sau khi ghi phải làm hàng kênh đỏ ở «lời gọi ghi», nhận: ${loi.filter((l) => l.startsWith('kênh')).slice(0, 2).join(' | ')}`);
});

export async function kiemHanDung(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  for (const loai of ['dot', 'kenh']) {
    const nc = noiChua(gocGoi, loai);
    for (const gt of ['1', '45', '100000']) {
      for (const [kl, co, khoa] of CO_HAN) {
        const r = nc.gui(kl, co, gt);
        const ma = r.out.split('\n')[0].split(' ')[1];
        const v = r.ma === 0 ? nc.doc(ma) : null;
        const doc = khoa === 'han' ? v?.han_nhan_phut : v?.han_xong_khoang;
        so(`${nc.ten} ${kl} ${co} ${gt}`, `thoát 0 · sổ đọc ${gt}`, `${r.ma} ${r.err.trim()} · sổ đọc ${doc}`, r.ma === 0 && doc === Number(gt));
      }
    }
  }
  return { loi, hang };
}

test('GD-06 han-dung-khu-hoi', async () => {
  const { loi, hang } = await kiemHanDung(GOI);
  inMaTran('GD-06', hang);
  assert.equal(hang.length, 18);
  assert.deepEqual(loi, []);
});

test('GD-06-do lam-tron', async () => {
  const goc = banSao('tin.mjs', '  return Number(v);\n}', '  return Math.round(Number(v) / 10) * 10;\n}');
  const { loi } = await kiemHanDung(goc);
  assert.ok(loi.some((l) => / 1: mong/u.test(l)) && loi.some((l) => / 45: mong/u.test(l)), `làm tròn phải làm hàng 1 và 45 đỏ, nhận: ${loi.slice(0, 3).join(' | ')}`);
  assert.ok(!loi.some((l) => / 100000: mong/u.test(l)), `đối chứng: hàng 100000 vẫn xanh, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-7, AC-8, AC-9: đáp yêu cầu kiểu cũ tới đúng người hỏi ----------
const ioGia = (nowMs) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('khong co');
    return '';
  },
});
// Yêu cầu kiểu cũ của P1, sinh bằng CLI dieu-phoi.mjs thật. Trả id.
function yeuCauCu(gocGoi, k, loai = 'gia-han') {
  const r = chayNodeThu([path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), 'yeu-cau', loai, '--noi-dung', '{"uoc_phut":10}'], { cwd: k.w1 });
  assert.equal(r.ma, 0, r.err);
  return r.out.trim();
}
const traLoiCua = (k, id) => path.join(k.dot, 'tra-loi', `${id}.json`);
const boLuc = (o) => {
  if (!o) return o;
  const { luc: _l, ...con } = o;
  return con;
};
// Hook chờ người của P1 (lệnh rút từ hooks.json, sự kiện Notification · idle_prompt): ghi cho-nguoi/P1.json khi P1 rảnh
// mà KHÔNG còn chờ trả lời; còn chờ thì im. Trả true khi hook coi P1 đang chờ trả lời.
function p1DangChoTraLoi(gocGoi, k) {
  const tep = path.join(k.dot, 'cho-nguoi', 'P1.json');
  fs.rmSync(tep, { force: true });
  chayHook(gocGoi, 'Notification', { cwd: k.w1, notification_type: 'idle_prompt', message: 'rảnh' });
  const cho = !fs.existsSync(tep);
  fs.rmSync(tep, { force: true });
  return cho;
}

export async function kiemXongCu(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const k = khoDotThu(gocGoi);
  const id = yeuCauCu(gocGoi, k);
  const choTruoc = p1DangChoTraLoi(gocGoi, k);
  const cau = 'gia hạn được, khoá còn trống tới tối';
  const a = tin(k.kho, ['XONG', id, cau], { gocGoi });
  so('(a) G XONG yêu cầu kiểu cũ', `thoát 0, stdout chứa ${id} và P1`, `${a.ma} ${a.out.trim()} ${a.err.trim()}`, a.ma === 0 && a.out.includes(id) && a.out.includes('P1'));
  const tl = fs.existsSync(traLoiCua(k, id)) ? docJ(traLoiCua(k, id)) : null;
  const ky = { ket_qua: 'da-tra-loi', boi: 'giam-sat', ly_do: cau };
  so('(b) hộp người hỏi', JSON.stringify(ky), JSON.stringify(boLuc(tl)), tl != null && isDeepStrictEqual(boLuc(tl), ky));
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  await taoVong(k.dot, ioGia(Date.now()), () => Date.now())();
  const hong = fs.existsSync(path.join(k.dot, 'tra-loi', 'hong', `${id}.json`));
  so('(c) bộ phát lịch nhận trả lời', 'không vào hong/, tệp còn ở tra-loi/', `hong ${hong} · tra-loi ${fs.existsSync(traLoiCua(k, id))}`, !hong && fs.existsSync(traLoiCua(k, id)));
  const soJ = JSON.parse(tin(k.kho, ['so', '--json'], { gocGoi }).out || '[]');
  so('(d) sổ mở không còn vòng', `không có ${id}`, soJ.map((v) => v.ma).join(',') || '(rỗng)', !soJ.some((v) => v.ma === id));
  const choSau = p1DangChoTraLoi(gocGoi, k);
  so('(e) hook chờ người của P1', 'trước: chờ trả lời · sau: thôi chờ', `trước: ${choTruoc ? 'chờ' : 'không chờ'} · sau: ${choSau ? 'chờ' : 'thôi chờ'}`, choTruoc && !choSau);
  const id2 = yeuCauCu(gocGoi, k);
  const f = tin(k.kho, ['XONG', id2, 'duyệt gia hạn', '--ket-qua', 'duyet'], { gocGoi });
  const tl2 = fs.existsSync(traLoiCua(k, id2)) ? docJ(traLoiCua(k, id2)) : null;
  so('(f) --ket-qua duyet', 'duyet · không cờ thì khác duyet', `${f.ma} ${tl2?.ket_qua} · ${tl?.ket_qua}`, f.ma === 0 && tl2?.ket_qua === 'duyet' && tl?.ket_qua !== 'duyet');
  return { loi, hang };
}

test('GD-07 xong-yeu-cau-cu', async () => {
  const { loi, hang } = await kiemXongCu(GOI);
  inMaTran('GD-07', hang);
  assert.equal(hang.length, 6);
  assert.deepEqual(loi, []);
});

test('GD-07-do ghi-tin-jsonl', async () => {
  const goc = banSao('tin.mjs', '  if (muc.yeu_cau_cu) return dapYeuCauCu(', '  if (false) return dapYeuCauCu(');
  const { loi } = await kiemXongCu(goc);
  assert.ok(loi.some((l) => l.startsWith('(b)')) && loi.some((l) => l.startsWith('(d)')), `đi đường cũ phải làm (b) và (d) đỏ, nhận: ${loi.join(' | ')}`);
});

test('GD-07-do tu-duyet', async () => {
  const goc = banSao('tin.mjs', "co['ket-qua'] ?? 'da-tra-loi'", "co['ket-qua'] ?? 'duyet'");
  const { loi } = await kiemXongCu(goc);
  assert.ok(loi.some((l) => l.startsWith('(b)')), `mặc định duyet phải làm (b) đỏ, nhận: ${loi.join(' | ')}`);
});

export async function kiemTraCu(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const k = khoDotThu(gocGoi);
  const id = yeuCauCu(gocGoi, k);
  const h0 = bamCayThu(k.dot);
  const thieu = tin(k.kho, ['TRẢ', id, 'việc của dãy khác'], { gocGoi });
  so('thiếu --chuyen', 'thoát 1 · «--chuyen» · băm bằng', `${thieu.ma} ${thieu.err.trim()} · băm ${bamCayThu(k.dot) === h0 ? 'bằng' : 'khác'}`, thieu.ma === 1 && thieu.err.includes('--chuyen') && bamCayThu(k.dot) === h0);
  const r = tin(k.kho, ['TRẢ', id, 'việc của dãy khác', '--chuyen', 'P2'], { gocGoi });
  const tl = fs.existsSync(traLoiCua(k, id)) ? docJ(traLoiCua(k, id)) : null;
  so('TRẢ ghi tra-lai', 'thoát 0 · tra-lai · ly_do chứa câu và P2', `${r.ma} ${r.err.trim()} · ${tl?.ket_qua} · ${tl?.ly_do}`, r.ma === 0 && tl?.ket_qua === 'tra-lai' && tl.ly_do.includes('việc của dãy khác') && tl.ly_do.includes('P2'));
  const soJ = JSON.parse(tin(k.kho, ['so', '--json'], { gocGoi }).out || '[]');
  so('sổ mở không còn vòng', `không có ${id}`, soJ.map((v) => v.ma).join(',') || '(rỗng)', !soJ.some((v) => v.ma === id));
  return { loi, hang };
}

test('GD-08 tra-yeu-cau-cu', async () => {
  const { loi, hang } = await kiemTraCu(GOI);
  inMaTran('GD-08', hang);
  assert.equal(hang.length, 3);
  assert.deepEqual(loi, []);
});

test('GD-08-do tra-lai-duyet', async () => {
  const goc = banSao('tin.mjs', "ket_qua: 'tra-lai'", "ket_qua: 'duyet'");
  const { loi } = await kiemTraCu(goc);
  assert.ok(loi.some((l) => l.startsWith('TRẢ ghi tra-lai')), `TRẢ ghi duyet phải làm hàng tra-lai đỏ, nhận: ${loi.join(' | ')}`);
});

export async function kiemDapCuTuChoi(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 200) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const k = khoDotThu(gocGoi);
  const id = yeuCauCu(gocGoi, k);
  const tuChoi = (ten, cwd, doiSo, chua) => {
    const h0 = bamCayThu(k.dot);
    const r = tin(cwd, doiSo, { gocGoi });
    const bang = bamCayThu(k.dot) === h0;
    so(ten, `thoát 1 · chứa ${chua.map((c) => `«${c}»`).join(' ')} · băm bằng`, `${r.ma} · ${r.err.trim()} · băm ${bang ? 'bằng' : 'khác'}`, r.ma === 1 && chua.every((c) => r.err.includes(c)) && bang);
  };
  const CU = [id, 'yêu cầu kiểu cũ', 'tin XONG', 'tin TRẢ'];
  tuChoi('NHẬN', k.kho, ['NHẬN', id, 'sẽ giao một câu trả lời đầy đủ'], CU);
  tuChoi('KẸT', k.kho, ['KẸT', id, 'cần chủ kho quyết'], CU);
  tuChoi('HUỶ', k.w1, ['HUỶ', id, 'không cần nữa'], CU);
  tuChoi('MỞ LẠI', k.kho, ['MỞ', 'LẠI', id, 'chưa đạt'], CU);
  tuChoi('XONG do P2', k.w2, ['XONG', id, 'tôi trả lời thay'], ['không phải người nhận']);
  tuChoi('TRẢ do P2', k.w2, ['TRẢ', id, 'không phải việc tôi', '--chuyen', 'P1'], ['không phải người nhận']);
  tuChoi('XONG không câu', k.kho, ['XONG', id], ['câu trả lời']);
  const xong = tin(k.kho, ['XONG', id, 'đã trả lời lần đầu'], { gocGoi });
  if (xong.ma !== 0) loi.push(`bước dựng: G XONG ${id} phải thoát 0 — ${xong.err.trim()}`);
  tuChoi('XONG trên yêu cầu đã có trả lời', k.kho, ['XONG', id, 'trả lời lần hai'], ['đã đóng']);
  tuChoi('TRẢ trên yêu cầu đã có trả lời', k.kho, ['TRẢ', id, 'đổi ý', '--chuyen', 'P2'], ['đã đóng']);
  // Đối chứng: vòng mã mới vẫn đáp được như GT1.
  const h = tin(k.w1, ['HỎI', 'G', 'có cần chen lượt gộp không?'], { gocGoi });
  const maH = h.out.split('\n')[0].split(' ')[1];
  const x = tin(k.kho, ['XONG', maH, 'không cần'], { gocGoi });
  const v = JSON.parse(tin(k.kho, ['so', '--tat-ca', '--json'], { gocGoi }).out).find((y) => y.ma === maH);
  so('đối chứng: vòng mã mới', 'thoát 0 · cho-chap-nhan', `${h.ma} ${x.ma} · ${v?.trang_thai}`, h.ma === 0 && x.ma === 0 && v?.trang_thai === 'cho-chap-nhan');
  return { loi, hang };
}

test('GD-09 dap-cu-bi-tu-choi', async () => {
  const { loi, hang } = await kiemDapCuTuChoi(GOI);
  inMaTran('GD-09', hang);
  assert.equal(hang.length, 10);
  assert.deepEqual(loi, []);
});

test('GD-09-do nhan-lot', async () => {
  const goc = banSao('tin.mjs', '  if (muc.yeu_cau_cu) return dapYeuCauCu(', '  if (false) return dapYeuCauCu(');
  const { loi } = await kiemDapCuTuChoi(goc);
  assert.ok(loi.some((l) => l.startsWith('NHẬN:')), `đi đường cũ phải làm hàng NHẬN đỏ, nhận: ${loi.join(' | ')}`);
  assert.ok(!loi.some((l) => l.startsWith('đối chứng')), `đối chứng vòng mã mới vẫn xanh, nhận: ${loi.join(' | ')}`);
});

test('GD-09-do tra-bo-danh-tinh', async () => {
  const goc = banSao('tin.mjs', '  if (minh !== muc.den) loi(`${minh} không phải người nhận của ${ma} (người nhận: ${muc.den})`);\n  const { ghiTraLoi }', "  if (kl !== 'TRẢ' && minh !== muc.den) loi(`${minh} không phải người nhận của ${ma} (người nhận: ${muc.den})`);\n  const { ghiTraLoi }");
  const { loi } = await kiemDapCuTuChoi(goc);
  assert.ok(loi.some((l) => l.startsWith('TRẢ do P2')), `bỏ kiểm danh tính nhánh TRẢ phải làm hàng TRẢ do P2 đỏ, nhận: ${loi.join(' | ')}`);
  assert.ok(!loi.some((l) => l.startsWith('XONG do P2')), `đối chứng: XONG do P2 vẫn xanh, nhận: ${loi.join(' | ')}`);
});
