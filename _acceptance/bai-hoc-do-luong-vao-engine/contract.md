---
schema_version: 1
feature: Đưa bài học đo lường của tuần 08–14/08 vào engine — bốn lớp lỗi mới có ca đại diện, nguyên tắc lật-allow-list, và một bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn
slug: bai-hoc-do-luong-vao-engine
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: bai-hoc-do-luong-vao-engine

## Context

Ba vòng rà soát đối kháng của hồ sơ `cat-hinh-thuc` (9 phiên, 41 lượt phá ghi
lệnh) sinh ra bốn lớp lỗi chưa có tên trong kho, một nguyên tắc đo lường mới,
và một phát hiện cấu trúc về vùng phủ của `MEASURE-BIRTH-CLAUSE`. Tất cả hiện
chỉ nằm trong **sử liệu hồ sơ** (`review-findings.md`) và một hạt giống
(`docs/plans/2026-08-14-hat-giong-bai-hoc-tuan-do-luong.md`) — tức chúng chết
theo hồ sơ khi ai đó thôi đọc nó.

**Phát hiện đắt nhất, và là lý do hồ sơ này tồn tại:** hai lớp lỗi trung tâm của
cả ba vòng (`doc-drift` — đo chỉ dẫn thay vì đầu ra; `chuoi-thay-quan-he`) **đã
nằm sẵn trong bảng lớp lỗi của `measure-birth.md` trước khi 1a bắt đầu**, và bộ
răng của 1a vẫn dẫm lên cả hai, ba vòng liền. Vấn đề không phải capture thiếu —
capture đang chạy. Vấn đề là **bảng ấy không có răng**: `P177` kiểm bảng CÓ MẶT,
không kiểm bảng có TRACE về sổ nguồn, và không gì buộc một lớp mới trả giá phải
lên bảng.

Hồ sơ này làm đúng ba việc, không hơn: (1) ghi bốn lớp mới vào **sổ nguồn**
(`known-limits-ledger.tsv`), (2) đưa chúng lên **bảng dẫn** trong
`measure-birth.md`, (3) dựng **bánh cóc HAI CHIỀU** buộc hai bên khớp nhau —
để lần sau một lớp trả giá mà không lên bảng thì lưới kêu, chứ không phải một
phiên nào đó tình cờ nhớ ra.

Source input:
[docs/plans/2026-08-14-hat-giong-bai-hoc-tuan-do-luong.md](../../docs/plans/2026-08-14-hat-giong-bai-hoc-tuan-do-luong.md)
· sử liệu [`_acceptance/cat-hinh-thuc/review-findings.md`](../cat-hinh-thuc/review-findings.md)

## Criteria

- AC-1: Given bốn lớp lỗi mới (`tap-so-rong`, `doi-chung-tu-sinh`,
  `mut-khong-qua-chan-that`, `pinned-khong-dem-duoc`), When đọc
  `docs/research/known-limits-ledger.tsv`, Then mỗi lớp có **≥1 dòng** với
  `class` đúng tên ấy, `slug` = `cat-hinh-thuc`, và `note` trỏ về **mã finding
  có thật** trong `review-findings.md` (`Hb` · `He` · `RB3-03` · `RA3-01`).
  Đối chứng: mã finding nêu trong `note` phải tìm thấy được trong tệp ấy.
- AC-2: Given bảng lớp lỗi trong `skills/acceptance/references/measure-birth.md`
  và cột `class` của sổ nguồn, When chạy lưới thường trực, Then **khớp HAI
  CHIỀU**: (a) mọi lớp có dòng SỐNG trong sổ đều có hàng trên bảng; (b) mọi hàng
  trên bảng đều có lớp trong sổ. Lệch bên nào cũng ĐỎ, và thông điệp gọi đích
  danh lớp thiếu/thừa. Đây là chân chính của hồ sơ: bảng tuyên «Nguồn:
  known-limits-ledger.tsv» mà không phép đo nào giữ lời tuyên ấy.
- AC-3: Given `MEASURE-BIRTH-SECTIONS`, When đọc khuôn khai sinh phép đo, Then
  có **mục thứ tư — «Phủ-định-phổ-quát»** dạy: một lời hứa «không X nào, ở bất
  kỳ cách diễn đạt nào» KHÔNG chứng được bằng danh sách chuỗi-cấm; đường chứng
  được là **lật sang liệt cái ĐƯỢC PHÉP** (quét cả lớp + miễn trừ khai trước +
  bánh cóc hai chiều), và phần dư phải khai known-limit kèm **lệnh tái lập**.
  `P177` ghim mục này; xoá nó khỏi bản sao → ĐỎ đích danh tên mục.
- AC-4: Given toàn bộ lưới hiện hành, When chạy sau thay đổi, Then xanh, và
  **bốn đẳng thức số ca** giữ nguyên hoặc khai lại TRƯỚC khi đo. Răng mới đi vào
  THÂN ca sẵn có (TRIM/EXTEND), không mọc ca mới — cùng nếp hồ sơ 1a.

## Coverage

Quét trên trục **vật mang bài học × tầng cưỡng chế**.

- Trục **vật** (3 giá trị): sổ nguồn máy-đọc (`.tsv`) · bản chỉ dẫn được cưỡng
  chế (`measure-birth.md`) · ca thường trực (`P177`). [thước CE: cả ba đã tồn
  tại; hồ sơ này chỉ nối chúng, không sinh vật mới]
- Trục **tầng cưỡng chế** (2 giá trị): lưới thường trực (sống sau merge) ·
  răng-chết-theo-hồ-sơ. [thước CE: bài học 1a — mọi bảo đảm dài hạn phải vào
  lưới thường trực; hồ sơ này **không dựng răng-hồ-sơ nào**]

**Một câu hỏi Cổng 1 dành cho owner, không phải tiêu chí:** vùng trắng của
`MEASURE-BIRTH-CLAUSE` — nó cưỡng chế phép đo mới trong *suite thường trực*,
còn răng-chết-theo-hồ-sơ nằm ngoài vành đai. Hai đường: **(a)** nâng bộ ghi sổ +
luật khai-sinh thành `lib/` dùng chung cho răng-hồ-sơ; **(b)** tuyên thẳng
răng-hồ-sơ là lớp RẺ và mọi bảo đảm dài hạn phải vào lưới thường trực ngay từ
đầu. Kinh nghiệm 1a nghiêng về **(b)** (rẻ hơn, thuận chiều sống/chết theo
merge), nhưng đây là quyết định khó đảo — owner gạch.

## Out of scope

- **Khuôn ba-lăng-kính chấm đối kháng** — viết tay ba lần trong tuần, đáng thành
  reference, nhưng nó là *quy trình chấm* chứ không phải *luật đo*, và đưa vào
  đây là mở rộng phạm vi của một hồ sơ dọn dẹp. Đã ghi trong hạt giống; mở hồ sơ
  riêng nếu owner thấy đáng.
- **Nâng bộ ghi sổ thành `lib/` dùng chung** — chờ owner quyết (a)/(b) ở Cổng 1.
  Làm trước khi quyết là dựng một cơ chế có thể phải gỡ.
- **Sửa lại các bộ răng hồ sơ đã merge** (`cat-hinh-thuc`, `luu-kho-…`) theo luật
  mới — chúng đã chết theo hồ sơ; sửa là đào mộ.
- **Dời mốc ghim của bánh cóc `P161`** — lỗ đã khai hai lần trong sổ
  `asserts-da-go.txt`; nó thuộc hồ sơ khác.

## Notes

- Hồ sơ này là **phép CỘNG vào engine**, nên nó phải trace về ba nguyên tố của
  bản neo. Trace: **nguyên tố 2 — bằng chứng không tự dối**. Người hưởng cụ thể
  là **MÁY**: bốn lớp mới đều là hình dạng «máy tin nhầm chính nó», và bánh cóc
  hai chiều là thứ giữ cho bảng dẫn không trôi khỏi sổ nguồn. Không có nó, lần
  sau một phiên lại trả giá cho một lớp đã có tên.
- **Không hồ sơ nào ở đây được dựng răng-chết-theo-hồ-sơ.** Đó vừa là tiêu chí
  (AC-2/AC-3 đều đo bằng lưới thường trực) vừa là bài học đang được ghi.
