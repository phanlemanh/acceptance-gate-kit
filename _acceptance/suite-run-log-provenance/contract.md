---
schema_version: 1
feature: Lệnh suite phải sinh dòng sổ chạy — không thì mọi vòng đỏ đối chiếu sau khi ký
slug: suite-run-log-provenance
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-08-29-suite-run-log-provenance-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-29T06:05:00Z   # mở lại sau khi nâng phạm vi (AC-7)
---

# Acceptance contract — lệnh suite phải để lại dấu vết

## Context

Vòng nghiệm thu chạy hai loại lệnh máy: lệnh của từng tiêu chí (eval) và lệnh
canh hồi quy chung (suite). Sổ chạy `run-log.jsonl` — vật duy nhất chứng minh
bản chấm do một lượt chạy có thật sinh ra — chỉ ghi loại thứ nhất, nên máy soạn
bản chấm buộc phải tự đặt mã cho lệnh suite và bộ đối chiếu đỏ `L2 PROVENANCE`
ngay sau khi Cổng 2 ký. Đo thật: kho tiêu thụ `media-library`, vòng 11.

Kho kit không tự bắt được vì cấu hình của chính nó khai lệnh suite trùng lệnh
eval — lỗi chỉ cắn khi lệnh suite KHÔNG gắn tiêu chí nào, tức mọi kho tiêu thụ
bình thường.

Source input: prompt (PR #117) + đo thật media-library vòng 11.

## Criteria

- **AC-1 — lệnh suite không gắn tiêu chí vẫn để lại dấu vết.** Given một vòng
  có lệnh suite không gắn eval nào, When vòng verify chạy xong, Then sổ chạy có
  ĐÚNG một dòng cho lệnh đó, mang `evalId` tiền tố `SUITE-`, `cmd` bằng chuỗi
  lệnh thật, và `ts`/`round` như mọi dòng khác; And số dòng sổ bằng số eval CỘNG
  số lệnh suite không gắn eval — không thiếu, không nhân đôi.
- **AC-2 — mã đúc từ chính lệnh, không theo thứ tự khai, và phân biệt theo
  vòng.** Given cùng một danh sách lệnh suite khai theo hai thứ tự khác nhau,
  When chạy hai vòng cùng số round, Then mã của mỗi lệnh giống hệt nhau ở cả hai
  lượt; And mã chứa tên suy từ chuỗi lệnh (`pnpm itest:ci` → `itest_ci`), KHÔNG
  chứa chỉ số mảng; And Given CÙNG một lệnh suite chạy ở round 1 rồi round 2,
  Then hai dòng sổ mang HAI mã khác nhau — mã không mang hậu tố vòng thì bản
  chấm vòng sau trỏ về được lượt chạy vòng trước, mất đúng thứ sổ sinh ra để
  bảo đảm.
- **AC-3 — mã phân biệt được trong một vòng, trên MỌI hình dạng lệnh.** Given
  hai lệnh suite KHÁC nhau rút gọn về cùng một tên, When vòng verify chạy, Then
  hai dòng sổ mang HAI mã khác nhau và mỗi mã trỏ về đúng `cmd` của nó. Ba hình
  dạng va chạm phải cùng đạt, không được đóng một ô rồi tuyên cả lớp:
  (a) tiền tố thư mục — `cd apps/web && pnpm build` và `cd apps/api && pnpm build`;
  (b) cùng script khác cờ — `pnpm test:unit --project a` và `... --project b`;
  (c) lệnh trần trùng 40 ký tự đầu sau vệ sinh — nhánh cắt chuỗi của bộ đúc tên.
  Đây là chiều đỏ của lớp false-green thứ hai: cùng một mã cho hai lệnh thì một
  lệnh đỏ có thể nấp sau lệnh xanh mà bộ đối chiếu vẫn xanh.
- **AC-4 — dòng suite mang kết quả RIÊNG của nó.** Given một vòng mà eval hỏng
  (exit ≠ 0) còn lệnh suite xanh, When vòng chạy xong, Then dòng suite giữ
  `exit_code` của chính nó, không ăn theo eval hỏng; And Given lệnh suite không
  chạy được (`cannotRun`), Then dòng của nó có `exit_code: null` và cờ
  `cannot_run: true` — không được ghi 0.
- **AC-5 — dây khép từ sổ tới bộ đối chiếu, đo bằng chính bộ ĐỌC.** Given một
  vòng có lệnh suite, When bản chấm được soạn từ kết quả vòng đó, Then tập mã mà
  chính bộ đọc của kho rút từ bản chấm phải NẰM TRỌN trong tập mã rút từ
  `run-log.jsonl` — đo bằng `evaluateEvidence` của `lib/evidence-core.cjs`, đúng
  hàm mà ổ cắm cưỡng chế và bộ kiểm lại cùng gọi (bên trong nó là `extractRunIds`
  + `loadRunLogIds`), chứ không phải phép có-mặt-chuỗi; And Given đề bài gửi máy soạn bản
  chấm, Then nó chứa ĐÚNG MỘT khối luật cấm tự đặt mã (đếm điểm neo của khối,
  khác 1 là hỏng) — hai khối cạnh tranh thì máy soạn theo khối dễ dãi hơn và mã
  bịa quay lại.
- **AC-6 — không hồi quy dòng eval và nhánh gộp lệnh.** Given lệnh suite TRÙNG
  đúng lệnh của một eval, When vòng chạy, Then lệnh đó đi nhánh eval như trước
  (một dòng mang `evalId` của eval), KHÔNG sinh thêm dòng `SUITE-`; And hình
  dạng mọi dòng eval (mã, `sha`, `ts`, `exit_code`, `cmd`) giữ nguyên như bản
  trước vá.

- **AC-7 — không bộ đọc nào gán trường của lệnh chạy chung cho một tiêu chí.** Phạm
  vi NÂNG ở vòng sửa S4-r3, owner chốt. (Khuôn khối lệnh suite mở đầu bằng
  `- cmd:` nên mọi bộ đọc chỉ mở khối ở `- eval:` đều nhét mã chạy / mã thoát /
  thời điểm của lệnh chạy chung vào tiêu chí ĐỨNG TRƯỚC nó.) Given một bản chấm
  có khối lệnh suite, When trang bằng chứng và card Cổng 2 dựng bản trình cho
  người ký, Then không trường nào của khối đó xuất hiện như của một tiêu chí —
  trang không in mã ngoài khối, và cờ «bằng chứng máy đầy đủ» của card không được
  xanh nhờ mã của lệnh chạy chung; And mỗi bộ đọc có HAI lớp đóng khối (gặp tiêu
  đề · gặp khối không-phải-eval) và MỖI lớp có ca cô lập — fixture chỉ còn một
  lớp che, gỡ đúng lớp đó thì phép đo phải đỏ (bốn lớp, bốn bản tiêm).

## Coverage

Quét bằng `morphological-scan`, bốn trục. Thước CE là chính các bộ ĐỌC sổ trong
kho: `lib/evidence-core.cjs` (đối chiếu mã trong bản chấm với sổ),
`scripts/recheck-evidence.cjs`, `hooks/acceptance-evidence-gate.js`
[SUY-TỪ-REPO], cộng một lượt đo thật ở kho tiêu thụ `media-library` vòng 11
[SUY-TỪ-REPO: thân PR #117].

- Trục A — hình dạng lệnh: script gói (`pnpm x` / `npm run x` / `yarn x`) ·
  lệnh trần (`bash tests/…/run-tests.sh`) · có tiền tố `cd <dir> &&` · lệnh
  ghép `a && b` · hai lệnh rút về CÙNG tên (ba biến thể: tiền tố thư mục · khác
  cờ · trùng 40 ký tự đầu) · trùng lệnh của một eval. Sáu ô, mỗi ô một assert
  đích danh có tên mong đợi ghim nguyên văn — bảng ma trận nằm đầu `evals.yaml`
  làm hợp đồng đếm được.
  [thước CE: `feature_loop.suite_keys` của kho này + của `media-library`]
- Trục B — kết quả chạy: exit 0 · exit ≠ 0 · không chạy được (`cannotRun`,
  gồm ca bị công cụ giết). [thước CE: nhánh `cannotRun`/`killedByTool` trong
  `acceptance-verify.js`]
- Trục C — vòng: vòng 1 · vòng sửa sau REJECT (mã ĐỔI theo round — chân của
  AC-2; suite LUÔN chạy lại, không mang sang) · lượt re-pin (dòng `kind:repin`,
  luật riêng — không đụng). [thước CE: luật carry-forward P1 + luật re-pin]
- Trục D — nơi mã phải khớp: dòng sổ · đề bài của máy soạn bản chấm · bản chấm ·
  bộ đối chiếu (AC-5) · và HAI bản trình cho người ký — trang bằng chứng và card
  Cổng 2 (AC-7, thêm ở vòng sửa S4-r3). Nút cuối là chỗ lượt soi bắt được lỗi
  thật: mã đúng trong sổ vẫn có thể hiện sai chủ trên trang người đọc.
  [thước CE: `evaluateEvidence` → `extractRunIds` + `loadRunLogIds`]

Ô cắt (ghi vết, không làm): trục C ô «lượt re-pin» — luật riêng đã có răng
riêng, đụng vào là mở phạm vi sang lớp khác.

## Out of scope

- **Thứ tự kiểm ở cổng trước khi gộp** — chỗ khiến lỗi ẩn tới sau chữ ký
  (`scripts/pre-merge-check.sh` dừng sớm khi chữ ký còn trống, chưa chạy tới
  khối đối chiếu). Lớp khác (thứ tự cổng), và chạm lõi cưỡng chế → hạng T3 với
  vòng duyệt riêng. Entry `descope` trong sổ quyết định.
- ~~**Đổi khuôn bản chấm**~~ — **PHẠM VI ĐÃ MỞ ở vòng sửa S4-r1** (quyết định
  `d-20260829T030933Z-2201`): lượt soi chứng minh bản mẫu KHÔNG có khuôn nào cho
  lệnh suite, nên máy soạn tự chế mục và mã chạy không có chỗ đứng — đúng gốc của
  lỗi ở kho tiêu thụ. Đã thêm khối `SUITE-BLOCK-TEMPLATE` vào bản mẫu (nằm NGOÀI
  vùng chép) và đề bài trỏ vào đó. Vẫn NGOÀI phạm vi: đổi các mục đã có của bản
  mẫu, và bắt hồ sơ cũ migrate — hồ sơ không có khối này vẫn hợp lệ.
- Sửa `media-library` hay bất kỳ kho tiêu thụ nào — kit chỉ là bộ máy, không
  chứa việc của kho tiêu thụ.

## Notes

Lưới thường trực: `tests/workflows/acceptance-verify.test.mjs` (fixture do code
dựng mỗi lần chạy, harness vm-realm, không sinh agent). Răng hồ sơ
`_acceptance/suite-run-log-provenance/rang.sh` ghim đúng dòng ca và giữ chiều
đỏ; cố ý KHÔNG vào suite vĩnh viễn — nó neo mốc bản-trước-vá.

## Giới hạn đã khai (owner chọn đường «ship với giới hạn» sau khi luật dừng-vá bật)

Hai vòng chấm liên tiếp sinh lỗi CÙNG LỚP «thước không gắn vào vật». Owner chốt
giữ mã đã chứng, sửa hai lỗi cứng, và khai phần còn lại ra đây thay vì đuổi thêm
vòng. Người ký ở Cổng Bằng chứng đọc danh sách này TRƯỚC khi ký:

1. **Chiều đỏ chưa phủ đều.** Chân `ket-qua-rieng` (E4) và `khong-hoi-quy` (E7)
   hiện chỉ có chiều DƯƠNG — chưa có bản tiêm chứng minh chúng đỏ được. Chân
   `va-cham-ten` (E3) có chiều đỏ cho cả ba lớp phòng thủ nhưng chỉ chạy phép so
   trên MỘT trong ba biến thể va chạm; hai biến thể còn lại chỉ có chiều dương.
2. **Danh sách vật-được-đo viết tay.** Lưới «cây làm việc lệch HEAD» trong răng
   canh đúng ba file liệt trong biến `VAT_DO`. Thêm vật mới mà quên cập nhật danh
   sách thì lưới đó không canh nó — cùng hình dạng với bài học P150.
3. **Hai bản trình chưa hiển thị khối lệnh suite.** Bản vá ở trang bằng chứng
   và card Cổng 2 mới chỉ thôi gán trường của lệnh chạy chung cho một tiêu chí
   (AC-7); chúng chưa render các khối đó thành mục riêng. Kết quả lệnh chạy
   chung vẫn đọc được trong `evidence-report.md`.

Mốc bất biến: `BASE-SRLP = e0222f7f53740b6bd603b218fe9da2b8f8e65e19` — commit
CHA của bản vá, tức cây trước-vá còn nguyên lỗi. Chiều đỏ chính là **gỡ vá
trong bản sao do code dựng ngay trong lần chạy**; mốc này chỉ dùng làm đối
chứng độc lập cho lời khai "trước vá thì thiếu dòng". KHÔNG neo `origin/main`:
sau khi hồ sơ gộp thì hai đầu cùng sạch và phép đo tự chết.
