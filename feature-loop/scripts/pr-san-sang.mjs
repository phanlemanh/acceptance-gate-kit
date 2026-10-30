#!/usr/bin/env node
// pr-san-sang.mjs — PR sẵn sàng NGAY lúc trình thẻ Cổng Bằng chứng (hồ sơ ky-den-gop, hạng H; đề xuất 5 của hạt giống
// docs/plans/2026-10-11-hat-giong-northstar-tu-dot-crm-sau-14-10.md, «PR nháp tới lúc trình Cổng 2»).
//
// Vì sao tồn tại: CI của PR chạy SAU chữ ký thì người ký xong vẫn chờ CI rồi mới gộp được — đoạn ký → gộp không có
// thước, không có chủ máy (một kho tiêu thụ 19–23/10: PR mở → gộp trung vị 8,3 giờ). Lệnh này đẩy nhánh và chuyển PR sang sẵn sàng
// (mở nháp trước nếu chưa có) để CI chạy trong lúc người đọc thẻ; commit chữ ký Cổng 2 sau đó chỉ đổi tệp hồ sơ.
//
//   node pr-san-sang.mjs --root <kho> --slug <slug> [--base <nhánh>]
//
// Điều kiện (thiếu → thoát 2, không đẩy gì): hợp đồng ở `verified`; báo cáo bằng chứng verdict PASS hoặc
// PENDING-JUDGMENT; giữa `verified_commit` và HEAD không tệp nào đổi ngoài `_acceptance/` (vật đúng là vật đã chấm);
// không đứng trên nhánh chính. `feature_loop.ship_default` khác `pr` (merge · branch · ask) → chỉ đẩy nhánh, không mở
// PR — lối ship của kho vẫn do S5 quyết. Hạ tầng hỏng (không remote, gh không có hay chưa đăng nhập) → thoát 3, một
// dòng; bước này không phải cổng nên vòng đi tiếp tới thẻ. PR đã sẵn sàng → không làm gì thêm (chạy lại được).
//
// exit 0 = đã sẵn sàng (hoặc đã đẩy, với ship_default khác pr) · 2 = chưa đủ điều kiện · 3 = hạ tầng · 64 = usage.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PASS_FAMILY = new Set(['PASS', 'PENDING-JUDGMENT']);
const frontmatter = (t, k) => new RegExp(`^${k}:[ \\t]*(\\S*)`, 'm').exec(/^---\n([\s\S]*?)\n---/.exec(t)?.[1] ?? '')?.[1] ?? '';
const feature = (t) => /^feature:[ \t]*(.+)$/m.exec(/^---\n([\s\S]*?)\n---/.exec(t)?.[1] ?? '')?.[1]?.trim() ?? '';

// Đọc theo dòng đúng `feature_loop.ship_default` — không nạp bộ đọc YAML (cùng cách docKhoaGoiDot của dieu-phoi).
export function shipDefault(root) {
  let t = '';
  try {
    t = fs.readFileSync(path.join(root, '_acceptance', 'config.yaml'), 'utf8');
  } catch {
    return 'pr';
  }
  const dong = t.split('\n');
  const i = dong.findIndex((d) => /^feature_loop:\s*(#.*)?$/.test(d));
  if (i < 0) return 'pr';
  for (let j = i + 1; j < dong.length && !/^\S/.test(dong[j]); j++) {
    const m = /^\s+ship_default:\s*["']?([\w-]+)/.exec(dong[j]);
    if (m) return m[1];
  }
  return 'pr';
}

export class Loi extends Error {
  constructor(ma, msg) {
    super(msg);
    this.ma = ma;
  }
}

export function prSanSang({ root, slug, base = null, chay }) {
  const ws = path.join(root, '_acceptance', slug);
  const doc = (f) => {
    try {
      return fs.readFileSync(path.join(ws, f), 'utf8');
    } catch {
      throw new Loi(2, `pr-san-sang: thiếu _acceptance/${slug}/${f}`);
    }
  };
  const hd = doc('contract.md');
  const st = frontmatter(hd, 'status');
  if (st !== 'verified') throw new Loi(2, `pr-san-sang: hợp đồng ở «${st || '?'}», cần verified — bước này chạy lúc trình thẻ Cổng Bằng chứng`);
  const bc = doc('evidence-report.md');
  const verdict = frontmatter(bc, 'verdict');
  if (!PASS_FAMILY.has(verdict)) throw new Loi(2, `pr-san-sang: verdict «${verdict || '?'}» — chỉ PASS hay PENDING-JUDGMENT mới trình thẻ`);
  const git = (...a) => chay('git', a).trim();
  const vc = frontmatter(bc, 'verified_commit');
  if (vc) {
    let doi;
    try {
      doi = git('diff', '--name-only', vc, 'HEAD').split('\n').filter(Boolean);
    } catch {
      throw new Loi(2, `pr-san-sang: không so được verified_commit ${vc.slice(0, 8)} với HEAD`);
    }
    const ngoai = doi.filter((f) => !f.startsWith('_acceptance/'));
    if (ngoai.length) throw new Loi(2, `pr-san-sang: vật đổi sau lượt chấm (${ngoai.slice(0, 3).join(', ')}) — bằng chứng cũ, không mở PR`);
  }
  const nhanh = git('rev-parse', '--abbrev-ref', 'HEAD');
  const sha = git('rev-parse', 'HEAD');
  if (nhanh === 'HEAD') throw new Loi(2, 'pr-san-sang: HEAD tách rời — không có nhánh để đẩy');
  if (base && nhanh === base) throw new Loi(2, `pr-san-sang: đang đứng trên nhánh chính ${base}`);
  const sd = shipDefault(root);
  try {
    git('push', '-q', '-u', 'origin', 'HEAD');
  } catch (e) {
    throw new Loi(3, `pr-san-sang: không đẩy được ${nhanh} (${String(e.stderr ?? e.message).split('\n')[0]}) — vòng đi tiếp tới thẻ; S5 đẩy lại`);
  }
  if (sd !== 'pr') return { nhanh, sha, pr: null, dong: `pr-san-sang: đã đẩy ${nhanh} @${sha.slice(0, 7)} — ship_default ${sd}, không mở PR` };
  const gh = (...a) => {
    try {
      return chay('gh', a).trim();
    } catch (e) {
      throw new Loi(3, `pr-san-sang: gh ${a.slice(0, 2).join(' ')} lỗi (${String(e.stderr ?? e.message).split('\n')[0]}) — nhánh đã đẩy; S5 mở PR`);
    }
  };
  let pr = null;
  try {
    pr = JSON.parse(chay('gh', ['pr', 'view', nhanh, '--json', 'number,isDraft,state,url']));
  } catch {
    pr = null;
  }
  if (pr && pr.state !== 'OPEN') pr = null;
  let moi = false;
  if (!pr) {
    const tieuDe = `${slug}: ${feature(hd)}`.slice(0, 120);
    const than = `Hồ sơ \`_acceptance/${slug}/\` đã qua lượt chấm (verdict ${verdict}); thẻ Cổng Bằng chứng đang chờ người đọc. PR mở sẵn sàng ngay lúc trình thẻ để CI chạy trong lúc đọc — chữ ký Cổng 2 sẽ là một commit chỉ đổi tệp hồ sơ.`;
    gh('pr', 'create', '--draft', '--head', nhanh, ...(base ? ['--base', base] : []), '--title', tieuDe, '--body', than);
    pr = JSON.parse(gh('pr', 'view', nhanh, '--json', 'number,isDraft,state,url'));
    moi = true;
  }
  if (pr.isDraft) gh('pr', 'ready', String(pr.number));
  return { nhanh, sha, pr: pr.number, dong: `pr-san-sang: PR #${pr.number} sẵn sàng${moi ? ' (mới mở)' : ''} @${sha.slice(0, 7)} — CI chạy trong lúc người đọc thẻ; chữ ký sau đó chỉ đổi tệp hồ sơ` };
}

function doiSo(argv) {
  const co = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) co[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  return co;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const co = doiSo(process.argv.slice(2));
  if (typeof co.slug !== 'string') {
    process.stderr.write('dùng: pr-san-sang.mjs --root <kho> --slug <slug> [--base <nhánh>]\n');
    process.exit(64);
  }
  const root = path.resolve(typeof co.root === 'string' ? co.root : '.');
  const chay = (cmd, args) => execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000 });
  try {
    process.stdout.write(`${prSanSang({ root, slug: co.slug, base: typeof co.base === 'string' ? co.base : null, chay }).dong}\n`);
  } catch (e) {
    process.stderr.write(`${e.message}\n`);
    process.exit(e instanceof Loi ? e.ma : 3);
  }
}
