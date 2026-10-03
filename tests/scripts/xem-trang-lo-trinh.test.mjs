// xem-trang-lo-trinh.test.mjs — hồ sơ trang-lo-trinh-doc-mot-phut, ca LTT-*: trang lộ trình đo trên
// Chrome thật (tests/scripts/lo-trinh-do-trang.mjs, CDP, ngày đóng băng). Mỗi eval ghim đúng dòng
// «PASS: LTT-…» của tệp này. Tên tệp xếp sau mọi *.test.mjs khác để chia mảnh suite không đổi.
//
// Kho thử năm trạng thái do CODE sinh trong lượt (lo-trinh-kho-thu.mjs: fixture crm + hồ sơ sinh theo
// `_nguon.ho_so`). Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO bộ vẽ bị tiêm (nhát tiêm phải khớp đúng một
// lần), SAU khi bản lành xanh trên cùng kho, và so TẬP thước bị phá với tập mong đợi. Không có Chrome
// thì mọi ca ĐỎ nêu tên — không bỏ qua. Mọi đường dẫn suy từ vị trí tệp này.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'xem-trang-'));
const { phienChrome, KHO_MAC_DINH, SAC } = await import(pathToFileURL(path.join(HERE, 'lo-trinh-do-trang.mjs')).href);
const KT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-kho-thu.mjs')).href);
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const loi = e => (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : String(e));
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const CA = ['LTT-san', 'LTT-san-do', 'LTT-san-im', 'LTT-moc', 'LTT-moc-khong-script', 'LTT-hanh-vi', 'LTT-hanh-vi-do'];
const only = (process.env.LT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.includes(id);

let n = 0;
const napLT = async kit => ({
  LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${++n}`),
  PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${n}`),
});
// Bản sao của vật: trọn scripts lib skills; nhát tiêm phải khớp ĐÚNG một lần.
function banSao(tiem) {
  const c = path.join(TMP, `bs-${++n}`);
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const k = s.split(cu).length - 1;
    if (k !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${k} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
// Bộ máy của mốc 2.21.0 — trang cũ để so độ dài. Trọn thư mục; tag không resolve thì ném (ca ĐỎ).
let goc = null;
function bo2210() {
  if (goc) return goc;
  const d = path.join(TMP, 'goc-2210'); mkdirSync(d, { recursive: true });
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', '--format=tar', 'v2.21.0', 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 }) });
  return (goc = d);
}
const ve = async (kit, r, ten) => {
  const M = await napLT(kit); const f = path.join(TMP, `${ten}-${++n}.html`);
  const html = M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
  if (!html) throw new Error(`bộ vẽ ${kit} không vẽ trang cho ${ten}`);
  writeFileSync(f, html); return f;
};

// Kho năm trạng thái, dựng MỘT lần, dùng chung cho bản lành và mọi bản sao.
const KHO = Object.fromEntries(KT.TRANG_THAI.map(t => [t, KT.dungKho(t, TMP)]));

// ── Hàm đo LTT-san: sàn của mọi ô ma trận ────────────────────────────────────
// Trả { o: số ô đã đo, sai: [«<thước>: <ô> …»], so: {moi, cu} }. Tên thước là từ vựng đóng:
// màn đầu · tràn · cỡ chữ · tiêu đề · tương phản · nút · độ dài.
async function san(P, kit) {
  const sai = []; let o = 0; const so = {};
  for (const ten of KT.TRANG_THAI) {
    const f = await ve(kit, KHO[ten], ten);
    for (const [w, h] of KHO_MAC_DINH) for (const sac of SAC) {
      await P.mo(f, { w, h, sac }); const x = await P.do(); o += 1; const oTen = `${ten} ${w} ${sac}`;
      if (!x.manDau) sai.push(`màn đầu: ${oTen} ${JSON.stringify(x.the.map(t => [t.ke, t.co, t.moc, t.day]))} > ${x.vh}`);
      if (x.tran) sai.push(`tràn: ${oTen}`);
      if (x.soCoChu > 6) sai.push(`cỡ chữ: ${oTen} ${x.soCoChu} cỡ ${x.coChu.join(',')}`);
      if (!x.donDieu) sai.push(`tiêu đề: ${oTen} ${JSON.stringify(x.tieuDe)}`);
      if (x.kemTP.length) sai.push(`tương phản: ${oTen} ${JSON.stringify(x.kemTP[0])}`);
      if (x.nutKem.length) sai.push(`nút: ${oTen} ${JSON.stringify(x.nutKem[0])}`);
      if (ten === 'hai-lo-trinh' && w === 1440 && sac === 'light') so.moi = x.cao;
    }
  }
  await P.mo(await ve(bo2210(), KHO['hai-lo-trinh'], 'cu'), { w: 1440, h: 900, sac: 'light' });
  so.cu = (await P.do()).cao;
  if (!(so.cu > 0) || so.moi * 3 > so.cu) sai.push(`độ dài: trang mới ${so.moi}px, trang 2.21.0 ${so.cu}px (tỉ lệ ${(so.moi / so.cu).toFixed(3)} > 1/3)`);
  return { o, sai, so };
}
const thuoc = sai => [...new Set(sai.map(s => s.split(':')[0]))].sort();

// ── Hàm đo LTT-hanh-vi: tiêu đề cột dính · chọn trọn lệnh · viền hàng tại neo ─
async function hanhVi(P, kit) {
  const sai = []; const f = await ve(kit, KHO['hai-lo-trinh'], 'hv');
  await P.mo(f, { w: 1440, h: 900 });
  const d = await P.danhGia(`(() => { const t = document.querySelector('#lt1 .bang table'); const r = t.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.top + r.height / 2); const th = t.querySelector('th').getBoundingClientRect();
    return { top: th.top, h: innerHeight, cao: r.height, chon: getComputedStyle(document.querySelector('.lenh')).userSelect,
      neo: (document.querySelector('.the .ke a') || {}).getAttribute ? document.querySelector('.the .ke a').getAttribute('href').slice(1) : null }; })()`);
  if (!(d.cao > 0)) throw new Error('không thấy bảng việc còn mở của lộ trình 1');
  if (!(d.top >= 0 && d.top < d.h)) sai.push(`dính: cuộn tới giữa bảng thì tiêu đề cột ở top ${Math.round(d.top)}`);
  if (d.chon !== 'all') sai.push(`chọn: lệnh mở có user-select «${d.chon}»`);
  if (!d.neo) throw new Error('thẻ không có liên kết hàng kế');
  await P.mo(f, { w: 1440, h: 900, neo: d.neo });
  const v = await P.danhGia(`(() => { const tr = document.getElementById(${JSON.stringify(d.neo)}); const khac = [...document.querySelectorAll('tbody tr')].find(x => x !== tr);
    return { a: tr ? parseFloat(getComputedStyle(tr).outlineWidth) * (getComputedStyle(tr).outlineStyle === 'none' ? 0 : 1) : -1, b: khac ? parseFloat(getComputedStyle(khac).outlineWidth) * (getComputedStyle(khac).outlineStyle === 'none' ? 0 : 1) : -1 }; })()`);
  if (!(v.a > 0 && v.b === 0)) sai.push(`viền: hàng tại neo ${d.neo} viền ${v.a}, hàng khác ${v.b}`);
  return sai;
}

let P = null;
try { P = await phienChrome(); } catch (e) { for (const c of CA) if (want(c)) bad(c, `không mở được Chrome — ${e.message}`); }
if (P) {
  try {
    let lanh = null;
    if (want('LTT-san') || want('LTT-san-do') || want('LTT-san-im')) {
      try {
        lanh = await san(P, KIT);
        if (lanh.o !== KT.TRANG_THAI.length * KHO_MAC_DINH.length * SAC.length || lanh.o !== 30) bad('LTT-san', `đo ${lanh.o} ô, cần 30`);
        else if (lanh.sai.length) bad('LTT-san', lanh.sai.slice(0, 6).join(' ; '));
        else ok('LTT-san', `${lanh.o}/30 ô: màn đầu đủ ba điều, không tràn, ≤ 6 cỡ chữ, h1 > h2 > h3, tương phản đạt, nút ≥ 44px; trang hai lộ trình ${lanh.so.moi}px / trang 2.21.0 ${lanh.so.cu}px = ${(lanh.so.moi / lanh.so.cu).toFixed(3)}`);
      } catch (e) { bad('LTT-san', loi(e)); }
    }
    if (want('LTT-san-do')) {
      try {
        if (!lanh || lanh.sai.length) throw new Error('bản lành chưa xanh — không tin được chiều đỏ');
        const MUT = [
          ['màu chữ phụ #bbbbbb', ['scripts/lo-trinh.mjs', ':root{--bg:#fbfaf7;--sf:#ffffff;--fg:#1d1d1b;--mu:#5f5c56;', ':root{--bg:#fbfaf7;--sf:#ffffff;--fg:#1d1d1b;--mu:#bbbbbb;'], ['tương phản']],
          ['khung trang tối thiểu 1180px', ['scripts/lo-trinh.mjs', 'main{max-width:1180px;', 'main{min-width:1180px;max-width:1180px;'], ['tràn']],
          ['h2 32px', ['scripts/lo-trinh.mjs', 'h2{font-size:18px;', 'h2{font-size:32px;'], ['tiêu đề']],
          ['summary không min-height', ['scripts/lo-trinh.mjs', 'summary{cursor:pointer;min-height:44px;', 'summary{cursor:pointer;'], ['nút']],
          ['bỏ khối CSS điện thoại', ['scripts/lo-trinh.mjs', '@media (max-width:640px){main{', '@media (max-width:1px){main{'], ['màn đầu', 'tràn']],
        ];
        const hong = [];
        for (const [ten, tiem, mong] of MUT) {
          const r = await san(P, banSao([tiem])); const t = thuoc(r.sai);
          if (!deq(t, mong)) hong.push(`${ten}: thước đỏ ${JSON.stringify(t)} (cần ${JSON.stringify(mong)}) ${r.sai[0] || ''}`);
          else console.log(`    · ${ten} → «${r.sai[0].slice(0, 110)}»`);
        }
        if (hong.length) bad('LTT-san-do', hong.join(' ; ')); else ok('LTT-san-do', `${MUT.length} bản sao, mỗi bản đỏ đúng tập thước mong đợi: ${MUT.map(m => m[2].join('+')).join(' · ')}`);
      } catch (e) { bad('LTT-san-do', loi(e)); }
    }
    if (want('LTT-san-im')) {
      try {
        if (!lanh || lanh.sai.length) throw new Error('bản lành chưa xanh');
        const cau = 'Đổi kế hoạch bằng PR vào tệp kế hoạch.';
        const r = await san(P, banSao([['scripts/lo-trinh.mjs', cau, `${cau} ${cau}`]]));
        if (r.sai.length) bad('LTT-san-im', `đổi câu giải thích cuối trang mà thước đỏ: ${r.sai.slice(0, 3).join(' ; ')}`);
        else ok('LTT-san-im', `câu giải thích cuối trang dài gấp đôi: ${r.o}/30 ô vẫn xanh`);
      } catch (e) { bad('LTT-san-im', loi(e)); }
    }
    // ── LTT-moc: mốc kế tiếp theo ngày người xem ─────────────────────────────
    // Mốc xong (việc G đã giao) · Mốc đã qua (việc A chưa giao) · Mốc hôm nay (không gắn) · Mốc tới (việc B).
    const khoMoc = () => KT.khoMoi(path.join(TMP, 'moc'), { tep: ['docs/plan/moc.json'], hoSo: { g: ['da-ship', 'T2'] }, files: { 'docs/plan/moc.json': { schema: 1, ten: 'Thử mốc',
      moc: [{ ten: 'Mốc tới', ngay: '2026-10-20', hang: ['B'] }, { ten: 'Mốc đã qua', ngay: '2026-09-01', hang: ['A'] }, { ten: 'Mốc hôm nay', ngay: '2026-10-03' }, { ten: 'Mốc xong', ngay: '2026-08-15', hang: ['G'] }],
      hang: [{ ma: 'G', cau_giao: '«việc G»', slug: 'g', hang: 'T2' }, { ma: 'A', cau_giao: '«việc A»' }, { ma: 'B', cau_giao: '«việc B»' }] } } });
    const docMoc = () => P.danhGia(`({ o: document.getElementById('lt1-moc-ke').textContent, li: [...document.querySelectorAll('ol.moc li')].map(l => [l.getAttribute('data-ngay'), (l.querySelector('.con') || {}).textContent, l.querySelector('.ngay').textContent, l.classList.contains('ke-tiep')]) })`);
    if (want('LTT-moc')) {
      try {
        const f = await ve(KIT, khoMoc(), 'moc'); const sai = [];
        await P.mo(f, { homNay: '2026-10-03' }); const a = await docMoc();
        if (a.o !== 'Mốc hôm nay — 03/10/2026 (hôm nay) · 1 mốc đã qua còn việc chưa giao') sai.push(`03/10: ô thẻ «${a.o}»`);
        if (!deq(a.li.map(x => x[0]), ['2026-08-15', '2026-09-01', '2026-10-03', '2026-10-20'])) sai.push(`thứ tự ${JSON.stringify(a.li.map(x => x[0]))}`);
        if (a.li[0][1] !== 'đã qua' || a.li[1][1] !== 'đã qua — còn việc chưa giao' || a.li[3][1] !== 'còn 17 ngày' || !a.li[2][3] || a.li[3][3]) sai.push(`03/10: dải ${JSON.stringify(a.li)}`);
        await P.mo(f, { homNay: '2026-10-04' }); const b = await docMoc();
        if (b.o !== 'Mốc tới — 20/10/2026 (còn 16 ngày) · 1 mốc đã qua còn việc chưa giao') sai.push(`04/10: ô thẻ «${b.o}»`);
        await P.mo(f, { homNay: '2026-10-21' }); const c = await docMoc();
        if (c.o !== 'Không còn mốc nào phía trước. · 2 mốc đã qua còn việc chưa giao') sai.push(`21/10: ô thẻ «${c.o}»`);
        if (sai.length) bad('LTT-moc', sai.join(' ; ')); else ok('LTT-moc', 'ngày 03/10 → «Mốc hôm nay — 03/10/2026 (hôm nay) · 1 mốc đã qua còn việc chưa giao», mốc 15/08 (việc đã giao) «đã qua», mốc 01/09 «đã qua — còn việc chưa giao»; 04/10 → «Mốc tới — 20/10/2026 (còn 16 ngày) · …»; 21/10 → không còn mốc, 2 mốc đã qua còn việc');
      } catch (e) { bad('LTT-moc', loi(e)); }
    }
    if (want('LTT-moc-khong-script')) {
      try {
        const f = await ve(KIT, khoMoc(), 'moc-ks');
        await P.mo(f, { homNay: '2026-10-03', khongScript: true }); const a = await docMoc();
        if (a.o === 'Xem dải mốc bên dưới.' && deq(a.li.map(x => x[2]), ['15/08/2026', '01/09/2026', '03/10/2026', '20/10/2026'])) ok('LTT-moc-khong-script', 'tắt script: ô thẻ «Xem dải mốc bên dưới.», dải mốc vẫn đủ bốn ngày');
        else bad('LTT-moc-khong-script', `ô «${a.o}» ngày ${JSON.stringify(a.li.map(x => x[2]))}`);
      } catch (e) { bad('LTT-moc-khong-script', loi(e)); }
    }
    // ── LTT-hanh-vi ──────────────────────────────────────────────────────────
    let hvLanh = null;
    if (want('LTT-hanh-vi') || want('LTT-hanh-vi-do')) {
      try { hvLanh = await hanhVi(P, KIT); if (hvLanh.length) bad('LTT-hanh-vi', hvLanh.join(' ; ')); else ok('LTT-hanh-vi', 'cuộn qua bảng: tiêu đề cột trong khung nhìn; lệnh mở chọn trọn; hàng tại neo có viền, hàng khác không'); } catch (e) { bad('LTT-hanh-vi', loi(e)); }
    }
    if (want('LTT-hanh-vi-do')) {
      try {
        if (!hvLanh || hvLanh.length) throw new Error('bản lành chưa xanh');
        const MUT = [
          ['gỡ sticky', ['scripts/lo-trinh.mjs', 'thead th{position:sticky;top:0;', 'thead th{'], ['dính']],
          ['gỡ user-select', ['scripts/lo-trinh.mjs', 'user-select:all;-webkit-user-select:all;', ''], ['chọn']],
          ['gỡ viền :target', ['scripts/lo-trinh.mjs', 'tbody tr:target{outline:2px solid var(--ac);outline-offset:-2px}', ''], ['viền']],
        ];
        const hong = [];
        for (const [ten, tiem, mong] of MUT) {
          const s = await hanhVi(P, banSao([tiem])); const t = thuoc(s);
          if (!deq(t, mong)) hong.push(`${ten}: vế đỏ ${JSON.stringify(t)} (cần ${JSON.stringify(mong)})`); else console.log(`    · ${ten} → «${s[0]}»`);
        }
        if (hong.length) bad('LTT-hanh-vi-do', hong.join(' ; ')); else ok('LTT-hanh-vi-do', 'gỡ sticky → dính · gỡ user-select → chọn · gỡ viền :target → viền; mỗi bản đỏ đúng một vế');
      } catch (e) { bad('LTT-hanh-vi-do', loi(e)); }
    }
  } finally { await P.dong(); }
}

rmSync(TMP, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
console.log(`\nResults: ${pass} passed, ${fail} failed (xem-trang-lo-trinh)`);
process.exit(fail ? 1 : 0);
