// Chân E1–E6 của lan-ghim-lai-theo-paths — lưới trước-gộp THẬT của cây đang kiểm (đường suy từ
// vị trí tệp). Mỗi chân: bản lành XANH trước, bản sao engine bị tiêm ĐỎ với thông điệp ghim.
import { spawnSync } from 'node:child_process';
import { rmSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { dungKho, banSao, KIT } from './kho-mau.mjs';
import { MA_TRAN, M_SO_O } from './ma-tran.mjs';
import { banBase } from './ban-base.mjs';
import { daChayLuoi, batDo } from './chieu-do.mjs';

const chan = process.argv[2];
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
const ket = (ten) => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
const PM = 'scripts/pre-merge-check.sh';
const LIB = 'lib/evidence-core.cjs';
const O = Object.fromEntries(MA_TRAN.map(o => [o.id, o]));
const HONG = new Set(['M7', 'M8', 'M12']);   // hình dạng ghim bằng bản hợp lệ rồi đổi sau pin

// Kho cho một ô: pin, rồi diff của ô. staleScope: undefined (vắng) | 'all' | 'paths' | chuỗi lạ.
const khoO = (o, staleScope, prefix) => { const k = dungKho({ evalsYaml: o.evalsYaml, ghimBangBanHopLe: HONG.has(o.id), staleScope, prefix }); k.apDiff(o.diff); return k; };
const pm = (engine, k, args = [], env = {}) => {
  const r = spawnSync('bash', [path.join(engine, PM), ...args, k.AR], { encoding: 'utf8', env: { ...process.env, ...env } });
  return { st: r.status, out: (r.stdout || '') + (r.stderr || '') };
};
const chuan = (s, k) => s.split(k.R).join('<KHO>').replace(/\b[0-9a-f]{40}\b/g, '<SHA>').replace(/\b[0-9a-f]{7,12}\b/g, '<sha>').replace(/repin-\d{8}T\d{6}Z-\d+/g, '<RUN>');
const staleCua = (out) => {
  const m = out.match(/VIOLATION \[feat\]: evidence is stale[^\n]*Changed:\n((?: {4}\S.*\n?)*)/);
  return m ? m[1].split('\n').map(l => l.trim()).filter(Boolean).sort() : [];
};
const coStale = (out) => /VIOLATION \[feat\]: evidence is stale/.test(out);
const noteBoQua = (out) => (out.match(/NOTE \[feat\]: hoá cũ theo luật cũ, bỏ qua theo paths: (\d+) tệp — ([^\n]*)/) || null);
const sao = (sua) => banSao(sua);
const don = (...ds) => { for (const d of ds) rmSync(d, { recursive: true, force: true }); };

if (chan === 'doc-cu') {
  // E1 — khoá vắng / all: đầu ra BẰNG HỆT bản base trên cùng fixture.
  const BASE = banBase();
  for (const v of [undefined, 'all']) {
    const k = khoO(O.M2, v);
    const a = pm(KIT, k), b = pm(BASE, k);
    ok(a.st === b.st && chuan(a.out, k) === chuan(b.out, k), `E1 khoá ${v === undefined ? 'vắng' : v}: đầu ra + mã (${a.st}) bằng hệt bản base (${b.st})`);
    ok(coStale(a.out), `E1 khoá ${v === undefined ? 'vắng' : v}: M2 vẫn hoá cũ như luật cũ (đối chứng: fixture có diff thật)`);
    k.don();
  }
  const s = sao([{ tep: PM, tu: "  ''|all) STALE_SCOPE=all ;;", thanh: "  '') STALE_SCOPE=paths ;;\n  all) STALE_SCOPE=all ;;" }]);
  const k = khoO(O.M2, undefined);
  const a = pm(s, k), b = pm(BASE, k);
  batDo(ok, 'E1 chiều đỏ: bản sao đổi mặc định khoá vắng thành paths → lọc M2 dù khoá vắng — «đổi mặc định» được thấy', daChayLuoi(a.out), chuan(a.out, k) !== chuan(b.out, k) && !!noteBoQua(a.out));
  k.don(); don(s, BASE); ket('E1');
} else if (chan === 'nhay-dac-hieu') {
  // E2 — (a) chạm đúng MỘT tệp trong paths → hoá cũ đúng tệp; (b) chỉ ngoài paths → im + NOTE.
  const k1 = khoO(O.M1, 'paths'), k2 = khoO(O.M2, 'paths');
  const a = pm(KIT, k1), b = pm(KIT, k2);
  ok(coStale(a.out) && JSON.stringify(staleCua(a.out)) === JSON.stringify(['src/a.js']), `E2 (a) một tệp trong paths → hoá cũ, liệt đúng src/a.js (được ${JSON.stringify(staleCua(a.out))})`);
  const n = noteBoQua(b.out);
  ok(!coStale(b.out), 'E2 (b) chỉ tệp ngoài paths → KHÔNG hoá cũ');
  ok(n && n[1] === '1' && /lib2\/b\.js/.test(n[2]), `E2 (b) NOTE mang slug + số tệp + tên tệp bỏ qua (${n ? n[0] : 'vắng'})`);
  // biến thể hồ sơ nằm sâu + tên tệp có khoảng trắng (Review Focus)
  const k3 = dungKho({ evalsYaml: O.M2.evalsYaml, staleScope: 'paths', prefix: 'pkg/a/' }); k3.apDiff(['lib2/b c.js']);
  const c = pm(KIT, k3); const n3 = noteBoQua(c.out);
  ok(!coStale(c.out) && n3 && /lib2\/b c\.js/.test(n3[2]), `E2 hồ sơ ở pkg/a/ + tên tệp có khoảng trắng → lọc đúng (${n3 ? n3[0] : 'vắng NOTE'})`);
  k3.don();
  // tên tệp có dấu TRONG paths (git in trong ngoặc) → vẫn hoá cũ (lượt chấm 2, t4)
  const k4 = dungKho({ evalsYaml: O.M1.evalsYaml, staleScope: 'paths' }); k4.apDiff(['src/tài.js']);
  const d4 = pm(KIT, k4).out;
  ok(coStale(d4) && staleCua(d4).length === 1 && /src\/t\\303\\240i\.js/.test(staleCua(d4)[0]), `E2 tên có dấu trong paths → VẪN hoá cũ (${JSON.stringify(staleCua(d4))})`);
  const s0 = sao([{ tep: LIB, tu: 'const t = tenGitThat(f);', thanh: 'const t = f;' }]);
  const d5 = pm(s0, k4).out;
  batDo(ok, 'E2 chiều đỏ: bản sao bỏ giải mã tên git → tên có dấu bị lọc nhầm — «tên có dấu lọt» được thấy', daChayLuoi(d5), !coStale(d5) && !!noteBoQua(d5));
  k4.don(); don(s0);
  const s1 = sao([{ tep: PM, tu: '[ "$STALE_SCOPE" = paths ] && [ "$STALE_ALL" -eq 0 ]', thanh: '[ "$STALE_SCOPE" = khong-bao-gio ] && [ "$STALE_ALL" -eq 0 ]' }]);
  { const o1 = pm(s1, k2).out; batDo(ok, 'E2 chiều đỏ: bản sao gỡ bộ lọc → (b) lại hoá cũ — «bộ lọc không chạy» được thấy', daChayLuoi(o1), coStale(o1)); }
  const s2 = sao([{ tep: PM, tu: '[ "$_sbp_n" -gt 0 ] && echo "NOTE [$slug]: hoá cũ theo luật cũ, bỏ qua theo paths:', thanh: '[ "$_sbp_n" -gt 0 ] && : "NOTE [$slug]: hoá cũ theo luật cũ, bỏ qua theo paths:' }]);
  const b2 = pm(s2, k2);
  batDo(ok, 'E2 chiều đỏ: bản sao bỏ dòng NOTE → lọc mà im — «bỏ qua im lặng» được thấy', daChayLuoi(b2.out), !coStale(b2.out) && !noteBoQua(b2.out));
  k1.don(); k2.don(); don(s1, s2); ket('E2');
} else if (chan === 'chi-thu') {
  // E3 — tập hoá cũ dưới paths ⊆ tập dưới luật cũ trên ĐÚNG 12 ô.
  const kiemSoO = (mt) => { if (mt.length !== M_SO_O) throw new Error(`số ô lệch: ${mt.length} ≠ ${M_SO_O}`); };
  kiemSoO(MA_TRAN);
  let soO = 0;
  for (const o of MA_TRAN) {
    const kc = khoO(o, undefined), kp = khoO(o, 'paths');
    const cu = staleCua(pm(KIT, kc).out), moi = staleCua(pm(KIT, kp).out);
    ok(moi.every(f => cu.includes(f)), `E3 ${o.id}: hoá cũ dưới paths ${JSON.stringify(moi)} ⊆ luật cũ ${JSON.stringify(cu)}`);
    if (o.id === 'M3') ok(cu.length === 0 && moi.length === 0, 'E3 M3: _acceptance/config.yaml + tệp T1 trong paths → KHÔNG hoá cũ ở cả hai luật');
    soO++; kc.don(); kp.don();
  }
  ok(soO === M_SO_O, `E3 đo đúng ${M_SO_O} ô (được ${soO})`);
  let bat = ''; try { kiemSoO(MA_TRAN.filter(o => o.id !== 'M8')); } catch (e) { bat = e.message; }
  ok(/số ô lệch/.test(bat), 'E3 chiều đỏ: bộ sinh mất ô M8 → «số ô lệch»');
  const s = sao([{ tep: PM, tu: '    if [ -n "$stale" ] && [ "$STALE_SCOPE" = paths ]', thanh: '    stale="$(git -C "$ROOT" diff --name-only "$vc" -- 2>/dev/null)"\n    if [ -n "$stale" ] && [ "$STALE_SCOPE" = paths ]' }]);
  const k = khoO(O.M3, 'paths');
  { const o3 = pm(s, k).out; batDo(ok, 'E3 chiều đỏ: bản sao so paths với diff THÔ → M3 hoá cũ — «nới: tệp ngoài luật cũ» được thấy', daChayLuoi(o3), coStale(o3)); }
  k.don(); don(s); ket('E3');
} else if (chan === 'hinh-ho-so') {
  // E4 — M4…M12 dưới khoá paths đúng cột Kỳ vọng; năm mutant trên lib.
  const KY = { M4: 'cu', M5: 'loc', M6: 'hoa-cu', M7: 'cu', M8: 'cu', M9: 'loc', M10: 'loc', M11: 'loc', M12: 'cu', M13: 'cu', M14: 'hoa-cu', M15: 'hoa-cu' };
  const ketLuanDu = (engine, id) => { const k = khoO(O[id], 'paths'); const r = pm(engine, k); k.don(); return { t: coStale(r.out) ? 'stale' : 'loc', out: r.out }; };
  const ketLuan = (engine, id) => ketLuanDu(engine, id).t;
  // ghim LÝ DO lưới in ra (lượt chấm 1, t5): «giữ luật cũ» phải vì đúng nhánh của ô, không nhánh khác.
  const LY_DO = { M4: 'eval-may-thieu-paths:E1', M7: 'khong-co-evals', M8: 'evals-hong', M12: 'eval-ngoai-may-thieu-paths:E1', M13: 'eval-ngoai-may-thieu-paths:E2' };
  for (const [id, ly] of Object.entries(LY_DO)) { const r = ketLuanDu(KIT, id); ok(r.out.includes(`NOTE [feat]: bộ lọc paths không áp (${ly}) — giữ luật cũ`), `E4 ${id}: NOTE gọi đúng lý do «${ly}»`); }
  const muon = (ky) => (ky === 'loc' ? 'loc' : 'stale');
  let n = 0;
  for (const [id, ky] of Object.entries(KY)) { const t = ketLuan(KIT, id); ok(t === muon(ky), `E4 ${id} (${ky}) → ${t}`); n++; }
  ok(n === 12, `E4 đúng 12 ô M4–M15 (được ${n})`);
  const M = [
    { pin: 'im ô ngoài làn máy', o: 'M6', sua: [{ tep: LIB, tu: '    globs.push(...p);', thanh: '    if (isRepinMachineEval(e)) globs.push(...p);' }] },
    { pin: 'eval máy thiếu paths', o: 'M4', sua: [{ tep: LIB, tu: 'if (isRepinMachineEval(e)) return cu(`eval-may-thieu-paths:${e.id}`);', thanh: 'if (isRepinMachineEval(e)) continue;' }] },
    { pin: 'eval ngoài làn máy thiếu paths', o: 'M13', sua: [{ tep: LIB, tu: 'if (normaliseEvalStatus(e.status) !== EVAL_STATUS_NOT_RUN) return cu(`eval-ngoai-may-thieu-paths:${e.id}`);', thanh: '' }] },
    { pin: 'chú thích nuốt paths', o: 'M14', sua: [{ tep: LIB, tu: "const v = (f[1].trim().startsWith('#') ? '' : f[1].replace(/\\s+#.*$/, '')).trim();", thanh: 'const v = f[1].trim();' }, { tep: LIB, tu: "  if (globs.some(g => !String(g || '').trim())) return cu('evals-hong');", thanh: '' }] },
    { pin: 'dòng trống cắt paths', o: 'M15', sua: [{ tep: LIB, tu: '      if (!raw.trim() || /^\\s*#/.test(raw)) continue;', thanh: '' }] },
    { pin: 'tệp hỏng thành im', o: 'M8', sua: [{ tep: LIB, tu: "return cu('evals-hong');\n  const globs", thanh: "return { apply: true, reason: null, kept: [], skipped: all };\n  const globs" }] },
    { pin: 'not-run chặn lọc', o: 'M5', sua: [{ tep: LIB, tu: 'if (isRepinMachineEval(e)) return cu(`eval-may-thieu-paths', thanh: "if (['test', 'script'].includes(String(e.executor).trim())) return cu(`eval-may-thieu-paths" }] },
    { pin: 'bộ đọc paths một dạng', o: 'M10', sua: [{ tep: LIB, tu: '    if (!v) { seq = []; continue; }', thanh: '    if (!v) return null;' }] },
  ];
  for (const m of M) { const s = sao(m.sua); const r = ketLuanDu(s, m.o); batDo(ok, `E4 chiều đỏ: bản sao «${m.pin}» → ${m.o} lệch kỳ vọng (${r.t})`, daChayLuoi(r.out), r.t !== muon(KY[m.o])); don(s); }
  ket('E4');
} else if (chan === 'khong-chay-duoc') {
  // E5 — bộ lọc không chạy được → giữ luật cũ + NOTE nói vì sao; đối chứng: lành thì lọc.
  const k = khoO(O.M2, 'paths');
  const lanh = pm(KIT, k);
  ok(!coStale(lanh.out), 'E5 đối chứng: môi trường lành → bộ lọc chạy, M2 im');
  const noteKhong = (out) => /NOTE \[feat\]: bộ lọc paths không chạy được \([^)]+\) — giữ luật cũ/.test(out);
  // (i) thiếu tệp lib: bản sao gỡ evidence-core.cjs
  const s1 = sao([]); rmSync(path.join(s1, LIB));
  const r1 = pm(s1, k);
  ok(coStale(r1.out) && noteKhong(r1.out), 'E5 thiếu lib → VẪN hoá cũ + NOTE «không chạy được»');
  // (ii) hàm lib ném lỗi
  const s2 = sao([{ tep: LIB, tu: 'function staleByPaths(staleFiles, evalsText, opts = {}) {', thanh: "function staleByPaths(staleFiles, evalsText, opts = {}) { throw new Error('tiem-loi');" }]);
  const r2 = pm(s2, k);
  ok(coStale(r2.out) && noteKhong(r2.out), 'E5 lib ném lỗi → VẪN hoá cũ + NOTE «không chạy được»');
  // (iii) thiếu node trên PATH
  const r3 = pm(KIT, k, [], { PATH: '/usr/bin:/bin' });
  const coNode = spawnSync('bash', ['-c', 'command -v node'], { env: { PATH: '/usr/bin:/bin' } }).status === 0;
  ok(coNode || (coStale(r3.out) && noteKhong(r3.out)), `E5 thiếu node → VẪN hoá cũ + NOTE (${coNode ? 'máy có node ở /usr/bin — vế này không áp' : 'đã đo'})`);
  ok(r1.st !== 0 && r2.st !== 0, `E5 mã thoát khác 0 khi bộ lọc không chạy (${r1.st}, ${r2.st})`);
  // (iv) node in CẢNH BÁO ra stderr (lượt chấm 1, t4): tệp TRONG paths vẫn phải hoá cũ, không bị xoá im.
  const wf = path.join(k.R, '..', path.basename(k.R) + '-warn.cjs'); writeFileSync(wf, "process.emitWarning('canh-bao-thu');\n");
  const k1 = khoO(O.M1, 'paths');
  const r4 = pm(KIT, k1, [], { NODE_OPTIONS: `--require ${wf}` });
  ok(coStale(r4.out) && JSON.stringify(staleCua(r4.out)) === JSON.stringify(['src/a.js']), `E5 node in cảnh báo → src/a.js VẪN hoá cũ (${JSON.stringify(staleCua(r4.out))})`);
  const s4 = sao([{ tep: PM, tu: '2>"$_sbp_ef")"; then', thanh: '2>&1)"; then' }, { tep: PM, tu: '      elif [ "$_sbp_dau" = "APPLY=1" ]; then', thanh: '      elif [ "$_sbp_dau" != "APPLY=0" ]; then' }]);
  { const o4 = pm(s4, k1, [], { NODE_OPTIONS: `--require ${wf}` }).out; batDo(ok, 'E5 chiều đỏ: bản sao trộn stderr + coi mọi đầu ra là APPLY=1 → src/a.js bị xoá im — «đầu ra hỏng thành im» được thấy', daChayLuoi(o4), !coStale(o4)); }
  k1.don(); don(s4); rmSync(wf, { force: true });
  const s3 = sao([{ tep: LIB, tu: 'function staleByPaths(staleFiles, evalsText, opts = {}) {', thanh: "function staleByPaths(staleFiles, evalsText, opts = {}) { throw new Error('tiem-loi');" },
    { tep: PM, tu: '        echo "NOTE [$slug]: bộ lọc paths không chạy được', thanh: '        stale=""; echo "NOTE [$slug]: bộ lọc paths không chạy được' }]);
  { const o5 = pm(s3, k).out; batDo(ok, 'E5 chiều đỏ: bản sao nuốt lỗi rồi trả danh sách rỗng → im — «rơi về im khi lỗi» được thấy', daChayLuoi(o5) && /bộ lọc paths không chạy được/.test(o5), !coStale(o5)); }
  k.don(); don(s1, s2, s3); ket('E5');
} else if (chan === 'khoa-va-co') {
  // E6 — sai chính tả → VIOLATION [config]; --stale-all + paths ≡ khoá vắng.
  const kSai = khoO(O.M2, 'path');
  const r = pm(KIT, kSai);
  ok(/VIOLATION \[config\]: risk_tiers\.stale_scope: "path" không hợp lệ — dùng paths \| all/.test(r.out) && r.st !== 0, 'E6 stale_scope: path → VIOLATION [config] gọi tên giá trị + hai giá trị hợp lệ');
  ok(coStale(r.out), 'E6 sai chính tả → không ô nào bị lọc (giữ luật cũ)');
  const kVang = khoO(O.M2, undefined), kP = khoO(O.M2, 'paths');
  const a = pm(KIT, kVang), b = pm(KIT, kP, ['--stale-all']);
  ok(a.st === b.st && JSON.stringify(staleCua(a.out)) === JSON.stringify(staleCua(b.out)) && coStale(b.out), `E6 --stale-all + paths → hoá cũ y như khoá vắng (${JSON.stringify(staleCua(b.out))})`);
  const s1 = sao([{ tep: PM, tu: '      STALE_ALL=1; shift ;;', thanh: '      shift ;;' }]);
  { const o6 = pm(s1, kP, ['--stale-all']).out; batDo(ok, 'E6 chiều đỏ: bản sao bỏ qua cờ → chiến dịch bị lọc — «chiến dịch bị thu hẹp» được thấy', daChayLuoi(o6), !coStale(o6) && !!noteBoQua(o6)); }
  const s2 = sao([{ tep: PM, tu: '  *) echo "VIOLATION [config]: risk_tiers.stale_scope:', thanh: '  *) STALE_SCOPE=all ;; zz) echo "VIOLATION [config]: risk_tiers.stale_scope:' }]);
  { const o7 = pm(s2, kSai).out; batDo(ok, 'E6 chiều đỏ: bản sao rơi về all khi sai chính tả → im — «sai chính tả im» được thấy', daChayLuoi(o7) && coStale(o7), !/VIOLATION \[config\]: risk_tiers\.stale_scope/.test(o7)); }
  kSai.don(); kVang.don(); kP.don(); don(s1, s2); ket('E6');
}
