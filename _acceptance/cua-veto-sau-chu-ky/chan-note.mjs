// Chân note-da-ky / that-con-mo (AC-1, AC-2) — cặp hai chiều trên CÙNG một fixture:
// chỉ đổi dòng human_signoff, mọi thứ khác giữ nguyên.
import * as F from './fixture.mjs';

const KY = process.argv.includes('--ky');
const repo = F.mkRepo();
F.writeDossier(repo, 's', {
  veto: F.MO, cong1: F.RONG, chuKy: F.o(KY ? 'that-tran' : 'rong-khuon'),
});
F.gitAll(repo, 'ho so lan V');
const { out } = F.runPremerge(repo);

const coDong = out.includes(F.CAU_GHIM);
const coMo = out.split('\n').some(l => l.startsWith('NOTE [s]') && l.includes(F.CAU_MO));
const oTong = F.tenDongTong(out).includes('s');
const soDong = out.split('\n').filter(l => l.startsWith('NOTE [s]') && l.includes(F.CAU_GHIM)).length;

const loi = [];
if (KY) {
  if (!coDong) loi.push('chữ ký không đóng cửa: lưới không in câu «cửa veto đã đóng bằng chữ ký»');
  if (soDong > 1) loi.push(`chữ ký không đóng cửa: in ${soDong} dòng đã-đóng, phải đúng MỘT`);
  if (coMo) loi.push('chữ ký không đóng cửa: vẫn in NOTE «cửa veto mở»');
  if (oTong) loi.push('chữ ký không đóng cửa: vẫn có tên ở dòng tổng');
} else {
  if (!coMo) loi.push('cửa thật bị giấu: mất NOTE «cửa veto mở»');
  if (!oTong) loi.push('cửa thật bị giấu: mất tên ở dòng tổng');
  if (coDong) loi.push('cửa thật bị giấu: nói đã đóng khi chưa có chữ ký');
}
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── chiều đỏ trong CÙNG lượt, tiêm vào bản sao lưới của kho fixture ─────────
let vet;
if (KY) {
  // gỡ nhánh mới → câu «cửa veto mở» phải quay lại cho hồ sơ ĐÃ ký
  F.tiem(repo, 'scripts/pre-merge-check.sh', 'elif signoff_that "$dir"; then', 'elif false; then');
  const m = F.runPremerge(repo).out;
  if (!m.split('\n').some(l => l.startsWith('NOTE [s]') && l.includes(F.CAU_MO))) {
    console.error('chiều đỏ KHÔNG chạy: gỡ nhánh mới mà lưới vẫn không nói «cửa veto mở»');
    process.exit(1);
  }
  vet = 'gỡ nhánh mới khỏi bản sao → NOTE «cửa veto mở» quay lại cho hồ sơ đã ký';
} else {
  // cho vị từ nhận MỌI hồ sơ là đã ký → hồ sơ CHƯA ký bị tuyên đã đóng.
  // (Tiêm vào chính vị từ, không vào dòng `elif`: `elif true` làm bản sao chết
  // vì `set -u` trên $SIGNOFF_THAT — một đột biến chết vì HẠ TẦNG không chứng
  // được điều gì về vật.)
  F.tiem(repo, 'scripts/pre-merge-check.sh',
    '  [ -n "$s" ] || return 1',
    '  [ -n "$s" ] || { SIGNOFF_THAT="dot-bien"; return 0; }');
  const m = F.runPremerge(repo).out;
  if (!m.includes(F.CAU_GHIM)) {
    console.error('chiều đỏ KHÔNG chạy: nhánh nuốt mọi hồ sơ mà lưới vẫn không nói đã đóng');
    process.exit(1);
  }
  vet = 'cho nhánh mới nuốt mọi hồ sơ → hồ sơ CHƯA ký bị tuyên «cửa veto đã đóng bằng chữ ký»';
}
console.log(KY ? 'đã ký → đóng, 1 dòng NOTE, vắng ở dòng tổng'
               : 'chưa ký → mở, có NOTE và có tên ở dòng tổng');
console.log(`       [chiều đỏ] ${vet}`);
