#!/usr/bin/env node
// lo-trinh-khoi-tao.mjs — bước 5d của /acceptance-gate:acceptance-init (hồ sơ kho-moi-cai-goi-road-map, hàng RM4,
// nấc 2 của ADR 0025): kho đã chọn gói `road-map` thì có sẵn tệp lộ trình rỗng đúng khuôn, khoá cấu hình, miễn trừ
// trang, bản chép CI và trang — `product-map.mjs --check` xanh ngay ở commit khởi tạo. Thiết kế:
// docs/superpowers/specs/2026-10-15-kho-moi-cai-goi-road-map-design.md.
//
// Bật CHỈ khi `.claude/settings.json` của kho (tệp đội commit) khai `enabledPlugins["road-map@<marketplace>"] === true`;
// tên gói và tên marketplace rút từ `.claude-plugin/marketplace.json` của gói. `settings.local.json` và phạm vi người
// dùng là lựa chọn của MỘT người, không phải của kho — không tính. Không bật → một dòng, 0 byte.
//
// Năm bước HỘI TỤ: mỗi bước tự kiểm trạng thái của mình và chỉ làm phần thiếu, nên đứt ở bất kỳ điểm nào thì chạy lại
// là xong, và chạy lại trên kho đã đủ thì 0 byte đổi. Khoá đi TRƯỚC tệp: đứt sau bước khoá thì lần sau thấy «đã khai,
// tệp vắng» và tạo tệp; phép kiểm «đích bị chiếm» chạy một lần trước mọi lần ghi, chỉ khi kho chưa khai.
//
// Usage: node lo-trinh-khoi-tao.mjs --root <kho> [--write]      (vắng --write: chỉ in việc sẽ làm)
// Exit:  0 xong / không có gì phải làm / kho không bật · 2 từ chối (chưa có config, đích bị chiếm, khoá trỏ ra ngoài
//        kho, gói thiếu tệp) · 3 .claude/settings.json không phải JSON · 4 sai tham số.
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, unlinkSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOI = path.resolve(HERE, '..');
const WR = createRequire(import.meta.url)(path.join(GOI, 'lib', 'workspace-record.cjs'));
export const GOI_ROAD_MAP = 'road-map';
export const DICH_MAC_DINH = 'docs/plan/lo-trinh.json';
export const DONG_CHUA_CAI = 'kho chưa cài road-map ở phạm vi kho — không tạo lộ trình';
export const DONG_CHI_LOCAL = 'gói chỉ bật ở .claude/settings.local.json (của một người) — cài với --scope project để cả kho dùng';
export const DONG_DA_SAN = 'lộ trình đã sẵn — không đổi gì';
export const DONG_LECH = 'bản chép khác bản gói — chép lại theo đợt phát hành';
export const DONG_CHUA_CHEP_CI = 'kho chưa chép bộ kiểm CI — bỏ bước chép';
export const GHI_CHU = 'Thêm việc bằng skill cắt lượt (/acceptance-gate:cat-luot), hoặc viết hàng theo khuôn skills/acceptance/references/lo-trinh-template.json của gói acceptance-gate; mở vòng bằng /feature-loop:feature-loop <mã>.';
const DAU_LO_TRINH = '[only-if-declared: lo_trinh]';

const thoat = (ma, m) => { process.stderr.write(`lo-trinh-khoi-tao: ${m}\n`); process.exit(ma); };
const docTho = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };

// Khoá bật `road-map@<marketplace>` — rút từ marketplace.json của gói (một nguồn với plugin-declare.mjs).
export function khoaBat(marketplacePath = path.join(GOI, '.claude-plugin', 'marketplace.json')) {
  let j;
  try { j = JSON.parse(readFileSync(marketplacePath, 'utf8')); } catch { return null; }
  const p = (Array.isArray(j.plugins) ? j.plugins : []).find(x => x && x.name === GOI_ROAD_MAP);
  return p && j.name ? `${p.name}@${j.name}` : null;
}

// → { bat: bool, chiLocal: bool } · ném { ma: 3 } khi settings.json không phải JSON.
export function docBat(root, khoa) {
  const doc = ten => {
    const t = docTho(path.join(root, '.claude', ten));
    if (t == null) return null;
    try { return JSON.parse(t); } catch { return { hong: true }; }
  };
  const proj = doc('settings.json');
  if (proj && proj.hong) throw Object.assign(new Error('.claude/settings.json không phải JSON — không ghi gì'), { ma: 3 });
  const bat = s => !!(s && s.enabledPlugins && typeof s.enabledPlugins === 'object' && s.enabledPlugins[khoa] === true);
  const loc = doc('settings.local.json');
  return { bat: bat(proj), chiLocal: !bat(proj) && !(loc && loc.hong) && bat(loc) };
}

// Mục mang dấu lộ trình của INIT-CI-COPY-LIST (khối của commands/acceptance-init.md) → [{ nguon, dich }] tương đối.
export function mucChepLoTrinh(initMd) {
  const m = String(initMd).match(/<!-- <<<INIT-CI-COPY-LIST -->([\s\S]*?)<!-- INIT-CI-COPY-LIST>>> -->/);
  if (!m) return null;
  const ra = [];
  for (const dong of m[1].split('\n')) {
    if (!dong.includes(DAU_LO_TRINH)) continue;
    const x = dong.match(/`\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)` → `([^`]+)`/);
    if (x) ra.push({ nguon: x[1], dich: path.posix.join(x[2], path.posix.basename(x[1])) });
  }
  return ra;
}

function trongKho(root, rel) {
  const d = path.resolve(root, rel); const r = path.relative(root, d);
  return !path.isAbsolute(rel) && r && !r.startsWith('..') && !path.isAbsolute(r);
}

export async function khoiTao({ root, ghi }) {
  root = path.resolve(root);
  const LT = await import(pathToFileURL(path.join(HERE, 'lo-trinh.mjs')).href);
  const PM = await import(pathToFileURL(path.join(HERE, 'product-map.mjs')).href);
  const cfgP = path.join(root, '_acceptance', 'config.yaml');
  const bakP = cfgP + '.bak';
  const viec = []; const bao = [];
  const khai = () => LT.docCacTep(root);
  const patch = args => {
    const r = spawnSync(process.execPath, [path.join(HERE, 'config-patch.mjs'), '--config', cfgP, ...args, '--write'], { encoding: 'utf8' });
    if (r.status !== 0) thoat(2, `ghi cấu hình không được (${args.join(' ')}): ${(r.stderr || r.stdout || '').trim()}`);
  };
  // config-patch để lại bản lưu `.bak`; bước khởi tạo trả nó về đúng như trước (vắng thì xoá) — 0 byte ngoài việc của bước.
  const bakTruoc = docTho(bakP);
  const traBak = () => { if (!ghi) return; if (bakTruoc == null) { if (existsSync(bakP)) unlinkSync(bakP); } else writeFileSync(bakP, bakTruoc); };

  // Bước 0 — phép kiểm trước mọi lần ghi: chưa khai mà đích mặc định đã có tệp → không ghi đè, không đoán.
  if (khai() == null && existsSync(path.join(root, DICH_MAC_DINH)))
    thoat(2, `đã có ${DICH_MAC_DINH} mà kho chưa khai lộ trình — không ghi đè; nếu đó là lộ trình, khai lo_trinh.tep trỏ vào nó`);

  const buoc1 = () => { // khoá cấu hình
    if (khai() != null) return;
    viec.push(`khai lo_trinh.tep: ${DICH_MAC_DINH}`);
    if (ghi) { patch(['--key', 'lo_trinh.tep', '--value', DICH_MAC_DINH]); traBak(); }
  };
  const buoc2 = () => { // miễn trừ trang
    const mt = PM.mienTru(root, 'LO-TRINH.html');
    if (!mt.biet) { bao.push(`không kiểm được miễn trừ của LO-TRINH.html (${mt.ly}) — bỏ bước`); return; }
    if (mt.phu) return;
    viec.push('miễn trừ LO-TRINH.html trong risk_tiers.t1_skip_globs');
    if (ghi) { patch(['--key', 'risk_tiers.t1_skip_globs', '--append', '--value', 'LO-TRINH.html']); traBak(); }
  };
  const buoc3 = () => { // tệp lộ trình — mỗi tệp khai mà vắng
    const k = khai(); const ds = k ? k.tep : (ghi ? [] : [DICH_MAC_DINH]);
    for (const tep of ds) {
      if (!trongKho(root, tep)) thoat(2, `tệp lộ trình khai ngoài kho: ${tep} — không ghi`);
      const p = path.join(root, tep);
      if (existsSync(p)) continue;
      viec.push(`tạo ${tep}`);
      if (!ghi) continue;
      mkdirSync(path.dirname(p), { recursive: true });
      LT.ghiLoTrinh(p, { schema: 1, ten: `Lộ trình ${LT.tenKho(root)}`, ghi_chu: GHI_CHU, moc: [], hang: [], chan_troi: [], da_bac: [] });
    }
  };
  const buoc4 = () => { // bản chép CI mang dấu lộ trình — chỉ kho đã chép lớp CI
    if (!existsSync(path.join(root, 'scripts', 'product-map.mjs'))) { bao.push(DONG_CHUA_CHEP_CI); return; }
    const muc = mucChepLoTrinh(docTho(path.join(GOI, 'commands', 'acceptance-init.md')) || '');
    if (!muc || !muc.length) thoat(2, 'gói không có mục chép CI mang dấu lộ trình trong INIT-CI-COPY-LIST');
    for (const { nguon, dich } of muc) {
      const src = path.join(GOI, nguon); const dst = path.join(root, dich);
      if (!existsSync(src)) thoat(2, `gói thiếu tệp chép CI: ${nguon}`);
      if (existsSync(dst)) { if (!readFileSync(dst).equals(readFileSync(src))) bao.push(`${dich}: ${DONG_LECH}`); continue; }
      viec.push(`chép ${dich}`);
      if (ghi) { mkdirSync(path.dirname(dst), { recursive: true }); copyFileSync(src, dst); }
    }
  };
  const buoc5 = async () => { // trang (và bản đồ kho đã bật mà vắng) — chỉ khi vắng; vẽ bằng ĐÚNG hàm của bản đồ
    // Kho coi bản đồ là PHẢI CÓ (mapTracked — cùng vị từ làm `--check` đỏ khi tệp vắng) mà tệp chưa có: kho mới từ khuôn
    // khởi tạo ở đúng trạng thái này tới lần đóng cổng đầu, nên vẽ luôn — không thì `--check` đỏ ở commit khởi tạo.
    // Kho chưa bật bản đồ không nhận PRODUCT-MAP.md (sổ S3 của hồ sơ, thay vế cuối AC-4 bản duyệt).
    const ban = path.join(root, 'PRODUCT-MAP.md');
    if (!existsSync(ban) && WR.mapTracked(root, docTho(cfgP) || '')) {
      viec.push('vẽ PRODUCT-MAP.md (kho đã bật bản đồ mà tệp vắng)');
      if (ghi) writeFileSync(ban, PM.renderProductMap(root));
    }
    const p = path.join(root, 'LO-TRINH.html');
    if (existsSync(p)) return;
    viec.push('vẽ LO-TRINH.html');
    if (!ghi) return;
    const vt = await PM.veTrangLoTrinh(root);
    if (vt.loi) thoat(2, vt.loi);
    if (vt.trang != null) writeFileSync(p, vt.trang);
  };

  buoc1(); // bước 1
  buoc2(); // bước 2
  buoc3(); // bước 3
  buoc4(); // bước 4
  await buoc5(); // bước 5

  if (!WR.configList(docTho(cfgP) || '', 't1_skip_globs').includes('PRODUCT-MAP.md'))
    bao.push('kho chưa bật bản đồ sản phẩm (PRODUCT-MAP.md không có trong t1_skip_globs) — bốn lệnh đóng cổng sẽ không vẽ lại trang lộ trình');
  return { viec, bao };
}

const isMain = (() => { try { return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url); } catch { return false; } })();
if (isMain) {
  const a = process.argv.slice(2);
  let root = null; let ghi = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--write') ghi = true;
    else if (a[i] === '--root' && a[i + 1] && !a[i + 1].startsWith('--')) root = a[++i];
    else thoat(4, `tham số lạ ${a[i]} — chỉ nhận --root <kho> [--write]`);
  }
  if (!root) thoat(4, 'thiếu --root <kho>');
  root = path.resolve(root);
  if (!existsSync(root) || !statSync(root).isDirectory()) thoat(4, `--root không phải thư mục: ${root}`);
  const khoa = khoaBat();
  if (!khoa) thoat(2, 'gói không đọc được .claude-plugin/marketplace.json hoặc không có gói road-map');
  let b;
  try { b = docBat(root, khoa); } catch (e) { if (e.ma) thoat(e.ma, e.message); throw e; }
  if (!b.bat) { process.stdout.write(`${DONG_CHUA_CAI}${b.chiLocal ? ` · ${DONG_CHI_LOCAL}` : ''}\n`); process.exit(0); }
  if (!existsSync(path.join(root, '_acceptance', 'config.yaml'))) thoat(2, 'chưa có _acceptance/config.yaml — chạy phần khởi tạo cấu hình trước');
  const { viec, bao } = await khoiTao({ root, ghi });
  const ra = viec.length ? [`${ghi ? 'đã' : 'sẽ'} làm: ${viec.join(' · ')}${ghi ? ' — commit các tệp này' : ' (chạy lại với --write)'}`] : [DONG_DA_SAN];
  process.stdout.write([...ra, ...bao.map(x => `  ! ${x}`)].join('\n') + '\n');
}
