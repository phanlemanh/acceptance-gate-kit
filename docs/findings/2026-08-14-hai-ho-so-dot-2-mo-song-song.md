# Hai hồ sơ đợt 2 mở song song — `nguoi-ve-bien-v` đóng, `veto-co-dau-vet` ở lại

*2026-08-14 · Ghi bởi phiên điều phối, sau khi owner xác nhận đóng. Đây là
lỗi phối hợp giữa hai phiên, không phải lỗi của hồ sơ nào — ghi lại vì lớp lỗi
sẽ tái diễn mỗi lần chạy nhiều làn song song, và đó đúng là hướng kit đang đi.*

## Chuyện gì đã xảy ra

Hai phiên độc lập cùng nhận đề bài đợt 2 «người về biên» và mỗi bên mở một hồ
sơ riêng cho **cùng một cơ chế V**. Trình tự dựng lại từ nhật ký tham chiếu
của git (không dựa vào trí nhớ phiên):

| Giờ | Việc |
|---|---|
| 16:30 | Phiên điều phối mở `_acceptance/nguoi-ve-bien-v/` (đợt 2, **trước**) |
| 17:03 | 1c vào main (PR #49) |
| 17:22 | Phiên song song tách nhánh `feat/veto-co-dau-vet` |
| 17:27 | Nhánh `nguoi-ve-bien-v` commit cuối |
| 17:34 | Phiên song song mở `_acceptance/veto-co-dau-vet/` (đợt 2, **sau** ~1 tiếng) |
| 17:41 | `veto-co-dau-vet` qua Cổng 1 |
| 17:44 → 18:24 | `veto-co-dau-vet` thi công trọn ba tầng |
| ~19:0x | `nguoi-ve-bien-v` qua Cổng 1 — **chữ ký thứ hai cho cùng một cơ chế** |
| 20:44 → 21:24 | `veto-co-dau-vet` hội đồng vòng 1 PASS · vá · re-pin lần 38 |

Hai bên là **hai bản thi công khác nhau**, không phải một mã chép hai chỗ:
lưới chặn-lúc-ghi bên `veto-co-dau-vet` tăng 54→60, bên `nguoi-ve-bien-v`
54→80.

## Quyết định

Giữ **`veto-co-dau-vet`**. Căn cứ là *vị trí*, không phải thứ tự mở: nó đã ở
trạng thái `implemented` với báo cáo bằng chứng, sổ chạy, biên bản hội đồng,
biên bản rà soát và bộ răng riêng; đã qua hội đồng vòng 1 và đã re-pin. Hồ sơ
kia dừng ở Cổng 1 cộng phần engine, chưa có S4. Nhấc engine của bên dừng sang
bên đang chạy là thay một bản đã qua hội đồng bằng một bản chưa — không làm.

`nguoi-ve-bien-v` đóng ở trạng thái **bị thay thế**. Nhánh
`feat/dot2-v-veto-co-dau-vet` xoá; dựng lại từ sha `bbef679` nếu cần.
Tài sản riêng duy nhất của nó — hồ sơ phát hiện lỗ chữ ký — đã chuyển sang
[`2026-08-14-chu-ky-khong-phan-biet-nguoi-may.md`](2026-08-14-chu-ky-khong-phan-biet-nguoi-may.md)
trên mặt phẳng docs, đúng luật «vật docs dùng chung không nằm trên nhánh chết».

## Lớp lỗi — cái đáng giữ lại

**Mở làn mới mà không kiểm làn đang chạy.** Phiên điều phối rà nhánh trên
origin trước khi mở làn, nhưng `feat/veto-co-dau-vet` là **nhánh chỉ ở máy** —
không hiện trong bất kỳ phép rà remote nào. Ảnh chụp kho trong ngữ cảnh phiên
cũng không cứu được: nó được chụp lúc ~17:35, tức sau khi quyết định mở làn đã
xảy ra, nên đọc nó ra thì đã muộn.

Ba điểm nghẽn này thuộc về **điều phối nhiều làn**, cùng họ với bảng «5 nút
thắt» của tài liệu đối chiếu Graph Engineering (13/08):

1. **Phép rà làn phải phủ cả nhánh chỉ-ở-máy** — `git branch` cục bộ và
   `git worktree list`, không chỉ `git branch -r`.
2. **Ảnh chụp kho trong ngữ cảnh phiên không phải nguồn sự thật về thời điểm.**
   Nó có thể được chụp giữa phiên; mọi kết luận dạng «lúc tôi bắt đầu, kho ở
   trạng thái X» phải dựng lại từ nhật ký tham chiếu, không từ ảnh chụp.
3. **Đề bài là vật dùng chung, phải có chỗ khai ai đã nhận.** Hai phiên đọc
   cùng một tệp đề bài mà không có chỗ nào ghi «làn này đã có người», nên cả
   hai đều kết luận đúng rằng việc chưa ai làm.

Giá phải trả lần này: một chữ ký Cổng 1 không đổi kết cục — đúng loại
trạm-thu-phí mà kit tồn tại để triệt — cộng một nhánh thi công bỏ đi.
