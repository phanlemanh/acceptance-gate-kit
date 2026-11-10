#!/usr/bin/env node
// Ca Chromium thật của hồ sơ do-tuong-phan-lab-oklab: hai trang tái lập gốc, dựng từ CSS do Tailwind 4 sinh, chạy bộ quét
// đóng gói trên trình duyệt thật, đối chiếu với bộ máy gốc c8fa5a65 và đo lại bảng điểm ảnh bằng canvas.
// Cần Playwright ngoài kit (kit không phụ thuộc nó) nên tệp không mang đuôi .test.mjs và không vào feature_loop.suite_keys.
// Không có Playwright hay Chromium thì thoát 2 nêu đường đã thử: mù, không xanh.
//
//   KIT_PLAYWRIGHT_ROOT=<kho có playwright> node tests/design-eval/mau-lab-chromium.mjs

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const GOC_SHA = 'c8fa5a65';
const PW_ROOT = process.env.KIT_PLAYWRIGHT_ROOT || path.join(os.homedir(), 'dev', 'onehub-inventory');

let chromium;
try {
  ({ chromium } = createRequire(path.join(PW_ROOT, 'noop.js'))('playwright'));
} catch (e) {
  console.error(`mau-lab-chromium: mù — không nạp được playwright từ ${PW_ROOT} (KIT_PLAYWRIGHT_ROOT): ${e.message.split('\n')[0]}`);
  process.exit(2);
}

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  console.error(`mau-lab-chromium: mù — không mở được Chromium của Playwright ở ${PW_ROOT}: ${e.message.split('\n')[0]}`);
  process.exit(2);
}

const CSS = fs.readFileSync(path.join(HERE, 'fixtures', 'tailwind4-tai-lap.css'), 'utf8');
const SCAN = fs.readFileSync(path.join(ROOT, 'scripts', 'design-scan.js'), 'utf8');
const SCAN_GOC = execFileSync('git', ['-C', ROOT, 'show', `${GOC_SHA}:scripts/design-scan.js`], { encoding: 'utf8', maxBuffer: 1 << 26 });
// Một nguồn cho bảng điểm ảnh: rút từ chính bộ ca xanh.
const BANG = [...fs.readFileSync(path.join(HERE, 'mau-lab.test.mjs'), 'utf8').matchAll(/\['((?:lab|lch|oklab|oklch)\([^']+\))', \[(\d+), (\d+), (\d+)\]\]/g)].map((m) => [m[1], [Number(m[2]), Number(m[3]), Number(m[4])]]);

const trang = (lopBody, lopChu, kieu = '') => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title><style>${CSS}</style></head><body class="${lopBody}"><main><p class="${lopChu}" style="${kieu}">Chữ thử tương phản.</p></main></body></html>`;
const HAI_TRANG = [
  { ten: 'text-neutral-100', html: trang('bg-white', 'text-neutral-100'), mong: /text #f5f5f5 on #ffffff/ },
  { ten: 'text-muted/20', html: trang('bg-background', 'text-muted/20'), mong: /text #fdfdfd on #ffffff/ },
];

async function moTrang(html, scan) {
  const page = await browser.newPage();
  await page.setContent(html);
  if (scan) await page.addScriptTag({ content: scan });
  return page;
}
const mauChu = (page) => page.evaluate(() => getComputedStyle(document.querySelector('p')).color);
const quet = (page, opts) => page.evaluate((o) => window.__impeccableDesignScan({ failOn: ['P0'], ...o }), opts);
const lowContrast = (v) => (v.findings || []).filter((f) => f.rule === 'low-contrast').map((f) => f.detail);

const CA = {
  'CR-1': async () => {
    const loi = [];
    for (const t of HAI_TRANG) {
      const p = await moTrang(t.html);
      const mau = await mauChu(p);
      await p.close();
      if (!/^(lab|oklab)\(/.test(mau)) loi.push(`${t.ten}: Chromium tính ra ${mau}, không phải họ lab`);
      else console.log(`  ${t.ten}: ${mau}`);
    }
    return loi.join(' | ') || null;
  },
  'CR-2': async () => {
    const loi = [];
    for (const t of HAI_TRANG) for (const o of [{}, { requireMeasured: true }]) {
      const p = await moTrang(t.html, SCAN);
      const v = await quet(p, o);
      await p.close();
      if (v.verdict !== 'REJECT' || !lowContrast(v).some((d) => t.mong.test(d))) loi.push(`${t.ten} ${JSON.stringify(o)}: ${v.verdict} ${JSON.stringify(lowContrast(v))}`);
    }
    return loi.join(' | ') || null;
  },
  'CR-3': async () => {
    const loi = [];
    for (const t of HAI_TRANG) {
      const p = await moTrang(t.html, SCAN_GOC);
      const v = await quet(p, {});
      await p.close();
      if (v.verdict !== 'PASS') loi.push(`${t.ten}: bộ máy gốc trả ${v.verdict}, mong PASS`);
    }
    return loi.join(' | ') || null;
  },
  'CR-4': async () => {
    if (BANG.length !== 5) return `bảng điểm ảnh rút được ${BANG.length} màu, mong 5`;
    const p = await moTrang('<!doctype html><title>t</title>');
    const loi = [];
    for (const [mau, mong] of BANG) {
      const co = await p.evaluate((m) => {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const x = c.getContext('2d', { colorSpace: 'srgb' });
        x.fillStyle = m;
        x.fillRect(0, 0, 1, 1);
        return [...x.getImageData(0, 0, 1, 1).data].slice(0, 3);
      }, mau);
      if (co.some((v, i) => Math.abs(v - mong[i]) > 1)) loi.push(`${mau}: canvas ${co}, bảng ${mong}`);
    }
    await p.close();
    return loi.join(' | ') || null;
  },
  'CR-5': async () => {
    const p = await moTrang(trang('bg-white', '', 'color: color-mix(in srgb, #000 10%, #eee 90%)'), SCAN);
    const mau = await mauChu(p);
    const v = await quet(p, {});
    await p.close();
    if (!/^color\(srgb /.test(mau)) return `Chromium tính ra ${mau}, không phải color(srgb …)`;
    return v.verdict === 'KHONG-DO-DUOC' && v.do_duoc === false ? null : `${mau}: ${v.verdict} do_duoc=${v.do_duoc}`;
  },
  // Lớp phủ trong suốt trên ảnh: không có một màu nào để hoà, nên không đo được, không phải từ chối với trắng tự đặt.
  'CR-6': async () => {
    const loi = [];
    const chu = '<p style="color:#ffffff">Chữ thử tương phản.</p>';
    const trangPhu = (than) => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title></head><body><main>${than}</main></body></html>`;
    for (const [ten, html] of [
      ['ảnh ở tổ tiên', trangPhu(`<section style="background-image:url(a.png)"><div style="background-image:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.8))">${chu}</div></section>`)],
      ['ảnh cùng phần tử', trangPhu(`<section style="background-image:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.2)),url(a.png)">${chu}</section>`)],
    ]) {
      const p = await moTrang(html, SCAN);
      const v = await quet(p, {});
      await p.close();
      if (v.verdict !== 'KHONG-DO-DUOC' || v.do_duoc !== false) loi.push(`${ten}: ${v.verdict} ${JSON.stringify(lowContrast(v))}`);
    }
    return loi.join(' | ') || null;
  },
};

let hong = 0;
for (const [ma, chay] of Object.entries(CA)) {
  let loi;
  try { loi = await chay(); } catch (e) { loi = `lỗi chạy: ${e.message.split('\n')[0]}`; }
  if (loi) { hong++; console.log(`FAIL: [${ma}] ${loi}`); } else console.log(`PASS: [${ma}]`);
}
await browser.close();
console.log(`mau-lab-chromium: ${Object.keys(CA).length - hong}/${Object.keys(CA).length} ca đạt`);
process.exit(hong ? 1 : 0);
