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
console.log(KY ? 'đã ký → đóng, 1 dòng NOTE, vắng ở dòng tổng'
               : 'chưa ký → mở, có NOTE và có tên ở dòng tổng');
