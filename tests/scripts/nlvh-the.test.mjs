// nlvh-the.test.mjs — hồ sơ nhan-lan-v-theo-huong: ô lối ra của hồ sơ máy-đi-trước trên thẻ Cổng
// Bằng chứng mang nhãn theo HƯỚNG sản phẩm («đi tiếp hay kéo lại»), máy điền sẵn «đi tiếp» ở dòng
// BÁO; signoff đọc chữ mới và vẫn nhận chữ cũ (AC-1…AC-5).
// Fixture do code sinh: kịch bản bash của tests/plugins/fixtures/viec-cua-anh-scenarios.sh; mục
// ngoài hợp đồng rút khuôn OOC-ITEM-TEMPLATE từ bên VIẾT (acceptance-verify.js); vế dòng thực tế
// rút từ lib/workspace-record.cjs. Mỗi ca là hàm nhận đường gate-card.js (hoặc văn bản luật) và
// trả danh sách sai, nên cùng ca chạy trên cây thật (đối chứng dương) và trên bản sao đã tiêm MỘT
// đột biến (chiều đỏ — design doc §4). Chiều im (NL-AC3) so hai bản `git archive` ở cặp commit
// ĐẦU/CUỐI của vòng (dấu slug trong thông điệp) — cố định trong lịch sử, không neo HEAD.
// Chọn ca: NLVH_CASES=<tên,…>; ca được gọi tên mà không in PASS/FAIL → «ca không chạy», thoát 1.
// Không gọi tên: chạy mọi ca TRỪ hai ca quét trọn hồ sơ thật (NL-AC3-im và đột biến của nó).
import { execFileSync, spawnSync, execFile } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, cpSync, appendFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GC = path.join(KIT, 'scripts', 'gate-card.js');
const LAW = path.join(KIT, 'skills', 'acceptance', 'references', 'human-facing-language.md');
const SIGNOFF = path.join(KIT, 'commands', 'signoff.md');
const SCEN = path.join(KIT, 'tests', 'plugins', 'fixtures', 'viec-cua-anh-scenarios.sh');
const WR = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs'));
const SLUG_VONG = 'nhan-lan-v-theo-huong';
const NHAN = 'đi tiếp hay kéo lại';
const NHAN_CU = 'veto hay để yên';
const TMP = mkdtempSync(path.join(tmpdir(), 'nlvh-'));
const runAsync = promisify(execFile);

let pass = 0; let fail = 0; const daIn = new Set();
const ok = (name, msg = '') => { pass += 1; daIn.add(name); console.log(`PASS: ${name} ${msg}`.trimEnd()); };
const bad = (name, msg) => { fail += 1; daIn.add(name); console.log(`FAIL: ${name} — ${msg}`); };
const CHON = process.env.NLVH_CASES ? process.env.NLVH_CASES.split(',').map(s => s.trim()).filter(Boolean) : null;
const CHI_KHI_GOI_TEN = new Set(['NL-AC3-im', 'NL-dot-bien-lech-the-thuong']);
const want = name => (CHON ? CHON.includes(name) : !CHI_KHI_GOI_TEN.has(name));
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (...a) => execFileSync('git', ['-C', KIT, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// ── fixture ─────────────────────────────────────────────────────────────────
function canh(ten) {
  const ws = mkdtempSync(path.join(TMP, 'ws-'));
  execFileSync('bash', ['-c', '. "$1"; vca_scenario "$2" "$3"', 'x', SCEN, ten, ws]);
  return ws;
}
const fx = ws => path.join(ws, '_acceptance', 'fx');
const sua = (ws, f, fn) => { const p = path.join(fx(ws), f); const cu = readFileSync(p, 'utf8'); const moi = fn(cu); if (moi === cu) throw new Error(`fixture: sua ${f} khong doi gi`); writeFileSync(p, moi); };
const ghiSo = (ws, ...dong) => appendFileSync(path.join(fx(ws), 'decisions.jsonl'), dong.map(d => JSON.stringify(d) + '\n').join(''));
const kyBaoCao = ws => sua(ws, 'evidence-report.md', t => t.replace(/^human_signoff:.*$/m, 'human_signoff: Manh Phan 2026-09-20'));
const doiStatus = (ws, s) => sua(ws, 'contract.md', t => t.replace(/^status:.*$/m, `status: ${s}`));
const doiVeto = (ws, s) => sua(ws, 'contract.md', t => t.replace(/^veto_state:.*$/m, `veto_state: ${s}`));
const DONG_NGHI = { id: 'd-20260920T100000Z-1', type: 'nghi', stage: 'nghi', by: 'M', at: '2026-09-20T10:00:00Z', decision: 'tien de ngoai da chet' };
const DONG_TT = { type: 'thuc-te', stage: 'thuc-te', ...Object.fromEntries(WR.THUC_TE_VE.map(k => [k,
  { id: 'd-20260921T100000Z-1', by: 'M', at: '2026-09-21T09:00:00Z', build_sha: 'f'.repeat(40), decision: 'chay tren prod' }[k]])) };
const DONG_VETO = { id: 'd-20260922T100000Z-1', type: 'veto', stage: 'gate2', at: '2026-09-22T10:00:00Z', decision: 'loi X', decided_by: 'M', decided_at: '2026-09-22T10:00:00Z' };
// Mục ngoài hợp đồng: khuôn RÚT từ bên VIẾT (prompt synthesize), cùng cách P55/hskt.
const OOC_TPL = (() => {
  const wf = readFileSync(path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('khong rut duoc OOC-ITEM-TEMPLATE tu acceptance-verify.js');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
})();
const mucOoc = i => OOC_TPL.replace(/\{(\w+)\}/g, (_, k) => ({ title: `loi that so ${i}`, plain: `Người dùng thấy lỗi ${i}.`, file: `src/a${i}.js:1`, severity: 'low', proposal: 'known-limits' }[k]));
const FINDINGS_2 = '# Review findings\n\n## Trong hợp đồng\n\n## Ngoài hợp đồng — người quyết ở Gate 2\n\nCác lỗi dưới đây nằm ngoài phạm vi đã duyệt.\n\n' + mucOoc(1) + '\n' + mucOoc(2) + '\n';
const DONG_GATE2 = { id: 'd-20260922T010000Z-1', type: 'descope', stage: 'gate2', at: '2026-09-22T01:00:00Z', decision: 'Ngoai-1 den Ngoai-2: ghi Known limits', impact: 'x' };

function the(ws, gc, slug = 'fx', gate = ['--gate', '2']) {
  const a = ['--root', ws, '--slug', slug, ...gate];
  const h = spawnSync(process.execPath, [gc, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const x = spawnSync(process.execPath, [gc, ...a, '--extract'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let j = null; try { j = JSON.parse(x.stdout); } catch (_) { /* lỗi in ở dưới */ }
  return { html: h.stdout || '', raw: x.stdout || '', j, st: h.status, stx: x.status, err: `${h.stderr}${x.stderr}`.slice(0, 300) };
}
const dongMau = html => { const m = html.match(/Trả lời mẫu[^«]*«([^»]*)»/); return m ? m[1] : null; };
const nhanMau = html => (dongMau(html) || '').split(';').map(s => s.trim()).filter(s => s.includes(':')).map(s => s.replace(/:.*$/, '').trim());
const songSot = (t, s) => { if (t.st !== 0 || t.stx !== 0 || !t.j) { s.push(`the khong dung duoc (html ${t.st}, extract ${t.stx}): ${t.err}`); return false; } return true; };

// ── ca ──────────────────────────────────────────────────────────────────────
const CA = {};
CA['NL-AC1-sach'] = gc => {
  const s = []; const t = the(canh('gate2-may-di-tiep'), gc);
  if (!songSot(t, s)) return s;
  const { hoi, bao } = t.j.routing;
  if (hoi.length) s.push(`routing.hoi=${JSON.stringify(hoi)} (can rong)`);
  if (!bao.includes(NHAN)) s.push(`routing.bao thieu «${NHAN}»: ${JSON.stringify(bao)}`);
  if (!String(t.j.one_shot || '').includes(`${NHAN}: đi tiếp`)) s.push(`one_shot thieu «${NHAN}: đi tiếp»: ${t.j.one_shot}`);
  const mau = dongMau(t.html);
  if (mau == null) s.push('HTML khong co dong «Trả lời mẫu»');
  else if (mau.includes(NHAN)) s.push(`dong «Trả lời mẫu» con o nhan: «${mau}»`);
  if (!t.html.includes('kéo lại: nêu lý do')) s.push('VIEC CUA ANH thieu dang «kéo lại: nêu lý do»');
  if (!/máy đã đi tiếp — không cần trả lời/i.test(t.html)) s.push('VIEC CUA ANH thieu «máy đã đi tiếp — không cần trả lời»');
  if (!t.html.includes('>Kéo lại</button>')) s.push('nut chan the khong phai «Kéo lại»');
  if (t.html.includes('>Veto</button>')) s.push('nut «Veto» con tren the');
  if (t.html.includes(NHAN_CU) || t.raw.includes(NHAN_CU)) s.push(`nhan cu «${NHAN_CU}» con tren the`);
  return s;
};
CA['NL-AC2-con-muc'] = gc => {
  const s = []; const ws = canh('gate2-may-di-tiep');
  writeFileSync(path.join(fx(ws), 'review-findings.md'), FINDINGS_2);
  const t0 = the(ws, gc);   // tiền đề: chưa ai định đoạt Ngoài-N → KHÔNG phải máy-đi-trước
  if (!songSot(t0, s)) return s;
  if (!t0.j.routing.hoi.includes('ký hay trả')) s.push(`tien de: chua dinh doat ma hoi=${JSON.stringify(t0.j.routing.hoi)} (can «ký hay trả»)`);
  ghiSo(ws, DONG_GATE2);
  const t = the(ws, gc);
  if (!songSot(t, s)) return s;
  const { hoi, bao } = t.j.routing;
  if (JSON.stringify(hoi) !== JSON.stringify(['Ngoài-1', 'Ngoài-2'])) s.push(`routing.hoi=${JSON.stringify(hoi)} (can ["Ngoài-1","Ngoài-2"])`);
  if (!bao.includes(NHAN)) s.push(`routing.bao thieu «${NHAN}»: ${JSON.stringify(bao)}`);
  if (!String(t.j.one_shot || '').endsWith(`${NHAN}: đi tiếp`)) s.push(`one_shot khong ket bang «${NHAN}: đi tiếp»: ${t.j.one_shot}`);
  if (JSON.stringify(nhanMau(t.html)) !== JSON.stringify(hoi)) s.push(`nhan dong mau ${JSON.stringify(nhanMau(t.html))} != routing.hoi ${JSON.stringify(hoi)}`);
  return s;
};
// Ma trận viết trước ba hàng — [tên, dựng, mong]; số assert = số hàng.
const MA_TRAN_AC4 = [
  ['nghi', ws => { kyBaoCao(ws); ghiSo(ws, DONG_NGHI); }, { khep: true }],
  ['thuc-te', ws => { kyBaoCao(ws); doiStatus(ws, 'da-cham-boi-thuc-te'); ghiSo(ws, DONG_TT); }, { khep: true }],
  ['da-veto', ws => { doiVeto(ws, 'da-veto'); ghiSo(ws, DONG_VETO); }, { khep: false }],
];
CA['NL-AC4-khep'] = gc => {
  const s = []; let n = 0;
  for (const [ten, dung, mong] of MA_TRAN_AC4) {
    const ws = canh('gate2-may-di-tiep'); dung(ws);
    const t = the(ws, gc); n += 1;
    const ss = []; if (!songSot(t, ss)) { s.push(`${ten}: ${ss[0]}`); continue; }
    if (mong.khep && !t.html.includes('Hồ sơ đã khép')) { s.push(`${ten}: tien de — the khong khep`); continue; }
    if (t.j.routing.bao.includes(NHAN)) s.push(`${ten}: routing.bao con «${NHAN}»`);
    if (/máy đã đi tiếp — không cần trả lời/i.test(t.html)) s.push(`${ten}: HTML con «máy đã đi tiếp — không cần trả lời»`);
    if (mong.khep) {
      if (t.j.routing.hoi.length) s.push(`${ten}: routing.hoi=${JSON.stringify(t.j.routing.hoi)} (can rong)`);
      if (t.j.one_shot != null) s.push(`${ten}: one_shot khac null`);
    } else if (!t.j.routing.hoi.includes('ký hay trả')) s.push(`${ten}: routing.hoi=${JSON.stringify(t.j.routing.hoi)} (can «ký hay trả»)`);
  }
  if (n !== MA_TRAN_AC4.length) s.push(`so hang chay ${n} != ${MA_TRAN_AC4.length}`);
  // Đối chứng tiền đề: hồ sơ gốc không thêm gì thì nhãn CÓ ở bao (bộ lọc không xoá oan).
  const t0 = the(canh('gate2-may-di-tiep'), gc);
  if (t0.j && !t0.j.routing.bao.includes(NHAN)) s.push('doi chung: ho so goc khong co nhan o bao');
  return s;
};

// Ma trận viết trước sáu dạng người gõ → hành vi.
const DANG = [
  ['kéo lại: <lý do>', 'kéo-lại'], ['đi tiếp hay kéo lại: kéo lại: <lý do>', 'kéo-lại'], ['veto: <lý do>', 'kéo-lại'],
  ['đi tiếp hay kéo lại: đi tiếp', 'đi-tiếp'], ['đi tiếp', 'đi-tiếp'], ['để yên', 'đi-tiếp'],
];
const khoi = (txt, ten) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
function kiemLuat(law, signoff) {
  const s = [];
  const slots = khoi(law, 'GATE-ONESHOT-SLOTS');
  if (slots == null) s.push('SLOTS rut rong');
  else {
    const dong = slots.split('\n').map(l => l.trim());
    if (!dong.includes(`g2 ${NHAN}`)) s.push(`SLOTS thieu «g2 ${NHAN}»`);
    if (dong.includes(`g2 ${NHAN_CU}`)) s.push(`SLOTS con «g2 ${NHAN_CU}»`);
  }
  const lv = khoi(law, 'GATE-ONESHOT-LAN-V');
  if (lv == null) { s.push('khoi GATE-ONESHOT-LAN-V rut rong'); return s; }
  const hang = lv.split('\n').map(l => l.trim().match(/^(.+?) → (kéo-lại|đi-tiếp)$/)).filter(Boolean).map(m => [m[1], m[2]]);
  if (hang.length < DANG.length) s.push(`LAN-V co ${hang.length} dong dang-go (can >= ${DANG.length})`);
  let n = 0;
  for (const [dang, hv] of DANG) {
    n += 1;
    const khop = hang.filter(([d]) => d === dang);
    if (khop.length !== 1) s.push(`dang «${dang}»: ${khop.length} dong (can dung 1)`);
    else if (khop[0][1] !== hv) s.push(`dang «${dang}» → ${khop[0][1]} (can ${hv})`);
  }
  if (n !== DANG.length) s.push(`so assert ${n} != ${DANG.length}`);
  for (const cum of ['da-veto', 'type: veto', 'Veto:', 'không ghi gì']) if (!lv.includes(cum)) s.push(`LAN-V thieu «${cum}»`);
  if (!signoff.includes('GATE-ONESHOT-LAN-V')) s.push('signoff khong tro khoi «GATE-ONESHOT-LAN-V»');
  return s;
}
CA['NL-AC5-luat'] = () => kiemLuat(readFileSync(LAW, 'utf8'), readFileSync(SIGNOFF, 'utf8'));
// Round-trip thẻ↔SLOTS: chạy NGUYÊN VĂN bộ kiểm của P192 (rút từ heredoc P192JS trong
// tests/plugins/run-tests.sh — một nguồn) trên ba thẻ cây này dựng. KHÔNG gọi run-tests.sh bằng
// ONLY_BLOCK: P192 là khối viết thẳng, không đi qua run(), nên bộ lọc không khớp khối nào và
// suite thoát 1 dù P192 xanh (S4-r1 của hồ sơ này).
function kiemP192(gc, lawPath) {
  const sh = readFileSync(path.join(KIT, 'tests', 'plugins', 'run-tests.sh'), 'utf8');
  const m = sh.match(/<<'P192JS'\n([\s\S]*?)\nP192JS\n/);
  if (!m) return ['khong rut duoc checker P192 tu tests/plugins/run-tests.sh'];
  const d = mkdtempSync(path.join(TMP, 'p192-'));
  const chk = path.join(d, 'check-rt.js'); writeFileSync(chk, m[1]);
  const the3 = [['gate1-draft', '1', 'card-g1.html'], ['gate2-4loai', '2', 'card-g2.html'], ['gate2-may-di-tiep', '2', 'card-g2v.html']].map(([sc, g, f]) => {
    const h = spawnSync(process.execPath, [gc, '--root', canh(sc), '--slug', 'fx', '--gate', g], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const p = path.join(d, f); writeFileSync(p, h.stdout || ''); return p;
  });
  const r = spawnSync(process.execPath, [chk, lawPath, 'E9', ...the3], { encoding: 'utf8' });
  if (r.status !== 0 || !/ONESHOT-RT-NGUOC/.test(r.stdout)) return [`P192 do: ${(r.stderr || r.stdout).trim().split('\n')[0]}`];
  return [];
}
CA['NL-AC5-p192'] = gc => kiemP192(gc, LAW);

// ── chiều im (NL-AC3) ───────────────────────────────────────────────────────
function capCommit() {
  const shas = git('log', '--format=%H', '-F', `--grep=(${SLUG_VONG})`, '--', 'scripts/gate-card.js').split('\n').filter(Boolean);
  if (!shas.length) throw new Error(`khong tim duoc commit nao cham scripts/gate-card.js mang dau «(${SLUG_VONG})» (ban sao nong?)`);
  return { dau: shas[shas.length - 1], cuoi: shas[0] };
}
function moBan(sha, ten) {
  const d = path.join(TMP, ten); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', sha, 'scripts', 'lib', 'skills'], { maxBuffer: 512 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  return d;
}
async function theAsync(gc, root, slug, gate = []) {
  const a = ['--root', root, '--slug', slug, ...gate];
  const chay = async extra => { try { const r = await runAsync(process.execPath, [gc, ...a, ...extra], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { st: 0, out: r.stdout }; } catch (e) { return { st: e.code ?? 1, out: e.stdout || '', err: String(e.stderr || e.message).slice(0, 200) }; } };
  const [h, x] = await Promise.all([chay([]), chay(['--extract'])]);
  return { h, x };
}
function bienDoi(raw) {
  const j = JSON.parse(raw);
  j.routing.hoi = j.routing.hoi.filter(x => x !== NHAN_CU);
  j.routing.bao = [...j.routing.bao, NHAN];
  j.one_shot = String(j.one_shot).replace(`${NHAN_CU}: ___`, `${NHAN}: đi tiếp`);
  return JSON.stringify(j, null, 2);
}
// Một thẻ thuộc vế nào: 'mot' (bằng từng byte) · 'hai' (làn V cũ, đổi đúng ba chỗ) · null (lệch).
function ve(cu, moi) {
  if (cu.h.out === moi.h.out && cu.x.out === moi.x.out) return 'mot';
  let jc = null; try { jc = JSON.parse(cu.x.out); } catch (_) { return null; }
  if (!jc.routing || !jc.routing.hoi.includes(NHAN_CU)) return null;
  return bienDoi(cu.x.out) === moi.x.out ? 'hai' : null;
}
async function pool(items, n, fn) { const out = new Array(items.length); let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; }
async function kiemIm(banSauMutate) {
  const s = []; const { dau, cuoi } = capCommit();
  const truoc = moBan(`${dau}^`, `truoc-${Math.random().toString(36).slice(2)}`);
  const sau = moBan(cuoi, `sau-${Math.random().toString(36).slice(2)}`);
  if (banSauMutate) banSauMutate(sau);
  const gcT = path.join(truoc, 'scripts', 'gate-card.js'); const gcS = path.join(sau, 'scripts', 'gate-card.js');
  // (a) kịch bản fixture
  for (const [ten, mongVe] of [['gate2-4loai', 'mot'], ['gate2-may-di-tiep', 'hai']]) {
    const ws = canh(ten);
    const [cu, moi] = await Promise.all([theAsync(gcT, ws, 'fx', ['--gate', '2']), theAsync(gcS, ws, 'fx', ['--gate', '2'])]);
    const v = ve(cu, moi);
    if (v !== mongVe) s.push(`${ten}: ve ${v ?? 'lech'} (can ${mongVe})`);
    if (ten === 'gate2-4loai') { try { if (!JSON.parse(moi.x.out).routing.hoi.includes('ký hay trả')) s.push('gate2-4loai: hoi thieu «ký hay trả»'); } catch (_) { s.push('gate2-4loai: extract moi hong'); } }
  }
  // (b) mọi hồ sơ thật của kho
  const acc = path.join(KIT, '_acceptance');
  const slugs = readdirSync(acc, { withFileTypes: true }).filter(d => d.isDirectory() && existsSync(path.join(acc, d.name, 'contract.md'))).map(d => d.name).sort();
  const kq = await pool(slugs, 8, async slug => { const [cu, moi] = await Promise.all([theAsync(gcT, KIT, slug), theAsync(gcS, KIT, slug)]); return { slug, cu, moi }; });
  const veHai = []; const khongDung = [];
  for (const { slug, cu, moi } of kq) {
    if (moi.h.st !== 0 || moi.x.st !== 0) { s.push(`${slug}: ban SAU khong dung duoc the: ${moi.h.err || moi.x.err}`); continue; }
    if (cu.h.st !== 0 || cu.x.st !== 0) { khongDung.push(slug); continue; }
    const v = ve(cu, moi);
    if (v === 'hai') veHai.push(slug); else if (v !== 'mot') s.push(`${slug}: the lech ngoai phep bien doi cua vong`);
  }
  return { s, note: `(${slugs.length} ho so that; ve hai: ${veHai.length ? veHai.join(', ') : 'rong'}; ban truoc khong dung duoc: ${khongDung.length ? khongDung.join(', ') : 'khong'}; cap ${dau.slice(0, 8)}^..${cuoi.slice(0, 8)})` };
}

// ── đột biến ────────────────────────────────────────────────────────────────
function banSao() {
  const d = mkdtempSync(path.join(TMP, 'may-'));
  for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, x), path.join(d, x), { recursive: true });
  return d;
}
function tiem(tep, kim, thay) {
  const src = readFileSync(tep, 'utf8'); const n = src.split(kim).length - 1;
  if (n !== 1) throw new Error(`mui tiem truot: kim khop ${n} lan trong ${path.basename(tep)} (can dung 1): ${kim}`);
  writeFileSync(tep, src.replace(kim, thay));
}
// [tên, kim, thay, ca phải đỏ, cụm ghim]
const DOT_BIEN_THE = [
  ['nhan-cu', `const NHAN_LAN_V = '${NHAN}';`, `const NHAN_LAN_V = '${NHAN_CU}';`, ['NL-AC1-sach'], 'nhan cu'],
  ['ve-o-hoi', 'routingBao.push(NHAN_LAN_V); }', 'routingHoi.push(NHAN_LAN_V); }', ['NL-AC1-sach', 'NL-AC2-con-muc'], 'routing.hoi'],
  ['khep-ro', 'if (DA_KHEP && routingBao.includes(NHAN_LAN_V))', 'if (false && routingBao.includes(NHAN_LAN_V))', ['NL-AC4-khep'], 'nghi: routing.bao'],
];
const DOT_BIEN_LUAT = [
  ['luat-de-yen', 'để yên → đi-tiếp', 'để yên → kéo-lại', 'dang «để yên» → kéo-lại'],
  ['luat-go-marker', '<!-- <<<GATE-ONESHOT-LAN-V -->', '<!-- GO-MARKER -->', 'GATE-ONESHOT-LAN-V rut rong'],
];

// ── chạy ────────────────────────────────────────────────────────────────────
for (const ten of ['NL-AC1-sach', 'NL-AC2-con-muc', 'NL-AC4-khep', 'NL-AC5-luat', 'NL-AC5-p192']) {
  if (!want(ten)) continue;
  try { const s = CA[ten](GC); if (s.length) bad(ten, s.join(' ; ')); else ok(ten); } catch (e) { bad(ten, loi(e)); }
}
for (const [ten, kim, thay, cacCa, cum] of DOT_BIEN_THE) {
  const name = `NL-dot-bien-${ten}`; if (!want(name)) continue;
  try {
    const d = banSao(); tiem(path.join(d, 'scripts', 'gate-card.js'), kim, thay);
    const sai = [];
    for (const ca of cacCa) {
      const s = CA[ca](path.join(d, 'scripts', 'gate-card.js'));
      if (!s.length) sai.push(`${ca} van XANH tren ban sao da tiem — phep do mu`);
      else if (!s.some(x => x.includes(cum))) sai.push(`${ca} do nhung sai thong diep (can «${cum}»): ${s.join(' ; ')}`);
    }
    if (sai.length) bad(name, sai.join(' ; ')); else ok(name, `— ${cacCa.join(', ')} do dung «${cum}»`);
  } catch (e) { bad(name, loi(e)); }
}
for (const [ten, kim, thay, cum] of DOT_BIEN_LUAT) {
  const name = `NL-dot-bien-${ten}`; if (!want(name)) continue;
  try {
    const law = readFileSync(LAW, 'utf8'); const n = law.split(kim).length - 1;
    if (n !== 1) throw new Error(`mui tiem truot: kim khop ${n} lan trong ban luat (can dung 1): ${kim}`);
    const s = kiemLuat(law.replace(kim, thay), readFileSync(SIGNOFF, 'utf8'));
    if (!s.length) bad(name, 'NL-AC5-luat van XANH tren ban sao luat da tiem — phep do mu');
    else if (!s.some(x => x.includes(cum))) bad(name, `NL-AC5-luat do nhung sai thong diep (can «${cum}»): ${s.join(' ; ')}`);
    else ok(name, `— NL-AC5-luat do dung «${cum}»`);
  } catch (e) { bad(name, loi(e)); }
}
if (want('NL-dot-bien-slots-cu')) {
  // Bản sao luật mang lại dòng SLOTS cũ: thẻ in nhãn mới mà ngữ pháp không khai → P192 đỏ gọi tên.
  const name = 'NL-dot-bien-slots-cu';
  try {
    const law = readFileSync(LAW, 'utf8'); const kim = `g2 ${NHAN}\n`; const n = law.split(kim).length - 1;
    if (n !== 1) throw new Error(`mui tiem truot: kim khop ${n} lan trong ban luat (can dung 1)`);
    const p = path.join(mkdtempSync(path.join(TMP, 'luat-')), 'human-facing-language.md');
    writeFileSync(p, law.replace(kim, `g2 ${NHAN_CU}\n`));
    const s = kiemP192(GC, p);
    if (!s.length) bad(name, 'NL-AC5-p192 van XANH tren ban sao luat da tiem — phep do mu');
    else if (!s.some(x => x.includes(`nhan khong khop SLOTS: ${NHAN}`))) bad(name, `NL-AC5-p192 do nhung sai thong diep: ${s.join(' ; ')}`);
    else ok(name, `— NL-AC5-p192 do dung «nhan khong khop SLOTS: ${NHAN}»`);
  } catch (e) { bad(name, loi(e)); }
}
if (want('NL-AC3-im')) {
  try { const { s, note } = await kiemIm(null); if (s.length) bad('NL-AC3-im', s.join(' ; ')); else ok('NL-AC3-im', note); } catch (e) { bad('NL-AC3-im', loi(e)); }
}
if (want('NL-dot-bien-lech-the-thuong')) {
  const name = 'NL-dot-bien-lech-the-thuong';
  try {
    const { s } = await kiemIm(sau => tiem(path.join(sau, 'scripts', 'gate-card.js'), '<button class="b yes">Ký duyệt</button>', '<button class="b yes">Ký</button>'));
    if (!s.length) bad(name, 'NL-AC3-im van XANH khi ban SAU doi the thuong — phep do mu');
    else if (!s.some(x => x.includes('gate2-4loai'))) bad(name, `NL-AC3-im do nhung khong goi ten gate2-4loai: ${s.slice(0, 3).join(' ; ')}`);
    else ok(name, '— NL-AC3-im do dung «gate2-4loai»');
  } catch (e) { bad(name, loi(e)); }
}

const khongChay = (CHON || []).filter(n => !daIn.has(n));
for (const n of khongChay) { fail += 1; console.log(`FAIL: ${n} — ca không chạy: ${n}`); }
console.log(`\nResults: ${pass} passed, ${fail} failed (nlvh-the)`);
process.exit(fail ? 1 : 0);
