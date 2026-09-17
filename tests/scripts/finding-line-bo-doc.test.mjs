// finding-line-bo-doc.test.mjs — T5 (khoi-tim-loi-tra-phi-theo-vat, AC-6, vế hai):
// thêm một LOẠI DÒNG vào `run-log.jsonl` là đổi vật mà nhiều bên đang đọc. Vế này
// đo bằng CHÍNH các bộ đọc đang chạy, không bằng câu «đã kiểm bằng mắt» trong design:
//   · round-tally-read.mjs — lọc theo `kind`
//   · loop-health.mjs      — đếm dòng repin
//   · recheck-evidence.cjs — đối chiếu run_id trong bản chấm với sổ
// Luật đo ở đây KHÔNG phải mức lớp «mọi bộ đọc»: lớp đó đếm được — 8 tệp chạm
// `run-log.jsonl` (acceptance-gold · loop-health · recheck-evidence · pre-merge-check ·
// evidence-core · s4-args · repin-lane · round-tally-read). Ca này đo BA bộ đọc chạy
// được độc lập bằng một lệnh; năm bộ còn lại đọc qua lớp khác (evidence-core là thư viện
// của recheck; pre-merge gọi recheck; s4-args/repin-lane/acceptance-gold cần cây git
// dựng sẵn) và được phủ gián tiếp. Vế «đếm lớp» ở cuối tệp giữ cho phạm vi không lặng lẽ
// phình ra ngoài tầm — lượt chấm 1 của hồ sơ khoi-tim-loi bắt đúng chỗ lời tuyên vượt vật.
// Luật: sổ CÓ dòng `kind: finding` phải cho KẾT QUẢ Y HỆT sổ không có nó ở ba bộ đọc đó,
// và không bộ nào ném lỗi. Đối chứng dương đi kèm: cùng bộ đọc vẫn ĐỎ trên sổ hỏng thật.
//
// Dòng finding do CODE SINH trong chính lần chạy — rút khuôn `FINDING-LINE` từ bên
// VIẾT (acceptance-verify.js) rồi dựng dòng bằng đúng danh sách khoá của nó; gõ tay
// một dòng mẫu ở đây là dựng fixture theo khuôn bên đọc, đúng lớp lỗi kit hay dẫm.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const T = mkdtempSync(path.join(tmpdir(), 'finding-line-'));

// ── khuôn dòng finding RÚT TỪ BÊN VIẾT ──────────────────────────────────────
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const wfSrc = readFileSync(WF, 'utf8');
const KHOI = (() => {
  const a = wfSrc.indexOf('<<<FINDING-LINE');
  const b = wfSrc.indexOf('FINDING-LINE>>>');
  if (a === -1 || b === -1 || b <= a) throw new Error('khong rut duoc khoi marker FINDING-LINE tu acceptance-verify.js');
  return wfSrc.slice(a, b);
})();
// Bên viết đặt nhiều khoá trên MỘT dòng, nên rút theo dấu hai chấm chứ không theo
// đầu dòng. `sha` là khoá điều kiện (chỉ có khi invokedSha khác rỗng) — vẫn nằm trong
// danh sách vì fixture dưới đây dựng đủ trường.
const KHOA = [...new Set([...KHOI.matchAll(/(?:^|[{,]\s*)([a-zA-Z][a-zA-Z0-9]*):/gm)].map(m => m[1]))];
if (!KHOA.includes('kind') || !KHOA.includes('khongBacBo')) {
  console.log('  FAIL: khuon FINDING-LINE khong con truong kind/khongBacBo — ben viet doi khuon');
  process.exit(1);
}
const giaTri = k =>
  k === 'kind' ? 'finding'
  : k === 'ts' ? '2026-09-14T00:00:00Z'
  : k === 'round' ? 1
  : k === 'file' ? 'src/a.js'
  : k === 'title' ? 'mot loi ngoai hop dong'
  : k === 'severity' ? 'high'
  : k === 'source' ? 'bugs'
  : k === 'khongBacBo' ? true
  : ['inContract', 'unverified', 'unclassified'].includes(k) ? false
  : '';
const dongFinding = (over = {}) =>
  JSON.stringify({ ...Object.fromEntries(KHOA.map(k => [k, giaTri(k)])), ...over });

const TALLY = JSON.stringify({ ts: '2026-09-14T00:00:00Z', round: 1, kind: 'round-tally', verdict: 'PASS', expected: 1, returned: 1, blocked: 0 });
const EVAL = JSON.stringify({ ts: '2026-09-14T00:00:00Z', round: 1, evalId: 'E1', run_id: 'demo-E1-r1', exit_code: 0, cmd: 'echo x', sha: 'a'.repeat(40) });

// So BẰNG hai lần chạy là chưa đủ: nếu bộ đọc không chạy được thì cả hai lần cùng ngã
// và chuỗi lỗi giống hệt nhau → PASS trên hư không. Mọi phép so phải khai TRƯỚC một
// DẤU SỐNG — chuỗi chỉ xuất hiện khi bộ đọc CHẠY THẬT và ra kết quả — rồi đòi nó có mặt
// ở cả hai vế. Không có dấu sống thì phép so không phân biệt được «giống nhau vì đúng»
// với «giống nhau vì cùng chết».
function so(khong, co, ten, dauSong) {
  const songA = String(khong).includes(dauSong), songB = String(co).includes(dauSong);
  if (!songA || !songB) {
    bad(`${ten}: bo doc KHONG chay that (thieu dau song «${dauSong}»)`,
      `khong-co: ${String(khong).slice(0, 100)} · co: ${String(co).slice(0, 100)}`);
    return;
  }
  if (khong === co) ok(`${ten}: so CO dong finding cho ket qua Y HET so khong co (bo doc da chay that)`);
  else bad(`${ten}: dong finding LAM DOI ket qua bo doc`, `khong-co: ${String(khong).slice(0, 120)} · co: ${String(co).slice(0, 120)}`);
}

// ── 1. round-tally-read ─────────────────────────────────────────────────────
{
  const a = path.join(T, 'a.jsonl'), b = path.join(T, 'b.jsonl');
  writeFileSync(a, `${EVAL}\n${TALLY}\n`);
  writeFileSync(b, `${EVAL}\n${dongFinding()}\n${dongFinding({ title: 'loi thu hai', file: 'src/b.js' })}\n${TALLY}\n`);
  const chay = f => { try { return execFileSync(process.execPath, [path.join(ROOT, 'feature-loop', 'scripts', 'round-tally-read.mjs'), '--run-log', f], { encoding: 'utf8' }); } catch (e) { return `NEM LOI: ${String(e.stderr || e.message).slice(0, 100)}`; } };
  const ra = chay(a), rb = chay(b);
  so(ra.replace(/"[^"]*a\.jsonl"/g, '"F"'), rb.replace(/"[^"]*b\.jsonl"/g, '"F"'), 'round-tally-read', '"tallies"');
  // Đối chứng dương: cùng bộ đọc PHẢI kêu khi sổ có dòng tally hỏng thật.
  const c = path.join(T, 'c.jsonl');
  writeFileSync(c, `${EVAL}\n${dongFinding()}\n{"kind":"round-tally","verdict":"PASS"}\n`);
  // Bộ đọc kêu bằng MÃ THOÁT + stderr (không phải stdout): `chay` gói cả hai vào chuỗi.
  const rc = chay(c);
  if (/round-tally-read:/.test(rc) && /sai khuôn|malformed/i.test(rc) && !/"malformed": \[\]/.test(rc))
    ok('round-tally-read doi chung duong: dong tally HONG van bi keu (dung bo doc, dung ly do)');
  else bad('round-tally-read doi chung duong: khong phai tieng keu cua chinh bo doc', rc.slice(0, 160));
}

// ── 2. loop-health ──────────────────────────────────────────────────────────
{
  const mk = (ten, themFinding) => {
    const root = path.join(T, ten);
    mkdirSync(path.join(root, '_acceptance', 'demo'), { recursive: true });
    writeFileSync(path.join(root, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: verified\n---\n');
    writeFileSync(path.join(root, '_acceptance', 'demo', 'run-log.jsonl'),
      `${EVAL}\n${themFinding ? dongFinding() + '\n' : ''}${TALLY}\n`);
    return root;
  };
  const chay = r => { try { return execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'loop-health.mjs'), '--root', r], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return `NEM LOI: ${String(e.stderr || e.message).slice(0, 140)}`; } };
  const ra = chay(mk('lh-khong', false)), rb = chay(mk('lh-co', true));
  const chuanHoa = s => String(s).replace(/lh-(khong|co)/g, 'R');
  so(chuanHoa(ra), chuanHoa(rb), 'loop-health', '| T2 |');
}

// ── 3. recheck-evidence ─────────────────────────────────────────────────────
{
  const mk = (ten, themFinding) => {
    const root = path.join(T, ten);
    mkdirSync(path.join(root, '_acceptance', 'demo'), { recursive: true });
    writeFileSync(path.join(root, '_acceptance', 'demo', 'run-log.jsonl'),
      `${EVAL}\n${themFinding ? dongFinding() + '\n' : ''}${TALLY}\n`);
    const rp = path.join(root, '_acceptance', 'demo', 'evidence-report.md');
    writeFileSync(rp, ['---', 'schema_version: 1', 'feature_slug: demo', 'verdict: PASS',
      'enforcement_mode: strict', 'bypass_used: false', `verified_commit: ${'a'.repeat(40)}`, '---', '',
      '## Results', '', '- eval: E1', '  run_id: demo-E1-r1', '  exit_code: 0',
      '  verifier: config:executors.test.api', '  verified_at: 2026-09-14T00:00:00Z', ''].join('\n'));
    return rp;
  };
  const chay = rp => { try { return `exit0 ${execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), rp], { encoding: 'utf8' })}`; } catch (e) { return `exit${e.status} ${String(e.stdout || '') + String(e.stderr || '')}`; } };
  const ra = chay(mk('rc-khong', false)), rb = chay(mk('rc-co', true));
  const chuanHoa = s => String(s).replace(/rc-(khong|co)/g, 'R');
  so(chuanHoa(ra), chuanHoa(rb), 'recheck-evidence', 'L2');
  // Đối chứng dương: run_id trong bản chấm KHÔNG có trong sổ → phải đỏ, kể cả khi sổ có dòng finding.
  const rpBia = mk('rc-bia', true);
  writeFileSync(rpBia, readFileSync(rpBia, 'utf8').replace('demo-E1-r1', 'demo-E1-BIA'));
  const rbia = chay(rpBia);
  if (!/^exit0/.test(rbia) && /PROVENANCE|run_id/.test(rbia))
    ok('recheck-evidence doi chung duong: run_id bia bi chan DUNG LY DO (provenance), khong phai script vang');
  else bad('recheck-evidence doi chung duong: khong phai tieng keu provenance cua chinh bo doc', rbia.slice(0, 160));
}

// ── 4. dòng `kind: thuoc-vat` (thuoc-co-cua AC-11/AC-13) — loại dòng thứ hai, cùng luật ──
// Bộ đếm vật · thước · nhát nối một dòng vào sổ sau mỗi lượt chấm. Dòng dựng bằng CHÍNH hàm
// của bên viết (`dongThuocVat`, rút khuôn marker THUOC-VAT-LINE) — không gõ tay khuôn.
{
  const { dongThuocVat } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'thuoc-vat.mjs'));
  const TV = dongThuocVat({ san: 'b'.repeat(40), vat: [3, 1], thuoc: [9, 2], hoSo: [40, 0], nhat: 2, lan: 1, tepThuoc: ['tests/a.test.mjs'] }, { round: 1, ts: '2026-09-17T00:00:00Z' });
  if (JSON.parse(TV).kind !== 'thuoc-vat') { bad('thuoc-vat: ben viet khong dung dong kind thuoc-vat'); }
  // round-tally-read
  {
    const a = path.join(T, 'tv-a.jsonl'), b = path.join(T, 'tv-b.jsonl');
    writeFileSync(a, `${EVAL}\n${TALLY}\n`);
    writeFileSync(b, `${EVAL}\n${TALLY}\n${TV}\n`);
    const chay = f => { try { return execFileSync(process.execPath, [path.join(ROOT, 'feature-loop', 'scripts', 'round-tally-read.mjs'), '--run-log', f], { encoding: 'utf8' }); } catch (e) { return `NEM LOI: ${String(e.stderr || e.message).slice(0, 100)}`; } };
    so(chay(a).replace(/"[^"]*tv-a\.jsonl"/g, '"F"'), chay(b).replace(/"[^"]*tv-b\.jsonl"/g, '"F"'), 'thuoc-vat round-tally-read', '"tallies"');
  }
  // loop-health
  {
    const mk = (ten, them) => {
      const root = path.join(T, ten);
      mkdirSync(path.join(root, '_acceptance', 'demo'), { recursive: true });
      writeFileSync(path.join(root, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: verified\n---\n');
      writeFileSync(path.join(root, '_acceptance', 'demo', 'run-log.jsonl'), `${EVAL}\n${TALLY}\n${them ? TV + '\n' : ''}`);
      return root;
    };
    const chay = r => { try { return execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'loop-health.mjs'), '--root', r], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return `NEM LOI: ${String(e.stderr || e.message).slice(0, 140)}`; } };
    const chuanHoa = s => String(s).replace(/tvlh-(khong|co)/g, 'R');
    so(chuanHoa(chay(mk('tvlh-khong', false))), chuanHoa(chay(mk('tvlh-co', true))), 'thuoc-vat loop-health', '| T2 |');
  }
  // recheck-evidence
  {
    const mk = (ten, them) => {
      const root = path.join(T, ten);
      mkdirSync(path.join(root, '_acceptance', 'demo'), { recursive: true });
      writeFileSync(path.join(root, '_acceptance', 'demo', 'run-log.jsonl'), `${EVAL}\n${TALLY}\n${them ? TV + '\n' : ''}`);
      const rp = path.join(root, '_acceptance', 'demo', 'evidence-report.md');
      writeFileSync(rp, ['---', 'schema_version: 1', 'feature_slug: demo', 'verdict: PASS',
        'enforcement_mode: strict', 'bypass_used: false', `verified_commit: ${'a'.repeat(40)}`, '---', '',
        '## Results', '', '- eval: E1', '  run_id: demo-E1-r1', '  exit_code: 0',
        '  verifier: config:executors.test.api', '  verified_at: 2026-09-14T00:00:00Z', ''].join('\n'));
      return rp;
    };
    const chay = rp => { try { return `exit0 ${execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), rp], { encoding: 'utf8' })}`; } catch (e) { return `exit${e.status} ${String(e.stdout || '') + String(e.stderr || '')}`; } };
    const chuanHoa = s => String(s).replace(/tvrc-(khong|co)/g, 'R');
    so(chuanHoa(chay(mk('tvrc-khong', false))), chuanHoa(chay(mk('tvrc-co', true))), 'thuoc-vat recheck-evidence', 'L2');
  }
}

// ── Đếm LỚP: số tệp chạm run-log.jsonl phải bằng hằng khai trước ───────────
// Một tệp mới đọc sổ mà không ai nhớ bổ sung phép đo thì lớp phình lặng lẽ; ca này buộc
// nói ra. Đổi số = phải xem lại ba điểm-case ở trên có còn đại diện cho lớp không.
{
  // 9 từ 17/09: thêm feature-loop/scripts/thuoc-vat.mjs (bên đọc sha của lượt + bên ghi dòng
  // kind thuoc-vat) — ba bộ đọc trên đã được đo lại với loại dòng mới ở khối 4.
  // 10 từ 17/09 (cùng hồ sơ): thêm scripts/gate-card.js — thẻ Cổng Bằng chứng chỉ đọc dòng
  // `kind: thuoc-vat` (lọc theo kind), nên dòng finding và mọi loại dòng khác không đổi thẻ;
  // hai chiều của nó đo ở tests/scripts/gate-card-thuoc-vat.test.mjs (GT2 im · GT3 dòng hỏng).
  const BO_DOC_KHAI = 10;
  const goc = path.join(ROOT);
  const quet = (d) => execFileSync('bash', ['-c',
    `grep -rl "run-log.jsonl" "${d}/scripts" "${d}/lib" "${d}/hooks" "${d}/feature-loop/scripts" 2>/dev/null | wc -l`],
    { encoding: 'utf8' }).trim();
  const n = Number(quet(goc));
  if (n === BO_DOC_KHAI) ok(`dem LOP: ${n} tep cham run-log.jsonl, khop hang khai truoc`);
  else bad(`dem LOP: ${n} tep cham run-log.jsonl nhung hang khai la ${BO_DOC_KHAI}`,
    'lop da doi — xem lai ba diem-case o tren co con dai dien khong, roi sua hang');
}

console.log(`\nResults: ${pass} passed, ${fail} failed (finding-line-bo-doc)`);
process.exit(fail ? 1 : 0);
