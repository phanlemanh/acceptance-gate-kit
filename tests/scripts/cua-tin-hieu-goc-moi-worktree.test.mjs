// cua-tin-hieu-goc-moi-worktree.test.mjs — hồ sơ cua-tin-hieu-goc-moi-worktree (hàng RM3b), ca GW-<n> = AC-n của hợp
// đồng. Mỗi eval của evals.yaml ghim đúng dòng «PASS: GW-…» của tệp này.
//
// Kho thử, worktree (`git worktree add`) và đợt do CODE sinh trong lượt; thư mục nguồn của cửa KHÔNG được git theo dõi
// (như kho thật — worktree mới không có thư mục ấy). «Bộ máy gốc» = `git archive <gốc so> …`, gốc so đọc từ
// _acceptance/<hồ sơ>/goc-so. Ca đỏ chạy CHÍNH hàm ca trên BẢN SAO của vật (nhát tiêm khớp ĐÚNG một lần), SAU khi bản
// lành xanh, và ghim thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const SLUG = 'cua-tin-hieu-goc-moi-worktree';
const GOC_SHA = readFileSync(path.join(KIT, '_acceptance', SLUG, 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'gw-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.GW_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bam = p => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null);
const docJson = p => JSON.parse(readFileSync(p, 'utf8'));
let tamN = 0;
const tam = (ten = 't') => { const d = path.join(TMP, `${ten}-${++tamN}`); mkdirSync(d, { recursive: true }); return d; };

const CAY = ['scripts', 'lib', 'skills', 'commands', 'road-map', 'dieu-phoi', 'feature-loop'];
let GOC = null;
function gocMay() {
  if (GOC) return GOC;
  GOC = tam('goc');
  execFileSync('bash', ['-c', `git -C "${KIT}" archive ${GOC_SHA} ${CAY.join(' ')} | tar -x -C "${GOC}"`]);
  return GOC;
}
function banSao(tiem) {
  const r = tam('bs');
  for (const d of [...CAY, '.claude-plugin']) if (existsSync(path.join(KIT, d))) cpSync(path.join(KIT, d), path.join(r, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(r, tep); const t = readFileSync(p, 'utf8'); const n = t.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm lệch: «${cu.slice(0, 50)}» khớp ${n} lần trong ${tep}`);
    writeFileSync(p, t.replace(cu, moi));
  }
  return r;
}
const nap = (goc, rel) => import(pathToFileURL(path.join(goc, rel)).href);

// ── Kho thử: nguồn KHÔNG theo dõi bởi git; bản gom theo dõi; tuỳ chọn lộ trình ─────────────────────────────────────
const KHAI = 'tin_hieu:\n  nguon: [tin-hieu/kho]\n  gom: tin-hieu/gom\n';
const LT = 'risk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: docs/lo-trinh.json\n';
function kho({ loTrinh = false, wt = [] } = {}) {
  const k = tam('kho');
  execFileSync('git', ['init', '-q', '-b', 'main', k]); git(k, 'config', 'user.email', 'x@y.z'); git(k, 'config', 'user.name', 'Chủ Kho Thử');
  mkdirSync(path.join(k, '_acceptance'), { recursive: true });
  writeFileSync(path.join(k, '_acceptance', 'config.yaml'), `schema_version: 1\n${KHAI}${loTrinh ? LT : ''}`);
  mkdirSync(path.join(k, 'tin-hieu', 'gom'), { recursive: true }); writeFileSync(path.join(k, 'tin-hieu', 'gom', '.gitkeep'), '');
  writeFileSync(path.join(k, '.gitignore'), 'tin-hieu/kho/\n');
  if (loTrinh) { mkdirSync(path.join(k, 'docs'), { recursive: true }); writeFileSync(path.join(k, 'docs', 'lo-trinh.json'), `${JSON.stringify({ schema: 1, ten: 'LT', moc: [], hang: [], da_bac: [] }, null, 2)}\n`); }
  git(k, 'add', '-A'); git(k, 'commit', '-qm', 'kho thử');
  const w = {};
  for (const ten of wt) { const p = path.join(TMP, `wt-${ten}-${++tamN}`); git(k, 'worktree', 'add', '-q', p, '-b', `wt-${ten}-${tamN}`); w[ten] = realpathSync(p); }
  return { k, w };
}
const jsonNguon = d => (existsSync(path.join(d, 'tin-hieu', 'kho')) ? readdirSync(path.join(d, 'tin-hieu', 'kho')).filter(f => f.endsWith('.json')).sort() : []);
function khoiLenh(goc) {
  const t = readFileSync(path.join(goc, 'road-map', 'commands', 'gui.md'), 'utf8');
  const m = t.match(/<!-- <<<RM-GUI-LENH -->\n([\s\S]*?)<!-- RM-GUI-LENH>>> -->/);
  if (!m) throw new Error('gui.md thiếu khối RM-GUI-LENH');
  return m[1].replace(/^```[a-z]*\n/, '').replace(/\n?```\s*$/, '\n');
}
const gui = (goc, cwd, cau) => spawnSync('bash', ['-c', khoiLenh(goc).replaceAll('$AG', goc).replace('<câu của người>', cau)], { cwd, encoding: 'utf8' });
const th = (goc, root, ...a) => spawnSync(process.execPath, [path.join(goc, 'scripts', 'tin-hieu.mjs'), '--root', root, ...a], { encoding: 'utf8' });
const idsChuaGom = (goc, root) => { const x = th(goc, root, '--chua-gom'); try { return JSON.parse(x.stdout).tin_hieu.map(t => t.id).sort(); } catch { return [`<hỏng ${x.status}: ${x.stderr.slice(0, 120)}>`]; } };
const idsDuong = (goc, root) => {
  const x = th(goc, root, '--duong'); let j; try { j = JSON.parse(x.stdout); } catch { return [`<hỏng ${x.status}>`]; }
  const ds = Array.isArray(j) ? j : (j.duong || j.tin_hieu || []);
  return ds.map(t => t.id).sort();
};
const NOW = Date.parse('2026-10-16T05:10:00Z');
const IO = { nowMs: () => NOW, chay: (c, a) => { if (c === 'sysctl' && a[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M'; if (c === 'sysctl' && a.includes('kern.memorystatus_vm_pressure_level')) return '1'; if (c === 'sysctl') return '{ 3.00 2.00 1.00 }'; if (c === 'ps') return '102400 node\n'; if (c === 'gh') return '[]'; if (c === 'git' && a[0] === 'show') throw new Error('x'); return ''; } };
async function yThoQuaDot(goc, k, w1) {
  const MAU = await import(pathToFileURL(path.join(KIT, 'tests', 'dieu-phoi', 'loi', 'mau-thu.mjs')).href);
  const d = tam('dot');
  for (const x of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) mkdirSync(path.join(d, x));
  writeFileSync(path.join(d, 'dieu-phoi.config.json'), JSON.stringify({ ...MAU.CFG_PHAT_LICH, goc_kho: k }));
  writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify(MAU.hangViecHai({ dot: 'thu', w1, w2: k, link: true })));
  writeFileSync(path.join(d, 'yeu-cau', 'P1-1.json'), JSON.stringify({ phien: 'P1', loai: 'viec-phu', hang: 'a', noi_dung: { tieu_de: 'Ý thợ nêu trong worktree' }, luc: '2026-10-16T05:00:00Z' }));
  await (await nap(goc, 'dieu-phoi/scripts/phat-lich.mjs')).motNhip(d, IO);
  return d;
}

// ── Ca ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
function ca1(goc) {
  const sai = []; const { k, w } = kho({ wt: ['a', 'b'] });
  const ten = 'nguoi-chu-kho-thu';
  const nguon = [[w.a, 'worktree'], [w.b, 'worktree'], [k, 'thu-muc-chinh']];
  const bamTruoc = {};
  nguon.forEach(([cwd], i) => {
    const x = gui(goc, cwd, `Ý số ${i + 1}`);
    if (x.status !== 0) sai.push(`lần ${i + 1}: thoát ${x.status} «${x.stderr.trim().slice(0, 120)}»`);
    if (!x.stdout.includes(`tin-hieu/kho/${ten}-${i + 1}.json`)) sai.push(`lần ${i + 1}: dòng in «${x.stdout.trim()}»`);
    for (const [f, h] of Object.entries(bamTruoc)) if (bam(path.join(k, 'tin-hieu', 'kho', f)) !== h) sai.push('ý bị ghi đè');
    for (const f of jsonNguon(k)) bamTruoc[f] = bam(path.join(k, 'tin-hieu', 'kho', f));
  });
  if (jsonNguon(w.a).length || jsonNguon(w.b).length) sai.push('ý người nằm trong worktree');
  const f = jsonNguon(k);
  if (JSON.stringify(f) !== JSON.stringify([1, 2, 3].map(n => `${ten}-${n}.json`))) sai.push(f.length < 3 ? 'ý bị ghi đè' : `tệp ở thư mục chính: ${JSON.stringify(f)}`);
  else nguon.forEach(([, tu], i) => { const o = docJson(path.join(k, 'tin-hieu', 'kho', f[i])); if (o.noi_dung?.gui_tu !== tu || o.noi_dung?.tieu_de !== `Ý số ${i + 1}`) sai.push(`tệp ${f[i]}: ${JSON.stringify(o.noi_dung)}`); });
  return [...new Set(sai)];
}

async function ca2(goc) {
  const sai = []; const { k, w } = kho({ loTrinh: true, wt: ['a', 'b'] });
  [[w.a, 'Ý từ A'], [w.b, 'Ý từ B'], [k, 'Ý từ thư mục chính']].forEach(([cwd, c]) => { const x = gui(goc, cwd, c); if (x.status !== 0) sai.push(`gửi thoát ${x.status}`); });
  await yThoQuaDot(goc, k, w.a);
  const goc3 = [['thư mục chính', k], ['worktree A', w.a], ['worktree B', w.b]];
  const so = (ten, f) => { const v = goc3.map(([, r]) => JSON.stringify(f(r))); if (new Set(v).size !== 1) sai.push(`${ten}: ${goc3.map(([n], i) => `${n}=${v[i]}`).join(' · ')}`); return JSON.parse(v[0]); };
  const ids = so('--chua-gom', r => idsChuaGom(goc, r));
  if (ids.length !== 4) sai.push(`tập id ${JSON.stringify(ids)} — cần 4`);
  // Đối chứng dương từng chân (phản biện S4 lượt 1): ba gốc bằng nhau chưa đủ — một chân sập ở cả ba gốc cũng bằng nhau.
  const dg = so('--duong', r => idsDuong(goc, r));
  if (JSON.stringify(dg) !== JSON.stringify(ids)) sai.push(`đối chứng không chạy: --duong ${JSON.stringify(dg)}`);
  const rg = so('--rang', r => { const x = th(goc, r, '--rang'); return [x.status, (x.stdout + x.stderr).split('\n').filter(l => l.includes('nguồn') || /^- \S+ → /.test(l))]; });
  const rIds = rg[1].map(l => (l.match(/^- (\S+) → /) || [])[1]).filter(Boolean).sort();
  if (rg[0] !== 0 || JSON.stringify(rIds) !== JSON.stringify(ids)) sai.push(`đối chứng không chạy: --rang ${JSON.stringify(rg)}`);
  const cu = so('--cau', r => { const x = th(goc, r, '--cau'); return [x.status, x.stdout.trim().split('\n').pop()]; });
  if (!cu[1]) sai.push(`đối chứng không chạy: --cau ${JSON.stringify(cu)}`);
  const the = r => {
    const x = spawnSync(process.execPath, [path.join(goc, 'scripts', 'start-scan.mjs'), '--root', r], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-16' } });
    let j = null; try { j = JSON.parse(x.stdout); } catch { j = null; }
    return (j?.loTrinh?.dong || ['<thẻ không chạy>']).filter(l => l.startsWith('Cửa tín hiệu:') || l.startsWith('! cửa tín hiệu:') || l === '<thẻ không chạy>');
  };
  const v = goc3.map(([, r]) => JSON.stringify(the(r)));
  if (new Set(v).size !== 1) sai.push(v.some(x => x.includes('! cửa tín hiệu')) && !v[0].includes('! cửa tín hiệu') ? 'thẻ worktree báo nguồn chưa có' : `thẻ: ${v.join(' · ')}`);
  const t0 = JSON.parse(v[0]);
  if (t0.length !== 1 || !t0[0].startsWith('Cửa tín hiệu: 4 ý')) sai.push(`đối chứng không chạy: thẻ ${v[0]}`);
  // Chân «trang lộ trình chứa đủ bốn id ở ba gốc» đã THAY bằng AC-1…AC-3 của hồ sơ ve-lo-trinh-doc-tin-hieu-cua-cay
  // (vá 2.32.1): trang là vật commit nên chỉ lấy ý đã theo dõi trong cây đang vẽ — ý ngoài git của fixture này không
  // lên trang ở gốc nào. Ca VT-3 của hồ sơ ấy đo đúng điều đó; hợp đồng đã ký của RM3b không sửa.
  if (sai.some(s => s.startsWith('--chua-gom') || s.startsWith('--duong'))) sai.unshift('bộ đọc ở worktree thấy tập khác thư mục chính');
  return sai;
}

// Phép lọc «thư mục nguồn chưa có» của thẻ: thư mục chính CHƯA có nguồn, worktree còn một thư mục nguồn cũ (rỗng) → thẻ
// ở worktree phải giống thẻ ở thư mục chính (không dòng cửa nào).
function ca2Vang(goc) {
  const { k, w } = kho({ loTrinh: true, wt: ['a'] });
  mkdirSync(path.join(w.a, 'tin-hieu', 'kho'), { recursive: true });
  const the = r => { const x = spawnSync(process.execPath, [path.join(goc, 'scripts', 'start-scan.mjs'), '--root', r], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-16' } }); let j = null; try { j = JSON.parse(x.stdout); } catch { j = null; } return JSON.stringify((j?.loTrinh?.dong || ['<thẻ không chạy>']).filter(l => l.startsWith('Cửa tín hiệu:') || l.startsWith('! cửa tín hiệu:'))); };
  const tk = the(k); const ta = the(w.a);
  if (tk !== ta) return [ta.includes('! cửa tín hiệu') ? 'thẻ worktree báo nguồn chưa có' : `thẻ: ${tk} · ${ta}`];
  return [];
}

function ca3(goc) {
  const { k, w } = kho({ wt: ['a'] });
  const x = gui(goc, w.a, 'Ý sẽ bị dọn'); if (x.status !== 0) return [`gửi thoát ${x.status}`];
  const f = jsonNguon(k)[0]; const h = f ? bam(path.join(k, 'tin-hieu', 'kho', f)) : null;
  git(k, 'worktree', 'remove', '--force', w.a);
  const ids = idsChuaGom(goc, k);
  if (!f || !ids.includes(f.slice(0, -5)) || bam(path.join(k, 'tin-hieu', 'kho', f)) !== h) return ['ý mất khi dọn worktree'];
  return [];
}

// AC-4: kho không worktree (và thư mục con) — bộ máy hiện tại vs bộ máy gốc trên hai fixture dựng giống hệt.
const boKhoa = o => { if (o && typeof o === 'object') { delete o.luc; if (o.noi_dung) delete o.noi_dung.gui_tu; } return o; };
function chupLenh(goc, root) {
  const ra = [];
  const g = spawnSync('bash', ['-c', khoiLenh(goc).replaceAll('$AG', goc).replace('<câu của người>', 'Ý ở thư mục chính')], { cwd: root, encoding: 'utf8' });
  ra.push(['gui-tin-hieu', g.status, g.stdout, g.stderr]);
  ra.push(['tệp sinh', jsonNguon(root).map(f => JSON.stringify(boKhoa(docJson(path.join(root, 'tin-hieu', 'kho', f)))))]);
  const cg = th(goc, root, '--chua-gom'); let j = null; try { j = JSON.parse(cg.stdout); j.tin_hieu.forEach(boKhoa); } catch { j = cg.stdout; }
  ra.push(['--chua-gom', cg.status, JSON.stringify(j), cg.stderr]);
  for (const l of ['--rang', '--duong']) { const x = th(goc, root, l); let o = x.stdout; try { const p = JSON.parse(o); (Array.isArray(p) ? p : []).forEach(boKhoa); o = JSON.stringify(p); } catch { /* chữ */ } ra.push([l, x.status, o, x.stderr]); }
  const s = spawnSync(process.execPath, [path.join(goc, 'scripts', 'start-scan.mjs'), '--root', root], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-16' } });
  ra.push(['start-scan', s.status, s.stdout.split(goc).join('<AG>'), s.stderr.split(goc).join('<AG>')]);
  return ra;
}
function dungKhoKhongWt({ con = false } = {}) {
  const { k } = kho({ loTrinh: true });
  if (!con) return k;
  const c = path.join(k, 'con'); mkdirSync(path.join(c, '_acceptance'), { recursive: true }); mkdirSync(path.join(c, 'tin-hieu', 'gom'), { recursive: true });
  writeFileSync(path.join(c, '_acceptance', 'config.yaml'), `schema_version: 1\n${KHAI}`);
  return c;
}
// `gocB`: bộ máy đối chứng (mặc định bộ máy gốc `git archive <goc-so>`); ca đỏ GW-4-do2 truyền một bộ máy sập.
async function ca4(goc, { con = false, gocB = null } = {}) {
  const sai = []; const g = gocB ?? gocMay();
  const a = dungKhoKhongWt({ con }); const b = dungKhoKhongWt({ con });
  const B = chupLenh(g, b);
  // Đối chứng dương cho TỪNG lệnh (phản biện S4 lượt 1): bộ máy gốc thoát 0 và có đầu ra, trước khi tin phép so byte.
  for (const [ten, st, out] of B) {
    const rong = Array.isArray(st) ? !st.length : !String(out ?? '').trim();
    if ((typeof st === 'number' && st !== 0) || rong) sai.push(`đối chứng gốc không chạy: ${ten}`);
  }
  const A = chupLenh(goc, a);
  const norm = (r, root) => JSON.stringify(r).split(root).join('<KHO>');
  A.forEach((x, i) => { if (norm(x, a) !== norm(B[i], b)) sai.push(`thư mục chính đổi đầu ra: ${x[0]}`); });
  if (!con) {
    const da = await yThoQuaDot(goc, a, a); const db = await yThoQuaDot(g, b, b);
    const chup = d => JSON.stringify({ tra: readdirSync(path.join(d, 'tra-loi')).sort().map(f => boKhoa(docJson(path.join(d, 'tra-loi', f)))), ev: readFileSync(path.join(d, 'su-kien.jsonl'), 'utf8').trim().split('\n').map(l => { const o = JSON.parse(l); delete o.luc; delete o.chan; return o; }) });
    const cb = JSON.parse(chup(db));
    if (!cb.tra.length || !cb.ev.length) sai.push('đối chứng gốc không chạy: phat-lich');
    if (chup(da).split(a).join('<KHO>') !== chup(db).split(b).join('<KHO>')) sai.push('thư mục chính đổi đầu ra: phat-lich');
  }
  return sai;
}

function ca5(goc) {
  const { k, w } = kho({ wt: ['a'] });
  const x = gui(goc, w.a, 'Ý theo bộ giải chung'); if (x.status !== 0) return [`gửi thoát ${x.status} «${x.stderr.trim().slice(0, 100)}»`];
  const khac = path.join(k, 'khac');
  const f = jsonNguon(khac);
  if (f.length !== 1 || jsonNguon(k).length || jsonNguon(w.a).length) return [`tệp không theo bộ giải: khác=${f.length} chính=${jsonNguon(k).length} A=${jsonNguon(w.a).length}`];
  if (!idsChuaGom(goc, w.a).includes(f[0].slice(0, -5))) return ['bên ghi và bên đọc dùng hai bộ giải'];
  return [];
}

function banGom(ids) {
  const t = readFileSync(path.join(KIT, 'skills', 'acceptance', 'references', 'tin-hieu-template.md'), 'utf8');
  const b = t.match(/<!-- <<<GOM-MAU -->\n([\s\S]*?)<!-- GOM-MAU>>> -->/)[1].replace(/^```[a-z]*\n/, '').replace(/\n?```\s*$/, '\n');
  const L = b.split('\n'); const dau = L.filter(l => /^(dot|dang|nguon|truc|den):/.test(l)).map(l => l.replace(/^dot:.*/, 'dot: gom-wt'));
  const iN = L.findIndex(l => l.startsWith('- `'));
  return [...dau, '', L[iN].replace(/`[^`]*`/, '`G1`'), L[iN + 1].replace(/:.*$/, `: ${ids.map(x => `\`${x}\``).join(', ')}`), ''].join('\n');
}
function ca6(goc) {
  const sai = [];
  const n = tam('khong-git'); mkdirSync(path.join(n, '_acceptance'), { recursive: true }); writeFileSync(path.join(n, '_acceptance', 'config.yaml'), `schema_version: 1\n${KHAI}`);
  const x = gui(goc, n, 'Ý ngoài git');
  const ten = jsonNguon(n).map(f => f.slice(0, -5));
  if (x.status !== 0 || ten.length !== 1) return [`ngoài git: thoát ${x.status}, tệp ${ten.length}`];
  // Quan hệ, không phải «có thứ gì đó» (phản biện S4 lượt 1): id bộ đọc liệt kê = tên tệp vừa ghi.
  const doc = idsChuaGom(goc, n);
  if (JSON.stringify(doc) !== JSON.stringify(ten)) sai.push(`bộ đọc không thấy ý ngoài git: ${JSON.stringify(doc)}`);
  return sai;
}
function ca6Long(goc) {
  const { k } = kho();
  const l = path.join(k, 'long'); mkdirSync(path.join(l, '_acceptance'), { recursive: true }); writeFileSync(path.join(l, '_acceptance', 'config.yaml'), `schema_version: 1\n${KHAI}`);
  const x = gui(goc, l, 'Ý trong thư mục lồng');
  if (x.status !== 0) return [`thoát ${x.status}`];
  if (jsonNguon(k).length || jsonNguon(l).length !== 1) return ['ý rơi ra kho bên ngoài'];
  return [];
}
function ca6Gom(goc) {
  const { k, w } = kho({ wt: ['a'] });
  gui(goc, k, 'Ý đã gom ở nhánh'); gui(goc, k, 'Ý chưa gom');
  const f = jsonNguon(k).map(x => x.slice(0, -5));
  if (f.length !== 2) return [`cần 2 ý, có ${f.length}`];
  writeFileSync(path.join(w.a, 'tin-hieu', 'gom', 'gom-wt.md'), banGom([f[0]])); git(w.a, 'add', '-A'); git(w.a, 'commit', '-qm', 'gom ở nhánh');
  const ia = idsChuaGom(goc, w.a); const ik = idsChuaGom(goc, k);
  if (ia.includes(f[0]) || !ia.includes(f[1])) return ['bản gom của nhánh bị bỏ qua'];
  if (!ik.includes(f[0])) return [`thư mục chính coi ý là đã gom dù bản gom chưa gộp: ${JSON.stringify(ik)}`];
  return [];
}

// ── Chạy ────────────────────────────────────────────────────────────────────────────────────────────────────────────
async function lanh(id, fn) {
  if (!want(id)) return true;
  try { const s = await fn(KIT); if (s.length) { bad(id, s.join(' ; ')); return false; } ok(id); return true; } catch (e) { bad(id, loi(e)); return false; }
}
async function do_(id, tiem, fn, ghim, lanhOk) {
  if (!want(id)) return;
  if (!lanhOk) { bad(id, 'bản lành chưa xanh — không tin chiều đỏ'); return; }
  try { const s = await fn(banSao(tiem)); if (s.some(x => x.includes(ghim))) ok(id, ghim); else bad(id, `bản sao không đỏ đúng thông điệp «${ghim}»: ${JSON.stringify(s).slice(0, 300)}`); } catch (e) { bad(id, loi(e)); }
}
const GUI = 'scripts/gui-tin-hieu.mjs';
const TH = 'scripts/tin-hieu.mjs';
const NGHI = ['const cua = docCua(root, { gocNguon: gocNguon(root) });', 'const cua = docCua(root, { gocNguon: root });'];
// Bộ đọc sập: chân --duong, và bộ đọc nguồn chung (docTinHieu) — chiều đỏ của các đối chứng dương.
const DUONG_SAP = [TH, 'const ds = duongDi({ root, classify: PM.classify, sections: PM.SECTIONS });', "const ds = (() => { throw new Error('đường sập'); })();"];
// Dòng giải thư mục nguồn của bộ đọc (scripts/tin-hieu.mjs). Từ 2.32.1 (hồ sơ ve-lo-trinh-doc-tin-hieu-cua-cay) dòng mang
// thêm nhánh của bộ vẽ trang (`chiTheoDoi ? root : …`); nhát tiêm vẫn đánh vào đường của bộ đọc tương tác như cũ.
const DONG_DIR = 'const dir = path.resolve(chiTheoDoi ? root : gocNguon(root), ng);';
const DOC_SAP = [TH, DONG_DIR, "const dir = (() => { throw new Error('bộ đọc sập'); })();"];

const l1 = await lanh('GW-1', g => ca1(g));
await do_('GW-1-do', [[GUI, ...NGHI]], g => ca1(g), 'ý người nằm trong worktree', l1);
// GW-1-do2 (phản biện P1): đếm số thứ tự theo nguồn của GỐC PHIÊN mà ghi vào thư mục chính, cộng bộ ghi không độc quyền.
await do_('GW-1-do2', [[GUI, 'const thuMucDem = cua.nguon;', "const thuMucDem = path.resolve(root, 'tin-hieu', 'kho');"], ['dieu-phoi/scripts/cua-tin-hieu.mjs', "if (fs.existsSync(tep)) return { ket: soSanh(tep, than), tep };", "if (fs.existsSync(tep)) { fs.writeFileSync(tep, than); return { ket: 'moi', tep }; }"]], g => ca1(g), 'ý bị ghi đè', l1);
const l2 = await lanh('GW-2', async g => [...await ca2(g), ...ca2Vang(g)]);
await do_('GW-2-do', [[TH, DONG_DIR, 'const dir = path.resolve(root, ng);']], g => ca2(g), 'bộ đọc ở worktree thấy tập khác thư mục chính', l2);
await do_('GW-2-do2', [['scripts/start-scan.mjs', 'existsSync(path.resolve(TH.gocNguon(root), ng))', 'existsSync(path.resolve(root, ng))']], g => ca2Vang(g), 'thẻ worktree báo nguồn chưa có', l2);
await do_('GW-2-do3', [DUONG_SAP], g => ca2(g), 'đối chứng không chạy: --duong', l2);
const l3 = await lanh('GW-3', g => ca3(g));
await do_('GW-3-do', [[GUI, ...NGHI]], g => ca3(g), 'ý mất khi dọn worktree', l3);
const l4 = await lanh('GW-4', g => ca4(g));
await lanh('GW-4-con', g => ca4(g, { con: true }));
await do_('GW-4-do', [[TH, '  try { return gocKhoChinh(r); } catch { return r; }', '  return path.dirname(r);']], g => ca4(g), 'thư mục chính đổi đầu ra:', l4);
// GW-4-do2: bộ máy ĐỐI CHỨNG sập ở --duong → phép so byte không được tin ngầm (bộ máy hiện tại lành).
await do_('GW-4-do2', [DUONG_SAP], g => ca4(KIT, { gocB: g }), 'đối chứng gốc không chạy: --duong', l4);
const l5 = await lanh('GW-5', g => banSaoKhac(g, ca5));
await do_('GW-5-do', [[TH, DONG_DIR, "const dir = path.resolve(execFileSync('git', ['-C', path.resolve(root), 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim(), ng);"]], g => banSaoKhac(g, ca5), 'bên ghi và bên đọc dùng hai bộ giải', l5);
const l6 = await lanh('GW-6', g => ca6(g));
const l6l = await lanh('GW-6-long', g => ca6Long(g));
const l6g = await lanh('GW-6-gom', g => ca6Gom(g));
await do_('GW-6-do', [[TH, '  if (realpathSync(top) !== thuc) return r;\n', '']], g => ca6Long(g), 'ý rơi ra kho bên ngoài', l6l && l6);
await do_('GW-6-do2', [[TH, '  const dir = path.resolve(root, khai.gom);', '  const dir = path.resolve(gocNguon(root), khai.gom);']], g => ca6Gom(g), 'bản gom của nhánh bị bỏ qua', l6g);
await do_('GW-6-do3', [DOC_SAP], g => ca6(g), 'bộ đọc không thấy ý ngoài git', l6);

// GW-5: bộ giải chung bị đổi (nhát tiêm vào gocKhoChinh) — chạy trên bản sao của BỘ MÁY `g` (bản lành hay bản đỏ).
function banSaoKhac(g, fn) {
  const r = tam('khac');
  for (const d of [...CAY, '.claude-plugin']) if (existsSync(path.join(g, d))) cpSync(path.join(g, d), path.join(r, d), { recursive: true });
  const p = path.join(r, 'dieu-phoi', 'scripts', 'dot.mjs'); const t = readFileSync(p, 'utf8');
  const cu = '  return path.dirname(chung);\n}'; if (t.split(cu).length !== 2) throw new Error('nhát tiêm gocKhoChinh lệch');
  writeFileSync(p, t.replace(cu, "  return path.join(path.dirname(chung), 'khac');\n}"));
  return fn(r);
}

console.log(`\nResults: ${pass} passed, ${fail} failed`);
if (process.env.GW_GIU_TMP !== '1') rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
