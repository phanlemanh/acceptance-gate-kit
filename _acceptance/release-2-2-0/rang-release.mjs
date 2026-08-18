#!/usr/bin/env node
// Răng đo release-2-2-0 — MỘT chân, một tiến trình Node.
//
// Lịch sử rút gọn (owner chọn «thu phạm vi thước» 18/08 — luật dừng-vá lần hai):
//   · bản bash: bộ đếm trong ống/shell con/trap nuốt vế đỏ (3 lỗ cùng lớp);
//   · bản Node 7 chân ~300 dòng để đo 2 con số + 1 dòng + 1 đoạn — mỗi vòng soi
//     lại lộ một cách nó không đo thứ nó tuyên (thước lệch lời khai · chiều đỏ
//     không cô lập · fail-open · chốt chết · đo-từ-vựng-thay-quan-hệ);
//   · bản này giữ đúng thứ CHỈ mốc phát hành mới có. Ba việc bỏ hẳn vì đã có
//     lưới khác đo: hành trình làn V (lưới trước-merge tự chạy ở biên merge và
//     có bộ kiểm vĩnh viễn riêng) · ba ca P197/P198/P199 (suite plugins chạy
//     như eval E3c; ba ca thuộc ba hồ sơ kia) · tự-kiểm bộ đếm (sinh ra để canh
//     bộ đếm bash — bash đã chết).
//
// Nếp giữ: mọi vế là GIÁ TRỊ trong một tiến trình, mã thoát = số vế đỏ; cây
// thật và bản đột biến cùng đi qua CHÍNH hàm kiểm, ghim ĐÚNG câu; ngoại lệ
// thành vế ĐỎ có tên, không crash.
//
//   node rang-release.mjs [--root <đường dẫn đọc vật>]

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const WS = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(WS, '..', '..');
const VER = '2.2.0';
const BASE_REF = process.env.DIFF_BASE || 'origin/main';
const argv = process.argv.slice(2);
const ROOT = (argv.indexOf('--root') >= 0 ? argv[argv.indexOf('--root') + 1] : null) || REPO;

const ok = (m) => ({ ok: true, m });
const red = (m) => ({ ok: false, m });
const tmps = [];
const tmpd = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'rang22-')); tmps.push(d); return d; };
process.on('exit', () => { for (const d of tmps) { try { fs.rmSync(d, { recursive: true, force: true }); } catch {} } });
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
// git LUÔN chạy trong kho thật; `--root` chỉ là nơi ĐỌC VẬT.
const git = (...a) => spawnSync('git', a, { cwd: REPO, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const muc = (mota, v) => { const i = mota.indexOf('v' + v); return i < 0 ? null : mota.slice(i); };

// ── PHÉP ĐO: nhận GỐC + số vendor pin ở base, trả danh sách vế ──────────────
function kiem(root, ddBase) {
  const out = [];
  const load = (rel, ten) => { try { return { v: readJSON(path.join(root, rel)) }; } catch (e) { return { err: `${ten}: ${String(e.message).split('\n')[0]}` }; } };
  const A = load('.claude-plugin/plugin.json', 'manifest acceptance-gate');
  const F = load('feature-loop/.claude-plugin/plugin.json', 'manifest feature-loop');
  const D = load('diagram-design/.claude-plugin/plugin.json', 'manifest diagram-design');

  // (1) Hai số lên mốc; vendor pin KHÔNG ĐỔI so với base — quan hệ, không hình dạng
  out.push(A.err ? red(`khong doc duoc ${A.err}`) : A.v.version === VER ? ok(`ag-version ${VER}`) : red(`ag-version ${A.v.version}`));
  out.push(F.err ? red(`khong doc duoc ${F.err}`) : F.v.version === VER ? ok(`fl-version ${VER}`) : red(`fl-version ${F.v.version}`));
  out.push(D.err ? red(`khong doc duoc ${D.err}`) : D.v.version === ddBase ? ok(`dd-version ${D.v.version} khong doi so voi base`) : red(`dd-version doi so voi base: ${ddBase} -> ${D.v.version}`));

  // (2) Dòng khớp-phiên-bản của GUIDE DẪN XUẤT từ manifest (một nguồn)
  if (A.err || F.err || D.err) out.push(red('GUIDE khong kiem duoc (manifest hong)'));
  else {
    const want = `Khớp phiên bản: acceptance-gate ${A.v.version} · feature-loop ${F.v.version} · diagram-design ${D.v.version}.`;
    let g = null; try { g = fs.readFileSync(path.join(root, 'GUIDE.md'), 'utf8'); } catch (e) { g = null; }
    out.push(g === null ? red('khong doc duoc GUIDE.md') : g.includes(want) ? ok('GUIDE khop so doc tu manifest') : red(`GUIDE khong chua: ${want}`));
  }

  // (3) Mục v2.2.0 nói người dùng nhận gì — và câu khai cặp phải NẰM TRONG mục
  //     đó. Đo QUAN HỆ: sửa mục LỊCH SỬ để lấy màu xanh là đúng lỗi vòng chấm
  //     18/08 bắt được (changelog nói sai về một bản đã phát hành).
  if (A.err) out.push(red('mo ta ag khong kiem duoc (manifest hong)'));
  else {
    const seg = muc(A.v.description, VER);
    if (!seg) out.push(red(`mo ta ag khong co muc v${VER}`));
    else for (const [n, v] of [
      ['muc v2.2.0 noi hinh tai Cong 1', /Gate 1/i.test(seg) && /(diagram|figure|picture)/i.test(seg)],
      ['muc v2.2.0 noi nguong nghiem thu tren the', /threshold/i.test(seg)],
      ['muc v2.2.0 noi nhat-ky-vap', /stranger[- ]drive/i.test(seg)],
      ['muc v2.2.0 noi S5 ban giao', /hands? off|hand-off/i.test(seg)],
      ['muc v2.2.0 noi khong phai migrate', /nothing to migrate|no migration/i.test(seg)],
    ]) out.push(v ? ok(n) : red(`thieu ve: ${n}`));
  }
  if (F.err) out.push(red('mo ta fl khong kiem duoc (manifest hong)'));
  else {
    const seg = muc(F.v.description, VER);
    out.push(!seg ? red(`mo ta fl khong co muc v${VER}`)
      : new RegExp(`acceptance-gate >= ${VER.replace(/\./g, '\\.')}`).test(seg) ? ok(`muc v${VER} cua fl TU khai cap ag >= ${VER}`)
        : red(`muc v${VER} cua fl khong khai cap — cau khai cap nam ngoai muc nay (sua muc lich su khong tinh)`));
  }
  return out;
}

// ── PHẠM VI DIFF: một lần cắt số không mang theo dòng engine nào ───────────
const trongAllowlist = (f) =>
  ['.claude-plugin/plugin.json', 'feature-loop/.claude-plugin/plugin.json', 'GUIDE.md', 'PRODUCT-MAP.md', '_acceptance/config.yaml'].includes(f)
  || f.startsWith('_acceptance/release-2-2-0/');

function kiemDiff() {
  const out = [];
  if (git('rev-parse', '--verify', '-q', BASE_REF).status !== 0) return [red(`khong giai duoc base '${BASE_REF}' — fail-closed`)];
  const d = git('diff', '--name-only', `${BASE_REF}...HEAD`);
  if (d.status !== 0) return [red(`git diff loi: ${(d.stderr || '').trim().split('\n')[0]}`)];
  const files = d.stdout.split('\n').map(s => s.trim()).filter(Boolean);
  if (files.length === 0) out.push(red(`diff RONG so voi ${BASE_REF} — chan mu, khong ket luan duoc`));
  else {
    for (const loi of ['.claude-plugin/plugin.json', 'feature-loop/.claude-plugin/plugin.json', 'GUIDE.md'])
      out.push(files.includes(loi) ? ok(`diff co vat loi: ${loi}`) : red(`diff THIEU vat loi: ${loi}`));
    const ngoai = files.filter(f => !trongAllowlist(f));
    out.push(ngoai.length === 0 ? ok(`diff ${files.length} file, tron trong allowlist dong`) : red(`file NGOAI allowlist: ${ngoai.join(' ')}`));
  }
  const st = git('status', '--porcelain');
  if (st.status !== 0) out.push(red(`git status loi (${st.status}) — khong ket luan duoc ve sua chua commit`));
  else {
    const chua = st.stdout.split('\n').map(l => l.slice(3).trim()).filter(Boolean).filter(f => !trongAllowlist(f));
    out.push(chua.length === 0 ? ok('khong co sua chua commit ngoai allowlist') : red(`sua CHUA COMMIT ngoai allowlist: ${chua.join(' ')}`));
  }
  return out;
}

// ── bản sao cho đột biến LUÔN dựng từ kho thật ────────────────────────────
function banSao() {
  const d = tmpd();
  for (const rel of ['.claude-plugin/plugin.json', 'feature-loop/.claude-plugin/plugin.json', 'diagram-design/.claude-plugin/plugin.json']) {
    fs.mkdirSync(path.join(d, path.dirname(rel)), { recursive: true });
    fs.copyFileSync(path.join(REPO, rel), path.join(d, rel));
  }
  fs.copyFileSync(path.join(REPO, 'GUIDE.md'), path.join(d, 'GUIDE.md'));
  return d;
}
const suaJSON = (p, fn) => { const j = readJSON(p); fn(j); fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n'); };

let ves = [];
const muts = [];
try {
  const ddBase = (() => {
    const r = git('show', `${BASE_REF}:diagram-design/.claude-plugin/plugin.json`);
    if (r.status !== 0) return null;
    try { return JSON.parse(r.stdout).version; } catch { return null; }
  })();
  if (ddBase === null) ves = [red(`khong doc duoc so diagram-design o base ${BASE_REF} — fail-closed`)];
  else {
    ves = [ok(`base ${BASE_REF} co diagram-design ${ddBase}`), ...kiem(ROOT, ddBase), ...kiemDiff()];
    // ĐỐI CHỨNG DƯƠNG của chính đường đột biến: bản sao NGUYÊN VẸN phải 0 vế đỏ.
    // Thiếu vế này thì mọi đột biến dưới có thể «đỏ» vì lý do khác (S4-r1 bản Node).
    const sach = kiem(banSao(), ddBase).filter(x => !x.ok);
    ves.push(sach.length === 0 ? ok('ban sao NGUYEN VEN: 0 ve do (duong dot bien lanh)')
      : red(`BAN SAO NGUYEN VEN DA DO (${sach.map(x => x.m).join(' | ')}) — moi dot bien duoi vo nghia`));

    // ── SÁU chiều đỏ, mỗi cái qua CHÍNH kiem(), ghim ĐÚNG câu ─────────────
    const dot = (ten, sua, mong) => {
      const d = banSao(); sua(d);
      const r = kiem(d, ddBase).filter(x => !x.ok);
      const hit = r.find(x => x.m.includes(mong));
      if (hit) muts.push(`${ten} → ĐỎ «${hit.m}»`);
      else ves.push(red(`CHIEU DO KHONG CHAY [${ten}]: doi «${mong}», thay ${r.length ? r.map(x => `«${x.m}»`).join(' ') : '(khong ve nao do)'}`));
    };
    dot('ha so ag 2.1.0', d => suaJSON(path.join(d, '.claude-plugin/plugin.json'), j => { j.version = '2.1.0'; }), 'ag-version 2.1.0');
    dot('nang vendor pin 9.9.9', d => suaJSON(path.join(d, 'diagram-design/.claude-plugin/plugin.json'), j => { j.version = '9.9.9'; }), 'doi so voi base');
    dot('GUIDE ghi so cu', d => fs.writeFileSync(path.join(d, 'GUIDE.md'), fs.readFileSync(path.join(REPO, 'GUIDE.md'), 'utf8').replace(`acceptance-gate ${VER}`, 'acceptance-gate 2.1.0')), 'GUIDE khong chua');
    dot('xoa ten nhat-ky-vap khoi muc v2.2.0', d => suaJSON(path.join(d, '.claude-plugin/plugin.json'), j => { j.description = j.description.replace(/stranger[- ]drive/gi, 'XXX'); }), 'noi nhat-ky-vap');
    // Đột biến của ĐÚNG lỗi vòng chấm 18/08 bắt: dời câu khai cặp sang mục LỊCH SỬ.
    dot('doi cau khai cap sang muc lich su v2.1.0', d => suaJSON(path.join(d, 'feature-loop/.claude-plugin/plugin.json'), j => {
      j.description = j.description
        .replace(` Pairs with acceptance-gate >= ${VER}.`, '')
        .replace('v2.1.0: pairs with acceptance-gate >= 2.1.0', `v2.1.0: pairs with acceptance-gate >= ${VER}`);
    }), 'khong khai cap');
    dot('manifest ag hong', d => fs.writeFileSync(path.join(d, '.claude-plugin/plugin.json'), '{ hong'), 'khong doc duoc');
  }
} catch (e) {
  ves.push(red(`nem ngoai le (khong ket luan duoc): ${String((e && e.message) || e).split('\n')[0]}`));
}

for (const v of ves) console.log(v.ok ? `  OK   ${v.m}` : `  ĐỎ   ${v.m}`);
for (const m of muts) console.log(`       [chiều đỏ] ${m}`);
const soDo = ves.filter(v => !v.ok).length;
console.log(`-- release-2-2-0: ${ves.length} vế, ${soDo} đỏ, ${muts.length} chiều đỏ chạy thật`);
process.exit(soDo === 0 ? 0 : 1);
