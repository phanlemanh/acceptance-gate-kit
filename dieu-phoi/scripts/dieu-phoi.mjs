#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu, ghiSuKien, gocKhoChinh, TEN_LIEN_KET } from './dot.mjs';
import { chanDoan } from './chan-doan.mjs';
import { docGoi, ghepLuat, timGoi } from './goi-dot.mjs';
import { choNghi, dayLen, ghiNhatKy, themHang } from './hang.mjs';
import { theDong, theKhoiTao } from './the.mjs';
import { nhaMay } from './may.mjs';
import { demDot } from './dem.mjs';
import { datPha, docPha, khoiTaoPha, TEP_DIEU_KHIEN } from './pha.mjs';
import { moHinh, veXem } from './mo-hinh.mjs';
import { docNhomKeHoach } from './nguon-hang.mjs';
import { ghiVai } from './vai.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const lienKet = (goc) => path.join(goc, '.acceptance-runs', TEN_LIEN_KET);

// Mở đợt (spec workflow §4.1). Hai đường:
// · có gói đợt (cờ `--goi` hoặc khoá `dieu_phoi.goi_dot`) → đọc và kiểm TRỌN gói trước khi tạo gì, dựng
//   thư mục từ gói, `vai.json`, `pha: nhap` (chờ thẻ khởi tạo);
// · không gói → đợt dựng tay như bản cũ (khuôn trống, `pha: dang-chay`, `nguon_goi: null`); chẩn đoán
//   báo mục `goi-dot` thiếu và lệnh người dừng ở đó (design DP2 §3 chỗ chọn 1).
// Chạy lại khi đợt CÙNG tên đang mở → không làm gì (`daMo`). Trả đường thư mục đợt như bản cũ.
export function moDotKq(cwd, ten, { goi = null, phien = null } = {}) {
  if (!/^[\w-]+$/.test(ten ?? '')) throw new Error('tên đợt chỉ gồm chữ, số, - và _');
  const goc = gocKhoChinh(cwd);
  const lk = lienKet(goc);
  const thuMuc = path.join(goc, '.acceptance-runs', `dieu-phoi-${ten}`);
  if (fs.existsSync(lk)) {
    const dangMo = fs.realpathSync(lk);
    if (fs.existsSync(thuMuc) && dangMo === fs.realpathSync(thuMuc)) return { thuMuc: dangMo, daMo: true };
    const dangChay = path.basename(dangMo).replace(/^dieu-phoi-/, '');
    throw new Error(`đợt ${dangChay} đang chạy — đóng nó trước`);
  }
  const dirGoi = timGoi(goc, ten, goi);
  const tuGoi = dirGoi ? docGoi(dirGoi, { gocKho: goc }) : null;
  if (tuGoi && fs.existsSync(thuMuc)) throw new Error(`đợt ${ten} còn thư mục cũ: ${thuMuc} — đổi tên đợt hoặc dọn thư mục đó`);
  for (const d of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(thuMuc, d), { recursive: true });
  if (tuGoi) {
    ghiJsonNguyenTu(path.join(thuMuc, 'dieu-phoi.config.json'), { ...tuGoi.cfg, goc_kho: goc });
    ghiJsonNguyenTu(path.join(thuMuc, 'hang-viec.json'), { ...tuGoi.hangViec, dot: ten });
    fs.writeFileSync(path.join(thuMuc, 'LUAT.md'), ghepLuat(fs.readFileSync(path.join(DAY, 'mau', 'LUAT.md'), 'utf8'), tuGoi.luatRieng));
    ghiVai(thuMuc, { phien, worktree: cwd, day: tuGoi.hangViec.day });
    khoiTaoPha(thuMuc, { pha: 'nhap', nguonGoi: dirGoi });
  } else {
    for (const f of ['LUAT.md', 'hang-viec.json', 'dieu-phoi.config.json']) {
      const dich = path.join(thuMuc, f);
      if (!fs.existsSync(dich)) fs.copyFileSync(path.join(DAY, 'mau', f), dich);
    }
    const cfg = docJson(path.join(thuMuc, 'dieu-phoi.config.json'));
    ghiJsonNguyenTu(path.join(thuMuc, 'dieu-phoi.config.json'), { ...cfg, goc_kho: goc });
    const hv = docJson(path.join(thuMuc, 'hang-viec.json'));
    if (!hv.dot) ghiJsonNguyenTu(path.join(thuMuc, 'hang-viec.json'), { ...hv, dot: ten });
    if (!fs.existsSync(path.join(thuMuc, TEP_DIEU_KHIEN))) khoiTaoPha(thuMuc, { pha: 'dang-chay', nguonGoi: null, lyDo: 'đợt dựng tay (không gói)' });
  }
  fs.symlinkSync(thuMuc, lk);
  ghiSuKien(thuMuc, { loai: 'mo-dot', ten, goi: dirGoi });
  return { thuMuc: fs.realpathSync(thuMuc), daMo: false, canhBao: tuGoi?.canhBao ?? [] };
}

export const moDot = (cwd, ten, tuyChon = {}) => moDotKq(cwd, ten, tuyChon).thuMuc;

function thuMucHienTai(cwd) {
  const lk = lienKet(gocKhoChinh(cwd));
  if (!fs.existsSync(lk)) throw new Error('không có đợt nào đang chạy');
  return fs.realpathSync(lk);
}

function pidSong(thuMuc) {
  const p = path.join(thuMuc, 'phat-lich.pid');
  const pid = Number(fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : 0);
  if (!pid) return 0;
  try {
    process.kill(pid, 0);
    return pid;
  } catch {
    return 0;
  }
}

// Bản lõi theo đợt: `chay` chép mọi *.mjs và khuôn của gói vào `<thư mục đợt>/loi/` (kèm phiên bản)
// rồi chạy bộ phát lịch TỪ BẢN CHÉP — nâng hay gỡ gói giữa đợt không rút mất mã đang chạy, và lần
// `chay` kế (sau khi bộ phát lịch chết) lại chép từ bản gói đang cài.
export const TEP_PHIEN_BAN = 'PHIEN-BAN.json';

export function chepLoi(thuMuc) {
  const dich = path.join(thuMuc, 'loi');
  if (fs.existsSync(dich) && fs.realpathSync(dich) === fs.realpathSync(DAY)) return dich;
  const tamThoi = `${dich}.${process.pid}.tmp`;
  fs.rmSync(tamThoi, { recursive: true, force: true });
  fs.mkdirSync(tamThoi, { recursive: true });
  for (const f of fs.readdirSync(DAY).filter((x) => x.endsWith('.mjs'))) fs.copyFileSync(path.join(DAY, f), path.join(tamThoi, f));
  fs.cpSync(path.join(DAY, 'mau'), path.join(tamThoi, 'mau'), { recursive: true });
  const goi = docJson(path.join(DAY, '..', '.claude-plugin', 'plugin.json'), {});
  ghiJsonNguyenTu(path.join(tamThoi, TEP_PHIEN_BAN), { phien_ban: goi.version ?? null, tu: DAY, luc: new Date().toISOString() });
  fs.rmSync(dich, { recursive: true, force: true });
  fs.renameSync(tamThoi, dich);
  return dich;
}

export function chayPhatLich(cwd) {
  const thuMuc = thuMucHienTai(cwd);
  const pid = pidSong(thuMuc);
  if (pid) return `bộ phát lịch đang chạy (pid ${pid})`;
  const loi = chepLoi(thuMuc);
  const log = fs.openSync(path.join(thuMuc, 'phat-lich.log'), 'a');
  const con = spawn(process.execPath, [path.join(loi, 'phat-lich.mjs'), thuMuc], { detached: true, stdio: ['ignore', log, log] });
  con.unref();
  ghiSuKien(thuMuc, { loai: 'chay', pid: con.pid, loi });
  return `đã chạy bộ phát lịch (pid ${con.pid})`;
}

export function dungPhatLich(cwd) {
  const thuMuc = thuMucHienTai(cwd);
  const pid = pidSong(thuMuc);
  if (pid) process.kill(pid, 'SIGTERM');
  ghiSuKien(thuMuc, { loai: 'dung', pid });
  return pid ? `đã dừng pid ${pid}` : 'bộ phát lịch không chạy';
}

export function dongDot(cwd) {
  const thuMuc = thuMucHienTai(cwd);
  dungPhatLich(cwd);
  // Khoá s4 cấp máy của đợt này (nếu đang giữ) nhả cùng lúc đóng — bộ phát lịch đã dừng thì không còn
  // nhịp nào nhả nó, và kho khác trên máy sẽ chờ mãi.
  if (nhaMay(thuMuc)) ghiSuKien(thuMuc, { loai: 'nha-may', ly_do: 'đóng đợt' });
  fs.rmSync(lienKet(gocKhoChinh(cwd)));
  ghiSuKien(thuMuc, { loai: 'dong-dot' });
}

// Bản lõi chép tay trong kho (đường dưới) còn gắn hook qua settings của kho trong lúc chuyển sang gói:
// hai bản cùng đọc một thư mục đợt nên ra cùng quyết định, nhưng mỗi lời gọi công cụ chạy hook hai
// lần. `xem` nói ra điều đó để phiên giám sát biết còn việc gỡ.
const DUONG_BAN_CU = 'scripts/dieu-phoi/';

export function canhBaoHaiBan(gocKho) {
  const rel = path.join('.claude', 'settings.json');
  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(path.join(gocKho, rel), 'utf8'));
  } catch {
    return null;
  }
  const suKien = Object.entries(cfg?.hooks ?? {})
    .filter(([, khoi]) => Array.isArray(khoi) && khoi.some((k) => (k?.hooks ?? []).some((h) => String(h?.command ?? '').includes(DUONG_BAN_CU))))
    .map(([su]) => su);
  if (suKien.length === 0) return null;
  return `cảnh báo: ${rel} còn hook gọi ${DUONG_BAN_CU} (${suKien.join(', ')}) — gỡ các khối đó, gói dieu-phoi đã gắn hook`;
}

// `xem` vẽ từ CÙNG mô hình với bảng đợt (mo-hinh.mjs), kèm nhóm kế hoạch của hàng mang mã lộ trình.
function xem(cwd) {
  const goc = gocKhoChinh(cwd);
  const canhBao = canhBaoHaiBan(goc);
  const thuMuc = thuMucHienTai(cwd);
  const tt = docJson(path.join(thuMuc, 'trang-thai.json'), null);
  let dong;
  if (!tt) dong = `chưa có nhịp nào · pha ${docPha(thuMuc).pha}`;
  else dong = veXem(moHinh(tt, { nhom: docNhomKeHoach(goc), hangViec: docJson(path.join(thuMuc, 'hang-viec.json'), null) }));
  return canhBao ? `${dong}\n${canhBao}` : dong;
}

// Danh mục chuyển: mọi chỗ trong kho còn trỏ bản lõi chép tay (`scripts/dieu-phoi/`) — tệp git theo
// dõi (settings, package.json, eval của hồ sơ…), settings cục bộ, hook git, LaunchAgent của người
// dùng nhắc tới kho này, và các tệp chữ ở gốc thư mục đợt đang chạy (LUAT.md). Bỏ qua chính thư mục
// bản cũ. Trả `<tệp>:<dòng>`; không cần đợt.
export function kiemChuyen(cwd) {
  const goc = gocKhoChinh(cwd);
  const ra = [];
  const quet = (abs, nhan) => {
    let t;
    try {
      t = fs.readFileSync(abs, 'utf8');
    } catch {
      return;
    }
    if (t.includes('\0')) return;
    t.split('\n').forEach((d, i) => {
      if (d.includes(DUONG_BAN_CU)) ra.push(`${nhan}:${i + 1}`);
    });
  };
  const git = (...a) => execFileSync('git', a, { cwd: goc, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const theoDoi = new Set(git('ls-files', '-z').split('\0').filter(Boolean));
  for (const f of ['.claude/settings.json', '.claude/settings.local.json']) theoDoi.add(f);
  for (const f of [...theoDoi].sort()) if (!f.startsWith(DUONG_BAN_CU)) quet(path.join(goc, f), f);
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
      let t = '';
      try {
        t = fs.readFileSync(p, 'utf8');
      } catch {
        continue;
      }
      if (t.includes(goc)) quet(p, `~/Library/LaunchAgents/${f}`);
    }
  }
  const dot = path.join(goc, '.acceptance-runs', TEN_LIEN_KET);
  if (fs.existsSync(dot)) {
    for (const f of fs.readdirSync(dot).sort()) {
      const p = path.join(dot, f);
      if (fs.statSync(p).isFile() && /\.(md|json|txt)$/.test(f)) quet(p, `<thư mục đợt>/${f}`);
    }
  }
  return ra;
}

// Tách đối số: vị trí và cờ `--ten giá-trị` (cờ không giá trị → true).
export function tachDoiSo(argv) {
  const vi = [];
  const co = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) co[k] = argv[++i];
      else co[k] = true;
    } else vi.push(a);
  }
  return { vi, co };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const { vi, co } = tachDoiSo(process.argv.slice(2));
  const [lenh, doiSo] = vi;
  const cwd = process.cwd();
  if (lenh === 'xem' && co['kiem-chuyen']) {
    try {
      const ds = kiemChuyen(cwd);
      process.stdout.write(ds.length ? `${ds.map((d) => `kiem-chuyen: ${d}`).join('\n')}\n` : 'kiem-chuyen: sach\n');
      process.exit(ds.length ? 1 : 0);
    } catch (e) {
      process.stderr.write(`dieu-phoi: ${e.message}\n`);
      process.exit(2);
    }
  }
  try {
    const viec = {
      mo: () => {
        const kq = moDotKq(cwd, doiSo, { goi: typeof co.goi === 'string' ? co.goi : null, phien: typeof co.phien === 'string' ? co.phien : null });
        for (const c of kq.canhBao ?? []) process.stderr.write(`${c}\n`);
        return kq.daMo ? `đợt ${doiSo} đã mở` : kq.thuMuc;
      },
      pha: () => {
        const thuMuc = thuMucHienTai(cwd);
        const lyDo = typeof co['ly-do'] === 'string' ? co['ly-do'] : '';
        const kq = datPha(thuMuc, doiSo, { boi: typeof co.boi === 'string' ? co.boi : 'cli', lyDo });
        if (!kq.doi) return `pha: đã ở ${kq.pha}`;
        ghiNhatKy(thuMuc, `pha ${kq.tu} → ${kq.pha}${lyDo ? ` — ${lyDo}` : ''}`);
        ghiSuKien(thuMuc, { loai: 'pha', tu: kq.tu, sang: kq.pha, ly_do: lyDo });
        return `pha: ${kq.tu} → ${kq.pha}`;
      },
      hang: () => {
        const thuMuc = thuMucHienTai(cwd);
        const [, , doiTuong] = vi;
        const kq = {
          'day-len': () => dayLen(thuMuc, doiTuong, co.truoc),
          them: () => themHang(thuMuc, doiTuong, co.day),
          nghi: () => choNghi(thuMuc, doiTuong),
        }[doiSo];
        if (!kq) throw new Error('dùng: hang <day-len <mã> --truoc <mã>|them <mã|việc> --day <P>|nghi <P>>');
        return kq().doi ? `hang ${doiSo}: đã đổi` : `hang ${doiSo}: không đổi gì`;
      },
      'chan-doan': () => {
        const ds = chanDoan(cwd);
        return co.json ? JSON.stringify(ds) : ds.map((m) => `${m.trang_thai === 'du' ? '✓' : m.trang_thai === 'thieu' ? '✗' : '·'} ${m.muc}${m.viec ? ` — ${m.viec}` : ''}`).join('\n');
      },
      the: () => {
        const ham = { 'khoi-tao': theKhoiTao, dong: theDong }[doiSo];
        if (!ham) throw new Error('dùng: the <khoi-tao|dong> [--json]');
        return JSON.stringify(ham(cwd), null, co.json ? 0 : 2);
      },
      dem: () => JSON.stringify(demDot(thuMucHienTai(cwd)), null, co.json ? 0 : 2),
      chay: () => chayPhatLich(cwd),
      dung: () => dungPhatLich(cwd),
      dong: () => dongDot(cwd) ?? 'đã đóng đợt: bộ phát lịch dừng, hook im',
      xem: () => xem(cwd),
    }[lenh];
    if (!viec) throw new Error('dùng: dieu-phoi.mjs <mo <tên> [--goi <dir>] [--phien <id>]|pha <trạng thái> [--ly-do <s>]|chan-doan [--json]|hang <day-len|them|nghi> …|the <khoi-tao|dong> [--json]|dem [--json]|chay|dung|dong|xem [--kiem-chuyen]>');
    process.stdout.write(`${viec()}\n`);
  } catch (e) {
    process.stderr.write(`dieu-phoi: ${e.message}\n`);
    process.exit(1);
  }
}
