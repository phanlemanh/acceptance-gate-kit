#!/usr/bin/env node
// thuoc-vat.mjs — bộ đếm vật · thước · nhát sửa thước của một hồ sơ, SUY TỪ GIT
// (thuoc-co-cua AC-11). Sổ ghi, git đếm: không số nào ở đây đọc từ sổ quyết định.
//
//   node thuoc-vat.mjs --root <repo> --slug <slug> [--ag-root <dir>] [--json] [--write]
//   node thuoc-vat.mjs --root <repo> --slug <slug> --giua-hai-luot
//   node thuoc-vat.mjs --root <repo> --slug <slug> --target <sha>
//
// Lớp của một đường dẫn lấy từ MỘT nguồn `lib/phan-loai.mjs` (ngoài · thước · hồ sơ · vật).
//   mốc sàn — commit ĐẦU TIÊN đưa hợp đồng sang `status: implemented`; nếu sổ quyết định
//             TẠI HEAD có dòng «trần thước — » thì commit đầu tiên đưa id của dòng mới
//             nhất như thế vào sổ, khi nó muộn hơn (van của trần, AC-12). Dòng sổ chưa
//             commit không có commit nào nên không dời mốc.
//   nhát    — commit sau mốc sàn chạm thước mà KHÔNG chạm vật; chạm cả hai → ô «lẫn»
//             (nhát sửa vật kèm ca hồi quy, đúng lệ kit); chỉ hồ sơ/ngoài → không là gì.
//   dòng    — `git diff --numstat <mốc sàn>..HEAD` gom theo lớp (tệp nhị phân đếm 0).
//
// exit 0 = xong (kể cả «chưa có mốc sàn») · exit 2 = usage / nguồn hỏng ·
// exit 3 = --giua-hai-luot không liệt kê được (thiếu lượt, sha không thuần nhất) — KHÔNG đoán.
// exit 5 = --write thấy THƯỚC LỆCH trong lượt chấm (ảnh chụp trong s4-args.json ≠ cây lúc này).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { phanLoai, DO_GLOBS } from './lib/phan-loai.mjs';
import { chupThuoc, soThuoc } from './chup-ho-so-da-thong.mjs';
import { globToRe } from './carry-plan.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SELF = fileURLToPath(import.meta.url);

// <<<THUOC-VAT-LINE
// {"kind":"thuoc-vat","ts":"<ISO>","round":<n>,"san":"<sha>","vat":[<a>,<b>],"thuoc":[<c>,<d>],"ho_so":[<e>,<f>],"nhat":<k>,"lan":<m>,"tep_thuoc":["<đường>"]}
// THUOC-VAT-LINE>>>

// Dòng «thước lệch trong lượt chấm» (nhan-trang-thai-va-reality AC-3). Bên đọc (thẻ Cổng 2,
// ca đo) rút khoá từ CHÍNH khối này.
// <<<THUOC-LECH-LINE
// {"kind":"thuoc-lech","ts":"<ISO>","round":<n>,"sha":"<sha lúc sinh args>","tep":[{"tep":"<đường>","doi":"<đổi nội dung|thêm|xoá>"}]}
// THUOC-LECH-LINE>>>

const TIEN_TO_VAN = 'trần thước — ';

function gitRaw(root, args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}
const gitLines = (root, args) => gitRaw(root, args).split('\n').map(s => s.trim()).filter(Boolean);
const gitTry = (root, args) => { try { return gitRaw(root, args); } catch { return null; } };

function laToTien(root, a, b) {   // a có phải tổ tiên (hoặc bằng) b không
  try { execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', a, b], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

// Mốc sàn: null khi hợp đồng chưa từng implemented.
// `docTruong` = frontmatterField của lib/evidence-core.cjs — CÙNG bộ đọc frontmatter mà các cổng
// dùng (dòng trống đầu tệp, CRLF, nháy theo cặp). Bộ đọc tự viết của nhát sửa lượt 1 lệch nó ở
// CRLF và dòng trống đầu tệp, trả «chưa có mốc sàn» và trần im lặng (S4-r2, owner trả lại 17/09).
function timMocSan(root, slug, docTruong) {
  if (typeof docTruong !== 'function') throw new Error('demThuocVat can frontmatterField cua lib/evidence-core.cjs — KHONG tu doc frontmatter');
  const hopDongRel = `_acceptance/${slug}/contract.md`;
  // Đọc TRƯỜNG `status` ở từng commit chạm hợp đồng, theo thứ tự thời gian — không `git log -S`
  // trên cả văn: hợp đồng hay nhắc chuỗi trạng thái trong tiêu chí từ S1 (S4-r1, finding AC-11).
  const truongStatus = txt => String(docTruong(String(txt || ''), 'status') || '').toLowerCase();
  const implemented = gitLines(root, ['log', '--reverse', '--format=%H', '--', hopDongRel])
    .find(h => truongStatus(gitTry(root, ['show', `${h}:${hopDongRel}`])) === 'implemented') || null;
  if (!implemented) return null;
  const soRel = `_acceptance/${slug}/decisions.jsonl`;
  const soHead = gitTry(root, ['show', `HEAD:${soRel}`]);
  if (!soHead) return implemented;
  let idVan = null;
  for (const l of soHead.split('\n')) {
    if (!l.trim()) continue;
    let o; try { o = JSON.parse(l); } catch { continue; }
    if (o && typeof o.decision === 'string' && o.decision.startsWith(TIEN_TO_VAN) && typeof o.id === 'string' && o.id) idVan = o.id;
  }
  if (!idVan) return implemented;
  const van = gitLines(root, ['log', '--reverse', '--format=%H', '-S', idVan, '--', soRel])[0] || null;
  if (!van) return implemented;
  return laToTien(root, implemented, van) ? van : implemented;
}

export function demThuocVat({ root, slug, t1SkipGlobs = [], frontmatterField }) {
  const lop = f => phanLoai(f, { t1SkipGlobs });
  const san = timMocSan(root, slug, frontmatterField);
  if (!san) {
    return { san: null, ghiChu: 'chua co moc san (hop dong chua tung implemented)', vat: [0, 0], thuoc: [0, 0], hoSo: [0, 0], nhat: 0, lan: 0, tepThuoc: [] };
  }
  // Nhát: một lời gọi git cho mọi commit sau mốc sàn, theo thứ tự thời gian.
  let nhat = 0; let lan = 0;
  const khoi = gitRaw(root, ['log', '--reverse', '--format=@@%H', '--name-only', `${san}..HEAD`]).split('@@').filter(s => s.trim());
  for (const k of khoi) {
    const tep = k.split('\n').slice(1).map(s => s.trim()).filter(Boolean);
    const cacLop = new Set(tep.map(lop));
    const coThuoc = cacLop.has('thuoc');
    const coVat = cacLop.has('vat');
    if (coThuoc && !coVat) nhat += 1;
    else if (coThuoc && coVat) lan += 1;
  }
  // Dòng: numstat gom theo lớp.
  const vat = [0, 0]; const thuoc = [0, 0]; const hoSo = [0, 0];
  const tepThuoc = [];
  for (const l of gitLines(root, ['diff', '--numstat', `${san}..HEAD`])) {
    const [a, b, ...rest] = l.split('\t');
    const f = rest.join('\t');
    const them = a === '-' ? 0 : Number(a) || 0;
    const bot = b === '-' ? 0 : Number(b) || 0;
    const c = lop(f);
    const o = c === 'vat' ? vat : c === 'thuoc' ? thuoc : c === 'ho-so' ? hoSo : null;
    if (o) { o[0] += them; o[1] += bot; }
    if (c === 'thuoc') tepThuoc.push(f);
  }
  return { san, ghiChu: null, vat, thuoc, hoSo, nhat, lan, tepThuoc };
}

// ── dòng run-log: dựng THEO khuôn marker, không gõ tay thứ tự khoá ───────────
export function dongThuocVat(dem, { round, ts }) {
  const src = fs.readFileSync(SELF, 'utf8');
  const lines = src.split('\n');
  const a = lines.findIndex(l => l.includes('<<<THUOC-VAT-LINE'));
  const b = lines.findIndex(l => l.includes('THUOC-VAT-LINE>>>'));
  if (a === -1 || b === -1 || b <= a) throw new Error('khong rut duoc khoi marker THUOC-VAT-LINE');
  const khuon = lines.slice(a + 1, b).map(l => l.replace(/^\s*\/\/\s?/, '')).join('');
  const khoa = [...khuon.matchAll(/"([a-z_]+)":/g)].map(m => m[1]);
  const giaTri = {
    kind: 'thuoc-vat', ts, round, san: dem.san, vat: dem.vat, thuoc: dem.thuoc, ho_so: dem.hoSo,
    nhat: dem.nhat, lan: dem.lan, tep_thuoc: dem.tepThuoc,
  };
  const thieu = khoa.filter(k => !(k in giaTri));
  const thua = Object.keys(giaTri).filter(k => !khoa.includes(k));
  if (thieu.length || thua.length) throw new Error(`khuon THUOC-VAT-LINE lech ben viet — thieu: ${thieu.join(',')} · thua: ${thua.join(',')}`);
  const o = {};
  for (const k of khoa) o[k] = giaTri[k];
  return JSON.stringify(o);
}

export function dongThuocLech(tep, { round, ts, sha }) {
  const src = fs.readFileSync(SELF, 'utf8');
  const m = src.match(/<<<THUOC-LECH-LINE\n([\s\S]*?)THUOC-LECH-LINE>>>/);
  if (!m) throw new Error('khong rut duoc khoi marker THUOC-LECH-LINE');
  const khoa = [...m[1].matchAll(/"([a-z_]+)":/g)].map(x => x[1]).filter((k, i, a) => a.indexOf(k) === i && k !== 'doi');
  const giaTri = { kind: 'thuoc-lech', ts, round, sha: sha || null, tep };
  const thieu = khoa.filter(k => !(k in giaTri));
  const thua = Object.keys(giaTri).filter(k => !khoa.includes(k));
  if (thieu.length || thua.length) throw new Error(`khuon THUOC-LECH-LINE lech ben viet — thieu: ${thieu.join(',')} · thua: ${thua.join(',')}`);
  const o = {};
  for (const k of khoa) o[k] = giaTri[k];
  return JSON.stringify(o);
}

function docRunLog(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const isMain = (() => {
  try { return fs.realpathSync(SELF) === fs.realpathSync(process.argv[1] || ''); } catch { return false; }
})();

if (isMain) {
  const USAGE = 'usage: thuoc-vat.mjs --root <repo> --slug <slug> [--ag-root <dir>] [--args <s4-args.json>] [--json] [--write] [--giua-hai-luot] [--target <sha>]';
  const die = (msg, code = 2) => { console.error(`thuoc-vat: ${msg}`); process.exit(code); };
  const BOOL = new Set(['json', 'write', 'giua-hai-luot']);
  const VAL = new Set(['root', 'slug', 'ag-root', 'target', 'args']);
  const flags = {};
  {
    const argv = process.argv.slice(2);
    for (let i = 0; i < argv.length; i += 1) {
      const tok = argv[i];
      if (!tok.startsWith('--')) die(`tham số lạ (không phải cờ): ${tok}\n${USAGE}`);
      const name = tok.slice(2);
      if (BOOL.has(name)) { flags[name] = true; continue; }
      if (!VAL.has(name)) die(`cờ không nhận diện được: ${tok}\n${USAGE}`);
      if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) die(`cờ ${tok} thiếu giá trị\n${USAGE}`);
      flags[name] = argv[i + 1]; i += 1;
    }
  }
  if (!flags.root || !flags.slug) die(`thiếu --root hoặc --slug\n${USAGE}`);
  const root = (() => { try { return fs.realpathSync(flags.root); } catch { return die(`--root không tồn tại: ${flags.root}`); } })();
  const slug = flags.slug;
  const ws = path.join(root, '_acceptance', slug);
  const runLogPath = path.join(ws, 'run-log.jsonl');

  // MỘT lần nạp lib/evidence-core.cjs cho cả hai việc: t1_skip_globs (resolveConfigList, cùng bộ
  // đọc config với s4-args) và trường status của hợp đồng (frontmatterField, cùng bộ đọc với cổng).
  const core = (() => {
    let agRoot = flags['ag-root'];
    if (!agRoot) {
      const tuHost = path.resolve(HERE, '..', '..');
      if (fs.existsSync(path.join(tuHost, 'lib', 'evidence-core.cjs'))) agRoot = tuHost;
      else {
        try {
          const out = execFileSync(process.execPath, [path.join(HERE, 'resolve-plugin.mjs'), '--plugin', 'acceptance-gate', '--require', 'lib/evidence-core.cjs'], { encoding: 'utf8' });
          agRoot = out.trim().split('\n').pop();
        } catch (e) { die(`không resolve được plugin acceptance-gate: ${String(e.message || e).split('\n')[0]} — truyền --ag-root`); }
      }
    }
    const corePath = path.join(agRoot, 'lib', 'evidence-core.cjs');
    let c;
    try { c = createRequire(import.meta.url)(corePath); } catch (e) { die(`không nạp được ${corePath}: ${String(e.message).split('\n')[0]}`); }
    if (typeof c.resolveConfigList !== 'function') die('acceptance-gate quá cũ: lib/evidence-core.cjs không có resolveConfigList (cần ≥ 2.9.0)');
    if (typeof c.frontmatterField !== 'function') die('acceptance-gate quá cũ: lib/evidence-core.cjs không có frontmatterField');
    return c;
  })();
  const t1SkipGlobs = (() => {
    let configText;
    try { configText = fs.readFileSync(path.join(root, '_acceptance', 'config.yaml'), 'utf8'); }
    catch { return []; }   // repo không có config → không lời khai ngoài
    try { const v = core.resolveConfigList(configText, 'risk_tiers.t1_skip_globs'); return Array.isArray(v) ? v : []; }
    catch { return []; }
  })();

  if (flags['giua-hai-luot']) {
    const dong = docRunLog(runLogPath);
    const tally = dong.filter(l => l.kind === 'round-tally' && typeof l.round === 'number');
    if (tally.length < 2) die(`khong liet ke duoc: run-log co ${tally.length} dong round-tally co round, can hai luot`, 3);
    const hai = tally.slice(-2);
    const shaLuot = [];
    for (const t of hai) {
      const shas = new Set(dong.filter(l => l.round === t.round && Object.prototype.hasOwnProperty.call(l, 'sha')).map(l => l.sha));
      if (!Object.prototype.hasOwnProperty.call(t, 'sha')) die(`khong liet ke duoc: dong round-tally cua luot ${t.round} thieu sha`, 3);
      if (shas.size !== 1 || [...shas][0] == null || typeof [...shas][0] !== 'string') die(`khong liet ke duoc: luot ${t.round} co sha khong thuan nhat (${[...shas].map(String).join(', ')})`, 3);
      shaLuot.push([...shas][0]);
    }
    const [shaA, shaB] = shaLuot;
    let tep;
    try { tep = gitLines(root, ['diff', '--name-only', `${shaA}..${shaB}`]); }
    catch (e) { die(`khong liet ke duoc: git diff ${shaA}..${shaB} that bai — ${String(e.stderr || e.message).split('\n')[0]}`, 3); }
    const thuoc = tep.filter(f => phanLoai(f, { t1SkipGlobs }) === 'thuoc');
    console.error(`thuoc-vat: tep thuoc doi giua luot ${hai[0].round} (${shaA.slice(0, 8)}) va luot ${hai[1].round} (${shaB.slice(0, 8)}): ${thuoc.length}`);
    for (const f of thuoc) console.log(f);
    process.exit(0);
  }

  if (flags.target) {
    let sha, tep;
    try {
      sha = gitRaw(root, ['rev-parse', '--verify', `${flags.target}^{commit}`]).trim();
      tep = gitLines(root, ['show', '--name-only', '--format=', sha]);
    } catch (e) { die(`--target không giải được: ${flags.target} — ${String(e.stderr || e.message).split('\n')[0]}`); }
    const cacLop = new Set(tep.map(f => phanLoai(f, { t1SkipGlobs })));
    const lopCommit = cacLop.has('thuoc') && cacLop.has('vat') ? 'lan'
      : cacLop.has('thuoc') ? 'thuoc' : cacLop.has('vat') ? 'vat' : cacLop.has('ho-so') ? 'ho-so' : 'ngoai';
    if (flags.json) console.log(JSON.stringify({ sha, lop: lopCommit, tep }));
    else console.log(lopCommit);
    process.exit(0);
  }

  let dem;
  try { dem = demThuocVat({ root, slug, t1SkipGlobs, frontmatterField: core.frontmatterField }); }
  catch (e) { die(`lệnh git thất bại: ${String(e.stderr || e.message).split('\n')[0]}`); }

  if (flags.write) {
    const rounds = docRunLog(runLogPath).map(l => l.round).filter(n => typeof n === 'number');
    const round = rounds.length ? Math.max(...rounds) : 0;
    let line;
    try { line = dongThuocVat(dem, { round, ts: new Date().toISOString().slice(0, 19) + 'Z' }); }
    catch (e) { die(String(e.message)); }
    fs.mkdirSync(ws, { recursive: true });
    fs.appendFileSync(runLogPath, line + '\n');
    console.error(`thuoc-vat: da noi dong thuoc-vat vao ${runLogPath} (round ${round})`);
    // Thước chỉ-đọc (AC-3): so ảnh chụp trong tệp args với cây lúc này. Lệch = lượt ấy
    // chấm bằng thước khác thước lúc sinh args → không dùng được; chấm lại lượt mới.
    const argsPath = flags.args ? path.resolve(flags.args) : path.join(ws, 's4-args.json');
    let chup = null;
    try { chup = JSON.parse(fs.readFileSync(argsPath, 'utf8')).thuocChup || null; } catch { chup = null; }
    if (!chup || !chup.tep) console.error(`thuoc-vat: không có ảnh chụp thước (${path.relative(root, argsPath) || argsPath}) — hồ sơ đời cũ, bỏ qua so`);
    else {
      let lech;
      try { lech = soThuoc(chup.tep, chupThuoc(root, slug, DO_GLOBS.map(globToRe))); }
      catch (e) { die(`không chụp lại được thước: ${String(e.message).split('\n')[0]}`); }
      if (lech.length) {
        let dl;
        try { dl = dongThuocLech(lech, { round, ts: new Date().toISOString().slice(0, 19) + 'Z', sha: chup.sha }); }
        catch (e) { die(String(e.message)); }
        fs.appendFileSync(runLogPath, dl + '\n');
        console.error('thuoc-vat: thuoc lech trong luot cham — luot nay khong dung duoc, cham lai luot moi');
        for (const x of lech) console.error(`  ${x.doi}: ${x.tep}`);
        if (flags.json) console.log(JSON.stringify(dem));
        process.exit(5);
      }
    }
  }

  if (flags.json) console.log(JSON.stringify(dem));
  else {
    const so = ([a, b]) => `+${a}/-${b}`;
    console.log(`thuoc-vat ${slug}: san ${dem.san ? dem.san.slice(0, 12) : '—'} · vat ${so(dem.vat)} · thuoc ${so(dem.thuoc)} · ho so ${so(dem.hoSo)} · nhat ${dem.nhat} · lan ${dem.lan}`);
    if (dem.ghiChu) console.log(`  ghi chu: ${dem.ghiChu}`);
    if (dem.tepThuoc.length) console.log(`  tep thuoc: ${dem.tepThuoc.join(', ')}`);
  }
}
