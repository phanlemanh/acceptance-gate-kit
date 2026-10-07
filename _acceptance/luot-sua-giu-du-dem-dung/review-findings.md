# Review findings: luot-sua-giu-du-dem-dung (vòng 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Carry now includes findings on files the fix changed, but a fresh finding with the same key is still dropped before triage, and the comment that justified that is now false**
  Người dùng thấy gì: Khi lượt sửa chạm một tệp, lỗi cũ trên tệp đó được giữ lại như mục ngoài hợp đồng. Nếu lỗi ấy giờ đã thành lỗi thật trong hợp đồng do chính bản sửa gây ra, nó có thể bị coi là mục đã có và không kéo kết quả xuống từ chối, người quyết chỉ thấy nó như một mục cũ.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **s4-args copies the hook's observed rule (≥20 chars) without placeholder stripping, so it can carry a frame that the L2 OBSERVED hook will then block**
  Người dùng thấy gì: Nếu khung nhìn-thấy của lượt trước chỉ là dòng mẫu chưa điền, kit vẫn chép nó sang lượt sau và báo cáo bị chặn ở bước kiểm bằng chứng. Hậu quả là báo cáo bị dừng rõ ràng và người phải điền lại, không có kết quả sai lọt qua.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **Duplicated header comment block in thuoc-vat.mjs**
  Người dùng thấy gì: Một đoạn giải thích trong phần đầu của công cụ đếm bị chép hai lần. Người dùng không thấy khác biệt nào, chỉ người đọc mã thấy rườm.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: wont-fix

- **The OOC_ITEM_TEMPLATE comment is separated from the constant it describes**
  Người dùng thấy gì: Một đoạn ghi chú nằm xa chỗ nó mô tả, nên người sửa sau có thể đọc sót. Không ảnh hưởng gì tới kết quả người dùng nhận.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: wont-fix

- **The evals.yaml header lists the wrong set of ACs for each test file**
  Người dùng thấy gì: Dòng đầu của danh sách bài đo ghi sai bài nào nằm ở tệp nào. Các bài đo thật vẫn chạy đúng, chỉ phần chú thích gây hiểu nhầm cho người đọc.
  file: `_acceptance/luot-sua-giu-du-dem-dung/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Carry pulls out-of-contract findings from an invalidated run of the same round (phantom items on reverted files)**
  Người dùng thấy gì: Nếu lượt chấm trước bị vô hiệu rồi chạy lại cùng số lượt, những lỗi do lần chạy vô hiệu ghi nhận vẫn được mang sang. Người quyết sẽ thấy ở thẻ cổng cuối các mục về tệp không còn tồn tại và phải tự phân xử chúng.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: new-contract

- **A carried 'tệp đã đổi' item cannot be struck: the documented remedy is overwritten next round**
  Người dùng thấy gì: Hướng dẫn nói người có thể gạch một mục cũ đã hết, nhưng lượt sau mục đó lại hiện lên vì kit đọc từ sổ chạy chứ không đọc chỗ người gạch. Một lỗi đã được sửa vẫn nằm mãi trên thẻ quyết định và có thể buộc vòng dừng chờ người.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
