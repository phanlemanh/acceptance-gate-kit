# Design: Khối "👉 VIỆC CỦA ANH" — thành phần cứng của khuôn trình-người (chip ② kit 2.1)

Ngày: 2026-08-10 · Slug: `khoi-viec-cua-anh` · Tier: T2 · Owner đã duyệt đề bài
(docs/findings/2026-08-10-reflect-lon-khep-gd2.md mục 9, nguyên văn "Làm Ⓐ; gửi;
mở; OK"). Đề bài gốc: docs/research/so-vap-trien-khai.md dòng 64 (hành vi owner
#8).

## Vấn đề

Lời-gọi-hành-động của máy với owner đôi khi không rõ: việc-cần-làm rải giữa
thân bài dài, câu tu từ lẫn câu hỏi thật, không nói trả-lời-dạng-gì → owner tốn
nhận thức để hiểu và đáp ứng đi tiếp (ví dụ thật: 6 quyết trả lời đủ mà dòng
tick park đầu thẻ bị sót). Luật đã phát cho phiên A bằng lời; chip ② biến nó
thành thành phần CỨNG máy-sinh — không sống trong trí nhớ phiên nữa.

## Chuẩn khối (từ đề bài, bất biến)

1. Mỗi mục đủ **3 vế**: làm-gì / ở-đâu / trả-lời-dạng-gì.
2. Kèm **câu mẫu trả-lời-gộp MỘT dòng** (gộp đủ mọi mục).
3. Tin **chỉ-báo** (không cần người làm) ghi rõ **"không cần làm gì"**.
4. **Cấm câu tu từ mang dấu hỏi** — mọi dấu hỏi trong tin phải thuộc một mục
   việc có dạng trả lời khai sẵn.

## Hai mặt thi công

### (a) Thẻ cổng — `scripts/gate-card.js`, MỌI mode đang có

Khối do **script render cứng** từ dữ liệu thẻ đã parse (cùng triết lý
gap-probe/out-of-contract: cái gì phải hiện thì script render, không thể quên).
KHÔNG mở key overlay mới — `CARD-PLAIN-KEYS` là danh sách đóng, P147 canh hai
chiều; chữ trong khối là máy-sinh thuần.

| Mode | Nội dung khối |
|---|---|
| Cổng 1 (draft/approved) | đúng MỘT mục: duyệt-hay-trả — làm gì: đọc SẼ làm / KHÔNG làm + cờ vàng; ở đâu: trả lời ngay trong phiên đang trình thẻ; trả lời dạng: «Duyệt» hoặc «Sửa: <điều cần đổi>» + dòng Trả lời mẫu |
| Cổng 2 ký được (PASS/PENDING-JUDGMENT) | liệt kê TỪNG việc máy đã đếm, đúng thứ tự thẻ: mỗi finding ngoài-hợp-đồng (nhãn Ngoài-n theo thứ tự) → a/b/c; mỗi judgment chưa override (mã eval) → Đạt/Chưa đạt; xác nhận cắt phạm vi (nếu có) → Đồng ý cắt/Kéo vào; phê từng quyết định treo (nếu có) → Phê/Không phê; chốt: Ký/Trả lại. Dòng Trả lời mẫu build động từ đúng các mã đang hiện |
| Cổng 2 KHÔNG ký được (REJECT/BLOCKED/verdict lạ) | `👉 VIỆC CỦA ANH: không cần làm gì —` + máy đang làm gì tiếp (REJECT: máy quay lại sửa rồi chấm vòng mới; BLOCKED: máy khắc phục môi trường rồi chạy lại; verdict lạ: máy phải chạy lại vòng chấm). Không mục nào đòi trả lời |

Vị trí: ngay TRƯỚC `.foot` (khối cuối cùng người đọc trước khi bấm). `--extract`
không đổi (extract phục vụ lớp dịch; khối này máy-sinh thuần, không dịch).

### (b) Khuôn lời-mời-cổng — single-source có marker

Khuôn sống MỘT chỗ: `skills/acceptance/references/human-facing-language.md`
(bản luật mà mọi bước trình-người đã buộc nạp trước khi viết), 2 khối marker:

- `YOUR-MOVE-BLOCK-TEMPLATE` — khuôn khối cho tin nhắn LLM viết (3 vế, mẫu
  gộp, luật chỉ-báo, luật cấm-dấu-hỏi).
- `GATE-INVITE-CLAUSE` — MỘT câu điều khoản, các bên chép NGUYÊN VĂN (pattern
  `LOOP-PICTURE-CLAUSE` — phép đo dương ở điểm nghẽn đầu ra, không blacklist).

Bốn bên chép câu điều khoản, khớp từng ký tự:

1. `feature-loop/skills/feature-loop/SKILL.md` — mục GATE 1 và GATE 2.
2. `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` — hai mục gate
   (tiền lệ: file này đã chép LOOP-PICTURE-CLAUSE tiếng Việt nguyên văn).
3. `skills/acceptance/SKILL.md` — các STOP Gate 1 part A/B và Gate 2.
4. `commands/acceptance-card.md` — bước present (điểm nghẽn chung: feature-loop
   và approve/signoff đều model-invoke acceptance-card, nên clause ở đây phủ cả
   đường đi qua 6 lệnh cổng người MÀ KHÔNG đụng chữ nào trong 6 lệnh đó).

## Phép đo (tests/plugins/run-tests.sh, case mới P185–P189)

Mọi case theo MEASURE-BIRTH-CLAUSE: cặp hai-chiều cùng fixture, thông điệp
ghim, xác-nhận-đột-biến in ra; mutant đi qua chính `gate-card.js` thật (bản sao
bị phá trong scratch, đường dẫn suy từ vị trí script).

- P185 — Cổng 1: fixture hồ sơ code-sinh, cả hai nhánh `draft` VÀ `approved`
  (gap-probe F2) → render thật → ghim `👉 VIỆC CỦA ANH` + đủ 3 vế + `Trả lời
  mẫu` MỘT dòng sau strip tag inline (F5) + quan hệ vị trí sau-thân-trước-nút
  (F4); mutant gỡ khối trong bản sao → đỏ ghim.
- P186 — Cổng 2 ký được: fixture đủ 4 loại việc-người → khối đủ từng mã, mẫu
  gộp một dòng nêu đủ mã; P186b (dòng PASS riêng — F1) fixture PASS-thuần-máy
  → khối vẫn có mục Ký (chống khối-rỗng-biến-mất) + mutant gỡ mục ký → đỏ;
  mutant gỡ nhánh liệt kê → đỏ ghim.
- P187 — Cổng 2 không ký được: fixture REJECT, BLOCKED và verdict lạ (F2) →
  `không cần làm gì`; đối chứng dương đổi-giá-trị: CÙNG fixture nâng verdict
  PASS → khối đổi sang mục Ký, chuỗi "không cần làm gì" biến mất.
- P188 — round-trip khuôn: rút `GATE-INVITE-CLAUSE` qua marker từ bản luật,
  so từng ký tự với 4 bản chép; đột biến bộ nhớ 1 ký tự một bản chép → phép so
  đỏ (in xác nhận đột biến).
- P189 — nội dung khuôn: `YOUR-MOVE-BLOCK-TEMPLATE` khai đủ 4 chuẩn (3 vế ·
  mẫu gộp một dòng · "không cần làm gì" · cấm câu tu từ mang dấu hỏi); mutant
  gỡ dòng chỉ-báo → đỏ ghim.

## Không làm (chốt từ đề bài)

- Không đụng 6 lệnh cổng người (ADR 0002; chip ③ lo một-lượt-gõ).
- Không mở card mode mới (Cổng 0/UAT là chip ⑦).
- Không key overlay mới trong card-plain.json.
- Không KPI số đo "owner trả lời nhanh hơn" trong chip này.
