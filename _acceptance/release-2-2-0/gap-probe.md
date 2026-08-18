---
slug: release-2-2-0
at: 2026-08-18T04:20:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# Gap probe — release-2-2-0

Vòng dò lỗ chạy sau khi owner chọn đường A lần ba (bỏ răng dùng-một-lần, đưa
phép đo thành ca vĩnh viễn **P200**). Phê bình trả 5 phát hiện; cả 5 đã xử
TRƯỚC cổng, không cái nào mang sang Known limits dưới dạng «chấp nhận».

## P0 — «số ĐÃ ĐỔI» không có chiều đỏ → thử vá, rồi TRỪ có chủ đích

**Lỗ.** P200 cố ý không ghim số của một mốc để sống được ở lần cắt sau. Hệ quả:
nếu commit bump biến mất, cả năm vế vẫn xanh — nhất quán ở số cũ.

**Đã thử vá (vòng dò lỗ → vòng 3 → vòng 4):** vế quan hệ với `git show
origin/main` + cờ buộc-tăng `P200_MUST_BUMP=1` qua khoá `plugins_release`.
Vòng 3 bắt bản vá tự cắt mất lối thoát của phép đo (splice câm); vòng 4 bắt hai
hệ quả cấu trúc: neo **mốc di động** làm mọi làn song song đỏ oan ngay sau khi
mốc merge (trái charter re-pin-theo-release), và cổng thật nằm ở **một biến môi
trường** không phép đo nào canh.

**Định đoạt (owner gật 18/08, sau phân tích từ North Star):** TRỪ. Điều cần biết
là diff 3 dòng của PR phát hành — đọc 5 giây; thước máy ở đây to hơn vật được
đo, và bốn lớp fail-open liên tiếp là bằng chứng. Khai thành Known limit của
contract; đây là **khoảnh khắc quyết thật duy nhất** của hồ sơ — người ký chấp
nhận nó ở Cổng 2. Bài học nếp phát hành («mốc phát hành không dựng răng») ghi
ở Notes cho hồ sơ kế đưa vào GUIDE.

## P1 — AC-1 khai một phép đo không tồn tại (`diagram-design`)

**Lỗ.** AC-1 viết «vendor pin KHÔNG ĐỔI so với base — đo bằng quan hệ với
`git show <base>`», nhưng P200 chỉ kiểm nó hợp semver. Lời-khai-sai, đúng lớp
lỗi đã bắt ở vòng chấm 18/08 trên câu khai cặp.

**Vá.** Thu AC-1 về đúng thứ máy đo (cùng số · tăng so với base), và khai thẳng
ở Known limits rằng `diagram-design` giữ `2.5.0` được đọc trong diff, còn quan
hệ pin ↔ tree-hash đã do ca P196 canh. Không dựng bản sao thứ hai của P196.

## P1 — đột biến «dời câu khai cặp» không dời gì cả

**Lỗ.** Đột biến cũ chỉ đổi CON SỐ bên trong mục hiện tại, nên nó không phân
biệt được «đo trên đoạn cắt» với «quét cả chuỗi» — tức không canh được đúng thứ
AC-6 hứa.

**Vá.** Đột biến giờ gỡ câu khỏi mục hiện tại rồi CHÈN THẬT vào một mục lịch sử
phía trước. Nếu phép đo quay về lối quét cả chuỗi, nó lọt → đỏ.

## P1 — năm vế nội dung của AC-6 không được đo

**Lỗ.** AC-6 hứa mục `v2.2.0` «nói ba việc người dùng nhận + không phải
migrate»; P200 chỉ kiểm mục CÓ mặt.

**Vá.** Thu AC-6 về hai vế máy đo được (mục có mặt · tự khai cặp, trên đoạn
cắt) và khai ở Known limits rằng năm vế nội dung là văn cho người, đọc trực
tiếp trong diff. Lý do không dựng thước máy: mọi thước cho văn ở đây đều rơi về
đếm-từ, tức thước không gắn vào vật được giao.

## P2 — «mỗi eval ghim dòng của mình» là lời khai sai

**Lỗ.** Header evals nói mỗi eval ghim dòng riêng, nhưng P200 chỉ in MỘT dòng
tổng kèm số đột biến động (`${nMut}`) — bốn eval cùng trỏ vào một dòng, và số
trong dòng đó tự khớp với chính nó.

**Vá.** P200 in MỖI vế một dòng có tên (`P200 VE: …`) để từng eval ghim dòng
của chính nó; số đột biến bị GHIM (`7/7`), lệch là thoát 1 — bộ đếm không còn
tự khớp với chính nó.

## Còn lại (khai, không vá)

Ba mục ở Known limits của contract: phạm vi diff · hành trình làn V · ba ca
P197/P198/P199 chạy trong suite. Cả ba đều có lưới khác đang canh (người đọc
diff · pre-merge + bộ kiểm của `veto-co-dau-vet`/`cong-chan-nham-cho` · ba hồ
sơ chủ), nên dựng lại ở đây là bản sao thứ hai của cùng một luật.
