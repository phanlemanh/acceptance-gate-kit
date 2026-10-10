# Quét hình thái — không gian tiêu chí của vòng tac-tu-cham-chi-cham-khong

Preset xuất phát: `test-matrix`. Trục được dựng lại theo B1, vì bài toán là «mỗi vai chấm × môi trường × cách ghi», không phải ma trận màn hình.

## Ngữ cảnh

- Sản phẩm: kit nghiệm thu (engine `acceptance-gate` + `feature-loop`). Người dùng kit là phiên Claude Code chạy lượt chấm ở kho tiêu thụ (kit, crm, oneflow, radar, artifact-platform) `[SUY-TỪ-REPO: CLAUDE.md]`.
- Chân ngành:
  - `[NGÀNH: Principle of least privilege — Saltzer & Schroeder 1975]`: tiến trình chỉ cầm đúng quyền việc cần.
  - `[NGÀNH: OWASP Top 10 for LLM Applications 2025 — LLM06 Excessive Agency]`: tác tử có công cụ/quyền vượt việc là lớp rủi ro có tên; khuyến nghị giảm công cụ thay vì dặn bằng lời.
  - `[NGÀNH: Claude Code sub-agents — trường tools/disallowedTools]`: cơ chế nền đã thử ở `wf_1590a99c-ca6`.

## Trục

- **Trục A — vai chấm theo nhu cầu công cụ:** đọc-thuần (judge · triage · synthesize) | chạy-lệnh (machine · baseline · finder · refute · provenance) | ui (Bash + công cụ trình duyệt).
  `[thước CE: bảng MODEL_ROUTES, feature-loop/workflows/acceptance-verify.js — 9 vai, mỗi vai một lời gọi agentT]`
- **Trục B — loại tác tử có nạp được không:** nạp được (phiên mở sau khi cài gói) | không nạp (phiên mở trước khi cài, hoặc gói cũ).
  `[thước CE: wf_f9fd2939-efd — loại tạo giữa phiên báo «not found»]`
- **Trục C — tác tử làm gì với cây:** không ghi | ghi qua Edit/Write | ghi tệp qua Bash (`sed -i`, `>`) | commit/reset qua Bash.
  `[thước CE: transcript 3 tác tử đã ghi, đo 09/10 trong opportunity.md]`
- **Trục D — ai đổi cây (cho lối D):** tác tử chấm của lượt | phiên chính | phiên khác (gộp nhánh) | không rõ (thiếu transcript).
  `[thước CE: 3 dòng cay-doi 30 ngày của kit — 1 tác tử chấm, 2 phiên chính]`

Lớp cross-cutting: **kho** (kit | crm | kho khác), áp mọi ô qua luật 26/09: lượt sạch không đổi kết quả.

## Không gian (A × B × C → 24 ô; D × trạng thái tệp → 8 ô)

Ô gạch:
- «đọc-thuần × ghi qua Bash»: vai đọc-thuần không có Bash. Gạch — **vô nghĩa** khi lối A nạp được.
- «ui × không nạp × …»: gộp vào hàng «không nạp» chung của mọi vai. Gạch — **trùng**.

## Core

1. Đọc-thuần × nạp → không có Edit/Write/Bash — vai không cần ghi thì không cầm bút.
2. Chạy-lệnh/ui × nạp × Edit/Write → không có Edit/Write/NotebookEdit — đường ghi chính đã đo (2/3).
3. Mọi vai × nạp × không ghi → đề bài giữ nguyên từng byte, phán quyết lượt sạch không đổi — luật 26/09.
4. Mọi vai × không nạp → rơi CÓ TÊN về loại mặc định, lượt vẫn chạy, ghi dòng sổ — không BLOCKED kho nào vì phiên cũ.
5. Tác tử chấm × ghi qua Bash (tệp/commit) → lối D quy trách nhiệm + dòng `ghi-boi-tac-tu-cham` — phần dư phải đếm được.
6. Tác tử chấm × commit chưa đẩy / tệp sạch lúc chụp → máy tự hoàn lại — bỏ bước làm theo lời dặn trong SKILL.
7. Phiên chính / phiên khác đổi cây → KHÔNG có dòng `ghi-boi-tac-tu-cham` (chiều im) — tránh đếm nhầm như 2/3 dòng `cay-doi`.
8. Không rõ (thiếu transcript) → dòng ghi rõ «không đọc được», không đếm thành tác tử chấm — mẫu số trung thực.

Core = 8 trên khoảng 28 ô có nghĩa (~29 %), vượt nhẹ trần 20 %. Lý do: đây là ma trận nghiệm thu, nên ô 3/4/7/8 là chiều im và đối chứng bắt buộc của luật hai chiều, không phải tính năng. Khi viết hợp đồng, gộp còn 7 tiêu chí.

## Later

- **Lối B — hook theo `agent_id` chặn `git commit` của tác tử:** mở khi ngưỡng chết vì ghi qua Bash.
- **Lối C — chấm trên bản sao (khoá bật-thêm):** cùng ngưỡng.
- **Vai ui còn công cụ MCP có quyền ghi** (vd trình quản lý tệp qua MCP): danh sách đen, đếm qua lối D.
- **Kiểm sống trên phiên Claude Code thật với loại tác tử của kit đã cài:** đọc ở chiến dịch phát hành (crm nhận mốc). Trong vòng, phiên đang chạy không nạp được loại mới.
- **Bộ đọc ngưỡng tự động (script đếm `ghi-boi-tac-tu-cham` / N):** phiên nghiệm thu đếm bằng một lệnh ghi trong Đường đo.

## Never

- Dặn thêm câu cấm trong đề bài: đã có và đã thua (ca 07/10).
- Tắt câu chuyển tiếp của harness: không phải mã kit.
- Đổi tác tử S3 (`execute-parallel.js`): tác tử làm phải ghi được; ngoài phạm vi.

## Cross-cutting áp mọi ô Core

- Mỗi phép đo mới có cặp hai chiều trên cùng fixture, kèm thông điệp ghim.
- Fixture transcript do code sinh trong lần chạy (round-trip với bộ đọc), không viết tay đúng khuôn bên đọc.
- Kho khác: không khoá cấu hình mới. Mọi hành vi mới bật mặc định chỉ khi lượt sạch không đổi.
