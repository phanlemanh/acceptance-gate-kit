---
schema_version: 1
feature: Phát hành kit 2.6.0 — đóng số cho một vòng đã ký sau khi thu phạm vi (cong-dang-co-cua) + đọc NGƯỠNG CẮT KIT tại đúng mốc owner khai trước, để repo tiêu thụ nhận engine mới theo mốc có chủ đích
slug: release-2-6-0
owner: manh.phan@onemount.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + workspace hồ sơ + bản đồ — không dính t3_paths, không đổi mã cổng
surfaces: [cli]
status: draft
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-01T09:30:00Z
---

# Acceptance Contract: release-2-6-0

## Context

Kể từ mốc 2.5.0 (`bb73217d`, 30/08) tới nay, **đúng MỘT vòng đã ký** — và nó là
một vòng **meta**, không phải vòng sản phẩm:

- `cong-dang-co-cua` (#133, 01/09) — mở ra để lắp làn thẻ Cổng Đáng thứ ba, kết
  thúc bằng **thu phạm vi tại điều khoản dừng-vá**: 10/13 tiêu chí trả về ô
  (ghim `528caaa8`, xem `_acceptance/cong-dang-co-cua/discovery/LAY-VE-LAN-THE.md`),
  ba tiêu chí còn lại ở lại vì tự đứng được.

Toàn bộ diff chạm engine của mốc này là **ba file**: `scripts/gate-card.js`,
`commands/acceptance-card.md`, `tests/scripts/run-tests.sh`. Không đổi schema,
không cần migrate, không đụng `t3_paths`.

Vì sao cắt số cho một mốc mỏng như vậy — **hai** lý do, và lý do thứ hai mới là
lý do chính:

1. Neo ngoài duy nhất của kit là bản phát hành tới repo tiêu thụ. Ba thứ trong
   mốc này đều là thứ người dùng gặp bằng tay, không phải việc-trong-nhà.
2. **2.6.0 là mốc owner đã khai trước làm chỗ đọc NGƯỠNG CẮT KIT** (CLAUDE.md,
   luật Giới hạn CHIỀU RỘNG (c), quyết 30/08). Ngưỡng đó chỉ đọc được nếu số
   nằm trong hồ sơ phát hành. Cắt mốc ở đây là cách duy nhất để lời hứa 30/08
   không thành một dòng chữ không ai đối chiếu.

Source input: `git log bb73217d..313962e0` · ba dòng số của vòng 01/09 ở
[`docs/findings/2026-09-01-ba-dong-so-vong-cong-dang.md`](../../docs/findings/2026-09-01-ba-dong-so-vong-cong-dang.md)
· nếp phát hành `_acceptance/release-2-5-0/` · owner gọi tên mốc trong hội thoại
01/09.

## Ba dòng số North Star của mốc (luật (c), lần đếm thứ hai)

Cửa sổ đếm: `bb73217d` (2.5.0) → `313962e0`. **Một vòng.**

| Hồ sơ | Loại | Vòng chấm | Lượt gọi người | Hạ-tầng-kit đốt lượt | Làm-xong → quyết-được |
|---|---|---|---|---|---|
| `cong-dang-co-cua` (#133) | **meta** | 3 (r1 REJECT · r2 REJECT · r3 PENDING-JUDGMENT→PASS) | **5** | 1 | 10:39 implemented → 14:50 ký = **4h11** (bản thu phạm vi: 13:16 → 14:50 = 1h34) |

- **Số lần gọi người / vòng: 5** — ký Cổng Đáng · duyệt Cổng Phạm vi · cho chạy
  S4 · gật phạm vi + vòng 2 · quyết dừng-vá.
- **Tỉ lệ meta: 1/1 = 100%.** Cửa sổ này KHÔNG có vòng sản phẩm nào.
- **Lượt bị hạ tầng kit đốt: 1** — vòng ở kho tiêu thụ `crm` ngày 01/09, chính
  là thứ mở ra phiên này.

### Đọc ngưỡng CẮT KIT tại mốc này

Ngưỡng owner khai 30/08, nguyên văn: *tới mốc 2.6.0, nếu ≥2/5 vòng sản phẩm kế
bị hạ-tầng-kit đốt, hoặc trung bình >3 lần gọi người/vòng → mở phiên quyết cắt
kit.*

| Vế | Đọc được gì | Kết luận |
|---|---|---|
| ≥2/5 **vòng sản phẩm** bị hạ tầng đốt | Cửa sổ 2.5.0→2.6.0 có **0 vòng sản phẩm** | **CHƯA ĐỌC ĐƯỢC** — mẫu số rỗng, không phải «đạt» |
| trung bình >3 lần gọi người/vòng | Vòng duy nhất đo được: **5** | **VƯỢT** |

Vế thứ hai vượt, nhưng vượt trên **n = 1** và trên một vòng **meta** — loại vòng
ngưỡng không nhắm tới. Đây là dữ kiện đưa lên, KHÔNG phải một phán quyết: phiên
quyết cắt kit là phiên của owner, mở theo lịch của owner. Ba điều đi kèm, đã
chứng trong hồ sơ 01/09 và không phụ thuộc cỡ mẫu:

1. **34 phát hiện qua hai vòng chấm, 0 do phép đo máy bắt** (27 lượt eval xanh
   trọn ở cả hai vòng). Giá trị đến từ rà soát đối kháng.
2. **Cụm lỗi lớn nhất nằm trong MÃ ĐO, không trong sản phẩm** — r1 11/18, r2
   8/16 rơi vào `rang.sh` và `run-tests.sh`; cờ `coverageCluster` bật cả hai vòng.
3. **Lớp lỗi tái phát qua hai vòng liên tiếp** nên khuôn sai chứ không phải chi
   tiết sai; ô `khuon-rang-dung-chung` (park 30/08) là chỗ lớp đó thuộc về.

Giới hạn của số này, khai thẳng: bộ đếm «lần gọi người» vẫn là **đếm tay từ vết
hội thoại**, không có bộ đếm máy — cùng giới hạn đã khai ở mốc 2.5.0, chưa đóng.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.6.0`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.6.0` và mục `v2.6.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.6.0` — đo trên đoạn cắt từ `v2.6.0`, sửa hay dời câu sang mục lịch sử KHÔNG được tính. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-5-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) [thước CE: năm mốc trước đã dùng thật] · Trục B · hành trình hồ sơ (bằng chứng | biên merge) [thước CE: `xanh_sach_check` + ADR 0012]. Ô Core → AC-1 · AC-2 · AC-3 · AC-6; không ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0→2-5-0).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (§7.1; bài học ba mốc 2.0.0/2.1.0/2.2.0).
- **Dựng răng riêng cho mốc.** Canh bằng ca VĨNH VIỄN P200 (mọi số đọc từ manifest, 5 đột biến + đối chứng dương) — cùng nếp 2.3.0→2.5.0.
- Nâng số `diagram-design` — không đổi kể từ mốc trước.
- **Mở phiên quyết cắt kit.** Mốc này chỉ ĐẶT SỐ CẠNH NGƯỠNG. Phiên quyết là phát ngôn của owner, mở theo lịch của owner; hỏi lại ở đây là trạm thu phí.
- **Lấy lại làn thẻ Cổng Đáng đã trả về ô.** Chặn bởi chính quyết định thu phạm vi 01/09; lấy lại là một vòng riêng, cây ghim `528caaa8` còn nguyên.
- Ghim lại các hồ sơ đã ký đang hoá cũ — §7.1: chiến dịch ghim lại là việc SAU khi mốc merge.
- Cài bản mới lên repo tiêu thụ và kiểm tay máy thứ hai — việc sau khi mốc này merge.
- Đóng bộ đếm «lần gọi người» bằng máy — giới hạn đã khai hai mốc liên tiếp, thuộc ô riêng.
