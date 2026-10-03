#!/usr/bin/env node
// lo-trinh-do-trang.mjs — đo trang lộ trình trên Chrome thật qua CDP (hồ sơ trang-lo-trinh-doc-mot-phut).
// Một phiên Chrome không giao diện; mỗi lần đo đặt khổ, màu (prefers-color-scheme), ngày đóng băng
// (thay `Date` trước khi trang chạy), bật/tắt script, mở tệp, rồi chạy hàm đo trong trang. Hàm đo
// trả số thô; phán ĐẠT/KHÔNG ở bên gọi (ca LTT-* và người đọc).
//   node tests/scripts/lo-trinh-do-trang.mjs [--hom-nay 2026-10-03] [--kho 1440x900,375x812]
//        [--khong-script] [--chup <thư mục>] [--ghi-anh <tệp.json>] <tệp.html>...
// In một dòng JSON mỗi ô. Không tìm thấy Chrome → exit 3 nêu tên (bên gọi coi là ĐỎ, không bỏ qua).
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const KHO_MAC_DINH = [[1440, 900], [768, 1024], [375, 812]];
export const SAC = ['light', 'dark'];
export function timChrome() {
  return [process.env.CHROME_BIN, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(p => p && existsSync(p)) || null;
}

// Hàm đo chạy TRONG trang. Thẻ: đáy ba dòng đầu (Làm tiếp · Cần sửa · Mốc kế tiếp), hoặc đáy thẻ khi
// thẻ là thẻ lỗi. Cỡ chữ, tương phản (nền ghép qua các lớp bán trong suốt), cỡ tiêu đề, cao nút đứng
// riêng (summary, liên kết bọc trọn ô chỗ cần sửa; liên kết nằm trong câu được miễn như WCAG 2.5.8) —
// đều trên phần tử đang hiện.
export const DO_TRONG_TRANG = `(() => {
  const vh = innerHeight; const de = document.documentElement;
  const hien = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const day = el => Math.round(el.getBoundingClientRect().bottom + scrollY);
  const the = [...document.querySelectorAll('.the')].map(t => {
    const o = [...t.querySelectorAll(':scope > .o')]; const vi = n => (o[n] ? day(o[n]) : null);
    return { ten: ((t.querySelector('h2') || {}).textContent || '').trim(), loi: !!t.querySelector('.loi'), day: day(t), ke: vi(0), co: vi(1), moc: vi(2),
      mocChu: (t.querySelector('[id$="-moc-ke"]') || {}).textContent || null };
  });
  const manDau = the.length > 0 && the.every(t => (t.loi ? t.day <= vh : t.ke != null && t.co != null && t.moc != null && t.ke <= vh && t.co <= vh && t.moc <= vh));
  const rgb = s => { const m = s.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const L = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const nen = el => { const lop = []; for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { lop.push(c); if (c.a >= 1) break; } } let k = { r: 255, g: 255, b: 255 }; for (const c of lop.reverse()) k = { r: c.r * c.a + k.r * (1 - c.a), g: c.g * c.a + k.g * (1 - c.a), b: c.b * c.a + k.b * (1 - c.a) }; return k; };
  const coChu = new Set(); const mau = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (!hien(el) || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const s = getComputedStyle(el); coChu.add(s.fontSize);
    const a = L(rgb(s.color)) + 0.05; const b = L(nen(el)) + 0.05; const ti = Math.max(a, b) / Math.min(a, b);
    const fs = parseFloat(s.fontSize); const lon = fs >= 24 || (fs >= 18.66 && Number(s.fontWeight) >= 700);
    mau.push({ ti: Math.round(ti * 100) / 100, can: lon ? 3 : 4.5, chu: el.textContent.trim().slice(0, 40) });
  }
  const cz = sel => [...document.querySelectorAll(sel)].filter(hien).map(e => parseFloat(getComputedStyle(e).fontSize));
  const h1 = cz('h1'), h2 = cz('h2'), h3 = cz('h3');
  const donDieu = (!h2.length || !h1.length || Math.max(...h2) < Math.min(...h1)) && (!h3.length || !h2.length || Math.max(...h3) < Math.min(...h2));
  const nut = [...document.querySelectorAll('summary, .so-co a, .co-ds li > a')].filter(hien).map(e => ({ h: Math.round(e.getBoundingClientRect().height), chu: e.textContent.trim().slice(0, 30) }));
  return { vw: innerWidth, vh, cao: de.scrollHeight, tran: de.scrollWidth > de.clientWidth, the, manDau,
    soCoChu: coChu.size, coChu: [...coChu], tieuDe: { h1: [...new Set(h1)], h2: [...new Set(h2)], h3: [...new Set(h3)] }, donDieu,
    tpMin: mau.reduce((x, m) => Math.min(x, m.ti), 99), kemTP: mau.filter(m => m.ti < m.can).slice(0, 5),
    nutMin: nut.reduce((x, d) => Math.min(x, d.h), 999), nutKem: nut.filter(d => d.h < 44).slice(0, 5) };
})()`;

// Phiên Chrome. `mo(tep, o)` đặt khổ/màu/ngày/script rồi mở tệp; `danhGia(bt)` chạy biểu thức trong
// trang; `chup(png)` chụp khung nhìn; `dong()` tắt Chrome và xoá hồ sơ tạm.
export async function phienChrome() {
  const CHROME = timChrome();
  if (!CHROME) { const e = new Error('lo-trinh-do-trang: không tìm thấy Chrome (đặt CHROME_BIN)'); e.khongChrome = true; throw e; }
  const ud = mkdtempSync(path.join(tmpdir(), 'do-trang-'));
  const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--hide-scrollbars', `--user-data-dir=${ud}`, '--remote-debugging-port=0', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const ws = await new Promise((ok, loi) => {
    let buf = ''; const t = setTimeout(() => loi(new Error('Chrome không mở cổng gỡ lỗi sau 20 giây')), 20000);
    ch.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\S+)/); if (m) { clearTimeout(t); ok(m[1]); } });
    ch.on('exit', c => { clearTimeout(t); loi(new Error(`Chrome thoát ${c} trước khi mở cổng gỡ lỗi`)); });
  });
  const port = new URL(ws).port;
  const pg = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page');
  const sock = new WebSocket(pg.webSocketDebuggerUrl);
  await new Promise(r => sock.addEventListener('open', r, { once: true }));
  let id = 0; const cho = new Map(); const nghe = [];
  sock.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && cho.has(m.id)) { cho.get(m.id)(m); cho.delete(m.id); } else nghe.slice().forEach(f => f(m)); });
  const goi = (method, params = {}) => new Promise((ok, loi) => { const i = ++id; cho.set(i, m => (m.error ? loi(new Error(`${method}: ${m.error.message}`)) : ok(m.result))); sock.send(JSON.stringify({ id: i, method, params })); });
  const choSuKien = ten => new Promise(r => { const f = m => { if (m.method === ten) { nghe.splice(nghe.indexOf(f), 1); r(m); } }; nghe.push(f); });
  await goi('Page.enable');
  let dongHo = null;
  const danhGia = async bt => {
    const r = await goi('Runtime.evaluate', { expression: bt, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(`đánh giá trong trang lỗi: ${JSON.stringify(r.exceptionDetails).slice(0, 300)}`);
    return r.result.value;
  };
  return {
    goi, danhGia,
    async mo(tep, { w = 1440, h = 900, sac = 'light', homNay = '2026-10-03', khongScript = false, neo = '' } = {}) {
      if (dongHo) await goi('Page.removeScriptToEvaluateOnNewDocument', { identifier: dongHo });
      const [y, mo, d] = homNay.split('-').map(Number);
      dongHo = (await goi('Page.addScriptToEvaluateOnNewDocument', { source: `(()=>{const T=new Date(${y},${mo - 1},${d},9,0,0).getTime();const D=Date;class F extends D{constructor(...a){super(...(a.length?a:[T]))}static now(){return T}}window.Date=F;})();` })).identifier;
      await goi('Emulation.setScriptExecutionDisabled', { value: khongScript });
      await goi('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
      await goi('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: sac }] });
      // Qua about:blank để mỗi lần mở là một lần tải mới (cùng tệp, khác neo/ngày); chờ tải xong TỪNG
      // lần, kẻo sự kiện tải của about:blank bị nhận nhầm là của tệp.
      let xong = choSuKien('Page.loadEventFired'); await goi('Page.navigate', { url: 'about:blank' }); await xong;
      xong = choSuKien('Page.loadEventFired');
      await goi('Page.navigate', { url: pathToFileURL(path.resolve(tep)).href + (neo ? `#${neo}` : '') });
      await xong;
    },
    async do() { return danhGia(DO_TRONG_TRANG); },
    async chup(png) { const s = await goi('Page.captureScreenshot', { format: 'png' }); mkdirSync(path.dirname(png), { recursive: true }); writeFileSync(png, Buffer.from(s.data, 'base64')); },
    async dong() { try { sock.close(); } catch { /* đã đóng */ } await new Promise(r => { if (ch.exitCode != null) r(); else { ch.on('exit', r); ch.kill(); } }); rmSync(ud, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); },
  };
}

export const bam = p => createHash('sha256').update(readFileSync(p)).digest('hex');

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const lay = k => { const i = a.indexOf(k); if (i < 0) return null; const v = a[i + 1]; a.splice(i, 2); return v; };
  const homNay = lay('--hom-nay') || '2026-10-03'; const chup = lay('--chup'); const ghiAnh = lay('--ghi-anh');
  const khoStr = lay('--kho'); const khongScript = a.includes('--khong-script'); if (khongScript) a.splice(a.indexOf('--khong-script'), 1);
  const KHO = khoStr ? khoStr.split(',').map(s => s.split('x').map(Number)) : KHO_MAC_DINH;
  if (!a.length) { console.error('cần ít nhất một tệp .html'); process.exit(2); }
  let P;
  try { P = await phienChrome(); } catch (e) { console.error(e.message); process.exit(e.khongChrome ? 3 : 1); }
  const anh = [];
  try {
    for (const f of a) for (const [w, h] of KHO) for (const sac of SAC) {
      await P.mo(f, { w, h, sac, homNay, khongScript });
      console.log(JSON.stringify({ tep: path.basename(f), kho: `${w}x${h}`, sac, ...(await P.do()) }));
      if (chup) { const png = path.join(chup, `${path.basename(f, '.html')}--${w}--${sac}.png`); await P.chup(png); anh.push(png); }
    }
  } finally { await P.dong(); }
  if (ghiAnh) {
    const goc = path.dirname(path.resolve(ghiAnh));
    const ra = { hom_nay: homNay, nguon: Object.fromEntries(a.map(f => [path.relative(goc, path.resolve(f)), bam(f)])), anh: Object.fromEntries(anh.map(p => [path.relative(goc, path.resolve(p)), bam(p)])) };
    writeFileSync(ghiAnh, JSON.stringify(ra, null, 2) + '\n');
  }
}
