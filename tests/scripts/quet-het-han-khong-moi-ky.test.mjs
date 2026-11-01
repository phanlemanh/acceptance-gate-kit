// tests/scripts/quet-het-han-khong-moi-ky.test.mjs — ca hồ sơ quet-het-han-khong-moi-ky (QH-1…QH-5, issue #463).
// Fixture CODE-SINH trong chính lần chạy: hợp đồng dựng từ khuôn CONTRACT-FRONTMATTER-TEMPLATE, báo cáo từ vùng chép
// của evidence-report-template (cùng nếp RT của ra-co-ten). Bộ quét và bộ dựng thẻ chạy THẬT bằng tiến trình con.
// Chiều đỏ chạy CHÍNH hàm kiểm trên bản sao trọn `scripts/`, `lib/`, `skills/` của cây đang kiểm bị tiêm một nhát, SAU
// khi bản lành xanh trên cùng fixture (MEASURE-BIRTH-CLAUSE). Đường dẫn suy từ vị trí tệp.
//   QH_CASES=QH-1,QH-1-do node tests/scripts/quet-het-han-khong-moi-ky.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
const { fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));
const REF = p => path.join(ROOT, 'skills', 'acceptance', 'references', p);
const CONTRACT_TPL = REF('contract-template.md');
const EVID_TPL = REF('evidence-report-template.md');

let failures = 0;
const ALL_IDS = ['QH-1', 'QH-1-do', 'QH-1-do2', 'QH-2', 'QH-2-do', 'QH-2-do2', 'QH-3', 'QH-3-do', 'QH-4', 'QH-4-do', 'QH-5'];
const only = (process.env.QH_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

// ── fixture ──────────────────────────────────────────────────────────────────
const tmp = pre => mkdtempSync(path.join(tmpdir(), pre));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };

function contractText(slug, { status, veto = null, opened = null, approvedBy = '' }) {
  let t = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fx@example.com', risk_tier: 'T2', surfaces: 'cli', status },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`);
  if (approvedBy) t = t.replace(/^approved_by:.*$/m, `approved_by: ${approvedBy}`).replace(/^approved_at:.*$/m, 'approved_at: 2026-10-30');
  const extra = [];
  if (veto != null) extra.push(`veto_state: ${veto}`);
  if (opened != null) extra.push(`veto_opened_at: ${opened}`);
  if (extra.length) t = t.replace(/^approved_at:.*$/m, m => [m, ...extra].join('\n'));
  return t;
}
// Báo cáo PASS sáu điều kiện từ vùng chép của khuôn bên viết — chỉ điền GIÁ TRỊ (nếp evidenceText của ra-co-ten).
function evidenceText(slug) {
  const tpl = readFileSync(EVID_TPL, 'utf8');
  let t = tpl.slice(tpl.indexOf('---8<---') + '---8<---'.length).replace(/^\s*/, '');
  t = t.replace(/\{\{slug\}\}/g, slug)
    .replace(/^verdict: .*$/m, 'verdict: PASS')
    .replace(/^enforcement_mode: .*$/m, 'enforcement_mode: strict')
    .replace(/^bypass_used: .*$/m, 'bypass_used: false')
    .replace(/^verified_commit: .*$/m, `verified_commit: ${'0'.repeat(40)}`)
    .replace(/^human_signoff:.*$/m, 'human_signoff:');
  const rowVals = ['E1', 'AC-1', 'test', 'PASS']; let ri = 0;
  t = t.replace(/^\|.*\{\{.*\|$/m, line => line.replace(/\{\{[^}]*\}\}/g, () => rowVals[ri++] ?? '…'));
  t = t.replace(/^(- eval:).*\{\{[^}]*\}\}.*$/m, '$1 E1')
    .replace(/^(\s+run_id:).*\{\{[^}]*\}\}.*$/m, `$1 ${slug}-E1-001`)
    .replace(/^(\s+verifier:).*\{\{[^}]*\}\}.*$/m, '$1 verify.sh')
    .replace(/^(\s+verified_at:).*\{\{[^}]*\}\}.*$/m, '$1 2026-10-30T00:00:00Z')
    .replace(/^(\s+)\{\{last 5-10[^}]*\}\}.*$/m, '$1ok')
    .replace(/\{\{eval ids green-on-both[^}]*\}\}/, 'none — every feature eval is red on baseline (discriminates)')
    .replace(/\{\{eval ids with mixed pass_rate[^}]*\}\}/, 'none — every multi-run eval is uniform')
    .replace(/\{\{One line per verify round[\s\S]*?\}\}/, 'Round 1: ok');
  const soT = t.match(/\{\{[^}]*\}\}/g);
  if (soT) throw new Error(`evidenceText: placeholder chưa điền: ${soT.slice(0, 3).join(' · ')}`);
  return t;
}
const runLogText = slug => JSON.stringify({ ts: '2026-10-30T00:00:00Z', kind: 'eval', run_id: `${slug}-E1-001`, exit_code: 0 }) + '\n';
const MC = { status: 'machine-cleared', veto: 'mo', opened: '2026-10-30T00:00:00Z' };

// Kho thử: config tối thiểu (hoặc không config khi coConfig=false) + một hồ sơ.
function mkKho(slug, contract, { coConfig = true } = {}) {
  const r = tmp('qh-');
  if (coConfig) W(r, '_acceptance/config.yaml', 'schema_version: 1\nenforcement: strict\n');
  W(r, 'verify.sh', '#!/bin/sh\nexit 0\n');
  W(r, `_acceptance/${slug}/contract.md`, contractText(slug, contract));
  W(r, `_acceptance/${slug}/evidence-report.md`, evidenceText(slug));
  W(r, `_acceptance/${slug}/run-log.jsonl`, runLogText(slug));
  return r;
}
const withKho = (slug, contract, opts, fn) => { const r = mkKho(slug, contract, opts); try { return fn(r); } finally { rmSync(r, { recursive: true, force: true }); } };

// Một lượt dựng thẻ: HTML + --extract, cùng biến môi trường. `goc` = gốc cây chứa scripts/ (bản lành hay bản sao).
function dungThe(goc, root, slug, han) {
  const env = { ...process.env };
  delete env.ACCEPTANCE_SCAN_TIMEOUT_MS;
  if (han != null) env.ACCEPTANCE_SCAN_TIMEOUT_MS = String(han);
  const card = path.join(goc, 'scripts', 'gate-card.js');
  const h = spawnSync(process.execPath, [card, '--root', root, '--slug', slug], { encoding: 'utf8', env, timeout: 180000 });
  const x = spawnSync(process.execPath, [card, '--root', root, '--slug', slug, '--extract'], { encoding: 'utf8', env, timeout: 180000 });
  let ex = null; try { ex = JSON.parse(x.stdout); } catch (_) { /* dưới */ }
  return { html: h.stdout || '', hExit: h.status, hErr: h.stderr || '', ex, xExit: x.status };
}

// Bản sao trọn ba thư mục của cây `goc`; `tiem` = [tệp, từ, thành] (kiểm nhát khớp đúng một lần) hoặc
// [tệp, null, nội dung thay trọn tệp].
function banSaoTu(goc, tiem = []) {
  const g = tmp('qh-cay-');
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(goc, d), path.join(g, d), { recursive: true });
  for (const [tep, tu, thanh] of tiem) {
    const p = path.join(g, tep);
    if (tu == null) { writeFileSync(p, thanh); continue; }
    const cu = readFileSync(p, 'utf8');
    const n = cu.split(tu).length - 1;
    if (n !== 1) { rmSync(g, { recursive: true, force: true }); throw new Error(`nhát tiêm khớp ${n} lần trong ${tep}, cần 1`); }
    writeFileSync(p, cu.replace(tu, thanh));
  }
  return g;
}
const banSao = (tep, tu, thanh) => banSaoTu(ROOT, [[tep, tu, thanh]]);

const ONE_DI_TIEP = /đi tiếp hay kéo lại: đi tiếp$/;
const CAU_THONG = 'máy đã thông — hồ sơ này qua Cổng Bằng chứng';
const unesc = s => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const LENH_RE = /ACCEPTANCE_SCAN_TIMEOUT_MS=(\d+) node '([^']+)' --root '([^']+)' --slug '([^']+)'/;
// Ba cách bộ quét không trả lời: (i) ép hết hạn trên chính cây; (ii)(iii) bản sao cây có bộ quét thay trọn.
const CACH_LOI = [
  ['(i) hết hạn', null, 1],
  ['(ii) thoát mã 3', 'process.exit(3);\n', null],
  ['(iii) SIGKILL', "process.kill(process.pid, 'SIGKILL');\n", null],
];

// ── hàm kiểm AC-1 + AC-2 trên một cây (bản lành hay bản sao) ────────────────
function kiemHetHan(goc) {
  const loi1 = [], loi2 = [];
  withKho('m', MC, {}, root => {
    // Fixture phải là hồ sơ máy-thông xanh-sạch THEO BỘ QUÉT THẬT (cây đang kiểm) — không thì ca đo hình dạng khác.
    const s = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'start-scan.mjs'), '--root', root], { encoding: 'utf8' });
    let khoa = null; try { const j = JSON.parse(s.stdout); khoa = (j.groups.done || []).find(x => x.slug === 'm')?.stateKey; } catch (_) {}
    if (khoa !== 'da-giao-may-thong-veto-mo') loi1.push(`fixture: bộ quét xếp hồ sơ vào ${khoa}, cần da-giao-may-thong-veto-mo`);
    // Đối chứng dương: quét kịp — đi tiếp, CÓ câu khẳng định (vế dương của phép âm ở AC-2), không «hết hạn».
    const k = dungThe(goc, root, 'm', null);
    if (k.hExit !== 0 || !k.ex) loi1.push(`đối chứng: thẻ exit ${k.hExit}/${k.xExit} ${k.hErr.slice(0, 160)}`);
    else {
      if (!ONE_DI_TIEP.test(k.ex.one_shot || '')) loi1.push(`đối chứng: dòng lệnh «${k.ex.one_shot}» không kết bằng «đi tiếp hay kéo lại: đi tiếp»`);
      if (!k.html.includes(CAU_THONG)) loi1.push(`đối chứng: quét kịp mà thẻ thiếu «${CAU_THONG}»`);
      if (/hết hạn/.test(k.html)) loi1.push('đối chứng: quét kịp mà thẻ có chữ «hết hạn»');
    }
    for (const [ten, thanBoQuet, han] of CACH_LOI) {
      let cay = goc, sao = null;
      try {
        if (thanBoQuet) cay = sao = banSaoTu(goc, [['scripts/start-scan.mjs', null, thanBoQuet]]);
        const e = dungThe(cay, root, 'm', han);
        if (e.hExit !== 0 || !e.ex) { loi1.push(`${ten}: thẻ exit ${e.hExit}/${e.xExit} ${e.hErr.slice(0, 160)}`); continue; }
        const nhan = han != null ? 'hết hạn mà thẻ mời ký' : `bộ quét lỗi mà thẻ mời ký ${ten}`;
        if (!ONE_DI_TIEP.test(e.ex.one_shot || '') || /ký hay trả|Ký duyệt/.test(e.html)) loi1.push(`${nhan}: dòng lệnh «${String(e.ex.one_shot).slice(-40)}»`);
        else if (!/Kéo lại/.test(e.html)) loi1.push(`${ten}: thẻ không có nút «Kéo lại»`);
        if (/exit null/.test(e.html)) loi2.push(han != null ? 'thẻ in exit null' : `${ten}: thẻ in exit null`);
        if (e.html.includes(CAU_THONG)) loi2.push(`${ten}: thẻ khẳng định sáu điều kiện khi bộ quét lỗi`);
        if (han == null) continue;
        // AC-2 chỉ trên (i): cờ + lệnh chạy lại là QUAN HỆ — rút lệnh, so số/root/slug, chạy chính lệnh ấy.
        for (const c of ['bộ quét hết hạn sau', 'chưa ai kiểm lại sáu điều kiện']) if (!e.html.includes(c)) loi2.push(`cờ thiếu «${c}»`);
        const m = LENH_RE.exec(unesc(e.html));
        if (!m) { loi2.push('thẻ không có lệnh chạy lại đúng dạng'); continue; }
        const [lenh, n, card, r2, slug2] = m;
        if (Number(n) !== Math.max(2 * han, 120000)) loi2.push(`lệnh chạy lại: hạn ${n}, cần ${Math.max(2 * han, 120000)}`);
        if (path.resolve(r2) !== path.resolve(root)) loi2.push(`lệnh chạy lại: --root ${r2}, cần ${root}`);
        if (slug2 !== 'm') loi2.push(`lệnh chạy lại: --slug ${slug2}, cần m`);
        if (path.resolve(card) !== path.join(path.resolve(cay), 'scripts', 'gate-card.js')) loi2.push(`lệnh chạy lại trỏ ${card}`);
        const env = { ...process.env }; delete env.ACCEPTANCE_SCAN_TIMEOUT_MS;
        const c = spawnSync('bash', ['-c', lenh], { encoding: 'utf8', env, timeout: 180000 });
        if (c.status !== 0 || /hết hạn/.test(c.stdout || '')) loi2.push(`lệnh chạy lại vẫn hết hạn (exit ${c.status})`);
      } finally { if (sao) rmSync(sao, { recursive: true, force: true }); }
    }
  });
  return { loi1, loi2 };
}

// ── QH-1 / QH-2 ──────────────────────────────────────────────────────────────
const doCay = (id, tiem, kiem) => {
  let g = null;
  try { g = banSaoTu(ROOT, tiem); kiem(kiemHetHan(g)); }
  catch (e) { fail(id, e.message); } finally { if (g) rmSync(g, { recursive: true, force: true }); }
};
if (['QH-1', 'QH-2', 'QH-1-do', 'QH-1-do2', 'QH-2-do', 'QH-2-do2'].some(want)) {
  const lanh = kiemHetHan(ROOT);
  if (want('QH-1')) lanh.loi1.length ? fail('QH-1', lanh.loi1.join(' · ')) : pass('QH-1', 'hồ sơ máy-thông: hết hạn · thoát mã 3 · SIGKILL đều «đi tiếp hay kéo lại: đi tiếp», nút Kéo lại, không mời ký; quét kịp đi tiếp, có câu đã thông, không «hết hạn»');
  if (want('QH-2')) lanh.loi2.length ? fail('QH-2', lanh.loi2.join(' · ')) : pass('QH-2', 'cờ hết hạn nêu lý do + «chưa ai kiểm lại»; lệnh chạy lại đúng hạn/root/slug và chạy xanh; không «exit null», không khẳng định sáu điều kiện');
  const lanhXanh = !lanh.loi1.length && !lanh.loi2.length;
  const chuaXanh = id => fail(id, 'bản lành chưa xanh — chiều đỏ không đọc được');
  if (want('QH-1-do')) lanhXanh ? doCay('QH-1-do', [['scripts/gate-card.js', ' || (MAY_THONG && MU_LOI)', '']], d =>
    (d.loi1.some(x => x.startsWith('hết hạn mà thẻ mời ký')) ? pass('QH-1-do', 'gỡ vế máy-thông-khi-bộ-quét-lỗi → «hết hạn mà thẻ mời ký»')
      : fail('QH-1-do', `bản sao tiêm không đỏ đúng lỗi: ${d.loi1.join(' · ') || '(xanh)'}`))) : chuaXanh('QH-1-do');
  if (want('QH-1-do2')) lanhXanh ? doCay('QH-1-do2', [['scripts/gate-card.js', 'const MU_LOI = scanState == null && !!scanErr;', "const MU_LOI = scanState == null && /hết hạn/.test(scanErr || '');"]], d => {
    const loiLoi = d.loi1.filter(x => x.startsWith('bộ quét lỗi mà thẻ mời ký'));
    (loiLoi.length === 2 && loiLoi[0].includes('(ii)') && loiLoi[1].includes('(iii)') && !d.loi1.some(x => x.startsWith('hết hạn mà')))
      ? pass('QH-1-do2', 'chỉ nhận ca hết hạn → «bộ quét lỗi mà thẻ mời ký» ở (ii) và (iii), (i) im')
      : fail('QH-1-do2', `cần đúng (ii)(iii) đỏ, (i) im; được: ${d.loi1.join(' · ') || '(xanh)'}`);
  }) : chuaXanh('QH-1-do2');
  if (want('QH-2-do')) lanhXanh ? doCay('QH-2-do', [['scripts/gate-card.js', 'q.err = HQ.lyDoQuet(r, han);', 'q.err = (r.stderr || \'\').trim().slice(0, 200) || `exit ${r.status}`;']], d =>
    (d.loi2.includes('thẻ in exit null') ? pass('QH-2-do', 'trả lý do về `exit ${status}` → «thẻ in exit null»')
      : fail('QH-2-do', `bản sao tiêm không đỏ đúng lỗi: ${d.loi2.join(' · ') || '(xanh)'}`))) : chuaXanh('QH-2-do');
  if (want('QH-2-do2')) lanhXanh ? doCay('QH-2-do2', [['scripts/han-quet.cjs', 'Math.max(2 * han, HAN_CHAY_LAI_TOI_THIEU_MS)', 'han']], d =>
    (d.loi2.some(x => x.startsWith('lệnh chạy lại vẫn hết hạn')) ? pass('QH-2-do2', 'in hạn đã dùng thay cho N → «lệnh chạy lại vẫn hết hạn»')
      : fail('QH-2-do2', `bản sao tiêm không đỏ đúng lỗi: ${d.loi2.join(' · ') || '(xanh)'}`))) : chuaXanh('QH-2-do2');
}

// ── QH-3 — lý do bằng chữ trên mọi hình dạng ─────────────────────────────────
const MA_TRAN_LY_DO = [
  ['hết hạn', { error: Object.assign(new Error('spawnSync node ETIMEDOUT'), { code: 'ETIMEDOUT' }), status: null, signal: 'SIGTERM', stderr: '' }, 'bộ quét hết hạn sau 57 giây'],
  ['bị ngắt', { status: null, signal: 'SIGKILL', stderr: '' }, 'bộ quét bị ngắt (SIGKILL)'],
  ['không mã', { status: null, signal: null, stderr: '' }, 'bộ quét dừng mà không có mã thoát'],
  ['stderr', { status: 1, signal: null, stderr: '  lỗi x \n' }, 'lỗi x'],
  ['stderr rỗng', { status: 2, signal: null, stderr: '' }, 'bộ quét thoát mã 2'],
  ['không chạy', { error: Object.assign(new Error('spawn node ENOENT'), { code: 'ENOENT' }), status: null, signal: null, stderr: '' }, 'không chạy được bộ quét: spawn node ENOENT'],
];
function kiemLyDo(lyDoQuet) {
  const loi = [];
  for (const [ten, r, mong] of MA_TRAN_LY_DO) {
    let got; try { got = lyDoQuet(r, 57000); } catch (e) { got = `NÉM ${e.message}`; }
    if (got !== mong) loi.push(`${ten}: «${got}», cần «${mong}»`);
    else if (/null/.test(got)) loi.push(`${ten}: lý do chứa «null»`);
  }
  return loi;
}
if (want('QH-3') || want('QH-3-do')) {
  const HQ = require(path.join(ROOT, 'scripts', 'han-quet.cjs'));
  const loi = kiemLyDo(HQ.lyDoQuet);
  if (want('QH-3')) { console.log(`  số hàng: ${MA_TRAN_LY_DO.length}`); loi.length ? fail('QH-3', loi.join(' · ')) : pass('QH-3', 'sáu hình dạng ra đúng câu viết sẵn, không câu nào chứa «null»'); }
  if (want('QH-3-do')) {
    if (loi.length) fail('QH-3-do', 'bản lành chưa xanh — chiều đỏ không đọc được');
    else {
      let g = null;
      try {
        g = banSao('scripts/han-quet.cjs', "if (r.signal) return `bộ quét bị ngắt (${r.signal})`;", '');
        const d = kiemLyDo(require(path.join(g, 'scripts', 'han-quet.cjs')).lyDoQuet);
        d.length === 1 && d[0].startsWith('bị ngắt:') ? pass('QH-3-do', 'bỏ nhánh tín hiệu → đúng hàng «bị ngắt» đỏ')
          : fail('QH-3-do', `cần đúng một lỗi hàng «bị ngắt», được: ${d.join(' · ') || '(xanh)'}`);
      } catch (e) { fail('QH-3-do', e.message); } finally { if (g) rmSync(g, { recursive: true, force: true }); }
    }
  }
}

// ── QH-4 — hạn theo cỡ kho ───────────────────────────────────────────────────
const MA_TRAN_HAN = [
  [0, undefined, 20000], [10, undefined, 20000], [133, undefined, 20000], [134, undefined, 20100], [380, undefined, 57000],
  [380, '45000', 45000], [380, '1', 1], [380, '0', 57000], [380, '-5', 57000], [380, 'abc', 57000], [380, '', 57000],
];
function kiemHan(hanQuet) {
  const loi = []; const kho = new Map();
  try {
    for (const [n, envV, mong] of MA_TRAN_HAN) {
      if (!kho.has(n)) {
        const r = tmp('qh-han-');
        W(r, '_acceptance/config.yaml', 'schema_version: 1\n');   // tệp không tính vào cỡ kho
        for (let i = 0; i < n; i++) mkdirSync(path.join(r, '_acceptance', `h${i}`));
        kho.set(n, r);
      }
      const env = envV === undefined ? {} : { ACCEPTANCE_SCAN_TIMEOUT_MS: envV };
      const got = hanQuet(kho.get(n), env);
      if (got !== mong) loi.push(`${n} hồ sơ${envV === undefined ? '' : ` (biến «${envV}»)`}: hạn ${got}, cần ${mong}`);
    }
  } finally { for (const r of kho.values()) rmSync(r, { recursive: true, force: true }); }
  return loi;
}
if (want('QH-4') || want('QH-4-do')) {
  const HQ = require(path.join(ROOT, 'scripts', 'han-quet.cjs'));
  const loi = kiemHan(HQ.hanQuet);
  if (want('QH-4')) { console.log(`  số hàng: ${MA_TRAN_HAN.length}`); loi.length ? fail('QH-4', loi.join(' · ')) : pass('QH-4', 'hạn = max(20 s, 150 ms × hồ sơ); biến môi trường hợp lệ thắng, giá trị hỏng bị bỏ qua'); }
  if (want('QH-4-do')) {
    if (loi.length) fail('QH-4-do', 'bản lành chưa xanh — chiều đỏ không đọc được');
    else {
      let g = null;
      try {
        g = banSao('scripts/han-quet.cjs', 'Math.max(HAN_SAN_MS, HAN_MOI_HO_SO_MS * soHoSo(root))', 'HAN_SAN_MS');
        const d = kiemHan(require(path.join(g, 'scripts', 'han-quet.cjs')).hanQuet);
        d.includes('380 hồ sơ: hạn 20000, cần 57000') ? pass('QH-4-do', 'bỏ vế cỡ kho → «380 hồ sơ: hạn 20000, cần 57000»')
          : fail('QH-4-do', `bản sao tiêm không đỏ đúng lỗi: ${d.join(' · ') || '(xanh)'}`);
      } catch (e) { fail('QH-4-do', e.message); } finally { if (g) rmSync(g, { recursive: true, force: true }); }
    }
  }
}

// ── QH-5 — đường cũ: hồ sơ không máy-thông khi hết hạn; kho chưa dựng cổng ───
if (want('QH-5')) {
  const loi = [];
  withKho('v', { status: 'verified', approvedBy: 'Fx' }, {}, root => {
    const e = dungThe(ROOT, root, 'v', 1);
    if (e.hExit !== 0 || !e.ex) { loi.push(`(a) thẻ exit ${e.hExit}/${e.xExit}`); return; }
    if (!/ký hay trả: ___$/.test(e.ex.one_shot || '')) loi.push(`(a) dòng lệnh «${String(e.ex.one_shot).slice(-40)}» không kết bằng «ký hay trả: ___»`);
    for (const c of ['bộ quét hết hạn sau', 'có thể đang mời ký']) if (!e.html.includes(c)) loi.push(`(a) thẻ thiếu «${c}»`);
  });
  withKho('m', MC, { coConfig: false }, root => {
    const k = dungThe(ROOT, root, 'm', null);
    if (k.hExit !== 0) { loi.push(`(b) thẻ exit ${k.hExit}`); return; }
    for (const c of ['Ký duyệt', 'chưa ai kiểm sáu điều kiện']) if (!k.html.includes(c)) loi.push(`(b) thẻ thiếu «${c}»`);
    if (/hết hạn/.test(k.html)) loi.push('(b) kho chưa dựng cổng mà thẻ nói «hết hạn»');
  });
  loi.length ? fail('QH-5', loi.join(' · ')) : pass('QH-5', 'hồ sơ verified hết hạn vẫn «ký hay trả: ___» + cờ cũ; kho chưa dựng cổng giữ «Ký duyệt»');
}

if (only.length) for (const id of only) if (!ALL_IDS.includes(id)) { console.log(`FAIL: [${id}] ca không tồn tại`); failures++; }
console.log(failures ? `QH: ${failures} FAIL` : 'QH: tất cả PASS');
process.exit(failures ? 1 : 0);
