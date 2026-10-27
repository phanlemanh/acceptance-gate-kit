#!/usr/bin/env node
// Bộ ca KD — hồ sơ design-gate-khong-do-duoc-ba-nguyen-nhan (hàng FL1).
// Cổng thiết kế chế độ dom phải trả KHONG-DO-DUOC kèm mã nguyên nhân, không REJECT, khi CSS không áp được,
// khi nền khai ở tổ tiên bị bỏ, hay khi chữ cắt theo nền gradient; tương phản thật vẫn REJECT.
//
//   node tests/design-eval/khong-do-duoc.test.mjs [--ca KD1,KD5-f03,…]
//
// Tên ca mở đầu bằng mã AC (KD<n> ↔ AC-<n>). --ca lọc theo tiền tố; khớp 0 ca → thoát 2. Mọi trang do
// lib/sinh-trang.mjs SINH vào thư mục tạm. «Bản gốc» = git archive GOC_SHA lib vendor scripts (trọn thư mục);
// bản mới = cây đang chạy; đột biến = bản sao trọn lib/ vendor/ scripts/ của cây đang chạy, gỡ đúng một dòng có
// nhãn. Mọi bản nạp jsdom từ chính thư mục của tệp này (--jsdom), nên nơi đứng chạy không đổi kết quả.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { sinhTrang } from './lib/sinh-trang.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const JSDOM_GHIM = '24.1.3';
// Nhánh chính lúc mở vòng (đường nền 27/10) — bản cổng TRƯỚC lớp lọc. Ghim cứng: sau khi gộp, merge-base đã chứa
// lớp lọc nên không còn là «bản gốc».
const GOC_SHA = '2c90e4ca3a096abf79f2efa8216c355952594ada';
const CSS = 'css-khong-ap-duoc';
const NEN = 'nen-to-tien-bi-bo';
const GRADIENT = 'chu-gradient';

// ── chạy cổng ──────────────────────────────────────────────────────────────
const boNho = new Map();
let dangChay = 0;
const hang = [];
function chayCong(goc, trang, them = []) {
  const khoa = [goc, trang, ...them].join('\0');
  if (!boNho.has(khoa)) {
    boNho.set(khoa, new Promise((xong) => {
      const batDau = () => {
        dangChay++;
        execFile(process.execPath, [path.join(goc, 'scripts', 'design-gate.mjs'), trang, '--jsdom', HERE, ...them],
          { maxBuffer: 64 * 1024 * 1024 }, (loi, stdout, stderr) => {
            dangChay--;
            const ma = loi ? (typeof loi.code === 'number' ? loi.code : -1) : 0;
            let j = null;
            try { j = JSON.parse(stdout); } catch { /* j null → ca tự báo */ }
            xong({ ma, j, stderr: String(stderr) });
            if (hang.length) hang.shift()();
          });
      };
      if (dangChay < 6) batDau(); else hang.push(batDau);
    }));
  }
  return boNho.get(khoa);
}

// ── phán trên JSON ─────────────────────────────────────────────────────────
const chiTiet = (j, loc) => (j?.findings || []).filter((f) => f.rule === 'low-contrast' && loc(f)).map((f) => f.detail);
const doDuoc = (f) => f.do_duoc !== false;
const tapBang = (a, b) => a.length === b.length && [...a].sort().every((x, i) => x === [...b].sort()[i]);

// Bản mới phải KHONG-DO-DUOC: đúng tập phát hiện không đo được, mỗi cái đúng tập mã nguyên nhân, không chặn gì.
function phanKhongDo({ ma, j }, mongDoi) {
  if (!j) return 'không đọc được JSON của cổng';
  if (j.verdict !== 'KHONG-DO-DUOC' || ma !== 0) return `verdict ${j.verdict} mã ${ma}, mong KHONG-DO-DUOC mã 0`;
  if ((j.blocking || []).length) return `blocking ${JSON.stringify(j.blocking)} phải rỗng`;
  const khong = (j.findings || []).filter((f) => f.do_duoc === false);
  const coDuoc = khong.map((f) => f.detail);
  if (!tapBang(coDuoc, Object.keys(mongDoi))) return `phát hiện không đo được ${JSON.stringify(coDuoc)} ≠ ${JSON.stringify(Object.keys(mongDoi))}`;
  for (const f of khong) {
    if (!tapBang(f.ly_do || [], mongDoi[f.detail])) return `«${f.detail}»: mã ${JSON.stringify(f.ly_do)} ≠ ${JSON.stringify(mongDoi[f.detail])}`;
  }
  return null;
}

// Phải REJECT mã 2 với các chi tiết đo được nêu tên nằm trong phát hiện chặn; `khong` (tuỳ) = tập không đo được kèm mã.
function phanChan({ ma, j }, doDuocCan, khong = null, luatChan = 'low-contrast') {
  if (!j) return 'không đọc được JSON của cổng';
  if (j.verdict !== 'REJECT' || ma !== 2) return `verdict ${j.verdict} mã ${ma}, mong REJECT mã 2`;
  if (!(j.blocking || []).includes(luatChan)) return `blocking ${JSON.stringify(j.blocking)} thiếu ${luatChan}`;
  const co = chiTiet(j, doDuoc);
  for (const d of doDuocCan) if (!co.includes(d)) return `thiếu phát hiện đo được «${d}» (có ${JSON.stringify(co)})`;
  if (khong) {
    const khongCo = (j.findings || []).filter((f) => f.do_duoc === false);
    if (!tapBang(khongCo.map((f) => f.detail), Object.keys(khong))) return `không đo được ${JSON.stringify(khongCo.map((f) => f.detail))} ≠ ${JSON.stringify(Object.keys(khong))}`;
    for (const f of khongCo) if (!tapBang(f.ly_do || [], khong[f.detail])) return `«${f.detail}»: mã ${JSON.stringify(f.ly_do)} ≠ ${JSON.stringify(khong[f.detail])}`;
  }
  return null;
}

// Bản gốc phải REJECT với ĐÚNG tập chi tiết tương phản nêu tên — đối chứng dương rằng trang tái lập đúng phát hiện sai.
function phanGoc({ ma, j }, chiTietCan) {
  if (!j) return 'bản gốc: không đọc được JSON';
  if (j.verdict !== 'REJECT' || ma !== 2) return `bản gốc: verdict ${j.verdict} mã ${ma}, mong REJECT mã 2`;
  const co = chiTiet(j, () => true);
  if (!tapBang(co, chiTietCan)) return `bản gốc: chi tiết ${JSON.stringify(co)} ≠ ${JSON.stringify(chiTietCan)}`;
  return null;
}

// ── ca ─────────────────────────────────────────────────────────────────────
// goc(ctx) chạy trên bản gốc (chỉ lượt thường); moi(ctx, goc) chạy trên bản đang đo — cây mới, hoặc bản đột biến.
const D = {
  f01: '3.7:1 (need 4.5:1) — text #000000 on #7c3aed',
  hyper: '1.1:1 (need 4.5:1) — text #f9f9f9 on #ffffff',
  jangH1: '1.0:1 (need 3:1) — text #ffffff on #ffffff',
  jangH2: '1.0:1 (need 4.5:1) — text #fafafa on #ffffff',
  jangThe: '1.0:1 (need 4.5:1) — text #ffffff on #ffffff',
  sang: '1.1:1 (need 4.5:1) — text #f5f5f5 on #ffffff',
  nhat: '2.3:1 (need 4.5:1) — text #aaaaaa on #ffffff',
  nen: '1.2:1 (need 4.5:1) — text #eeeeee on #ffffff',
  toiTrenToi: '1.5:1 (need 4.5:1) — text #333333 on #111111',
  bienTrang: '1.9:1 (need 4.5:1) — text #bbbbbb on #ffffff',
  xam: '2.8:1 (need 4.5:1) — text #999999 on #ffffff',
  xamTrenMau: '1.9:1 (need 4.5:1) — text #8a8a8a on #1d4ed8',
};
const F01_THAT = path.join(HERE, 'fixtures', 'f01-gradient-cream.html');
const F03 = path.join(HERE, 'fixtures', 'f03-low-contrast.html');

const caKhongDo = (id, trang, mongDoi, goc) => ({
  id, dot: true,
  goc: goc ? async (c) => phanGoc(await chayCong(c.goc, c.trang[trang]), goc) : null,
  moi: async (c) => phanKhongDo(await chayCong(c.root, c.trang[trang]), mongDoi),
});
const caChan = (id, trang, doDuocCan, khong = null, luat = 'low-contrast') => ({
  id, dot: true,
  moi: async (c) => phanChan(await chayCong(c.root, typeof trang === 'function' ? trang(c) : c.trang[trang]), doDuocCan, khong, luat),
});

const CA = [
  { id: 'KD0-jsdom', moi: async () => {
    let v;
    try { v = createRequire(path.join(HERE, 'noop.js'))('jsdom/package.json').version; } catch { return 'JSDOM_VANG: chạy npm ci --prefix tests/design-eval'; }
    return v === JSDOM_GHIM ? null : `JSDOM_LECH: nạp ${v}, ghim ${JSDOM_GHIM}`;
  } },

  // AC-1 — ba trang của đo chéo 26/10
  { id: 'KD1-goc', moi: async (c) => {
    for (const [t, can] of [['f01', [D.f01]], ['hyper-gloss', [D.hyper]], ['jang', [D.jangH1, D.jangH2, D.jangThe]]]) {
      const loi = phanGoc(await chayCong(c.goc, c.trang[t]), can);
      if (loi) return `${t}: ${loi}`;
    }
    return null;
  } },
  caKhongDo('KD1-f01', 'f01', { [D.f01]: [GRADIENT] }),
  caKhongDo('KD1-hyper-gloss', 'hyper-gloss', { [D.hyper]: [GRADIENT] }),
  caKhongDo('KD1-jang', 'jang', { [D.jangH1]: [CSS, NEN], [D.jangH2]: [CSS, NEN], [D.jangThe]: [CSS, NEN] }),
  { id: 'KD1-f01-that', dot: true, moi: async (c) => phanKhongDo(await chayCong(c.root, F01_THAT), { [D.f01]: [GRADIENT] }) },

  // AC-2 — CSS không áp được
  caKhongDo('KD2-layer-tep', 'layer-tep', { [D.sang]: [CSS] }, [D.sang]),
  caKhongDo('KD2-layer-style', 'layer-style', { [D.sang]: [CSS] }, [D.sang]),
  caKhongDo('KD2-link-vang', 'link-vang', { [D.sang]: [CSS] }, [D.sang]),
  caKhongDo('KD2-layer-khong-ghim', 'layer-khong-ghim', { [D.nhat]: [CSS] }, [D.nhat]),
  { id: 'KD2-khong-phat-hien', dot: true,
    goc: async (c) => { const { ma, j } = await chayCong(c.goc, c.trang['khong-phat-hien']); return j?.verdict === 'PASS' && ma === 0 ? null : `bản gốc: ${j?.verdict} mã ${ma}, mong PASS 0`; },
    moi: async (c) => { const { ma, j } = await chayCong(c.root, c.trang['khong-phat-hien']); return j?.verdict === 'PASS' && ma === 0 && !('do_duoc' in j) ? null : `${j?.verdict} mã ${ma} do_duoc=${j?.do_duoc}, mong PASS 0 không khoá do_duoc`; } },

  // AC-3 — nền khai ở tổ tiên bị bỏ
  caKhongDo('KD3-nen-bien', 'nen-bien', { [D.nen]: [NEN] }, [D.nen]),
  // Giới hạn đã khai (đổi khuôn ở Cổng Bằng chứng lượt 2): jsdom bỏ hẳn dạng gộp «dải màu, màu dự phòng» nên nhánh nền
  // không thấy nó — trang vẫn REJECT như trước vòng.
  caChan('KD3-nen-gradient', 'nen-gradient', [D.nen]),
  caChan('KD3-doi-chung-gop', 'doi-chung-gop', [D.toiTrenToi]),
  caChan('KD3-doi-chung-bien-trang', 'doi-chung-bien-trang', [D.bienTrang]),

  // AC-4 — chữ gradient
  caKhongDo('KD4-clip', 'clip', { [D.f01]: [GRADIENT] }, [D.f01]),
  caKhongDo('KD4-webkit-clip', 'webkit-clip', { [D.f01]: [GRADIENT] }, [D.f01]),
  caKhongDo('KD4-fill', 'fill', { '1.0:1 (need 4.5:1) — text #fafafa on #ffffff': [GRADIENT] }, ['1.0:1 (need 4.5:1) — text #fafafa on #ffffff']),
  caKhongDo('KD4-con', 'con', { [D.f01]: [GRADIENT] }, [D.f01]),

  // AC-5 — tương phản thật trên CSS đọc được vẫn chặn
  caChan('KD5-css-doc-duoc', 'css-doc-duoc', [D.nhat]),
  caChan('KD5-nen-doc-duoc', 'nen-doc-duoc', [D.toiTrenToi]),
  caChan('KD5-gradient-va-that', 'gradient-va-that', [D.xam], { [D.f01]: [GRADIENT] }),
  caChan('KD5-css-p0-khac', 'css-p0-khac', [], { [D.xamTrenMau]: [CSS] }, 'gray-on-color'),
  caChan('KD5-layer-ghim', 'layer-ghim', [D.nhat]),
  caChan('KD5-f03', () => F03, ['1.8:1 (need 4.5:1) — text #b9b4ad on #f4f1ea', '2.5:1 (need 4.5:1) — text #9fb6e8 on #2563eb']),

  // AC-9 — nền trắng viết bằng hsl/oklch hay kèm lớp ảnh vẫn đo được (REJECT); nền tối cùng cách viết vẫn không đo được
  ...['hsl-trang', 'hsl-trang-gop', 'van-trang', 'anh', 'oklch-trang'].map((t) => caChan(`KD9-${t}`, t, [D.bienTrang])),
  ...['hsl-toi', 'van-toi', 'oklch-toi'].map((t) => caKhongDo(`KD9-${t}`, t, { [D.nen]: [NEN] }, [D.nen])),

  // AC-10 — nhánh nền đọc style tính ra: dải màu tối ở thân/gốc trang → không đo được; khối @media không áp, lớp phủ gần
  // trong suốt, nền nội dòng thắng luật, chữ dải màu chỉ khi in, màu bộ đọc không hiểu → giữ phán quyết đo được (REJECT)
  ...['nen-chi-gradient', 'html-chi-gradient'].map((t) => caKhongDo(`KD10-${t}`, t, { [D.nen]: [NEN] }, [D.nen])),
  ...['media-toi', 'media-in', 'hsla-phu', 'inline-thang'].map((t) => caChan(`KD10-${t}`, t, ['1.6:1 (need 4.5:1) — text #cccccc on #ffffff'])),
  caChan('KD10-gradient-media', 'gradient-media', ['1.6:1 (need 4.5:1) — text #cccccc on #ffffff']),
  // Màu bộ đọc không hiểu (color-mix): nhánh nền không gắn nhãn — phán quyết và mã thoát bằng bản gốc, không phát hiện nào do_duoc false.
  { id: 'KD10-mau-la', dot: true, moi: async (c) => {
    const cu = await chayCong(c.goc || c.root, c.trang['mau-la']);
    const moi = await chayCong(c.root, c.trang['mau-la']);
    if (!cu.j || !moi.j) return 'không đọc được JSON của cổng';
    if (moi.j.verdict !== cu.j.verdict || moi.ma !== cu.ma) return `phán quyết ${moi.j.verdict}/${moi.ma} khác bản gốc ${cu.j.verdict}/${cu.ma}`;
    return (moi.j.findings || []).some((f) => f.do_duoc === false) ? 'có phát hiện bị gắn không đo được' : null;
  } },

  // AC-6 — hợp đồng mã thoát, JSON, stderr
  { id: 'KD6-bang', moi: async (c) => {
    const bang = [['f01', 0, 5], ['jang', 0, 5], ['css-doc-duoc', 2, 2], ['khong-phat-hien', 0, 0]];
    for (const [t, maVang, maCo] of bang) {
      const vang = await chayCong(c.root, c.trang[t]);
      const co = await chayCong(c.root, c.trang[t], ['--require-measured']);
      if (vang.ma !== maVang || co.ma !== maCo) return `${t}: mã ${vang.ma}/${co.ma}, mong ${maVang}/${maCo}`;
      for (const r of [vang, co]) {
        const j = r.j;
        const dongKhongDo = r.stderr.split('\n').filter((l) => l.startsWith('design-gate: dom không đo được'));
        if (j.verdict === 'KHONG-DO-DUOC') {
          const khong = j.findings.filter((f) => f.do_duoc === false);
          if (j.do_duoc !== false) return `${t}: thiếu do_duoc false`;
          if (j.khong_do_duoc !== khong.length) return `${t}: khong_do_duoc ${j.khong_do_duoc} ≠ ${khong.length}`;
          for (const m of new Set(khong.flatMap((f) => f.ly_do))) if (!String(j.ly_do_khong_do_duoc).includes(m)) return `${t}: ly_do_khong_do_duoc thiếu ${m}`;
          if (j.p0_count !== j.findings.filter((f) => f.pTier === 'P0' && f.do_duoc !== false).length) return `${t}: p0_count ${j.p0_count} đếm cả phát hiện không đo được`;
          if (khong.some((f) => (j.blocking || []).length && j.blocking.includes(f.rule))) return `${t}: blocking chứa luật của phát hiện không đo được`;
          if (dongKhongDo.length !== 1) return `${t}: stderr có ${dongKhongDo.length} dòng «dom không đo được», mong 1`;
        } else {
          if ('do_duoc' in j) return `${t}: ${j.verdict} không được có khoá do_duoc`;
          if (dongKhongDo.length) return `${t}: ${j.verdict} không được có dòng «dom không đo được»`;
        }
      }
    }
    return null;
  } },
];

// AC-7 — ba đột biến: mỗi cái gỡ đúng một dòng có nhãn của lớp lọc; tập ca đỏ BẰNG tập viết trước.
const DOT_BIEN = {
  css: ['KD2-layer-tep', 'KD2-layer-style', 'KD2-link-vang', 'KD2-layer-khong-ghim', 'KD1-jang', 'KD5-css-p0-khac'],
  nen: ['KD3-nen-bien', 'KD1-jang', 'KD9-hsl-toi', 'KD9-van-toi', 'KD9-oklch-toi', 'KD10-nen-chi-gradient', 'KD10-html-chi-gradient'],
  gradient: ['KD4-clip', 'KD4-webkit-clip', 'KD4-fill', 'KD4-con', 'KD1-f01', 'KD1-f01-that', 'KD1-hyper-gloss', 'KD5-gradient-va-that'],
};
const nhanDotBien = (nhanh) => `// nhánh: ${nhanh}`;

function banSao(tam, ten) {
  const dich = path.join(tam, ten);
  for (const d of ['lib', 'vendor', 'scripts']) fs.cpSync(path.join(ROOT, d), path.join(dich, d), { recursive: true });
  return dich;
}
function gaiDotBien(goc, nhanh) {
  const tep = path.join(goc, 'lib', 'design-detect.mjs');
  const dong = fs.readFileSync(tep, 'utf8').split('\n');
  const trung = dong.filter((l) => l.includes(nhanDotBien(nhanh)));
  if (trung.length !== 1) return `DOT_BIEN_LECH ${nhanh}: ${trung.length} dòng mang nhãn «${nhanDotBien(nhanh)}»`;
  fs.writeFileSync(tep, dong.filter((l) => !l.includes(nhanDotBien(nhanh))).join('\n'));
  return null;
}
async function chayDot(c, root) {
  const do_ = [];
  for (const ca of CA.filter((x) => x.dot)) if (await ca.moi({ ...c, root })) do_.push(ca.id);
  return do_;
}
CA.push({ id: 'KD7-lanh', moi: async (c) => {
  const do_ = await chayDot(c, banSao(c.tam, 'lanh'));
  return do_.length ? `bản sao lành đỏ: ${do_.join(', ')}` : null;
} });
for (const nhanh of Object.keys(DOT_BIEN)) {
  CA.push({ id: `KD7-bo-${nhanh}`, moi: async (c) => {
    const goc = banSao(c.tam, `bo-${nhanh}`);
    const loi = gaiDotBien(goc, nhanh);
    if (loi) return loi;
    const do_ = await chayDot(c, goc);
    const can = DOT_BIEN[nhanh];
    const thua = do_.filter((x) => !can.includes(x));
    const thieu = can.filter((x) => !do_.includes(x));
    return thua.length || thieu.length ? `LECH_TAP ${nhanh}: thừa [${thua.join(', ')}] thiếu [${thieu.join(', ')}]` : null;
  } });
}

// AC-8 — hồi quy design-eval, thiếu jsdom, bản vendored, job CI
function chayLenh(lenh, doi, opts = {}) {
  try { return { ma: 0, ra: execFileSync(lenh, doi, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...opts }) }; }
  catch (e) { return { ma: typeof e.status === 'number' ? e.status : -1, ra: String(e.stdout || '') + String(e.stderr || '') }; }
}
const LENH_CI = () => chayLenh('bash', [path.join(HERE, 'kdd.sh'), '--lenh-ci']).ra.trim().split('\n');
function lenhJobCi(yml) {
  const dong = yml.split('\n');
  const dau = dong.findIndex((l) => /^ {2}design-eval:\s*$/.test(l));
  if (dau < 0) return null;
  const run = [];
  for (let i = dau + 1; i < dong.length && !/^ {2}\S/.test(dong[i]); i++) {
    const m = /^\s+(?:- )?run:\s*(.+?)\s*$/.exec(dong[i]);
    if (m) run.push(m[1]);
  }
  return run;
}
CA.push(
  { id: 'KD8-design-eval', moi: async () => {
    const r = chayLenh('bash', [path.join(HERE, 'run-tests.sh')], { cwd: ROOT, env: { ...process.env, DESIGN_EVAL_CAN_DOM: '1' } });
    return r.ma === 0 && /0 skipped/.test(r.ra) ? null : `run-tests.sh mã ${r.ma}: ${r.ra.split('\n').filter((l) => /FAIL|design-eval:/.test(l)).join(' | ')}`;
  } },
  { id: 'KD8-thieu-jsdom', moi: async (c) => {
    const goc = path.join(c.tam, 'thieu-jsdom');
    for (const d of ['lib', 'vendor', 'scripts']) fs.cpSync(path.join(ROOT, d), path.join(goc, d), { recursive: true });
    fs.cpSync(HERE, path.join(goc, 'tests', 'design-eval'), { recursive: true, filter: (p) => !p.includes(`${path.sep}node_modules`) });
    const sh = path.join(goc, 'tests', 'design-eval', 'run-tests.sh');
    const env = { ...process.env, NODE_PATH: '' };
    const co = chayLenh('bash', [sh], { cwd: goc, env: { ...env, DESIGN_EVAL_CAN_DOM: '1' } });
    const khong = chayLenh('bash', [sh], { cwd: goc, env: { ...env, DESIGN_EVAL_CAN_DOM: '' } });
    if (khong.ma !== 0 || !/SKIP/.test(khong.ra)) return `đối chứng không cờ: mã ${khong.ma}, mong 0 kèm SKIP`;
    return co.ma !== 0 && /FAIL: .*jsdom/.test(co.ra) ? null : `có cờ mà thiếu jsdom: mã ${co.ma}, không thấy dòng FAIL nêu jsdom`;
  } },
  { id: 'KD8-vendor', moi: async () => {
    const r = chayLenh('git', ['-C', ROOT, 'diff', '--quiet', GOC_SHA, '--', 'vendor/impeccable']);
    return r.ma === 0 ? null : `vendor/impeccable khác bản gốc ${GOC_SHA.slice(0, 8)} (git diff mã ${r.ma})`;
  } },
  { id: 'KD8-ci', moi: async () => {
    const can = LENH_CI();
    const yml = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'gate.yml'), 'utf8');
    const co = lenhJobCi(yml);
    if (!co) return 'gate.yml không có job design-eval';
    if (!tapBang(co, can) || co.length !== can.length) return `job design-eval chạy ${JSON.stringify(co)} ≠ ${JSON.stringify(can)}`;
    // chiều đỏ trong ca: đổi một ký tự của một lệnh trên bản sao chữ → phép so phải lệch
    const hong = lenhJobCi(yml.replace(can[can.length - 1], can[can.length - 1].replace('run-tests.sh', 'run-test.sh')));
    if (hong && tapBang(hong, can)) return 'KD8-ci-do: bản gate.yml bị đổi một ký tự mà phép so vẫn khớp';
    return null;
  } },
);

// AC-9 — vi phân ba kho phải tự đỏ khi cổng không đo được ở một đích (đối chứng dương: cùng kho giả, jsdom thật → xanh).
function khoGia(goc) {
  for (const ten of ['crm', 'artifact-platform', 'onehub-invest']) {
    W(goc, `${ten}/_acceptance/ho-so/evidence/trang.html`, '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title></head><body><main><p>Trang giả để vi phân.</p></main></body></html>');
  }
  return goc;
}
function W(goc, rel, s) { const p = path.join(goc, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); return p; }
const VI_PHAN = path.join(HERE, 'vi-phan-kho.mjs');
CA.push(
  { id: 'KD9-vi-phan-do-duoc', moi: async (c) => {
    const r = chayLenh(process.execPath, [VI_PHAN], { env: { ...process.env, KHO_GOC: khoGia(path.join(c.tam, 'kho-xanh')) } });
    return r.ma === 0 && /vi phân: 3 đích · đổi 0/.test(r.ra) ? null : `kho giả, jsdom thật: mã ${r.ma}, mong 0 kèm «vi phân: 3 đích · đổi 0» — ${r.ra.trim().split('\n').pop()}`;
  } },
  { id: 'KD9-vi-phan-mu', moi: async (c) => {
    const rong = path.join(c.tam, 'khong-jsdom'); fs.mkdirSync(rong, { recursive: true });
    const r = chayLenh(process.execPath, [VI_PHAN], { env: { ...process.env, KHO_GOC: khoGia(path.join(c.tam, 'kho-mu')), VI_PHAN_JSDOM: rong } });
    return r.ma === 2 && /không đo được ở đây: \d+ đích/.test(r.ra) ? null : `cổng không chạy được mà vi phân thoát ${r.ma}, mong 2 kèm «không đo được ở đây: <n> đích» — ${r.ra.trim().split('\n').pop()}`;
  } },
);

CA.push({ id: 'KD10-vi-phan-rong', moi: async (c) => {
  const goc = path.join(c.tam, 'kho-rong');
  for (const ten of ['crm', 'artifact-platform', 'onehub-invest']) fs.mkdirSync(path.join(goc, ten, '_acceptance'), { recursive: true });
  const r = chayLenh(process.execPath, [VI_PHAN], { env: { ...process.env, KHO_GOC: goc } });
  return r.ma === 2 && /không có đích dom nào/.test(r.ra) ? null : `ba kho không có đích nào mà vi phân thoát ${r.ma}, mong 2 kèm «không có đích dom nào» — ${r.ra.trim().split('\n').pop()}`;
} });

// ── chạy ───────────────────────────────────────────────────────────────────
const argCa = process.argv.includes('--ca') ? process.argv[process.argv.indexOf('--ca') + 1] : '';
const loc = argCa ? argCa.split(',').map((s) => s.trim()).filter(Boolean) : null;
const chon = loc ? CA.filter((ca) => loc.some((t) => ca.id === t || ca.id.startsWith(t + '-'))) : CA;
if (!chon.length) { console.log(`KD: --ca «${argCa}» khớp 0 ca`); process.exit(2); }

const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kdd-'));
const trang = sinhTrang(path.join(tam, 'trang'));
let goc = null;
const canGoc = chon.some((ca) => ca.goc || ca.id === 'KD1-goc' || ca.id === 'KD10-mau-la');
if (canGoc) {
  goc = path.join(tam, 'goc');
  fs.mkdirSync(goc);
  const r = chayLenh('bash', ['-c', `git -C "$1" archive "$2" lib vendor scripts | tar -x -C "$3"`, '_', ROOT, GOC_SHA, goc]);
  if (r.ma !== 0 || !fs.existsSync(path.join(goc, 'scripts', 'design-gate.mjs'))) {
    console.log(`FAIL: KD-goc — không dựng được bản gốc ${GOC_SHA.slice(0, 8)} (cần lịch sử git đủ sâu): ${r.ra.trim()}`);
    process.exit(1);
  }
}
const c = { root: ROOT, goc, trang, tam };
let dat = 0, truot = 0;
for (const ca of chon) {
  let loi = ca.goc ? await ca.goc(c) : null;
  if (!loi) loi = await ca.moi(c);
  if (loi) { truot++; console.log(`FAIL: ${ca.id} — ${loi}`); }
  else { dat++; console.log(`PASS: ${ca.id} `); }
}
fs.rmSync(tam, { recursive: true, force: true });
console.log(`KD: ${dat} đạt, ${truot} trượt`);
process.exit(truot ? 1 : 0);
