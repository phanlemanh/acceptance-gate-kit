---
schema_version: 1
slug: nen-khong-tinh-tep-cua-vong
feature: Đường nền không đổ đỏ cho tệp mà chính vòng viết trong lúc nền chạy — S1 soạn song song mà nền vẫn đọc đúng
owner: manh@mstar.vn
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

Gốc: crm-onehub/_acceptance/dai-luu-tru-dung-chung — duong-nen.md ở commit 83f854cbf (13/10 16:50Z) đỏ bảy dòng `CAY BAN SAU SUITE`, đều là tệp S1 của chính vòng; chạy lại trên cây đã commit (b230e8063) thì xanh

SKILL feature-loop S1#0 dặn chạy `feature-loop/scripts/duong-nen.mjs` ở NỀN rồi brainstorm song
song. Nhưng tệp S1 của vòng (contract, evals, decisions, design, gap-probe, khoá executor mới trong
`_acceptance/config.yaml`, bản mẫu design-pass) được ghi vào cây trong lúc nền chạy, và chân suite
so `git status` trước/sau nên gọi chúng là `nen suite: CAY BAN SAU SUITE <tệp>` — nền đỏ dù suite
và lưới thật xanh. Giá mỗi lần: commit rồi chạy lại trọn nền (~20′ ở crm) cộng một lượt máy nặng.

Ba ca trong hai ngày (báo gốc: crm-onehub#375, Mac Studio 13/10 16:51Z):

| Kho | Hồ sơ | Dòng đỏ giả | Chạy lại |
|---|---|---|---|
| crm-onehub | `lich-su-va-luu-tru-trang` (l3b, 13/10) | 5 `CAY BAN` — `_acceptance/<slug>/…` | chân suite xanh |
| crm-onehub | `dai-luu-tru-dung-chung` (V2e, 13/10) | 7 `CAY BAN` — `_acceptance/<slug>/…`, `config.yaml`, spec + plan mang slug | nền xanh |
| acceptance-gate-kit | `bang-ngoai-n-co-can-cu` (14/10, nhánh `vong/bang-ngoai-n-co-can-cu`) | 12 `CAY BAN` + 3 `DO SAN` (P122, P126, product_map đỏ vì hồ sơ mới chưa lên bản đồ — dòng sổ `d-20261014T002100Z-16`) | phiên tự đọc đỏ là của vòng |

**Người trả giá:** phiên thợ ở mọi kho chạy S1 (20′ chạy lại + một lượt nặng xin cấp ở máy chung),
và chính thẻ Cổng Phạm vi — khối «Nền hạ tầng» đỏ mà không phải hạ tầng thì đỏ mất nghĩa.

## Số đo trước khi đổi (14/10, tác tử chỉ đọc, 8 kho tiêu thụ trên máy M5)

**Chiều đỏ của dòng `CAY BAN SAU SUITE` trong lịch sử thật** — 284 phiên bản `duong-nen.md`, 255 hồ
sơ (kit 64, crm 191; sáu kho kia chưa từng chạy đường nền):

| Thước | Số |
|---|---|
| Hồ sơ từng có dòng `CAY BAN` | 43 (kit 14 · crm 29) |
| Dòng duy nhất | 233 |
| — đường mang slug của chính vòng | 193 |
| — `_acceptance/config.yaml` | 11 |
| — mã / tài liệu / bản mẫu phiên viết song song | 29 |
| **Đỏ thật (suite ghi rác vào cây)** | **0** |
| Hồ sơ đỏ CHỈ vì dòng này | 15 (kit 1 · crm 14) |
| Hồ sơ mà lọc «đường mang slug + config.yaml» gỡ hết dòng | 34 / 43 |

Chân lưới cùng cơ chế: VIOLATION nêu tên chính slug của vòng — 29 tổ hợp; nêu hồ sơ khác — 8.

**Hướng (a) như đã chọn — chạy nền trên worktree tạm ở HEAD, nối symlink `node_modules` (maxdepth 3)
+ `.env`/`.env.local` gốc như lane baseline S4 — vỡ 4/8 kho:**

| Kho | Kết luận | Căn cứ |
|---|---|---|
| acceptance-gate-kit | đủ | không node_modules; ca corpus thôi thấy hồ sơ nháp — chữa luôn 3 `DO SAN` ở gốc 3 |
| floorplanstudio · map · mapposter | đủ có điều kiện | map/mapposter: Playwright `reuseExistingServer` :5173 đo cây gốc nếu dev server đang chạy |
| crm-onehub | **vỡ** `build_khong_cache` | Turbopack từ chối node_modules symlink ra ngoài gốc (đo 08/10, `d-20261008T111555Z-6`) |
| artifact-platform | **vỡ** | `itest-supabase.ts` đọc `apps/web/.env.local` — symlink chỉ nối env ở gốc |
| media-library | **vỡ** | `apps/console/web/node_modules` ở tầng 4, ngoài maxdepth 3 |
| oneflow | **vỡ, hỏng cả cây gốc** | pnpm trong worktree symlink ghi đè `.modules.yaml` của gốc — owner đã TẮT `runBaseline` vì đúng lỗi này 28/08 |

Giới hạn chung kho nào cũng dính: gói workspace giải qua symlink về `packages/*` của CÂY GỐC — app
đo ở HEAD, gói đo ở cây làm việc.

Lượt nào từng xanh NHỜ thay đổi chưa commit có chủ đích: 1/283 (kit `ghim-lai-noi-ra-o-khong-do`
20/09) — và đó cũng là tệp S1 chưa commit; chạy ở HEAD thì cả hai lượt đều xanh. Không kho nào
dựa vào việc nền đo cây làm việc chưa commit.

## Câu để người quyết

Hướng (a) Điều phối M5 + Mac Studio chọn ngày 13/10 trước khi có số đo trên. Số đo đổi bài toán:
đổi MẶC ĐỊNH sang worktree là làm 4/8 kho trả giá (một kho hỏng cả cây gốc), trong khi thước
CLAUDE.md «sửa vì sự cố một kho phải cân trên mọi kho» xếp thứ tự: đúng tầng → bộ đọc khoan dung +
cờ vàng → bật thêm theo lựa chọn → đổi mặc định.

| Lối | Làm gì | Ba gốc | Kho vỡ | Giá |
|---|---|---|---|---|
| **A (máy + Điều phối M5 khuyên)** | Mặc định, mọi kho: dòng `CAY BAN` mang đường chứa slug của vòng hoặc `_acceptance/config.yaml`, và VIOLATION nêu `[<slug>]`, thành **dòng vàng có tên** «tệp của vòng — nền không tính», không lật `nen` sang đỏ. Không thêm khoá cấu hình nào. | 2/3 trọn (hai ca crm); kit: 12/15 dòng — 3 `DO SAN` corpus còn đỏ | 0 | một vòng T2, không CỘNG |
| A2 | A + khoá bật-theo-lựa-chọn `feature_loop.duong_nen_cay: head` → chân suite + lưới chạy trên worktree tạm ở HEAD (tái dùng cách dựng baseline S4); kit bật | 3/3 | 0 | khoá mới là CỘNG — cần phê đích danh; vòng lớn hơn |
| B | Hướng (a) nguyên bản: đổi mặc định sang worktree, dựng `node_modules` thật (clonefile APFS) + nối mọi `.env*` mọi tầng để không vỡ | 3/3 | chưa đo được 0 — oneflow phải đo lại | vòng lớn hơn, cách dựng mới chưa từng chạy ở kho nào |
| C | Chỉ khoá worktree bật-theo-lựa-chọn, không lọc | 1/3 — crm không bật được (Turbopack) | 0 | rẻ nhất, không chữa kho báo lỗi |

Vì sao khoá tách khỏi A: CỘNG cần phê riêng và kit giữ đơn giản; phần lọc tự nó trả 204/233 dòng.
3 `DO SAN` corpus của kit và 29 dòng mã/bản mẫu viết song song đi vào hạt giống
`docs/plans/2026-10-14-hat-giong-nen-tren-worktree-head.md` (Gốc: hồ sơ này) — mở khi chúng gây
đỏ giả có giá ở một vòng sau khi A lên `main`.

Vì sao A không phải «nới phép cây bẩn» (lối (b) đã bác): suite không biết slug của vòng — slug chỉ
sinh ở S0 — nên một suite không thể ghi vào đường mang slug ấy; lọc đường đó không mất chiều đỏ nào.
Dòng vẫn hiện, có tên, trên thẻ — chỉ không lật màu. `config.yaml` là chỗ duy nhất A thật sự đánh
đổi: một suite ghi vào `config.yaml` sẽ hiện vàng thay vì đỏ (0 ca trong 233 dòng lịch sử).
29 dòng còn lại (mã, bản mẫu design-pass do phiên viết song song) vẫn đỏ ở mặc định — kho nào gặp
nhiều thì bật khoá.

## Ngưỡng chết / ngưỡng UAT

Không đo được — việc nội bộ của bộ công cụ, không có người dùng cuối; reality đọc qua số dòng
`CAY BAN` đỏ giả ở các vòng S1 kế tiếp của kit và crm.

## Thước đo thành công → ứng viên criterion

- Kho mẫu: suite lành, phiên ghi `_acceptance/<slug>/contract.md` + spec mang slug + `config.yaml`
  trong lúc chân suite chạy → `nen: xanh`, ba dòng vàng có tên (đối chứng: cùng kho, suite ghi
  `README.md` → vẫn đỏ, thông điệp ghim `CAY BAN SAU SUITE README.md`).
- Kho mẫu: VIOLATION lưới nêu `[<slug>]` của chính vòng → vàng có tên; VIOLATION nêu hồ sơ khác → vẫn đỏ.
- Kho không khai khoá: hành vi chân suite y như 2.30.0 trừ đúng các dòng mang slug.

## Out of scope từ khám phá

- Đổi mặc định sang worktree cho mọi kho (lối B) — vỡ 4/8 kho theo số đo 14/10; mở lại khi có cách
  dựng `node_modules` thật đã đo trên oneflow.
- Lọc 29 dòng mã/bản mẫu phiên viết song song ở mặc định — đường không mang slug thì không phân biệt
  được với rác suite; vào hạt giống worktree-HEAD.
- Khoá bật-theo-lựa-chọn chạy nền trên worktree ở HEAD (lối A2) — CỘNG, tách ra hạt giống; chữa 3
  `DO SAN` corpus của kit.
- Dặn phiên «đừng ghi tệp S1 trong lúc nền chạy» (lối c) — dặn-bằng-lời không phải nghiệm.
- Lai cây của gói workspace qua symlink (cũng có ở baseline S4) — khai giới hạn, không sửa ở vòng này.
