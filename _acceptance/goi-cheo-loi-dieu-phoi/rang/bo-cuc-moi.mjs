#!/usr/bin/env node
// bo-cuc-moi.mjs — bộ dựng bố cục plugins/<tên>/ của hồ sơ goi-cheo-loi-dieu-phoi (E2–E8 ca BC-n; E10 chế độ
// --chieu-do). Sống tới ngày cắt sang kho kế nhiệm; sau đó bố cục mới là bố cục duy nhất (design §5).
//
//   node bo-cuc-moi.mjs                 dựng từ cây đang kiểm, chạy BC-2…BC-9   (0 xanh · 1 đỏ · 3 hạ tầng)
//   node bo-cuc-moi.mjs --ref <sha>     dựng từ một ref, chạy BC-2…BC-9
//   node bo-cuc-moi.mjs --chieu-do      CD-0 = cây đang kiểm xanh; rồi bản gốc 593e6837 phải đỏ CD-2…CD-8 với
//                                       thông điệp ghim (chỉ chạy khi CD-0 xanh)
//
// Fixture (kho mới, bản cài lõi, kho tiêu thụ, kho kit) do mã sinh ở thư mục tạm; gốc kit suy từ vị trí tệp này; không
// ghi gì vào cây kit. HOME của mọi lệnh con trỏ một thư mục tạm rỗng: bộ đệm plugin rỗng, nên một đường «tìm thấy» chỉ
// có thể là đường trong chính kho/bản cài đang đo. BC-9 ngoài hợp đồng (dòng sổ fix S3): đường tới thư mục skill đổi tên.
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CHO_MOI, dungKhoMoi, layCay } from './luat-doi-chu.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..', '..');
export const GOC_SHA = '593e6837';
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'goi-cheo-bcm-')));
const HOME = path.join(TMP, 'home'); mkdirSync(path.join(HOME, '.claude', 'plugins', 'cache'), { recursive: true });
const ENV = { ...process.env, HOME, GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
let seq = 0;
const tam = ten => { const d = path.join(TMP, `${ten}-${++seq}`); mkdirSync(d, { recursive: true }); return d; };
const chay = (cmd, args, o = {}) => spawnSync(cmd, args, { encoding: 'utf8', env: ENV, maxBuffer: 1 << 26, ...o });
const node = (args, o) => chay(process.execPath, args, o);
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', env: ENV });
class HaTang extends Error {}
const boMod = s => { const m = String(s).match(/Cannot find (?:module|package) '([^']+)'/); return m ? `ERR_MODULE_NOT_FOUND ${path.basename(m[1])}` : null; };
const dongCuoi = s => String(s || '').trim().split('\n').filter(Boolean).pop() || '';
const lyDo = r => boMod(r.stderr) || `thoát ${r.status}: ${dongCuoi(r.stderr) || dongCuoi(r.stdout)}`;

// ── dựng ────────────────────────────────────────────────────────────────────────────────────────────────────────────
function dung(ref) {
  const nguon = tam('nguon');
  try { layCay(KIT, nguon, ref); } catch (e) { throw new HaTang(`lấy cây ${ref || 'đang kiểm'}: ${e.message}`); }
  const kho = tam('kho-moi');
  dungKhoMoi(nguon, kho);
  git(kho, 'init', '-q', '-b', 'main'); git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'kho mới');
  const cai = path.join(tam('cai'), 'acceptance-gate');
  cpSync(path.join(kho, 'plugins', 'acceptance-gate'), cai, { recursive: true });
  return { kho, cai };
}
function khoTieuThu({ cua = false, loTrinh = false, chan = false, bat = null } = {}) {
  const r = tam('kho-tt');
  git(r, 'init', '-q', '-b', 'main');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  const cfg = ['schema_version: 1'];
  if (cua) cfg.push('tin_hieu:', '  nguon: [tin-hieu/kho]', '  gom: tin-hieu/gom');
  if (loTrinh) cfg.push('lo_trinh:', '  tep: docs/plan/lo-trinh.json', ...(chan ? ['  chan: true'] : []));
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), cfg.join('\n') + '\n');
  if (cua) for (const d of ['tin-hieu/kho', 'tin-hieu/gom']) { mkdirSync(path.join(r, d), { recursive: true }); writeFileSync(path.join(r, d, '.gitkeep'), ''); }
  if (bat) { mkdirSync(path.join(r, '.claude'), { recursive: true }); writeFileSync(path.join(r, '.claude', 'settings.json'), JSON.stringify({ enabledPlugins: { [bat]: true } }, null, 2) + '\n'); }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thử', '--allow-empty');
  return r;
}
const nap = (tep, o) => node(['--input-type=module', '-e', `await import(${JSON.stringify(pathToFileURL(tep).href)})`], o);

// ── ca: mỗi ca trả { ok, msg } ────────────────────────────────────────────────────────────────────────────────────────
const CA = {
  'BC-2'({ cai }) {
    const k = khoTieuThu({ cua: true });
    const a = nap(path.join(cai, 'scripts', 'tin-hieu.mjs'));
    if (a.status !== 0) return { ok: false, msg: `tín hiệu — nạp tin-hieu: ${lyDo(a)}` };
    const g = node([path.join(cai, 'scripts', 'gui-tin-hieu.mjs'), '--root', k, '--noi-dung', 'câu thử của bộ dựng'], { cwd: k });
    if (g.status !== 0) return { ok: false, msg: `tín hiệu — gui-tin-hieu: ${lyDo(g)}` };
    if (!/đã ghi/.test(g.stdout)) return { ok: false, msg: `tín hiệu — gui-tin-hieu không ghi: ${dongCuoi(g.stdout)}` };
    const r = node([path.join(cai, 'scripts', 'tin-hieu.mjs'), '--root', k, '--rang'], { cwd: k });
    if (r.status !== 0) return { ok: false, msg: `tín hiệu — --rang ${lyDo(r)}` };
    return { ok: true, msg: 'tín hiệu — bản cài lõi mới nạp tin-hieu, gui-tin-hieu ghi câu («đã ghi»), --rang thoát 0' };
  },
  'BC-3'({ cai }) {
    const t = readFileSync(path.join(cai, 'commands', 'acceptance-init.md'), 'utf8');
    const m = t.match(/<!-- <<<INIT-CI-COPY-LIST -->([\s\S]*?)<!-- INIT-CI-COPY-LIST>>> -->/);
    if (!m) return { ok: false, msg: 'chép CI — không thấy khối INIT-CI-COPY-LIST' };
    const muc = [...m[1].matchAll(/`\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)` → `([^`]+)`/g)].map(x => ({ nguon: x[1], dich: x[2] }));
    const vang = muc.filter(x => !existsSync(path.join(cai, x.nguon))).map(x => x.nguon);
    if (vang.length) return { ok: false, msg: `chép CI — mục vắng: ${vang.join(', ')}` };
    const k = khoTieuThu({ cua: true, loTrinh: true });
    for (const x of muc) { const d = path.join(k, x.dich, path.basename(x.nguon)); mkdirSync(path.dirname(d), { recursive: true }); cpSync(path.join(cai, x.nguon), d); }
    const a = nap(path.join(k, 'scripts', 'tin-hieu.mjs'));
    if (a.status !== 0) return { ok: false, msg: `chép CI — kho tiêu thụ: tin-hieu ${lyDo(a)}` };
    const c = node([path.join(k, 'lib', 'chan-lo-trinh.cjs'), '--root', k, '--khong-base'], { cwd: k });
    if (c.status !== 0) return { ok: false, msg: `chép CI — kho tiêu thụ: chan-lo-trinh ${lyDo(c)}` };
    return { ok: true, msg: `chép CI — ${muc.length}/${muc.length} mục giải được trong bản cài lõi mới; kho tiêu thụ nạp tin-hieu, chạy chan-lo-trinh` };
  },
  'BC-4'({ cai }) {
    const k = khoTieuThu();
    const r = node([path.join(cai, 'scripts', 'plugin-declare.mjs'), '--root', k, '--list']);
    if (r.status !== 0) return { ok: false, msg: `khai plugin — thoát ${r.status}: ${dongCuoi(r.stderr)}` };
    const can = [`acceptance-gate@${CHO_MOI}`, `feature-loop@${CHO_MOI}`, `diagram-design@${CHO_MOI}`, 'superpowers@claude-plugins-official'];
    const that = r.stdout.trim().split('\n');
    if (that.join(',') !== can.join(',')) return { ok: false, msg: `khai plugin — in: ${that.join(', ')}` };
    const w = node([path.join(cai, 'scripts', 'plugin-declare.mjs'), '--root', k, '--write']);
    const s = w.status === 0 ? JSON.parse(readFileSync(path.join(k, '.claude', 'settings.json'), 'utf8')) : null;
    const repo = s?.extraKnownMarketplaces?.[CHO_MOI]?.source?.repo;
    if (repo !== 'phanlemanh/delivery-loop') return { ok: false, msg: `khai plugin — nguồn chợ: ${repo ?? lyDo(w)}` };
    return { ok: true, msg: `khai plugin — ${can.join(', ')}; nguồn chợ ${repo}` };
  },
  async 'BC-5'({ cai }) {
    // Hai vế đo ĐỘC LẬP: khởi tạo (khai thử) và luật chặn — tệp lộ trình của kho thử do bộ ghi của cây đang kiểm sinh,
    // không do khởi tạo, nên vế luật chặn vẫn đo được khi vế khởi tạo gãy (chiều đỏ CD-5 ghim vế luật chặn).
    const k = khoTieuThu({ loTrinh: true, chan: true, bat: `roadmap@${CHO_MOI}` });
    const sai = [];
    const kt = node([path.join(cai, 'scripts', 'lo-trinh-khoi-tao.mjs'), '--root', k], { cwd: k });
    if (kt.status !== 0 || /chưa cài/.test(kt.stdout)) sai.push(`khởi tạo ${kt.status !== 0 ? lyDo(kt) : dongCuoi(kt.stdout)}`);
    const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
    mkdirSync(path.join(k, 'docs', 'plan'), { recursive: true });
    LT.ghiLoTrinh(path.join(k, 'docs', 'plan', 'lo-trinh.json'), { schema: 1, ten: 'Lộ trình thử', moc: [], hang: [{ ma: 'A1', cau_giao: 'Việc một' }], chan_troi: [], da_bac: [] });
    git(k, 'add', '-A'); git(k, 'commit', '-qm', 'lộ trình');
    const base = git(k, 'rev-parse', 'HEAD').trim();
    mkdirSync(path.join(k, '_acceptance', 'moi'), { recursive: true });
    writeFileSync(path.join(k, '_acceptance', 'moi', 'contract.md'), '---\nschema_version: 1\nslug: moi\nstatus: draft\napproved_by:\n---\n\n# moi\n');
    git(k, 'add', '-A'); git(k, 'commit', '-qm', 'hồ sơ mới');
    const c = node([path.join(cai, 'lib', 'chan-lo-trinh.cjs'), '--root', k, '--base', base], { cwd: k });
    if (!/VIOLATION \[moi\]/.test(c.stdout)) sai.push(`luật chặn tắt lặng (thoát ${c.status}: ${dongCuoi(c.stdout) || dongCuoi(c.stderr) || 'không in gì'})`);
    if (sai.length) return { ok: false, msg: `lộ trình — ${sai.join(' · ')}` };
    return { ok: true, msg: `lộ trình — khởi tạo nhận roadmap@${CHO_MOI}; luật chặn VIOLATION [moi]` };
  },
  'BC-6'({ kho }) {
    const m = tam('kho-kit');
    git(m, 'init', '-q', '-b', 'main');
    for (const rel of ['.claude-plugin/marketplace.json', 'plugins/acceptance-gate/.claude-plugin/plugin.json']) { mkdirSync(path.dirname(path.join(m, rel)), { recursive: true }); cpSync(path.join(kho, rel), path.join(m, rel)); }
    mkdirSync(path.join(m, '_acceptance'), { recursive: true }); writeFileSync(path.join(m, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
    git(m, 'add', '-A'); git(m, 'commit', '-qm', 'cắt số');
    mkdirSync(path.join(m, '_acceptance', 'vong-a'), { recursive: true });
    writeFileSync(path.join(m, '_acceptance', 'vong-a', 'contract.md'), '---\nschema_version: 1\nfeature: vòng a\nslug: vong-a\nrisk_tier: T2\nstatus: draft\napproved_by:\n---\n\n# vong-a\n');
    git(m, 'add', '-A'); git(m, 'commit', '-qm', 'vòng a');
    const r = node([path.join(kho, 'plugins', 'acceptance-gate', 'scripts', 'start-scan.mjs'), '--root', m]);
    let mo; try { mo = JSON.parse(r.stdout).metaOpen; } catch { return { ok: false, msg: `dò kho kit — start-scan ${lyDo(r)}` }; }
    if (!mo.applies || mo.n !== 1 || mo.slugs[0] !== 'vong-a') return { ok: false, msg: `dò kho kit — applies=${mo.applies} n=${mo.n}` };
    return { ok: true, msg: 'dò kho kit — kho mới: applies đúng, đếm 1 vòng meta (vong-a)' };
  },
  async 'BC-7'({ kho }) {
    // `script` = thư mục gói lõi chứa kiem-ban-cai.mjs; `goc` = kho git có manifest ở gốc (kiem-ban-cai đọc qua git show).
    const chon = async (script, goc) => {
      const K = await import(pathToFileURL(path.join(script, 'scripts', 'kiem-ban-cai.mjs')).href + `?v=${++seq}`);
      if (typeof K.goiMang !== 'function') return 'không có goiMang — chọn gói theo tên';
      const mf = K.docManifest(goc, 'HEAD');
      const cay = Object.fromEntries(mf.goi.map(g => [g.ten, K.cayCuaRef(goc, 'HEAD', g.nguon)]));
      return ['scripts/gate-card.js', 'workflows/acceptance-verify.js', 'scripts/dieu-phoi.mjs'].map(rel => K.goiMang(mf, cay, rel)).join(', ');
    };
    const loi = path.join(kho, 'plugins', 'acceptance-gate');
    const moi = await chon(loi, kho).catch(e => `lỗi ${e.message}`);
    if (moi !== 'acceptance-gate, feature-loop, dispatch') return { ok: false, msg: `kiểm bản cài — kho mới chọn ${moi}` };
    const cu = await chon(loi, KIT).catch(e => `lỗi ${e.message}`);
    if (cu !== 'acceptance-gate, feature-loop, dieu-phoi') return { ok: false, msg: `kiểm bản cài — bố cục cũ chọn ${cu}` };
    return { ok: true, msg: `kiểm bản cài — kho mới chọn ${moi}; bố cục cũ chọn ${cu}` };
  },
  // Ba script feature-loop chạy từ bản kéo, bộ đệm plugin rỗng. Xanh đòi ĐỦ: thoát 0 + đầu ra dương (JSON đọc được) cho
  // từng script ở CẢ HAI bố cục, và quan hệ gốc lõi = <kho mới>/plugins/acceptance-gate (mới) · = gốc kho (cũ) đọc từ chính
  // bộ giải mà ba script gọi. Ở bố cục mới cha của feature-loop không có lib/ của lõi và bộ đệm rỗng, nên thoát 0 chỉ có
  // thể qua bộ giải ấy. (S4 lượt 1: bản trước chỉ xét vắng chuỗi lỗi — script sập vì lỗi khác vẫn xanh.)
  async 'BC-8'({ kho }) {
    mkdirSync(path.join(kho, '_acceptance', 'x'), { recursive: true });
    writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
    writeFileSync(path.join(kho, '_acceptance', 'x', 'contract.md'), '---\nschema_version: 1\nslug: x\nstatus: draft\napproved_by:\n---\n\n# x\n');
    const HONG = /không tìm được bộ máy|không resolve được plugin acceptance-gate|không nạp được lib\/evidence-core\.cjs|thiếu nguồn/;
    const json = s => { try { return JSON.parse(s); } catch { return null; } };
    const ba = fl => [
      ['giu-tuoi', node([path.join(fl, 'giu-tuoi.mjs'), '--root', kho, '--tu', 'HEAD', '--json'], { cwd: kho }), r => json(r.stdout)],
      ['thuoc-vat', node([path.join(fl, 'thuoc-vat.mjs'), '--root', kho, '--slug', 'x', '--json'], { cwd: kho }), r => json(r.stdout)],
      ['carry-plan', node(['--input-type=module', '-e', `const m=await import(${JSON.stringify(pathToFileURL(path.join(fl, 'carry-plan.mjs')).href)});const k=m.plan({runLogText:'',evalsText:'evals: []\\n',contractText:'',deltaFiles:[],round:2});console.log(JSON.stringify(k))`], { cwd: kho }), r => json(r.stdout.trim().split('\n').pop())],
    ];
    const hong = (fl, nhan) => ba(fl).map(([ten, r, duong]) => {
      const loi = `${r.stderr}\n${r.stdout}`.split('\n').find(l => HONG.test(l));
      if (loi) return `${ten}${nhan} — ${loi.trim().slice(0, 160)}`;
      if (r.status !== 0) return `${ten}${nhan} — ${lyDo(r).slice(0, 160)}`;
      return duong(r) && typeof duong(r) === 'object' ? null : `${ten}${nhan} — thoát 0 mà đầu ra không phải JSON: ${dongCuoi(r.stdout).slice(0, 120)}`;
    }).filter(Boolean);
    const moi = hong(path.join(kho, 'plugins', 'feature-loop', 'scripts'), '');
    if (moi.length) return { ok: false, msg: moi.join(' · ') };
    const cu = hong(path.join(KIT, 'feature-loop', 'scripts'), ' (bố cục cũ)');
    if (cu.length) return { ok: false, msg: cu.join(' · ') };
    const goc = async (fl) => (await import(pathToFileURL(path.join(fl, 'goc-loi-tu-host.mjs')).href + `?v=${++seq}`)).gocLoiTuHost(fl, { can: ['lib/evidence-core.cjs'] });
    const gMoi = await goc(path.join(kho, 'plugins', 'feature-loop', 'scripts'));
    const gCu = await goc(path.join(KIT, 'feature-loop', 'scripts'));
    const can = { moi: realpathSync(path.join(kho, 'plugins', 'acceptance-gate')), cu: realpathSync(KIT) };
    if (!gMoi || realpathSync(gMoi) !== can.moi) return { ok: false, msg: `bộ giải gốc lõi — kho mới chọn ${gMoi}, cần ${can.moi}` };
    if (!gCu || realpathSync(gCu) !== can.cu) return { ok: false, msg: `bộ giải gốc lõi — bố cục cũ chọn ${gCu}, cần ${can.cu}` };
    return { ok: true, msg: 'feature-loop tự host — giu-tuoi, thuoc-vat, carry-plan dùng <kho mới>/plugins/acceptance-gate; bố cục cũ dùng gốc kho (bộ đệm rỗng; cả ba thoát 0, đầu ra JSON)' };
  },
  // Chiều đỏ của BC-8 trên CÙNG bộ dựng: bộ giải gốc lõi trả null (như trước vòng) → ca phải đỏ đúng thông điệp.
  async 'BC-8-do'(fx) {
    const lanh = await CA['BC-8'](fx);
    if (!lanh.ok) return { ok: false, msg: 'lần lành BC-8 chưa xanh — không tin chiều đỏ' };
    const kho = path.join(tam('kho-do'), 'kho'); cpSync(fx.kho, kho, { recursive: true });
    const p = path.join(kho, 'plugins', 'feature-loop', 'scripts', 'goc-loi-tu-host.mjs');
    const t = readFileSync(p, 'utf8'); const dau = 'export function gocLoiTuHost(tuThuMuc, { can = [] } = {}) {';
    if (t.split(dau).length !== 2) return { ok: false, msg: 'nhát phá không áp: goc-loi-tu-host.mjs' };
    writeFileSync(p, t.replace(dau, `${dau}\n  return null;`));
    const r = await CA['BC-8']({ ...fx, kho });
    return !r.ok && r.msg.includes('giu-tuoi — ') && r.msg.includes('không tìm được bộ máy acceptance-gate')
      ? { ok: true, msg: `bộ giải gốc lõi trả null → đỏ: ${r.msg.slice(0, 120)}` }
      : { ok: false, msg: `bộ giải gốc lõi trả null mà ca không đỏ đúng: ${r.msg.slice(0, 200)}` };
  },
  'BC-9'({ cai }) {
    const k = khoTieuThu({ cua: true });
    const t = node(['--input-type=module', '-e', `const m=await import(${JSON.stringify(pathToFileURL(path.join(cai, 'scripts', 'tin-hieu.mjs')).href)});const r=m.napTruc();if(!r||r.loi?.length)throw new Error('napTruc: '+JSON.stringify(r?.loi||r));`], { cwd: k });
    if (t.status !== 0) return { ok: false, msg: `skill đổi tên — tin-hieu napTruc: ${boMod(t.stderr) || (t.stderr.match(/Error: (.*)/) || [, dongCuoi(t.stderr)])[1]}` };
    const c = node(['-e', `const c=require(${JSON.stringify(path.join(cai, 'scripts', 'co-hop-dong.cjs'))});const k=c.napKhoang();if(!k||!Array.isArray(k.muc_tieu))throw new Error('napKhoang: khoảng rỗng');`]);
    if (c.status !== 0) return { ok: false, msg: `skill đổi tên — co-hop-dong napKhoang: ${boMod(c.stderr) || (c.stderr.match(/Error: (.*)/) || [, dongCuoi(c.stderr)])[1]}` };
    return { ok: true, msg: 'skill đổi tên (ngoài hợp đồng) — tin-hieu đọc trục, co-hop-dong đọc khoảng cỡ ở bản cài lõi mới' };
  },
  // Chiều đỏ của BC-9 trên CÙNG bản cài: bộ tìm skill trả đường cũ (như trước vòng) → hai bên đọc phải gãy đúng thông điệp.
  'BC-9-do'(fx) {
    const lanh = CA['BC-9'](fx);
    if (!lanh.ok) return { ok: false, msg: `lần lành BC-9 chưa xanh — không tin chiều đỏ` };
    const cai = path.join(tam('cai-do'), 'acceptance-gate'); cpSync(fx.cai, cai, { recursive: true });
    writeFileSync(path.join(cai, 'scripts', 'tim-skill.cjs'), "'use strict';\nmodule.exports = { timSkill: (goc, khoi, macDinh) => macDinh };\n");
    const r = CA['BC-9']({ ...fx, cai });
    return !r.ok && r.msg.includes('skill gom thiếu khối GOM-TRUC') ? { ok: true, msg: `bộ tìm skill trả đường cũ → đỏ: ${r.msg.slice(0, 120)}` }
      : { ok: false, msg: `bộ tìm skill trả đường cũ mà ca không đỏ đúng: ${r.msg}` };
  },
};
const THU_TU = ['BC-2', 'BC-3', 'BC-4', 'BC-5', 'BC-6', 'BC-7', 'BC-8', 'BC-8-do', 'BC-9', 'BC-9-do'];

async function chayHet(ref) {
  const fx = dung(ref);
  const kq = {};
  for (const id of THU_TU) {
    try { kq[id] = await CA[id](fx); } catch (e) { if (e instanceof HaTang) throw e; kq[id] = { ok: false, msg: `ném: ${String(e.message || e).split('\n')[0]}` }; }
  }
  return kq;
}

// ── chính ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const a = process.argv.slice(2);
const refArg = a.includes('--ref') ? a[a.indexOf('--ref') + 1] : null;
let pass = 0; let fail = 0;
const ok = (id, m) => { pass += 1; console.log(`  PASS: ${id} ${m}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} ${m}`); };
try {
  if (a.includes('--chieu-do')) {
    // Ghim chiều đỏ của từng ca trên bản gốc (trước vòng): một mảnh chữ phải có trong thông điệp đỏ.
    const GHIM = {
      'BC-2': ['ERR_MODULE_NOT_FOUND', 'hinh-dang.mjs'], 'BC-3': ['mục vắng', 'hinh-dang.mjs'], 'BC-4': ['không đọc được marketplace.json'],
      'BC-5': ['luật chặn tắt lặng'], 'BC-6': ['applies=false'], 'BC-7': ['không có goiMang'],
      'BC-8': ['giu-tuoi — ', 'không tìm được bộ máy acceptance-gate', 'thuoc-vat — ', 'carry-plan — '],
    };
    const lanh = await chayHet(null);
    const doLanh = Object.entries(lanh).filter(([id, r]) => id in GHIM && !r.ok);
    if (doLanh.length) {
      bad('CD-0', `lần lành trên cây đang kiểm đỏ: ${doLanh.map(([id, r]) => `${id} ${r.msg}`).join(' · ')}`);
      for (const id of Object.keys(GHIM)) bad(`CD-${id.slice(3)}`, 'lần lành chưa xanh trên cùng bộ dựng');
    } else {
      ok('CD-0', 'lần lành trên cây đang kiểm xanh');
      const goc = await chayHet(GOC_SHA);
      for (const [id, ghim] of Object.entries(GHIM)) {
        const r = goc[id]; const cd = `CD-${id.slice(3)}`;
        if (r.ok) bad(cd, `bản gốc không đỏ: ${r.msg}`);
        else if (ghim.every(g => r.msg.includes(g))) ok(cd, `bản gốc ${GOC_SHA} đỏ: ${r.msg}`);
        else bad(cd, `bản gốc đỏ nhưng sai thông điệp (cần ${ghim.join(' + ')}): ${r.msg}`);
      }
    }
    console.log(`goi-cheo chieu-do: ${pass} passed, ${fail} failed`);
  } else {
    const kq = await chayHet(refArg);
    for (const id of THU_TU) (kq[id].ok ? ok : bad)(id, kq[id].msg);
    console.log(`goi-cheo bo-cuc-moi: ${pass} passed, ${fail} failed`);
  }
} catch (e) {
  console.log(`HẠ TẦNG: ${String(e.message || e).split('\n')[0]}`);
  rmSync(TMP, { recursive: true, force: true });
  process.exit(3);
}
rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
