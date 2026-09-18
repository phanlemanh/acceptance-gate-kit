# Hạt giống — marker descope chỉ có đầu viết (cửa sổ 2.16 → 2.17)

**Ngày:** 2026-09-18 · **Ổ:** `_acceptance/marker-descope-khong-co-bo-doc/opportunity.md` (`park`)
**Gốc:** đo trên `crm/_acceptance/truong-tu-tao-o-cai-dat` — hợp đồng `surfaces: [ui]`,
`status: implemented`, nghi thức S1-D chưa từng chạy, thẻ Cổng Phạm vi không nói một tiếng.
Owner đọc hai lối ở Cổng Đáng 18/09 và chọn **hoãn tới sau mốc**.

> Chữ trong tệp này là NGUỒN. Số đo đã chạy thật, lệnh tái lập ghi kèm — **đừng đo lại**,
> trừ khi nghi số đã cũ.

## Vật và lỗi

`feature-loop/skills/feature-loop/SKILL.md:89` tự xưng «không có đường bỏ im lặng» và bắt
entry descope mở đầu đúng chuỗi `"bỏ design-pass — "`. Chuỗi ấy chỉ tồn tại bên VIẾT.
`SKILL.md:93` khai thêm một *resume guard* (chạm UI + `status` ≥ `approved` + không có
`design-pass.md` → báo user) — cũng không có mã nào.

`scripts/gate-card.js` dựng khối design-pass ở ~466–545 **chỉ khi `design-pass.md` tồn tại**
(`dpText` đọc ở dòng 489). Không có nhánh nào cho ca vắng. Ba nghi thức anh em dùng đúng một
khuôn mà `design-pass` không có vế nào:

```js
if (applicable && !present) { descope ? flags.push(['finfo', …]) : flags.push(['fwarn', …]) }
```

- `gap-probe` — `lib/gap-probe.cjs descopeId()`; cờ ở `gate-card.js:716/717`
- `ui-observed` — `lib/lop-nhin-thay.cjs descopeId()`; cờ ở `gate-card.js:706/707`
- `đường-đo` — hằng nội tuyến `gate-card.js:595`; cờ ở `gate-card.js:702/703`
- `cảnh ngữ-cảnh` — hằng nội tuyến `gate-card.js:479`; dùng để DẬP một fwarn (dòng 532)
- **`design-pass` — không hằng, không bộ đọc, không cờ.**

## Số đo 18/09 — đã chạy, có đối chứng dương

**(a) Thẻ im ở CẢ HAI chiều.** Bản sao workspace CRM, đối chứng dương trước, rồi gỡ hẳn
entry descope `d-20260918T012859Z-7`:

```
ĐỐI CHỨNG DƯƠNG OK: bản sao == bản gốc
dòng sổ: 20 -> 19
diff nguyên vs bị-tiêm: 1 dòng (chính dòng ledger trong danh sách KHÔNG làm)
số cờ (class="flag"):  nguyên 2  |  bị-tiêm 2
```

Không phải «cờ yếu» — là **không có phép đo nào**.

**(b) Luật hở 36 % sau khi đã chốt.** 5 kho, 359 hồ sơ, 61 hợp đồng chạm mặt người nhìn
(vị từ `LNT.laMatNguoiNhin`), cắt theo mốc nghi thức 30/07:

| | chạy S1-D | có entry descope | **IM hoàn toàn** |
|---|---|---|---|
| duyệt trước 30/07 (đọc-cũ) | 0 | 0 | 25 |
| **duyệt từ 30/07 trở đi** | 3 | 18 | **12** |
| chưa có `approved_at` | 0 | 2 | 1 |

Mười hai ca IM sau khi luật đã chốt: `crm/bo-dung-chung-nhan-chuoi` · `crm/tieng-viet-cho-crm` ·
`oneflow/compose-overlay` · `artifact-platform/` × 9 (`deal-preview-link-reload`,
`ds-khung-pham-vi-ratchet`, `du-lieu-du-an-ve-shell`, `no1`…`no5`, `retire-deal-page-lifecycle`).

**(c) Đây là LỚP, không phải ca lẻ.** 7 họ marker descope đang dùng thực địa:

| họ marker | có bộ đọc? | lượt dùng | viết lệch dấu |
|---|---|---|---|
| `bỏ đặc-tả-UX — ` | **không** | 54 | 8 |
| `bỏ design-pass — ` | **không** | 42 | 4 |
| `bỏ coverage-scan — ` | **không** | 29 | 0 |
| `bỏ đường-đo — ` | có (`gate-card:595`) | 16 | 1 |
| `bỏ ui-observed — ` | có (`lib/`) | 6 | 0 |
| `bỏ gap-probe — ` | có (`lib/`) | 5 | 0 |
| `bỏ cảnh ngữ-cảnh — ` | có (`gate-card:479`) | 0 | — |

**(d) Trôi dấu là thật.** 4/42 entry `design-pass` viết KHÔNG DẤU, gồm chính ca CRM khơi ra
việc này (`"bo design-pass — trang moi khong sinh hinh thai moi…"`). Một răng so `startsWith`
chính xác sẽ trượt ngay ca đầu tiên nó sinh ra để bắt. **Chuẩn hoá dấu là ràng buộc thiết kế,
không phải chỗ tinh chỉnh sau.**

### Lệnh tái lập

```bash
node scripts/gate-card.js --slug <slug> --root <repo> --gate 1 --extract | node -e '…design_pass…'
grep -rn --fixed-strings 'bỏ design-pass — ' . --exclude-dir=.git --exclude-dir=_acceptance --exclude-dir=docs
```

Bộ đếm (c) và (b) dùng `lib/lop-nhin-thay.cjs` + chuẩn hoá NFD; script một lần, không lưu.

## Ba lối đã trình owner

**A — CỘNG (khuyến nghị của máy).** Hằng + bộ đọc **chuẩn-hoá-dấu** ở `lib/`, dùng lại
`laMatNguoiNhin()` đã có (không sinh vị từ thứ hai), cặp `finfo`/`fwarn` trên thẻ Cổng 1,
SKILL rút chuỗi từ lib qua round-trip thay cho P87 pin-văn-bản. Bảng hằng đặt theo HỌ để ba
họ còn lại sau này là một dòng — nhưng **chỉ đấu dây `design-pass`** ở vòng này (luật chiều
rộng). *Trace:* nguyên tố 2 (bằng chứng không tự dối). *Người hưởng:* người ký Cổng Phạm vi
và máy. *Là CỘNG → ADR 0018 đòi phê duyệt đích danh.*

**B — TRỪ.** Gỡ vế «không có đường bỏ im lặng» (:89) và resume guard (:93), đổi P87 sang
pin-mô-tả. Giá ~0. **Không thay được A** — xem cảnh báo ở ổ.

**C — ghi ô, hoãn.** ← owner chọn 18/09.

## Đề bài khi mở lại — bốn tiêu chí

### AC-1 (chiều NHẠY) — hợp đồng chạm UI, không `design-pass.md`, không entry descope → thẻ ĐỎ CỜ

**Given** một workspace `surfaces: [ui]` do **code sinh trong chính lần chạy** (không fixture
viết tay), không có `design-pass.md`, sổ quyết định không có entry `descope` nào khớp họ
`design-pass`
**When** render thẻ Cổng 1 bằng chính `scripts/gate-card.js`
**Then** thẻ mang đúng một cờ `fwarn` nói «hợp đồng chạm mặt người nhìn mà nghi thức S1-D
chưa chạy và không có dấu vết bỏ». Đối chứng dương bắt buộc: cùng workspace **có** entry
descope → cờ đổi thành `finfo` mang mã entry, KHÔNG còn `fwarn`. Mutant: gỡ vế đẩy cờ trong
bản sao TRỌN `scripts/` + `lib/` → ca phải ĐỎ và in đích danh mutant. Hỏng hạ tầng (dựng bản
sao lỗi, exit 127) trả **mã thoát RIÊNG**.

### AC-2 (chiều ĐẶC HIỆU — vế thiếu của mọi phép đo trước 14/09) — chạm thứ KHÔNG-phải-vật thì IM

**Given** (i) hợp đồng **không** khai `surfaces` chạm mặt người nhìn — dùng luôn `CONTRACT_FX`
của ca DP13 trong `tests/plugins/design-pass-nac.test.mjs`, nó không có dòng `surfaces:` nên
là chứng nhân sẵn có; (ii) một lượt chỉ chạm văn hồ sơ `_acceptance/`, tài liệu, bản thiết kế
**When** render thẻ / chạy phép đo mới
**Then** **IM** — không cờ nào của họ `design-pass`. DP13 hiện tại phải **vẫn xanh không sửa
một dòng**; phải sửa DP13 là dấu hiệu cờ mới đang rò ra ngoài phạm vi của nó.

### AC-3 (một nguồn writer↔reader, có chuẩn hoá dấu) — round-trip rút-từ-writer-đọc-bằng-reader

**Given** hằng tiền tố công bố ở `lib/` và bộ đọc cùng module
**When** ca rút chuỗi từ hằng ấy rồi (a) khẳng định `SKILL.md` chứa ĐÚNG NGUYÊN VĂN nó,
(b) đưa một dòng ledger viết **không dấu** qua bộ đọc
**Then** (a) khớp từng ký tự — lệch một chữ là ĐỎ (thay cho P87, vốn chỉ pin văn bản);
(b) bộ đọc vẫn nhận ra entry. Chiều im bắt buộc: một dòng descope **không** thuộc họ này phải
KHÔNG được nhận. Không có vế (b) thì răng mới fail-open ngay ca CRM đã đo.

### AC-4 (hồi quy) — ba họ đã có bộ đọc không đổi hành vi

**Given** cây sau nhát thêm
**When** chạy suite plugins + `design-pass-nac.test.mjs` (13 ca DP) + ca LNT
**Then** tất cả xanh, VÀ tiêm một kim vào bộ đọc mới trên **cây đang chấm** phải làm ít nhất
một ca ĐỎ có tên — không có vế sau thì «xanh hồi quy» không phân biệt được với «ca chưa bao
giờ chạy».

## Ngoài phạm vi

- Ba họ marker còn thiếu bộ đọc (`đặc-tả-UX` 54 lượt · `coverage-scan` 29 · biến thể lẻ) —
  bảng hằng theo họ làm chúng thành một dòng, nhưng **không đấu dây ở vòng này** (luật chiều rộng).
- Gom ba hằng nội tuyến trong `gate-card.js` về `lib/` — refactor, không phải răng.
- Chặn (fail-closed) khi thiếu design-pass — nghi thức là bỏ-được có dấu vết, cờ là đúng mức.
- 25 hồ sơ đọc-cũ duyệt trước 30/07 — cờ vàng, không chặn, không bắt migrate, đúng nếp kit.
- Dựng phép đo mới cho chính phép đo của vòng này — luật (a).
