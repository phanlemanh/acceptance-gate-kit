#!/usr/bin/env node
'use strict';
/**
 * do-ban-kinh.cjs — phép đo BÁN KÍNH của hồ sơ cong-nguoi-doc-du-nguon.
 *
 * Năm trục, mỗi trục trả một con số ĐỌC TỪ VẬT (hợp đồng và tệp rà soát thật của
 * các kho trên máy), không phải một hằng gõ tay trong hợp đồng.
 *
 *   node do-ban-kinh.cjs --truc tat-ca|ac|coverage|findings|cross-layer|chep
 *                        [--root <kho>]...        (mặc định: mọi kho dưới ~/dev)
 *                        [--ag-root <cây thư viện>]  (mặc định: cây chứa tệp này)
 *                        [--json]
 *
 * VÌ SAO có `--ag-root`: số của trục `ac`, `coverage`, `findings` phải ĐỔI khi
 * lớp thư viện đổi. Chạy với `--ag-root` trỏ vào một bản dựng TRƯỚC bản vá phải
 * trả lại con số CŨ. Số không đổi theo lớp đo nghĩa là script đang đo VĂN chứ
 * không đo VẬT — khi đó sửa script, đừng hạ ngưỡng.
 *
 * ĐƯỜNG DẪN, nói cho đúng: đường tới LỚP ĐANG ĐO suy từ vị trí tệp này, không
 * hằng nào trỏ checkout của tác giả. Còn gốc CORPUS thì khác — nó là bộ kho trên
 * máy đang chạy, không suy được từ đâu cả, nên mặc định `~/dev` và mở cờ `--root`
 * / `--dev` để đổi. Hai thứ đó đừng gộp làm một câu (sửa sau lượt chấm 6): câu cũ
 * khai «mọi đường dẫn» nên đọc thành lời hứa mà tệp không giữ.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const SELF = __filename;
const HO_SO = path.dirname(SELF);                       // _acceptance/<slug>
const CAY = path.resolve(HO_SO, '..', '..');            // gốc kho kit

function doiSo(argv) {
  const o = { truc: 'tat-ca', root: [], agRoot: CAY, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--truc') o.truc = argv[++i];
    else if (a === '--root') o.root.push(path.resolve(argv[++i]));
    else if (a === '--ag-root') o.agRoot = path.resolve(argv[++i]);
    else if (a === '--json') o.json = true;
    else { process.stderr.write(`do-ban-kinh: cờ lạ ${a}\n`); process.exit(2); }
  }
  return o;
}

// Nạp thư viện từ LỚP được chỉ định. Thiếu tệp nào → dừng có tên, không đoán.
function nap(agRoot) {
  // Bộ đọc review-findings đổi tên trong CHÍNH vòng này (.js → .cjs). Phép đo phải
  // chạy được trên CẢ HAI lớp, không thì nó không có chiều đỏ: lớp cũ sẽ dừng vì
  // thiếu tệp chứ không trả lại con số cũ, và ta không phân biệt được «script đo
  // vật» với «script đo văn».
  const mot = (...ung) => {
    for (const r of ung) if (fs.existsSync(path.join(agRoot, r))) return require(path.join(agRoot, r));
    process.stderr.write(`do-ban-kinh: lớp ${agRoot} không có ${ung.join(' hoặc ')} — không đo được\n`);
    process.exit(2);
  };
  return {
    acLine: mot('lib/ac-line.cjs'),
    mdSec: mot('lib/md-section.cjs'),
    ooc: mot('lib/out-of-contract.cjs', 'lib/out-of-contract.js'),
    evalYaml: mot('lib/eval-yaml.cjs'),
  };
}

// Danh sách kho: --root lặp được; vắng thì mọi thư mục con của ~/dev có _acceptance/.
function cacKho(o) {
  if (o.root.length) return o.root;
  const dev = path.join(os.homedir(), 'dev');
  if (!fs.existsSync(dev)) return [];
  return fs.readdirSync(dev)
    .map(x => path.join(dev, x))
    .filter(p => { try { return fs.statSync(path.join(p, '_acceptance')).isDirectory(); } catch (_) { return false; } });
}

function cacHoSo(kho) {
  const ws = path.join(kho, '_acceptance');
  let ten = [];
  try { ten = fs.readdirSync(ws); } catch (_) { return []; }
  return ten
    .map(s => ({ kho: path.basename(kho), slug: s, dir: path.join(ws, s) }))
    .filter(h => { try { return fs.statSync(h.dir).isDirectory(); } catch (_) { return false; } });
}

const doc = p => { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } };
const bullets = arr => arr.filter(l => /^\s*[-*]\s+\S/.test(l) && !/\{\{/.test(l));

// ── trục ac: thẻ đọc được bao nhiêu tiêu chí, so với khuôn HẸP đời trước ─────
function trucAc(L, hoSo) {
  let hopDong = 0, docThem = 0, hoiQuy = 0, tieuChiThem = 0, imLang = 0;
  const ds = [];
  for (const h of hoSo) {
    const t = doc(path.join(h.dir, 'contract.md'));
    if (t == null) continue;
    hopDong += 1;
    const hep = [];
    for (const l of L.mdSec.section(t, 'Criteria')) { const a = L.acLine.parseAC(l); if (a) hep.push(a.id); }
    const rong = typeof L.acLine.parseACBlock === 'function'
      ? L.acLine.parseACBlock(t).map(a => a.id)
      : hep;
    if (rong.length > hep.length) {
      docThem += 1;
      tieuChiThem += rong.length - hep.length;
      if (hep.length === 0 && L.acLine.acBlindSpot(t, hep) === null) imLang += 1;
      ds.push(`${h.kho}/${h.slug} ${hep.length}→${rong.length}`);
    } else if (rong.length < hep.length) {
      hoiQuy += 1;
      ds.push(`HỒI QUY ${h.kho}/${h.slug} ${hep.length}→${rong.length}`);
    }
  }
  return { hopDong, docThem, tieuChiThem, boDoImLang: imLang, hoiQuy, mau: ds.slice(0, 10) };
}

// ── trục coverage: mục Coverage CÓ THẬT mà thẻ đọc ra rỗng ──────────────────
function trucCoverage(L, hoSo) {
  let coMuc = 0, baoThieu = 0;
  const ds = [];
  for (const h of hoSo) {
    const t = doc(path.join(h.dir, 'contract.md'));
    if (t == null || !/^#{2,6}\s+Coverage\b/im.test(t)) continue;
    coMuc += 1;
    const all = L.mdSec.section(t, 'Coverage');
    // Hỏi LỚP, không cài lại luật ở đây: bản đầu của script tự dựng phép đọc nên
    // trục này cho CÙNG một số trên mọi lớp — tức đo VĂN, đúng cái docstring trên
    // đầu tệp này cảnh báo. Lớp đời trước không có contentLines → rơi về bullets,
    // và đó chính là hành vi cũ cần đo.
    const dong = typeof L.mdSec.contentLines === 'function' ? L.mdSec.contentLines(all) : bullets(all);
    if (!dong.length) { baoThieu += 1; ds.push(`${h.kho}/${h.slug}`); }
  }
  return { coMuc, baoThieu, mau: ds.slice(0, 10) };
}

// ── trục findings: hồ sơ còn mục CHỜ NGƯỜI, và hồ sơ có lỗi TRONG hợp đồng ──
function trucFindings(L, hoSo) {
  let coTep = 0, coTrong = 0, mucTrong = 0, conChoNguoi = 0;
  const ds = [];
  for (const h of hoSo) {
    const rf = doc(path.join(h.dir, 'review-findings.md'));
    if (rf == null) continue;
    coTep += 1;
    const r = L.ooc.parse(rf);
    const trong = (r.inContract || []).length;
    const ngoai = (r.findings || []).length;
    if (trong > 0) { coTrong += 1; mucTrong += trong; }
    let daXu = 0;
    for (const l of String(doc(path.join(h.dir, 'decisions.jsonl')) || '').split('\n')) {
      if (!l.trim()) continue;
      let o; try { o = JSON.parse(l); } catch (_) { continue; }
      if (o && String(o.stage) === 'gate2') daXu += 1;
    }
    const n = Math.max(0, trong + ngoai - daXu);
    if (n > 0) { conChoNguoi += 1; ds.push(`${h.kho}/${h.slug} (${n})`); }
  }
  return { coTep, hoSoCoLoiTrongHopDong: coTrong, tongMucTrong: mucTrong, conChoNguoi, mau: ds.slice(0, 10) };
}

// ── trục cross-layer: hợp đồng SINH vi phạm xuyên lớp MỚI ───────────────────
function trucCrossLayer(L, hoSo) {
  let xet = 0, sinhMoi = 0;
  const ds = [];
  for (const h of hoSo) {
    const t = doc(path.join(h.dir, 'contract.md'));
    const e = doc(path.join(h.dir, 'evals.yaml'));
    if (t == null || e == null) continue;
    xet += 1;
    const cu = new Set();
    for (const l of L.mdSec.section(t, 'Criteria')) { const a = L.acLine.parseAC(l); if (a && a.crossLayer) cu.add(a.id); }
    const moi = new Set();
    if (typeof L.acLine.parseACBlock === 'function') {
      for (const a of L.acLine.parseACBlock(t)) if (a.crossLayer) moi.add(a.id);
    }
    const them = [...moi].filter(x => !cu.has(x));
    if (!them.length) continue;
    let evs = [];
    try { evs = L.evalYaml.parseEvals(e, ['criterion', 'layer'], x => String(x).trim()); } catch (_) { evs = []; }
    const thieu = them.filter(id => !evs.some(v => v.criterion === id && /backend-effect/.test(v.layer || '')));
    if (thieu.length) { sinhMoi += 1; ds.push(`${h.kho}/${h.slug} → ${thieu.join(',')}`); }
  }
  return { xet, sinhMoi, mau: ds.slice(0, 10) };
}

// ── trục chep: BAO ĐÓNG BẮC CẦU của danh sách chép lớp CI ────────────────────
// Phép đo sẵn có (CE2 của consumer-esm.test.mjs) quét tên tệp lib xuất hiện
// TRONG HAI TỆP cưỡng chế. Nó KHÔNG lần theo require bắc cầu: một tệp lib được
// nạp từ bên trong một tệp lib khác nằm ngoài tầm quét, và ở vòng này nó chỉ lọt
// lưới nhờ tên tình cờ nằm trong một câu thông điệp lỗi. Trục này đóng chỗ đó.
function trucChep(agRoot) {
  const cmd = path.join(agRoot, 'commands', 'acceptance-init.md');
  const t = doc(cmd);
  if (t == null) return { loi: `không đọc được ${cmd}` };
  const m = t.match(/<<<INIT-CI-COPY-LIST\n([\s\S]*?)INIT-CI-COPY-LIST>>>/);
  const vung = m ? m[1] : t;
  const khai = new Set();
  for (const x of vung.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/((?:lib|scripts)\/[A-Za-z0-9_.-]+)/g)) khai.add(x[1]);

  // Gốc: hai tệp cưỡng chế. Rồi lần theo require giữa các tệp lib, BẮC CẦU.
  const goc = ['scripts/pre-merge-check.sh', 'scripts/recheck-evidence.cjs'];
  const dung = new Set(goc);
  const hangDoi = [...goc];
  while (hangDoi.length) {
    const rel = hangDoi.shift();
    const src = doc(path.join(agRoot, rel));
    if (src == null) continue;
    const thay = new Set();
    for (const x of src.matchAll(/lib\/([A-Za-z0-9_-]+\.cjs)/g)) thay.add(`lib/${x[1]}`);
    for (const x of src.matchAll(/require\(\s*path\.join\([^)]*?['"]([A-Za-z0-9_-]+\.cjs)['"]\s*\)\s*\)/g)) thay.add(`lib/${x[1]}`);
    for (const x of src.matchAll(/require\(\s*['"]\.\/([A-Za-z0-9_-]+\.cjs)['"]\s*\)/g)) thay.add(`lib/${x[1]}`);
    for (const f of thay) {
      if (!fs.existsSync(path.join(agRoot, f))) continue;   // tên trong văn bản, không phải tệp
      if (dung.has(f)) continue;
      dung.add(f); hangDoi.push(f);
    }
  }
  const thieu = [...dung].filter(f => !khai.has(f)).sort();
  return { khai: khai.size, dung: dung.size, thieu, batCau: [...dung].sort() };
}

// ── chạy ────────────────────────────────────────────────────────────────────
const o = doiSo(process.argv.slice(2));
const L = nap(o.agRoot);
const kho = cacKho(o);
const hoSo = kho.flatMap(cacHoSo);
if (!hoSo.length && o.truc !== 'chep') {
  process.stderr.write('do-ban-kinh: không tìm được hồ sơ nào — kiểm --root\n');
  process.exit(2);
}
const ra = { layer: o.agRoot, soKho: kho.length, soHoSo: hoSo.length };
const muon = t => o.truc === 'tat-ca' || o.truc === t;
if (muon('ac')) ra.ac = trucAc(L, hoSo);
if (muon('coverage')) ra.coverage = trucCoverage(L, hoSo);
if (muon('findings')) ra.findings = trucFindings(L, hoSo);
if (muon('cross-layer')) ra.crossLayer = trucCrossLayer(L, hoSo);
if (muon('chep')) ra.chep = trucChep(o.agRoot);

// Mã thoát tính MỘT LẦN, dùng cho CẢ HAI chế độ in. Bản đầu cho nhánh --json
// thoát 0 vô điều kiện, nên người gọi theo mã thoát nhận XANH GIẢ trong khi đầu
// ra JSON ngay cạnh đang liệt tệp thiếu — đúng lớp lỗi hồ sơ này đi đóng, và ca
// CN12 bắt được nó ở chính lượt dựng.
const maThoat = ra.chep && Array.isArray(ra.chep.thieu) && ra.chep.thieu.length ? 1 : 0;
if (o.json) { process.stdout.write(JSON.stringify(ra, null, 2) + '\n'); process.exit(maThoat); }
const d = [];
d.push(`lớp đo: ${ra.layer}`);
d.push(`kho: ${ra.soKho} · hồ sơ: ${ra.soHoSo}`);
if (ra.ac) d.push(`ac        · hợp đồng ${ra.ac.hopDong} · đọc THÊM ${ra.ac.docThem} (${ra.ac.tieuChiThem} tiêu chí) · bộ dò im ${ra.ac.boDoImLang} · HỒI QUY ${ra.ac.hoiQuy}`);
if (ra.coverage) d.push(`coverage  · có mục ${ra.coverage.coMuc} · thẻ báo thiếu ${ra.coverage.baoThieu}`);
if (ra.findings) d.push(`findings  · có tệp ${ra.findings.coTep} · có lỗi TRONG hợp đồng ${ra.findings.hoSoCoLoiTrongHopDong} (${ra.findings.tongMucTrong} mục) · còn chờ người ${ra.findings.conChoNguoi}`);
if (ra.crossLayer) d.push(`cross-layer · xét ${ra.crossLayer.xet} · SINH vi phạm MỚI ${ra.crossLayer.sinhMoi}`);
if (ra.chep) d.push(ra.chep.loi ? `chep      · LỖI: ${ra.chep.loi}`
  : `chep      · khai ${ra.chep.khai} · dùng bắc cầu ${ra.chep.dung} · THIẾU ${ra.chep.thieu.length}${ra.chep.thieu.length ? ': ' + ra.chep.thieu.join(', ') : ''}`);
process.stdout.write(d.join('\n') + '\n');
process.exit(maThoat);
