---
schema_version: 1
feature: Cổng Đáng có cửa — thẻ cổng thứ ba + ký một lượt bằng lệnh duyệt sẵn có
slug: cong-dang-co-cua
owner: phanlemanh@gmail.com
risk_tier: T2      # T2 (chuẩn) | T3 (auth/dữ liệu/API phá vỡ)
surfaces: [cli]    # api | cli | sdk | ui | mobile — ngăn cách bằng dấu phẩy
status: implemented # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: Manh Phan
approved_at: 2026-09-01T02:42:37Z
---

# Acceptance Contract: cong-dang-co-cua

## Context

Cổng Đáng là nơi owner quyết «có làm việc này không» — quyết định chốt ý định
TRƯỚC khi làm. Ba cổng người còn lại đều có nghi thức đứng tên; cổng này không,
nên nghi thức vào phiên bàn giao nó sang bộ dựng thẻ vốn chỉ biết hai cổng kia,
và người được mời ký gặp một lời từ chối chỉ ngược thứ tự của chính kit. Vòng
này lắp làn thẻ thứ ba, dạy chốt «không có hồ sơ thì không vẽ thẻ» phân biệt
thêm hai ca, và mở chế độ ký Cổng Đáng trên lệnh duyệt sẵn có — không thêm lệnh
thứ bảy.

Source input: `_acceptance/cong-dang-co-cua/opportunity.md` (ký «làm» 2026-09-01,
commit `eb4c8b20`) · design doc
`docs/superpowers/specs/2026-09-01-cong-dang-co-cua-design.md`

## Criteria

- AC-1: Given một xưởng dựng BẰNG CODE trong chính lần chạy, chứa mỗi trạng thái
  DỰNG ĐƯỢC-TRONG-XƯỞNG của bảng lát cắt §3 design doc một ô (ô 3–10; ô 1 và ô 2
  là thuộc tính của GỐC CÂY chứ không của một ô, nên do AC-6 phủ), When chạy
  `scripts/start-scan.mjs` rồi `scripts/gate-card.js` trên CÙNG cây đó, Then gọi
  A = tập slug bộ quét xếp `gate: "dang"` và B = tập slug bộ dựng vẽ ra thẻ Cổng
  Đáng, ta có **A ⊆ B** (một chiều — mọi ô được gửi tới cổng đều vẽ được; hiệu
  `A \ B` phải RỖNG và in ra bằng TÊN SLUG khi không rỗng), **và** phần dôi hợp
  lệ `B \ A` bằng ĐÚNG tập ô đã dựng ở nấc ngưỡng chưa chốt — không nhiều hơn,
  không ít hơn. Đẳng thức hai chiều là SAI theo thiết kế (bất biến B2, §2 design
  doc): bộ dựng cố ý vẽ cho ô «đang cân nhắc» mà bộ quét không xếp vào cổng.
- AC-2: Given bốn ô code-sinh phủ TOÀN PHẦN bốn nấc ngưỡng mà
  `lib/nguong-o-co-hoi.cjs` phân biệt (chưa chốt · `[đề xuất]` · đã chốt · khai
  «Không đo được — »), mỗi ô có `opportunity.md`, `decision` rỗng,
  `stage: discovery`, When chạy bộ dựng thẻ trên từng ô, Then cả bốn đều vẽ ra
  thẻ Cổng Đáng chứ KHÔNG lời từ chối nào, và mỗi nấc cho đúng bộ ba của nó:
  cờ đỏ ngưỡng chỉ hiện ở nấc **chưa chốt**; dấu «máy đề xuất» hiện trên chính
  dòng ngưỡng chỉ ở nấc **`[đề xuất]`**; nấc **khai «Không đo được — »** hiện
  như một lối khai hợp lệ và KHÔNG bị cắm cờ đỏ. Nấc rút từ lib, không gõ tay.
- AC-3: Given cây có cả chốt «không có hồ sơ thì không vẽ thẻ» lẫn làn Cổng
  Đáng, When gọi bộ dựng thẻ cho một ô đang chờ Cổng Đáng, Then thẻ vẽ ra được —
  tức nhánh nhận cổng chạy TRƯỚC chốt, không bị chốt nuốt.
- AC-4: Given một ô có `opportunity.md` mà `decision` là `park` hoặc `kill`,
  hoặc `stage: archived`, When gọi bộ dựng thẻ, Then nó thoát khác 0 với lời
  thuật nói ý đã đóng, và lời thuật đó KHÔNG chứa câu mời đi viết hợp đồng.
- AC-5: Given một ô có `opportunity.md` mang field điều hướng ngoài từ vựng
  (`stage` hoặc `decision`), When gọi bộ dựng thẻ, Then nó thoát khác 0 nêu TÊN
  field hỏng, và KHÔNG nhận nhầm ô đó thành thẻ Cổng Đáng.
- AC-6: Given ba trạng thái cũ — không có xưởng · không có thư mục hồ sơ · thư
  mục hồ sơ không chứa cả hợp đồng lẫn ô cơ hội, When gọi bộ dựng thẻ, Then ba
  lời thuật cũ giữ NGUYÊN VĂN và vẫn phân biệt được nhau từng đôi một.
- AC-7: Given khối marker khai các hằng thông điệp từ chối trong
  `scripts/gate-card.js`, When đọc bước tiền đề của `commands/acceptance-card.md`,
  Then số lời thuật riêng trong bước đó BẰNG số hằng rút được từ khối marker, và
  mỗi hằng ghép đúng MỘT lời thuật — không hằng nào thiếu lời thuật, không lời
  thuật nào không rút được từ một hằng.
- AC-8: Given một ô đang chờ Cổng Đáng, When render thẻ, Then thẻ in đúng bốn
  lối ra `làm` · `lặp` · `xếp lại` · `dừng` và một dòng nói đảo ngược được.
- AC-9: Given một ô đang chờ Cổng Đáng có `decision` rỗng, When render thẻ và
  khi chạy `--extract`, Then không đầu ra nào chứa một giá trị `decision` được
  điền sẵn, và `opportunity.md` trên đĩa KHÔNG bị sửa — thẻ là lớp trình bày,
  nó không ghi gì. (judgment)
- AC-10: Given bốn nhãn lối ra của Cổng Đáng, When rút chúng từ bên VẼ
  (`scripts/gate-card.js`) và từ bên GHI (`commands/approve.md` +
  `skills/acceptance/references/human-facing-language.md`), Then ba nơi cho cùng
  một danh sách theo cùng thứ tự — đổi nhãn ở bên vẽ mà quên bên ghi làm phép đo
  ĐỎ.
- AC-11: Given nghi thức vào phiên gặp một ô `gate: "dang"`, When đọc bước bàn
  giao của `commands/start.md`, Then nó trỏ tới thẻ RỒI tới lệnh ký, và tên lệnh
  ký rút được từ chính thân lệnh duyệt — không phải một chuỗi gõ tay ở hai nơi.
- AC-12: Given ô có ngưỡng còn để trống và không khai «Không đo được — », When
  thân lệnh duyệt mô tả chế độ Cổng Đáng, Then nó khai răng chiều đỏ chặn lối
  `làm`/`lặp` ở trạng thái đó, và điều kiện chặn đó rút được bằng máy (nằm trên
  dòng riêng trong một khối marker), không chỉ nằm trong văn xuôi.
- AC-13: Given bảng ánh xạ bốn lối ra → bốn giá trị máy của chế độ Cổng Đáng,
  When rút bảng đó bằng máy từ `commands/approve.md`, Then nó ĐỦ BỐN HÀNG, và
  tập bốn giá trị máy bằng ĐÚNG tập giá trị hợp lệ của khoá `decision` khai ở
  `NAV_RULES['opportunity.md']` trong `lib/workspace-record.cjs` — rút từ lib,
  không gõ tay. Thiếu một hàng, hoặc một giá trị nằm ngoài từ vựng của lib, thì
  phép đo ĐỎ và nêu đúng tên hàng/giá trị đó.

## Coverage

Quét bằng skill `morphological-scan`, bốn trục — chi tiết + bảng lát cắt 10 ô ở
§3 design doc.

- Trục A — vật neo trên đĩa: không xưởng | không thư mục | thư mục rỗng | chỉ ô
  cơ hội | chỉ hợp đồng | cả hai [thước CE: `ANCHOR_FILES` trong
  `lib/workspace-record.cjs` + khối `NO-DOSSIER-GUARD-BLOCK` hiện hành]
- Trục B — nấc ô cơ hội: `discovery`+rỗng | `decided`+`build|iterate` |
  `decided`+`park|kill` | `archived` | field hỏng [thước CE: enum
  `NAV_RULES['opportunity.md']`]
- Trục C — nấc ngưỡng: chưa chốt | `[đề xuất]` | đã chốt | «Không đo được — »
  [thước CE: `thresholdState` trong `lib/nguong-o-co-hoi.cjs`]
- Trục D — vật vòng làm: không / có `evidence-report.md` [thước CE: nhánh tự
  nhận cổng hiện hành + ca GM04 của lưới thường trực]
- Phủ AC theo ô của bảng lát cắt: ô 1–3 → AC-6 (ô 1 và ô 2 là thuộc tính của
  gốc cây, không dựng được bên trong một xưởng — AC-1 cố ý không nhận) · ô 4 →
  AC-1, AC-3, AC-8 · ô 5 → AC-2 · ô 6 → cố ý giữ nguyên (Out of scope) · ô 7 →
  AC-4 · ô 8 → AC-5 · ô 9–10 → AC-1 (đối chứng dương: hai làn cũ không đổi
  hành vi).
- Phủ AC theo trục C (bốn nấc ngưỡng), trục dễ sót nhất vì ba nấc trông giống
  nhau trên mặt thẻ: chưa chốt → AC-2 + AC-12 · `[đề xuất]` → AC-2 (dấu «máy
  đề xuất» phải hiện trên chính dòng ngưỡng) · đã chốt → AC-2 · khai «Không đo
  được — » → AC-2 (phải ký được, KHÔNG bị cắm cờ đỏ — đây là lối kit tự dạy cho
  vòng không có người dùng cuối, chặn nó là chặn đúng thứ mình khuyên).
- Phủ hành vi ghi của chế độ ký: AC-13 (bảng ánh xạ đủ bốn hàng, từ vựng rút từ
  `lib/workspace-record.cjs`). Hành vi ghi CUỐI CÙNG chỉ đo được ở vòng dùng
  thật — khai ở Đường đo, không giấu.
- Chân ngành [NGÀNH: Rust `match` vét cạn · OCaml cảnh báo khớp thiếu]: lớp
  «bộ điều phối trên kiểu tổng phải toàn phần» — nhánh đáy gán nhãn của trạng
  thái khác chính là lỗi hôm nay.

## Đường đo

Ngưỡng đã chốt ở Cổng Đáng ngày 01/09. Bốn thước, mỗi thước một dòng. Chữ dùng
có phân biệt: **bảo đảm bởi** = có phép đo chạy trên ĐẦU RA thật; **phủ hai dấu
hiệu** = đo được điều kiện cần, còn hành vi cuối chỉ đo được ở vòng dùng thật.

- Thước: số lượt gọi người để ký MỘT ô ở Cổng Đáng · số từ: đếm tay ở hồ sơ vòng
  kế đi qua cổng này (dòng số North Star «số lần gọi người/vòng») · **phủ hai
  dấu hiệu:** AC-11 (chỉ MỘT đường bàn giao, không rẽ hai) + AC-13 (bảng ánh xạ
  đủ bốn hàng, nên không lối ra nào rơi ra ngoài rồi phải hỏi lượt hai) ·
  **giới hạn đã khai:** số lượt THẬT chỉ đo được khi ô kế tiếp đi qua cổng — đó
  là ngưỡng UAT của hồ sơ này, không phải tiêu chí của vòng này.
- Thước: một PR cho một lần ký · số từ: đếm PR của vòng kế đi qua cổng ·
  **không đo được trong vòng này** — nó là thuộc tính của phiên ký, không của
  vật. Đo ở phiên nghiệm thu, cùng thước trên.
- Thước: thẻ in đúng bốn lối ra sống · số từ: đầu ra thật của bộ dựng thẻ ·
  **bảo đảm bởi:** AC-8 (bốn nhãn, đúng thứ tự) + AC-13 (bốn nhãn ấy ánh xạ
  được sang bốn giá trị máy — in ra mà không ghi được thì không phải lối sống).
- Thước: số chữ của người bị máy viết trước = 0 · số từ: đầu ra thật của bộ dựng
  thẻ và trạng thái `decision` trên đĩa sau khi render · **bảo đảm bởi:** AC-9.

## Out of scope

- Lệnh thứ bảy đứng tên Cổng Đáng — ô cơ hội đã loại từ 26/08; hiến pháp kit là
  «chỉ TRỪ, không CỘNG», và chế độ trên lệnh duyệt sẵn có đủ vai.
- Đổi khuôn `opportunity.md` — khuôn đã có bốn lối ra và hai tiền tố máy đọc.
- Làm dịu câu chữ ca «hồ sơ chưa có contract.md» cho ô ĐÃ ký mà hợp đồng chưa
  sinh (ô 6 của bảng lát cắt): việc-kế hiện hành đã ĐÚNG (hợp đồng sinh ở S1),
  chỉ nhiễu vì liệt kê tên hồ sơ. Chờ có người vấp thật.
- Lớp dịch tiếng-sản-phẩm (`card-plain.json`) cho thẻ Cổng Đáng — nội dung ô cơ
  hội vốn do người viết bằng tiếng sản phẩm; thêm lớp phủ là dựng nguồn thứ hai
  cho cùng một câu.
- Sửa hợp đồng đã ký của hồ sơ `khong-ve-the-ma`.
- Tự động hoá phần người chọn lối ra — máy trình bốn lối, người chọn.

## Notes

- **Con trỏ «thay thế»:** ca đo `AC-8 dang thuc` của bộ răng
  `_acceptance/khong-ve-the-ma/rang.sh --chan round-trip` ghim số lời thuật
  bằng hằng số `3`. AC-7 của hợp đồng NÀY thay thế nó bằng đẳng thức
  rút-từ-marker (số lời thuật = số hằng khai ở bên viết). Hợp đồng đã ký của
  `khong-ve-the-ma` KHÔNG sửa; bộ răng cũ không nằm trong
  `feature_loop.suite_keys` nên không làm lưới thường trực đỏ.
- Lưới thường trực GM01–GM06 trong `tests/scripts/run-tests.sh` giữ nguyên hành
  vi: fixture `gm-rong` là thư mục RỖNG (không có `opportunity.md`) nên vẫn rơi
  đúng ô 3 của bảng lát cắt.
- Lấy phần đã cắt về bằng CÂY `de27babc1f8136b83ea08f8694fe744a4ecee557`
  (`git archive`), KHÔNG bằng `discovery/phan-cong-dang.patch` — bản vá đã mục
  2/4 khối (xem `discovery/LAY-VE.md`, bài học P150).
- Chốt thẻ-ma (`184a3646`) ra đời SAU cây ghim và chạy ở đầu file: nhánh nhận
  Cổng Đáng phải nằm TRƯỚC nó, nếu không làn mới là mã chết mà mọi phép đo bề
  mặt vẫn xanh. AC-3 canh đúng điều này.
- ADR 0002 (khoá model-invocation của sáu thao tác cổng người) áp nguyên cho chế
  độ Cổng Đáng của `/approve` — máy không tự gọi lệnh ký.
- **Cờ vàng W6 đã biết, không định sửa:** bộ soi từ vựng báo chữ «thẻ» nằm
  trong `_Avoid_` của mục *Contract* trong `CONTEXT.md`. Ở hồ sơ này chữ đó
  mang nghĩa **thẻ cổng** (mục *Mặt người*), và nó là chính VẬT vòng này dựng —
  né chữ sẽ làm hợp đồng khó đọc hơn chứ không đúng hơn. Cờ để nguyên cho người
  thấy tại Cổng Phạm vi.
