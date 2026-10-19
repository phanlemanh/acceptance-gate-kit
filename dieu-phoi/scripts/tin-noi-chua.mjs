// Nơi chứa tin trong đợt (hồ sơ vong-mo-co-chu-giu, thiết kế §3.2): `<thư mục đợt>/tin.jsonl`, chỉ thêm dòng. Mỗi dòng
// là MỘT lần appendFileSync một chuỗi kết bằng \n, nên hai phiên ghi cùng lúc không đan dòng vào nhau. Yêu cầu cũ
// `yeu-cau/<id>.json` được đọc như HỎI có mã từ thợ tới G — chỉ đọc, không đổi một byte.
import fs from 'node:fs';
import path from 'node:path';
import { docJson, phienCuaCwd, trongWorktree } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { docVai } from './vai.mjs';

export const TEP_TIN = 'tin.jsonl';

// Dấu máy của kênh liên máy (hồ sơ vong-mo-khong-mat-dau, GT2): «đã đến», «chấp nhận», «kết lượt khi chưa nhận» ghi
// CHỈ-THÊM vào `<tệp kênh>.may.jsonl` cạnh tệp trạng thái — một lần appendFileSync một dòng, như hộp tin của đợt — nên lần
// đồng bộ ghi lại tệp trạng thái không bao giờ chạm chúng. Đuôi `.jsonl` để bộ quét kênh (`kenh-*.json`) không nhận nhầm.
// Đọc = dấu đời trước trong `may_su` của tệp trạng thái (đường đọc-cũ, không bắt chuyển) cộng các dòng của tệp chỉ-thêm.
export const tepMayKenh = (pTrangThai) => pTrangThai.replace(/\.json$/u, '.may.jsonl');

export function docMayKenh(pTrangThai) {
  const cu = docJson(pTrangThai, null)?.may_su;
  const ra = Array.isArray(cu) ? [...cu] : [];
  const p = tepMayKenh(pTrangThai);
  if (!fs.existsSync(p)) return ra;
  for (const l of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!l.trim()) continue;
    try {
      const o = JSON.parse(l);
      if (o && typeof o === 'object' && typeof o.may === 'string') ra.push(o);
    } catch {
      // Dòng ghi dở (máy tắt giữa chừng) — bỏ dòng ấy, giữ phần còn lại.
    }
  }
  return ra;
}

export function themMayKenh(pTrangThai, o) {
  fs.mkdirSync(path.dirname(pTrangThai), { recursive: true });
  fs.appendFileSync(tepMayKenh(pTrangThai), `${JSON.stringify(o)}\n`);
}

export function noiChuaDot(thuMuc) {
  const p = path.join(thuMuc, TEP_TIN);
  return {
    loai: 'dot',
    thuMuc,
    doc() {
      const dong = [];
      let hong = 0;
      if (fs.existsSync(p)) {
        for (const l of fs.readFileSync(p, 'utf8').split('\n')) {
          if (!l.trim()) continue;
          try {
            const o = JSON.parse(l);
            if (o && typeof o === 'object' && typeof o.luc === 'string') dong.push(o);
            else hong++;
          } catch {
            hong++;
          }
        }
      }
      const dYc = path.join(thuMuc, 'yeu-cau');
      if (fs.existsSync(dYc)) {
        for (const f of fs.readdirSync(dYc).sort()) {
          const m = /^([\w]+)-(\d+)\.json$/u.exec(f);
          if (!m) continue;
          let yc;
          try {
            yc = docJson(path.join(dYc, f), null);
          } catch {
            continue;
          }
          dong.push({ yeu_cau: `${m[1]}-${m[2]}`, phien: yc?.phien ?? m[1], luc: yc?.luc ?? new Date(0).toISOString(), da_tra_loi: fs.existsSync(path.join(thuMuc, 'tra-loi', f)) });
        }
      }
      return { dong, hong };
    },
    them(o) {
      fs.appendFileSync(p, `${JSON.stringify(o)}\n`);
    },
  };
}

// Ai là mình trong đợt: mã dãy của cwd · 'G' khi cwd là worktree giám sát (vai.json) · null khi ngoài cả hai.
export function minhTrongDot(thuMuc, cwd) {
  let hangViec = null;
  try {
    hangViec = docHangViec(thuMuc);
  } catch {
    hangViec = null;
  }
  const day = hangViec ? phienCuaCwd(hangViec, cwd) : null;
  if (day) return { minh: day, hangViec };
  const gs = docVai(thuMuc)?.giam_sat?.worktree;
  if (gs && trongWorktree(fs.realpathSync(gs), cwd)) return { minh: 'G', hangViec };
  return { minh: null, hangViec };
}
