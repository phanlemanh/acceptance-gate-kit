// MỘT hàm dựng mục dãy (design DP4 chỗ chọn 9) — cho `ban-giao.json` và lời ghi danh của `tiep-tuc`. Mọi trường suy
// từ git của worktree dãy và thư mục đợt; không trường nào cho model điền (luật kit «thước gắn vào vật»).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { docJson } from './dot.mjs';
import { hangKeTuTiep } from './lich.mjs';

const git = (cwd, ...a) => {
  const r = spawnSync('git', a, { cwd, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
};

export function trangThaiHoSo(worktree, slug) {
  try {
    return /^status:\s*(\S+)/m.exec(fs.readFileSync(path.join(worktree, '_acceptance', slug, 'contract.md'), 'utf8'))?.[1] ?? null;
  } catch {
    return null;
  }
}

// Hàng kế của dãy — đọc `tiep/<dãy>.json` bằng `hangKeTuTiep` (lich.mjs, MỘT bên đọc cạnh bên viết; hồ sơ
// dieu-phoi-sua-truoc-dot-thu, D1): dãy nghỉ, hết hàng hay đang chờ → null, không rơi về hàng ưu tiên đầu.
export function slugCuaDay(thuMuc, hangViec, id) {
  return hangKeTuTiep(docJson(path.join(thuMuc, 'tiep', `${id}.json`), null), hangViec, id).hang;
}

// `khoaS4` = dãy đang giữ khoá s4 (null nếu không ai); `maBanGiao` = mã bàn giao hiện tại (bản ghi xong của mã khác bỏ qua).
export function mucDay(thuMuc, d, { hangViec, khoaS4 = null, maBanGiao = null }) {
  const slug = slugCuaDay(thuMuc, hangViec, d.id);
  const hang = (hangViec.hang ?? []).find((h) => h.slug === slug)?.ma ?? null;
  const conWt = fs.existsSync(d.worktree);
  const dinh = conWt ? git(d.worktree, 'rev-parse', 'HEAD') : null;
  const xong = docJson(path.join(thuMuc, 'ban-giao', 'xong', `${d.id}.json`), null);
  const xongMa = xong && (!maBanGiao || xong.ma === maBanGiao) ? xong : null;
  const ttHoSo = conWt && slug ? trangThaiHoSo(d.worktree, slug) : null;
  const giuS4 = khoaS4 === d.id;
  const choNguoi = docJson(path.join(thuMuc, 'cho-nguoi', `${d.id}.json`), null);
  return {
    id: d.id,
    hang,
    slug,
    trang_thai_ho_so: ttHoSo,
    nhanh: conWt ? git(d.worktree, 'rev-parse', '--abbrev-ref', 'HEAD') : null,
    dinh,
    da_day: conWt && dinh != null ? git(d.worktree, 'rev-parse', '@{u}') === dinh : false,
    co_wip: conWt ? (git(d.worktree, 'log', '-1', '--format=%s') ?? '').startsWith('wip(ban-giao)') : false,
    cay_ban: conWt ? (git(d.worktree, 'status', '--porcelain') ?? '') !== '' : false,
    ban_giao: !conWt ? 'worktree-mat' : d.nghi === true ? 'nghi' : giuS4 ? 'dang-xong' : xongMa ? 'xong' : 'do',
    cham_lai_cung_round: giuS4 && ttHoSo === 'implemented',
    viec_cho_nguoi: choNguoi?.tin ?? null,
    phien_cu: xongMa?.phien_cu ?? [],
  };
}
