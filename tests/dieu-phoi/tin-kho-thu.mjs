// Hàm dựng chung cho ca GT- của hồ sơ vong-mo-co-chu-giu (GT1). Tệp không mang đuôi .test.mjs nên `node --test` không
// chạy nó như một tệp ca; tệp ca import từ đây (không import từ *.test.mjs, kẻo ca của tệp kia chạy lại). Mọi đường
// suy từ vị trí tệp này.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DAY = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(DAY, '..', '..');
export const GOI = path.join(KIT, 'dieu-phoi');
export const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT' && !k.startsWith('DIEU_PHOI_')));

const canDon = [];
export const donDep = () => {
  for (const d of canDon.splice(0)) fs.rmSync(d, { recursive: true, force: true });
};
export const tam = (tienTo = 'gt-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
export const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
export const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};
export const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

// Nạp một mô-đun của MỘT gốc gói (gói thật hoặc bản sao bị tiêm), không dùng bộ đệm nạp.
export const nap = (gocGoi, tep) => import(`${pathToFileURL(path.join(gocGoi, 'scripts', tep)).href}?v=${Math.random()}`);

// Bản sao gói bị tiêm: thay `cu` bằng `moi` trong `tep`; bước tiêm phải áp đúng một chỗ, không thì ca đỏ không đo gì.
export function banSao(tep, cu, moi) {
  const goc = tam('gt-tiem-');
  fs.cpSync(GOI, goc, { recursive: true });
  const p = path.join(goc, 'scripts', tep);
  const truoc = fs.readFileSync(p, 'utf8');
  const soCho = truoc.split(cu).length - 1;
  assert.equal(soCho, 1, `bước tiêm vào ${tep} phải khớp đúng một chỗ, khớp ${soCho}: «${cu.slice(0, 60)}»`);
  fs.writeFileSync(p, truoc.replace(cu, moi));
  assert.notEqual(fs.readFileSync(p, 'utf8'), truoc, `bước tiêm vào ${tep} không áp`);
  return goc;
}

// Băm trọn một cây thư mục (đường tương đối + nội dung) — «0 byte ghi» là băm trước bằng băm sau.
export function bamCay(goc) {
  const h = crypto.createHash('sha256');
  if (!fs.existsSync(goc)) return 'vang';
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      h.update(path.relative(goc, p));
      if (st.isDirectory()) di(p);
      else if (st.isFile()) h.update(fs.readFileSync(p));
    }
  };
  di(goc);
  return h.digest('hex');
}

// In bảng hàng của một ma trận viết sẵn: số assert = số hàng, mỗi hàng «hàng · kỳ vọng · thực tế».
export function inMaTran(ten, hang) {
  console.log(`  ${ten}: ${hang.length} hàng`);
  for (const h of hang) console.log(`    ${h.hang} · ${h.ky_vong} · ${h.thuc_te}`);
}

export const chayNode = (args, { cwd, env = {}, input = undefined } = {}) => {
  const r = spawnSync(process.execPath, args, { cwd, env: { ...ENV, ...env }, encoding: 'utf8', input });
  return { ma: r.status, out: r.stdout ?? '', err: r.stderr ?? '' };
};

// ---------- kho thử có đợt (cùng cách dựng khoLienKet của tiep-tuc.test, thêm remote giả và worktree giám sát) ----------
export const CLI_TIN = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'tin.mjs');
export const CLI_DP = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');

export function khoDot({ gocGoi = GOI, hang = null, remote = 'https://github.com/thu/kho-a.git', tuMerge = null } = {}) {
  const kho = tam('gt-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'remote', 'add', 'origin', remote);
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const cha = tam('gt-wt-');
  const w1 = path.join(cha, 'p1');
  const w2 = path.join(cha, 'p2');
  const w3 = path.join(cha, 'ngoai');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  git(kho, 'worktree', 'add', '-q', '-b', 'p2', w2);
  git(kho, 'worktree', 'add', '-q', '-b', 'ngoai', w3);
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(gocGoi, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dir, 'hang-viec.json'), {
    dot: '',
    day: [{ id: 'P1', worktree: fs.realpathSync(w1) }, { id: 'P2', worktree: fs.realpathSync(w2) }],
    hang: hang ?? [
      { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 },
      { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1, ranh_gioi: ['src/b/**', 'tests/b/**'] },
    ],
    ngoai_hang_merge: [],
  });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayNode([CLI_DP(gocGoi), 'mo', 'thu', '--phien', 's-gs'], { cwd: kho });
  assert.equal(mo.ma, 0, mo.err);
  const pha = ['pha', 'dang-chay', '--boi', 't', '--ly-do', 'thu'];
  if (tuMerge) pha.push('--tu-merge', tuMerge);
  const p = chayNode([CLI_DP(gocGoi), ...pha], { cwd: kho });
  assert.equal(p.ma, 0, p.err);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho: fs.realpathSync(kho), dot, w1: fs.realpathSync(w1), w2: fs.realpathSync(w2), w3: fs.realpathSync(w3) };
}

// Hồ sơ của một hàng trong worktree, commit để cây sạch. status null → chỉ ô cơ hội (chưa có hợp đồng).
export function hoSo(worktree, slug, { status = null, viSao = `vì ${slug} đáng làm`, gioMay = null } = {}) {
  const d = path.join(worktree, '_acceptance', slug);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'opportunity.md'), `---\nslug: ${slug}\n---\n\nVì sao: ${viSao}\n`);
  if (status) fs.writeFileSync(path.join(d, 'contract.md'), `---\nslug: ${slug}\nfeature: ${slug}\nstatus: ${status}\n---\n`);
  if (gioMay) ghiJ(path.join(d, 'du-bao.json'), { hang: { ma: slug, gio_may: gioMay } });
  git(worktree, 'add', '-A');
  git(worktree, 'commit', '-q', '-m', `ho so ${slug}`);
}

// gh giả trong thư mục tạm: trả {lenh (đặt vào DIEU_PHOI_GH), dir, ca(), dat(sua), nhatKy()}.
export function ghGia({ comments = [], pr = {}, nextId = 1000 } = {}) {
  const dir = tam('gt-gh-');
  ghiJ(path.join(dir, 'ca.json'), { comments, pr, loi: false, treo: false, tre: null, next_id: nextId });
  const lenh = path.join(dir, 'gh');
  fs.writeFileSync(lenh, `#!/bin/sh\nGH_GIA_DIR='${dir}' exec '${process.execPath}' '${path.join(DAY, 'gh-gia.mjs')}' "$@"\n`);
  fs.chmodSync(lenh, 0o755);
  return {
    lenh,
    dir,
    ca: () => docJ(path.join(dir, 'ca.json')),
    dat: (sua) => ghiJ(path.join(dir, 'ca.json'), { ...docJ(path.join(dir, 'ca.json')), ...sua }),
    nhatKy: () => (fs.existsSync(path.join(dir, 'nhat-ky.jsonl')) ? fs.readFileSync(path.join(dir, 'nhat-ky.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []),
    xoaNhatKy: () => fs.rmSync(path.join(dir, 'nhat-ky.jsonl'), { force: true }),
  };
}

// Chạy lệnh tin thật. Trả {ma, out, err, cham} — cham = số đối số ngoài khẩu lệnh và đích/mã.
export function tin(cwd, doiSo, { gocGoi = GOI, nowMs = null, gh = null, env = {} } = {}) {
  const e = { ...env };
  if (nowMs != null) e.DIEU_PHOI_NOW_MS = String(nowMs);
  if (gh) e.DIEU_PHOI_GH = gh;
  const r = chayNode([CLI_TIN(gocGoi), ...doiSo], { cwd, env: e });
  const soKhauLenh = doiSo[0] === 'MỞ' ? 2 : 1;
  return { ...r, cham: Math.max(0, doiSo.length - soKhauLenh - 1) };
}

// ---------- kho thử cho kênh liên máy: một kho git + lộ trình nhỏ + vai máy ----------
export const KENH = 'thu/kenh#308';
export function khoKenh({ gocGoi = GOI, remote = 'https://github.com/thu/kho-a.git', may, gh, loTrinh = true, kenh = KENH } = {}) {
  const kho = tam('gt-kenh-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'remote', 'add', 'origin', remote);
  if (loTrinh) {
    fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
    fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\nlo_trinh:\n  tep: docs/lo-trinh.json\n');
    ghiJ(path.join(kho, 'docs', 'lo-trinh.json'), { moc: [{ ten: 'mốc thử', hang: [{ ma: 'GT1', slug: 'vong-mo-co-chu-giu', gio_may: [4, 7], ranh_gioi: ['dieu-phoi/**'] }] }] });
  }
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const r = tin(fs.realpathSync(kho), ['vai', '--kenh', kenh, '--may', may], { gocGoi, gh });
  assert.equal(r.ma, 0, r.err);
  return fs.realpathSync(kho);
}
export const tepKenhCua = (kho) => path.join(kho, '.acceptance-runs', 'tin', 'kenh-thu-kenh-308.json');
// Bình luận khởi đầu cho gh giả: n bình luận văn xuôi / khuôn cũ, created_at tăng dần trước mốc t0.
export function binhLuanSan(n, t0, { tuId = 1 } = {}) {
  return [...Array(n).keys()].map((i) => {
    const luc = new Date(t0 - (n - i) * 60_000).toISOString().replace(/\.\d+Z$/u, 'Z');
    return { id: tuId + i, created_at: luc, updated_at: luc, body: i % 3 === 0 ? `[Mac Studio · Điều phối → MacBook Pro] báo ${i}` : `ghi chú ${i}` };
  });
}
export const docLuot = (gh) => gh.nhatKy().filter((x) => x.lenh === 'doc' && x.doi_so.some((a) => a.includes('/issues/308/comments')));

// ---------- hook: chạy CHÍNH lệnh rút từ hooks.json (thay ${CLAUDE_PLUGIN_ROOT}) ----------
export function lenhHook(gocGoi, suKien, chua = null) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const khoi = hj.hooks[suKien] ?? [];
  for (const m of khoi) for (const h of m.hooks) if (chua == null || h.command.includes(chua)) return h.command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
  return null;
}
export function chayHook(gocGoi, suKien, dauVao, { nowMs = null, gh = null, chua = null } = {}) {
  const lenh = lenhHook(gocGoi, suKien, chua);
  assert.ok(lenh, `hooks.json không có lệnh cho ${suKien}${chua ? ` chứa ${chua}` : ''}`);
  const env = { ...ENV };
  if (nowMs != null) env.DIEU_PHOI_NOW_MS = String(nowMs);
  if (gh) env.DIEU_PHOI_GH = gh;
  const r = spawnSync('sh', ['-c', lenh], { cwd: dauVao.cwd, env, input: JSON.stringify({ hook_event_name: suKien, session_id: `s-${path.basename(dauVao.cwd)}`, ...dauVao }), encoding: 'utf8' });
  let json = null;
  try {
    json = r.stdout.trim() ? JSON.parse(r.stdout) : null;
  } catch {}
  return { ma: r.status, out: r.stdout, err: r.stderr, json, ctx: json?.hookSpecificOutput?.additionalContext ?? null, sys: json?.systemMessage ?? null };
}
