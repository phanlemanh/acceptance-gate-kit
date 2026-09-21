// nhan-canh-gay.cjs — MỘT nguồn trả lời «lượt chấm cuối kẹt vì đâu, và người ký được không»
// (hồ sơ nhan-trang-thai-va-reality, Đ2 · AC-4…AC-8). Bên đọc: thẻ Cổng 2 (gate-card.js),
// lưới trước-merge (pre-merge-check.sh qua CLI dưới), recheck-evidence.cjs. Ai thêm bên đọc
// thứ tư thì GỌI hàm này — hai bản luật là hai khuôn sẽ trôi.
//
// Nhãn lấy đúng chữ mục «Nhãn trạng thái» của CONTEXT.md. Phân loại CHỈ từ dữ liệu đã ghi
// (mã thoát, câu cố định của engine, cannot_run trên dòng eval) — không LLM đoán (giả định
// sinh tử 2 của ô). Dòng đời cũ thiếu `reason` → không phân loại → khoá như trước vòng.
'use strict';
const fs = require('fs');
const path = require('path');

const NHAN = { MU: 'không đọc được ở đây', CHET: 'hệ thống chết', LECH: 'thước lệch', VAT: 'sai hợp đồng' };
const TEN = { mu: NHAN.MU, chet: NHAN.CHET, vat: NHAN.VAT };

// ── nguồn chuỗi máy-đọc: RÚT từ engine, không chép ─────────────────────────────
// kitRoot = gốc chứa `feature-loop/workflows/acceptance-verify.js` và
// `skills/acceptance/references/tool-kill-rule.md` (kit tự host, hoặc thư mục phiên bản plugin
// khi hai gói nằm cạnh nhau). Mất marker → NÉM có tên: một nhãn tắt im vì thiếu nguồn là chiều
// hỏng tệ nhất (lưới mở ô ký trên thứ nó không phân loại được).
function nguonNhan(kitRoot) {
  const ungVien = [
    path.join(kitRoot, 'feature-loop', 'workflows', 'acceptance-verify.js'),
    path.join(kitRoot, '..', '..', 'feature-loop', path.basename(kitRoot), 'workflows', 'acceptance-verify.js'),
  ];
  const avPath = ungVien.find(p => fs.existsSync(p));
  if (!avPath) throw new Error(`nhan-canh-gay: không thấy acceptance-verify.js từ ${kitRoot}`);
  const av = fs.readFileSync(avPath, 'utf8');
  const khoi = av.match(/<<<INFRA-EXIT-CODES\n([\s\S]*?)INFRA-EXIT-CODES>>>/);
  if (!khoi) throw new Error('nhan-canh-gay: acceptance-verify.js mất khối INFRA-EXIT-CODES');
  const infraExits = [...khoi[1].matchAll(/^\s*(\d+):\s*'/gm)].map(m => Number(m[1]));
  if (!infraExits.length) throw new Error('nhan-canh-gay: khối INFRA-EXIT-CODES không có mã nào');
  const tk = av.match(/const TOOL_KILL_REASON = '([^']+)'/);
  if (!tk) throw new Error('nhan-canh-gay: acceptance-verify.js mất hằng TOOL_KILL_REASON');
  const dead = av.match(/blocked\.push\(\{ cmd, reason: '(agent bi skip\/chet)/);
  if (!dead) throw new Error('nhan-canh-gay: acceptance-verify.js mất câu cố định agent chết');
  return { infraExits, toolKillReason: tk[1], deadReason: dead[1] };
}

// ── phân một lý do ──────────────────────────────────────────────────────────────
// → 'mu' | 'chet' | null. `laEval` = dòng mang evalId của hợp đồng (không phải SUITE-*).
function nhanLyDo(reason, laEval, { infraExits, toolKillReason, deadReason }) {
  const r = typeof reason === 'string' ? reason : '';
  if (!r) return null;
  if (r.includes(deadReason)) return 'chet';
  if (infraExits.some(c => r.startsWith(`exit ${c} — `))) return 'mu';
  if (r === toolKillReason) return 'mu';
  return laEval ? 'mu' : null;
}

function docDong(runLogText) {
  return String(runLogText || '').split('\n').filter(l => l.trim())
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(o => o && typeof o === 'object');
}

// ── cạnh gãy của lượt chấm CUỐI ────────────────────────────────────────────────
// expectedExit: {evalId: mã đạt} (vắng = 0). Trả:
//   { round, lech, muc:[{evalId,cmd,nhan,reason}], daThuLai, trangThai }
//   trangThai ∈ 'lech' | 'mo' | 'chet-lan-dau' | 'khoa' | 'khong-ap' (verdict không phải BLOCKED)
function canhGay({ runLogText, verdict, expectedExit = {}, nguon }) {
  const dong = docDong(runLogText);
  const tallies = dong.filter(o => o.kind === 'round-tally');
  const cuoi = tallies[tallies.length - 1] || null;
  const round = cuoi && typeof cuoi.round === 'number' ? cuoi.round : null;
  const lechDong = [...dong].reverse().find(o => o.kind === 'thuoc-lech' && (round == null || (typeof o.round === 'number' && o.round >= round)));
  const lech = lechDong && Array.isArray(lechDong.tep) ? lechDong.tep : null;
  const out = { round, lech, muc: [], daThuLai: false, trangThai: 'khong-ap' };
  if (lech) { out.trangThai = 'lech'; return out; }
  if (String(verdict || '').toUpperCase() !== 'BLOCKED') return out;
  if (!cuoi || round == null) { out.trangThai = 'khoa'; return out; }
  // Chỉ dòng của LẦN CHẠY CUỐI: cùng round và cùng mốc ts với dòng tổng kết cuối — lần thử
  // lại ghi thêm dòng cho CÙNG round, đọc lẫn là đọc kết quả của lần đã bị thay.
  const cungLan = o => o.round === round && (cuoi.ts ? o.ts === cuoi.ts : true);
  for (const o of dong.filter(cungLan)) {
    if (o.kind === 'vang-mat') out.muc.push({ evalId: o.evalId || null, cmd: null, nhan: nhanLyDo(o.reason, true, nguon), reason: o.reason || '' });
    else if (!o.kind && o.evalId) {
      const laEval = !String(o.evalId).startsWith('SUITE-');
      if (o.cannot_run) out.muc.push({ evalId: o.evalId, cmd: o.cmd || null, nhan: nhanLyDo(o.reason, laEval, nguon), reason: o.reason || '' });
      else if (o.exit_code != null && laEval && o.exit_code !== (expectedExit[o.evalId] ?? 0))
        out.muc.push({ evalId: o.evalId, cmd: o.cmd || null, nhan: 'vat', reason: `exit ${o.exit_code}` });
      else if (o.exit_code != null && !laEval && o.exit_code !== 0)
        out.muc.push({ evalId: o.evalId, cmd: o.cmd || null, nhan: 'vat', reason: `exit ${o.exit_code}` });
    }
  }
  const soChanKhai = Number.isInteger(cuoi.blocked) ? cuoi.blocked : null;
  const soChanThay = out.muc.filter(m => m.nhan === 'mu' || m.nhan === 'chet' || m.nhan === null).length;
  out.daThuLai = tallies.filter(o => o.round === round && String(o.verdict).toUpperCase() === 'BLOCKED').length >= 2;
  if (!out.muc.length) out.trangThai = 'khoa';                               // BLOCKED mà không thấy mục nào: không đoán
  else if (soChanKhai != null && soChanThay < soChanKhai) out.trangThai = 'khoa';   // mục chặn không để lại dòng (suite chết)
  else if (out.muc.some(m => m.nhan === null || m.nhan === 'vat')) out.trangThai = 'khoa';
  else if (out.muc.some(m => m.nhan === 'chet')) out.trangThai = out.daThuLai ? 'mo' : 'chet-lan-dau';
  else out.trangThai = 'mo';
  return out;
}

// ── dòng sổ ký trên cạnh gãy (bên viết: khối CANH-GAY-REVISIT-LINE của commands/signoff.md) ─
// Tiền tố decision rút từ khối marker — không gõ ở đây.
function prefixCanhGay(signoffText) {
  const m = String(signoffText || '').match(/<<<CANH-GAY-REVISIT-LINE -->\n([\s\S]*?)<!-- CANH-GAY-REVISIT-LINE>>>/);
  if (!m) throw new Error('nhan-canh-gay: commands/signoff.md mất khối CANH-GAY-REVISIT-LINE');
  const d = m[1].match(/"decision":"<nhãn> — <E> \(<AC>\)([^"]*)"/);
  if (!d) throw new Error('nhan-canh-gay: khối CANH-GAY-REVISIT-LINE không có khuôn decision «<nhãn> — <E> (<AC>)…»');
  return { duoi: d[1] };
}
function kyTrenCanhGay({ canh, ledgerText }) {
  const dong = docDong(ledgerText);
  const thieu = [];
  for (const m of canh.muc) {
    const ten = TEN[m.nhan];
    const coDong = dong.some(o => o.type === 'revisit' && typeof o.decision === 'string' && o.decision.startsWith(`${ten} — ${m.evalId} `));
    if (!coDong) thieu.push(m.evalId);
  }
  return { ok: canh.trangThai === 'mo' && !thieu.length, thieu };
}

module.exports = { NHAN, TEN, nguonNhan, nhanLyDo, canhGay, prefixCanhGay, kyTrenCanhGay, docDong };
