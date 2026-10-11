// xuat-du-qua-pipe.test.mjs — ca đo của hồ sơ xa-stdout-truoc-khi-thoat (XD-1..XD-7).
//
// Lớp lỗi: script ghi stdout rồi process.exit ngay. Stdout ra pipe là BẤT ĐỒNG BỘ trên POSIX (tài liệu
// Node, «A note on process I/O»), nên phần vượt bộ đệm pipe mất im lặng — 65 536 byte trên macOS.
// Thước của «đủ byte» là bản ghi ra TỆP (stdout là tệp: ghi đồng bộ). Ca mở bằng phép DÒ NỀN; chiều đỏ
// chỉ được khẳng định trên nền cắt và khi fixture ≥ 2 × số byte phép dò nhận — nền không cắt in
// «KHÔNG ĐO ĐƯỢC ở nền này», trạng thái không-đọc-được-ở-đây, KHÔNG phải PASS. Hồ sơ thử và kho thử do
// code sinh trong lượt; mọi đường suy từ vị trí tệp này; bản sao lấy TRỌN thư mục.
//
// Tên tệp xếp CUỐI glob của tests/scripts — chỉ số mảnh mjs:i/3 của mọi tệp khác giữ nguyên.
import { spawnSync, spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const CARD_REL = path.join('scripts', 'gate-card.js');
const LANE_REL = path.join('feature-loop', 'scripts', 'repin-lane.mjs');
const CARD = path.join(ROOT, CARD_REL);
const LANE = path.join(ROOT, LANE_REL);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'xdqp-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };

// Bốn literal ghim chung với hợp đồng (khối đầu Criteria) — đổi ở đây là đổi ở đó.
const KHONG_DO = 'KHÔNG ĐO ĐƯỢC ở nền này';
const KHONG_AP = 'mutant không áp được';
const nhanByte = (n, m) => `nhận ${n} / ${m} byte`;

// ── chạy: stdout ra PIPE hoặc ra TỆP ─────────────────────────────────
const TRAN_MS = 30000;
const loiChay = (r) => { if (r.error) throw new Error(`không chạy được (${r.error.code || r.error.message}) — treo quá ${TRAN_MS / 1000} s?`); };
const quaPipe = (args, opts = {}) => {
  const r = spawnSync(process.execPath, args, { maxBuffer: 1 << 28, timeout: TRAN_MS, ...opts });
  loiChay(r);
  return { status: r.status, stdout: r.stdout, stderr: String(r.stderr) };
};
const quaTep = (args, opts = {}) => {
  const f = path.join(mk('tep-'), 'stdout');
  const fd = fs.openSync(f, 'w');
  let r;
  try { r = spawnSync(process.execPath, args, { stdio: ['ignore', fd, 'pipe'], timeout: TRAN_MS, ...opts }); } finally { fs.closeSync(fd); }
  loiChay(r);
  return { status: r.status, stdout: fs.readFileSync(f), stderr: String(r.stderr) };
};
// Người đọc nhận mẩu đầu rồi đóng đầu đọc (tương đương `| head -c …`).
const dongSom = (args) => new Promise((res) => {
  const ch = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let err = ''; let nhan = 0;
  const hen = setTimeout(() => ch.kill('SIGKILL'), TRAN_MS);
  ch.stderr.on('data', (d) => { err += d; });
  ch.stdout.once('data', (d) => { nhan = d.length; ch.stdout.destroy(); });
  ch.on('close', (code, sig) => { clearTimeout(hen); res({ code, sig, err, nhan }); });
});
const bangNhau = (r, ref, ma) => r.status === ma && r.stdout.equals(ref);
// Đỏ ĐÚNG của một bản hoàn nguyên: đúng mã của đường, 0 < n < m, n byte là tiền tố bản tệp — bản sao
// chết sớm (0 byte, mã lạ) không được đếm là cắt.
const catDung = (r, ref, ma) => r.status === ma && r.stdout.length > 0 && r.stdout.length < ref.length
  && ref.subarray(0, r.stdout.length).equals(r.stdout);

// ── dò nền ───────────────────────────────────────────────────────────
const P_DO = 200000;
const doNen = quaPipe(['-e', `process.stdout.write('x'.repeat(${P_DO})); process.exit(0)`]);
const N_DO = doNen.stdout.length;
const NEN_CAT = N_DO < P_DO;
console.log(`${NEN_CAT ? 'nền: CẮT' : 'nền: KHÔNG CẮT'} (dò nhận ${N_DO} / ${P_DO} byte)`);
const CO_MIN = NEN_CAT ? Math.max(65537, 2 * N_DO) : 65537;
const doEpipe = await dongSom(['-e', `process.stdout.write('x'.repeat(${P_DO})); process.exitCode = 0`]);
const EPIPE_SAP = doEpipe.code !== 0 && /EPIPE/.test(doEpipe.err);
console.log(`dò EPIPE: khuôn exitCode ${EPIPE_SAP ? 'SẬP' : 'không sập'} (mã ${doEpipe.code}, nhận ${doEpipe.nhan} byte)`);

// ── hồ sơ thử (code sinh) ────────────────────────────────────────────
const CHU = 'Thước đo phải gắn vào vật được giao — chữ có dấu nhiều byte. ';
const AT = '2026-10-11T00:00:00Z';
const dongSo = (i) => (i % 2
  ? { id: `d-20261011T000000Z-${i}`, type: 'descope', stage: 'S1', at: AT, decision: `bỏ hạng mục ${i} — ${CHU.repeat(4)}`, impact: `ảnh hưởng ${i} — ${CHU.repeat(4)}` }
  : { id: `d-20261011T000000Z-${i}`, type: 'approach', stage: 'S1', at: AT, decision: `chọn cách ${i} — ${CHU.repeat(4)}`, why: `vì ${i} — ${CHU.repeat(3)}`, cost_if_wrong: `sai thì ${i} — ${CHU.repeat(3)}` });
// n dòng sổ; seal sau nửa đầu (Cổng 2 có cả khối đã duyệt lẫn khối CHƯA duyệt).
const so = (n, seal) => {
  const dong = Array.from({ length: n }, (_, k) => JSON.stringify(dongSo(k + 1)));
  if (seal) dong.splice(Math.floor(n / 2), 0, JSON.stringify({ id: 'd-20261011T000001Z-seal', type: 'seal', gate: 1, at: AT }));
  return dong.join('\n') + '\n';
};
const CONTRACT = (slug, status) => `---
schema_version: 1
feature: Hồ sơ thử xả stdout ${slug}
slug: ${slug}
risk_tier: T2
surfaces: [cli]
status: ${status}
approved_by: ${status === 'draft' ? '' : 'Nguoi Thu'}
approved_at: ${status === 'draft' ? '' : AT}
---

## Criteria

- AC-1: Given a, When b, Then c.
- AC-2: Given d, When e, Then f.

## Coverage

- Trục A — x | y  [thước CE: z] → AC-1, AC-2

## Out of scope

- bỏ X.
- bỏ Y.
`;
const EVALS = `schema_version: 1
evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.a
    expected: xanh
  - id: E2
    criterion: AC-2
    executor: test
    cmd: config:executors.test.a
    expected: xanh
`;
const REPORT = (slug, verdict, reason) => `---
schema_version: 2
feature_slug: ${slug}
verdict: ${verdict}
${reason ? `reason: ${reason}\n` : ''}failed_evals: []
verified_commit: 0000000
human_signoff:
---

# Evidence

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | ${verdict === 'PASS' ? 'PASS' : 'BLOCKED'} |
| E2 | AC-2 | test | ${verdict === 'PASS' ? 'PASS' : 'BLOCKED'} |

## Evidence

- eval: E1
  run_id: r1abc
  exit_code: 0
  verifier: config:executors.test.a
  verified_at: ${AT}
- eval: E2
  run_id: r1abc
  exit_code: 0
  verifier: config:executors.test.a
  verified_at: ${AT}
`;
const hoSo = (slug, files) => {
  const root = mk('kho-the-');
  fs.mkdirSync(path.join(root, '_acceptance', slug), { recursive: true });
  fs.writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\ngap_probe: required\n');
  for (const [f, t] of Object.entries(files)) fs.writeFileSync(path.join(root, '_acceptance', slug, f), t);
  return { root, slug };
};
// Cỡ fixture CO GIÃN theo số dò: cỡ gốc vượt 131 072 byte (2 × 65 536 trên M5); nền cắt sâu hơn thì nhân
// lên, để tiền đề «≥ 2 × n» không đỏ oan vì fixture cố định. Sổ vẫn dưới trần đọc 1 MB của gate-card ở
// mọi n < 200 000 (nền cắt); vượt trần thì tiền đề đỏ nêu cỡ — giới hạn của fixture, không im.
const HE_SO = Math.max(1, CO_MIN / 131072) * 1.1;
const SO_DONG = Math.ceil(360 * HE_SO);
const LY_DO_DAI = `lệnh executor không chạy được trên máy chấm — ${CHU.repeat(Math.ceil(2600 * HE_SO))}`;
const G1 = hoSo('lon-cong-1', { 'contract.md': CONTRACT('lon-cong-1', 'draft'), 'evals.yaml': EVALS, 'decisions.jsonl': so(SO_DONG, false) });
const G2 = hoSo('lon-cong-2', { 'contract.md': CONTRACT('lon-cong-2', 'verified'), 'evals.yaml': EVALS, 'decisions.jsonl': so(SO_DONG, true), 'evidence-report.md': REPORT('lon-cong-2', 'PASS') });
const G2B = hoSo('lon-chan', { 'contract.md': CONTRACT('lon-chan', 'verified'), 'evals.yaml': EVALS, 'evidence-report.md': REPORT('lon-chan', 'BLOCKED', LY_DO_DAI) });
const N1 = hoSo('nho-cong-1', { 'contract.md': CONTRACT('nho-cong-1', 'draft'), 'evals.yaml': EVALS, 'decisions.jsonl': so(2, false) });
const N2 = hoSo('nho-cong-2', { 'contract.md': CONTRACT('nho-cong-2', 'verified'), 'evals.yaml': EVALS, 'decisions.jsonl': so(2, true), 'evidence-report.md': REPORT('nho-cong-2', 'PASS') });
const N2B = hoSo('nho-chan', { 'contract.md': CONTRACT('nho-chan', 'verified'), 'evals.yaml': EVALS, 'evidence-report.md': REPORT('nho-chan', 'BLOCKED', 'thiếu một công cụ') });
const theArgs = (ws, extra) => ['--root', ws.root, '--slug', ws.slug, ...extra];

// Bốn chỗ thoát của gate-card, theo THỨ TỰ NGUỒN của chuỗi `return ghiRoiThoat(` (ma trận viết trước).
const DUONG = [
  { cho: 'trích Cổng 1', ws: G1, extra: ['--gate', '1', '--extract'], k: 0 },
  { cho: 'thẻ Cổng 1', ws: G1, extra: ['--gate', '1'], k: 1 },
  { cho: 'trích Cổng 2', ws: G2, extra: ['--gate', '2', '--extract'], k: 2 },
  { cho: 'thẻ Cổng 2 chưa-ký', ws: G2B, extra: ['--gate', '2'], k: 3 },
];

// ── bản sao + mutant ─────────────────────────────────────────────────
const THU_MUC_THE = ['scripts', 'lib', 'skills'];
function banSao(thuMuc, tepRel, bienDoi) {
  const d = mk('sao-');
  for (const t of thuMuc) fs.cpSync(path.join(ROOT, t), path.join(d, t), { recursive: true });
  const dich = path.join(d, tepRel);
  if (bienDoi) {
    const s = fs.readFileSync(dich, 'utf8');
    const moi = bienDoi(s);
    if (moi === s) throw new Error(`${KHONG_AP}: bản sao ${tepRel} không khác bản gốc`);
    fs.writeFileSync(dich, moi);
  }
  const chk = spawnSync(process.execPath, ['--check', dich], { encoding: 'utf8' });
  if (chk.status !== 0) throw new Error(`bản sao ${tepRel} không qua node --check: ${chk.stderr.slice(0, 200)}`);
  return dich;
}
const CHO = 'return ghiRoiThoat(';
const DINH_NGHIA = 'const ghiRoiThoat = ';
const GHI_NGAY = 'const ghiNgay = (noiDung, ma) => { process.stdout.write(noiDung); process.exit(ma); };\n';
// Đưa các chỗ thứ k (theo thứ tự nguồn) về «ghi rồi process.exit ngay» — khuôn trước khi sửa.
function hoanNguyen(s, cacK) {
  const phan = s.split(CHO);
  if (phan.length - 1 !== DUONG.length) throw new Error(`${KHONG_AP}: "${CHO}" xuất hiện ${phan.length - 1} lần (cần ${DUONG.length})`);
  if (s.split(DINH_NGHIA).length !== 2) throw new Error(`${KHONG_AP}: "${DINH_NGHIA}" không xuất hiện đúng một lần`);
  let out = phan[0];
  for (let i = 1; i < phan.length; i += 1) out += (cacK.includes(i - 1) ? 'return ghiNgay(' : CHO) + phan[i];
  return out.replace(DINH_NGHIA, GHI_NGAY + DINH_NGHIA);
}
const HAM_SUA = 'const ghiRoiThoat = (noiDung, ma) => { process.stdout.write(noiDung, () => process.exit(ma)); };';
const HAM_EXITCODE = 'const ghiRoiThoat = (noiDung, ma) => { process.stdout.write(noiDung); process.exitCode = ma; };';
const khuonExitCode = (s) => {
  if (s.split(HAM_SUA).length !== 2) throw new Error(`${KHONG_AP}: hàm ghiRoiThoat không đúng khuôn đã sửa`);
  return s.replace(HAM_SUA, HAM_EXITCODE);
};

// ── bộ chạy ca ───────────────────────────────────────────────────────
let passed = 0; let failed = 0; let khongDo = 0;
const KD = Symbol('khong-do');
const khongDoDuoc = (ly) => ({ [KD]: ly });
async function ca(id, ten, f) {
  const t0 = Date.now();
  try {
    const r = await f();
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    if (r && r[KD]) { khongDo += 1; console.log(`  ${id} ${KHONG_DO} — ${r[KD]} (${dt}s)`); return; }
    passed += 1; console.log(`  PASS: ${id} ${ten}${r ? ` — ${r}` : ''} (${dt}s)`);
  } catch (e) { failed += 1; console.log(`  FAIL: ${id} ${ten}\n    ${e.message}`); }
}
// Bản tệp thoả tiền đề cỡ, rồi bản pipe bằng nó từng byte.
function soQuaPipe(the, d, nhan) {
  const tep = quaTep([the, ...theArgs(d.ws, d.extra)]);
  if (tep.status !== 0) throw new Error(`${nhan}: bản tệp mã ${tep.status} — ${tep.stderr.slice(0, 200)}`);
  if (tep.stdout.length < CO_MIN) throw new Error(`${nhan}: tiền đề cỡ hỏng — bản tệp ${tep.stdout.length} byte < ${CO_MIN}`);
  const p = quaPipe([the, ...theArgs(d.ws, d.extra)]);
  if (!bangNhau(p, tep.stdout, 0)) throw new Error(`${nhan}: ${nhanByte(p.stdout.length, tep.stdout.length)}, mã ${p.status}`);
  return { tep, p };
}

// ── XD-1..XD-3: độ nhạy trên cây thật ────────────────────────────────
await ca('XD-1', 'thẻ Cổng 1 > 64 KB qua pipe bằng bản tệp', () => {
  const { tep } = soQuaPipe(CARD, DUONG[1], 'thẻ Cổng 1');
  return `${tep.stdout.length} byte`;
});
await ca('XD-2', '--extract Cổng 1 và Cổng 2 > 64 KB qua pipe bằng bản tệp, JSON đọc được', () => {
  const co = [];
  for (const [d, gate] of [[DUONG[0], 1], [DUONG[2], 2]]) {
    const { p } = soQuaPipe(CARD, d, d.cho);
    const j = JSON.parse(p.stdout.toString('utf8'));
    if (j.gate !== gate) throw new Error(`${d.cho}: khoá gate = ${j.gate} (cần ${gate})`);
    co.push(`${d.cho} ${p.stdout.length} byte`);
  }
  return co.join(' · ');
});
await ca('XD-3', 'thẻ Cổng 2 chưa-ký-được và ký-được > 64 KB qua pipe bằng bản tệp', () => {
  const { p } = soQuaPipe(CARD, DUONG[3], 'thẻ Cổng 2 chưa-ký');
  if (!p.stdout.toString('utf8').includes('CHƯA ký được')) throw new Error('thẻ Cổng 2 BLOCKED không mang «CHƯA ký được»');
  const kyDuoc = { cho: 'thẻ Cổng 2 ký-được', ws: G2, extra: ['--gate', '2'] };
  const r = soQuaPipe(CARD, kyDuoc, kyDuoc.cho);
  if (r.p.stdout.toString('utf8').includes('CHƯA ký được')) throw new Error('thẻ Cổng 2 PASS lại là thẻ chưa-ký-được — fixture sai');
  return `chưa-ký ${p.stdout.length} byte · ký-được ${r.p.stdout.length} byte`;
});

// ── XD-4: ma trận 4 × 4 ──────────────────────────────────────────────
const saoLanh = banSao(THU_MUC_THE, CARD_REL, null);
await ca('XD-4', 'ma trận 4 × 4 — hoàn nguyên đúng một chỗ thì đúng đường của chỗ ấy bị cắt', () => {
  const ref = DUONG.map((d) => {
    const t = quaTep([saoLanh, ...theArgs(d.ws, d.extra)]);
    if (t.status !== 0) throw new Error(`bản sao CHƯA tiêm, ${d.cho}: bản tệp mã ${t.status}`);
    return t.stdout;
  });
  const nhoNhat = Math.min(...ref.map((b) => b.length));
  if (!NEN_CAT || nhoNhat < CO_MIN) return khongDoDuoc(`dò nhận ${N_DO} / ${P_DO} byte, fixture nhỏ nhất ${nhoNhat} byte (cần ≥ ${CO_MIN} trên nền cắt)`);
  DUONG.forEach((d, j) => {
    const r = quaPipe([saoLanh, ...theArgs(d.ws, d.extra)]);
    if (!bangNhau(r, ref[j], 0)) throw new Error(`bản sao CHƯA tiêm lệch ở ${d.cho}: ${nhanByte(r.stdout.length, ref[j].length)}, mã ${r.status}`);
  });
  const loi = []; let o = 0;
  for (const dk of DUONG) {
    const sao = banSao(THU_MUC_THE, CARD_REL, (s) => hoanNguyen(s, [dk.k]));
    DUONG.forEach((d, j) => {
      o += 1;
      const r = quaPipe([sao, ...theArgs(d.ws, d.extra)]);
      if (d.k === dk.k) {
        if (catDung(r, ref[j], 0)) console.log(`    · hoàn nguyên ${dk.cho}: ${nhanByte(r.stdout.length, ref[j].length)} — đỏ đúng`);
        else loi.push(`ô chéo ${dk.cho}: không bị cắt như mong đợi — ${nhanByte(r.stdout.length, ref[j].length)}, mã ${r.status}`);
      } else if (!bangNhau(r, ref[j], 0)) loi.push(`ô ${dk.cho} × ${d.cho}: lệch — ${nhanByte(r.stdout.length, ref[j].length)}, mã ${r.status}`);
    });
  }
  if (o !== DUONG.length * DUONG.length) loi.push(`đã so ${o} ô (cần ${DUONG.length * DUONG.length})`);
  if (loi.length) throw new Error(loi.join('\n    '));
  return `${o} ô`;
});

// ── XD-5: đối chứng dương — đầu ra nhỏ không đổi byte nào ─────────────
const NHO = [
  { ten: 'nhỏ thẻ Cổng 1', ws: N1, extra: ['--gate', '1'] },
  { ten: 'nhỏ trích Cổng 1', ws: N1, extra: ['--gate', '1', '--extract'] },
  { ten: 'nhỏ thẻ Cổng 2 ký-được', ws: N2, extra: ['--gate', '2'] },
  { ten: 'nhỏ trích Cổng 2', ws: N2, extra: ['--gate', '2', '--extract'] },
  { ten: 'nhỏ thẻ Cổng 2 chưa-ký', ws: N2B, extra: ['--gate', '2'] },
];
// Ba hồ sơ thật ĐẦU TIÊN theo thứ tự chữ mà cả hai cổng render được thẻ dưới mốc 64 KB.
function baHoSoThat() {
  const acc = path.join(ROOT, '_acceptance');
  const ds = fs.readdirSync(acc).filter((s) => fs.existsSync(path.join(acc, s, 'contract.md'))).sort();
  const chon = [];
  for (const s of ds) {
    const t = ['1', '2'].map((g) => quaTep([CARD, '--root', ROOT, '--slug', s, '--gate', g]));
    if (t.every((x) => x.status === 0 && x.stdout.length >= 1024 && x.stdout.length < 65536 && x.stdout.includes('class="gc"'))) {
      chon.push({ slug: s, co: t.map((x) => x.stdout.length) });
      if (chon.length === 3) break;
    }
  }
  if (chon.length < 3) throw new Error(`chỉ tìm được ${chon.length} hồ sơ thật thoả tiền đề (cần 3): ${chon.map((c) => c.slug).join(', ')}`);
  return chon;
}
function soNho(saoSua, saoCu, that) {
  const muc = [...NHO.map((n) => ({ ten: n.ten, args: theArgs(n.ws, n.extra), nho: true })),
    ...that.flatMap((h) => ['1', '2'].map((g) => ({ ten: `${h.slug} Cổng ${g}`, args: ['--root', ROOT, '--slug', h.slug, '--gate', g] })))];
  for (const m of muc) {
    const tepSua = quaTep([saoSua, ...m.args]);
    if (m.nho && tepSua.stdout.length >= 65536) throw new Error(`${m.ten}: tiền đề «nhỏ» hỏng — ${tepSua.stdout.length} byte`);
    const pSua = quaPipe([saoSua, ...m.args]);
    const pCu = quaPipe([saoCu, ...m.args]);
    const tepThat = quaTep([CARD, ...m.args]);
    const lech = [];
    if (!pSua.stdout.equals(tepSua.stdout)) lech.push(`bản sửa pipe ≠ tệp (${pSua.stdout.length} / ${tepSua.stdout.length})`);
    if (!pSua.stdout.equals(pCu.stdout)) lech.push(`bản sửa ≠ bản hoàn nguyên (${pSua.stdout.length} / ${pCu.stdout.length})`);
    if (!tepSua.stdout.equals(tepThat.stdout)) lech.push(`bản sao ≠ cây thật (${tepSua.stdout.length} / ${tepThat.stdout.length})`);
    if (new Set([pSua.status, pCu.status, tepSua.status, tepThat.status]).size !== 1) lech.push(`mã thoát khác nhau: ${[pSua.status, pCu.status, tepSua.status, tepThat.status].join('/')}`);
    if (lech.length) throw new Error(`lệch byte ở ${m.ten}: ${lech.join('; ')}`);
  }
  return muc.length;
}
await ca('XD-5', 'đầu ra nhỏ (5 đường + 3 hồ sơ thật × 2 cổng) không đổi byte nào', () => {
  const that = baHoSoThat();
  const saoCu = banSao(THU_MUC_THE, CARD_REL, (s) => hoanNguyen(s, DUONG.map((d) => d.k)));
  const cap = soNho(saoLanh, saoCu, that);
  // Chiều đỏ của phép so: một byte thừa ở thẻ Cổng 1 phải bị bắt.
  const saoLech = banSao(THU_MUC_THE, CARD_REL, (s) => s.replace("return ghiRoiThoat(P.join('\\n'), 0);", "return ghiRoiThoat(P.join('\\n') + 'X', 0);"));
  let bat = '';
  try { soNho(saoLech, saoCu, that); } catch (e) { bat = e.message; }
  if (!bat.includes('lệch byte')) throw new Error(`chiều đỏ của phép so không đỏ (ra: ${bat || 'không lỗi'})`);
  return `${cap} cặp · hồ sơ thật ${that.map((h) => `${h.slug} ${h.co.join('/')} B`).join(', ')} · chiều đỏ bắt «lệch byte»`;
});

// ── XD-6: người đọc đóng sớm ─────────────────────────────────────────
await ca('XD-6', 'người đọc đóng sớm — mã 0, không EPIPE; khuôn exitCode thì sập', async () => {
  const args = theArgs(G1, ['--gate', '1']);
  for (const [ten, the] of [['cây thật', CARD], ['bản sao chưa tiêm', saoLanh]]) {
    const r = await dongSom([the, ...args]);
    if (r.code !== 0 || /EPIPE/.test(r.err)) throw new Error(`${ten}: đóng sớm → mã ${r.code}${r.sig ? ` (tín hiệu ${r.sig})` : ''}, stderr: ${r.err.slice(0, 160)}`);
  }
  if (!EPIPE_SAP) return khongDoDuoc(`chiều đỏ: dò khuôn exitCode không sập (mã ${doEpipe.code})`);
  const saoEc = banSao(THU_MUC_THE, CARD_REL, khuonExitCode);
  const r = await dongSom([saoEc, ...args]);
  if (!(r.code !== 0 && /EPIPE/.test(r.err))) throw new Error(`chiều đỏ không đỏ: bản sao exitCode → mã ${r.code}, stderr tiến trình con ${/EPIPE/.test(r.err) ? 'có' : 'KHÔNG có'} EPIPE`);
  return `bản sao exitCode: mã ${r.code}, stderr tiến trình con có EPIPE — đỏ đúng`;
});

// ── XD-7: repin-lane, nhánh làn ghim lại đỏ ──────────────────────────
const CONFIG_LAN = `schema_version: 1
enforcement: strict
recheck: strict
gap_probe: off
feature_loop:
  suite_keys:
    - executors.test.suite
executors:
  test:
    suite: "bash suite.sh"
`;
const EVALS_LAN = (slug) => `schema_version: 1
slug: ${slug}

evals:
  - id: E1
    criterion: AC-a
    executor: test
    cmd: config:executors.test.suite
    expected: >
      Xanh: suite exit 0.
`;
const REPORT_LAN = (slug, vc, verifier) => `---
schema_version: 1
feature_slug: ${slug}
verdict: PASS
verified_commit: ${vc}
human_signoff: Nguoi Ky 2026-10-11
---

## Evidence
- eval: E1
  run_id: ${slug}-E1-001
  exit_code: 0
  verifier: ${verifier}
  verified_at: 2026-10-11

## Iterations
`;
function khoLan(slugs) {
  const root = mk('kho-lan-');
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  fs.mkdirSync(path.join(root, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(root, '_acceptance', 'config.yaml'), CONFIG_LAN);
  fs.writeFileSync(path.join(root, 'suite.sh'), 'exit 1\n');
  for (const s of slugs) {
    const ws = path.join(root, '_acceptance', s);
    fs.mkdirSync(ws, { recursive: true });
    fs.writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: ${s}\nslug: ${s}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\napproved_by: Nguoi Ky\napproved_at: 2026-10-11\n---\n\n# Contract\n\n## Criteria\n\n- AC-a: Given a, When b, Then c.\n`);
    fs.writeFileSync(path.join(ws, 'evals.yaml'), EVALS_LAN(s));
  }
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const head0 = git('rev-parse', 'HEAD').trim();
  for (const s of slugs) {
    const ws = path.join(root, '_acceptance', s);
    fs.writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-10-11T00:00:00Z', round: 1, evalId: 'E1', run_id: `${s}-E1-001`, exit_code: 0, cmd: 'bash suite.sh' }) + '\n');
    fs.writeFileSync(path.join(ws, 'evidence-report.md'), REPORT_LAN(s, head0, path.join(root, 'suite.sh')));
  }
  git('add', '-A'); git('commit', '-qm', 'evidence');
  return root;
}
// Giá trị theo lượt (giờ, số đo thời gian/tải) đổi giữa hai lần chạy: so tiền tố sau khi đưa mọi số về
// một ký hiệu và bỏ đuôi 32 byte (ký tự/số bị cắt dở).
const chuanSo = (s) => s.replace(/\d+(\.\d+)?/g, '#');
await ca('XD-7', 'repin-lane làn ghim lại đỏ > 64 KB qua pipe — JSON đọc được, đủ slug, mã 1', () => {
  // Lý do giữ ~80 KB (dưới trần 128 KB một đối số của Linux); nền cắt sâu hơn thì thêm slug.
  const slugs = Array.from({ length: Math.ceil(2 * HE_SO) }, (_, i) => `lan-${String.fromCharCode(97 + i)}`);
  const kho = khoLan(slugs);
  const lyDo = `ca xa stdout — ${CHU.repeat(1100)}`;
  const args = (lane) => [lane, '--root', kho, '--ag-root', ROOT, ...slugs.flatMap((s) => ['--slug', s]), '--reason', lyDo, '--run-id', 'xdqp-lan-1'];
  const saoLan = banSao(['feature-loop'], LANE_REL, null);
  const ref = {};
  for (const [ten, lane] of [['cây thật', LANE], ['bản sao chưa tiêm', saoLan]]) {
    const tep = quaTep(args(lane));
    if (tep.status !== 1) throw new Error(`${ten}: bản tệp mã ${tep.status} (cần 1) — ${tep.stderr.slice(-200)}`);
    if (tep.stdout.length < CO_MIN) throw new Error(`${ten}: tiền đề cỡ hỏng — bản tệp ${tep.stdout.length} byte < ${CO_MIN}`);
    const p = quaPipe(args(lane));
    if (p.status !== 1) throw new Error(`${ten}: qua pipe mã ${p.status} (cần 1)`);
    if (!p.stderr.includes('LÀN ĐỎ')) throw new Error(`${ten}: stderr không có «LÀN ĐỎ»`);
    let j;
    try { j = JSON.parse(p.stdout.toString('utf8')); } catch (e) { throw new Error(`${ten}: JSON không đọc được — ${nhanByte(p.stdout.length, tep.stdout.length)}`); }
    for (const s of slugs) {
      if (!j.slugs || !j.slugs[s]) throw new Error(`${ten}: thiếu slug ${s} trong JSON`);
      if (!String(j.slugs[s].section || '').includes(lyDo)) throw new Error(`${ten}: section của ${s} không chứa trọn lý do`);
    }
    if (chuanSo(p.stdout.toString('utf8')) !== chuanSo(tep.stdout.toString('utf8'))) throw new Error(`${ten}: bản pipe khác bản tệp sau chuẩn hoá số`);
    ref[ten] = tep.stdout.toString('utf8');
  }
  if (!NEN_CAT) return khongDoDuoc(`chiều đỏ: dò nhận ${N_DO} / ${P_DO} byte`);
  const saoCat = banSao(['feature-loop'], LANE_REL, (s) => {
    if (s.split('await xaRoiThoat(1);').length !== 2) throw new Error(`${KHONG_AP}: "await xaRoiThoat(1);" không xuất hiện đúng một lần`);
    return s.replace('await xaRoiThoat(1);', 'process.exit(1);');
  });
  const r = quaPipe(args(saoCat));
  const m = Buffer.byteLength(ref['bản sao chưa tiêm']);
  const nhan = r.stdout.toString('utf8');
  const dau = chuanSo(nhan.slice(0, Math.max(0, nhan.length - 32)));
  const laTienTo = dau.length > 0 && chuanSo(ref['bản sao chưa tiêm']).startsWith(dau);
  if (!(r.status === 1 && r.stdout.length > 0 && r.stdout.length < m && laTienTo)) throw new Error(`chiều đỏ không đỏ: bản sao exit ngay → ${nhanByte(r.stdout.length, m)}, mã ${r.status}, tiền tố ${laTienTo ? 'khớp' : 'KHÔNG khớp'}`);
  return `bản sao exit ngay: ${nhanByte(r.stdout.length, m)} — đỏ đúng`;
});

console.log(`xuat-du-qua-pipe: ${passed} PASS · ${failed} FAIL · ${khongDo} ${KHONG_DO}`);
process.exitCode = failed ? 1 : 0;
