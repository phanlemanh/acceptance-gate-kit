# Xuất xứ ba thẻ bằng chứng (đầu vào của E7)

Ba file `p185-card-gate1.html`, `p186-card-gate2.html`,
`p187-card-gate2-reject.html` KHÔNG viết tay: chúng là bản render của chính
`scripts/gate-card.js` trong cây này, sinh bằng

```
bash tests/plugins/fixtures/render-viec-cua-anh-cards.sh _acceptance/khoi-viec-cua-anh/evidence
```

Kịch bản fixture nằm ở `tests/plugins/fixtures/viec-cua-anh-scenarios.sh` —
CÙNG file mà case P185/P186/P186b/P187 source, nên máy đo và hội đồng chấm
không thể trôi khỏi nhau.

Quan hệ này có RĂNG, không chỉ là lời văn: case **P190** sinh lại ba file trong
chính lần chạy suite rồi so **byte-đối-byte** với ba file check-in; lệch là đỏ,
kèm chiều đỏ đổi-một-byte để chứng minh phép so phân biệt được.

Sinh lần cuối tại: 9b595d5e5888c9b192bcd359d22e021ded190d74 (2026-08-10T22:45:40Z)

Sinh lại 2026-08-14 trên nền 0b1e61945c73 — hồ sơ `cat-hinh-thuc` gỡ lời hứa
`· ~5 phút` khỏi phụ đề thẻ ở CẢ HAI cổng (kit thôi đo phút người). Đây đúng
là lý do ba tệp này KHÔNG được đóng băng: renderer đổi thì bản hội đồng chấm
phải đổi theo, nếu không judge chấm một cái thẻ không còn tồn tại. Diff đúng
hai dòng phụ đề, không dòng nào khác.
