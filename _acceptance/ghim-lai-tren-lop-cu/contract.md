---
schema_version: 1
feature: Làn ghim lại gặp lớp acceptance-gate cũ phải dừng có tên (tệp · export · bản cần · lối đi tiếp --ag-root) thay vì TypeError thô đọc thành làn đỏ
slug: ghim-lai-tren-lop-cu
owner: phanlemanh@gmail.com
risk_tier: T2               # feature-loop/scripts/repin-lane.mjs + tests/scripts/ + _acceptance/config.yaml — không chạm lib/**, hooks/**, pre-merge-check.sh, recheck-evidence.cjs
surfaces: [cli]
status: verified
veto_state: mo
veto_opened_at: 2026-09-11T16:06:06Z
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-09-11-ghim-lai-tren-lop-cu-design.md
---

# Acceptance Contract: ghim-lai-tren-lop-cu

## Context

`feature-loop/scripts/repin-lane.mjs` rút `expectedExits` từ `lib/eval-yaml.cjs` của lớp
acceptance-gate ở `--ag-root` mà không kiểm. Gặp lớp cũ hơn 2.11.0 thì nó sập bằng
`TypeError: expectedExits is not a function` và thoát **1**, trùng mã «LÀN ĐỎ». Tức một bộ máy
cũ bị đọc thành hồ sơ mất tiền đề. Đo 11/09 trong rollout 2.11.0 ở oneflow và media-library
(lớp vendored = kit `0b5c5b37`), tái hiện cục bộ cùng ngày. Hệ quả: repo tiêu thụ chỉ trả được nợ
ghim lại sau khi PR nâng cấp gộp, và muốn đo trên base thì phải tự nghĩ ra cách lách. Người hưởng:
người chạy chiến dịch ghim lại ở repo tiêu thụ, và người đọc kết quả làn. Nguyên tố «bằng chứng
không tự dối».

Source input: owner gọi tên 11/09/2026 («Chạy hai việc kit còn mở») + đo sống ở hai repo tiêu thụ.

Bảng điểm chạm bộ máy của làn sống trong MỘT khối marker `AG-ENGINE-TABLE` của `repin-lane.mjs`
(mỗi hàng: tệp · export · kiểu · bản cần · vì sao). Mọi phép đo dưới đây RÚT hàng từ khối đó lúc
chạy, không chép danh sách tay.

## Criteria

- AC-1: Given kho git tạm code-sinh có một hồ sơ đã ghim và lớp cũ THẬT dựng bằng `git archive 0b5c5b37 lib scripts`, When chạy làn với `--ag-root` trỏ lớp đó (có và không có `--write`), Then làn thoát **2** (không phải 1), stderr gọi tên `lib/eval-yaml.cjs` thiếu `expectedExits`, nêu «≥ 2.11.0», nêu lối đi tiếp `--ag-root` kèm câu «--root vẫn là cây đang đo», và KHÔNG chứa `TypeError`; không suite nào chạy (tệp dấu của suite vắng); `run-log.jsonl` và `evidence-report.md` còn nguyên byte. Đối chứng dương cùng kho: `--ag-root` trỏ cây đang đo → exit 0. Ô cây bẩn: cùng kho với một tệp ĐÃ THEO DÕI bị sửa chưa commit ngoài `_acceptance/`, `--ag-root` = lớp `0b5c5b37` → exit 2 mang thông điệp thiếu export và stderr KHÔNG chứa thông điệp cây bẩn (`cây bẩn ngoài _acceptance/`) — tức cổng bộ máy chạy TRƯỚC kiểm cây sạch; đối chứng dương cùng kho bẩn với `--ag-root` = cây đang đo → đúng thông điệp cây bẩn của hôm nay. Chiều đỏ: bản sao `repin-lane.mjs` hoàn nguyên lối rút không kiểm → trên lớp cũ ra `TypeError`, phép đo ĐỎ ghim «TypeError thô».
- AC-2: Given lớp cũ `0b5c5b37`, When làn dừng, Then tập dòng «thiếu» in ra BẰNG tập kỳ vọng TÍNH LÚC CHẠY (các hàng của khối `AG-ENGINE-TABLE` mà export vắng khi `require()` hai tệp của lớp đó), số dòng bằng số phần tử, mỗi dòng mang bản cần đọc từ bảng (không còn «≥ 2.9.0» ghi cứng cho mục cần 2.11.0). Ô hai-thiếu-cùng-tệp: bản chép trọn cây đang đo xoá HAI export của `lib/evidence-core.cjs` (cả hai đều là hàng của bảng) → cả hai dòng được in. Chiều đỏ: bản sao dừng ở mục thiếu ĐẦU TIÊN của MỖI tệp → ô hai-thiếu-cùng-tệp ĐỎ ghim «thiếu mục cùng tệp».
- AC-3: Given bản chép trọn cây đang đo, mỗi lượt xoá MỘT export của `lib/eval-yaml.cjs` hoặc `lib/evidence-core.cjs` (danh sách đếm lúc chạy bằng `require()`, không gõ tay), chạy trên HAI hồ sơ fixture — hồ sơ mọi eval exit 0 và hồ sơ của AC-4 (eval khai `expected_exit: 2`, trả 2) — When chạy làn `--write`, Then MỌI ô rơi vào đúng một trong hai kết cục: (G) exit 0, recheck xanh, VÀ dòng repin + mục Re-pin vừa ghi BẰNG BYTE bản đối chứng sau khi chuẩn hoá `run_id`/`ts`/ngày; hoặc (N) exit 2, thông điệp gọi tên tệp + export đó, 0 byte bị ghi, không suite nào chạy. Mọi kết cục khác (stack thô, exit 1 sau khi ghi, «đã ghi nhưng recheck-evidence ĐỎ», ghi khác đối chứng) là ĐỎ ghim tên ô và hồ sơ. Số ô bằng số export × 2; lệch → ĐỎ «số ô lệch». Các export làn hoặc recheck gọi phải ra (N). QUAN HỆ: tập tên `core.<X>` và tên rút từ hai tệp lib, trích LÚC CHẠY từ `scripts/recheck-evidence.cjs` + `feature-loop/scripts/repin-lane.mjs`, phải ⊆ tập hàng của `AG-ENGINE-TABLE`. Chiều đỏ: (i) bản sao gỡ `checkRepinEvals` khỏi bảng → ô đó ra «ghi rồi mới đỏ», ĐỎ gọi tên ô; (ii) bản sao recheck-evidence.cjs thêm một lời gọi `core.fakeX` → phép quan hệ ĐỎ gọi tên `fakeX`.
- AC-4: Given lớp LAI thật (trọn cây đang đo, riêng `lib/evidence-core.cjs` lấy từ `04069351` = 2.10.0) và hồ sơ có eval khai `expected_exit: 2` mà lệnh trả 2, báo cáo đã ký ghi 2, When chạy làn `--write`, Then làn dừng exit 2 TRƯỚC khi ghi, gọi tên `lib/evidence-core.cjs: readSignedReportFor` và «≥ 2.11.0». Đối chứng dương cùng hồ sơ trên cây đang đo → làn xanh, ghi `evals_exit` giữ mã 2, recheck xanh. Chiều đỏ: bản sao gỡ hàng `readSignedReportFor` khỏi bảng → trên lớp lai làn GHI rồi recheck từ chối, phép đo ĐỎ ghim «ghi rồi mới đỏ».
- AC-5: Given lớp có đủ tệp nhưng một tệp nạp lỗi (bản chép trọn cây đang đo, `lib/eval-yaml.cjs` bị tiêm lỗi cú pháp), When chạy làn, Then exit 2 với thông điệp «không nạp được lib/eval-yaml.cjs» kèm dòng lỗi đầu, KHÔNG in stack; tệp hồ sơ còn nguyên byte. Đối chứng dương CÙNG kho tạm: bản chép chưa tiêm → exit 0. Chiều đỏ: bản sao bỏ lớp bọc nạp → stack thô, phép đo ĐỎ ghim «nạp không bọc».
- AC-6: Given không truyền `--ag-root`, và `HOME` trỏ một plugin cache code-sinh chỉ chứa `acceptance-gate` là lớp `0b5c5b37`, When chạy làn, Then `resolve-plugin.mjs` chọn lớp đó và làn dừng exit 2 với cùng khuôn thông điệp, cộng câu nói nguồn là plugin cache và lời «cập nhật plugin». Đối chứng dương CÙNG kho tạm: cache chứa bản chép cây đang đo → exit 0. Chiều đỏ: bản sao bỏ nhánh nguồn → thông điệp không nói nguồn, phép đo ĐỎ ghim «không nói nguồn».
- AC-7: Given đúng kho tạm của AC-1 sau khi làn đã dừng trên lớp cũ, When đi lối tiếp RÚT TỪ CHÍNH stderr của lượt dừng — (1) trích dòng `lệnh dò:` khỏi stderr; (2) chạy đúng lệnh đó với cwd = `--root` của kho tạm và `HOME` = plugin cache code-sinh chứa bản chép cây đang đo, lệnh phải exit 0 và in một đường dẫn; (3) dùng ĐÚNG đường dẫn in ra làm `--ag-root` cho lượt `--write` — Then làn xanh, và bên đọc CŨ (`scripts/recheck-evidence.cjs` của lớp `0b5c5b37`, tức bộ đọc CI vendored cũ sẽ chạy) chấm báo cáo vừa ghi → exit 0. Hai chiều đỏ cùng fixture: (a) bản sao làn in lệnh dò với đường dẫn tương đối gốc kit → chạy từ cwd kho tạm ĐỎ, phép đo ghim «lệnh dò không chạy được từ --root»; (b) bản sao làn bỏ `evals_exit` khỏi dòng repin → bên đọc cũ ĐỎ, phép đo ghim chuỗi `recorded no evals_exit`.
- AC-8: Given cây sau hồ sơ, When chạy bốn suite `feature_loop.suite_keys` (scripts · hooks · plugins · workflows) và bản đồ sản phẩm, Then tất cả thoát 0, gồm các ca LN hiện có của `tests/scripts/repin-lane.test.mjs` (làn trên lớp đủ đời không đổi hành vi) và tệp ca mới được suite scripts tự chạy qua glob `*.test.mjs`; VÀ bộ chọn ca của tệp mới sống: mỗi lượt `GLLC_CASES=GLxx` in ĐÚNG MỘT dòng kết quả mang chính `GLxx`, còn `GLLC_CASES=GL99` (khớp 0 ca) thoát khác 0 và in «GLLC_CASES khop 0 ca».

## Coverage

Quét theo preset test-matrix (rút gọn: không gian thiết kế đóng bởi tin gọi tên của owner). Chân
sản phẩm: `[SUY-TỪ-REPO: feature-loop/scripts/repin-lane.mjs · scripts/recheck-evidence.cjs ·
feature-loop/scripts/s4-args.mjs · feature-loop/scripts/carry-plan.mjs · commands/acceptance-init.md]`.
Chân ngành: `[NGÀNH: Terraform required_version]` · `[NGÀNH: npm engines + engine-strict, EBADENGINE]`
cho nếp dừng sớm có tên; `[NGÀNH: MDN feature detection]` cho việc kiểm export thay vì chuỗi version.

- Trục A — điểm chạm bộ máy: nạp tệp | export eval-yaml | export evidence-core làn gọi | export evidence-core recheck gọi | sàn ngữ nghĩa của bên đọc [thước CE: phép QUAN HỆ của AC-3 trích lúc chạy mọi tên `core.<X>` và tên rút từ lib trong `repin-lane.mjs` + `recheck-evidence.cjs`, đòi ⊆ bảng; ma trận xoá-export trên HAI hồ sơ (exit 0 và mã khác 0 đã khai) nên nhánh chỉ chạy khi `evals_exit` khác 0 cũng được với tới; 5/5 có AC — AC-5 · AC-1/2/3 · AC-3 · AC-3 · AC-4]
- Trục B — hình dạng lớp: đủ đời | cũ đồng đời thật (`0b5c5b37`) | lai (evidence-core 2.10.0 cạnh eval-yaml mới) | thiếu một export đơn lẻ | thiếu nhiều export cùng tệp | tệp có mà nạp lỗi | thiếu tệp [thước CE: hai ca đo sống 11/09 (oneflow, media-library) + tiền lệ «CHÉP đè» ở repo tiêu thụ; thiếu tệp đã có `AG_REQUIRES` từ trước — giữ hành vi, gộp khuôn thông điệp; 7/7 — AC-8 · AC-1/2 · AC-4 · AC-3 · AC-2 · AC-5 · khuôn chung AC-2]
- Trục C — nguồn lớp: `--ag-root` tường minh | `resolve-plugin.mjs` từ plugin cache [thước CE: `repin-lane.mjs:60-66`, hai nhánh; 2/2 — AC-1 · AC-6; lệnh dò in trong thông điệp chạy thật ở AC-7]
- Trục D — chế độ làn: không `--write` | `--write` (recheck chạy sau khi ghi) [thước CE: `repin-lane.mjs:169-184`; 2/2 — AC-1 cả hai · AC-3/4/7 `--write`]

Cross-cutting áp mọi ô Core — **thời điểm dừng**: trước kiểm cây sạch (ô cây bẩn của AC-1), trước
mọi suite, trước mọi lần ghi; **mã thoát 2** (nguồn thiếu/hỏng), không bao giờ 1 (làn đỏ).

Ô gạch có lý do: lớp cũ × lối rơi về `expected_exit = 0` → Never (entry d-20260911T155310Z-2); lớp lai ×
`s4-args.mjs` → Later (entry d-20260911T155310Z-5); thông điệp tự dò bản plugin đã cài → Never, không tất định theo
máy (entry d-20260911T155310Z-7); lớp mới hơn cây đang đo (bộ máy tương lai) → Never, feature detection không phân
biệt «mới hơn», chỉ «thiếu».

## Out of scope

- Sửa `feature-loop/scripts/s4-args.mjs:83` (cùng hình dạng rút không kiểm) — đã được che gián tiếp bởi kiểm `parseFlowValue` cùng sàn 2.11.0 với lớp đồng đời (entry d-20260911T155310Z-5).
- Sửa bất kỳ tệp nào dưới `lib/**`, kể cả việc `checkRepinEvals` coi `expectedExits` vắng là Map rỗng (hướng chặt hơn, không fail-open).
- Thêm câu vào SKILL feature-loop hoặc GUIDE §7.1 — thông điệp của script là nguồn duy nhất của lối đi tiếp (entry d-20260911T155310Z-6).
- Rơi về `expected_exit = 0` kèm NOTE khi bộ máy cũ (entry d-20260911T155310Z-2).
- Nâng version plugin — gom theo mốc phát hành.
- Chạm hồ sơ hay lớp vendored của repo tiêu thụ nào — kit là engine, repo tiêu thụ nhận qua bản phát hành.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl` (xem skill feature-loop — repo chưa dùng feature-loop thì bỏ qua).

## Notes

- **Vòng meta, owner gọi tên.** Việc sửa thước của kit (làn ghim lại). Mở theo luật chiều rộng (b) của CLAUDE.md: tối đa MỘT vòng meta giữa hai release, chỉ khi owner gọi tên; owner gọi tên 11/09. Neo ngoài có thật: nợ ghim lại ở oneflow và media-library.
- Không mở dưới luật NỚI 2026-09-07: đây là sửa lỗi của một bộ phận có sẵn (trace nguyên tố 2), không phải CỘNG; không thêm lượt gọi người.
- Mốc `0b5c5b37` và `04069351` là mốc git BẤT BIẾN của chính kho kit — fixture lớp cũ không trôi theo main. Ca cần lịch sử đầy đủ; CI kit đã `fetch-depth: 0`.
- Lệnh dò in trong thông điệp dừng dùng đường dẫn TUYỆT ĐỐI tới `resolve-plugin.mjs` (suy từ vị trí script), vì người chạy đứng ở `--root`, không ở gốc kit. `resolve-plugin.mjs` chỉ kiểm tệp có mặt, không kiểm export: nó có thể in một bản đã cài vẫn cũ — khi đó lượt kế dừng lại với CÙNG khuôn thông điệp có tên, không bao giờ lặng.
- Hồ sơ này KHÔNG có `opportunity.md`, nên không có mục `## Đường đo`.
- Giới hạn khai: cổng kiểm bộ máy phát hiện «thiếu», không phát hiện «có mà khác nghĩa» ngoài sàn `readSignedReportFor`; phần «đọc có mặc định» (`?.`/`??`) trong làn được lưới bằng so-byte ở ô (G) của AC-3. Ngưỡng mở lại đang đếm: một lượt làn đo sai vì một export CÓ MẶT mà khác nghĩa.
- **Known limits (owner quyết ở Cổng Bằng chứng 12/09, «ghi Known limits»):**
  - Cổng kiểm bộ máy chỉ phủ export của `lib/`, KHÔNG phủ số tham số bên gọi ở `scripts/recheck-evidence.cjs`. Lớp lai `lib/` mới + `scripts/` cũ vì thế vẫn lọt: làn GHI hồ sơ xong rồi mới đỏ ở bước tự kiểm, và thoát 1 trùng mã «LÀN ĐỎ». Dựng lại được bằng `cp -R lib` của cây hiện tại cộng `git archive 04069351 scripts`. Ngưỡng mở lại đang đếm: một lượt làn ở kho tiêu thụ dính đúng lớp lai này.
  - Chốt đếm ô của ca GL03 lấy số đếm so với chính nó nên không bao giờ đỏ; chốt đếm theo bảng `AG-ENGINE-TABLE` ngay cạnh vẫn còn răng. Ngưỡng mở lại: một lần bảng lệch thật mà ca vẫn xanh.
