---
schema_version: 1
feature: Lượt chấm lại không tự dối — eval đổi định nghĩa thì chạy lại, và thước của lượt nào so bằng tham số của chính lượt ấy
slug: cham-lai-khong-tu-doi
owner: phanlemanh@gmail.com
risk_tier: T2               # feature-loop/scripts/carry-plan.mjs · s4-args.mjs · thuoc-vat.mjs — không chạm t3_paths
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-16-cham-lai-khong-tu-doi-design.md
status: draft
---

# Acceptance Contract: cham-lai-khong-tu-doi

## Context

Hàng VA1. Hai lỗi «thước tự dối» ở lượt chấm lại, cả hai có neo ở crm (ô cơ hội): DA3b mang sang E10 dù `expected`
và chữ AC-10 đã đổi; K7 ghi «thước lệch» lượt 2–3 bằng tham số lượt 1 nên thẻ khoá oan. Ca đo sống ở
`tests/scripts/cham-lai-khong-tu-doi.test.mjs` (CL<n> = AC-<n>); kho thử do code sinh, tệp args do s4-args thật
sinh, dòng sổ lượt chấm do bộ chấm thật dựng. «Bản trước vòng» = `git archive` cha của commit đầu đưa `dinhNghiaTai`
vào carry-plan — mỗi chiều đỏ chứng fixture TÁI HIỆN lỗi trên bản ấy, mỗi chiều im so BẰNG NHAU với bản ấy.

## Criteria

- AC-1: Given kho thử ba eval máy E1/E2/E3 (mỗi eval canh một tệp vật), lượt 1 đã chấm xanh, nhát sửa chạm vật của E2, When chủ kho đổi ĐÚNG MỘT trường của khối E1 theo ma trận viết trước {expected 21→22 · cmd · executor · expected_exit · criterion} rồi sinh args lượt 2 với `--carry-anchor`, Then ở cả 5 mũi E1 không mang sang, chỉ E3 và E10 mang sang, stderr có «E1 không mang sang — định nghĩa eval đổi so với lượt gốc r1»; đối chứng dương: không đổi gì → [E1, E3, E10] mang sang. Chiều đỏ: bản trước vòng trên cùng kho mang E1 ở cả 5 mũi.
- AC-2: Given kho thử của AC-1 có thêm E10 phục vụ AC-10 (id và mã mang TIỀN TỐ của E1/AC-1 — hình dạng neo DA3b), When chủ kho đổi chữ tiêu chí AC-1 trong hợp đồng (khối E1 không đổi), Then E1 không mang sang, E10 và E3 vẫn mang sang, stderr có «E1 không mang sang — tiêu chí AC-1 đổi chữ so với lượt gốc r1»; và When đổi chữ AC-10 cùng `expected` của E10 (ca DA3b), Then E10 không mang sang, E1 và E3 mang sang, stderr có «E10 không mang sang — định nghĩa eval đổi so với lượt gốc r1» và KHÔNG có dòng «E1 không mang sang». Chiều đỏ: bản trước vòng mang E1 ở mũi đầu và E10 ở mũi sau.
- AC-3: Given E1 chạy ở lượt 1, khối E1 đổi, rồi lượt 2 do bản trước vòng sinh args (nó mang E1 — đúng sổ đời cũ của DA3b) và bộ chấm ghi dòng mang, When lượt 3 sinh args bằng bản mới, Then E1 không mang sang và thông điệp trỏ «lượt gốc r1» (so với lượt E1 thật chạy, không với lượt mang); chiều đỏ: bản trước vòng ở lượt 3 mang E1 tiếp.
- AC-4: Given kho thử của AC-1, When chạm thứ KHÔNG phải định nghĩa E1 theo ma trận viết trước {trạng thái hợp đồng · mục Notes · chú thích ngoài khối eval · khoảng trắng cuối dòng trong khối E1 · khối eval KHÁC (E3) · sổ quyết định}, Then ở 5 mũi tập mang sang của bản mới BẰNG bản trước vòng ([E1, E3, E10]) và không in dòng «E1 không mang sang»; ở mũi khối E3, bản mới mang [E1, E10] (E3 chạy lại vì khối của chính nó) và bản trước vòng cũng mang E1.
- AC-5: Given định nghĩa ở lượt gốc không đọc được theo hai ca viết trước {evals.yaml chưa commit lúc chấm lượt 1 · lịch sử viết lại, commit lượt 1 không còn sau gc}, When sinh args lượt 2 với `--carry-anchor`, Then s4-args thoát 0, không eval nào mang sang, stderr có «E1 không mang sang — không đọc được định nghĩa ở lượt gốc r1». Chiều đỏ: bản trước vòng trên cùng kho mang sang mù (E3 có trong tập mang).
- AC-6: Given kho thử theo thói quen K7 — args lượt 1 ở `s4-args.json`, args lượt 2 sinh với `--carry-anchor` vào `s4-args-r2.json`, nhát sửa giữa hai lượt chạm cả vật lẫn thước, bộ chấm đã ghi round-tally của lượt 2 — When chạy `thuoc-vat --write` theo năm mũi viết trước {(a) không cờ, không đổi gì trong lượt 2 · (b) không cờ, thước đổi thật trong lượt 2 · (c) `--args` trỏ tệp lượt 1 · (d) args lượt 2 nằm ngoài hồ sơ, không cờ rồi `--args` đúng tệp · (e) thêm `s4-args-r3.json` MỚI hơn round-tally lượt 2 (lượt 3 chết trước khi ghi round-tally) và vật bị sửa sau đó}, Then (a) thoát 0, 0 dòng `thuoc-lech`, 0 dòng `cay-doi`; (b) thoát 5, đúng một `thuoc-lech` mang round 2 và `generated_sha` của lượt 2; (c) thoát 2 «tệp args không thuộc lượt cuối», run-log không đổi byte; (d) thoát 2 «không tệp args nào trong hồ sơ thuộc lượt cuối», run-log không đổi byte, rồi `--args` đúng tệp thoát 0 không dòng nào; (e) thoát 6, stderr nêu đã dùng `s4-args-r3.json`, đúng một `cay-doi` mang round 3 và `luot_ts` = `invokedAt` lượt 3 (dòng mồ côi s4-args đòi hoàn lại). Chiều đỏ: bản trước vòng ở mũi (a) tái hiện K7 nguyên hình — thoát 5, `thuoc-lech` round 2 mang sha lượt 1, `cay-doi` round 1.
- AC-7: Given hồ sơ dùng một tệp `s4-args.json` theo đúng đường SKILL, When chạy `thuoc-vat --write` ở ma trận viết trước {lành · thước lệch · cây đổi · chưa có lượt nào ghi sổ}, mỗi ô dựng hai kho bằng cùng code, Then mã thoát và các dòng `thuoc-vat`/`thuoc-lech`/`cay-doi` (bỏ ts, sha) của bản mới BẰNG bản trước vòng ở cả 4 ô; và các bộ ca sẵn có của «cây đổi trong lượt chấm» (LC1–LC7), «thước chỉ-đọc» (NT-AC3) và «ai đã ghi» xanh trên bản mới.
- AC-8: Given sổ do `thuoc-vat --write` ghi trên kho K7 của AC-6, When bộ đọc nhãn cạnh gãy của thẻ (`lib/nhan-canh-gay.cjs` `canhGay`) đọc run-log, Then sổ bản mới ghi ở mũi (a) cho nhãn «khong-ap» (thẻ không khoá «thước lệch»), ở mũi (b) cho «lech»; chiều đỏ: sổ bản trước vòng ghi ở mũi (a) cho «lech» (khoá oan, mất Lối ra).

## Coverage

Bỏ quét hình thái — entry `descope` «bỏ coverage-scan» trong sổ: hai lỗi đã chốt hình dạng từ báo cáo ở crm, không gian
là ma trận trường của khối eval (AC-1) và ma trận tệp args × lượt (AC-6, AC-7), cả hai viết trước trong tiêu chí.

## Đường đo

- «0 dòng mang sang có định nghĩa đổi»: thước ĐỘC LẬP với carry-plan (không dùng vật đo vật) — với mỗi dòng run-log
  có `carried_from_round` ở crm sau ngày nhận, lấy sha dòng lượt gốc (cùng `run_id`, round = `carried_from_round`) và
  sha dòng mang; `git show <sha>:_acceptance/<slug>/evals.yaml` ở hai sha, so khối `- id: <E>` bằng mắt người đọc
  ngưỡng (hoặc `diff`), và chữ tiêu chí của nó trong `contract.md` ở hai sha. Đếm tay ở lượt đọc ngưỡng; máy chưa
  gom thành một lệnh (giới hạn đã khai).
- «0 dòng thước/cây mang sha lượt khác»: `jq` trên run-log crm — mỗi `thuoc-lech` có `sha` bằng `sha` round-tally cùng
  round; mỗi `cay-doi` có `luot_ts` bằng `ts` một round-tally CÙNG round, hoặc mới hơn mọi round-tally (dòng mồ côi
  của lượt chết) — AC-6 bảo đảm khuôn hai dòng.
- «Lượt dừng phải gọi người»: đếm dòng stderr «không tệp args nào trong hồ sơ thuộc lượt cuối» trong phiên chấm crm.

## Out of scope

- Thẻ đọc khoan dung dòng `thuoc-lech` sai sha đã nằm trong sổ (cứu K7 hồi tố) — chạm `lib/` (T3); xem Hỏi-1 ở sổ.
- Tách «đỏ ngoài vùng, chạy lại xanh» khỏi phần đếm trần 3 lượt (Mac Studio gợi ý) — hạt giống mốc tinh chỉnh 05/11.
- Ghi vân tay định nghĩa vào dòng eval của run-log ở bộ chấm — lối đã loại ở thiết kế (sửa bộ chấm, không cứu sổ cũ).
- So định nghĩa cho eval judgment — đã có P3 (băm đầu vào hội đồng).

## Known limits

- Eval sửa CHƯA commit lúc chấm rồi hoàn lại về bản ở sha trước lượt sau: định nghĩa ở sha bằng hôm nay nên mang sang
  kết quả của bản đã hoàn lại. Ngưỡng mở: ≥ 1 ca ở crm hay kit trong 30 ngày sau khi nhận.
- `evals.yaml` ngoài kho git: không so được định nghĩa, CLI carry-plan in một dòng rồi chỉ `paths` quyết. Ngoài đời
  không có (s4-args đòi git) — chỉ fixture thuần chạm.

## Notes

- Nới luật chiều rộng (b) cho cửa sổ 16/10, chủ kho quyết — không phải tiền lệ (ô cơ hội).
