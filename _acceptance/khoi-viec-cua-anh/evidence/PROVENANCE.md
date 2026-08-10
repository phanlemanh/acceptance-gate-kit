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
