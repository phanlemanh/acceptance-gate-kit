# Hạt giống — bộ đếm vòng meta vẫn neo vào lần cắt số (cửa sổ 2.16 → 2.17)

**Ngày:** 2026-09-19 · **Ổ:** chưa có ô — đúng luật «ô chỉ mở khi có neo ngoài», đây là SỔ.
**Gốc:** `acceptance-gate-kit/_acceptance/o-chi-mo-khi-co-neo-ngoai/` (park; hồ sơ đầy đủ ở nhánh `cong-dang/o-chi-mo-khi-co-neo-ngoai`) — lượt chấm 3 và 5 của
chính vòng ấy gọi tên (sổ known-limits `o-chi-mo-khi-co-neo-ngoai#21`, severity high).

> Chữ trong tệp này là NGUỒN. Đừng đo lại trừ khi nghi số đã cũ.

## Vật và lỗi

`CLAUDE.md` luật (b) sau 18/09 đọc: «Giữa hai mốc **ĐƯỢC MỘT KHO TIÊU THỤ NHẬN** tối đa MỘT
vòng meta … Mẫu số là mốc KHO NHẬN, không phải mốc cắt số.»

`metaOpen` trong `scripts/start-scan.mjs` (khối chú thích dòng 615–625 tự khai «biến ‹tối đa
một› từ lời dặn thành số trên thẻ») vẫn tính cửa sổ từ
`git log -1 -G '"version":' -- .claude-plugin/plugin.json` — tức **lần cắt số gần nhất**, đúng
mẫu số mà luật vừa bác. Không AC nào của vòng chạm `start-scan`, không răng nào ghim.

**Tái lập:** cắt số 2.17.0 (đổi version trong `plugin.json`) rồi
`node scripts/start-scan.mjs --root .` — cửa sổ reset ngay, dù chưa kho nào cài mốc.

**Người trả giá:** người đọc thẻ `/acceptance-gate:start` — số vòng meta đọc theo mẫu số cũ,
nên trần của chính luật vừa sửa hiện sai ngay từ cửa sổ kế. Lớp «luật đổi bằng chữ, vật giữ
luật không đổi» mà hiến pháp gọi tên (cấm dặn-bằng-lời làm nghiệm).

## Vì sao CHƯA mở ô

Răng đúng tầng là «mốc N+1 phải dẫn được một commit ở kho tiêu thụ đã cài mốc N» — đó là
**CỘNG** (ADR 0018 đòi owner phê duyệt đích danh), và vòng 18–19/09 đã thử một bản chiếu yếu
của nó (dòng tự khai «Kho chờ nhận» trong hồ sơ mốc) rồi **gỡ**: nó rò vào khuôn giao cho kho
tiêu thụ và kiểm bằng danh sách đóng.

`CLAUDE.md` nay khai vế 4 là **CHƯA CÓ RĂNG** kèm ngưỡng đang đếm: *một mốc cắt số mà sau 21
ngày không kho nào cài nó*. Ngưỡng ấy nổ thì mở ô, neo là chính mốc đó.

## Cảnh báo cho ai mở lại

Đừng dựng lại «một dòng tự khai trong hồ sơ mốc» — đã thử, đã gỡ, lý do ở
`_acceptance/o-chi-mo-khi-co-neo-ngoai/decisions.jsonl` trên nhánh park (dòng `descope` 19/09) và ở sổ
known-limits `#1` `#2` `#9` `#15` `#22` (đều đã đóng vì vật mất). Vật đúng là **commit ở kho
tiêu thụ**, không phải lời khai ở kho kit.
