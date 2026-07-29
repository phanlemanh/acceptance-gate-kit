# Review Findings: cross-feature-claim-index (round 2)

## Trong hợp đồng

- **SKILL.md S1#7 mâu thuẫn nội tại: thêm 'input thứ 5' nhưng vẫn giữ 'Input CHỈ 4 file' và 'Prompt giữ đủ 6 ý' trong khi liệt kê 7 ý**
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/skills/feature-loop/SKILL.md:89`
  severity: medium
  detail: Diff này thêm claim-scan làm "input thứ 5" của critic và thêm ý prompt số (7), nhưng cùng bước đó vẫn ghi nguyên văn "Input CHỈ 4 file: design doc + contract.md + evals.yaml + decisions.jsonl" và "Prompt giữ đủ 6 ý:" rồi đánh số (1)–(7). Đây là instruction doc máy-đọc-máy-theo: một phiên model đọc mệnh đề tuyệt đối "CHỈ 4 file" đứng NGAY TRƯỚC câu dispatch hoàn toàn có thể bỏ rơi file claims (đúng hành vi mà finding S4-r1 về fail-open vừa dạy phải tránh), hoặc cắt ý (7) vì "đủ 6 ý". Test canh gác skill-claims.test.mjs chỉ assert SỰ CÓ MẶT của các mệnh đề mới (CS7/CS8) — không bắt được mâu thuẫn với mệnh đề cũ, nên hai câu này sẽ tồn tại song song vô hạn. Sửa phải là "CHỈ 4 file (+ file claims làm input thứ 5 khi có)" và "giữ đủ 7 ý" (hoặc bỏ đếm cứng).
  AC: AC-7

- **Ledger entry thiếu `at` được sort như claim MỚI NHẤT — String(null)="null" thắng mọi ISO date**
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs:85`
  severity: low
  detail: `ledgerClaims` gán `at: e.at ?? null` không kiểm (khác probeClaims: thiếu `at` → skip loud), rồi comparator `String(b.at).localeCompare(String(a.at))` biến null thành chuỗi "null", mà "null" > "2026-..." theo lexicographic. Đã tái hiện: entry fix không có `at` xếp TRÊN entry ngày 2026-07-28 trong output. Dưới áp lực cap 10 + sàn 3 slot/nguồn, một entry ledger hỏng metadata chiếm slot của bài học thật sự mới — sai với spec "recency sau (`at` giảm dần)" và lặng lẽ (không warning). Sửa: hoặc skip-loud như probeClaims, hoặc cho at null xếp CUỐI nhóm cùng sev.
  AC: AC-5

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bump minor 1.18.0 nhưng description plugin.json không có câu 'v1.18 adds …' — lệch pattern changelog-trong-description đã dùng suốt v1.12→v1.17**
  Người dùng thấy gì: Số phiên bản plugin tăng lên 1.18.0 nhưng phần mô tả không nói rõ bản này thêm tính năng gì, nên người đọc thông tin phiên bản sẽ không biết được điểm khác biệt so với bản trước.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

- **Claim có id thiếu/sai khuôn bị drop IM LẶNG — vi phạm chính bảng error-handling của design (skip phải đếm to)**
  Người dùng thấy gì: Khi một bài học được ghi lại nhưng có định dạng mã nhận diện không đúng chuẩn, hệ thống âm thầm bỏ qua nó mà không báo cho ai biết, khiến bài học đó biến mất mà không để lại dấu vết cho người xem sau này.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Regex `## Findings` nuốt tới EOF — bảng ở section SAU bị parse thành finding ma, sinh id trích dẫn giả**
  Người dùng thấy gì: Nếu tài liệu ghi thêm nội dung khác ngay sau phần liệt kê lỗi chính, công cụ có thể nhầm nội dung đó thành lỗi thật và trộn nó vào danh sách gợi ý hiển thị cho người dùng, làm sai lệch thông tin được đưa ra.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).