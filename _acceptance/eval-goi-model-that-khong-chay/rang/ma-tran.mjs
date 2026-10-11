// ma-tran.mjs — danh sách viết trước của bộ răng hồ sơ eval-goi-model-that-khong-chay: mỗi AC gồm các ca bền
// phải PASS trên cây đang kiểm (chiều xanh) và các phép phá phải làm đúng ca FAIL với thông điệp ghim (chiều
// đỏ, trên bản sao SAU-G3). `doi` = các cặp [tìm, thay] — mỗi «tìm» phải khớp ĐÚNG MỘT lần.
const LANE = 'feature-loop/scripts/repin-lane.mjs';
const LIB = 'feature-loop/scripts/lib/dung-lai-model.mjs';
const DEM = 'feature-loop/scripts/dem-dung-lai-model.mjs';
const SKILL = 'feature-loop/skills/feature-loop/SKILL.md';
const T = 'tests/scripts/repin-lane-dung-lai-model.test.mjs';
const TK = 'tests/scripts/repin-lane-khuon-gia.test.mjs';
const lop = (n, ca, ten) => ({ ten: `bo-lop-${n}`, tep: LIB, doi: [[`  h.update(\`lop${n}\\n`, `  void (\`lop${n}\\n`]], tepCa: T, ca, ghim: `lớp ${ten} không vào băm` });

export const MA_TRAN = {
  1: {
    nhom: [{ tep: T, ca: ['AC1-im'] }],
    pha: [
      { ten: 'luon-chay-lai', tep: LANE, doi: [['if (!lyDo && muc.nguon) {', 'if (false) {']], tepCa: T, ca: 'AC1-im', ghim: 'gọi model khi đầu vào không đổi' },
      { ten: 'dung-lai-im', tep: LANE, doi: [['Object.keys(carry).length ? { evals_carry: carry } : {}', '{}']], tepCa: T, ca: 'AC1-im', ghim: 'dùng lại im' },
    ],
  },
  2: {
    nhom: [{ tep: T, ca: ['LIB-khoi-marker', 'LIB-bam-tung-lop', 'LIB-goi-ten', 'AC2-lop-lenh', 'AC2-lop-paths', 'AC2-lop-ho-so', 'AC2-lop-goi-ten', 'AC2-lop-van-tay', 'AC2-ma-tran', 'AC2-dh-config', 'AC2-dh-thu-muc', 'AC2-dh-cd'] }],
    pha: [
      lop(1, 'AC2-lop-lenh', 'lệnh đã giải'), lop(2, 'AC2-lop-paths', 'tệp khớp paths'), lop(3, 'AC2-lop-ho-so', 'cây hồ sơ'),
      lop(4, 'AC2-lop-goi-ten', 'tệp lệnh gọi tên'), lop(5, 'AC2-lop-van-tay', 'dấu vân tay môi trường'),
      { ten: 'bo-giai-cd', tep: LIB, doi: [['for (const c of [x, ...cd.map(d => path.posix.normalize(`${d}/${x}`))])', 'for (const c of [x])']], tepCa: T, ca: 'AC2-lop-goi-ten', ghim: 'lớp tệp lệnh gọi tên không vào băm' },
      { ten: 'keo-ca-thu-muc', tep: LIB, doi: [['if (tep.has(c)) ra.add(c);', 'for (const f of tep) if (f === c || f.startsWith(`${c}/`)) ra.add(f);']], tepCa: T, ca: 'AC2-dh-thu-muc', ghim: 'băm kéo cả thư mục' },
    ],
  },
  3: {
    nhom: [{ tep: T, ca: ['LIB-chon-nguon', 'AC3-sat-han', 'AC3-qua-han', 'AC3-tuong-lai'] }],
    pha: [{ ten: 'bo-so-tuoi', tep: LIB, doi: [['if (nowMs - ts(hopLe[0]) > HAN_NGAY * 86400000) return { lyDo: LY_DO_NGUON.quaHan };', '']], tepCa: T, ca: 'AC3-qua-han', ghim: 'dùng lại nguồn quá hạn' }],
  },
  4: {
    nhom: [{ tep: T, ca: ['LIB-van-tay-het-gio', 'LIB-van-tay-thoat', 'LIB-van-tay-rong', 'LIB-bien-shell', 'AC4-ma-tran', 'AC4-van-tay-thoat', 'AC4-van-tay-rong', 'AC4-ep', 'AC4-allow-dirty', 'AC4-khong-paths', 'AC4-paths-khong-chung', 'AC4-bien-shell', 'AC4-chua-commit-sua', 'AC4-chua-commit-moi', 'AC4-lenh-da-chay', 'AC4-hai-eval-model', 'AC4-eval-thuong'] }],
    pha: [
      { ten: 'bo-kiem-ban', tep: LANE, doi: [['if (banDau) return `${LY_DO_CHAY.chuaCommit}: ${banDau}`;', 'void banDau;']], tepCa: T, ca: 'AC4-chua-commit-sua', ghim: 'dùng lại trên cây bẩn' },
      { ten: 'bo-kiem-van-tay', tep: LIB, doi: [['if (r.exit !== 0) return { ok: false, lyDo: `${LY_DO_CHAY.vanTayThoat} (mã ${r.exit})` };', '']], tepCa: T, ca: 'AC4-van-tay-thoat', ghim: 'dùng lại khi không biết model' },
      { ten: 'bo-tran-gio', tep: LIB, doi: [['const hen = setTimeout(() => { hetGio = true; h.dung(); }, timeoutMs);', 'const hen = null;']], tepCa: T, ca: 'LIB-van-tay-het-gio', ghim: 'lệnh dấu vân tay không có trần' },
    ],
  },
  5: {
    nhom: [{ tep: T, ca: ['AC5-dan-phang', 'AC5-moi-nhat', 'AC5-dong-cu'] }],
    pha: [{ ten: 'chuoi-khong-dan-phang', tep: LIB, doi: [['&& !(o.evals_carry && Object.prototype.hasOwnProperty.call(o.evals_carry, id))\n', '\n']], tepCa: T, ca: 'AC5-dan-phang', ghim: 'chuỗi dùng lại không dàn phẳng' }],
  },
  6: {
    nhom: [{ tep: T, ca: ['AC6-lech'] }],
    pha: [{ ten: 'bo-chan-sau-lech', tep: LIB, doi: [['&& o.carry_lech.includes(id) && coBam(o, id) && o.evals_hash[id] === bam)) return { lyDo: LY_DO_NGUON.lech };', '&& o.carry_lech.includes(id) && coBam(o, id) && o.evals_hash[id] === bam)) void 0;']], tepCa: T, ca: 'AC6-lech', ghim: 'dùng lại sau carry_lech' }],
  },
  7: {
    nhom: [{ tep: T, ca: ['AC7-song'] }],
    rieng: 'vi-phan.mjs',
    pha: [{ ten: 'ghi-bam-khi-khoa-vang', tep: LANE, doi: [['    dungLaiCua(s),\n  );', '    Object.keys(dungLaiCua(s)).length ? dungLaiCua(s) : { evals_hash: {} },\n  );']], tepCa: T, ca: 'AC7-song', ghim: 'khoá vắng mà dòng đổi' }],
  },
  8: { nhom: [{ tep: T, ca: ['AC8-song'] }], rieng: 'doc-cu.mjs', pha: [] },
  9: {
    nhom: [{ tep: T, ca: ['AC9-khuon-dung-lai'] }, { tep: TK, ca: ['AC6-khuon-writer', 'AC6-guide-du-khoa', 'AC6-lan-khoa-rut'] }],
    pha: [{ ten: 'khuon-thieu-evals-carry', tep: SKILL, doi: [['"evals_carry":{"<E>":"<run_id>"},', '']], tepCa: T, ca: 'AC9-khuon-dung-lai', ghim: 'khoá ngoài khuôn' }],
  },
  10: {
    nhom: [{ tep: T, ca: ['AC10-dem'] }],
    pha: [
      { ten: 'chi-dem-repin', tep: DEM, doi: [["if ((o.kind !== 'repin' && o.kind !== 'repin-do') || !trongKy(o)) return;", "if (o.kind !== 'repin' || !trongKy(o)) return;"]], tepCa: T, ca: 'AC10-dem', ghim: 'carry_lech đếm thiếu' },
      { ten: 'nhan-luon-khong-tat-dinh', tep: DEM, doi: [["nhan = doi === null ? 'không so được (git)' : (doi.length ? `nghi thiếu đầu vào: ${doi.join(', ')}` : 'lệch không tất định');", "nhan = 'lệch không tất định';"]], tepCa: T, ca: 'AC10-dem', ghim: 'không tách nguyên nhân lệch' },
    ],
  },
  12: { nhom: [], rieng: 'pham-vi.mjs', pha: [] },
};
