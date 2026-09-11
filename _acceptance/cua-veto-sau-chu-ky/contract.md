---
schema_version: 1
feature: Chữ ký người ở Cổng Bằng chứng đóng cửa veto — lưới trước-merge và máy quét /start thôi nói «owner chưa veto» về hồ sơ người đã ký
slug: cua-veto-sau-chu-ky
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh (t3_paths)
surfaces: [cli]
status: draft
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-09-11-cua-veto-sau-chu-ky-design.md
---

# Acceptance Contract: cua-veto-sau-chu-ky

## Context

Lưới trước-merge báo «cửa veto mở», «owner chưa veto» cho hồ sơ mà người ĐÃ KÝ ở Cổng
Bằng chứng. Hai chỗ trong `scripts/pre-merge-check.sh` gây ra điều này:

- NOTE làn V ở dòng 777–778: nhánh gộp «xanh-sạch HOẶC đã ký».
- Dòng tổng veto-trace ở dòng 1352–1355 và 1384–1386: đếm mọi `veto_state: mo`.

Máy quét `/start` (`scripts/start-scan.mjs` `vetoOpen[]`) lặp lại đúng câu đó. Đo
11/09: trong kit, 27 trên 30 tên ở dòng tổng đã ký. Ở media-library là 3/3, ở
floorplanstudio 1/1. Chỉ 3 cửa trong kit mở thật. Đề bài là lỗ C3 của đợt rà 22/08,
owner gọi tên 11/09 và chốt bản sửa phải nằm trong kit: bản vá tại chỗ `_vapp` của
media-library mất hai lần vì chép đè.

Luật: cửa veto mở ⇔ `veto_state: mo` ∧ `human_signoff` không phải chữ ký thật. Luật
chỉ đổi LỜI, không đổi CHẶN.

Source input: prompt — tin gọi tên của owner 11/09/2026 + đề bài C3 (đợt rà 22/08) ·
thiết kế: `docs/superpowers/specs/2026-09-11-cua-veto-sau-chu-ky-design.md`.

## Criteria

- AC-1: Given hồ sơ làn V (`approved_by` rỗng, `veto_state: mo`, `veto_opened_at` parse được, T2) có `human_signoff` là chữ ký thật, When chạy `pre-merge-check.sh`, Then lưới in ĐÚNG MỘT dòng `NOTE [<slug>]` chứa «cửa veto đã đóng bằng chữ ký». Lưới KHÔNG in «cửa veto mở» cho slug đó, và slug KHÔNG có tên trong dòng «cửa veto đang mở». Chiều đỏ cùng fixture: bản sao gỡ nhánh mới thì câu «cửa veto mở» quay lại.
- AC-2: Given hồ sơ làn V xanh-sạch mà `human_signoff` RỖNG (trường hợp thật), When chạy lưới, Then lưới VẪN in `NOTE [<slug>]: làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở` nguyên văn, VÀ slug có tên trong dòng «cửa veto đang mở». Đối chứng cặp: cùng fixture, chỉ thêm chữ ký thì cả hai dòng đổi theo AC-1. Bản sao coi mọi `mo` là đã đóng thì phép đo ĐỎ, nêu «cửa thật bị giấu».
- AC-3: Given hồ sơ `veto_state: mo` có `approved_by` có tên, When chạy lưới, Then dòng tổng đếm slug đó khi và chỉ khi `human_signoff` không phải chữ ký thật. Con số N trong dòng tổng BẰNG số tên được liệt. Khi mọi hồ sơ `mo` đều đã ký, lưới KHÔNG in dòng tổng nào (im, như khi không có cửa veto).
- AC-4: Given `veto_state: mo` và `human_signoff` khớp bảng giữ-chỗ (`TBD`, `pending`, `<tên>`, …), When chạy lưới, Then cửa vẫn MỞ: slug có tên trong dòng tổng, không có câu «đã đóng». VIOLATION giữ-chỗ của luật chữ ký vẫn nổ nguyên văn. Bảng giữ-chỗ là CHÍNH hàm `placeholder_signoff`, không dựng bảng thứ hai. Chiều đỏ: bản sao coi chuỗi không rỗng bất kỳ là chữ ký thì phép đo ĐỎ, nêu «giữ-chỗ đóng cửa».
- AC-5: Given `status: signed-off` mà `human_signoff` rỗng hoặc báo cáo vắng, When chạy lưới và máy quét, Then cửa vẫn MỞ ở cả hai bộ đọc: nhãn status KHÔNG đóng cửa, chỉ chữ ký thật mới đóng.
- AC-6: Given một kho git fixture code-sinh phủ ma trận veto (vắng · `mo` · `da-veto`) × chữ ký (thật · giữ-chỗ · rỗng · báo cáo vắng) × Cổng 1 (`approved_by` có · rỗng), When chạy `start-scan.mjs` và `pre-merge-check.sh` trên CÙNG cây, Then:
  - (a) mỗi phần tử `vetoOpen[]` mang `humanSignoff: true|false`, và tập phần tử `vetoOpen[]` KHÔNG đổi so với hôm nay (mọi `mo`, bất kể status);
  - (b) tập slug `vetoOpen` lọc `humanSignoff: false` BẰNG đúng tập slug trong dòng «cửa veto đang mở» của lưới;
  - (c) thêm một hồ sơ `mo` chưa ký vào kho thì cả hai tập cùng tăng đúng 1; thêm một hồ sơ `mo` đã ký thì cả hai tập đều không tăng.

  Chiều đỏ: đột biến vị từ ở MỘT bên (lưới hoặc máy quét) thì đẳng thức vỡ, và thông điệp nêu tên bên lệch.
- AC-7: Given cùng ma trận fixture của AC-6, When chạy lưới BASE (`git archive` trọn `scripts` + `lib` ở `origin/main` lúc chạy) và lưới sau sửa, Then trên MỌI ô, mã thoát và tập dòng `VIOLATION` giống hệt nhau. Chỉ dòng `NOTE` được khác. Nói cách khác, bản sửa không nới và không siết luật chặn nào. Chiều đỏ: bản sao cho nhánh mới `continue` trước các chốt bằng chứng thì ≥1 ô đổi mã thoát, và phép đo ĐỎ nêu «bản sửa đổi luật chặn».
- AC-8: Given các luật lân cận đã có, When chạy lưới trên hồ sơ ĐÃ KÝ, Then chúng vẫn nổ nguyên văn:
  - `da-veto` chưa xử → VIOLATION «veto_state=da-veto chưa xử»;
  - `da-veto` → `mo` không có entry sổ → VIOLATION ghi-ngược;
  - gỡ khoá `veto_state` khỏi hồ sơ đã rời draft → VIOLATION;
  - làn V hạng T3 → VIOLATION «làn V chỉ T2»;
  - vết giờ hỏng → VIOLATION.

  Chữ ký không mở đường vòng cho luật nào trong số đó.
- AC-9: Given `tests/scripts/additive-only.test.mjs` (DV5), When chạy trên cây sau hồ sơ, Then nó xanh. Mọi dòng bị gỡ khỏi `pre-merge-check.sh` (mặc định: không dòng nào) phải liệt ĐÍCH DANH trong `ALLOWED_REMOVALS` kèm lý do «chỉ đổi NOTE, không nới luật».
- AC-10: Given cây thật của kit, When chạy lưới (`--recheck-all`) và máy quét, Then:
  - tập tên dòng «cửa veto đang mở» BẰNG tập hồ sơ `veto_state: mo` chưa có chữ ký thật, tập kỳ vọng do một bộ đọc frontmatter ĐỘC LẬP tính;
  - không hồ sơ nào có `human_signoff` thật nằm trong tập đó;
  - không dòng NOTE «cửa veto mở» nào in cho hồ sơ đã ký;
  - sàn: tập kỳ vọng có ≥1 phần tử và tập đã-ký có ≥1 phần tử.

  Không ghim tên hay con số: tập đã trôi từ 14 lên 30 trong ba tuần.
- AC-11: Given thân `commands/start.md`, `commands/acceptance-status.md`, khối `START-SCAN-KEYS` và `CONTEXT.md`, When đọc cây sau hồ sơ, Then:
  - (a) hai thân lệnh dặn chỉ in «Còn veto được — <tên>» cho phần tử `humanSignoff: false`;
  - (b) khối `START-SCAN-KEYS` khai `vetoOpen[].humanSignoff`, và ca P99 round-trip của suite plugins vẫn xanh;
  - (c) `CONTEXT.md` có luật «chữ ký Cổng Bằng chứng đóng cửa veto» ở mục **Máy đã thông** hoặc một term riêng, kèm `_Avoid_`.

  Chiều đỏ: gỡ từng vật khỏi bản sao thì ĐỎ, gọi tên đúng vật bị gỡ.
- AC-12: Given ca thường trực mới `tests/scripts/cua-veto-sau-chu-ky.test.mjs` được nạp vào `tests/scripts/run-tests.sh`, When chạy suite `executors.test.scripts`, Then ca đó chạy CHÍNH lưới trên fixture code-sinh và giữ hai chiều của AC-1/AC-2 cùng đẳng thức của AC-6(b). Ca có sàn đếm (0 assert thì exit khác 0) và chiều đỏ tự chạy trên bản sao, để luật còn răng sau khi răng hồ sơ chết theo hồ sơ.

## Coverage

Quét bằng morphological-scan (preset test-matrix), một lượt máy.

**Chân sản phẩm:**
`[SUY-TỪ-REPO: scripts/pre-merge-check.sh:766-782,1344-1386 · scripts/start-scan.mjs:122-128,252-253 · lib/evidence-core.cjs vetoGateState · commands/signoff.md:87-97]`.

**Chân ngành**, loại sản phẩm «danh sách chờ người quyết trong luồng review»:
- `[NGÀNH: Gerrit attention set — người rời danh sách chờ khi đã trả lời]`
- `[NGÀNH: GitHub pull request — yêu cầu review tự rút khi reviewer đã nộp review]`

Cả hai cùng một nguyên tắc: người đã phát ngôn thì không còn trong danh sách «đang
chờ người». Luật của hồ sơ này là nguyên tắc đó áp vào cửa veto.

- Trục A — `veto_state`: vắng | `mo` có vết | `mo` vết hỏng | `da-veto` [thước CE: bốn nhánh của `vetoGateState` + nhánh `case` ở dòng 1352; giá trị lạ đã bị hook chặn lúc ghi → gạch]
- Trục B — chữ ký Cổng 2: thật | giữ-chỗ | rỗng | báo cáo vắng [thước CE: `placeholder_signoff` dòng 413 + `front_field` dòng 384; 4/4 có AC — thật AC-1/3, giữ-chỗ AC-4, rỗng AC-2/5, vắng AC-5/6]
- Trục C — Cổng 1: `approved_by` có tên | rỗng (làn V) | `gate1_skipped: true` [thước CE: ba nhánh khối dòng 754–788; có tên AC-3, rỗng AC-1/2, `gate1_skipped` → Later]
- Trục D — bộ đọc: NOTE riêng từng hồ sơ | dòng tổng | `vetoOpen[]` máy quét [thước CE: grep `veto_state` toàn cây `scripts/` — 3 bộ đọc nói «cửa veto mở»; `product-map.mjs` + nhánh machine-cleared của máy quét chỉ đọc hồ sơ chưa ký theo định nghĩa → gạch]

**Cross-cutting áp mọi ô Core:**
- status (verified · machine-cleared · signed-off) KHÔNG phải căn cứ: AC-5 vật hoá điều này;
- luật chặn lân cận phải giữ nguyên văn (AC-7 đo quan hệ, AC-8 đo năm luật có tên);
- DV5 chỉ-thêm (AC-9).

**Core:** A{mo có vết} × B{thật, rỗng, giữ-chỗ} × C{rỗng, có tên} × D{ba bộ đọc} → AC-1..6, cộng đẳng thức hai bộ đọc (AC-6) và cây thật (AC-10).

**Later:**
- `gate1_skipped: true` + `mo` + đã ký. Hook ghi-lúc-viết không cho hai khoá này đi cùng một cách tự nhiên; chưa có ca thật.

**Never:**
- Giá trị `veto_state` lạ: hook đã chặn lúc ghi.
- `da-veto` × chữ ký thật đóng cửa: veto là phát ngôn của người, nên nó thắng chữ ký cũ; AC-8 giữ VIOLATION.
- Suy «đã ký» từ `status: signed-off`: nhãn không phải quan hệ.

## Out of scope

- **Đổi lệnh `/signoff` hay `/approve`** để ghi một trạng thái đóng vào `veto_state` (phương án P2/P3 của thiết kế). Làm vậy phải có enum mới trong `lib/`, migrate hồ sơ đã ký, và đổi thân lệnh cổng người bị khoá model-invocation.
- **Chạm `lib/`, `hooks/`**: `vetoGateState` và luật ghi-lúc-viết giữ nguyên.
- **Sửa hồ sơ đã ký nào**, kể cả `start-bang-dieu-khien` và răng `rang-bdk.sh` của nó. Tập phần tử `vetoOpen[]` giữ nguyên chính vì điều này.
- **Mang bản sửa sang media-library / floorplanstudio.** Hai kho nhận qua bản phát hành tới. Gỡ vá `_vapp` tại chỗ (nếu còn) là việc của kho đó.
- **Đổi tên khoá `vetoOpen`** cho khớp nghĩa mới. Đây là nợ tên đã ghi sổ kèm điều kiện xem lại.
- **Dòng đếm «N hồ sơ đã ký, cửa đã đóng»** ở dòng tổng: dòng hằng lặp lại là rác.
- **Hợp nhất bash + JS về một vị từ một nguồn** (nợ `lan-v-khong-phai-cho-ky` known-limit `#3`). Đẳng thức AC-6 canh thay.

## Notes

- **Vòng này là việc-kit, owner GỌI TÊN 11/09** («Chạy hai việc kit còn mở»). Theo luật chiều rộng (b) của CLAUDE.md, giữa hai release chỉ được tối đa MỘT vòng meta và chỉ khi owner gọi tên. Vòng này có **neo ngoài**: câu sai hiện ở lưới của media-library (3 hồ sơ) và floorplanstudio (1 hồ sơ). Giá trị chạm người dùng kit ở bản phát hành tới, không chỉ ở thước của kit.
- **Ô mở dưới luật NỚI 2026-09-07?** Phần cộng gồm trường `humanSignoff`, một NOTE mới và một ca thường trực. Trace về nguyên tố 2 (bằng chứng không tự dối: lưới đang nói sai 27/30) và nguyên tố 3 (khoảnh khắc quyết thật: cửa veto chỉ còn giá trị khi danh sách của nó đúng). Người hưởng cụ thể là owner, khi đọc dòng «cửa veto đang mở» ở lưới và ở `/start`. Vòng này KHÔNG tăng lượt gọi người: không dựng cổng mới, và giảm số tên người phải đọc từ 30 xuống 3.
- **T3 nên Cổng Phạm vi và Gate 1.5 cần người** theo thiết kế, trần 4 lượt gọi người.
- **Không có `opportunity.md`**, nên không có mục `## Đường đo`.
- **Giới hạn khai trước:** AC-11 (a) đo CHỈ DẪN trong thân lệnh, không đo hành vi render của thẻ `/start`. Tiền lệ: known-limit của `lan-v-khong-phai-cho-ky`. Ngưỡng mở lại đang đếm: một lần thẻ `/start` in «Còn veto được» cho hồ sơ đã ký sau khi hồ sơ này gộp.
- **Hằng số đo 11/09** (quan sát, không ghim — AC-10 đo quan hệ): 30 `mo` / 27 đã ký / 3 mở thật (`co-qua-timebox-nhom-da-xong`, `ma-so-quyet-dinh-duy-nhat`, `release-2-0-0`).
