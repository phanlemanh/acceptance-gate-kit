// msbv-the.test.mjs — hồ sơ mot-so-ba-ve, làn thẻ (AC-2, AC-3, AC-4, AC-9 + tệp đầu vào AC-8). Tên ca = tên AC.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { mkWs, card, extract, G1, G2, REVIEW2, PROBE, ROOT, GC, SRC } from './gate-fixture.mjs';
import { ghiSo } from './msbv-fixture.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHA_NEN = '705077e53764e482593fb47c68a5f9e9034091f3'; // git rev-parse origin/main 29/09, trước vòng mot-so-ba-ve
let pass = 0, fail = 0;
const ca = (n, f) => { try { f(); pass++; console.log(`PASS: ${n} `); } catch (e) { fail++; console.log(`FAIL: ${n} — ${e.message}`); } };
const die = m => { throw new Error(m); };
const J = o => JSON.stringify(o);
const BA = (id, d, w, c) => J({ id, type: 'approach', stage: 'S1', at: '2026-09-29T00:00:00Z', decision: d, why: w, ...(c ? { cost_if_wrong: c } : {}) });
const CU = (id, d, i) => J({ id, type: 'fix', stage: 'S1', at: '2026-09-29T00:00:00Z', decision: d, impact: i });
const SEAL = J({ id: 'd-seal', type: 'seal', gate: 1, at: '2026-09-29T00:30:00Z' });
const text = html => html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean).join('\n');
const khoi = (html, nhan) => { const i = html.indexOf(`<div class="lab">${nhan}`); if (i < 0) return null; const j = html.indexOf('<div class="lab">', i + 10); return html.slice(i, j < 0 ? undefined : j); };
const g2 = (ledger, plain) => { const f = G2(REVIEW2); f['decisions.jsonl'] = ledger; f['gap-probe.md'] = PROBE('clean'); if (plain) f['card-plain.json'] = J(plain); return f; };
const render = (root, slug, gc = GC, plain = true) => spawnSync('node', [gc, '--root', root, '--slug', slug, ...(plain && existsSync(path.join(root, '_acceptance', slug, 'card-plain.json')) ? ['--plain', path.join(root, '_acceptance', slug, 'card-plain.json')] : [])], { encoding: 'utf8' });
const banSao = mutate => { const d = mkdtempSync(path.join(tmpdir(), 'msbv-gc-')); cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true }); cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true }); const p = path.join(d, 'scripts', 'gate-card.js'); const s = readFileSync(p, 'utf8'); const m = mutate(s); if (m === s) die('kim dot bien khong khop'); writeFileSync(p, m); return p; };
const BA_VE = s => `D${s} — W${s} — sai thì tốn: C${s}`;

ca('MS-AC2-ba-khoi', () => {
  const plain = { decisions_plain: [{ id: 'd-a', p: 'CAU OVERLAY A' }, { id: 'd-b', p: 'CAU OVERLAY B' }] };
  // Cổng 2: d-a trước seal (Đã duyệt), d-b sau seal (Treo)
  const r2 = mkWs('g', g2([BA('d-a', 'Da', 'Wa', 'Ca'), SEAL, BA('d-b', 'Db', 'Wb', 'Cb')].join('\n') + '\n', plain));
  const h2 = render(r2, 'g').stdout;
  const treo = khoi(h2, 'Quyết định CHƯA duyệt'), duyet = khoi(h2, 'Đã duyệt từ Gate 1');
  if (!treo || !duyet) die('thieu khoi Treo hoac Da duyet');
  if (!duyet.includes('Da — Wa — sai thì tốn: Ca')) die('khoi Da duyet khong in ba ve');
  if (!treo.includes('Db — Wb — sai thì tốn: Cb')) die('khoi Treo khong in ba ve');
  if (h2.includes('CAU OVERLAY')) die('overlay hien cho dong ba ve');
  // Cổng 1: hồ sơ chưa seal
  const f1 = G1(PROBE('clean')); f1['decisions.jsonl'] = BA('d-a', 'Da', 'Wa', 'Ca') + '\n'; f1['card-plain.json'] = J(plain);
  const r1 = mkWs('g', f1); const h1 = render(r1, 'g').stdout;
  if (!h1.includes('Da — Wa — sai thì tốn: Ca')) die('khoi Cong 1 khong in ba ve');
  if (h1.includes('CAU OVERLAY')) die('overlay hien o Cong 1 cho dong ba ve');
});

ca('MS-AC2-dot-bien', () => { // CHIỀU ĐỎ trên CÙNG fixture của MS-AC2-ba-khoi
  const r2 = mkWs('g', g2([BA('d-a', 'Da', 'Wa', 'Ca'), SEAL, BA('d-b', 'Db', 'Wb', 'Cb')].join('\n') + '\n'));
  if (!(khoi(render(r2, 'g').stdout, 'Quyết định CHƯA duyệt') || '').includes('Db — Wb — sai thì tốn: Cb')) die('doi chung duong: ban lanh khong xanh');
  const gc = banSao(s => s.replace("if (coBaVe(e)) {", "if (false) {"));
  if ((khoi(render(r2, 'g', gc).stdout, 'Quyết định CHƯA duyệt') || '').includes('Db — Wb — sai thì tốn: Cb')) die('dot bien go nhanh ba ve khong co tac dung'); // so CÙNG chuỗi với đối chứng dương: decLine vẫn in «Db — sai thì tốn: Cb» cho dòng chỉ có giá
  console.log('    · chieu do: go nhanh ba ve → «khối Quyết định CHƯA duyệt không in ba vế» (bat duoc)');
});

ca('MS-AC3-doc-cu', () => {
  const plain = { decisions_plain: [{ id: 'd-1', p: 'DICH MOT' }, { id: 'd-3', p: 'DICH BA' }] };
  const L = [CU('d-1', 'cu mot', 'i1'), CU('d-2', 'cu hai', 'i2'), SEAL, CU('d-3', 'cu ba', 'i3'), CU('d-4', 'cu bon', 'i4')].join('\n') + '\n';
  const h = render(mkWs('g', g2(L, plain)), 'g').stdout;
  const duyet = khoi(h, 'Đã duyệt từ Gate 1'), treo = khoi(h, 'Quyết định CHƯA duyệt');
  if (!duyet.includes('DICH MOT')) die('khoi da duyet khong tra decisions_plain');
  if (!duyet.includes('cu hai — i2')) die('khoi da duyet mat chu goc dong khong dich');
  if (!treo.includes('DICH BA') || !treo.includes('cu bon — i4')) die('khoi Treo sai duong doc-cu');
});

ca('MS-AC3-dot-bien', () => { // CHIỀU ĐỎ trên CÙNG fixture của MS-AC3-doc-cu
  const plain = { decisions_plain: [{ id: 'd-1', p: 'DICH MOT' }, { id: 'd-3', p: 'DICH BA' }] };
  const L = [CU('d-1', 'cu mot', 'i1'), CU('d-2', 'cu hai', 'i2'), SEAL, CU('d-3', 'cu ba', 'i3'), CU('d-4', 'cu bon', 'i4')].join('\n') + '\n';
  if (!(khoi(render(mkWs('g', g2(L, plain)), 'g').stdout, 'Đã duyệt từ Gate 1') || '').includes('DICH MOT')) die('doi chung duong: ban lanh khong xanh');
  const gc = banSao(s => s.replace('${decSort(decsApproved).map(e => `<p class="li">${decBaVe(e)}</p>`)', '${decSort(decsApproved).map(e => `<p class="li">${decLine(e)}</p>`)'));
  if ((khoi(render(mkWs('g', g2(L, plain)), 'g', gc).stdout, 'Đã duyệt từ Gate 1') || '').includes('DICH MOT')) die('dot bien khong co tac dung');
  console.log('    · chieu do: go tra overlay o khoi da duyet → «khối đã duyệt không tra decisions_plain» (bat duoc)');
});

ca('MS-AC3-nen', () => {
  const head = spawnSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  if (head === SHA_NEN) die('nền trùng HEAD — đối chứng rỗng');
  const d = mkdtempSync(path.join(tmpdir(), 'msbv-nen-'));
  const a = spawnSync('bash', ['-c', `git -C "${ROOT}" archive ${SHA_NEN} scripts lib | tar -x -C "${d}"`], { encoding: 'utf8' });
  if (a.status !== 0) die(`nền dựng lỗi: ${a.status} ${a.stderr.split('\n')[0]}`);
  const plain = { decisions_plain: [{ id: 'd-3', p: 'DICH BA' }] };
  const L = [CU('d-1', 'cu mot', 'i1'), SEAL, CU('d-3', 'cu ba', 'i3'), CU('d-4', 'cu bon', 'i4')].join('\n') + '\n';
  const r = mkWs('g', g2(L, plain));
  const nen = render(r, 'g', path.join(d, 'scripts', 'gate-card.js'));
  if (nen.status !== 0) die(`nền dựng lỗi: ${nen.status}`);
  const tNen = khoi(nen.stdout, 'Quyết định CHƯA duyệt'), tNay = khoi(render(r, 'g').stdout, 'Quyết định CHƯA duyệt');
  if (!tNen) die('nền dựng lỗi: khối Treo rỗng');
  if (tNen !== tNay) die(`khoi Treo lech ban nen:\n nen=${tNen}\n nay=${tNay}`);
});

ca('MS-AC4-thieu-gia', () => {
  const L = [SEAL, BA('d-a', 'Da', 'Wa', 'Ca'), BA('d-b', 'Db', 'Wb', null)].join('\n') + '\n';
  const h = render(mkWs('g', g2(L)), 'g').stdout;
  const n = h.split('chưa khai giá nếu sai').length - 1;
  if (n !== 1) die(`nhan thieu gia xuat hien ${n} lan`);
  const dong = h.split('<div class="item">').find(x => x.includes('Db — Wb'));
  if (!dong || !dong.includes('chưa khai giá nếu sai')) die('dòng thiếu giá không mang nhãn');
  const dongDu = h.split('<div class="item">').find(x => x.includes('Da — Wa'));
  if (dongDu.includes('chưa khai giá nếu sai')) die('dong du ba ve mang nhan');
  const gc = banSao(s => s.replace(" <b>⚠ chưa khai giá nếu sai</b>", ''));
  if (render(mkWs('g', g2(L)), 'g', gc).stdout.includes('chưa khai giá nếu sai')) die('dot bien khong co tac dung');
  console.log('    · chieu do: go nhan → «dòng thiếu giá không mang nhãn» (bat duoc)');
});

ca('MS-AC4-chi-gia', () => { // Review Focus 3: dòng có giá mà không có vì-sao vẫn in giá
  const L = [SEAL, J({ id: 'd-c', type: 'approach', stage: 'S3', at: '2026-09-29T00:00:00Z', decision: 'Dc', cost_if_wrong: 'Cc' })].join('\n') + '\n';
  const h = render(mkWs('g', g2(L)), 'g').stdout;
  if (!h.includes('Dc — sai thì tốn: Cc')) die('dong chi co gia mat gia tren the');
});

ca('MS-AC8-xuat', () => {
  const L = [CU('d-1', 'Bỏ bước tự dịch cho dòng cũ', 'đổi lại người đọc chữ gốc'), SEAL,
    BA('d-2', 'Chặn lệnh xoá thư mục tạm cho tới khi đã gặt quyết định', 'thư mục bị xoá trước bước cuối thi công', 'một hook chạy trên mọi lệnh shell'),
    BA('d-3', 'In quyết định thành một dòng ba vế', 'người ký cần biết giá để quyết có lật không', 'một câu dài hơn trên thẻ'),
    BA('d-4', 'Giữ quyết định chưa khai giá và gắn nhãn', 'giới hạn là nhãn trạng thái, không phải việc', null)].join('\n') + '\n';
  const plain = { decisions_plain: [{ id: 'd-1', p: 'KHÔNG tự dịch dòng cũ — người đọc chữ gốc của sổ.' }] };
  const h = render(mkWs('g', g2(L, plain)), 'g').stdout;
  const bam = createHash('sha256').update(L).digest('hex');
  const noiDung = `# fixture sha256 ${bam} · at 2026-09-29T00:00:00Z\n` + text((khoi(h, 'Quyết định CHƯA duyệt') || '') + (khoi(h, 'Đã duyệt từ Gate 1') || '')) + '\n';
  const out = path.join(HERE, '..', '..', '_acceptance', 'mot-so-ba-ve', 'evidence', 'the-cong-2-ba-ve.txt');
  mkdirSync(path.dirname(out), { recursive: true });
  if (!existsSync(out) || readFileSync(out, 'utf8') !== noiDung) writeFileSync(out, noiDung);  // ghi chỉ khi khác: không chạm mtime hồ sơ khi vật không đổi
  if (readFileSync(out, 'utf8') !== noiDung) die('tep dau vao AC-8 khong bang ban dung tu code hien tai');
  if (!/^# fixture sha256 [0-9a-f]{64} · at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z\n/.test(noiDung)) die('dong dau sai khuon');
});

ca('MS-AC9-extract', () => {
  const f1 = G1(PROBE('clean'));
  f1['decisions.jsonl'] = [BA('d-a', 'Da', 'Wa', 'Ca'), CU('d-b', 'cu', 'i'), BA('d-c', 'Dc', 'Wc', null), CU('d-d', 'cu2', 'i2')].join('\n') + '\n';
  const x = extract(mkWs('g', f1), 'g');
  const ids = x.decisions.map(e => e.key).sort();
  if (J(ids) !== J(['d-b', 'd-d'])) die('extract xin dich dong da ba ve: ' + J(ids));
  if (SRC.split('const decKey = e =>').length !== 2) die('DEC-PLAIN-KEY khong con mot ham');
});

ca('MS-AC9-dot-bien', () => { // CHIỀU ĐỎ trên CÙNG fixture của MS-AC9-extract
  const f1 = G1(PROBE('clean'));
  f1['decisions.jsonl'] = [BA('d-a', 'Da', 'Wa', 'Ca'), CU('d-b', 'cu', 'i'), BA('d-c', 'Dc', 'Wc', null), CU('d-d', 'cu2', 'i2')].join('\n') + '\n';
  if (extract(mkWs('g', f1), 'g').decisions.length !== 2) die('doi chung duong: ban lanh khong xanh');
  const gc = banSao(s => s.replace('decisions: decsAll.filter(e => !coBaVe(e)).map(', 'decisions: decsAll.map('));
  const xm = JSON.parse(spawnSync('node', [gc, '--root', mkWs('g', f1), '--slug', 'g', '--extract'], { encoding: 'utf8' }).stdout);
  if (xm.decisions.length !== 4) die('dot bien khong co tac dung');
  console.log('    · chieu do: bo loc → «extract xin dịch dòng đã ba vế» (bat duoc)');
});

ca('MS-AC2-recipe', () => {
  const r = mkWs('g', g2(J({ id: 'd-s', type: 'seal', gate: 1, at: '2026-09-29T00:00:00Z' }) + '\n', null));
  ghiSo(path.join(r, '_acceptance', 'g', 'decisions.jsonl'), { type: 'approach', stage: 'S3', at: '2026-09-29T00:01:00Z', decision: 'Dr', why: 'Wr', cost_if_wrong: 'Cr' });
  if (!(khoi(render(r, 'g').stdout, 'Quyết định CHƯA duyệt') || '').includes('Dr — Wr — sai thì tốn: Cr')) die('dong ghi bang recipe khong in ba ve tren the');
});

console.log(`Results: ${pass} passed, ${fail} failed (msbv-the)`);
process.exit(fail ? 1 : 0);
