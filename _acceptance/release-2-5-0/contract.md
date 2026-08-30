---
schema_version: 1
feature: Phát hành kit 2.5.0 — đóng số cho năm hồ sơ đã ký 27–30/08 (thước nhãn-đè-khối · sổ chạy suite có nguồn gốc · không vẽ thẻ ma · chấm đúng cây đúng chỗ đứng · nhánh chính không tên main) + bộ ca đo tầng SKILL, để repo tiêu thụ nhận engine mới theo mốc có chủ đích
slug: release-2-5-0
owner: manh@mstar.vn
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + workspace hồ sơ + bản đồ — không dính t3_paths, không đổi mã cổng
surfaces: [cli]
status: draft
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-30T05:10:00Z
---

# Acceptance Contract: release-2-5-0

## Context

Repo tiêu thụ đang chạy plugin **2.3.0** (cài 22/08); bản **2.4.0** phát hành 26/08
nhưng CHƯA cài — mốc này gom nợ đó: sau khi merge, cài MỘT lần lên consumer là
nhận trọn 2.4.0 + 2.5.0. Kể từ 2.4.0, **năm hồ sơ đã ký và gộp** (#116 · #117 ·
#121 · #123 · #125) + một bộ ca đo (#120), **không đổi schema, không cần migrate**:

- `thuoc-nhan-de-khoi` (#116) — thước nhãn-đè-khối cho hình diagram-design; lời
  giải ĐẢO CHIỀU MẶC ĐỊNH cho lớp allowlist (không phân loại được → đoán về phía
  sót-đã-khai, không tố-oan).
- `suite-run-log-provenance` (#117) — mọi lệnh suite S4 chạy đều sinh dòng sổ
  chạy có nguồn gốc; đối chiếu sau chữ ký đọc bản ghi thật.
- `khong-ve-the-ma` (#121) — slug không có hồ sơ thì KHÔNG vẽ trọn thẻ quyết
  định; chốt hai tầng (script + renderer).
- `cham-dung-cay-dung-cho-dung` (#123) — tầng chấm S4 tự chứng minh chỗ đứng:
  args máy sinh (`s4-args.mjs`), ghim cwd bằng mã thoát cấu trúc
  (INFRA-EXIT-CODES: 97/127), sổ vòng ROUND-TALLY-SCHEMA + màu thứ ba
  «CHƯA-CHẤM-ĐƯỢC» (làn không chấm được thì TỰ KHAI, không phán bừa).
- `nhanh-chinh-khong-ten-main` (#125) — phép dò nhánh chính dò THẬT: tách vai
  `git()`/`gitTry()`, giải `origin/<tên>`, có remote khai thì không đoán, lệnh
  hỏi remote có trần thời gian; lưới thường trực giữ.
- Bộ ca đo tầng SKILL (#120, `evals/`) — đo skill có nổ đúng và thẻ có do
  renderer thật dựng; chạy được khi org bật `claude plugin eval`.

Mốc này **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì
(mục `v2.5.0` trong mô tả hai plugin), và là mốc ĐẦU TIÊN chạy dưới luật
«Giới hạn CHIỀU RỘNG» (CLAUDE.md, owner quyết 30/08 «cắt đuôi giữ lõi», #127):
hai vòng meta cuối (`khuon-rang-dung-chung` · `baseline-127-tin-hieu-phan-biet`)
đã PARK kèm ngưỡng mở lại; giữa hai release tối đa MỘT vòng meta.

Vì sao cắt số bây giờ: neo ngoài duy nhất của kit là bản phát hành tới repo
tiêu thụ, và từ 26/08 tới nay 100% giờ-kit là việc-trong-nhà trong khi 2.4.0
chưa tới tay consumer — mốc này là bước đầu của quyết định «cắt đuôi giữ lõi».

Source input: `git log b21dcd86..73549513` (năm hồ sơ #116–#125 + #120 + luật
#127) · nếp phát hành `_acceptance/release-2-4-0/` · owner quyết ① trong hội
thoại 30/08.

## Ba dòng số North Star của mốc (luật (c), đếm tay lần đầu)

| Hồ sơ | Vòng chấm | Lượt hạ-tầng-kit đốt | Làm-xong→ký |
|---|---|---|---|
| thuoc-nhan-de-khoi | 6 (sổ tay — trước cơ chế tally) | ≥1 (tự khai trong hồ sơ) | 27/08, trong ngày |
| suite-run-log-provenance | 5 (sổ tay) | ≥1 | 29/08, trong ngày |
| khong-ve-the-ma | 2 (evidence Iterations) | 1 (r1 chấm trên cây chưa commit) | 29/08, trong ngày |
| cham-dung-cay-dung-cho-dung | 3 (tally máy: PASS 1 · REJECT 1 · BLOCKED 1) | 1 (BLOCKED tự khai) | 29/08, ~4 giờ |
| nhanh-chinh-khong-ten-main | 6 (tally máy: PASS 3 · REJECT 1 · BLOCKED 2) | 2 (BLOCKED tự khai) | 29/08, ~4 giờ |

- **Số lần gọi người / vòng:** chưa có bộ đếm máy — từ vết ghi sổ đếm được
  ≥1 chữ ký + 7–19 dòng quyết định mỗi hồ sơ; số lượt hội thoại KHÔNG tái lập
  được từ repo (giới hạn đã khai — bộ đếm bắt đầu từ mốc này về sau).
- **Tỉ lệ meta:** 5/5 hồ sơ + 1 bộ ca đo = **100% việc-trong-nhà, 0 hồ sơ sản
  phẩm** — chính con số dẫn tới luật Giới hạn CHIỀU RỘNG và ngưỡng CẮT KIT
  đếm tới mốc 2.6.0 (≥2/5 vòng sản phẩm bị hạ-tầng-kit đốt, hoặc >3 lần gọi
  người/vòng → mở phiên quyết cắt).

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.5.0`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.5.0` và mục `v2.5.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.5.0` — đo trên đoạn cắt từ `v2.5.0`, sửa hay dời câu sang mục lịch sử KHÔNG được tính. *Nội dung* các vế người dùng nhận gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-4-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) [thước CE: bốn mốc trước đã dùng thật] · Trục B · hành trình hồ sơ (bằng chứng | biên merge) [thước CE: `xanh_sach_check` + ADR 0012]. Ô Core → AC-1 · AC-2 · AC-3 · AC-6; không ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0/2-4-0).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (§7.1; bài học ba mốc 2.0.0/2.1.0/2.2.0).
- Nâng số `diagram-design` — không đổi kể từ mốc trước.
- Ghim lại các hồ sơ đã ký đang hoá cũ — §7.1: chiến dịch ghim lại là việc SAU khi mốc merge.
- Cài bản mới lên repo tiêu thụ và kiểm tay máy thứ hai — việc sau khi mốc này merge (nợ gộp 2.4.0 + 2.5.0, ưu tiên số 1 sau merge).
- Mở lại hai vòng đã park — chặn bởi ngưỡng mở lại trong `.out-of-scope/thuoc-cua-thuoc-mot-tang.md`.
