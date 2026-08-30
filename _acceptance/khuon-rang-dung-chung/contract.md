---
schema_version: 1
feature: Khuôn răng dùng chung — ba chốt cứng để bộ đo hồ sơ không tự dối
slug: khuon-rang-dung-chung
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
status: draft
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-30T00:42:00Z
---

# Acceptance Contract: khuon-rang-dung-chung

## Context

Phiên 29/08: luật dừng-vá bật ba lần, cả ba vì cách viết phép đo — chiều đỏ
kết luận từ mã thoát trần, fixture bị thay ngầm qua biến dùng chung, hạ tầng
hỏng cho cùng màu với đạt, bước tiêm không tác dụng mà vẫn im, và lệnh chạy
với đường rỗng đụng vào kho thật. 43 bộ răng / 10.160 dòng bash, mỗi bộ tự chế
phần móng. Dặn-bằng-lời đã chứng minh vô hiệu (cả ba hình dạng đầu tái phát
SAU khi ghi sổ). Vòng này đưa móng vào MỘT thư viện với ba chốt máy giữ.

Source input: opportunity.md (Cổng Đáng build — Manh Phan 2026-08-30)

## Criteria

- AC-1: Given một chân dùng khuôn, When bất kỳ bước móng nào hỏng (chép cây thất bại, bản sao thiếu vật được kiểm, bước tiêm nổ), Then chân đó kết thúc ĐỎ qua đúng một bộ đếm của khuôn — không tồn tại đường nào trong thư viện chỉ in chữ rồi vẫn cho chân «passed».
- AC-2: Given một bước tiêm đột biến qua khuôn, When file sau tiêm KHÔNG khác file trước tiêm (băm bằng nhau), Then khuôn tính đỏ với thông điệp nêu «mutant không tác dụng» — bước tiêm im lặng hết đường tồn tại.
- AC-3: Given một ca chiều-đỏ qua phép vi phân của khuôn, When CÙNG một lệnh chạy trên bản gốc và bản tiêm cho kết quả GIỐNG NHAU (mã thoát và đuôi đầu ra), Then khuôn tính đỏ «ca không phân biệt được hai bản»; và Given hai kết quả khác nhau, Then khuôn cho đi tiếp để chân tự ghim nội dung bản tiêm — vi phân là SÀN, không thay thế ghim thông điệp.
- AC-4: Given lệnh git trên fixture qua khuôn, When đường dẫn rỗng hoặc không trỏ vào một repo git, Then khuôn TỪ CHỐI chạy và tính đỏ — không lệnh nào rơi về thư mục hiện tại (kho thật).
- AC-5: Given bộ răng thật `nhanh-chinh-khong-ten-main/rang.sh` được viết lại theo khuôn, When chạy trọn các chân của nó, Then mọi chân xanh như trước VÀ các mutant cũ của nó vẫn bị bắt (chiều đỏ còn nguyên lực) — «giữ nguyên khả năng bắt lỗi» đo bằng quan hệ chạy thật, không bằng lời.
- AC-6: Given giao diện của khuôn, When phép đo hoặc bộ răng rút danh sách hàm, Then danh sách sống trong MỘT khối marker (`RANG-KHUON-API`) trong chính thư viện — bên dùng và bên đo không gõ tay danh sách riêng.
- AC-7: Given round có mốc mang-sang (`--carry-anchor`) và bản sửa chỉ chạm MÃ THỰC THI trong thư mục hồ sơ (`.sh`/`.mjs`), When `s4-args.mjs` tính danh sách file đổi, Then phép loại trong thư mục hồ sơ ĐẢO MẶC ĐỊNH: chỉ LOẠI các đuôi GIẤY đã biết (`.md`, `.jsonl`, `.yaml`, `.json`, `.html`, `.png`, `.txt`), còn MỌI đuôi khác (kể cả `.sh`, `.mjs`, `.cjs` và đuôi chưa biết) ĐƯỢC GIỮ — nên eval khai `paths` chạm chúng phải chạy lại; và Given bản sửa chỉ chạm hồ sơ giấy, Then vẫn loại như cũ — sửa giấy không đốt lượt chấm. Không đoán về phía carry khi gặp đuôi lạ.

## Coverage

- Trục chốt của khuôn: đếm-một-bộ (AC-1) | tiêm-phải-tác-dụng (AC-2) | vi-phân (AC-3) | cửa-đường-rỗng (AC-4). [thước CE: đúng 5 hình dạng tự-dối đã đo trong opportunity — bốn chốt phủ 5 hình dạng: hình 1+2 → AC-3, hình 3 → AC-1, «tiêm im lặng» → AC-2, hình 5 → AC-4]
- Trục tầng vật: thư viện (AC-1..AC-4, AC-6) | bộ răng thật viết lại (AC-5) | bước mang-kết-quả-sang của s4-args (AC-7). [thước CE: ba vật giao của design doc]
- Trục chiều bằng chứng: mỗi AC máy có cặp hai chiều cùng fixture theo MEASURE-BIRTH, khai trong `expected`.

## Đường đo

Ngưỡng ở opportunity → tiêu chí:
- «Ba chốt có ca chứng minh chúng ĐỎ đúng lúc, kèm đối chứng dương» — AC-1..AC-4, đo ở lưới thường trực.
- «Một bộ răng thật viết lại theo khuôn, xanh mà vẫn bắt được lỗi cũ» — AC-5.
- Cửa CHẾT «phải quay về dặn-bằng-lời» — chặn bằng chính hình thức của AC-1..AC-4: tất cả là hành vi máy của thư viện, không mục nào là câu dặn trong tài liệu.

## Out of scope

- KHÔNG migrate 42 bộ răng còn lại; KHÔNG ép hồ sơ mới dùng khuôn bằng lưới (điều khoản khuyến nghị trong tài liệu là đủ cho vòng này — ép bằng máy là vòng sau, khi khuôn đã chứng minh qua ≥2 hồ sơ).
- KHÔNG đóng bốn hạn chế sản phẩm của `s4-args.mjs` (remote hỏi-không-được · ngôn ngữ máy chạy · hướng dẫn cũ · dòng khai nguồn «null») — ô riêng sau khuôn.
- KHÔNG sửa lẻ ~10 mục chất-lượng-phép-đo đã gom trong ô.
- ĐÓNG BĂNG HÀNG ĐỢI đang hiệu lực (owner 30/08): phát hiện mới của vòng này chỉ vào sổ/ô.

## Notes

- Hạng T2 — khai tường minh vì dễ tranh cãi: `scripts/rang-khuon.sh` KHÔNG nằm trong `t3_paths` (lõi cưỡng chế là hooks/lib/pre-merge/recheck). Lỗi ở khuôn làm hỏng bộ đo của HỒ SƠ dùng nó — tệ, nhưng phạm vi là hồ sơ opt-in, không phải false-green im lặng trên cổng của mọi repo tiêu thụ. Nếu sau này khuôn được cưỡng chế cho mọi hồ sơ thì phải nâng vào t3 cùng lượt.
- **Mốc BASE-KRDC (bất biến, cho AC-5/E5):** bản rang.sh TRƯỚC viết-lại là bản tại commit `5cd3bc68` — danh sách ca chiều-đỏ cũ RÚT từ `git show 5cd3bc68:_acceptance/nhanh-chinh-khong-ten-main/rang.sh`, tập kỳ vọng ĐÓNG, không neo mốc di động.
- Viết lại rang.sh của hồ sơ ĐÃ KÝ (`nhanh-chinh-khong-ten-main`): được ngưỡng của ô này bảo trợ («một bộ răng thật»), và mọi chân được chạy lại làm bằng chứng TƯƠI trong vòng này — không đứng trên bằng chứng cũ.
