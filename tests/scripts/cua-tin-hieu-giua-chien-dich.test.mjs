// cua-tin-hieu-giua-chien-dich.test.mjs — hồ sơ cua-tin-hieu-giua-chien-dich (hàng RM3), ca CT-<n> = AC-n của hợp
// đồng. Mỗi eval của evals.yaml ghim đúng dòng «PASS: CT-…» của tệp này.
//
// Kho thử, thư mục đợt và cấu hình do CODE sinh trong lượt (thư mục tạm, `git init`). «Bộ máy gốc» = `git archive <gốc
// so> scripts lib skills commands road-map dieu-phoi feature-loop`, gốc so đọc từ _acceptance/<hồ sơ>/goc-so. Ca đỏ chạy
// CHÍNH hàm ca trên BẢN SAO của vật (nhát tiêm khớp ĐÚNG một lần), SAU khi bản lành xanh trên cùng fixture, và ghim
// thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, readdirSync, rmSync, statSync,
  symlinkSync, utimesSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const SLUG = 'cua-tin-hieu-giua-chien-dich';
const GOC_SHA = readFileSync(path.join(KIT, '_acceptance', SLUG, 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ct-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.CT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bam = p => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null);
const docJson = p => JSON.parse(readFileSync(p, 'utf8'));
const MAU = await import(pathToFileURL(path.join(KIT, 'tests', 'dieu-phoi', 'loi', 'mau-thu.mjs')).href);

let tamN = 0;
const tam = (ten = 't') => { const d = path.join(TMP, `${ten}-${++tamN}`); mkdirSync(d, { recursive: true }); return d; };

// ── Bộ máy: KIT (vật đang đo), GỐC (git archive), BẢN SAO có nhát tiêm ─────────────────────────────────────────────
const CAY = ['scripts', 'lib', 'skills', 'commands', 'road-map', 'dieu-phoi', 'feature-loop'];
let GOC = null;
function gocMay() {
  if (GOC) return GOC;
  GOC = tam('goc');
  execFileSync('bash', ['-c', `git -C "${KIT}" archive ${GOC_SHA} ${CAY.join(' ')} | tar -x -C "${GOC}"`]);
  return GOC;
}
// tiem: [[tệp tương đối, chuỗi cũ, chuỗi mới]] — mỗi chuỗi cũ phải khớp ĐÚNG một lần, khác thì ca hỏng có tên.
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

// ── Kho thử và đợt thử ──────────────────────────────────────────────────────────────────────────────────────────────
const KHAI_CUA = 'tin_hieu:\n  nguon: [tin-hieu/kho]\n  gom: tin-hieu/gom\n';
function kho({ cua = true, nguonLaTep = false, them = '', ten = 'Người Thử' } = {}) {
  const r = tam('kho');
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', ten);
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\n${cua ? KHAI_CUA : ''}${them}`);
  mkdirSync(path.join(r, 'tin-hieu', 'gom'), { recursive: true }); writeFileSync(path.join(r, 'tin-hieu', 'gom', '.gitkeep'), '');
  if (nguonLaTep) writeFileSync(path.join(r, 'tin-hieu', 'kho'), 'không phải thư mục\n');
  else { mkdirSync(path.join(r, 'tin-hieu', 'kho'), { recursive: true }); writeFileSync(path.join(r, 'tin-hieu', 'kho', '.gitkeep'), ''); }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thử');
  return r;
}
const tepCua = k => (existsSync(path.join(k, 'tin-hieu', 'kho')) && statSync(path.join(k, 'tin-hieu', 'kho')).isDirectory()
  ? readdirSync(path.join(k, 'tin-hieu', 'kho')).filter(f => f.endsWith('.json')).sort() : []);
function dot({ gocKho = null, w1 = null } = {}) {
  const d = tam('dot');
  const cfg = { ...MAU.CFG_PHAT_LICH }; if (gocKho) cfg.goc_kho = gocKho; else delete cfg.goc_kho;
  writeFileSync(path.join(d, 'dieu-phoi.config.json'), JSON.stringify(cfg));
  writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify(MAU.hangViecHai({ dot: 'thu', w1: w1 ?? tam('w'), w2: tam('w'), link: true })));
  for (const x of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) mkdirSync(path.join(d, x));
  return d;
}
const NOW = Date.parse('2026-10-05T12:00:00Z');
const IO = {
  nowMs: () => NOW,
  chay: (cmd, args) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 3.00 2.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('not found');
    return '';
  },
};
const yc = (d, id, loai, noi_dung, luc = '2026-10-05T11:00:00Z', hang = 'a') =>
  writeFileSync(path.join(d, 'yeu-cau', `${id}.json`), JSON.stringify({ phien: id.split('-')[0], loai, hang, noi_dung, luc }));
const suKien = d => (existsSync(path.join(d, 'su-kien.jsonl')) ? readFileSync(path.join(d, 'su-kien.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
const traLoi = (d, id) => (existsSync(path.join(d, 'tra-loi', `${id}.json`)) ? docJson(path.join(d, 'tra-loi', `${id}.json`)) : null);
const nhip = async (d, goc = KIT) => (await nap(goc, 'dieu-phoi/scripts/phat-lich.mjs')).motNhip(d, IO);
// Đợt có liên kết «đợt hiện tại» trong kho, dãy P1 = chính kho — để lệnh `yeu-cau` THẬT chạy được từ kho.
function dotCoKho(k) {
  const d = dot({ gocKho: k, w1: k });
  mkdirSync(path.join(k, '.acceptance-runs'), { recursive: true });
  symlinkSync(d, path.join(k, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return d;
}
function lenhYeuCau(goc, k, doiSo) {
  const x = spawnSync(process.execPath, [path.join(goc, 'dieu-phoi', 'scripts', 'dieu-phoi.mjs'), 'yeu-cau', ...doiSo], { cwd: k, encoding: 'utf8' });
  if (x.status !== 0) throw new Error(`yeu-cau thoát ${x.status}: ${x.stderr.trim()}`);
  return x.stdout.trim().split('\n').pop().trim();
}

// ── Ca: mỗi hàm nhận bộ máy `goc`, trả danh sách lỗi (rỗng = xanh) ───────────────────────────────────────────────────
async function ca1(goc) {
  const sai = []; const k = kho(); const d = dot({ gocKho: k });
  yc(d, 'P1-1', 'viec-phu', { tieu_de: 'Thêm lọc theo phòng' });
  yc(d, 'P1-2', 'hang-moi', { tieu_de: 'Mở việc báo cáo tuần', cau_giao: 'Báo cáo tuần tự gửi' });
  await nhip(d, goc);
  const { CAU_DA_GHI } = await nap(goc, 'dieu-phoi/scripts/cua-tin-hieu.mjs');
  const { viecCho } = await nap(goc, 'dieu-phoi/scripts/viec-cho.mjs');
  const cho = viecCho(d).map(v => v.id);
  for (const id of ['P1-1', 'P1-2']) {
    const t = traLoi(d, id); const ev = suKien(d).filter(e => e.loai === 'yeu-cau' && e.id === id);
    if (!t || t.ket_qua !== 'ghi' || ev.some(e => e.can_phan === true)) { sai.push(`ý không chặn đánh thức giám sát: ${id}`); continue; }
    if (t.boi !== 'may' || !String(t.ly_do).startsWith(CAU_DA_GHI) || !String(t.ly_do).includes('--chan')) sai.push(`trả lời sai: ${id} ${JSON.stringify(t)}`);
    if (ev.length !== 1) sai.push(`sự kiện ${id}: ${ev.length} dòng, cần 1`);
    else if (!('chan' in ev[0])) sai.push(`sự kiện thiếu khoá chan: ${id}`);
    else if (ev[0].chan !== false || ev[0].ket_qua !== 'ghi' || ev[0].kieu !== (id === 'P1-1' ? 'viec-phu' : 'hang-moi')) sai.push(`sự kiện sai: ${JSON.stringify(ev[0])}`);
    if (cho.includes(id)) sai.push(`ý không chặn nằm trong việc chờ: ${id}`);
  }
  return { sai, k, d };
}

async function ca2(goc, { chan = true } = {}) {
  const sai = []; const k = kho(); const d = dotCoKho(k);
  const co = chan ? ['--chan'] : [];
  const ids = [
    lenhYeuCau(goc, k, ['viec-phu', ...co, '--noi-dung', JSON.stringify({ tieu_de: 'Thiếu bảng phòng ban' })]),
    lenhYeuCau(goc, k, ['hang-moi', ...co, '--noi-dung', JSON.stringify({ tieu_de: 'Chưa có ô cho hàng X' })]),
  ];
  for (const id of ids) {
    const than = docJson(path.join(d, 'yeu-cau', `${id}.json`));
    if (chan && than.noi_dung?.chan !== true) sai.push('cờ --chan không vào noi_dung');
  }
  await nhip(d, goc);
  const { viecCho } = await nap(goc, 'dieu-phoi/scripts/viec-cho.mjs');
  const cho = viecCho(d).filter(v => v.loai === 'yeu-cau').map(v => v.id).sort();
  for (const id of ids) {
    const t = traLoi(d, id); const ev = suKien(d).filter(e => e.loai === 'yeu-cau' && e.id === id);
    if (chan) {
      if (t) { sai.push(`ý khai chặn không được phán: ${id}`); continue; }
      if (ev.length !== 1 || ev[0].can_phan !== true || ev[0].chan !== true || !String(ev[0].ly_do).includes('chặn việc đang chạy')) sai.push(`sự kiện chặn sai: ${JSON.stringify(ev)}`);
    } else if (!t || t.ket_qua !== 'ghi') sai.push(`đối chứng: không cờ mà không ghi: ${id} ${JSON.stringify(t)}`);
  }
  if (chan) {
    if (tepCua(k).length) sai.push(`ý chặn vẫn vào cửa: ${tepCua(k).join(', ')}`);
    if (JSON.stringify(cho) !== JSON.stringify([...ids].sort())) sai.push(`việc chờ không liệt đúng hai id chặn: ${JSON.stringify(cho)}`);
  }
  return sai;
}

async function ca3(goc) {
  const { sai, k, d } = await ca1(goc);
  const files = tepCua(k);
  if (JSON.stringify(files) !== JSON.stringify(['P1-1.json', 'P1-2.json'])) sai.push(`tệp trong cửa: ${JSON.stringify(files)}`);
  for (const f of files) {
    const id = f.slice(0, -5); const cu = docJson(path.join(d, 'yeu-cau', f)); const moi = docJson(path.join(k, 'tin-hieu', 'kho', f));
    if (JSON.stringify(Object.keys(moi)) !== JSON.stringify(['phien', 'loai', 'hang', 'noi_dung', 'luc'])
      || ['phien', 'loai', 'hang', 'noi_dung', 'luc'].some(x => JSON.stringify(moi[x]) !== JSON.stringify(cu[x]))) sai.push(`tệp tín hiệu khác thân yêu cầu: ${id}`);
  }
  const th = (...a) => spawnSync(process.execPath, [path.join(goc, 'scripts', 'tin-hieu.mjs'), '--root', k, ...a], { encoding: 'utf8' });
  const cg = th('--chua-gom'); let j = null; try { j = JSON.parse(cg.stdout); } catch { j = null; }
  const tieuDe = { 'P1-1': 'Thêm lọc theo phòng', 'P1-2': 'Mở việc báo cáo tuần' };
  for (const [id, td] of Object.entries(tieuDe)) if (!j?.tin_hieu?.some(t => t.id === id && t.tieu_de === td)) sai.push(`bộ đọc không liệt ${id}: ${cg.stdout.slice(0, 200)}${cg.stderr}`);
  const rg = th('--rang');
  for (const id of Object.keys(tieuDe)) if ((rg.stdout + rg.stderr).split('\n').some(l => l.includes(id) && l.includes('sai khuôn'))) sai.push(`răng báo sai khuôn: ${id}`);
  // Nhịp hai lần: giả lập sập giữa ghi tệp và ghi trả lời.
  const p1 = path.join(k, 'tin-hieu', 'kho', 'P1-1.json'); const cu = new Date('2026-01-01T00:00:00Z');
  utimesSync(p1, cu, cu); const bam1 = bam(p1);
  rmSync(path.join(d, 'tra-loi', 'P1-1.json'));
  await nhip(d, goc);
  if (traLoi(d, 'P1-1')?.ket_qua !== 'ghi' || tepCua(k).length !== 2 || statSync(p1).mtimeMs !== cu.getTime() || bam(p1) !== bam1) sai.push('nhịp xét hai lần đẻ tệp mới: P1-1');
  // Trùng 24 giờ → gộp.
  yc(d, 'P1-3', 'viec-phu', { tieu_de: 'Thêm lọc theo phòng' }, '2026-10-05T11:30:00Z');
  await nhip(d, goc);
  const t3 = traLoi(d, 'P1-3');
  if (t3?.ket_qua !== 'gop' || t3.voi !== 'P1-1' || tepCua(k).includes('P1-3.json')) sai.push(`trùng không gộp: ${JSON.stringify(t3)}`);
  return sai;
}

async function ca3KhacThan(goc) {
  const sai = []; const k = kho(); const d = dot({ gocKho: k });
  const p = path.join(k, 'tin-hieu', 'kho', 'P1-1.json');
  writeFileSync(p, `${JSON.stringify({ phien: 'P9', loai: 'tin-hieu', hang: null, noi_dung: { tieu_de: 'ý cũ chưa gom' }, luc: '2026-10-01T00:00:00Z' }, null, 2)}\n`);
  const h = bam(p);
  yc(d, 'P1-1', 'viec-phu', { tieu_de: 'Ý mới cùng số' });
  await nhip(d, goc);
  if (bam(p) !== h) sai.push('ý bị đè: P1-1');
  const ev = suKien(d).filter(e => e.loai === 'yeu-cau' && e.id === 'P1-1');
  if (traLoi(d, 'P1-1') || ev.length !== 1 || ev[0].can_phan !== true || !String(ev[0].ly_do).startsWith('id trùng một ý khác trong cửa —')) sai.push(`id trùng không rơi về phán: ${JSON.stringify(ev)}`);
  return sai;
}

// AC-4: bốn đợt, bộ máy hiện tại và bộ máy gốc trên CÙNG fixture (dựng hai lần giống hệt).
const DOT4 = [
  ['kho không khai cửa', () => { const k = kho({ cua: false }); const d = dot({ gocKho: k }); yc(d, 'P1-1', 'viec-phu', { tieu_de: 'A' }); yc(d, 'P1-2', 'hang-moi', { tieu_de: 'B' }); return { k, d }; }],
  ['đợt không gốc kho', () => { const k = kho(); const d = dot({}); yc(d, 'P1-1', 'viec-phu', { tieu_de: 'A' }); yc(d, 'P1-2', 'hang-moi', { tieu_de: 'B' }); return { k, d }; }],
  ['loại vận hành', () => {
    const k = kho(); const d = dot({ gocKho: k });
    yc(d, 'P1-1', 'cham-tep', { tep: ['apps/x.ts'] }); yc(d, 'P1-2', 's4-gom', { uoc_phut: 30 }); yc(d, 'P1-3', 'gia-han', { uoc_phut: 10 });
    yc(d, 'P1-4', 'can-nguoi', { tieu_de: 'c' }); yc(d, 'P1-5', 'chuyen-hang', { tieu_de: 'd' }); yc(d, 'P1-6', 'khac', { tieu_de: 'e' });
    return { k, d };
  }],
  ['hang-moi trùng', () => {
    const k = kho({ cua: false }); const d = dot({ gocKho: k });
    yc(d, 'P1-1', 'viec-phu', { tieu_de: 'A' }); yc(d, 'P1-2', 'hang-moi', { tieu_de: 'B' }); yc(d, 'P1-3', 'hang-moi', { tieu_de: 'B' }, '2026-10-05T11:20:00Z');
    return { k, d };
  }],
];
const boKhoa = (o, ks) => Object.fromEntries(Object.entries(o).filter(([x]) => !ks.includes(x)));
function chupDot(d) {
  const tra = readdirSync(path.join(d, 'tra-loi')).filter(f => f.endsWith('.json')).sort().map(f => [f, boKhoa(docJson(path.join(d, 'tra-loi', f)), ['luc'])]);
  const ev = suKien(d).map(e => boKhoa(e, ['luc', 'chan']));
  return JSON.stringify({ tra, ev });
}
async function ca4(goc) {
  const sai = []; const g = gocMay();
  for (const [ten, dung] of DOT4) {
    const a = dung(); const b = dung();
    try { await nhip(b.d, g); } catch (e) { sai.push(`đối chứng gốc không chạy: ${ten} — ${loi(e)}`); continue; }
    if (!suKien(b.d).length) { sai.push(`đối chứng gốc không chạy: ${ten}`); continue; }
    await nhip(a.d, goc);
    if (chupDot(a.d) !== chupDot(b.d)) { sai.push(`kho không cửa bị đổi hành vi: ${ten}`); continue; }
    if (tepCua(a.k).length) sai.push(`kho thử có tệp mới: ${ten}`);
  }
  return sai;
}

async function ca5(goc) {
  const sai = []; const k = kho({ nguonLaTep: true }); const d = dot({ gocKho: k });
  yc(d, 'P1-1', 'viec-phu', { tieu_de: 'A' });
  try { await nhip(d, goc); } catch (e) { return [`nhịp xét sập: ${loi(e)}`]; }
  const t = traLoi(d, 'P1-1'); const ev = suKien(d).filter(e => e.loai === 'yeu-cau' && e.id === 'P1-1');
  if (t) return ['ý mất: trả đã ghi mà không có tệp: P1-1'];
  if (ev.length !== 1 || ev[0].can_phan !== true || !String(ev[0].ly_do).startsWith('không ghi được vào cửa tín hiệu —')) sai.push(`không ghi được mà không phán: ${JSON.stringify(ev)}`);
  try { await nhip(d, goc); } catch (e) { sai.push(`nhịp kế sập: ${loi(e)}`); }
  const { viecCho } = await nap(goc, 'dieu-phoi/scripts/viec-cho.mjs');
  if (!viecCho(d).some(v => v.id === 'P1-1')) sai.push('ý không ghi được không nằm trong việc chờ');
  return sai;
}

const O6 = [
  ['chuoi', 'tin_hieu:\n  nguon: tin-hieu/a\n  gom: g\n'],
  ['dong', 'tin_hieu:\n  nguon: [tin-hieu/a, tin-hieu/b]\n  gom: g\n'],
  ['danh-sach', 'tin_hieu:\n  nguon:\n    - tin-hieu/a\n    - tin-hieu/b\n  gom: g\n'],
  ['chú-thích', 'tin_hieu:\n  nguon: tin-hieu/a   # nguồn chính\n  gom: g # bản gom\n'],
  ['nhay', 'tin_hieu:\n  nguon: "tin-hieu/a"\n  gom: \'g\'\n'],
  ['khoi-vang', 'lo_trinh:\n  tep: x.json\n'],
  ['nguon-vang', 'tin_hieu:\n  gom: g\n'],
  ['nguon-null', 'tin_hieu:\n  nguon: ~\n  gom: g\n'],
];
async function ca6(goc) {
  const sai = [];
  const kit = createRequire(import.meta.url)(path.join(goc, 'scripts', 'tin-hieu-khoa.cjs'));
  const cua = await nap(goc, 'dieu-phoi/scripts/cua-tin-hieu.mjs');
  let n = 0;
  for (const [ten, t] of O6) { n += 1; if (JSON.stringify(cua.khoaTinHieu(t)) !== JSON.stringify(kit.khoaTinHieu(t))) sai.push(`bản chép lệch bộ đọc kit ở ô ${ten}`); }
  const k = kho({ cua: false, them: O6[1][1] });
  const c = cua.docCua(k);
  if (c?.nguon !== path.join(k, 'tin-hieu', 'a')) sai.push(`đích ghi không phải nguồn đầu: ${JSON.stringify(c)}`);
  return { sai, n };
}

const CAU7 = 'Mở KR không thấy số tuần trước';
const gui = (goc, k, cau, them = []) => spawnSync(process.execPath, [path.join(goc, 'scripts', 'gui-tin-hieu.mjs'), '--root', k, '--noi-dung', cau, ...them], { encoding: 'utf8' });
async function ca7(goc) {
  const sai = []; const k = kho({ ten: 'Chủ Kho Thử' });
  const { CAU_DA_GHI, thanTep } = await nap(goc, 'dieu-phoi/scripts/cua-tin-hieu.mjs');
  for (const n of [1, 2]) {
    const x = gui(goc, k, CAU7);
    if (x.status !== 0 || !x.stdout.includes(CAU_DA_GHI) || !x.stdout.includes(`tin-hieu/kho/nguoi-chu-kho-thu-${n}.json`)) sai.push(`lần gửi ${n}: thoát ${x.status} «${x.stdout.trim()}${x.stderr.trim()}»`);
  }
  for (const n of [1, 2]) {
    const p = path.join(k, 'tin-hieu', 'kho', `nguoi-chu-kho-thu-${n}.json`);
    if (!existsSync(p)) { sai.push(`thiếu tệp nguoi-chu-kho-thu-${n}.json`); continue; }
    const o = docJson(p);
    if (o.loai !== 'tin-hieu' || o.noi_dung?.tieu_de !== CAU7) sai.push(`tệp ${n} sai: ${JSON.stringify(o)}`);
    if (thanTep(o) !== readFileSync(p, 'utf8')) sai.push(`hai khuôn tệp tín hiệu: nguoi-chu-kho-thu-${n}.json`);
  }
  const cg = spawnSync(process.execPath, [path.join(goc, 'scripts', 'tin-hieu.mjs'), '--root', k, '--chua-gom'], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(cg.stdout); } catch { j = null; }
  for (const n of [1, 2]) if (!j?.tin_hieu?.some(t => t.id === `nguoi-chu-kho-thu-${n}`)) sai.push(`bộ đọc không liệt nguoi-chu-kho-thu-${n}`);
  return { sai, k };
}
async function ca7SoTrung(goc) {
  const { sai, k } = await ca7(goc); if (sai.length) return sai;
  const p3 = path.join(k, 'tin-hieu', 'kho', 'nguoi-chu-kho-thu-3.json');
  writeFileSync(p3, `${JSON.stringify({ phien: 'nguoi-chu-kho-thu', loai: 'tin-hieu', hang: null, noi_dung: { tieu_de: 'gửi đồng thời' }, luc: '2026-10-15T00:00:00Z' }, null, 2)}\n`);
  const h = bam(p3); const x = gui(goc, k, 'Ý thứ tư');
  if (x.status !== 0 || !existsSync(path.join(k, 'tin-hieu', 'kho', 'nguoi-chu-kho-thu-4.json')) || bam(p3) !== h) return [`số trùng: thoát ${x.status}, -4 ${existsSync(path.join(k, 'tin-hieu', 'kho', 'nguoi-chu-kho-thu-4.json'))}, -3 ${bam(p3) === h ? 'nguyên' : 'bị đè'}`];
  return [];
}
function ca7KhongCua(goc) {
  const k = kho({ cua: false }); const x = gui(goc, k, CAU7); const ra = `${x.stdout}${x.stderr}`.trim();
  if (x.status !== 1 || ra.split('\n').length !== 1 || !ra.includes('tin_hieu') || !ra.includes('_acceptance/config.yaml') || tepCua(k).length) return [`kho không cửa: thoát ${x.status} «${ra}» tệp ${tepCua(k).length}`];
  return [];
}
function ca7Rong(goc) { const k = kho(); const x = gui(goc, k, ''); return x.status === 2 && !tepCua(k).length ? [] : [`câu rỗng: thoát ${x.status}`]; }
function khoiMarker(txt, ten) {
  const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)<!-- ${ten}>>> -->`));
  return m ? m[1].replace(/^```[a-z]*\n/, '').replace(/\n?```\s*$/, '\n') : null;
}
function ca7Lenh(goc) {
  const sai = []; const tep = readFileSync(path.join(goc, 'road-map', 'commands', 'gui.md'), 'utf8');
  if (/^disable-model-invocation:/m.test(tep.split('\n---')[0])) sai.push('lệnh gửi ý bị khoá model-invocation');
  const lenh = khoiMarker(tep, 'RM-GUI-LENH');
  if (!lenh) return [...sai, 'gui.md thiếu khối RM-GUI-LENH'];
  if (!lenh.includes('<câu của người>')) return [...sai, 'khối RM-GUI-LENH thiếu ô <câu của người>'];
  const k = kho();
  const x = spawnSync('bash', ['-c', lenh.replaceAll('$AG', goc).replaceAll('"$AG"', `"${goc}"`).replace('<câu của người>', 'Ý gõ qua lệnh $(echo tiêm) `id`')], { cwd: k, encoding: 'utf8' });
  const f = tepCua(k);
  if (x.status !== 0 || f.length !== 1) return [...sai, `dòng lệnh của gui.md: thoát ${x.status} «${x.stderr.trim()}» tệp ${f.length}`];
  const o = docJson(path.join(k, 'tin-hieu', 'kho', f[0]));
  if (o.noi_dung?.tieu_de !== 'Ý gõ qua lệnh $(echo tiêm) `id`') sai.push(`câu bị shell đổi: ${o.noi_dung?.tieu_de}`);
  return sai;
}

// AC-8: kho khai lộ trình + cửa; 5 tín hiệu, 2 đã ở một bản gom.
const KHUON_TH = readFileSync(path.join(KIT, 'skills', 'acceptance', 'references', 'tin-hieu-template.md'), 'utf8');
function banGom(ids) {
  const b = khoiMarker(KHUON_TH, 'GOM-MAU'); const L = b.split('\n');
  const dau = L.filter(l => /^(dot|dang|nguon|truc|den):/.test(l)).map(l => l.replace(/^dot:.*/, 'dot: gom-1'));
  const iN = L.findIndex(l => l.startsWith('- `'));
  return [...dau, '', L[iN].replace(/`[^`]*`/, '`G1`'), L[iN + 1].replace(/:.*$/, `: ${ids.map(x => `\`${x}\``).join(', ')}`), ''].join('\n');
}
function kho8({ soTin = 5, gom = 2, cua = true, saiKhuon = false } = {}) {
  const k = kho({ cua, them: 'risk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\nlo_trinh:\n  tep: docs/lo-trinh.json\n' });
  mkdirSync(path.join(k, 'docs'), { recursive: true });
  writeFileSync(path.join(k, 'docs', 'lo-trinh.json'), `${JSON.stringify({ schema: 1, ten: 'LT', moc: [], hang: [], da_bac: [] }, null, 2)}\n`);
  const ids = [];
  if (cua) {
    for (let i = 1; i <= soTin; i += 1) {
      const id = `nguoi-a-${i}`; ids.push(id);
      writeFileSync(path.join(k, 'tin-hieu', 'kho', `${id}.json`), JSON.stringify({ phien: 'nguoi-a', loai: 'tin-hieu', hang: null, noi_dung: { tieu_de: `ý ${i}` }, luc: '2026-10-10T00:00:00Z' }));
    }
    if (gom) writeFileSync(path.join(k, 'tin-hieu', 'gom', 'gom-1.md'), banGom(ids.slice(0, gom)));
    if (saiKhuon) writeFileSync(path.join(k, 'tin-hieu', 'kho', 'hong-1.json'), '{ không phải json');
  }
  git(k, 'add', '-A'); git(k, 'commit', '-qm', 'kho 8');
  return k;
}
function the(goc, k) {
  const x = spawnSync(process.execPath, [path.join(goc, 'scripts', 'start-scan.mjs'), '--root', k], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-15' } });
  let j = null; try { j = JSON.parse(x.stdout); } catch { j = null; }
  return { status: x.status, dong: (j?.loTrinh?.dong ?? null), raw: x.stdout.split(goc).join('<AG>'), err: x.stderr };
}
const DONG8 = n => `Cửa tín hiệu: ${n} ý chờ gom ở mốc khép — gom bằng skill gom-tin-hieu`;
function ca8(goc) {
  const t = the(goc, kho8());
  if (t.status !== 0 || !t.dong) return [`thẻ không chạy: ${t.status} ${t.err.slice(0, 200)}`];
  const dong = t.dong.filter(l => l.startsWith('Cửa tín hiệu:'));
  if (dong.length !== 1 || dong[0] !== DONG8(3)) {
    const m = dong[0] && dong[0].match(/^Cửa tín hiệu: (\d+) ý/);
    return [m && m[1] === '5' ? 'thẻ đếm cả ý đã gom: 5 ≠ 3' : `dòng thẻ: ${JSON.stringify(dong)}`];
  }
  return [];
}
function ca8Khong(goc) {
  const sai = []; const g = gocMay();
  for (const [ten, tao] of [['0 ý chờ gom', () => kho8({ soTin: 2, gom: 2 })], ['kho không cửa', () => kho8({ cua: false })]]) {
    const k = tao(); const b = the(g, k); const a = the(goc, k);
    if (b.status !== 0 || !b.raw.trim()) { sai.push(`đối chứng gốc không chạy: ${ten}`); continue; }
    if (a.raw !== b.raw) sai.push(`thẻ đổi khi không có ý chờ gom: ${ten}`);
  }
  return sai;
}
function ca8SaiKhuon(goc) {
  const t = the(goc, kho8({ saiKhuon: true }));
  if (t.status !== 0 || !t.dong) return [`thẻ sập với tệp sai khuôn: ${t.status}`];
  const d = t.dong.filter(l => l.startsWith('! cửa tín hiệu:'));
  return d.length === 1 && d[0].includes('1 tệp') ? [] : [`dòng cảnh báo: ${JSON.stringify(d)}`];
}

const LENH_DOT = (goc, l) => l.replace('<thư mục đợt>/loi/', `${path.join(goc, 'dieu-phoi', 'scripts')}/`);
async function ca9(goc) {
  const sai = [];
  const skill = readFileSync(path.join(goc, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const khoi = khoiMarker(skill, 'TRONG-DOT-HANG-MOI');
  const lenh = khoi && (/`(node [^`]*yeu-cau hang-moi[^`]*)`/.exec(khoi) || [])[1];
  if (!lenh) return ['SKILL thiếu khối TRONG-DOT-HANG-MOI có dòng yeu-cau hang-moi'];
  const k = kho(); const d = dotCoKho(k);
  const x = spawnSync('bash', ['-c', LENH_DOT(goc, lenh).replace('<slug>', 'a').replace('<câu giao>', 'Mở việc thử')], { cwd: k, encoding: 'utf8' });
  if (x.status !== 0) return [`dòng S0 không chạy: ${x.stderr.trim()}`];
  const id = x.stdout.trim().split('\n').pop().trim();
  await nhip(d, goc);
  const ev = suKien(d).filter(e => e.loai === 'yeu-cau' && e.id === id);
  if (traLoi(d, id) || ev[0]?.can_phan !== true || ev[0]?.chan !== true) sai.push('thợ chờ ô bị trả đã ghi');
  return sai;
}
async function ca9Luat(goc) {
  const t = readFileSync(path.join(goc, 'dieu-phoi', 'scripts', 'mau', 'LUAT.md'), 'utf8');
  const khoi = khoiMarker(t, 'LUAT-CHAN');
  if (!khoi) return ['LUAT.md thiếu khối LUAT-CHAN'];
  const sai = [];
  if (!khoi.includes('đã ghi') || !khoi.includes('--chan')) sai.push('khối LUAT-CHAN thiếu «đã ghi» hoặc «--chan»');
  const lenh = (/`(node [^`]*yeu-cau[^`]*)`/.exec(khoi) || [])[1];
  if (!lenh) return [...sai, 'khối LUAT-CHAN không có dòng lệnh yeu-cau'];
  const k = kho(); const d = dotCoKho(k);
  const x = spawnSync('bash', ['-c', LENH_DOT(goc, lenh).replace('<việc>', 'Thiếu bảng X')], { cwd: k, encoding: 'utf8' });
  const id = x.stdout.trim().split('\n').pop().trim();
  if (x.status !== 0 || !existsSync(path.join(d, 'yeu-cau', `${id}.json`))) return [...sai, `dòng LUAT-CHAN không chạy: ${x.stderr.trim()}`];
  if (docJson(path.join(d, 'yeu-cau', `${id}.json`)).noi_dung?.chan !== true) sai.push('dòng LUAT-CHAN không khai chặn');
  return sai;
}

async function ca10(goc) {
  const k = kho(); const d = dot({ gocKho: k });
  const { chepLoi } = await nap(goc, 'dieu-phoi/scripts/dieu-phoi.mjs');
  const loi_ = chepLoi(d);
  yc(d, 'P1-1', 'viec-phu', { tieu_de: 'Chạy từ bản lõi' });
  let m;
  try { m = await import(pathToFileURL(path.join(loi_, 'phat-lich.mjs')).href); } catch (e) {
    const mod = /tin-hieu-khoa/.test(String(e.message)) ? 'tin-hieu-khoa' : String(e.message).slice(0, 120);
    return [`bản lõi theo đợt thiếu module: ${mod}`];
  }
  await m.motNhip(d, IO);
  return traLoi(d, 'P1-1')?.ket_qua === 'ghi' && tepCua(k).includes('P1-1.json') ? [] : [`bản lõi không ghi vào cửa: ${JSON.stringify(traLoi(d, 'P1-1'))}`];
}

// ── Chạy: lành (KIT) rồi đỏ (bản sao) ─────────────────────────────────────────────────────────────────────────────
async function lanh(id, fn) {
  if (!want(id)) return true;
  try { const s = await fn(KIT); if (s.length) { bad(id, s.join(' ; ')); return false; } ok(id); return true; } catch (e) { bad(id, loi(e)); return false; }
}
async function do_(id, tiem, fn, ghim, lanhOk) {
  if (!want(id)) return;
  if (!lanhOk) { bad(id, 'bản lành chưa xanh — không tin chiều đỏ'); return; }
  try {
    const s = await fn(banSao(tiem));
    if (s.some(x => x.includes(ghim))) ok(id, ghim); else bad(id, `bản sao không đỏ đúng thông điệp «${ghim}»: ${JSON.stringify(s).slice(0, 300)}`);
  } catch (e) { bad(id, loi(e)); }
}
const YC = 'dieu-phoi/scripts/yeu-cau.mjs';
const PL = 'dieu-phoi/scripts/phat-lich.mjs';
const CUA = 'dieu-phoi/scripts/cua-tin-hieu.mjs';

const l1 = await lanh('CT-1', async g => (await ca1(g)).sai);
await do_('CT-1-do', [[YC, "return { ket_qua: 'ghi', boi: 'may',", "return { ket_qua: 'can_phan', boi: 'may',"]], async g => (await ca1(g)).sai, 'ý không chặn đánh thức giám sát: P1-1', l1);
await do_('CT-1-do2', [[PL, '? { chan: y.noi_dung?.chan === true } : {}', '? {} : {}']], async g => (await ca1(g)).sai, 'sự kiện thiếu khoá chan: P1-1', l1);
if (want('CT-1-duong')) {
  try {
    const sai = [];
    const hd = readFileSync(path.join(KIT, '_acceptance', SLUG, 'contract.md'), 'utf8');
    const jq = (/`(jq -s [^`]+)`/.exec(hd.slice(hd.indexOf('## Đường đo'))) || [])[1];
    if (!jq) sai.push('contract thiếu câu jq ở mục Đường đo');
    else if (spawnSync('jq', ['--version']).status !== 0) sai.push('thiếu jq — không đọc được đường đo');
    else {
      const doc = d => { const x = spawnSync('bash', ['-c', jq.replace('<thư mục đợt>', `"${d}"`)], { encoding: 'utf8' }); return JSON.parse(x.stdout); };
      const { d } = await ca1(KIT); const r = doc(d);
      if (r.n !== 2 || r.can_phan !== 0 || JSON.stringify([...r.ghi].sort()) !== '["P1-1","P1-2"]') sai.push(`đợt có cửa không đọc SỐNG: ${JSON.stringify(r)}`);
      const x = DOT4[0][1](); await nhip(x.d, KIT); const r2 = doc(x.d);
      if (!(r2.n >= 1 && r2.can_phan >= 1)) sai.push(`đợt không cửa không đọc CHẾT: ${JSON.stringify(r2)}`);
    }
    if (sai.length) bad('CT-1-duong', sai.join(' ; ')); else ok('CT-1-duong');
  } catch (e) { bad('CT-1-duong', loi(e)); }
}

const l2 = await lanh('CT-2', g => ca2(g));
await lanh('CT-2-doi', g => ca2(g, { chan: false }));
await do_('CT-2-do', [[YC, 'if (yc.noi_dung?.chan === true)', 'if (false)']], g => ca2(g), 'ý khai chặn không được phán', l2);
await do_('CT-2-do2', [['dieu-phoi/scripts/dieu-phoi.mjs', 'if (co.chan === true) noiDung.chan = true;', '']], g => ca2(g), 'cờ --chan không vào noi_dung', l2);

const l3 = await lanh('CT-3', g => ca3(g));
if (want('CT-3-lan-hai') || want('CT-3-gop')) { for (const id of ['CT-3-lan-hai', 'CT-3-gop']) if (want(id)) (l3 ? ok(id, 'trong CT-3') : bad(id, 'CT-3 đỏ')); }
const l3k = await lanh('CT-3-khac-than', g => ca3KhacThan(g));
await do_('CT-3-do', [[CUA, 'JSON.stringify({ phien, loai, hang, noi_dung, luc }, null, 2)', "JSON.stringify({ phien, loai, hang, noi_dung, luc, _ten: 'x' }, null, 2)"]], g => ca3(g), 'tệp tín hiệu khác thân yêu cầu: P1-1', l3);
await do_('CT-3-do2', [[CUA, "if (cu === than) return 'da-co';", "if (cu === than) { fs.writeFileSync(tep, than); return 'da-co'; }"]], g => ca3(g), 'nhịp xét hai lần đẻ tệp mới: P1-1', l3);
await do_('CT-3-do3', [[CUA, "return 'khac-than';", "fs.writeFileSync(tep, than); return 'moi';"]], g => ca3KhacThan(g), 'ý bị đè: P1-1', l3k);

const l4 = await lanh('CT-4', g => ca4(g));
await do_('CT-4-do', [[CUA, 'if (!k) return null;', "if (!k) return { goc: gocKho, nguon: path.join(gocKho, 'tin-hieu') };"]], g => ca4(g), 'kho không cửa bị đổi hành vi: kho không khai cửa', l4);
await do_('CT-4-do2', [[YC, '  if (!nguCanh.cua) return', "  { const t0 = timTrung(yc, nguCanh); if (t0) return { ket_qua: 'gop', boi: 'may', ly_do: 'x', voi: t0.id }; }\n  if (!nguCanh.cua) return"]], g => ca4(g), 'kho không cửa bị đổi hành vi: hang-moi trùng', l4);

const l5 = await lanh('CT-5', g => ca5(g));
await do_('CT-5-do', [[CUA, 'return { ket_qua: \'can_phan\', ly_do: `không ghi được vào cửa tín hiệu — ${e.code ?? e.message}` };', 'return kq;']], g => ca5(g), 'ý mất: trả đã ghi mà không có tệp: P1-1', l5);

if (want('CT-6')) {
  try { const { sai, n } = await ca6(KIT); if (sai.length) bad('CT-6', sai.join(' ; ')); else ok('CT-6', `${n}/${O6.length} ô`); } catch (e) { bad('CT-6', loi(e)); }
}
await do_('CT-6-do', [[CUA, "const boChuThich = (s) => String(s).replace(/\\s+#.*$/, '').trim();", 'const boChuThich = (s) => String(s).trim();']], async g => (await ca6(g)).sai, 'bản chép lệch bộ đọc kit ở ô chú-thích', true);

const l7 = await lanh('CT-7', async g => (await ca7(g)).sai);
await lanh('CT-7-so-trung', g => ca7SoTrung(g));
await lanh('CT-7-khong-cua', g => ca7KhongCua(g));
await lanh('CT-7-rong', g => ca7Rong(g));
await lanh('CT-7-lenh', g => ca7Lenh(g));
if (want('CT-7-mot-ghi')) (l7 ? ok('CT-7-mot-ghi', 'trong CT-7: tệp người dựng lại bằng thanTep bằng byte') : bad('CT-7-mot-ghi', 'CT-7 đỏ'));
await do_('CT-7-do', [['scripts/gui-tin-hieu.mjs', 'const r = ghiVaoCua(cua, id, yc);', "fs.writeFileSync(path.join(cua.nguon, `${id}.json`), JSON.stringify(yc)); const r = { ket: 'moi', tep: path.join(cua.nguon, `${id}.json`) };"]], async g => (await ca7(g)).sai, 'hai khuôn tệp tín hiệu: nguoi-chu-kho-thu-1.json', l7);

const l8 = await lanh('CT-8', g => ca8(g));
await lanh('CT-8-khong', g => ca8Khong(g));
await lanh('CT-8-sai-khuon', g => ca8SaiKhuon(g));
await do_('CT-8-do', [['scripts/start-scan.mjs', 'const n = cg.tin_hieu.length;', 'const n = TH.docTinHieu(root, TH.docKhai(root).nguon).tinHieu.length;']], g => ca8(g), 'thẻ đếm cả ý đã gom: 5 ≠ 3', l8);

const l9 = await lanh('CT-9', g => ca9(g));
await lanh('CT-9-luat', g => ca9Luat(g));
await do_('CT-9-do', [['feature-loop/skills/feature-loop/SKILL.md', 'yeu-cau hang-moi --chan', 'yeu-cau hang-moi']], g => ca9(g), 'thợ chờ ô bị trả đã ghi', l9);

const l10 = await lanh('CT-10', g => ca10(g));
await do_('CT-10-do', [[CUA, 'export const CAU_DA_GHI', "import _khoaKit from '../../scripts/tin-hieu-khoa.cjs';\nexport const CAU_DA_GHI"]], g => ca10(g), 'bản lõi theo đợt thiếu module: tin-hieu-khoa', l10);

console.log(`\nResults: ${pass} passed, ${fail} failed`);
if (process.env.CT_GIU_TMP !== '1') rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
