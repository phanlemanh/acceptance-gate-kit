#!/usr/bin/env node
// rang-ghim-lai.mjs — răng của hồ sơ release-2-16-0, chân `chien-dich`.
//
// Vì sao tồn tại: mốc này CHẠY chiến dịch ghim lại, thứ hai cửa sổ trước đã hoãn.
// Một chiến dịch là việc máy làm rồi kể lại bằng chữ trong hợp đồng; lời kể ấy
// không có thước thì nó là tin-suông — đúng lớp mà răng cửa sổ của mốc 2.15.0
// sinh ra để đóng cho hai lời khai khác. Răng này đóng lời khai thứ ba.
//
// ĐỔI KHUÔN Ở LƯỢT CHẤM 3 — hai bản trước đều HẰNG ĐÚNG, mỗi bản một kiểu:
//   · bản 1 cho lượt đỏ khai chữ «khong-co» rồi bỏ qua chính phép so;
//   · bản 2 đòi sha, run_id và mã thoát, nhưng ở nhánh làn-đỏ KHÔNG vật nào
//     trong kho mang run_id ấy (làn đỏ theo thiết kế không ghi gì), nên phép so
//     chạy trên tập rỗng: bộ chấm lượt 2 thử thật — bịa run_id, đổi sha sang
//     HEAD — và răng vẫn PASS cả hai lần.
// Cái sai chung của hai bản: chúng đi tìm vật ở nơi làn đỏ KHÔNG BAO GIỜ ghi.
// Bản này đổi chỗ đứng: lấy chính ĐẦU RA của làn làm vật, đặt nó trong hồ sơ
// (`chien-dich-ghim-lai.json`, nguyên văn JSON làn in ra stdout), rồi buộc vật
// ấy vào KHO bằng những quan hệ mà một tệp bịa không thoả được.
//
// Bốn quan hệ, tất cả đo được:
//   (1) Lời khai trong hợp đồng — sha · run_id · exit — BẰNG đúng ba trường ấy
//       trong vật. Hợp đồng thôi là nguồn; nó là bản sao phải khớp.
//   (2) Vật phủ ĐÚNG tập hồ sơ đã thông cổng của kho — không thiếu, không thừa.
//   (3) Với TỪNG hồ sơ, tập id eval trong vật BẰNG tập id eval máy của chính
//       `evals.yaml` hồ sơ ấy (trừ ô tự khai không-chạy). Đây là ràng buộc giết
//       hằng-đúng: một tệp bịa phải tái tạo đúng 741 id trên 72 tệp evals.
//   (4) Ba số mà hợp đồng kể ở Notes — số hồ sơ đỏ · số eval đỏ · số hồ sơ được
//       ghim — TÍNH TỪ VẬT, so với ba số khai trong khối. «Đỏ» đọc theo kỳ vọng
//       đã khai (`expectedExits`), không theo số 0, cùng luật với làn.
//   Cộng vế hai chiều cũ: exit 0 ⇒ có hồ sơ được ghim; exit khác 0 ⇒ KHÔNG hồ sơ
//   đã ký nào mang run_id ấy trong sổ chạy.
//
// Hai trạng thái «đã thông cổng» và danh sách eval máy hỏi ĐÚNG MỘT NGUỒN —
// `DA_THONG_CONG_2` của `lib/workspace-record.cjs`, `parseEvals`/`expectedExits`
// của `lib/eval-yaml.cjs` — không gõ tay. Bài học 2.15.0 AC-8.
//
// NEO: không có. Răng đọc mọi thứ từ vật và từ kho, nên nó đúng ở mọi HEAD.
//
//   0  xanh
//   2  không có nền: không git · không đọc được vật · không rút được khối ·
//      khối thiếu dòng · sha trong vật không có trong kho · không hồ sơ đã ký nào
//   3  lời khai trong hợp đồng LỆCH vật (sha / run_id / exit)
//   4  tập hồ sơ của vật KHÁC tập hồ sơ đã thông cổng của kho — in thiếu/thừa
//   5  một hồ sơ có tập id eval trong vật KHÁC tập id eval máy của evals.yaml
//   6  vế hai chiều gãy: exit 0 mà 0 hồ sơ được ghim, hoặc exit khác 0 mà vẫn có
//      hồ sơ mang run_id ấy trong sổ chạy
//   7  ba số khai trong khối LỆCH ba số tính từ vật
//   8  thiếu cờ `--chan chien-dich`
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const SLUG = path.basename(HERE);
const out = (s) => process.stdout.write(s + '\n');
const stop = (code, msg) => { out(msg); process.exit(code); };
const argv = process.argv.slice(2);
const chan = argv.length === 2 && argv[0] === '--chan' ? argv[1] : null;
if (chan !== 'chien-dich') stop(8, 'FAIL(8): cần đúng --chan chien-dich');

const git = (...a) => { const r = spawnSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { code: r.status, out: String(r.stdout || '').trim() }; };
if (git('rev-parse', 'HEAD').code !== 0) stop(2, `FAIL(2): ${ROOT} không phải kho git`);

// ── bộ máy: một nguồn cho trạng thái và cho danh sách eval máy ────────────────
const require_ = createRequire(path.join(ROOT, 'x.cjs'));
let core, wsRec, evalYaml, hoSoDaThong;
try {
  core = require_(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  wsRec = require_(path.join(ROOT, 'lib', 'workspace-record.cjs'));
  evalYaml = require_(path.join(ROOT, 'lib', 'eval-yaml.cjs'));
  ({ hoSoDaThong } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'chup-ho-so-da-thong.mjs')));
} catch (e) { stop(2, `FAIL(2): không nạp được bộ máy (lib + làn ghim lại): ${e.message}`); }
if (!Array.isArray(wsRec.DA_THONG_CONG_2) || !wsRec.DA_THONG_CONG_2.length) stop(2, 'FAIL(2): lib/workspace-record.cjs không cấp DA_THONG_CONG_2 — không có nguồn trạng thái');
if (typeof evalYaml.parseEvals !== 'function' || typeof evalYaml.expectedExits !== 'function') stop(2, 'FAIL(2): lib/eval-yaml.cjs không cấp parseEvals/expectedExits — không có nguồn danh sách eval máy');

let daKy;
try { daKy = hoSoDaThong(ROOT, core.frontmatterField, wsRec.DA_THONG_CONG_2); }
catch (e) { stop(2, `FAIL(2): không liệt kê được hồ sơ đã thông cổng: ${e.message}`); }
if (!daKy.length) stop(2, 'FAIL(2): không hồ sơ đã thông cổng nào trong kho — phép so chưa sống');

// ── VẬT: đầu ra nguyên văn của làn, nằm trong hồ sơ ──────────────────────────
const VAT = path.join(HERE, 'chien-dich-ghim-lai.json');
let vat;
try { vat = JSON.parse(readFileSync(VAT, 'utf8')); }
catch (e) { stop(2, `FAIL(2): không đọc được vật _acceptance/${SLUG}/chien-dich-ghim-lai.json: ${e.message}`); }
for (const k of ['run_id', 'sha', 'slugs']) if (!vat[k]) stop(2, `FAIL(2): vật thiếu trường «${k}» — không phải đầu ra của làn`);
if (!/^[0-9a-f]{40}$/.test(String(vat.sha))) stop(2, `FAIL(2): trường sha của vật không phải 40 hex: ${vat.sha}`);
if (git('cat-file', '-e', `${vat.sha}^{commit}`).code !== 0) stop(2, `FAIL(2): sha của vật ${String(vat.sha).slice(0, 8)} không có trong kho này`);
const suitesExit = Array.isArray(vat.suites) ? vat.suites.map((s) => s.exit) : [];

// ── khối khai của hợp đồng — nay là BẢN SAO phải khớp vật ────────────────────
const hd = readFileSync(path.join(HERE, 'contract.md'), 'utf8');
const khoi = hd.match(/<<<CHIEN-DICH-GHIM-LAI\n([\s\S]*?)CHIEN-DICH-GHIM-LAI>>>/);
if (!khoi) stop(2, `FAIL(2): không rút được khối CHIEN-DICH-GHIM-LAI của _acceptance/${SLUG}/contract.md`);
const dong = khoi[1].split('\n').map((l) => l.trim()).filter(Boolean);
if (dong.length < 6) stop(2, `FAIL(2): khối CHIEN-DICH-GHIM-LAI phải có sáu dòng (sha · run_id · exit · ho-so-do · eval-do · ho-so-ghim), thấy ${dong.length}`);
const lay = (i, ten, re) => { const m = re.exec(dong[i]); if (!m) stop(2, `FAIL(2): dòng ${i + 1} của khối khai phải là «${ten}», thấy: ${dong[i]}`); return m[1]; };
const shaKhai = dong[0];
if (!/^[0-9a-f]{40}$/.test(shaKhai)) stop(2, `FAIL(2): dòng 1 của khối khai không phải sha 40 hex: ${shaKhai}`);
const runKhai = lay(1, 'run_id: <mã>', /^run_id:\s*(\S+)$/);
const exitKhai = Number(lay(2, 'exit: <số>', /^exit:\s*(\d+)$/));
const doKhai = Number(lay(3, 'ho-so-do: <số>', /^ho-so-do:\s*(\d+)$/));
const evalDoKhai = Number(lay(4, 'eval-do: <số>', /^eval-do:\s*(\d+)$/));
const ghimKhai = Number(lay(5, 'ho-so-ghim: <số>', /^ho-so-ghim:\s*(\d+)$/));

// (1) lời khai BẰNG vật
const exitVat = suitesExit.some((x) => x !== 0) ? 1 : (vat.exit !== undefined ? Number(vat.exit) : null);
if (shaKhai !== String(vat.sha)) stop(3, `FAIL(3): hợp đồng khai sha ${shaKhai.slice(0, 8)} nhưng vật mang ${String(vat.sha).slice(0, 8)}`);
if (runKhai !== String(vat.run_id)) stop(3, `FAIL(3): hợp đồng khai run_id ${runKhai} nhưng vật mang ${vat.run_id}`);

// ── tính TỪ VẬT: hồ sơ đỏ · eval đỏ · hồ sơ được ghim ────────────────────────
const slugVat = Object.keys(vat.slugs).sort();
const thieu = slugVat.filter((s) => !daKy.includes(s));
const thua = daKy.filter((s) => !slugVat.includes(s));
if (thieu.length || thua.length) {
  stop(4, `FAIL(4): tập hồ sơ của vật KHÁC tập hồ sơ đã thông cổng của kho —`
    + `${thieu.length ? ` vật có mà kho không: ${thieu.join(', ')};` : ''}`
    + `${thua.length ? ` kho có mà vật không: ${thua.join(', ')}` : ''}`);
}

let hoSoDo = 0, evalDo = 0;
for (const s of slugVat) {
  const p = path.join(ROOT, '_acceptance', s, 'evals.yaml');
  let txt; try { txt = readFileSync(p, 'utf8'); } catch { stop(5, `FAIL(5): ${s} có trong vật mà không đọc được evals.yaml`); }
  const evs = evalYaml.parseEvals(txt, ['executor', 'cmd', 'status']);
  const idKho = evs.filter((e) => (e.executor === 'test' || e.executor === 'script') && String(e.status).trim() !== 'not-run').map((e) => e.id).sort();
  const idVat = Object.keys(vat.slugs[s].evals_exit).sort();
  const tA = idKho.filter((i) => !idVat.includes(i)), tB = idVat.filter((i) => !idKho.includes(i));
  if (tA.length || tB.length) {
    stop(5, `FAIL(5): ${s} — tập id eval trong vật KHÁC tập id eval máy của evals.yaml:`
      + `${tA.length ? ` kho có mà vật không: ${tA.join(', ')};` : ''}`
      + `${tB.length ? ` vật có mà kho không: ${tB.join(', ')}` : ''}`);
  }
  const exp = evalYaml.expectedExits(txt) || {};
  let n = 0;
  for (const [id, x] of Object.entries(vat.slugs[s].evals_exit)) {
    const e = exp[id] || 0;
    if (x !== e && !(e !== 0 && x === 0)) n += 1;   // AC-10 2.11.0: cải thiện không phạt
  }
  if (n) { hoSoDo += 1; evalDo += n; }
}

// (6) hai chiều giữa mã thoát của làn và pin trong sổ chạy
const mangRun = [];
let daGhim = 0;
for (const s of daKy) {
  const p = path.join(ROOT, '_acceptance', s, 'run-log.jsonl');
  if (!existsSync(p)) continue;
  let cuoi = null;
  for (const l of readFileSync(p, 'utf8').split('\n')) {
    const t = l.trim(); if (!t) continue;
    let o; try { o = JSON.parse(t); } catch { continue; }
    if (o && o.kind === 'repin') { if (o.run_id === runKhai) mangRun.push(s); cuoi = o; }
  }
  if (cuoi && cuoi.run_id === runKhai && cuoi.sha === shaKhai) daGhim += 1;
}
if (exitKhai === 0 && daGhim === 0) stop(6, 'FAIL(6): khối khai nói làn XANH nhưng KHÔNG hồ sơ nào mang dòng ghim lại của lượt — một làn xanh luôn ghi pin');
if (exitKhai !== 0 && mangRun.length) stop(6, `FAIL(6): khối khai nói làn hỏng (ma-thoat-lan ${exitKhai}) nhưng ${mangRun.length} hồ sơ vẫn mang dòng ghim lại của lượt ${runKhai}: ${[...new Set(mangRun)].join(', ')} — làn hỏng không được ghi gì`);
if (exitKhai !== 0 && hoSoDo === 0) stop(3, `FAIL(3): khối khai nói làn hỏng (ma-thoat-lan ${exitKhai}) nhưng vật không có hồ sơ nào đỏ — hai lời khai cãi nhau`);
if (exitKhai === 0 && hoSoDo !== 0) stop(3, `FAIL(3): khối khai nói làn XANH nhưng vật có ${hoSoDo} hồ sơ đỏ — hai lời khai cãi nhau`);

// (7) ba số khai BẰNG ba số tính từ vật
const lech = [];
if (doKhai !== hoSoDo) lech.push(`ho-so-do khai ${doKhai}, vật cho ${hoSoDo}`);
if (evalDoKhai !== evalDo) lech.push(`eval-do khai ${evalDoKhai}, vật cho ${evalDo}`);
if (ghimKhai !== daGhim) lech.push(`ho-so-ghim khai ${ghimKhai}, sổ chạy cho ${daGhim}`);
if (lech.length) stop(7, `FAIL(7): ba số của chiến dịch khai LỆCH số tính từ vật — ${lech.join(' · ')}`);

out(`PASS: chien-dich lan ${runKhai} tai sha ${shaKhai.slice(0, 8)} — vat phu dung ${slugVat.length} ho so da thong cong, ${Object.values(vat.slugs).reduce((n, o) => n + Object.keys(o.evals_exit).length, 0)} id eval khop tung evals.yaml; ba so khop vat: ${hoSoDo} ho so do · ${evalDo} eval do · ${daGhim} ho so duoc ghim`);
