---
schema_version: 1
feature: Vật chép sang repo tiêu thụ phải chạy được ở repo tiêu thụ (.cjs + danh sách chép đủ bộ)
slug: consumer-copy-cjs
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: verified
approved_by: Phan Le Manh
approved_at: 2026-08-09
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: consumer-copy-cjs

## Context

Bộ cưỡng chế của kit được **chép** sang repo tiêu thụ (pre-merge-check.sh +
recheck-evidence + lib/), nhưng chưa lần nào được đo **ở phía chép sang**. GĐ2
ván 1 (mcp-cost-guard @ floorplanstudio, 2026-08-08) lộ hai lỗ cùng một lớp:
repo khai `"type": "module"` làm Node đọc file `.js` chép sang thành ESM, nên
`require()` bên trong `scripts/recheck-evidence.js` ném ReferenceError — tầng
re-check **chưa từng chạy nổi một lần nào kể từ commit khởi tạo**; và danh sách
chép của `acceptance-init` thiếu `lib/gap-probe.js` nên luật phản biện context
sạch in `GAP-PROBE: NOT ENFORCED` từ đầu. Cả hai câm lặng trong khi mọi suite
tự-host của kit vẫn xanh, vì kho kit **không có `package.json` gốc** nên `.js`
= CommonJS ở xưởng và = ESM ở repo tiêu thụ.

Đây là **bugfix** (hợp lệ dưới lệnh đóng băng lab, CLAUDE.md mục (a)): chỉ TRỪ
và vá, không cơ chế mới.

Source input: prompt (đề bài 1.39.1) · [tổng kết GĐ2 ván 1](../../docs/findings/2026-08-08-gd2-van-1-mcp-cost-guard-tong-ket.md) mục 3 · [sổ vấp](../../docs/research/so-vap-trien-khai.md) dòng 23–24

## Criteria

- AC-1: Given một repo tiêu thụ có `package.json` khai `"type": "module"`, When
  chép bộ cổng theo đúng chỉ dẫn `acceptance-init` rồi chạy
  `node scripts/recheck-evidence.cjs <evidence-report.md>` trên hồ sơ lành,
  Then lệnh thoát 0 và stderr KHÔNG chứa `ReferenceError`.
- AC-2: Given cùng repo đó, When chạy `pre-merge-check.sh . --base <ref>`,
  Then output không có dòng `NOT ENFORCED` nào, sổ luật in
  `rules ran=3 declared-off=0`, và không có dòng `not vendored` / `re-check
  unavailable` / `not lib/ac-line.cjs`.
- AC-3: Given hồ sơ bằng chứng bị tiêm `exit_code: 2` trong cùng repo tiêu thụ
  giả-lập đó, When chạy recheck, Then nó thoát 1 với thông điệp chứa `fails the
  evidence bar` — chứng minh tầng re-check đang CHẤM thật, không phải chết-mà-im.
- AC-4: Given đúng layout TRƯỚC bản vá (cùng nội dung file nhưng đuôi `.js`),
  When chạy trong repo `"type": "module"`, Then nó phải ĐỎ với thông điệp
  `ReferenceError` + `require is not defined` — chiều đỏ của phép đo, có đối
  chứng dương là chính bản `.cjs` cùng nội dung đã xanh ở AC-1/AC-2.
- AC-5: Given danh sách chép trong `commands/acceptance-init.md` (khối marker
  `INIT-CI-COPY-LIST`), When máy trích danh sách đó và đối chiếu với tập file
  `scripts/`+`lib/` mà `pre-merge-check.sh` và `recheck-evidence.cjs` thật sự
  dùng, Then tập-dùng ⊆ tập-khai; xoá một mục khỏi danh sách chép phải làm phép
  đo ĐỎ và ghim đúng tên file thiếu.
- AC-6: Given toàn bộ kho (trừ `plugins/` mirror và hồ sơ lịch sử
  `_acceptance/`+`docs/`), When grep 6 tên file đã đổi đuôi, Then 0 tham chiếu
  còn mang đuôi `.js`, và mọi `require()` giải được (0 đường dẫn không-đuôi).
- AC-7: Given `scripts/pre-merge-check.sh` có các đoạn `node -e '…require(…)'`
  nội tuyến (config_list, cross-layer teeth), When chúng chạy trong repo tiêu
  thụ ESM, Then chúng nạp đúng file `.cjs` — cùng chuẩn với AC-1, không đường
  nào còn require file `.js` phía consumer.
- AC-8: Given `scripts/recheck-evidence.cjs`, When lint đọc nó, Then 2 khối
  `catch (_) {}` (bind biến rồi bỏ trống) không còn — thay bằng optional catch
  binding kèm ghi chú lý do.
- AC-9: Given bản phát hành mang thay đổi này, When đọc 7 manifest gói (4 của
  acceptance-gate, 3 của feature-loop), Then số version ĐỔI THẬT so với 1.39.0 /
  1.27.0 (plugin update bỏ qua khi số trùng mà nội dung đổi) và ba manifest cùng
  một gói không lệch nhau.
- AC-10: Given mirror `plugins/`, When chạy `sync-plugin-packages.sh --check`,
  Then exit 0 — nguồn và mirror không trôi khỏi nhau sau đợt đổi tên.
- AC-11: Given 4 suite tự-host của kho, When chạy trọn, Then không suite nào đỏ
  vì đợt này (bao gồm DV5 additive-only: các dòng bị thay chỉ là tham chiếu
  TÊN file, không luật nào bị nới).

## Coverage

Trục quét (không dùng morphological-scan — không gian đã đóng và liệt kê được
bằng grep có sanity counter, xem entry `descope` trong decisions.jsonl):

- Trục **vật chép**: file nào rời kit sang repo tiêu thụ [thước CE: danh sách
  chép trong `acceptance-init.md` + tập file mà pre-merge/recheck thật sự
  `require` — AC-5 ghim QUAN HỆ giữa hai tập, không ghim danh sách cứng].
- Trục **`type` của repo tiêu thụ**: `module` (ca hỏng) vs vắng/`commonjs`
  (ca xưởng) [thước CE: ca consumer-sim code-sinh chạy ở `type: module`; cây
  kit tiếp tục là ca vắng `type`].
- Trục **lối nạp**: `require` trực tiếp trong file `.cjs` · `node -e` nội
  tuyến của pre-merge (AC-7) · `node <lib> classify` dạng CLI (gap-probe).
- Trục **kênh giao đến đội**: manifest version + mirror (AC-9, AC-10) — vật
  đúng mà số không đổi thì đội không nhận được.

## Out of scope

- **Không** thêm `package.json` vào kho kit để ép `type` — đó là cơ chế mới,
  và nó chỉ đổi mặc định ở xưởng chứ không cứu repo tiêu thụ nào.
- **Không** viết bộ chép tự động (script vendor) thay cho chỉ dẫn
  `acceptance-init` — cơ chế mới, ngoài lệnh đóng băng.
- **Không** chạm ba đề bài GĐ4 mà tổng kết ván 1 đã tách ra: cổng-tự-đỏ theo
  vật-của-vòng, rào subagent review khỏi cây thật, ngưỡng gọi-người theo tier.
- **Không** tự tái lập parity cho bản vá cục bộ của floorplanstudio
  (commit `766634b` tự đổi tên `.cjs`) — việc đó thuộc repo tiêu thụ, ghi nhắc
  trong báo cáo.
- **Không** đổi đuôi các file `scripts/*.js` KHÔNG chép sang consumer
  (`gate-card.js`, `evidence-page.js`, `eval-coverage-lint.js`,
  `design-scan.js`, `hooks/acceptance-evidence-gate.js`): chúng chạy trong
  cây kit / plugin cache, nơi không có `package.json` khai `type`.

## Notes

- Lớp lỗi đã ghi sổ trước đó ("đo ở phía consumer", memory) nay có xương thịt.
  Phép đo mới `tests/scripts/consumer-esm.test.mjs` là ca giả-lập consumer
  **code sinh trong chính lần chạy**, round-trip danh sách chép từ chỉ dẫn —
  không chép tay, đúng luật "thước phải gắn vào vật được giao" (CLAUDE.md).
- `hooks/acceptance-evidence-gate.js` giữ đuôi `.js` có chủ đích: nó chạy từ
  plugin cache qua harness, không nằm trong danh sách chép sang consumer.
  Nó `require` `lib/evidence-core.cjs` nên vẫn theo đợt đổi tên.
