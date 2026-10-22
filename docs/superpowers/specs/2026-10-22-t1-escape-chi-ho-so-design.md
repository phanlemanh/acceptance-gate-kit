# Răng T1-escape chỉ nhận hồ sơ thật — thiết kế

Hồ sơ: `_acceptance/t1-escape-chi-ho-so/` · hạng T3 (chạm `scripts/pre-merge-check.sh`) · 22/10/2026.

## Vì sao

Răng T1-escape của `scripts/pre-merge-check.sh` chặn PR đổi tệp chịu cổng (khớp `t3_paths`, hoặc nằm ngoài
`t1_skip_globs`) mà không kèm hồ sơ `_acceptance/<slug>/`. Câu «có kèm hồ sơ» được tính ở khối «Phân loại
diff-chịu-cổng» (dòng 813 trên `main` 2.33.1):

```sh
case "$f" in _acceptance/*|*/_acceptance/*) DIFF_GATE_TOUCHED=1; continue ;; esac
```

Mọi tệp dưới `_acceptance/` đều bật cờ, kể cả tệp ở gốc thư mục, nên PR chỉ cần sửa một dòng `_acceptance/config.yaml`
là răng im.

**Ca thật (onehub-invest, 22/10, bản chép CI 2.32.0):** nhánh sửa `app/src/**` kèm một dòng `_acceptance/config.yaml`
→ `pre-merge-check.sh . --base main` in «clean». Cùng nhánh, trước commit sửa config → «1 violation — merge blocked».

**Tái hiện trên kit 2.33.1** (kho mẫu ngoài cây, cấu hình `t3_paths: src/billing/**`, `t1_skip_globs: docs/**`):

| PR đổi | Kết quả hôm nay |
|---|---|
| tệp T3 | VIOLATION [PR] — đúng |
| tệp T3 + `_acceptance/config.yaml` | clean — lọt |
| tệp ngoài T1 + `_acceptance/README.md` | clean — lọt |
| tệp T3 + `_acceptance/rong/notes.md` (thư mục không có `contract.md`) | clean — lọt |
| tệp T3 + `_acceptance/co-hoi/opportunity.md` (hồ sơ mới ở Cổng Đáng) | clean — lọt |

Bốn dòng lọt cùng một lớp: thứ nằm dưới `_acceptance/` mà **không phải một hồ sơ cổng chấm được** vẫn được tính là «PR
có kèm hồ sơ». Vòng per-slug sau đó không có gì để chấm: tệp gốc không thuộc slug nào, còn thư mục không có `contract.md`
bị vòng ấy bỏ qua (`continue` ngay sau kiểm `contract.md`).

## Nghiệm

Định nghĩa «tệp hồ sơ» cho răng T1-escape: tệp nằm dưới `_acceptance/<slug>/` của CHÍNH cổng — `<ROOT>/_acceptance/`,
đường tính từ gốc git bằng `git rev-parse --show-prefix` (ở monorepo là `pkg/_acceptance/<slug>/`), đúng thư mục vòng
per-slug duyệt — **và** `<slug>/contract.md` có ở HEAD. Hồ sơ fixture kiểu `tests/.../_acceptance/<slug>/` không bao
giờ được vòng per-slug chấm nên cũng không tính (2 commit ở kit từng qua răng nhờ nó). Mọi tệp khác dưới `_acceptance/` — tệp ở gốc
(`config.yaml`, `README.md`, …), thư mục không có hợp đồng, hồ sơ đã bị xoá — không bật cờ.

Vì sao đòi `contract.md` (Hỏi-2): luật «hồ sơ chưa arm cổng» trong chính tệp này đã khai ý định — vế (b): *«hồ sơ trong diff PR
mà PR đổi ít nhất một file chịu cổng — hồ sơ này đang thoả T1-escape cho code đó, mà chưa arm thì không luật nào
chấm.»* Thư mục không có hợp đồng thoả T1-escape mà không bao giờ tới được luật ấy. Đòi hợp đồng là đóng đúng khe của ý
định đã khai, không thêm luật mới. Cũng khớp định nghĩa «hồ sơ» mà `lib/chan-lo-trinh.cjs` đã dùng (thư mục có
`contract.md`/`opportunity.md`) ở phần có hợp đồng; `opportunity.md` một mình là ô ở Cổng Đáng, chưa có phạm vi nào để
cổng chấm, nên không đủ để bảo lãnh cho code.

Tệp gốc `_acceptance/` vẫn **không chịu cổng** như hôm nay: không thành T3, không thành ngoài-T1. PR chỉ đổi
`_acceptance/config.yaml` vẫn qua. Đổi điều đó là đổi mặc định cho mọi kho — Hỏi-3 dưới.

**Thông điệp.** Hai câu VIOLATION [PR] giữ nguyên văn (ca ARM08/ARM08b và tệp `t1escape-messages.txt` của hồ sơ
`t1-escape-event-scope` ghim chúng). Khi răng nổ mà diff có tệp dưới `_acceptance/` không được tính, in THÊM một dòng
`NOTE [PR]:` liệt kê các tệp đó, để người ở kho tiêu thụ hiểu vì sao sửa config không còn thoả răng. Dòng mới, chỉ thêm.

**`--hang-pr`.** Chế độ này đọc lại các biến của khối phân loại. Cờ `DIFF_GATE_TOUCHED` ở đó chỉ chọn nhãn `ho-so` hay
`T1` khi diff không chạm vật — cả hai `cham_vat=false`, nên không có lỗ an toàn. Nhãn `hang` là đầu ra công khai mà
workflow của kho đọc (`GITHUB_OUTPUT`), và ca `AC-3-im` của hồ sơ `ci-cua-kho-bo-job-nang` ghim «PR đổi khoá config
khác → ho-so». Giữ nguyên câu trả lời của `--hang-pr`: khối phân loại tính HAI cờ trong CÙNG một vòng — `DIFF_ACC_TOUCHED`
(có tệp bất kỳ dưới `_acceptance/`, câu hỏi của `--hang-pr`: «PR chỉ đổi giấy tờ cổng?») và `DIFF_GATE_TOUCHED` (có
tệp hồ sơ thật, câu hỏi của T1-escape: «PR có hồ sơ bảo lãnh cho code?»). Hai câu hỏi khác nhau, một bộ khớp, chú thích
nói rõ bên nào đọc cờ nào.

**Những chỗ khác cùng mẫu khớp `_acceptance/*` — rà, không đổi:**

- `stale_files()` (dòng 680): loại tệp `_acceptance/` khỏi phép «bằng chứng cũ». Câu hỏi khác (code đổi sau
  `verified_commit`), không phải lỗ T1-escape. Không đổi.
- `slug_in_diff()` (dòng 765): đã neo theo slug. Không đổi.
- `feature-loop/scripts/lib/phan-loai.mjs`, `s4-args.mjs`: phân vật/thước/hồ sơ cho lượt chấm S4; `config.yaml` là
  «thước» ở đó — không đọc bởi pre-merge. Không đổi.
- `lib/*.cjs`, `scripts/recheck-evidence.cjs`: không có bộ phân loại T1-escape nào khác (grep `t1_skip_globs`,
  `T1-escape` trên cây). `.github/workflows/gate.yml` chỉ gọi script.

## Đo

Tệp ca mới `tests/scripts/t1-escape-ho-so.test.mjs` (mảnh mjs của suite scripts), kho mẫu dựng trong lần chạy, gọi
CHÍNH `scripts/pre-merge-check.sh` (đường suy từ vị trí tệp ca):

- Ma trận viết trước 13 hàng phía `_acceptance/` × 3 cột phía vật = 39 ô (bảng ở hợp đồng). Hàng 10–11 — hồ sơ có sẵn,
  PR sửa tệp khác `contract.md` — là đường dương phổ biến nhất ở kho thật (gap-probe P1).
- Dòng NOTE mới đo trên đủ 39 ô, mỗi ô một tập mong đợi khai trước.
- `--hang-pr`: bốn ô ghim nhãn không đổi.
- Bốn đột biến trên bản sao `scripts/` + `lib/` (chép trọn thư mục): hoàn nguyên dòng khớp cũ → 14 ô đỏ; gỡ vế
  `contract.md` → 6 ô; chỉ đếm `contract.md` có trong diff → 4 ô; tiền tố lấy từ đường tệp → 2 ô. Đối chứng dương:
  bản sao nguyên vẹn 39/39.
- Lịch sử: commit đầu tiên mang tệp ca đứng trước commit vá, và ở sha đó tệp ca đỏ đúng 14 ô lọt.

## Ngoài phạm vi → hạt giống

`docs/plans/2026-10-22-hat-giong-t1-escape-hang-tu-khai.md` ghi hai lỗ cùng họ, khác cơ chế, đo được ở cùng lượt:

1. Hồ sơ tự khai `risk_tier: T1` (ngoài `signoff.required_for`) thoả T1-escape cho code T3, và vòng per-slug im (đúng
   thiết kế ARM12). Ca GPM13 của suite đang dùng chính dáng này làm fixture. Đóng nó đụng `required_for` của từng kho.
2. Ở chế độ thường, `t1_skip_globs`/`t3_paths` đọc từ HEAD: PR thêm glob vào `t1_skip_globs` thì tệp của chính nó thành
   T1. `--hang-pr` đã so với merge-base; răng T1-escape thì chưa.

## Số đo ảnh hưởng

`_acceptance/t1-escape-chi-ho-so/do-anh-huong.md`: từ 01/06/2026, ở 9 kho tiêu thụ có trên máy (một kho chưa đo được),
30 commit vào nhánh chính chạm vật mà chỉ qua răng nhờ tệp không phải hồ sơ — 22 nhờ tệp gốc, 3 nhờ thư mục không hợp
đồng, 4 nhờ hồ sơ chỉ có `opportunity.md`, 2 nhờ hồ sơ fixture ngoài `_acceptance/` của cổng, 0 nhờ xoá hồ sơ (một
commit tính hai lý do). Trong đó có PR tính năng thật
(đúng lớp lỗ của ca onehub-invest) và PR bảo trì lớp kit: khởi tạo kit, chép lại lớp CI, bỏ cổng vendored — PR loại sau
đổi `scripts/`, `lib/` cùng `config.yaml`. Hệ quả: sau bản vá, PR chép lại lớp CI ở kho tiêu thụ phải kèm hồ sơ, kể
cả PR mang chính bản vá vào kho (CI chạy bản chép ở HEAD của PR).

## Ba câu cho người ở Cổng Phạm vi

**Hỏi-1 — tệp gốc `_acceptance/` thôi được tính là hồ sơ?** Khuyến nghị: làm (lỗ chủ kit gọi tên; PR bảo trì lớp kit
chạm code chịu cổng thật). Lối khác: không làm — lỗ ca onehub-invest vẫn mở. Giá của «làm»: 22 commit/4,5 tháng ở 7 kho
lẽ ra cần hồ sơ.

**Hỏi-2 — chỉ hồ sơ cổng chấm được mới tính (thư mục `_acceptance/<slug>/` của chính cổng, có `contract.md`)?**
Khuyến nghị: có. Lối khác: chỉ đòi tệp nằm trong một thư mục slug bất kỳ — rẻ hơn 9 commit (3 không hợp đồng, 4 chỉ
`opportunity.md`, 2 fixture) nhưng một tệp rác trong thư mục mới vẫn mở lại đúng lỗ này.

**Hỏi-3 — tệp gốc `_acceptance/` tự thân có chịu cổng không?** (câu giao việc nêu: «đổi config cổng là thay đổi nhạy
cảm»)

- **Khuyến nghị — giữ không chịu cổng (như hôm nay).** Bản vá chỉ thôi coi chúng là hồ sơ. PR chỉ đổi config vẫn qua;
  kho không phải đổi gì.
- **Lối khác — coi là ngoài-T1 mặc định.** PR đổi `config.yaml` (đổi lệnh đo, khoá executor) phải kèm hồ sơ, trừ khi
  kho tự khai nó vào `t1_skip_globs`. Giá: mọi kho tiêu thụ — PR bảo trì config (như commit `b7c89f1` «thêm lint vào lệnh
  kiểm app» của onehub-invest) phải kèm hồ sơ hoặc khai T1; `_acceptance/README.md` cũng thành ngoài-T1 ở kho không
  khai `*.md`. Và nó không đóng lỗ tự nới danh sách (hạt giống mục 2), vì PR vẫn khai được chính `config.yaml` vào T1.
