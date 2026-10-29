---
schema_version: 1
feature: Bước đối chứng của lượt chấm S4 chạy lại các lệnh máy trên commit gốc và phân loại được eval xanh cả hai phía, không còn BLOCKED vì tác tử đối chứng thiếu công cụ ghi tệp
slug: doi-chung-chay-duoc
owner: phanlemanh@gmail.com
risk_tier: T2               # feature-loop/workflows/** + tests/workflows/** + _acceptance/config.yaml — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-29-doi-chung-chay-duoc-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-29T05:53:30Z
---

# Acceptance Contract: doi-chung-chay-duoc

## Context

Gốc: hàng TC6 của `docs/plans/lo-trinh-kit.json` (ô `_acceptance/doi-chung-chay-duoc/opportunity.md`, Cổng Đáng `build`
29/10). Từ 23/10 đề bài làn đối chứng S4 bảo tác tử «dùng công cụ ghi tệp (Write)», mà vai ấy chạy bằng loại tác tử
`feature-loop:cham-lenh` chỉ có Bash, Read, Grep, Glob — mọi lượt chấm ở mọi kho ra «No such tool available: Write»,
đối chứng không chạy dòng nào (kho tiêu thụ báo trên 2.35.0; kit: FL5, `_acceptance/design-floor-moc-s3-s4/`). Nghiệm:
kit sinh sẵn LỆNH GHI tệp kịch bản (heredoc + dấu kiểm), tác tử chỉ gọi Bash; tác tử chấm vẫn không cầm bút.

## Criteria

- AC-1: Given lượt chấm có ít nhất một lệnh máy có eval, When bộ chấm dựng đề bài làn đối chứng, Then đề bài mang đúng
  một khối lệnh ghi mở bằng `mkdir -p` và heredoc có nháy vào đúng tệp mà lời gọi `bash '<tệp>'` nêu, dòng cuối so
  `cksum` với số kit tính sẵn và lệch thì đổi tên tệp `.sai` (không `rm`), đề bài dặn đúng hai lời gọi Bash và không
  nhắc công cụ ghi hay sửa tệp nào.
- AC-2: Given kho git thật có commit gốc, When chạy NGUYÊN VĂN lệnh ghi rồi lời gọi trong bash và trong zsh, Then tệp kịch
  bản bằng thân heredoc cộng một dòng mới từng byte, lệnh ghi in `__BL_GHI dung <số kit tính>`, lời gọi in đủ dấu bắt đầu
  · kết quả trên gốc · kết, worktree tạm đã gỡ, cây đang kiểm không bẩn, và mọi tệp mới (kể cả tệp git bỏ qua) nằm dưới
  `.acceptance-runs/` — vùng tạo phẩm của lượt chấm; thư mục lượt dời ra ngoài vùng ấy thì phép này đỏ.
- AC-3: Given lệnh ghi bị chép lệch một byte hoặc thiếu một dòng, When tác tử chạy nó rồi lời gọi, Then tệp lời gọi không
  còn (đã đổi tên `.sai`), kịch bản không chạy dòng nào, lượt chấm ghi lý do hạ tầng «tác tử chép kịch bản đối chứng sai»
  kèm hai dấu kiểm, một dòng run-log `baseline-khong-do` với `chua_chay: true`, không dòng `kind: baseline`, cây sạch;
  chép lành trên cùng kho → không lý do, có dòng `kind: baseline`. Bộ đọc mặc định KHÔNG tin: kịch bản đã chạy mà thiếu
  dòng `__BL_GHI dung` mang đúng số kit tính (tác tử bỏ dòng so, thay nó bằng `echo`, hay mất dòng mở) → lý do hạ tầng có
  tên, không dòng `kind: baseline`, không phân loại eval nào; lời gọi ghi bị từ chối → lý do và dòng `baseline-khong-do`
  mang nguyên chữ từ chối.
- AC-4: Given kho mẫu có eval E1 xanh ở gốc và ở đầu, và tác tử chỉ-Bash mang bộ công cụ đọc từ `cham-lenh.md`, When chạy
  trọn lượt chấm, Then E1 nằm trong danh sách không phân biệt, cột đối chứng của nó trong đề bài tổng hợp là `green`, và
  dòng `kind: baseline` ghi lệnh của E1 vào `non_discriminating`.
- AC-5: Given cùng lượt mẫu với eval E2 đỏ ở gốc và xanh ở đầu, Then E2 không nằm trong danh sách không phân biệt, cột
  đối chứng là `red`, lượt không có lý do hạ tầng hay dòng `baseline-khong-do`, verdict PASS.
- AC-6: Given cùng kho mẫu và cùng tác tử, When chạy bộ chấm của commit `d3cfca5c` (trước bản sửa), Then lượt ghi lý do
  hạ tầng «chưa chạy dòng nào» mang đúng chữ «No such tool available: Write», dòng `baseline-khong-do` với
  `chua_chay: true`, không eval nào được phân loại và mọi cột đối chứng là `n-a`.
- AC-7: Given lượt chấm đủ mọi vai (máy · giao diện · hội đồng · tìm lỗi · phản bác · phân loại · đối chứng · xuất xứ ·
  tổng hợp), When đối chiếu đề bài mỗi tác tử với bộ công cụ của loại tác tử của vai ấy đọc từ
  `feature-loop/agents/*.md`, Then không đề bài nào nhắc công cụ vắng; vai đối chứng vẫn là `feature-loop:cham-lenh` và
  loại ấy không có Write, Edit, NotebookEdit.
- AC-8: Given một lệnh eval nhiều dòng có một dòng trùng dấu kết heredoc mặc định, When bộ chấm sinh lệnh ghi, Then dấu kết
  đổi sang tên chưa có trong kịch bản và kịch bản chạy lệnh ấy trọn, phép đo trọn.

- AC-9: Given bản ghi đầu ra NGUYÊN VĂN của hai tác tử `feature-loop:cham-lenh` thật — một nhận đề bài mới cho 8 lệnh eval
  của hồ sơ này (cỡ thật), một nhận đề bài của `d3cfca5c` — ở `_acceptance/doi-chung-chay-duoc/evidence/tac-tu-that.json`,
  When phát lại qua đúng bản bộ chấm đã sinh đề bài (blob ghim trong bản ghi), Then đầu ra mới mang dòng
  `__BL_GHI dung` đúng số kit tính, đủ dấu cho từng lệnh, bộ đọc không gắn lý do hạ tầng và ghi dòng `kind: baseline`;
  đầu ra cũ không có dấu `__BL` nào và bộ đọc cũ ghi «chưa chạy dòng nào»; bản ghi lệch một chữ số dấu kiểm → bộ đọc
  không tin.

## Coverage

Bỏ quét không gian bằng `morphological-scan` — entry descope `bỏ coverage-scan` trong `decisions.jsonl`. Không gian của
vòng là MỘT trục đã chốt bởi câu giao hàng TC6: bốn vế của «bật khi» (không-phân-biệt · phân-biệt · đối chứng bản cũ ·
không cầm bút) → AC-4, AC-5, AC-6, AC-7. Các AC còn lại là chiều hỏng của chính nghiệm (hình dạng đề bài AC-1, shell thật
AC-2, chép sai AC-3, dấu kết va chạm AC-8) rút từ số đo tác tử thật 29/10 trong design doc; AC-9 đặt hành vi tác tử
thật ở cỡ thật vào bộ kiểm (gap-probe F2) — các AC kia dùng bộ mô phỏng tất định.

## Đường đo

Ngưỡng ở `opportunity.md` (một câu bốn vế) — mỗi vế một thước:

- «eval xanh cả trên commit gốc → báo cáo ghi không-phân-biệt» · số từ `nonDiscriminating` + cột `baseline:` của đề bài
  tổng hợp + dòng `kind: baseline` · AC-4.
- «eval đỏ ở gốc xanh ở đầu → phân biệt» · cột `baseline: red` · AC-5.
- «bản workflow cũ trên cùng mẫu ra BLOCKED đúng thông điệp» · `baselineKhongDo.haTang` + dòng `baseline-khong-do` của bộ
  chấm `d3cfca5c` · AC-6.
- «tác tử chấm vẫn không cầm bút» · bộ công cụ của `feature-loop/agents/cham-lenh.md` + bảng vai → loại · AC-7; «ghi vào
  cây kho» · `git status --ignored` trước/sau lượt — mọi tệp mới dưới `.acceptance-runs/` · AC-2.
- Hành vi trên tác tử thật · bản ghi phát lại qua bộ đọc thật · AC-9.
- Reality (không phải AC): lượt chấm S4 của chính vòng này và các lượt sau ở kho tiêu thụ — `run-log.jsonl` không còn dòng
  `baseline-khong-do` mang «No such tool available: Write»; đọc bằng `grep -c` trên run-log của từng hồ sơ.

## Out of scope

- Ca từ chối của chế độ cô lập worktree 23/10 («too complex to verify…»): 29/10 không tái hiện được ở phiên worktree lẫn
  tác tử `isolation: worktree` (khối lệnh trơn đều chạy) — lời gọi `bash '<tệp>'` giữ nguyên như bản 23/10, không đo lại.
- Trao công cụ ghi tệp cho vai chấm, hay một loại tác tử mới có bút cho riêng làn đối chứng (descope có tên).
- `s4-args.mjs` ghi sẵn tệp kịch bản trước lượt chấm (hai bên viết phải giữ khớp; descope có tên).
- Móc chặn lệnh nặng của gói điều phối đọc cả thân heredoc: lệnh eval gọi thẳng lệnh chấm/ghim lại/đường nền của kit có
  thể làm bước ghi bị chặn trong đợt — chưa gặp, khai ở Notes.
- Ghim lại hồ sơ đã ký mà bộ kiểm của chúng đổi khuôn rút kịch bản — việc của chiến dịch ghim lại ở mốc phát hành.

## Notes

- Hồ sơ này THAY ca BW1e của bản 23/10 (`tests/workflows/baseline-worktree-co-lap.test.mjs`): ca ấy ghim chữ «Write» trong
  đề bài; nay ghim lời gọi Bash ghi đúng tệp. Hợp đồng của các hồ sơ đã ký không sửa.
- Giới hạn: AC-1..AC-8 dùng bộ mô phỏng tất định; hành vi tác tử thật nằm ở AC-9 (một bản ghi, cỡ 8 lệnh — ở gốc cả 8 ra
  `bo-qua` vì tệp ca là tệp mới; lệnh chạy thật trên gốc được đo ở AC-2). Bản ghi ghim blob bộ chấm đã sinh nó: vòng sau
  sửa bộ chấm không làm AC-9 đỏ, nhưng cũng không chứng lại bản mới — đổi lệnh ghi thì ghi lại bản ghi. Bộ canh lệnh của Claude Code đọc cả thân heredoc thì bước ghi bị từ
  chối — làn rơi về «chưa chạy dòng nào», thẻ Cổng 2 nói ra (cờ đối chứng có sẵn). Ngưỡng mở lại: ≥1 lượt chấm sau bản
  này có dòng `baseline-khong-do` mang chữ từ chối của bộ canh hay của móc điều phối.
