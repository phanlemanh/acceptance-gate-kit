---
schema_version: 1
feature: Luật ngôn ngữ mặt người — cưỡng chế bằng file tham chiếu + khuôn trình bày
slug: ngon-ngu-mat-nguoi
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-01T04:18:44Z
time_human_minutes: {gate1: 15, gate2: 10}
---

# Acceptance Contract: ngon-ngu-mat-nguoi

## Context

Luật ngôn ngữ mặt người (N1–N6 + 2 phép thử) đã thành văn ở
`docs/specs/workflow-v2-spec.md` §4.1 nhưng chưa có gì cưỡng chế: nó nằm trong
một file spec mà không bước sinh-đầu-ra nào bắt buộc đọc. Hậu quả đã xảy ra:
bảng tóm tắt kế hoạch của một feature đang chạy được trình cho owner bằng ngôn
ngữ máy (chủ ngữ là tên file, nhiều việc nhồi một ô, mã số không kèm nghĩa) và
owner không duyệt được ở dạng đó.

Feature này chuyển luật từ trạng thái thành văn sang trạng thái nhúng vào chỗ
nghẽn đầu ra: một file tham chiếu là nguồn duy nhất, tám chỗ sinh-đầu-ra bắt
buộc nạp nó, một khuôn bảng ba cột đặt một chỗ có marker, và người duyệt có
quyền trả lại tại cổng khi thấy vi phạm.

Source input: prompt (`/feature-loop`) + `docs/specs/workflow-v2-spec.md` §4.1
(quyết Manh 01/08 — spec là NGUỒN, contract này không phát minh lại luật).

## Criteria

- AC-1: Given kho nguồn của kit, When đọc `skills/acceptance/references/human-facing-language.md`, Then file tồn tại, chứa đủ sáu luật mở đầu bằng đúng mã `N1`…`N6` kèm nội dung, hai phép thử gọi đích danh tên `Xoá-tên-máy` và `Người-thứ-ba`, một bảng ví dụ TRƯỚC/SAU phủ cả sáu luật (mỗi luật ít nhất một cặp), và một ngưỡng đếm được nói rõ khi nào điểm quyết định bắt buộc kèm sơ đồ.
- AC-2: Given file tham chiếu, When đọc phần phạm vi, Then có vế miễn trừ tường minh giới hạn luật vào mặt người, gọi đích danh ít nhất `evals.yaml`, `run-log.jsonl` và frontmatter là vùng được miễn.
- AC-3: Given file tham chiếu, When đọc dòng vận hành đi kèm luật N6, Then dòng đó chỉ đích danh nơi từ điển sản phẩm sống (`CONTEXT.md` của kho đang làm) thay vì chỉ nói "từ điển sản phẩm" chung chung.
- AC-4: Given tám file sinh-đầu-ra cho người (bốn họ lệnh × hai harness: dựng thẻ, tổng kết, trạng thái, vòng lặp tính năng), When đọc từng file, Then mỗi file chứa đường dẫn tới file tham chiếu kèm mệnh lệnh nạp bắt buộc trước khi viết chữ cho người.
- AC-5: Given tám chỗ trỏ ở AC-4, When rút đường dẫn ra khỏi chính từng file (không viết tay danh sách) và kiểm trên cây nguồn, Then mọi đường dẫn trỏ vào một file thật tồn tại trên cây nguồn, và bộ đếm xác nhận đã rút đủ tám đường dẫn.
- AC-6: Given hai gói đã đóng `plugins/acceptance-gate/` và `plugins/feature-loop-codex/`, When rút đường dẫn từ các file sinh-đầu-ra NẰM TRONG gói và giải nó theo gốc của chính gói đó, Then đường dẫn giải ra một file thật trong gói; riêng hai bản vòng lặp tính năng — thuộc gói thiếu file tham chiếu — phải đi qua bộ giải plugin thay vì ghép thẳng gốc gói, và bộ giải đó phải có mặt trong gói.
- AC-7: Given nội dung sáu luật, When tìm nó trên toàn kho, Then nó chỉ nằm ở đúng hai chỗ đã biết — file tham chiếu (bản thi hành) và `docs/specs/workflow-v2-spec.md` §4.1 (bản ghi quyết định) — và hai bản khớp nhau từng ký tự.
- AC-8: Given file tham chiếu, When rút hai khối giữa hai cặp marker `PLAN-SUMMARY-TABLE-TEMPLATE` và `DECISION-DIAGRAM-TEMPLATE`, Then mỗi cặp marker chỉ xuất hiện đúng một lần trong toàn kho nguồn; khối thứ nhất là một bảng ba cột mang đúng ba tên cột đã chốt kèm ít nhất một dòng ví dụ, khối thứ hai là một khối sơ đồ khai đúng ngôn ngữ vẽ `mermaid` kèm ít nhất một ví dụ.
- AC-9: Given hai khuôn rút ra từ marker (không viết tay), When đọc khuôn bảng bằng luật tách ô bảng markdown của kit và đọc khuôn sơ đồ bằng luật tách khối mã có khai ngôn ngữ, Then khuôn bảng cho ra đúng ba tiêu đề cột và mỗi dòng ví dụ có đúng ba ô, khuôn sơ đồ cho ra một đồ thị có ít nhất hai nút và một cạnh mà mọi nhãn nút đều là chữ cho người; năm đột biến (bảng thiếu cột, bảng thừa cột, ô bảng nhồi nhiều việc, khối sơ đồ mất khai báo ngôn ngữ, nhãn nút là tên file) mỗi cái phải ĐỎ với thông điệp riêng của nó.
- AC-10: Given toàn bộ cây nguồn (trừ mirror `plugins/`, `_acceptance/`, `tests/`), When đếm số file chứa tên ba cột và số file chứa thân khuôn sơ đồ, Then đúng một file chứa chúng — cả hai khuôn có một chỗ duy nhất, các nơi dùng gọi theo tên marker.
- AC-11: Given vòng lặp tính năng ở cả hai harness, When đọc bước trình kế hoạch hoặc tiến độ cho người, Then bước đó buộc nạp file tham chiếu và trình bằng khuôn gọi theo tên marker, áp cho mọi lần trình, kể cả ngoài điểm dừng duyệt kế hoạch của T3.
- AC-12: Given lệnh dựng thẻ quyết định ở cả hai harness, When đọc phần kết, Then có nêu quyền của người duyệt được trả lại tại cổng khi thấy vi phạm, kèm cách ghi vào sổ quyết định bằng tiền tố đã chốt `lỗ-kit — ngôn ngữ mặt người`.
- AC-13: Given khối marker `HFL-GLOSSARY-TERMS` trong file tham chiếu liệt kê các từ feature này đưa vào văn của kit, When rút danh sách từ khối đó (không viết tay) rồi tra `CONTEXT.md`, Then mọi từ trong danh sách đều có mục trong từ điển.
- AC-14: Given nguồn đã sửa xong, When chạy `scripts/sync-plugin-packages.sh --check`, Then thoát 0 — mirror `plugins/` khớp nguồn.
- AC-15: Given phần văn trình cho người của file tham chiếu và của cả tám chỗ trỏ (chín vật), When áp phép thử Xoá-tên-máy lên từng câu của từng vật, Then văn còn nghĩa cho một người không đọc mã nguồn, và kết quả phán riêng cho từng vật kèm tên vật đã soi — kit không được viết luật ngôn ngữ mặt người bằng ngôn ngữ máy. (judgment)

## Coverage

Quét bằng `morphological-scan` (bước mặc định CT-S cho T2), tự dựng trục vì
preset `test-matrix` không khớp bài toán. 5 × 6 × 3 = 90 ô, quét theo lát cắt
trục A; 12 ô Core → 15 tiêu chí.

- Trục A — vật được giao: file tham chiếu | chỗ trỏ + mệnh lệnh nạp | khuôn bảng có marker | quyền trả-lại tại cổng | đóng gói hai harness [thước CE: spec §4.1 đoạn "Cưỡng chế" liệt kê đích danh năm thứ này]
- Trục B — thuộc tính bị hỏng: có mặt | đủ nội dung | nguồn duy nhất | nối đúng **trên cây nguồn** | nối đúng **trong gói đã đóng** | parity hai harness | tự tuân luật [thước CE: bất biến CLAUDE.md (đối-chứng-dương, thước-gắn-vào-vật) + case P79/P82/P85 đã chạy trong `tests/plugins/run-tests.sh`. Giá trị "nối đúng trong gói đã đóng" do phản biện context sạch bổ sung — trục cũ gộp hai thứ này làm một và bỏ lọt đúng chế độ hỏng mà thiết kế viện dẫn]
- Trục C — điểm nghẽn cưỡng chế: lúc tác giả kit sửa file (CI) | lúc agent sinh đầu ra (runtime) | lúc người duyệt tại cổng [thước CE: spec §4.1 câu "luật nhúng vào chỗ nghẽn đầu ra thì không có đường vòng"]
- Chân ngành đối chiếu: Vale (luật sống thành file cấu hình nạp mỗi lần chạy + scope selector) · Google developer documentation style guide (mỗi luật kèm cặp Recommended/Not recommended) · Microsoft Writing Style Guide (word list đi kèm) — hai điều chân ngành lộ ra đã vào AC-3 và AC-4.
- Ô bổ sung tại Cổng 1 (người duyệt bắt): `khuôn × hình` — luật N5 trước đó chỉ được kiểm là có mặt trong bảng luật, không khuôn nào làm ra hình; đã gộp vào AC-1 (ngưỡng), AC-8, AC-9, AC-10 mà không tăng số tiêu chí.
- Ô Core bị cắt vẫn có tên: `luật × tự tuân đo bằng máy` → Out of scope (máy soi mật độ) · `chỗ trỏ × runtime` → Known limit 1.

## Out of scope

- **Máy soi đếm mật độ token kỹ thuật + ratchet** (nấc "máy soi" của spec §4.1): không làm ở đợt này, chờ đợt nâng bộ thẻ — đặt ngưỡng khi chưa có bộ mẫu thẻ thật đủ lớn sẽ sinh cờ giả rồi bị tắt. Giữa hai đợt, việc bắt vi phạm nằm ở mắt người duyệt tại cổng (AC-12).
- **Sửa `gate-card.js` để máy tự sinh câu chữ mặt người**: thẻ là lớp trình bày, câu chữ do bên viết prompt sinh; để máy sinh câu chữ là mở một seam sai và làm hỏng nguyên tắc "thẻ không quyết định gì".
- **Áp luật lên mặt máy** (`evals.yaml`, `run-log.jsonl`, frontmatter, mã nguồn, thông điệp lỗi của script): chính luật loại trừ vùng này — ở đó tên chính xác là bắt buộc.
- **Sửa lại văn mặt người đang có của toàn kit cho khớp luật** (sweep hồi tố): feature này đặt luật và cưỡng chế từ nay; quét lại kho cũ là một đợt riêng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

**Known limits (ghi trước, không phải phát hiện sau):**

1. Không phép đo nào chứng minh được agent CÓ THẬT SỰ tuân luật khi sinh đầu ra. CI chỉ chứng minh luật có mặt, nối đúng vật thật, và chỉ có một nguồn. Hành vi thật chờ pilot — cùng tiền lệ `design-pass` (ký 30/07). Dấu hiệu đọc ở vòng sau: số entry `lỗ-kit` trong sổ quyết định.
2. Luật là văn tiếng Việt và được kiểm bằng khớp chuỗi. Viết lại một luật bằng từ đồng nghĩa mà giữ nguyên nghĩa vẫn làm case ĐỎ. Đánh đổi có chủ đích: ghim chuỗi là cách duy nhất khiến "xoá mất một luật" nổ; chi phí là mỗi lần sửa câu chữ luật phải sửa case cùng lượt.

**Known limits ghi tại Cổng 2 (Manh Phan, 2026-08-01) — chấp nhận và ship:**

3. Văn của hai bản vòng lặp còn định nghĩa từ hiển thị bằng tên công tắc nội bộ. Ba lượt chấm độc lập đều nêu; bản luật và cả hai bản dựng thẻ thì sạch. Đây là văn kế thừa của feature `pha3-goi-luoi`, đã nằm trong mục Out of scope "sweep hồi tố" — sửa ở đợt nâng bộ thẻ.
4. Phép đo canh chủ-đích-phát-hành chưa nâng sàn cho bản 1.28.0/1.20.0, nên revert nguyên đợt bump vẫn xanh. Đã chứng minh bằng phép thử ngược ở vòng 4.
5. Bước kiểm-trước-khi-chạy của vòng lặp chưa khai phụ thuộc mới vào bản nghiệm thu ≥1.28.0, và lời gọi bộ giải mới không có nhánh xử lý khi thất bại. Kho cài lệch phiên bản sẽ qua bước kiểm rồi chết giữa vòng.
6. Đường dự phòng của lệnh dựng thẻ giải plugin bằng danh sách yêu-cầu không chứa bản luật, nên có thể trả về bản không mang luật mà không cờ nào.
7. Chỉ dẫn ghi entry `revisit` cho quyền trả lại không mang theo khuôn của sổ quyết định, và tiền tố `lỗ-kit — ngôn ngữ mặt người` chưa có bên đọc nào trong kit — mới là quy ước cho người, chưa phải seam máy-đọc.

Mục 4–7 là việc ngoài phạm vi đã duyệt ở Cổng 1, người quyết ghi hạn chế đã biết
thay vì mở rộng hợp đồng giữa chừng. Chi tiết + phép thử ngược: `review-findings.md`.

Ràng buộc kho: sửa nguồn PHẢI chạy `scripts/sync-plugin-packages.sh` và commit
mirror cùng lượt (CLAUDE.md; P30 chặn drift).
