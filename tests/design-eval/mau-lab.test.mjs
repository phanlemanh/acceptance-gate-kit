#!/usr/bin/env node
// Bộ ca đo tương phản với màu lab/oklab/lch/oklch, kể cả alpha — chạy trên HAI tầng dùng chung bộ dò:
//   cổng  = scripts/design-gate.mjs chế độ dom (jsdom giữ nguyên chuỗi màu như trình duyệt trả);
//   quét  = scripts/design-scan.js nạp vào trang, gọi window.__impeccableDesignScan().
// Chuỗi màu và kết quả điểm ảnh trong BANG_CHROME đo trên Chrome thật (canvas 2D), không tính lại bằng chính công thức
// đang kiểm. Màu không đọc được phải ra KHONG-DO-DUOC, không được PASS.
//
//   node tests/design-eval/mau-lab.test.mjs [--ca <tiền tố>]

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const { JSDOM } = createRequire(path.join(HERE, 'noop.js'))('jsdom');
const SCAN = fs.readFileSync(path.join(ROOT, 'scripts', 'design-scan.js'), 'utf8');
const LY_DO = 'mau-khong-doc-duoc';
const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'mau-lab-'));

const trang = (than) => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title></head><body><main>${than}</main></body></html>`;
const dong = (chu, nen) => `<p style="color:${chu}${nen ? `;background-color:${nen}` : ''}">Chữ thử tương phản.</p>`;

function chayCong(html, them = []) {
  const f = path.join(fs.mkdtempSync(path.join(tam, 'c-')), 'trang.html');
  fs.writeFileSync(f, html);
  return new Promise((xong) => {
    execFile(process.execPath, [path.join(ROOT, 'scripts', 'design-gate.mjs'), f, '--jsdom', HERE, ...them], { maxBuffer: 1 << 26 }, (loi, stdout) => {
      xong({ ma: loi ? loi.code : 0, j: JSON.parse(stdout) });
    });
  });
}

const POLY = [
  'window.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}takeRecords(){return[]}};',
  'window.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};',
  'window.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});',
  'Element.prototype.getBoundingClientRect=function(){return{x:0,y:0,top:0,left:0,right:120,bottom:60,width:120,height:60,toJSON(){return{}}}};',
].join('');

function chayQuet(html, opts, mauTinhRa) {
  const { window } = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
  const nap = (src) => { const s = window.document.createElement('script'); s.textContent = src; window.document.head.appendChild(s); s.remove(); };
  nap(POLY);
  if (mauTinhRa) {
    // jsdom bỏ chuỗi số mũ nên ca này giả đúng một trường computed của thẻ <p>, phần còn lại vẫn là jsdom thật.
    const goc = window.getComputedStyle;
    window.getComputedStyle = (el, gia) => {
      const cs = goc.call(window, el, gia);
      if (el.tagName !== 'P') return cs;
      return new Proxy(cs, { get: (t, k) => {
        if (k === 'color') return mauTinhRa;
        const v = Reflect.get(t, k);
        return typeof v === 'function' ? v.bind(t) : v;
      } });
    };
  }
  nap(SCAN);
  const v = window.__impeccableDesignScan({ failOn: ['P0'], ...opts });
  window.close();
  return v;
}

const lowContrast = (ds) => (ds || []).filter((f) => f.rule === 'low-contrast');

function kiemDo(ten, mong) {
  // mong = { verdict, chiTiet?: RegExp }
  return async (html) => {
    const [c, q] = [await chayCong(html), chayQuet(html)];
    const loi = [];
    for (const [tang, v, ds] of [['cổng', c.j.verdict, c.j.findings], ['quét', q.verdict, q.findings]]) {
      if (v !== mong.verdict) loi.push(`${tang}: phán ${v}, mong ${mong.verdict} (${JSON.stringify(lowContrast(ds).map((f) => f.detail))})`);
      else if (mong.chiTiet && !lowContrast(ds).some((f) => mong.chiTiet.test(f.detail))) loi.push(`${tang}: không có phát hiện khớp ${mong.chiTiet} (${JSON.stringify(lowContrast(ds).map((f) => f.detail))})`);
    }
    return loi.join(' | ') || null;
  };
}

function kiemKhongDo() {
  return async (html) => {
    const [c, chat, q, qChat] = [await chayCong(html), await chayCong(html, ['--require-measured']), chayQuet(html), chayQuet(html, { requireMeasured: true })];
    const loi = [];
    if (c.j.verdict !== 'KHONG-DO-DUOC' || c.ma !== 0 || c.j.do_duoc !== false) loi.push(`cổng: ${c.j.verdict}/${c.ma}/do_duoc=${c.j.do_duoc}`);
    if (!lowContrast(c.j.findings).some((f) => f.do_duoc === false && f.ly_do?.includes(LY_DO))) loi.push('cổng: phát hiện thiếu mã lý do');
    if (chat.ma !== 5) loi.push(`cổng --require-measured: thoát ${chat.ma}, mong 5`);
    if (q.verdict !== 'KHONG-DO-DUOC' || q.do_duoc !== false || q.exit_intent !== 0) loi.push(`quét: ${q.verdict}/${q.exit_intent}/do_duoc=${q.do_duoc}`);
    if (!lowContrast(q.findings).some((f) => f.do_duoc === false && f.ly_do?.includes(LY_DO))) loi.push('quét: phát hiện thiếu mã lý do');
    if (q.p0 !== 0 || q.blocking.length) loi.push(`quét: không đo được mà tính chặn (p0=${q.p0})`);
    if (qChat.exit_intent !== 5) loi.push(`quét requireMeasured: exit_intent ${qChat.exit_intent}, mong 5`);
    return loi.join(' | ') || null;
  };
}

const T = /text #f5f5f5 on #ffffff/;
// Chuỗi màu → điểm ảnh sRGB đo trên Chrome thật. Đo bằng cách đặt chữ và nền cùng màu: phát hiện in ra mã hex đọc được.
const BANG_CHROME = [
  ['lab(50 40 -30)', [165, 91, 171]],
  ['lab(20 -10 25)', [42, 52, 6]],
  ['lch(50 60 200)', [0, 142, 152]],
  ['oklab(0.5 0.1 -0.1)', [129, 69, 154]],
  ['oklch(0.6 0.15 30)', [202, 87, 71]],
];

const CA = [
  ['lab', dong('lab(96.52 0 0)', '#ffffff'), kiemDo('lab', { verdict: 'REJECT', chiTiet: T })],
  ['oklab', dong('oklab(0.97 0 0)', '#ffffff'), kiemDo('oklab', { verdict: 'REJECT', chiTiet: T })],
  ['lch', dong('lch(96.52 0 0)', '#ffffff'), kiemDo('lch', { verdict: 'REJECT', chiTiet: T })],
  ['oklch', dong('oklch(0.97 0 0)', '#ffffff'), kiemDo('oklch', { verdict: 'REJECT', chiTiet: T })],
  ['lab-phan-tram', dong('lab(96.52% -0.00001 0.000002)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: T })],
  ['lab-so-mu', dong('#111111', '#ffffff'), async (html) => {
    const q = chayQuet(html, undefined, 'lab(96.52 -1e-05 2e-06)');
    return q.verdict === 'REJECT' && lowContrast(q.findings).some((f) => T.test(f.detail)) ? null : `quét: ${q.verdict} ${JSON.stringify(lowContrast(q.findings))}`;
  }],
  ['oklab-phan-tram', dong('oklab(97% 0 0)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: T })],
  ['oklch-none', dong('oklch(0.97 none none)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: T })],

  // Ca tái hiện Tailwind 4: text-muted/20 trên bg-background.
  ['alpha-oklab', dong('oklab(0.97 0 0 / 0.2)', 'oklch(1 0 0)'), kiemDo('', { verdict: 'REJECT', chiTiet: /text #fdfdfd on #ffffff/ })],
  // Đặc thì đạt, hoà với nền thì trượt: chỉ đúng khi alpha thật sự được tính.
  ['alpha-hoa-lab', dong('lab(20 0 0 / 20%)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: /on #ffffff/ })],
  ['alpha-hoa-lch', dong('lch(20 0 0 / 0.2)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: /on #ffffff/ })],
  ['alpha-hoa-oklab', dong('oklab(0.2 0 0 / 0.2)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: /on #ffffff/ })],
  ['alpha-hoa-oklch', dong('oklch(0.2 0 0 / 0.2)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: /on #ffffff/ })],
  ['alpha-hoa-rgba', dong('rgba(0, 0, 0, 0.2)', '#ffffff'), kiemDo('', { verdict: 'REJECT', chiTiet: /text #cccccc on #ffffff/ })],
  // Nền trong suốt hoà với lớp dưới: chữ trắng trên đen 50% trên trắng là xám giữa, không phải đen, không phải trắng.
  ['nen-alpha-truot', dong('#ffffff', 'oklab(0 0 0 / 0.5)'), kiemDo('', { verdict: 'REJECT', chiTiet: /on #808080/ })],
  ['nen-alpha-dat', dong('#ffffff', 'oklab(0 0 0 / 0.8)'), kiemDo('', { verdict: 'PASS' })],
  ['nen-alpha-lab', dong('#ffffff', 'lab(0 0 0 / 0.5)'), kiemDo('', { verdict: 'REJECT', chiTiet: /on #808080/ })],

  // Nền gradient: mỗi điểm dừng lab phải được đọc, điểm dừng không đọc được thì không đo được.
  ['gradient-lab', `<section style="background-image:linear-gradient(lab(96.52 0 0), lab(96.52 0 0))">${dong('lab(96.52 0 0)')}</section>`, kiemDo('', { verdict: 'REJECT', chiTiet: /text #f5f5f5 on #f5f5f5/ })],
  ['gradient-oklab', `<section style="background-image:linear-gradient(oklab(0.97 0 0), oklab(0.97 0 0))">${dong('oklab(0.97 0 0)')}</section>`, kiemDo('', { verdict: 'REJECT', chiTiet: /on #f5f5f5/ })],
  ['gradient-oklch', `<section style="background-image:linear-gradient(oklch(0.97 0 0), oklch(0.97 0 0))">${dong('oklch(0.97 0 0)')}</section>`, kiemDo('', { verdict: 'REJECT', chiTiet: /on #f5f5f5/ })],
  // Một điểm dừng đục, một điểm trong suốt, không tổ tiên nào có nền: điểm trong suốt hoà với trang trắng thành xám giữa.
  ['gradient-alpha', `<section style="background-image:linear-gradient(oklab(0 0 0), oklab(0 0 0 / 0.5))">${dong('#ffffff')}</section>`, kiemDo('', { verdict: 'REJECT', chiTiet: /on #808080/ })],
  // Lớp dưới đã biết: điểm dừng hoà với nền thật của tổ tiên, không phải với trắng.
  ['gradient-alpha-nen-to-tien', `<section style="background-color:#000000"><div style="background-image:linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))">${dong('#ffffff')}</div></section>`, kiemDo('', { verdict: 'PASS' })],
  // Điểm dừng alpha 0 chỉ để lộ lớp dưới.
  ['gradient-alpha-khong', `<section style="background-image:linear-gradient(rgba(0, 0, 0, 0), #000000)">${dong('#ffffff')}</section>`, kiemDo('', { verdict: 'REJECT', chiTiet: /on #ffffff/ })],
  // Lớp dưới là ảnh hoặc gradient khác: không có một màu nào để hoà, nên không đo được, không được đo với trắng tự đặt.
  ['gradient-tren-anh-to-tien', `<section style="background-image:url(a.png)"><div style="background-image:linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))">${dong('#ffffff')}</div></section>`, kiemKhongDo()],
  ['gradient-tren-anh-cung-phan-tu', `<section style="background-image:linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url(a.png)">${dong('#ffffff')}</section>`, kiemKhongDo()],
  ['gradient-tren-gradient-cung-phan-tu', `<section style="background-image:linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), linear-gradient(#000000, #111111)">${dong('#ffffff')}</section>`, kiemKhongDo()],
  ['gradient-tren-gradient-to-tien', `<section style="background-image:linear-gradient(#000000, #111111)"><div style="background-image:linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))">${dong('#ffffff')}</div></section>`, kiemKhongDo()],
  ['gradient-tren-anh-body', '', () => kiemKhongDo()(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title></head><body style="background-image:url(a.png)"><main><section style="background-image:linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))">${dong('#ffffff')}</section></main></body></html>`)],
  ['khong-doc-gradient', `<section style="background-image:linear-gradient(color(display-p3 0.1 0.1 0.1), color(display-p3 0.2 0.2 0.2))">${dong('#111111')}</section>`, kiemKhongDo()],

  // Chiều sạch: đọc đúng thì không REJECT oan.
  ['sach-lab', dong('lab(20 0 0)', '#ffffff'), kiemDo('', { verdict: 'PASS' })],
  ['sach-oklch-nen-toi', dong('oklch(0.98 0 0)', 'oklch(0.2 0 0)'), kiemDo('', { verdict: 'PASS' })],
  ['sach-oklab-nen-lab', dong('oklab(0.98 0 0)', 'lab(10 0 0)'), kiemDo('', { verdict: 'PASS' })],
  // Nền oklch viết trực tiếp giờ đo được thật (bộ máy gốc không đọc được nó, xem MD-0).
  ['nen-oklch-truc-tiep', dong('#ffffff', 'oklch(0.15 0 0)'), kiemDo('', { verdict: 'PASS' })],
  // Chữ alpha 0 do thứ khác vẽ (background-clip: text), không được hoà thành trắng trên trắng.
  ['alpha-khong', dong('rgba(0, 0, 0, 0)', '#ffffff'), kiemDo('', { verdict: 'PASS' })],
  ['alpha-khong-oklab', dong('oklab(0 0 0 / 0)', '#ffffff'), kiemDo('', { verdict: 'PASS' })],

  ['khong-doc-chu', dong('color(display-p3 0.93 0.93 0.93)', '#ffffff'), kiemKhongDo()],
  ['khong-doc-color-srgb', dong('color(srgb 0.96 0.96 0.96)', '#ffffff'), kiemKhongDo()],
  ['khong-doc-nen', dong('#111111', 'color(display-p3 0.93 0.93 0.93)'), kiemKhongDo()],
  ['khong-doc-nen-to-tien', `<section style="background-color:color(display-p3 0.1 0.1 0.1)">${dong('#111111')}</section>`, kiemKhongDo()],
  // Đo được thì FAIL thắng phần không đo được trên cùng trang.
  ['fail-thang', dong('color(display-p3 0.93 0.93 0.93)', '#ffffff') + dong('#eeeeee', '#ffffff'), async (html) => {
    const loi = await kiemDo('', { verdict: 'REJECT', chiTiet: /text #eeeeee on #ffffff/ })(html);
    if (loi) return loi;
    const [chat, qChat] = [await chayCong(html, ['--require-measured']), chayQuet(html, { requireMeasured: true })];
    return chat.ma !== 2 ? `cổng --require-measured: thoát ${chat.ma}, mong 2` : qChat.exit_intent !== 2 ? `quét requireMeasured: exit_intent ${qChat.exit_intent}, mong 2` : null;
  }],
  // Nền đặc phía trên chặn đường đi lên: màu lạ ở tổ tiên bị che không làm mất phép đo.
  ['nen-dac-che', `<section style="background-color:color(display-p3 0.1 0.1 0.1)">${dong('#111111', '#ffffff')}</section>`, kiemDo('', { verdict: 'PASS' })],

  // Đồng bộ lại bản gốc mà làm mất một mốc vá thì phải đỏ to, không được âm thầm chạy bản chưa vá.
  ['moc-va-mat', '', async () => {
    const { patchDetector, PATCHES } = await import(path.join(ROOT, 'lib', 'design-bundle.mjs'));
    const goc = fs.readFileSync(path.join(ROOT, 'vendor', 'impeccable', 'engine', 'detect-antipatterns-browser.js'), 'utf8');
    patchDetector(goc);
    const loi = [];
    let dem = 0;
    for (const [moc] of PATCHES) {
      const dau = moc.split('\n')[0];
      for (const [ten, ban, so] of [['mất', goc.split(moc).join(''), 0], ['thừa', `${goc}\n${moc}\n`, 2]]) {
        dem++;
        try { patchDetector(ban); loi.push(`${ten} mốc «${dau}» mà không lỗi`); } catch (e) {
          if (!e.message.includes(`anchor must occur once, found ${so}: ${dau}`)) loi.push(`${ten} mốc «${dau}»: sai lỗi ${e.message}`);
        }
      }
    }
    if (PATCHES.length !== 12 || dem !== 24) loi.push(`phủ ${dem} phép thử trên ${PATCHES.length} mốc, mong 24 trên 12`);
    return loi.join(' | ') || null;
  }],

  ...BANG_CHROME.map(([mau, [r, g, b]]) => {
    const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
    return [`chrome ${mau}`, dong(mau, mau), kiemDo('', { verdict: 'REJECT', chiTiet: new RegExp(`text ${hex} on ${hex}`) })];
  }),
];

const i = process.argv.indexOf('--ca');
const loc = i >= 0 ? process.argv[i + 1] : '';
const chon = CA.filter(([ten]) => ten.startsWith(loc));
if (!chon.length) { console.error(`--ca ${loc}: khớp 0 ca`); process.exit(2); }

let hong = 0;
const hang = [...chon];
const ketQua = new Map();
await Promise.all(Array.from({ length: 6 }, async () => {
  while (hang.length) {
    const [ten, than, kiem] = hang.shift();
    let loi;
    try { loi = await kiem(trang(than)); } catch (e) { loi = `lỗi chạy: ${e.message}`; }
    ketQua.set(ten, loi);
  }
}));
for (const [ten] of chon) {
  const loi = ketQua.get(ten);
  if (loi) { hong++; console.log(`FAIL ${ten}: ${loi}`); } else console.log(`PASS ${ten}`);
}
fs.rmSync(tam, { recursive: true, force: true });
console.log(`mau-lab: ${chon.length - hong}/${chon.length} ca đạt`);
process.exit(hong ? 1 : 0);
