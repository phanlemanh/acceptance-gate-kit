---
slug: mot-luot-go-cong-nguoi
at: 2026-08-11T02:40:00Z
verdict: findings
p0: 1
p1: 3
p2: 3
---

# Gap-probe: mot-luot-go-cong-nguoi

Critic context sạch (subagent tươi), input: contract draft + gate-card.js
thật + bản luật ngôn ngữ mặt người + 6 thân lệnh + sync script + suite.
Toàn bộ finding là lỗ đo-lường trong phạm vi đã chốt; không lật quyết định
nào. Định đoạt one-pass: cả 7 sửa thẳng vào contract/evals trước Cổng 1,
GỘP cùng lượt với 3 yêu cầu phiên B cài trước cho mốc 2 (round-trip
SLOTS→thân-lệnh · judgment người-gõ context-tươi · known-limit khai có ý
thức về hành-vi-LLM-không-máy-đo-được).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract vật giao (b) --repo / AC-1..6 | KHÔNG một AC nào đo --repo: không phép đo nào đòi 12 thân lệnh chỉ dẫn `--repo`, trong khi thân hiện tại đầy lệnh đóng đinh cwd (start.md:10 `--root .` · approve.md:61 `--root .` · signoff.md:76 `pre-merge-check.sh .` · signoff bước 7 git add đường tương đối) | Thi công thêm --repo vào 3/12 site, quên 9 site còn lại — AC-1..6 vẫn XANH hết, chip ship với deliverable chính chỉ một nửa | `grep -rln -- '--repo' commands/*.md codex/acceptance-gate/skills/*/SKILL.md` → 0 hit hiện tại (needle sạch) — nhưng contract không phép đo nào đòi 12/12 sau thi công | fixed: AC-3 thêm chiều đo per-site: needle `--repo` + con trỏ `GATE-ONESHOT-GRAMMAR` trong TỪNG site; chiều đỏ MUTANT-F gỡ needle khỏi MỘT bản sao → đỏ đích danh |
| P1 | AC-4 | Câu «mutant lock-flip sẵn có của P31/P32» — mutant đó KHÔNG tồn tại: P31/P32 là assert dương thuần (run-tests.sh:489-517), flip-mutant duy nhất trong suite là của design-pass, đo chiều ngược | Evidence-report chép nguyên văn «đối chứng đã-có-răng» → trích một phép đo ma; người ký tin AC-4 có chiều đỏ trong khi chỉ có assert dương | `grep -n "allow_implicit_invocation" tests/plugins/run-tests.sh` → chỉ dòng 500/502 (assert) | fixed: AC-4 sửa lời — khai đúng bản chất: P31/P32 là assert-trực-tiếp trên cây thật, phá vật thật → đỏ với message ĐÃ ghim «lacks policy lock» / «lacks lock»; không nhận vơ mutant |
| P1 | contract vật giao (c) kết khối 👉 / AC-3+AC-4 | Out-of-scope hứa 6 lệnh chỉ dẫn kết khối 👉 «qua điều khoản của chính chip này, đo bằng AC-3» — nhưng AC-3 chỉ đo nguyên-văn-từng-ký-tự, AC-4 chỉ ghim MỘT câu máy-không-gọi; không AC nào ghim điều khoản CÓ chứa yêu-cầu-kết-khối | GATE-ONESHOT-CLAUSE viết ra không nhắc khối 👉 → AC-3/AC-4 vẫn xanh, deliverable (c) bốc hơi không phép đo nào đỏ | Đọc AC-3 + AC-4 draft; GATE-INVITE-SITES cố tình không nhận 6 lệnh (out-of-scope cuối) nên P188 không phủ | fixed: AC-4 ghim clause chứa CẢ HAI câu neo: «câu gộp là câu NGƯỜI gõ» VÀ câu kết-khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE |
| P1 | AC-2 / Notes — thẻ dạy ↔ trường lệnh cần | Thẻ chỉ dạy «duyệt hay sửa» / «…; ký hay trả» nhưng /approve còn cần TÊN + PHÚT, /signoff cần name+date + phút — contract không nói câu gộp chở giá trị này ở đâu, cũng không khai «follow-up còn lại» | (i) Người dán đúng câu thẻ dạy vẫn bị hỏi thêm 2 câu — lời hứa một-lượt-gõ đúng một nửa không ai khai; (ii) grammar tự đẻ nhãn tên/phút thẻ chưa dạy — AC-2 một chiều nên xanh im lặng | Đối chiếu gate-card.js:350/:513-527 (không slot tên/phút) với approve.md:37-44, signoff.md:27-33 | fixed: AC-1 thêm gạch luật (e): đuôi «: <tên>[, phút <N>]» là nhãn NGOÀI-THẺ đánh dấu `extra` trong SLOTS (máy được DẠY trong thân lệnh + thẻ không đổi), kèm luật «tên/phút là follow-up duy nhất được phép khi vắng đuôi» |
| P2 | AC-2 chiều ngược | Round-trip chỉ đo card⊆SLOTS; dòng SLOTS chết (nhãn sai chính tả, nhãn không thẻ nào render) không bao giờ đỏ — đúng bài đếm-nguồn-2-hướng chip ②b | Grammar khai nhãn «duyet hay sua» (sai dấu) cạnh nhãn đúng → mọi phép đo xanh, model học nhãn ma | Đọc AC-2 draft: cả hai chiều đỏ đều biến thể một hướng | fixed: AC-2 thêm leg ngược: mỗi dòng SLOTS không đánh dấu `extra` phải được render bởi ≥1 fixture trong chính lần chạy; mutant thêm-dòng-chết → đỏ |
| P2 | Notes /start + AC-1 | Đường gộp /start không phép đo nào phủ: thẻ /start là văn model viết, không có dòng «Trả lời mẫu» máy-render nên AC-2 không phủ | Mục start trong GRAMMAR trôi (dạy chữ cái thay vì slug) — mọi AC xanh | start.md:16-25 (START-SCAN-KEYS có round-trip riêng); AC-2 chỉ chạy --gate 1/2 | fixed: AC-1 thêm needle-pin: mục /start của GRAMMAR chứa chữ `slug` + quy tắc «không thấy → trình thẻ như cũ»; hành-vi-model của start khai ngoài thước (vào known-limit) |
| P2 | AC-1/AC-2 khuôn <mã eval> | Khuôn nhãn eval không định hình: reader thật chỉ hiện id khớp `E\w+` (gate-card.js:367) — SLOTS khai «chuỗi bất kỳ» thì ca cô-lập-lớp chỉ mạnh bằng fixture | Checker nhận «Ngoài-1» làm mã eval trong fixture khác → hai lớp nuốt nhau ngoài ca đã đo | gate-card.js:367 `^\|\s*(E\w+)` — row không khớp không bao giờ lên thẻ | fixed: ghim khuôn «<mã eval>» = `E\w+` ngay trong GATE-ONESHOT-SLOTS (đúng khuôn reader thật) |

## Các hướng đã soi không thấy lỗ (critic kiểm bằng vật)

- Needle sạch: `GATE-ONESHOT` 1 hit toàn cây (chính contract); `--repo` 0
  hit trong 12 site; P190+ còn trống (case cao nhất P189) — không có
  needle-đã-tồn-tại kiểu P0 chip ②b.
- Đếm site: commands/ đủ 6 đích; codex đủ 6 SKILL.md; plugins/ đủ 6 bản suy
  ra (nguồn skills/ chỉ có 5 skill — bản suy ra đến từ overlay codex);
  plugins/acceptance-gate/commands KHÔNG tồn tại, sync script không rsync
  commands/ — đúng lời contract.
- Hook --repo: TARGET_RE/CONTRACT_RE mở đầu `(^|[\\/])` match cả đường tuyệt
  đối — claim trong Notes đứng vững.
- gate-card.js đã nhận `--root <repo>` sẵn — lời hứa AC-5 khả thi kỹ thuật.
- Fixture code-sinh có sẵn: tests/plugins/fixtures/viec-cua-anh-scenarios.sh
  (`vca_scenario gate2-4loai`) sinh đủ 4 họ việc-người, id eval E9 — AC-2
  tái dùng được, đúng luật fixture-do-code-sinh.
- Kho nhãn đối chiếu code thật: Cổng 1 chỉ «duyệt hay sửa»; Cổng 2
  Ngoài-<n>/E-id/cắt-hoãn/Treo/ký-hay-trả với điều kiện hiện đúng như
  contract khai; «Ngoài-1» không khớp `E\w+` → phân biệt được về nguyên tắc.
- Out-of-scope init/status/report đứng vững bằng vật (status/report
  read-only không câu hỏi cổng; init 7 câu setup không thẻ nào dạy).
- ADR 0002: không thấy đường mở cho máy; câu gộp là arg/chat-reply người
  gõ, phần ghi vẫn qua hook write-time + require_human_commit.
- AC-3 format manifest sao đúng bài GATE-INVITE-SITES chip ②b — mẫu P188
  dùng lại nguyên khuôn.
