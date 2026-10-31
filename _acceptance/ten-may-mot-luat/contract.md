---
schema_version: 1
feature: Một luật tên máy cho kênh liên máy — tin gửi tới một tên máy không nhận vai được thì bị từ chối ngay lúc gửi, không nằm chết trên kênh
slug: ten-may-mot-luat
owner: phanlemanh@gmail.com
risk_tier: T2      # dieu-phoi/scripts/** — ngoài risk_tiers.t3_paths
surfaces: [cli]
status: approved   # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: Manh Phan
approved_at: 2026-10-31T15:43:39Z
design_doc: _acceptance/ten-may-mot-luat/design.md
---

# Acceptance Contract: ten-may-mot-luat

## Context

Trên kênh liên máy, nhận vai (`tin vai --may`), bên viết tin (`tin GIAO|HỎI|BÁO <đích> --kenh`) và bên đọc dòng đầu
dùng ba luật khác nhau cho một tên máy: tin GIAO gửi tới «Mac Studio» (31/10, đợt crm) đăng được nhưng bên đọc trả
`null`, không máy nào nhận vai được bằng tên ấy, tin nằm chết. Vòng này đặt luật tên máy MỘT chỗ và cho bên viết hỏng
to theo đúng luật ấy. Người hưởng: các phiên điều phối trên kênh liên máy và chủ kho — một lời giao sai tên bị chặn
lúc gõ kèm cách sửa, không mất lặng. Trace nguyên tố 2 (máy không tin «đã đăng» là «đã tới»).

Source input: ô `_acceptance/ten-may-mot-luat/opportunity.md` (Cổng Đáng: chủ kho «Mở cả bốn», 31/10) · issue
phanlemanh/acceptance-gate-kit#464.

## Criteria

- AC-1: Given ma trận tên viết trước — hợp lệ `MBP`, `MacStudio`, `M5`, `G`, `P2`, `Mac2`; không hợp lệ `Mac Studio`, `Mac-Studio`, `Máy`, `MBP ` (dấu cách cuối), chuỗi rỗng, `Mac_Studio` — When mỗi tên qua luật tên máy dùng chung, và mỗi tên luật nhận được viết thành dòng đầu bằng `vietDongDau` (làm cả người gửi lẫn người nhận, mã sinh bằng `maMoi`) rồi đọc lại bằng `docDongDau`, Then luật nhận đúng 6 tên hợp lệ và từ chối đúng 6 tên không hợp lệ, và mỗi tên được nhận đọc ra đúng `den`, `tu` và `ma` đã viết (12 + 6 hàng); và trên bản sao nới luật nhận khoảng trắng, phép đo ĐỎ với hàng của `Mac Studio` nêu «đọc ra null».
- AC-2: Given kho thử có kênh với `gh` giả, máy `MBP` đã nhận vai, When `tin GIAO MacStudio …`, `tin HỎI MacStudio …` và `tin BÁO MacStudio …` chạy với `--kenh`, Then mỗi lệnh thoát 0 và đăng đúng một bình luận; dòng đầu của từng bình luận đã đăng đọc bằng `docDongDau` ra `den` = `MacStudio`, `tu` = `MBP`; và một máy thứ hai nhận vai `MacStudio` thấy hai vòng GIAO và HỎI gửi mình trong `tin so --kenh … --json`.
- AC-3: Given cùng kho thử, When `tin GIAO|HỎI|BÁO` chạy với `--kenh` tới đích `Mac Studio`, `MBP ` (dấu cách cuối), `Mac-Studio`, `Máy` và chuỗi rỗng, Then cả mười lăm lời gọi thoát 1 với dòng lỗi đúng nguyên văn `tin: đích «Mac Studio» không hợp lệ — tên máy chỉ gồm chữ và số (thành tiền tố mã tin); thử «MacStudio»` (với `MBP `: vế cuối «; thử «MBP»»; ba đích kia: cùng câu, không có vế «; thử …»), `gh` giả không nhận lời gọi nào, và tệp trạng thái kênh giữ nguyên từng byte; và trên bản sao gỡ bước kiểm của bên viết, cùng lời gọi tới `Mac Studio` đăng một bình luận mà bên đọc trả `null` — phép đo ĐỎ.
- AC-4: Given cùng một luật, When `tin vai --may "Mac Studio"` chạy, Then thoát 1 với dòng lỗi đúng nguyên văn `tin: tên máy «Mac Studio» không hợp lệ — tên máy chỉ gồm chữ và số (thành tiền tố mã tin); thử «MacStudio»` và không tạo tệp trạng thái kênh, còn `--may MacStudio` thoát 0 và tạo đúng tệp ấy (đối chứng dương của vế vắng mặt); và trên bản sao chỉ đổi nguồn luật dùng chung để nhận gạch nối, CẢ nhận vai lẫn bên viết cùng nhận `Mac-Studio` và mã tin của người gửi `Mac-Studio` đọc lại được — trong khi bản sao mà nhận vai (hoặc bên viết) giữ luật viết tại chỗ thì phép đo «một nguồn» ĐỎ, nêu đúng chỗ không đọc luật dùng chung.
- AC-5: Given chế độ đợt (không `--kenh`) và mọi ca hiện có của lệnh `tin` (`tests/dieu-phoi/tin.test.mjs`, `tests/dieu-phoi/tin-khong-mat-dau.test.mjs`), When `tin GIAO "Mac Studio" …` chạy trong đợt và hai tệp ca chạy trọn, Then lời gọi trong đợt vẫn trả thông điệp cũ `đích Mac Studio không có trong đợt (dãy hoặc G)` (không phải thông điệp tên máy), và hai tệp ca chạy trọn với 0 ca hỏng, không dòng «not ok», và số ca qua không dưới 69 (số ca của hai tệp ở gốc vòng).

## Coverage

- Trục A — hình dạng tên: chữ-số thuần (`MBP`, `MacStudio`, `M5`, `G`, `P2`, `Mac2`) | có khoảng trắng giữa (`Mac Studio`) | khoảng trắng cuối | ký tự ASCII ngoài luật (`-`, `_`) | chữ có dấu (`Máy`) | rỗng.
- Trục B — chỗ dùng tên: nhận vai | bên viết chế độ kênh (GIAO · HỎI · BÁO) | bên viết chế độ đợt | bên đọc dòng đầu | tiền tố mã tin.
- Trục C — chiều: tên hợp lệ đi trọn vòng viết→đọc | tên sai bị chặn trước mọi lời gọi mạng.
- Ô Core: A×bộ đọc/mã (AC-1) · A1×B2 (AC-2) · A2–A6×B2 (AC-3) · A2×B1 + một-nguồn B1/B2/mã (AC-4) · A2×B3 + hồi quy (AC-5).
- Later: siết bên đọc theo luật (B4 với tên sai) — bộ đọc giữ khoan dung, quan hệ giữ bằng AC-1.
- Không quét bằng skill: không gian kê tay ba trục ở trên; phản biện context sạch bổ sung hai ô khoảng trắng cuối và rỗng ở bên viết (dòng sổ descope «bỏ coverage-scan» mới).

## Đường đo

- «Bình luận đăng sau ngày nhận bản mà bộ đọc trả null = 0» trên crm-onehub#375: số từ lệnh có sẵn
  `tin so --kenh phanlemanh/crm-onehub#375 --tu <ngày nhận 2.36.2> --json`, trường `bo_qua` (bình luận không đọc được
  dòng đầu, kèm mã từng bình luận) — đọc ở máy đã nhận vai trên kênh. AC bảo đảm: AC-3 (bên viết không còn đăng được
  dòng đầu bộ đọc trả null qua lệnh tin) và AC-1 (mọi tên luật nhận đọc lại đúng).

## Out of scope

- Đối số vị trí thừa: `tin GIAO Mac Studio "…"` không nháy đọc đích «Mac» — lỗi bộ tách đối số, khác lớp; ghi hạt giống.
- Siết bộ đọc dòng đầu (`docDongDau`) theo luật tên máy.
- Đổi tên máy đang dùng (MBP, MacStudio) hay dọn tin chết đã đăng trên crm-onehub#375.
- Cắt bản 2.36.2 (phiên điều phối làm sau khi bốn vòng gộp).

## Notes

- Vật: `dieu-phoi/scripts/tin-doc.mjs` (nguồn luật + `loiTenMay`), `dieu-phoi/scripts/tin-kenh.mjs` (`vai`),
  `dieu-phoi/scripts/tin.mjs` (kiểm đích chế độ kênh trước khi mở nơi chứa), một câu ở `dieu-phoi/README.md` ·
  thước: `tests/dieu-phoi/ten-may-mot-luat.test.mjs` ca TM-1…TM-5 · khoá eval `executors.script.tmml_e1…e6`.
