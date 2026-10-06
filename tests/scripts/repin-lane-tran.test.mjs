// repin-lane-tran.test.mjs — ca bền của hồ sơ gia-lan-ghim-lai cho Đ5: dừng lệnh sạch cả cây
// (AC-2 thư viện + làn), bị ngắt để dấu (AC-3), tổng kết cuối lượt (AC-4).
//   GG_CASES=AC2-B1,AC3-TERM node tests/scripts/repin-lane-tran.test.mjs
// Mỗi ca chờ DẤU DƯƠNG (tệp pid cháu đã có) trước khi kết luận «cháu đã chết» — vắng tệp pid là đỏ.
import path from 'node:path';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { mkKho, boKiem, ok, lenhChau, lenhChapChon, song, choPid, choChet, ngu, LANE, ROOT } from './gia-lan-fixture.mjs';

const { chayLenh, thuCay } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'lib', 'chay-lenh.mjs'));

const ALL = ['AC2-lib-giet-cay', 'AC2-lib-bay-term', 'AC2-lib-in-nhieu',
  'AC2-B1', 'AC2-B2', 'AC2-B3', 'AC2-B4', 'AC2-B5', 'AC2-B6', 'AC2-B7',
  'AC3-TERM', 'AC3-INT', 'AC3-HUP', 'AC3-khong-write-sach',
  'AC4-xanh', 'AC4-do', 'AC4-vuot-tran', 'AC4-bi-ngat', 'AC4-chi-phi-loi'];
const { ca, ket } = boKiem(ALL);
const TRAN = '0.25';              // 15 s — rộng so với thời gian khởi động làn, kể cả dưới tải lượt chấm
const TRAN_MS = 15000;
const dongCuoi = (stderr) => String(stderr).trim().split('\n').pop();
const repinDo = (k) => k.docLog().filter(l => l.kind === 'repin-do').pop();

// ── thư viện ────────────────────────────────────────────────────────────────
await ca('AC2-lib-giet-cay', 'thư viện: dung() giết cả cháu (thu cây trước khi gửi tín hiệu)', async () => {
  const dau = mkdtempSync(path.join(tmpdir(), 'gg-lib-'));
  const h = chayLenh(`sleep 60 & echo $! > "${dau}/chau.pid"; wait`, { env: process.env });
  const t = Date.now(); while (!existsSync(`${dau}/chau.pid`) && Date.now() - t < 20000) await ngu(50);
  ok(existsSync(`${dau}/chau.pid`), 'cháu chưa kịp sinh');
  const pid = Number(readFileSync(`${dau}/chau.pid`, 'utf8'));
  ok((await thuCay(h.pid)).includes(pid), 'ghim: thuCay không thấy cháu theo ppid');
  await h.dung(); await h.done;
  ok(await choChet(pid, 15000), 'ghim: cháu tiến trình sót');
});
await ca('AC2-lib-bay-term', 'thư viện: cháu bẫy SIGTERM chết sau SIGKILL (≥ 10 s, < 25 s)', async () => {
  const dau = mkdtempSync(path.join(tmpdir(), 'gg-lib-'));
  const h = chayLenh(`bash -c 'trap "" TERM; sleep 60' & echo $! > "${dau}/chau.pid"; wait`, { env: process.env });
  const t = Date.now(); while (!existsSync(`${dau}/chau.pid`) && Date.now() - t < 20000) await ngu(50);
  ok(existsSync(`${dau}/chau.pid`), 'cháu chưa kịp sinh');
  const pid = Number(readFileSync(`${dau}/chau.pid`, 'utf8'));
  await ngu(300);
  const t0 = Date.now(); await h.dung(); const ms = Date.now() - t0;
  ok(await choChet(pid, 3000), 'ghim: không SIGKILL — cháu bẫy TERM còn sống');
  ok(ms >= 9500 && ms < 25000, `thời gian dừng ${ms} ms ngoài [9,5 s; 25 s)`);
});
await ca('AC2-lib-in-nhieu', 'thư viện: lệnh in 300 000 dòng — gom đủ, không nổ bộ đệm', async () => {
  const h = chayLenh(`node -e "for(let i=0;i<300000;i++)console.log(i)"`, { env: process.env });
  const r = await h.done;
  ok(r.exit === 0, `exit ${r.exit}`);
  ok(r.out.split('\n').filter(Boolean).length === 300000, 'thiếu dòng đầu ra');
});

// ── làn: trần ───────────────────────────────────────────────────────────────
await ca('AC2-B1', 'trần chạm giữa lệnh có cháu → thoát 4, cháu chết, không pin', async () => {
  const k = mkKho({ suiteCmd: lenhChau() });
  const vc0 = k.docReport().match(/^verified_commit:\s*(\S+)/m)[1];
  const t0 = Date.now(); const r = k.lane(['--tran-phut', TRAN]); const ms = Date.now() - t0;
  const pid = await choPid(k);
  ok(r.status === 4, `ghim: trùng mã làn đỏ — mã ${r.status}\n${r.stderr}`);
  ok(ms < TRAN_MS + 15000, `dừng sau ${ms} ms`);
  ok(await choChet(pid, 2000), 'ghim: cháu tiến trình sót');
  ok(!k.docLog().some(l => l.kind === 'repin'), 'ghim: pin trên làn chưa xong');
  ok(k.docReport().match(/^verified_commit:\s*(\S+)/m)[1] === vc0, 'ghim: pin trên làn chưa xong (verified_commit đổi)');
});
await ca('AC2-B2', 'cháu bẫy SIGTERM → chết sau SIGKILL', async () => {
  const k = mkKho({ suiteCmd: lenhChau('chau.pid', { bayTerm: true }) });
  const t0 = Date.now(); const r = k.lane(['--tran-phut', TRAN]); const ms = Date.now() - t0;
  const pid = await choPid(k);
  ok(r.status === 4, `mã ${r.status}\n${r.stderr}`);
  ok(ms < TRAN_MS + 10000 + 15000, `dừng sau ${ms} ms`);
  ok(await choChet(pid, 2000), 'ghim: không SIGKILL — cháu bẫy TERM còn sống');
});
await ca('AC2-B3', 'làn LỒNG hai tầng → sau khi làn ngoài thoát 4, cháu tầng trong chết', async () => {
  const trong = mkKho({ suiteCmd: lenhChau('chau-trong.pid', { bayTerm: true }) });
  const ngoai = mkKho({ suiteCmd: `"${process.execPath}" "${LANE}" --root "${trong.root}" --ag-root "${ROOT}" --slug feat --tran-phut 5` });
  const r = ngoai.lane(['--tran-phut', TRAN], { env: { GG_DAU: trong.dau } });
  const pid = await choPid(trong, 'chau-trong.pid');
  ok(r.status === 4, `mã ${r.status}\n${r.stderr}`);
  ok(await choChet(pid, 2000), 'ghim: làn lồng sót cháu');
});
await ca('AC2-B4', '--write khi vượt trần → mỗi slug một dòng repin-do vuot-tran đủ trường', async () => {
  const k = mkKho({ suiteCmd: lenhChau() });
  const r = k.lane(['--tran-phut', TRAN, '--write']);
  await choPid(k);
  ok(r.status === 4, `mã ${r.status}`);
  const d = repinDo(k);
  ok(d && d.ly_do === 'vuot-tran', `không có repin-do vuot-tran: ${JSON.stringify(d)}`);
  ok(d.tran_phut === Number(TRAN), `tran_phut ${d.tran_phut}`);
  ok(typeof d.da_chay_phut === 'number' && d.da_chay_phut >= Number(TRAN) * 0.95, `da_chay_phut ${d.da_chay_phut}`);
  ok(Array.isArray(d.chua_chay) && d.chua_chay.includes('feat E1'), `chua_chay ${JSON.stringify(d.chua_chay)}`);
  ok(!k.docLog().some(l => l.kind === 'repin' && l.run_id), 'ghim: pin trên làn chưa xong');
});
await ca('AC2-B5', 'khoá repin_budget_min thay cờ; cờ thắng khoá', async () => {
  const k = mkKho({ suiteCmd: lenhChau(), config: `  repin_budget_min: ${TRAN}\n` });
  const r = k.lane([]);
  await choPid(k);
  ok(r.status === 4, `khoá không áp — mã ${r.status}`);
  const k2 = mkKho({ suite: 'sleep 2\nexit 0\n', config: `  repin_budget_min: 0.01\n` });
  const r2 = k2.lane(['--tran-phut', '5']);
  ok(r2.status === 0, `cờ không thắng khoá — mã ${r2.status}\n${r2.stderr}`);
});
await ca('AC2-B6', 'trần vắng → lệnh dài chạy hết, xanh', async () => {
  const k = mkKho({ suite: 'sleep 3\nexit 0\n' });
  const r = k.lane([]);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
});
await ca('AC2-B7', 'cờ 0/chữ → 3; khoá sai → 2', async () => {
  const k = mkKho();
  ok(k.lane(['--tran-phut', '0']).status === 3, '--tran-phut 0 không thoát 3');
  ok(k.lane(['--tran-phut', 'abc']).status === 3, '--tran-phut abc không thoát 3');
  const k2 = mkKho({ config: '  repin_budget_min: -1\n' });
  const r = k2.lane([]);
  ok(r.status === 2 && /repin_budget_min/.test(r.stderr), `khoá sai — mã ${r.status}: ${r.stderr}`);
});

// ── làn: bị ngắt ────────────────────────────────────────────────────────────
for (const [id, sig, ma] of [['AC3-TERM', 'SIGTERM', 143], ['AC3-INT', 'SIGINT', 130], ['AC3-HUP', 'SIGHUP', 129]]) {
  await ca(id, `${sig} giữa lệnh → thoát ${ma}, cháu chết, dòng repin-do bi-ngat`, async () => {
    const k = mkKho({ suiteCmd: lenhChau() });
    const { proc, xong } = k.laneNen(['--write']);
    const pid = await choPid(k);
    proc.kill(sig);
    const r = await xong;
    ok(r.status === ma, `mã ${r.status} (tín hiệu ${r.signal})\n${r.stderr}`);
    ok(await choChet(pid, 2000), 'ghim: cháu tiến trình sót');
    const d = repinDo(k);
    ok(d && d.ly_do === 'bi-ngat', 'ghim: ngắt không để vết');
    ok(d.tin_hieu === sig, `tin_hieu ${d.tin_hieu}`);
    ok(Array.isArray(d.chua_chay) && d.chua_chay.includes('feat E1'), `chua_chay ${JSON.stringify(d.chua_chay)}`);
  });
}
await ca('AC3-khong-write-sach', 'bị ngắt không --write → không tệp theo dõi nào đổi', async () => {
  const k = mkKho({ suiteCmd: lenhChau() });
  const { proc, xong } = k.laneNen([]);
  const pid = await choPid(k);
  proc.kill('SIGTERM');
  const r = await xong;
  ok(r.status === 143, `mã ${r.status}`);
  await choChet(pid, 2000);
  const doi = k.git('status', '--porcelain', '--untracked-files=no');
  ok(doi === '', `tệp theo dõi đổi:\n${doi}`);
});

// ── tổng kết ────────────────────────────────────────────────────────────────
const khoModel = (extra = {}) => {
  const k = mkKho({
    evals: [{ id: 'E1', cmd: 'rang_e1', body: 'echo 1 >> "$GG_DAU/tieu.txt"\nexit 0\n' }, { id: 'E2', cmd: 'rang_e2', body: 'echo 1 >> "$GG_DAU/tieu.txt"\nexit 0\n' }],
    config: `  model_evals: [feat/E1, feat/E2]\n  repin_cost_cmd: ${extra.cost || `'cat "$GG_DAU/tieu.txt" 2>/dev/null | wc -l'`}\n${extra.config || ''}`,
    ...extra.kho,
  });
  return k;
};
await ca('AC4-xanh', 'làn xanh: dòng TỔNG KẾT cuối + tong_ket, model gọi = chi phí đo = số lần chạy thật', async () => {
  const k = khoModel();
  const r = k.lane(['--write']);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
  const dong = dongCuoi(r.stderr);
  ok(/^\[lane\] TỔNG KẾT/.test(dong), `dòng cuối không phải tổng kết: ${dong}`);
  const goi = k.dem('tieu.txt');
  ok(goi === 2, `bộ đếm chi tiêu ${goi}`);
  ok(dong.includes(`eval model thật: gọi ${goi}, carry 0`), `ghim: đếm model sai — ${dong}`);
  ok(dong.includes(`chi phí đo: ${goi} `), `chi phí đo sai — ${dong}`);
  const tk = JSON.parse(r.stdout).tong_ket;
  ok(tk && tk.model_goi === goi && tk.model_carry === 0 && tk.chi_phi === goi && tk.ket_cuc === 'xanh', `tong_ket stdout ${JSON.stringify(tk)}`);
  const pin = k.docLog().filter(l => l.kind === 'repin').pop();
  ok(pin.tong_ket && pin.tong_ket.model_goi === goi, `tong_ket dòng repin ${JSON.stringify(pin.tong_ket)}`);
});
await ca('AC4-do', 'làn đỏ: vẫn có TỔNG KẾT cuối + repin-do.tong_ket', async () => {
  const k = khoModel({ kho: { suite: 'exit 1\n' } });
  const r = k.lane(['--write']);
  ok(r.status === 1, `mã ${r.status}`);
  ok(/^\[lane\] TỔNG KẾT/.test(dongCuoi(r.stderr)), 'ghim: tổng kết vắng ở làn đỏ');
  const d = repinDo(k);
  ok(d && d.tong_ket && d.tong_ket.ket_cuc === 'do', `ghim: tổng kết vắng ở làn đỏ — ${JSON.stringify(d && d.tong_ket)}`);
});
await ca('AC4-vuot-tran', 'vượt trần: tổng kết ket_cuc vuot-tran', async () => {
  const k = khoModel({ kho: { suiteCmd: lenhChau() } });
  const r = k.lane(['--tran-phut', TRAN, '--write']);
  await choPid(k);
  ok(r.status === 4, `mã ${r.status}`);
  ok(/^\[lane\] TỔNG KẾT .*vuot-tran/.test(dongCuoi(r.stderr)), `dòng cuối: ${dongCuoi(r.stderr)}`);
  ok(repinDo(k).tong_ket.ket_cuc === 'vuot-tran', 'tong_ket repin-do');
});
await ca('AC4-bi-ngat', 'bị ngắt: tổng kết ket_cuc bi-ngat', async () => {
  const k = khoModel({ kho: { suiteCmd: lenhChau() } });
  const { proc, xong } = k.laneNen(['--write']);
  await choPid(k); proc.kill('SIGTERM');
  const r = await xong;
  ok(/^\[lane\] TỔNG KẾT .*bi-ngat/.test(dongCuoi(r.stderr)), `dòng cuối: ${dongCuoi(r.stderr)}`);
  ok(repinDo(k).tong_ket.ket_cuc === 'bi-ngat', 'tong_ket repin-do');
});
await ca('AC4-chi-phi-loi', 'lệnh đo chi phí lỗi → «chi phí đo: lỗi (…)», kết cục không đổi', async () => {
  const k = khoModel({ cost: `'exit 1'` });
  const r = k.lane([]);
  ok(r.status === 0, `kết cục đổi — mã ${r.status}`);
  ok(/chi phí đo: lỗi \(/.test(dongCuoi(r.stderr)), `dòng cuối: ${dongCuoi(r.stderr)}`);
});

ket();
