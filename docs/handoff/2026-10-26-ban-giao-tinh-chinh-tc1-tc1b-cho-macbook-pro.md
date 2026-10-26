# Bàn giao — tinh chỉnh sau đợt thử thứ hai (TC1, TC1b) cho máy MacBook Pro

**Ngày:** 2026-10-26 · **Từ:** máy M5, phiên «Nhận 10 lỗi kit từ đợt onehub-invest» (nhánh làm việc
`vong/trao-vai-va-do-sau-gop`) · **Lý do:** chủ kho 26/10, chuyển qua phiên giám sát onehub-invest: «Các hạng mục nào của
kit đang chạy dở thì sau hoàn tất thì dừng lại và chuyển qua cho macbook pro thực hiện.»

M5 đã dừng ở điểm tự nhiên: TC1 đã ký, TC1b dừng sau lượt chấm 2 (REJECT đã ghi sổ). TC2–TC5 CHƯA mở vòng.

## 1. PR đang mở — thứ tự gộp

| # | Nhánh | Nội dung | Trạng thái 26/10 cuối ngày |
|---|---|---|---|
| [#414](https://github.com/phanlemanh/acceptance-gate-kit/pull/414) | `docs/hat-giong-loi-onehub-invest` | Hạt giống mười lỗi, cắt lượt `tinh-chinh-2610` (TC1–TC5 vào mốc «Tinh chỉnh sau hai đợt thử» 05/11), năm ô + Cổng Đáng build, ghi chú này | Gộp được, lưới sạch, CI xanh lần đẩy trước. `main` đã dời sau lần gộp cuối — có thể xung đột lại ở tệp sinh |
| [#419](https://github.com/phanlemanh/acceptance-gate-kit/pull/419) | `vong/danh-thuc-doc-nhip-dung-ma` | TC1 — đánh thức và chẩn đoán đọc nhịp đúng mã phiên. Đã ký Cổng Bằng chứng (manh 26/10), ghim lại sau gộp `main` (#413) run_id `repin-20261026T084701Z-71465` | Gộp được, lưới sạch; nằm TRÊN #414 |
| (chưa mở PR) | `vong/trao-vai-va-do-sau-gop` | TC1b — trao vai đúng mã, lời dặn bước 5, TC1-06/TC1-09 thành phép so lịch sử | Cổng Phạm vi đã duyệt (manh); S4 lượt 2 REJECT (chập chờn); nằm TRÊN #419 |

Gộp: #414 → #419 → PR của TC1b. Bấm gộp là việc của chủ kho (khó đảo); kit `main` có khoá gộp ở issue #308.

**Bẫy khi gỡ xung đột** (đã vấp 26/10, ký ức máy `gop-xung-dot-so-chi-them-phai-hop-nhat`): chỉ `LO-TRINH.html` và
`PRODUCT-MAP.md` được lấy một phía rồi vẽ lại bằng `node scripts/product-map.mjs --root .`. Sổ chỉ-thêm —
`docs/research/known-limits-ledger.tsv`, `tests/scripts/fixtures/routing-baseline.txt` — phải hợp nhất hai phía
(`git merge-file -p --union`), rồi kiểm P179 và `LMCMS_ONLY=LM20 node tests/scripts/gate-card-lmcms.test.mjs`. Gộp `main`
mang mã vòng khác vào thì hồ sơ đã ký của nhánh hoá cũ → `repin-lane.mjs --write` trước khi báo gộp được.

## 2. Trạng thái từng lỗi (danh sách onehub-invest `.acceptance-runs/dieu-phoi-dot0-cam-mau/loi-kit-2-34-0.md`)

Hạt giống gốc: `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md` (số «mục» dưới đây là số của
hạt giống; số trong ngoặc là số của tệp onehub-invest).

| Mục | Lỗi | Hàng | Trạng thái | Cách né cho kho tiêu thụ |
|---|---|---|---|---|
| 1 (1) | Tệp sinh xung đột mỗi lần gộp | TC3 | Ô build, CHƯA mở vòng | `.gitattributes` merge=ours cho hai tệp + sinh lại sau gộp |
| 2 (4) | Đánh thức báo «giám sát không có nhịp sống» giả | TC1 | ĐÃ KÝ, PR #419 | Nhận lại vai bằng mã CLI; mở phiên giám sát mới sau khi nâng gói |
| 3 (5) | `xin s4` ghi slug hàng kế | TC2 | Ô build, CHƯA mở vòng | `xin s4 --slug <slug>` |
| 4 (6) | `cong_cu` đỏ oan trên đường tệp `.js` | TC5 | Ô build, CHƯA mở vòng | `ui_check: "${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js"` |
| 5 (2) | `hang` thiếu bỏ nghỉ / `uu_tien` | TC2 (chay-lai) · TC-C1 (uu-tien, CỘNG — chờ chủ kho phê) | CHƯA mở | Sửa tay trong khoá + dòng Nhật ký |
| 6 (3) | `hang them` suy slug sai | TC2 | CHƯA mở | Truyền slug thay mã |
| 7 (8) | Cài từ chợ lệch thẻ | TC4 | Ô build, CHƯA mở | `fetch --tags` rồi `--root <clone có thẻ>` |
| 8 (9) | Cây phụ không nâng | TC4 | Ô build, CHƯA mở | Chép tay bốn trường bản ghi |
| 9 (10) | Hook `chan-s4` chặn heredoc | TC-C2 chờ điều kiện (đếm 3/10) | Hạt giống DP6 | Ghi chú bằng Write |
| 10 (7) | Ghi chú nhận 2.34.0 ghi sai 2.9.0 | — | ĐÃ SỬA trong #414 | — |
| 11 (11) | Thẻ dừng-vá/trần lượt đếm lượt BLOCKED hạ tầng là «chưa đạt lặp lại» | — | **CHƯA VÀO SỔ** | — |
| TC1b | Năm mục «mở hợp đồng mới» của Cổng Bằng chứng TC1 | TC1b | Đang dở (mục 3 dưới) | — |

**Lỗi 11** (onehub-invest 26/10, vòng UI1 `ops-review-khung-hang-cho`): lượt 2 BLOCKED vì DB tắt (VM sập), mọi eval cần DB
«không đọc được». Khối «Lối ra» của thẻ Cổng Bằng chứng (khối `TRAN-LUOT-LOI-RA` của SKILL feature-loop) gộp lượt BLOCKED
ấy với lượt 1 REJECT thành «Lặp lại: E2/E6/E9/E10/E19 chưa đạt ở lượt 1, 2» và khuyên «thu phạm vi». Theo khối ĐỊNH VỊ
(K8) và luật S4 BLOCKED, lượt chặn vì hạ tầng không vào chuỗi lặp và không vào trần ba lượt. **Việc đầu tiên:** ghi hạt
giống (neo: hồ sơ onehub-invest `_acceptance/ops-review-khung-hang-cho/`), rồi cân cắt hàng vào mốc 05/11.

## 3. TC1b — làm tiếp từ đâu

Hồ sơ `_acceptance/trao-vai-va-do-sau-gop/` (status `implemented`, `approved_by: manh`). Vật và ca đã xong:
`dieu-phoi/scripts/dieu-phoi.mjs` (lệnh `vai`), `chan-doan.mjs` (nhánh mã CLI), `commands/tiep-tuc.md` bước 5,
`tests/dieu-phoi/trao-vai.test.mjs`, bộ đọc chung `tests/dieu-phoi/ca-doi-than.mjs`, TC1-06/TC1-08-do/TC1-09 trong
`danh-thuc-ma-phien.test.mjs`.

- Lượt 1: mọi eval xanh nhưng 6 finding trong hợp đồng (AC-5/AC-7 chiều đỏ chưa dựng được, sha vắng) → đã sửa (`1ea1bad8`).
- Lượt 2: REJECT vì lệnh suite chung `dieu_phoi_tc1b` thoát 1, đầu ra bị cắt nên không rõ ca; chạy lại ngay sau 582/0, E8
  (cùng suite, hai môi trường) xanh trong chính lượt → chập chờn. 2 mục ngoài hợp đồng (TC1b-05 chưa bỏ qua có tên khi
  `SHA_MOC` vắng — sửa một dòng `if (kq.boQua) return t.skip(kq.boQua)`), đề xuất known-limits.
- **Lượt 3 là lượt trần.** Trước khi chấm: chạy lệnh suite không qua grep để chắc 0 đỏ; nếu sửa mục ngoài hợp đồng thì
  đó là việc của người ở Cổng Bằng chứng, không sửa trong lượt.

```bash
B=$(git rev-parse origin/vong/danh-thuc-doc-nhip-dung-ma)
SHA2=$(python3 -c "import json;print([json.loads(l)['sha'] for l in open('_acceptance/trao-vai-va-do-sau-gop/run-log.jsonl') if json.loads(l).get('round')==2 and json.loads(l).get('sha')][-1])")
node feature-loop/scripts/s4-args.mjs --slug trao-vai-va-do-sau-gop --root . --ag-root . --diff-base $B --carry-anchor $SHA2 --out _acceptance/trao-vai-va-do-sau-gop/s4-args-r3.json
```

Rồi bọc args vào bản sao `feature-loop/workflows/acceptance-verify.js` (ký ức máy `boc-args-s4-bang-script`) và dispatch
Workflow; hoặc gọi `/feature-loop:feature-loop trao-vai-va-do-sau-gop` để resume ở S4. `--diff-base` là đỉnh TC1 để lượt
chấm chỉ soi phần TC1b; khi #419 đã gộp thì bỏ cờ này (merge-base với `main` là đúng).

## 4. Việc còn chờ chủ kho

1. Gộp #414 → #419 (→ PR TC1b khi có).
2. Cổng Bằng chứng TC1b sau lượt 3.
3. Phiên nghiệm thu TC1 (ô có ngưỡng 14 ngày): `/acceptance-gate:uat-session danh-thuc-doc-nhip-dung-ma` sau khi kho tiêu
   thụ chạy đợt trên bản có TC1.
4. TC-C1 (lệnh `hang uu-tien`, CỘNG) — phê hay không ở Cổng Phạm vi của TC2.

## 5. Việc máy kế (không cần hỏi)

1. Ghi hạt giống lỗi 11.
2. Lượt 3 TC1b (mục 3).
3. Mở vòng TC2 `lenh-dot-ghi-dung-hang` (Cổng Đáng build sẵn) SAU khi TC1b gộp — TC2 đổi ca ở `tests/dieu-phoi`.
   Lệnh: `/feature-loop:feature-loop TC2`.
4. TC3 (tệp sinh không chặn gộp) đáng làm sớm: mỗi PR kit trong hai ngày qua đều vấp đúng lỗi này.

## 6. Bẫy đã gặp trong phiên (để máy kia khỏi vấp lại)

- **Đường nền đỏ vì chính tệp của vòng:** viết hồ sơ trong lúc `duong-nen` chạy làm bản đồ lệch → `product_map`, KT-8,
  P122/P126 đỏ. Vẽ lại bản đồ trong commit S1 và chạy lại nền (hoặc chờ nền xong mới ghi hồ sơ).
- **P179 đánh trượt một lượt S4** khi mục «Đề xuất: known-limits» của chính hồ sơ chưa có hàng sổ (hạt giống 18/10, nay đủ
  ngưỡng) — thêm hàng sổ ngay khi `review-findings.md` có mục mới.
- **`LT-99-mau` chập chờn** (ENOTEMPTY khi dọn thư mục tạm) — đã thêm `maxRetries` trong #419.
- **`pr-san-sang` coi `LO-TRINH.html` vẽ lại khi sang `verified` là vật đổi** — lưới trước-gộp thì coi là T1; mở PR nháp
  tay rồi `gh pr ready`.
- **PyYAML mất khi Homebrew nâng python** (3.15) — `python3 -m pip install --user --break-system-packages pyyaml`.
