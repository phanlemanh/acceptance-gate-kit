# Nhật ký thi công — hồ sơ luu-kho (append-only)

*Ghi trong lúc thi công, sau Cổng 1. Mục đích: mọi con số lệch khỏi hợp đồng đã
duyệt phải hiện ra ở đây TRƯỚC khi ai đó sửa hợp đồng cho vừa kết quả.*

## Đã xong

| Bước | Commit | Ghi chú |
|---|---|---|
| Đặt mốc `truoc-luu-kho-2026-08` + **đẩy lên remote** | tại `1df86ad` | Chân AC-1 thoả: mốc là **cha trực tiếp** của commit gỡ đầu tiên (`git rev-list moc..HEAD` bỏ chính nó = rỗng), và `git ls-remote --tags origin` trả đúng sha |
| Gỡ 197 file | `8723546` | `codex/` · `tests/codex/` · `codex-self-script-refs.tsv` · `.agents/` · `design-loop/` · `tests/design-loop/` · `plugins/` · `sync-plugin-packages.sh` |
| Khoá config + marketplace | `5c192f5` | `mirror_sync` (executor + suite-key) · `t1_skip_globs: plugins/**` · entry `design-loop`; thêm khoá `luu_kho_rang` |

## ⚠ HAI SỐ ĐO LỆCH KHỎI HỢP ĐỒNG ĐÃ DUYỆT — chưa sửa hợp đồng, mới ghi

### (1) Suite `plugins` mất NHIỀU HƠN HẲN "số ca của P30"

AC-11 khai `plugins: 173 → 173 trừ số ca của P30`. Đo trên vật: **~30 khối
`run`** của `tests/plugins/run-tests.sh` phụ thuộc Codex/mirror, không phải một
khối. Chúng chia làm hai loại, và đây là chỗ dễ sai nhất:

- **Xoá hẳn** — ca chỉ tồn tại vì Codex/mirror: `P01`–`P06`, `P22`, `P23`,
  `P25`, `P28`, `P29`, `P30`(mirror sync), `P41`, `P48`, `P49`, `P54`, `P56`,
  `P58`, `P81`, `P162`, `P175`, `P181`.
- **SỬA, không xoá** — ca đo CẢ HAI harness, gỡ Codex thì mất một nửa nhưng nửa
  Claude vẫn phải sống: `P30`(Claude decision commands), `P31`, `P84`, `P86`,
  `P100`, `P173`.

**Vì sao ghi thay vì lặng lẽ sửa số:** hợp đồng đòi số ca phải khai TRƯỚC rồi
mới đo. Nếu tôi chạy suite xong mới điền số vừa thấy, đó đúng là
hạ-thước-cho-vừa-vật — phép đo mất hẳn khả năng bắt "gỡ quá tay", tức mất lý do
tồn tại. Đường đúng: đếm a-priori từ danh sách trên, khai vào hợp đồng như một
**sửa-sau-Cổng-1 có lý do**, rồi mới chạy và đòi khớp.

### (2) Suite `scripts`: hai con số cùng đúng, đừng lẫn

- `Results: 671 passed` — bộ đếm nội bộ của suite.
- **737** dòng `PASS:` đếm thô.

Hai số này KHÁC NHAU và cùng hợp lệ. E7 ghim `Results: 664 passed` tức đang đo
theo **bộ đếm nội bộ**, nên đẳng thức `664 = 671 − 7` chỉ đúng nếu 7 assert
`DSC01-03`/`SG1-4` đều đi qua hàm `check` (có tăng bộ đếm). Đã kiểm: đúng.
Nhưng nếu ai sau này đổi E7 sang đếm dòng `PASS:` thì mẫu số phải là **737**,
không phải 671. Ghi để không ai lẫn.

## ✅ Suite `scripts`: đẳng thức GIỮ ĐƯỢC

Gỡ 7 assert `DSC01-03` + `SG1-4` → `Results: **664** passed, 0 failed`. Đúng
bằng `671 − 7` đã khai TRƯỚC khi đo. Đây là bằng chứng khuôn đếm-trước-đo-sau
hoạt động: nếu tôi để sàn `≥671` thì lúc này phải hạ số, và phép đo mất răng.

## ⚠ SỐ ĐO LỆCH THỨ BA — suite `plugins` đỏ **56 ca**, không phải «vài ca của P30»

Đo bằng cách chạy thật sau khi gỡ. Ba nhóm, và nhóm 3 mới là chỗ dễ âm thầm
làm yếu bộ kiểm:

**Nhóm A — XOÁ HẲN** (ca chỉ tồn tại vì Codex/mirror; gỡ là đúng, không mất độ phủ):
`P01` `P02` `P03` `P04` `P05` `P05b` `P05c` `P06` `P22` `P25` `P29` `P30`(mirror
sync) `P41` `P42` `P45` `P46` `P47` `P48` `P49` `P50` `P54` `P56` `P58` `P162`
`P175` `P181`

**Nhóm B — TRIM VỀ MỘT HARNESS** (ca đo CẢ HAI; nửa Claude phải sống nguyên):
`P31` `P44` `P57` `P84` `P86` `P90` `P93` `P94` `P99` `P100` `P101` `P122`
`P127` `P173`

**Nhóm C — TRỎ LẠI NGUỒN, KHÔNG ĐƯỢC XOÁ** (ca hỏi «gói có ship X không?» và
hỏi qua mirror; mirror chết thì gói Claude CHÍNH LÀ cây nguồn, nên phải đổi
đích chứ không bỏ câu hỏi): `P07` `P08` `P20` `P21` `P24` `P26` `P27` `P34`
`P39` `P80` `P81` `P85` `P87` `P88` `P91` `P95` `P128` `P133` `P147`

> **Cạm bẫy của nhóm C, ghi to:** cách rẻ nhất để suite xanh lại là xoá luôn
> nhóm này. Làm thế là **mất thật độ phủ** — câu hỏi «gói có ship đủ file
> không?» vẫn còn ý nghĩa sau khi mirror chết, chỉ đổi chỗ hỏi. Xoá nhóm C
> chính là hình dạng "gỡ quá tay" mà đẳng thức số-ca của AC-11 sinh ra để bắt.

**Hệ quả cho AC-11:** con số `173 − <số ca P30>` trong hợp đồng SAI. Số đúng
phải suy từ: `173 − |nhóm A| + 0` (nhóm B và C giữ nguyên số ca, chỉ đổi nội
dung). Với |A| = 26 → kỳ vọng **147**. Con số này khai ở đây TRƯỚC khi phẫu
thuật; nếu đo ra khác 147 thì có ca bị gỡ nhầm hoặc gỡ sót, và phải đi tìm chứ
không sửa số.

## Còn lại (chưa làm)

1. Phẫu thuật `tests/plugins/run-tests.sh` theo ba nhóm A/B/C ở trên — 56 ca,
   ~93 tham chiếu `plugins/` rải khắp tệp 9000 dòng, KHÔNG có điểm nghẽn chung
   nên phải làm từng ca. Đây là phần dài nhất còn lại.
3. `tests/workflows/` — 3 file còn tham chiếu Codex.
4. Chữa tham chiếu sống ở: `CLAUDE.md` (bất biến mirror, 4 chỗ) · `GUIDE.md` ·
   `QUICKSTART.md` · `README.md` · `CONTEXT.md` · `commands/signoff.md` ·
   `commands/approve.md` · `skills/acceptance/SKILL.md` +
   `references/design-ui-check.md` + `references/human-facing-language.md` +
   `references/eval-executors.md` · `skills/uat-session/SKILL.md` ·
   `skills/ux-ui-craft/references/layout-craft.md:121` (tham chiếu SỐNG, PHẢI
   sửa) · `feature-loop/skills/feature-loop/SKILL.md` (nhánh CT2) ·
   `feature-loop/scripts/resolve-plugin.mjs` · `scripts/config-patch.mjs`.
5. Hai ADR mới + đánh dấu ADR 0001 superseded.
6. Viết `luu-kho-rang.sh` (10 chân đo + chiều đỏ tự đột biến).
7. Chạy S4.

## Miễn trừ mới cần khai vào hợp đồng trước khi đo

`*/plugin.json` chứa **nhật ký phiên bản** nhắc `design-loop`/`codex` như sử
liệu ("v1.7 adds design-loop-aware guards…"). Đó không phải con trỏ sống. Viết
lại changelog để lint xanh là xoá lịch sử để lấy màu — sai đổi. Đề nghị: miễn
trừ mô-tả-phiên-bản trong `plugin.json`, kèm chân ĐỎ-NGOÀI-DANH-SÁCH như đã làm
cho `ux-ui-craft`.
