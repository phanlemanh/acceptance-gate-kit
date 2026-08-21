# Thiết kế — hồ sơ làn V không phải «chờ ký»


> **⚠ Thân bài dưới đây là LỊCH SỬ VÒNG MỘT (hạng T2, bảng 100 ô, 7 ca, vị từ ở
> `scripts/`).** Owner trả lại tại Cổng Bằng chứng 21/08; đánh số AC và mọi con
> số trong thân bài KHÔNG còn khớp hợp đồng đang chạy. Nguồn đúng là
> `_acceptance/lan-v-khong-phai-cho-ky/contract.md` (12 AC) và mục **Vòng hai**
> ở cuối file này. Giữ thân bài để đọc lại vì sao vòng một chọn như thế.

**Ngày:** 2026-08-21 · **Hạng:** T2 · **Đề bài:** `docs/plans/2026-08-21-hat-giong-lan-v-khong-phai-cho-ky.md` (Cổng 0 gật, #74).

## Vấn đề

Ba bộ đọc cùng một bộ hồ sơ cho hai kết luận về hồ sơ đi **làn V** (T2, xanh-sạch,
`veto_state: mo`): lưới trước-merge đọc «làn V — cửa veto mở» và không đòi gì;
máy quét vào phiên (`scripts/start-scan.mjs`) xếp vào *chờ Cổng Bằng chứng*;
bản đồ (`scripts/product-map.mjs`) xếp vào *Đang làm*. Hai bản phát hành 2.0.0 và
2.1.0 đang chịu: thẻ `/start` đòi đúng lượt gọi người mà hồ sơ M1 được dựng để
không đòi.

## Luật (một câu, ba chỗ đọc)

Hồ sơ `status: verified` **và** `vetoGateState` (đã có trong `lib/evidence-core.cjs`)
trả `{ state: 'mo', stamped: true, tier: 'T2' }` **và** evidence `verdict: PASS`
**và** chưa `human_signoff` ⇒ **đã giao, cửa veto mở**. Không phải cổng, không
phải đang làm.

Mọi ô khác giữ nguyên luật cũ — và chính chúng là ca cô lập lớp: `da-veto`
(người đã phát ngôn — phải còn hiện ở nơi người thấy), vết giờ hỏng (V không vết
là bỏ-cổng lặng), T3 (làn V chỉ T2), PENDING-JUDGMENT (phần judgment là của
người — máy không giao thay), vắng `veto_state` (luật cũ nguyên văn).

## Thay đổi

| Thay đổi người dùng gặp | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Thẻ `/start` thôi liệt hai bản phát hành làn V vào «chờ chữ ký»; dòng đếm cuối thẻ nêu «trong đó N làn V, cửa veto mở» | `scripts/start-scan.mjs` (nhánh `verified`), `commands/start.md` (một dòng render) | AC-1, AC-10 |
| Bản đồ xếp hồ sơ làn V dưới «Đã giao» kèm chú thích «cửa veto mở», không còn «Đang làm» | `scripts/product-map.mjs` (`classify`), `PRODUCT-MAP.md` vẽ lại | AC-2, AC-10 |
| Hai bộ đọc dùng **một** vị từ và **một** chuỗi nhãn — không thể trôi khỏi nhau | `scripts/product-map.mjs` xuất `lanVMo(contractTxt, verdict, signoff)` + `VETO_OPEN_NOTE`; `start-scan.mjs` nhập tĩnh | AC-8, AC-9 |
| Mọi ca cô lập lớp được ghim trên cùng fixture code-sinh, qua chính hai script; LV7 là bảng sự-thật 100 ô viết trước | `tests/plugins/lan-v.test.mjs` (**LV1–LV7**) + **7 dòng `run`** trong `tests/plugins/run-tests.sh` | AC-3…AC-8 |
| Răng hồ sơ chạy nhanh (không chạy trọn suite), có chiều đỏ qua hai mutant của chính vị từ, đối chứng dương trên bản sao không tiêm; ROOT suy từ vị trí script | `_acceptance/lan-v-khong-phai-cho-ky/rang.sh` (`cmd:` dạng đường dẫn — không thêm khoá config) | mọi AC |

**Vị trí vị từ:** `product-map.mjs` chứ không `lib/` — `lib/**` là t3_paths; vị từ
chỉ *gọi* `vetoGateState` và `frontmatterField` đã có trong lib. `start-scan.mjs`
đã phụ thuộc `product-map.mjs` (nó import `renderProductMap` để kiểm `map.fresh`),
nên không thêm cạnh phụ thuộc mới.

**Trạng thái mới trong JSON quét:** `groups.done[].state = 'lan-v-mo'`. Không
thêm key nào vào `START-SCAN-KEYS` (round-trip P99 canh key, không canh giá trị).

**Chuỗi nhãn:** `VETO_OPEN_NOTE = 'cửa veto mở'` — đúng chữ trong dòng NOTE của
`pre-merge-check.sh` và trong thân lệnh `/start`; răng so ba chỗ bằng đẳng thức.

## Không làm

Không trạng thái «cửa đóng» (luật làn V: cửa không hạn) · không ký bù, không xoá
hai hồ sơ phát hành (sổ M1 nằm trong `decisions.jsonl`) · không sửa lưới
trước-merge (đã đúng) · không đọc `decisions.jsonl` để suy trạng thái · không mở
vòng nạp `tests/plugins/cases/` (thuộc hồ sơ B) — ca mới vẫn vào suite `plugins`
nhưng đặt tên theo slug (`LV<n>`), không lấy số P.

## Kiểm

- LV1 R+ · LV2 gỡ `veto_state` → luật cũ · LV3 `da-veto` · LV4 vết hỏng · LV5 T3 ·
  LV6 PENDING-JUDGMENT — mỗi ca hỏi **cả hai** bộ đọc và ghim **giá trị** của từng
  bộ đọc rồi mới ghim quan hệ. **LV7 bảng sự-thật viết trước** trên 100 ô
  (veto 5 × verdict 5 × hạng 2 × chữ ký 2): hàm kỳ vọng viết tay, đúng 1 ô «đã
  giao»; ô có chữ ký giữ `signed-off` không chú thích (thứ tự nhánh: chữ ký trước
  vị từ V); ô REJECT/BLOCKED/vắng-evidence dưới V không bao giờ «đã giao». Ca nhận
  `LV_CASES=<danh sách>` để răng chạy một phần.
- Răng `--chan mutant`: chép cây hai lần (rsync trừ .git/node_modules/.claude) —
  bản A không tiêm phải **xanh trước** (đối chứng dương cùng cách chép); bản B hai
  đột biến có marker (`LAN-V-MO` gỡ nhánh V → LV1 đỏ ghim câu; `LAN-V-PASS` gỡ
  điều kiện PASS → LV7 đỏ ghim toạ độ), sed phải đổi ≥1 dòng, marker vắng là đỏ
  riêng. Mutant đi qua chính ca kiểm, không tin mã thoát trọn suite.
- Răng suy `ROOT` từ vị trí script, truyền `--root` tường minh, tự kiểm `$0` nằm
  trong `$ROOT`; không có `--root .`.
- Răng `--chan mot-chu`: `VETO_OPEN_NOTE` == chuỗi trong `pre-merge-check.sh` ==
  chuỗi trong `commands/start.md`; bản sao đổi một chữ → đỏ.
- Răng `--chan ban-do`: bản đồ thật vẽ lại, `--check` exit 0, máy quét thật không
  còn `release-2-0-0`/`release-2-1-0` trong `gates` (R+ sống, bổ sung — fixture
  code-sinh mới là thước).

## Vòng hai (T3) — sau khi owner trả lại 21/08

**Điều sai ở vòng một:** vị từ khoá vào `veto_state`, trong khi luật thật quyết
định «máy đi tiếp không cần ký» là **sáu điều kiện xanh-sạch** ở
`xanh_sach_check` (`scripts/pre-merge-check.sh:327-372`). Hồ sơ chưa sạch biến
mất khỏi danh sách chờ ký ở thẻ vào phiên và bản đồ, trong khi lưới trước-merge
vẫn chặn — lệch **ngược chiều an toàn**. Chính hồ sơ này là ca tái lập.

**Luật mới (một câu):** hồ sơ `status: verified`, chưa ký, và `xanhSach(contract,
evidence)` trả `clean: true` ⇒ **đã giao**. `veto_state: mo` + vết giờ chỉ quyết
**chú thích** «cửa veto mở», không quyết việc có phải đã giao hay không.
`da-veto` vẫn cắt ngang mọi thứ.

**Nguồn luật về `lib/`** (nên hồ sơ lên T3): `xanhSach` sống cạnh `vetoGateState`
trong `lib/evidence-core.cjs`; hai bộ đọc mặt người gọi nó, và bash
`xanh_sach_check` gọi cùng nguồn với suy biến **fail-CLOSED** (thiếu node/lib ⇒
coi như chưa sạch ⇒ vẫn đòi người). Đẳng thức hai chiều bash↔lib có răng riêng.

**Bất biến bản đồ phát biểu lại, không bị phá:** ô đổi ở **mỗi lần đóng cổng** —
kể cả cổng máy đóng ở làn V — và đổi lại làn V phải **vẽ lại bản đồ trong cùng
vòng**, nếu không chính nó dựng cửa chặn đỏ ở CI cho hồ sơ sau.

**Giữ lại từ vòng một:** 7 ca LV trên fixture code-sinh, răng hồ sơ khai `cmd:`
bằng đường dẫn, ba đột biến có marker. Thêm: trục SẠCH trong bảng sự-thật (300 ô),
đột biến thứ tư (trả vị từ về tiêu chí `veto_state` → phải đỏ), sàn đếm bộ lọc ca,
răng đẳng thức bash↔lib.
