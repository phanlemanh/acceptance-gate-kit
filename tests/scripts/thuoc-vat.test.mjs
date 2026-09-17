// thuoc-vat.test.mjs — thuoc-co-cua AC-11 (E15, E16): bộ đếm vật · thước · nhát suy từ git.
//
//   TV1 đối chứng dương: hai nhát sau mốc sàn, dòng vật/thước khớp numstat tính độc lập.
//   TV2 chiều im (TDD tự do): ba commit thước TRƯỚC mốc sàn không vào số nhát.
//   TV3 đọc-cũ: hồ sơ chưa từng implemented → 0, ghi chú «chua co moc san», mã 0.
//   TV4 chiều đỏ: bản sao lấy mốc sàn là commit đầu của hồ sơ → số nhát đổi (TV2 đỏ).
//   TV7 commit lẫn vật + ca: nhát KHÔNG tăng, ô «lẫn» +1; bản sao đếm mọi commit chạm
//       thước → nhát tăng (kết luận lật).
//   TV5 cờ giữa-hai-lượt: đúng tệp thước giữa hai sha của hai dòng round-tally.
//   TV6 sha không thuần nhất trong một lượt → «khong liet ke duoc», mã 3.
// Kho do code sinh (thuoc-vat-fixture.mjs); bản sao chép TRỌN thư mục scripts; đường dẫn
// suy từ vị trí tệp này.
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, cpSync, appendFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { dungKho, buoc, git, TEP, SLUG } from './thuoc-vat-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const SCRIPT = path.join(KIT, 'feature-loop', 'scripts', 'thuoc-vat.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const TMP = mkdtempSync(path.join(tmpdir(), 'thuoc-vat-'));
let n = 0;
const moiKho = kb => dungKho(path.join(TMP, `k-${++n}`), kb);

const chay = (script, d, ...extra) => spawnSync(process.execPath,
  [script, '--root', d, '--slug', SLUG, '--ag-root', KIT, ...extra], { encoding: 'utf8' });
const demJson = (script, d) => {
  const r = chay(script, d, '--json');
  if (r.status !== 0) throw new Error(`exit ${r.status}: ${String(r.stderr).trim().split('\n').slice(-2).join(' | ')}`);
  return JSON.parse(r.stdout);
};
// Bản sao đột biến: chép TRỌN feature-loop/scripts (script nhập lib/phan-loai.mjs và
// carry-plan.mjs), kim phải khớp ĐÚNG MỘT lần.
function banSao(kim, thay) {
  const d = path.join(TMP, `mut-${++n}`);
  cpSync(path.join(KIT, 'feature-loop', 'scripts'), path.join(d, 'scripts'), { recursive: true });
  const f = path.join(d, 'scripts', 'thuoc-vat.mjs');
  const src = readFileSync(f, 'utf8');
  const k = src.split(kim).length - 1;
  if (k !== 1) throw new Error(`kim «${kim.slice(0, 60)}» khop ${k} lan (can dung 1)`);
  writeFileSync(f, src.replace(kim, thay));
  return f;
}
// numstat tính ĐỘC LẬP trong ca: hai tệp của fixture, lớp gõ theo vai trò fixture khai.
function numstatDocLap(d, san) {
  const out = { vat: [0, 0], thuoc: [0, 0] };
  for (const l of git(d, 'diff', '--numstat', `${san}..HEAD`).split('\n').filter(Boolean)) {
    const [a, b, f] = l.split('\t');
    const lop = f === TEP.vat ? 'vat' : f === TEP.thuoc ? 'thuoc' : null;
    if (lop) { out[lop][0] += Number(a); out[lop][1] += Number(b); }
  }
  return out;
}
const loi = e => String((e && e.message) || e).split('\n')[0];

// ── TV1 · TV2 · TV4 trên CÙNG kịch bản chuẩn ────────────────────────────────
let tv2Xanh = false;
{
  try {
    const { d, shas } = moiKho();
    const san = shas[4];   // bước 'implemented'
    const r = demJson(SCRIPT, d);
    const ns = numstatDocLap(d, san);
    if (r.san !== san) bad('TV1 moc san phai la commit dua hop dong sang implemented', `${r.san} != ${san}`);
    else if (r.nhat !== 2 || r.lan !== 0) bad('TV1 nhat phai 2, lan 0', JSON.stringify(r));
    else if (JSON.stringify(r.vat) !== JSON.stringify(ns.vat) || JSON.stringify(r.thuoc) !== JSON.stringify(ns.thuoc))
      bad('TV1 dong vat/thuoc khong khop numstat tinh doc lap', `${JSON.stringify([r.vat, r.thuoc])} != ${JSON.stringify([ns.vat, ns.thuoc])}`);
    else ok(`TV1 doi chung duong — nhat 2, lan 0, vat +${r.vat[0]}/-${r.vat[1]} thuoc +${r.thuoc[0]}/-${r.thuoc[1]} khop numstat`);

    // TV2: đếm độc lập số commit thuần-thước TRƯỚC mốc sàn trong fixture — phải là 3 thì
    // ca mới có nghĩa — rồi đòi chúng không vào nhát.
    const truocSan = git(d, 'rev-list', `main..${san}~1`).split('\n').filter(Boolean)
      .filter(h => git(d, 'show', '--name-only', '--format=', h).split('\n').filter(Boolean).join(',') === TEP.thuoc).length;
    if (truocSan !== 3) bad('TV2 fixture phai co 3 commit thuoc truoc moc san', String(truocSan));
    else if (r.nhat !== 2) bad('TV2 commit thuoc truoc moc san bi dem', JSON.stringify(r));
    else { tv2Xanh = true; ok('TV2 chieu im — ba commit thuoc truoc moc san KHONG vao nhat'); }

    // TV4: bản sao lấy mốc sàn là commit đầu của hồ sơ.
    const KIM = "'-S', 'status: implemented', '--', hopDongRel";
    const mut = banSao(KIM, "'--', `_acceptance/${slug}/`");
    const rm = demJson(mut, d);
    if (!tv2Xanh) bad('TV4 doi chung duong TV2 khong xanh — khong tin duoc chieu do');
    else if (rm.nhat === r.nhat) bad('TV4 dot bien moc san ma so nhat khong doi — TV2 khong co rang', JSON.stringify(rm));
    else if (rm.nhat !== 5) bad('TV4 dot bien moc san phai dem ca ba nhat S3 (5)', JSON.stringify(rm));
    else ok(`TV4 dot bien moc san — TV2 do (nhat ${r.nhat} -> ${rm.nhat})`);
  } catch (e) { bad('TV1/TV2/TV4 loi', loi(e)); }
}

// ── TV3: hồ sơ chưa từng implemented ────────────────────────────────────────
{
  try {
    const { d } = moiKho(['vat', 'thuoc', 'thuoc', 'thuoc']);
    const r = chay(SCRIPT, d, '--json');
    const j = r.status === 0 ? JSON.parse(r.stdout) : null;
    if (r.status !== 0) bad('TV3 chua implemented phai thoat 0', `exit ${r.status}: ${r.stderr}`);
    else if (j.nhat !== 0 || j.lan !== 0 || j.san !== null) bad('TV3 moi so phai 0, san null', JSON.stringify(j));
    else if (!String(j.ghiChu || '').includes('chua co moc san')) bad('TV3 ghi chu phai co «chua co moc san»', JSON.stringify(j));
    else {
      const rt = chay(SCRIPT, d);
      if (rt.status !== 0 || !rt.stdout.includes('chua co moc san')) bad('TV3 dang chu cung phai noi «chua co moc san»', rt.stdout);
      else ok('TV3 ho so chua tung implemented — nhat 0, ghi chu chua co moc san, ma 0');
    }
  } catch (e) { bad('TV3 loi', loi(e)); }
}

// ── TV7: commit lẫn vật + ca ────────────────────────────────────────────────
{
  try {
    const { d } = moiKho();
    const truoc = demJson(SCRIPT, d);
    buoc(d, 'lan');
    const sau = demJson(SCRIPT, d);
    const mut = banSao('if (coThuoc && !coVat) nhat += 1;', 'if (coThuoc) nhat += 1;');
    const sauMut = demJson(mut, d);
    if (truoc.nhat !== 2 || truoc.lan !== 0) bad('TV7 doi chung duong: truoc commit lan phai nhat 2 lan 0', JSON.stringify(truoc));
    else if (sau.nhat !== 2 || sau.lan !== 1) bad('TV7 commit lan phai giu nhat 2 va lan 1', JSON.stringify(sau));
    else if (sauMut.nhat <= sau.nhat) bad('TV7 ban sao dem moi commit cham thuoc ma nhat khong tang — ca khong co rang', JSON.stringify(sauMut));
    else ok(`TV7 commit cham ca vat lan tep ca — nhat giu ${sau.nhat}, lan ${sau.lan}; dot bien dem moi commit cham thuoc thi nhat ${sauMut.nhat} (ket luan lat)`);
  } catch (e) { bad('TV7 loi', loi(e)); }
}

// ── TV5 · TV6: cờ giữa-hai-lượt ─────────────────────────────────────────────
function khoHaiLuot() {
  const { d, shas } = moiKho(['vat', 'implemented']);
  const shaA = shas[1];
  // giữa hai lượt: một tệp thước, một tệp vật, một tệp hồ sơ
  appendFileSync(path.join(d, TEP.thuoc), '// giua\n');
  appendFileSync(path.join(d, TEP.vat), '// giua\n');
  mkdirSync(path.join(d, '_acceptance', SLUG), { recursive: true });
  writeFileSync(path.join(d, '_acceptance', SLUG, 'gap-probe.md'), 'giua\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'giua hai luot');
  const shaB = git(d, 'rev-parse', 'HEAD');
  const dong = [
    { evalId: 'E1', round: 1, sha: shaA, exit_code: 0 },
    { kind: 'round-tally', round: 1, sha: shaA, verdict: 'REJECT', expected: 1, returned: 1, blocked: 0 },
    { evalId: 'E1', round: 2, sha: shaB, exit_code: 0 },
    { kind: 'round-tally', round: 2, sha: shaB, verdict: 'PASS', expected: 1, returned: 1, blocked: 0 },
  ];
  writeFileSync(path.join(d, TEP.runLog), dong.map(x => JSON.stringify(x)).join('\n') + '\n');
  return { d, shaA, shaB };
}
{
  try {
    const { d } = khoHaiLuot();
    const r = chay(SCRIPT, d, '--giua-hai-luot');
    const dongOut = r.stdout.split('\n').map(s => s.trim()).filter(Boolean);
    if (r.status !== 0) bad('TV5 giua-hai-luot phai thoat 0', `exit ${r.status}: ${r.stderr}`);
    else if (JSON.stringify(dongOut) !== JSON.stringify([TEP.thuoc])) bad('TV5 phai liet ke DUNG tep thuoc, khong tep vat hay ho so', JSON.stringify(dongOut));
    else ok('TV5 giua-hai-luot — liet ke dung tep thuoc giua hai sha, khong tep vat, khong tep ho so');
  } catch (e) { bad('TV5 loi', loi(e)); }
}
{
  try {
    const { d, shaA } = khoHaiLuot();
    const lanh = chay(SCRIPT, d, '--giua-hai-luot');
    appendFileSync(path.join(d, TEP.runLog), JSON.stringify({ evalId: 'E2', round: 2, sha: shaA, exit_code: 0 }) + '\n');
    const r = chay(SCRIPT, d, '--giua-hai-luot');
    const tatCa = r.stdout + r.stderr;
    if (lanh.status !== 0) bad('TV6 doi chung duong: run-log lanh phai thoat 0', `exit ${lanh.status}`);
    else if (r.status !== 3) bad('TV6 sha khong thuan nhat phai thoat ma 3', `exit ${r.status}: ${tatCa}`);
    else if (!tatCa.includes('khong liet ke duoc')) bad('TV6 thong diep phai co «khong liet ke duoc»', tatCa);
    else if (r.stdout.includes(TEP.thuoc)) bad('TV6 khong duoc doan danh sach tep', r.stdout);
    else ok('TV6 sha khong thuan nhat trong mot luot — khong liet ke duoc, ma 3, khong doan');
  } catch (e) { bad('TV6 loi', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (thuoc-vat)`);
process.exit(fail ? 1 : 0);
