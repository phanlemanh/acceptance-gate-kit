---
schema_version: 1
feature: Danh sách chép CI ở GUIDE §5.3 buộc vào writer — phép đo rút tập lib mà pre-merge-check.sh và recheck-evidence.cjs THẬT SỰ nạp rồi so với CẢ HAI bản khai, thay vì hai danh sách viết tay phải nhớ đồng bộ
slug: guide-chep-ci-buoc-vao-writer
owner: manh@mstar.vn
risk_tier: T2               # chỉ tests/scripts/consumer-esm.test.mjs + GUIDE.md — không chạm lib/**, hooks/**, pre-merge-check.sh, recheck-evidence.cjs (t3_paths)
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-16T00:49:27Z
---

# Acceptance Contract: guide-chep-ci-buoc-vao-writer

## Context

Lớp CI vendored là 9 tệp (7 `lib/` + 2 `scripts/`), khai ở khối marker
`INIT-CI-COPY-LIST` của `commands/acceptance-init.md`. GUIDE §5.3 — thứ người
wire CI thật sự đọc — khai **7**, thiếu `lib/eval-yaml.cjs` và
`lib/lop-nhin-thay.cjs`. Repo tiêu thụ làm theo GUIDE dựng cổng mà luật làn-eval
của re-pin cùng hai đường đọc `expected_exit` fail-closed, và làn NOTE «bề mặt
người nhìn thấy» in «không kiểm được» rồi **không bao giờ chặn** — CI vẫn xanh.

Gốc không phải con số sai mà là **hai bản khai viết tay phải nhớ đồng bộ**. Kit
đã có nửa lưới: `CE2` buộc `INIT-CI-COPY-LIST` vào writer (tập tệp
`pre-merge-check.sh` + `recheck-evidence.cjs` thật sự nạp). GUIDE là bản đọc
thứ hai **không ai buộc vào writer** — đúng chỗ rò. Cùng LỚP với
`_acceptance/danh-sach-chep-ci-thieu-product-map/` (ngả (a): mở rộng CE2 sang
mọi điểm vào) và với sử liệu 08/08 (`lib/gap-probe.js` sót) — khác mắt xích.

Người hưởng: chủ repo tiêu thụ wire CI theo GUIDE (7 kho đang rollout 2.14.0) —
nguyên tố «bằng chứng không tự dối»: bản khai cho người phải bị chính vật cưỡng
chế.

Hồ sơ dựng SAU khi code xong: owner giao việc bằng lời 16/09, cổng t1-escape
đòi hồ sơ cho tệp `tests/**` (ngoài `t1_skip_globs`). Vá GUIDE.md đi riêng ở
commit `8612457a` (T1 thật — GUIDE.md nằm trong `t1_skip_globs`); hồ sơ này chỉ
gánh phần **phép đo**.

Source input: prompt của owner 16/09/2026 (hội thoại, có kiểm chứng độc lập bằng
`grep -oE "lib/[a-z-]+\.cjs" scripts/pre-merge-check.sh | sort -u`)

## Criteria

- AC-1: Given `GUIDE.md` có khối marker `GUIDE-CI-COPY-LIST` nằm TRONG §5.3 và `commands/acceptance-init.md` có khối `INIT-CI-COPY-LIST`, When chạy suite scripts, Then `CE2g` xanh — vị từ `viPhamGuide` trả danh sách lỗi RỖNG trên cả bốn chốt: danh sách §5.3 **chứa trọn** tập tệp cổng thật sự nạp · **bằng đúng** tập của `INIT-CI-COPY-LIST` · câu «đủ N file» xuất hiện **đúng một lần TRONG §5.3** (không quét toàn tệp) · con số đó **bằng** độ dài danh sách.
- AC-2: Given chính văn bản `GUIDE.md` ở cây đang kiểm, When test tự sinh SÁU mutant trong lần chạy, Then `CE2gm` chứng minh cả hai chiều, mỗi mutant nhạy ghim ĐÚNG thông điệp: (a) bỏ dòng `lib/lop-nhin-thay.cjs` → «lib/lop-nhin-thay.cjs»; (b) «đủ 9 file»→«đủ 7 file» → «viết «đủ 7 file»»; (c) đổi tên `lib/md-section.cjs` trong danh sách → «khai khác tập file»; và ba mutant đặc hiệu phải **IM**: (d) câu «đủ N file» thứ hai ở mục SAU §5.3; (e) thêm một bullet NGOÀI cặp marker; (f) đảo thứ tự hai dòng trong khối. Đối chứng dương chạy trước sáu mutant bằng **đúng chuỗi vị từ của AC-1**, không phải một phiên bản hẹp hơn.
- AC-3: Given `scripts/pre-merge-check.sh` là writer mà cả hai bản khai neo vào, When `CE2w` tiêm vào BẢN SAO văn bản của nó, Then phép nhận diện (i) thấy tên lib có chữ số / gạch dưới / chữ hoa / đuôi `.mjs` (`lib/lop-nhin-thay-v2.cjs`, `lib/eval_yaml2.cjs`, `lib/design-detect.mjs`, `lib/Bang-Chu-Hoa.js`) và báo thiếu-khai đúng tên; và (ii) giữ `lib/eval-yaml.cjs` trong tập DÙNG **sau khi gỡ mọi lời nhắc trực tiếp** khỏi văn bản cổng — tức mắt xích bắc cầu (`evidence-core.cjs` → `eval-yaml.cjs`) do bao đóng `require`/`__dirname` cưỡng chế, không do cổng tình cờ nhắc tên.
- AC-4: Given cây ở commit mang hồ sơ này, When chạy suite `scripts` và suite `plugins`, Then cả hai thoát 0 — không hồi quy ở `CE1`/`CE2`/`CE2m` (lưới cũ dùng chung `usedVsDeclared` vừa bị thay ruột) lẫn ở lưới từ vựng/tài liệu đọc `GUIDE.md`.

## Known limits

- Phần §5.3 NGOÀI danh sách (`fetch-depth: 0`, `--base`, `--no-t1-escape`, layout đích) không buộc vào vật nào — chỉ danh sách tệp có răng. Ngoài phạm vi vòng này (gap-probe 16/09, mục tác tử tự xếp là giới-hạn-phạm-vi chứ không phải finding).
- Nhận diện `lib/` cố ý RỘNG: một tệp `lib/` chỉ được nhắc trong chú thích của cổng cũng bị đòi khai. Chấp nhận — thà đòi khai thừa một tệp `lib/` (consumer chép cả `lib/`) còn hơn sót. Ngược lại `scripts/` nhận HẸP theo vị trí `$HERE/`, nên một script mới mà cổng nạp bằng đường khác `$HERE` sẽ lọt.

## Coverage

- Bỏ coverage-scan: không gian AC là hai chiều của MỘT phép đo (nhạy · đặc hiệu), cộng chân writer mà phép đo đứng lên, cộng hồi quy (entry d-20260916T004927Z-2). Phản biện context sạch 16/09 bắt 3 P1 + 5 P2 — mọi mục vá trong vòng, không mục nào rơi sang Known limits trừ hai mục phạm vi ở trên (entry d-20260916T004927Z-7).

## Out of scope

- **Không** mở rộng phép đo sang `scripts/product-map.mjs` và đồ nó kéo theo — đó là mắt xích của `_acceptance/danh-sach-chep-ci-thieu-product-map/`, còn ở `stage: discovery`, ba ngả chưa quyết (entry d-20260916T004927Z-3).
- **Không** sinh danh sách chép từ đồ thị phụ thuộc thật (ngả (c) của hồ sơ kia) — tốn hơn rõ rệt, và owner chưa gọi tên (entry d-20260916T004927Z-4).
- **Không** sửa `commands/acceptance-init.md`: khối `INIT-CI-COPY-LIST` đã đúng 9 mục, đã có răng `CE2`.
- **Không** đụng `t1_skip_globs` để tệp test khỏi qua cổng — nới răng để né chính răng mình dựng (owner bác lối đó 16/09).
- **Không** chép lại lớp CI sang 7 kho tiêu thụ trong vòng này — rollout 2.14.0 đi đường riêng.

> Out of scope = scope-truth (Gate 1 duyệt mục này).

## Notes

- Ca đo sống trong `tests/scripts/consumer-esm.test.mjs` (`CE2w`, `CE2g`, `CE2gm`); suite scripts tự chạy mọi `*.test.mjs` qua glob, không phải wire tay.
- `usedVsDeclared()` là hàm của `CE2` có sẵn — dùng lại, không nhân bản bộ đọc. Ruột nó bị THAY trong vòng này (charset rộng · vị trí `$HERE/` thay mẹo dấu nháy · bao đóng `require`), nên `CE2`/`CE2m` cũng là hồi quy của vòng này chứ không chỉ là hàng xóm.
