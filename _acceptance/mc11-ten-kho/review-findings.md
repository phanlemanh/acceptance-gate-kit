## Trong hợp đồng

- **MCK-3: the red-direction check can never go red**
  file: `_acceptance/mc11-ten-kho/rang/chieu-do.sh:46`
  severity: low
  AC: AC-3
  source: bugs
  detail: MCK-3 first greps the source file for the DONG_BANG literal. It then calls pha, which replaces the substring "kho: 'acceptance-gate-kit' }, { moc: 'Tinh chỉnh" in the copy and greps again. That substring is part of DONG_BANG, and pha requires it to match exactly once or it exits 3. So whenever the first grep passes, the only occurrence of the substring sits inside DONG_BANG, and replacing it always removes DONG_BANG from the file. The branch hong "MCK-3 phép kiểm ca bảng không đỏ khi dòng ca bảng bị đổi", which is the red direction E3 promises ('phép kiểm không đỏ khi dòng bị phá trên bản sao thì FAIL: MCK-3 phép kiểm ca bảng không đỏ'), is unreachable by construction. The mutation comes from the same constant the check uses, so it only shows that grep -F works. It does not show that the test file would catch a changed table-case line. The part of AC-3 that actually runs the code is in MCK-4 (MC-6 goes red at gach-va-ngoac), so in practice MCK-3 only checks that a literal exists in the source. Its PASS adds no red-direction evidence of its own, and its counterpart in E3 can never happen. I ran the script: 5 passed, exit 0. That run cannot tell this case apart from a check that never ran.
  rationale: AC-3 hứa đích danh rằng phép kiểm dòng ca bảng đỏ khi dòng ấy bị đổi trên bản sao; finding nói nhánh đỏ đó không thể xảy ra, nên vế này của AC-3 không được chứng minh. Mục Out of scope không loại phần này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
