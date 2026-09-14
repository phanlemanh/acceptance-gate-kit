// Unit tests for feature-loop/scripts/wf-usage.mjs — fixture transcripts pin:
//   U01 dedupe theo message.id (usage snapshot lớn dần → max per field, KHÔNG cộng dồn)
//   U02 label từ tag [wf-label:] + fallback snippet khi prompt không tag
//   U03 totals per model + --md shape
//   U04 --latest chọn run mtime mới nhất (HOME + cwd giả)
//   U05 dir không tồn tại → exit 2
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, '..', '..', 'feature-loop', 'scripts', 'wf-usage.mjs');

let pass = 0, fail = 0;
const check = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  PASS: ${name}`); }
  else { fail++; console.log(`  FAIL: ${name}${extra ? ` (${extra})` : ''}`); }
};

const T = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-usage-'));
process.on('exit', () => fs.rmSync(T, { recursive: true, force: true }));

const line = (o) => JSON.stringify(o) + '\n';
const user = (text, ts) => line({ type: 'user', timestamp: ts, message: { role: 'user', content: text } });
const asst = (id, model, usage, ts) => line({ type: 'assistant', timestamp: ts, message: { id, model, role: 'assistant', usage } });

function mkRun(dir) {
  fs.mkdirSync(dir, { recursive: true });
  // agent A: tagged, 2 API calls — call m1 ghi 3 dòng (snapshot 5 → 5 → 310), call m2 ghi 1 dòng
  fs.writeFileSync(path.join(dir, 'agent-aaaa1111.jsonl'),
    user('[wf-label: exec:Task 1]\nBan thuc thi MOT task...', '2026-07-23T01:00:00.000Z') +
    asst('m1', 'claude-haiku-4-5', { input_tokens: 100, output_tokens: 5, cache_read_input_tokens: 1000 }, '2026-07-23T01:00:05.000Z') +
    asst('m1', 'claude-haiku-4-5', { input_tokens: 100, output_tokens: 5, cache_read_input_tokens: 1000 }, '2026-07-23T01:00:06.000Z') +
    asst('m1', 'claude-haiku-4-5', { input_tokens: 100, output_tokens: 310, cache_read_input_tokens: 1000, cache_creation_input_tokens: 40 }, '2026-07-23T01:00:07.000Z') +
    asst('m2', 'claude-haiku-4-5', { input_tokens: 50, output_tokens: 20, cache_read_input_tokens: 2000 }, '2026-07-23T01:00:30.000Z'));
  // agent B: KHÔNG tag (fallback snippet), model khác, 1 call
  fs.writeFileSync(path.join(dir, 'agent-bbbb2222.jsonl'),
    user('Ban la judge DOC LAP, context sach, lens duy nhat: intent.', '2026-07-23T01:01:00.000Z') +
    asst('m3', 'claude-fable-5', { input_tokens: 10, output_tokens: 40, cache_read_input_tokens: 500 }, '2026-07-23T01:01:09.000Z'));
  fs.writeFileSync(path.join(dir, 'journal.jsonl'), line({ type: 'started', key: 'v2:x', agentId: 'aaaa1111' }));
}

const RUN = path.join(T, 'wf_test-run');
mkRun(RUN);

const runScript = (args, opts = {}) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', ...opts });

console.log('U01 dedupe theo message.id — max per field, không cộng snapshot');
{
  const r = runScript([RUN, '--json']);
  const j = JSON.parse(r.stdout);
  const a = j.agents.find(x => x.agent === 'aaaa1111');
  check('U01 exit 0', r.status === 0, String(r.status));
  check('U01 calls = distinct ids (2, không phải 4 dòng)', a.calls === 2, String(a.calls));
  check('U01 out = 310+20 (max per id), không phải 5+5+310+20', a.out === 330, String(a.out));
  check('U01 in/cache cũng dedupe', a.in === 150 && a.cacheRead === 3000 && a.cacheCreate === 40, JSON.stringify(a));
  check('U01 duration từ timestamps', a.seconds === 30, String(a.seconds));
}

console.log('U02 label: tag [wf-label:] + fallback snippet');
{
  const j = JSON.parse(runScript([RUN, '--json']).stdout);
  const a = j.agents.find(x => x.agent === 'aaaa1111');
  const b = j.agents.find(x => x.agent === 'bbbb2222');
  check('U02 tagged -> label = exec:Task 1', a.label === 'exec:Task 1', a.label);
  check('U02 không tag -> fallback 48 ký tự đầu prompt', b.label.startsWith('Ban la judge DOC LAP') && b.label.length <= 48, b.label);
}

console.log('U03 totals per model + --md shape');
{
  const j = JSON.parse(runScript([RUN, '--json']).stdout);
  check('U03 totalsByModel haiku', j.totalsByModel['claude-haiku-4-5'].out === 330 && j.totalsByModel['claude-haiku-4-5'].agents === 1);
  check('U03 total gộp 2 model', j.total.agents === 2 && j.total.out === 370 && j.total.calls === 3, JSON.stringify(j.total));
  const md = runScript([RUN, '--md', '--title', 'S4 round 1']).stdout;
  check('U03 md có heading title + runId', md.includes('### S4 round 1 — wf_test-run'), md.split('\n')[0]);
  check('U03 md có bảng + dòng model', md.includes('| exec:Task 1 | claude-haiku-4-5 | 2 | 330 |') && md.includes('- **claude-fable-5**: 1 agent'));
}

console.log('U04 --latest chọn run mtime mới nhất (HOME + cwd giả)');
{
  const home = path.join(T, 'home');
  const cwd = path.join(T, 'repo');
  fs.mkdirSync(cwd, { recursive: true });
  // macOS: /var/folders là symlink → process.cwd() của child trả realpath; slug phải tính từ realpath
  const slug = fs.realpathSync(cwd).replace(/[^A-Za-z0-9]/g, '-');
  const old = path.join(home, '.claude', 'projects', slug, 'sess1', 'subagents', 'workflows', 'wf_old');
  const fresh = path.join(home, '.claude', 'projects', slug, 'sess2', 'subagents', 'workflows', 'wf_fresh');
  mkRun(old); mkRun(fresh);
  const past = new Date('2026-01-01T00:00:00Z');
  fs.utimesSync(path.join(old, 'journal.jsonl'), past, past);
  const r = runScript(['--latest', '--json'], { cwd, env: { ...process.env, HOME: home } });
  check('U04 exit 0', r.status === 0, r.stderr);
  check('U04 chọn wf_fresh', r.status === 0 && JSON.parse(r.stdout).runId === 'wf_fresh', r.status === 0 ? JSON.parse(r.stdout).runId : '(fail)');
}

console.log('U05 dir không tồn tại / thiếu arg → exit 2');
{
  check('U05 dir lạ -> exit 2', runScript([path.join(T, 'khong-co')]).status === 2);
  check('U05 không arg -> exit 2', runScript([]).status === 2);
}

console.log('U06 T0: startAt/endAt + byRole wall — thuoc cho dong 4-5 cua nam dong so');
{
  const j = JSON.parse(runScript([RUN, '--json']).stdout);
  const a = j.agents.find(x => x.agent === 'aaaa1111');
  check('U06 agent co startAt/endAt ISO', a.startAt === '2026-07-23T01:00:00.000Z' && a.endAt === '2026-07-23T01:00:30.000Z', `${a.startAt} -> ${a.endAt}`);
  check('U06 byRole.exec: 1 agent, wall 30s', !!(j.byRole && j.byRole.exec) && j.byRole.exec.agents === 1 && j.byRole.exec.wallSeconds === 30, JSON.stringify(j.byRole));
  check('U06 wallSeconds tong = 69 (01:00:00 -> 01:01:09)', j.wallSeconds === 69, String(j.wallSeconds));
  const md = runScript([RUN, '--md']).stdout;
  check('U06 md co bang wall theo vai tro', md.includes('| vai tro |') && md.includes('| exec |'), md.slice(-300));
}

console.log('U06b T0: agent KHONG co timestamp -> khong nem loi, nhung KHONG im (co so dem)');
{
  // Chống «thước rỗng im lặng»: nếu tên trường thời gian ở harness đổi thì MỌI agent rơi
  // vào nhánh này — script vẫn exit 0, nên phải có số đếm để nói ra.
  const D = path.join(T, 'wf_khong-thoi-gian');
  fs.mkdirSync(D, { recursive: true });
  fs.writeFileSync(path.join(D, 'agent-cccc3333.jsonl'),
    line({ type: 'user', message: { role: 'user', content: '[wf-label: machine:x]\nchay lenh' } }) +
    line({ type: 'assistant', message: { id: 'm9', model: 'claude-haiku-4-5', role: 'assistant', usage: { input_tokens: 1, output_tokens: 2, cache_read_input_tokens: 3 } } }));
  const r = runScript([D, '--json']);
  check('U06b exit 0 (thieu truong phu KHONG lam do mot run)', r.status === 0, String(r.status));
  const j = JSON.parse(r.stdout);
  check('U06b startAt/endAt rong, khong vao byRole', j.agents[0].startAt === '' && Object.keys(j.byRole || {}).length === 0, JSON.stringify(j.byRole));
  check('U06b CO so dem agent khong doc duoc thoi gian', j.agentsKhongCoThoiGian === 1, String(j.agentsKhongCoThoiGian));
}

console.log('U06c T0: tren transcript THAT (do harness Workflow sinh) — khong phai fixture tu dung');
{
  const THAT = path.join(HERE, 'fixtures', 'wf-transcript-that');
  if (!fs.existsSync(THAT)) { check('U06c fixture transcript that CO mat', false, `thieu ${THAT}`); }
  else {
    const r = runScript([THAT, '--json']);
    check('U06c exit 0 tren transcript that', r.status === 0, String(r.status));
    const j = JSON.parse(r.stdout);
    check('U06c it nhat mot agent co startAt hop le', j.agents.some(a => /^\d{4}-\d{2}-\d{2}T/.test(a.startAt)), JSON.stringify(j.agents.map(a => a.startAt)));
    check('U06c wallSeconds > 0', j.wallSeconds > 0, String(j.wallSeconds));
    check('U06c so dem agent thieu thoi gian = 0 (ten truong cua harness van dung)', j.agentsKhongCoThoiGian === 0, String(j.agentsKhongCoThoiGian));
    check('U06c byRole co it nhat mot vai tro', Object.keys(j.byRole || {}).length > 0, JSON.stringify(Object.keys(j.byRole || {})));
  }
}

console.log('U06d T0: nhan vai tro la KHOA KE THUA (__proto__, constructor) khong pha phep dem');
{
  // Nhãn đến từ dữ liệu; object trần trả thứ truthy từ prototype nên phép cộng dồn rơi
  // vào hàm Object và hỏng IM LẶNG. Lượt chấm 1 của hồ sơ khoi-tim-loi bắt.
  const D = path.join(T, 'wf_khoa-ke-thua');
  fs.mkdirSync(D, { recursive: true });
  const mk = (id, label, ts1, ts2) => fs.writeFileSync(path.join(D, `agent-${id}.jsonl`),
    user(`[wf-label: ${label}]\nx`, ts1) + asst('m-' + id, 'claude-haiku-4-5', { input_tokens: 1, output_tokens: 7, cache_read_input_tokens: 2 }, ts2));
  mk('dddd1111', 'constructor:x', '2026-07-23T02:00:00.000Z', '2026-07-23T02:00:10.000Z');
  mk('dddd2222', '__proto__:y', '2026-07-23T02:00:00.000Z', '2026-07-23T02:00:20.000Z');
  mk('dddd3333', 'machine:z', '2026-07-23T02:00:00.000Z', '2026-07-23T02:00:05.000Z');
  const r = runScript([D, '--json']);
  check('U06d exit 0', r.status === 0, String(r.status));
  const j = JSON.parse(r.stdout);
  check('U06d ca ba vai tro co mat, moi vai tro 1 agent',
    j.byRole && j.byRole.constructor && j.byRole.constructor.agents === 1
      && j.byRole['__proto__'] && j.byRole['__proto__'].agents === 1
      && j.byRole.machine && j.byRole.machine.agents === 1,
    JSON.stringify(Object.keys(j.byRole || {})));
  check('U06d wall tung vai tro dung (10s / 20s / 5s)',
    j.byRole.constructor.wallSeconds === 10 && j.byRole['__proto__'].wallSeconds === 20 && j.byRole.machine.wallSeconds === 5,
    JSON.stringify(j.byRole));
  check('U06d khong agent nao bi dem thieu thoi gian', j.agentsKhongCoThoiGian === 0, String(j.agentsKhongCoThoiGian));
}

console.log('U06e T0: mot agent dung HAI model van la MOT agent trong byRole');
{
  // rows có một dòng cho mỗi (agent × model). Đếm dòng rồi gọi là «agents» làm số phồng
  // đúng chỗ owner đọc để quyết cắt (dòng 4-5 của năm dòng số).
  const D = path.join(T, 'wf_hai-model');
  fs.mkdirSync(D, { recursive: true });
  fs.writeFileSync(path.join(D, 'agent-eeee1111.jsonl'),
    user('[wf-label: review:bugs]\nx', '2026-07-23T03:00:00.000Z') +
    asst('n1', 'claude-opus-5', { input_tokens: 1, output_tokens: 10, cache_read_input_tokens: 5 }, '2026-07-23T03:00:05.000Z') +
    asst('n2', 'claude-sonnet-5', { input_tokens: 1, output_tokens: 20, cache_read_input_tokens: 5 }, '2026-07-23T03:00:12.000Z'));
  const j = JSON.parse(runScript([D, '--json']).stdout);
  check('U06e byRole.review.agents = 1 (khong phai 2 dong)', j.byRole.review.agents === 1, JSON.stringify(j.byRole.review));
  check('U06e nhung out van cong du ca hai model (10+20)', j.byRole.review.out === 30, String(j.byRole.review.out));
  check('U06e wall tinh tron agent (12s)', j.byRole.review.wallSeconds === 12, String(j.byRole.review.wallSeconds));
}

console.log('');
console.log(`Results: ${pass} passed, ${fail} failed (wf-usage)`);
if (fail > 0) process.exit(1);
