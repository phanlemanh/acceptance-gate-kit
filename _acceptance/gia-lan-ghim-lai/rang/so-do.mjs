#!/usr/bin/env node
// so-do.mjs — AC-8 của hồ sơ gia-lan-ghim-lai: bảng trước → sau cho ba điểm của Vòng A trên fixture
// code-sinh. Hai hàng dựng lại hai kịch bản thật của R1g (crm, đêm 05–06/10):
//   Đ4 — ca chập chờn trong suite (`agent-okr app-rieng` hết giờ ở lần đầu, đạt ở lần sau);
//   Đ5 — làn bị ngắt giữa một lệnh có tiến trình cháu (trần 90 phút của công cụ, R1g 15:11);
// và Đ3 — lỗi chỉ hiện ở CI (`nang-luc: khong`: ca chỉ đỏ khi khoá rỗng).
// Mỗi hàng chạy «trước» rồi «sau» trên CÙNG kho; thoát 0 khi và chỉ khi mọi hàng đi đúng chiều đã hứa.
// «Sau» là làn của cây chứa tệp này (trong bản sao bị phá: làn bị phá); «trước» của Đ5 là bản BASE-GIA.
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { ROOT, baseGia, banSao, THU_MUC_BAN_MAY } from './ban-sao.mjs';

const { mkKho, lenhChapChon, lenhChau, choPid, song, ngu } = await import(path.join(ROOT, 'tests', 'scripts', 'gia-lan-fixture.mjs'));
const hang = [];
const themKhoa = (k, dong) => {
  const p = path.join(k.root, '_acceptance', 'config.yaml');
  writeFileSync(p, readFileSync(p, 'utf8').replace('feature_loop:\n', `feature_loop:\n${dong}`));
  k.git('add', '-A'); k.git('commit', '-qm', 'bat khoa');
};

// ── Đ4: ca chập chờn trong suite ────────────────────────────────────────────
{
  console.log('… [Đ4] ca chập chờn trong suite (app-rieng hết giờ lần đầu)');
  const k = mkKho({ suiteCmd: lenhChapChon('dem.txt', 'app-rieng chạy cạnh apps/agent [5000.00ms]') });
  const truoc = k.lane(['--write']);
  k.git('add', '-A'); k.git('commit', '-qm', 'sau lan truoc', '--allow-empty');
  k.xoaDau(); themKhoa(k, '  repin_retry: 1\n');
  const sau = k.lane(['--write']);
  const pin = k.docLog().filter(l => l.kind === 'repin').pop();
  const ca = sau.status === 0 && pin && pin.chap_chon ? pin.chap_chon.map(c => c.ca.join('; ')).join(' | ') : '—';
  hang.push({ ma: 'Đ4', ten: 'kết cục làn có một ca chập chờn', truoc: truoc.status === 0 ? 'xanh' : 'đỏ', sau: sau.status === 0 ? 'xanh' : 'đỏ', them: `tên ca trong báo cáo: ${ca}`, dung: truoc.status !== 0 && sau.status === 0 && /app-rieng/.test(ca) });
}

// ── Đ5: làn bị ngắt giữa lệnh có cháu ───────────────────────────────────────
{
  console.log('… [Đ5] làn bị SIGTERM giữa một lệnh có tiến trình cháu');
  const base = banSao(baseGia(), THU_MUC_BAN_MAY);
  const k = mkKho({ suiteCmd: lenhChau() });
  const ngat = async (o) => {
    k.xoaDau();
    const truocDong = k.docLog().filter(l => l.kind === 'repin-do' && l.ly_do === 'bi-ngat').length;
    const { proc, xong } = k.laneNen(['--write'], o);
    const pid = await choPid(k);
    proc.kill('SIGTERM'); await xong; await ngu(500);
    const sot = song(pid) ? 1 : 0;
    if (sot) { try { process.kill(pid, 'SIGKILL'); } catch { /* */ } }
    const dau = k.docLog().filter(l => l.kind === 'repin-do' && l.ly_do === 'bi-ngat').length - truocDong;
    k.git('checkout', '--', '.');
    return { dau, sot };
  };
  const truoc = await ngat({ laneFile: path.join(base, 'feature-loop', 'scripts', 'repin-lane.mjs'), agRoot: base });
  const sau = await ngat({});
  hang.push({ ma: 'Đ5', ten: 'dòng dấu bị ngắt · tiến trình sót', truoc: `${truoc.dau} · ${truoc.sot}`, sau: `${sau.dau} · ${sau.sot}`, them: '', dung: truoc.dau === 0 && sau.dau === 1 && sau.sot === 0 && truoc.sot === 1 });
}

// ── Đ3: lỗi chỉ hiện ở CI ───────────────────────────────────────────────────
{
  console.log('… [Đ3] ca chỉ đỏ khi khoá rỗng (như nang-luc: khong)');
  const k = mkKho({ files: { '.env': 'K=tu-file\n' }, suiteCmd: 'node --env-file=.env -e "process.exit(process.env.K ? 0 : 1)"' });
  const truoc = k.lane([], { env: { K: 'x' } });
  themKhoa(k, '  repin_ci_blank_env: [K]\n');
  const sau = k.lane([], { env: { K: 'x' } });
  hang.push({ ma: 'Đ3', ten: 'lỗi chỉ-CI làn bắt được', truoc: truoc.status === 1 ? 1 : 0, sau: sau.status === 1 ? 1 : 0, them: '', dung: truoc.status === 0 && sau.status === 1 });
}

console.log('\n| Điểm | Đo | Trước | Sau | Ghi chú |\n|---|---|---|---|---|');
for (const h of hang) console.log(`| ${h.ma} | ${h.ten} | ${h.truoc} | ${h.sau} | ${h.them} |`);
const sai = hang.filter(h => !h.dung);
if (sai.length) { console.log(`\n${sai.map(h => `${h.ma} không đổi số (trước ${h.truoc} · sau ${h.sau})`).join('\n')}`); process.exit(1); }
console.log('\nAC-8: ba hàng đi đúng chiều đã hứa');
