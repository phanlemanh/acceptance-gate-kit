# Tên ca chập chờn đọc qua tiền tố của bộ chạy monorepo — thiết kế

**Ngày:** 2026-10-11 · **Hồ sơ:** `_acceptance/ten-ca-qua-tien-to-turbo/` · **Hạng:** T2

Gốc: crm/_acceptance/tro-ly-okr-bo-final-output — dòng `repin` 07/10 05:07 có `chap_chon`
của suite 1/7 mang `"ca": ["không rút được tên ca"]`. Đây là lần chạy lại thật DUY NHẤT ở crm
từ khi kho bật `feature_loop.repin_retry: 1` (06/10).

## Vấn đề

AC-1 của hồ sơ đã ký `gia-lan-ghim-lai` hứa: lần hai đạt thì dòng pin mang `chap_chon[].ca` —
tên ca rút từ nhật ký lần đỏ theo năm khuôn (bun `(fail) …`, vitest/jest `✗`/`×`, playwright
`✘`, node:test `not ok N - …`). Năm khuôn đều neo đầu dòng (`^\s*`).

crm chạy suite qua turbo. Khi không có TTY — đúng hoàn cảnh của làn ghim lại, nơi lệnh chạy
qua ống — turbo đặt tiền tố `<gói>:<tác vụ>: ` trước mọi dòng con. Tái hiện 11/10 bằng turbo
2.10.8 (bản crm dùng) và `bun test` 1.3.12 trên một kho monorepo tạm:

```
@kho/goi:test: (fail) app-rieng > chay canh apps/agent [1.54ms]
@kho/goi:test: (pass) app-rieng > van xanh
```

Neo đầu dòng gặp `@` chứ không gặp `(fail)`, nên `rutTenCa` trả câu dự phòng. Trợ giúp của
turbo xác nhận đây là mặc định: `--log-prefix <auto|none|task>`, «auto … In most cases this
will be the same as "task"».

Hệ quả: ở mọi kho chạy suite qua turbo, lời hứa «gọi tên ca chập chờn» rỗng. Nhật ký trọn của
lần đỏ nằm trong `.acceptance-runs/` của worktree và mất khi dọn worktree — ca 07/10 đúng như
vậy (tệp không còn trên đĩa ngày 11/10) — nên tên ca là dấu vết duy nhất còn lại cho kho đi sửa
ca chập chờn ở tầng test. Chạy lại mà không gọi được tên là đúng cái bẫy ngành đã cảnh báo:
tài liệu Trunk Flaky Tests khuyên tắt chạy lại vì nó làm mờ việc phát hiện ca chập chờn
[NGÀNH: docs.trunk.io/flaky-tests]. Kit giữ chạy lại một lần (quyết của `gia-lan-ghim-lai`), nên
cái tên trong `chap_chon` là thứ giữ ca chập chờn hiện ra sau khi lượt đã được cứu.

## Phương án chọn

Trong `feature-loop/scripts/lib/chay-lai.mjs`:

1. Thử năm khuôn trên dòng THÔ như hôm nay.
2. Không khuôn nào khớp → bóc MỘT lớp tiền tố `TIEN_TO_BO_CHAY = /^\S*?:\s+/` (một cụm không
   khoảng trắng, kết bằng `:` rồi khoảng trắng) và thử lại năm khuôn trên phần còn lại.

Vì sao thứ tự này: dòng đã khớp ở bước 1 KHÔNG đi qua bước 2, nên mọi đầu vào hôm nay rút ra tên
gì thì sau vòng vẫn rút ra đúng tên đó. Hành vi chỉ đổi ở những dòng hôm nay rơi về câu dự phòng.

Vì sao một cụm không khoảng trắng mà không viết riêng cho turbo: luật 26/09 (sửa kit vì sự cố
của một kho phải cân trên mọi kho) xếp «bộ đọc khoan dung» trước «đổi mặc định». Tiền tố turbo
`@kho/goi:test: ` và `@kho/goi:test:unit: ` (tác vụ có dấu hai chấm) đều là một cụm như thế —
`\S*?` dừng ở dấu `:` đầu tiên đứng trước khoảng trắng.

## Phương án loại

- **Khuôn riêng turbo** (`<gói>:<tác vụ>: ` có ít nhất một `:` bên trong) — hẹp hơn mà không
  rẻ hơn; loại vì luật bộ đọc khoan dung.
- **Đọc báo cáo JUnit XML** — cách các công cụ bắt ca chập chờn dùng (Trunk Flaky Tests đọc
  báo cáo JUnit XML do CI tải lên). Mỗi kho phải bật reporter riêng, đổi mặc định của mọi kho;
  không thuộc vòng này.
- **Kho chạy turbo với `--log-prefix=none`** — việc của lệnh suite trong kho, không phải kit; và
  khi nhiều tác vụ chạy song song, log bỏ tiền tố xen nhau thì mất dấu ca thuộc gói nào.

## Giới hạn khai khi giao

- Tiền tố có khoảng trắng (pnpm đệ quy in `<thư mục> <script>: `) và mã màu ANSI không được bóc:
  chưa có đầu ra thật nào của kho tiêu thụ mang hai dạng đó. Ngưỡng mở — đếm được sau khi dọn
  worktree, nhật ký trọn thì không: ≥1 dòng `repin` có `chap_chon` mang câu dự phòng ở một kho đã
  cài mốc chứa vòng này.
- Nhật ký trọn 07/10 của crm đã mất, nên «tiền tố turbo là nguyên nhân ở crm» là suy từ đối chiếu
  lệnh (bảng trong `NGUON.md`), chưa đọc trực tiếp. Chỗ đọc lại: dòng quan sát reality ở Notes của
  hợp đồng — lần chạy lại thật đầu tiên ở crm sau khi cài mốc phải mang tên ca.
- Tiền tố một cụm của bộ chạy khác (lerna `<gói>: `, yarn `[<gói>]: `) cùng hình dạng nên được
  bóc, nhưng chưa đo trên đầu ra thật của chúng.
- Dòng log trần dạng `nhan: (fail) x` mà hôm nay không khớp sẽ thành tên `x`. Trường `ca` là chỉ
  dẫn cho người sửa ca, không vào phán quyết của làn.

## Thước

Bản ghi đầu ra THẬT của turbo + bun, commit ở `tests/scripts/fixtures/ten-ca-turbo/turbo-bun.log`
kèm `NGUON.md` (lệnh ghi, phiên bản, đối chiếu với lệnh suite crm, phép thay đường dẫn tuyệt đối —
kho công khai) và `ghi-ban-ghi.mjs` sinh lại. Bản ghi đi qua CHÍNH `chayLenh` của làn và là
`out + "\n" + err` — đúng chuỗi làn đưa vào `rutTenCa`. Kho tạm có thêm một ca xanh tên chứa
«: (fail) » làm bẫy cho bộ bóc quá tay. Không ca nào gõ tay dòng có tiền tố: tiền tố của ma trận AC-2
rút bằng mã từ dòng ca đỏ của bản ghi.

Ca ở `tests/scripts/ten-ca-qua-tien-to.test.mjs` (suite `scripts` tự nhặt qua glob), tên ca =
tên AC. Mỗi ca chạy cùng một hàm kiểm ba lần: vật tại chỗ, bản sao nguyên vẹn của trọn thư mục
`feature-loop/scripts` (đối chứng rằng bản sao chạy được), và bản sao bị phá — `TIEN_TO_BO_CHAY` tắt
(AC-1, AC-2, AC-4), hoặc bóc tham tới dấu «: » cuối dòng và khuôn bun nhận cả `(pass)` (chiều nhạy
của chiều im, AC-3). Bản phá phải khác bản gốc trước khi tin màu đỏ. AC-4 chạy chính `repin-lane.mjs`
(bên gọi duy nhất của `rutTenCa`) trên kho fixture code-sinh; chiều đỏ chạy bản sao TRỌN thư mục
`feature-loop/scripts` với `lib/chay-lai.mjs` đã tắt phần bóc.

## Tệp

- `feature-loop/scripts/lib/chay-lai.mjs` — vật.
- `tests/scripts/ten-ca-qua-tien-to.test.mjs`, `tests/scripts/fixtures/ten-ca-turbo/` — thước.
- `GUIDE.md` (dòng `repin_retry` của bảng khoá) — một vế nói tiền tố được bóc.
- KHÔNG chạm `feature-loop/scripts/repin-lane.mjs` (vòng vá gate-card đang sửa tệp này; bên gọi
  không cần đổi).
