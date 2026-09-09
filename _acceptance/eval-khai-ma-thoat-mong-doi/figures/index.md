# Điểm quyết định và hình — eval-khai-ma-thoat-mong-doi

Kê từ artifact cuối S1: 7 entry sổ quyết định chờ seal + 1 chỗ design lệch khỏi
một luật fail-closed đang có. Không dòng `[GIẢ ĐỊNH]` nào trong Coverage (chỉ
`[SUY-TỪ-REPO]` và `[NGÀNH]`). Không finding gap-probe nào xử lý `human-gate1`
(cả 5 đã fixed).

| Điểm | Đếm | Hình |
|---|---|---|
| Kỳ vọng tính theo LỆNH, xung đột thì BLOCKED | 3 nhánh rẽ (lệnh riêng · chung cùng mã · chung khác mã) | H2 |
| Luật hai vế của làn ghim lại | 3 nhánh rẽ (khai+ký khớp · ký ghi 0 · chưa khai) | H2 |
| Chỗ đọc thứ năm: L1 nới theo KHỐI | 4 nhánh rẽ (trong khối khớp · trong khối lệch · ngoài khối · eval không khai) | H2 |
| Khai mã khác 0 mà trả 0 → xanh kèm tiếng | 2 nhánh rẽ | H2 |
| Một nguồn kỳ vọng, năm bộ đọc rút từ đó | 5 bước nối tiếp | H1 |
| Định tuyến qua Known limits về Cổng Bằng chứng | 4 bước nối tiếp | H1 |
| Ranh giới với ô đã park `baseline-127` | 2 nhánh rẽ (ai phát ngôn kỳ vọng: máy suy · người khai) | H3 |
| Bỏ đặc-tả-UX (không surface) | dưới ngưỡng: 1 | — |

## Đề bài từng hình

**H1 — Đường đi của một mã thoát đã khai.** Sơ đồ luồng. Nút: `evals.yaml`
(khai `expected_exit: 2`) → `lib/eval-yaml.cjs` (MỘT nguồn, fail-closed khi khai
sai) → bốn bộ đọc tiêu thụ song song: S4 `acceptance-verify.js` · làn ghim lại
`repin-lane.mjs` · `checkRepinEvals` · `evaluateEvidence` (L1). Từ S4 rẽ tiếp
một nhánh nối tiếp: eval đạt-có-giới-hạn → dòng Known limits do máy tính →
mục Known limits hết rỗng → hồ sơ hết xanh-sạch → Cổng Bằng chứng có người.
Nhãn bằng chữ, không dùng số mã thoát làm nhãn nút. AC liên quan: AC-1, AC-4.

**H2 — Bảng nhánh: khi nào một mã khác 0 được nhận.** Bảng quyết định (ma trận),
không phải luồng. Cột: «khai trong evals.yaml?» · «báo cáo ĐÃ KÝ ghi mã đó?» ·
«mã thật của lượt chạy» → cột kết quả. Hàng phải phủ: khai+ký+khớp → ghim được,
đạt-có-giới-hạn · khai+ký ghi 0+trả mã → ĐỎ «tiền đề vừa mất» · không khai+trả
mã → ĐỎ «chưa khai» · khai+trả mã KHÁC → ĐỎ lệch · khai+trả 0 → XANH kèm câu
nói-ra · hai eval chung lệnh khai khác mã → BLOCKED có tên. AC: AC-3, AC-5,
AC-7, AC-8, AC-9, AC-10.

**H3 — Ranh giới với ô đã park.** Hình đối chiếu hai cột, nhỏ. Cột trái ô park
`baseline-127`: MÁY suy kỳ vọng từ mã thoát làn đối chứng, tầng thước-của-thước.
Cột phải việc này: NGƯỜI khai ở Cổng 1, ký ở Cổng Bằng chứng, tầng một. Dưới
cùng một dải nói vật hoá ranh giới: cấm khai mã 97 và 127. AC: AC-2, AC-11.
