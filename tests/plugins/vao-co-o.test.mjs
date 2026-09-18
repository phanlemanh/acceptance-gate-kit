// tests/plugins/vao-co-o.test.mjs — ca hồ sơ vao-co-o-ra-co-ten (VC1–VC8; VC5 là P99 trong run-tests.sh).
// Fixture CODE-SINH từ khuôn opportunity-template (OPP-FRONTMATTER-TEMPLATE + section
// Ngưỡng rút từ chính khuôn), chạy start-scan.mjs THẬT và renderProductMap THẬT; đường
// dẫn suy từ vị trí file; mỗi ca có đối chứng dương + chiều đỏ trên bản sao, ghim thông điệp.
//   VC_CASES=VC1,VC6 node tests/plugins/vao-co-o.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, readdirSync, utimesSync, rmSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate, blockFromTemplate } from '../fixtures/from-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const TEMPLATE = path.join(ROOT, 'skills', 'acceptance', 'references', 'opportunity-template.md');
const START_MD = path.join(ROOT, 'commands', 'start.md');
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const require = createRequire(import.meta.url);
const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
// Trạng thái «đã thông Cổng Bằng chứng» HỎI lib, không chép: mảng đó tự khai «export để các
// bên đọc HỎI, đừng chép — chép là hai bản trôi» (lib/workspace-record.cjs).
const { DA_THONG_CONG_2 } = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));
const HEADING = 'Ngưỡng chết / ngưỡng UAT';
const MARKER = 'OPP-FRONTMATTER-TEMPLATE';

let failures = 0;
// MỘT nguồn danh sách ca: file này. `--ids` in ra để run-tests.sh lặp theo, không chép tay.
const ALL_IDS = ['VC1', 'VC2', 'VC3', 'VC4', 'VC6', 'VC7', 'VC8', 'VC9'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.VC_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
// Ranh giới cứng quanh id: `PASS: [VC1]` không là tiền tố của ca anh em.
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'vc-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const fx = () => { const r = tmp(); W(r, '_acceptance/config.yaml', 'schema_version: 1\n'); return r; };
// Quét bằng script THẬT (hoặc bản sao đã đột biến) — trả JSON, hoặc {status, stderr} khi chết
const scan = (root, script = SCAN) => {
  const r = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  if (r.status !== 0) return { status: r.status, stderr: r.stderr, groups: {}, broken: [] };
  return JSON.parse(r.stdout);
};
// Section Ngưỡng rút từ CHÍNH khuôn (không gõ tay); filled → thay «…» bằng giá trị thật
const thresholdSection = (filled, tpl = readFileSync(TEMPLATE, 'utf8')) => {
  const bullets = section(tpl, HEADING).filter(l => /^\s*[-*]\s+[^:]+:/.test(l));
  return `\n## ${HEADING}\n\n` + bullets.map(l => (filled ? l.replace(/:\s*…\s*$/, ': giá trị thật') : l)).join('\n') + '\n';
};
const DEFAULTS = { slug: 'w-idea', feature: 'Ý w-idea', owner: 'o@x', stage: 'discovery', decision: '', decided_by: '', decided_at: '', base_commit: '', disposition: '' };
const stub = (values = {}, { filled = false, tpl = TEMPLATE, body = '' } = {}) =>
  fileFromTemplate(tpl, MARKER, { ...DEFAULTS, ...values },
    '\n## Vấn đề & ai gặp\n\nMột câu.\n' + thresholdSection(filled, readFileSync(tpl, 'utf8')) + body);
// Bản sao cây plugin (scripts + lib + references) để đột biến script/khuôn mà không chạm cây thật
const pluginCopy = ({ script, template } = {}) => {
  const r = tmp();
  for (const d of ['scripts', 'lib', 'skills/acceptance/references']) cpSync(path.join(ROOT, d), path.join(r, d), { recursive: true });
  const sp = path.join(r, 'scripts', 'start-scan.mjs'), tp = path.join(r, 'skills', 'acceptance', 'references', 'opportunity-template.md');
  if (script) writeFileSync(sp, script(readFileSync(sp, 'utf8')));
  if (template) writeFileSync(tp, template(readFileSync(tp, 'utf8')));
  return { scan: sp, template: tp };
};
const slugsIn = arr => (arr || []).map(x => x.slug);

// ---- Neo ngoài (hồ sơ o-chi-mo-khi-co-neo-ngoai): bên đọc rút LUẬT từ khuôn, không gõ lại.
const fmv = (t, k) => { const m = t.match(new RegExp(`^${k}:\\s*(.*?)\\s*(#.*)?$`, 'm')); return m ? m[1].trim() : ''; };
const gocRule = (tpl) => {
  let line, rules, tuTro;
  try {
    line = blockFromTemplate(tpl, 'OPP-GOC-LINE').trim();
    rules = blockFromTemplate(tpl, 'OPP-GOC-RULE').trim().split('\n');
    tuTro = blockFromTemplate(tpl, 'OPP-GOC-TU-TRO').trim();
  } catch (e) { throw new Error('khuôn thiếu marker OPP-GOC-LINE/OPP-GOC-RULE/OPP-GOC-TU-TRO'); }
  // Owner thu phạm vi 18/09 (đường B): CHỈ CÒN MỘT dạng neo — một hồ sơ cụ thể. Dạng
  // «kho <tên> — <người> gọi tên <ngày>» đã bỏ: nó là lời khai không có vật đứng sau, và
  // vế bác không phủ được nó (t4, lượt chấm 2).
  if (rules.length !== 1) throw new Error('khuôn OPP-GOC-RULE phải đúng MỘT dòng');
  return {
    line,
    hoSo: slug => new RegExp(rules[0].split('{slug}').join(slug), 'm'),
    // Luật BÁC rút từ khuôn, KHÔNG hardcode ở đây: bản trước để nó ở bên đọc nên khuôn tự
    // khai «hai dạng hợp lệ» mà thiếu vế bác, và mọi bên đọc thứ hai sẽ nhận neo tự trỏ (t8).
    tuTro: slug => new RegExp(tuTro.split('{slug}').join(slug)),
  };
};
// Hàng chờ Cổng Đáng = discovery, HOẶC decided+build chưa có contract (ô mở thẳng ở decided
// vẫn phải chịu răng — gap-probe F3: không thì «tự ăn thuốc» là hằng đúng). park/kill/archived miễn.
const hangCho = dir => {
  const o = path.join(dir, 'opportunity.md');
  if (!existsSync(o) || existsSync(path.join(dir, 'contract.md'))) return null;
  const t = readFileSync(o, 'utf8'); const st = fmv(t, 'stage'), de = fmv(t, 'decision');
  return (st === 'discovery' || (st === 'decided' && de === 'build')) ? t : null;
};
const neoErrs = (accDir, tpl) => {
  const r = gocRule(tpl); const errs = [];
  for (const slug of readdirSync(accDir)) {
    const dir = path.join(accDir, slug);
    let t; try { t = hangCho(dir); } catch { continue; }
    if (t === null) continue;
    const m = t.match(/^Gốc:.*$/m);
    if (!m) { errs.push(`${slug}: thiếu Gốc`); continue; }
    const val = m[0].replace(/^Gốc:\s*/, '').trim();
    if (!val || m[0].trim() === r.line) { errs.push(`${slug}: chưa điền`); continue; }
    // Bác tự-trỏ TRƯỚC khi hỏi dạng hợp lệ, và bác trên MỌI cách viết: dạng thật trên cây là
    // «<kho>/_acceptance/<slug> — <giải thích>», nên chốt cũ đòi slug đứng cuối hoặc theo sau
    // «/» đã trượt đúng dạng phổ biến nhất (t5, lượt chấm 1).
    if (r.tuTro(slug).test(val)) { errs.push(`${slug}: trỏ chính nó`); continue; }
    if (!r.hoSo(slug).test(m[0])) errs.push(`${slug}: không khớp dạng`);
  }
  return errs.sort();
};
const BAC_KHO = new Set(['', 'chưa có', '(chưa có)', 'không', '—', '…']);
const khoErrs = (accDir, tpl) => {
  let line; try { line = blockFromTemplate(tpl, 'KHO-CHO-NHAN-LINE').trim(); }
  catch (e) { throw new Error('khuôn thiếu marker KHO-CHO-NHAN-LINE'); }
  const errs = [];
  for (const d of readdirSync(accDir).filter(x => x.startsWith('release-'))) {
    const c = path.join(accDir, d, 'contract.md'); if (!existsSync(c)) continue;
    const t = readFileSync(c, 'utf8');
    // Đã thông Cổng Bằng chứng (ký NGƯỜI hoặc máy thông ở làn V) → miễn, không hồi tố.
    if (DA_THONG_CONG_2.includes((fmv(t, 'status') || '').toLowerCase())) continue;
    const m = t.match(/^Kho chờ nhận:.*$/m);
    if (!m) { errs.push(`${d}: thiếu Kho chờ nhận`); continue; }
    if (m[0].trim() === line) { errs.push(`${d}: chưa điền`); continue; }
    const val = m[0].replace(/^Kho chờ nhận:\s*/, '').trim();
    const ok = !BAC_KHO.has(val) && val.split(/[,\s·]+/).filter(Boolean).some(k => /^[a-z0-9][a-z0-9._-]+$/.test(k));
    if (!ok) errs.push(`${d}: giá trị bác`);
  }
  return errs.sort();
};

// ---------- VC1: ý chưa ngưỡng → considering; khuôn là nguồn nhãn (AC-1)
if (want('VC1')) {
  const root = fx(); W(root, '_acceptance/w-idea/opportunity.md', stub());
  const j = scan(root); const errs = [];
  const c = (j.groups.considering || []).find(x => x.slug === 'w-idea');
  if (!c) errs.push(`w-idea không ở considering[] (broken=${JSON.stringify(j.broken)})`);
  else {
    // Ghim tập khoá CHÍNH XÁC (một khoá lạ lọt vào vẫn đỏ). Ba khoá stateKey/
    // label/viecKe thêm ở hồ sơ start-bang-dieu-khien — chữ mặt người rút từ bảng chung;
    // ageTied: mấy ý sinh cùng một commit mang cùng dấu thời gian, thẻ phải nói «chưa rõ tuổi».
    if (Object.keys(c).sort().join(',') !== 'ageDays,ageTied,flags,label,name,since,slug,stateKey,viecKe') errs.push(`khoá lệch: ${Object.keys(c).join(',')}`);
    if (c.name !== 'Ý w-idea') errs.push(`name ≠ feature: ${c.name}`);
  }
  if (slugsIn(j.groups.gates).includes('w-idea')) errs.push('w-idea vẫn ở gates[]');
  if (slugsIn(j.broken).includes('w-idea')) errs.push('w-idea ở broken[]');
  // chiều đỏ (a): khuôn bản sao gỡ bullet Timebox → stub 3 bullet điền đủ → bản sao xếp dang, bản thật xếp considering
  const copyA = pluginCopy({ template: t => t.replace(/^- Timebox:.*\n/m, '') });
  const rootA = fx(); W(rootA, '_acceptance/w-idea/opportunity.md', stub({}, { filled: true, tpl: copyA.template }));
  const jA = scan(rootA, copyA.scan), jA0 = scan(rootA);
  if (!(jA.groups.gates || []).some(g => g.slug === 'w-idea' && g.gate === 'dang')) errs.push('khuôn gỡ Timebox mà bản sao không xếp dang → script không đọc khuôn lúc chạy');
  if (!slugsIn(jA0.groups.considering).includes('w-idea')) errs.push('đối chứng: script thật + khuôn thật phải xếp considering (stub thiếu Timebox)');
  // chiều đỏ (b): khuôn đổi tên heading → exit ≠ 0 + thông điệp
  const copyB = pluginCopy({ template: t => t.replace(`## ${HEADING}`, '## Ngưỡng sống') });
  const jB = scan(root, copyB.scan);
  if (!(jB.status && /khuôn không có section Ngưỡng/.test(jB.stderr || ''))) errs.push(`khuôn đổi heading: exit ${jB.status} stderr=${(jB.stderr || '').slice(0, 80)}`);
  if (errs.length) fail('VC1', errs.join(' · ')); else pass('VC1', 'ý chưa ngưỡng → considering {slug,name,since,ageDays}; khuôn là nguồn nhãn (gỡ bullet → kết luận đổi; đổi heading → chết to)');
}

// ---------- VC2: đủ ngưỡng → gate dang; đối chứng đổi-giá-trị (AC-2)
if (want('VC2')) {
  const errs = [];
  const root = fx(); W(root, '_acceptance/w-ready/opportunity.md', stub({ slug: 'w-ready' }, { filled: true }));
  const j = scan(root);
  if (!(j.groups.gates || []).some(g => g.slug === 'w-ready' && g.gate === 'dang')) errs.push(`đủ ngưỡng mà không ở gates dang (broken=${JSON.stringify(j.broken)})`);
  if (slugsIn(j.groups.considering).includes('w-ready')) errs.push('đủ ngưỡng mà vẫn considering');
  const full = stub({ slug: 'w-ready' }, { filled: true });
  if (!full.includes('- Timebox: giá trị thật')) errs.push('fixture đầy không có dòng Timebox điền — khuôn đổi?');
  const r1 = fx(); W(r1, '_acceptance/w-ready/opportunity.md', full.replace('- Timebox: giá trị thật', '- Timebox: …'));
  if (!slugsIn(scan(r1).groups.considering).includes('w-ready')) errs.push('đổi một giá trị về «…» mà không rơi về considering');
  const r2 = fx(); W(r2, '_acceptance/w-ready/opportunity.md', full.replace('- Timebox: giá trị thật', '- Timebox:'));
  if (!slugsIn(scan(r2).groups.considering).includes('w-ready')) errs.push('giá trị rỗng mà không rơi về considering');
  if (errs.length) fail('VC2', errs.join(' · ')); else pass('VC2', 'đủ ngưỡng → gate dang; một giá trị «…»/rỗng → considering');
}

// ---------- VC3: đã quyết / stage lạ / có contract — kết luận không đổi (AC-3)
if (want('VC3')) {
  const errs = [];
  const root = fx();
  W(root, '_acceptance/w-build/opportunity.md', stub({ slug: 'w-build', stage: 'decided', decision: 'build' }));
  W(root, '_acceptance/w-park/opportunity.md', stub({ slug: 'w-park', stage: 'decided', decision: 'park' }));
  W(root, '_acceptance/w-odd/opportunity.md', stub({ slug: 'w-odd', stage: 'ideation' }));
  W(root, '_acceptance/w-draft/contract.md', '---\nslug: w-draft\nrisk_tier: T2\nstatus: draft\n---\n');
  W(root, '_acceptance/w-draft/opportunity.md', stub({ slug: 'w-draft' }));
  const j = scan(root), g = j.groups;
  if (!(g.inProgress || []).some(x => x.slug === 'w-build' && x.nextStep === 'S1')) errs.push('build không ở inProgress S1');
  if (!(g.done || []).some(x => x.slug === 'w-park' && x.state === 'park')) errs.push('park không ở done park');
  if (!(j.broken || []).some(x => x.slug === 'w-odd' && /stage/.test(x.reason))) errs.push('stage lạ không ở broken nêu stage');
  if (!(g.gates || []).some(x => x.slug === 'w-draft' && x.gate === 'pham-vi')) errs.push('contract draft không ở gates pham-vi');
  if (!Array.isArray(g.considering) || g.considering.length) errs.push(`considering phải rỗng: ${JSON.stringify(g.considering)}`);
  if (errs.length) fail('VC3', errs.join(' · ')); else pass('VC3', 'đã quyết / stage lạ / có contract: kết luận không đổi, considering rỗng');
}

// ---------- VC4: since = commit đầu (git) / mtime; ageDays (AC-4)
if (want('VC4')) {
  const errs = [];
  const day = 86400000, t10 = new Date(Date.now() - 10 * day), t1 = new Date(Date.now() - 1 * day);
  // (a) không git → mtime
  const ra = fx(); const pa = W(ra, '_acceptance/w-idea/opportunity.md', stub()); utimesSync(pa, t10, t10);
  const ca = (scan(ra).groups.considering || [])[0] || {};
  if (ca.ageDays !== 10) errs.push(`không git: ageDays=${ca.ageDays} (mong 10)`);
  // (b) git hai commit trên cùng file: −10 rồi −1 → since = −10 (commit ĐẦU)
  const rb = fx();
  const git = (args, env = {}) => {
    const r = spawnSync('git', ['-C', rb, '-c', 'user.name=t', '-c', 'user.email=t@x', '-c', 'commit.gpgsign=false', ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
    if (r.status !== 0) throw new Error(`git ${args[0]}: ${r.stderr}`);
    return r.stdout;
  };
  git(['init', '-q']);
  const pb = W(rb, '_acceptance/w-idea/opportunity.md', stub());
  const at = d => ({ GIT_AUTHOR_DATE: d.toISOString(), GIT_COMMITTER_DATE: d.toISOString() });
  git(['add', '-A']); git(['commit', '-q', '-m', 'c1'], at(t10));
  writeFileSync(pb, readFileSync(pb, 'utf8') + '\nsửa chính tả\n'); git(['add', '-A']); git(['commit', '-q', '-m', 'c2'], at(t1));
  const cb = (scan(rb).groups.considering || [])[0] || {};
  if (!cb.since || Math.abs(Date.parse(cb.since) - t10.getTime()) > 1000) errs.push(`git: since=${cb.since} (mong ${t10.toISOString()})`);
  if (cb.ageDays !== 10) errs.push(`git: ageDays=${cb.ageDays} (mong 10)`);
  // chiều đỏ: bản sao đọc commit CUỐI (-1 thay --diff-filter=A) → since lệch
  const mut = pluginCopy({ script: s => { if (!s.includes("'--diff-filter=A'")) throw new Error('mutant: không thấy --diff-filter=A'); return s.replace("'--diff-filter=A'", "'-1'"); } });
  const cm = (scan(rb, mut.scan).groups.considering || [])[0] || {};
  if (!cm.since || Math.abs(Date.parse(cm.since) - t1.getTime()) > 1000) errs.push(`mutant đọc commit cuối mà since không lệch (since=${cm.since}) → phép đo mù với commit ĐẦU`);
  // (c) file chưa commit trong repo git → mtime
  const pc = W(rb, '_acceptance/w-new/opportunity.md', stub({ slug: 'w-new' })); utimesSync(pc, t10, t10);
  const cc = (scan(rb).groups.considering || []).find(x => x.slug === 'w-new') || {};
  if (cc.ageDays !== 10) errs.push(`chưa commit: ageDays=${cc.ageDays} (mong 10 từ mtime)`);
  if (errs.length) fail('VC4', errs.join(' · ')); else pass('VC4', 'since = commit đầu (git) / mtime (không git, chưa commit); ageDays nguyên; mutant commit cuối → đỏ');
}

// ---------- VC6: start.md — START-CAN-NHAC + START-HIEU-KET, 0 «grill», nghi thức → máy (AC-6)
if (want('VC6')) {
  const errs = [];
  const md = readFileSync(START_MD, 'utf8');
  const block = (t, m) => { const r = t.match(new RegExp(`<!-- <<<${m} -->\\n([\\s\\S]*?)<!-- ${m}>>> -->`)); return r ? r[1] : null; };
  const cn = block(md, 'START-CAN-NHAC'), hk = block(md, 'START-HIEU-KET');
  if (!cn) errs.push('không tìm thấy khối START-CAN-NHAC');
  if (!hk) errs.push('không tìm thấy khối START-HIEU-KET');
  if (cn && hk) {
    // START-CAN-NHAC: 4 assert (3 chuỗi + vị trí)
    // Đo MỆNH ĐỀ DƯƠNG + một KHOÁ máy-đọc, không đo danh sách đen: không gian chữ
    // là mở nên «tối đa ba» viết bằng CHỮ lọt qua mọi regex bắt chữ số. Khoá
    // `giới hạn: không` là nguồn; văn xuôi quanh nó là chú thích (hồ sơ
    // start-bang-dieu-khien, AC-1).
    for (const [name, re] of [['Đang cân nhắc', /Đang cân nhắc/],
                              // HAI vế RIÊNG, không dùng phép hoặc: `/cũ nhất|chưa rõ tuổi/`
                              // được thoả sẵn bởi vế đầu (khối vẫn còn «cũ nhất X ngày»),
                              // nên vế «chưa rõ tuổi» không bao giờ đỏ được — phép đo chết.
                              ['tuổi thường (cũ nhất X ngày)', /cũ nhất/],
                              ['nhánh tuổi trùng (chưa rõ tuổi)', /chưa rõ tuổi/],
                              ['khoá ageTied dẫn nhánh đó', /`ageTied`/],
                              ['N = 0 không in', /N = 0 → KHÔNG in/],
                              ['in mọi phần tử', /\*\*mọi\*\* `name`/],
                              ['thước khai trước', /thước/]])
      if (!re.test(cn)) errs.push(`START-CAN-NHAC thiếu «${name}»`);
    const gh = (cn.match(/`giới hạn: ([^`]*)`/) || [])[1];
    if (gh === undefined) errs.push('START-CAN-NHAC thiếu khoá máy-đọc `giới hạn: …`');
    else if (gh.trim() !== 'không') errs.push(`giới hạn phải là «không», đang là «${gh.trim()}»`);
    const iDo = md.indexOf('**Đang dở**'), iCn = md.indexOf('<<<START-CAN-NHAC'), iNew = md.indexOf('**Bắt đầu việc mới**');
    if (!(iDo > -1 && iDo < iCn && iCn < iNew)) errs.push('START-CAN-NHAC không nằm sau «Đang dở» trước «Bắt đầu việc mới»');
    // START-HIEU-KET: ma trận 6 mệnh đề VIẾT TRƯỚC — số assert == số mệnh đề
    const MATRIX = [
      ['①', /`stage: discovery`/], ['②', /`decision: ?`/], ['③', /BẮT ĐẦU ở dòng `---`/],
      ['④', /«Vấn đề & ai gặp» ≥ 1 câu/], ['⑤', /«Ngưỡng chết \/ ngưỡng UAT»[\s\S]*`…`/], ['⑥', /KHÔNG viết spec, KHÔNG viết contract/],
    ];
    if (MATRIX.length !== 6) errs.push('ma trận phải có đúng 6 mệnh đề');
    for (const [id, re] of MATRIX) if (!re.test(hk)) errs.push(`START-HIEU-KET thiếu mệnh đề ${id}`);
    const nLines = t => t.split('\n').filter(l => l.trim()).length;
    const n = nLines(hk);
    if (n > 15) errs.push(`START-HIEU-KET quá 15 dòng (${n})`);
    const iHk = md.indexOf('<<<START-HIEU-KET'), iA = md.indexOf('(a) ý còn mơ hồ'), iB = md.indexOf('(b)', iA);
    if (!(iHk > -1 && iA > -1 && iHk < iA)) errs.push('START-HIEU-KET không đứng trước lối (a)');
    const refs = (md.slice(iA, iB).match(/START-HIEU-KET/g) || []).length;
    if (refs < 2) errs.push(`lối (a) trỏ START-HIEU-KET ${refs} lần (mong ≥ 2: nhánh có skill + nhánh không)`);
    if (/grill/.test(md)) errs.push('start.md còn chữ «grill»');
    // (iv) round-trip nghi thức → máy: rút code span `key: value` từ khối, áp lên khuôn, quét bằng script thật
    const spansOf = b => Object.fromEntries([...b.matchAll(/`([a-z_]+): ?([^`]*)`/g)].map(m => [m[1], m[2].trim()]));
    const build = spans => fileFromTemplate(TEMPLATE, MARKER,
      { slug: 'w-ritual', feature: 'Ý theo nghi thức', owner: 'o@x', decided_by: '', decided_at: '', base_commit: '', disposition: '', ...spans },
      '\n## Vấn đề & ai gặp\n\nMột câu.\n' + thresholdSection(false));
    const r = fx(); W(r, '_acceptance/w-ritual/opportunity.md', build(spansOf(hk)));
    const j = scan(r);
    if (!slugsIn(j.groups.considering).includes('w-ritual')) errs.push(`stub theo nghi thức không vào considering: ${JSON.stringify(j.broken)}`);
    // chiều đỏ: gỡ span ① → stub hỏng (stage không đọc được) VÀ ma trận đỏ ở ①
    const hkRed = hk.replace('`stage: discovery`', 'stage discovery');
    const rr = fx(); W(rr, '_acceptance/w-ritual/opportunity.md', build(spansOf(hkRed)));
    const jr = scan(rr);
    if (!(jr.broken || []).some(x => x.slug === 'w-ritual' && /stage/.test(x.reason))) errs.push('gỡ span stage mà stub không hỏng → round-trip không sống');
    if (MATRIX.filter(([, re]) => !re.test(hkRed)).map(([id]) => id).join('') !== '①') errs.push('gỡ span ① mà ma trận không đỏ đúng ①');
    // chiều đỏ: gỡ khối / thêm dòng 16
    if (block(md.replace(/<!-- <<<START-HIEU-KET -->[\s\S]*?<!-- START-HIEU-KET>>> -->/, ''), 'START-HIEU-KET') !== null) errs.push('gỡ khối mà vẫn tìm thấy');
    const hk16 = hk + Array.from({ length: 16 - n }, (_, i) => `dòng thêm ${i}`).join('\n') + '\n';
    if (nLines(hk16) <= 15) errs.push('thêm dòng mà không quá 15');
  }
  if (errs.length) fail('VC6', errs.join(' · ')); else pass('VC6', 'hai khối marker đúng chỗ, ma trận 6 mệnh đề, 0 «grill», nghi thức → máy round-trip; gỡ span/khối/16 dòng → đỏ');
}

// ---------- VC7: quan hệ bộ quét ↔ bản đồ (AC-7)
if (want('VC7')) {
  const errs = [];
  const { renderProductMap } = await import(pathToFileURL(path.join(ROOT, 'scripts', 'product-map.mjs')).href);
  const count = (md, label) => { const m = md.match(new RegExp(`${label}<br/>(chưa có|(\\d+) việc)`)); return m ? (m[2] ? Number(m[2]) : 0) : null; };
  const root = fx();
  W(root, '_acceptance/w-idea/opportunity.md', stub());
  W(root, '_acceptance/w-ready/opportunity.md', stub({ slug: 'w-ready' }, { filled: true }));
  W(root, '_acceptance/w-go/opportunity.md', stub({ slug: 'w-go', stage: 'decided', decision: 'build' }));
  const j = scan(root), md = renderProductMap(root);
  const dang = (j.groups.gates || []).filter(g => g.gate === 'dang').length, cons = (j.groups.considering || []).length;
  if (count(md, 'Đang cân nhắc cơ hội') !== cons + dang || cons + dang !== 2) errs.push(`bản đồ ${count(md, 'Đang cân nhắc cơ hội')} ≠ considering ${cons} + dang ${dang} (mong 2)`);
  if (count(md, 'Sắp mở vòng') !== 1) errs.push(`Sắp mở = ${count(md, 'Sắp mở vòng')} (mong 1)`);
  rmSync(path.join(root, '_acceptance', 'w-idea'), { recursive: true });
  const j2 = scan(root), md2 = renderProductMap(root);
  if (count(md2, 'Đang cân nhắc cơ hội') !== 1 || (j2.groups.gates || []).filter(g => g.gate === 'dang').length !== 1) errs.push('gỡ ý cân nhắc: hai bên không cùng về 1');
  if (!Array.isArray(j2.groups.considering) || j2.groups.considering.length !== 0) errs.push('considering phải là mảng rỗng (N = 0)');
  if (errs.length) fail('VC7', errs.join(' · ')); else pass('VC7', 'bản đồ «cân nhắc» == considering + dang; gỡ một → cùng giảm; N = 0 là mảng rỗng');
}

// ---------- VC8 (đảo chiều 18/09, ô o-chi-mo-khi-co-neo-ngoai): mọi ô ở HÀNG CHỜ phải có Gốc
// hợp lệ; hạt giống mồ côi IM (luật cũ «mọi hạt giống phải có ô» đã bỏ — nó đẻ ô); 7 stub sống
// vẫn phải nằm đúng MỘT ngăn (bất biến cũ giữ nguyên, xem ghi chú lịch sử dưới).
if (want('VC8')) {
  const errs = [];
  // (i) cây thật
  errs.push(...neoErrs(path.join(ROOT, '_acceptance'), TEMPLATE).map(e => 'cây thật: ' + e));
  // (ii) bên VIẾT dặn điền
  // Đo NỘI DUNG luật, không grep một chữ: bản trước chỉ hỏi includes('Gốc:') nên vế «nêu đúng
  // hình dạng» của AC-1 không sai được trong bất kỳ phép đo nào (t7, lượt chấm 2). Chuỗi hình
  // dạng rút TỪ KHUÔN để hai bên không trôi khỏi nhau.
  const startBlk = md => { const m = md.match(/<<<START-HIEU-KET -->([\s\S]*?)<!-- START-HIEU-KET>>>/); return m ? m[1] : null; };
  // Ví dụ hình dạng sống trong KHUÔN (OPP-GOC-VIDU) — start.md và ca này cùng rút một nguồn.
  const dangNeo = blockFromTemplate(TEMPLATE, 'OPP-GOC-VIDU').trim();
  const startCheck = (md, tag) => {
    const b = startBlk(md);
    if (!b) return [`${tag}: thiếu khối START-HIEU-KET`];
    const e = [];
    if (!b.includes('Gốc:')) e.push(`${tag}: không dặn điền Gốc:`);
    if (!dangNeo || !b.includes(dangNeo)) e.push(`${tag}: không nêu hình dạng neo «${dangNeo}» — chỉ nhắc chữ Gốc:`);
    if (!/hạt giống/.test(b)) e.push(`${tag}: không nói lối ra khi chưa có hồ sơ để trỏ (hạt giống)`);
    return e;
  };
  errs.push(...startCheck(readFileSync(START_MD, 'utf8'), 'start.md'));
  // chiều đỏ: bản sao gỡ hình dạng khỏi khối → phải bắt, và bắt ĐÚNG vế đó
  {
    const mutated = readFileSync(START_MD, 'utf8').replace(/`<kho>\/_acceptance\/<slug-khác>`/, '`<một nguồn nào đó>`');
    const em = startCheck(mutated, 'mutant');
    if (!em.some(x => /không nêu hình dạng neo/.test(x))) errs.push('gỡ hình dạng neo khỏi bản sao start.md mà phép đo KHÔNG bắt');
  }
  // (iii) ma trận trên MỘT fixture code-sinh — số ca = số ô
  const r = tmp();
  const body = g => `\n## Vấn đề & ai gặp\n\n${g}\nMột câu.\n`;
  const put = (slug, values, g) => W(r, `_acceptance/${slug}/opportunity.md`, stub({ slug, ...values }, { filled: true, body: body(g) }));
  put('duong-hoso', { stage: 'discovery' }, 'Gốc: crm/_acceptance/vong-khac');
  put('duong-hoso-2', { stage: 'decided', decision: 'build' }, 'Gốc: oneflow/_acceptance/vong-khac — chữ giải thích phía sau');
  // Dạng ĐÃ BỎ (owner thu phạm vi 18/09) phải rơi về «không khớp dạng», không được im.
  put('do5-dang-da-bo', { stage: 'discovery' }, 'Gốc: kho oneflow — Mạnh gọi tên 2026-09-18');
  put('do1-thieu', { stage: 'discovery' }, '');
  put('do2-tu-tro', { stage: 'discovery' }, 'Gốc: kit/_acceptance/do2-tu-tro');
  // Dạng VIẾT THẬT trên cây: slug rồi chữ giải thích. Chốt cũ trượt đúng dạng này (t5).
  put('do2b-tu-tro-ghi-chu', { stage: 'discovery' }, 'Gốc: acceptance-gate-kit/_acceptance/do2b-tu-tro-ghi-chu — phát hiện từ chính vòng này');
  put('do2c-tu-tro-day-du', { stage: 'discovery' }, 'Gốc: kit/_acceptance/do2c-tu-tro-day-du/opportunity.md');
  put('do3a-rong', { stage: 'discovery' }, 'Gốc:');
  put('do3b-placeholder', { stage: 'discovery' }, blockFromTemplate(TEMPLATE, 'OPP-GOC-LINE').trim());
  put('do3c-van-tu-do', { stage: 'discovery' }, 'Gốc: suy từ đọc mã');
  put('do4-build-thieu', { stage: 'decided', decision: 'build' }, '');
  put('im2-park', { stage: 'decided', decision: 'park' }, '');
  put('im3-archived', { stage: 'archived', decision: 'kill' }, '');
  W(r, 'docs/plans/2026-01-01-hat-giong-mo-coi.md', '# hạt giống không ô — hợp lệ từ 18/09\n');
  const got = neoErrs(path.join(r, '_acceptance'), TEMPLATE);
  const want8 = ['do1-thieu: thiếu Gốc', 'do2-tu-tro: trỏ chính nó',
    'do2b-tu-tro-ghi-chu: trỏ chính nó', 'do2c-tu-tro-day-du: trỏ chính nó', 'do3a-rong: chưa điền',
    'do3b-placeholder: chưa điền', 'do3c-van-tu-do: không khớp dạng', 'do4-build-thieu: thiếu Gốc',
    'do5-dang-da-bo: không khớp dạng'].sort();
  if (JSON.stringify(got) !== JSON.stringify(want8)) errs.push(`ma trận fixture: có ${JSON.stringify(got)} — mong ${JSON.stringify(want8)}`);
  // (iv) KHUÔN là nguồn: đổi regex trong bản sao khuôn → ca dương đổi màu
  const copyR = pluginCopy({ template: t => t.replace('/_acceptance/[\\w-]+', '/KHONG-TON-TAI/[\\w-]+') });
  const gotR = neoErrs(path.join(r, '_acceptance'), copyR.template);
  for (const d of ['duong-hoso', 'duong-hoso-2'])
    if (!gotR.includes(`${d}: không khớp dạng`)) errs.push(`đổi regex dạng hợp lệ trong bản sao khuôn mà ca dương «${d}» KHÔNG đổi màu — bên đọc không rút luật từ khuôn`);
  const copyM = pluginCopy({ template: t => t.replace('<<<OPP-GOC-RULE', '<<<OPP-GOC-RULEX') });
  try { neoErrs(path.join(r, '_acceptance'), copyM.template); errs.push('gỡ marker OPP-GOC-RULE mà phép đo không đỏ'); }
  catch (e) { if (!/thiếu marker/.test(e.message)) errs.push('gỡ marker: thông điệp lạ: ' + e.message); }
  const copyT = pluginCopy({ template: t => t.replace('<<<OPP-GOC-TU-TRO', '<<<OPP-GOC-TU-TROX') });
  try { neoErrs(path.join(r, '_acceptance'), copyT.template); errs.push('gỡ marker OPP-GOC-TU-TRO mà phép đo không đỏ'); }
  catch (e) { if (!/thiếu marker/.test(e.message)) errs.push('gỡ marker TU-TRO: thông điệp lạ: ' + e.message); }
  // Khuôn là nguồn của luật BÁC: nới nó trong bản sao thì ba ca tự-trỏ phải THÔI đỏ.
  const copyT2 = pluginCopy({ template: t => t.replace('/_acceptance/{slug}(?![\\w-])', '/_acceptance/KHONG-BAO-GIO-{slug}') });
  const gotT2 = neoErrs(path.join(r, '_acceptance'), copyT2.template);
  if (gotT2.some(e => /trỏ chính nó/.test(e))) errs.push('nới luật bác trong bản sao khuôn mà vẫn còn ca «trỏ chính nó» — bên đọc không rút luật từ khuôn');

  // (v-b) TỰ ĂN THUỐC: chính ô của vòng này phải qua đúng vị từ đó. Không đo qua `hangCho`
  // (ô đã có contract.md nên bị loại khỏi hàng chờ — t15), mà đo THẲNG tệp của nó, kèm chiều đỏ.
  {
    const SELF = 'o-chi-mo-khi-co-neo-ngoai';
    const selfDir = path.join(ROOT, '_acceptance', SELF);
    const selfTxt = existsSync(path.join(selfDir, 'opportunity.md')) ? readFileSync(path.join(selfDir, 'opportunity.md'), 'utf8') : null;
    if (selfTxt === null) errs.push('tự ăn thuốc: không thấy opportunity.md của chính vòng');
    else {
      const selfRoot = tmp();
      W(selfRoot, `_acceptance/${SELF}/opportunity.md`, selfTxt);
      const e1 = neoErrs(path.join(selfRoot, '_acceptance'), TEMPLATE);
      if (e1.length) errs.push(`tự ăn thuốc: ô của chính vòng không qua vị từ — ${JSON.stringify(e1)}`);
      const broken = tmp();
      W(broken, `_acceptance/${SELF}/opportunity.md`, selfTxt.replace(/^Gốc:.*$/m, ''));
      const e2 = neoErrs(path.join(broken, '_acceptance'), TEMPLATE);
      if (!e2.includes(`${SELF}: thiếu Gốc`)) errs.push(`tự ăn thuốc chiều đỏ: gỡ dòng Gốc mà không đỏ — ${JSON.stringify(e2)}`);
    }
  }

  // (v) stub sống đúng MỘT ngăn — bất biến cũ của luật «vào có ô», KHÔNG ghim chặng.
  // Bom đã nổ HAI lần khi ca này ghim chặng của hồ sơ khác (22/08 duong-do, 23/08 ban-do-dinh-chu-ky):
  // vá theo TÊN là hẹn nổ lần ba. Điều còn đo được trên cây thật: mỗi stub nằm đúng MỘT ngăn.
  const NEW = ['hoi-theo-mat-phang', 'ban-do-dinh-chu-ky', 'o-nuot-luat', 'ba-cho-tich-luy-khong-duong-ra', 'duong-do-trong-dinh-nghia-xong', 'liet-ke-may-doc', 't1-tuyen-kem-can-cu'];
  const j2 = scan(ROOT);
  for (const sl of NEW) {
    const n = ['gates', 'inProgress', 'considering', 'done'].filter(k => slugsIn(j2.groups[k]).includes(sl)).length
      + (slugsIn(j2.broken).includes(sl) ? 1 : 0);
    if (n !== 1) errs.push(`${sl} phải nằm đúng MỘT ô, đang ở ${n} ô`);
  }
  if (errs.length) fail('VC8', errs.join(' · '));
  else pass('VC8', `mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; ${NEW.length} stub đúng một ngăn`);
}

// ---------- VC9 (18/09): mốc phát hành CHƯA KÝ phải khai «Kho chờ nhận:» với ≥1 tên kho
if (want('VC9')) {
  const errs = [];
  errs.push(...khoErrs(path.join(ROOT, '_acceptance'), CONTRACT_TPL).map(e => 'cây thật: ' + e));
  const r = tmp();
  const line = blockFromTemplate(CONTRACT_TPL, 'KHO-CHO-NHAN-LINE').trim();
  const rec = (name, status, kho) => W(r, `_acceptance/${name}/contract.md`,
    fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
      { feature: 'mốc', slug: name, owner: 'o@x', risk_tier: 'T2', surfaces: 'ci', status },
      `\n# ${name}\n\n## Notes\n\n${kho}\n`));
  rec('release-im-1', 'draft', 'Kho chờ nhận: media-library');
  rec('release-im-2', DA_THONG_CONG_2[0], '');   // hồ sơ đã ký — miễn (grandfather)
  rec('release-do-thieu', 'draft', '');
  rec('release-do-bac', 'approved', 'Kho chờ nhận: chưa có');
  rec('release-do-placeholder', 'draft', line);
  const got = khoErrs(path.join(r, '_acceptance'), CONTRACT_TPL);
  const want9 = ['release-do-bac: giá trị bác', 'release-do-placeholder: chưa điền', 'release-do-thieu: thiếu Kho chờ nhận'].sort();
  if (JSON.stringify(got) !== JSON.stringify(want9)) errs.push(`fixture: có ${JSON.stringify(got)} — mong ${JSON.stringify(want9)}`);
  const ctp = path.join(tmp(), 'contract-template.md');
  writeFileSync(ctp, readFileSync(CONTRACT_TPL, 'utf8').replace('<<<KHO-CHO-NHAN-LINE', '<<<KHO-CHO-NHAN-LINEX'));
  try { khoErrs(path.join(r, '_acceptance'), ctp); errs.push('gỡ marker KHO-CHO-NHAN-LINE mà phép đo không đỏ'); }
  catch (e) { if (!/thiếu marker/.test(e.message)) errs.push('gỡ marker: thông điệp lạ: ' + e.message); }
  if (errs.length) fail('VC9', errs.join(' · '));
  else pass('VC9', 'mốc chưa ký khai Kho chờ nhận (cây thật + 5 hồ sơ fixture rút từ khuôn; marker là nguồn)');
}

// VC_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [VC_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`vao-co-o: ${failures} ca đỏ`); process.exit(1); }
