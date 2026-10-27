// Trình sinh trang cho bộ ca KD (hồ sơ design-gate-khong-do-duoc-ba-nguyen-nhan).
// Mỗi trang là một ca nhỏ nhất tái lập đúng một hình dạng đã đo: ba trang đầu mô phỏng ba trang của
// đo chéo 26/10 (f01 · hyper-gloss · jang), các trang sau tách từng nguyên nhân và đối chứng của nó.
// Ca gọi sinhTrang(<thư mục tạm>) trong chính lượt chạy — không trang nào viết tay vào kho.

import fs from 'node:fs';
import path from 'node:path';

const dau = (tieuDe, dauTrang = '') =>
  `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${tieuDe}</title>${dauTrang}</head>`;

// Tệp CSS mang @layer: jsdom 24 bỏ cả tệp, bản jsdom khác bỏ luật trong layer — cả hai đều làm mất nền tối.
const CSS_LAYER = '@layer theme{:root{--mau-muc:#111111}}@layer utilities{.nen-muc{background-color:#111111}.chu-muc{color:var(--mau-muc)}}\n';
const CSS_DOC_DUOC = '.chu-nhat{color:#aaaaaa}\n';

const GRADIENT_CLIP = 'background:linear-gradient(90deg,#7c3aed,#2563eb);-webkit-background-clip:text;background-clip:text;color:transparent';

export const TRANG = {
  // — ba trang của đo chéo 26/10 —
  f01: {
    html: dau('f01', `<style>body{background:#f4ecd8;color:#2b2b2b;font-family:Georgia,serif}
.hero h1{${GRADIENT_CLIP};font-size:8.5rem}</style>`)
      + '<body><div class="hero"><h1>Build faster</h1><p>Body copy.</p></div></body></html>',
  },
  'hyper-gloss': {
    html: dau('hyper-gloss', `<style>body{font-family:system-ui,sans-serif;background-color:#050505;color:#F9F9F9}
.chrome-text{background:linear-gradient(180deg,#FFFFFF 0%,#A1A1AA 50%,#444446 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}</style>`)
      + '<body><section><div><h1 class="chrome-text">Kinetic gloss engine</h1><p>Plain copy on the dark page.</p></div></section></body></html>',
  },
  jang: {
    tep: { 'tw.css': CSS_LAYER },
    html: dau('jang', `<link rel="stylesheet" href="./tw.css"><style>
:root{--bg:#000000;--card-bg:#0c0c0e;--text:#ededed}
body{background:var(--bg);color:var(--text);font-family:system-ui,sans-serif}
h1{font-size:28px;font-weight:600;color:#ffffff}
h2{font-size:16px;color:#fafafa}
.card{display:block;background:var(--card-bg);padding:16px}
.card-title{font-size:15px;color:#ffffff}</style>`)
      + '<body><header><h1>Reference index</h1></header><h2>Sections</h2><div class="grid"><a class="card" href="#a"><div><div class="card-title">Tokens</div></div></a></div></body></html>',
  },

  // — nguyên nhân 1: CSS không áp được —
  'layer-tep': {
    tep: { 'tw.css': CSS_LAYER },
    html: dau('layer-tep', '<link rel="stylesheet" href="./tw.css"><style>.chu{color:#f5f5f5}</style>')
      + '<body><section class="nen-muc"><p class="chu">Chữ sáng trên nền tối do tệp CSS khai.</p></section></body></html>',
  },
  'layer-style': {
    html: dau('layer-style', `<style>${CSS_LAYER}</style><style>.chu{color:#f5f5f5}</style>`)
      + '<body><section class="nen-muc"><p class="chu">Chữ sáng trên nền tối do khối style khai.</p></section></body></html>',
  },
  'link-vang': {
    html: dau('link-vang', '<link rel="stylesheet" href="./vang.css"><style>.chu{color:#f5f5f5}</style>')
      + '<body><section class="nen-muc"><p class="chu">Chữ sáng, nền tối nằm ở tệp CSS vắng.</p></section></body></html>',
  },
  'layer-khong-ghim': {
    tep: { 'tw.css': CSS_LAYER },
    html: dau('layer-khong-ghim', '<link rel="stylesheet" href="./tw.css">')
      + '<body><section class="nen-muc"><p style="color:#aaaaaa">Chữ ghim màu nội dòng, nền không ghim.</p></section></body></html>',
  },
  'khong-phat-hien': {
    tep: { 'tw.css': CSS_LAYER },
    html: dau('khong-phat-hien', '<link rel="stylesheet" href="./tw.css"><style>.chu{color:#222222}</style>')
      + '<body><main><p class="chu">Chữ đậm trên nền trắng — không có gì để báo.</p></main></body></html>',
  },

  // — nguyên nhân 2: nền khai ở tổ tiên bị bỏ —
  'nen-bien': {
    html: dau('nen-bien', '<style>:root{--bg:#0b0b0b}body{background:var(--bg)}p{color:#eeeeee}</style>')
      + '<body><main><p>Chữ sáng trên nền tối khai bằng biến ở thân trang.</p></main></body></html>',
  },
  'nen-gradient': {
    html: dau('nen-gradient', '<style>body{background:radial-gradient(circle,#222222,#000000),#111111}p{color:#eeeeee}</style>')
      + '<body><main><p>Chữ sáng trên nền gradient tối ở thân trang.</p></main></body></html>',
  },
  'doi-chung-gop': {
    html: dau('doi-chung-gop', '<style>body{background:#111111}p{color:#333333}</style>')
      + '<body><main><p>Chữ tối trên nền tối khai dạng gộp đọc được.</p></main></body></html>',
  },
  'doi-chung-bien-trang': {
    html: dau('doi-chung-bien-trang', '<style>:root{--paper:#ffffff}body{background-color:var(--paper)}p{color:#bbbbbb}</style>')
      + '<body><main><p>Chữ nhạt trên nền trắng khai bằng biến.</p></main></body></html>',
  },

  // — nguyên nhân 3: chữ gradient —
  clip: {
    html: dau('clip', `<style>h1{${GRADIENT_CLIP};font-size:20px}</style>`)
      + '<body><main><h1>Tiêu đề gradient</h1></main></body></html>',
  },
  'webkit-clip': {
    html: dau('webkit-clip', '<style>h1{background:linear-gradient(90deg,#7c3aed,#2563eb);-webkit-background-clip:text;color:transparent;font-size:20px}</style>')
      + '<body><main><h1>Chỉ tiền tố webkit</h1></main></body></html>',
  },
  fill: {
    html: dau('fill', '<style>body{background-color:#0a0a0a;color:#fafafa}h2{background-image:linear-gradient(180deg,#ffffff,#a1a1aa);-webkit-text-fill-color:transparent;font-size:18px}</style>')
      + '<body><main><h2>Chữ tô trong suốt</h2></main></body></html>',
  },
  con: {
    html: dau('con', `<style>h1{${GRADIENT_CLIP};font-size:20px}</style>`)
      + '<body><main><h1><strong>Chữ trong phần tử con</strong></h1></main></body></html>',
  },

  // — đối chứng tương phản thật trên CSS đọc được —
  'css-doc-duoc': {
    tep: { 'doc-duoc.css': CSS_DOC_DUOC },
    html: dau('css-doc-duoc', '<link rel="stylesheet" href="./doc-duoc.css">')
      + '<body><main><p class="chu-nhat">Chữ nhạt trên nền trắng, CSS đọc được.</p></main></body></html>',
  },
  'nen-doc-duoc': {
    html: dau('nen-doc-duoc', '<style>body{background-color:#111111}p{color:#333333}</style>')
      + '<body><main><p>Chữ tối trên nền tối đọc được.</p></main></body></html>',
  },
  'gradient-va-that': {
    html: dau('gradient-va-that', `<style>h1{${GRADIENT_CLIP};font-size:20px}p{color:#999999}</style>`)
      + '<body><main><h1>Tiêu đề gradient</h1><p>Đoạn chữ xám thật trên nền trắng.</p></main></body></html>',
  },
  // P0 khác tương phản trên trang CSS hỏng: chữ xám trên nền màu (dom không có luật ảnh hỏng — chỉ static có).
  'css-p0-khac': {
    tep: { 'tw.css': CSS_LAYER },
    html: dau('css-p0-khac', '<link rel="stylesheet" href="./tw.css"><style>p{color:#8a8a8a;background-color:#1d4ed8}</style>')
      + '<body><main><p>Chữ xám trên nền màu, trang có CSS hỏng.</p></main></body></html>',
  },
  'layer-ghim': {
    tep: { 'tw.css': CSS_LAYER },
    html: dau('layer-ghim', '<link rel="stylesheet" href="./tw.css">')
      + '<body><main><p style="color:#aaaaaa;background-color:#ffffff">Chữ và nền đều ghim nội dòng.</p></main></body></html>',
  },
  // — AC-9: màu nền viết bằng cú pháp khác hex/rgb, hoặc kèm lớp ảnh — trắng phải đo được, tối thì không —
  ...Object.fromEntries([
    ['hsl-trang', ':root{--background:0 0% 100%}body{background-color:hsl(var(--background))}p{color:#bbbbbb}'],
    ['hsl-trang-gop', ':root{--background:0 0% 100%}body{background:hsl(var(--background))}p{color:#bbbbbb}'],
    ['van-trang', ':root{--bg:#fff}body{background:var(--bg) url(grain.png)}p{color:#bbbbbb}'],
    ['anh', 'body{background-image:url(noise.png)}p{color:#bbbbbb}'],
    ['oklch-trang', 'body{background-color:oklch(1 0 0)}p{color:#bbbbbb}'],
    ['hsl-toi', ':root{--background:0 0% 4%}body{background-color:hsl(var(--background))}p{color:#eeeeee}'],
    ['van-toi', ':root{--bg:#0b0b0b}body{background:var(--bg) url(grain.png)}p{color:#eeeeee}'],
    ['oklch-toi', 'body{background:oklch(0.15 0 0)}p{color:#eeeeee}'],
  ].map(([ten, css]) => [ten, { html: dau(ten, `<style>${css}</style>`) + '<body><main><p>Chữ thử trên nền thân trang.</p></main></body></html>' }])),
};

// Ghi mọi trang (mỗi trang một thư mục con, kèm tệp CSS của nó) và trả về { tên: đường tuyệt đối tới trang }.
export function sinhTrang(goc) {
  const ra = {};
  for (const [ten, t] of Object.entries(TRANG)) {
    const thuMuc = path.join(goc, ten);
    fs.mkdirSync(thuMuc, { recursive: true });
    for (const [tenTep, noiDung] of Object.entries(t.tep || {})) fs.writeFileSync(path.join(thuMuc, tenTep), noiDung);
    const dich = path.join(thuMuc, 'trang.html');
    fs.writeFileSync(dich, t.html);
    ra[ten] = dich;
  }
  return ra;
}
