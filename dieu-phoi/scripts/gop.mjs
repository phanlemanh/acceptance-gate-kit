// Gộp dưới khoá merge (hồ sơ ky-den-gop, hạng I; spec hai tầng §4.4 bốn điều kiện chuyển từ lời sang mã).
// Quyết định chủ kho 23/10/2026, nguyên văn: «Chấp nhận rủi ro mục I: PR không trùng tệp với PR vừa gộp thì gộp ngay,
// không chạy lại CI; lỗi lọt qua thì CI trên nhánh chính bắt.»
//
// Bốn lối:
// · `moi-nhat`    — nhánh đã chứa đỉnh nhánh chính và CI xanh trên đúng đầu nhánh → gộp (luật cũ, không rủi ro mới);
// · `khong-trung` — nhánh chính đã tiến, nhưng tệp PR tự thêm (so với merge-base) không giao tệp của các commit vào
//                   nhánh chính kể từ merge-base → gộp ngay, không gộp nhánh chính vào nhánh, không chờ CI mới. Chỉ khi
//                   kho bật `gop_khong_chay_lai_ci` trong cấu hình đợt. Lưới: CI chạy trên nhánh chính sau gộp;
// · `cu`          — trùng tệp, hoặc khoá tắt, hoặc xung đột → như cũ: gộp nhánh chính vào nhánh, chờ CI, xét lại;
// · `cho-ci`      — CI trên đầu nhánh chưa xanh hay chưa xong.
// merge-base là base CI ĐÃ thấy hoặc cũ hơn (CI của PR chạy trên đầu nhánh hay trên bản gộp thử lúc đẩy, đều chứa
// merge-base), nên tập «tệp vào nhánh chính từ base» chỉ có thể rộng hơn cái CI chưa thấy — phép so dư về phía an toàn.
// Lệnh gộp luôn `--merge --match-head-commit <sha>`, KHÔNG `--auto`: đầu nhánh đổi sau lúc xét thì gh từ chối.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { docJson, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { DA_THONG, trangThaiHopDong } from './phat-lich.mjs';

export const GOP_DUOC = ['moi-nhat', 'khong-trung'];
const KET_LUAN_XANH = new Set(['SUCCESS', 'NEUTRAL', 'SKIPPED']);
const CI_DO = new Set(['failure', 'timed_out', 'cancelled', 'startup_failure', 'action_required']);
const dong = (s) => String(s ?? '').split('\n').map((x) => x.trim()).filter(Boolean);

// `statusCheckRollup` của gh: CheckRun {name, status, conclusion} và StatusContext {context, state}.
export function ciXanh(rollup) {
  if (!Array.isArray(rollup) || rollup.length === 0) return { xanh: false, ly_do: 'PR chưa có check nào trên đầu nhánh' };
  const chua = [];
  for (const c of rollup) {
    const ten = c.name ?? c.context ?? '?';
    if (c.state !== undefined) {
      if (c.state !== 'SUCCESS') chua.push(`${ten}: ${c.state}`);
    } else if (c.status !== 'COMPLETED') chua.push(`${ten}: ${c.status}`);
    else if (!KET_LUAN_XANH.has(c.conclusion)) chua.push(`${ten}: ${c.conclusion}`);
  }
  return chua.length ? { xanh: false, ly_do: `check chưa xanh — ${chua.join(', ')}` } : { xanh: true };
}

export function xetGop({ io, cfg, pr, slug }) {
  const git = (args) => io.chay('git', args);
  const v = JSON.parse(io.chay('gh', ['pr', 'view', String(pr), '--json', 'number,state,isDraft,mergeable,headRefOid,headRefName,baseRefName,statusCheckRollup']));
  if (v.state !== 'OPEN') return { duong: 'chan', ly_do: `PR #${pr} không mở (${v.state})` };
  if (v.isDraft) return { duong: 'chan', ly_do: `PR #${pr} còn nháp` };
  const sha = v.headRefOid;
  if (v.mergeable === 'CONFLICTING') return { duong: 'cu', sha, ly_do: 'PR xung đột với nhánh chính — gộp nhánh chính vào nhánh, gỡ xung đột' };
  const ci = ciXanh(v.statusCheckRollup);
  if (!ci.xanh) return { duong: 'cho-ci', sha, ly_do: ci.ly_do };
  git(['fetch', '-q', 'origin', v.baseRefName, v.headRefName]);
  let st = null;
  try {
    st = trangThaiHopDong(git(['show', `${sha}:_acceptance/${slug}/contract.md`]));
  } catch {
    st = null;
  }
  if (!DA_THONG.includes(st)) return { duong: 'chan', sha, ly_do: `hồ sơ ${slug} trên đầu PR ở «${st ?? 'không có'}» — chưa ký, chưa thông` };
  const dinh = git(['rev-parse', `origin/${v.baseRefName}`]).trim();
  const mb = git(['merge-base', sha, dinh]).trim();
  if (mb === dinh) return { duong: 'moi-nhat', sha, ly_do: 'nhánh đã chứa đỉnh nhánh chính; CI xanh trên đúng đầu nhánh' };
  const tien = Number(git(['rev-list', '--count', `${mb}..${dinh}`]).trim());
  if (cfg.gop_khong_chay_lai_ci !== true) return { duong: 'cu', sha, ly_do: `nhánh chính đã tiến ${tien} commit từ base của CI; khoá gop_khong_chay_lai_ci tắt — gộp nhánh chính vào nhánh, chờ CI` };
  const tepPr = dong(git(['diff', '--name-only', '--no-renames', mb, sha]));
  const tepChinh = new Set(dong(git(['diff', '--name-only', '--no-renames', mb, dinh])));
  const trung = tepPr.filter((t) => tepChinh.has(t));
  if (trung.length) return { duong: 'cu', sha, trung, ly_do: `trùng ${trung.length} tệp với ${tien} commit vào nhánh chính từ base của CI (${trung.slice(0, 5).join(', ')}) — gộp nhánh chính vào nhánh, chờ CI` };
  // Lưới của lối nhanh là CI nhánh chính — đọc nó, không dặn bằng lời (gap-probe P1): đỉnh đã đỏ thì không gộp nhanh
  // chồng lên, lỗi sẽ khó quy về một PR. Không đọc được → lối cũ.
  let ciChinh;
  try {
    ciChinh = JSON.parse(io.chay('gh', ['run', 'list', '--branch', v.baseRefName, '--commit', dinh, '--json', 'name,status,conclusion', '--limit', '50']));
  } catch {
    return { duong: 'cu', sha, ly_do: `không đọc được CI nhánh chính ở đỉnh ${dinh.slice(0, 7)} — gộp nhánh chính vào nhánh, chờ CI` };
  }
  const doChinh = ciChinh.filter((r) => r.status === 'completed' && CI_DO.has(r.conclusion)).map((r) => r.name);
  if (doChinh.length) return { duong: 'cu', sha, ly_do: `CI nhánh chính đỏ ở đỉnh ${dinh.slice(0, 7)} (${doChinh.join(', ')}) — không gộp nhanh chồng lên nhánh đỏ; gộp nhánh chính vào nhánh, chờ CI` };
  return { duong: 'khong-trung', sha, tep_pr: tepPr.length, tep_chinh: tepChinh.size, ly_do: `không tệp nào trùng (${tepPr.length} tệp của PR · ${tepChinh.size} tệp vào nhánh chính qua ${tien} commit) — gộp ngay, không chạy lại CI; lưới: CI trên nhánh chính sau gộp` };
}

const IO_THAT = (cwd) => ({ chay: (cmd, args) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000 }) });

// Lệnh `gop <số PR>`: thợ giữ khoá merge, đợt cho tự gộp. `--xet` chỉ in quyết định (giám sát, người) — không gộp,
// không đòi khoá. Mỗi lần chạy ghi một sự kiện `gop` (lệnh đếm đọc).
export function gop(cwd, pr, { slug = null, xet = false, io = IO_THAT(cwd) } = {}) {
  if (!/^\d+$/.test(String(pr ?? ''))) throw new Error('gop: dùng `gop <số PR> [--slug <slug>] [--xet]`');
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('gop: không có đợt nào đang chạy');
  const cfg = docCauHinh(thuMuc);
  const day = phienCuaCwd(docHangViec(thuMuc), cwd);
  const chu = docJson(path.join(thuMuc, 'khoa', 'merge', 'chu.json'), null);
  if (!xet) {
    if (!day) throw new Error('gop: cwd không thuộc dãy nào của đợt — chạy từ worktree của dãy, hoặc dùng --xet');
    if (chu?.phien !== day) throw new Error(`gop: khoá merge không do ${day} giữ (${chu?.phien ?? 'trống'}) — xin lượt merge trước`);
    if (docPha(thuMuc).tu_merge !== true) throw new Error('gop: đợt không cho tự gộp (tu_merge) — bấm gộp là của người; dùng --xet để xem quyết định');
  }
  const s = slug ?? (chu?.phien === day ? chu?.slug : null);
  if (!s) throw new Error('gop: không suy được slug hồ sơ — ghi --slug <slug>');
  const kq = xetGop({ io, cfg, pr, slug: s });
  const gopNgay = !xet && GOP_DUOC.includes(kq.duong);
  if (gopNgay) io.chay('gh', ['pr', 'merge', String(pr), '--merge', '--match-head-commit', kq.sha]);
  ghiSuKien(thuMuc, { loai: 'gop', pr: Number(pr), hang: s, phien: day, duong: kq.duong, sha: kq.sha ?? null, da_gop: gopNgay, ly_do: kq.ly_do, ...(kq.trung ? { trung: kq.trung.slice(0, 20) } : {}) });
  return { ...kq, da_gop: gopNgay };
}

export const maThoatGop = (kq) => (GOP_DUOC.includes(kq.duong) ? 0 : kq.duong === 'chan' ? 1 : 4);
