'use strict';
// loi-ra-tran-luot.cjs — khối «Lối ra» của thẻ Cổng Bằng chứng CHƯA-ký-được (hồ sơ
// loi-moi-tran-luot-loi-song-co-gia, design §4.1). Mô-đun THUẦN: nhận văn bản sổ chạy và bản
// khai eval đã đọc sẵn, trả một đối tượng; không đọc đĩa, không gọi git. Thẻ (scripts/gate-card.js)
// in HTML từ CHÍNH đối tượng này và đặt nó nguyên vào `--extract` — một nguồn.
//
// Khối chỉ hiện khi một lời mời là thật: vòng chạm trần lượt, hoặc cùng một eval chưa ra phán
// quyết ở lượt cuối VÀ ở lượt có dòng gần nhất trước đó. Ngoài hai ca ấy trả null → thẻ giữ
// nguyên từng byte. Ba lối luôn sống, không lối nào mời ký: báo cáo REJECT/BLOCKED không ký được.

const TEN_KHOI = 'Lối ra';
const TRAN_LUOT = 3;
// Tên trường giờ của dòng `round-tally` (bộ chấm ghi = invokedAt của args, mốc đầu lượt) và của
// dòng `thuoc-vat` (thuoc-vat.mjs --write ghi lúc lượt về). Hiệu hai mốc = thời lượng lượt.
const TRUONG_GIO = 'ts';
const CANH_BAO_EVALS = 'không đọc được evals.yaml — AC không xác định';
// Ba trạng thái máy tự chấm lại (lib/nhan-canh-gay.cjs): không phải chỗ mời người.
const TU_CHAM_LAI = new Set(['lech', 'cay-doi', 'chet-lan-dau']);

const docDong = text => String(text == null ? '' : text).split('\n').map(l => {
  try { const o = JSON.parse(l); return o && typeof o === 'object' && !Array.isArray(o) ? o : null; } catch (_) { return null; }
}).filter(Boolean);
const laLuot = n => typeof n === 'number' && Number.isInteger(n) && n > 0;
const coKhoa = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

// Dòng eval của hợp đồng: không phải SUITE-*, và có trong evals.yaml khi đọc được nó.
function laEvalHopDong(o, evalMeta) {
  return !o.evalId.startsWith('SUITE-') && (evalMeta === null || coKhoa(evalMeta, o.evalId));
}

// Lớp «chưa đạt ở một lượt» (design §4.1, sáu hình): không chạy được · bị công cụ ngắt · mã
// khác 0 và khác mã đã khai. Mã đúng `expected_exit` là ĐẠT.
function chuaDat(o, expectedExit) {
  if (o.cannot_run === true || o.killed_by_tool === true) return true;
  const c = o.exit_code;
  if (c === 0 || c === '0') return false;
  if (c == null) return true;
  const k = expectedExit[o.evalId];
  return !(k != null && String(k) === String(c));
}

function phutCuaLuot(dong, round) {
  const cuoi = kind => [...dong].reverse().find(o => o.kind === kind && o.round === round);
  const a = cuoi('round-tally'); const b = cuoi('thuoc-vat');
  if (!a || !b) return null;
  const t0 = Date.parse(a[TRUONG_GIO]); const t1 = Date.parse(b[TRUONG_GIO]);
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return null;
  const d = t1 - t0;
  return d >= 0 ? Math.round(d / 60000) : null;
}

function loiRa({ runLogText, verdict, approvable, trangThai, expectedExit, evalMeta }) {
  if (approvable) return null;
  if (verdict !== 'REJECT' && verdict !== 'BLOCKED') return null;
  if (TU_CHAM_LAI.has(trangThai)) return null;
  const ex = expectedExit instanceof Map ? Object.fromEntries(expectedExit) : (expectedExit || {});
  const meta = evalMeta === undefined ? null : evalMeta;
  const dong = docDong(runLogText);
  const rounds = [...new Set(dong.filter(o => laLuot(o.round)).map(o => o.round))].sort((a, b) => a - b);
  if (!rounds.length) return null;
  const cuoi = rounds[rounds.length - 1];

  // Trạng thái từng (eval, lượt): dòng CUỐI của cặp thắng (lượt thử lại cùng round).
  const tt = new Map();
  for (const o of dong) {
    if (!laLuot(o.round) || typeof o.evalId !== 'string' || coKhoa(o, 'kind')) continue;
    if (!laEvalHopDong(o, meta)) continue;
    if (!tt.has(o.evalId)) tt.set(o.evalId, new Map());
    tt.get(o.evalId).set(o.round, chuaDat(o, ex));
  }

  const lap = [];
  for (const [evalId, m] of tt) {
    const truoc = [...m.keys()].filter(r => r < cuoi).sort((a, b) => a - b);
    if (!truoc.length || !m.get(truoc[truoc.length - 1])) continue;
    let vang = null;
    if (m.has(cuoi)) { if (!m.get(cuoi)) continue; } else vang = cuoi;
    const luot = [...m.entries()].filter(([, v]) => v).map(([r]) => r).sort((a, b) => a - b);
    const ac = meta && meta[evalId] && meta[evalId].ac ? meta[evalId].ac : '';
    const cau = `${evalId} (${ac || 'AC không xác định'}) chưa đạt ở lượt ${luot.join(', ')}${vang ? ` · không có dòng ở lượt ${vang}` : ''}`;
    lap.push({ evalId, ac, luot, vang, cau });
  }
  lap.sort((a, b) => a.evalId.localeCompare(b.evalId, 'en', { numeric: true }));
  const tran = cuoi >= TRAN_LUOT;
  if (!tran && !lap.length) return null;

  const luot = rounds.map(r => {
    const t = [...dong].reverse().find(o => o.kind === 'round-tally' && o.round === r);
    return { round: r, verdict: t && typeof t.verdict === 'string' ? t.verdict : null, phut: phutCuaLuot(dong, r) };
  });
  const coPhut = [...luot].reverse().find(x => x.phut != null);
  const soLuotLap = x => x.luot.length + (x.vang ? 1 : 0);
  const acLap = [...new Set(lap.map(x => x.ac || x.evalId))];

  const loi = [
    { ma: 'thu-pham-vi',
      ten: `thu phạm vi: đưa ${acLap.length ? acLap.join(', ') : 'tiêu chí chưa đạt'} ra Known limits có tên, ký lại Cổng Phạm vi`,
      gia: 'một chạm ký lại; tiêu chí ấy ship không có bằng chứng máy; chấm lại phần còn lại' },
    { ma: 'luot-nua',
      ten: `sửa rồi chấm thêm một lượt${tran ? ` (vượt trần ${TRAN_LUOT} lượt)` : ''}`,
      gia: [coPhut ? `khoảng ${coPhut.phut} phút máy (lượt ${coPhut.round} đo được)` : 'phút máy: chưa đo',
        ...lap.map(x => `${x.evalId} đã ${soLuotLap(x)} lượt chưa đạt`)].join('; ') },
    { ma: 'dung', ten: 'dừng vòng, giữ nhánh và hồ sơ', gia: 'không ship; quay lại được' },
  ];
  const khuyen_nghi = lap.length
    ? { ma: 'thu-pham-vi', vi_sao: `cùng một thước chưa đạt ở ${Math.max(...lap.map(soLuotLap))} lượt — khuôn sai, không phải chi tiết sai` }
    : { ma: 'luot-nua', vi_sao: 'mỗi lượt hỏng một chỗ khác — vòng đang tiến' };
  const canhBao = [];
  if (evalMeta === null) canhBao.push(CANH_BAO_EVALS);
  return {
    tran, luot, lap, loi, khuyen_nghi, canh_bao: canhBao,
    khong_ky: `Không có lối ký: báo cáo ${verdict} không ký được.`,
  };
}

// HTML của khối — mọi chữ rút từ đối tượng loiRa (AC-7, một nguồn). `esc` là bộ thoát của thẻ.
function khoiHtml(lr, esc) {
  const soKhuyen = lr.loi.findIndex(l => l.ma === lr.khuyen_nghi.ma) + 1;
  const dongLuot = lr.luot.map(x => `lượt ${x.round} ${x.verdict || '—'} · ${x.phut != null ? `${x.phut} phút` : 'chưa đo'}`).join(' — ');
  const p = [];
  p.push(`<p class="li"><b>${esc(TEN_KHOI)}</b> — đã chấm ${lr.luot.length} lượt (trần ${TRAN_LUOT}): ${esc(dongLuot)}</p>`);
  for (const c of lr.canh_bao) p.push(`<div class="flag fwarn">${esc(c)}</div>`);
  for (const x of lr.lap) p.push(`<p class="li">Lặp lại: ${esc(x.cau)}</p>`);
  lr.loi.forEach((l, i) => p.push(`<p class="li">${i + 1}. ${esc(l.ten)} — ${esc(l.gia)}</p>`));
  p.push(`<p class="li">${esc(lr.khong_ky)}</p>`);
  p.push(`<p class="li">Máy khuyên lối ${soKhuyen}: ${esc(lr.khuyen_nghi.vi_sao)}</p>`);
  return `<div class="lab">👉 VIỆC CỦA ANH — chọn một lối ra</div><div class="grp gnot">${p.join('')}</div>`;
}

module.exports = { TEN_KHOI, TRAN_LUOT, TRUONG_GIO, CANH_BAO_EVALS, loiRa, khoiHtml };
