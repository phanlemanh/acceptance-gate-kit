#!/usr/bin/env node
// Hook dừng của «vòng mở có chủ giữ» (hồ sơ vong-mo-co-chu-giu, thiết kế §3.7 mục 2–3): phiên định kết lượt mà còn
// lời GIAO gửi mình chưa NHẬN → chặn MỘT lần, lời chặn nêu mã và lệnh nhận chép được. Lần dừng kế cùng tập mã (hoặc
// stop_hook_active) → cho qua và ghi «kết lượt khi chưa nhận» lên sổ. Không bao giờ khoá phiên. Dấu luôn ghi cục bộ;
// hook KHÔNG BAO GIỜ ghi lên issue. Kênh không đọc được → chặn một lần (Hỏi-1, chủ kho duyệt 18/10), trong 30′ cho qua.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu } from './dot.mjs';
import { bayGio } from './song.mjs';
import { docDongDau, gapSo } from './tin-doc.mjs';

const PHUT = 60_000;
const KENH_LOI_CHO_QUA_MS = 30 * PHUT;
const TRAN_KENH_MS = 5000;

export async function xuLyDung(dauVao, { nowMs = null } = {}) {
  if (!dauVao?.cwd || (typeof dauVao.agent_id === 'string' && dauVao.agent_id)) return null;
  const now = bayGio(nowMs);
  const { cacMinh, daTat } = await import('./tin-dua.mjs');
  const { goc, ds } = cacMinh(dauVao.cwd);
  if (!goc || ds.length === 0) return null;
  const chan = [];
  for (const ten of ds) {
    if (daTat(goc, ten.worktree)) continue;
    let kenhTen = null;
    if (ten.loai === 'kenh') {
      const tt = docJson(ten.tep, null) ?? {};
      const m = /^(.+)-(.+)-(\d+)$/u.exec(ten.kenh);
      kenhTen = m ? `${m[1]}/${m[2]}#${m[3]}` : ten.kenh;
      const { dongBoAnToan, tachKenh } = await import('./tin-kenh.mjs');
      const tran = Math.min(TRAN_KENH_MS, Number(process.env.DIEU_PHOI_TIN_TRAN_MS || TRAN_KENH_MS));
      const db = dongBoAnToan(dauVao.cwd, tachKenh(kenhTen), tran);
      if (db.loi) {
        const t2 = docJson(ten.tep, null) ?? tt;
        if (t2.kenh_loi_chan_luc && now - Date.parse(t2.kenh_loi_chan_luc) < KENH_LOI_CHO_QUA_MS) continue;
        ghiJsonNguyenTu(ten.tep, { ...t2, kenh_loi_chan_luc: new Date(now).toISOString() });
        chan.push(`không đọc được kênh ${kenhTen} (${db.loi}) — tin gửi ${ten.minh} có thể đang chờ. Chạy: tin canh --kenh ${kenhTen} rồi kết lượt lại. Lần dừng kế trong 30′ sẽ được cho qua.`);
        continue;
      }
    }
    const { dong } = ten.nc.doc();
    const chuaNhan = gapSo(dong, { nowMs: now }).filter((v) => v.den === ten.minh && v.khau_lenh_mo === 'GIAO' && !v.yeu_cau_cu && (v.trang_thai === 'chua-den' || v.trang_thai === 'da-den'));
    if (chuaNhan.length === 0) continue;
    const pDau = ten.loai === 'dot' ? path.join(ten.thuMuc, 'tin-chan', `${ten.minh}.json`) : null;
    const dau = ten.loai === 'dot' ? docJson(pDau, null) : (docJson(ten.tep, null) ?? {}).chan;
    const daChan = new Set(dau?.ma ?? []);
    const ma = chuaNhan.map((v) => v.ma);
    if (dauVao.stop_hook_active === true || ma.every((x) => daChan.has(x))) {
      const daGhi = new Set(chuaNhan.filter((v) => v.ket_luot_chua_nhan).map((v) => v.ma));
      for (const x of ma) if (!daGhi.has(x)) ten.nc.them({ may: 'ket-luot-chua-nhan', ma: x, luc: new Date(now).toISOString() });
      continue;
    }
    const moiDau = { ma, luc: new Date(now).toISOString() };
    if (ten.loai === 'dot') {
      fs.mkdirSync(path.dirname(pDau), { recursive: true });
      ghiJsonNguyenTu(pDau, moiDau);
    } else {
      ghiJsonNguyenTu(ten.tep, { ...(docJson(ten.tep, null) ?? {}), chan: moiDau });
    }
    const k = kenhTen ? ` --kenh ${kenhTen}` : '';
    const dongMa = chuaNhan.map((v) => {
      const goc2 = dong.find((d) => d.text && docDongDau(d.text)?.ma === v.ma && docDongDau(d.text)?.khau_lenh === 'GIAO');
      return `- ${goc2 ? goc2.text.split('\n')[0] : v.ma}\n  → tin NHẬN ${v.ma} "sẽ giao <một câu bằng lời của mình>"${k}   (không nhận được thì: tin KẸT ${v.ma} "<cần gì>"${k} hoặc tin TRẢ ${v.ma} "<lý do>" --chuyen <ai>${k})`;
    });
    chan.push(`Còn ${chuaNhan.length} việc giao cho ${ten.minh} chưa NHẬN:\n${dongMa.join('\n')}\nKết lượt lần nữa mà chưa nhận thì sẽ được cho qua và ghi «kết lượt khi chưa nhận» lên sổ.`);
  }
  return chan.length ? { decision: 'block', reason: chan.join('\n\n') } : null;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  let raw = '';
  for await (const manh of process.stdin) raw += manh;
  try {
    const kq = await xuLyDung(JSON.parse(raw));
    if (kq) process.stdout.write(JSON.stringify(kq));
  } catch {
  }
  process.exit(0);
}
