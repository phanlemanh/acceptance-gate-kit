---
slug: release-2-11-0
at: 2026-09-10T15:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — release-2-11-0

Một lượt, context sạch, đầu vào ĐÚNG năm tệp (design · contract · evals · sổ quyết định ·
bài học từ feature trước). Critic KHÔNG đọc mã nguồn kho — nó phán KẾ HOẠCH phép đo.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | AC-4 hứa QUAN HỆ trên bảy đường đọc nhưng E4 chỉ ĐỌC MÃ NGUỒN bằng grep — không eval nào cho giá trị thật đi qua `resolveConfigList` hay `s4-args`. 24 trong 28 chỗ đo được ở repo tiêu thụ không có phép đo hành vi nào | S3 chèn `unquoteScalar` vào nhánh khối nhưng gán nhầm biến. Grep thấy tên hàm → xanh; `steps` của crm vẫn kèm chéo ngược, `inputs` của artifact-platform vẫn bị xén → s4-args vẫn báo input không tồn tại. Đúng lớp «đo chỉ dẫn thay vì đầu ra» | Ma trận HÀNH VI toàn phần bảy đường × hình dạng trục B, gọi CHÍNH `resolveConfigList` và CHÍNH `s4-args.mjs`, hằng số assert khai trước; chiều đỏ E5 phủ cả nó | **fixed**: E4 viết lại thành ca hành vi (ba hình dạng lấy NGUYÊN VĂN từ bán kính crm/artifact-platform); ca đọc-mã-nguồn tách sang E4b; E5 mở rộng phủ BG4 |
| P1 | evals | AC-3 hứa «làn chấm chạy lệnh ấy» nhưng E3 dựng lại chuỗi bốn bước bằng tay — fixture dựng đúng khuôn BÊN ĐỌC, đúng lớp đã bị bắt ở `[eval-khai-ma-thoat-mong-doi#F1]` và `[thuoc-khai-mot-dang-do-mot-neo#F1]` | Làn chấm thật lấy chuỗi qua đường khác đường E3 mô phỏng. E3 xanh vì nó chứng minh bản mô phỏng của chính nó; hồ sơ thật vẫn PASS từ shell thoát 2 | Bước 1–2 phải đi qua vật thật: chạy chính `s4-args.mjs` rồi RÚT chuỗi lệnh từ tệp args nó SINH RA; hai chiều trên cùng workspace | **fixed**: E3 viết lại thành round-trip qua bên VIẾT thật (`s4-args.mjs`) + bên ĐỌC thật (`expectedExits`), công cụ giả ghi dấu vết ra đĩa để chứng minh nó chạy. Phần verdict cuối của `acceptance-verify.js` khai thẳng ở Known limits, E8d là lưới |
| P1 | evals | E4 vế (a) khai phạm vi theo TỆP còn AC-4 khai theo ĐƯỜNG; vế (c) đòi bốn bộ đọc token GIỮ mệnh đề cũ — mà chúng nằm CÙNG `lib/evidence-core.cjs`. Hai vế mâu thuẫn ngay trên giấy | S3 không thể thoả cả (a) lẫn (c): hoặc xoá mệnh đề khỏi bộ đọc token (phá descope đã ghi sổ), hoặc lặng lẽ hạ (a) xuống phạm vi dòng — mất răng quét-lớp | Liệt kê TƯỜNG MINH tập hàm đường-thi-hành và tập cố-ý-giữ (hai danh sách đóng), khẳng định trên từng HÀM; thêm assert tổng số khớp BẰNG số phần tử tập cố-ý-giữ | **fixed**: AC-4 nay là bảng bảy đường + danh sách đóng các hàm cố-ý-giữ (ĐO ở S3: **năm** hàm, không phải bốn như bản Cổng 1 đoán — `frontmatterField` không mang mệnh đề cũ, `extractEvalBlockRunIds` và `isAuthenticVerifier` thì có; sổ quyết định ghi entry `fix`), nói rõ «phạm vi theo HÀM chứ không theo TỆP»; E4b mang cả ba chân, chân thứ ba là phép đếm tổng chống cả vá-sót lẫn vá-lan |
| P1 | evals | E7 dựa trên đầu ra RỖNG mà không chứng minh phép đo đã chạy: không kiểm sha nền, không kiểm mã thoát git, không đối chứng dương | CI clone nông hoặc sai cwd: git in lỗi ra stderr, stdout rỗng, `test -z` đúng → in PASS exit 0. AC-7 xanh mà không đo gì, và mất luôn tín hiệu bằng-chứng-sống của bản vá | `git rev-parse --verify` phải thành công; đối chứng dương cùng cửa sổ (`lib/` phải KHÁC rỗng); mã thoát riêng cho từng chân | **fixed**: AC-7 nay ba chân ba mã thoát (3 sha không giải được · 4 đối chứng dương rỗng · 5 diagram-design có đổi), thi hành bằng `_acceptance/release-2-11-0/rang-moc.sh`; chiều đỏ thứ tư (bộ giải chưa vá → `--neo` hỏng → exit 3) giữ nguyên |
| P2 | contract | AC-9 đòi bốn khối nhưng không khai chúng sống ở TỆP nào, và hai trong ba dòng số chỉ đếm được SAU chữ ký | Ở S4, E9 chạy trước chữ ký: tác giả điền số ước lượng để qua judge, hoặc điền sau chữ ký và chạm hồ sơ đã ký (lớp đã cháy ở `[release-2-10-0#F1]`). Ba dòng số thành số hình thức | Khai vị trí bốn khối + mốc cắt đếm + nguồn rút từng số; số nào chỉ biết sau chữ ký thì khai ở Known limits kèm đường ghim lại | **fixed**: AC-9 khai bốn khối sống trong `## Notes` của chính contract này, mốc cắt đếm là **lời mời Cổng Bằng chứng** (lượt ký là lượt cuối đã biết trước), và *làm-xong→quyết-được của chính mốc* tách hẳn ra Known limits + điền ở làn ghim lại sau ký |

**5/5 đã sửa artifact, 0 đẩy sang `human-gate1`.** Không finding nào lật một quyết định đã
ghi trong sổ; finding P1 thứ ba củng cố đúng quyết định descope bằng một phép đếm máy.
