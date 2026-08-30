// rang-khuon.test.mjs — LƯỚI THƯỜNG TRỰC cho scripts/rang-khuon.sh (hồ sơ
// khuon-rang-dung-chung, AC-1..AC-4, AC-6). ADR 0011: khuôn phải đúng SAU merge.
// Fixture code-sinh; mọi kịch bản chạy bash thật qua spawn.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, mkdirSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const KHUON = path.join(KIT, 'scripts', 'rang-khuon.sh');
let pass = 0, fail = 0;
const ok = (m) => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${String(d).slice(0, 140)})` : ''}`); fail += 1; };
const chk = (c, m, d) => (c ? ok(m) : bad(m, d));
const TMP = mkdtempSync(path.join(tmpdir(), 'khuon-'));

// Chạy một "chân" bash dùng khuôn; trả {code, out}.
function runChan(body, khuonPath = KHUON) {
  const f = path.join(TMP, `chan-${Math.random().toString(36).slice(2)}.sh`);
  writeFileSync(f, `#!/usr/bin/env bash\nset -uo pipefail\nsource "${khuonPath}"\nkr_init thu\n${body}\ndone_chan\n`);
  chmodSync(f, 0o755);
  try { return { code: 0, out: execFileSync('bash', [f], { encoding: 'utf8', env: { ...process.env, KR_KIT_OVERRIDE: KIT } }) }; }
  catch (e) { return { code: e.status, out: `${e.stdout || ''}${e.stderr || ''}` }; }
}

console.log('KR1 (AC-1) ma trận BA hình hỏng móng — mỗi hình phải FAILED');
{
  // (1) chép cây vào đích không ghi được
  const roDir = path.join(TMP, 'ro'); mkdirSync(roDir); chmodSync(roDir, 0o555);
  const r1 = runChan(`kr_snapshot "${roDir}/x" "scripts/rang-khuon.sh" || true`);
  chk(r1.code !== 0 && /FAILED/.test(r1.out), 'KR1.1 chép cây thất bại → chân FAILED', r1.out);
  chmodSync(roDir, 0o755);
  // (2) bản sao thiếu vật được kiểm
  const r2 = runChan(`kr_snapshot "${TMP}/snap2" "duong/khong/ton/tai.xyz" || true`);
  chk(r2.code !== 0 && /thiếu vật được đo/.test(r2.out) && /FAILED/.test(r2.out), 'KR1.2 bản sao thiếu vật → chân FAILED', r2.out);
  // (3) bước tiêm nổ (file không tồn tại)
  const r3 = runChan(`kr_tiem_batdau "${TMP}/khong-co.txt" || true`);
  chk(r3.code !== 0 && /file không tồn tại/.test(r3.out) && /FAILED/.test(r3.out), 'KR1.3 bước tiêm nổ → chân FAILED', r3.out);
  // đối chứng dương: móng lành → passed
  const okf = path.join(TMP, 'lanh.txt'); writeFileSync(okf, 'a\n');
  const r4 = runChan(`kr_tiem_batdau "${okf}" && echo b >> "${okf}" && kr_tiem_xong "${okf}" && ok "tiêm sạch"`);
  chk(r4.code === 0 && /passed/.test(r4.out), 'KR1.4 đối chứng dương: móng lành → passed', r4.out);
}

console.log('KR1s (AC-1) SWEEP: mutate TỪNG call-site `bad` trong đường hỏng thành in-chữ-trần');
{
  const src = readFileSync(KHUON, 'utf8');
  // liệt call-site bằng grep từ nguồn — không danh sách tay
  const sites = [...src.matchAll(/\{ bad "([^"]+)";/g)].map(m => m[1]);
  chk(sites.length >= 8, `KR1s liệt được ${sites.length} call-site bad từ nguồn (≥8)`, String(sites.length));
  let caught = 0;
  for (const msg of sites) {
    const mut = src.replace(`{ bad "${msg}";`, `{ echo "  DO: ${msg}";`);
    if (mut === src) { bad(`KR1s mutant không áp được cho: ${msg}`); continue; }
    const mf = path.join(TMP, `khuon-mut-${caught}-${Math.random().toString(36).slice(2)}.sh`);
    writeFileSync(mf, mut);
    // kịch bản kích đúng đường hỏng dễ nhất: tuỳ thông điệp chọn trigger
    let body;
    if (/đường dẫn RỖNG/.test(msg)) body = 'kr_git "" status || true';
    else if (/không phải repo git/.test(msg)) body = `kr_git "${TMP}" status || true`;
    else if (/không tạo được đích/.test(msg)) { const ro = path.join(TMP, `ro2-${sites.indexOf(msg)}`); mkdirSync(ro, { recursive: true }); chmodSync(ro, 0o555); body = `kr_snapshot "${ro}/x" "scripts/rang-khuon.sh" || true`; }
    else if (/chép cây thất bại/.test(msg)) { const ro = path.join(TMP, `rot-${sites.indexOf(msg)}`); mkdirSync(ro, { recursive: true }); chmodSync(ro, 0o555); body = `kr_snapshot "${ro}" "scripts/rang-khuon.sh" || true`; }
    else if (/thiếu vật được đo/.test(msg)) body = `kr_snapshot "${TMP}/sw-${caught}" "khong/ton/tai.xyz" || true`;
    else if (/file không tồn tại/.test(msg)) body = `kr_tiem_batdau "${TMP}/khong-co-${caught}" || true`;
    else if (/file biến mất/.test(msg)) body = `F="${TMP}/bm-${caught}"; echo x > "$F"; kr_tiem_batdau "$F"; rm -f "$F"; kr_tiem_xong "$F" || true`;
    else if (/chưa gọi kr_tiem_batdau/.test(msg)) body = `F="${TMP}/cg-${caught}"; echo x > "$F"; kr_tiem_xong "$F" || true`;
    else if (/KHÔNG tác dụng/.test(msg)) body = `F="${TMP}/kt-${caught}"; echo x > "$F"; kr_tiem_batdau "$F"; kr_tiem_xong "$F" || true`;
    else if (/thiếu log bản gốc/.test(msg)) body = `kr_vi_phan "${TMP}/vg-${caught}" "${TMP}/vt-${caught}" || true`;
    else if (/thiếu log bản tiêm/.test(msg)) body = `G="${TMP}/g2-${caught}"; echo a > "$G"; kr_vi_phan "$G" "${TMP}/t2-${caught}" || true`;
    else if (/KHÔNG phân biệt được/.test(msg)) body = `G="${TMP}/g3-${caught}"; T="${TMP}/t3-${caught}"; echo same > "$G"; echo same > "$T"; kr_vi_phan "$G" "$T" || true`;
    else if (/thiếu tham số/.test(msg)) body = 'kr_git || true';
    else { bad(`KR1s không có trigger cho call-site: ${msg}`); continue; }
    const r = runChan(body, mf);
    // với mutant in-chữ-trần: chân phải PASSED OAN (exit 0) — và ta BẮT được điều đó
    if (r.code === 0 && /passed/.test(r.out)) caught += 1;
    else bad(`KR1s mutant «${msg}»: chân vẫn FAILED — trigger chưa kích đúng đường`, r.out);
  }
  chk(caught === sites.length, `KR1s sweep: cả ${sites.length} call-site đều là chốt sống (mutant nào cũng gây passed-oan bắt được)`, `${caught}/${sites.length}`);
}

console.log('KR2 (AC-2) tiêm phải tác dụng — số lệch được');
{
  const f = path.join(TMP, 't2.txt'); writeFileSync(f, 'x\n');
  const rThat = runChan(`kr_tiem_batdau "${f}" && printf y >> "${f}" && kr_tiem_xong "${f}" && ok "đổi thật"`);
  chk(rThat.code === 0 && !/KHÔNG tác dụng/.test(rThat.out), 'KR2.1 sửa thật → đi tiếp, FAIL=0', rThat.out);
  const g = path.join(TMP, 't2b.txt'); writeFileSync(g, 'x\n');
  const rGia = runChan(`kr_tiem_batdau "${g}" && kr_tiem_xong "${g}" || true`);
  chk(rGia.code !== 0 && /KHÔNG tác dụng/.test(rGia.out) && /1 fail/.test(rGia.out), 'KR2.2 không đổi file → đỏ đúng 1, ghim «KHÔNG tác dụng»', rGia.out);
}

console.log('KR3 (AC-3) vi phân — giống ⇒ đỏ, khác ⇒ đi tiếp');
{
  const a = path.join(TMP, 'va.log'), b = path.join(TMP, 'vb.log');
  writeFileSync(a, 'exit:2\nloi A\n'); writeFileSync(b, 'exit:0\nkhac\n');
  const rKhac = runChan(`kr_vi_phan "${a}" "${b}" && ok "phân biệt được"`);
  chk(rKhac.code === 0 && /passed/.test(rKhac.out), 'KR3.1 hai bản khác nhau → đi tiếp', rKhac.out);
  writeFileSync(b, 'exit:2\nloi A\n');
  const rGiong = runChan(`kr_vi_phan "${a}" "${b}" || true`);
  chk(rGiong.code !== 0 && /KHÔNG phân biệt được/.test(rGiong.out), 'KR3.2 hai bản giống hệt → đỏ «không phân biệt được»', rGiong.out);
}

console.log('KR4 (AC-4) cửa đường rỗng — kho thật không bị đụng');
{
  const truoc = execFileSync('git', ['-C', KIT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const rRong = runChan('kr_git "" remote remove origin || true');
  chk(rRong.code !== 0 && /đường dẫn RỖNG/.test(rRong.out), 'KR4.1 đường rỗng → từ chối + đỏ', rRong.out);
  const rKhongRepo = runChan(`kr_git "${TMP}" status || true`);
  chk(rKhongRepo.code !== 0 && /không phải repo git/.test(rKhongRepo.out), 'KR4.2 không phải repo → từ chối + đỏ', rKhongRepo.out);
  const sau = execFileSync('git', ['-C', KIT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const remoteCon = execFileSync('git', ['-C', KIT, 'remote'], { encoding: 'utf8' }).trim();
  chk(truoc === sau && remoteCon.includes('origin'), 'KR4.3 quan hệ: kho thật y nguyên (HEAD + remote origin còn)', `${truoc.slice(0, 8)} vs ${sau.slice(0, 8)} / ${remoteCon}`);
  // đối chứng dương: repo fixture lành → chạy bình thường
  const fx = path.join(TMP, 'fx'); execFileSync('git', ['init', '-q', fx]);
  const rLanh = runChan(`kr_git "${fx}" status >/dev/null && ok "repo lành chạy được"`);
  chk(rLanh.code === 0, 'KR4.4 đối chứng dương: repo fixture lành → chạy', rLanh.out);
}

console.log('KR6 (AC-6) round-trip RANG-KHUON-API — danh sách và định nghĩa khớp nhau');
{
  const src = readFileSync(KHUON, 'utf8');
  const m = src.match(/<<<RANG-KHUON-API([\s\S]*?)RANG-KHUON-API>>>/);
  chk(!!m, 'KR6.1 tìm được khối marker');
  const api = m ? m[1].replace(/#/g, ' ').trim().split(/\s+/) : [];
  chk(api.length >= 8, `KR6.2 danh sách rút được ${api.length} hàm (≥8)`, api.join(','));
  const thieu = api.filter(fn => !new RegExp(`^${fn}\\(\\)`, 'm').test(src));
  chk(thieu.length === 0, 'KR6.3 mọi hàm trong danh sách đều có định nghĩa thật', thieu.join(','));
  // chiều đỏ: xoá một hàm khỏi danh sách trong bản sao → lệch phải bị bắt
  const mutSrc = src.replace('kr_vi_phan\n', '\n');
  const lech = (mutSrc.match(/<<<RANG-KHUON-API([\s\S]*?)RANG-KHUON-API>>>/)[1].replace(/#/g, ' ').trim().split(/\s+/))
    .filter(fn => !new RegExp(`^${fn}\\(\\)`, 'm').test(mutSrc));
  const dinhNghiaKhongTrongDS = /^kr_vi_phan\(\)/m.test(mutSrc) && !mutSrc.match(/<<<RANG-KHUON-API([\s\S]*?)RANG-KHUON-API>>>/)[1].includes('kr_vi_phan');
  chk(dinhNghiaKhongTrongDS || lech.length > 0, 'KR6.4 chiều đỏ: xoá hàm khỏi danh sách → lệch danh-sách↔định-nghĩa bắt được');
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (rang-khuon)`);
process.exit(fail === 0 ? 0 : 1);
