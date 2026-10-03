# Review findings: viec-ke-theo-plan (round 5)

## Trong hợp đồng

(không có finding nào trong hợp đồng)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **uat-session: the new MAP-STAGE block drops the `$PLUGIN_ROOT` fallback that the skill declares for every plugin path**
  Người dùng thấy gì: Nếu phiên nghiệm thu chạy trong môi trường chỉ có biến đường dẫn gói kiểu cũ, bước vẽ lại bản đồ và trang lộ trình sẽ báo lỗi to khi ký, và hai trang đó không được cập nhật theo lần ký. Môi trường chuẩn thì không bị.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **signoff: steps 6 and 7a still treat step 6 as the place where the map is redrawn after the block moved to 7c**
  Người dùng thấy gì: Hướng dẫn ký nghiệm thu còn hai chỗ nói lệch nhau về lúc vẽ lại bản đồ, nên phiên chạy có thể vẽ sớm một lần thừa hoặc nghĩ bản đồ không thuộc commit chữ ký. Kết quả cuối vẫn đúng vì bước sau vẽ lại và đưa vào commit.
  file: `commands/signoff.md`
  severity: low
  Đề xuất: known-limits

- **Signoff: the map is now redrawn in 7c, after the 7b lane, so a full lane always fails `product_map --check` and the signature can never be committed**
  Người dùng thấy gì: Khi bước kiểm trước chữ ký chạy đủ (không được miễn), nó có thể báo bản đồ chưa khớp vì bản đồ mới được vẽ lại ở bước sau. Người ký bị kẹt: không commit được chữ ký và chạy lại vẫn đỏ.
  file: `commands/signoff.md`
  severity: medium
  Đề xuất: new-contract

- **Signoff 7a still says to commit PRODUCT-MAP.md 'ONLY if step 6 actually regenerated it', but step 6 no longer regenerates anything**
  Người dùng thấy gì: Hướng dẫn ký có một câu điều kiện cũ, đọc theo nghĩa đen có thể khiến phiên bỏ bản đồ ra khỏi commit chữ ký. Bước sau vẫn đưa bản đồ vào nên hậu quả thật chỉ là hướng dẫn mâu thuẫn.
  file: `commands/signoff.md`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion without a pinned message): the red check in LT-16-thu-tu only looks at the message prefix, so any of the three error branches can satisfy it**
  Người dùng thấy gì: Phép kiểm thứ tự của khối vẽ lại hiện chỉ xác nhận có báo lỗi gắn tên lệnh, chưa phân biệt lỗi sai thứ tự với lỗi khác. Hôm nay nó vẫn báo đúng lý do, nhưng sau này có thể xanh mà không còn chứng minh được thứ tự.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **kiemKhuon flags dung_tren and moc[].hang of the wrong type, but silently drops a wrong-typed moc, da_bac, non-object milestones and badly formatted dates** (r4)
  Người dùng thấy gì: Nếu kho khai mốc hoặc mục đã bác theo hình dạng khác dự kiến, hoặc gõ ngày sai khuôn, thẻ vẫn in «Hàng trễ: không có» và trang bỏ mốc đó mà không báo gì, nên người đọc tưởng không có gì trễ.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay khớp đúng thứ ca khẳng định): cờ lệch «crm OKR thật» ở hàng 7n là do người viết fixture tự gán** (r3)
  Người dùng thấy gì: Chỗ lệch giữa lời khai và hồ sơ ở hàng 7n trên trang mẫu do người viết mẫu tự đặt, chưa phải một chỗ lệch có thật đo được ở kho crm. Nhãn «thật» của ví dụ này chỉ đúng một phần.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: low
  Đề xuất: known-limits

- **P99 mutant copy extends a hand-written file list instead of copying whole directories** (r1)
  Người dùng thấy gì: Một phép thử cũ của kit có thể báo đỏ nhầm khi sau này thêm một script mới, dù tính năng không hỏng. Người dùng cuối không bị ảnh hưởng, chỉ người bảo trì mất công tìm nguyên nhân.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ô hồ sơ của «crm OKR thật» do tay khai trong `_nguon.ho_so`, cờ lệch ở hàng 7n do chính fixture dựng ra** (r1)
  Người dùng thấy gì: Dữ liệu mẫu mô phỏng lộ trình thật của kho crm được dựng tay, nên việc trang đọc đúng trên mẫu chưa chứng minh đọc đúng trên lộ trình thật. Chỉ khi kho thật chuyển sang tệp mới biết chắc.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
