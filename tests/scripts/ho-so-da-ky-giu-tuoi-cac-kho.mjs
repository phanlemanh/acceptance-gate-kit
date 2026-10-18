// ho-so-da-ky-giu-tuoi-cac-kho.mjs — GT8 = AC-8 của hồ sơ ho-so-da-ky-giu-tuoi (hàng K-A): CHIỀU IM trên bộ hồ sơ
// thật (luật 26/09: sửa kit phải cân trên MỌI kho). Đo trên bản sao các kho THẬT của máy nên tệp không mang đuôi
// .test.mjs và không vào feature_loop.suite_keys; khoá chạy: executors.test.ho_so_da_ky_giu_tuoi_cac_kho.
//
// Hai vế, mỗi vế so BỘ MÁY BẢN MỚI (cây chứa tệp này) với BẢN TRƯỚC VÒNG (`git archive 8fe79f1f (gốc so sau khi gộp #382, 18/10)`, TRỌN cây — xem
// bungTron) trên CÙNG một bản sao, khoá `feature_loop.do_san_tren_nen` để như kho đang có (vắng ở mọi kho thật hôm nay):
//
// (1) Kho thật — mỗi kho trong {acceptance-gate-kit, crm-onehub, oneflow}. acceptance-gate-kit = CHÍNH kho chứa cây
//     này (HEAD đã commit của cây này, không phải bản cài). Hai kho kia dò dưới KHO_GOC (mặc định ~/dev): thư mục có
//     `.git` là THƯ MỤC (bản checkout chính, không phải worktree phụ) + `_acceptance/config.yaml`, và tên kho ở
//     origin (bỏ `.git`, chữ thường) bằng tên trong danh sách — crm-onehub trên máy này nằm ở ~/dev/crm. Vắng →
//     «<kho>: không có trên máy — bỏ»; acceptance-gate-kit vắng → FAIL.
//     CÁCH LẤY BẢN SAO (đã chọn): `git worktree add --detach <tạm> HEAD` của chính kho ấy (hooks tắt), gỡ bằng
//     `git worktree remove --force` ở mọi lối thoát. KHÔNG dùng `git archive`: luật «bằng chứng cũ» của lưới
//     trước-gộp cần lịch sử git (verified_commit → HEAD) — bản sao không .git sẽ đi nhánh khác của lưới và không
//     đo được chính nhánh vòng này chạm. Worktree tách rời không đổi nhánh, không đổi cây làm việc của kho gốc;
//     dấu duy nhất là mục .git/worktrees/<tên> sống trong lượt.
//     Trên mỗi bản sao, mỗi bộ máy chạy: `pre-merge-check.sh <bản sao>` (không --base) · `gate-card.js --gate 2
//     --extract` cho MỌI hồ sơ đã ký (evidence-report.md có human_signoff khác rỗng, không phải khuôn «<…»)
//     · `product-map.mjs --root <bản sao>` (đọc PRODUCT-MAP.md / LO-TRINH.html nó ghi, trả tệp về bản đã
//     commit ngay sau). Trước khi so: thay đường dẫn hai bộ máy bằng «<kit>», bỏ dấu giờ ISO (giờ chạy). Khác →
//     FAIL nêu kho + công cụ + dòng khác đầu tiên.
// (2) Kho thử AC-6 (giu-tuoi-fixture.mjs, code sinh): nhánh chính có dòng nền đỏ của H5/E1 do CHÍNH lệnh giữ tươi
//     ghi; với khoá vắng và `false`, một nhánh vòng chạm `paths` của H2 (xanh) và H5 (E1 đỏ cùng ca, cùng thông
//     điệp), lượt ghim lại (`repin-lane.mjs --write`) cho từng hồ sơ: mã thoát + các dòng sổ mới (bỏ ts, sha, id
//     lượt — cả id trong đường nhật ký lệnh đỏ — và số đo máy wall_s · tai · tong_ket.phut · tong_ket.chi_phi)
//     + mục Re-pin của báo cáo (bỏ sha, id lượt, ngày giờ) của bản mới BẰNG bản trước vòng.
// CHIỀU ĐỎ: bản sao bản mới (`git archive HEAD` trọn cây — cây đã commit) sửa khoaTuText để khoá vắng → bật.
// Đối chứng dương: bản nguyên ở (2) phải xanh trước. Đột biến PHẢI làm (2) khác ở ô khoá vắng — ca ghim câu FAIL nêu kho + dòng khác đầu tiên. Ở kho
// thật đột biến không đổi được đầu ra vì không hồ sơ nào mang dòng `nen-do` hay khoá `do_san` — ca ĐẾM điều ấy
// trên từng bản sao và in ra (giới hạn đo được, không dặn bằng lời); chiều đỏ vì thế sống ở vế (2).
//
// Thời lượng (GIỚI HẠN ĐÃ KHAI): crm ~286 hồ sơ đã ký — lưới hai bộ máy song song trên cùng bản sao ~17 phút (lưới
// chỉ đọc cây), thẻ ~15 giây mỗi lượt vì mỗi thẻ quét lại cả kho → ~40 phút cho 2 × 286 thẻ ở 4 luồng; cả ca ~65
// phút trên máy này (17/10), vượt mốc 40 phút dự tính. Không cắt mẫu: AC-8 đòi MỌI hồ sơ đã ký. Trần mỗi lượt lưới
// 40 phút (vượt → FAIL nêu kho, không xanh). Mọi đường dẫn suy từ vị trí tệp này; không ghi vào kho thật nào.
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync, realpathSync, statSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const FX = await import(path.join(HERE, 'giu-tuoi-fixture.mjs'));
const KHO_GOC = path.resolve(process.env.KHO_GOC || path.join(homedir(), 'dev'));
const DS_KHO = ['acceptance-gate-kit', 'crm-onehub', 'oneflow'];
const TRAN_LUOI_MS = 40 * 60 * 1000;
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'gt8-')));
const BO_MAY_DIRS = ['feature-loop', 'lib', 'scripts', 'skills', 'commands', 'hooks'];
const t0 = Date.now();
const phut = (ms) => (ms / 60000).toFixed(1);

const loi = [];
const dongKq = [];
const donWt = []; // [khoGoc, đường worktree]
function donDep() {
  for (const [src, w] of donWt.splice(0)) {
    spawnSync('git', ['-C', src, 'worktree', 'remove', '--force', w], { stdio: 'ignore' });
  }
  FX.donDep();
  rmSync(TMP, { recursive: true, force: true });
}
process.on('exit', () => { try { donDep(); } catch { /* lối thoát cuối */ } });

// ── chuẩn hoá + so ──────────────────────────────────────────────────────────────
// Hai bộ máy cùng là CÂY TRỌN: bản mới = chính cây này; bản trước vòng = `git archive 8fe79f1f (gốc so sau khi gộp #382, 18/10)` TRỌN cây. Không dùng
// banTruocVong() của fixture (chỉ sáu thư mục): product-map.mjs nạp scripts/tin-hieu.mjs → dieu-phoi/scripts/, nên bản
// thiếu thư mục đỏ vì HẠ TẦNG chứ không vì vật (đo 17/10 trên crm: bản đồ «mã 1 · ERR_MODULE_NOT_FOUND» — P150).
const bungTron = (ref, dich) => {
  execFileSync('mkdir', ['-p', dich]);
  const x = spawnSync('tar', ['-x', '-C', dich], { input: execFileSync('git', ['-C', KIT, 'archive', ref], { maxBuffer: 1 << 30 }) });
  if (x.status !== 0) throw new Error(`bung ${ref} thất bại: ${String(x.stderr)}`);
  return dich;
};
const BO_MAY = { moi: KIT, cu: bungTron(FX.BAN_TRUOC_VONG, path.join(TMP, 'ban-truoc-vong')) };
function chuanHoa(text, kitDir) {
  let t = String(text);
  const thay = new Set([kitDir, (() => { try { return realpathSync(kitDir); } catch { return kitDir; } })()]);
  for (const p of [...thay].sort((a, b) => b.length - a.length)) t = t.split(p).join('<kit>');
  // Bỏ dòng chẩn đoán «write error: Broken pipe» của bash: lưới in danh sách tệp cũ qua ống tới `head`, `head` đóng ống
  // sớm hay muộn tuỳ lịch máy, nên dòng ấy có hay không là ngẫu nhiên và đoạn mã sinh ra nó giống hệt ở hai bộ máy (S4
  // lượt 2, 18/10: crm khác đúng một dòng như thế ở bản cũ). Chỉ bỏ đúng khuôn dòng của bash, không bỏ dòng nào khác.
  t = t.split('\n').filter(l => !/: line \d+: (printf|echo): write error: Broken pipe$/.test(l)).join('\n');
  return t.replace(/\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d(\.\d+)?)?(Z|[+-]\d\d:?\d\d)?/g, '<gio>');
}
// → null khi bằng nhau; khác → «dòng <i>: mới «…» · cũ «…»» (dòng khác ĐẦU TIÊN).
function dongKhacDau(a, b) {
  if (a === b) return null;
  const x = a.split('\n'); const y = b.split('\n');
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] !== y[i]) return `dòng ${i + 1}: mới «${(x[i] ?? '<hết>').slice(0, 240)}» · cũ «${(y[i] ?? '<hết>').slice(0, 240)}»`;
  }
  return 'khác ở byte cuối dòng';
}

function chay(cmd, args, o = {}) {
  return new Promise((resolve) => {
    const c = spawn(cmd, args, { cwd: o.cwd, env: o.env || process.env });
    let out = ''; let err = ''; let hetGio = false;
    c.stdout.on('data', d => { out += d; });
    c.stderr.on('data', d => { err += d; });
    const tm = setTimeout(() => { hetGio = true; c.kill('SIGKILL'); }, o.timeout || 120000);
    c.on('close', (code, sig) => { clearTimeout(tm); resolve({ code, sig, out, err, hetGio }); });
  });
}
async function pool(items, n, f) {
  const ra = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; ra[k] = await f(items[k]); } }));
  return ra;
}

// ── dò kho ──────────────────────────────────────────────────────────────────────
function tenOrigin(dir) {
  try { return path.basename(execFileSync('git', ['-C', dir, 'remote', 'get-url', 'origin'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()).replace(/\.git$/, '').toLowerCase(); } catch { return null; }
}
function doKho(ten) {
  if (ten === 'acceptance-gate-kit') return KIT;
  if (!existsSync(KHO_GOC)) return null;
  const ung = readdirSync(KHO_GOC, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => path.join(KHO_GOC, e.name))
    .filter(d => { try { return statSync(path.join(d, '.git')).isDirectory() && existsSync(path.join(d, '_acceptance', 'config.yaml')); } catch { return false; } })
    .filter(d => tenOrigin(d) === ten)
    .sort((a, b) => (path.basename(a) === ten ? -1 : 0) - (path.basename(b) === ten ? -1 : 0) || a.localeCompare(b));
  return ung[0] || null;
}

// ── vế (1): kho thật ────────────────────────────────────────────────────────────
const daKy = (w) => {
  const goc = path.join(w, '_acceptance');
  if (!existsSync(goc)) return [];
  return readdirSync(goc, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).filter(s => {
    const p = path.join(goc, s, 'evidence-report.md');
    if (!existsSync(p)) return false;
    const m = readFileSync(p, 'utf8').match(/^human_signoff\s*:\s*(.*)$/m);
    const v = m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
    return v !== '' && !v.startsWith('<') && v !== 'null';
  }).sort();
};
// Đếm dấu nhãn trên bản sao: dòng `nen-do` + dòng ghim mang `do_san`. Bằng 0 → đột biến khoá không đổi được đầu ra
// ở kho này (lý do chiều đỏ sống ở vế (2)).
const demDauNhan = (w) => {
  const goc = path.join(w, '_acceptance'); let n = 0;
  if (!existsSync(goc)) return 0;
  for (const e of readdirSync(goc, { withFileTypes: true })) {
    const p = path.join(goc, e.name, 'run-log.jsonl');
    if (!e.isDirectory() || !existsSync(p)) continue;
    for (const l of readFileSync(p, 'utf8').split('\n')) if (/"kind"\s*:\s*"nen-do"/.test(l) || /"do_san"\s*:/.test(l)) n += 1;
  }
  return n;
};
const TEP_MAP = ['PRODUCT-MAP.md', 'LO-TRINH.html'];
function traTepMap(w) {
  for (const f of TEP_MAP) {
    const tracked = spawnSync('git', ['-C', w, 'ls-files', '--error-unmatch', f], { stdio: 'ignore' }).status === 0;
    if (tracked) execFileSync('git', ['-C', w, 'checkout', '-q', '--', f]);
    else rmSync(path.join(w, f), { force: true });
  }
}

async function soKhoThat(ten) {
  const src = doKho(ten);
  if (!src) {
    if (ten === 'acceptance-gate-kit') { loi.push(`${ten}: không dò được — kho bắt buộc có mặt`); return; }
    dongKq.push(`${ten}: không có trên máy — bỏ`);
    return;
  }
  const bd = Date.now();
  const w = path.join(TMP, `kho-${ten}`);
  execFileSync('git', ['-C', src, '-c', 'core.hooksPath=/dev/null', 'worktree', 'add', '-q', '--detach', w, 'HEAD'], { stdio: ['ignore', 'ignore', 'pipe'] });
  donWt.push([src, w]);
  const slugs = daKy(w);
  const sai = [];
  let luoiThuLai = 0;
  // Lưới trước-gộp: hai bộ máy song song (lưới chỉ đọc cây).
  const pm = await Promise.all(Object.entries(BO_MAY).map(async ([ban, kit]) => {
    const r = await chay('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), w], { cwd: w, timeout: TRAN_LUOI_MS });
    return [ban, r];
  }));
  const pmOf = Object.fromEntries(pm);
  for (const [ban, r] of pm) if (r.hetGio) sai.push(`lưới (${ban}) vượt trần ${TRAN_LUOI_MS / 60000} phút`);
  if (!sai.length) {
    const vm = (b) => chuanHoa(`mã ${pmOf[b].code} ${pmOf[b].sig || ''}\n${pmOf[b].out}\n=== stderr ===\n${pmOf[b].err}`, BO_MAY[b]);
    let d = dongKhacDau(vm('moi'), vm('cu'));
    // Khác ở lượt song song → chạy lại MỘT lần, tuần tự, hai bộ máy liền nhau (cùng nếp với thẻ dưới); còn khác mới tính.
    if (d) {
      for (const [ban, kit] of Object.entries(BO_MAY)) pmOf[ban] = await chay('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), w], { cwd: w, timeout: TRAN_LUOI_MS });
      d = dongKhacDau(vm('moi'), vm('cu'));
      if (!d) luoiThuLai += 1;
    }
    if (d) sai.push(`lưới trước-gộp ${d}`);
  }
  const phutLuoi = phut(Date.now() - bd);
  // Thẻ Cổng Bằng chứng (--extract) cho mọi hồ sơ đã ký.
  // Thẻ gọi máy quét hồ sơ (start-scan.mjs) với trần 20 giây; trên crm một lượt quét ~15 giây khi máy rảnh, nên
  // chạy song song có lúc chạm trần → thẻ rơi về lối «chưa đọc được trạng thái» (vd `one_shot` khác null) ở MỘT bộ
  // máy — khác vì hạ tầng, không vì vật (đo 17/10: dieu-phoi-30-ngay-dau khác ở lượt song song, chạy lại lúc rảnh
  // thì bằng). Vì thế thẻ khác ở lượt song song được THỬ LẠI MỘT LẦN, tuần tự, hai bộ máy liền nhau; còn khác mới
  // tính. Giới hạn: hai bộ máy cùng chạm trần ở lượt song song cho hai thẻ BẰNG nhau ở lối dự phòng — cặp ấy không
  // so được nhánh «đã khép» của thẻ; ca không đếm được điều ấy từ đầu ra --extract.
  const theMot = async (kit, s) => {
    const r = await chay(process.execPath, [path.join(kit, 'scripts', 'gate-card.js'), '--root', w, '--slug', s, '--gate', '2', '--extract'], { cwd: w, timeout: 120000 });
    return chuanHoa(`mã ${r.code} ${r.sig || ''}\n${r.out}\n=== stderr ===\n${r.err}`, kit);
  };
  const the = {};
  for (const [ban, kit] of Object.entries(BO_MAY)) the[ban] = await pool(slugs, 4, (s) => theMot(kit, s));
  let thuLai = 0;
  for (let i = 0; i < slugs.length; i++) {
    if (the.moi[i] === the.cu[i]) continue;
    thuLai += 1;
    const d = dongKhacDau(await theMot(BO_MAY.moi, slugs[i]), await theMot(BO_MAY.cu, slugs[i]));
    if (d) sai.push(`thẻ ${slugs[i]} ${d}`);
  }
  // Bản đồ sản phẩm (+ trang lộ trình nếu kho khai).
  const map = {};
  for (const [ban, kit] of Object.entries(BO_MAY)) {
    const r = spawnSync(process.execPath, [path.join(kit, 'scripts', 'product-map.mjs'), '--root', w], { encoding: 'utf8', cwd: w, maxBuffer: 256 * 1024 * 1024 });
    const tep = TEP_MAP.map(f => { const p = path.join(w, f); return `--- ${f}\n${existsSync(p) ? readFileSync(p, 'utf8') : '<vắng>'}`; }).join('\n');
    traTepMap(w);
    map[ban] = chuanHoa(`mã ${r.status}\n${r.stdout}\n=== stderr ===\n${r.stderr}\n${tep}`, kit);
  }
  if (!sai.length) { const d = dongKhacDau(map.moi, map.cu); if (d) sai.push(`bản đồ ${d}`); }
  const ban = spawnSync('git', ['-C', w, 'status', '--porcelain'], { encoding: 'utf8' }).stdout.trim();
  if (ban) sai.push(`bản sao bẩn sau lượt: ${ban.split('\n')[0]}`);
  const dau = demDauNhan(w);
  const tg = phut(Date.now() - bd);
  if (!slugs.length) sai.push('0 hồ sơ đã ký — không đo được gì (mù, không xanh)');
  if (sai.length) loi.push(`${ten}: ${sai[0]}`);
  dongKq.push(`${ten}: ${slugs.length} hồ sơ so, ${sai.length} khác`);
  dongKq.push(`    ở ${src} · ${tg} phút (lưới hai bộ máy song song ${phutLuoi}) · ${dau} dấu nhãn nen-do/do_san trên bản sao · ${thuLai} thẻ thử lại tuần tự · lưới thử lại ${luoiThuLai}`);
  spawnSync('git', ['-C', src, 'worktree', 'remove', '--force', w], { stdio: 'ignore' });
  donWt.splice(donWt.findIndex(x => x[1] === w), 1);
}

// ── vế (2): kho thử AC-6 ────────────────────────────────────────────────────────
const BO_DONG = ['ts', 'sha', 'run_id', 'lan_id', 'wall_s', 'tai', 'phut', 'chi_phi'];
const MA_LAN = /repin-\d{8}T\d{6}Z-\d+/g; // id lượt trong đường nhật ký lệnh đỏ
function chuanDongSo(l) {
  let o; try { o = JSON.parse(l); } catch { return l; }
  const bo = (x) => {
    if (Array.isArray(x)) return x.map(bo);
    if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).filter(([k]) => !BO_DONG.includes(k)).map(([k, v]) => [k, bo(v)]));
    return x;
  };
  return JSON.stringify(bo(o)).replace(MA_LAN, '<lan>');
}
// Mục Re-pin (cuối báo cáo, từ «Re-pin lần») — bỏ sha, id lượt, giờ.
const chuanRepin = (report) => {
  const i = report.indexOf('Re-pin');
  return (i < 0 ? '' : report.slice(i)).replace(/\b[0-9a-f]{7,40}\b/g, '<sha>').replace(/repin-[\w.:-]+/g, '<lan>').replace(/\d{4}-\d\d-\d\dT[\d:.]+Z?/g, '<gio>').replace(/\d{4}-\d\d-\d\d/g, '<ngay>');
};
function dungKhoThu() {
  const k = FX.mkKhoGiuTuoi({ hoSo: ['H2', { slug: 'H5', evals: [{ id: 'E1', ca: 'ca-do' }, { id: 'E2', ca: 'ca-e2' }] }], khoa: true });
  const tu = k.git('rev-parse', 'HEAD');
  k.gop(12, { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-do' }) });
  const g = spawnSync(process.execPath, [path.join(KIT, 'feature-loop', 'scripts', 'giu-tuoi.mjs'), '--root', k.root, '--ag-root', KIT, '--tu', tu, '--write'],
    { encoding: 'utf8', env: { ...process.env, GG_DAU: k.dau }, timeout: 300000, killSignal: 'SIGKILL', maxBuffer: 256 * 1024 * 1024 });
  if (g.status !== 0) throw new Error(`lệnh giữ tươi dựng nền thoát ${g.status}: ${String(g.stderr).slice(-400)}`);
  const nen = k.docLog('H5').filter(l => l.kind === 'nen-do');
  if (nen.length !== 1) throw new Error(`kho thử: phải có đúng một dòng nền của H5, có ${nen.length}`);
  k.git('add', '-A'); k.git('commit', '-qm', 'giu tuoi: dong nen');
  const nhanh = {};
  for (const [ten, khoa] of [['vang', undefined], ['false', false]]) {
    k.git('checkout', '-qf', 'main');
    k.git('checkout', '-q', '-B', `vong-khoa-${ten}`, 'main');
    k.datKhoa(khoa);
    k.commit({ 'vat/H5-E1-phu.txt': `cham ${ten}\n`, 'vat/H2-E1-phu.txt': `cham ${ten}\n` }, `vong khoa ${ten}`);
    nhanh[ten] = `vong-khoa-${ten}`;
  }
  return { k, nhanh };
}
// Một lượt: trả cây về đỉnh nhánh, chạy làn của bộ máy `kit` cho từng hồ sơ → chuỗi so được.
function luotLan(k, nhanh, kit) {
  k.git('checkout', '-qf', nhanh); k.git('clean', '-fdq');
  const phan = [];
  for (const slug of ['H2', 'H5']) {
    const n = k.docLog(slug).length;
    const r = k.lane([slug], ['--write', '--reason', 'gt8'], { laneFile: path.join(kit, 'feature-loop', 'scripts', 'repin-lane.mjs'), agRoot: kit });
    const p = path.join(k.root, '_acceptance', slug, 'run-log.jsonl');
    const moi = readFileSync(p, 'utf8').split('\n').filter(Boolean).slice(n).map(chuanDongSo);
    phan.push(`== ${slug} mã ${r.status}\n${moi.join('\n')}\n-- Re-pin\n${chuanRepin(k.docReport(slug))}`);
  }
  k.git('checkout', '-qf', nhanh); k.git('clean', '-fdq');
  return phan.join('\n');
}
function soKhoThu(kt, kitMoi) {
  const sai = [];
  for (const [ten, nh] of Object.entries(kt.nhanh)) {
    const d = dongKhacDau(luotLan(kt.k, nh, kitMoi), luotLan(kt.k, nh, BO_MAY.cu));
    if (d) sai.push(`kho thử AC-6 (khoá ${ten === 'vang' ? 'vắng' : 'false'}): lượt ghim lại ${d}`);
  }
  return sai;
}

// ── chạy ────────────────────────────────────────────────────────────────────────
try {
  // Vế (2) trước: rẻ, và đối chứng dương phải xanh trước khi tin đột biến đỏ.
  const kt = dungKhoThu();
  const v2 = soKhoThu(kt, KIT);
  if (v2.length) loi.push(...v2);
  else dongKq.push('kho thử AC-6: khoá vắng và false — mã thoát + dòng sổ + mục Re-pin bằng bản trước vòng (H2 xanh, H5 E1 đỏ có dòng nền), 0 khác');
  // Chiều đỏ: bản sao bản mới, khoá vắng → bật.
  const dotBien = path.join(TMP, 'dot-bien');
  // Bản sao bản mới (tương đương cp -RL cây đã commit): `git archive HEAD` trọn cây; cây chưa commit thì báo.
  if (spawnSync('git', ['-C', KIT, 'status', '--porcelain', '--', ...BO_MAY_DIRS], { encoding: 'utf8' }).stdout.trim()) loi.push('đột biến: bộ máy của cây có thay đổi chưa commit — bản sao HEAD không phải bản mới đang đo');
  bungTron('HEAD', dotBien);
  const libP = path.join(dotBien, 'lib', 'do-san-tren-nen.cjs');
  const goc = readFileSync(libP, 'utf8');
  const tiem = goc.replace('if (v == null) return false;', 'if (v == null) return true;');
  if (tiem === goc) loi.push('đột biến: không tiêm được — khoaTuText không còn dòng «if (v == null) return false;»');
  else {
    writeFileSync(libP, tiem);
    const dv = soKhoThu(kt, dotBien);
    const cau = dv.find(s => s.startsWith('kho thử AC-6 (khoá vắng): lượt ghim lại dòng '));
    if (!cau) loi.push(`đột biến khoá vắng → bật KHÔNG làm ca đỏ ở ô khoá vắng (${dv.length ? dv[0] : 'không khác'})`);
    else dongKq.push(`đột biến khoá vắng → bật: ca đỏ như mong đợi — FAIL sẽ nêu «${cau.slice(0, 300)}»`);
  }
  for (const ten of DS_KHO) {
    try { await soKhoThat(ten); } catch (e) { loi.push(`${ten}: không chạy được — ${String(e && e.message || e).split('\n')[0]}`); }
  }
} catch (e) {
  loi.push(`hạ tầng ca: ${String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')}`);
}

for (const d of dongKq) console.log(d);
console.log(`tổng ${phut(Date.now() - t0)} phút`);
if (loi.length) {
  console.log(`FAIL: GT8 — ${loi[0]}`);
  for (const l of loi.slice(1)) console.log(`    ${l}`);
  process.exit(1);
}
console.log('PASS: GT8 — chiều im trên mọi kho có mặt + kho thử AC-6; đột biến khoá đỏ');
process.exit(0);
