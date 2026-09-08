// Danh sách grandfather cho một khoá config ĐÃ CHẾT — MỘT bản, hai bên đọc.
//
// Vì sao tồn tại: hồ sơ `luu-kho-codex-va-nghi-le-design` gỡ khoá
// `executors.script.mirror_sync` khỏi `_acceptance/config.yaml` (đó là tiêu chí
// AC-9 của nó, owner duyệt 12/08). 21 hồ sơ ĐÃ KÝ có eval khai
// `verifier: config:executors.script.mirror_sync`, nên `recheck-evidence.cjs`
// đỏ trên chúng vĩnh viễn. Không hồ sơ nào trong 21 sửa được mà không **viết
// vào vật đã ký** — mục *Out of scope* của hồ sơ ấy khai thẳng "hồ sơ
// `_acceptance/` cũ là sử liệu bất biến".
//
// Đây là ALLOWLIST CÓ TÊN, không phải nới ngưỡng. Ba ràng buộc giữ nó khỏi
// trượt thành cái cửa mở:
//   1. Chỉ che hồ sơ CÓ TÊN trong danh sách dưới. Hồ sơ mới đỏ → vẫn ĐỎ.
//   2. Chỉ che đúng MỘT lý do: thông điệp lỗi phải nhắc `mirror_sync`. Cùng hồ
//      sơ đó hỏng vì lý do KHÁC → vẫn ĐỎ. Không có vế này thì một cái tên trong
//      danh sách che luôn mọi lỗi tương lai của hồ sơ ấy.
//   3. HAI CHIỀU: tên trong danh sách mà hồ sơ đã HẾT đỏ → cũng ĐỎ, đòi rút
//      tên. Chặn thói đổ sẵn danh sách dài cho khỏi phải nghĩ — cùng khuôn
//      `tests/plugins/asserts-da-go.txt` và bảng miễn trừ của bộ răng lưu-kho.
//
// Trigger XOÁ cả tệp này: khi 21 hồ sơ dưới đây không còn được `recheck` soi
// (chúng rời corpus), hoặc khi có quyết định migrate chúng. Xem ADR 0010.
// 08/09/2026: trigger ĐÃ tới — cả 21 rời corpus (18 theo ADR 0015, 3 còn lại
// theo bổ sung cùng ngày, mốc truoc-luu-kho-mirror-sync-2026-09-08). Tệp GIỮ
// LẠI vì phần sống của nó là assertCorpus: «hồ sơ đỏ mà không có tên = lỗi
// mới», nay với CẢ HAI danh sách RỖNG — corpus phải sạch tuyệt đối; nợ mới
// muốn tồn tại phải đặt tên ở đây, hai chiều, không nới reader.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

// 21 hồ sơ đã ký, đo tại chỗ 2026-08-13 — KHÔNG chép tay từ log. 08/09/2026:
// 18 trong 21 LƯU KHO (ADR 0015, tag truoc-luu-kho-no-lan-2026-09-08), 3 còn
// lại LƯU KHO cùng ngày (tag truoc-luu-kho-mirror-sync-2026-09-08) — RỖNG.
export const MIRROR_SYNC_GRANDFATHER = [
];

const DEAD_KEY = 'executors.script.mirror_sync';

// ── Nợ thứ hai, cùng khuôn (ADR 0014, sửa 08/09/2026 — owner bỏ mốc, xử ngược):
// làn ghim lại suite-only (dòng kind:repin không có evals_exit) chưa bao giờ
// chứng được pin. 49 hồ sơ đã ký, đo tại chỗ 2026-09-08 bằng chính recheck —
// KHÔNG chép tay; 25 tên rút cùng ngày sau chiến dịch ghim lại bằng làn eval
// (run_id repin-20260908T035246Z-95429 trong run-log từng hồ sơ). Còn 24:
// 6 hồ sơ eval đỏ thật trên cây hiện tại (cham-dung-cay-dung-cho-dung,
// cong-chan-nham-cho, het-gio-khong-phai-truot, khong-ve-the-ma,
// moi-noi-vong-trao, release-2-1-0) + 18 hồ sơ eval trỏ khoá mirror_sync đã
// gỡ (làn không chạy được) — owner quyết riêng. Rút tên khi hồ sơ được ghim
// lại; hai chiều như danh sách trên. Ghi chú: recheck dừng ở lớp re-pin
// trước khi tới lớp verifier, nên một hồ sơ nằm trong CẢ hai danh sách chỉ lộ
// lý do suite-only cho tới khi được ghim lại — lúc đó lý do mirror_sync lộ lại.
export const SUITE_ONLY_LANE_DEBT = [
];
const SUITE_ONLY_NEEDLE = 'recorded no evals_exit';

// Mỗi danh sách che ĐÚNG một lý do (needle). Một dòng lỗi được che khi hồ sơ
// nằm trong danh sách có needle khớp dòng đó.
const LISTS = [
  { names: MIRROR_SYNC_GRANDFATHER, needle: DEAD_KEY, label: 'mirror_sync' },
  { names: SUITE_ONLY_LANE_DEBT, needle: SUITE_ONLY_NEEDLE, label: 'suite-only lane' },
];

// Chạy recheck trên MỌI report thật, trả {slug, err} cho từng hồ sơ đỏ.
export function recheckCorpus(root) {
  const acc = path.join(root, '_acceptance');
  const reports = readdirSync(acc)
    .map(s => path.join(acc, s, 'evidence-report.md'))
    .filter(existsSync);
  const bad = [];
  for (const r of reports) {
    try {
      execFileSync('node', [path.join(root, 'scripts/recheck-evidence.cjs'), r],
        { stdio: ['ignore', 'ignore', 'pipe'] });
    } catch (e) {
      bad.push({ slug: path.basename(path.dirname(r)), err: String(e.stderr || '') });
    }
  }
  return { reports, bad };
}

// Phân loại một tập đỏ thành {ngoaiDanhSach, saiLyDo, khaiThua}. Rỗng cả ba = ĐẠT.
//   ngoaiDanhSach: hồ sơ đỏ không nằm trong danh sách nào;
//   saiLyDo: dòng lỗi (`x `) không được che bởi danh sách nào chứa hồ sơ đó;
//   khaiThua: tên trong danh sách mà hồ sơ đã HẾT đỏ (hai chiều).
export function classify(bad) {
  const inAny = new Set(LISTS.flatMap(l => l.names));
  const ngoaiDanhSach = bad.filter(b => !inAny.has(b.slug)).map(b => b.slug);
  const saiLyDo = [];
  for (const b of bad) {
    if (!inAny.has(b.slug)) continue;
    const mine = LISTS.filter(l => l.names.includes(b.slug));
    const lines = b.err.split('\n').filter(l => / x /.test(l));
    for (const line of (lines.length ? lines : [b.err])) {
      if (!mine.some(l => line.includes(l.needle))) saiLyDo.push(`${b.slug} (${line.replace(/\s+/g, ' ').trim().slice(0, 80)})`);
    }
  }
  const doRoi = new Set(bad.map(b => b.slug));
  const khaiThua = LISTS.flatMap(l => l.names.filter(s => !doRoi.has(s)).map(s => `${s} [${l.label}]`));
  return { ngoaiDanhSach, saiLyDo, khaiThua };
}

export function assertCorpus(assert, root, label) {
  const { reports, bad } = recheckCorpus(root);
  assert.ok(reports.length >= 10, `sanity: chỉ ${reports.length} report — glob hỏng?`);
  const { ngoaiDanhSach, saiLyDo, khaiThua } = classify(bad);
  assert.deepEqual(ngoaiDanhSach, [],
    `${label}: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: ${ngoaiDanhSach.join(', ')}`);
  assert.deepEqual(saiLyDo, [],
    `${label}: hồ sơ trong danh sách nhưng có dòng đỏ vì lý do KHÁC lý do đã khai (mirror_sync / suite-only lane) — mỗi danh sách chỉ che đúng một lý do: ${saiLyDo.join('; ')}`);
  assert.deepEqual(khaiThua, [],
    `${label}: tên khai trong danh sách mà hồ sơ ĐÃ HẾT đỏ — rút tên ra, đừng để danh sách phình: ${khaiThua.join(', ')}`);
}
