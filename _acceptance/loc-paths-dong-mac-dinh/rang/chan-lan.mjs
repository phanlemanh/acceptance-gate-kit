// Chân E6 (lan-mot-bo-doc) và E8 (bo-may-cu) của hồ sơ loc-paths-dong-mac-dinh — làn ghim lại THẬT
// của cây đang kiểm. Bản lành XANH trước, bản sao bị tiêm ĐỎ với thông điệp ghim + dấu dương.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { KIT, dungKho, banSao, banBase, chayLan } from './kho.mjs';
import { rutMaTran, CAY_D, MOI } from './ma-tran-d.mjs';

const chan = process.argv[2];
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
const ket = (ten) => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
const LANE = 'feature-loop/scripts/repin-lane.mjs';
const LIB = 'lib/evidence-core.cjs';
const daChayLan = (err) => /\[lane\] sha [0-9a-f]{40}/.test(String(err || ''));
// Hồ sơ: E1 script `src/**` (vật máy) + E2 ui-check với khối `paths` cho trước.
const evals2 = (khoiE2) => 'schema_version: 1\nfeature_slug: feat\nevals:\n' +
  '  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_ok\n    expected: exit 0\n    paths: [\'src/**\']\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n' +
  '  - id: E2\n    criterion: AC-2\n    executor: ui-check\n    expected: thấy trang\n' + khoiE2 + '    evidence_required: [verifier, verified_at]\n';
const khoi = (...muc) => '    paths:\n' + muc.map(m => `      - '${m}'`).join('\n') + '\n';
const TEP = [...CAY_D, 'ui/a/x.tsx', 'ui/b/x.tsx'];
// Ghim (writer thật), đổi tệp, rồi làn --write: trả { st, cham: evals_not_machine_touched | null, ghi, err }.
const ghim = (engine, evalsYaml, doi, staleScope, agRoot = engine) => {
  const k = dungKho({ staleScope, hoSo: [{ slug: 'feat', evalsYaml }], tep: TEP });
  k.doi(doi);
  const log0 = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8');
  const r = chayLan(engine, k, ['feat'], ['--reason', 'x', '--write'], agRoot);
  const moi = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8').slice(log0.length);
  const dong = moi.split('\n').filter(l => l.includes('"kind":"repin"')).map(l => JSON.parse(l));
  const sach = k.git('status', '--porcelain') === '';
  k.don();
  return { st: r.status, ghi: dong.length, cham: dong[0] && dong[0].evals_not_machine_touched ? dong[0].evals_not_machine_touched : null, err: r.stderr || '', sach };
};

if (chan === 'lan-mot-bo-doc') {
  const CA = [
    ['(i) khối có dòng trống + chú thích', "    paths:\n      - 'ui/a/**'\n\n      # ghi chu\n      - 'ui/b/**'\n"],
    ['(ii) thư mục trần có thật', khoi('ui/b')],
    ['(iii) dạng lạ ./ui/**', khoi('./ui/**')],
  ];
  for (const [ten, k2] of CA) { const r = ghim(KIT, evals2(k2), ['ui/b/x.tsx']); ok(r.st === 0 && JSON.stringify(r.cham) === '["E2"]', `${ten}: diff chạm ui/b/x.tsx → dòng pin có evals_not_machine_touched ["E2"] (được ${JSON.stringify(r.cham)}, mã ${r.st})`); }
  // Chỉ thêm, không bớt: 19 dạng của ma trận D đặt vào ô ui-check, diff = tệp đổi của ô.
  const BASE = banBase();
  let n = 0, them = 0;
  for (const o of rutMaTran()) {
    const muc = o.evals[o.evals.length - 1].muc;
    const y = evals2(khoi(...muc)); const a = ghim(KIT, y, o.doi), b = ghim(BASE, y, o.doi);
    const tapA = new Set(a.cham || []), tapB = new Set(b.cham || []);
    const conDu = [...tapB].every(x => tapA.has(x));
    if (tapA.size > tapB.size) them++;
    ok(conDu && a.st === b.st && a.ghi === b.ghi, `${o.id} «${muc[0]}»: tập ô chạm mới ⊇ base (${[...tapA]} ⊇ ${[...tapB]}), mã ${a.st}/${b.st}, ghi pin ${a.ghi}/${b.ghi}`);
    n++;
  }
  ok(n === 19, `đúng 19 ô (được ${n})`); console.log(`  ô bản mới báo THÊM so với base: ${them}`);
  // Chiều đỏ: bản sao khôi phục bộ đọc cũ (không bỏ qua dòng trống) → (i) mất E2.
  const s = banSao([{ tep: LANE, tu: 'const gl = core.evalPathsOf(s.evalsText, id) || [];', thanh: 'const gl = (() => { const out = []; let tr = false, sq = null; for (const raw of String(s.evalsText).split("\\n")) { const m = raw.match(/^\\s*-\\s+id:\\s*(\\S+)/); if (m) { if (sq) break; tr = m[1] === id; continue; } if (!tr) continue; if (sq) { const it = raw.match(/^\\s+-\\s+(\\S.*)$/); if (it) { sq.push(core.parseFlowValue(it[1]).value); continue; } break; } const f = raw.match(/^\\s+paths:\\s*(.*)$/); if (f && !f[1].trim()) sq = []; } return sq || out; })();' }]);
  const r = ghim(s, evals2(CA[0][1]), ['ui/b/x.tsx'], undefined, s);
  ok(daChayLan(r.err) && r.st === 0 && !(r.cham || []).includes('E2'), `chiều đỏ «bộ đọc riêng»: bản sao bộ đọc cũ dừng ở dòng trống → (i) mất E2 [làn chạy tới hồ sơ: ${daChayLan(r.err) ? 'có' : 'KHÔNG'}]`);
  ket('E6');
} else if (chan === 'bo-may-cu') {
  const y = evals2(khoi('ui/b/**'));
  const thieu = banSao([{ tep: LIB, tu: '  phanLoaiMucPaths,\n', thanh: '' }]);
  // Khoá paths + bộ máy thiếu → dừng gọi tên, không ghi.
  { const r = ghim(KIT, y, ['ui/b/x.tsx'], 'paths', thieu);
    ok(r.st !== 0 && /phanLoaiMucPaths/.test(r.err) && /cần ≥/.test(r.err) && r.ghi === 0 && r.sach, `khoá paths + bộ máy thiếu phanLoaiMucPaths → dừng (mã ${r.st}), gọi tên hàm và mốc cần, không ghi gì, cây hồ sơ sạch`); }
  // Khoá vắng + bộ máy thiếu → chạy, không có ô chạm, một dòng báo.
  { const r = ghim(KIT, y, ['ui/b/x.tsx'], undefined, thieu);
    const dong = (r.err.match(/bộ máy thiếu phanLoaiMucPaths — không tính được ô ngoài làn máy có vật đổi/g) || []).length;
    ok(r.st === 0 && r.ghi === 1 && r.cham === null && dong === 1, `khoá vắng + bộ máy thiếu → làn ghi pin, không có evals_not_machine_touched, đúng một dòng báo (mã ${r.st}, ghi ${r.ghi}, dòng ${dong})`); }
  // Đối chứng dương: bộ máy đủ → ô chạm hiện.
  { const r = ghim(KIT, y, ['ui/b/x.tsx']); ok(r.st === 0 && JSON.stringify(r.cham) === '["E2"]', `đối chứng dương: bộ máy đủ → evals_not_machine_touched ["E2"]`); }
  // Chiều đỏ: hàng phanLoaiMucPaths thành vô điều kiện → khoá vắng cũng dừng.
  { const s = banSao([{ tep: LANE, tu: "name: 'phanLoaiMucPaths', kind: 'function', since: '2.24.0', why: 'làn gọi (phân loại mục paths)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' }", thanh: "name: 'phanLoaiMucPaths', kind: 'function', since: '2.24.0', why: 'làn gọi (phân loại mục paths)' }" }]);
    const r = ghim(s, y, ['ui/b/x.tsx'], undefined, thieu);
    ok(r.st !== 0 && /phanLoaiMucPaths/.test(r.err), `chiều đỏ «khoá vắng mà đòi bộ máy mới»: bản sao đòi vô điều kiện → khoá vắng dừng gọi tên phanLoaiMucPaths (mã ${r.st})`); }
  ket('E8');
} else {
  console.log(`chan-lan: chân lạ ${chan}`); process.exit(3);
}
