// design-gate-che-do-chat.test.mjs — cờ tuỳ chọn --require-measured của design-gate (hồ sơ
// design-gate-che-do-chat AC-1…AC-4, AC-6, AC-7; gốc crm 25/10 VK10: static trên .tsx trả KHONG-DO-DUOC mà
// thoát 0, eval `|| exit 1` xanh rỗng).
//
// Ma trận ô viết trước, mỗi ô một bản kỳ vọng ĐẦY ĐỦ (mã · verdict · khoá JSON · dòng stderr) — không đo
// chuỗi-có-mặt cho một lời hứa quan hệ. Đối chứng dương nằm trong chính ma trận: cùng đích chạy KHÔNG cờ
// (mã 0 / như cũ), và ô HTML có lỗi chặn phải đỏ. Đích do ca SINH trong lượt (tsx/jsx/vue/html chữ nhạt)
// hoặc chép từ tests/design-eval/fixtures. Mọi đường suy từ vị trí tệp này.
//
//   DG-CC1  static · có cờ · đích không phải HTML, không lỗi thấy được → 5      (AC-1)
//   DG-CC2  static · có cờ · tsx có lỗi chặn thấy được → REJECT 2               (AC-2)
//   DG-CC3  HTML: có cờ == không cờ, ở cả ô sạch lẫn ô đỏ                       (AC-3)
//   DG-CC4  dom · có cờ · tsx → 5 trước khi nạp jsdom; HTML vẫn BLOCKED 3       (AC-4)
//   DG-CC6  vị trí cờ không nuốt đối số kế bên; vòng `|| exit 1` nuốt mã 5      (AC-6)
//   DG-CC7  năm đột biến trên bản sao → CHÍNH phép đo đỏ, ghim ô                (AC-7)
//   DG-CC8  quan hệ trên trọn ma trận: cờ chỉ đổi ô không đo được              (AC-8)
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, symlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const FIX = path.join(KIT, 'tests', 'design-eval', 'fixtures');
const VONG = path.join(KIT, 'scripts', 'design-gate.mjs');
const CO = '--require-measured';

let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const TAO = [];
const tam = (t) => { const d = mkdtempSync(path.join(tmpdir(), t)); TAO.push(d); return d; };

// ── đích ──
const DICH = tam('dg-cc-dich-');
const tsx = (than) => `export default function A() {\n  return (\n${than}\n  );\n}\n`;
writeFileSync(path.join(DICH, 'tsx-sach.tsx'), tsx('    <div className="bg-[#fff] text-[#eee]"><p style={{ color: "#eee" }}>chữ gần như vô hình</p></div>'));
writeFileSync(path.join(DICH, 'tsx-anh-rong.tsx'), tsx('    <div><img src="" /></div>'));
writeFileSync(path.join(DICH, 'jsx-sach.jsx'), tsx('    <section className="text-gray-100 bg-white">chữ nhạt</section>'));
writeFileSync(path.join(DICH, 'vue-sach.vue'), '<template>\n  <p :style="{ color: \'#eee\' }">chữ nhạt</p>\n</template>\n');
cpSync(path.join(FIX, 'f09-clean-good.html'), path.join(DICH, 'khong-duoi'));
cpSync(path.join(FIX, 'f09-clean-good.html'), path.join(DICH, 'html-sach.html'));
cpSync(path.join(FIX, 'f09-clean-good.html'), path.join(DICH, 'HOA.HTML'));
cpSync(path.join(FIX, 'f04-side-tab.html'), path.join(DICH, 'html-p1.html'));
const trang = (than) => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title></head><body><main>${than}</main></body></html>\n`;
writeFileSync(path.join(DICH, 'html-anh-rong.html'), trang('<p>ảnh</p><img src="" alt="">'));
writeFileSync(path.join(DICH, 'html-chu-nhat.html'), trang('<p style="color:#eeeeee;background:#ffffff">chữ gần như vô hình</p>'));
cpSync(path.join(FIX, 'f09-clean-good.html'), path.join(DICH, 'html-htm.htm'));
const KHONG_JSDOM = path.join(DICH, 'khong-co-thu-muc-jsdom');
// jsdom GIẢ do ca sinh: nạp nó là để lại tệp lính canh rồi ném — đo được THỨ TỰ «quyết bằng đuôi trước khi nạp».
const JSDOM_GIA = path.join(DICH, 'jsdom-gia');
const LINH_CANH = path.join(DICH, 'jsdom-gia-da-nap');
mkdirSync(path.join(JSDOM_GIA, 'node_modules', 'jsdom'), { recursive: true });
writeFileSync(path.join(JSDOM_GIA, 'node_modules', 'jsdom', 'package.json'), '{"name":"jsdom","main":"index.js"}');
writeFileSync(path.join(JSDOM_GIA, 'node_modules', 'jsdom', 'index.js'),
  `require('fs').writeFileSync(${JSON.stringify(LINH_CANH)}, 'nap');\nthrow new Error('jsdom gia');\n`);
const xoaLinhCanh = () => rmSync(LINH_CANH, { force: true });

const chay = (gate, argv, sh) => {
  const r = sh ? spawnSync('bash', ['-c', sh], { encoding: 'utf8' }) : spawnSync(process.execPath, [gate, ...argv], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(r.stdout); } catch { j = null; }
  return { code: r.status, j, dong: (r.stderr || '').split('\n').filter(l => l.includes('không đo được')) };
};
const d = (tep) => path.join(DICH, tep);

// Kỳ vọng đầy đủ của một ô «không đo được» có cờ.
function kiemKhongDo(ten, s, mode, duoi) {
  const loi = [];
  const can = `design-gate: ${mode} không đo được tệp này (${duoi})`;
  if (s.code !== 5) loi.push(`${ten}: mã ${s.code}, mong 5`);
  if (!s.j) return [...loi, `${ten}: stdout không phải JSON`];
  if (s.j.verdict !== 'KHONG-DO-DUOC') loi.push(`${ten}: verdict ${s.j.verdict}, mong KHONG-DO-DUOC`);
  if (s.j.exit_code !== 5) loi.push(`${ten}: JSON exit_code ${s.j.exit_code}, mong 5`);
  if (s.j.mode !== mode) loi.push(`${ten}: JSON mode ${s.j.mode}, mong ${mode}`);
  if (s.j.do_duoc !== false) loi.push(`${ten}: thiếu do_duoc: false`);
  if (s.j.require_measured !== true) loi.push(`${ten}: thiếu require_measured: true`);
  if (s.dong.length !== 1 || !s.dong[0].startsWith(can) || !s.dong[0].includes(`${CO}: thoát 5`)) {
    loi.push(`${ten}: stderr phải có đúng một dòng «${can}… ${CO}: thoát 5…» (có ${s.dong.length}: ${s.dong.join(' / ')})`);
  }
  return loi;
}

// doMaTran(gate) — CHÍNH phép đo của DG-CC1…CC4, CC6; trả lỗi theo ca (rỗng = đạt) + bảng ô.
function doMaTran(gate) {
  const loi = { CC1: [], CC2: [], CC3: [], CC4: [], CC6: [], CC8: [] }, bang = [];

  // CC1 — bốn đích không phải HTML, static có cờ; đối chứng: cùng đích không cờ thoát 0.
  for (const [ten, tep, duoi] of [['tsx-sach', 'tsx-sach.tsx', '.tsx'], ['jsx-sach', 'jsx-sach.jsx', '.jsx'], ['vue-sach', 'vue-sach.vue', '.vue'], ['khong-duoi', 'khong-duoi', 'không đuôi']]) {
    const s = chay(gate, [d(tep), '--mode', 'static', CO]);
    const k = chay(gate, [d(tep), '--mode', 'static']);
    bang.push(`${ten}: co ${s.code} · khong co ${k.code}`);
    if (k.code !== 0 || k.j?.verdict !== 'KHONG-DO-DUOC') loi.CC1.push(`${ten}: đối chứng hỏng — không cờ mà mã ${k.code}/${k.j?.verdict}`);
    loi.CC1.push(...kiemKhongDo(ten, s, 'static', duoi));
  }

  // CC2 — lỗi chặn thấy được trên .tsx giữ REJECT 2.
  {
    const s = chay(gate, [d('tsx-anh-rong.tsx'), '--mode', 'static', CO]);
    bang.push(`tsx-anh-rong: co ${s.code}/${s.j?.verdict}`);
    if (s.code !== 2 || s.j?.verdict !== 'REJECT') loi.CC2.push(`tsx-anh-rong: ${s.code}/${s.j?.verdict}, mong 2/REJECT`);
    if (!s.j?.blocking?.includes('broken-image')) loi.CC2.push(`tsx-anh-rong: blocking ${JSON.stringify(s.j?.blocking)} thiếu broken-image`);
    if (s.j?.do_duoc !== false) loi.CC2.push('tsx-anh-rong: thiếu do_duoc: false');
  }

  // CC3 — HTML: có cờ == không cờ == bảng mong đợi, không khoá/dòng «không đo được».
  for (const [ten, tep, mong, them] of [
    ['html-sach', 'html-sach.html', [0, 'PASS'], []],
    ['html-hoa', 'HOA.HTML', [0, 'PASS'], []],
    ['html-anh-rong', 'html-anh-rong.html', [2, 'REJECT'], []],
    ['html-p1', 'html-p1.html', [2, 'REJECT'], ['--fail-on', 'P0,P1']],
    // Giới hạn đã khai: static không thấy màu kể cả trên HTML — ô này đổi màu thì tài liệu phải đổi theo.
    ['html-chu-nhat', 'html-chu-nhat.html', [0, 'PASS'], []],
  ]) {
    const s = chay(gate, [d(tep), '--mode', 'static', ...them, CO]);
    const k = chay(gate, [d(tep), '--mode', 'static', ...them]);
    bang.push(`${ten}: co ${s.code}/${s.j?.verdict} · khong co ${k.code}/${k.j?.verdict}`);
    for (const [nhan, r] of [['có cờ', s], ['không cờ', k]]) {
      if (r.code !== mong[0] || r.j?.verdict !== mong[1]) loi.CC3.push(`${ten} (${nhan}): ${r.code}/${r.j?.verdict}, mong ${mong.join('/')}`);
      if (r.j && ('do_duoc' in r.j || 'require_measured' in r.j)) loi.CC3.push(`${ten} (${nhan}): đích HTML mà JSON mang do_duoc/require_measured`);
      if (r.dong.length) loi.CC3.push(`${ten} (${nhan}): đích HTML mà stderr có dòng «không đo được»`);
    }
  }

  // CC4 — dom có cờ: .tsx quyết trước jsdom (thư mục jsdom không tồn tại vẫn 5); đối chứng HTML và không cờ → 3.
  {
    const s = chay(gate, [d('tsx-sach.tsx'), '--mode', 'dom', CO, '--jsdom', KHONG_JSDOM]);
    const h = chay(gate, [d('html-sach.html'), '--mode', 'dom', CO, '--jsdom', KHONG_JSDOM]);
    const k = chay(gate, [d('tsx-sach.tsx'), '--mode', 'dom', '--jsdom', KHONG_JSDOM]);
    bang.push(`tsx-dom-chat: ${s.code}/${s.j?.verdict} · html-dom-chat: ${h.code}/${h.j?.verdict} · tsx-dom: ${k.code}/${k.j?.verdict}`);
    loi.CC4.push(...kiemKhongDo('tsx-dom-chat', s, 'dom', '.tsx'));
    if (h.code !== 3 || h.j?.verdict !== 'BLOCKED') loi.CC4.push(`html-dom-chat: ${h.code}/${h.j?.verdict}, mong 3/BLOCKED`);
    if (k.code !== 3 || k.j?.verdict !== 'BLOCKED') loi.CC4.push(`tsx-dom: đối chứng không cờ ${k.code}/${k.j?.verdict}, mong 3/BLOCKED`);
    // Thứ tự: với jsdom CÓ MẶT (giả), .tsx có cờ không được nạp jsdom; đối chứng HTML cùng thư mục PHẢI nạp.
    xoaLinhCanh();
    const g = chay(gate, [d('tsx-sach.tsx'), '--mode', 'dom', CO, '--jsdom', JSDOM_GIA]);
    const napTsx = existsSync(LINH_CANH);
    xoaLinhCanh();
    const gh = chay(gate, [d('html-sach.html'), '--mode', 'dom', CO, '--jsdom', JSDOM_GIA]);
    const napHtml = existsSync(LINH_CANH);
    xoaLinhCanh();
    bang.push(`tsx-dom-jsdom-gia: ${g.code} nap=${napTsx} · html-dom-jsdom-gia: ${gh.code} nap=${napHtml}`);
    if (g.code !== 5) loi.CC4.push(`tsx-dom-jsdom-gia: mã ${g.code}, mong 5`);
    if (napTsx) loi.CC4.push('tsx-dom-jsdom-gia: jsdom đã bị nạp trước khi quyết đích không đo được');
    if (!napHtml) loi.CC4.push('html-dom-jsdom-gia: đối chứng hỏng — đích HTML không nạp jsdom giả');
  }

  // CC6 — ba vị trí cờ; dạng crm dùng --target.
  for (const [ten, argv] of [
    ['co-truoc', [CO, d('tsx-sach.tsx'), '--mode', 'static']],
    ['co-sau', [d('tsx-sach.tsx'), '--mode', 'static', CO]],
    ['dang-crm', ['--target', d('tsx-sach.tsx'), '--mode', 'static', CO]],
  ]) {
    const s = chay(gate, argv);
    bang.push(`${ten}: ${s.code}`);
    if (s.code !== 5) loi.CC6.push(`${ten}: mã ${s.code}, mong 5`);
    if (s.j?.target !== d('tsx-sach.tsx')) loi.CC6.push(`${ten}: target ${s.j?.target}`);
  }
  // Dạng vòng lặp của crm: `|| exit 1` nuốt mã 5 thành 1; `|| exit $?` truyền nguyên mã. Đối chứng: không cờ → 0.
  const vong = (duoi, co) => `for t in ${JSON.stringify(d('tsx-sach.tsx'))} ${JSON.stringify(d('jsx-sach.jsx'))}; do ${JSON.stringify(process.execPath)} ${JSON.stringify(gate)} --target "$t" --mode static ${co} >/dev/null 2>&1 ${duoi}; done`;
  for (const [ten, sh, mong] of [
    ['vong-exit-1', vong('|| exit 1', CO), 1],
    ['vong-exit-ma', vong('|| exit $?', CO), 5],
    ['vong-khong-co', vong('|| exit 1', ''), 0],
  ]) {
    const s = chay(gate, null, sh);
    bang.push(`${ten}: ${s.code}`);
    if (s.code !== mong) loi.CC6.push(`${ten}: mã ${s.code}, mong ${mong}`);
  }

  // CC8 — quan hệ trên trọn ma trận (mọi đích × static/dom): có cờ → 5 khi và chỉ khi ô «không đo được»,
  // còn lại mã + verdict BẰNG lượt không cờ. «Không đo được» viết độc lập ở đây: static → verdict không cờ là
  // KHONG-DO-DUOC; dom → đuôi ngoài {.html .htm .xhtml} (không hoa thường). jsdom vắng ở mọi ô dom.
  const HTML_TEST = ['.html', '.htm', '.xhtml'];
  for (const tep of ['tsx-sach.tsx', 'tsx-anh-rong.tsx', 'jsx-sach.jsx', 'vue-sach.vue', 'khong-duoi', 'html-sach.html', 'HOA.HTML', 'html-htm.htm', 'html-p1.html', 'html-anh-rong.html', 'html-chu-nhat.html', 'khong-co-tep-nay.tsx']) {
    for (const mode of ['static', 'dom']) {
      const them = mode === 'dom' ? ['--jsdom', KHONG_JSDOM] : [];
      const k = chay(gate, [d(tep), '--mode', mode, ...them]);
      const s = chay(gate, [d(tep), '--mode', mode, ...them, CO]);
      const khongDo = mode === 'static' ? k.j?.verdict === 'KHONG-DO-DUOC' : !HTML_TEST.includes(path.extname(tep).toLowerCase());
      const ten = `${tep}@${mode}`;
      if (khongDo) { if (s.code !== 5) loi.CC8.push(`${ten}: ô không đo được có cờ mã ${s.code}, mong 5`); }
      else if (s.code !== k.code || s.j?.verdict !== k.j?.verdict) loi.CC8.push(`${ten}: có cờ ${s.code}/${s.j?.verdict} ≠ không cờ ${k.code}/${k.j?.verdict}`);
    }
  }
  bang.push('CC8: 12 dich x 2 che do');
  return { loi, bang };
}

const that = doMaTran(VONG);
const bao = (ca, ten, mo) => {
  if (that.loi[ca].length) bad(`DG-${ca} ${ten}`, that.loi[ca].join(' | '));
  else ok(`DG-${ca} ${mo}`);
};
bao('CC1', 'static co co tren dich khong phai HTML', 'tsx/jsx/vue/khong-duoi static co co → 5 KHONG-DO-DUOC + do_duoc:false + require_measured:true + mot dong stderr; khong co → 0');
bao('CC2', 'loi chan thay duoc tren tsx', 'tsx-anh-rong co co → 2 REJECT broken-image');
bao('CC3', 'HTML doi theo co', `5 o HTML co co == khong co (sach 0, hoa 0, anh-rong 2, p1 2, chu-nhat 0 — gioi han static khong thay mau)`);
bao('CC4', 'dom co co', 'tsx dom co co → 5 truoc jsdom (jsdom gia khong bi nap); html dom co co → 3 va jsdom gia bi nap; tsx dom khong co → 3');
bao('CC6', 'vi tri co', 'co truoc · co sau · --target dang crm → ca ba 5 cung target; vong `|| exit 1` → 1, `|| exit $?` → 5, khong co → 0');
bao('CC8', 'quan he tron ma tran', '12 dich x {static, dom}: co co → 5 khi va chi khi o khong do duoc, con lai ma + verdict bang khong co');

// ── DG-CC7 (AC-7) — đột biến trên bản sao; bản lành phải xanh TRƯỚC (đối chứng dương) ──
function banSao(...cap) {
  const goc = tam('dg-cc-dot-bien-');
  mkdirSync(path.join(goc, 'scripts'));
  symlinkSync(path.join(KIT, 'lib'), path.join(goc, 'lib'));
  symlinkSync(path.join(KIT, 'vendor'), path.join(goc, 'vendor'));
  let s = readFileSync(VONG, 'utf8');
  for (let i = 0; i < cap.length; i += 2) {
    const [thay, bang] = [cap[i], cap[i + 1]];
    if (s.split(thay).length !== 2) throw new Error(`cho tiem khop ${s.split(thay).length - 1} lan (can 1): ${thay}`);
    s = s.replace(thay, bang);
  }
  writeFileSync(path.join(goc, 'scripts', 'design-gate.mjs'), s);
  return path.join(goc, 'scripts', 'design-gate.mjs');
}
const phang = (r) => Object.values(r.loi).flat();
try {
  const lanh = phang(that);
  if (lanh.length) throw new Error(`doi chung duong: ban lanh chua xanh — ${lanh.join(' | ')}`);
  const a = phang(doMaTran(banSao('const MA_KHONG_DO = 5;', 'const MA_KHONG_DO = 0;')));
  const b = phang(doMaTran(banSao("if (args.requireMeasured && args.mode !== 'static' && !laHtml) {", 'if (false) {')));
  const c = phang(doMaTran(banSao('const khongDoDuoc = !laHtml;', 'const khongDoDuoc = !laHtml || args.requireMeasured;')));
  // (d) quyết SAU khi nạp jsdom: nhánh sớm tắt, phép quyết dời vào nhánh nạp-hỏng — mã vẫn 5, chỉ thứ tự sai.
  const dd = phang(doMaTran(banSao(
    "if (args.requireMeasured && args.mode !== 'static' && !laHtml) {", 'if (false) {',
    '  } catch {\n', "  } catch {\n    if (args.requireMeasured && !laHtml) emit({ ...base, mode: args.mode, verdict: 'KHONG-DO-DUOC', exit_code: MA_KHONG_DO, ...baoKhongDo(args.mode) }, MA_KHONG_DO);\n")));
  // (e) nhánh dom dùng vị từ đuôi riêng, phân biệt hoa thường.
  const e = phang(doMaTran(banSao("if (args.requireMeasured && args.mode !== 'static' && !laHtml) {", "if (args.requireMeasured && args.mode !== 'static' && duoi !== path.extname(args.target)) {")));
  if (!a.some(l => l.startsWith('tsx-sach: mã 0, mong 5'))) bad('DG-CC7a dot bien «nhanh chat thoat 0» ma phep do khong neu o tsx-sach', a.join(' | ') || 'xanh');
  else if (!b.some(l => l.startsWith('tsx-dom-chat: mã 3, mong 5'))) bad('DG-CC7b dot bien «go nhanh dom quyet truoc jsdom» ma phep do khong neu o tsx-dom-chat', b.join(' | ') || 'xanh');
  else if (!c.some(l => l.startsWith('html-sach (có cờ)'))) bad('DG-CC7c dot bien «nhanh chat ap ca HTML» ma phep do khong neu o html-sach', c.join(' | ') || 'xanh');
  else if (!dd.some(l => l.startsWith('tsx-dom-jsdom-gia: jsdom đã bị nạp'))) bad('DG-CC7d dot bien «quyet sau khi nap jsdom» ma phep do khong neu o tsx-dom-jsdom-gia', dd.join(' | ') || 'xanh');
  else if (!e.some(l => l.startsWith('HOA.HTML@dom: có cờ'))) bad('DG-CC7e dot bien «vi tu duoi rieng phan biet hoa thuong» ma phep do khong neu o HOA.HTML@dom', e.join(' | ') || 'xanh');
  else ok('DG-CC7 ban lanh xanh; dot bien quyet-sau-jsdom → «tsx-dom-jsdom-gia: jsdom đã bị nạp…»; dot bien vi-tu-rieng → «HOA.HTML@dom: có cờ…»; dot bien thoat-0 → «tsx-sach: mã 0, mong 5»; dot bien go-dom → «tsx-dom-chat: mã 3, mong 5»; dot bien ap-HTML → «html-sach (có cờ)…»');
} catch (e) { bad('DG-CC7 khong dung duoc ban dot bien', String(e.message || e)); }

for (const x of TAO) rmSync(x, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (design-gate-che-do-chat)`);
process.exit(fail ? 1 : 0);
