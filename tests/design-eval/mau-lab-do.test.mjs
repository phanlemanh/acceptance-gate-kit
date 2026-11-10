#!/usr/bin/env node
// Chiều đỏ của mau-lab.test.mjs. Mỗi ca MD chép cây vào thư mục tạm, chứng ca xanh đạt trên bản lành, đổi ĐÚNG MỘT chỗ,
// dựng lại bộ quét, rồi đòi đúng ca xanh ấy đỏ với đúng thông điệp. Khớp không đúng một lần là ca hỏng, không phải xanh.
// MD-0 là bộ máy gốc c8fa5a65, trước bản vá, trên cùng các trang thử.
//
//   node tests/design-eval/mau-lab-do.test.mjs [--chi MD-1,MD-2]

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const GOC_SHA = 'c8fa5a65';
const BUNDLE = 'lib/design-bundle.mjs';
const WRAPPER = 'scripts/build-design-scan.mjs';

function banSao() {
  const dich = fs.mkdtempSync(path.join(os.tmpdir(), 'mau-lab-do-'));
  for (const d of ['scripts', 'lib', 'vendor']) fs.cpSync(path.join(ROOT, d), path.join(dich, d), { recursive: true });
  fs.cpSync(HERE, path.join(dich, 'tests', 'design-eval'), { recursive: true, filter: (p) => !p.includes(`${path.sep}node_modules`) });
  fs.symlinkSync(path.join(HERE, 'node_modules'), path.join(dich, 'tests', 'design-eval', 'node_modules'));
  return dich;
}

const chay = (goc, tep, ...doi) => {
  const r = spawnSync(process.execPath, [path.join(goc, tep), ...doi], { encoding: 'utf8', maxBuffer: 1 << 26, cwd: goc });
  return { ma: r.status, ra: `${r.stdout}${r.stderr}`, stdout: r.stdout };
};
const caMau = (goc, ca) => chay(goc, 'tests/design-eval/mau-lab.test.mjs', '--ca', ca);

function doiMotCho(goc, tep, cu, moi) {
  const f = path.join(goc, tep);
  const s = fs.readFileSync(f, 'utf8');
  const so = s.split(cu).length - 1;
  if (so !== 1) throw new Error(`mốc phá khớp ${so} lần trong ${tep}: ${cu}`);
  fs.writeFileSync(f, s.split(cu).join(moi));
}

async function phaThu(tep, cu, moi, caXanh, thongDiep) {
  const goc = banSao();
  try {
    const lanh = caMau(goc, caXanh);
    if (lanh.ma !== 0) return `bản lành không xanh (${caXanh}): ${lanh.ra.slice(-300)}`;
    doiMotCho(goc, tep, cu, moi);
    const dung = chay(goc, WRAPPER);
    if (dung.ma !== 0) return `không dựng lại được bộ quét: ${dung.ra.slice(-300)}`;
    const pha = caMau(goc, caXanh);
    if (pha.ma === 0) return `nhát phá không làm đỏ ${caXanh}`;
    const dongFail = pha.ra.split('\n').filter((d) => d.startsWith(`FAIL ${caXanh}`));
    if (!dongFail.length) return `đỏ nhưng không phải ca ${caXanh}: ${pha.ra.slice(-300)}`;
    return dongFail.some((d) => d.includes(thongDiep)) ? null : `sai thông điệp, mong «${thongDiep}»: ${dongFail.join(' | ').slice(0, 300)}`;
  } finally {
    fs.rmSync(goc, { recursive: true, force: true });
  }
}

function boMayGoc() {
  const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'mau-lab-goc-'));
  const tar = path.join(goc, 'goc.tar');
  execFileSync('git', ['-C', ROOT, 'archive', '-o', tar, GOC_SHA, 'scripts', 'lib', 'vendor']);
  execFileSync('tar', ['-xf', tar, '-C', goc]);
  return goc;
}

// Bộ máy gốc trả gì trên một dòng chữ/nền, gọi đúng cổng của bản đó.
function phanQuyetGoc(goc, chu, nen) {
  const dir = fs.mkdtempSync(path.join(goc, 'trang-'));
  const f = path.join(dir, 'trang.html');
  fs.writeFileSync(f, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title></head><body><main><p style="color:${chu};background-color:${nen}">Chữ thử tương phản.</p></main></body></html>`);
  const r = chay(goc, 'scripts/design-gate.mjs', f, '--jsdom', HERE);
  return JSON.parse(r.stdout).verdict;
}

const CA = {
  'MD-0': async () => {
    const goc = boMayGoc();
    try {
      const loi = [];
      for (const [chu, nen] of [['lab(96.52 0 0)', '#ffffff'], ['oklab(0.97 0 0)', '#ffffff'], ['oklab(0.97 0 0 / 0.2)', '#ffffff']]) {
        const v = phanQuyetGoc(goc, chu, nen);
        if (v !== 'PASS') loi.push(`${chu}: bộ máy gốc trả ${v}, mong PASS`);
      }
      const nenOklch = phanQuyetGoc(goc, '#ffffff', 'oklch(0.15 0 0)');
      if (nenOklch !== 'KHONG-DO-DUOC') loi.push(`nền oklch trực tiếp: bộ máy gốc trả ${nenOklch}, mong KHONG-DO-DUOC`);
      console.log(`  bộ máy gốc trên nền oklch trực tiếp: ${nenOklch}`);
      return loi.join(' | ') || null;
    } finally {
      fs.rmSync(goc, { recursive: true, force: true });
    }
  },
  'MD-1': () => phaThu(BUNDLE, 'if (!m) return docMauHoLab(color);', 'if (!m) return null;', 'lab', 'mong REJECT'),
  'MD-2': () => phaThu(BUNDLE, 'const kappa = 24389 / 27;', 'const kappa = 24389 / 2.7;', 'chrome lab(50 40 -30)', 'không có phát hiện khớp'),
  'MD-3': () => phaThu(BUNDLE, 'contrastRatio(hoaMau(textColor, b), b)', 'contrastRatio(textColor, b)', 'alpha-hoa-rgba', 'mong REJECT'),
  'MD-4': () => phaThu(BUNDLE, 'return duoi ? hoaMau(bg, duoi) : bg;', 'return bg;', 'nen-alpha-truot', 'mong REJECT'),
  'MD-5': () => phaThu(BUNDLE, '/(?:rgba?|oklab|oklch|lab|lch)\\\\([^)]+\\\\)/g', '/rgba?\\\\([^)]+\\\\)/g', 'gradient-lab', 'mong REJECT'),
  'MD-6': () => phaThu(BUNDLE, 'if (a >= 1 || a <= 0) return tren;', 'if (a >= 1) return tren;', 'alpha-khong', 'mong PASS'),
  'MD-7': () => phaThu(BUNDLE, 'mauKhongDoc: timMauKhongDoc(el, style),', 'mauKhongDoc: null,', 'khong-doc-chu', 'PASS'),
  'MD-8': () => phaThu(WRAPPER, "verdict: blocking.length ? 'REJECT' : khongDo ? 'KHONG-DO-DUOC' : 'PASS',", "verdict: blocking.length ? 'REJECT' : 'PASS',", 'khong-doc-chu', 'quét:'),
  'MD-9': () => phaThu(BUNDLE, 'if (solid && solid.a >= 1) return null;', '', 'nen-dac-che', 'KHONG-DO-DUOC'),
  'MD-10': async () => {
    const goc = banSao();
    try {
      const lanh = chay(goc, WRAPPER, '--check');
      if (lanh.ma !== 0) return `bản lành --check thoát ${lanh.ma}`;
      doiMotCho(goc, 'scripts/design-scan.js', '__impeccableDesignScan = ', '__impeccableDesignScan  = ');
      const pha = chay(goc, WRAPPER, '--check');
      if (pha.ma === 0) return 'đổi tệp đã dựng mà --check vẫn xanh';
      return pha.ra.includes('DRIFT') ? null : `thiếu chữ DRIFT: ${pha.ra.slice(-200)}`;
    } finally {
      fs.rmSync(goc, { recursive: true, force: true });
    }
  },
  'MD-11': () => phaThu(BUNDLE, 'return stops.map((s) => (s.a <= 0 ? duoi : hoaMau(s, duoi)));', 'return stops;', 'gradient-alpha', 'mong REJECT'),
  // khongDo đã loại ca có từ chối, nên đảo thứ tự phải làm ở chỗ tính danh sách chặn: có màu không đọc được thì bỏ hết từ chối.
  'MD-12': () => phaThu(WRAPPER, 'var blocking = measured.filter(inFailOn);', 'var blocking = all.some(function (f) { return f.do_duoc === false && inFailOn(f); }) ? [] : measured.filter(inFailOn);', 'fail-thang', 'quét:'),
  // Phép kiểm mốc phải áp cho mọi mốc và cả hai chiều: nới một vế thì ma trận moc-va-mat đỏ.
  'MD-13': () => phaThu(BUNDLE, 'if (count !== 1) throw', 'if (count < 1) throw', 'moc-va-mat', 'thừa mốc'),
  'MD-14': () => phaThu(BUNDLE, 'if (count !== 1) throw', 'if (count !== 1 && anchor === PATCHES[0][0]) throw', 'moc-va-mat', 'mất mốc'),
  // Lớp dưới không biết phải ra không đo được; mỗi đường vào một nhát.
  'MD-15': () => phaThu(BUNDLE, 'if (stops.some((s) => s.a != null && s.a < 1) && !lopDuoiGradient(c)) return image;', '', 'gradient-tren-anh-to-tien', 'cổng:'),
  'MD-16': () => phaThu(BUNDLE, "if (/url\\s*\\(/i.test(anh) || (anh.match(/gradient\\(/gi) || []).length > 1) return null;", '', 'gradient-tren-anh-cung-phan-tu', 'cổng:'),
  'MD-17': () => phaThu(BUNDLE, "if (/url\\s*\\(/i.test(cs.backgroundImage || '')) return null;", '', 'gradient-tren-anh-body', 'cổng:'),
  'MD-18': () => phaThu(BUNDLE, 'const duoi = lopDuoiGradient(el);', 'const duoi = { r: 255, g: 255, b: 255, a: 1 };', 'gradient-alpha-nen-to-tien', 'mong PASS'),
};

const i = process.argv.indexOf('--chi');
const chon = i >= 0 ? process.argv[i + 1].split(',') : Object.keys(CA);
let hong = 0;
for (const ma of chon) {
  let loi;
  try { loi = await CA[ma](); } catch (e) { loi = `lỗi chạy: ${e.message}`; }
  if (loi) { hong++; console.log(`FAIL: [${ma}] ${loi}`); } else console.log(`PASS: [${ma}]`);
}
console.log(`mau-lab-do: ${chon.length - hong}/${chon.length} ca đạt`);
process.exit(hong ? 1 : 0);
