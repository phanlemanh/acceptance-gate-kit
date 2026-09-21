// ntr-observed.test.mjs — hồ sơ nhan-trang-thai-va-reality, AC-11 (E11): thao tác cổng người
// thứ bảy `/acceptance-gate:observed`. Khoá model-invocation (ADR 0002) · danh sách khoá của
// P32 RÚT so với danh sách trong CLAUDE.md · khối P32 chạy lại trên bản sao gỡ khoá → đỏ ghim ·
// khuôn dòng quan sát round-trip qua bộ đọc thật `thucTe` của lib. Thân lệnh là văn cho máy thi
// hành: việc nó từ chối draft / sha ngắn KHÔNG có răng ở đây (giới hạn khai ở hợp đồng).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, cpSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'ntr-obs-'));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const OBS = path.join(KIT, 'commands', 'observed.md');
const RUN = readFileSync(path.join(KIT, 'tests', 'plugins', 'run-tests.sh'), 'utf8');

// Khối P32 NGUYÊN VĂN từ run-tests.sh (không chép tay).
const khoiP32 = (() => {
  const m = RUN.match(/run "P32[^\n]*\n\s*python3 - "\$ROOT" <<'PY'\n([\s\S]*?)\nPY\n/);
  if (!m) throw new Error('khong rut duoc khoi P32 tu tests/plugins/run-tests.sh');
  return m[1];
})();
const chayP32 = root => spawnSync('python3', ['-', root], { input: khoiP32, encoding: 'utf8' });

// NO-AC11-khoa
try {
  const fm = readFileSync(OBS, 'utf8').split('\n---')[0];
  if (!/^disable-model-invocation: true$/m.test(fm)) bad('NO-AC11-khoa', 'frontmatter commands/observed.md khong co khoa');
  else ok('NO-AC11-khoa', '— frontmatter mang disable-model-invocation: true');
} catch (e) { bad('NO-AC11-khoa', loi(e)); }

// NO-AC11-danh-sach
try {
  const md = readFileSync(path.join(KIT, 'CLAUDE.md'), 'utf8');
  const m = md.match(/\*\*(\d+) thao tác cổng người\*\* \(([^)]*)\)/);
  if (!m) throw new Error('khong rut duoc muc thao tac cong nguoi tu CLAUDE.md');
  const trongClaude = [...m[2].matchAll(/`([a-z-]+)`/g)].map(x => x[1]).sort();
  const lk = khoiP32.match(/LOCKED = \[([^\]]*)\]/);
  if (!lk) throw new Error('khong rut duoc LOCKED tu khoi P32');
  const trongP32 = [...lk[1].matchAll(/"([a-z-]+)"/g)].map(x => x[1]).sort();
  if (Number(m[1]) !== 7) bad('NO-AC11-danh-sach', `CLAUDE.md khai ${m[1]} thao tac, mong 7`);
  else if (trongClaude.length !== 7 || JSON.stringify(trongClaude) !== JSON.stringify(trongP32)) bad('NO-AC11-danh-sach', `CLAUDE.md ${JSON.stringify(trongClaude)} ≠ P32 ${JSON.stringify(trongP32)}`);
  else if (!trongP32.includes('observed')) bad('NO-AC11-danh-sach', 'thieu observed');
  else ok('NO-AC11-danh-sach', '— bảy tên trong CLAUDE.md bằng danh sách khoá của P32, có observed');
} catch (e) { bad('NO-AC11-danh-sach', loi(e)); }

// NO-AC11-do
try {
  const lanh = chayP32(KIT);
  const sao = mkdtempSync(path.join(TMP, 'sao-'));
  cpSync(path.join(KIT, 'commands'), path.join(sao, 'commands'), { recursive: true });
  const f = path.join(sao, 'commands', 'observed.md');
  const src = readFileSync(f, 'utf8');
  writeFileSync(f, src.replace('disable-model-invocation: true\n', ''));
  if (readFileSync(f, 'utf8') === src) throw new Error('go khoa khong doi byte');
  const do_ = chayP32(sao);
  if (lanh.status !== 0) bad('NO-AC11-do', `doi chung: khoi P32 tren cay nguyen ven thoat ${lanh.status}: ${lanh.stderr.split('\n').slice(-2).join(' ')}`);
  else if (do_.status === 0) bad('NO-AC11-do', 'go khoa ma P32 van xanh');
  else if (!do_.stderr.includes('commands/observed.md lacks lock')) bad('NO-AC11-do', `P32 do sai thong diep: ${do_.stderr.split('\n').slice(-2).join(' ')}`);
  else ok('NO-AC11-do', '— bản sao gỡ khoá: P32 đỏ «commands/observed.md lacks lock»; cây nguyên vẹn xanh');
} catch (e) { bad('NO-AC11-do', loi(e)); }

// NO-AC11-than — round-trip khuôn dòng quan sát qua bộ đọc thật
try {
  const WR = require(path.join(KIT, 'lib', 'workspace-record.cjs'));
  const khuon = t => { const m = String(t).match(/<!-- <<<THUC-TE-LINE -->\n\s*([^\n]+)\n\s*<!-- THUC-TE-LINE>>> -->/); if (!m) throw new Error('khong rut duoc khoi THUC-TE-LINE'); return m[1].trim(); };
  const dien = k => '{"id":"d-20260921T110000Z-1",' + k.replace('<ISO ngày quan sát>', '2026-09-21').replace('<tên>', 'Manh')
    .replace('<40-hex bản dựng đang phục vụ prod>', 'a'.repeat(40)).replace('<một câu người nói>', 'dang chay') + '}';
  const t = readFileSync(OBS, 'utf8');
  const r1 = WR.thucTe(dien(khuon(t)));
  const doi = t.replace('"build_sha":"<40-hex', '"sha":"<40-hex');
  if (doi === t) throw new Error('mutant ten ve khong doi byte');
  const r2 = WR.thucTe(dien(khuon(doi)));
  if (!r1 || r1.kieu !== 'dong-so') bad('NO-AC11-than', `khuon that khong doc duoc: ${JSON.stringify(r1)}`);
  else if (!r2 || r2.kieu !== 'dong-so-thieu' || !r2.thieu.includes('build_sha')) bad('NO-AC11-than', `mutant ten ve: ${JSON.stringify(r2)}`);
  else ok('NO-AC11-than', '— khuôn THUC-TE-LINE qua thucTe ra dòng hợp lệ; đổi tên vế build_sha → dong-so-thieu nêu build_sha');
} catch (e) { bad('NO-AC11-than', loi(e)); }

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ntr-observed)`);
process.exit(fail ? 1 : 0);
