// Phần dùng chung của ca đo SK1 (hồ sơ suc-khoe-cho-trong-va-toc-do): gói đang kiểm, bản sao trọn gói bị tiêm,
// văn bản thật chụp 21/10, và một `io` giả trả đúng định dạng lệnh macOS từ một bộ số kịch bản.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
export const GOI = path.resolve(DAY, '..', '..', '..', 'dieu-phoi');
export const FIXTURE = path.join(DAY, 'so-do-mbp-2110.txt');
export const GB = 1024 ** 3;

export const tam = (tien = 'sk-') => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tien)));
export const nap = (goi, ten) => import(pathToFileURL(path.join(goi, 'scripts', ten)).href);

// Bản sao TRỌN thư mục gói rồi thay đúng một đoạn mã mỗi mục; kiểm riêng rằng bước tiêm đã áp.
export function banSaoTiem(thay) {
  const goi = path.join(tam('sk-goi-'), 'dieu-phoi');
  fs.cpSync(GOI, goi, { recursive: true });
  for (const [tep, cu, moi] of thay) {
    const p = path.join(goi, 'scripts', tep);
    const truoc = fs.readFileSync(p, 'utf8');
    if (!truoc.includes(cu)) throw new Error(`tiêm không áp: ${tep} thiếu «${cu}»`);
    fs.writeFileSync(p, truoc.replace(cu, moi));
    const sau = fs.readFileSync(p, 'utf8');
    if (!sau.includes(moi) || sau === truoc) throw new Error(`tiêm không áp: ${tep} không đổi`);
  }
  return goi;
}

// Tệp fixture: khối «=== <lệnh>» rồi đầu ra nguyên văn của lệnh đó.
export function phanFixture(text = fs.readFileSync(FIXTURE, 'utf8')) {
  const khoi = {};
  let ten = null;
  for (const dong of text.split('\n')) {
    const m = dong.match(/^=== (.+)$/);
    if (m) {
      ten = m[1];
      khoi[ten] = [];
    } else if (ten) khoi[ten].push(dong);
  }
  return Object.fromEntries(Object.entries(khoi).map(([k, v]) => [k, `${v.join('\n').replace(/\n+$/, '')}\n`]));
}

export const MAY = {
  m5: { ram: 128 * GB, muc: 48, swapTongM: 11264, swapDungM: 9932.8 },
  mbp: { ram: 36 * GB, muc: 46, swapTongM: 13312, swapDungM: 12288 },
};

// `so` là object sống: ca đổi trường giữa các nhịp. git rev-parse chạy thật (worktree là kho git tạm của ca).
export function taoIo(so) {
  return {
    nowMs: () => so.now,
    chay: (cmd, args) => {
      if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return `vm.swapusage: total = ${so.swapTongM.toFixed(2)}M  used = ${so.swapDungM.toFixed(2)}M  free = 1.00M  (encrypted)\n`;
      if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return `${so.apLuc}\n`;
      if (cmd === 'sysctl' && args.includes('kern.memorystatus_level')) return so.mucText ?? `${so.muc}\n`;
      if (cmd === 'sysctl' && args.includes('hw.memsize')) return `${so.ram}\n`;
      if (cmd === 'sysctl') return '{ 3.00 2.00 1.00 }\n';
      if (cmd === 'vm_stat') return `Mach Virtual Memory Statistics: (page size of ${so.coTrang ?? 16384} bytes)\nPages free:                                    1000.\nSwapins:                                     ${so.swapins ?? 0}.\nSwapouts:                                    0.\n`;
      if (cmd === 'ps') return so.ps ?? '102400 node\n';
      if (cmd === 'gh') return '[]';
      if (cmd === 'git' && args[0] === '-C' && args[2] === 'rev-parse') return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      if (cmd === 'git') throw new Error('không có git ở kho thử');
      return '';
    },
  };
}

export const khoGit = () => {
  const w = tam('sk-w-');
  const g = (...a) => execFileSync('git', ['-C', w, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  g('init', '-q');
  g('-c', 'user.name=thu', '-c', 'user.email=thu@vd', 'commit', '-q', '--allow-empty', '-m', 'A');
  return { w, commit: (m) => g('-c', 'user.name=thu', '-c', 'user.email=thu@vd', 'commit', '-q', '--allow-empty', '-m', m), dinh: () => g('rev-parse', 'HEAD') };
};

// Thư mục đợt tạm dựng bằng mẫu cấu hình của CHÍNH gói đang kiểm; hai dãy là hai kho git tạm có liên kết đợt,
// để lệnh nhả thật (tìm đợt từ cwd) chạy được.
export function dungDot(goi, { sucKhoe = null, gocKho = '/kho-thu', tuGoi = false } = {}) {
  const dot = tam('sk-dot-');
  const mau = JSON.parse(fs.readFileSync(path.join(goi, 'scripts', 'mau', 'dieu-phoi.config.json'), 'utf8'));
  const cfg = { ...mau, goc_kho: gocKho, ...(sucKhoe ? { suc_khoe: { ...mau.suc_khoe, ...sucKhoe } } : {}) };
  fs.writeFileSync(path.join(dot, 'dieu-phoi.config.json'), JSON.stringify(cfg));
  const k1 = khoGit();
  const k2 = khoGit();
  for (const k of [k1, k2]) {
    fs.mkdirSync(path.join(k.w, '.acceptance-runs'));
    fs.symlinkSync(dot, path.join(k.w, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  }
  const hangViec = {
    dot: 'thu',
    day: [{ id: 'P1', worktree: k1.w }, { id: 'P2', worktree: k2.w }],
    hang: [
      { ma: 'A', slug: 'a', day: 'P1', moc: '2026-10-12', uu_tien: 1, ranh_gioi: ['apps/a/**'] },
      { ma: 'B', slug: 'b', day: 'P2', moc: '2026-10-14', uu_tien: 1, ranh_gioi: ['apps/b/**'] },
    ],
  };
  fs.writeFileSync(path.join(dot, 'hang-viec.json'), JSON.stringify(hangViec));
  for (const d of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(dot, d));
  if (tuGoi) fs.writeFileSync(path.join(dot, 'dieu-khien.json'), JSON.stringify({ pha: 'dang-chay', nguon_goi: tam('sk-goi-dot-'), lich_su: [] }));
  const mayDir = tam('sk-may-');
  process.env.DIEU_PHOI_MAY_DIR = mayDir;
  return { dot, k1, k2, mayDir, cfg };
}

export const xin = (dot, phien, loai, worktree, slug) =>
  fs.writeFileSync(path.join(dot, 'xin', `${phien}-${loai}.json`), JSON.stringify({ phien, slug, loai, luc: '2026-10-21T00:00:00Z', worktree }));
export const suKien = (dot) => {
  const p = path.join(dot, 'su-kien.jsonl');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim().split('\n').filter(Boolean).map((d) => JSON.parse(d)) : [];
};
export const docJ = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null);
export const chuKhoa = (dot, tn) => docJ(path.join(dot, 'khoa', tn, 'chu.json'));
export const trangThai = (dot) => docJ(path.join(dot, 'trang-thai.json'));
// Sổ đo: đợt mở từ gói ghi ở thư mục máy, đợt dựng tay ghi trong thư mục đợt (cùng luật với khoá s4 cấp máy).
export const soTai = (thuMuc) => {
  const p = path.join(thuMuc, 'do-lan.jsonl');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim().split('\n').filter(Boolean).map((d) => JSON.parse(d)) : [];
};

// Ma trận viết sẵn: mỗi hàng in «hàng · kỳ vọng · thực tế», trả tên các hàng không đạt.
export function inMaTran(ten, hang) {
  for (const h of hang) console.log(`  ${ten} · ${h.hang} · kỳ vọng ${h.ky_vong} · thực tế ${h.thuc_te}${h.dat ? '' : ' ✗'}`);
  return hang.filter((h) => !h.dat).map((h) => h.hang);
}
export const hangMoi = (hang, ky_vong, thuc_te) => ({ hang, ky_vong: String(ky_vong), thuc_te: String(thuc_te), dat: String(ky_vong) === String(thuc_te) });
