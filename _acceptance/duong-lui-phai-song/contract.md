---
schema_version: 1
feature: Đường lùi phải sống — làn máy-đi-trước có đường lùi thật ở hai cửa: người veto bằng một chữ và ô kết máy-đã-thông có đường ghi; máy không coi «không đo được» là sạch, làn V vẫn bị kiểm hoá cũ, lệnh ký chạy làn máy trước chữ ký
slug: duong-lui-phai-song
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh (t3_paths) — lưới chặn-merge của mọi kho tiêu thụ
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-09-08-duong-lui-phai-song-design.md
approved_by: Manh Phan
approved_at: 2026-09-07T22:58:00Z   # ISO UTC — «duyệt» + «Xác nhận» 08/09 ~05:58 giờ VN, máy ghi hộ
---

# Acceptance Contract: duong-lui-phai-song

## Context

Hiến pháp cho máy đi trước khi máy giữ được đường đảo (nguyên tố 3). Cửa sổ 2.8→2.9 đo được
đường đảo thủng ở hai cửa (mốc 2.9.0, chỗ cắt gọi tên): lời mời cổng in «veto: lý do» mà không
lệnh nào nhận; 38 hồ sơ mở cửa veto đều nằm ở `verified` vì không bước nào ghi ô kết
`machine-cleared`; bộ soi lại bằng chứng không chạy được thì in NOTE kể cả chế độ nghiêm; nhánh
xanh-sạch của lưới `continue` trước khối kiểm bằng-chứng-cũ; heading h1 làm mục có nội dung đọc
thành rỗng; lệnh ký commit chữ ký rồi mới soi, mỗi chữ ký kéo một CI đỏ (5 lần trong hai mốc).
Owner gọi tên vòng 08/09 («Thực hiện hết»), một vòng T3, thứ tự (e)(c)(d)(d′) rồi (a)(b), đường
cắt khai trước ở Out of scope. Gom hai ô discovery đã lưu kho (`lan-may-thong-duong-ghi`,
`lan-v-thoat-kiem-stale`) và Ngoài-2/Ngoài-4 của `thuoc-khai-mot-dang-do-mot-neo`.

Vật chạm: `scripts/pre-merge-check.sh` (t3) · `lib/evidence-core.cjs` (t3 — `evaluateContractWrite` nhận `da-veto` như một lối Cổng-1-đã-ghi hợp lệ trên hồ sơ máy-đi-trước) · `scripts/khong-can-nguoi.mjs` · `commands/signoff.md` ·
`skills/acceptance/SKILL.md` · `skills/acceptance/references/human-facing-language.md` (SLOTS +
GRAMMAR) · `feature-loop/skills/feature-loop/SKILL.md` · `tests/plugins/lan-v.test.mjs` ·
`tests/scripts/additive-only.test.mjs` (khai dòng gỡ) · `tests/plugins/run-tests.sh` (fixture P192) ·
răng hồ sơ `_acceptance/duong-lui-phai-song/rang.sh` · `_acceptance/config.yaml` (khoá `dlps_*`, sinh ở S3 cùng răng).

Source input: `_acceptance/duong-lui-phai-song/opportunity.md` (Cổng Đáng 08/09) ·
`docs/findings/2026-09-07-bai-hoc-playbook-ban-de-doc.md` §2 bài 3, §4 · hai ô đã gộp ·
`_acceptance/release-2-9-0/contract.md` §Chỗ cắt gọi tên · hai phiên đọc mã 08/09 (ngữ cảnh sạch).

## Criteria

- AC-1: Given repo khai `recheck: strict`, When bộ soi lại bằng chứng KHÔNG chạy được (script vắng · `node` vắng · thoát mã 2 vì lib vắng hoặc đọc file lỗi), Then lưới trước-merge in `VIOLATION [<slug>]: evidence re-check KHÔNG CHẠY ĐƯỢC (<đường>)` gọi đúng đường và chặn merge; Given `recheck: warn`, Then vẫn là NOTE như cũ; Given bộ soi lại chạy được và sạch, Then không VIOLATION nào mới.
- AC-2: Given hồ sơ đi làn V xanh-sạch nằm trong diff PR, có `verified_commit` giải được, When có file ngoài `_acceptance/` và ngoài T1 đổi sau `verified_commit`, Then lưới in `VIOLATION [<slug>]: làn V — evidence is stale (code changed after verify, verified_commit <sha>)` thay vì NOTE xanh-sạch; Given không file nào đổi, Then NOTE xanh-sạch và đi tiếp như cũ; Given hồ sơ trong diff mà `verified_commit` là SHA không có trong repo (clone đầy đủ), Then VIOLATION pin-ma cùng họ với hồ sơ có chữ ký (luật P184) — không NOTE xanh-sạch; Given `verified_commit` rỗng, Then NOTE có tên «report has no verified_commit» thay vì NOTE xanh-sạch; Given hồ sơ ngoài diff PR, Then im lặng (luật stale-theo-diff-pr giữ nguyên). Ma trận 5 ô khai trước.
- AC-3: Given báo cáo bằng chứng viết mục «Known limits» hoặc «Ngoài hợp đồng» bằng heading h1 (`# …`) có nội dung, When bash `xanh_sach_check` và `khong-can-nguoi.mjs` cùng đọc, Then cả hai trả CÙNG một lý do không-sạch — «mục «Known limits» VẮNG khỏi báo cáo (vắng ≠ rỗng)» (h1 không phải tiêu đề với ranh `#{2,6}`, cùng `section()`) — bằng nhau từng ký tự giữa bash và mjs; ma trận LV5 chứa ca này thay vì loại trừ.
- AC-4: Given người phát ngôn «Ký» ở lệnh ký, When làn máy của chính hồ sơ (suite trong `feature_loop.suite_keys` + mọi eval `test`/`script` của `evals.yaml`) chạy trên cây làm việc TRƯỚC commit và có lệnh thoát khác 0, Then KHÔNG có commit chữ ký, dòng đỏ in nguyên văn; When làn xanh, Then commit chữ ký gồm mọi file làn đòi trong MỘT lượt. Dòng lệnh của làn (`repin-lane.mjs … --allow-dirty`, không `--write`) là MỘT nguồn nằm trong khối `SIGNOFF-LANE-CLAUSE`; răng rút lệnh từ khối đó để chạy trên fixture (round-trip writer→reader), không chép lại lời lệnh.
- AC-5: Given commit chữ ký làm bằng chứng của chính hồ sơ hoá cũ (lưới trước-merge báo `evidence is stale` cho slug đó), When lệnh ký tiếp tục trong cùng lượt, Then làn ghim lại `--write` chạy, commit ghim lại nằm TRƯỚC khi báo READY, và READY chỉ in khi lưới 0 violation.
- AC-6: Given hồ sơ máy-đi-trước (lời mời cổng in ô «veto hay để yên»), When người gõ «veto: <lý do>» ở lệnh ký, Then `veto_state: da-veto` được ghi qua công cụ sửa file và lưới ghi-lúc-viết (`evaluateContractWrite`) CHẤP NHẬN lượt ghi đó trên MỌI hồ sơ máy-đi-trước — ma trận 4 ô khai trước: status ∈ {verified, machine-cleared} × Cổng 1 ∈ {`approved_by` có, làn V `mo`} — kể cả ô machine-cleared × mo mà luật hôm nay từ chối với thông điệp Cổng-1-chưa-được-ghi; sổ quyết định có entry `type: veto` mang lý do nguyên văn và `decided_by`, commit `Veto: <slug> — <tên>`, máy in một dòng rồi DỪNG; lưới trước-merge chặn merge cho tới khi người xử.
- AC-7: Given khối `GATE-ONESHOT-SLOTS` và `GATE-ONESHOT-GRAMMAR`, Then có nhãn `g2 veto hay để yên` và luật «veto: <lý do>» (chỉ hợp lệ trên hồ sơ máy-đi-trước; «để yên» = không làm gì); lời mời cổng máy-đi-trước render nhãn đó và round-trip P192 hai chiều xanh trên fixture code-sinh.
- AC-8: Given hồ sơ `status: verified`, `risk_tier: T2`, đủ sáu điều kiện xanh-sạch, When chạy `scripts/khong-can-nguoi.mjs --write --root <r> --slug <s>`, Then chỉ dòng `status:` của hợp đồng đổi thành `machine-cleared`, script tự kiểm bằng `evaluateContractWrite` và thoát 0; Given thiếu một điều kiện hoặc hạng T3, Then thoát 2 nêu điều kiện trượt đầu tiên và file không đổi byte nào; `--check` không ghi.
- AC-9: Given SKILL feature-loop, Then hàng `verified` gọi bước ghi ô kết (`khong-can-nguoi.mjs --write` rồi vẽ lại bản đồ, commit phần máy viết) và hàng `machine-cleared` không còn đoạn «ĐƯỜNG GHI CHƯA BẬT»; hai lời dặn đó có răng ghim văn bản (skill-claims).
- AC-10: Given khối `SIGNOFF-LANE-CLAUSE` trong `commands/signoff.md`, Then `skills/acceptance/SKILL.md` chép nguyên văn; lệch một ký tự → răng gọi tên bản lệch.
- AC-11: Given cây thật sau khi vá, When chạy lưới trước-merge ở chế độ soi toàn bộ hồ sơ so với `origin/main`, Then số VIOLATION không tăng so với `origin/main` (hồ sơ sử liệu không đỏ hàng loạt), và răng additive-only (DV5) xanh với mọi dòng gỡ khai đích danh.
- AC-12: Given bốn suite thường trực và `product-map --check`, When chạy trên cây đã vá, Then tất cả thoát 0.

## Coverage

- Trục A · Cửa (người | máy) [thước CE: hiến pháp nguyên tố 3 — đường đảo có hai chủ thể] · Trục B · Thời điểm (lúc máy đi tiếp S4 | lượt người ở lệnh ký | chốt trước-merge) [thước CE: ba chỗ duy nhất mã cổng chạy, đọc từ SKILL feature-loop và lưới trước-merge] · Trục C · Lớp lỗi (thiếu bộ ghi | fail-open | nối tắt | thứ tự sai) [thước CE: sổ lớp lỗi của kit, gap-probe 2.5.0→2.9.0]. Không gian 24 ô, 9 có nghĩa; Core 6 → AC-1 (c) · AC-2 (d) · AC-3 (d′) · AC-4/AC-5 (e) · AC-6/AC-7 (a) · AC-8/AC-9 (b); Later 2 (mục rỗng vì bước tổng hợp · thuế định tuyến kit-only); Never 1 (lệnh cổng thứ bảy). Chân ngành: [NGÀNH: AI-Native SDLC playbook — rollback được tập trước khi cần; lớp hỏng thì không chạy] · [NGÀNH: GitHub branch protection — required status không chạy ≠ pass]. Cross-cutting: khoản khai sinh phép đo + DV5 additive-only → AC-10/11/12.

## Đường đo

- CI đỏ hậu-chữ-ký mỗi mốc phát hành: số từ ba dòng số của hồ sơ mốc kế (2.10.0), đếm từ `gh run list` — mốc 2.9.0 là 2, mục tiêu 0; AC-4 + AC-5 bảo đảm.
- Hồ sơ merge với mục báo cáo rỗng-vì-vắng-dữ-liệu: số từ hồ sơ mốc kế (quét evidence-report của hồ sơ merge trong cửa sổ) — mốc 2.9.0 là 1, mục tiêu 0; AC-2 + AC-3 thu hẹp (mục rỗng vì bước tổng hợp là ô Later, không hứa ở đây).
- Số hồ sơ ở ô kết `machine-cleared` trên bản đồ: 0 → ≥1 ở vòng làn V đầu tiên chạy dưới bản này; AC-8 + AC-9 bảo đảm.

## Out of scope

- Thêm lệnh cổng người thứ bảy — danh sách sáu thao tác là đóng (ADR 0002).
- Đổi sáu điều kiện xanh-sạch, hoặc bỏ chữ ký người khỏi làn — người ký sau vẫn đi được (lối ra thứ hai).
- Tổng quát hoá thuế dòng định tuyến (LM20) vào bộ máy — ca riêng của kho kit; lệnh ký chỉ cần «làn đỏ thì không commit» và «hoá cũ thì ghim lại cùng lượt».
- Sửa bước tổng hợp S4 làm mục «Ngoài hợp đồng» bốc hơi (ô Later, vật là workflow).
- Sửa `REPIN_EVALS_SINCE` (P1 của 0b5c5b37) — ngoài họ này, ghi ở hồ sơ mốc 2.9.0.
- Tái cấu trúc `pre-merge-check.sh` — mọi vá là THÊM dòng (DV5); dòng gỡ chỉ là HAI dòng ranh tiêu đề `#{1,6}` trong `xanh_sach_check` (vế kiểm và vế cắt), khai đích danh.
- Dời 38 hồ sơ đang mở cửa veto ở `verified` sang ô kết — đường ghi chỉ áp cho vòng mới; dời hàng loạt phải đi kèm chiến dịch ghim lại ở mốc kế (chạm hợp đồng là vào diff, và AC-2 sẽ bắt hoá cũ cho cả 38).
- **Đường cắt khai trước:** S4 chạm trần ba vòng chấm → thu phạm vi bỏ AC-6..AC-9 (lát 1), ship AC-1..AC-5 + AC-10..12 (lát 2).

## Notes

- Known limits: AC-4/AC-5 đo bằng fixture kho-git code-sinh chạy đúng thứ tự bước của lệnh ký; lệnh ký là lời dặn cho model — răng canh VĂN BẢN (khối marker) và HÀNH VI của script làn, không canh được một phiên bỏ qua chỉ dẫn (cùng giới hạn AC-8 của #136).
- Known limits: eval `ui-check`/`judgment` không chạy trong làn máy — làn trước chữ ký không chứng lại chúng (giới hạn đã khai của ADR 0014).
- Known limits: 38 hồ sơ mở cửa veto hiện ở `verified` KHÔNG được dời sang ô kết trong vòng này; bảng điều khiển chỉ hết nhập nhằng cho vòng mới. Tương tác (d) × dời hàng loạt: phải ghim lại trước (mốc kế).
- Known limits: E9 (skill-claims) đo VĂN BẢN lời dặn của SKILL — cố ý, vật của lời dặn là chữ; hành vi thật do E8 canh.
