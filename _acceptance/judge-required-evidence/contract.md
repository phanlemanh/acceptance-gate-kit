---
schema_version: 2
feature: "judge-required-evidence — verdict judgment không-PASS phải kèm danh sách bằng-chứng-thiếu (required_evidence) chảy từ judge → memo → report → thẻ → round fix; gộp gold-seed O4: acceptance-gold.mjs dẫn xuất gold set + báo cáo G3 từ corpus sẵn có, không file mới"
slug: judge-required-evidence
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-05T08:12:41Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-05-judge-required-evidence-design.md
time_human_minutes:
  gate1:
  gate2: 10
---

# Acceptance contract — judge-required-evidence

Bối cảnh: baseline B5 — verdict judgment không-PASS là TRẦN, round fix phải
đoán judge muốn gì; B6 — mọi quyết định người-lật-máy tại Cổng 2 đang bị
vứt. Vòng 3 (chót) chương trình 80/20.

## Criteria

- AC-1: Given judge chấm một judgment eval, When verdict là FAIL hoặc
  UNCERTAIN, Then kết quả kèm `required_evidence` ≥1 mục — mỗi mục nêu MỘT
  bằng chứng cụ thể + chỗ lấy nó, đủ để "nếu có mục này thì verdict đổi";
  verdict PASS không bắt buộc field.
- AC-2: Given judge không-PASS mà KHÔNG nêu bằng-chứng-thiếu, When script
  gom kết quả, Then không tự bịa hộ: memo và report ghi rõ dấu "(judge
  không nêu bằng-chứng-thiếu)" — thiếu sót hiện cho người, đo được cho O3.
- AC-3: Given dòng `kind:panel` trong `run-log.jsonl`, When ghi memo, Then từng
  vote mang `required_evidence` của nó; carry P3 round sau GIỮ NGUYÊN danh
  sách (carried panel không rụng field).
- AC-4: Given template evidence-report, When render block judgment, Then có
  khuôn dòng `required_evidence:` đặt MỘT chỗ trong template và nội dung
  không chứa token nào dính bẫy L1 CONSISTENCY của hook (không chuỗi
  "verdict: FAIL", không mã thoát thô).
- AC-5: Given màn quyết định Cổng 2 (gate-card), When judgment item có danh
  sách bằng-chứng-thiếu, Then màn này hiện khối "Bằng chứng còn thiếu" bằng tiếng sản phẩm; report CŨ
  không có field → màn này render y như trước (đường đọc-cũ, không cờ oan).
- AC-6: Given round fix sau khi có panel FAIL, When SKILL (cả hai harness)
  dẫn vòng fix, Then bước đầu là đọc `required_evidence` từ `run-log.jsonl`/report
  và bổ sung ĐÚNG bằng chứng đó — có mệnh đề cấm đoán-mò nguyên nhân
  judgment khi danh sách tồn tại; mutation xoá mệnh đề → phép đo đỏ.
- AC-7: Given persona judge v1, When đọc, Then khối output có
  `required_evidence` với luật mục-phải-hành-động-được; mutation xoá → đỏ.
- AC-8: Given corpus `_acceptance/*/` hiện tại, When chạy
  `acceptance-gold.mjs`, Then trả gold set — mỗi điểm (slug, evalId, verdict
  máy đề xuất, người quyết + lý do trích từ `human_override`) — corpus thật
  phải ra ≥7 điểm (sanity chống 0-hit-giả); fixture report không override →
  0 điểm cho slug đó (đối chứng).
- AC-9: Given `run-log.jsonl` có dòng `kind:panel`, When chạy acceptance-gold, Then
  báo cáo G3: tỉ lệ 3/3-đồng-thuận · 2/1 · phân kỳ + per-lens
  FAIL/UNCERTAIN; `run-log.jsonl` CŨ không có panel → slug ghi "chưa có dữ liệu
  panel", không crash, không tính sai mẫu số.
- AC-10: Given lệnh `/acceptance-report`, When đọc chỉ dẫn của nó, Then có
  bước gọi acceptance-gold + in 2 khối Gold set và G3 bằng tiếng người;
  mutation xoá bước → phép đo đỏ.
- AC-11: *(sửa lời 07/08 — xem Amendment)* Given mọi artifact CŨ (report,
  `run-log.jsonl`, panel không có
  field mới),
  When chạy toàn bộ lưới + card + gold, Then hành vi y như trước — 0
  VIOLATION oan, 0 crash, hook/evidence-core KHÔNG bị sửa **bởi chính feature
  này** (đo bằng diff `lib/**` và `hooks/**` trên ĐÚNG phạm vi commit của nó,
  không phải trên một base di động).
- AC-12: (judgment) Nghi thức required_evidence đọc-được-làm-được bởi judge
  fresh không có ngữ cảnh: mục có cụ thể-hành-động-được không, có xui judge
  bịa "evidence-shopping" (đòi bằng chứng vô hạn để né phán) không.
- AC-13: (judgment) Hai khối Gold set + G3 in ra đạt luật ngôn-ngữ-mặt-người
  — người đọc hiểu không cần biết tên field máy.
- AC-14: (judgment) Dogfood: `run-log.jsonl` S4 của CHÍNH vòng này (script
  nguồn) —
  mọi dòng `kind:panel` proposal ≠ PASS phải mang `required_evidence` không
  rỗng; chưa có dòng không-PASS nào thì đo bằng harness + máy trả UNCERTAIN,
  người đếm tại Cổng 2.

## Amendment (2026-08-07 — ghim phép đo AC-11 vào phạm vi riêng, KHÔNG nới yêu cầu)

Phép đo của AC-11 (`tests/scripts/core-untouched.test.mjs`, case `JR11a`) so
`lib/**` + `hooks/**` với một base **di động** — `merge-base(HEAD, origin/main)`.
Viết thế thì câu nó khẳng định không còn là *"feature NÀY không phải đụng lõi"*
mà thành *"KHÔNG AI được đụng lõi, mãi mãi"* — một bất biến chưa ai duyệt tại
cổng nào.

Nó chặn đúng lát đầu tiên có lý do chính đáng để sửa `lib/`: `crosslayer-uncoded`
(hồ sơ ngược #36) đưa Dấu `cross-layer` về cùng một nguồn với `judgment` trong
`lib/ac-line.js`. Cùng lớp với `check-manifest-unmoved.sh` bên repo tiêu thụ:
ảnh chụp của MỘT PR viết ra trông như luật vĩnh viễn.

**Ý định của AC-11 không đổi**, chỉ thước đo bị ghim lại. Phạm vi nay là đúng
phần commit mà chính feature này sở hữu:

| mốc | commit |
|---|---|
| `RANGE_BASE` | `d2b6b19~1` — cha của commit Cổng 1 |
| `RANGE_TIP` | `e6dad45` — commit chữ ký Cổng 2 |

Đo tại thời điểm ghim: diff `lib` + `hooks` trên phạm vi này **TRỐNG** — lời
khẳng định của AC-11 vẫn đúng nguyên vẹn, chỉ thôi bắt các lát sau chịu chung.
Răng đã kiểm hai chiều: ghim vào một phạm vi có đụng `lib/` → đỏ đích danh;
ghim vào phạm vi rỗng → đỏ vì "phép đo tự-khớp".

**Không dùng `verified_commit` làm neo:** sóng dogfood re-pin ghi đè nó sang
commit làn mới nhất mỗi đợt (hiện trỏ `ad46195`), nên nó không neo được bất kỳ
phạm vi lịch sử nào — đó là lý do phải khai hai mốc tường minh.

**Nợ kèm theo:** hồ sơ này `status: signed-off` và phép đo của nó vừa đổi, nên
evidence của nó cần chạy lại + ký lại theo luật per-file. Chi phí đã biết, trình
tại Cổng 1 của `crosslayer-uncoded` chứ không để lộ ở Cổng Bằng chứng.

## Coverage

Từ morphological-scan (4 trục — thước CE trong ngoặc):

- **D — dòng chảy required_evidence** (CE: 5 chặng judge→memo→report→màn
  quyết định→fix đếm từ kiến trúc S4 hiện hành): AC-1 (judge), AC-3
  (memo+carry), AC-4 (report), AC-5 (gate-card), AC-6 (round fix)
- **V — vắng/thiếu nổ to** (CE: bài học allowlist-RED + âm-tính-một-mình):
  AC-2 (judge bỏ trống), AC-9 (hồ sơ cũ không panel), AC-11 (artifact cũ)
- **G — gold/G3 dẫn xuất** (CE: corpus thật ≥7 override + ≥5 panel đếm
  trước khi viết eval): AC-8 (gold), AC-9 (G3), AC-10 (report), AC-13
  (tiếng người)
- **N — nghi thức người-máy** (CE: khuôn judgment sẵn có của personas +
  signoff): AC-7 (persona), AC-12 (executable), AC-14 (dogfood đếm được)

## Out of scope

- Máy tự gom bằng chứng giữa chừng panel (chỉ đóng vòng ở round fix).
- Persist gold set thành file/index mới — dẫn xuất từ artifact sẵn có.
- Semantic matching required_evidence ↔ evidence có sẵn.
- Đổi khuôn chữ ký người/human_override; đổi hook/evidence-core.

## Notes

Known limits — chấp nhận tại Cổng 2, Manh Phan 2026-08-05 (nhóm theo lớp):

- Hai phép đo phạm-vi-PR tự vô hiệu sau khi gộp nhánh (JR11a đóng băng
  lib/hooks so base; P150 so gate-card với bản base): đúng trong cửa sổ PR,
  vacuous trên main. Revisit: chuyển sang khuôn ghim-hành-vi khi dọn đợt nợ
  đo-lường.
- Nợ đo-lường trong bộ test mới (fixture P150 viết tay khuôn bên đọc; P149
  mutant chỉ ghim mã thoát; dấu-thiếu 3 bản không test round-trip liên-nhà;
  P154 mutant có lối thoát khi câu lặp; P152/P153 ngưỡng gắn corpus sống;
  P150 hardcode origin/main; JR1 assert hai-chuỗi-độc-lập) — đều fail-loud
  hoặc chưa mở lỗ; gom một đợt dọn.
- Hội đồng carried từ đời trước 1.33 không có danh sách bằng-chứng-thiếu và
  không cờ vàng trên thẻ — đúng chỗ cần khuôn cờ-vàng 1.13/1.14; revisit.
- Vặt: bản Codex của lệnh tổng kết chưa có bước Sổ vàng; --root sai in sổ
  rỗng tự tin; câu giải thích "chấm trước khi có ghi chép" gộp cả trường hợp
  khác; marker template có thể lọt vào report sinh; hai key phụ đi vòng
  allowlist trong gate-card.
- MỞ CONTRACT MỚI (đã chốt tại Cổng 2): "đo đầu-ra-sổ-vàng bằng máy" — gộp
  2 finding lens (render() không phép đo máy nào chạm; per-lens tuyên quét
  lớp nhưng điểm-case) + glossary CONTEXT.md cho biệt ngữ trong lời ký
  (known-limits/dogfood/single-source) để J13 có đường PASS sạch.
