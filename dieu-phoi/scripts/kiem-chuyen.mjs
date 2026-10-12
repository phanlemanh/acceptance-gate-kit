// Danh mục chuyển (DP1 Notes T13; DP8 hồ sơ dieu-phoi-on-dinh-r2): mọi chỗ trong kho còn trỏ bản lõi chép tay
// `scripts/dieu-phoi/` — tệp git theo dõi (settings, package.json, eval của hồ sơ…), settings cục bộ, hook git,
// LaunchAgent của người dùng nhắc tới kho này, tệp chữ ở gốc thư mục đợt đang chạy (LUAT.md), và (DP8) import hay
// require TƯƠNG ĐỐI trong tệp mã mà đường giải rơi vào thư mục bản cũ. Bỏ qua chính thư mục bản cũ.
// `kiemChuyen` giữ giao kèo 2.27 — trả MỌI dòng `<tệp>:<dòng>`: có kho tiêu thụ tự phân lớp đầu ra của nó trong
// một eval đã chấm. `phanLopChuyen` tách hai nhóm: phải sửa · lịch sử theo bảy lớp neo vào khuôn kit.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { gocKhoChinh, TEN_LIEN_KET } from './dot.mjs';
import { khop } from './glob.mjs';
import { DA_THONG } from './phat-lich.mjs';

export const DUONG_BAN_CU = 'scripts/dieu-phoi/';

// Thứ tự = thứ tự xét và thứ tự in ở dòng tổng (design doc, chỗ chọn 1b).
export const LOP_LICH_SU = ['khai-boi-kho', 'ho-so', 'eval-chet', 'eval-ngoai-lan-may', 'executor-chet', 'tai-lieu', 'lo-trinh'];

const DUOI_MA = /\.(?:m?[jt]sx?|c[jt]s)$/;
const MAU_NAP = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s+)(['"`])(\.{1,2}\/[^'"`]*)\1/g;
const EXECUTOR_NGOAI_LAN_MAY = ['judgment', 'ui-check'];

const doc = (p) => {
  try {
    const t = fs.readFileSync(p, 'utf8');
    return t.includes('\0') ? null : t;
  } catch {
    return null;
  }
};

function quetChuyen(cwd) {
  const goc = gocKhoChinh(cwd);
  const dirCu = path.join(goc, DUONG_BAN_CU.slice(0, -1));
  const ra = [];
  const quet = (abs, nhan, { ma = false } = {}) => {
    const t = doc(abs);
    if (t == null) return;
    t.split('\n').forEach((d, i) => {
      let trung = d.includes(DUONG_BAN_CU);
      if (!trung && ma) {
        for (const m of d.matchAll(MAU_NAP)) {
          const dich = path.resolve(path.dirname(abs), m[2]);
          if (dich === dirCu || dich.startsWith(`${dirCu}${path.sep}`)) trung = true;
        }
      }
      if (trung) ra.push(`${nhan}:${i + 1}`);
    });
  };
  const git = (...a) => execFileSync('git', a, { cwd: goc, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 });
  const theoDoi = new Set(git('ls-files', '-z').split('\0').filter(Boolean));
  for (const f of ['.claude/settings.json', '.claude/settings.local.json']) theoDoi.add(f);
  const dsTep = [...theoDoi].sort().filter((f) => !f.startsWith(DUONG_BAN_CU));
  for (const f of dsTep) quet(path.join(goc, f), f, { ma: DUOI_MA.test(f) });
  // Hook git: cả `.git/hooks` của kho lẫn `core.hooksPath` đang có hiệu lực (có máy đặt nó toàn hệ
  // thống, khi đó `--git-path hooks` không còn trỏ `.git/hooks`).
  const chung = path.resolve(goc, git('rev-parse', '--git-common-dir').trim());
  const dsHooks = [[path.join(chung, 'hooks'), '.git/hooks']];
  const hieuLuc = path.resolve(goc, git('rev-parse', '--git-path', 'hooks').trim());
  if (hieuLuc !== dsHooks[0][0]) dsHooks.push([hieuLuc, hieuLuc.startsWith(`${goc}${path.sep}`) ? path.relative(goc, hieuLuc) : hieuLuc]);
  for (const [d, nhan] of dsHooks) {
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).sort()) if (!f.endsWith('.sample') && fs.statSync(path.join(d, f)).isFile()) quet(path.join(d, f), `${nhan}/${f}`);
  }
  const la = path.join(process.env.HOME ?? '', 'Library', 'LaunchAgents');
  if (fs.existsSync(la)) {
    for (const f of fs.readdirSync(la).filter((x) => x.endsWith('.plist')).sort()) {
      const p = path.join(la, f);
      if ((doc(p) ?? '').includes(goc)) quet(p, `~/Library/LaunchAgents/${f}`);
    }
  }
  const dot = path.join(goc, '.acceptance-runs', TEN_LIEN_KET);
  if (fs.existsSync(dot)) {
    for (const f of fs.readdirSync(dot).sort()) {
      const p = path.join(dot, f);
      if (fs.statSync(p).isFile() && /\.(md|json|txt)$/.test(f)) quet(p, `<thư mục đợt>/${f}`);
    }
  }
  return { goc, ra, dsTep };
}

export const kiemChuyen = (cwd) => quetChuyen(cwd).ra;

const thut = (d) => /^\s*/.exec(d)[0].length;
const laBoQua = (d) => d.trim() === '' || /^\s*#/.test(d);
// Chú thích YAML: `#` ở đầu hoặc đứng sau khoảng trắng, ngoài nháy — `evals.yaml#E7` không phải chú thích.
export function boChuThich(s) {
  let nhay = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (nhay) {
      if (c === nhay) nhay = null;
    } else if (c === '"' || c === "'") nhay = c;
    else if (c === '#' && (i === 0 || /\s/.test(s[i - 1]))) return s.slice(0, i);
  }
  return s;
}
const boNhay = (v) => v.trim().replace(/^(["'])(.*)\1$/, '$2');
const giaTri = (v) => boNhay(boChuThich(v ?? ''));
// Danh sách một dòng `[a, "b#c", {x,y}]`: tách ở dấu phẩy ngoài nháy và ngoài ngoặc lồng.
function tachDanhSachDong(s) {
  const ra = [];
  let sau = 0;
  let nhay = null;
  let cur = '';
  for (let i = 1; i < s.length; i++) {
    const c = s[i];
    if (nhay) {
      if (c === nhay) nhay = null;
      cur += c;
    } else if (c === '"' || c === "'") {
      nhay = c;
      cur += c;
    } else if ((c === ',' || c === ']') && sau === 0) {
      if (cur.trim()) ra.push(boNhay(cur));
      cur = '';
      if (c === ']') break;
    } else {
      if (c === '{' || c === '[') sau++;
      if (c === '}' || c === ']') sau--;
      cur += c;
    }
  }
  return ra;
}

// Khối eval của một evals.yaml (đọc theo dòng, không bộ đọc YAML): [{ tu, den, id, status, executor, cmd }], dòng
// 0-based gồm cả hai đầu. Một khối = một mục danh sách dưới `evals:`, khoá nào đứng đầu cũng được.
export function khoiEval(text) {
  const dong = text.split('\n');
  const i0 = dong.findIndex((d) => /^evals:\s*(#.*)?$/.test(d));
  if (i0 < 0) return [];
  const ds = [];
  let mucThut = null;
  let cur = null;
  for (let i = i0 + 1; i < dong.length; i++) {
    const d = dong[i];
    if (laBoQua(d)) continue;
    // Mục danh sách được phép ở cột 0 (`evals:\n- id: E1`, YAML hợp lệ): xét mục TRƯỚC khi coi cột 0 là hết khối.
    const m = /^(\s*)-\s+(.*)$/.exec(d);
    if (thut(d) === 0 && !m) break;
    if (m && (mucThut === null || m[1].length === mucThut)) {
      mucThut = m[1].length;
      if (cur) ds.push(cur);
      cur = { tu: i, den: i, khoa: {} };
      const kv = /^([\w-]+):\s*(.*)$/.exec(m[2]);
      if (kv) cur.khoa[kv[1]] = kv[2];
      continue;
    }
    if (!cur) continue;
    cur.den = i;
    const kv = /^\s*([\w-]+):\s*(.*)$/.exec(d);
    if (kv && thut(d) === mucThut + 2) cur.khoa[kv[1]] = kv[2];
  }
  if (cur) ds.push(cur);
  return ds.map((k) => ({ tu: k.tu, den: k.den, id: giaTri(k.khoa.id), status: giaTri(k.khoa.status), executor: giaTri(k.khoa.executor), cmd: giaTri(k.khoa.cmd) }));
}

// Đường khoá YAML của từng dòng (bỏ qua mục danh sách): mảng tên khoá từ gốc; dòng trống hay chú thích → null.
export function duongKhoa(text) {
  const ra = [];
  const ngan = [];
  for (const d of text.split('\n')) {
    if (laBoQua(d)) {
      ra.push(null);
      continue;
    }
    const t = thut(d);
    while (ngan.length && ngan[ngan.length - 1].thut >= t) ngan.pop();
    const kv = /^\s*([\w.-]+):(?:\s|$)/.exec(d);
    if (kv) {
      ngan.push({ ten: kv[1], thut: t });
      ra.push(ngan.map((x) => x.ten));
    } else ra.push(ngan.map((x) => x.ten));
  }
  return ra;
}

// Danh sách chuỗi dưới khoá lồng hai cấp `cha: con:` — dạng khối (`- a`) hay một dòng (`[a, b]`).
export function docDanhSachKhoa(text, cha, con) {
  const dong = text.split('\n');
  const i = dong.findIndex((d) => new RegExp(`^${cha}:\\s*(#.*)?$`).test(d));
  if (i < 0) return [];
  for (let j = i + 1; j < dong.length; j++) {
    const d = dong[j];
    if (/^\S/.test(d)) break;
    const m = new RegExp(`^(\\s+)${con}:(?:\\s+(.*))?$`).exec(d);
    if (!m) continue;
    const giaTriDong = boChuThich(m[2] ?? '').trim();
    if (giaTriDong.startsWith('[')) return tachDanhSachDong(giaTriDong).filter(Boolean);
    const ra = [];
    for (let k = j + 1; k < dong.length; k++) {
      const e = dong[k];
      if (laBoQua(e)) continue;
      if (thut(e) <= m[1].length) break;
      const li = /^\s*-\s*(.*)$/.exec(e);
      if (li) ra.push(giaTri(li[1]));
    }
    return ra.filter(Boolean);
  }
  return [];
}

// Lớp lịch sử của mỗi dòng chuyển (design doc, chỗ chọn 1b); `null` = phải sửa.
export function phanLopChuyen(cwd) {
  const { goc, ra, dsTep } = quetChuyen(cwd);
  const cfgText = doc(path.join(goc, '_acceptance', 'config.yaml')) ?? '';
  const khai = docDanhSachKhoa(cfgText, 'dieu_phoi', 'lich_su');
  const khaiGlob = khai.filter((m) => !m.includes('#'));
  const khaiEval = new Set(khai.filter((m) => m.includes('#')));
  const evalsCua = new Map();
  const refSong = new Set(docDanhSachKhoa(cfgText, 'feature_loop', 'suite_keys'));
  for (const f of dsTep.filter((x) => /^_acceptance\/[^/]+\/evals\.yaml$/.test(x))) {
    const ks = khoiEval(doc(path.join(goc, f)) ?? '');
    evalsCua.set(f, ks);
    for (const k of ks) if (k.status !== 'not-run' && k.cmd.startsWith('config:')) refSong.add(k.cmd.slice('config:'.length));
  }
  const ttHoSo = new Map();
  const trangThai = (slug) => {
    if (!ttHoSo.has(slug)) ttHoSo.set(slug, /^status:\s*(\S+)/m.exec(doc(path.join(goc, '_acceptance', slug, 'contract.md')) ?? '')?.[1] ?? null);
    return ttHoSo.get(slug);
  };
  const dkCfg = duongKhoa(cfgText);
  const lopCua = (tep, so) => {
    const hs = /^_acceptance\/([^/]+)\/(.+)$/.exec(tep);
    const khoi = hs && hs[2] === 'evals.yaml' ? (evalsCua.get(tep) ?? []).find((b) => so - 1 >= b.tu && so - 1 <= b.den) : null;
    if (khaiGlob.some((m) => khop(m, tep)) || (khoi && khaiEval.has(`${tep}#${khoi.id}`))) return 'khai-boi-kho';
    if (hs && hs[2] !== 'evals.yaml') return 'ho-so';
    if (khoi?.status === 'not-run') return 'eval-chet';
    if (khoi && EXECUTOR_NGOAI_LAN_MAY.includes(khoi.executor) && DA_THONG.includes(trangThai(hs[1]))) return 'eval-ngoai-lan-may';
    if (tep === '_acceptance/config.yaml') {
      const dk = dkCfg[so - 1];
      if (dk && dk[0] === 'executors' && dk.length >= 3 && !refSong.has(`executors.${dk[1]}.${dk[2]}`)) return 'executor-chet';
    }
    if (tep.startsWith('docs/')) return 'tai-lieu';
    if (tep === 'LO-TRINH.html') return 'lo-trinh';
    return null;
  };
  const phaiSua = [];
  const lichSu = [];
  for (const dong of ra) {
    const c = dong.lastIndexOf(':');
    const lop = lopCua(dong.slice(0, c), Number(dong.slice(c + 1)));
    if (lop) lichSu.push({ dong, lop });
    else phaiSua.push(dong);
  }
  return { phai_sua: phaiSua, lich_su: lichSu };
}
