#!/usr/bin/env node
// mutation-check.mjs — bằng chứng PHÂN BIỆT cho feature judgment-runs.
//
// Vì sao tồn tại: mọi eval máy của feature này trỏ vào CẢ MỘT bộ test, nên chạy
// trên mã trước-feature cũng xanh — S4 vòng 1 cho đúng cờ "xanh cả hai phía".
// Một suite xanh không chứng minh được "nhờ đâu mà xanh". Script này trả lời câu
// đó bằng cách phá VẬT THẬT trong một bản sao rồi đòi phép đo phải đỏ.
//
// Nghi thức mỗi phép đo (CLAUDE.md — assertion âm-tính-một-mình là assertion
// không sống):
//   (a) ĐỐI CHỨNG DƯƠNG — bản sao nguyên vẹn phải XANH trước, nếu không thì
//       "đỏ" chỉ đang nói fixture hỏng / cp lỗi / script không tồn tại;
//   (b) GHIM ĐÚNG THÔNG ĐIỆP — không chỉ "exit khác 0", mà đúng case nào đỏ.
//
// Mọi đường dẫn suy từ vị trí file này. Exit 0 = mọi đột biến đều bị bắt.

import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const TEST_REL = path.join('tests', 'workflows', 'acceptance-verify.test.mjs');
const WF_REL = path.join('feature-loop', 'workflows', 'acceptance-verify.js');
const CARD_REL = path.join('scripts', 'gate-card.js');

// Mỗi đột biến: phá một thứ THẬT, rồi đòi ĐÚNG case này đỏ.
const MUTATIONS = [
  {
    name: 'xoa hang runs x judgment khoi bang luat',
    file: WF_REL,
    apply: s => {
      const re = /^.*field: 'runs', executor: 'judgment',\n.*\n.*\n/m;
      if (!re.test(s)) throw new Error('khong tim thay hang runs x judgment');
      return s.replace(re, '');
    },
    expect: 'WI1 hanh vi khop DAC TA viet-truoc',
  },
  {
    name: 'them hang SAI paths x judgment (hang khong thuc su inert)',
    file: WF_REL,
    apply: s => {
      const anchor = '  // KHONG co hang { paths, judgment }.';
      if (!s.includes(anchor)) throw new Error('khong tim thay moc chen');
      return s.replace(anchor, "  { field: 'paths', executor: 'judgment', reason: 'x', plain: 'y' },\n" + anchor);
    },
    expect: 'WI9 MOI hang trong bang that su inert',
  },
  {
    name: 'ham bo qua field paths du bang khai',
    file: WF_REL,
    apply: s => {
      const anchor = '      if (!declared || !declared(e[row.field])) continue';
      if (!s.includes(anchor)) throw new Error('khong tim thay than ham');
      return s.replace(anchor, "      if (row.field === 'runs') continue\n" + anchor);
    },
    expect: 'WI1 hanh vi khop DAC TA viet-truoc',
  },
  {
    name: 'ben doc thoi doc so chay may-viet (bo hang doc run-log)',
    file: CARD_REL,
    apply: s => {
      const a = "read(path.join(dir, 'run-log.jsonl')).split('\\n')";
      if (!s.includes(a)) throw new Error('khong tim thay nhanh doc so chay');
      return s.replace(a, "''.split('\\n')");
    },
    expect: 'WI6 the hien canh bao field-inert',
  },
  {
    name: 'ben doc bo chan cau-inert khoi nhanh phuong-sai',
    file: CARD_REL,
    apply: s => {
      const a = "  if (varr && !carriesInertNote && !/^none/i.test(varr) && !/^\\{\\{/.test(varr)) {";
      if (!s.includes(a)) throw new Error('khong tim thay chan cau-inert');
      return s.replace(a, "  if (varr && !/^none/i.test(varr) && !/^\\{\\{/.test(varr)) {");
    },
    expect: 'WI6 hoi quy [tran]: cau canh bao KHONG deo nhan phuong-sai',
  },
  {
    name: 'ben doc quay ve loc THEO DONG (bi mot lan ngat dong pha)',
    file: CARD_REL,
    apply: s => {
      const a = "  const varr = cleanLines(section(report, 'Variance')).join(' ').trim();\n  const carriesInertNote = varr.includes(INERT_NOTE_PREFIX);";
      if (!s.includes(a)) throw new Error('khong tim thay phep chan nhi phan');
      return s.replace(a,
        "  const varr = cleanLines(section(report, 'Variance')).filter(l => !l.includes(INERT_NOTE_PREFIX)).join(' ').trim();\n"
      + "  const carriesInertNote = false;");
    },
    expect: 'WI6 [ngat dong] KHONG deo nhan phuong-sai cho cau canh bao',
  },
  {
    name: 'ben doc bo duong roi-ve-fields khi dong inert khong co note',
    file: CARD_REL,
    apply: s => {
      const a = "  if (inertLine) {";
      if (!s.includes(a)) throw new Error('khong tim thay nhanh dung dong inert');
      return s.replace(a, "  if (inertLine && inertLine.note) {");
    },
    expect: 'WI6 [dong khong co note] van hien co vang tu fields',
  },
  {
    name: 'ben doc bo LOC THEO VONG (canh bao cu khong bao gio tat)',
    file: CARD_REL,
    apply: s => {
      const a = "  const inertLine = lines.filter(e => e.kind === 'inert' && e.round === maxRound).pop() || null;";
      if (!s.includes(a)) throw new Error('khong tim thay phep loc theo vong');
      return s.replace(a, "  const inertLine = lines.filter(e => e.kind === 'inert').pop() || null;");
    },
    expect: 'WI6 [vong sau da sach] canh bao cu KHONG con hien',
  },
  {
    // AC-16: dot bien o phia VIET (doi cum mo dau cua cau may sinh), case do mong doi
    // nam o phia DOC — case do chay scripts/gate-card.js that va tim cum do trong the.
    name: 'ben VIET doi cum mo dau cua cau canh bao',
    file: WF_REL,
    apply: s => {
      const a = "? 'Field khai mà máy không dùng: ' + inertFields.map(f =>";
      if (!s.includes(a)) throw new Error('khong tim thay cum mo dau ben viet');
      return s.replace(a, "? 'Canh bao: ' + inertFields.map(f =>");
    },
    // AC-16: dot bien o phia VIET, case do mong doi nam o phia DOC (case nay chay
    // scripts/gate-card.js that) — do la bang chung song rang hai dau noi nhau.
    expect: 'WI6 the hien canh bao field-inert',
  },
  {
    name: 'khoi phuc cau mo ta runs cu (khong neu gioi han executor)',
    file: WF_REL,
    apply: s => {
      const re = /\/\/             runs \}\],[^\n]*\n(\/\/ {42}\/\/[^\n]*\n){2}/;
      if (!re.test(s)) throw new Error('khong tim thay khoi mo ta runs');
      return s.replace(re, '//             runs }],  // OPTIONAL int>1: eval ngẫu nhiên (LLM) chạy N lần → pass_rate + variance\n');
    },
    expect: 'WI7 feature-loop/workflows/acceptance-verify.js: mo ta neu gioi han test/script',
  },
];

const runSuite = (dir) => {
  try {
    return { code: 0, out: execFileSync('node', [path.join(dir, TEST_REL)], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { code: e.status ?? 1, out: String(e.stdout || '') + String(e.stderr || '') };
  }
};

const tmp = mkdtempSync(path.join(tmpdir(), 'agk-mut-'));
const WORK = path.join(tmp, 'tree');
let failures = 0;
try {
  execSync(`git -C "${ROOT}" ls-files -z | rsync -a --files-from=- --from0 "${ROOT}/" "${WORK}/"`, { stdio: 'pipe' });

  // (a) ĐỐI CHỨNG DƯƠNG — không có nó thì mọi "đỏ" bên dưới đều vô nghĩa.
  const base = runSuite(WORK);
  if (base.code !== 0) {
    console.log('FAIL: doi chung duong — ban sao NGUYEN VEN da do san, moi ket luan sau deu vo nghia');
    console.log(base.out.split('\n').filter(l => /FAIL|Error/.test(l)).slice(0, 6).join('\n'));
    process.exit(1);
  }
  console.log('PASS: doi chung duong — ban sao nguyen ven XANH');

  const originals = new Map();
  for (const rel of new Set(MUTATIONS.map(m => m.file))) {
    originals.set(rel, readFileSync(path.join(WORK, rel), 'utf8'));
  }

  for (const m of MUTATIONS) {
    const abs = path.join(WORK, m.file);
    try {
      writeFileSync(abs, m.apply(originals.get(m.file)));
    } catch (e) {
      console.log(`FAIL: [${m.name}] buoc tiem that bai — ${e.message}`);
      failures++;
      writeFileSync(abs, originals.get(m.file));
      continue;
    }
    const r = runSuite(WORK);
    writeFileSync(abs, originals.get(m.file)); // khoi phuc truoc dot bien ke
    // (b) GHIM ĐÚNG THÔNG ĐIỆP — exit khac 0 mot minh van xanh khi mot case KHAC do.
    const hit = new RegExp('FAIL: ' + m.expect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(r.out);
    if (r.code !== 0 && hit) {
      console.log(`PASS: [${m.name}] -> DO dung case "${m.expect}"`);
    } else {
      console.log(`FAIL: [${m.name}] -> exit=${r.code}, case mong doi "${m.expect}" ${hit ? 'co' : 'KHONG'} do`);
      failures++;
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log('');
console.log(failures === 0
  ? `Results: ${MUTATIONS.length} dot bien deu bi bat (bang chung phan biet dat)`
  : `Results: ${failures}/${MUTATIONS.length} dot bien KHONG bi bat`);
process.exit(failures === 0 ? 0 : 1);
