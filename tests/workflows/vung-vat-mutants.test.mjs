// vung-vat-mutants.test.mjs — T3 (khoi-tim-loi-tra-phi-theo-vat, AC-5):
// PHÉP VI PHÂN «NGOÀI-VẬT-PHẢI-IM».
//
// Kit đã có phép vi phân một chiều — *phá vật thật thì phép đo phải đỏ* — và nó đo
// ĐỘ NHẠY. Chiều còn lại chưa từng có phép thử: *chạm một thứ KHÔNG phải vật thì phép
// đo phải IM*. Vì thiếu nó, mọi luật về phạm vi của kit không thể sai được trong bất
// kỳ phép đo nào đang chạy — phá `rang-moc.sh` thì finder cũng đỏ, nên nó vẫn «qua»
// nghi thức cũ. Tệp này đóng chiều đó, và tự chứng mình sống bằng mutant: gỡ bộ lọc
// trong một BẢN SAO TRONG BỘ NHỚ (không ghi đè tệp thật) thì chiều im phải ĐỎ.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow, check, summary, TOOL_KILL_RULE_SRC } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');

// Sau ĐỔI KHUÔN 14/09, bên ĐỌC nhận DANH SÁCH tệp chứ không nhận mẫu. Ca vẫn rút mẫu từ
// khối marker của bên VIẾT — nhưng để CHỨNG rằng tệp ca khai là ngoài-vật thật sự khớp
// định nghĩa của bên viết, chứ không phải ca tự bịa ra một định nghĩa thứ hai.
const S4 = readFileSync(path.join(ROOT, 'feature-loop', 'scripts', 's4-args.mjs'), 'utf8');
const HO_SO_GLOBS = (() => {
  const m = S4.match(/const HO_SO_VAN_BAN_GLOBS = \[([^\]]*)\]/);
  if (!m) throw new Error('khong rut duoc HO_SO_VAN_BAN_GLOBS tu s4-args.mjs — khoi marker NGOAI-VAT doi khuon');
  return m[1].split(',').map(x => x.trim().replace(/^'|'$/g, '')).filter(Boolean);
})();

const args = {
  slug: 'demo', round: 1, riskTier: 'T2', diffBase: 'main', repoRoot: '/repo',
  invokedAt: '2026-07-02T10:00:00Z',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' }],
  suiteCommands: [], personasPath: '/refs/p.md', templatePath: '/refs/t.md',
  contractPath: '/repo/_acceptance/demo/contract.md',
  vungVat: ['src/a.js'],
  // ĐỔI KHUÔN 14/09: bên VIẾT truyền DANH SÁCH tệp bị loại, bên ĐỌC chỉ kiểm thuộc-tập.
  ngoaiVatFiles: ['_acceptance/demo/gap-probe.md'],
  fileDoTrongDiff: [],
  toolKillRule: TOOL_KILL_RULE_SRC,
};
const khopMau = (f) => HO_SO_GLOBS.some(g => new RegExp('^' + g.split('**/')
  .map(x => x.split('**').map(y => y.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\?/g, '[^/]').replace(/\*/g, '[^/]*')).join('.*'))
  .join('(?:.*/)?') + '$').test(f));
console.log('VVM-KHAI danh sach ngoai-vat cua ca khop dinh nghia cua ben VIET');
check('VVM-KHAI _acceptance/demo/gap-probe.md la van ban ho so theo marker cua ben viet',
  args.ngoaiVatFiles.every(khopMau), JSON.stringify(args.ngoaiVatFiles));
check('VVM-KHAI doi chung: ma rang KHONG khop mau van ban ho so', !khopMau('_acceptance/demo/rang/a.mjs'));

const F_HO_SO = [{ title: 'ho so', file: '/repo/_acceptance/demo/gap-probe.md', line: 1, severity: 'high', detail: 'y' }];
const F_VAT = [{ title: 'trong vat', file: '/repo/src/a.js', line: 1, severity: 'high', detail: 'x' }];

const respond = (findings) => (c) => {
  if (c.label.startsWith('review:bugs')) return { findings };
  if (c.label.startsWith('review:')) return { findings: [] };
  if (c.label === 'triage') return { contractUnreadable: false, triaged: [] };
  if (c.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
  if (c.label.startsWith('baseline:')) return { results: [] };
  if (c.label.startsWith('refute:')) return { refuted: false, reason: 'that' };
  if (c.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' };
  if (c.label === 'synthesize:report') return { report: '# r', findings: '# f' };
  return null;
};
const triageThay = (calls, chuoi) => {
  const t = calls.find(c => c.label === 'triage');
  return t ? t.prompt.includes(chuoi) : false;
};

console.log('VVM0 doi chung DUONG: ban that van thay finding TRONG vung vat');
{
  const { calls } = await runWorkflow(WF, args, respond(F_VAT));
  check('VVM0 finding trong vung vat DI TIEP toi triage', triageThay(calls, 'trong vat'),
    'ban that nuot ca finding trong vat — bo loc qua tay, ca VVM1 duoi day se vo nghia');
}

console.log('VVM-IM chieu IM: ban that IM tren finding o van ban ho so');
{
  const { calls, logs } = await runWorkflow(WF, args, respond(F_HO_SO));
  check('VVM-IM triage KHONG thay gap-probe.md', !triageThay(calls, 'gap-probe.md'));
  check('VVM-IM log noi ro da bo (khong im lang)', logs.some(l => /bo 1 finding ngoai vat/i.test(l)), logs.join(' | ').slice(0, 200));
}

console.log('VVM1 mutant: go bo loc dau ra -> chieu im phai DO');
{
  const KIM = "const boNgoaiVat = coVungVat ? rawAll.filter(f => f.source !== 'measurement' && laNgoaiVat(relFile(f))) : []";
  check('VVM1 kim mutant CO trong nguon (rang co cho de cam)', SRC.includes(KIM),
    'khong tim thay dong bo loc — hoac ma da doi, hoac rang nay dang do mot thu khong ton tai');
  const mutated = SRC.replace(KIM, 'const boNgoaiVat = []');
  const { calls } = await runWorkflow(WF, args, respond(F_HO_SO), mutated);
  check('VVM1 mutant lam triage THAY gap-probe.md (rang song)', triageThay(calls, 'gap-probe.md'),
    'go bo loc ma chieu im VAN xanh — rang khong phan biet duoc ban lanh voi ban hong');
}

console.log('VVM2 mutant: doi loc LOAI TRU thanh loc BAO GOM -> mat finding lien-file');
{
  // Lỗi bản 1 của chính thiết kế này: giữ-nếu-thuộc-vùng-vật. Nó nuốt lớp «diff đổi
  // chữ ký, caller ở file KHÔNG đổi vỡ» — hôm nay kit bắt được lớp đó.
  const KIM = 'const rawFindings = rawAll.filter(f => !boNgoaiVatSet.has(f))';
  check('VVM2 kim mutant CO trong nguon', SRC.includes(KIM));
  const mutated = SRC.replace(KIM, 'const rawFindings = coVungVat ? rawAll.filter(f => vungVat.includes(relFile(f))) : rawAll');
  const F_LIEN = [{ title: 'lien file', file: '/repo/src/z.js', line: 9, severity: 'high', detail: 'caller vo' }];
  const banThat = await runWorkflow(WF, args, respond(F_LIEN));
  check('VVM2 doi chung duong: ban that GIU finding lien-file', triageThay(banThat.calls, 'lien file'));
  const banMut = await runWorkflow(WF, args, respond(F_LIEN), mutated);
  check('VVM2 mutant (loc bao gom) NUOT finding lien-file — rang song', !triageThay(banMut.calls, 'lien file'),
    'doi sang loc bao gom ma finding lien-file van qua — ca nay khong canh duoc lop do');
}

summary('vung-vat-mutants');
