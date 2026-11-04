#!/usr/bin/env node
// design-floor-khuon.mjs — lệnh khuôn (hồ sơ khuon-loi, hàng KH1): bọc bộ đọc `ban-do-khuon.cjs` thành các nấc của
// vòng. Kho không có `design/patterns/` → mọi nấc im, thoát 0, không ghi tệp (AC-8).
//
//   --dem                                  S0: «khuôn: N nhóm (M màn · K phần tử)»
//   --tao <nhóm>                           sinh design/patterns/<nhóm>.md từ khối BAN-DO-KHUON-TEMPLATE
//   --nap --slug <s>                       S1: ghim băm từng tệp bản đồ vào _acceptance/<s>/khuon-nap.json + chỉ mục
//     [--nhom <n>]                         …và ghi lựa chọn `chon` (nhóm, tệp bản đồ, màn mẫu + băm git lúc đọc)
//     [--nhom-moi <tên> [--gan <n>]]       …màn không vào nhóm nào: ghi `chon.moi`, in dòng sổ câu hỏi chỉ-người (KH2)
//   --goi-y-eval --nhom <n>                khối eval khuôn, paths theo đúng nhóm n
//   --kiem [--base <ref>]                  bước chấm (eval S4, chỉ đọc)
//   --kiem --write --slug <s> --den <sha>  sau lượt chấm: ghi _acceptance/<s>/khuon-cham.json
//
// Thoát: 0 · 1 có lệch mới hay bản đồ sai lược đồ · 2 gọi sai.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { timBase } from './design-floor-s4.mjs';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const B = require('./ban-do-khuon.cjs');
const { pathGlobToRe, resolveConfigList } = require('../lib/evidence-core.cjs');
const TEMPLATE = path.join(HERE, '..', 'skills', 'acceptance', 'references', 'ban-do-khuon-template.md');

function git(root, ...a) { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }); }
function sai(msg) { process.stderr.write(`design-floor-khuon: ${msg}\n`); process.exit(2); }

// khoiMarker(ten) — nội dung khối ```…``` giữa hai marker trong tệp khuôn.
function khoiMarker(ten) {
  const t = fs.readFileSync(TEMPLATE, 'utf8');
  const m = new RegExp(`<<<${ten} -->\\s*\`\`\`[a-z]*\\n([\\s\\S]*?)\\n\`\`\`\\s*<!-- ${ten}>>>`).exec(t);
  if (!m) throw new Error(`khuôn thiếu khối ${ten}`);
  return m[1];
}

export function dem(bd) {
  const phanTu = bd.nhom.filter(n => n.don_vi === 'phan-tu').length;
  return `khuôn: ${bd.nhom.length} nhóm (${bd.nhom.length - phanTu} màn · ${phanTu} phần tử)`;
}

export function dongChiMuc(n) {
  return [n.nhom, n.doi_tuong || '—', `nhận việc: ${n.nhan_viec || '—'}`, `dùng khi: ${n.dung_khi || '—'}`, n.tep, `màn mẫu: ${n.mau_dang_chay.tep || '—'}`].join(' · ');
}

// Băm git của một tệp kho — null khi không có trên đĩa. Đường đi như MỘT đối số (không qua shell): dấu cách, chữ Việt.
function bamTep(root, rel) {
  if (!rel || !fs.existsSync(path.join(root, rel))) return null;
  return git(root, 'hash-object', '--', rel).trim();
}

// Lối khác cố định khi màn mới không có nhóm gần: câu hỏi luôn có hai lối sống (KH2 AC-2).
export const LOI_NGOAI_BAN_DO = 'để màn ngoài bản đồ — bước chấm đếm nó vào tệp giao diện ngoài bản đồ';
// dongCauHoiMoi(moi, gan) — dòng GIỮA của khối DEC-ID-RECIPE (JSON không ngoặc): câu hỏi chỉ-người cho màn mới, lên thẻ
// Cổng Phạm vi thành một Hỏi-n sẵn có — không nhãn mới trong câu duyệt.
export function dongCauHoiMoi(moi, gan) {
  const o = {
    type: 'approach', stage: 'S1', at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    decision: `Màn mới «${moi}» không vào nhóm khuôn nào: tạo nhóm ${moi}, hay ${gan ? `xếp vào nhóm ${gan}` : 'để ngoài bản đồ'}?`,
    why: 'Bước thiết kế không thấy nhóm nào của bản đồ khuôn nhận màn này; xếp một màn thật sự mới vào nhóm là việc của người, một lần mỗi nhóm.',
    cost_if_wrong: 'Xếp sai thì màn mới bị chấm theo khuôn không hợp, hoặc bản đồ thiếu nhóm và màn lọt khỏi bước chấm.',
    can_cu: { nguon: 'chi-nguoi', kho_dao: false, khuyen: `tạo nhóm ${moi} (lệnh --tao ${moi}), điền từ màn mới`, loi_khac: gan ? `xếp vào ${gan}` : LOI_NGOAI_BAN_DO },
  };
  return JSON.stringify(o).slice(1, -1);
}

export function nap(root, slug, bd, chon) {
  const ghim = {};
  const tep = {};
  for (const n of bd.nhom) {
    if (!n.nhom) continue;
    ghim[n.nhom] = git(root, 'hash-object', n.tep).trim();
    tep[n.nhom] = n.tep;
  }
  const ra = { schema: 1, ghim, tep };
  const dong = bd.nhom.map(dongChiMuc);
  if (chon && chon.nhom) {
    const n = bd.nhom.find(x => x.nhom === chon.nhom);
    const mau = (n.mau_dang_chay && n.mau_dang_chay.tep) || null;
    ra.chon = { nhom: n.nhom, tep: n.tep, mau: { tep: mau, bam: bamTep(root, mau) } };
    if (ra.chon.mau.bam === null) dong.push(`màn mẫu không có trên đĩa: ${mau || '—'}`);
  } else if (chon && chon.moi) {
    ra.chon = { moi: chon.moi, ...(chon.gan ? { gan: chon.gan } : {}) };
    dong.push(dongCauHoiMoi(chon.moi, chon.gan || null));
  }
  const dich = path.join(root, '_acceptance', slug, 'khuon-nap.json');
  fs.mkdirSync(path.dirname(dich), { recursive: true });
  fs.writeFileSync(dich, JSON.stringify(ra, null, 2) + '\n');
  return dong;
}

export function goiYEval(n) {
  const paths = [n.tep, ...(n.nhan_dien || [])];
  return [
    '  - id: E<số>',
    '    criterion: AC-<số>',
    '    executor: script',
    '    cmd: config:executors.design.khuon',
    `    paths: [${paths.map(p => JSON.stringify(p)).join(', ')}]`,
    `    expected: "exit 0; bước chấm khuôn không in dòng «lệch:» nào cho tệp thuộc nhóm ${n.nhom}"`,
    '    evidence_required: [run_id, exit_code, verifier, verified_at, output]',
  ].join('\n');
}

// ── Bước chấm ────────────────────────────────────────────────────────────────────────────────────────────────
const tachZ = s => s.split('\0').filter(Boolean);
function tepVong(root, base) {
  const ds = [
    ...tachZ(git(root, 'diff', '--name-only', '-z', `${base}...HEAD`)),
    ...tachZ(git(root, 'diff', '--name-only', '-z', 'HEAD')),
    ...tachZ(git(root, 'ls-files', '-o', '--exclude-standard', '-z')),
  ];
  return [...new Set(ds)];
}
function banBase(root, base, tep) {
  try { return git(root, 'show', `${base}:${tep}`); } catch (_) { return null; }
}
// Hồ sơ của vòng = hồ sơ DUY NHẤT có khuon-nap.json trong diff; nhiều hơn một → không ghim, nói ra.
function timGhim(root, ds) {
  const nap = ds.filter(f => /^_acceptance\/[^/]+\/khuon-nap\.json$/.test(f) && fs.existsSync(path.join(root, f)));
  if (nap.length !== 1) return { ghim: null, dong: nap.length > 1 ? `nhiều hồ sơ có khuon-nap.json trong diff (${nap.join(', ')}) — chấm theo bản cây` : null };
  try { return { ghim: JSON.parse(fs.readFileSync(path.join(root, nap[0]), 'utf8')).ghim || null, dong: null }; }
  catch (_) { return { ghim: null, dong: `${nap[0]} không đọc được — chấm theo bản cây` }; }
}

// chamKho(root, base) → kết quả bước chấm; null khi kho không có design/patterns/.
export function chamKho(root, base) {
  if (!B.docThuMuc(root).co_thu_muc) return null;
  const ds = tepVong(root, base);
  const g = timGhim(root, ds);
  const banDo = B.docThuMuc(root, { ghim: g.ghim || {} });
  const cfgP = path.join(root, '_acceptance', 'config.yaml');
  const giaoDien = resolveConfigList(fs.existsSync(cfgP) ? fs.readFileSync(cfgP, 'utf8') : '', 'design.surface_globs').filter(Boolean).map(pathGlobToRe);
  const ra = { theo_khuon: [], lech_moi: [], no_cu: [], khong_do: [], ngoai_ban_do: 0, sai: banDo.sai, doi_sau_ghim: banDo.doi_sau_ghim, ghi_chu: g.dong ? [g.dong] : [], nhom: banDo.nhom.map(n => n.nhom) };
  for (const n of banDo.nhom) if (n.khong_doc_duoc) ra.khong_do.push(`nhóm ${n.nhom} — ${n.khong_doc_duoc}`);
  for (const f of ds) {
    if (f.startsWith('_acceptance/') || !fs.existsSync(path.join(root, f))) continue;
    const nhomTep = B.nhomCuaTep(banDo, f);   // tệp khai rời nhóm (ngoai_le không khoi) không thuộc nhóm ấy
    const man = nhomTep.filter(n => n.don_vi === 'man');
    if (!man.length && giaoDien.some(re => re.test(f))) ra.ngoai_ban_do++;
    if (!nhomTep.length) continue;
    const noi = fs.readFileSync(path.join(root, f), 'utf8');
    const noiBase = banBase(root, base, f);
    let co = false;   // tệp có lệch mới, nợ cũ hay chỗ không đo được → không đếm «theo khuôn»
    if (man.length >= 2) {
      const x = { tep: f, khoi: 'hai nhóm màn', loai: 'quan-he', nhom: man.map(n => n.nhom).join(', '), so: 1 };
      if (noiBase === null) ra.lech_moi.push({ ...x, tu: 0, den_so: 1 }); else ra.no_cu.push(x);
      co = true;
    }
    const kiemNhom = man.length >= 2 ? nhomTep.filter(n => n.don_vi === 'phan-tu') : nhomTep;
    for (const n of kiemNhom) {
      const moi = B.lechTrongTep(n, f, noi);
      const cu = noiBase === null ? { lech: [] } : B.lechTrongTep(n, f, noiBase);
      for (const k of moi.khong_do) { const d = `${f} — ${k}`; if (!ra.khong_do.includes(d)) ra.khong_do.push(d); co = true; }
      for (const x of moi.lech) {
        const c = cu.lech.find(y => y.loai === x.loai && y.khoi === x.khoi);
        const coNgoaiLe = n.ngoai_le.some(e => e.tep === f && e.khoi === x.khoi && e.ly_do);
        const loaiTru = (coNgoaiLe || Boolean(c && x.so <= c.so));
        if (loaiTru) { if (!coNgoaiLe) { ra.no_cu.push({ ...x, nhom: n.nhom }); co = true; } continue; }
        ra.lech_moi.push({ ...x, nhom: n.nhom, tu: c ? c.so : 0, den_so: x.so });
        co = true;
      }
    }
    if (!co) ra.theo_khuon.push(f);
  }
  return ra;
}

// Một nguồn với thẻ Cổng Bằng chứng (KH2): chuỗi sống ở bộ đọc.
export const dongLech = B.dongLech;
export function inCham(ra) {
  return [
    ...ra.sai.map(s => `sai: ${s}`),
    ...ra.doi_sau_ghim.map(n => `bản đồ nhóm ${n} đổi sau khi ghim — chấm theo bản ghim`),
    ...ra.ghi_chu,
    ...ra.lech_moi.map(dongLech),
    ...ra.no_cu.map(x => (x.loai === 'quan-he' ? `nợ cũ: ${x.tep} · thuộc hai nhóm màn: ${x.nhom}` : `nợ cũ: ${x.tep} · ${x.loai === 'khuon' ? `khuôn ${x.khoi}` : x.khoi}`)),
    ...ra.khong_do.map(k => `không đo được: ${k}`),
    ...(ra.ngoai_ban_do ? [`${ra.ngoai_ban_do} tệp giao diện ngoài bản đồ`] : []),
  ];
}

function docCo(argv) {
  const co = {};
  const BOOL = new Set(['dem', 'nap', 'goi-y-eval', 'kiem', 'write']);
  const GIA = new Set(['root', 'tao', 'slug', 'nhom', 'nhom-moi', 'gan', 'base', 'den']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) sai(`đối số lạ: ${a}`);
    const k = a.slice(2);
    if (BOOL.has(k)) co[k] = true;
    else if (GIA.has(k)) { const v = argv[++i]; if (v == null || v.startsWith('--')) sai(`--${k} thiếu giá trị`); co[k] = v; }
    else sai(`cờ lạ: ${a}`);
  }
  return co;
}

function main() {
  const co = docCo(process.argv.slice(2));
  const root = path.resolve(co.root || '.');
  const nac = ['dem', 'tao', 'nap', 'goi-y-eval', 'kiem'].filter(k => co[k]);
  if (nac.length !== 1) sai('cần đúng một trong --dem · --tao <nhóm> · --nap · --goi-y-eval · --kiem');
  if (co.tao) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(co.tao)) sai(`tên nhóm không hợp lệ: ${co.tao} (chữ thường, số, gạch nối)`);
    const dich = path.join(root, B.THU_MUC, `${co.tao}.md`);
    if (fs.existsSync(dich)) sai(`đã có ${path.relative(root, dich)} — không ghi đè`);
    fs.mkdirSync(path.dirname(dich), { recursive: true });
    fs.writeFileSync(dich, khoiMarker('BAN-DO-KHUON-TEMPLATE').replaceAll('<nhom>', co.tao) + '\n');
    process.stdout.write(`đã sinh ${path.relative(root, dich)} từ khuôn\n`);
    return 0;
  }
  if (co.nap && !co.slug) sai('--nap cần --slug <hồ sơ>');
  if (co['nhom-moi'] || co.gan) {
    if (!co.nap) sai('--nhom-moi và --gan chỉ đi với --nap');
    if (co.nhom) sai('--nhom và --nhom-moi loại trừ nhau');
    if (!co['nhom-moi']) sai('--gan chỉ đi với --nhom-moi');
    if (!/^[a-z0-9][a-z0-9-]*$/.test(co['nhom-moi'])) sai(`tên nhóm mới không hợp lệ: ${co['nhom-moi']} (chữ thường, số, gạch nối)`);
  }
  if (co['goi-y-eval'] && !co.nhom) sai('--goi-y-eval cần --nhom <nhóm>');
  if (co.write && !(co.kiem && co.slug && co.den)) sai('--write chỉ đi với --kiem --slug <s> --den <sha>');
  const bd = B.docThuMuc(root);
  if (!bd.co_thu_muc) return 0;
  if (co.dem) { process.stdout.write(dem(bd) + '\n'); return 0; }
  if (co.nap) {
    const ten = bd.nhom.map(x => x.nhom);
    if (co.nhom && !ten.includes(co.nhom)) sai(`không có nhóm ${co.nhom} (có: ${ten.join(', ')})`);
    if (co.gan && !ten.includes(co.gan)) sai(`không có nhóm ${co.gan} (có: ${ten.join(', ')})`);
    if (co['nhom-moi'] && ten.includes(co['nhom-moi'])) sai(`đã có nhóm ${co['nhom-moi']} — chọn bằng --nhom`);
    const chon = co.nhom ? { nhom: co.nhom } : co['nhom-moi'] ? { moi: co['nhom-moi'], gan: co.gan } : undefined;
    process.stdout.write(nap(root, co.slug, bd, chon).join('\n') + '\n');
    return 0;
  }
  if (co['goi-y-eval']) {
    const n = bd.nhom.find(x => x.nhom === co.nhom);
    if (!n) sai(`không có nhóm ${co.nhom} (có: ${bd.nhom.map(x => x.nhom).join(', ')})`);
    process.stdout.write(goiYEval(n) + '\n');
    return 0;
  }
  let base = co.base;
  if (base) { try { base = git(root, 'rev-parse', base).trim(); } catch (_) { sai(`--base không giải được: ${co.base}`); } }
  else { try { base = timBase(root); } catch (e) { sai(e.message); } }
  if (co.write) {
    // Số đo phải là của den: bước chấm đọc HEAD + cây làm việc, nên HEAD khác den hay cây bẩn ngoài hồ sơ → từ chối, không
    // đóng dấu den lên số của một cây khác (thẻ tắt cờ «chưa chấm» theo đúng dấu này).
    let den;
    try { den = git(root, 'rev-parse', co.den).trim(); } catch (_) { sai(`--den không giải được: ${co.den}`); }
    // HEAD được đi tiếp bằng commit chỉ chạm hồ sơ (gói evidence commit trước bước này — SKILL nhánh PASS); khuon-nap.json
    // không được miễn vì nó đổi bản ghim mà bước chấm đọc.
    const ngoaiHoSo = f => !/^(_acceptance|\.acceptance-runs|\.claude)\//.test(f) || /(^|\/)khuon-nap\.json$/.test(f);
    const ke = ds => `${ds.slice(0, 3).join(', ')}${ds.length > 3 ? ', …' : ''}`;
    try { git(root, 'merge-base', '--is-ancestor', den, 'HEAD'); } catch (_) { sai(`--den ${den.slice(0, 12)} không phải tổ tiên của HEAD — chạy --write trên nhánh đã chấm`); }
    const sauDen = tachZ(git(root, 'diff', '--name-only', '-z', den, 'HEAD')).filter(ngoaiHoSo);
    if (sauDen.length) sai(`sau ${den.slice(0, 12)} có commit đổi ngoài hồ sơ (${ke(sauDen)}) — số đo sẽ không phải của ${den.slice(0, 12)}`);
    const ban = [...tachZ(git(root, 'diff', '--name-only', '-z', 'HEAD')), ...tachZ(git(root, 'ls-files', '-o', '--exclude-standard', '-z'))].filter(ngoaiHoSo);
    if (ban.length) sai(`cây làm việc đổi ngoài hồ sơ (${ke(ban)}) — số đo sẽ không phải của ${den.slice(0, 12)}`);
  }
  const ra = chamKho(root, base);
  if (co.write) {
    const den = git(root, 'rev-parse', co.den).trim();
    const nap = path.join(root, '_acceptance', co.slug, 'khuon-nap.json');
    let ghim = null;
    try { ghim = JSON.parse(fs.readFileSync(nap, 'utf8')).ghim || null; } catch (_) { ghim = null; }
    const so = { schema: 1, den, base, ghim, theo_khuon: ra.theo_khuon, lech_moi: ra.lech_moi, no_cu: ra.no_cu, khong_do: ra.khong_do, ngoai_ban_do: ra.ngoai_ban_do, nhom: ra.nhom };
    const dich = path.join(root, '_acceptance', co.slug, 'khuon-cham.json');
    fs.mkdirSync(path.dirname(dich), { recursive: true });
    fs.writeFileSync(dich, JSON.stringify(so, null, 2) + '\n');
    process.stdout.write(`khuon-cham.json: ${ra.theo_khuon.length} theo khuôn · ${ra.lech_moi.length} lệch mới · nợ cũ ${ra.no_cu.length} · không đo ${ra.khong_do.length}\n`);
    return 0;
  }
  const dong = inCham(ra);
  if (dong.length) process.stdout.write(dong.join('\n') + '\n');
  return ra.lech_moi.length || ra.sai.length ? 1 : 0;
}

// realpath cả hai vế: chạy từ đường dẫn qua liên kết (vd /var → /private/var trên macOS) mà so thô thì main không chạy và
// lệnh thoát 0 im lặng — đúng hình dạng xanh-rỗng.
if (process.argv[1] && fs.realpathSync(path.resolve(process.argv[1])) === fs.realpathSync(fileURLToPath(import.meta.url))) process.exit(main());
