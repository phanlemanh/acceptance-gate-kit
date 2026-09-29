// msbv-so.test.mjs — hồ sơ mot-so-ba-ve, làn sổ + văn bản (AC-1, AC-7). Tên ca = tên AC.
import { mkdtempSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, SKILL, recipeOf, ghiSo } from './msbv-fixture.mjs';
let pass = 0, fail = 0;
const ok = n => { pass++; console.log(`PASS: ${n} `); };
const bad = (n, m) => { fail++; console.log(`FAIL: ${n} — ${m}`); };
const ca = (n, f) => { try { f(); ok(n); } catch (e) { bad(n, e.message); } };
const die = m => { throw new Error(m); };
const skill = readFileSync(SKILL, 'utf8');

ca('MS-AC1-recipe', () => {
  const L = path.join(mkdtempSync(path.join(tmpdir(), 'msbv-so-')), '_acceptance', 'x', 'decisions.jsonl');
  const a = ghiSo(L, { type: 'approach', stage: 'S3', at: '2026-09-29T00:00:00Z', decision: "chọn A 100% $HOME `x`", why: 'vì B', cost_if_wrong: 'tốn C' });
  const b = ghiSo(L, { type: 'fix', stage: 'S3', at: '2026-09-29T00:00:01Z', decision: 'D', why: 'E', cost_if_wrong: 'F' });
  if (!/^d-\d{8}T\d{6}Z-1$/.test(a.id)) die('id dong 1 sai khuon: ' + a.id);
  if (!/^d-\d{8}T\d{6}Z-2$/.test(b.id)) die('id dong 2 sai khuon: ' + b.id);
  for (const [o, d] of [[a, "chọn A 100% $HOME `x`"], [b, 'D']]) {
    if (o.decision !== d) die('decision ghi sai: ' + o.decision);
    if (!o.why || !o.cost_if_wrong) die('thieu why/cost_if_wrong');
    if ('impact' in o) die('dong moi van co khoa impact');
  }
  // CHIỀU ĐỎ: bản sao SKILL bỏ ô cost_if_wrong khỏi recipe → phải bắt được.
  const mut = skill.replace(',"cost_if_wrong":"<sai thì tốn gì, 1 câu>"', '');
  if (mut === skill) die('kim dot bien cost_if_wrong khong khop trong SKILL');
  const L2 = path.join(mkdtempSync(path.join(tmpdir(), 'msbv-so-')), '_acceptance', 'x', 'decisions.jsonl');
  const c = ghiSo(L2, { type: 'fix', stage: 'S3', at: '2026-09-29T00:00:00Z', decision: 'D', why: 'E', cost_if_wrong: 'F' }, mut);
  if ('cost_if_wrong' in c) die('dot bien khong co tac dung');
  console.log('    · chieu do: recipe thieu cost_if_wrong → dong khong co cost_if_wrong (bat duoc)');
});

ca('MS-AC1-lib-im', () => {
  const require = createRequire(import.meta.url);
  const WR = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));
  const cu = [
    '{"id":"d-1","type":"descope","stage":"S1","at":"2026-09-01T00:00:00Z","decision":"bo X","impact":"y"}',
    '{"id":"d-2","type":"seal","gate":1,"at":"2026-09-01T00:30:00Z"}',
    '{"id":"d-3","type":"veto","stage":"gate2","at":"2026-09-02T00:00:00Z","decision":"ly do","decided_by":"A","decided_at":"2026-09-02T00:00:00Z"}',
  ];
  const moi = [cu[0], '{"id":"d-9","type":"approach","stage":"S1","at":"2026-09-01T00:10:00Z","decision":"q","why":"w","cost_if_wrong":"c"}', cu[1], cu[2],
    '{"id":"d-10","type":"approach","stage":"S3","at":"2026-09-01T01:00:00Z","decision":"q2","why":"w2","source":"superpowers","source_ref":"ws#Ruling:abcd1234"}'];
  const A = cu.join('\n') + '\n', B = moi.join('\n') + '\n';
  if (!Array.isArray(WR.DA_THONG_CONG_2) || WR.DA_THONG_CONG_2.length < 2) die('lib khong xuat DA_THONG_CONG_2 du hai trang thai');
  const kq = t => JSON.stringify({ nghi: WR.hoSoNghi({ ledgerText: t }), thucTe: WR.thucTe(t), khep: WR.DA_THONG_CONG_2.map(st => WR.hoSoDaKhep({ status: st, ledgerText: t })) }); // mọi trạng thái đã thông cổng, rút từ một nguồn của lib
  if (kq(A) !== kq(B)) die(`bo doc lib doi ket qua khi so co dong ba ve:\n A=${kq(A)}\n B=${kq(B)}`);
});

ca('MS-AC7-van-ban', () => {
  const sec = skill.slice(skill.indexOf('## Sổ quyết định'), skill.indexOf('**Rule đáng-log'));
  for (const k of ['decision', 'why', 'cost_if_wrong']) if (!sec.includes(`\`${k}\``) && !sec.includes(`"${k}"`)) die('muc So quyet dinh thieu khoa ' + k);
  if (!/impact[^\n]*đường đọc-cũ/.test(sec)) die('muc So quyet dinh khong noi impact la duong doc-cu');
  const r = recipeOf(skill);
  if (!r.includes('"why"') || !r.includes('"cost_if_wrong"')) die('recipe thieu why/cost_if_wrong');
  if (r.includes('"impact"')) die('recipe con o impact');
  const s3 = skill.slice(skill.indexOf('## S3 — EXECUTE'), skill.indexOf('## S4 — VERIFY'));
  if (s3.split('cau-noi-ruling.mjs').length !== 2) die('S3 phai neu cau-noi-ruling.mjs dung mot lan');
  const card = readFileSync(path.join(ROOT, 'commands', 'acceptance-card.md'), 'utf8');
  if (!card.includes('chỉ phát khoá cho dòng thiếu `why`')) die('acceptance-card.md thieu cau DEC-PLAIN ve dong thieu why');
  // CHIỀU ĐỎ: bản sao SKILL gỡ câu S3 → ca phải đỏ đúng thông điệp.
  const mut = skill.replace(/[^\n]*cau-noi-ruling\.mjs[^\n]*\n/, '\n');
  const s3m = mut.slice(mut.indexOf('## S3 — EXECUTE'), mut.indexOf('## S4 — VERIFY'));
  if (s3m.includes('cau-noi-ruling.mjs')) die('dot bien go cau S3 khong co tac dung');
  console.log('    · chieu do: go cau S3 → «S3 khong neu duong tay» (bat duoc)');
});

console.log(`Results: ${pass} passed, ${fail} failed (msbv-so)`);
process.exit(fail ? 1 : 0);
