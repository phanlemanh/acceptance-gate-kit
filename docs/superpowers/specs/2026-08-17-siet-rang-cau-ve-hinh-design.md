# Siết răng của phép đo câu-về-hình — trả bốn Known limits của hinh-tai-cong-1

> Trạng thái: **bản S1** (feature-loop, slug `siet-rang-cau-ve-hinh`, T2). Viết
> 17/08/2026, ngay sau khi PR #62 (`hinh-tai-cong-1`) merge. Chỉ đụng phép đo:
> `tests/plugins/run-tests.sh` (P90 + P197), một module dùng chung
> `tests/plugins/hfl_clause.py`, và `_acceptance/hinh-tai-cong-1/rang.sh`.
> KHÔNG đổi `SKILL.md`, KHÔNG đổi bản luật.

## 0. Vì sao

Cổng 2 của `hinh-tai-cong-1` ký với bốn Known limits — cả bốn cùng một lớp
«thước chưa gắn hết vào lời hứa» của phép đo câu-về-hình:

1. **P90 chỉ chắc MỘT bản chép còn khớp.** SKILL.md nay có hai bản chép
   `LOOP-PICTURE-CLAUSE` (GATE 1 + S2); `CLAUSE in file` xanh miễn một bản còn
   đúng. Sửa lệch riêng bản S2 → không phép đo nào đỏ. Vòng trước còn phải nới
   đột biến m3/m4 sang «thay mọi bản» để P90 khỏi tự đỏ đối chứng — dấu vết
   của phép đo yếu.
2. **`rang.sh` ghim danh sách 16/21 thông điệp chép tay** — bản sao thứ hai của
   bảng M trong P197; đổi bảng M thì răng lệch mà không ai đỏ.
3. **Chiều đỏ của các check quan-hệ cùng-đoạn (has_unit) chỉ là xoá chữ** — một
   phép đo trình-diện đơn thuần cũng đỏ y hệt; quan hệ «cùng đoạn» chưa từng
   được ép đỏ riêng. Đột biến «tách» của `bo_qua` thực chất đổi hoa-thường.
4. **Ma trận nhãn nở 1/5** (nguồn nở 4/4); `p90_check` trong P197 là bản chép
   tay logic P90 — P90 đổi thì đối chứng «P197 neo vào khối» thành stale mà
   không phép đo nào đỏ.

## 1. Trace về ba nguyên tố

Nguyên tố 2 — **bằng chứng không tự dối**, cho MÁY: bốn chỗ này là chỗ máy có
thể tin nhầm chính nó (xanh trong khi bản chép trôi / răng lệch bảng / quan hệ
chưa đo / nhãn chưa thử). Người hưởng: người ký các Cổng 2 sau — không phải đọc
lại code phép đo để biết «xanh» có nghĩa gì.

## 2. Thiết kế

### 2.1 Một hàm dùng chung, hai case cùng gọi — `tests/plugins/hfl_clause.py`

```python
def clause_copies(text, clause, anchor=None) -> (n_anchor, n_full)
    # anchor = 6 chữ đầu của clause; đếm mọi lần anchor xuất hiện và bao nhiêu
    # lần đó là clause NGUYÊN VĂN (sau khi gộp khoảng trắng)
def clause_copies_ok(text, clause) -> list[str]
    # [] khi n_anchor >= 1 và n_anchor == n_full;
    # ["cau ve hinh lech khuon mot-nguon (k/n ban chep)"] khi có bản chép lệch;
    # ["khong co ban chep nao"] khi n_anchor == 0
```

- **P90** thay `CLAUSE not in t` bằng `clause_copies_ok(t, CLAUSE)`; đột biến
  m3/m4 **trả về `count=1`** (sửa MỘT bản) và phải ĐỎ ghim
  `…: cau ve hinh lech khuon mot-nguon (1/2 ban chep)`; thêm đột biến «xoá hẳn
  một bản» → n_anchor giảm nhưng vẫn khớp → XANH (đúng: một bản còn khớp không
  phải lệch — vế «phải có ở GATE 1» do P197 canh). Ghi rõ đó là ranh giới.
- **P197** `p90_check = clause_copies_ok` — import cùng module, không chép.

Import từ heredoc: `sys.path.insert(0, str(root / "tests/plugins"))` rồi
`from hfl_clause import clause_copies_ok` — đường dẫn suy từ `$ROOT`, không
hardcode.

### 2.2 `rang.sh` rút danh sách từ P197 (một nguồn)

P197 in thêm mỗi thông điệp trong tập EXPECTED một dòng `P197-M: <msg>` TRƯỚC
khi chạy đột biến. `rang.sh`:
- đọc mọi dòng `P197-M:` → tập K (phải ≥ 21);
- với MỖI msg trong K, phải có dòng `DO dung (<msg>)`; thiếu → đỏ ghim tên;
- số `P197-MUT-n` ≥ |K| và khớp dòng tổng kết.
Không còn danh sách tay, không còn hằng 24/16.

### 2.3 P197 — chiều đỏ TÁCH đoạn giữ đủ chữ

Với mỗi check `has_unit` thêm một đột biến chèn `\n\n` **giữa** hai needle của
cùng đơn vị, không đổi một chữ nào:

| khoá | chèn dòng trống trước… |
|---|---|
| `dieu_kien` | `T3, hoặc T2 không đủ` (tách khỏi `dừng chờ người`) |
| `bo_qua` | `bỏ qua cả năm bước` (thay đột biến hoa-thường cũ) |
| `skill_vang` | `vẽ khối mermaid` |
| `nhin` | `Read bản` |
| `dung_lai` | `→ dùng lại, không vẽ lại` |

Mỗi đột biến phải ĐỎ đúng thông điệp của khoá; đối chứng: cùng đột biến qua
một hàm `presence_only(b)` (chỉ kiểm chữ có mặt) phải VẪN XANH — chứng minh
chiều đỏ này đo quan hệ, không đo trình diện. Sửa luôn `m_cond` nối lại bằng
`\n\n` (giữ cấu trúc đoạn).

### 2.4 P197 — ma trận nhãn nở đủ

`EXPECTED |= {M["nhan"].format(l) for l in LABELS}`; một lượt gỡ cho MỖI nhãn
(`[k] X` → `[k] Y`) → ĐỎ ghim `thieu nhan buoc [k] X`. Assert `not missing`
nay đỏ được khi thiếu bất kỳ nhãn nào.

## 3. Đổi ở đâu

| Người duyệt thấy gì khác | Đụng đâu | Phục vụ |
|---|---|---|
| Sửa lệch một bản chép câu-về-hình bất kỳ trong vòng lặp là suite đỏ, ghim k/n | `tests/plugins/hfl_clause.py` (mới) + P90 | AC-1, AC-2 |
| Răng của hồ sơ hinh-tai-cong-1 tự đọc bảng thông điệp từ P197, không còn danh sách tay | `_acceptance/hinh-tai-cong-1/rang.sh` + P197 in `P197-M:` | AC-3 |
| Phép đo «cùng đoạn» đã đỏ khi tách đoạn mà không mất chữ | P197 | AC-4 |
| Cả 5 nhãn bước đều từng đỏ; đối chứng P90 trong P197 là hàm dùng chung | P197 | AC-5, AC-6 |

## 4. Không làm

- Không đổi khối GATE 1 hay câu luật (một dòng cũng không) — đây là vòng siết
  phép đo, không phải vòng đổi vật.
- Không đưa `rang.sh` vào suite vĩnh viễn — vẫn nếp p194.
- Không dựng bộ đếm bản chép cho các marker khác (GOAL-TEMPLATE…) — ngoài đề.

## 5. Phép đo của chính vòng này

Một case suite mới **P198**: chạy `hfl_clause.clause_copies_ok` trên fixture
code-sinh (một file hai bản chép đúng → xanh; sửa một bản → đỏ ghim `1/2`; xoá
một bản → xanh; xoá cả hai → đỏ `khong co ban chep nao`); rồi kiểm P90 và P197
cùng import module đó (grep chuỗi `from hfl_clause import` trong cả hai khối,
không có bản chép logic `CLAUSE_P90 in`); `rang.sh` không còn dòng liệt kê tay
`for M in "…"` mà đọc `P197-M:`; đối chứng dương + đột biến ghim thông điệp.
