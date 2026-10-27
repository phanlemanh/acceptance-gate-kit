#!/usr/bin/env node
// Đồng bộ bản vendored của design-floor với bản ghim upstream — đường DUY NHẤT của bộ đo chạm mạng.
//   --write  lấy bản ghim, chép đúng các tệp của tệp khoá vào design-floor/vendor/design-os, áp các bản vá
//            `da-ap` của sổ LOCAL-PATCHES theo thứ tự khối máy, điền `truoc`/`sau` của từng tệp vá vào sổ,
//            rồi dựng lại bản gói design-floor/dist/ui.mjs. Chạy khi đổi ghim, đổi tệp khoá hay đổi bản vá.
//   --kiem   làm đúng các bước ấy trong một thư mục tạm và so từng byte với cây đã commit (bản vendored,
//            băm của sổ, bản gói). Thoát 0 «khớp» · 1 «LỆCH» kèm danh sách · 2 không chạy được (mạng…).
// Dùng: node tests/design-floor/dong-bo.mjs --write|--kiem [--goc <gốc kit>] [--hop-dong <md>] [--khoa <json>]
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { docDoiSo, docHopDong, soVaTai } from './lib/hop-dong.mjs';
import { apVa, bam, dungBanGoi, layUpstream, tepCuaVa } from './lib/upstream.mjs';

const ds = docDoiSo(process.argv.slice(2));
if (ds.ghi === ds.kiem) {
  console.error('dong-bo: cần đúng một trong --write, --kiem');
  process.exit(2);
}
const hd = docHopDong(ds.hopDong);
const GOC = ds.goc;

// Dựng bản vendored + bản gói vào một gốc có bố cục kit (`goc`), từ bản ghim `up`. Trả các dòng sổ đã điền băm.
function dung(up, goc, khoa, so) {
  const vendor = join(goc, hd.vendor.goc);
  rmSync(vendor, { recursive: true, force: true });
  for (const t of khoa.tep) {
    mkdirSync(dirname(join(vendor, t.path)), { recursive: true });
    cpSync(join(up, t.path), join(vendor, t.path));
  }
  const dong = structuredClone(so.ban_va);
  for (const d of dong.filter((x) => x.trang_thai === 'da-ap')) {
    const tepVa = join(GOC, d.tep_va);
    const truoc = Object.fromEntries(tepCuaVa(tepVa).map((p) => [p, bam(join(vendor, p))]));
    apVa(vendor, tepVa);
    d.tep = Object.keys(truoc).sort().map((p) => ({ path: p, truoc: truoc[p], sau: bam(join(vendor, p)) }));
  }
  return { dong, banGoi: dungBanGoi(hd, goc) };
}

function liet(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true }).filter((f) => statSync(join(dir, f)).isFile()).map((f) => f.split('\\').join('/')).sort();
}

let up;
try {
  up = layUpstream(hd);
} catch (e) {
  console.error(`dong-bo: không lấy được bản ghim — ${e.message}`);
  process.exit(2);
}
const khoa = JSON.parse(readFileSync(ds.khoa, 'utf8'));
const so = soVaTai(hd, GOC);

if (ds.ghi) {
  const { dong, banGoi } = dung(up, GOC, khoa, so);
  const duongSo = join(GOC, hd.vendor.so_va);
  const md = readFileSync(duongSo, 'utf8').replace(
    /(<!-- <<<DESIGN-FLOOR-LOCAL-PATCHES -->\n```json\n)[\s\S]*?(\n```\n<!-- DESIGN-FLOOR-LOCAL-PATCHES>>> -->)/,
    (_, a, b) => `${a}${JSON.stringify({ ...so, ban_va: dong }, null, 2)}${b}`,
  );
  writeFileSync(duongSo, md);
  mkdirSync(dirname(join(GOC, hd.vendor.ban_goi)), { recursive: true });
  writeFileSync(join(GOC, hd.vendor.ban_goi), banGoi);
  const nVa = dong.filter((d) => d.trang_thai === 'da-ap');
  console.log(`dong-bo: đã ghi ${hd.vendor.goc} (${khoa.tep.length} tệp) · ${nVa.length} bản vá đã áp (${nVa.map((d) => `${d.id}: ${d.tep.length} tệp`).join(', ')}) · ${hd.vendor.ban_goi} ${banGoi.length} byte`);
  process.exit(0);
}

// --kiem: dựng lại ở thư mục tạm cùng bố cục, so từng byte.
const TMP = mkdtempSync(join(tmpdir(), 'design-floor-dong-bo-'));
cpSync(join(GOC, dirname(hd.vendor.vo)), join(TMP, dirname(hd.vendor.vo)), { recursive: true });
mkdirSync(join(TMP, 'tests', 'design-floor'), { recursive: true });
symlinkSync(join(GOC, 'tests', 'design-floor', 'node_modules'), join(TMP, 'tests', 'design-floor', 'node_modules'));
const lech = [];
try {
  const { dong, banGoi } = dung(up, TMP, khoa, so);
  const a = join(TMP, hd.vendor.goc);
  const b = join(GOC, hd.vendor.goc);
  const la = liet(a);
  const lb = new Set(liet(b));
  for (const f of la) {
    if (!lb.has(f)) lech.push(`-${hd.vendor.goc}/${f} (thiếu ở cây)`);
    else if (!readFileSync(join(a, f)).equals(readFileSync(join(b, f)))) lech.push(`~${hd.vendor.goc}/${f}`);
    lb.delete(f);
  }
  for (const f of lb) lech.push(`+${hd.vendor.goc}/${f} (thừa ở cây)`);
  if (JSON.stringify(dong) !== JSON.stringify(so.ban_va)) lech.push(`băm của sổ ${hd.vendor.so_va} khác bản dựng lại`);
  const duongGoi = join(GOC, hd.vendor.ban_goi);
  if (!existsSync(duongGoi) || !banGoi.equals(readFileSync(duongGoi))) lech.push(`~${hd.vendor.ban_goi}`);
} catch (e) {
  lech.push(`không dựng lại được: ${String(e.stderr || e.message).split('\n')[0]}`);
}
rmSync(TMP, { recursive: true, force: true });
if (lech.length) {
  console.log(`dong-bo: LỆCH — ${lech.join(', ')}`);
  process.exit(1);
}
console.log(`dong-bo: khớp — ${khoa.tep.length} tệp vendored, sổ vá và bản gói dựng lại từ ${hd.nguon.commit.slice(0, 7)} bằng cây đã commit`);
process.exit(0);
