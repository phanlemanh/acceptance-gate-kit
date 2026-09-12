// Bộ sinh fixture của hồ sơ cua-veto-sau-chu-ky.
//
// Ba luật của kit mà tệp này phải giữ:
//  (a) fixture do CODE sinh trong chính lần chạy, không chép tay;
//  (b) mọi đường dẫn suy từ VỊ TRÍ script, không hardcode gốc kho;
//  (c) khuôn của bên VIẾT rút từ chính khuôn ấy (dòng human_signoff mặc định rút
//      từ evidence-report-template.md; bảng giữ-chỗ rút từ hàm placeholder_signoff
//      của lưới) — không gõ lại theo trí nhớ.
//
// Dùng chung cho răng hồ sơ (rang.sh) và ca thường trực tests/scripts/.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');
export const CAU_GHIM = 'cửa veto đã đóng bằng chữ ký';
export const CAU_MO = 'cửa veto mở';
export const DONG_TONG = 'cửa veto đang mở';

// ── khuôn bên VIẾT ──────────────────────────────────────────────────────────
export function templateSignoffLine() {
  const tpl = path.join(ROOT, 'skills/acceptance/references/evidence-report-template.md');
  const line = readFileSync(tpl, 'utf8').split('\n').find(l => l.startsWith('human_signoff:'));
  if (!line) throw new Error('khuôn bên viết không còn dòng human_signoff');
  return line;
}

// Bảng giữ-chỗ RÚT từ khối `case` trong hàm placeholder_signoff của lưới.
// Trả về [{ mau, tienTo }] — `tienTo` true nghĩa là bash khớp theo tiền tố (`tbd*`).
export function placeholderPatterns() {
  const src = readFileSync(path.join(ROOT, 'scripts/pre-merge-check.sh'), 'utf8');
  const fn = src.match(/placeholder_signoff\(\)[\s\S]*?\n\}/);
  if (!fn) throw new Error('không rút được hàm placeholder_signoff');
  const body = fn[0].match(/case[\s\S]*?esac/);
  if (!body) throw new Error('không rút được khối case của placeholder_signoff');
  const out = [];
  for (const line of body[0].split('\n')) {
    const m = line.match(/^\s*(\S.*?)\)\s*return 0\s*;;/);
    if (!m) continue;
    // KHÔNG tách theo `|`: nhánh '>'|'|'|'-' mang chính dấu ngăn BÊN TRONG nháy.
    // Quét token: chuỗi trong nháy đơn, hoặc chữ liền, rồi cờ `*` nếu có.
    for (const t of m[1].matchAll(/'([^']*)'(\*)?|([^|\s'*]+)(\*)?/g)) {
      const mau = t[1] !== undefined ? t[1] : t[3];
      const tienTo = Boolean(t[2] || t[4]);
      if (mau !== '') out.push({ mau, tienTo });
    }
  }
  if (out.length < 3) throw new Error(`bảng mẫu rút hụt: ${out.length}`);
  return out;
}

// Giá trị chữ ký THỬ cho mỗi mẫu giữ-chỗ: mẫu tiền tố thì nối thêm đuôi để chứng
// phép khớp là TIỀN TỐ chứ không phải bằng-nhau; '<' thành một giữ-chỗ khuôn thật.
export const giaTriGiuCho = p =>
  p.mau === '<' ? '<name> <date>' : (p.tienTo ? `${p.mau} 2026-09-11` : p.mau);

// ── ba trục ─────────────────────────────────────────────────────────────────
// `dung: true` = cửa veto còn MỞ (chữ ký không phải chữ ký thật)
export const SIGNOFF_CELLS = [
  { ten: 'that-tran',         dong: 'human_signoff: Manh Phan 2026-09-11',       dung: false },
  { ten: 'that-nhay-kep',     dong: 'human_signoff: "Manh Phan 2026-09-11"',     dung: false },
  { ten: 'that-nhay-don',     dong: "human_signoff: 'Manh Phan 2026-09-11'",     dung: false },
  { ten: 'that-chu-thich',    dong: 'human_signoff: Manh Phan 2026-09-11  # ky', dung: false },
  { ten: 'giu-cho-tran',      dong: 'human_signoff: TBD',                        dung: true },
  { ten: 'giu-cho-nhay-kep',  dong: 'human_signoff: "TBD"',                      dung: true },
  { ten: 'giu-cho-nhay-don',  dong: "human_signoff: 'TBD'",                      dung: true },
  { ten: 'giu-cho-chu-thich', dong: 'human_signoff: TBD  # cho Manh',            dung: true },
  { ten: 'rong-khuon',        dong: null,                                        dung: true },
  { ten: 'chi-chu-thich',     dong: 'human_signoff:   # chua ky',                dung: true },
  { ten: 'bao-cao-vang',      dong: undefined,                                   dung: true },
  { ten: 'chi-o-than',        dong: 'human_signoff:',                            dung: true },
  { ten: 'frontmatter-hong',  dong: 'human_signoff: Manh Phan 2026-09-11',       dung: true },
];

export const VETO_CELLS = [
  { ten: 'vang',    veto: null,      opened: null },
  { ten: 'mo',      veto: 'mo',      opened: '2026-09-01T10:00:00Z' },
  { ten: 'da-veto', veto: 'da-veto', opened: '2026-09-01T10:00:00Z' },
];
export const CONG1_CELLS = [
  { ten: 'co-ten', approvedBy: 'Manh Phan' },
  { ten: 'rong',   approvedBy: '' },
];

export const MO = VETO_CELLS[1];
export const CO_TEN = CONG1_CELLS[0];
export const RONG = CONG1_CELLS[1];
export const o = ten => {
  const c = SIGNOFF_CELLS.find(x => x.ten === ten);
  if (!c) throw new Error(`không có ô chữ ký ${ten}`);
  return c;
};

export function cells() {
  const out = [];
  for (const v of VETO_CELLS) for (const g of CONG1_CELLS) for (const s of SIGNOFF_CELLS)
    out.push({ ten: `${v.ten}-${g.ten}-${s.ten}`, veto: v, cong1: g, chuKy: s });
  return out;   // 3 × 2 × 13 = 78
}

// Cửa veto MỞ thật theo luật của hồ sơ: veto_state mo ∧ chữ ký không thật.
export const moThat = c => c.veto.veto === 'mo' && c.chuKy.dung;

// ── kho git fixture ─────────────────────────────────────────────────────────
export const headSha = repo =>
  execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

export const gitAll = (repo, msg) => execFileSync('bash', ['-c',
  `cd "${repo}" && git add -A && git -c user.email=t@t -c user.name=T commit -qm ${JSON.stringify(msg)}`]);

// Chép TRỌN thư mục scripts + lib của cây đang kiểm (P150: không chép danh sách
// file tay — vật được đo gọi thêm một script mới là bản sao thiếu file).
export function mkRepo(kitRoot = ROOT) {
  const d = mkdtempSync(path.join(tmpdir(), 'cvsck-'));
  execFileSync('bash', ['-c',
    `cd "${kitRoot}" && tar -cf - --exclude=.git --exclude=.worktrees --exclude=.claude scripts lib | tar -x -C "${d}"`]);
  mkdirSync(path.join(d, '_acceptance'), { recursive: true });
  writeFileSync(path.join(d, '_acceptance/config.yaml'),
    'schema_version: 1\nenforcement: strict\nsignoff:\n  required_for: [T2, T3]\n');
  execFileSync('bash', ['-c',
    `cd "${d}" && git init -q . && git add -A && git -c user.email=t@t -c user.name=T commit -qm base`]);
  return d;
}

// Dựng bản sao kho kit để TIÊM đột biến vào vật thật (chiều đỏ). Trả về gốc bản sao.
export function mkKitCopy(kitRoot = ROOT) {
  const d = mkdtempSync(path.join(tmpdir(), 'cvsck-kit-'));
  execFileSync('bash', ['-c',
    `cd "${kitRoot}" && tar -cf - --exclude=.git --exclude=.worktrees --exclude=.claude scripts lib | tar -x -C "${d}"`]);
  return d;
}

export function writeDossier(repo, slug, spec) {
  const dir = path.join(repo, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  const fm = ['---', 'schema_version: 1', `feature: ${slug}`, `slug: ${slug}`,
    'owner: o', `risk_tier: ${spec.tier || 'T2'}`, 'surfaces: [cli]',
    `status: ${spec.status || 'verified'}`, `approved_by: ${spec.cong1.approvedBy}`,
    'approved_at: 2026-09-01'];
  if (spec.veto.veto) {
    fm.push(`veto_state: ${spec.veto.veto}`);
    if (spec.veto.opened) fm.push(`veto_opened_at: ${spec.veto.opened}`);
  }
  fm.push('---', '', '# c', '');
  writeFileSync(path.join(dir, 'contract.md'), fm.join('\n'));
  const c = spec.chuKy;
  if (c.dong === undefined) return dir;                      // ô «báo cáo vắng»
  const sig = c.dong === null ? templateSignoffLine() : c.dong;
  const than = c.ten === 'chi-o-than'
    ? '\n## Ghi chú\n\nTrích khuôn:\n\n    human_signoff: Manh Phan 2026-09-11\n' : '';
  const head = ['---', 'schema_version: 1', `slug: ${slug}`, 'verdict: PASS',
    'enforcement_mode: strict', 'bypass_used: false',
    `verified_commit: ${spec.sha || headSha(repo)}`, sig, '---'];
  const body = `\n## Evidence\n\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: config:executors.test.scripts\n  verified_at: 2026-09-01\n\n## Known limits\n\n\n## Ngoài hợp đồng\n${than}\n`;
  const txt = c.ten === 'frontmatter-hong'
    ? `# tieu de truoc frontmatter\n\n${head.join('\n')}${body}`   // frontmatter KHÔNG dẫn đầu
    : head.join('\n') + body;
  writeFileSync(path.join(dir, 'evidence-report.md'), txt);
  return dir;
}

// ── hai bộ đọc ──────────────────────────────────────────────────────────────
export function runPremerge(repo, kitRoot = repo) {
  const r = execFileSync('bash', ['-c',
    `cd "${repo}" && bash "${kitRoot}/scripts/pre-merge-check.sh" . --base "$(git -C "${repo}" rev-parse HEAD)" 2>&1; echo "__MA__$?"`],
    { encoding: 'utf8', maxBuffer: 1e8 });
  const i = r.lastIndexOf('__MA__');
  return { out: r.slice(0, i), code: Number(r.slice(i + 6).trim()) };
}

export function runScan(repo, kitRoot = repo) {
  return JSON.parse(execFileSync('node',
    [path.join(kitRoot, 'scripts/start-scan.mjs'), '--root', repo],
    { encoding: 'utf8', maxBuffer: 1e8 }));
}

export function tenDongTong(out) {
  const l = out.split('\n').find(x => x.includes(DONG_TONG));
  if (!l) return [];
  const sau = l.split('chưa veto:')[1];
  return sau ? sau.trim().split(/\s+/).filter(Boolean).sort() : [];
}

export const soDongTong = out => {
  const l = out.split('\n').find(x => x.includes(DONG_TONG));
  const m = l && l.match(/mở — (\d+) hồ sơ/);
  return m ? Number(m[1]) : -1;
};

export const dongViPham = out =>
  out.split('\n').filter(l => l.startsWith('VIOLATION ')).sort();
export const dongNote = out =>
  out.split('\n').filter(l => l.startsWith('NOTE ')).sort();

// ── tự kiểm của chính bộ sinh ───────────────────────────────────────────────
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const c = cells();
  if (c.length !== 78) { console.error(`so o ${c.length}`); process.exit(1); }
  const mau = placeholderPatterns();
  const sig = templateSignoffLine();
  console.log(`OK fixture ${c.length} ô · ${mau.length} mẫu giữ-chỗ: ${mau.map(x => x.mau + (x.tienTo ? '*' : '')).join(' ')}`);
  console.log(`dòng khuôn: ${sig}`);
}
