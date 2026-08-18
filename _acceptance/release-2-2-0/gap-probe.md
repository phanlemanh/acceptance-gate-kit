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

## P0 — «số ĐÃ ĐỔI» không có chiều đỏ

**Lỗ.** P200 cố ý không ghim số của một mốc (đọc mọi thứ từ manifest) để sống
được ở lần cắt sau. Hệ quả không ai để ý: nếu commit bump biến mất, cả bảy vế
vẫn xanh — mọi thứ vẫn *nhất quán*, chỉ là nhất quán ở số cũ. Việc DUY NHẤT hồ
sơ này làm — cắt số — là việc duy nhất không có chiều đỏ.

**Vá.** Thêm vế QUAN HỆ với base (`git show <base>:<manifest>`), hai mức:
- luôn bật: tụt số so với base → ĐỎ «tut so so voi base»;
- bật ở mốc phát hành (`P200_MUST_BUMP=1`, khoá executor `plugins_release`):
  số BẰNG base → ĐỎ «khong tang so so voi base: van la 2.1.0 — moc phat hanh
  buoc phai tang».

Không giải được base → ĐỎ (fail-closed), vì «không đối chiếu được» không phải
«đạt». PR thường chạy khoá `plugins` không cờ nên không đỏ oan.

**Chiều đỏ đã chạy.** Hai đột biến mới: `tut so xuong duoi base` ·
`mat commit bump (so bang base)` — cả hai đi qua CHÍNH hàm kiểm và ghim đúng câu.

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
