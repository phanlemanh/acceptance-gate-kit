// thiet-ke-nap-tri-thuc.test.mjs — hồ sơ thiet-ke-nap-tri-thuc (TT4, đợt tri-thuc-2410). Ca TN-1…TN-8.
//
// Mọi kho thử dựng trong thư mục tạm của lượt (git init + commit thật). Trang tri thức SINH từ khối TRI-THUC-TRANG rút từ
// khuôn tri-thuc-template.md thật; dòng «Nguồn:» của ô SINH bằng chính lệnh mở ô; dòng tra ghi bằng khối DEC-TRI-THUC-TRA
// rút từ SKILL feature-loop thật qua khối lệnh DEC-ID-RECIPE (bash) ở các hàng hợp đồng đòi; băm tính bằng git
// hash-object lúc chạy; kết quả kỳ vọng của đường trỏ lấy từ chính tri-thuc.mjs --con-tro. «Bộ máy trước vòng» = git
// archive GOC_VONG scripts lib skills feature-loop commands. Bản tiêm là bản sao trọn các thư mục ấy của cây, nhát tiêm
// khớp đúng một lần. Đường dẫn suy từ vị trí tệp. Mỗi ca đỏ chạy đối chứng xanh trước trên cùng đầu vào; ma trận viết
// sẵn, số hàng in ra. Chuỗi kỳ vọng chép từ hợp đồng, không rút từ mô-đun được đo.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, realpathSync, existsSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
// Gốc vòng: nhánh chính lúc cắt vòng (#407 gộp TT3). Vòng sau đổi thẻ Cổng Phạm vi thì dời hằng này tới gốc vòng ấy.
const GOC_VONG = '378e262c9a0c277d2d2d7eaea2a17cfe9c3793c2';
const THU_MUC = ['scripts', 'lib', 'skills', 'feature-loop', 'commands'];
const KHUON_TT = readFileSync(path.join(KIT, 'skills/acceptance/references/tri-thuc-template.md'), 'utf8');
const TAM = realpathSync(mkdtempSync(path.join(tmpdir(), 'tn-nap-')));
const NGAY = '2026-10-24';
let soDo = 0;
const ok = (ca, m) => console.log(`PASS: ${ca} — ${m}`);
const bad = (ca, m) => { soDo++; console.log(`FAIL: ${ca} — ${m}`); };
const ca = async (ten, fn) => { try { const r = await fn(); if (r && r.length) bad(ten, r.join(' ; ')); else ok(ten, 'đạt'); } catch (e) { bad(ten, `ném lỗi: ${e.stack || e}`); } };

// Chuỗi ghim — chép từ hợp đồng.
const S = {
  chan: 'CHƯA vào được Cổng Phạm vi: chưa tra tri thức',
  chuaTra: 'chưa tra: ',
  lech: 'trang tri thức không khớp bản đã tra: ',
  sai: 'đường trỏ tri thức sai khuôn: ',
  kd: 'không đọc được ở đây:',
  docCu: 'hồ sơ đã qua Cổng Phạm vi không có dòng tra tri thức',
  canCu: 'căn cứ: trang tri thức',
};

const khoiRao = (txt, ten) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`khuôn thiếu khối ${ten}`); return m[1]; };
const KHOI_TRANG = khoiRao(KHUON_TT, 'TRI-THUC-TRANG');
const [L_NEN, L_CHU_DE, L_DOT] = khoiRao(KHUON_TT, 'TRI-THUC-LOAI').trim().split(/\s+/);

const g = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bam = p => execFileSync('git', ['hash-object', '--', p], { encoding: 'utf8' }).trim();
const ghi = (p, t) => { mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, t); };
let dem = 0; const thuMuc = ten => { const d = path.join(TAM, `${ten}-${++dem}`); mkdirSync(d, { recursive: true }); return d; };
const khoGit = d => { mkdirSync(d, { recursive: true }); g(d, 'init', '-q', '-b', 'main'); g(d, 'config', 'user.email', 't@t'); g(d, 'config', 'user.name', 't'); return d; };
const commit = (d, m = 'c') => { g(d, 'add', '-A'); g(d, 'commit', '-q', '--allow-empty', '-m', m); };
const giaiHtml = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// Trang sinh từ khối TRI-THUC-TRANG.
const trangTu = (v, than = 'Nội dung.') => KHOI_TRANG.replace(/^([A-Za-z_]+):.*$/gm, (m, k) => (k in v ? `${k}: ${v[k]}` : m)) + `\n\n${than}\n`;
const RAW = 'raw/2026-10-24-vi-du';
const TRANG = {
  'wiki/nen/a-nen.md': { loai: L_NEN, ma: '[]' },
  'wiki/dot/d1.md': { loai: L_DOT, ma: '[A1]' },
  'wiki/chu-de/c-a1.md': { loai: L_CHU_DE, ma: '[A1]' },
  'wiki/chu-de/f-khac.md': { loai: L_CHU_DE, ma: '[]' },
};
const CUA_O = ['wiki/nen/a-nen.md', 'wiki/dot/d1.md', 'wiki/chu-de/c-a1.md'];
function dungGoc(G, than = {}) {
  ghi(path.join(G, RAW, 'ghi-chu.md'), 'ghi chú gốc\n');
  ghi(path.join(G, RAW, 'nguon.md'), `---\nloai: phien\ngoc: x\nluc: ${NGAY}\nai: t\n---\n\n- \`ghi-chu.md\` ${bam(path.join(G, RAW, 'ghi-chu.md'))}\n`);
  for (const [p, v] of Object.entries(TRANG)) ghi(path.join(G, p), trangTu({ ...v, nguon: `[${RAW}/ghi-chu.md]`, cap_nhat: NGAY }, than[p]));
}
// Khoá đợt và mã rút từ hàng TT4 thật của lộ trình kit (cùng nếp ca của TT3).
const TT4 = (JSON.parse(readFileSync(path.join(KIT, 'docs/plans/lo-trinh-kit.json'), 'utf8')).hang || []).find(h => h && h.ma === 'TT4');
const [K_DOT, K_PHU] = ['dot', 'phu'].map(k => { if (!TT4 || !(k in TT4)) throw new Error(`hàng TT4 thật thiếu khoá ${k}`); return k; });
const LO = { schema: 1, ten: 'Lộ trình thử', moc: [], hang: [
  { ma: 'X', slug: 'viec-x', hang: 'T2', [K_DOT]: 'd1', [K_PHU]: ['A1'], cau_giao: 'Việc X của đợt d1', bat_khi: 'X chạy được' },
  { ma: 'Y', slug: 'viec-y', hang: 'T2', cau_giao: 'Việc Y không thuộc đợt nào', bat_khi: 'Y chạy được' },
], da_bac: [] };
const CFG_GOC = 'schema_version: 1\ngap_probe: required\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\nlo_trinh:\n  tep: docs/plans/lo-trinh.json\n';
const CFG_NOI = 'tri_thuc:\n  noi: docs/tri-thuc\n';
const cfgKho = (duong, remote) => `tri_thuc:\n  kho:\n    ten: tt-rieng\n    duong: ${duong}\n${remote ? `    remote: ${remote}\n` : ''}`;

// Hồ sơ thử: hợp đồng ba tiêu chí, evals, phản biện sạch, sổ (chuỗi đã nối).
const hopDong = (slug, status = 'draft', n = 3) => `---\nschema_version: 1\nfeature: F\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${status === 'draft' ? '' : 'approved_by: A\napproved_at: 2026-10-05T00:00:00Z\n'}---\n\n## Criteria\n\n${Array.from({ length: n }, (_, i) => `- AC-${i + 1}: Given a${i}, When b${i}, Then c${i}.`).join('\n')}\n\n## Coverage\n\n- trục A [thước CE: x].\n\n## Out of scope\n\n- x.\n- y.\n`;
const EVALS = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.scripts\n    expected: xanh\n';
const PROBE = slug => `---\nslug: ${slug}\nat: 2026-10-24T00:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n| — | — | Không còn lỗ đáng kể | — | — | — |\n`;
function hoSo(kho, slug, { status = 'draft', so = '', n = 3 } = {}) {
  const d = path.join(kho, '_acceptance', slug);
  ghi(path.join(d, 'contract.md'), hopDong(slug, status, n));
  ghi(path.join(d, 'evals.yaml'), EVALS);
  ghi(path.join(d, 'gap-probe.md'), PROBE(slug));
  ghi(path.join(d, 'decisions.jsonl'), so);
  return d;
}
let soDong = 0;
const dongSo = o => JSON.stringify({ id: `d-20261024T000000Z-${++soDong}`, type: 'approach', stage: 'S1', at: '2026-10-24T00:00:00Z', decision: 'd', why: 'w', cost_if_wrong: 'c', ...o }) + '\n';
const MOT_LOI = { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Kho đã khai tri_thuc — bỏ tra là phạm luật nạp.' };
const dongTra = (trang, them = {}) => dongSo({ can_cu: MOT_LOI, tri_thuc_tra: { tra: 'X', trang, ...them } });

const ENV = { ...process.env, ACCEPTANCE_TODAY: NGAY };
const chay = (bin, args, cwd) => { const r = spawnSync('node', [bin, ...args], { encoding: 'utf8', env: ENV, cwd, maxBuffer: 1 << 26 }); return { thoat: r.status, out: r.stdout || '', err: r.stderr || '' }; };
// Kho thử: lộ trình + gốc tri thức trong kho (hoặc không), một commit.
function khoThu({ tt = CFG_NOI, goc = true, than = {} } = {}) {
  const d = khoGit(thuMuc('kho'));
  ghi(path.join(d, '_acceptance/config.yaml'), CFG_GOC + tt);
  ghi(path.join(d, 'docs/plans/lo-trinh.json'), JSON.stringify(LO, null, 2) + '\n');
  ghi(path.join(d, 'README.md'), 'Kho thử của ca TN — câu trích làm căn cứ nằm ở dòng này cho bộ xếp.\n');
  if (goc) dungGoc(path.join(d, 'docs/tri-thuc'), than);
  commit(d);
  return d;
}
// Kho riêng: kho git đặt ở `goc`, trang ở gốc kho riêng.
function khoRieng(goc, than = {}) { khoGit(goc); dungGoc(goc, than); commit(goc); return goc; }
const moO = (kho, ma, may = KIT) => chay(path.join(may, 'scripts/lo-trinh.mjs'), ['--root', kho, '--hang', ma, '--mo-o', '--owner', 'x@y.z']);
const conTro = (kho, ref) => chay(path.join(KIT, 'scripts/tri-thuc.mjs'), ['--root', kho, '--con-tro', ref]);
const KET_THOAT = { 0: 'khop', 1: 'lech', 2: 'sai', 3: 'khong-doc' };
const tro = (G, p, ten = '') => `${ten ? `${ten}:` : ''}${p}#${bam(path.join(G, p))}`;

// Thẻ Cổng 1: HTML + --extract.
function the(may, kho, slug) {
  const bin = path.join(may, 'scripts/gate-card.js');
  const h = chay(bin, ['--root', kho, '--slug', slug, '--gate', '1']);
  const x = chay(bin, ['--root', kho, '--slug', slug, '--gate', '1', '--extract']);
  let j = null; try { j = JSON.parse(x.out); } catch { /* ca báo */ }
  return { html: h.out, xout: x.out, j, err: h.err + x.err, ma: [h.thoat, x.thoat] };
}
const quyet = t => (t.j && typeof t.j.one_shot === 'string' ? t.j.one_shot.trim().split(/\s+/).pop() : null);
const coTriThuc = html => [...html.matchAll(/<div class="flag (fred|fwarn) tri-thuc">([\s\S]*?)<\/div>/g)].map(m => ({ lop: m[1], van: giaiHtml(m[2]).replace(/^⚠\s*/, '') }));
const coVang = html => coTriThuc(html).filter(c => c.lop === 'fwarn');
const coDo = html => coTriThuc(html).filter(c => c.lop === 'fred');

// Bộ máy trước vòng và bản tiêm.
let MAY_CU = null;
function mayCu() {
  if (MAY_CU) return MAY_CU;
  const d = thuMuc('may-cu');
  const tar = execFileSync('git', ['-C', KIT, 'archive', GOC_VONG, ...THU_MUC], { maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  return (MAY_CU = d);
}
function banCay() { const d = thuMuc('may-cay'); for (const x of THU_MUC) cpSync(path.join(KIT, x), path.join(d, x), { recursive: true }); return d; }
function banTiem(sua) {
  const d = banCay();
  for (const [tep, [tim, thay]] of Object.entries(sua)) {
    const p = path.join(d, tep); const t = readFileSync(p, 'utf8'); const n = t.split(tim).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần ở ${tep}: ${tim}`);
    writeFileSync(p, t.replace(tim, thay));
    if (readFileSync(p, 'utf8') === t) throw new Error(`nhát tiêm không áp ở ${tep}`);
  }
  return d;
}

// Khuôn SKILL → sổ qua khối lệnh DEC-ID-RECIPE (bash). `skill` là chữ SKILL (cho bản tiêm).
const SKILL_TEP = path.join(KIT, 'feature-loop/skills/feature-loop/SKILL.md');
const khoiDong = (t, ten) => { const m = t.match(new RegExp(`<!-- <<<${ten} -->\\n([^\\n]+)\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`SKILL thiếu khối ${ten} (một dòng)`); return m[1]; };
const congThuc = t => { const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]+?)\n```\n<!-- DEC-ID-RECIPE>>> -->/); if (!m) throw new Error('SKILL thiếu khối DEC-ID-RECIPE'); return m[1].split('\n'); };
function chayCongThuc(kho, slug, giua, skill) {
  const [l1, , l3] = congThuc(skill);
  const sc = `${l1.replace('<slug>', slug)}\n${giua}\n${l3}\n`;
  const r = spawnSync('bash', ['-c', sc], { cwd: kho, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`khối lệnh DEC-ID-RECIPE thoát ${r.status}: ${r.stderr}`);
  const ls = readFileSync(path.join(kho, '_acceptance', slug, 'decisions.jsonl'), 'utf8').trim().split('\n');
  return JSON.parse(ls[ls.length - 1]);
}
function ghiTra(kho, slug, trang, { skill = readFileSync(SKILL_TEP, 'utf8'), them = '' } = {}) {
  const k = khoiDong(skill, 'DEC-TRI-THUC-TRA');
  if (!k.includes('"<đường trỏ băm>"')) throw new Error('khối DEC-TRI-THUC-TRA thiếu ô "<đường trỏ băm>"');
  const giua = k.split('<ISO>').join('2026-10-24T00:00:00Z').split('<mã hàng hoặc câu tra>').join('X')
    .split('"<đường trỏ băm>"').join(trang.map(x => JSON.stringify(x)).join(',')) + them;
  return chayCongThuc(kho, slug, giua, skill);
}
function ghiCanCuTriThuc(kho, slug, ref, { skill = readFileSync(SKILL_TEP, 'utf8') } = {}) {
  const slot = khoiDong(skill, 'DEC-CAN-CU-TRI-THUC');
  const giuaGoc = congThuc(skill)[1];
  const dien = { '<type>': 'approach', '<stage>': 'S1', '<ISO>': '2026-10-24T00:00:00Z', '<1 câu>': 'Chọn theo trang tri thức', '<vì sao, 1 câu>': 'Trang đã nêu.', '<sai thì tốn gì, 1 câu>': 'Đổi rẻ.' };
  const giua = Object.entries(dien).reduce((s, [a, b]) => s.split(a).join(b), giuaGoc) + slot.split('<kho>:<trang>#<băm>').join(ref);
  return chayCongThuc(kho, slug, giua, skill);
}

// Kho noi + ô X (dòng «Nguồn:» ba trang) + ô Y (không dòng).
function khoCoO(opts) {
  const kho = khoThu(opts);
  for (const ma of ['X', 'Y']) { const r = moO(kho, ma); if (r.thoat !== 0) throw new Error(`mở ô ${ma} thoát ${r.thoat}: ${r.err}`); }
  return kho;
}
const G_NOI = kho => path.join(kho, 'docs/tri-thuc');

// ── TN-1 (AC-1): thiếu dòng / thiếu trang của ô → chặn; đủ → mời; hai dòng → theo dòng cuối còn hiệu lực ──────────────
function hangTN1(may) {
  const ra = [];
  const k = khoCoO(); const G = G_NOI(k);
  const tr = CUA_O.map(p => tro(G, p));
  const them = tro(G, 'wiki/chu-de/f-khac.md');
  // 1 · không dòng tra
  hoSo(k, 'viec-x'); ra.push({ hang: 1, t: the(may, k, 'viec-x'), chan: true, chua: [] });
  // 2 · thiếu trang chu-de của ô
  hoSo(k, 'viec-x', { so: dongTra(tr.slice(0, 2)) }); ra.push({ hang: 2, t: the(may, k, 'viec-x'), chan: true, chua: ['wiki/chu-de/c-a1.md'] });
  // 3 · đủ ba trang của ô + một trang khác
  hoSo(k, 'viec-x', { so: dongTra([...tr, them]) }); ra.push({ hang: 3, t: the(may, k, 'viec-x'), chan: false, chua: [] });
  // 4 · trang: [] trên ô không dòng «Nguồn:»
  hoSo(k, 'viec-y', { so: dongTra([]) }); ra.push({ hang: 4, t: the(may, k, 'viec-y'), chan: false, chua: [] });
  // 5 · hai dòng (khuôn thật): dòng một thiếu, dòng hai đủ
  hoSo(k, 'viec-x'); ghiTra(k, 'viec-x', tr.slice(0, 2)); ghiTra(k, 'viec-x', tr);
  ra.push({ hang: 5, t: the(may, k, 'viec-x'), chan: false, chua: [] });
  // 6 · dòng một đủ, dòng hai supersedes dòng một và thiếu trang chu-de
  hoSo(k, 'viec-x'); const d1 = ghiTra(k, 'viec-x', tr); ghiTra(k, 'viec-x', tr.slice(0, 2), { them: `,"supersedes":"${d1.id}"` });
  ra.push({ hang: 6, t: the(may, k, 'viec-x'), chan: true, chua: ['wiki/chu-de/c-a1.md'] });
  return ra;
}
function soTN1(hs, chiHang = null) {
  const sai = [];
  for (const h of hs) {
    if (chiHang && !chiHang.includes(h.hang)) continue;
    const j = h.t.j; const tt = j && j.tri_thuc;
    const html = giaiHtml(h.t.html);
    console.log(`  TN-1 hàng ${h.hang}: chan=${tt && tt.chan} chua_tra=${JSON.stringify(tt && tt.chua_tra)} ô quyết=${quyet(h.t)}`);
    if (!tt) { sai.push(`hàng ${h.hang}: --extract không có khoá tri_thuc (${h.t.err.slice(0, 160)})`); continue; }
    if (tt.chan !== h.chan) sai.push(`hàng ${h.hang}: chan ${tt.chan} ≠ ${h.chan}`);
    if (JSON.stringify(tt.chua_tra) !== JSON.stringify(h.chua)) sai.push(`hàng ${h.hang}: chua_tra ${JSON.stringify(tt.chua_tra)} ≠ ${JSON.stringify(h.chua)}`);
    const q = quyet(h.t);
    if (h.chan) {
      if (q !== '___') sai.push(`hàng ${h.hang}: ô quyết «${q}», cần «___»`);
      if (!html.includes(S.chan)) sai.push(`hàng ${h.hang}: thiếu dòng «${S.chan}»`);
      for (const c of h.chua) if (!html.includes(S.chuaTra + c)) sai.push(`hàng ${h.hang}: thiếu «${S.chuaTra}${c}»`);
    } else {
      if (q !== 'duyệt') sai.push(`hàng ${h.hang}: ô quyết «${q}», cần «duyệt»`);
      if (html.includes(S.chan)) sai.push(`hàng ${h.hang}: có dòng «${S.chan}» khi không chặn`);
      if (coTriThuc(h.t.html).length) sai.push(`hàng ${h.hang}: có cờ tri thức ${JSON.stringify(coTriThuc(h.t.html))}`);
    }
  }
  return sai;
}
await ca('TN-1', () => soTN1(hangTN1(KIT)));
await ca('TN-1-mutant', () => {
  const doi = soTN1(hangTN1(KIT), [1]); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/gate-card.js': [' || (ttG1 && ttG1.chan)', ''] });
  const h1 = hangTN1(m)[0];
  return quyet(h1.t) === 'duyệt' ? [] : [`bỏ chan mà thẻ vẫn mời duyệt — KHÔNG: bản tiêm vẫn cho ô quyết «${quyet(h1.t)}»`];
});
await ca('TN-1-mutant-dau', () => {
  const m = banTiem({ 'scripts/tri-thuc-tra.cjs': ['&& !biThay.has(e.id)) ra = e;', '&& !biThay.has(e.id)) ra = ra || e;'] });
  const h5 = hangTN1(m)[4];
  const tt = h5.t.j && h5.t.j.tri_thuc;
  return tt && tt.chan === true ? [] : [`lấy dòng tra đầu mà thẻ vẫn đúng — bản tiêm cho chan ${tt && tt.chan}`];
});

// ── TN-2 (AC-2): lệch băm / sai khuôn / tệp không có → cờ vàng, không chặn ─────────────────────────────────────────────
function hangTN2(may) {
  const ra = [];
  { const k = khoCoO(); const G = G_NOI(k); const tr = CUA_O.map(p => tro(G, p));
    hoSo(k, 'viec-x', { so: dongTra(tr) });
    ghi(path.join(G, 'wiki/chu-de/c-a1.md'), readFileSync(path.join(G, 'wiki/chu-de/c-a1.md'), 'utf8') + 'Sửa sau khi tra.\n'); commit(k);
    ra.push({ hang: 1, k, tr, t: the(may, k, 'viec-x'), mong: S.lech + tr[2] }); }
  { const k = khoCoO(); const G = G_NOI(k); const tr = CUA_O.map(p => tro(G, p)); const xau = 'wiki/nen/a-nen.md#abc';
    hoSo(k, 'viec-x', { so: dongTra([...tr, xau]) });
    ra.push({ hang: 2, k, tr: [...tr, xau], t: the(may, k, 'viec-x'), mong: S.sai + xau }); }
  { const k = khoCoO(); const G = G_NOI(k); const tr = CUA_O.map(p => tro(G, p)); const vang = `wiki/chu-de/khong-co.md#${'a'.repeat(40)}`;
    hoSo(k, 'viec-x', { so: dongTra([...tr, vang]) });
    ra.push({ hang: 3, k, tr: [...tr, vang], t: the(may, k, 'viec-x'), mong: S.lech + vang }); }
  return ra;
}
function soTN2(hs, chiHang = null) {
  const sai = [];
  for (const h of hs) {
    if (chiHang && !chiHang.includes(h.hang)) continue;
    const tt = h.t.j && h.t.j.tri_thuc; const cv = coVang(h.t.html);
    console.log(`  TN-2 hàng ${h.hang}: chan=${tt && tt.chan} ô quyết=${quyet(h.t)} cờ=${JSON.stringify(cv.map(c => c.van))}`);
    if (!tt) { sai.push(`hàng ${h.hang}: không có khoá tri_thuc`); continue; }
    if (tt.chan !== false) sai.push(`hàng ${h.hang}: chan ${tt.chan}`);
    if (quyet(h.t) !== 'duyệt') sai.push(`hàng ${h.hang}: ô quyết «${quyet(h.t)}»`);
    if (cv.length !== 1 || cv[0].van !== h.mong) sai.push(`hàng ${h.hang}: cờ ${JSON.stringify(cv.map(c => c.van))} ≠ [«${h.mong}»]`);
    for (const ref of h.tr) {
      const ket = KET_THOAT[conTro(h.k, ref).thoat];
      const o = (tt.trang || []).find(x => x.tro === ref);
      if (!o || o.ket !== ket) sai.push(`hàng ${h.hang}: ${ref} kết quả ${o && o.ket} ≠ --con-tro ${ket}`);
    }
  }
  return sai;
}
await ca('TN-2', () => soTN2(hangTN2(KIT)));
await ca('TN-2-mutant', () => {
  const doi = soTN2(hangTN2(KIT), [1]); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/tri-thuc-tra.cjs': ['ket: KET[r.status] ||', 'ket: KET[0] ||'] });
  const h1 = hangTN2(m)[0];
  return coVang(h1.t.html).length === 0 ? [] : [`so băm luôn khớp mà thẻ im — KHÔNG: bản tiêm vẫn có cờ ${JSON.stringify(coVang(h1.t.html))}`];
});

// ── TN-3 (AC-3): kho riêng vắng → nhãn «không đọc được ở đây», không chặn; khong_doc thắng thiếu trang ────────────────
function hangTN3(may, { chiHang3 = false } = {}) {
  const ra = [];
  const cha = thuMuc('tn3');
  const kho = path.join(cha, 'kho'); const rieng = path.join(cha, 'tt-rieng');
  khoGit(kho);
  ghi(path.join(kho, '_acceptance/config.yaml'), CFG_GOC + cfgKho('../tt-rieng'));
  ghi(path.join(kho, 'docs/plans/lo-trinh.json'), JSON.stringify(LO, null, 2) + '\n'); commit(kho);
  khoRieng(rieng);
  const r = moO(kho, 'X'); if (r.thoat !== 0) throw new Error(`mở ô X thoát ${r.thoat}: ${r.err}`);
  const tr = CUA_O.slice(0, 2).map(p => tro(rieng, p, 'tt-rieng'));
  const kdChu = 'không đọc được ở đây: tt-rieng — git clone (máy này không có bản kho riêng)';
  // đối chứng: kho riêng có ở đường → không cờ «không đọc được»
  hoSo(kho, 'g', { so: dongTra(tr) });
  const coThat = the(may, kho, 'g');
  renameSync(rieng, path.join(cha, 'tt-rieng-cat'));
  if (!chiHang3) {
    ra.push({ hang: 1, t: the(may, kho, 'g') });
    hoSo(kho, 'g', { so: dongTra([], { khong_doc: kdChu }) }); ra.push({ hang: 2, t: the(may, kho, 'g') });
  }
  hoSo(kho, 'viec-x', { so: dongTra([], { khong_doc: kdChu }) }); ra.push({ hang: 3, t: the(may, kho, 'viec-x') });
  hoSo(kho, 'viec-x', { so: dongTra([]) }); const doiChung3 = the(may, kho, 'viec-x');
  const oNguon = readFileSync(path.join(kho, '_acceptance/viec-x/opportunity.md'), 'utf8').split('\n').find(l => l.startsWith('Nguồn:')) || '';
  return { ra, coThat, doiChung3, oNguon };
}
function soTN3({ ra, coThat, doiChung3, oNguon }) {
  const sai = [];
  const soTro = (oNguon.match(/`tt-rieng:[^`]+`/g) || []).length;
  console.log(`  TN-3 ô X: ${soTro} đường trỏ kho riêng trên dòng «Nguồn:»`);
  if (soTro < 2) sai.push(`ô X không trỏ trang kho riêng (dòng «${oNguon}») — hàng ba không đo được`);
  for (const h of ra) {
    const tt = h.t.j && h.t.j.tri_thuc; const cv = coVang(h.t.html).map(c => c.van);
    console.log(`  TN-3 hàng ${h.hang}: chan=${tt && tt.chan} chua_tra=${JSON.stringify(tt && tt.chua_tra)} ô quyết=${quyet(h.t)} cờ=${JSON.stringify(cv)}`);
    if (!tt) { sai.push(`hàng ${h.hang}: không có khoá tri_thuc`); continue; }
    if (tt.chan !== false) sai.push(`hàng ${h.hang}: chan ${tt.chan}`);
    if ((tt.chua_tra || []).length) sai.push(`hàng ${h.hang}: chua_tra ${JSON.stringify(tt.chua_tra)}`);
    if (quyet(h.t) !== 'duyệt') sai.push(`hàng ${h.hang}: ô quyết «${quyet(h.t)}»`);
    if (cv.length !== 1 || !cv[0].startsWith(S.kd) || !cv[0].includes('tt-rieng')) sai.push(`hàng ${h.hang}: cờ ${JSON.stringify(cv)} — cần đúng một cờ «${S.kd} … tt-rieng»`);
    if (giaiHtml(h.t.html).includes(S.chan)) sai.push(`hàng ${h.hang}: có dòng «${S.chan}»`);
  }
  const t3 = doiChung3.j && doiChung3.j.tri_thuc;
  if (!t3 || t3.chan !== true) sai.push(`đối chứng hàng ba (không khong_doc): chan ${t3 && t3.chan}, cần true`);
  if (coVang(coThat.html).some(c => c.van.startsWith(S.kd))) sai.push('kho riêng có ở đường mà vẫn cờ «không đọc được»');
  return sai;
}
await ca('TN-3', () => soTN3(hangTN3(KIT)));
await ca('TN-3-mutant', () => {
  const m = banTiem({ 'scripts/tri-thuc-tra.cjs': ['const chuaTra = e && !e[KHOA_TRA].khong_doc ? ', 'const chuaTra = e ? '] });
  const { ra } = hangTN3(m, { chiHang3: true });
  const tt = ra[0].t.j && ra[0].t.j.tri_thuc;
  return tt && tt.chan === true ? [] : [`bỏ miễn khong_doc mà thẻ vẫn không chặn — bản tiêm cho chan ${tt && tt.chan}`];
});

// ── TN-4 (AC-4): tự clone kho riêng ───────────────────────────────────────────────────────────────────────────────────────
await ca('TN-4', () => {
  const sai = []; const bin = path.join(KIT, 'scripts/tri-thuc-tra.cjs');
  const nguon = khoRieng(path.join(thuMuc('tn4-nguon'), 'src'));
  const tran = path.join(thuMuc('tn4-tran'), 'tt.git'); execFileSync('git', ['clone', '-q', '--bare', nguon, tran]);
  const khoVoi = tt => { const cha = thuMuc('tn4'); const kho = khoGit(path.join(cha, 'kho')); ghi(path.join(kho, '_acceptance/config.yaml'), CFG_GOC + tt); commit(kho); return { cha, kho }; };
  const dong = r => (r.out + r.err).trim().split('\n')[0] || '';
  const bang = [];
  // 1 · clone từ kho trần
  const a = khoVoi(cfgKho('../tt-rieng', tran));
  const r1 = chay(bin, ['--root', a.kho, '--clone']); bang.push([1, r1.thoat, dong(r1)]);
  const dich = path.join(a.cha, 'tt-rieng');
  if (r1.thoat !== 0 || !dong(r1).startsWith('đã clone')) sai.push(`hàng 1: thoát ${r1.thoat} «${dong(r1)}»`);
  if (!existsSync(path.join(dich, 'wiki/nen/a-nen.md'))) sai.push('hàng 1: kho riêng clone về không có trang');
  else { const c = conTro(a.kho, tro(dich, 'wiki/nen/a-nen.md', 'tt-rieng')); if (c.thoat !== 0) sai.push(`hàng 1: --con-tro trên trang clone về thoát ${c.thoat}`); }
  // 2 · không khai remote
  const b = khoVoi(cfgKho('../tt-rieng'));
  const r2 = chay(bin, ['--root', b.kho, '--clone']); bang.push([2, r2.thoat, dong(r2)]);
  if (r2.thoat !== 3 || !dong(r2).startsWith(S.kd) || !dong(r2).includes('kho.remote')) sai.push(`hàng 2: thoát ${r2.thoat} «${dong(r2)}»`);
  // 3 · remote trỏ đường không có
  const c3 = khoVoi(cfgKho('../tt-rieng', path.join(TAM, 'khong-co.git')));
  const r3 = chay(bin, ['--root', c3.kho, '--clone']); bang.push([3, r3.thoat, dong(r3)]);
  if (r3.thoat !== 3 || !dong(r3).startsWith(S.kd) || !dong(r3).includes('clone thất bại')) sai.push(`hàng 3: thoát ${r3.thoat} «${dong(r3)}»`);
  // 4 · chạy lại sau hàng 1
  const head = existsSync(dich) ? g(dich, 'rev-parse', 'HEAD') : null;
  const r4 = chay(bin, ['--root', a.kho, '--clone']); bang.push([4, r4.thoat, dong(r4)]);
  if (r4.thoat !== 0 || !dong(r4).startsWith('đã có')) sai.push(`hàng 4: thoát ${r4.thoat} «${dong(r4)}»`);
  if (head && g(dich, 'rev-parse', 'HEAD') !== head) sai.push('hàng 4: HEAD kho riêng đổi');
  // 5 · chỉ noi
  const e = khoVoi(CFG_NOI);
  const r5 = chay(bin, ['--root', e.kho, '--clone']); bang.push([5, r5.thoat, dong(r5)]);
  if (r5.thoat !== 0 || !dong(r5).startsWith('kho tri thức nằm trong kho')) sai.push(`hàng 5: thoát ${r5.thoat} «${dong(r5)}»`);
  // 6 · không khai
  const f = khoVoi('');
  const r6 = chay(bin, ['--root', f.kho, '--clone']); bang.push([6, r6.thoat, dong(r6)]);
  if (r6.thoat !== 2) sai.push(`hàng 6: thoát ${r6.thoat}, cần 2`);
  // 7 · đường kho riêng trong cây kho
  const h = khoVoi(cfgKho('vendor/tt', tran));
  const truoc = g(h.kho, 'status', '--porcelain');
  const r7 = chay(bin, ['--root', h.kho, '--clone']); bang.push([7, r7.thoat, dong(r7)]);
  if (r7.thoat !== 3 || !dong(r7).startsWith(S.kd) || !dong(r7).includes('nằm trong cây kho')) sai.push(`hàng 7: thoát ${r7.thoat} «${dong(r7)}»`);
  if (existsSync(path.join(h.kho, 'vendor/tt'))) sai.push('hàng 7: thư mục đích được tạo trong cây kho');
  if (g(h.kho, 'status', '--porcelain') !== truoc) sai.push('hàng 7: git status đổi');
  for (const [i, t, d] of bang) console.log(`  TN-4 hàng ${i}: thoát ${t} · ${d}`);
  return sai;
});

// ── TN-5 (AC-5): bộ xếp căn cứ nhận khoá tri_thuc ─────────────────────────────────────────────────────────────────────
const muc = (ref, them = {}) => dongSo({ can_cu: { nguon: 'muc-tieu', kho_dao: false, tri_thuc: ref, ...them } });
function hangTN5(may) {
  const CC = require(path.join(may, 'scripts/can-cu-s1.cjs'));
  const docSo = d => CC.docSo(readFileSync(path.join(d, 'decisions.jsonl'), 'utf8')).entries;
  const ra = [];
  // K1 · noi: khớp · lệch · sai khuôn · sinh trong vòng
  const k1 = khoThu(); const G = G_NOI(k1); const base = g(k1, 'rev-parse', 'HEAD');
  ghi(path.join(G, 'wiki/chu-de/moi.md'), trangTu({ ...TRANG['wiki/chu-de/f-khac.md'], nguon: `[${RAW}/ghi-chu.md]`, cap_nhat: NGAY })); commit(k1);
  const d1 = hoSo(k1, 'g', { so: muc(tro(G, 'wiki/nen/a-nen.md')) + muc(`wiki/nen/a-nen.md#${'0'.repeat(40)}`) + muc('wiki/nen/a-nen.md#abc') + muc(tro(G, 'wiki/chu-de/moi.md')) });
  const kq1 = CC.phanLoaiSo(docSo(d1), { root: k1, slug: 'g', base });
  // K2 · kho riêng có ở máy: kèm trích
  const cha2 = thuMuc('tn5'); const k2 = khoGit(path.join(cha2, 'kho')); ghi(path.join(k2, '_acceptance/config.yaml'), CFG_GOC + cfgKho('../tt-rieng')); commit(k2);
  const rieng = khoRieng(path.join(cha2, 'tt-rieng')); const refR = tro(rieng, 'wiki/nen/a-nen.md', 'tt-rieng');
  const d2 = hoSo(k2, 'g', { so: muc(refR, { trich: 'Nội dung của trang ở kho riêng chép sang sổ.' }) });
  const kq2 = CC.phanLoaiSo(docSo(d2), { root: k2, slug: 'g' });
  // K2b · kho riêng vắng ở máy
  const cha3 = thuMuc('tn5b'); const k3 = khoGit(path.join(cha3, 'kho')); ghi(path.join(k3, '_acceptance/config.yaml'), CFG_GOC + cfgKho('../tt-rieng')); commit(k3);
  const d3 = hoSo(k3, 'g', { so: muc(refR) });
  const kq3 = CC.phanLoaiSo(docSo(d3), { root: k3, slug: 'g' });
  // K0 · không khai
  const k0 = khoThu({ tt: '' }); const d0 = hoSo(k0, 'g', { so: muc(tro(G_NOI(k0), 'wiki/nen/a-nen.md')) });
  const kq0 = CC.phanLoaiSo(docSo(d0), { root: k0, slug: 'g' });
  const [a, b, c, d7] = kq1.dong;
  ra.push({ hang: 1, d: a, lop: 'da-quyet' }, { hang: 2, d: b, lop: 'do', ma: 'tri-thuc-lech' }, { hang: 3, d: c, lop: 'do', ma: 'tri-thuc-sai' },
    { hang: 4, d: kq3.dong[0], lop: 'da-quyet', ghi: S.kd }, { hang: 5, d: kq2.dong[0], lop: 'do', ma: 'tri-thuc-kem-trich' },
    { hang: 6, d: kq0.dong[0], lop: 'do', ma: 'tri-thuc-khong-khai' }, { hang: 7, d: d7, lop: 'do', ma: 'sinh-trong-vong' });
  return ra;
}
function soTN5(hs, chiHang = null) {
  const sai = [];
  for (const h of hs) {
    if (chiHang && !chiHang.includes(h.hang)) continue;
    const d = h.d || {};
    console.log(`  TN-5 hàng ${h.hang}: lớp ${d.lop} · mã ${d.ma || '—'}${d.ghi_chu ? ` · ghi chú «${d.ghi_chu}»` : ''}`);
    if (d.lop === 'cau-hoi') sai.push(`hàng ${h.hang}: rơi thành câu hỏi`);
    if (d.lop !== h.lop) sai.push(`hàng ${h.hang}: lớp ${d.lop} ≠ ${h.lop}`);
    if (h.ma && d.ma !== h.ma) sai.push(`hàng ${h.hang}: mã ${d.ma} ≠ ${h.ma}`);
    if (h.ghi && !String(d.ghi_chu || '').startsWith(h.ghi)) sai.push(`hàng ${h.hang}: ghi chú «${d.ghi_chu}» không mở bằng «${h.ghi}»`);
  }
  return sai;
}
await ca('TN-5', () => soTN5(hangTN5(KIT)));
await ca('TN-5-mutant', () => {
  const doi = soTN5(hangTN5(KIT), [1]); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/can-cu-s1.cjs': ['if (c.tri_thuc !== undefined) {', 'if (false) {'] });
  const d = hangTN5(m)[0].d;
  return d.lop === 'do' && d.ma === 'thieu-con-tro' ? [] : [`bỏ nhánh tri_thuc mà bộ xếp vẫn nhận — bản tiêm cho ${d.lop} ${d.ma}`];
});

// ── TN-6 (AC-6): thẻ in đường trỏ, không rò câu chữ của kho riêng ──────────────────────────────────────────────────────
await ca('TN-6', () => {
  const sai = []; const canh = `CAU-CANH-${randomBytes(8).toString('hex')}`;
  const cha = thuMuc('tn6'); const kho = khoGit(path.join(cha, 'kho')); ghi(path.join(kho, '_acceptance/config.yaml'), CFG_GOC + cfgKho('../tt-rieng')); commit(kho);
  const rieng = khoRieng(path.join(cha, 'tt-rieng'), { 'wiki/chu-de/c-a1.md': `Nhận định riêng tư: ${canh}.` });
  if (!readFileSync(path.join(rieng, 'wiki/chu-de/c-a1.md'), 'utf8').includes(canh)) return ['đối chứng: câu canh không có trong trang kho riêng'];
  const ref = tro(rieng, 'wiki/chu-de/c-a1.md', 'tt-rieng');
  hoSo(kho, 'g', { so: dongTra([ref]) + muc(ref) });
  const t = the(KIT, kho, 'g'); const html = giaiHtml(t.html);
  const cc = chay(path.join(KIT, 'scripts/can-cu-s1.cjs'), ['--root', kho, '--slug', 'g', '--json']);
  console.log(`  TN-6: HTML ${t.html.length} byte · JSON ${t.xout.length} byte · bộ xếp ${cc.out.length} byte`);
  if (!html.includes(`${S.canCu} ${ref}`)) sai.push(`HTML thiếu «${S.canCu} ${ref}»`);
  const dq = (t.j && t.j.can_cu && t.j.can_cu.da_quyet) || [];
  if (!dq.some(x => x.tri_thuc === ref)) sai.push(`JSON can_cu.da_quyet không có phần tử tri_thuc === ${ref}`);
  for (const [ten, s] of [['HTML', t.html], ['JSON', t.xout], ['can-cu-s1 --json', cc.out]]) if (s.includes(canh)) sai.push(`câu canh rò vào ${ten}`);
  if (!cc.out.trim()) sai.push(`can-cu-s1 --json không in gì: ${cc.err.slice(0, 160)}`);
  return sai;
});

// ── TN-7 (AC-7): kho không khai → thẻ và bộ xếp giống từng byte bộ máy trước vòng; hồ sơ cũ ở kho đã khai → cờ đọc-cũ ──
const CHI_NGUOI = { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Giữ như cũ.', loi_khac: 'Đổi — tốn hai tiêu chí.' };
function hoSoTN7(kho) {
  hoSo(kho, 'g1');
  hoSo(kho, 'g2', { so: dongSo({ can_cu: CHI_NGUOI }) });
  hoSo(kho, 'g3', { n: 11 });
  hoSo(kho, 'g4', { status: 'approved' });
  hoSo(kho, 'g5', { so: dongSo({ can_cu: { nguon: 'muc-tieu', kho_dao: false, tep: 'README.md', trich: 'câu trích làm căn cứ nằm ở dòng này cho bộ xếp' } }) });
  commit(kho);
}
function soTN7(may) {
  const sai = []; const kho = khoThu({ tt: '' }); hoSoTN7(kho);
  for (const s of ['g1', 'g2', 'g3', 'g4', 'g5']) {
    const a = the(may, kho, s); const b = the(mayCu(), kho, s);
    const ca1 = chay(path.join(may, 'scripts/can-cu-s1.cjs'), ['--root', kho, '--slug', s, '--json']);
    const cb = chay(path.join(mayCu(), 'scripts/can-cu-s1.cjs'), ['--root', kho, '--slug', s, '--json']);
    console.log(`  TN-7 ${s}: HTML ${a.html.length}/${b.html.length} · JSON ${a.xout.length}/${b.xout.length} · bộ xếp ${ca1.out.length}/${cb.out.length} byte (cây/trước vòng)`);
    if (!b.html.length || !b.xout.length) sai.push(`${s}: bộ máy trước vòng không dựng được thẻ — ${b.err.slice(0, 160)}`);
    if (!Buffer.from(a.html).equals(Buffer.from(b.html))) sai.push(`${s}: HTML lệch`);
    if (!Buffer.from(a.xout).equals(Buffer.from(b.xout))) sai.push(`${s}: --extract lệch`);
    if (!Buffer.from(ca1.out).equals(Buffer.from(cb.out))) sai.push(`${s}: can-cu-s1 --json lệch`);
  }
  return sai;
}
await ca('TN-7', () => {
  const sai = soTN7(banCay());
  // Kho ĐÃ khai: hồ sơ approved không dòng tra.
  const k = khoThu(); hoSo(k, 'g4', { status: 'approved' }); commit(k);
  const k0 = khoThu({ tt: '' }); hoSo(k0, 'g4', { status: 'approved' }); commit(k0);
  const t = the(KIT, k, 'g4'); const t0 = the(KIT, k0, 'g4');
  const tt = t.j && t.j.tri_thuc; const cv = coVang(t.html).map(c => c.van);
  console.log(`  TN-7 kho đã khai g4: chan=${tt && tt.chan} ô quyết=${quyet(t)} (kho không khai: ${quyet(t0)}) cờ=${JSON.stringify(cv)}`);
  if (!tt || tt.chan !== false) sai.push(`kho đã khai g4: chan ${tt && tt.chan}`);
  if (quyet(t) !== quyet(t0)) sai.push(`kho đã khai g4: ô quyết «${quyet(t)}» ≠ kho không khai «${quyet(t0)}»`);
  if (cv.length !== 1 || !cv[0].startsWith(S.docCu)) sai.push(`kho đã khai g4: cờ ${JSON.stringify(cv)} — cần đúng một cờ «${S.docCu}…»`);
  if (coDo(t.html).length) sai.push('kho đã khai g4: có dòng đỏ tri thức');
  return sai;
});
await ca('TN-7-mutant', () => {
  const m = banTiem({ 'scripts/gate-card.js': ['...(ttG1 ? { tri_thuc: ttG1.khoa } : {})', 'tri_thuc: ttG1 ? ttG1.khoa : null'] });
  const sai = soTN7(m);
  return sai.some(s => s.startsWith('g1: --extract lệch')) ? [] : [`kho không khai mà thẻ đổi — KHÔNG phát hiện: ${sai.join(' ; ') || 'mọi đầu ra bằng nhau'}`];
});

// ── TN-8 (AC-8): khuôn SKILL → sổ → thẻ và bộ xếp ────────────────────────────────────────────────────────────────────
function tn8(skill) {
  const k = khoCoO(); const G = G_NOI(k); const tr = CUA_O.map(p => tro(G, p));
  hoSo(k, 'viec-x');
  ghiTra(k, 'viec-x', tr, { skill }); ghiCanCuTriThuc(k, 'viec-x', tr[2], { skill });
  const t = the(KIT, k, 'viec-x');
  const CC = require(path.join(KIT, 'scripts/can-cu-s1.cjs'));
  const kq = CC.phanLoaiSo(CC.docSo(readFileSync(path.join(k, '_acceptance/viec-x/decisions.jsonl'), 'utf8')).entries, { root: k, slug: 'viec-x' });
  return { t, kq };
}
await ca('TN-8', () => {
  const sai = []; const skill = readFileSync(SKILL_TEP, 'utf8');
  const { t, kq } = tn8(skill);
  const tt = t.j && t.j.tri_thuc;
  console.log(`  TN-8: chan=${tt && tt.chan} cờ=${JSON.stringify(coTriThuc(t.html).map(c => c.van))} bộ xếp=${JSON.stringify(kq.dong.map(d => d.lop))}`);
  if (!tt || tt.chan !== false) sai.push(`thẻ chan ${tt && tt.chan}`);
  if (coTriThuc(t.html).length) sai.push('thẻ có cờ tri thức');
  if (kq.dong.length !== 2 || !kq.dong.every(d => d.lop === 'da-quyet')) sai.push(`bộ xếp ${JSON.stringify(kq.dong.map(d => [d.lop, d.ma]))}`);
  // Khối TRI-THUC-TRA-CHAN: khoá đường thẻ phát ra khi chặn.
  const m = skill.match(/<!-- <<<TRI-THUC-TRA-CHAN -->\n([\s\S]*?)<!-- TRI-THUC-TRA-CHAN>>> -->/);
  if (!m) return [...sai, 'SKILL thiếu khối TRI-THUC-TRA-CHAN'];
  const kh = m[1].match(/khi: ([\w.]+) = (true|false)/);
  if (!kh) return [...sai, 'khối TRI-THUC-TRA-CHAN thiếu «khi: <khoá> = <giá trị>»'];
  const k = khoCoO(); hoSo(k, 'viec-x'); const tc = the(KIT, k, 'viec-x');
  const v = kh[1].split('.').reduce((o, x) => (o == null ? o : o[x]), tc.j);
  console.log(`  TN-8: khối chặn «${kh[1]} = ${kh[2]}» · thẻ hàng chặn phát ${v}`);
  if (String(v) !== kh[2]) sai.push(`khối chặn ${kh[1]} = ${kh[2]} mà thẻ phát ${v}`);
  for (const cap of ['lan_v: khong', 'moi_nguoi: khong', 'loi_ra: tra']) if (!m[1].includes(cap)) sai.push(`khối TRI-THUC-TRA-CHAN thiếu «${cap}»`);
  return sai;
});
await ca('TN-8-mutant', () => {
  const skill = readFileSync(SKILL_TEP, 'utf8');
  const tiem = skill.replace(/(<!-- <<<DEC-TRI-THUC-TRA -->\n[^\n]*)"tri_thuc_tra":/, '$1"trithuctra":');
  if (tiem === skill) throw new Error('mũi tiêm khuôn không áp');
  const { t } = tn8(tiem);
  const tt = t.j && t.j.tri_thuc;
  return tt && tt.chan === true ? [] : [`khuôn đổi tên khoá mà thẻ vẫn nhận — bản tiêm cho chan ${tt && tt.chan}`];
});

console.log(`\nthiet-ke-nap-tri-thuc: ${soDo ? `${soDo} ca đỏ` : 'mọi ca xanh'}`);
process.exit(soDo ? 1 : 0);
