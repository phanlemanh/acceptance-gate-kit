---
schema_version: 1
feature: Phát hành kit 2.4.0 — đóng số cho bảy hồ sơ đã ký 22–26/08 (lệnh bấm được · ba tài liệu đầu tay · /start bảng điều khiển · đặc tả UX · ra có tên ở LÀM và TRAO · làn máy qua bộ phân loại · design-pass nấc không đồng bộ) để repo tiêu thụ nhận engine mới theo mốc có chủ đích
slug: release-2-4-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + workspace hồ sơ + bản đồ — không dính t3_paths, không đổi mã cổng
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-26T09:20:06Z
---

# Acceptance Contract: release-2-4-0

## Context

Repo tiêu thụ đang chạy plugin **2.3.0** (22/08). Kể từ đó **bảy hồ sơ đã ký và gộp**
(#93 · #98 · #101 · #107 · #109 · #110 · #112) mà **không đổi schema, không cần migrate**:

- `lenh-in-ra-phai-bam-duoc` (#93) · `lenh-tran-tai-lieu-dau-tay` (#98) — mọi tên lệnh kit in
  ra đều bấm được, từ MỘT nguồn (bảng `COMMAND-NAMES`, khớp vòng hai chiều); ba tài liệu đầu
  tay còn 0 lệnh trần; TRỪ ba cờ nhiễu trên thẻ.
- `start-bang-dieu-khien` (#101) — `/start` là bảng điều khiển: hiện hết ý đang cân nhắc, nêu
  tên việc máy vừa làm và thứ còn veto được, và mọi bộ đọc nói CÙNG một chữ cho cùng trạng thái.
- `dac-ta-ux-vat-hoa-cau-truc` (#107) — khuôn đặc tả UX (`references/ux-spec-template.md`), lời
  S1 bắt điền TRƯỚC khi sinh ba artifact, cửa miễn một dòng cho vòng không chạm UI.
- `ra-co-ten-lam-va-trao` (#109) — **hồ sơ T3 duy nhất của mốc**: chạm `lib/workspace-record.cjs`,
  `lib/evidence-core.cjs` (hook) và `scripts/pre-merge-check.sh`. Đây là thay đổi hành vi mà
  người nâng cấp phải đọc.
- `lan-may-song-qua-bo-phan-loai` (#110) — lệnh kiểm cố định thôi phải xin phép từng lần; nghi
  thức biết thoái hoá tuần tự khi fan-out nghẽn.
- `design-pass-nac-khong-dong-bo` (#112) — thang bốn nấc phản ứng, mặc định KHÔNG ĐỒNG BỘ;
  bước phân kỳ có điều kiện mở từ đặc tả UX; ba khoá vết trong sổ phiên; thẻ hiện nấc.

Mốc này **không đổi một dòng mã cổng** — chỉ đóng số và nói cho người dùng biết họ nhận gì
(mục `v2.4.0` trong mô tả hai plugin) kèm hai điều phải nói thật: (a) đặc tả UX giao VẬT và LỜI,
KHÔNG có lưới máy — người duyệt soi tại Cổng Phạm vi; (b) hai cơ chế của mốc (khuôn đặc tả UX và
nghi thức không đồng bộ) phát hành khi **chi phí/lợi ích chưa được đo** — ván thử sống ở repo
tiêu thụ, Cổng Giá trị của chúng cố ý còn mở.

Vì sao cắt số bây giờ: hồ sơ T3 `ra-co-ten-lam-va-trao` chạm hook + lưới trước-merge, và §7.1
cấm đổi engine dưới chân một vòng đang chạy — thay đổi loại đó chỉ được tới consumer qua **mốc
có chủ đích**. Đồng thời chính ván thử đang khoá bảy Cổng Giá trị chỉ chạy được **sau khi**
repo tiêu thụ nhận được engine này.

Source input: `git log e613224e..8ff6c58a` (bảy hồ sơ #93–#112) · nếp phát hành
`_acceptance/release-2-3-0/` · owner gật «bump 2.4.0» 2026-08-26.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.4.0`), `diagram-design` hợp semver (giữ `2.5.0`, không đổi kể từ 2.2.0).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH (ca vĩnh viễn P200 chạy bên trong suite plugins) và `product-map --check` khớp.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.4.0` và mục `v2.4.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.4.0` — đo trên đoạn cắt từ `v2.4.0`, sửa hay dời câu sang mục lịch sử KHÔNG được tính. *Nội dung* sáu vế người dùng nhận gì + hai điều nói thật đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0/2-2-0/2-3-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) [thước CE: ba mốc trước đã dùng thật] · Trục B · hành trình hồ sơ (bằng chứng | biên merge) [thước CE: `xanh_sach_check` + ADR 0012]. Ô Core → AC-1 · AC-2 · AC-3 · AC-6; không ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (§7.1; bài học ba mốc 2.0.0/2.1.0/2.2.0 đều tự dựng răng dùng-một-lần và đều thủng).
- Nâng số `diagram-design` — không đổi kể từ 2.2.0.
- Ghim lại các hồ sơ đã ký đang hoá cũ — §7.1: chiến dịch ghim lại là việc SAU khi mốc merge, không nằm trong mốc.
- Giải bảy Cổng Giá trị đang treo — chúng chờ ván thử ở repo tiêu thụ, mà ván đó chỉ chạy được sau khi mốc này tới tay consumer.
- Cài bản mới lên repo tiêu thụ và kiểm tay máy thứ hai — việc sau khi mốc này merge.
