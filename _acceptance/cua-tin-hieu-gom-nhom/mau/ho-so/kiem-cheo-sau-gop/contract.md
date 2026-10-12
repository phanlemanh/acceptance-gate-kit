---
schema_version: 1
feature: Kiểm «có làm hỏng hồ sơ đã ký khác không» chạy một lần mỗi đêm cho mọi lần gộp vào onehub từ mốc trước, ngoài mọi lượt ghim lại; đỏ thì gọi tên lần gộp gây đỏ
slug: kiem-cheo-sau-gop
owner: manh.phan@onemount.com
risk_tier: T2
surfaces: []
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-10-08
design_doc: _acceptance/kiem-cheo-sau-gop/design.md
---

# Acceptance Contract: kiem-cheo-sau-gop

## Criteria

- AC-1: Given mốc trước là sha `T` trên first-parent của `origin/onehub` (hoặc của nhánh `<ref>` khi gọi `--nhanh <ref>`, dùng cho phá thử trên nhánh nháp) và đỉnh `D`, When một lượt chạy, Then khoảng gộp là đúng các merge commit first-parent trong `T..D` theo thứ tự, và tập hồ sơ cần đo là đúng các hồ sơ `signed-off`/`machine-cleared` có một glob `paths` trong `evals.yaml` khớp một tệp đổi trong `T..D` ngoài `_acceptance/` — tập rút từ `_acceptance/*/`, không liệt tay.
- AC-2: Given `T..D` không có lần gộp nào, hoặc tập hồ sơ cần đo rỗng, When lượt chạy, Then nó không xin khoá, không dựng cây, ghi kết quả `khong-gop-moi` (hoặc `xanh` với 0 hồ sơ, rồi tiến mốc tới `D`) và thoát 0.
- AC-3: Given `moc.json` vắng, hỏng, hoặc sha của nó không còn trên first-parent của `origin/onehub`, When lượt chạy, Then nó thoát 2 với thông điệp gọi tên lý do và lệnh `kiem-cheo:chay -- --tu <sha>`, không đoán mốc, và vẫn BÁO theo AC-9 với kết quả `loi` (không im lặng).
- AC-4: Given thư mục đợt có bộ phát lịch còn sống, When lượt cần khoá, Then nó ghi đơn `xin/kiem-cheo-s4.json` (ghi tệp tạm cùng thư mục rồi đổi tên), chỉ chạy làn sau khi `khoa/s4/chu.json` ghi `phien: kiem-cheo`, và trả khoá trong mọi kết cục kể cả lỗi; hết thời gian chờ mà khoá vẫn ở phiên khác thì ghi `bo-luot-khoa-ban` kèm tên chủ khoá, không chạy làn, mốc không tiến.
- AC-5: Given lần kiểm có kết quả gần nhất cách hơn 20 giờ, When lượt ghi đơn xin khoá, Then đơn mang `moc` = ngày (YYYY-MM-DD) của lần gộp cũ nhất chưa kiểm; và bộ phát lịch xếp một đơn có `moc` trước đơn `s4` không có `moc` của hàng chưa có mốc (`scripts/dieu-phoi/lich.mjs` đọc `moc` của chính đơn trước `moc` theo slug).
- AC-6: Given eval máy của một hồ sơ trong tập đỏ ở `D`, When lượt phân loại, Then: chạy lại đúng lệnh ở `D` mà xanh → `chap-chon`; vẫn đỏ mà ở `T` cũng đỏ → `do-san`; ở `T` xanh — hoặc hồ sơ/eval đó chưa có hay chưa ký ở `T` (hồ sơ vào trong khoảng) — → `do-moi` kèm sha của lần gộp ĐẦU TIÊN trong khoảng làm lệnh đó đỏ (tìm nhị phân trên danh sách lần gộp của AC-1, bắt đầu từ lần gộp mang hồ sơ vào khi nó vào trong khoảng); kết quả ngày là `do` khi có ít nhất một `do-moi`, và mọi eval máy xanh ở `D` thì kết quả là `xanh` — tức kiểm «các lần gộp trong khoảng không làm đỏ thêm eval của hồ sơ đã ký» (lời hứa thay `tra-loi-tin-nhac/E11`).
- AC-7: Given không thư mục đợt nào có bộ phát lịch còn sống, When lượt cần khoá, Then nó tạo khoá tay `khoa/s4` (kèm `chu.json` của lượt) trong thư mục đợt gần nhất, xoá nó khi xong; khoá tay đã có thì ghi `bo-luot-khoa-ban`, không chạy làn.
- AC-8: Given một lượt cần đo, When nó chạy làn, Then làn chạy trên cây riêng `.acceptance-runs/kiem-cheo/cay` tách ở `D` (và cây ở sha cần thử khi phân loại), không ghi tệp nào vào cây làm việc nơi lệnh được gọi; cây không dựng được, suite của làn đỏ ở `D`, hoặc lượt vượt trần `KIEM_CHEO.tranLuotPhut` (cả cây tiến trình bị dừng, khoá được trả) → kết quả `khong-chay-duoc` gọi tên bước hỏng, mốc không tiến; làn được gọi ở chế độ chỉ đo (không `--write`) với đúng tập hồ sơ của AC-1.
- AC-9: Given một lượt kết thúc với bất kỳ kết quả nào ở AC-2, AC-3, AC-4, AC-6, AC-7, AC-8, hoặc thoát khác 0 vì lỗi bất ngờ (kể cả `git fetch` lỗi), When báo, Then `.acceptance-runs/kiem-cheo/<YYYY-MM-DD>.json` có `ket_qua`, `tu`, `den`, `lan_gop`, `ho_so` và mỗi mục `do` có `ho_so`, `eval`, `loai`, `lenh` (cộng `lan_gop` khi `do-moi`); kết quả `do`, `khong-chay-duoc` hoặc `loi` thì có đợt sống → một tệp `yeu-cau/kiem-cheo-<n>.json` loai `can-nguoi` (ghi tệp tạm rồi đổi tên), không có đợt → một thông báo macOS; không tự mở PR, không tự mở phiên.
- AC-10: Given `bun run kiem-cheo:cai` (anh tự chạy), When chạy, Then nó ghi `~/Library/LaunchAgents/<nhãn>.plist` chạy `kiem-cheo:chay` lúc 01:00 mỗi ngày với thư mục làm việc là gốc kho — chương trình là đường dẫn tuyệt đối tới `bun`, `EnvironmentVariables.PATH` chứa thư mục của `bun`, `node`, `git`, và `StandardOutPath`/`StandardErrorPath` trỏ `.acceptance-runs/kiem-cheo/launchd.log` — rồi nạp nó; lệnh của plist chạy được dưới môi trường trống (`env -i`, PATH hệ thống); chạy lại không sinh bản thứ hai; `bun run kiem-cheo:go` gỡ nạp và xoá tệp.
- AC-11: Given mã của vòng này, When đọc `scripts/kiem-cheo/`, Then làn ghim lại được gọi qua `scripts/resolve-plugin.mjs` (không có bản chép `repin-lane` nào trong kho) và không tệp nào gọi model hay AI Gateway trực tiếp.
- AC-12: Given bản sao `git clone --shared` của chính kho này (lịch sử git thật, 184 hồ sơ thật, `_acceptance/` ~315 MB) với mốc `T` = `feba7e77` và đỉnh `D` = `b633a7e3` (ba lần gộp thật #304, #308, #312), When chạy `dem.mjs` đầu-cuối với làn ghim lại thay bằng làn nhanh in mọi eval xanh, Then lượt thoát 0 với kết quả `xanh`, `lan_gop` đúng ba sha đó, `ho_so` bằng đúng tập rút bằng `evalPathsOf` của kit trên cùng `T..D` và chứa ít nhất một hồ sơ chỉ khai `paths` kiểu một dòng, không lỗi bộ đệm, mốc tiến tới `D`; và cây làm việc nơi gọi lệnh không đổi.
