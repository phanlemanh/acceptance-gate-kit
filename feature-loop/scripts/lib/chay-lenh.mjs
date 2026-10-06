// chay-lenh.mjs — chạy MỘT lệnh bash của làn ghim lại trong nhóm tiến trình riêng, và dừng nó sạch:
// thu CẢ CÂY hậu duệ theo ppid TRƯỚC khi gửi tín hiệu, SIGTERM rồi SIGKILL (hồ sơ gia-lan-ghim-lai,
// AC-2/AC-3).
//
// Vì sao thu cây theo ppid chứ không chỉ theo nhóm: làn có thể LỒNG — một eval của kho tiêu thụ chạy
// chính repin-lane.mjs (crm, rang/ho-so-cham.mjs đến 06/10). Làn trong mở nhóm detached riêng cho
// lệnh của nó, nên tín hiệu gửi theo nhóm của làn ngoài không tới đó; và nếu làn ngoài SIGKILL làn
// trong ở giây 10 thì hẹn giờ SIGKILL của làn trong chết theo. Danh sách thu TRƯỚC là thứ không phụ
// thuộc vào ai còn sống. Giới hạn khai: tiến trình tách hẳn khỏi cây (double-fork, cha thành 1) vẫn
// thoát lưới.
import { spawn, spawnSync } from 'node:child_process';

export const SIGKILL_SAU_MS = 10000;
const ngu = (ms) => new Promise(r => setTimeout(r, ms));

function docPs() {
  const r = spawnSync('ps', ['-A', '-o', 'pid=,ppid='], { encoding: 'utf8' });
  const m = new Map();
  for (const l of String(r.stdout || '').split('\n')) {
    const t = l.trim().split(/\s+/);
    if (t.length === 2 && /^\d+$/.test(t[0]) && /^\d+$/.test(t[1])) m.set(Number(t[0]), Number(t[1]));
  }
  return m;
}
function hauDue(goc, ps) {
  const con = new Map();
  for (const [pid, ppid] of ps) { if (!con.has(ppid)) con.set(ppid, []); con.get(ppid).push(pid); }
  const ra = [goc]; const hang = [goc];
  while (hang.length) for (const c of con.get(hang.shift()) || []) { ra.push(c); hang.push(c); }
  return ra;
}
// Hai lần đọc cách 100 ms rồi hợp lại: máy nặng có thể chưa liệt một tiến trình vừa sinh ở lần đầu.
export async function thuCay(pid) {
  const a = hauDue(pid, docPs());
  await ngu(100);
  const b = hauDue(pid, docPs());
  return [...new Set([...a, ...b])];
}
const song = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
const guiCa = (pids, sig) => { for (const p of pids) { try { process.kill(p, sig); } catch { /* đã chết */ } } };

export async function dungCay(pids, { sigkillSauMs = SIGKILL_SAU_MS } = {}) {
  guiCa(pids, 'SIGTERM');
  const han = Date.now() + sigkillSauMs;
  while (Date.now() < han && pids.some(song)) await ngu(50);
  guiCa(pids.filter(song), 'SIGKILL');
  await ngu(200);
  return { chet: pids.filter(p => !song(p)), con_song: pids.filter(song) };
}

// → { pid, done: Promise<{exit, out, err, ms, bi_dung}>, dung(): Promise<{chet, con_song}> }
export function chayLenh(cmd, { cwd, env } = {}) {
  const t0 = Date.now();
  const out = [], err = [];
  let biDung = false;
  const p = spawn('bash', ['-c', cmd], { cwd, env: env || process.env, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  p.stdout.on('data', d => { out.push(d); });
  p.stderr.on('data', d => { err.push(d); });
  let loiKhoi = '';
  p.on('error', e => { loiKhoi = String((e && e.message) || e); });
  const done = new Promise(res => p.on('close', code => res({
    exit: code === null ? 1 : code,
    out: Buffer.concat(out).toString('utf8'),
    err: Buffer.concat(err).toString('utf8') + (loiKhoi ? `\n${loiKhoi}` : ''),
    ms: Date.now() - t0,
    bi_dung: biDung,
  })));
  const dung = async () => {
    biDung = true;
    const cay = await thuCay(p.pid);
    try { process.kill(-p.pid, 'SIGTERM'); } catch { /* nhóm đã tan */ }
    const r = await dungCay(cay);
    try { process.kill(-p.pid, 'SIGKILL'); } catch { /* */ }
    return r;
  };
  return { pid: p.pid, done, dung };
}
