// Việc chờ của đợt (hợp đồng DP3 AC-14) — MỘT hàm cho mục `viec-cho` của chẩn đoán và cho `danh-thuc`.
// Ba nguồn: (i) yêu cầu chưa có tệp trả lời · (ii) tệp `cho-nguoi/<dãy>.json` · (iii) sự kiện `can_phan`
// ghi SAU lúc thức của giám sát hiện tại. «Đã xử» = có trả lời · tệp chờ người đã gỡ · giám sát đã thức
// sau sự kiện. Sự kiện loại `yeu-cau` và `cho-nguoi` bỏ qua vì đã có nguồn (i), (ii) phủ.
import fs from 'node:fs';
import path from 'node:path';

const LOAI_TRUNG_NGUON = new Set(['yeu-cau', 'cho-nguoi']);

function docThuMuc(thuMuc, ten) {
  const d = path.join(thuMuc, ten);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const p = path.join(d, f);
      let du = null;
      try {
        du = JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch {
        du = null;
      }
      const luc = typeof du?.luc === 'string' && Number.isFinite(Date.parse(du.luc)) ? du.luc : fs.statSync(p).mtime.toISOString();
      return { ten: f.slice(0, -5), du, luc };
    });
}

export function viecCho(thuMuc, { thucLuc = null } = {}) {
  const ra = [];
  for (const y of docThuMucJsonChuaTraLoi(thuMuc)) ra.push({ loai: 'yeu-cau', id: y.ten, luc: y.luc, mo_ta: `${y.du?.phien ?? '?'} xin ${y.du?.loai ?? '?'}` });
  for (const c of docThuMuc(thuMuc, 'cho-nguoi')) ra.push({ loai: 'cho-nguoi', id: c.ten, luc: c.luc, mo_ta: `${c.ten} chờ người (${c.du?.loai ?? '?'})` });
  const thucMs = thucLuc ? Date.parse(thucLuc) : null;
  const p = path.join(thuMuc, 'su-kien.jsonl');
  const dong = fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean) : [];
  for (const d of dong) {
    let e;
    try {
      e = JSON.parse(d);
    } catch {
      continue;
    }
    if (e.can_phan !== true || LOAI_TRUNG_NGUON.has(e.loai) || !Number.isFinite(Date.parse(e.luc))) continue;
    if (thucMs != null && Date.parse(e.luc) <= thucMs) continue;
    ra.push({ loai: 'su-kien', id: `${e.loai}@${e.luc}`, luc: e.luc, mo_ta: `${e.loai}${e.ly_do ? `: ${e.ly_do}` : ''}` });
  }
  return ra.sort((a, b) => Date.parse(a.luc) - Date.parse(b.luc));
}

function docThuMucJsonChuaTraLoi(thuMuc) {
  return docThuMuc(thuMuc, 'yeu-cau').filter((y) => !fs.existsSync(path.join(thuMuc, 'tra-loi', `${y.ten}.json`)));
}
