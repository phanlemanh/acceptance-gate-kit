// Bàn giao tài khoản (spec workflow §4.3, design DP4 chỗ chọn 8, 10, 12). `ban-giao.json` dựng từ git và thư mục đợt
// bằng MỘT hàm (`buocBanGiao`) cho nhịp bộ phát lịch, lệnh con `ban-giao` và `tiep-tuc` — không do model soạn.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PHUT_MS } from './cau-hinh.mjs';
import { docJson, ghiJsonNguyenTu, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { MAC_DINH_HAN_MUC } from './han-muc.mjs';
import { mucDay } from './muc-day.mjs';
import { datPha, docPha } from './pha.mjs';
import { bayGio, docNhipSong } from './song.mjs';

export const TEP_BAN_GIAO = 'ban-giao.json';
export const DIR_BAN_GIAO = 'ban-giao';

const canDot = (cwd, lenh) => {
  const t = timThuMucDot(cwd);
  if (!t) throw new Error(`${lenh}: không có đợt nào đang chạy`);
  return t;
};
const cfgCua = (thuMuc) => {
  try {
    return docCauHinh(thuMuc);
  } catch {
    return {};
  }
};
const khoaS4Cua = (thuMuc) => docJson(path.join(thuMuc, 'khoa', 's4', 'chu.json'), null);
// Khoá s4 còn sống: có chủ và tệp nhịp mới hơn `nhip_cu_phut`; khoá chưa có nhịp coi như còn sống.
function khoaS4Song(thuMuc, cfg, now) {
  if (!khoaS4Cua(thuMuc)) return false;
  try {
    return now - fs.statSync(path.join(thuMuc, 'khoa', 's4', 'nhip')).mtimeMs < (cfg.nhip_cu_phut ?? 10) * PHUT_MS;
  } catch {
    return true;
  }
}

// Lệnh con `ban-giao` (§4.3 bước 1): dang-chay | tam-dung → dang-ban-giao. Đã đang bàn giao → chỉ chạy bước bàn giao.
export function batDauBanGiao(cwd, { lyDo = '', boi = 'cli', nowMs = null } = {}) {
  const thuMuc = canDot(cwd, 'ban-giao');
  const pha = docPha(thuMuc).pha;
  if (pha === 'dang-ban-giao') return { ...buocBanGiao(thuMuc, { nowMs }), ma: docPha(thuMuc).ban_giao?.ma ?? null };
  if (pha !== 'dang-chay' && pha !== 'tam-dung') throw new Error(`ban-giao: đợt đang ở pha ${pha} — chỉ bàn giao từ dang-chay hoặc tam-dung`);
  datPha(thuMuc, 'dang-ban-giao', { boi, lyDo, nowMs });
  const ma = docPha(thuMuc).ban_giao.ma;
  ghiSuKien(thuMuc, { loai: 'ban-giao', ma, ly_do: lyDo });
  const hv = docHangViec(thuMuc);
  return { pha: 'dang-ban-giao', ma, can_nhan: hv.day.filter((d) => d.nghi !== true).map((d) => d.id) };
}

// Lệnh con `ban-giao-xong` (§4.3 bước 3, T10): chỉ đòi cây sạch và hết đơn — KHÔNG đòi đẩy. `--wip` commit hộ bằng
// `git commit` thường (không bỏ hook của kho).
export function banGiaoXong(cwd, { wip = null, nowMs = null } = {}) {
  const thuMuc = canDot(cwd, 'ban-giao-xong');
  const dk = docPha(thuMuc);
  if (dk.pha !== 'dang-ban-giao' || !dk.ban_giao) throw new Error(`ban-giao-xong: đợt không đang bàn giao (pha ${dk.pha})`);
  const hv = docHangViec(thuMuc);
  const id = phienCuaCwd(hv, cwd);
  if (!id) throw new Error('ban-giao-xong: cwd không thuộc dãy nào của đợt — chạy từ worktree của dãy');
  const d = hv.day.find((x) => x.id === id);
  if (khoaS4Cua(thuMuc)?.phien === id) throw new Error(`ban-giao-xong: ${id} đang giữ khoá s4 — đang xong; chạy lại sau khi lượt chấm hết và nhả khoá`);
  if (typeof wip === 'string' && wip.trim()) {
    const st = spawnSync('git', ['status', '--porcelain'], { cwd: d.worktree, encoding: 'utf8' }).stdout ?? '';
    if (st.trim()) {
      spawnSync('git', ['add', '-A'], { cwd: d.worktree });
      const c = spawnSync('git', ['commit', '-q', '-m', `wip(ban-giao): ${wip.trim()}`], { cwd: d.worktree, encoding: 'utf8' });
      if (c.status !== 0) {
        spawnSync('git', ['reset', '-q'], { cwd: d.worktree });
        throw new Error(`ban-giao-xong: commit WIP lỗi — ${`${c.stderr ?? ''}${c.stdout ?? ''}`.split('\n').map((x) => x.trim()).find(Boolean) ?? `mã ${c.status}`}`);
      }
    }
  }
  const loi = [];
  const ban = (spawnSync('git', ['status', '--porcelain'], { cwd: d.worktree, encoding: 'utf8' }).stdout ?? '').split('\n').filter(Boolean);
  for (const dong of ban) loi.push(`chưa commit: ${dong.slice(3)}`);
  const dXin = path.join(thuMuc, 'xin');
  for (const f of fs.existsSync(dXin) ? fs.readdirSync(dXin).filter((x) => x.startsWith(`${id}-`) && x.endsWith('.json')).sort() : []) loi.push(`còn đơn: xin/${f}`);
  if (loi.length) throw new Error(`ban-giao-xong: ${id} chưa xong — ${loi.join(' · ')}`);
  const m = mucDay(thuMuc, d, { hangViec: hv, maBanGiao: dk.ban_giao.ma });
  const phienCu = [...new Set(docNhipSong(thuMuc).filter((n) => n.worktree === d.worktree).map((n) => n.phien))].sort();
  const ghi = { day: id, ma: dk.ban_giao.ma, luc: new Date(bayGio(nowMs)).toISOString(), nhanh: m.nhanh, dinh: m.dinh, da_day: m.da_day, co_wip: m.co_wip, phien_cu: phienCu };
  ghiJsonNguyenTu(path.join(thuMuc, DIR_BAN_GIAO, 'xong', `${id}.json`), ghi);
  ghiSuKien(thuMuc, { loai: 'ban-giao-xong', phien: id, ma: ghi.ma });
  return ghi;
}

function shaNhanhChinh(cfg) {
  if (!cfg.goc_kho || !cfg.nhanh_chinh) return null;
  for (const ref of [`origin/${cfg.nhanh_chinh}`, cfg.nhanh_chinh]) {
    const r = spawnSync('git', ['rev-parse', '--verify', '-q', ref], { cwd: cfg.goc_kho, encoding: 'utf8' });
    if (r.status === 0) return r.stdout.trim();
  }
  return null;
}
const XONG = new Set(['xong', 'dang-xong', 'nghi', 'worktree-mat']);
const khongLuc = ({ luc: _bo, ...con }) => JSON.stringify(con);

// Bước bàn giao (§4.3 bước 4–5) — MỘT hàm cho nhịp bộ phát lịch, CLI `ban-giao` và `tiep-tuc` (cưỡng bức). Dựng khi
// mọi dãy đã xong/đang xong, hoặc quá hạn chờ (mặc định 20′ khi đợt không khai), hoặc cưỡng bức; sang cho-tiep-tuc khi
// không còn khoá s4 sống (cưỡng bức: không chờ khoá — người đã có mặt và chọn tiếp tục).
export function buocBanGiao(thuMuc, { nowMs = null, cuongBuc = false } = {}) {
  const dk = docPha(thuMuc);
  if (dk.pha !== 'dang-ban-giao' || !dk.ban_giao) return { pha: dk.pha, dung: false };
  const now = bayGio(nowMs);
  const cfg = cfgCua(thuMuc);
  const hv = docHangViec(thuMuc);
  const khoa = khoaS4Cua(thuMuc);
  const day = hv.day.map((d) => mucDay(thuMuc, d, { hangViec: hv, khoaS4: khoa?.phien ?? null, maBanGiao: dk.ban_giao.ma }));
  const hanMs = (cfg.han_muc?.cho_ban_giao_phut ?? MAC_DINH_HAN_MUC.cho_ban_giao_phut) * PHUT_MS;
  const quaHan = now - Date.parse(dk.ban_giao.vao_luc) >= hanMs;
  if (!(cuongBuc || quaHan || day.every((m) => XONG.has(m.ban_giao)))) return { pha: dk.pha, dung: false };
  const dXin = path.join(thuMuc, 'xin');
  const bg = {
    ma: dk.ban_giao.ma,
    trang_thai: 'mo',
    dot: hv.dot,
    luc: new Date(now).toISOString(),
    vao_luc: dk.ban_giao.vao_luc,
    ly_do: dk.ban_giao.ly_do,
    boi: dk.ban_giao.boi,
    sha_nhanh_chinh: shaNhanhChinh(cfg),
    day,
    khoa: ['s4', 'duong-nen', 'merge'].flatMap((tn) => {
      const c = docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'), null);
      return c ? [{ tai_nguyen: tn, phien: c.phien }] : [];
    }),
    don: fs.existsSync(dXin) ? fs.readdirSync(dXin).filter((f) => f.endsWith('.json')).sort() : [],
  };
  const p = path.join(thuMuc, TEP_BAN_GIAO);
  const cu = docJson(p, null);
  if (!cu || khongLuc(cu) !== khongLuc(bg)) ghiJsonNguyenTu(p, bg);
  if (cuongBuc || !khoaS4Song(thuMuc, cfg, now)) {
    datPha(thuMuc, 'cho-tiep-tuc', { boi: cuongBuc ? 'tiep-tuc' : 'phat-lich', lyDo: 'bàn giao đã dựng', nowMs: now });
    const gio = new Date(now).toISOString().slice(11, 16);
    ghiSuKien(thuMuc, {
      loai: 'ban-giao-dung',
      ma: bg.ma,
      dich: 'owner',
      can_phan: true,
      tin: `Đã bàn giao đợt ${hv.dot} lúc ${gio}Z. Đổi tài khoản, rồi mở một phiên trong kho và gõ /dieu-phoi:tiep-tuc (lệnh chưa có sau khi đổi → node ${path.join(thuMuc, 'loi', 'dieu-phoi.mjs')} tiep-tuc --phien <mã phiên này> --json).`,
    });
    return { pha: 'cho-tiep-tuc', dung: true, ban_giao: bg };
  }
  return { pha: dk.pha, dung: true, ban_giao: bg };
}
