# ADR 0013 — Mở thật dưới MIT, và bản chép mô hình cổng phải có răng

2026-09-05 · audit tài liệu (`docs/findings/2026-09-05-audit-tai-lieu-repo.md`).
Repo đã PUBLIC từ lâu trong khi cả hai manifest khai `"license": "Proprietary"`
và không có file `LICENSE` — tức người ngoài **thấy được mà không được dùng**,
hai lời khai mâu thuẫn ở nơi ai cũng đọc. Cùng lúc, `README.md` (tiếng Anh) là
file trôi nhất kho: đóng băng 23/08 qua 101 commit hành vi và 5 mốc phát hành,
viết cho một công chúng có 0 sao, 0 fork và không có giấy phép để dùng kit —
tức nó **không trace được về người hưởng cụ thể nào**, đúng phép thử ba-nguyên-tố
của CLAUDE.md. Ba lối được đặt lên bàn: (A) đóng repo private và TRỪ hẳn README,
(B) mở thật — thêm giấy phép, nhận nuôi bản tiếng Anh lâu dài, (C) giữ public
nhưng khai "all rights reserved" và vẫn TRỪ README. **Owner chọn B**: người
ngoài đội được dùng kit, nên README có người hưởng thật và thôi là ứng viên cắt.
Giấy phép chọn **MIT** — tiền lệ nằm ngay trong kho, `vendor/impeccable`
(Apache-2.0) và `diagram-design` (MIT) đều permissive, nên kit nhất quán với
thứ nó vendor; hai cây vendor giữ giấy phép riêng, nêu đích danh trong `NOTICE` ở gốc — `LICENSE`
giữ **thuần** văn bản MIT vì bộ dò của GitHub trả `NOASSERTION` cho mọi file có
chữ thêm, tức phần công bố quan trọng nhất của lối B sẽ không hiện ra.

Cái giá của B phải trả ngay, nếu không B chỉ là lời hứa: **thêm một mặt phải
giữ đồng bộ** — đúng thứ luật một-nguồn cấm. Và mẹo đã dùng cho lệnh cài
(README/QUICKSTART **trỏ** về GUIDE §5.1) **không tái dụng được**, vì B khai
README là cửa cho người không đọc được tiếng Việt: bắt họ nhảy sang tài liệu
tiếng Việt để biết kit có mấy cổng là hỏng đúng cái vừa quyết giữ. Nên
một-nguồn ở đây đổi sang **hình dạng thứ hai** — nếp `GOAL-TEMPLATE`, tức
**bản-chép-có-răng** thay vì con-trỏ: `GUIDE.md` §0 giữ khối nguồn máy đọc
`<<<GATE-MODEL` (`id/vi/en`) cộng bản chiếu người đọc `<<<GATE-MODEL-VI`;
`QUICKSTART.md` chép bản VI **byte-equal**; `README.md` chép bản EN, so theo
**cấu trúc** (dãy nhãn phải khớp cột `en` của nguồn, đúng thứ tự) vì byte-equal
vô nghĩa qua hai ngôn ngữ. Răng **P86** giữ quan hệ đó: đối chứng dương chạy
trước, rồi năm chiều đỏ — lệch bản VI ở QUICKSTART · lệch bản VI ở GUIDE ·
lệch bản EN ở README · thêm cổng ở nguồn · mất con số ngân sách — **mỗi chiều
gọi tên đúng bản lệch**. Không có răng thì B chỉ là cam kết bằng lời, mà chính
audit này là bằng chứng lời không giữ nổi 101 commit: mô hình bốn cổng xuất
hiện **0 lần** ở README và **0 lần** ở QUICKSTART trước đợt sửa.

**Phương án bị loại và vì sao.** (A)/(C) rẻ hơn — cắt được 21 KB khỏi diện bảo
trì và xoá luôn một bản sao — nhưng chúng trả lời câu «có để người ngoài dùng
không?» bằng **không**, và đó là câu chỉ owner có căn cứ. (Con trỏ một chiều
README → GUIDE) bị loại vì lý do ngôn ngữ nêu trên. (Bỏ răng, chỉ dặn bằng lời
trong CLAUDE.md) bị loại theo đúng luật cấm dặn-bằng-lời làm nghiệm.

**Hệ quả để lại.** README nay là mặt phải nuôi: mọi thay đổi mô hình cổng tốn
thêm một bản EN. Đổi lại, chi phí đó **có răng đo được** thay vì trôi âm thầm —
quên đồng bộ là CI đỏ ngay, kèm tên bản lệch. Chủ thể bản quyền lấy đúng tên đã
khai sẵn trong cả hai manifest (`Manh Phan`); nếu phải là pháp nhân khác thì đó
là sửa một dòng, và nên sửa sớm — giấy phép đã phát hành thì không thu về được.
