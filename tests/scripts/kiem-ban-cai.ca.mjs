#!/usr/bin/env node
// kiem-ban-cai.ca.mjs — ca đo của hồ sơ kiem-ban-cai-sau-phat-hanh (ca KB-<n> = AC-n).
//
//   node tests/scripts/kiem-ban-cai.ca.mjs                  # trọn bộ ca (khoá executors.test.kiem_ban_cai)
//   node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc   # cổng lượt cắt mốc (khoá kiem_ban_cai_moc, suite_keys)
//
// Đuôi .ca.mjs CỐ Ý: không lọt vào mảnh *.test.mjs của CI — runner CI không có CLI claude. Mọi nguồn cài bị
// tiêm dựng từ `git archive HEAD` TRONG lượt; đường dẫn suy từ vị trí tệp này. Ca đỏ chỉ tính khi đối chứng
// dương (KB-2) xanh trong cùng lượt, và ghim thông điệp chứ không chỉ mã thoát. Mỗi ca in đúng một dòng
// «PASS: KB-…» hoặc «FAIL: KB-… — <vì sao>»; có FAIL thì thoát 1.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'kiem-ban-cai.mjs');
const MUC_VIET_SAN = ['so-phien-ban', 'khop-tag', 'thu-muc-goi', 'tac-tu-cham', 'hook-goi', 'the-cong', 'luoi-truoc-gop', 'dieu-phoi'];

const git = (root, args) => spawnSync('git', ['-C', root, '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });
const gitOk = (root, args) => { const r = git(root, args); if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${(r.stderr || '').trim()}`); return r.stdout; };

// Cổng lượt cắt mốc: số trong .claude-plugin/plugin.json ở HEAD so với gốc vòng. Bằng → bỏ qua; khác, hay
// không dò/đọc được → chạy trọn (đóng khi nghi ngờ).
export function nhanDienLuotMoc(root) {
  let nhanh = null;
  for (const n of ['origin/HEAD', 'origin/main', 'main', 'master']) {
    if (git(root, ['rev-parse', '--verify', '--quiet', `${n}^{commit}`]).status === 0) { nhanh = n; break; }
  }
  if (!nhanh) return { ket: 'chay-tron', ly_do: 'không dò được nhánh chính' };
  const mb = git(root, ['merge-base', 'HEAD', nhanh]);
  if (mb.status !== 0) return { ket: 'chay-tron', ly_do: `không dò được gốc vòng với ${nhanh}` };
  const doc = (ref) => { const r = git(root, ['show', `${ref}:.claude-plugin/plugin.json`]); try { return r.status === 0 ? JSON.parse(r.stdout).version : null; } catch { return null; } };
  const so = doc('HEAD'), soGoc = doc(mb.stdout.trim());
  if (!so || !soGoc) return { ket: 'chay-tron', ly_do: 'không đọc được số phiên bản' };
  return so === soGoc ? { ket: 'bo-qua', so, soGoc } : { ket: 'chay-tron', so, soGoc, ly_do: `số ${soGoc} → ${so}` };
}

const tagMoiNhat = (root) => { const r = git(root, ['describe', '--tags', '--abbrev=0', '--match', 'v*', 'HEAD']); return r.status === 0 ? r.stdout.trim() : null; };

function cheDoLuotMoc() {
  const n = nhanDienLuotMoc(ROOT);
  if (n.ket === 'bo-qua') { console.log(`BỎ QUA: KB — không phải lượt cắt mốc (số ${n.so} = gốc vòng)`); return 0; }
  console.log(`KB — lượt cắt mốc (${n.ly_do}): kiểm bản cài của cây đang chấm`);
  let ma = spawnSync(process.execPath, [SCRIPT, '--ref', 'HEAD'], { cwd: ROOT, stdio: 'inherit' }).status ?? 2;
  const tag = tagMoiNhat(ROOT);
  if (tag) ma = Math.max(ma, spawnSync(process.execPath, [SCRIPT, '--ref', tag], { cwd: ROOT, stdio: 'inherit' }).status ?? 2);
  return ma;
}

// ---------------- trọn bộ ca ----------------
let soFail = 0;
const pass = (ten) => console.log(`PASS: ${ten}`);
const fail = (ten, vi) => { soFail++; console.log(`FAIL: ${ten} — ${vi}`); };
const kiem = (ten, dieu) => { const loi = dieu.filter(([ok]) => !ok).map(([, m]) => m); loi.length ? fail(ten, loi.join('; ')) : pass(ten); return !loi.length; };

const chayKiem = (args, { env = process.env, cwd = ROOT } = {}) => {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', env, cwd, timeout: 600_000, maxBuffer: 1 << 26 });
  const dong = (r.stdout || '').split('\n').filter(Boolean);
  return { ma: r.status, dong, out: r.stdout || '', err: r.stderr || '', cuoi: dong[dong.length - 1] || '', co: (s) => dong.some(l => l.includes(s)), dongMuc: (loai, muc) => dong.find(l => l.startsWith(`[kiem-ban-cai] ${loai} ${muc}:`)) };
};
const tomTat = (k) => `thoát ${k.ma}; ${k.cuoi}${k.err ? ` | stderr: ${k.err.trim().split('\n').pop()}` : ''}`;

const chenDau = (tep, dong) => {
  const s = fs.readFileSync(tep, 'utf8');
  const i = s.startsWith('#!') ? s.indexOf('\n') + 1 : 0;
  fs.writeFileSync(tep, s.slice(0, i) + dong + '\n' + s.slice(i));
};

// Ảnh chụp cấu hình Claude: băm hai tệp JSON (phải có, khác rỗng) + tên · cỡ · mtime dưới cache/ và
// marketplaces/ tới độ sâu 4 — đủ thấy một bản cài mới hay một tệp đầu thư mục bản cài bị ghi đè. Bỏ riêng
// `.in_use`: tệp đánh dấu phiên mà MỌI phiên Claude đang chạy trên máy làm mới (đo 13/10) — sổ sách phiên,
// không phải nội dung bản cài; giữ nó thì ca chập chờn mỗi khi một phiên khác khởi động giữa lượt chấm.
export function chupCauHinh(cfg) {
  const json = {};
  for (const f of ['installed_plugins.json', 'known_marketplaces.json']) {
    const p = path.join(cfg, 'plugins', f);
    let buf;
    try { buf = fs.readFileSync(p); } catch { throw new Error(`không có gì để so: thiếu ${p}`); }
    if (!buf.length) throw new Error(`không có gì để so: ${p} rỗng`);
    json[f] = crypto.createHash('sha256').update(buf).digest('hex');
  }
  const ds = [];
  const di = (dir, rel, sau) => {
    let es; try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of es.sort((x, y) => x.name.localeCompare(y.name))) {
      if (e.name === '.in_use') continue;
      const p = path.join(dir, e.name), r = `${rel}/${e.name}`;
      let st; try { st = fs.lstatSync(p); } catch { continue; }
      ds.push(`${r}|${st.size}|${st.mtimeMs}`);
      if (e.isDirectory() && sau < 4) di(p, r, sau + 1);
    }
  };
  for (const g of ['cache', 'marketplaces']) di(path.join(cfg, 'plugins', g), g, 1);
  return JSON.stringify({ json, ds });
}

async function chayTron() {
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-ca-'));
  const goc = path.join(tam, 'goc');
  fs.mkdirSync(goc);
  const ar = spawnSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive HEAD | tar -x -C "$2"', '_', ROOT, goc], { encoding: 'utf8' });
  if (ar.status !== 0) { fail('KB-0 nguon', `git archive HEAD thất bại: ${ar.stderr}`); return; }
  let dem = 0;
  const saoChep = (sua) => { const d = path.join(tam, `ban-${++dem}`); fs.cpSync(goc, d, { recursive: true }); sua(d); return d; };
  const mk = JSON.parse(gitOk(ROOT, ['show', 'HEAD:.claude-plugin/marketplace.json']));
  const CHO = mk.name;
  const cauHinhThat = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  const claude = (args, env) => spawnSync('claude', args, { encoding: 'utf8', env, timeout: 180_000 });

  try {
    // ---- KB-1 (mở): độ nhạy của hàm chụp, rồi chụp cấu hình thật TRƯỚC ----
    let truoc = null, nhay = false;
    try {
      const gia = path.join(tam, 'cfg-nhay');
      fs.mkdirSync(path.join(gia, 'plugins', 'cache', 'a', 'b', 'c'), { recursive: true });
      fs.writeFileSync(path.join(gia, 'plugins', 'installed_plugins.json'), '{"version":2}');
      fs.writeFileSync(path.join(gia, 'plugins', 'known_marketplaces.json'), '{}');
      fs.writeFileSync(path.join(gia, 'plugins', 'cache', 'a', 'b', 'c', 'f.txt'), 'x');
      const a1 = chupCauHinh(gia);
      fs.writeFileSync(path.join(gia, 'plugins', 'installed_plugins.json'), '{"version":3}');
      const a2 = chupCauHinh(gia);
      fs.utimesSync(path.join(gia, 'plugins', 'cache', 'a', 'b', 'c', 'f.txt'), new Date(0), new Date(0));
      const a3 = chupCauHinh(gia);
      nhay = a1 !== a2 && a2 !== a3;
      truoc = chupCauHinh(cauHinhThat);
    } catch (e) { truoc = e; }

    // ---- KB-2: đối chứng dương ----
    const k2 = chayKiem(['--ref', 'HEAD']);
    const tenMuc = k2.dong.map(l => (l.match(/^\[kiem-ban-cai\] (ĐẠT|ĐỎ) ([\w-]+):/) || [])[2]).filter(Boolean);
    const dongSo = k2.dongMuc('ĐẠT', 'so-phien-ban') || '';
    const goiMong = mk.plugins.map(p => {
      const nguon = path.posix.normalize(String(p.source).replace(/^\.\//, '')) || '.';
      return `${p.name} ${JSON.parse(gitOk(ROOT, ['show', `HEAD:${nguon === '.' ? '' : nguon + '/'}.claude-plugin/plugin.json`])).version}`;
    });
    const kb2 = kiem('KB-2', [
      [k2.ma === 0, `mong thoát 0 (${tomTat(k2)})`],
      [JSON.stringify(tenMuc) === JSON.stringify(MUC_VIET_SAN), `thứ tự mục ${tenMuc.join(',')}`],
      [k2.dong.filter(l => /^\[kiem-ban-cai\] ĐẠT [\w-]+:/.test(l)).length === 8, 'không đủ tám dòng ĐẠT'],
      [goiMong.every(g => dongSo.includes(g)) && dongSo.split(':').slice(1).join(':').split(' · ').length === goiMong.length, `so-phien-ban «${dongSo}» khác ${goiMong.join(' · ')}`],
      [k2.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8'), `dòng cuối «${k2.cuoi}»`],
    ]);
    const canDoiChung = (ten) => { if (!kb2) { fail(ten, 'không có đối chứng dương (KB-2 không PASS)'); return false; } return true; };

    // ---- KB-1 (đóng): --may chỉ đọc, chụp SAU, kiểm dọn, kiểm --giu ----
    chayKiem(['--may', '--ref', 'HEAD']);
    let sau = null; try { sau = chupCauHinh(cauHinhThat); } catch (e) { sau = e; }
    const tamCfg = (k2.out.match(/cấu hình cách ly (\S+)/) || [])[1];
    const tamKho = (k2.out.match(/kho giả lập (\S+)/) || [])[1];
    const kg = chayKiem(['--ref', 'HEAD', '--giu']);
    const giu = (kg.out.match(/giữ lại (\S+)/) || [])[1];
    const cfgGiu = (kg.out.match(/cấu hình cách ly (\S+)/) || [])[1];
    const khoGiu = (kg.out.match(/kho giả lập (\S+)/) || [])[1];
    const conGiu = !!(cfgGiu && khoGiu && fs.existsSync(cfgGiu) && fs.existsSync(khoGiu));
    if (giu) fs.rmSync(giu, { recursive: true, force: true });
    kiem('KB-1', [
      [nhay, 'hàm chụp mù: chạm một byte / đổi mtime mà ảnh chụp không đổi'],
      [!(truoc instanceof Error), `${truoc instanceof Error ? truoc.message : ''}`],
      [!(sau instanceof Error), `${sau instanceof Error ? sau.message : ''}`],
      [typeof truoc === 'string' && truoc === sau, `cấu hình thật ${cauHinhThat} đổi trong lượt kiểm`],
      [!!tamCfg && !!tamKho && !fs.existsSync(tamCfg) && !fs.existsSync(tamKho), `thư mục tạm còn sau khi lệnh thoát (${tamCfg}, ${tamKho})`],
      [conGiu, '--giu mà thư mục tạm không còn — phép kiểm-dọn không thấy được thư mục'],
    ]);

    // ---- KB-3: thiếu agents/ · sai tên · cầm bút ----
    if (canDoiChung('KB-3 thieu-agents')) {
      const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(d => fs.rmSync(path.join(d, 'feature-loop', 'agents'), { recursive: true }))]);
      const dTm = k.dongMuc('ĐỎ', 'thu-muc-goi') || '', dTt = k.dongMuc('ĐỎ', 'tac-tu-cham') || '';
      kiem('KB-3 thieu-agents', [
        [k.ma === 1, `mong thoát 1 (${tomTat(k)})`],
        [dTm.includes('THIẾU thư mục gói: feature-loop/agents'), `dòng thu-muc-goi «${dTm}»`],
        [dTt.includes('tác tử chấm vắng trong bản cài: feature-loop:cham-lenh'), `dòng tac-tu-cham «${dTt}»`],
        [k.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐỎ') && k.cuoi.includes('thu-muc-goi') && k.cuoi.includes('tac-tu-cham'), `dòng cuối «${k.cuoi}»`],
      ]);
    }
    if (canDoiChung('KB-3 sai-ten')) {
      const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(d => {
        const f = path.join(d, 'feature-loop', 'agents', 'cham-lenh.md');
        fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/^name:\s*cham-lenh\s*$/m, 'name: sai-ten'));
      })]);
      const dTt = k.dongMuc('ĐỎ', 'tac-tu-cham') || '';
      kiem('KB-3 sai-ten', [[k.ma === 1, `mong thoát 1 (${tomTat(k)})`], [dTt.includes('cham-lenh.md') && dTt.includes('name không khớp'), `dòng tac-tu-cham «${dTt}»`]]);
    }
    if (canDoiChung('KB-3 cam-but')) {
      const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(d => {
        const f = path.join(d, 'feature-loop', 'agents', 'cham-doc.md');
        fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/^(tools:.*)$/m, '$1, Edit'));
      })]);
      const dTt = k.dongMuc('ĐỎ', 'tac-tu-cham') || '';
      kiem('KB-3 cam-but', [[k.ma === 1, `mong thoát 1 (${tomTat(k)})`], [dTt.includes('cham-doc.md') && dTt.includes('tác tử chấm cầm bút: Edit'), `dòng tac-tu-cham «${dTt}»`]]);
    }

    // ---- KB-4: lệch một tệp · thừa một tệp ----
    if (canDoiChung('KB-4')) {
      const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(d => fs.appendFileSync(path.join(d, 'scripts', 'gate-card.js'), '\n// lech so voi tag\n'))]);
      const dK = k.dongMuc('ĐỎ', 'khop-tag') || '';
      kiem('KB-4', [
        [k.ma === 1, `mong thoát 1 (${tomTat(k)})`],
        [dK.includes('bản cài khác tag') && dK.includes('acceptance-gate:scripts/gate-card.js'), `dòng khop-tag «${dK}»`],
        [!!k.dongMuc('ĐẠT', 'thu-muc-goi'), 'thu-muc-goi đỏ khi chỉ lệch nội dung (lẫn lớp)'],
      ]);
    }
    // ---- KB-13 (hồ sơ kiem-ban-cai-loi-sua-chay-duoc, design L3): kho giả lập GIỮ NGHIÊM — lệch chỉ ở một tệp
    // docs/ vẫn ĐỎ khop-tag. Chế độ --may khoan dung cùng hình lệch thành VÀNG (ca KL-1 của tệp ca kia).
    if (canDoiChung('KB-13')) {
      const tepDocs = gitOk(ROOT, ['ls-tree', '-r', '--name-only', 'HEAD', '--', 'docs']).split('\n').filter(Boolean)[0];
      if (!tepDocs) fail('KB-13', 'HEAD không có tệp nào dưới docs/ để tiêm');
      else {
        const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(d => fs.appendFileSync(path.join(d, tepDocs), '\nlech tai lieu sau the\n'))]);
        const dK = k.dongMuc('ĐỎ', 'khop-tag') || '';
        kiem('KB-13', [
          [k.ma === 1, `mong thoát 1 (${tomTat(k)})`],
          [dK.includes('bản cài khác tag') && dK.includes(`acceptance-gate:${tepDocs}`), `dòng ĐỎ khop-tag «${dK}»`],
        ]);
      }
    }
    if (canDoiChung('KB-4 thua')) {
      const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(d => fs.writeFileSync(path.join(d, 'tep-thua-ngoai-cay.txt'), 'rác\n'))]);
      const dV = k.dongMuc('VÀNG', 'khop-tag') || '';
      kiem('KB-4 thua', [
        [k.ma === 0, `mong thoát 0 (${tomTat(k)})`],
        [dV.includes('thừa'), `dòng VÀNG khop-tag «${dV}»`],
        [!k.dong.some(l => l.startsWith('[kiem-ban-cai] ĐỎ')), 'có dòng ĐỎ khi chỉ thừa tệp'],
      ]);
    }

    // ---- KB-5: phá từng mắt của vòng chạm ----
    const CHAM = ['the-cong', 'luoi-truoc-gop', 'dieu-phoi'];
    const mat = [
      ['the-cong', 'the-cong', d => chenDau(path.join(d, 'scripts', 'gate-card.js'), 'process.exit(1);'), 'thẻ cổng không dựng được'],
      ['luoi-cam', 'luoi-truoc-gop', d => chenDau(path.join(d, 'scripts', 'pre-merge-check.sh'), 'exit 0'), 'lưới không chặn hồ sơ phạm luật'],
      ['luoi-chan-tat', 'luoi-truoc-gop', d => chenDau(path.join(d, 'scripts', 'pre-merge-check.sh'), 'exit 1'), 'kho lành bị chặn'],
      ['dieu-phoi', 'dieu-phoi', d => chenDau(path.join(d, 'dieu-phoi', 'scripts', 'dieu-phoi.mjs'), 'process.exit(1);'), 'chẩn đoán đợt không chạy được'],
      ['hook-goi', 'hook-goi', d => {
        const f = path.join(d, 'hooks', 'hooks.json');
        const j = JSON.parse(fs.readFileSync(f, 'utf8'));
        j.hooks.PreToolUse.push({ matcher: 'Bash', hooks: [{ type: 'command', command: 'node "${CLAUDE_PLUGIN_ROOT}/hooks/khong-co.js"' }] });
        fs.writeFileSync(f, JSON.stringify(j, null, 2));
      }, 'hooks/khong-co.js'],
    ];
    for (const [ten, muc, sua, thongDiep] of mat) {
      if (!canDoiChung(`KB-5 ${ten}`)) continue;
      const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(sua)]);
      const dD = k.dongMuc('ĐỎ', muc) || '';
      kiem(`KB-5 ${ten}`, [
        [k.ma === 1, `mong thoát 1 (${tomTat(k)})`],
        [dD.includes(thongDiep), `dòng ĐỎ ${muc} «${dD}» thiếu «${thongDiep}»`],
        ...CHAM.filter(m => m !== muc).map(m => [!!k.dongMuc('ĐẠT', m), `mục chạm ${m} không ĐẠT`]),
      ]);
    }

    // ---- KB-6: tag phát hành mới nhất mà HEAD chứa ----
    const tag = tagMoiNhat(ROOT);
    if (!tag) fail('KB-6', 'HEAD không chứa tag v* nào');
    else {
      const sha8 = gitOk(ROOT, ['rev-parse', `${tag}^{commit}`]).trim().slice(0, 8);
      const k = chayKiem(['--ref', tag]);
      kiem(`KB-6 ${tag}`, [[k.ma === 0, `mong thoát 0 (${tomTat(k)})`], [k.cuoi === `[kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — ${tag} (${sha8}) cài đúng tag`, `dòng cuối «${k.cuoi}»`]]);
    }

    // ---- KB-7: máy thật (cấu hình giả) — ca M5 · cài lại · khác số · bản checkout thật ----
    {
      const cfg = path.join(tam, 'cfg-may'); fs.mkdirSync(cfg);
      const env = { ...process.env, CLAUDE_CONFIG_DIR: cfg };
      const D = path.join(tam, 'cho-may');
      fs.cpSync(goc, D, { recursive: true });
      const wf = path.join('feature-loop', 'workflows', 'acceptance-verify.js');
      fs.appendFileSync(path.join(D, wf), '\n// lech: ban checkout khac tag\n');
      claude(['plugin', 'marketplace', 'add', D], env);
      claude(['plugin', 'install', `feature-loop@${CHO}`, '--scope', 'user'], env);
      fs.copyFileSync(path.join(goc, wf), path.join(D, wf));
      claude(['plugin', 'marketplace', 'update', CHO], env);
      claude(['plugin', 'update', `feature-loop@${CHO}`], env);
      const ds = JSON.parse(claude(['plugin', 'list', '--json'], env).stdout || '[]');
      const ip = ((Array.isArray(ds) ? ds : ds.plugins || []).find(p => p.id === `feature-loop@${CHO}`) || {}).installPath;
      const tienDe = !!ip && fs.readFileSync(path.join(ip, 'workflows', 'acceptance-verify.js'), 'utf8').includes('// lech: ban checkout khac tag');
      if (!tienDe) fail('KB-7 m5', 'tiền đề M5 không còn — CLI đổi hành vi (cập nhật đã làm mới bộ đệm cùng số)');
      else {
        const k = chayKiem(['--may', '--ref', 'HEAD'], { env });
        const dD = k.dong.find(l => l.startsWith('[kiem-ban-cai] ĐỎ may:')) || '';
        kiem('KB-7 m5', [[k.ma === 1, `mong thoát 1 (${tomTat(k)})`], [dD.includes(`feature-loop@${CHO}`) && dD.includes('khác tag'), `dòng ĐỎ may «${dD}»`]]);
      }
      claude(['plugin', 'uninstall', `feature-loop@${CHO}`, '--scope', 'user'], env);
      claude(['plugin', 'install', `feature-loop@${CHO}`, '--scope', 'user'], env);
      const k2b = chayKiem(['--may', '--ref', 'HEAD'], { env });
      const dDat = k2b.dong.find(l => l.startsWith('[kiem-ban-cai] ĐẠT may:')) || '';
      kiem('KB-7 cai-lai', [[k2b.ma === 0, `mong thoát 0 (${tomTat(k2b)})`], [dDat.includes('khớp'), `dòng ĐẠT may «${dDat}»`]]);
      const pj = path.join(D, 'dieu-phoi', '.claude-plugin', 'plugin.json');
      const j = JSON.parse(fs.readFileSync(pj, 'utf8')); j.version = '9.9.9'; fs.writeFileSync(pj, JSON.stringify(j, null, 2));
      claude(['plugin', 'marketplace', 'update', CHO], env);
      claude(['plugin', 'install', `dieu-phoi@${CHO}`, '--scope', 'user'], env);
      const k3 = chayKiem(['--may', '--ref', 'HEAD'], { env });
      const dV = k3.dong.find(l => l.startsWith('[kiem-ban-cai] VÀNG may:')) || '';
      kiem('KB-7 khac-so', [[k3.ma === k2b.ma, `mã thoát đổi khi thêm bản ghi khác số (${k2b.ma} → ${k3.ma})`], [dV.includes('khác số') && dV.includes('dieu-phoi'), `dòng VÀNG may «${dV}»`]]);

      const wt = path.join(tam, 'checkout-that');
      gitOk(ROOT, ['worktree', 'add', '--detach', '-q', wt, 'HEAD']);
      try {
        fs.writeFileSync(path.join(wt, 'tep-chua-theo-doi.txt'), 'chưa theo dõi\n');
        fs.writeFileSync(path.join(wt, '.DS_Store'), 'bỏ qua theo .gitignore\n');
        const cfg2 = path.join(tam, 'cfg-checkout'); fs.mkdirSync(cfg2);
        const env2 = { ...process.env, CLAUDE_CONFIG_DIR: cfg2 };
        claude(['plugin', 'marketplace', 'add', wt], env2);
        claude(['plugin', 'install', `acceptance-gate@${CHO}`, '--scope', 'user'], env2);
        const k4 = chayKiem(['--may', '--ref', 'HEAD'], { env: env2 });
        const d4 = k4.dong.find(l => l.startsWith('[kiem-ban-cai] ĐẠT may:')) || '';
        fs.appendFileSync(path.join(wt, 'README.md'), '\nsửa một tệp đang theo dõi\n');
        claude(['plugin', 'uninstall', `acceptance-gate@${CHO}`, '--scope', 'user'], env2);
        claude(['plugin', 'install', `acceptance-gate@${CHO}`, '--scope', 'user'], env2);
        const k5 = chayKiem(['--may', '--ref', 'HEAD'], { env: env2 });
        const d5 = k5.dong.find(l => l.startsWith('[kiem-ban-cai] ĐỎ may:')) || '';
        kiem('KB-7 checkout-that', [
          [k4.ma === 0 && d4.includes('khớp') && d4.includes('thừa'), `bản checkout sạch: thoát ${k4.ma}, «${d4}»`],
          [k5.ma === 1 && d5.includes('khác tag'), `bản checkout sửa tệp theo dõi: thoát ${k5.ma}, «${d5}»`],
        ]);
      } finally { git(ROOT, ['worktree', 'remove', '--force', wt]); }
    }

    // ---- KB-8: không chạy được ----
    {
      const bin = path.join(tam, 'bin-thieu-claude'); fs.mkdirSync(bin);
      fs.symlinkSync(process.execPath, path.join(bin, 'node'));
      const gitBin = spawnSync('bash', ['-c', 'command -v git'], { encoding: 'utf8' }).stdout.trim();
      fs.symlinkSync(gitBin, path.join(bin, 'git'));
      const envThieu = { ...process.env, PATH: bin };
      const coClaude = spawnSync('claude', ['--version'], { env: envThieu });
      if (!coClaude.error) fail('KB-8 thieu-claude', 'tiền đề thiếu-claude không dựng được — claude vẫn tìm thấy dưới PATH tạm');
      else {
        const k = chayKiem(['--ref', 'HEAD'], { env: envThieu });
        kiem('KB-8 thieu-claude', [
          [k.ma === 2, `mong thoát 2 (${tomTat(k)})`],
          [k.cuoi.includes('TỔNG KẾT: KHÔNG CHẠY ĐƯỢC') && k.cuoi.includes('không tìm thấy lệnh claude'), `dòng cuối «${k.cuoi}»`],
          [!k.dong.some(l => l.startsWith('[kiem-ban-cai] ĐẠT') || l.includes('TỔNG KẾT: ĐẠT')), 'có dòng ĐẠT trong ca không chạy được'],
        ]);
      }
      const k = chayKiem(['--ref', 'khong-co-ref-nay']);
      kiem('KB-8 ref-khong-co', [
        [k.ma === 2, `mong thoát 2 (${tomTat(k)})`],
        [k.cuoi.includes('TỔNG KẾT: KHÔNG CHẠY ĐƯỢC') && k.cuoi.includes('ref không có'), `dòng cuối «${k.cuoi}»`],
        [!k.dong.some(l => l.startsWith('[kiem-ban-cai] ĐẠT') || l.includes('TỔNG KẾT: ĐẠT')), 'có dòng ĐẠT trong ca không chạy được'],
      ]);
    }

    // ---- KB-10: máy nhận chưa có bản mới — không bản ghi nào mang số của ref ----
    {
      const cfg = path.join(tam, 'cfg-chua-moi'); fs.mkdirSync(cfg);
      const env = { ...process.env, CLAUDE_CONFIG_DIR: cfg };
      const D = saoChep(d => {
        const f = path.join(d, 'feature-loop', '.claude-plugin', 'plugin.json');
        const j = JSON.parse(fs.readFileSync(f, 'utf8')); j.version = '0.0.1'; fs.writeFileSync(f, JSON.stringify(j, null, 2));
      });
      claude(['plugin', 'marketplace', 'add', D], env);
      claude(['plugin', 'install', `feature-loop@${CHO}`, '--scope', 'user'], env);
      const k = chayKiem(['--may', '--ref', 'HEAD'], { env });
      kiem('KB-10 chua-co-ban-moi', [
        [k.ma === 1, `mong thoát 1 (${tomTat(k)})`],
        [k.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐỎ') && k.cuoi.includes('không bản ghi nào mang số của'), `dòng cuối «${k.cuoi}»`],
      ]);
      // Đối chứng bằng dieu-phoi: nguồn riêng của nó không chứa tệp đã sửa (gói gốc chép cả cây nên sẽ khác tag thật).
      claude(['plugin', 'install', `dieu-phoi@${CHO}`, '--scope', 'user'], env);
      const k2 = chayKiem(['--may', '--ref', 'HEAD'], { env });
      kiem('KB-10 doi-chung', [[k2.ma === 0, `có một bản ghi đúng số mà vẫn đỏ (${tomTat(k2)})`]]);
    }

    // ---- KB-11: lỗi đầu vào và lỗi bất ngờ đi đường «không chạy được» ----
    {
      const khongVet = (k) => !/\n\s+at /.test(k.err);
      const k1 = chayKiem(['--ref', 'HEAD', '--root']);
      kiem('KB-11 thieu-gia-tri', [[k1.ma === 2 && k1.cuoi.includes('TỔNG KẾT: KHÔNG CHẠY ĐƯỢC') && khongVet(k1), tomTat(k1)]]);
      const hong = path.join(tam, `kit-hong-${++dem}`);
      fs.cpSync(goc, hong, { recursive: true });
      fs.writeFileSync(path.join(hong, '.claude-plugin', 'marketplace.json'), 'không phải json\n');
      gitOk(hong, ['init', '-q', '-b', 'main']); gitOk(hong, ['config', 'user.email', 'kb@local']); gitOk(hong, ['config', 'user.name', 'kb']);
      gitOk(hong, ['add', '-A']); gitOk(hong, ['commit', '-qm', 'hong']);
      const k2 = chayKiem(['--ref', 'HEAD', '--root', hong]);
      kiem('KB-11 manifest-hong', [[k2.ma === 2 && k2.cuoi.includes('TỔNG KẾT: KHÔNG CHẠY ĐƯỢC') && khongVet(k2), tomTat(k2)]]);
      const cfg = path.join(tam, 'cfg-so-hong'); fs.mkdirSync(path.join(cfg, 'plugins'), { recursive: true });
      fs.writeFileSync(path.join(cfg, 'plugins', 'installed_plugins.json'), 'không phải json\n');
      const k3 = chayKiem(['--may', '--ref', 'HEAD'], { env: { ...process.env, CLAUDE_CONFIG_DIR: cfg } });
      kiem('KB-11 so-cai-hong', [[k3.ma === 2 && k3.cuoi.includes('TỔNG KẾT: KHÔNG CHẠY ĐƯỢC') && khongVet(k3), tomTat(k3)]]);
      const { chay } = await import(pathToFileURL(SCRIPT).href);
      const in4 = []; let daNem = false;
      const ma4 = await chay(['--ref', 'HEAD'], { out: (s) => { if (!daNem) { daNem = true; throw new TypeError('lỗi tiêm'); } in4.push(s); } });
      const cuoi4 = in4[in4.length - 1] || '';
      kiem('KB-11 loi-bat-ngo', [[ma4 === 2 && cuoi4.includes('KHÔNG CHẠY ĐƯỢC') && cuoi4.includes('lỗi tiêm'), `chay trả ${ma4}, dòng cuối «${cuoi4}»`]]);
    }

    // ---- KB-12: mục số phiên bản đỏ khi bản cài mang số khác ref ----
    if (canDoiChung('KB-12')) {
      const soRef = JSON.parse(gitOk(ROOT, ['show', 'HEAD:feature-loop/.claude-plugin/plugin.json'])).version;
      const k = chayKiem(['--ref', 'HEAD', '--nguon-cai', saoChep(d => {
        const f = path.join(d, 'feature-loop', '.claude-plugin', 'plugin.json');
        const j = JSON.parse(fs.readFileSync(f, 'utf8')); j.version = '0.0.0-lech'; fs.writeFileSync(f, JSON.stringify(j, null, 2));
      })]);
      const dS = k.dongMuc('ĐỎ', 'so-phien-ban') || '';
      kiem('KB-12', [[k.ma === 1, `mong thoát 1 (${tomTat(k)})`], [dS.includes(`feature-loop: cài 0.0.0-lech, ref ${soRef}`), `dòng so-phien-ban «${dS}»`]]);
    }

    // ---- KB-9: khoá suite + cổng lượt cắt mốc trên bản sao kit ----
    {
      const require_ = createRequire(import.meta.url);
      const { resolveConfigKey, resolveConfigList } = require_(path.join(ROOT, 'lib', 'evidence-core.cjs'));
      const cfgText = fs.readFileSync(path.join(ROOT, '_acceptance', 'config.yaml'), 'utf8');
      const sk = resolveConfigList(cfgText, 'feature_loop.suite_keys');
      kiem('KB-9 config', [
        [resolveConfigKey(cfgText, 'executors.test.kiem_ban_cai') === 'node tests/scripts/kiem-ban-cai.ca.mjs', `kiem_ban_cai = «${resolveConfigKey(cfgText, 'executors.test.kiem_ban_cai')}»`],
        [resolveConfigKey(cfgText, 'executors.test.kiem_ban_cai_moc') === 'node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc', `kiem_ban_cai_moc = «${resolveConfigKey(cfgText, 'executors.test.kiem_ban_cai_moc')}»`],
        [sk.includes('executors.test.kiem_ban_cai_moc') && !sk.includes('executors.test.kiem_ban_cai'), `suite_keys = ${sk.join(',')}`],
      ]);
      const banSaoKit = (nhanhGoc, sua) => {
        const d = path.join(tam, `kit-${++dem}`);
        fs.cpSync(goc, d, { recursive: true });
        gitOk(d, ['init', '-q', '-b', nhanhGoc]);
        gitOk(d, ['config', 'user.email', 'kb@local']); gitOk(d, ['config', 'user.name', 'kb']);
        gitOk(d, ['add', '-A']); gitOk(d, ['commit', '-qm', 'goc']);
        gitOk(d, ['checkout', '-qb', 'f']);
        sua(d);
        gitOk(d, ['add', '-A']); gitOk(d, ['commit', '-qm', 'f']);
        return d;
      };
      const doiSo = (d) => { const f = path.join(d, '.claude-plugin', 'plugin.json'); const j = JSON.parse(fs.readFileSync(f, 'utf8')); j.version = '9.9.9'; fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n'); };
      const caMoc = (d) => {
        const r = spawnSync(process.execPath, [path.join(d, 'tests', 'scripts', 'kiem-ban-cai.ca.mjs'), '--chi-luot-moc'], { cwd: d, encoding: 'utf8', timeout: 600_000 });
        return { ma: r.status, out: r.stdout || '', dong: (r.stdout || '').split('\n').filter(Boolean) };
      };
      const im = caMoc(banSaoKit('main', d => fs.appendFileSync(path.join(d, 'README.md'), '\nchỉ sửa tài liệu\n')));
      kiem('KB-9 im', [
        [im.ma === 0, `mong thoát 0 (thoát ${im.ma})`],
        [im.dong.length === 1 && im.dong[0].startsWith('BỎ QUA: KB — không phải lượt cắt mốc'), `đầu ra «${im.dong.join(' | ')}»`],
        [!im.out.includes('cấu hình cách ly'), 'vòng thường mà vẫn cài'],
      ]);
      const dc = caMoc(banSaoKit('main', doiSo));
      const dcOk = kiem('KB-9 doi-chung', [[dc.ma === 0, `mong thoát 0 (thoát ${dc.ma})`], [dc.out.includes('TỔNG KẾT: ĐẠT 8/8'), `thiếu «TỔNG KẾT: ĐẠT 8/8»: ${dc.dong.slice(-1)[0]}`]]);
      if (!dcOk) fail('KB-9 do', 'không có đối chứng dương (KB-9 doi-chung không PASS)');
      else {
        const dd = caMoc(banSaoKit('main', d => { doiSo(d); fs.rmSync(path.join(d, 'feature-loop', 'agents'), { recursive: true }); }));
        // Cây cắt mốc ĐÃ mất agents/ thì bản cài khớp cây ấy — mục thu-muc-goi đúng là ĐẠT; lớp lỗi A1 bị mục
        // tac-tu-cham bắt (workflow đã cài vẫn gọi tên tác tử mà bản cài không có định nghĩa).
        kiem('KB-9 do', [[dd.ma === 1, `mong thoát 1 (thoát ${dd.ma})`], [dd.out.includes('tác tử chấm vắng trong bản cài:') && dd.out.includes('feature-loop:cham-lenh') && dd.out.includes('TỔNG KẾT: ĐỎ'), `đầu ra «${dd.dong.slice(-2).join(' | ')}»`]]);
      }
      const kd = banSaoKit('trunk', d => fs.appendFileSync(path.join(d, 'README.md'), '\nx\n'));
      const n = nhanDienLuotMoc(kd);
      kiem('KB-9 khong-do', [[n.ket === 'chay-tron', `kho không có nhánh chính mà hàm trả «${n.ket}»`]]);
    }
  } finally {
    fs.rmSync(tam, { recursive: true, force: true });
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--chi-luot-moc')) process.exitCode = cheDoLuotMoc();
  else chayTron().then(() => { console.log(soFail ? `KB: ${soFail} ca FAIL` : 'KB: mọi ca PASS'); process.exitCode = soFail ? 1 : 0; });
}
