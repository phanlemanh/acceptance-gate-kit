// Chân lui-khong-engine (AC-13, thêm ở S4-r3) — hai lời hứa của lưới quanh NGUỒN:
//  (A) câu NOTE «một nguồn» in DANH SÁCH THẬT đọc từ nguồn, không bao giờ rỗng;
//  (B) luật CHẶN giữ-chỗ không mất răng khi engine không nạp được, và bản lùi
//      khớp nguồn trên MỌI mẫu (bản chiếu, không phải nguồn thứ hai).
import { rmSync } from 'node:fs';
import path from 'node:path';
import * as F from './fixture.mjs';

const mau = F.placeholderPatterns();
const loi = [];
let assert = 0;

// Hồ sơ T2 đã qua Cổng 1, verdict PASS, chữ ký là GIỮ-CHỖ → luật chữ ký phải nổ.
const dungKho = (giaTri) => {
  const r = F.mkRepo();
  F.writeDossier(r, 's', {
    veto: F.VETO_CELLS[0], cong1: F.CO_TEN,
    chuKy: { ten: 'thu', dong: `human_signoff: ${giaTri}`, dung: true },
  });
  F.gitAll(r, 'ho so');
  return r;
};
const GHIM_GIU_CHO = 'is a placeholder, not a signature';
const coGiuCho = out => out.split('\n').some(l => l.startsWith('VIOLATION ') && l.includes(GHIM_GIU_CHO));

// ── (A) NOTE một-nguồn phải in mẫu THẬT ─────────────────────────────────────
const khoA = dungKho('TBD');
const outA = F.runPremerge(khoA).out;
const dongNote = outA.split('\n').find(l => l.includes('SHORT FIXED prefix list')) || '';
assert++;
if (!dongNote) loi.push('NOTE một-nguồn KHÔNG in ra (lưới không thấy lượt giữ-chỗ nào?)');
else if (!/pending\*/.test(dongNote))
  loi.push(`NOTE một-nguồn in danh sách RỖNG hoặc không đọc được từ nguồn: «${dongNote.slice(0, 120)}»`);
// Không được nhả vết lỗi của node ra CI.
if (/MODULE_NOT_FOUND|at Module\._resolveFilename/.test(outA))
  loi.push('lưới nhả vết lỗi node ra output — lệnh đọc nguồn chưa nuốt stderr');

// ── (B) engine vắng: luật CHẶN vẫn chặn ─────────────────────────────────────
// Đối chứng dương TRƯỚC: engine có → VIOLATION giữ-chỗ.
assert++;
if (!coGiuCho(outA)) loi.push(`đối chứng dương hỏng: engine CÓ mà không thấy VIOLATION «${GHIM_GIU_CHO}»`);

const khoB = dungKho('TBD');
rmSync(path.join(khoB, 'lib', 'evidence-core.cjs'));          // engine không nạp được
const rB = F.runPremerge(khoB);
assert++;
if (!coGiuCho(rB.out) || rB.code === 0)
  loi.push(`luật chặn MẤT RĂNG khi vắng engine: mã thoát ${rB.code}, VIOLATION giữ-chỗ ${coGiuCho(rB.out) ? 'có' : 'KHÔNG'}`);
// và nó phải NÓI RA rằng đang chạy bằng bản lùi.
if (!rB.out.includes('lưới giữ-chỗ của chữ ký KHÔNG chạy được'))
  loi.push('vắng engine mà lưới không nói ra — bản lùi chạy im lặng');

// Không over-block: chữ ký THẬT vẫn qua khi vắng engine.
const khoC = dungKho('Manh Phan 2026-09-11');
rmSync(path.join(khoC, 'lib', 'evidence-core.cjs'));
assert++;
if (coGiuCho(F.runPremerge(khoC).out))
  loi.push('bản lùi chặn OAN: chữ ký thật bị gọi là giữ-chỗ khi vắng engine');

// ── (C) bản lùi KHỚP nguồn trên MỌI mẫu ─────────────────────────────────────
for (const p of mau) {
  assert++;
  const k = dungKho(F.giaTriGiuCho(p));
  rmSync(path.join(k, 'lib', 'evidence-core.cjs'));
  if (!coGiuCho(F.runPremerge(k).out))
    loi.push(`bản lùi bỏ sót mẫu «${p.mau}»: giữ-chỗ ${F.giaTriGiuCho(p)} lọt khi vắng engine`);
}
if (assert !== 4 + mau.length) loi.push(`sàn đếm: ${assert} assert, mong ${4 + mau.length}`);
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── chiều đỏ 1: gỡ khối bản lùi → giữ-chỗ lọt khi vắng engine ───────────────
const kMut = dungKho('TBD');
F.tiem(kMut, 'scripts/pre-merge-check.sh',
  `    pending*|tbd*|todo*|n/a*|none|unsigned*|waiting*) return 0 ;;`,
  '    # đột biến: bản lùi mất mẫu chữ');
rmSync(path.join(kMut, 'lib', 'evidence-core.cjs'));
if (coGiuCho(F.runPremerge(kMut).out)) {
  console.error('chiều đỏ 1 KHÔNG chạy: gỡ mẫu khỏi bản lùi mà giữ-chỗ vẫn bị chặn khi vắng engine');
  process.exit(1);
}

// ── chiều đỏ 2: trả câu NOTE về dạng nháy hỏng → danh sách RỖNG ─────────────
const kNote = dungKho('TBD');
F.tiem(kNote, 'scripts/pre-merge-check.sh',
  '$(node "$CHU_KY_LIB" bang-mau 2>/dev/null)',
  '$(node \\"$CHU_KY_LIB\\" bang-mau)');
const outNote = F.runPremerge(kNote).out;
const dongMut = outNote.split('\n').find(l => l.includes('SHORT FIXED prefix list')) || '';
if (/pending\*/.test(dongMut)) {
  console.error('chiều đỏ 2 KHÔNG chạy: nháy hỏng mà NOTE vẫn in được danh sách');
  process.exit(1);
}

console.log(`bản lùi + NOTE một nguồn: ${assert} assert (${mau.length} mẫu chạy qua đường vắng engine); engine có → chặn, engine vắng → VẪN chặn và nói ra; chữ ký thật không bị chặn oan`);
console.log('       [chiều đỏ 1] gỡ mẫu chữ khỏi khối bản lùi → giữ-chỗ TBD lọt khi vắng engine');
console.log(`       [chiều đỏ 2] trả câu NOTE về dạng nháy hỏng → NOTE in danh sách RỖNG: «${dongMut.slice(60, 140)}»`);
