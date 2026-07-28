# Review Findings: s4-scope-triage (round 5)

Informational — outside the hook-enforced evidence-report schema. Chia theo
kết quả SCOPE-TRIAGE (in-contract / out-of-contract), không phải theo
reviewer lane.

## Trong hợp đồng

(không có finding nào)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P53 byte-compare exempts the fixture's first 6 lines from verification**
  Người dùng thấy gì: Bài kiểm tra dùng để bảo đảm mẫu thẻ hiển thị cho người duyệt khớp với bản render thật hiện không soát 6 dòng đầu của mẫu đó, nên một chỉnh sửa gây hiểu lầm ở đúng phần đầu này có thể lọt qua mà không bị phát hiện, làm giảm độ tin cậy của mẫu dùng để kiểm tra card.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Cluster flag silently dropped if writer emits emoji-presentation ⚠️ variant**
  Người dùng thấy gì: Nếu AI ghi cảnh báo bằng một kiểu ký tự cảm thán hơi khác thường lệ, dòng cờ báo "có nhiều phát hiện nằm ngoài phạm vi đã duyệt" có thể biến mất khỏi thẻ quyết định mà không báo lỗi gì — người duyệt sẽ thấy thẻ "sạch" dù thực ra có một cụm vấn đề ngoài phạm vi đang chờ quyết định mở rộng hay cắt bớt phạm vi.
  file: `lib/out-of-contract.js`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có finding nào)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
