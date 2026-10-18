# Bàn giao K-A (ho-so-da-ky-giu-tuoi) — M5 → MacBook Pro, 16/10/2026

Chủ kho quyết ≈13:58Z ngày 16/10: «Sửa kit chuyển sang máy macbook pro nhận». Phiên K-A trên máy M5 dừng ở đây.
Toàn bộ K-A từ nay do MacBook Pro làm.

```
MAY_GIAO:   M5 (phiên «K-A · Giữ bộ hồ sơ đã ký luôn tươi (kit)»)
MAY_NHAN:   MacBook Pro
PR:         #369 (bản nháp — KHÔNG gộp; khoá gộp ở #308)
NHANH:      vong/ho-so-da-ky-giu-tuoi
SHA_GOC:    bd821d8d (origin/main lúc cắt nhánh)
SHA_O:      d55ec7f9 (commit mở ô)
GIO_DUNG:   2026-10-16, sau 13:58Z
```

SHA cuối là commit chứa tệp này; xem `git log -1 origin/vong/ho-so-da-ky-giu-tuoi`.

## 1. Đã làm

- **K-E (bước 0, chỉ đọc):** kiểm đường đọc-cũ của DP11. Kết quả ở §2.
- **Mở ô K-A:**
  - Thêm hàng `K-A` vào `docs/plans/lo-trinh-kit.json`: hạng T3, `gio_may` [8, 12], gắn mốc «Tinh chỉnh sau hai đợt thử» 05/11.
  - Sinh ô bằng `node scripts/lo-trinh.mjs --root . --hang 'K-A' --mo-o --owner "$(git config user.email)"`. Lệnh này cũng ghi `du-bao.json`.
  - Máy điền thêm vào `_acceptance/ho-so-da-ky-giu-tuoi/opportunity.md`: dòng `Gốc:` riêng, số đo trước, bảng giả định sinh tử, ngưỡng [đề xuất], trọng số và chính sách, ứng viên criterion, Out of scope.
- **Kiểm:** `start-scan.mjs` xếp ô vào «chờ chữ ký — Cổng Đáng». Các suite lộ trình xanh: `lo-trinh` 300/300 · `moc-chien-dich` 28/28 · `ap-chinh-sach-lo-trinh` 59/59 · `kho-cam-ket-co-lo-trinh` 24/24. Riêng `lo-trinh-gio-may` 64/65: ca `GM-6-that` đọc bản ghi phiên thật của vòng RM6 trên máy M5, ca này không chạm diff.
- **Chưa chạy làn nặng nào:** không đường nền, không S4, không ghim lại.

## 2. Kết quả K-E — đường đọc-cũ DP11 (2.28 → 2.30/2.31)

**Kết luận:** kit 2.30/2.31 đọc đúng hồ sơ ký bằng 2.28 ở mọi chỗ có cổng. Lưới pre-merge không đọc định tuyến Ngoài-n
của hồ sơ đã ký; định tuyến chỉ được đọc ở làn V, ở `machine-cleared` và ở hồ sơ chưa ký. Đây không phải sai hợp
đồng K8, vì vật khớp đúng chữ hợp đồng DP11: «dòng cũ = round-tally có ts sau `at`». Vì vậy **không mở nhánh sửa**.
Lý do thêm: sửa `lib/out-of-contract.cjs` làm cũ 10 hồ sơ đã ký của kit (evals có `paths` trùng tệp này), tức một làn
ghim lại nặng, chỉ để đổi phần hiển thị của một hồ sơ đã đóng.

**Số đo:**

1. **Vi phân trên bộ hồ sơ thật.** Chạy `mucChuaDinhTuyen` của lib 2.28 và lib HEAD trên 567 hồ sơ có `review-findings.md`, ở 8 kho. Có **9 hồ sơ đổi kết quả**: crm 4, kit 5, sáu kho còn lại 0.
   - **7 đúng thiết kế DP11:** dòng chỉ số ghi THẬT trước một lượt chấm sau, đã có cờ vàng.
   - **2 ghi chú:**
     - **Lệch giả đọc-cũ — 1 hồ sơ crm đã đóng.** `at` của dòng sổ chỉ có ngày (nửa đêm +07:00), trong khi mã `d-<UTC>` cho thấy dòng ghi SAU lượt chấm cuối. `mocDong` lấy min(at, id), nên dòng bị đọc thành «ghi trước». Hậu quả: thẻ hiện mục là «chưa định tuyến». Không ảnh hưởng pre-merge.
     - **Lệch ở khuôn mới — 1 hồ sơ crm ký bằng 2.30.** Người ký rút gọn `tieu_de` nên hai dòng mồ côi (`so-lech-tieu-de`). Trên toàn bộ: 2/268 dòng có mã.
2. **Đếm dòng gate2 chỉ số bị đọc «cũ»** trên 2 464 dòng của 5 kho: 197 dòng cũ thật, **2** dòng cũ giả, cả hai thuộc cùng một hồ sơ.
3. **Fixture do code sinh từ khuôn của chính v2.28.0.** Gồm `OOC-ITEM-TEMPLATE` và `tallyLine` của `acceptance-verify.js`, cùng dòng gate2 của `signoff.md`. Đọc bằng lib 2.28 và lib HEAD, **5/6 ca đúng mong đợi**:
   - Đối chứng dương (ký sau lượt chấm, `at` đủ giờ): đúng.
   - Độ nhạy (ký trước một lượt sau → HEAD đỏ đủ 3 mục): đúng.
   - `at` +07:00: đúng. Ngày trần: đúng. Không có round-tally: đúng.
   - SAI: `at` nửa đêm kèm id sau lượt chấm. Ca này tái hiện đúng lệch giả ở trên.

**Ngưỡng mở việc (giới hạn đã khai):** mở ô sửa `mocDong` khi có ≥1 hồ sơ chưa ký / làn V / machine-cleared đổi phán quyết
vì `at` chỉ có ngày. Hướng sửa: `at` có giờ đúng 00:00:00 hoặc chỉ có ngày, mà id rơi trong cùng ngày đó, thì lấy giờ trong id.

**Lệnh chạy lại.** Bốn script nằm ở `docs/handoff/2026-10-16-k-e-do/`, không ghi gì vào kho nào. Chạy từ gốc kit:

```bash
D=docs/handoff/2026-10-16-k-e-do; mkdir -p "$TMPDIR/ke" && git show v2.28.0:lib/out-of-contract.cjs > "$TMPDIR/ke/ooc-228.cjs" && git show v2.28.0:feature-loop/workflows/acceptance-verify.js > "$TMPDIR/ke/av-228.js" && git show v2.28.0:commands/signoff.md > "$TMPDIR/ke/signoff-228.md"
```

```bash
node docs/handoff/2026-10-16-k-e-do/corpus.cjs "$PWD/lib/out-of-contract.cjs" "$TMPDIR/ke/ooc-228.cjs" ~/dev/crm-onehub ~/dev/acceptance-gate-kit ~/dev/oneflow
```

```bash
node docs/handoff/2026-10-16-k-e-do/classify.cjs "$PWD/lib/out-of-contract.cjs" ~/dev/crm-onehub ~/dev/acceptance-gate-kit ~/dev/oneflow
```

```bash
node docs/handoff/2026-10-16-k-e-do/mocoi.cjs "$PWD/lib/out-of-contract.cjs" ~/dev/crm-onehub ~/dev/acceptance-gate-kit
```

```bash
node docs/handoff/2026-10-16-k-e-do/fixture.cjs "$PWD/lib/out-of-contract.cjs" "$TMPDIR/ke/ooc-228.cjs" "$TMPDIR/ke/av-228.js" "$TMPDIR/ke/signoff-228.md"
```

Tên từng hồ sơ crm in ra ở máy nhận; tệp này không chép chúng vì kit là kho công khai.

## 3. Số đo trước của ô (quét pre-merge toàn phần, 16/10)

Số hồ sơ đã ký bị cũ:

| Kho | Cũ / đã ký | Phạm vi stale | Thời gian quét |
|---|---|---|---|
| crm (onehub 7ebcb024) | **257/280** | `paths` | 658 s |
| kit (main bd821d8d) | **148/168** | `all` | 91 s |
| oneflow (main) | **31/41** | `all` | 16 s |

Lệnh quét: chạy `pre-merge-check.sh` của kit, không `--base`, từ gốc mỗi kho. Đếm bằng
`grep -c 'evidence is stale'` trên đầu ra.

```bash
bash <gốc-kit>/scripts/pre-merge-check.sh > /tmp/pm.txt 2>&1; grep -c 'evidence is stale' /tmp/pm.txt
```

Ở kho phạm vi `all`, mọi thay đổi mã đều làm cũ, nên con số là trần trên. Lệnh giữ tươi phải chọn theo `paths` của
eval thì giá mới chấp nhận được (giả định 4 trong ô).

**Phát hiện khi mở ô:** finding nhắc `repin-lane.mjs --stale-all --base`, nhưng cờ này **không tồn tại**. Phần «chọn hồ
sơ cũ do các lần gộp trong khoảng» là vật mới, không phải công cụ có sẵn.

## 4. Trạng thái ô và bước kế

- Ô `_acceptance/ho-so-da-ky-giu-tuoi/opportunity.md`: `stage: discovery`, `decision` để trống, có dòng
  `Gốc: crm-onehub/_acceptance/okr-soat-anh-luot-3`.
- **Bước kế — Cổng Đáng, chủ kho ký ở phiên MacBook Pro.** Máy khuyên `build`. Lời mời một chạm: «đáng: build · ngưỡng: nhận».
  Phiên M5 KHÔNG mời ký.
- Sau khi ký: xin lượt làn nặng theo nếp của máy nhận, chạy đường nền, rồi S1 (T3).
- **CỘNG cần phê đích danh ở Cổng Phạm vi (ADR 0018):** lệnh mới, và lối khai mới trên eval đã ký. Luật hai vế 2.12.0 hiện cấm `not-run` trên eval đã ký còn mã thoát.
- **Ý thiết kế đã rút** (ghi trong ô, mục Trọng số): mảnh (a) lệnh giữ tươi là BÊN VIẾT của bằng chứng nền mà mảnh (b) nhãn trích, gồm `run_id`, lệnh đỏ và thông điệp trên đỉnh nhánh chính. Phải cắt thì giữ cặp viết–đọc này, cắt phần quy-về-PR trước.
- Out of scope (ghi trong ô): lịch đêm và vòng dọn tồn đọng của crm, CI trên đỉnh onehub, K-B/K-C/K-D, sửa `mocDong`.
