# Bàn giao cửa sổ 2.14 — từ vòng `chu-ky-khong-tu-lam-hoa-cu`

**Ngày:** 2026-09-15 · **Người viết:** phiên đã ship PR #176 (merge `155e096b`).
**Người đọc:** phiên đang dựng hồ sơ mốc `release-2-14-0`.

Viết vì hai phiên chạy song song, và phần dưới đây là thứ tôi biết mà hồ sơ mốc
không có trong ngữ cảnh. Chữ ở đây là NGUỒN — đừng để nó nằm lại trong log chat.

---

## 1. Chiến dịch ghim lại — việc của MỐC, số đã đo sẵn

`origin/main` tại `155e096b`: **69 hồ sơ** có `verified_commit` đã hoá cũ, trải trên
**43 mốc ghim** khác nhau. Một mốc duy nhất (`7d12ffad`, 08/09) gánh **21 hồ sơ**.

CLAUDE.md §re-pin: re-pin chạy **một chiến dịch mỗi bản phát hành**. Chiến dịch này
thuộc mốc 2.14, nên nó là việc của phiên mốc — tôi cố ý KHÔNG chạy, để hai phiên
không cùng ghi vào 69 × 2 tệp.

### Tiền kiểm đã chạy (15/09, trên `155e096b`) — hạ tầng sạch

- **0** hồ sơ thiếu `evals.yaml`.
- **0** eval trỏ khoá `config:executors.*` không giải được.

Tức chiến dịch sẽ không chết vì hạ tầng như đợt `mirror_sync` hồi 08/09 (ADR 0015).
Thứ còn có thể đỏ là **vật thật**: hồ sơ ghim ở mốc rất cũ có thể đã mất tiền đề.

### Luật khi đỏ — đừng ký mù

Làn chỉ ghi khi **mọi** suite và **mọi** eval máy của TỪNG hồ sơ xanh. Một eval đỏ →
script exit 1 và **không ghi gì cho hồ sơ nào**. Khi đó: tách hồ sơ đỏ ra khỏi lượt,
ghi nó thành một vấp riêng, chạy lại làn MỚI (run_id mới) cho phần còn lại. Không
nới cờ, không hạ ngưỡng.

### Bước đầu: ĐO, không ghi

Bỏ `--write` ở lệnh dưới để đếm bao nhiêu hồ sơ đỏ trước khi quyết ghim. Đây đúng
bước mà hồ sơ cơ hội `ba-cho-cat-sau-chu-ky-cua-so-2-13` đã khai.

### Lệnh sẵn — nghi thức «1 lượt lane, N chữ ký»

Suite chạy MỘT lần chung cho cả 69 hồ sơ (dedupe lệnh); mỗi hồ sơ chỉ thêm eval
riêng của nó. `$FL` = gốc gói feature-loop; kho tự host kit thêm `--ag-root .`.
Danh sách slug lấy từ lưới, không gõ tay — sinh lại bằng:

```bash
bash scripts/pre-merge-check.sh . 2>&1 | grep "evidence is stale" \
  | sed 's/VIOLATION \[//; s/\]:.*//' | sort
```

rồi nối mỗi dòng thành một `--slug`. Ước phí: một lượt suite (~13 phút) + eval của
69 hồ sơ; chạy **nền** ngay từ đầu, đừng foreground (trần Bash 600 s).

### ⚠ `--skip-unchanged` KHÔNG giúp chiến dịch này

Cờ mới của vòng vừa ship loại trừ `--write` (usage exit 3) — bỏ qua không bao giờ
được phép trở thành một pin. Cái giúp chiến dịch là nghi thức gom nhiều `--slug` ở
trên. Điều kiện tiên quyết mà hạt giống 2.13 nêu (re-pin theo diff, chọn suite theo
`paths`) vẫn **chưa có**: tôi đã loại nó khỏi phạm vi vòng trước, có tên trong
Out of scope của `chu-ky-khong-tu-lam-hoa-cu`.

### Phân bố theo mốc ghim

| mốc ghim | số hồ sơ |
|---|--:|
| `7d12ffad` (08/09) | **21** |
| `80966954` · `d5ba4e71` · `ffe138ac` | 3 mỗi mốc |
| 39 mốc còn lại | 1 mỗi mốc |

Danh sách đầy đủ theo từng mốc: chạy lệnh sinh ở trên rồi nhóm theo
`verified_commit` của từng `evidence-report.md` — đừng chép tay, con số đổi mỗi lần
`main` tiến.

---

## 2. Hồ sơ đã mở, chờ vòng ở cửa sổ này

`_acceptance/bo-qua-phai-thay-dinh-nghia-phep-do/` — `status: draft`, T2, 3 AC · 5 eval
khai sẵn cả chiều đỏ lẫn chiều im. Owner định đoạt «mở hợp đồng mới» tại Cổng Bằng
chứng 15/09.

**Lỗ:** vị từ `--skip-unchanged` loại trừ MỌI đường dẫn có phân đoạn `_acceptance`,
nhưng `_acceptance/config.yaml` và `_acceptance/<slug>/evals.yaml` **là nguồn định
nghĩa lệnh mà làn sẽ chạy**. Sửa một executor sau verify → cây «bằng pin» → làn bỏ
qua → lệnh MỚI không bao giờ chạy trước chữ ký, mà bằng chứng đã ghim vẫn mang mã
thoát của lệnh CŨ.

**Gốc:** `stale_files` hỏi «bằng chứng có hoá cũ không» — với câu đó, vật hồ sơ đúng
là nên loại trừ. Vòng trước tái dùng nguyên vị từ ấy cho một câu KHÁC: «có cần chạy
lại phép đo không». Với câu thứ hai, hai tệp đó là ĐẦU VÀO. Một vị từ, hai câu hỏi.

---

## 3. Nợ thước của vòng vừa ship — 11 Known limits

Ghi đủ trong `_acceptance/chu-ky-khong-tu-lam-hoa-cu/contract.md` §Known limits và
`docs/research/known-limits-ledger.tsv` (11 dòng `chu-ky-khong-tu-lam-hoa-cu#1..11`;
dòng `#10` đã `chet`, đóng bởi ca RB5). Phần lớn CÙNG MỘT LỚP — «thước không sống» —
và nằm trong bộ răng của chính vòng, không nằm trong hai nhát cắt:

- `RB2c` là đột biến NO-OP (chuỗi sửa-tay không có trong dòng thật).
- `E7` khai chiều đỏ không tồn tại (`executors.test.scripts` là lệnh trần, không grep).
- `RB2e` và `RB3-IM` là tautology; `SK6` grep chuỗi đã có sẵn ở cây gốc.
- Nhánh «pin vắng» của `--skip-unchanged` là mã chết (`perSlug` đã chặn cùng vị từ trước).
- Tệp untracked vô hình với vị từ bỏ qua — `stale_files` được miễn vế này vì CI chạy
  trên cây đã commit, còn làn 7b chạy trên cây làm việc với `--allow-dirty`.
- Số đo phút MÁY viết tắt «1 ph 45 s» né lớp lint LOP-PHUT thay vì đi đường khai miễn
  trừ. Dạng viết tắt nay bị ca RB3 ghim, nên sửa về dạng thường phải đi **cùng một
  dòng** trong `MIEN_TRU` của `tests/plugins/run-tests.sh`, không sửa lẻ.

**Ngưỡng đã khai:** ≥1 hồi quy của hai nhát cắt lọt qua bộ răng này giữa hai bản phát
hành → mở vòng sửa thước.

---

## 4. Dữ liệu cho năm dòng số của mốc

Vòng `chu-ky-khong-tu-lam-hoa-cu`, đếm tay:

| dòng | số | ghi chú |
|---|---|---|
| 1 — làm-xong → quyết-được | ~7 giờ đồng hồ (S1 → chữ ký) | phần lớn ở S4, không ở cổng người |
| 2 — lượt gọi người/vòng | **3 trong thiết kế** + **3 NGOÀI thiết kế** | ngoài: DỪNG-VÁ · xin vượt trần 3 lượt chấm · nâng phạm vi tại Cổng Bằng chứng |
| 3 — vòng bị hạ-tầng-kit đốt lượt chấm | **2** | lượt 3 (triage hỏng vì args thiếu `diffFiles`) · lượt 4 (một tác tử chết giữa chừng) |
| 4 — token máy/vòng | **≈ 11,7 M** token tác tử, 6 lượt chấm | `wf-usage` chưa chạy cho vòng này; số lấy từ `totalTokens` mỗi lượt |
| 5 — phút máy/lượt chấm | ~23 phút/lượt | đường găng: `tests/plugins` 402 s + `tests/scripts` 362 s |

**Đáng vào phần «lớp lỗi tái phát» của mốc:** bốn lượt chấm đầu đều đỏ vì **thước của
chính vòng**, không vì vật — vật xanh 7/7 eval ngay từ lượt 1. Cả ba lượt gọi người
ngoài thiết kế cũng từ đó mà ra. Đây là dữ liệu cho câu hỏi «meta-work có đáng không»,
không phải một lời than.

---

## 5. Hai cổng đã bắt đúng trong lượt ship — giữ, đừng nới

- **`status-chua-arm-cong`**: PR #176 suýt mang một hồ sơ `draft` vào `main` trong khi
  PR đổi code chịu cổng. Cổng gọi nó là «tàng hình» và chặn. Lối xử đúng là **tách hồ
  sơ khỏi PR**, KHÔNG phải đặt `status: implemented` cho qua.
- **Merge commit, KHÔNG squash**: `verified_commit` trỏ một SHA trong nhánh; squash
  giết SHA đó → pin phantom → pre-merge đỏ. PR #176 merge bằng `--merge`, pin
  `71d7d9c6` sống trên `main`. Ghi lại vì nó lặp ở mọi PR có chữ ký.

---

## 6. Va chạm khi hai phiên chạy song song (đã xảy ra thật)

Số ADR đụng nhau: `main` dùng **0017** (nới-giữ-nguyên) và **0018** (CỘNG cần phê
duyệt) trong lúc tôi cũng đang viết một ADR 0017. Tôi đổi thành **0019** cùng 14 tệp
tham chiếu. Trước khi đặt số ADR mới: `git fetch` rồi đọc `docs/adr/` của
`origin/main` — số ADR là tài nguyên chung không có khoá.
