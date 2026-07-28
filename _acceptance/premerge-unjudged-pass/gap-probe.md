---
slug: premerge-unjudged-pass
at: 2026-07-28T12:35:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Cross-check

- **AC không có eval nào đo:** không có — 15/15 AC của contract v1 đều ánh xạ ≥1 eval, không eval mồ côi.
- **G/W/T không đo được bằng máy:** một chỗ thật (AC-13 nửa khẳng định "có nêu hệ quả khai/không khai" — không có chuỗi quan sát được) → thành F5. AC-15 mơ hồ CÓ CHỦ Ý, đã tag `(judgment)` và có E16 sinh-lại-rồi-diff làm gác cổng nên hợp lệ, không tính lỗ.
- **Trục Coverage không có AC phủ:** giá trị "chữ ký rỗng" của trục B hở — thước ghi AC-2/5/6/7/8 nhưng không AC nào dựng fixture rỗng, cũng không ai đo thứ tự "rỗng trước, luật mới sau" mà design khẳng định → thành F2.
- **Criterion qua backend thiếu `(cross-layer)` / chỉ có eval lớp UI:** không có và không áp dụng — `surfaces: [cli]`, toàn feature là một script shell, không có seam UI↔backend. AC duy nhất dùng `judgment` (AC-15) đã có eval `script` đi kèm.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Điều kiện kích hoạt theo chế độ gọi (`--base` / `--slug`) không ghim ở AC nào | Implementer đặt luật mới trong nhánh chỉ sống khi có `--base` (hợp lý vì lọc theo diff cần base); suite dựng fixture có `--base` nên E1..E14 xanh hết. Consumer gọi không `--base` — đúng chế độ đã gây incident #255 — thì cả 4 hình dạng fail-open nguyên vẹn. Feature ship, evidence PASS, lỗ không đóng | Bảng chế-độ-gọi: fixture đỏ × {có base, không base, --slug trúng} đều exit≠0 cùng dòng VIOLATION; kèm ô âm --slug trượt | fixed: thêm **AC-16** + eval **E17** |
| P1 | contract | Trục B hở giá trị "chữ ký rỗng" — chốt sẵn có không có đối chứng hồi quy | Implementer thấy hai chốt cùng đọc `human_signoff` nên gộp cho gọn. Repo KHÔNG khai approvers: chuỗi rỗng không khớp mẫu lưới-đen nào → rơi ra `clean`. Hồi quy fail-open trên một luật đang bảo vệ, do chính feature này gây ra; không eval nào có fixture rỗng nên suite xanh toàn tập | Fixture rỗng × {khai, không khai} ghim exit≠0 + NGUYÊN VĂN thông điệp chốt rỗng + ghim thứ tự | fixed: thêm **AC-17** + eval **E18** |
| P1 | evals | Phân giải `approvers` chỉ đo ở một hình dạng (inline, một tên) | Bộ tách viết bằng `sed`/`cut` chỉ lấy phần tử đầu, hoặc chỉ hiểu inline. Repo tiêu thụ khai `["Manh Phan", "memto"]`; memto ký thật → VIOLATION OAN trên hồ sơ hợp lệ, CI consumer đỏ trên main. Hoặc block list → tách ra 0 tên → bị báo "approvers khai mà không dùng được" dù YAML đúng. Cả hai xanh suốt suite. Fail-closed SAI khiến consumer gỡ luật thay vì dùng | Bảng {inline 2 tên, block list} × {ký tên #1, ký tên #2} đều xanh, + ô âm tên thứ ba | fixed: **AC-1** thành bảng, **E1** mở rộng 4 ô dương + 2 ô âm |
| P1 | contract | Ranh giới khớp tên không đo, và design ↔ decisions mô tả NGƯỢC nhau | Design nói tiền tố phải kết bằng hết-chuỗi-hoặc-ký-tự-không-chữ (⇒ `Manhattan` trượt); entry ledger `d-20260728T122323Z-18909` lại ghi trade-off là NHẬN `Manhattan`. Không AC nào phân xử → hai cách cài đặt trái ngược đều xanh. Hệ quả xa hơn cũng chưa khai: `Manh Phan — chưa duyệt, chờ họp` KHỚP và về `clean` — đúng lớp thành-thật-nhưng-chưa-xong mà feature nhắm tới, lọt ở cấu hình chặt nhất | Bảng biên 6 ô với `approvers: ["Manh"]`, mỗi ô một kết luận cố định trong contract | fixed một phần: **AC-2b** + eval **E2b** ghim 5/6 ô; ledger có entry `supersedes` sửa mô tả sai. Ô 6 → **human-gate1** |
| P2 | contract + evals | AC-13 chỉ đo được nửa PHỦ ĐỊNH của tài liệu | Implementer xoá dòng `# informational…` và không viết gì thay thế → P57 xanh, `acceptance-init` im lặng hoàn toàn về `signoff.approvers`. Repo mới scaffold, không khai approvers, dán giữ-chỗ tiếng Việt → rơi đúng lỗ đã cố ý descope, mà thuốc duy nhất ("khai approvers") không được nói ở đâu | Ghim vế khẳng định thành chuỗi kiểm được: phải có cả `signoff.approvers` lẫn marker cố định `# approvers: enforced —` | fixed: **AC-13** thêm vế (b), **E13** ghim cả hai vế |

## Đẩy lên Cổng 1

**Ô 6 của AC-2b** — `human_signoff: Manh Phan — chưa duyệt, chờ họp` với `approvers: ["Manh Phan"]`. Khớp tiền tố thuần thì ô này **PASS** và về `clean`, tức lớp thành-thật-nhưng-chưa-xong vẫn lọt ở cấu hình chặt nhất. Hai đường, cả hai có giá:

- **(a) Nhận** — giữ khớp tiền tố thuần, khai thẳng ô này vào "đã biết không bắt được". Rẻ, không đụng `approvers` tên ngắn, nhưng feature chỉ đóng được phần *chữ ký hoàn toàn không phải tên người*, không đóng *tên người kèm đuôi giữ-chỗ*.
- **(b) Siết** — đòi phần sau tên chỉ được là khoảng trắng hoặc một token ngày. Chặn được đuôi giữ-chỗ, nhưng thực chất ràng buộc định dạng ngày mà Out of scope đang nói KHÔNG làm, và sẽ đỏ trên chữ ký hợp lệ kiểu `Manh Phan 2026-07-28 (đã họp với team)`.

Ghi vào ledger `revisit` chờ Cổng 1; quyết xong điền thẳng vào AC-2b ô 6.

## Ghi chú phương pháp

Một pass, không re-probe sau khi sửa artifact (phần code đã có 3 round S4). Critic chạy context sạch: chỉ 4 file artifact, cấm đọc code repo và cấm nhận hội thoại brainstorm — F4 bắt được chính nhờ nó đọc design và `decisions.jsonl` như hai nguồn có thể mâu thuẫn, thay vì như một ý định duy nhất trong đầu tác giả.
