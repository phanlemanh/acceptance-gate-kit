// E6 (AC-6) — bộ đọc tải máy: gọi trực tiếp mô-đun của cây đang kiểm (đường suy từ vị trí tệp).
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdtempSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..', '..');
const MOD = path.join(KIT, 'feature-loop', 'scripts', 'tai-may.mjs');
let loi = 0; const ok = (c, m) => { if (!c) { loi++; console.log('  FAIL: ' + m); } else console.log('  PASS: ' + m); };
const nap = async (p) => import(pathToFileURL(p).href + '?t=' + Date.now());
const banSao = (tu, thanh) => {
  const D = mkdtempSync(path.join(tmpdir(), 'gtll-tai-')); const p = path.join(D, 'tai-may.mjs');
  cpSync(MOD, p); const s = readFileSync(p, 'utf8'); const n = s.split(tu).length - 1;
  if (n !== 1) throw new Error(`tiêm hụt: «${tu}» xuất hiện ${n} lần`);
  writeFileSync(p, s.replace(tu, thanh)); return p;
};
let m; try { m = await nap(MOD); } catch (e) { console.log('  FAIL: E6 mô-đun tải máy vắng hoặc không nạp được — ' + e.message.split('\n')[0]); process.exit(1); }
// (a) máy đang chạy
const t = m.docTai();
ok(typeof t.load1 === 'number' && typeof t.ncpu === 'number' && t.ncpu > 0, 'E6a load1, ncpu là số trên máy đang chạy');
ok(t.swap_used_mb === null ? typeof t.nen === 'string' && t.nen.length > 0 : typeof t.swap_used_mb === 'number', 'E6a swap là số, hoặc null kèm nen');
// (b) bảng ba dòng /proc/meminfo do code sinh
const BANG = [
  { tot: 2097148, free: 2097148, mb: 0 },
  { tot: 5242880, free: 524288, mb: 4608 },
  { tot: 1048576, free: 0, mb: 1024 },
];
let o = 0;
for (const r of BANG) { const txt = `MemTotal: 16000000 kB\nSwapCached: 0 kB\nSwapTotal: ${r.tot} kB\nSwapFree: ${r.free} kB\n`; ok(m.swapTuMeminfo(txt) === r.mb, `E6b meminfo SwapTotal ${r.tot} − SwapFree ${r.free} = ${r.mb} MB (được ${m.swapTuMeminfo(txt)})`); o++; }
ok(o === 3, 'E6b số ô bảng = 3 (số ô lệch)');
ok(m.swapTuMeminfo('MemTotal: 1 kB\n') === null, 'E6b meminfo thiếu dòng Swap → null');
// (c) nguồn swap không tồn tại — tiêm trong bản sao, chạy được hai nền
const sao = banSao("linux: '/proc/meminfo'", "linux: '/khong/ton/tai/meminfo'");
const sao2 = readFileSync(sao, 'utf8').replace("mac: ['sysctl', '-n', 'vm.swapusage']", "mac: ['/khong/ton/tai/sysctl', '-n', 'vm.swapusage']");
writeFileSync(sao, sao2);
const mc = await nap(sao); const tc = mc.docTai();
ok(tc.swap_used_mb === null && typeof tc.nen === 'string' && tc.nen.length > 0, `E6c nguồn swap không tồn tại → null + nen (đối chứng: phép tiêm có hiệu lực; nen=${tc.nen})`);
// chiều đỏ: bản sao không bắt lỗi đọc swap → phải ném (chứng try/catch là thứ giữ làn sống)
const saoDo = banSao('/* CATCH-SWAP */ } catch (e) {', '/* CATCH-SWAP */ } catch (e) { throw e;');
const sd = readFileSync(saoDo, 'utf8').replace("linux: '/proc/meminfo'", "linux: '/khong/ton/tai/meminfo'").replace("mac: ['sysctl'", "mac: ['/khong/ton/tai/sysctl'");
writeFileSync(saoDo, sd);
let nem = false; try { (await nap(saoDo)).docTai(); } catch { nem = true; }
ok(nem, 'E6 chiều đỏ: bản sao không bắt lỗi đọc swap → ném — «tải máy làm sập làn» được thước thấy');
// (c') ĐẦU RA của làn — không chỉ mô-đun (lượt chấm 1, t3/t9/t12): bản sao TRỌN feature-loop/ với
// nguồn swap hỏng ở cả hai nền → làn đỏ VẪN thoát 1 và VẪN để một dòng repin-do mang tai.nen.
const { dungKho, chayLan, banSao: saoLan } = await import('./kho-mau.mjs');
const HONG = [
  { tep: 'feature-loop/scripts/tai-may.mjs', tu: "linux: '/proc/meminfo'", thanh: "linux: '/khong/ton/tai/meminfo'" },
  { tep: 'feature-loop/scripts/tai-may.mjs', tu: "mac: ['sysctl', '-n', 'vm.swapusage']", thanh: "mac: ['/khong/ton/tai/sysctl', '-n', 'vm.swapusage']" },
];
const chayDo = (engine) => {
  const k = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: ['echo DO; exit 3'], scripts: { rang_ok: 'true' } });
  const truoc = k.doc('_acceptance/feat/run-log.jsonl');
  const r = chayLan(engine, k, ['feat'], ['--reason', 'do', '--write']);
  const moi = k.doc('_acceptance/feat/run-log.jsonl').slice(truoc.length).split('\n').filter(Boolean).map(l => JSON.parse(l));
  k.don(); return { r, moi };
};
const lanHong = chayDo(saoLan(HONG));
const dau = lanHong.moi.filter(o => o.kind === 'repin-do');
ok(lanHong.r.status === 1, `E6c' làn với nguồn swap hỏng VẪN thoát 1 (được ${lanHong.r.status})`);
ok(dau.length === 1 && dau[0].tai && dau[0].tai.swap_used_mb === null && typeof dau[0].tai.nen === 'string' && dau[0].tai.nen.length > 0, `E6c' VẪN để một dòng repin-do, tai.swap_used_mb null, tai.nen = «${dau[0] && dau[0].tai && dau[0].tai.nen}»`);
const lanSap = chayDo(saoLan([...HONG, { tep: 'feature-loop/scripts/tai-may.mjs', tu: '/* CATCH-SWAP */ } catch (e) {', thanh: '/* CATCH-SWAP */ } catch (e) { throw e;' }]));
ok(!(lanSap.r.status === 1 && lanSap.moi.some(o => o.kind === 'repin-do')), `E6c' chiều đỏ: bản sao gỡ chốt bắt lỗi → làn KHÔNG còn «thoát 1 + để dấu» (mã ${lanSap.r.status}, dấu ${lanSap.moi.filter(o => o.kind === 'repin-do').length}) — «tải máy làm sập làn» thấy ở ĐẦU RA làn`);
if (loi) { console.log(`E6 ĐỎ: ${loi} ca`); process.exit(1); }
console.log('E6 XANH');
