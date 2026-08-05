---
schema_version: 2
feature: "gold-output-measure — sổ vàng in cho người được máy đo thật đầu-ra (render round-trip, ma trận đồng thuận toàn phần) + từ điển biệt ngữ lời ký để lớp giám khảo ngôn-ngữ có đường PASS sạch"
slug: gold-output-measure
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-05T11:15:00Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-05-gold-output-measure-design.md
time_human_minutes:
  gate1: 5
  gate2: 10
---

# Acceptance contract — gold-output-measure

Bối cảnh: 2 finding lens + 12 mục required_evidence J13-r4 của vòng
judge-required-evidence; feature tiêu thụ #1 pha Đo chương trình 80/20.

## Criteria

- AC-1: Given fixture code-sinh có N điểm vàng đủ 4 trường, When chạy
  `acceptance-gold.mjs` và đọc STDOUT thật, Then bảng sổ vàng có đúng N hàng,
  từng hàng khớp nội dung fixture ở cả 4 cột (quan hệ vào⇒ra, không đo chuỗi
  độc lập); đối chứng: phá 1 trường fixture → phép đo đỏ với thông điệp ghim.
- AC-2: Given verdict máy PASS/FAIL/UNCERTAIN, When render cột "Máy đề xuất",
  Then in tiếng người kèm mã trong ngoặc (vd "chưa đạt (FAIL)") từ map đặt
  MỘT chỗ; ma trận toàn phần: số case = số phần tử map + 1 case giá trị lạ
  passthrough nguyên văn (đường đọc-cũ).
- AC-3: Given run-log có panel đủ 4 hình dạng đồng thuận (3/3 · 2/1 · phân kỳ
  · chẵn 2/2), When `agreement()` phân loại, Then từng hình dạng vào đúng
  bucket VÀ per-lens (lensTotal, lensUncertain) đếm đúng từ votes — ma trận
  viết-trước, số assert = số hình dạng nhân số chiều đếm.
- AC-4: Given dữ liệu có nhiều góc nhìn, When render khối đồng thuận, Then
  mỗi góc nhìn MỘT dòng riêng — không nhồi một câu.
- AC-5: Given slug không có dòng panel, When render ghi chú, Then mỗi việc một
  dòng mang tên sản phẩm (fallback slug khi thiếu contract) và câu giải thích
  trung tính — KHÔNG khẳng định nguyên nhân thiếu dữ liệu.
- AC-6: Given `--root` trỏ thư mục không có `_acceptance/`, When chạy script,
  Then exit khác 0 kèm thông điệp ghim nêu path; đối chứng dương: root có
  `_acceptance/` rỗng vẫn exit 0 với sổ trống hợp lệ.
- AC-7: Given khối marker `SIGNOFF-JARGON-GLOSS` trong
  human-facing-language.md (tối thiểu: known-limits, dogfood, single-source),
  When render gặp term trong cột trích lời người hoặc hạng mục, Then cuối sổ
  có khối "Từ điển" CHỈ gồm term thật sự xuất hiện, chú giải rút từ marker —
  đường dẫn suy từ vị trí script, chạy được cả ở mirror plugin; term không
  xuất hiện thì không in.
- AC-8: Given human-facing-language.md không đọc được từ vị trí script, When
  render, Then sổ vẫn in đủ + MỘT dòng ghi chú rõ từ điển không nạp được —
  vắng nổ to, không crash, không im lặng.
- AC-9: Given term mới đã thêm vào `HFL-GLOSSARY-TERMS`, When chạy phép đo
  P96 hiện hành, Then từng term có mục trong CONTEXT.md — dùng lại chốt sẵn
  có, dữ liệu mới phải đi qua nó.
- AC-10: Given corpus `_acceptance/*` thật hiện tại, When chạy bản mới, Then
  `--json` giữ nguyên từng byte so bản trước khi sửa (parser không đổi),
  render không crash, số điểm và số panel không đổi — đường đọc-cũ.
- AC-11: (judgment) STDOUT thật của sổ mới trên corpus repo đạt luật
  ngôn-ngữ-mặt-người N1-N6 theo đường-từ-điển: người quyết kinh doanh hiểu
  không cần biết tên field máy; biệt ngữ trong lời ký được chú giải, lời
  người không bị viết lại.

## Coverage

Từ morphological-scan (3 trục — thước CE trong ngoặc):

- **A — chặng đầu-ra bị đo** (CE: 5 chặng đếm từ cấu trúc render hiện hành +
  [NGÀNH: golden/approval testing — Jest snapshot]): bảng vàng AC-1/AC-2 ·
  khối G3 AC-3/AC-4 · ghi chú noPanel AC-5 · khối Từ-điển AC-7/AC-8 · kênh
  `--json` AC-10
- **B — hình dạng đầu vào** (CE: required_evidence J13-r4 [SP] + bài học
  allowlist-RED): fixture code-sinh AC-1/AC-3 · đầu vào hỏng AC-6/AC-8 ·
  corpus thật + grandfather AC-10 · term mới AC-9
- **C — quan hệ ghim** (CE: 6 hình dạng MEASUREMENT_SHAPES hiện hành [SP]):
  round-trip vào⇒ra AC-1/AC-3/AC-7 · luật-N cơ học AC-2/AC-4/AC-5 ·
  single-source AC-7/AC-9 · fail-loud AC-6/AC-8 · tiếng người trọn sổ AC-11

## Out of scope

- `judgedBlocks` tautology (P152) — đã nằm trong đợt dọn nợ đo-lường ký ở
  vòng judge-required-evidence, không kéo vào đây.
- Gloss cho chuỗi máy tuỳ ý trong rationale trích dẫn — chỉ term trong danh
  mục marker.
- Viết lại / dịch lời người trong human_override (N4 cấm).
- Đổi hook/evidence-core/lib; đổi khuôn chữ ký người.

## Notes

Known limits — chấp nhận tại Cổng 2, Manh Phan 2026-08-05 (nhóm theo lớp):

- **Nguồn dữ liệu viết bằng tiếng máy (hội đồng 3/3 chấm chưa đạt).** Cột Việc
  và Hạng mục của sổ TRÍCH nguyên văn `feature:` / `question:` từ hồ sơ các
  vòng cũ; hồ sơ cũ viết tiếng máy thì sổ hiện tiếng máy (tên file làm chủ ngữ,
  machine-lane/run_id/fail-closed trong câu chính). Sửa nguồn = đụng hồ sơ đã
  ký của 20 vòng trước, ngoài phạm vi duyệt ở Cổng 1. Đường ra đã chốt: đặt
  luật "mô tả trong hồ sơ phải viết tiếng sản phẩm" cho hồ sơ TƯƠNG LAI + rà
  mô tả cũ trong một vòng riêng. Lối chú-giải chỉ hợp lệ cho LỜI KÝ (N4 cấm
  viết lại lời người), không phải giấy phép chung.
- **Hồ sơ xuất xứ khai `repo_sha` không đo được và hiện đang sai** (sinh trước
  khi ghi commit nên trỏ bản trước đó). Ba trường được đo (lệnh, checksum, độ
  dài) chỉ chứng minh "không sửa tay sau khi sinh", không chứng minh "mã nào đã
  in ra nó". Revisit: hoặc phép đo tự chạy lại tại đúng mã đó, hoặc bỏ trường
  không đo được.
- **Sổ nói "chưa có biên bản hội đồng nào" khi mọi biên bản đều là bản mang
  sang từ vòng trước** — biên bản có thật mà biến mất khỏi thứ trình người
  (kho hiện 31/68 biên bản thuộc dạng này). Ma trận P157 thiếu đúng ô đó.
- **Phép đo mới ghi file tạm vào thư mục nguồn `scripts/`** — bị ngắt giữa
  chừng thì rác nằm lại, làm đỏ oan cổng chống-trôi mirror. Cùng lớp "rác máy
  sinh làm đỏ suite" đã dẫm với card.html.
- Vặt cùng đợt dọn: mốc so-bản-cũ ghim cứng một mã commit (đọc như golden tĩnh,
  đỏ trên bản sao nông); lời khai của E10 hứa so-từng-byte trong khi phép đo so
  3 khối và bỏ đúng khối số liệu hội đồng; ma trận "mỗi góc nhìn một dòng"
  thiếu ô phân biệt; câu tuyên "đo tính chất" nhưng thân vẫn là danh sách 4
  chuỗi.
