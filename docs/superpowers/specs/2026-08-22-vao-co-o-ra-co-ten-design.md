# Thiết kế — «Vào có ô, ra có tên» (chip B)

**Đề bài:** `docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md` (Cổng Đáng gật 21/08,
dây A → B → C). **Hạng:** T2 — chạm `scripts/start-scan.mjs`, `commands/start.md`,
tests, 7 hạt giống kit + 7 stub `_acceptance/<slug>/opportunity.md`, `PRODUCT-MAP.md`.
Không chạm `lib/**`, không chạm lưới trước-merge, không chạm hook.

## Vấn đề

Ý tưởng khai thác xong nằm trong repo (file plan, ghi chú) nhưng **không có ô** nào
máy đọc → ba bộ đọc định kỳ (/start · bản đồ · lưới) không thấy → người quên →
rác. Lỗi cấu trúc, không phải lỗi người.

## Lời giải (chỉ TRỪ + nối vào ô đã có)

Ô đã có sẵn: `_acceptance/<slug>/opportunity.md` (khuôn `OPP-FRONTMATTER-TEMPLATE`),
máy quét đã xếp nó vào Cổng Đáng, bản đồ đã đếm nó ở «Đang cân nhắc cơ hội».
Thiếu ba thứ, mỗi thứ một mảnh nhỏ:

1. **Cửa vào** — `commands/start.md` lối (a) hiện trỏ «nghi thức grill» không
   tồn tại. Thay bằng khối marker `START-HIEU-KET` ≤ 15 dòng: kết thúc buổi khai
   thác (bất kể bằng skill nào) là **một stub** `opportunity.md` rút từ khuôn
   (`stage: discovery`, `decision` trống, file bắt đầu ở `---`, «Vấn đề & ai gặp»
   ≥ 1 câu, section Ngưỡng giữ `…`). Không spec, không contract ở bước này.
2. **Phân biệt cân-nhắc với chờ-ký** — bộ quét hiện xếp MỌI opportunity chưa
   quyết vào «Chờ chữ ký» (Cổng Đáng). Một ý chưa có ngưỡng thì chưa có gì để
   ký — cổng đó là trạm thu phí. Luật: section `## Ngưỡng chết / ngưỡng UAT` có
   **đủ các bullet của khuôn** (nhãn đọc từ chính khuôn lúc chạy, không chép tay)
   với giá trị không phải `…`/rỗng → `gates[] gate: dang` như cũ; thiếu một →
   `groups.considering[] {slug, name, since, ageDays}`. `since` = ngày commit
   đầu của file (git), không có git thì mtime; `ageDays` = số ngày nguyên.
3. **Thẻ nói ra** — khối marker `START-CAN-NHAC` trong start.md: một dòng
   «Đang cân nhắc: N ý · cũ nhất X ngày» + tối đa 3 tên cũ nhất, đặt sau «Đang
   dở», trước «Bắt đầu việc mới». Key mới khai vào `START-SCAN-KEYS` (P99
   round-trip).

**Lối ra** đã có tên: `decision: park | kill` (máy quét xếp `done`, bản đồ xếp
«xếp lại» / «đã bác»). Không thêm cơ chế.

**Kit tự áp** — 7 hạt giống chưa có hồ sơ (`hoi-theo-mat-phang`,
`ban-do-dinh-chu-ky`, `o-nuot-luat`, `ba-cho-tich-luy-khong-duong-ra`,
`duong-do-trong-dinh-nghia-xong`, `liet-ke-may-doc`, `t1-tuyen-kem-can-cu`) nhận
stub; `duong-do` là chip C đã gật → `stage: decided, decision: build`. Dòng
`Trạng thái:` viết tay trong 7 file hạt giống đổi thành con trỏ sang stub —
trạng thái sống ở MỘT chỗ. Luật lớp: **mọi `docs/plans/*hat-giong-*.md` phải có
ô** — hoặc `_acceptance/<slug>/` (slug rút từ tên file) hoặc được một
`contract.md` nêu tên. Bản đồ vẽ lại cùng commit.

## Phép đo (một file ca riêng `tests/plugins/vao-co-o.test.mjs`, chốt `PASS: [VCn]`)

- Fixture CODE-SINH từ khuôn (`fileFromTemplate(opportunity-template, 'OPP-FRONTMATTER-TEMPLATE')`
  + section Ngưỡng rút từ chính khuôn), chạy `start-scan.mjs` THẬT và
  `renderProductMap` THẬT; đường dẫn suy từ vị trí file test.
- Chiều đỏ cùng ca: bản sao script với khuôn bị gỡ một bullet → bộ quét đổi
  kết luận (chứng minh đọc khuôn lúc chạy); đổi tên heading trong bản sao khuôn
  → đỏ «khuôn không có section»; hạt giống không ô trong bản sao → đỏ nêu tên file.
- Quan hệ quét ↔ bản đồ: `can-nhac` của bản đồ == `considering` + `dang` (không
  contract) trên cùng fixture.

## Ngoài phạm vi

- Eval hành vi «agent có viết stub khi kết thúc khai thác không» — khai
  known-limit; đo bằng ván lái-thử kế tiếp, không dựng hội đồng.
- Nhắc-theo-tuổi (ý quá X ngày thì hỏi park/kill) — thẻ đã nói tuổi; quyết là
  của người.
- Ổ cắm `product-management:brainstorm` — phụ lục §9 của hạt giống, hồ sơ khác.
- Lưới trước-merge, hook, `lib/**`.
