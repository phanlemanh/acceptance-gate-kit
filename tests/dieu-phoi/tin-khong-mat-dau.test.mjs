// Ca đo của hồ sơ vong-mo-khong-mat-dau (hàng GT2 — vòng mở không mất dấu). Tên ca bắt đầu «GD-». Mỗi phép đo là một
// hàm trả {loi, hang} trên MỘT gốc gói; ca đỏ chạy CHÍNH hàm ấy trên bản sao bị tiêm (banSao kiểm bước tiêm áp) hoặc trên
// bản gói trước GT2 (git archive sha ghim), SAU khi gói thật xanh trên cùng fixture, và ghim thông điệp của đúng hàng.
// Mọi tin do lệnh `tin` sinh trong lượt; dấu máy do hook thật (lệnh rút từ hooks.json) ghi; kênh là gh giả.
import { test, after } from 'node:test';
import { spawn, execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ENV, GOI, KENH, KIT, banSao, chayHook, docJ, donDep, ghGia, git, inMaTran, khoKenh, nap, tam, tepKenhCua, tin } from './tin-kho-thu.mjs';

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
