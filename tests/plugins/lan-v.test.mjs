// Ca của hồ sơ lan-v-khong-phai-cho-ky (LV1–LV7). Mỗi ca dựng fixture CODE-SINH
// từ khuôn canonical, hỏi CẢ HAI bộ đọc (start-scan.mjs + renderProductMap) và
// ghim GIÁ TRỊ của từng bộ đọc trước, rồi mới ghim quan hệ giữa hai bên.
//
// Vì sao không so hai bộ đọc với nhau rồi thôi: hai bên dùng CÙNG một vị từ,
// nên quan hệ luôn khớp bất kể vị từ đúng hay sai — phép so đó xanh theo cấu
// trúc, không theo sự thật (gap-probe P0 của hồ sơ này).
//
// Chạy một phần: LV_CASES=LV1,LV7 node tests/plugins/lan-v.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const { renderProductMap, VETO_OPEN_NOTE } = await import(path.join(ROOT, 'scripts', 'product-map.mjs'));
const { fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));

const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');

let failures = 0;
const only = (process.env.LV_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: ${id} ${name}`);
const fail = (id, msg) => { console.log(`FAIL: ${id} ${msg}`); failures++; };

// Frontmatter hợp đồng rút từ khuôn CANONICAL (bên VIẾT), không gõ tay theo
// khuôn bên đọc — khuôn viết trôi khỏi khuôn đọc thì mọi ca ở đây đỏ, đó là
// mục đích. Hai khoá làn V được TIÊM SAU vì khuôn gốc chưa có chúng (đúng như
// đời thật: nghi thức làn V ghi thêm hai khoá vào frontmatter đã có).
function contractText(slug, { status, veto, opened, tier }) {
  const base = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier: tier, surfaces: 'cli', status },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`);
  const extra = [];
  if (veto !== null && veto !== undefined) extra.push(`veto_state: ${veto}`);
  if (opened !== null && opened !== undefined) extra.push(`veto_opened_at: ${opened}`);
  if (!extra.length) return base;
  return base.replace(/^approved_at:.*$/m, m => [m, ...extra].join('\n'));
}

function mkWorkspace(root, slug, { status, veto, opened, tier, verdict, signoff }) {
  const dir = path.join(root, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'contract.md'), contractText(slug, { status, veto, opened, tier }));
  if (verdict !== null && verdict !== undefined) {
    writeFileSync(path.join(dir, 'evidence-report.md'),
      `---\nschema_version: 1\nslug: ${slug}\nverdict: ${verdict}\n` +
      `verified_commit: ${'0'.repeat(40)}\nhuman_signoff:${signoff ? ' ' + signoff : ''}\n---\n\n# Evidence: ${slug}\n`);
  }
  return dir;
}

function mkRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'lanv-'));
  mkdirSync(path.join(root, '_acceptance'), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\nenforcement: strict\n');
  return root;
}

// Bộ đọc 1 — máy quét vào phiên.
function scan(root) {
  const out = execFileSync('node', [path.join(ROOT, 'scripts', 'start-scan.mjs'), '--root', root], { encoding: 'utf8' });
  const j = JSON.parse(out);
  return {
    gates: new Set((j.groups.gates || []).map(g => g.slug)),
    done: new Map((j.groups.done || []).map(d => [d.slug, d.state])),
    inProgress: new Set((j.groups.inProgress || []).map(p => p.slug)),
    broken: new Set((j.broken || []).map(b => b.slug)),
  };
}

// Bộ đọc 2 — bản đồ sản phẩm.
function mapOf(root, slug) {
  const md = renderProductMap(root);
  let section = null, line = null;
  for (const l of md.split('\n')) {
    if (l.startsWith('## ')) section = l.slice(3).trim();
    else if (l.startsWith('- ') && l.includes(`\`${slug}\``)) { line = l; break; }
  }
  return { section, line, note: line ? line.includes(VETO_OPEN_NOTE) : false };
}

// Số đếm ô «Đã giao» trong khối mermaid. AC-2 hứa một QUAN HỆ (ô tăng 1 khi
// thêm hồ sơ làn V), không phải «có dòng chứa slug dưới heading đúng» — renderer
// sinh đúng dòng mà đếm sai vẫn phải ĐỎ.
function mapDaGiaoCount(root) {
  const m = renderProductMap(root).match(/DG\["Đã giao<br\/>(.+?)"\]/);
  if (!m) return null;
  return m[1] === 'chưa có' ? 0 : Number.parseInt(m[1], 10);
}

const R_PLUS = { status: 'verified', veto: 'mo', opened: '2026-08-21T09:00:00Z', tier: 'T2', verdict: 'PASS', signoff: '' };

if (want('LV1')) {
  const root = mkRepo();
  try {
    const truoc = mapDaGiaoCount(root);
    mkWorkspace(root, 'lv-r-plus', R_PLUS);
    const s = scan(root), m = mapOf(root, 'lv-r-plus'), sau = mapDaGiaoCount(root);
    const errs = [];
    if (truoc === null || sau === null) errs.push('khong doc duoc so dem o mermaid Da giao');
    else if (sau !== truoc + 1) errs.push(`o mermaid Da giao ky vong ${truoc + 1} thuc te ${sau} (dong dung ma dem sai)`);
    if (s.gates.has('lv-r-plus')) errs.push('V-mo PASS T2 van nam trong gates');
    if (s.done.get('lv-r-plus') !== 'lan-v-mo')
      errs.push(`may quet: state ky vong lan-v-mo, thuc te ${s.done.get('lv-r-plus') ?? '(khong co trong done)'}`);
    if (m.section !== 'Đã giao') errs.push(`ban do van xep ${m.section ?? '(khong thay slug)'}`);
    if (!m.note) errs.push(`ban do thieu chu thich "${VETO_OPEN_NOTE}"`);
    if (errs.length) fail('LV1', errs.join(' · '));
    else pass('LV1', 'V-mo PASS T2 -> done lan-v-mo, khong gates (ca hai bo doc)');
  } finally { rmSync(root, { recursive: true, force: true }); }
}

// Bốn ca dưới đây là ĐƯỜNG CŨ phải giữ nguyên — chúng là chỗ vị từ viết rộng
// tay sẽ đỏ. Không có chúng thì LV1 xanh không phân biệt được «bắt đúng» với
// «luôn luôn nói đã giao».
const luatCu = (id, name, over, msgs) => {
  if (!want(id)) return;
  const root = mkRepo();
  try {
    mkWorkspace(root, 'lv-cu', { ...R_PLUS, ...over });
    const s = scan(root), m = mapOf(root, 'lv-cu');
    const errs = [];
    if (s.done.has('lv-cu')) errs.push(`${msgs}: may quet (state ${s.done.get('lv-cu')})`);
    if (!s.gates.has('lv-cu')) errs.push(`may quet: ky vong gates bang-chung, thuc te ${s.done.get('lv-cu') ?? '(khong o dau)'}`);
    if (m.section !== 'Đang làm') errs.push(`${msgs}: ban do (${m.section ?? 'khong thay slug'})`);
    if (m.note) errs.push('ban do van gan chu thich cua veto mo');
    if (errs.length) fail(id, errs.join(' · '));
    else pass(id, name);
  } finally { rmSync(root, { recursive: true, force: true }); }
};

luatCu('LV2', 'go veto_state -> luat cu nguyen van (gates bang-chung, Dang lam)',
  { veto: null, opened: null }, 'luat cu bi doi');

luatCu('LV3', 'da-veto -> KHONG da giao o ca hai bo doc',
  { veto: 'da-veto' }, 'da-veto bi xep da giao');

if (want('LV4')) {
  // Hai biến thể của vết hỏng — V không vết là bỏ-cổng lặng, không phải V.
  const errs = [];
  for (const [ten, val] of [['rong', ''], ['khong-parse', 'hom-qua']]) {
    const root = mkRepo();
    try {
      mkWorkspace(root, 'lv-vet', { ...R_PLUS, opened: val });
      const s = scan(root), m = mapOf(root, 'lv-vet');
      if (s.done.has('lv-vet')) errs.push(`vet hong van da giao: ${ten} may-quet`);
      if (!s.gates.has('lv-vet')) errs.push(`vet hong: ${ten} may-quet khong con o gates`);
      if (m.section !== 'Đang làm' || m.note) errs.push(`vet hong van da giao: ${ten} ban-do (${m.section})`);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
  if (errs.length) fail('LV4', errs.join(' · '));
  else pass('LV4', 'vet gio rong/hong -> luat cu (hai bien the)');
}

luatCu('LV5', 'T3 -> luat cu (lan V chi T2)', { tier: 'T3' }, 'T3 bi xep da giao');

luatCu('LV6', 'PENDING-JUDGMENT duoi V -> van cho Cong Bang chung',
  { verdict: 'PENDING-JUDGMENT' }, 'judgment bi may giao thay');

if (want('LV7')) {
  // BẢNG SỰ-THẬT VIẾT TRƯỚC. KHÔNG phải phép so hai bộ đọc với nhau: hai bên
  // dùng CÙNG một vị từ nên quan hệ luôn khớp bất kể vị từ đúng hay sai — phép
  // so đó xanh theo cấu trúc, không theo sự thật (gap-probe P0). Ở đây mỗi ô có
  // GIÁ TRỊ kỳ vọng viết tay cho TỪNG bộ đọc, so xong mới xét quan hệ.
  const VETO = [
    ['vang',        { veto: null,      opened: null }],
    ['mo-vet-ok',   { veto: 'mo',      opened: '2026-08-21T09:00:00Z' }],
    ['mo-vet-hong', { veto: 'mo',      opened: 'hom-qua' }],
    ['da-veto',     { veto: 'da-veto', opened: '2026-08-21T09:00:00Z' }],
    ['la',          { veto: 'nua-mo',  opened: '2026-08-21T09:00:00Z' }],
  ];
  const VERDICT = [['PASS', 'PASS'], ['PENDING-JUDGMENT', 'PENDING-JUDGMENT'],
                   ['REJECT', 'REJECT'], ['BLOCKED', 'BLOCKED'], ['vang-evidence', null]];
  const HANG = ['T2', 'T3'];
  const KY = [['chua-ky', ''], ['da-ky', 'Manh 2026-08-21']];

  // Kỳ vọng viết tay — nguồn ĐỘC LẬP với vị từ đang kiểm, suy từ LUẬT:
  //  · verified mà vắng evidence-report = hồ sơ hỏng (luật khai-xong-mà-thiếu-file)
  //  · chữ ký thắng: máy quét gọi tên signed-off; bản đồ đọc status hợp đồng
  //    (vẫn verified) nên giữ ô cũ — điều PHẢI đúng ở mọi ô có chữ ký là:
  //    không ô nào được mang chú thích cửa-veto-mở
  //  · đúng MỘT ô là đã giao: V mở + vết đọc được + PASS + T2 + chưa ký
  //  · verdict chưa chốt (REJECT/BLOCKED) = việc đang dở, không phải cổng
  const kyVong = (veto, verdict, hang, ky) => {
    if (verdict === null) return { scan: 'broken', map: 'Hồ sơ hỏng', note: false };
    if (ky !== '')        return { scan: 'signed-off', map: 'Đang làm', note: false };
    if (veto === 'mo-vet-ok' && verdict === 'PASS' && hang === 'T2')
      return { scan: 'lan-v-mo', map: 'Đã giao', note: true };
    if (verdict === 'PASS' || verdict === 'PENDING-JUDGMENT')
      return { scan: 'gates', map: 'Đang làm', note: false };
    return { scan: 'inProgress', map: 'Đang làm', note: false };
  };

  const errs = [];
  let oDem = 0, oDaGiao = 0;
  for (const [bTen, bOver] of VETO)
    for (const [cTen, cVal] of VERDICT)
      for (const dVal of HANG)
        for (const [eTen, eVal] of KY) {
          oDem++;
          const root = mkRepo();
          try {
            mkWorkspace(root, 'lv-o', { status: 'verified', ...bOver, tier: dVal, verdict: cVal, signoff: eVal });
            const kv = kyVong(bTen, cVal, dVal, eVal);
            if (kv.note) oDaGiao++;
            const s = scan(root), m = mapOf(root, 'lv-o');
            const toa = `(veto=${bTen}, verdict=${cTen}, hang=${dVal}, ky=${eTen})`;
            const thucTe = s.broken.has('lv-o') ? 'broken'
              : s.gates.has('lv-o') ? 'gates'
              : s.inProgress.has('lv-o') ? 'inProgress'
              : (s.done.get('lv-o') ?? '(khong o dau)');
            if (thucTe !== kv.scan) errs.push(`${toa} may-quet ky vong ${kv.scan} thuc te ${thucTe}`);
            const mSec = m.section ?? '(khong thay slug)';
            if (mSec !== kv.map) errs.push(`${toa} ban-do ky vong ${kv.map} thuc te ${mSec}`);
            if (m.note !== kv.note) errs.push(`${toa} ban-do chu thich ky vong ${kv.note} thuc te ${m.note}`);
          } finally { rmSync(root, { recursive: true, force: true }); }
        }
  if (oDem !== 100) errs.push(`so o dem duoc ${oDem} != 100 khai truoc`);
  if (oDaGiao !== 1) errs.push(`bang ky vong co ${oDaGiao} o da giao, khai truoc dung 1`);
  if (errs.length) fail('LV7', `${errs.length} o lech — ${errs.slice(0, 5).join(' · ')}`);
  else pass('LV7', `bang su-that ${oDem} o: dung 1 o da giao, 99 o khong, hai bo doc khop`);
}

process.exit(failures ? 1 : 0);
