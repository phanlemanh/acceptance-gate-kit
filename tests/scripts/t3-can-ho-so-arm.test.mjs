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
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, rmSync, cpSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

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
const { hoSoNghi } = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs'));
const DONG_NGHI = JSON.stringify({ id: 'd-20261101T000000Z-1', type: 'nghi', stage: 'gate2', at: '2026-11-01T00:00:00Z', by: '[Tên]', decision: 'tính năng đã gỡ khỏi sản phẩm' });
const baoCao = (slug, vc, { verdict = 'PASS', signoff = '[Tên] 2026-11-09' } = {}) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: ${verdict}\nverified_commit: ${vc}\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff: ${signoff}\n---\n\n# Evidence Report: ${slug}\n\n## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-10-31\n\n## Known limits\n\n## Ngoài hợp đồng\n\n`;

const CFG = 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n  t3_paths:\n    - "core/**"\n';
const ghi = (R, rel, nd) => { const p = path.join(R, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, nd); };
const commit = (R, m) => { git(R, 'add', '-A'); git(R, 'commit', '-qm', m); return git(R, 'rev-parse', 'HEAD'); };
const SUA = { t3: ['core/k.js', 'c2\n'], code: ['src/app.js', 'v2\n'], docs: ['docs/n.txt', 'y\n'] };
// Kho git THẬT, ba commit: base (nhánh «basepoint») · PR (`pr`) · (tuỳ chọn) bằng chứng ghim đúng commit vật.
function kho({ co = 't3', base, pr, bangChung, cauHinhBase = true, cfg = CFG }) {
  const R = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', R]); git(R, 'config', 'user.email', 'x@y.z'); git(R, 'config', 'user.name', 'x');
  ghi(R, 'src/app.js', 'v1\n'); ghi(R, 'core/k.js', 'c1\n'); ghi(R, 'docs/n.txt', 'x\n'); ghi(R, 'verify.sh', '#!/bin/sh\nexit 0\n');
  if (cauHinhBase) ghi(R, '_acceptance/config.yaml', cfg);
  if (base) base(R);
  commit(R, 'base'); git(R, 'branch', 'basepoint');
  ghi(R, ...SUA[co]);
  if (!cauHinhBase) ghi(R, '_acceptance/config.yaml', cfg);
  if (pr) pr(R);
  const vc = commit(R, 'pr');
  if (bangChung) { bangChung(R, vc); commit(R, 'evidence'); }
  return R;
}
const luoi = (R, may = KIT, them = [], env = {}) => {
  const o = spawnSync('bash', [path.join(may, 'scripts', 'pre-merge-check.sh'), R, '--base', 'basepoint', ...them], { cwd: TMP, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PRE_MERGE_BASE: undefined, ...env } });
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
  daNghi: () => {
    const R = kho({
      pr: R2 => { ghi(R2, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented')); ghi(R2, '_acceptance/feat/decisions.jsonl', `${DONG_NGHI}\n`); },
      bangChung: (R2, vc) => ghi(R2, '_acceptance/feat/evidence-report.md', baoCao('feat', vc)),
    });
    const n = hoSoNghi({ ledgerText: readFileSync(path.join(R, '_acceptance/feat/decisions.jsonl'), 'utf8'), reportText: readFileSync(path.join(R, '_acceptance/feat/evidence-report.md'), 'utf8'), contractAtRoot: true, suLieuContract: false });
    if (!n || n.kieu !== 'dong-so') throw new Error(`fixture: bộ đọc không nhận hồ sơ là đã nghỉ: ${JSON.stringify(n)}`);
    return R;
  },
  chiOpportunity: () => kho({
    base: R => { ghi(R, '_acceptance/cu/contract.md', hopDong('cu', 'T3', 'implemented')); ghi(R, '_acceptance/cu/evidence-report.md', baoCao('cu', '0000000')); ghi(R, '_acceptance/cu/opportunity.md', 'a\n'); },
    pr: R => appendFileSync(path.join(R, '_acceptance/cu/opportunity.md'), 'b\n'),
  }),
  t2LanV: () => kho({
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', 'machine-cleared', LAN_V).replace(/^approved_by:.*$/m, 'approved_by:')),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc, { signoff: '' })),
  }),
  thieuRiskTier: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented').replace(/^risk_tier:.*\n/m, '')) }),
  thieuStatus: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented').replace(/^status:.*\n/m, '')) }),
  t3Nhap: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'draft')) }),
  t3DaDuyet: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'approved')) }),
  haiHoSoKhongTinh: () => kho({ pr: R => { ghi(R, '_acceptance/mot/contract.md', '# Ghi chú\n'); ghi(R, '_acceptance/hai/contract.md', hopDong('hai', 'T1', 'verified')); } }),
  thuMucCoCach: () => kho({ pr: R => ghi(R, '_acceptance/ho so/contract.md', hopDong('ho so', 'T1', 'verified')) }),
  xoaHopDong: () => kho({
    base: R => { ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented')); ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', '0000000')); },
    pr: R => rmSync(path.join(R, '_acceptance/feat/contract.md')),
  }),
  hoSoLong: () => kho({ pr: R => ghi(R, 'sub/_acceptance/feat/contract.md', hopDong('feat', 'T3', 'implemented')) }),
  // Nhánh cắt trước lần cài, tự thêm config; trong lúc đó nhánh đích đã cài kit.
  nhanhCuTuThemConfig: () => {
    const R = kho({ cauHinhBase: false });
    const pr = git(R, 'rev-parse', 'HEAD');
    git(R, 'checkout', '-q', 'basepoint');
    ghi(R, '_acceptance/config.yaml', CFG);
    commit(R, 'cai kit tren nhanh dich');
    git(R, 'branch', '-f', 'dich-da-cai');
    git(R, 'checkout', '-q', '--detach', pr);
    git(R, 'branch', '-f', 'basepoint', 'dich-da-cai');
    return R;
  },
};

// ── Chiều đỏ ─────────────────────────────────────────────────────────────────────────────────────────
ca('HA1-do', () => chan(luoi(F.khongFm()), 'feat: contract thiếu status, risk_tier'));
ca('HA2-do', () => chan(luoi(F.t1Verified()), 'feat: risk_tier=T1 ngoài signoff.required_for'));
ca('HA3-do', () => chan(luoi(F.khongContract()), 'feat: không có contract.md'));
ca('HA4-do', () => chan(luoi(F.chiCauHinh()), 'không có thư mục hồ sơ nào trong PR'));
ca('HA5-do', () => chan(luoi(F.taiLieuCu()), 'cu: chỉ đổi tệp chữ'));
ca('HA6-do', () => chan(luoi(F.t2MayThong()), 'feat: hạng T2 chưa có chữ ký người'));
ca('HA20-do', () => chan(luoi(F.daCham()), 'feat: hồ sơ đã chấm bởi thực tế đã đóng'));
ca('HA24-do', () => chan(luoi(F.nhanhCuTuThemConfig()), 'không có thư mục hồ sơ nào trong PR'));
ca('HA21-do', () => chan(luoi(F.daNghi()), 'feat: hồ sơ đã cho nghỉ'));
ca('HA22-do', () => chan(luoi(F.chiOpportunity()), 'cu: chỉ đổi tệp chữ'));
ca('HA23-do', () => chan(luoi(F.t2LanV()), 'feat: hạng T2 chưa có chữ ký người'));
ca('HA32-bien', () => chan(luoi(F.thieuRiskTier()), 'feat: contract thiếu risk_tier'));
ca('HA33-do', () => chan(luoi(F.thieuStatus()), 'feat: contract thiếu status\n'));

// ── Biên: đầu vào hợp đồng không nêu tên; mỗi ca chỉ đòi không được ra clean và nói đúng hồ sơ ──────────
const khongSach = o => (o.status !== 0 && !o.out.includes(CLEAN) ? null : `không được clean, được ${o.status}: ${cuoi(o.out)}`);
ca('HA27-bien', () => khongSach(luoi(F.t1Verified(), KIT, ['--base', 'khong-co-nhanh-nay'])));
ca('HA28-bien', () => chan(luoi(F.haiHoSoKhongTinh()), 'mot: contract thiếu status, risk_tier') || chan(luoi(F.haiHoSoKhongTinh()), 'hai: risk_tier=T1'));
ca('HA29-bien', () => chan(luoi(F.thuMucCoCach()), 'ho so: risk_tier=T1'));
ca('HA30-bien', () => chan(luoi(F.xoaHopDong()), 'feat: không có contract.md'));
ca('HA31-bien', () => chan(luoi(F.hoSoLong()), 'feat: không có contract.md'));

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
// Hồ sơ T3 chưa xong: cổng theo từng hồ sơ chặn bằng lời riêng, luật PR không chồng thêm một dòng.
const chuaArm = o => {
  if (o.status !== 1 || !o.out.includes('status chưa arm cổng')) return `muốn «status chưa arm cổng» chặn, được ${o.status}: ${cuoi(o.out)}`;
  return o.out.includes('VIOLATION [PR]') ? 'hồ sơ đang được chấm mà vẫn bị luật PR chặn chồng' : null;
};
ca('HA25-im', () => chuaArm(luoi(F.t3Nhap())));
ca('HA26-im', () => chuaArm(luoi(F.t3DaDuyet())));
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
function banSaoMay(neo, thay, { boLib = false } = {}) {
  const cp = mkdtempSync(path.join(TMP, 'may-'));
  for (const d of THU_MUC_MAY) cpSync(path.join(KIT, d), path.join(cp, d), { recursive: true });
  if (boLib) rmSync(path.join(cp, 'lib', 'evidence-core.cjs'));
  if (neo === null) return cp;
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
const KIM_CAI_KIT = '! git -C "$ROOT" cat-file -e "$BASE_SHA:./_acceptance/config.yaml" 2>/dev/null; then return 0; fi # T3-CAI-KIT-GUARD';
ca('HA19-mut', () => {
  const R = F.caiKit(); const truoc = sach(luoi(R));
  if (truoc) return `bản chưa tiêm phải im: ${truoc}`;
  const o = luoi(R, banSaoMay(KIM_CAI_KIT, 'false; then return 0; fi # T3-CAI-KIT-GUARD'));
  return o.status === 1 && o.out.includes(MSG) ? null : `gỡ miễn trừ cài kit mà không chặn: ${o.status}: ${cuoi(o.out)}`;
});
// Mỗi lý do một kim: gỡ đúng nhánh đó trên CÙNG fixture thì đầu ra không còn lý do ấy.
const KIM_DA_CO = new Set();
const dotBienLyDo = (ten, fixture, lyDo, neo, thay = 'ly=""') => (thay === 'ly=""' && KIM_DA_CO.add(neo), ca(ten, () => {
  const R = fixture(); const truoc = chan(luoi(R), lyDo);
  if (truoc) return `bản chưa tiêm phải chặn đúng lý do: ${truoc}`;
  const o = luoi(R, banSaoMay(neo, thay));
  return o.out.includes(lyDo) ? `gỡ nhánh lý do mà đầu ra vẫn còn «${lyDo}»` : null;
}));
dotBienLyDo('HA3-mut', F.khongContract, 'feat: không có contract.md', 'ly="không có contract.md"');
dotBienLyDo('HA4-mut', F.chiCauHinh, 'không có thư mục hồ sơ nào trong PR', 'T3_HO_SO_LY_DO="    không có thư mục hồ sơ nào trong PR (chỉ đổi tệp khác dưới _acceptance/)"$\'\\n\'', 'T3_HO_SO_LY_DO=""');
dotBienLyDo('HA5-mut', F.taiLieuCu, 'cu: chỉ đổi tệp chữ', 'ly="chỉ đổi tệp chữ (${SLUG_TEP_CHU:-tệp ghi chép}), hồ sơ không bị chấm lại"');
dotBienLyDo('HA6-mut', F.t2MayThong, 'feat: hạng T2 chưa có chữ ký người', 'ly="hạng $t chưa có chữ ký người — code t3_paths phải có người ký"');
dotBienLyDo('HA20-mut', F.daCham, 'feat: hồ sơ đã chấm bởi thực tế đã đóng', 'ly="hồ sơ đã chấm bởi thực tế đã đóng, không nhận code mới"');
dotBienLyDo('HA21-mut', F.daNghi, 'feat: hồ sơ đã cho nghỉ', 'ly="hồ sơ đã cho nghỉ, không còn bị chấm"');
dotBienLyDo('HA22-mut', F.chiOpportunity, 'cu: chỉ đổi tệp chữ', 'ly="chỉ đổi tệp chữ (${SLUG_TEP_CHU:-tệp ghi chép}), hồ sơ không bị chấm lại"');
dotBienLyDo('HA23-mut', F.t2LanV, 'feat: hạng T2 chưa có chữ ký người', 'ly="hạng $t chưa có chữ ký người — code t3_paths phải có người ký"');
dotBienLyDo('HA32-mut', F.thieuRiskTier, 'feat: contract thiếu risk_tier', 'ly="contract thiếu risk_tier"');
dotBienLyDo('HA33-mut', F.thieuStatus, 'feat: contract thiếu status\n', 'ly="contract thiếu status"');
dotBienLyDo('HA34-mut', F.khongFm, 'feat: contract thiếu status, risk_tier', 'ly="contract thiếu status, risk_tier"');
dotBienLyDo('HA35-mut', F.t1Verified, 'feat: risk_tier=T1 ngoài signoff.required_for', 'ly="risk_tier=$t ngoài signoff.required_for ($REQUIRED_FOR) — code t3_paths không khai hạng thấp được"');
// ── Vế chữ ký không chạy được (hồ sơ t3-arm-chu-ky-khong-im) ──────────────────────────────────────────
// Máy «thiếu lib» là bản sao trọn thư mục bị xoá đúng lib/evidence-core.cjs; máy «thiếu node» là PATH cắt, tự kiểm trong
// tiến trình mới. Ca -do đo CÙNG một kho thử trên máy đủ công cụ rồi máy thiếu; ca -mut phải về clean, nên bản sao chết
// sớm không cho xanh giả.
const CFG_STRICT = `${CFG}recheck: strict\n`;
const CFG_T1 = `${CFG}signoff:\n  required_for: [T1, T2, T3]\n`;
const KHONG_KIEM = 'không kiểm được chữ ký người';
const LY_LIB = `feat: hạng T2 ${KHONG_KIEM} — thiếu lib/evidence-core.cjs (mang cổng vào repo phải copy CẢ lib/)`;
const LY_NODE = `feat: hạng T2 ${KHONG_KIEM} — thiếu node (cài node trên máy chạy cổng)`;
const LY_CU = 'feat: hạng T2 chưa có chữ ký người';
const MAY_THONG = 'VIOLATION [feat]: status machine-cleared nhưng hồ sơ còn cần người';
const KIM_LY_LIB = 'ly="hạng $t không kiểm được chữ ký người — thiếu lib/evidence-core.cjs (mang cổng vào repo phải copy CẢ lib/)"';
const KIM_LY_NODE = 'ly="hạng $t không kiểm được chữ ký người — thiếu node (cài node trên máy chạy cổng)"';
let bsThieuLib; const mayThieuLib = () => (bsThieuLib ||= banSaoMay(null, null, { boLib: true }));
let pathCat;
function PATH_KHONG_NODE() {
  if (pathCat) return pathCat;
  const d = mkdtempSync(path.join(TMP, 'bin-'));
  for (const b of ['bash', 'sh', 'sed', 'awk', 'grep', 'head', 'tail', 'sort', 'tr', 'cut', 'basename', 'dirname', 'wc', 'cat', 'git', 'env', 'uname', 'date', 'diff', 'mktemp', 'rm', 'find', 'xargs', 'uniq', 'comm', 'tee', 'ls', 'mkdir']) {
    const o = spawnSync('bash', ['-c', `command -v ${b}`], { encoding: 'utf8' });
    if (o.status === 0 && o.stdout.trim().startsWith('/')) symlinkSync(o.stdout.trim(), path.join(d, b));
  }
  const kt = spawnSync(path.join(d, 'bash'), ['-c', 'command -v node'], { env: { PATH: d } });
  if (kt.status === 0) throw new Error('fixture: PATH cắt vẫn còn node');
  pathCat = d;
  return d;
}
const THIEU_LIB = () => [mayThieuLib(), {}];
const THIEU_NODE = () => [KIT, { PATH: PATH_KHONG_NODE() }];
const chayTren = (R, m, them = []) => { const [may, env] = m(); return luoi(R, may, them, env); };
const G = {
  t2ChuaKy: status => () => kho({
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', status, status === 'machine-cleared' ? LAN_V : '')),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc, { signoff: '' })),
  }),
  t2MayThongCodeThuong: () => kho({
    co: 'code',
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', 'machine-cleared', LAN_V)),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc, { signoff: '' })),
  }),
  t2ChuaCanhT3: () => kho({
    pr: R => { ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', 'machine-cleared', LAN_V)); ghi(R, '_acceptance/loi/contract.md', hopDong('loi', 'T3', 'implemented')); },
    bangChung: (R, vc) => { ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc, { signoff: '' })); ghi(R, '_acceptance/loi/evidence-report.md', baoCao('loi', vc)); },
  }),
  t2Draft: () => kho({ pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', 'draft')) }),
  t2KyStrict: () => kho({
    cfg: CFG_STRICT,
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T2', 'implemented')),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc)),
  }),
  t1Ky: () => kho({
    cfg: CFG_T1,
    pr: R => ghi(R, '_acceptance/feat/contract.md', hopDong('feat', 'T1', 'implemented')),
    bangChung: (R, vc) => ghi(R, '_acceptance/feat/evidence-report.md', baoCao('feat', vc)),
  }),
};
const lyDoCu = o => chan(o, LY_CU) || (o.out.includes(KHONG_KIEM) ? 'máy đủ công cụ mà in lý do mới' : null);
const haiMay = (R, lanh, thieu, m) => {
  const a = lanh(luoi(R)); if (a) return `máy đủ: ${a}`;
  const b = thieu(chayTren(R, m)); return b ? `máy thiếu: ${b}` : null;
};
ca('HA37-do', () => haiMay(G.t2ChuaKy('machine-cleared')(), lyDoCu, o => chan(o, LY_LIB), THIEU_LIB));
ca('HA38-do', () => haiMay(G.t2ChuaKy('verified')(), lyDoCu, o => chan(o, LY_LIB), THIEU_LIB));
ca('HA39-do', () => haiMay(G.t2ChuaKy('implemented')(), lyDoCu, o => chan(o, LY_LIB), THIEU_LIB));
// Ghép chuỗi trạng thái đã ký: tệp ca không đọc trạng thái ký, chuỗi liền chỉ làm lưới RT13 kêu (nếp repin-lane-noi-ra.test.mjs).
const DA_KY = ['signed', 'off'].join('-');
ca('HA40-do', () => haiMay(G.t2ChuaKy(DA_KY)(), lyDoCu, o => chan(o, LY_LIB), THIEU_LIB));
ca('HA41-do', () => haiMay(F.t2DaKy(), sach, o => chan(o, LY_LIB), THIEU_LIB));
ca('HA42-do', () => haiMay(F.t2DaKy(), sach, o => chan(o, LY_NODE), THIEU_NODE));
ca('HA43-do', () => chan(chayTren(F.t2MayThong(), THIEU_NODE), LY_NODE));
ca('HA49-do', () => haiMay(G.t1Ky(), sach, o => chan(o, `feat: hạng T1 ${KHONG_KIEM} — thiếu lib/evidence-core.cjs`), THIEU_LIB));
// Ô quanh luật: bảng viết trước của AC-4, mỗi ô ghim mã thoát và thông điệp.
const khongMoi = (kiem, o) => kiem(o) || (o.out.includes(KHONG_KIEM) ? 'luật mới nổ ở ô không phải của nó' : null);
const coMayThong = o => (o.status === 1 && o.out.includes(MAY_THONG) && !o.out.includes(MSG) ? null : `muốn «${MAY_THONG}» chặn, được ${o.status}: ${cuoi(o.out)}`);
const sachTat = o => (o.status === 0 && o.out.includes(CLEAN) && o.out.includes('T1-ESCAPE: NOT ENFORCED') && !o.out.includes(MSG) ? null : `muốn clean có khai tắt, được ${o.status}: ${cuoi(o.out)}`);
const haiO = (R, kiemLib, kiemNode, them = []) => khongMoi(kiemLib, chayTren(R, THIEU_LIB, them)) || khongMoi(kiemNode, chayTren(R, THIEU_NODE, them));
ca('HA44-im', () => haiO(F.t3DaKy(), sach, sach) || khongMoi(chuaArm, chayTren(G.t2Draft(), THIEU_LIB)));
ca('HA45-im', () => haiO(G.t2MayThongCodeThuong(), sach, coMayThong));
ca('HA46-im', () => haiO(F.t2DaKy(), sachTat, sachTat, ['--no-t1-escape']));
ca('HA47-im', () => haiO(G.t2ChuaCanhT3(), sach, coMayThong));
ca('HA48-bien', () => {
  const R = G.t2KyStrict();
  const a = chayTren(R, THIEU_LIB);
  const sa = chan(a, LY_LIB) || (a.out.includes('evidence re-check KHÔNG CHẠY ĐƯỢC (exit 2)') ? null : `thiếu lib: thiếu lời soi lại: ${cuoi(a.out)}`);
  if (sa) return sa;
  const b = chayTren(R, THIEU_NODE);
  return chan(b, LY_NODE) || (b.out.includes('evidence re-check KHÔNG CHẠY ĐƯỢC (node vắng)') ? null : `thiếu node: thiếu lời soi lại: ${cuoi(b.out)}`);
});
// Đột biến: gỡ đúng nhánh lý do trên CÙNG kho thử thì phải về clean, không chỉ mất dòng lý do.
const dotBienVeSach = (ten, fixture, lyDo, neo, m) => (KIM_DA_CO.add(neo), ca(ten, () => {
  const R = fixture(); const truoc = chan(chayTren(R, m), lyDo);
  if (truoc) return `bản chưa tiêm phải chặn đúng lý do: ${truoc}`;
  const [, env] = m();
  const o = luoi(R, banSaoMay(neo, 'ly=""', { boLib: m === THIEU_LIB }), [], env);
  return sach(o) ? `gỡ nhánh lý do mà không về clean: ${sach(o)}` : null;
}));
dotBienVeSach('HA37-mut', G.t2ChuaKy('machine-cleared'), LY_LIB, KIM_LY_LIB, THIEU_LIB);
dotBienVeSach('HA41-mut', F.t2DaKy, LY_LIB, KIM_LY_LIB, THIEU_LIB);
dotBienVeSach('HA49-mut', G.t1Ky, `feat: hạng T1 ${KHONG_KIEM} — thiếu lib/evidence-core.cjs`, KIM_LY_LIB, THIEU_LIB);
dotBienVeSach('HA42-mut', F.t2DaKy, LY_NODE, KIM_LY_NODE, THIEU_NODE);

// Bảng viết trước: mỗi dòng gán lý do trong luật phải có đúng một kim ở trên; thêm lý do mới mà quên kim thì đỏ.
ca('HA36-bang', () => {
  const src = readFileSync(path.join(KIT, 'scripts', 'pre-merge-check.sh'), 'utf8');
  const dau = src.indexOf('t3_co_ho_so_arm() {'); const cuoi2 = src.indexOf('\n}\n', dau);
  if (dau < 0 || cuoi2 < 0) return 'không tìm thấy thân luật';
  const than = src.slice(dau, cuoi2);
  const soDong = (than.match(/\bly="[^"]/g) || []).length;
  if (soDong !== 11) return `bảng viết trước có 11 lý do, luật có ${soDong}`;
  const thieu = [...KIM_DA_CO].filter(n => n.startsWith('ly=') && !than.includes(n));
  if (thieu.length) return `kim không còn khớp luật: ${thieu.join(' | ')}`;
  const soKim = [...KIM_DA_CO].filter(n => n.startsWith('ly=')).length;
  return soKim === 11 ? null : `11 lý do mà chỉ có ${soKim} kim`;
});

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
