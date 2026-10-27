#!/usr/bin/env node
// Chiều đỏ của chính bộ đo design-floor: mỗi đột biến sửa MỘT chỗ trên một BẢN SAO bố cục kit (hợp đồng,
// tệp khoá, sổ vá, bản vendored, tệp diff, bản gói), chạy lại rao-dong.mjs / hop-dong.mjs / dong-bo.mjs trên
// bản sao, và đòi thoát đúng mã kèm ĐÚNG thông điệp. Đối chứng dương trước: bản sao nguyên vẹn phải xanh,
// nếu không mọi «đỏ» dưới đây là vô nghĩa. Bản sao do mã sinh trong lượt chạy; cây thật không bao giờ bị sửa.
//
// Dùng: node tests/design-floor/tu-thu.mjs [--chi <nhãn,nhãn>]   nhãn: VA-01 FN-01 BG-01 BAN-VA-A LUAT VO MANG DONG-BO FN
// Đối chứng dương luôn chạy. Ca DONG-BO cần bản ghim upstream (mạng hay cache) — dưới DESIGN_FLOOR_KHONG_MANG=1
// chúng in SKIP và không tính; executor df_dong_bo chạy chúng không có biến đó.
import { spawnSync } from 'node:child_process';
import { appendFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DUONG_KHOA, GOC_KIT, docHopDong } from './lib/hop-dong.mjs';
import { apVa, dungBanGoi } from './lib/upstream.mjs';

const chi = (() => {
  const i = process.argv.indexOf('--chi');
  return i > 0 ? new Set(process.argv[i + 1].split(',')) : null;
})();
const TMP = mkdtempSync(join(tmpdir(), 'design-floor-tu-thu-'));
const KHOA = JSON.parse(readFileSync(DUONG_KHOA, 'utf8'));
const HD = docHopDong();
const HERE = new URL('.', import.meta.url).pathname;
const LIB = join(HERE, 'lib');
const KHONG_MANG = !!process.env.DESIGN_FLOOR_KHONG_MANG;
let n = 0;

function thayKhoi(duong, ten, sua) {
  const re = new RegExp(`(<!-- <<<${ten} -->\\n\`\`\`json\\n)([\\s\\S]*?)(\\n\`\`\`\\n<!-- ${ten}>>> -->)`);
  const md = readFileSync(duong, 'utf8');
  const m = re.exec(md);
  const o = JSON.parse(m[2]);
  sua(o);
  writeFileSync(duong, md.replace(re, (_, a, _b, c) => `${a}${JSON.stringify(o, null, 2)}${c}`));
}

// Bản sao bố cục kit: design-floor/ chép trọn, node_modules của bộ đo là liên kết. Trả đối số trỏ bộ đo vào nó.
function banSao({ sua, suaKhoa, suaSo, suaCay } = {}) {
  const goc = mkdtempSync(join(TMP, 'b-'));
  cpSync(join(GOC_KIT, 'design-floor'), join(goc, 'design-floor'), { recursive: true });
  mkdirSync(join(goc, 'tests', 'design-floor'), { recursive: true });
  symlinkSync(join(GOC_KIT, 'tests', 'design-floor', 'node_modules'), join(goc, 'tests', 'design-floor', 'node_modules'));
  const hdMd = join(goc, 'design-floor/HOP-DONG-NHAP.md');
  const khoa = join(goc, 'design-floor/upstream.lock.json');
  if (sua) thayKhoi(hdMd, 'DESIGN-FLOOR-HOP-DONG', sua);
  if (suaSo) thayKhoi(join(goc, HD.vendor.so_va), 'DESIGN-FLOOR-LOCAL-PATCHES', suaSo);
  if (suaKhoa) {
    const k = JSON.parse(readFileSync(khoa, 'utf8'));
    suaKhoa(k);
    writeFileSync(khoa, `${JSON.stringify(k, null, 2)}\n`);
  }
  if (suaCay) suaCay(goc);
  return { goc, args: ['--hop-dong', hdMd, '--khoa', khoa, '--goc', goc] };
}

function chay(lenh, args, env = {}) {
  // lenh null: args là trọn đối số của node (ca chạy mã nội tuyến).
  const r = spawnSync(process.execPath, lenh ? [lenh, ...args] : args, { encoding: 'utf8', env: { ...process.env, ...env } });
  return { ec: r.status, out: `${r.stdout}${r.stderr}` };
}

const ok = [];
function ca(nhan, ten, lenh, args, { ec, chua }, env) {
  if (chi && nhan !== '*' && !chi.has(nhan)) return;
  n++;
  const id = `TT-${String(n).padStart(2, '0')}`;
  if (nhan === 'DONG-BO' && KHONG_MANG) {
    console.log(`  SKIP: ${id} [${nhan}] ${ten} — DESIGN_FLOOR_KHONG_MANG=1, ca cần bản ghim upstream`);
    return;
  }
  const r = chay(lenh, typeof args === 'function' ? args() : args, env);
  const dung = r.ec === ec && chua.every((c) => r.out.includes(c));
  console.log(`  ${dung ? 'PASS' : 'FAIL'}: ${id} [${nhan}] ${ten}`);
  if (!dung) console.log(`         muốn thoát ${ec} + ${JSON.stringify(chua)}; được thoát ${r.ec}:\n${r.out.split('\n').map((l) => `         | ${l}`).join('\n')}`);
  ok.push(dung);
}

const RAO = join(HERE, 'rao-dong.mjs');
const HOP = join(HERE, 'hop-dong.mjs');
const DONG_BO = join(HERE, 'dong-bo.mjs');
const gioiHan = (hd, id) => hd.gioi_han.find((g) => g.id === id);
const motByte = (duong) => appendFileSync(duong, ' ');
const vendor = (goc, p) => join(goc, HD.vendor.goc, p);
const lenhTrong = (code) => ['--input-type=module', '-e', code];

console.log('tu-thu: chiều đỏ của rào đóng kín, sổ vá, bản gói và bộ đo hợp đồng');

// Đối chứng dương — luôn chạy.
ca('*', 'đối chứng: bản sao nguyên vẹn — rào xanh (VA-01, FN-01, BG-01 PASS; FN-02 XFAIL)', RAO, () => banSao().args,
  { ec: 0, chua: ['PASS: VA-01', 'PASS: FN-01', 'XFAIL: FN-02', 'PASS: BG-01', 'rao-dong: XANH'] });
ca('*', 'đối chứng: bản sao nguyên vẹn — DF-01 XFAIL, DF-07 và DF-09 PASS', HOP, () => [...banSao().args, '--chi', 'DF-01,DF-07,DF-09'],
  { ec: 0, chua: ['XFAIL: DF-01', 'PASS: DF-07', 'PASS: DF-09', 'hop-dong: XANH'] });

// VA-01 — bản vendored khớp tệp khoá + sổ vá.
ca('VA-01', 'một byte của tệp vendored ngoài sổ vá', RAO, () => [...banSao({ suaCay: (g) => motByte(vendor(g, 'src/core/output.ts')) }).args, '--chi', 'VA-01'],
  { ec: 1, chua: ['FAIL: VA-01', '~src/core/output.ts (băm lệch tệp khoá, ngoài sổ vá)'] });
ca('VA-01', 'một tệp lạ trong bản vendored', RAO, () => [...banSao({ suaCay: (g) => writeFileSync(vendor(g, 'src/core/la.ts'), 'export {};\n') }).args, '--chi', 'VA-01'],
  { ec: 1, chua: ['FAIL: VA-01', '+src/core/la.ts (tệp lạ'] });
ca('VA-01', 'xoá một tệp vendored', RAO, () => [...banSao({ suaCay: (g) => unlinkSync(vendor(g, 'src/core/output.ts')) }).args, '--chi', 'VA-01'],
  { ec: 1, chua: ['FAIL: VA-01', '-src/core/output.ts (thiếu'] });
ca('VA-01', 'băm sau của tệp vá sai trong sổ', RAO, () => [...banSao({ suaSo: (s) => { s.ban_va[0].tep.find((t) => t.path === 'src/commands/gate.ts').sau = '0'.repeat(64); } }).args, '--chi', 'VA-01'],
  { ec: 1, chua: ['FAIL: VA-01', '~src/commands/gate.ts (băm ≠ sau của bản vá A)'] });
ca('VA-01', 'dòng A của sổ thiếu lam_xanh', RAO, () => [...banSao({ suaSo: (s) => { delete s.ban_va[0].lam_xanh; } }).args, '--chi', 'VA-01'],
  { ec: 1, chua: ['FAIL: VA-01', 'dòng A thiếu lam_xanh'] });

// FN-01 — đảo bản vá về đúng tệp khoá.
ca('FN-01', 'tệp khoá lệch một băm', RAO, () => [...banSao({ suaKhoa: (k) => { k.tep[0].sha256 = '0'.repeat(64); } }).args, '--chi', 'FN-01'],
  { ec: 1, chua: ['FAIL: FN-01', `~${KHOA.tep[0].path} (băm)`] });
ca('FN-01', 'tệp diff A sửa một dòng ngữ cảnh — không đảo được', RAO, () => [...banSao({
  suaCay: (g) => {
    const p = join(g, 'design-floor/patches/A-bo-cham-khong-but.patch');
    writeFileSync(p, readFileSync(p, 'utf8').replace(' import type { CommandResult } from "../core/output.js";', ' import type { CommandResultX } from "../core/output.js";'));
  },
}).args, '--chi', 'FN-01'], { ec: 1, chua: ['FAIL: FN-01', 'bản vá A không đảo được'] });

// BG-01 — bản gói là vật giao đi.
ca('BG-01', 'một byte của bản gói', RAO, () => [...banSao({ suaCay: (g) => motByte(join(g, HD.vendor.ban_goi)) }).args, '--chi', 'BG-01'],
  { ec: 1, chua: ['FAIL: BG-01', 'bản gói lệch nguồn'] });

// BAN-VA-A — bỏ bản vá A thì bộ chấm ghi sổ lại; khai lại cặp memory thì FN-02 đỏ.
ca('BAN-VA-A', 'bỏ bản vá A khỏi bản sao rồi dựng lại bản gói → DF-07, DF-08 đỏ', HOP, () => {
  const { goc, args } = banSao({
    suaCay: (g) => {
      apVa(join(g, HD.vendor.goc), join(g, 'design-floor/patches/A-bo-cham-khong-but.patch'), { nguoc: true });
      writeFileSync(join(g, HD.vendor.ban_goi), dungBanGoi(HD, g));
    },
  });
  void goc;
  return [...args, '--chi', 'DF-07,DF-08'];
}, { ec: 1, chua: ['FAIL: DF-07', 'FAIL: DF-08', 'memory.events'] });
ca('BAN-VA-A', 'khai lại một cặp memory vào FN-02', RAO, () => [...banSao({ sua: (hd) => { gioiHan(hd, 'FN-02').vi_pham.push('gate src/core/memory-store.ts'); } }).args, '--chi', 'FN-02'],
  { ec: 1, chua: ['FAIL: FN-02', 'đã khai mà KHÔNG còn: gate src/core/memory-store.ts'] });

ca('BAN-VA-A', 'khối máy giữ sót một cặp memory → khoi-may-ban-va-a đỏ', join(HERE, 'khoi-may-ban-va-a.mjs'),
  () => banSao({ sua: (hd) => { gioiHan(hd, 'FN-02').vi_pham.push('gate src/core/memory-store.ts'); } }).args.slice(0, 2),
  { ec: 1, chua: ['khoi-may: ĐỎ', 'FN-02 vi_pham thừa: gate src/core/memory-store.ts'] });
ca('BAN-VA-A', 'khối máy còn giới hạn DF-07 → khoi-may-ban-va-a đỏ', join(HERE, 'khoi-may-ban-va-a.mjs'),
  () => banSao({ sua: (hd) => { hd.gioi_han.push({ id: 'DF-07', chu_ky_do: '.', can_upstream: 'x', ban_va: 'B' }); } }).args.slice(0, 2),
  { ec: 1, chua: ['khoi-may: ĐỎ', 'gioi_han còn DF-07'] });

// FN — rào đóng kín của bước 1, trên đóng kín giao đi.
ca('FN', 'FN-02 luật cấm mới bắt một module lõi', RAO, () => [...banSao({ sua: (hd) => { hd.rao.cam.push({ ten: 'output', re: '^src/core/output\\.ts$' }); } }).args, '--chi', 'FN-02'],
  { ec: 1, chua: ['FAIL: FN-02', 'vi phạm CHƯA khai: gate src/core/output.ts'] });
ca('FN', 'FN-02 giới hạn khai thiếu một vi phạm', RAO, () => [...banSao({ sua: (hd) => { gioiHan(hd, 'FN-02').vi_pham.shift(); } }).args, '--chi', 'FN-02'],
  { ec: 1, chua: ['FAIL: FN-02', 'vi phạm CHƯA khai'] });
ca('FN', 'FN-03 import mạng (node:fs giả làm mạng)', RAO, () => [...banSao({ sua: (hd) => { hd.rao.cam_mang.push('node:fs'); } }).args, '--chi', 'FN-03'],
  { ec: 1, chua: ['FAIL: FN-03', 'import node:fs'] });
ca('FN', 'FN-03 token mạng (readFileSync giả làm mạng)', RAO, () => [...banSao({ sua: (hd) => { hd.rao.cam_token_mang.push('\\breadFileSync\\s*\\('); } }).args, '--chi', 'FN-03'],
  { ec: 1, chua: ['FAIL: FN-03', 'readFileSync'] });

// LUAT — mỗi giới hạn phải có đường ra: can_upstream + ban_va trỏ một bản vá CHỜ.
ca('LUAT', 'giới hạn thiếu ban_va', HOP, () => [...banSao({ sua: (hd) => { delete gioiHan(hd, 'DF-01').ban_va; } }).args, '--chi', 'DF-01'],
  { ec: 1, chua: ['FAIL: DF-01', 'không có đường ra'] });
ca('LUAT', 'giới hạn thiếu can_upstream', HOP, () => [...banSao({ sua: (hd) => { delete gioiHan(hd, 'DF-01').can_upstream; } }).args, '--chi', 'DF-01'],
  { ec: 1, chua: ['FAIL: DF-01', 'không có đường ra'] });
ca('LUAT', 'ban_va là con trỏ chết', HOP, () => [...banSao({ sua: (hd) => { gioiHan(hd, 'DF-01').ban_va = 'Z'; } }).args, '--chi', 'DF-01'],
  { ec: 1, chua: ['FAIL: DF-01', 'con trỏ chết'] });
ca('LUAT', 'ban_va trỏ bản vá đã áp', HOP, () => [...banSao({ sua: (hd) => { gioiHan(hd, 'DF-01').ban_va = 'A'; } }).args, '--chi', 'DF-01'],
  { ec: 1, chua: ['FAIL: DF-01', 'bản vá đã áp'] });
ca('LUAT', 'XPASS: khai giới hạn cho phép đo đang xanh', HOP, () => [...banSao({ sua: (hd) => { hd.gioi_han.push({ id: 'DF-09', chu_ky_do: '.', can_upstream: 'x', ban_va: 'B' }); } }).args, '--chi', 'DF-09'],
  { ec: 1, chua: ['XPASS→FAIL: DF-09'] });
ca('LUAT', 'đỏ khác chữ ký đã khai', HOP, () => [...banSao({ sua: (hd) => { gioiHan(hd, 'DF-01').chu_ky_do = '^khong-bao-gio-khop$'; } }).args, '--chi', 'DF-01'],
  { ec: 1, chua: ['FAIL: DF-01', 'đỏ khác chữ ký'] });
ca('LUAT', 'đỏ không khai', HOP, () => [...banSao({ sua: (hd) => { hd.gioi_han = hd.gioi_han.filter((g) => g.id !== 'DF-05'); } }).args, '--chi', 'DF-05'],
  { ec: 1, chua: ['FAIL: DF-05', 'gate .tsx thoát 0'] });
ca('LUAT', 'DF-02 nhạy: lời gọi gate quên --tokens thì mồi đổi kết quả', HOP, () => [...banSao({ sua: (hd) => { hd.lenh.gate.argv = hd.lenh.gate.argv.filter((a) => a !== '--tokens' && a !== '{tokens}'); } }).args, '--chi', 'DF-02'],
  { ec: 1, chua: ['FAIL: DF-02', 'kết quả đổi theo mồi: gate'] });

// VO — vỏ của kit chỉ nhận năm lệnh; tệp khoá mang phần vỏ kéo thêm; trần đo trên đóng kín giao đi.
const UI = join(GOC_KIT, HD.vendor.ban_goi);
ca('VO', 'lệnh ngoài năm lệnh (ui init) bị từ chối, mã 4', UI, ['init'],
  { ec: 4, chua: ['gate, token-coverage, reuse-plan, flow, autofix'] });
ca('VO', 'lệnh trong năm lệnh chạy (ui gate --help)', UI, ['gate', '--help'],
  { ec: 0, chua: ['ui gate'] });
ca('VO', 'tệp khoá: 126 tệp, vỏ kéo thêm đúng cli-args.ts + command-signatures.ts', ...(() => {
  const vo = KHOA.tep.filter((t) => t.lenh.includes('vo')).map((t) => t.path).join(',');
  return [null, lenhTrong(`console.log('khoa ${KHOA.hop.tep} · vo ${KHOA.lenh.vo?.tep} · ${vo}');`)];
})(), { ec: 0, chua: ['khoa 126 · vo 2 · src/core/cli-args.ts,src/core/command-signatures.ts'] });
ca('VO', 'FN-04 trần hạ dưới số đo', RAO, () => [...banSao({ sua: (hd) => { hd.rao.tran.dong = 1000; } }).args, '--chi', 'FN-04'],
  { ec: 1, chua: ['FAIL: FN-04', 'vượt trần'] });

// MANG — bộ đo không có nhánh lấy mạng.
const thuNguon = (goc) => lenhTrong(`import { chuanBiNguon } from '${join(LIB, 'upstream.mjs')}'; import { docHopDong } from '${join(LIB, 'hop-dong.mjs')}';
try { console.log('nguon ' + chuanBiNguon(docHopDong(), '${goc}')); } catch (e) { console.log(e.message); process.exit(1); }`);
ca('MANG', 'đối chứng: chuanBiNguon trên gốc kit thật trả bản vendored', null, thuNguon(GOC_KIT),
  { ec: 0, chua: [`nguon ${join(GOC_KIT, HD.vendor.goc)}`] });
ca('MANG', 'chuanBiNguon trên gốc không có bản vendored ném lỗi, không lấy mạng', null, () => thuNguon(mkdtempSync(join(TMP, 'rong-'))),
  { ec: 1, chua: ['thiếu bản vendored'] });
ca('MANG', 'layUpstream dưới DESIGN_FLOOR_KHONG_MANG ném lỗi', null, lenhTrong(`import { layUpstream } from '${join(LIB, 'upstream.mjs')}'; import { docHopDong } from '${join(LIB, 'hop-dong.mjs')}';
try { layUpstream(docHopDong()); console.log('da lay mang'); } catch (e) { console.log(e.message); process.exit(1); }`),
  { ec: 1, chua: ['KHONG_MANG'] }, { DESIGN_FLOOR_KHONG_MANG: '1' });

// DONG-BO — dựng lại từ bản ghim gốc phải ra đúng cây đã commit.
ca('DONG-BO', 'một byte vendored lệch → dong-bo --kiem LỆCH nêu tệp', DONG_BO, () => ['--kiem', ...banSao({ suaCay: (g) => motByte(vendor(g, 'src/core/output.ts')) }).args],
  { ec: 1, chua: ['dong-bo: LỆCH', `~${HD.vendor.goc}/src/core/output.ts`] });
ca('DONG-BO', 'đối chứng: bản sao nguyên vẹn → dong-bo --kiem khớp', DONG_BO, () => ['--kiem', ...banSao().args],
  { ec: 0, chua: ['dong-bo: khớp'] });

rmSync(TMP, { recursive: true, force: true });
const xanh = ok.length > 0 && ok.every(Boolean);
console.log(xanh ? `tu-thu: XANH (${ok.length} ca)` : 'tu-thu: ĐỎ');
process.exit(xanh ? 0 : 1);
