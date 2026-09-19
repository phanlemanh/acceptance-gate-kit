# Thiết kế — Hồ sơ nghỉ: một sự thật «nghỉ» có sử liệu, ba bộ đọc một hàm (2026-09-19)

Hồ sơ: `_acceptance/ho-so-nghi/` · hạng T3 (chạm `scripts/pre-merge-check.sh`, `lib/**`).
Gốc: `OneFlow/_acceptance/normalize-text-vi` (owner 17/09) · kit `release-2-16-0` (14/72 đỏ) ·
kit `bo-qua-phai-thay-dinh-nghia-phep-do` (nghỉ bằng thư mục sử liệu).

## 1. Bài toán, nói bằng một câu

Luật làn eval của kit đúng khi nói «pin chưa chứng là nợ ở mọi lượt chạy», nhưng nó không có
lối ra cho món nợ không bao giờ trả được — tiền đề ngoài chết, hoặc vật đã cố ý đổi sau chữ
ký. Kết quả: OneFlow bỏ qua có ghi nhận mỗi PR; kit ghim lại 0/72; kit tự nghỉ hồ sơ bằng
cách giấu hợp đồng vào thư mục con, và cổng mù chỉ vì đường dẫn.

## 2. Ba đường đã cân, chọn đường B

| | A — `status: retired` trong hợp đồng | **B — dòng sổ «nghỉ», hợp đồng bất biến, một hàm** | C — công nhận thư mục `su-lieu/` làm nghi thức |
|---|---|---|---|
| Chữ ký là sử liệu | Sửa tệp đã ký, sáu bộ đọc enum đổi | **Không chạm một byte hợp đồng/báo cáo** | Không chạm, nhưng di chuyển tệp |
| Kho chạy bản cũ | Status lạ → «hồ sơ hỏng», cổng cũ chặn | **Dòng sổ trơ với bộ đọc cũ: không vỡ gì** | Đã chạy được hôm nay |
| Cổng đọc được | Có | Có, qua node như luật làn eval | **Không — mù vì đường dẫn, fail-open** |
| Chọn | ✗ | **✓** | ✗ (chỉ giữ làm đường đọc-cũ) |

## 3. Sự thật «nghỉ» — vật máy giữ

Một dòng trong `_acceptance/<slug>/decisions.jsonl`, viết bằng đúng công thức sổ quyết định
(`DEC-ID-RECIPE`), tối thiểu:

<!-- <<<NGHI-LINE-TEMPLATE -->
```
{"id":"d-<UTC>-<n>","type":"nghi","stage":"gate2","at":"<ISO>","by":"<tên người>","decision":"<lý do một câu>","impact":"<hồ sơ thôi hứa gì>"}
```
<!-- NGHI-LINE-TEMPLATE>>> -->

Hợp lệ ⟺ `type === "nghi"` ∧ `by` không rỗng ∧ `decision` không rỗng ∧ `at` parse được. Người
viết là người (cùng tầng tin cậy với `decided_by` của ô cơ hội và `human_signoff`; kit không
dựng khoá model-invocation mới ở vòng này — Later). Dòng sau có `supersedes: <id dòng nghỉ>` thì
nghỉ hết hiệu lực (mở lại) — hàm nhận, AC-10 đo.

**Bên viết là GUIDE.** Khối lệnh «cho một hồ sơ nghỉ» sống trong `GUIDE.md` giữa marker
`NGHI-LINE-RECIPE` (khuôn trên chỉ là chiếu); ca đo HSN1/HSN6 rút khối ấy bằng marker và CHẠY nó
để sinh dòng — bên viết và bên đọc không được trôi khỏi nhau.

## 4. Một hàm, ba bộ đọc

`lib/workspace-record.cjs` thêm `hoSoNghi(texts)` — nhận bộ văn bản của hồ sơ như mọi hàm cùng
tệp (`navValues`, `missingArtifact`), trả:

```
null                                        — không nghỉ
{ kieu: 'dong-so', by, at, ly_do, id }      — dòng sổ hợp lệ
{ kieu: 'dong-so-thieu', thieu: ['by'|'decision'|'at'] } — có dòng type nghi nhưng thiếu vế → KHÔNG tính là nghỉ
{ kieu: 'su-lieu-cu' }                      — không có contract.md ở gốc nhưng có su-lieu/contract.md (đường đọc-cũ)
```

Văn xuôi (một dòng `descope` nói «nghỉ hẳn») **không** là nghỉ — đặc hiệu, ca đo riêng.

| Bộ đọc | Hỏi hàm ở đâu | Khi nghỉ hợp lệ | Khi dòng thiếu vế | Khi lib vắng |
|---|---|---|---|---|
| Cổng `pre-merge-check.sh` | ngay sau đọc `status`/`risk_tier`, trước mọi luật arm | `NOTE [slug]: hồ sơ nghỉ — <by> <at>: <lý do>; bỏ luật cũ hoá · làn ghim lại · làn eval; chữ ký giữ làm sử liệu` rồi `continue` | `NOTE [slug]: dòng nghỉ thiếu <vế> — chấm như hồ sơ đang sống` rồi chấm như cũ | `NOTE [slug]: luật nghỉ NOT ENFORCED — node/lib vắng` rồi chấm như cũ |
| `recheck-evidence.cjs` | đầu vòng mỗi slug | in `NOTE … nghỉ`, bỏ kiểm | kiểm như cũ | (chính nó là lib) |
| `start-scan.mjs` | trước nhánh `status` | đã thông Cổng 2 → trạng thái mới `da-nghi` (ô `da-ship`); chưa thông → `da-dong-ho-so` (ô `da-bac`); cờ `nghi-kieu-cu` khi `su-lieu-cu` | cờ `nghi-thieu-ve`, ô như đang sống | — |
| `gate-card.js` | CHỈ qua bộ quét (trạng thái `da-nghi` mang by/at/lý do trong JSON; cờ `nghi-thieu-ve`) | dòng «đã nghỉ … chữ ký giữ làm sử liệu», không mời ký | cờ vàng nêu vế thiếu | — |

`scripts/trang-thai-ho-so.cjs`: thêm `da-nghi` — nhãn «đã giao — đã nghỉ, giữ sử liệu», việc kế
«không ai — đã quyết cho nghỉ, chữ ký giữ làm sử liệu» — `BUCKET_OF['da-nghi'] = 'da-ship'`.
Không thêm khối mới cho bản đồ (bộ kiểm bản đồ của kho tiêu thụ đếm khối cố định).

## 5. Đường đọc-cũ (luật kit từ 2.13.0)

- Hồ sơ chưa có dòng nghỉ: mọi bộ đọc như hôm nay. Không migrate.
- Kiểu thư mục `su-lieu/` (kit 17/09): bộ quét + thẻ cờ vàng `nghi-kieu-cu`; cổng vốn không
  thấy hợp đồng ở gốc nên không đổi hành vi; GUIDE khuyên thêm dòng nghỉ, không bắt.
- Kho tiêu thụ chưa nhận 2.17.0: dòng nghỉ là một dòng JSON trong sổ, bộ đọc cũ bỏ qua.

## 6. Cái gì KHÔNG đổi (bất biến để đo)

- `contract.md`, `evidence-report.md`, `run-log.jsonl` của hồ sơ nghỉ: 0 byte đổi (vi phân).
- Luật làn eval, luật cũ hoá cho hồ sơ KHÔNG nghỉ: nguyên văn — ca đối chứng dương giữ đỏ.
- Cổng không đọc `opportunity.md`.

## 7. Thước và chiều đỏ (giấy khai sinh)

Một tệp ca `tests/scripts/ho-so-nghi.test.mjs` (nối vào `run-tests.sh`), fixture kho do code
sinh (`git init`, hợp đồng signed-off, báo cáo có `verified_commit`, run-log có làn suite-only
thiếu `evals_exit` → đây là ca OneFlow thật thu nhỏ). Mỗi ca đổi đúng một biến:

| Ca | Biến | Kết luận phải |
|---|---|---|
| HSN0 | không nghỉ — ba fixture con (a) cũ hoá · (b) làn không khớp · (c) thiếu evals_exit | mỗi kho cổng VIOLATION ghim đúng chuỗi luật nó kích (3/3 so bằng nhau); bản đồ `da-giao` |
| HSN1 | + dòng nghỉ sinh bằng khối lệnh GUIDE (rút marker, chạy) | ba kho cổng clean, NOTE ghim `hồ sơ nghỉ`; recheck NOTE; bản đồ `da-nghi`; thẻ dòng nghỉ, không mời ký |
| HSN2 | dòng nghỉ thiếu `by` / thiếu `decision` / `at` hỏng (ba biến) | ma trận 3×3 so bằng nhau: cổng VIOLATION + NOTE `thiếu <vế>`; bộ quét `da-giao` cờ `nghi-thieu-ve:<vế>`; thẻ cờ vàng + mời ký |
| HSN3 | dòng `descope` văn xuôi nói «nghỉ hẳn» | y như HSN0(c), bộ quét 0 cờ (đặc hiệu, không cờ vàng) |
| HSN4 | thư mục `su-lieu/` kiểu cũ | bộ quét `da-dong-ho-so` + cờ `nghi-kieu-cu`; cổng không đỏ |
| HSN5 | nghỉ trên hợp đồng `approved` (chưa thông) | bản đồ `da-dong-ho-so`, ô `da-bac`; cổng không đỏ |
| HSN6 | vi phân byte trước/sau công thức ghi dòng nghỉ | hợp đồng · báo cáo · run-log: băm bằng nhau |
| HSN7 | mutant: `hoSoNghi` trả `null` trong bản sao lib | HSN1 lật ở CẢ cổng, recheck, bộ quét, thẻ — một hàm bốn bộ đọc |
| HSN10 | dòng nghỉ + dòng `supersedes` trỏ đúng id | bốn bộ đọc y HSN0(c); trỏ id khác → vẫn nghỉ |
| HSN8 | cổng chạy với lib vắng | NOTE `NOT ENFORCED` + VIOLATION như HSN0 (fail-closed) |
| HSN9 | cây thật của kit: `bo-qua-phai-thay-dinh-nghia-phep-do` | bộ quét cờ `nghi-kieu-cu`; `product-map --check` khớp |

Ma trận so BẰNG NHAU với danh sách viết trước; mỗi mũi tiêm `assert` đổi được tệp.

## 8. Ranh giới kit ↔ kho

Kit giao: hàm, ba bộ đọc, trạng thái, khuôn dòng, một mục GUIDE «cho một hồ sơ nghỉ». Kho làm:
viết dòng nghỉ (người), nhận 2.17.0. Không có gì kho thứ hai phải chép lại.

## 9. Ngoài phạm vi (giữ nguyên ở hợp đồng)

Lệnh `/acceptance-gate:nghi` có khoá model-invocation · chiến dịch nghỉ 14 hồ sơ của kit ·
gắn luật làn với diff · `repin-lane --plan` · cờ vàng cho kiểu descope văn xuôi (không làm: văn
xuôi không phải sự thật, kho viết thêm một dòng).
