// ten-ca-qua-tien-to.test.mjs — ca bền của hồ sơ ten-ca-qua-tien-to-turbo: `rutTenCa` gọi được tên
// ca đỏ khi dòng mang tiền tố của bộ chạy monorepo (turbo `<gói>:<tác vụ>: `), và dòng pin
// `chap_chon` của làn ghim lại mang đúng tên đó.
//   GG_CASES=AC-1 node tests/scripts/ten-ca-qua-tien-to.test.mjs
// Vật đo là đầu ra THẬT của turbo + bun (fixtures/ten-ca-turbo/NGUON.md); không ca nào gõ tay dòng có
// tiền tố — tiền tố rút bằng mã từ dòng ca đỏ của bản ghi. Mỗi ca chạy CÙNG một hàm kiểm trên vật lành
// (phải xanh), trên bản sao nguyên vẹn (đối chứng: bản sao chạy được) và trên bản sao bị phá (phải đỏ
// với thông điệp ghim). Bản sao phải khác bản gốc trước khi tin màu đỏ. Đường dẫn suy từ vị trí tệp.
import path from 'node:path';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { mkKho, boKiem, ok, ROOT } from './gia-lan-fixture.mjs';

const SCRIPTS = path.join(ROOT, 'feature-loop', 'scripts');
const CHAY_LAI = path.join(SCRIPTS, 'lib', 'chay-lai.mjs');
const BAN_GHI = path.join(ROOT, 'tests', 'scripts', 'fixtures', 'ten-ca-turbo', 'turbo-bun.log');
const DU_PHONG = 'không rút được tên ca';
const TEN_DO = 'app-rieng > chay canh apps/agent';

const banGhi = readFileSync(BAN_GHI, 'utf8');
const dong = banGhi.split('\n');
// Dòng ca đỏ = một cụm tiền tố rồi «(fail) » — định nghĩa của PHÍA ĐO, viết độc lập với khuôn của vật.
const dongDo = dong.filter(l => /^\S+ \(fail\) /.test(l));
// Bẫy: ca XANH có tên chứa «: (fail) » — bộ bóc quá tay sẽ đọc nó thành ca đỏ.
const dongBay = dong.filter(l => l.includes('(pass)') && l.includes('(fail)'));
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Ba cách phá vật. `tat-boc`: phần bóc tiền tố không bao giờ khớp (vật trước vòng). `tham`: bóc tới dấu
// «: » CUỐI dòng thay vì một cụm. `rong-khuon`: khuôn bun nhận cả `(pass)`. Hai cách sau là chiều nhạy
// của phép đo chiều im (AC-3): bộ đọc rút quá tay phải bị bắt.
const PHA = {
  'tat-boc': [/TIEN_TO_BO_CHAY = \/[^\n]*\/;/, 'TIEN_TO_BO_CHAY = /(?!)/;'],
  'tham': [/TIEN_TO_BO_CHAY = \/[^\n]*\/;/, 'TIEN_TO_BO_CHAY = /^.*:\\s+/;'],
  'rong-khuon': [/'bun', re: \/\^\\s\*\\\(fail\\\)/, "'bun', re: /^\\s*\\((?:fail|pass)\\)"],
};
function pha(file, cach) {
  const goc = readFileSync(file, 'utf8');
  const [tim, thay] = PHA[cach];
  const moi = goc.replace(tim, thay);
  ok(moi !== goc, `bản tiêm «${cach}» không khác bản gốc — không tìm thấy chỗ tiêm trong ${path.basename(file)}`);
  writeFileSync(file, moi);
}
// Bản sao trọn thư mục `feature-loop/scripts` (chép cả thư mục, không danh sách tệp), phá nếu có `cach`.
function banSaoScripts(cach) {
  const d = path.join(mkdtempSync(path.join(tmpdir(), 'tctt-')), 'scripts');
  cpSync(SCRIPTS, d, { recursive: true });
  if (cach) pha(path.join(d, 'lib', 'chay-lai.mjs'), cach);
  return d;
}
const rutTu = async (dir) => (await import(pathToFileURL(path.join(dir, 'lib', 'chay-lai.mjs')).href)).rutTenCa;
const { rutTenCa } = await import(pathToFileURL(CHAY_LAI).href);
// Đỏ có ghim: hàm kiểm phải ném, và lời ném phải chứa đúng thông điệp của vật hỏng.
function phaiDo(f, ghim) {
  let loi = null;
  try { f(); } catch (e) { loi = String((e && e.message) || e); }
  ok(loi !== null, `bản phá vẫn xanh — phép đo không phân biệt vật lành với vật hỏng (mong «${ghim}»)`);
  ok(loi.includes(ghim), `bản phá đỏ sai lý do: «${loi}», mong «${ghim}»`);
}

// ── Hàm kiểm — dùng chung cho vật lành, bản sao nguyên vẹn và bản sao bị phá ──────────────────────
function kiemAC1(rut) {
  const r = rut(banGhi);
  ok(bang(r, [TEN_DO]), `tên ca qua tiền tố turbo rỗng: rút ${JSON.stringify(r)}, mong ${JSON.stringify([TEN_DO])}`);
}
// Năm khuôn hiện có, mỗi khuôn một dòng mẫu và tên viết trước (cùng mẫu với ca AC1-rut-ten-ca của
// hồ sơ gia-lan-ghim-lai).
const MAU = [
  ['(fail) nang-luc: khong [5.00ms]', 'nang-luc: khong'],
  ['  ✗ app-rieng chạy cạnh apps/agent', 'app-rieng chạy cạnh apps/agent'],
  [' × tai-lieu-khong-ro', 'tai-lieu-khong-ro'],
  ['  ✘  3 [chromium] › a.spec.ts:12:1 › ten ca (5.1s)', '[chromium] › a.spec.ts:12:1 › ten ca'],
  ['not ok 4 - nguoi-huy', 'nguoi-huy'],
];
const TIEN_TO = (dongDo[0] || '').slice(0, (dongDo[0] || '').indexOf('(fail)'));
function kiemAC2(rut) {
  let soO = 0; const rot = [];
  for (const [mau, ten] of MAU) {
    for (const [dang, dongVao] of [['trần', mau], ['tiền tố', TIEN_TO + mau]]) {
      soO += 1;
      const r = rut(`dòng rác\n${dongVao}\nrác`);
      if (!bang(r, [ten])) rot.push(`${dang} «${dongVao}» → ${JSON.stringify(r)}`);
    }
  }
  ok(soO === MAU.length * 2, `số ô lệch: kiểm ${soO}, ma trận hứa ${MAU.length * 2}`);
  if (rot.length) {
    const tran = rot.filter(x => x.startsWith('trần'));
    ok(!tran.length, `ô trần đổi kết quả (hành vi cũ hỏng): ${tran.join(' · ')}`);
    throw new Error(`ô có tiền tố rơi về câu dự phòng: ${rot.length}/${MAU.length} — ${rot.join(' · ')}`);
  }
}
const conLai = dong.filter(l => !dongDo.includes(l)).join('\n');
function kiemAC3(rut) {
  const r = rut(conLai);
  ok(bang(r, [DU_PHONG]), `dòng không phải ca đỏ thành tên ca: ${JSON.stringify(r)}`);
  const rCo = rut(`${conLai}\n${dongDo[0]}`);
  ok(bang(rCo, [TEN_DO]), `đối chứng dương hỏng: thêm lại dòng ca đỏ mà rút ${JSON.stringify(rCo)}`);
}
// Suite lần đầu in trọn bản ghi rồi đỏ, lần hai xanh. Bộ đếm ở thư mục dấu NGOÀI kho.
const lenhBanGhi = `n=$(cat "$GG_DAU/dem.txt" 2>/dev/null || echo 0); echo $((n+1)) > "$GG_DAU/dem.txt"; [ "$n" -ge 1 ] && exit 0; cat "${BAN_GHI}"; exit 1`;
function kiemAC4(laneFile) {
  const k = mkKho({ suiteCmd: lenhBanGhi, config: '  repin_retry: 1\n' });
  const r = k.lane(['--write'], laneFile ? { laneFile } : {});
  ok(r.status === 0, `làn không xanh (mã ${r.status})\n${r.stderr.split('\n').slice(-15).join('\n')}`);
  ok(k.docDau('dem.txt').trim() === '2', `suite chạy ${k.docDau('dem.txt').trim()} lần, mong 2`);
  const pin = k.docLog().filter(l => l.kind === 'repin').pop();
  const c = ((pin && pin.chap_chon) || [])[0];
  ok(c, 'dòng repin không có chap_chon');
  // Câu dự phòng không được phép đến từ một nhật ký rỗng: nhật ký lần đỏ làn đã đọc phải chứa dòng ca đỏ.
  let nk = '';
  try { nk = readFileSync(path.join(k.root, c.log || ''), 'utf8'); } catch { /* vắng → bắt ngay dưới */ }
  ok(nk.includes('(fail)'), `nhật ký lần đỏ không chứa dòng (fail): ${c.log}`);
  ok(bang(c.ca, [TEN_DO]), `dòng pin không gọi được tên ca: chap_chon[0].ca = ${JSON.stringify(c.ca)}`);
}

const ALL = ['AC-1', 'AC-2', 'AC-3', 'AC-4'];
const { ca, ket } = boKiem(ALL);

await ca('AC-1', 'bản ghi turbo + bun thật → đúng một tên ca đỏ; bản sao tắt bóc → đỏ có ghim', async () => {
  ok(dongDo.length === 1, `bản ghi hỏng: ${dongDo.length} dòng ca đỏ đứng sau tiền tố, mong 1`);
  ok(dong.some(l => l.includes('(pass)') && !l.includes('(fail)')), 'bản ghi thiếu dòng ca xanh');
  ok(dongBay.length === 1, `bản ghi thiếu dòng bẫy (ca xanh có tên chứa «: (fail) »): ${dongBay.length}`);
  kiemAC1(rutTenCa);
  kiemAC1(await rutTu(banSaoScripts(null)));
  const rutPha = await rutTu(banSaoScripts('tat-boc'));
  phaiDo(() => kiemAC1(rutPha), 'tên ca qua tiền tố turbo rỗng');
});

await ca('AC-2', 'năm khuôn × {trần, tiền tố rút từ bản ghi} = 10 ô; bản sao tắt bóc → năm ô tiền tố đỏ', async () => {
  ok(TIEN_TO.trim().length > 0 && /:\s+$/.test(TIEN_TO), `tiền tố rút từ bản ghi không đúng hình «<gói>:<tác vụ>: »: «${TIEN_TO}»`);
  kiemAC2(rutTenCa);
  // Ô phụ (Review Focus của kế hoạch): tác vụ turbo có dấu hai chấm — tiền tố dựng từ tiền tố thật.
  const tienToTacVu = TIEN_TO.replace(/:\s+$/, ':unit: ');
  const rPhu = rutTenCa(`rác\n${tienToTacVu}${MAU[0][0]}\nrác`);
  ok(bang(rPhu, [MAU[0][1]]), `tiền tố tác vụ có dấu hai chấm «${tienToTacVu}» → ${JSON.stringify(rPhu)}`);
  kiemAC2(await rutTu(banSaoScripts(null)));
  const rutPha = await rutTu(banSaoScripts('tat-boc'));
  phaiDo(() => kiemAC2(rutPha), `ô có tiền tố rơi về câu dự phòng: ${MAU.length}/${MAU.length}`);
});

await ca('AC-3', 'dòng không phải ca đỏ (kể cả bẫy) không thành tên ca; ca AC1-rut-ten-ca vẫn xanh; bản bóc tham, khuôn rộng → đỏ có ghim', async () => {
  const loai = [['(pass)', l => l.includes('(pass)')], ['bẫy «: (fail) »', l => dongBay.includes(l)], ['tổng kết', l => / \d+ fail\s*$/.test(l)],
    ['error:', l => l.includes(' error: ')], ['ERROR', l => l.includes(' ERROR ')]];
  for (const [ten, co] of loai) ok(conLai.split('\n').some(co), `tập còn lại thiếu dòng loại «${ten}»`);
  kiemAC3(rutTenCa);
  kiemAC3(await rutTu(banSaoScripts(null)));
  for (const cach of ['tham', 'rong-khuon']) {
    const rutPha = await rutTu(banSaoScripts(cach));
    phaiDo(() => kiemAC3(rutPha), 'dòng không phải ca đỏ thành tên ca');
  }
  const r = spawnSync(process.execPath, [path.join(ROOT, 'tests', 'scripts', 'repin-lane-chay-lai.test.mjs')],
    { encoding: 'utf8', env: { ...process.env, GG_CASES: 'AC1-rut-ten-ca' }, timeout: 120000 });
  ok(r.status === 0 && r.stdout.includes('PASS: [AC1-rut-ten-ca]'), `ca AC1-rut-ten-ca không xanh (mã ${r.status})\n${r.stdout}${r.stderr}`);
});

await ca('AC-4', 'làn ghim lại thật: chap_chon[0].ca = tên ca đỏ; bản sao trọn thư mục tắt bóc → đỏ có ghim', async () => {
  kiemAC4(null);
  kiemAC4(path.join(banSaoScripts(null), 'repin-lane.mjs'));
  const lanePha = path.join(banSaoScripts('tat-boc'), 'repin-lane.mjs');
  phaiDo(() => kiemAC4(lanePha), 'dòng pin không gọi được tên ca');
});

ket();
