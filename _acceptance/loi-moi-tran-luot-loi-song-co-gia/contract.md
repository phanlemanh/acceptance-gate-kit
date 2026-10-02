---
schema_version: 1
feature: Lời mời ở trần lượt là vật máy sinh — thẻ Cổng Bằng chứng CHƯA-ký-được in khối «Lối ra» (lối sống, có giá, khuyến nghị tất định) khi vòng chạm trần lượt hoặc một eval hỏng lặp lại
slug: loi-moi-tran-luot-loi-song-co-gia
owner: phanlemanh@gmail.com
risk_tier: T2      # scripts/gate-card.js, scripts/loi-ra-tran-luot.cjs, SKILL feature-loop — không khớp t3_paths
surfaces: [cli]
status: implemented
approved_by: "Phan Le Manh"
approved_at: 2026-10-02T23:10:33Z
design_doc: docs/superpowers/specs/2026-10-03-loi-moi-tran-luot-loi-song-co-gia-design.md
---

# Acceptance Contract: loi-moi-tran-luot-loi-song-co-gia

Gốc: crm/_acceptance/muc-tieu-va-kr

Source input: `docs/plans/2026-10-03-hat-giong-loi-moi-tran-luot-loi-song-co-gia.md` — owner gọi tên vòng 03/10.

## Context

Trần 3 lượt chấm và điều khoản dừng-vá là lời trong SKILL; lời mời ở hai điểm dừng ấy do phiên tự
soạn, còn thẻ Cổng Bằng chứng ở nhánh CHƯA-ký-được in «không cần làm gì». Ca crm `muc-tieu-va-kr`
(02/10): ba lượt máy hỏi chủ kho ngoài thiết kế, 3/3 «theo khuyến nghị», hai lần khuyên lối đắt
(thêm 3–6 giờ máy), một lần khuyên lối không ký được; một eval không ra phán quyết ở cả bốn lượt,
ăn 310 phút của lượt 4. Vòng này biến lời mời ấy thành vật máy sinh trên thẻ, đọc từ sổ chạy.

**CỘNG — cần owner phê đích danh ở Cổng Phạm vi (ADR 0018):** một mô-đun đọc mới và một khối mới
trên thẻ. Trace: nguyên tố 3 (khoảnh khắc quyết thật — cổng phải có ≥2 lối ra sống). Người hưởng:
người ký ở kho tiêu thụ khi một vòng chạm trần lượt (ca gần nhất: chủ kho crm, 02/10).

## Criteria

- AC-1: Given sổ chạy do bộ chấm thật sinh và báo cáo REJECT hoặc BLOCKED không ký được, When dựng thẻ Cổng Bằng chứng, Then `--extract` có khoá `loi_ra` với `lap` gọi đúng id eval, AC và đúng các lượt chưa đạt, HTML có khối «Lối ra» mang đúng các chuỗi ấy — theo ma trận viết trước của lớp «chưa đạt ở một lượt» (số assert = số hàng): (1) `cannot_run` · (2) bị công cụ ngắt (`killed_by_tool`) · (3) mã thoát khác 0 không khai · (4) mã thoát ĐÚNG `expected_exit` đã khai là đạt, không vào `lap` · (5) lượt thử lại cùng round: dòng cuối thắng · (6) `SUITE-*` và id ngoài `evals.yaml` không vào `lap` · (7) lượt tuần tự không dòng `round-tally` · (8) lượt cuối cụt: eval chưa đạt ở lượt trước mà vắng dòng ở lượt cuối vẫn vào `lap` kèm «không có dòng ở lượt r» · (9) lượt cuối BLOCKED.
- AC-2: Given sổ chạy có lượt cuối ≥ 3 mà không eval nào lặp (mỗi lượt một eval khác chưa đạt), When dựng thẻ, Then `loi_ra.tran` là true, `lap` rỗng, lối `luot-nua` mang chữ «vượt trần 3 lượt», và khối hiện.
- AC-3: Given mọi trạng thái thẻ trong ma trận viết trước — PASS · PENDING-JUDGMENT · BLOCKED cạnh mù ký được · chết lần đầu · REJECT có lặp · REJECT ở trần, When dựng thẻ, Then thẻ ký được và thẻ «chết lần đầu» KHÔNG có khoá `loi_ra` lẫn khối; thẻ có khối thì `loi` gồm đúng ba mã `thu-pham-vi`, `luot-nua`, `dung` — không mã nào khác, không chữ mời ký — và có dòng «Không có lối ký».
- AC-4: Given thẻ có khối, When có eval lặp, Then `khuyen_nghi.ma` là `thu-pham-vi` và tên lối gọi đúng AC của eval lặp; When không eval nào lặp, Then `khuyen_nghi.ma` là `luot-nua`; cả hai kèm câu `vi_sao` khác rỗng in trên HTML.
- AC-5: Given sổ có dòng `round-tally` do bộ chấm thật ghi (`ts` = `invokedAt` của args, mốc đầu lượt) và dòng `thuoc-vat` do `thuoc-vat.mjs --write` thật ghi cho cùng lượt, When dựng thẻ, Then `luot[].phut` của lượt ấy bằng hiệu hai mốc giờ làm tròn phút và giá lối `luot-nua` in con số đó; phép đo rút tên trường giờ từ chính hai dòng bên viết ghi, không ghi tay dòng nào; Given lượt thiếu một trong hai dòng, Then `phut` là null và thẻ in «chưa đo» — không in 0, không đoán.
- AC-6: Given năm hồ sơ của ma trận viết trước — REJECT lượt 1 · REJECT lượt 2 không eval lặp · eval từng chưa đạt nhưng lượt cuối đã đạt · PASS · BLOCKED cạnh mù ký được, When dựng thẻ, Then không có khoá `loi_ra`, và cả HTML lẫn `--extract` bằng từng byte với thẻ dựng bằng bản `scripts/` + `lib/` + `skills/` trước vòng này trên cùng hồ sơ.
- AC-7: Given thẻ có khối, When so `--extract` với HTML, Then tên và giá của cả ba lối, câu khuyến nghị và từng dòng eval lặp trong `loi_ra` đều có mặt nguyên văn trên HTML (một nguồn).
- AC-8: Given `feature-loop/skills/feature-loop/SKILL.md`, When đọc khối marker `TRAN-LUOT-LOI-RA`, Then khối nêu tên khối đúng bằng hằng `TEN_KHOI` mà mô-đun `scripts/loi-ra-tran-luot.cjs` xuất (rút từ bên viết, so bằng nhau), nêu cả hai điểm dừng (trần lượt, dừng-vá) và câu cấm mời ký; số `TRAN_LUOT` mô-đun xuất bằng số trong câu «Tối đa … round» của SKILL.
- AC-9: Given sổ chạy có dòng không phải JSON, dòng eval thiếu `round`, sổ vắng hẳn, hoặc `evals.yaml` vắng/không đọc được, When dựng thẻ trên báo cáo REJECT, Then thẻ vẫn dựng xong (thoát 0), dòng hỏng bị bỏ qua, khối chỉ hiện khi các dòng đọc được còn đủ điều kiện của AC-1 hoặc AC-2, và khi `evals.yaml` không đọc được thì khối (nếu hiện) in cờ vàng «không đọc được evals.yaml — AC không xác định» thay vì im.

## Coverage

Quét Zwicky (preset test-matrix), đầy đủ ở design doc §6.

- **Trục A — trạng thái thẻ** [thước CE: SUY-TỪ-REPO `scripts/gate-card.js` nhánh ký được / không ký được, `lib/nhan-canh-gay.cjs` tập `trangThai`]: REJECT · BLOCKED không phân loại · BLOCKED cạnh mù · PASS/PENDING · khoá khác → AC-1, AC-3, AC-6.
- **Trục B — lịch sử lượt** [thước CE: SUY-TỪ-REPO điều khoản dừng-vá + trần của SKILL; ca crm bốn lượt]: lượt 1 · lượt 2 không lặp · lặp gồm lượt cuối · ≥ trần không lặp · từng lặp nay đạt → AC-1, AC-2, AC-4, AC-6.
- **Trục C — hình dạng sổ** [thước CE: run-log thật của ca crm mang ba hình]: lượt workflow · lượt tuần tự · thiếu `thuoc-vat` · lượt cuối cụt · dòng hỏng / sổ vắng · `evals.yaml` không đọc được → AC-1, AC-5, AC-9.
- **Trục D — mặt ra**: HTML · `--extract` · chỉ dẫn SKILL → AC-7, AC-8.
- [NGÀNH: circuit breaker — Nygard, «Release It!»] mở lại bằng một lượt thử có giới hạn → đã nhận: lối `luot-nua` là MỘT lượt (AC-2). [NGÀNH: retry budget — Google SRE Book] ngân sách thử lại tính bằng tài nguyên → Later (Out of scope dòng 1).
- `[GIẢ ĐỊNH]` Thẻ «thước lệch» và «cây đổi» không có trong ma trận AC-3: dựng hai trạng thái ấy cần kho git và args thật; chúng đi cùng nhánh mã với «chết lần đầu» (một điều kiện loại trừ chung), nên một đại diện là đủ.
- `[GIẢ ĐỊNH]` Phiên ở kho tiêu thụ sẽ render thẻ ở trần lượt khi SKILL bảo thế — không có răng máy nào ép (Notes, giới hạn 1).

## Out of scope

- Phút theo từng eval («thước này ăn bao nhiêu phần của lượt») — cần đọc `usage-report.md`; hạt giống giữ, chưa làm.
- Răng ở `s4-args.mjs` chặn lượt vượt trần khi sổ chưa có quyết định của người.
- Đường «thước lệch» ở Cổng Bằng chứng (ứng viên thứ hai của hạt giống) — CỘNG riêng, chưa đề xuất.
- Thước chạy thước của hồ sơ khác, glob `paths` dùng làm danh sách hồi quy — vật của kho crm, không vào kit.
- Sửa `feature-loop/workflows/acceptance-verify.js`; sửa `lib/**`; tăng phiên bản gói — kit lên số theo mốc phát hành.
- Thẻ Cổng Phạm vi — không đổi.

## Notes

- Hạng T2: không tệp nào khớp `t3_paths`. Mô-đun mới ở `scripts/` (không ở `lib/`) để giữ hạng và vì chỉ thẻ đọc nó.
- Dự báo năm dòng số (luật c): làm-xong→quyết-được ↓ (ở vòng chạm trần) · lượt gọi người ngoài thiết kế ↓ (lối chết hết, khuyến nghị thôi sai hướng) · vòng bị hạ tầng đốt lượt = · token máy/vòng = · phút máy/lượt chấm =. Điều kiện tin cậy: đường phán quyết không đổi thành phần — vòng này chỉ đọc sổ và in thẻ.
- Cân trên mọi kho: kho không chạm trần và không có eval lặp nhận thẻ giống từng byte (AC-6); không đổi mặc định nào.
- Giới hạn đã khai, kèm ngưỡng đang đếm:
  - Phiên có render thẻ ở trần lượt hay không vẫn là chỉ dẫn SKILL (AC-8 đo khối chỉ dẫn khớp bên viết, không đo phiên). Ngưỡng: ≥1 vòng ở kho đã cài bản này mà phiên vẫn tự soạn lời mời ở trần lượt.
  - Chiều im AC-6 cần lịch sử git đủ sâu để tìm cha của commit đầu; bản sao nông → ca đỏ có tên, không xanh rỗng.
  - Sửa `scripts/gate-card.js` làm các hồ sơ ghim `scripts/**` hoá cũ tới chiến dịch ghim lại kế (luật re-pin theo mốc).
