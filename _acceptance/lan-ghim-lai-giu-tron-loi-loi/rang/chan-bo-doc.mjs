// E4 (AC-4) — mọi bộ đọc run-log im trước dấu lượt đỏ + wall_s/so_lenh; mỗi bộ đọc có đối chứng dương.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { dungKho, chayLan, banSao, bao, KIT } from './kho-mau.mjs';
import { BO_DOC } from './bo-doc.mjs';
const { ok, ket } = bao('E4');
// (1) danh sách bộ đọc RÚT từ mã
const rut = execFileSync('bash', ['-c', `cd "$1" && grep -rl "run-log.jsonl" scripts lib feature-loop/scripts | grep -v -E "test|\\.md$" | sort`, '_', KIT], { encoding: 'utf8' }).split('\n').filter(Boolean);
ok(rut.length > 0, `E4 rút được bộ đọc run-log từ mã (${rut.length})`);
const coHang = new Set(BO_DOC.map(b => b.tep));
for (const t of rut) ok(coHang.has(t), `E4 bộ đọc ${t} có hàng trong bảng (thiếu → «bộ đọc chưa đo»)`);
ok(BO_DOC.length === rut.length, `E4 số hàng bảng = số bộ đọc rút được (${BO_DOC.length} vs ${rut.length})`);
// (2) mỗi bộ đọc: sạch == có dòng mới; làm nhiễu → khác
const lam = () => dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: ['true'], scripts: { rang_ok: 'true' } });
const LOG = (k) => path.join(k.R, '_acceptance/feat/run-log.jsonl');
// Bản «không có» phải KHÔNG có thật (lượt chấm 2, t4/t6): kho mẫu ghi pin bằng làn MỚI nên dòng pin
// mang sẵn wall_s/so_lenh — gỡ hai khoá khỏi mọi dòng pin trước khi dựng ba bản so.
const goKhoaMoi = (k) => { const ls = readFileSync(LOG(k), 'utf8').split('\n').map(l => { if (!l.includes('"kind":"repin"')) return l; const o = JSON.parse(l); delete o.wall_s; delete o.so_lenh; return JSON.stringify(o); }); writeFileSync(LOG(k), ls.join('\n')); };
const themMoi = (k) => {
  const ls = readFileSync(LOG(k), 'utf8').split('\n');
  const i = ls.map(l => l.includes('"kind":"repin"')).lastIndexOf(true);
  const o = JSON.parse(ls[i]); o.wall_s = 812.4; o.so_lenh = 3; ls[i] = JSON.stringify(o);
  writeFileSync(LOG(k), ls.join('\n'));
  appendFileSync(LOG(k), JSON.stringify({ ts: '2026-10-03T00:00:00Z', kind: 'repin-do', run_id: 'repin-x', sha: 'b'.repeat(40), suites_exit: [1], evals_exit: { E1: 0 }, lenh_do: [{ cmd: 'x', exit: 1, log: '.acceptance-runs/feat/repin-x/01-x.log' }], cham: [], wall_s: 3.2, so_lenh: 2, tai: { load1: 9.1, load5: 8, ncpu: 14, mem_free_mb: 500, swap_used_mb: 4400, nen: null } }) + '\n');
};
const nhieu = (k, kieu) => {
  if (kieu === 'xoa-log') rmSync(LOG(k));
  if (kieu === 'sha-pin') { const s = readFileSync(LOG(k), 'utf8'); writeFileSync(LOG(k), s.replace(/("kind":"repin","run_id":"[^"]+","sha":")[0-9a-f]{40}/, `$1${'c'.repeat(40)}`)); }
  if (kieu === 'them-tally') appendFileSync(LOG(k), JSON.stringify({ ts: '2026-10-03T00:00:01Z', kind: 'round-tally', round: 1, verdict: 'BLOCKED', mo_ta: 'x' }) + '\n');
  if (kieu === 'them-hai-tally') for (const r of [1, 2]) appendFileSync(LOG(k), JSON.stringify({ ts: `2026-10-03T00:00:0${r}Z`, kind: 'round-tally', round: r, sha: 'e'.repeat(40), verdict: 'PASS' }) + '\n');
  if (kieu === 'them-cay-doi') { appendFileSync(LOG(k), JSON.stringify({ ts: '2026-10-03T00:00:05Z', kind: 'round-tally', round: 1, verdict: 'PASS' }) + '\n'); appendFileSync(LOG(k), JSON.stringify({ ts: '2026-10-03T00:00:06Z', kind: 'cay-doi', round: 1, luot_ts: '2026-10-03T00:00:05Z', tep: ['src/a.js'], commit: [] }) + '\n'); }
  if (kieu === 'them-panel') appendFileSync(LOG(k), JSON.stringify({ ts: '2026-10-03T00:00:01Z', kind: 'panel', evalId: 'E9', proposal: 'PASS', votes: [{ verdict: 'PASS' }, { verdict: 'PASS' }, { verdict: 'FAIL' }] }) + '\n');
  if (kieu === 'them-baseline') { const h = createHash('sha256').update(readFileSync(path.join(k.R, '_acceptance/feat/evals.yaml'), 'utf8')).digest('hex'); appendFileSync(LOG(k), JSON.stringify({ ts: '2026-10-03T00:00:01Z', kind: 'baseline', evals_hash: h, round: 1, non_discriminating: ['E1'] }) + '\n'); }
  if (kieu === 'them-thuoc-vat-hong') appendFileSync(LOG(k), '{"kind":"thuoc-vat","hong":\n');
  if (kieu === 'eval-pin-do') { const s = readFileSync(LOG(k), 'utf8'); writeFileSync(LOG(k), s.replace(/("kind":"repin"[^\n]*"evals_exit":\{"E1":)0/, '$11')); }
};
const chuan = (s) => s.replace(/\/[^\s"']*\/gtll-[A-Za-z0-9]+/g, '<KHO>').replace(/gtll-[A-Za-z0-9]{6}/g, '<KHO>').replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g, '<TS>').replace(/repin-\d{8}T\d{6}Z-\d+/g, '<RUN>').replace(/\b[0-9a-f]{40}\b/g, '<SHA>').replace(/\b[0-9a-f]{7}\b/g, '<sha>');
let soHang = 0;
for (const b of BO_DOC) {
  const k1 = lam(), k2 = lam(), k3 = lam();
  for (const k of [k1, k2, k3]) goKhoaMoi(k);
  // k1 sạch · k2 có dòng mới · k3 làm nhiễu (bên viết: k3 = có dòng mới rồi làn --write xanh)
  themMoi(k2);
  if (soHang === 0) {
    ok(!/"wall_s"|"so_lenh"/.test(readFileSync(LOG(k1), 'utf8')), 'E4 bản sạch KHÔNG chứa wall_s/so_lenh (đối chứng thật sự vắng khoá)');
    ok(/"kind":"repin"[^\n]*"wall_s"[^\n]*"so_lenh"/.test(readFileSync(LOG(k2), 'utf8')), 'E4 bản có dòng mới CHỨA wall_s/so_lenh trên dòng pin');
  }
  let a, c, d;
  if (b.nhieu === 'noi') {
    themMoi(k3); k3.git('add', '-A'); k3.git('commit', '-qm', 'dau');
    const w = chayLan(KIT, k3, ['feat'], ['--reason', 'noi', '--write']);
    const ls = readFileSync(LOG(k3), 'utf8').split('\n').filter(Boolean);
    ok(w.status === 0 && JSON.parse(ls[ls.length - 1]).kind === 'repin' && ls.some(l => l.includes('"kind":"repin-do"')), `E4 ${b.tep}: bên viết nối dòng pin SAU dấu đỏ, giữ dấu (đối chứng dương)`);
    a = b.goi(k1); c = b.goi(k2);
  } else {
    a = b.goi(k1); c = b.goi(k2); nhieu(k3, b.nhieu); d = b.goi(k3);
    ok(chuan(d.out) !== chuan(a.out) || d.status !== a.status, `E4 ${b.tep}: làm nhiễu sổ (${b.nhieu}) → đầu ra đổi — bộ đọc ĐÃ đọc hồ sơ (đối chứng dương)`);
  }
  ok(a.status === c.status && chuan(a.out) === chuan(c.out), `E4 ${b.tep}: có dòng repin-do + wall_s/so_lenh → đầu ra + mã (${a.status}) BẰNG HỆT không có`);
  if (!(a.status === c.status && chuan(a.out) === chuan(c.out))) console.log('    --- sạch ---\n' + chuan(a.out).slice(0, 600) + '\n    --- có dòng mới ---\n' + chuan(c.out).slice(0, 600));
  soHang++; k1.don(); k2.don(); k3.don();
}
ok(soHang === rut.length, `E4 số bộ đọc đã đo = số rút được (${soHang})`);
// (3) chiều đỏ: bản sao đặt kind repin cho dấu đỏ → recheck đỏ
const k = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: ['echo DAU; exit 4'], scripts: { rang_ok: 'true' } });
const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: "kind: 'repin-do'", thanh: "kind: 'repin'" }]);
chayLan(sao, k, ['feat'], ['--reason', 'do', '--write']);
// Bộ kiểm lại chỉ đọc dòng pin được báo cáo trích → dòng pin giả không trích thì nó KHÔNG thấy (đo 03/10).
// Bộ đọc thấy được là bảng sức khoẻ vòng: nó đếm MỌI dòng pin là một làn ghim + một lượt hạ tầng đốt.
const lhSao = execFileSync(process.execPath, [path.join(KIT, 'scripts/loop-health.mjs'), '--root', k.R], { encoding: 'utf8' });
const kLanh = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: ['echo DAU; exit 4'], scripts: { rang_ok: 'true' } });
chayLan(KIT, kLanh, ['feat'], ['--reason', 'do', '--write']);
const lhLanh = execFileSync(process.execPath, [path.join(KIT, 'scripts/loop-health.mjs'), '--root', kLanh.R], { encoding: 'utf8' });
ok(chuan(lhSao) !== chuan(lhLanh), 'E4 chiều đỏ: dấu đỏ mang kind repin → bảng sức khoẻ vòng đếm thêm một làn ghim — «dấu đỏ giả làm pin» được thấy');
kLanh.don();
k.don();
function spawnSync2(f, a) { try { execFileSync(process.execPath, [f, a], { stdio: 'ignore' }); return 0; } catch (e) { return e.status; } }
ket();
