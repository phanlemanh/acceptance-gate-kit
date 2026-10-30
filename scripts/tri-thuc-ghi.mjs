#!/usr/bin/env node
// tri-thuc-ghi.mjs — bên ghi của kho tri thức (tầng tri thức theo LLM Wiki). Hồ sơ ghi-tri-thuc (TT2), thiết kế
// docs/superpowers/specs/2026-10-24-ghi-tri-thuc-design.md. Bên đọc scripts/tri-thuc.mjs giữ chỉ-đọc; tệp này nạp nó.
//
// Khuôn một nguồn: skills/acceptance/references/tri-thuc-template.md — khối TRI-THUC-RAW (nguon.md), -RAW-DONG (dòng tệp),
// -TRANG (frontmatter trang), -LOAI (loại trang), -NGUON (năm loại nguồn), -LUAT (TRI-THUC.md) rút LÚC CHẠY.
//
//   node scripts/tri-thuc-ghi.mjs --root . --loai <loại nguồn> --goc '<gốc>' --ten <tên> --tep <tệp> [--tep …]
//     --trang <loại trang>/<tên>.md [--than <tệp>] [--ma A1,A2] [--ai <tên>] [--luc YYYY-MM-DD] [--khong-commit]
//   0 đã ghi hay dùng lại · 2 đầu vào sai, không chạy được, commit hỏng (đã hoàn lại) · 3 không đọc được ở đây ·
//   4 câu hỏi khó-đảo cho người (riêng tư). Mã khác 0: không tệp nào đổi — mọi kiểm chạy TRƯỚC byte đầu tiên.
import { readFileSync, writeFileSync, existsSync, statSync, realpathSync, mkdirSync, copyFileSync, readdirSync, rmSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { napKhuon, khoi, TEP_KHUON, docCauHinh, giaiGoc, dongKhongDoc, bamTep } from './tri-thuc.mjs';

const __filename = fileURLToPath(import.meta.url);
const git = (cwd, a) => spawnSync('git', ['-C', cwd, ...a], { encoding: 'utf8' });
const that = p => { try { return realpathSync(p); } catch { return path.resolve(p); } };
const trong = (cha, con) => { const r = path.relative(that(cha), that(con)); return r === '' || (!r.startsWith('..') && !path.isAbsolute(r)); };

export function napGhi(tep = TEP_KHUON) {
  const t = readFileSync(tep, 'utf8');
  const nguon = new Map();
  for (const l of khoi(t, 'TRI-THUC-NGUON').split('\n')) { const m = l.trim().match(/^(\S+)\s+(\S+)$/); if (m) nguon.set(m[1], m[2]); }
  return { ...napKhuon(tep), raw: khoi(t, 'TRI-THUC-RAW'), trang: khoi(t, 'TRI-THUC-TRANG'), luat: khoi(t, 'TRI-THUC-LUAT'), nguon };
}

const LUAT_NGUON = {
  'goc-khong-rong': ({ goc }) => (goc.trim() ? null : 'gốc rỗng — cần mã phiên hay đường bản ghi phiên'),
  'goc-https': ({ goc }) => (/^https:\/\/\S+$/.test(goc) ? null : `gốc phải mở đầu https:// — nhận: ${goc}`),
  'goc-url-hoac-issue': ({ goc }) => (/^https:\/\/\S+$/.test(goc) || /^[\w.-]+\/[\w.-]+#\d+$/.test(goc) ? null : `gốc phải là URL https:// hay <chủ>/<kho>#<số> — nhận: ${goc}`),
  'tep-ngoai-kho': ({ root, tep }) => { const p = tep.find(x => trong(root, x)); return p ? `${p} nằm trong kho tiêu thụ — dùng tep-kho` : null; },
  'tep-trong-kho': ({ root, tep }) => {
    for (const x of tep) {
      if (!trong(root, x)) return `${x} nằm ngoài kho tiêu thụ — dùng tep-may`;
      const r = path.relative(that(root), that(x));
      if (git(root, ['ls-files', '--error-unmatch', '--', r]).status !== 0) return `${x} không được git theo dõi trong kho tiêu thụ`;
    }
    return null;
  },
};

const GITHUB = [/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/, /^git@github\.com:([\w.-]+)\/([\w.-]+?)(?:\.git)?$/, /^ssh:\/\/git@github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/];
export function tachGithub(remote) {
  for (const re of GITHUB) { const m = String(remote || '').trim().match(re); if (m) return `${m[1]}/${m[2]}`; }
  return null;
}

// Kiểm riêng tư của nơi giữ raw: → { thoat: 4, ra } | { canhBao } | null.
function kiemRiengTu(khoGit, remoteKhai) {
  let remote = remoteKhai;
  if (!remote) { const r = git(khoGit, ['remote', 'get-url', 'origin']); remote = r.status === 0 ? r.stdout.trim() : ''; }
  if (!remote) return null;
  const ten = tachGithub(remote);
  if (!ten) return { canhBao: `remote không phải GitHub — không kiểm được riêng tư: ${remote}` };
  const g = spawnSync('gh', ['repo', 'view', ten, '--json', 'visibility', '-q', '.visibility'], { encoding: 'utf8' });
  if (g.error || g.status !== 0) {
    const lyDo = g.error ? g.error.message : (g.stderr || '').trim().split('\n')[0] || `gh thoát ${g.status}`;
    return { thoat: 4, ra: [`không kiểm được nơi giữ raw có riêng tư không — ${lyDo}`, `kiểm ${ten} bằng gh (đăng nhập, mạng) rồi chạy lại; không ghi tệp nào.`] };
  }
  if (g.stdout.trim().toUpperCase() === 'PUBLIC') return { thoat: 4, ra: [`nơi giữ raw đang công khai trên GitHub: ${ten}`, 'đặt kho ấy về riêng tư rồi chạy lại; không ghi tệp nào.'] };
  return null;
}

function tachFrontmatter(txt) {
  const dong = String(txt).replace(/\r\n?/g, '\n').split('\n');
  if (dong[0] !== '---') return null;
  const het = dong.indexOf('---', 1);
  if (het < 0) return null;
  return { fm: dong.slice(1, het), than: dong.slice(het + 1).join('\n') };
}
const danhSach = v => { const t = String(v ?? '').trim(); return t.startsWith('[') && t.endsWith(']') ? t.slice(1, -1).split(',').map(x => x.trim()).filter(Boolean) : []; };
const hop = (a, b) => [...a, ...b.filter(x => !a.includes(x))];
const datGiaTri = (dong, khoa, giaTri) => dong.map(l => (l.startsWith(`${khoa}:`) ? `${khoa}: ${giaTri}` : l));

function dungNguonMd(k, { loai, goc, luc, ai, tep }) {
  const dong = k.raw.split('\n');
  const mau = dong.find(l => k.rawDong.test(l));
  const m = mau.match(k.rawDong);
  const dongTep = tep.map(({ ten, bam }) => mau.replace(m[1], ten).replace(m[2], bam));
  const ra = [];
  let daChen = false;
  for (const l of dong) {
    if (k.rawDong.test(l)) { if (!daChen) { ra.push(...dongTep); daChen = true; } continue; }
    const f = l.match(/^(loai|goc|luc|ai):/);
    ra.push(f ? `${f[1]}: ${{ loai, goc, luc, ai }[f[1]]}` : l);
  }
  return ra.join('\n') + '\n';
}

function dungTrang(k, cu, { loaiTrang, ma, nguon, luc, than }) {
  const K = k.khoa;
  if (cu) {
    const t = tachFrontmatter(cu);
    let fm = t.fm;
    const lay = khoa => (fm.find(l => l.startsWith(`${khoa}:`)) || '').slice(khoa.length + 1);
    fm = datGiaTri(fm, K.ma, `[${hop(danhSach(lay(K.ma)), ma).join(', ')}]`);
    fm = datGiaTri(fm, K.nguon, `[${hop(danhSach(lay(K.nguon)), nguon).join(', ')}]`);
    fm = datGiaTri(fm, K.capNhat, luc);
    return ['---', ...fm, '---'].join('\n') + '\n' + (than ?? t.than);
  }
  const fm = tachFrontmatter(k.trang).fm;
  let ra = datGiaTri(fm, K.loai, loaiTrang);
  ra = datGiaTri(ra, K.ma, `[${ma.join(', ')}]`);
  ra = datGiaTri(ra, K.nguon, `[${nguon.join(', ')}]`);
  ra = datGiaTri(ra, K.capNhat, luc);
  return ['---', ...ra, '---'].join('\n') + '\n' + than;
}

const homNay = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const sai = l => ({ thoat: 2, loiChay: [l] });

export function ghi({ root, loai, goc = '', ten, tep = [], trang, than: tepThan = null, ma = [], ai = null, luc = null, khongCommit = false, k = napGhi() }) {
  const cfg = docCauHinh(root);
  if (!cfg) return sai('kho chưa khai tri_thuc trong _acceptance/config.yaml');
  if (cfg.loi.length) return { thoat: 2, loiChay: cfg.loi };
  if (!ten || !/^[a-z0-9][a-z0-9-]*$/.test(ten)) return sai(`--ten phải là chữ thường, số và gạch ngang: ${ten ?? '(vắng)'}`);
  if (!trang) return sai('--trang thiếu: cần <loại trang>/<tên>.md');
  if (path.isAbsolute(trang) || trang.split('/').includes('..')) return sai(`--trang không được thoát khỏi wiki/ (.. hay đường tuyệt đối): ${trang}`);
  if (!trang.endsWith('.md')) return sai(`--trang phải kết thúc .md: ${trang}`);
  const loaiTrang = trang.split('/')[0];
  if (!k.loai.includes(loaiTrang) || !trang.includes('/')) return sai(`--trang: loại trang ${loaiTrang} không thuộc: ${k.loai.join(' ')}`);
  if (!tep.length) return sai('--tep thiếu: cần ít nhất một tệp nguồn');
  const tepTuyet = tep.map(t => path.resolve(root, t));
  for (const [i, t] of tepTuyet.entries()) if (!existsSync(t) || !statSync(t).isFile()) return sai(`--tep không có trên đĩa: ${tep[i]}`);
  const tenTep = tepTuyet.map(t => path.basename(t));
  const trung = tenTep.find((t, i) => tenTep.indexOf(t) !== i || t === 'nguon.md');
  if (trung) return sai(`--tep trùng tên tệp hay trùng nguon.md: ${trung}`);
  if (/[\n\r]/.test(goc)) return sai('--goc không được nhiều dòng');
  luc = luc || homNay();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(luc)) return sai(`--luc phải là YYYY-MM-DD: ${luc}`);
  if (ma.some(x => !/^[A-Za-z0-9._-]+$/.test(x))) return sai(`--ma chỉ nhận mã chữ, số, chấm, gạch: ${ma.join(',')}`);
  if (!k.nguon.has(loai)) return sai(`loại nguồn lạ: ${loai ?? '(vắng)'} — nhận: ${[...k.nguon.keys()].join(' ')}`);

  const { goc: gocTT, trongKho } = giaiGoc(root, cfg);
  if (!trongKho && !existsSync(gocTT)) return { thoat: 3, ra: [dongKhongDoc(cfg) + gocTT] };
  const khoGit = trongKho ? root : gocTT;
  const top = git(khoGit, ['rev-parse', '--show-toplevel']);
  if (top.status !== 0) return sai(trongKho ? 'kho tiêu thụ không phải kho git' : `kho riêng không phải kho git: ${gocTT}`);
  if (!trongKho && that(top.stdout.trim()) !== that(gocTT)) return sai(`kho riêng không phải kho git: ${gocTT}`);

  const luatNguon = LUAT_NGUON[k.nguon.get(loai)];
  if (!luatNguon) return sai(`khuôn tri thức: luật ${k.nguon.get(loai)} của loại ${loai} không có bên ghi`);
  const loiNguon = luatNguon({ root, goc, tep: tepTuyet });
  if (loiNguon) return sai(`loại ${loai}: ${loiNguon}`);
  if (!goc.trim()) goc = tep.join(', ');

  if (cfg.congKhai && trongKho) return { thoat: 4, ra: [
    'kho công khai chưa có kho riêng — raw đẩy lên kho công khai không thu hồi được.',
    'hai lối: tạo kho riêng rồi khai tri_thuc.kho (khuyến nghị) · bỏ cong_khai nếu kho thật sự không công khai.',
    'không ghi tệp nào.'] };
  const canhBao = [...cfg.canhBao];
  const rt = kiemRiengTu(khoGit, trongKho ? null : cfg.kho.remote);
  if (rt && rt.thoat) return { ...rt, canhBao };
  if (rt && rt.canhBao) canhBao.push(rt.canhBao);

  const tenRaw = `${luc}-${ten}`;
  const dRaw = path.join(gocTT, 'raw', tenRaw);
  const tepRaw = tepTuyet.map((t, i) => ({ nguon: t, ten: tenTep[i], bam: bamTep(t) }));
  let dungLai = false;
  if (existsSync(dRaw)) {
    const coSan = readdirSync(dRaw).filter(x => x !== 'nguon.md').sort();
    const khop = coSan.length === tepRaw.length && tepRaw.every(t => coSan.includes(t.ten) && statSync(path.join(dRaw, t.ten)).isFile() && bamTep(path.join(dRaw, t.ten)) === t.bam);
    if (!khop) return sai(`raw bất biến: raw/${tenRaw} đã có nội dung khác — nguồn mới là thư mục mới`);
    dungLai = true;
  }
  const pTrang = path.join(gocTT, 'wiki', trang);
  const cu = existsSync(pTrang) ? readFileSync(pTrang, 'utf8') : null;
  if (cu && !tachFrontmatter(cu)) return sai(`trang ${trang} có frontmatter sai khuôn — sửa tay rồi chạy lại`);
  if (!cu && !tepThan) return sai('--than thiếu: trang mới cần thân');
  if (tepThan && !existsSync(path.resolve(root, tepThan))) return sai(`--than không có trên đĩa: ${tepThan}`);
  const than = tepThan ? readFileSync(path.resolve(root, tepThan), 'utf8') : null;
  const nguonRel = tepRaw.map(t => `raw/${tenRaw}/${t.ten}`);
  const moiTrang = dungTrang(k, cu, { loaiTrang, ma, nguon: nguonRel, luc, than });
  const pLuat = path.join(gocTT, 'TRI-THUC.md');
  const taoLuat = !existsSync(pLuat);
  const tenKho = cfg.kho ? cfg.kho.ten : path.basename(that(root));
  ai = ai || git(root, ['config', 'user.name']).stdout.trim() || 'không rõ';

  const hoanLai = () => {
    if (!dungLai) rmSync(dRaw, { recursive: true, force: true });
    if (cu === null) { if (existsSync(pTrang)) unlinkSync(pTrang); } else writeFileSync(pTrang, cu);
    if (taoLuat && existsSync(pLuat)) unlinkSync(pLuat);
  };
  if (!dungLai) {
    mkdirSync(dRaw, { recursive: true });
    for (const t of tepRaw) copyFileSync(t.nguon, path.join(dRaw, t.ten));
    writeFileSync(path.join(dRaw, 'nguon.md'), dungNguonMd(k, { loai, goc, luc, ai, tep: tepRaw }));
  }
  mkdirSync(path.dirname(pTrang), { recursive: true });
  writeFileSync(pTrang, moiTrang);
  if (taoLuat) writeFileSync(pLuat, k.luat.replaceAll('<kho>', tenKho) + '\n');

  const ra = [];
  if (dungLai) ra.push(`dùng lại raw: raw/${tenRaw}`);
  const tienTo = cfg.kho ? `${cfg.kho.ten}:` : '';
  for (const t of tepRaw) ra.push(`raw: ${tienTo}raw/${tenRaw}/${t.ten}#${t.bam}`);
  ra.push(`trang: ${tienTo}wiki/${trang}#${bamTep(pTrang)}`);
  if (khongCommit) return { thoat: 0, ra, canhBao };

  const gocRepo = that(top.stdout.trim());
  const rel = p => path.relative(gocRepo, that(p));
  const duong = [rel(dRaw), rel(pTrang), ...(taoLuat ? [rel(pLuat)] : [])];
  const tt = git(gocRepo, ['status', '--porcelain', '--', ...duong]);
  if (!tt.stdout.trim()) { ra.push('không có gì mới để commit'); return { thoat: 0, ra, canhBao }; }
  const add = git(gocRepo, ['add', '--', ...duong]);
  const cm = add.status === 0 ? git(gocRepo, ['commit', '-q', '-m', `tri-thuc: ghi ${ten} (${loai})`, '--', ...duong]) : add;
  if (cm.status !== 0) {
    git(gocRepo, ['reset', '-q', '--', ...duong]);
    hoanLai();
    return { thoat: 2, loiChay: [`commit hỏng — đã hoàn lại các tệp vừa ghi: ${(cm.stderr || cm.stdout).trim()}`], canhBao };
  }
  ra.push(`commit: ${git(gocRepo, ['rev-parse', 'HEAD']).stdout.trim()}`);
  return { thoat: 0, ra, canhBao };
}

const isMain = (() => { try { return realpathSync(process.argv[1]) === realpathSync(__filename); } catch { return false; } })();
if (isMain) {
  const a = process.argv.slice(2);
  const lay = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  const nhieu = k => a.flatMap((x, i) => (x === k && i + 1 < a.length ? [a[i + 1]] : []));
  const root = path.resolve(lay('--root') || '.');
  let kq;
  try {
    kq = ghi({ root, loai: lay('--loai'), goc: lay('--goc') || '', ten: lay('--ten'), tep: nhieu('--tep'), trang: lay('--trang'),
      than: lay('--than'), ma: (lay('--ma') || '').split(',').map(x => x.trim()).filter(Boolean), ai: lay('--ai'), luc: lay('--luc'),
      khongCommit: a.includes('--khong-commit') });
  } catch (e) { kq = { thoat: 2, loiChay: [e.message] }; }
  for (const c of kq.canhBao || []) process.stdout.write(`cảnh báo: ${c}\n`);
  for (const d of kq.ra || []) process.stdout.write(d + '\n');
  for (const l of kq.loiChay || []) process.stderr.write(`tri-thuc-ghi: ${l}\n`);
  process.exit(kq.thoat);
}
