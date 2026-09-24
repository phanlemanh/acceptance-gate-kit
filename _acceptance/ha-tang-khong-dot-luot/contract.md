---
schema_version: 1
feature: Hạ tầng thôi đốt lượt chấm và lượt gọi người — suite scripts chạy dưới trần công cụ, lượt BLOCKED vì hạ tầng thử lại cùng round, khuôn /goal thôi coi BLOCKED là xong, thẻ Cổng 1 của hồ sơ đã khép thôi hỏi
slug: ha-tang-khong-dot-luot
owner: phanlemanh@gmail.com
risk_tier: T2      # không tệp nào khớp t3_paths (hooks/**, lib/**, pre-merge-check.sh, recheck-evidence.cjs); lib/nhan-canh-gay.cjs chỉ được GỌI, không sửa
surfaces: [cli, docs]
status: approved      # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: ""
approved_at: ""
veto_state: mo
veto_opened_at: 2026-09-24T00:31:38Z
design_doc: docs/superpowers/specs/2026-09-24-ha-tang-khong-dot-luot-design.md
---

# Acceptance Contract: ha-tang-khong-dot-luot

## Context

Ba hạt giống owner gọi tên 24/09 là CÙNG một lớp: hạ tầng làm hỏng một lượt, và kit tính lượt
hỏng ấy như một lượt của vật hoặc như một câu hỏi cho người. Luật đúng đã có (khối ĐỊNH VỊ, K8:
*hệ thống chết* → thử lại MỘT lần; bên đọc `lib/nhan-canh-gay.cjs` từ 2.18.0), bên viết và bên
điều phối chưa nối. Người hưởng: owner (bớt lượt gọi ngoài thiết kế; thẻ hồ sơ khép thôi hỏi) ·
phiên Claude Code chạy vòng ở kit và kho tiêu thụ (round đầu thôi BLOCKED vì trần; Stop hook
thôi dừng ở BLOCKED) · chi phí máy mỗi vòng. Trace: nguyên tố 3 (khoảnh khắc quyết thật — không
hỏi người điều K8 đã quyết) và nguyên tố 2 (lượt hạ tầng không được đọc thành lượt của vật).
Toàn bộ là TRỪ hoặc đổi cách chạy; không CỘNG (ADR 0018), không đổi enum, không thêm thao tác
cổng người.

Source input: `_acceptance/ha-tang-khong-dot-luot/opportunity.md` ·
`docs/plans/2026-09-22-hat-giong-suite-scripts-qua-tran-cong-cu.md` ·
`docs/plans/2026-09-23-hat-giong-goal-template-coi-blocked-la-xong.md` ·
`docs/plans/2026-09-22-hat-giong-the-cong-1-ho-so-khep-van-hoi.md` · design doc ở frontmatter.

## Criteria

- AC-1: Given tệp chạy suite THẬT `tests/scripts/run-tests.sh` và thư mục ca thật, When in danh sách tệp của từng mảnh mjs bằng `SCRIPTS_SHARD_LIST=1` (cùng hàm chọn tệp lượt chạy dùng) với mọi `mjs:<i>/<n>` mà `feature_loop.suite_keys` khai, Then các mảnh rời nhau từng đôi, mỗi mảnh ≥ 1 tệp, hợp của chúng bằng ĐÚNG tập `*.test.mjs` của thư mục (trừ `wf-usage.test.mjs`, như vòng lặp hôm nay), và mảnh `bash` liệt 0 tệp mjs; không đặt `SCRIPTS_SHARD` → liệt đủ tập (đường cũ). Chiều đỏ: bản sao tệp chạy suite đổi phép chia thành bỏ sót chỉ số cuối → ca đỏ gọi tên tệp bị sót.
- AC-2: Given thư mục fixture do code sinh gồm bản ghép từ tệp chạy suite thật theo marker (phần đầu tới `<<<CA-BASH-DAU`, khối gọi vòng mjs `MJS-GOI`, phần kết từ `<<<KET-SUITE`) cộng hai ca bash tiêm và bốn tệp ca giả thoát 0, When chạy lần lượt không đặt mảnh, `bash`, `mjs:1/2`, `mjs:2/2`, Then mọi lượt thoát 0, mảnh mjs KHÔNG in tiêu đề ca bash nào, và số «passed» thoả đúng quan hệ tất-cả = bash + mjs:1/2 + mjs:2/2 − (n − 1) (ca «≥ 1 tệp mjs» chạy một lần mỗi mảnh mjs, một lần ở lượt trọn) — đối chứng dương; cùng fixture tiêm một tệp ca giả thoát 1 → đúng mảnh mà danh sách AC-1 gán nó thoát ≠ 0 với «FAIL: <tên tệp>», mảnh mjs kia thoát 0; tiêm một ca bash thoát 1 → mảnh `bash` thoát ≠ 0 và in FAIL gọi tên ca, hai mảnh mjs thoát 0.
- AC-3: Given `_acceptance/config.yaml`, When đọc `feature_loop.suite_keys` và các khoá `executors.test.*`, Then suite_keys có `executors.test.scripts_bash` và đủ `executors.test.scripts_mjs_<i>` cho i = 1…n (n rút từ chính lệnh các khoá, không gõ tay), mỗi khoá chạy tệp chạy suite với đúng một giá trị `SCRIPTS_SHARD`, KHÔNG còn `executors.test.scripts` trong suite_keys; `executors.test.scripts` vẫn là lệnh chạy trọn không đặt mảnh; `.github/workflows/gate.yml` vẫn chạy trọn suite. Chiều đỏ: bản sao config bỏ một khoá mảnh khỏi suite_keys → ca đỏ gọi tên mảnh thiếu.
- AC-4: Given ma trận chín kho viết trước — (1) không `evidence-report.md`, không run-log · (2) Iterations «Round 1», không run-log · và cùng Iterations «Round 1» cho các hàng sau: (3) tally round 1 PASS · (4) round 1 REJECT · (5) round 1 BLOCKED nhãn `chet` lần đầu · (6) round 1 BLOCKED nhãn `mu` (công cụ ngắt) lần đầu · (7) round 1 BLOCKED hạ tầng đã thử lại (hai dòng tally BLOCKED cùng round) · (8) round 1 BLOCKED có mục nhãn `vat` · (9) round 1 BLOCKED hạ tầng kèm dòng `finding` inContract cùng lượt — When chạy `s4-args.mjs`, Then round lần lượt là [1, 2, 2, 2, 1, 1, 2, 2, 2] (số assert = 9); hàng (7) có thêm đúng một dòng stderr «đã thử lại một lần vẫn chặn vì hạ tầng — trình thẻ Cổng Bằng chứng»; hàng BLOCKED sớm không báo cáo (Iterations «Round 1», tally round 2 BLOCKED `chet`) → round 2; hàng trần (Iterations Round 1–3, tally round 3 BLOCKED `chet` lần đầu) → round 3 khi có `--no-carry`, và thiếu cờ carry thì thoát ≠ 0 với thông điệp carry cũ. Round-trip: dòng run-log của hàng (5) và (9) SINH bởi chính workflow chấm (`acceptance-verify.js` chạy qua harness của `tests/workflows/` với tác tử giả: một lệnh chết, và có/không một finding trong hợp đồng) → s4-args ra 1 và 2. Chiều đỏ: bản sao `s4-args.mjs` gỡ khối thử-lại-cùng-round → hàng (5) và (6) lật sang 2, thông điệp ghim số hàng.
- AC-5: Given ba bản khuôn goal (SKILL feature-loop · GUIDE · hằng `gate-card.js`), When rút qua marker `GOAL-TEMPLATE`, Then ba bản khớp sau strip và đúng 6 dòng (P85); khuôn không chứa `status:`, «không chắc», «người chọn», «nêu lối», và mọi câu có chữ «BLOCKED» đều chứa «CHƯA hoàn thành»; thẻ Cổng 1 in dòng goal bằng khuôn mới. Chiều đỏ: bản sao khuôn chèn lại vế «(REJECT quá 3 round / BLOCKED / chờ input người) cũng coi là HOÀN THÀNH» → ca đỏ gọi tên tính chất bị vi phạm; chèn lại vế «Dừng mà không nêu tiền đề hay lối nào để người chọn = CHƯA hoàn thành» → đỏ gọi tên «nêu lối».
- AC-6: Given SKILL feature-loop, When đọc bước S4 `BLOCKED` và câu Gate 1.5 về goal, Then bước BLOCKED nói lượt chạy lại do `s4-args` đánh số, lượt hạ tầng không đếm vào trần, thử lại MỘT lần, còn finding trong hợp đồng thì sửa như REJECT, đã thử lại vẫn chặn thì trình thẻ Cổng Bằng chứng; câu Gate 1.5 không còn nói «khuôn coi chờ input người là hoàn thành». Chiều đỏ: bản sao SKILL đời 2.18.2 → ca đỏ gọi tên câu thiếu.
- AC-7: Given ma trận bốn hồ sơ viết trước — (1) `da-cham-boi-thuc-te` có dòng quan sát đủ vế, KHÔNG có `evidence-report.md` · (2) hồ sơ `approved` có dòng sổ nghỉ đủ vế (nghỉ trên hồ sơ CHƯA ký — vị từ một nguồn `hoSoDaKhep` của 2.18.1 xếp KHÔNG khép) · (3) hồ sơ `draft` sống · (4) hồ sơ `approved` sống — When dựng thẻ bằng `gate-card.js --extract` (cổng tự nhận), Then (1) ra `routing.hoi` rỗng, không `one_shot`, không `goal_line`, và thẻ HTML có dòng «Hồ sơ đã khép (đã chấm bởi thực tế) — không còn câu hỏi nào cho người»; (2), (3), (4) ra `routing.hoi` = ["duyệt hay sửa"] như trước vòng (số assert = 4). Chiều đỏ: bản sao `gate-card.js` gỡ vế khép ở nhánh Cổng 1 → hàng (1) có lại ô hỏi, thông điệp ghim slug.

## Coverage

Quét Zwicky rút gọn (preset test-matrix), đầy đủ ở design doc §3.

- **Trục 1 — kết cục lượt chấm cuối × nhãn** [thước CE: nhãn và `trangThai` rút từ `lib/nhan-canh-gay.cjs` — SUY-TỪ-REPO]: không gì · chỉ Iterations · PASS · REJECT · BLOCKED chet lần đầu · BLOCKED mu lần đầu · BLOCKED đã thử lại · BLOCKED có `vat` · BLOCKED hạ tầng + finding trong hợp đồng · BLOCKED sớm không báo cáo · BLOCKED ở trần (round 3) → AC-4 toàn phần; bên viết thật round-trip cho hàng chet và chet+finding.
- **Trục 2 — bản khuôn goal × tính chất**: SKILL · GUIDE · gate-card × (khớp, 6 dòng, không `status:`, BLOCKED chỉ ở câu CHƯA hoàn thành) → AC-5 toàn phần; chữ quanh khuôn trong SKILL → AC-6.
- **Trục 3 — hồ sơ × nhánh cổng**: khép-thực-tế-không-báo-cáo · nghỉ-trên-hồ-sơ-chưa-ký · sống draft · sống approved → AC-7 toàn phần; nhánh Cổng 2 của hồ sơ khép đã có ca HK-AC6 (2.18.1), không lặp.
- **Trục 4 — suite × mảnh**: phân hoạch (AC-1) · độ nhạy từng mảnh (AC-2) · nối vào lượt chấm (AC-3).
- `[GIẢ ĐỊNH]` Thời lượng mỗi mảnh dưới 80 % trần 600 s đo trên máy S3 (design doc §5) — thời gian là đại lượng máy, không ghim thành ca; đường đo thật là lượt chấm đầu của chính vòng này.

## Đường đo

- lượt chấm bị trần công cụ đốt ở round 1 của vòng này = 0: số từ dòng `round-tally` round 1 trong `run-log.jsonl` của hồ sơ này (verdict ≠ BLOCKED, hoặc BLOCKED không mục nhãn `mu` do công cụ ngắt) · AC bảo đảm: AC-1, AC-2, AC-3
- ca của các mảnh = suite nguyên: số từ ca AC-1 · AC bảo đảm: AC-1
- BLOCKED-vì-hạ-tầng thành round mới = 0: số từ ca AC-4 (hàng 5, 6, trần) và từ run-log crm sau cài · AC bảo đảm: AC-4
- câu hỏi cho người sinh từ BLOCKED-vì-hạ-tầng = 0: đếm tay ở crm sau cài (phiên đọc khuôn goal mới + bước BLOCKED mới). Ca hình crm `kiem-auth` — lượt BLOCKED có finding TRONG hợp đồng — là REJECT về bản chất: máy sửa vật, round kế đếm; nếu nó chạm trần 3 round thì câu hỏi ở trần là lượt TRONG thiết kế (phanh dừng-vá), không tính vào ngưỡng này · AC bảo đảm: AC-4, AC-5, AC-6
- ô hỏi trên thẻ hồ sơ đã khép ở crm = 0/7: số từ `gate-card.js --extract` trên bảy hồ sơ thực tế ở crm sau cài · AC bảo đảm: AC-7
- lượt gọi người ≤ 3: đếm tay từ sổ quyết định + hội thoại · AC bảo đảm: — (đếm, không phải vật)

## Out of scope

- Đổi enum nhãn cạnh gãy hay thiết kế AC-7 của 2.18.0 — vòng này chỉ NỐI bên viết vào bên đọc đã có.
- Đổi thứ suite đo, xoá ca để lọt trần.
- Chạy-nền-có-chờ trong prompt tác tử chấm (loại ở design doc §2.A — máy giữ bất biến bằng mảnh, không bằng lời dặn tác tử).
- Đổi khuôn `run_id` đúc (`minted-<slug>-<id>-r<round>`) cho lượt thử lại cùng round.
- Răng bên đọc `verified_at` chữ ký (hạt giống 2026-09-23, CỘNG) — chỉ vào khi owner phê ở Cổng Phạm vi.
- Rollout 2.18.3 ra kho ngoài crm.

## Notes

- Lượt thử lại cùng round đúc lại cùng `run_id` (khuôn không mang mốc giờ). Bộ đọc bằng chứng là phép có-mặt nên mã trùng vô hại; `canhGay` tách lượt theo `ts`. Ngưỡng mở lại: một bộ đọc nào đọc NHẦM kết quả lượt bị thay vì trùng mã.
