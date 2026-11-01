# Thiết kế: mã lượt chạy theo danh sách cho phép hình dạng

Hồ sơ `run-id-danh-sach-cho-phep` · issue #467 · vòng vá cho bản 2.36.2 · Cổng Đáng: chủ kho «Mở cả bốn» (31/10).

## Vấn đề

Tác tử chạy lệnh máy của bộ chấm (`feature-loop/workflows/acceptance-verify.js`) khai `runId` theo khuôn «run_id
từ stdout nếu có, không có thì chuỗi rỗng». Ở crm `rang-hang-cong-cu` E9 (lệnh `bun run test` không in run_id),
tác tử trả một dấu huyền «`». Bộ chuẩn hoá `docRid` chỉ bóc khoảng trắng, đuôi ` # …` và nháy `"`/`'` — mọi thứ
còn khác rỗng đều được tin:

| Chỗ | Tệp | Với «`» trước vòng |
|---|---|---|
| ghi dòng eval | `acceptance-verify.js` (`docRid(m.runId) \|\| minted-…`) | ghi «`» |
| ghi dòng suite | `acceptance-verify.js` (`ridTho`) | ghi «`» |
| nhận eval mang sang | `acceptance-verify.js` (bộ lọc `carriedEvals`) | nhận «`» |
| tính eval mang sang | `feature-loop/scripts/carry-plan.mjs` | mang `prev.run_id` nguyên văn |

Bản vá trước (#284, hồ sơ `doc-ghi-troi-mang-sang-run-id`) thêm bước bóc nháy — một danh sách ký tự CẤM. Ký tự
rác kế tiếp (lần này dấu huyền) lọt đúng lối cũ. Đo 31/10 trên 8 925 dòng eval trong mọi `run-log.jsonl` của kit:
14 dòng không phải mã lượt (`""`, `""__<băm>`, `L08`, một tên test, một mảnh lệnh) — tất cả là rác tác tử khai.

## Lối chọn

**Một luật hình dạng — danh sách CHO PHÉP, một nguồn.** Bộ chấm khai khối marker `RUN-ID-HINH`:

```
const RUN_ID_HINH = /^(?=.*\d)[A-Za-z0-9][\w.:-]{3,199}$/
```

- `docRid` giữ bước bóc cũ (đuôi ` # …`, nháy bao quanh) rồi mới xét hình dạng; không đạt → trả rỗng → máy đúc
  `minted-<slug>-<eval>-r<N>` (hay `minted-<slug>-SUITE-<tên>-r<N>`) như khi tác tử để trống. Ba chỗ dùng `docRid`
  (dòng eval, `ridTho` của suite, bộ lọc mang sang) tự nhận luật mới, không sửa từng chỗ.
- Hình dạng: bắt đầu bằng chữ hoặc số; chỉ chữ, số, `_`, `.`, `:`, `-`; dài 4–200; có ít nhất một chữ số. Đủ cho
  mọi dạng mã thật đã thấy (mã đúc, UUID, dấu thời gian ISO, `vitest_run.42`); chặn cả lớp rác: dấu câu, khoảng
  trắng, chữ trơn không có số (`none`, `null`, `undefined`), mã quá ngắn (thẻ Cổng Bằng chứng đã đòi ≥ 4 ký tự).
- `carry-plan.mjs` RÚT khối ấy từ `../workflows/acceptance-verify.js` theo vị trí chính tệp (cùng gói
  `feature-loop`); rút không được → thoát 2 có tên, không đoán. Dòng lượt trước có `run_id` không đạt → eval vào
  `rerun` với lý do `run_id lượt trước sai hình dạng ("<mã>") — chạy lại`; `s4-args.mjs` in lý do ấy thành một dòng
  `s4-args: <E> không mang sang — …` như các lý do định nghĩa đổi.

Đường đọc cũ (luật «đổi schema phải có đường đọc-cũ»): sổ cũ của kho tiêu thụ đang chứa «`» — không bắt kho sửa
sổ; carry-plan cho eval chạy lại kèm một dòng lý do.

## Vì sao không sửa bên đọc báo cáo

`extractRunIds` (`lib/evidence-core.cjs`) và ngưỡng `>= 4` của thẻ (`scripts/gate-card.js`) đọc báo cáo ĐÃ VIẾT.
Sau vòng này bên viết không còn ghi mã sai hình dạng, nên bên đọc không gặp mã mới nào như thế. Báo cáo cũ mang «`»
đã khớp sổ cũ (L2 im đúng — hai bên cùng chữ) và thẻ đã coi là thiếu bằng chứng. Đổi bên đọc là chạm `lib/**` (hạng
T3) và đổi màu báo cáo đã ký ở mọi kho mà vật không đổi — luật 26/09 xếp sau sửa đúng tầng ở bên viết.

## Phép đo

`tests/scripts/run-id-danh-sach-cho-phep.test.mjs`, ca RH1…RH6 (tên nhóm = AC). Fixture do code sinh: dòng sổ do
bộ chấm thật dựng (harness vm), kế hoạch mang sang do carry-plan / s4-args thật tính trên kho git sinh trong lượt;
bản gốc `115100b6` dựng trọn bằng `git archive` để chiều đỏ chứng được fixture tái hiện lỗi. Ma trận viết trước:
12 mã sai hình dạng (hàng đầu là vật crm) và 8 mã hợp lệ (đối chứng dương).
