// t3-can-ho-so-arm.test.mjs — PR đổi code t3_paths không được qua cổng nhờ một hồ sơ không arm cổng cho code đó.
// Gốc: kiểm cài kit ở onehub-inventory (2.38.0), ma trận 15 ca merge-gate, hai ca lọt: (1) hợp đồng không frontmatter,
// (2) hợp đồng `risk_tier: T1` + `status: verified`; cả hai `pre-merge-check: clean` trên code t3_paths.
// Tên ca = «HA<k>-do» (chiều đỏ, phải chặn) · «HA<k>-im» (chiều im, không được chặn thêm) · «HA<k>-mut» (đột biến).
//   Đỏ  ghim mã thoát + ĐÚNG thông điệp + lý do của từng hồ sơ + tên tệp T3.
//   Im  ghim mã thoát 0 + dòng `pre-merge-check: clean`, hoặc lời phán đúng của luật khác.
//   Đột biến chạy CHÍNH fixture của một ca, trên bản sao trọn thư mục bị tiêm đúng một kim, sau khi bản chưa tiêm đã
//   cho kết quả mong đợi — bản đồ ca và kỳ vọng viết trước, không tính từ mã sản phẩm.
// Fixture do CODE SINH trong lượt: hợp đồng rút CONTRACT-FRONTMATTER-TEMPLATE; đường dẫn suy từ vị trí tệp.
// Chọn ca: đối số dòng lệnh (`node t3-can-ho-so-arm.test.mjs HA2-do`) hoặc HA_CASES=a,b.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'ha-'));
let pass = 0; let fail = 0;
const CHON = [...process.argv.slice(2), ...(process.env.HA_CASES ? process.env.HA_CASES.split(',') : [])];
const ca = (name, fn) => {
  if (CHON.length && !CHON.includes(name)) return;
  try {
    const sai = fn();
    if (sai) { fail += 1; console.log(`FAIL: ${name} — ${sai}`); } else { pass += 1; console.log(`PASS: ${name}`); }
  } catch (e) { fail += 1; console.log(`FAIL: ${name} — ${String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 4).join(' | ')}`); }
};
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 }).trim();

const MSG = 'no record in it is judged by the gate';
const MSG_CU = 'T3 paths (t3_paths) changed but the PR carries NO _acceptance/<slug>/ artifacts';
const CLEAN = 'pre-merge-check: clean';

const { fileFromTemplate } = await import(pathToFileURL(path.join(KIT, 'tests', 'fixtures', 'from-template.mjs')).href);
const CONTRACT_TPL = path.join(KIT, 'skills', 'acceptance', 'references', 'contract-template.md');
const hopDong = (slug, risk_tier, status, them = '') => fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier, surfaces: 'cli', status },
  `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n\n## Notes\n`)
  .replace(/^approved_by:.*$/m, 'approved_by: [Tên]')
  .replace(/^approved_at:.*$/m, m => [m, them].filter(Boolean).join('\n'));
const LAN_V = 'veto_state: mo\nveto_opened_at: 2026-10-31T09:00:00Z';
const baoCao = (slug, vc, { verdict = 'PASS', signoff = '[Tên] 2026-11-09' } = {}) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: ${verdict}\nverified_commit: ${vc}\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff: ${signoff}\n---\n\n# Evidence Report: ${slug}\n\n## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-10-31\n\n## Known limits\n\n## Ngoài hợp đồng\n\n`;

const CFG = 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n  t3_paths:\n    - "core/**"\n';
const ghi = (R, rel, nd) => { const p = path.join(R, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, nd); };
const commit = (R, m) => { git(R, 'add', '-A'); git(R, 'commit', '-qm', m); return git(R, 'rev-parse', 'HEAD'); };
const SUA = { t3: ['core/k.js', 'c2\n'], code: ['src/app.js', 'v2\n'], docs: ['docs/n.txt', 'y\n'] };
// Kho git THẬT, ba commit: base (nhánh «basepoint») · PR (`pr`) · (tuỳ chọn) bằng chứng ghim đúng commit vật.
function kho({ co = 't3', base, pr, bangChung, cauHinhBase = true }) {
  const R = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', R]); git(R, 'config', 'user.email', 'x@y.z'); git(R, 'config', 'user.name', 'x');
  ghi(R, 'src/app.js', 'v1\n'); ghi(R, 'core/k.js', 'c1\n'); ghi(R, 'docs/n.txt', 'x\n'); ghi(R, 'verify.sh', '#!/bin/sh\nexit 0\n');
  if (cauHinhBase) ghi(R, '_acceptance/config.yaml', CFG);
  if (base) base(R);
  commit(R, 'base'); git(R, 'branch', 'basepoint');
  ghi(R, ...SUA[co]);
  if (!cauHinhBase) ghi(R, '_acceptance/config.yaml', CFG);
  if (pr) pr(R);
  const vc = commit(R, 'pr');
  if (bangChung) { bangChung(R, vc); commit(R, 'evidence'); }
  return R;
}
const luoi = (R, may = KIT, them = []) => {
  const o = spawnSync('bash', [path.join(may, 'scripts', 'pre-merge-check.sh'), R, '--base', 'basepoint', ...them], { cwd: TMP, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PRE_MERGE_BASE: undefined } });
  return { status: o.status, out: (o.stdout || '') + (o.stderr || '') };
};
const cuoi = out => out.split('\n').filter(Boolean).slice(-3).join(' | ').slice(0, 400);
// Chặn đúng: thoát 1, có thông điệp, nêu tệp T3 và đúng lý do của hồ sơ.
const chan = (o, lyDo) => {
  if (o.status !== 1) return `muốn thoát 1, được ${o.status}: ${cuoi(o.out)}`;
  if (!o.out.includes(`VIOLATION [PR]: T3 paths (t3_paths) changed and the PR touches _acceptance/, but ${MSG}`)) return `thiếu thông điệp: ${cuoi(o.out)}`;
  if (!o.out.includes('    core/k.js')) return 'không nêu tệp T3';
  if (!o.out.includes(lyDo)) return `thiếu lý do «${lyDo}»: ${cuoi(o.out)}`;
  return null;
};
const sach = o => (o.status === 0 && o.out.includes(CLEAN) && !o.out.includes(MSG) ? null : `muốn clean, được ${o.status}: ${cuoi(o.out)}`);

// ── Fixture đặt tên: mỗi hàm dựng đúng một ca, đột biến chạy lại CHÍNH hàm đó ─────────────────────────────
const F = {
  khongFm: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', '# Ghi chú\n\nChưa có frontmatter.\n') }),
  t1Verified: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T1', 'verified')) }),
  khongContract: () => kho({ pr: R => ghi(R, '_acceptance/feat/notes.md', 'ghi chú\n') }),
  chiCauHinh: () => kho({ pr: R => ghi(R, '_acceptance/config.yaml', `${CFG}# them\n`) }),
  taiLieuCu: () => kho({
    base: R => { ghi(R, '_acceptance/cu/contract.md', hopDong('cu', 'T3', 'implemented')); ghi(R, '_acceptance/cu/evidence-report.md', baoCao('cu', '0000000')); ghi(R, '_acceptance/cu/decisions.jsonl', '{"x":1}\n'); },
    pr: R => appendFileSync(path.join(R, '_acceptance/cu/decisions.jsonl'), '{"x":2}\n'),
  }),
  t2MayThong: () => kho({
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', 'machine-cleared', LAN_V)),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc, { signoff: '' })),
  }),
  daCham: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'da-cham-boi-thuc-te')) }),
  t3DaKy: () => kho({
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented')),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc)),
  }),
  t2DaKy: () => kho({
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', 'implemented')),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc)),
  }),
  hatGiongKemHoSoThat: () => kho({
    pr: R => { ghi(R, '_acceptance/hat-giong/contract.md', hopDong('hat-giong', 'T1', 'draft')); ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented')); },
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc)),
  }),
  t3Reject: () => kho({
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented')),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc, { verdict: 'REJECT', signoff: '' })),
  }),
  cuThuongKhongFm: () => kho({ co: 'code', pr: R => ghi(R, '_acceptance/feat/contract.md', '# Ghi chú\n') }),
  cuThuongT1: () => kho({ co: 'code', pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T1', 'draft')) }),
  hatGiongChiDocs: () => kho({ co: 'docs', pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T1', 'draft')) }),
  caiKit: () => kho({ cauHinhBase: false, pr: R => ghi(R, '_acceptance/README.md', '# cổng\n') }),
  khongHoSo: () => kho({}),
};

// ── Chiều đỏ ─────────────────────────────────────────────────────────────────────────────────────────
ca('HA1-do', () => chan(luoi(F.khongFm()), 'feat: contract thiếu status, risk_tier'));
ca('HA2-do', () => chan(luoi(F.t1Verified()), 'feat: risk_tier=T1 ngoài signoff.required_for'));
ca('HA3-do', () => chan(luoi(F.khongContract()), 'feat: không có contract.md'));
ca('HA4-do', () => chan(luoi(F.chiCauHinh()), 'không có thư mục hồ sơ nào trong PR'));
ca('HA5-do', () => chan(luoi(F.taiLieuCu()), 'cu: chỉ đổi tệp chữ'));
ca('HA6-do', () => chan(luoi(F.t2MayThong()), 'feat: hạng T2 chưa có chữ ký người'));
ca('HA20-do', () => chan(luoi(F.daCham()), 'feat: hồ sơ đã chấm bởi thực tế đã đóng'));

// ── Chiều im: hồ sơ thật, hạt giống hợp lệ, code thường và lần cài kit không bị chặn thêm ─────────────
ca('HA7-im', () => sach(luoi(F.t3DaKy())));
ca('HA8-im', () => sach(luoi(F.t2DaKy())));
ca('HA9-im', () => sach(luoi(F.hatGiongKemHoSoThat())));
// Hồ sơ T3 đang dở: cổng theo từng hồ sơ chấm nó, luật PR không chồng thêm một dòng.
ca('HA10-im', () => {
  const o = luoi(F.t3Reject());
  if (o.status !== 1 || !o.out.includes('VIOLATION [feat]: verdict=REJECT')) return `muốn verdict=REJECT chặn, được ${o.status}: ${cuoi(o.out)}`;
  return o.out.includes('VIOLATION [PR]') ? 'hồ sơ đang được chấm mà vẫn bị luật PR chặn chồng' : null;
});
// Đường đọc-cũ của code thường (ARM12): T1 tự khai và hạt giống chưa frontmatter vẫn im.
ca('HA11-im', () => sach(luoi(F.cuThuongKhongFm())));
ca('HA12-im', () => sach(luoi(F.cuThuongT1())));
ca('HA13-im', () => sach(luoi(F.hatGiongChiDocs())));
// PR cài kit: nhánh đích chưa có cổng thì chưa có hồ sơ nào để đòi.
ca('HA14-im', () => sach(luoi(F.caiKit())));
// Commit đẩy thẳng nhánh chính: tiền đề PR không có, răng tắt có khai báo như mọi nhánh T1-escape khác.
ca('HA15-im', () => {
  const o = luoi(F.t1Verified(), KIT, ['--no-t1-escape']);
  if (o.status !== 0 || !o.out.includes('T1-ESCAPE: NOT ENFORCED')) return `muốn tắt có khai báo, được ${o.status}: ${cuoi(o.out)}`;
  return o.out.includes(MSG) ? 'răng đã tắt mà luật vẫn nổ' : null;
});
// Không hồ sơ nào: thông điệp cũ giữ nguyên, không bị luật mới nuốt.
ca('HA16-im', () => {
  const o = luoi(F.khongHoSo());
  if (o.status !== 1 || !o.out.includes(MSG_CU)) return `muốn thông điệp cũ, được ${o.status}: ${cuoi(o.out)}`;
  return o.out.includes(MSG) ? 'luật mới nổ chồng lên thông điệp cũ' : null;
});

// ── Đột biến: tiêm đúng một kim, cùng fixture, kết quả phải đổi đúng hướng ───────────────────────────
const THU_MUC_MAY = ['scripts', 'lib', 'skills', 'commands'];
function banSaoMay(neo, thay) {
  const cp = mkdtempSync(path.join(TMP, 'may-'));
  for (const d of THU_MUC_MAY) cpSync(path.join(KIT, d), path.join(cp, d), { recursive: true });
  const p = path.join(cp, 'scripts', 'pre-merge-check.sh'); const src = readFileSync(p, 'utf8');
  const k = src.split(neo).length - 1;
  if (k !== 1) throw new Error(`neo đột biến khớp ${k} lần: «${neo}»`);
  writeFileSync(p, src.replace(neo, thay));
  return cp;
}
const KIM_LUAT = 'elif [ -n "$t3_hits" ] && ! t3_co_ho_so_arm; then # T3-CAN-HO-SO-GUARD';
ca('HA17-mut', () => {
  const R = F.t1Verified(); const truoc = chan(luoi(R), 'feat: risk_tier=T1');
  if (truoc) return `bản chưa tiêm phải chặn: ${truoc}`;
  const o = luoi(R, banSaoMay(KIM_LUAT, 'elif false; then'));
  return sach(o) ? `gỡ luật mà fixture không về clean (phép đo không gắn vào luật): ${sach(o)}` : null;
});
ca('HA18-mut', () => {
  const R = F.khongFm(); const truoc = chan(luoi(R), 'feat: contract thiếu');
  if (truoc) return `bản chưa tiêm phải chặn: ${truoc}`;
  const o = luoi(R, banSaoMay(KIM_LUAT, 'elif false; then'));
  return sach(o) ? `gỡ luật mà fixture không về clean: ${sach(o)}` : null;
});
const KIM_CAI_KIT = '! git -C "$ROOT" cat-file -e "$_t3_mb:./_acceptance/config.yaml" 2>/dev/null; then return 0; fi # T3-CAI-KIT-GUARD';
ca('HA19-mut', () => {
  const R = F.caiKit(); const truoc = sach(luoi(R));
  if (truoc) return `bản chưa tiêm phải im: ${truoc}`;
  const o = luoi(R, banSaoMay(KIM_CAI_KIT, 'false; then return 0; fi # T3-CAI-KIT-GUARD'));
  return o.status === 1 && o.out.includes(MSG) ? null : `gỡ miễn trừ cài kit mà không chặn: ${o.status}: ${cuoi(o.out)}`;
});

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
