# Quét không gian tiêu chí — bat-bien-san-pham

Preset `test-matrix` và `entity-feature` không khớp một lượt (vật là một ổ cắm + hai mặt đọc, không phải
một thực thể hay một màn) → tự dựng trục theo B1.

## Ngữ cảnh

- Sản phẩm: kit acceptance-gate — engine dùng chung cho các kho tiêu thụ (crm, media-library,
  artifact-platform, radar, oneflow…) `[SUY-TỪ-REPO: CLAUDE.md]`.
- Chân sản phẩm: ô cơ hội đã ký `[SUY-TỪ-REPO: _acceptance/bat-bien-san-pham/opportunity.md]` · khoá
  `can_cu` + bộ xếp lớp của vòng A2 `[SUY-TỪ-REPO: nhánh vong/a2-thiet-ke-khong-hoi-thua, scripts/can-cu-s1.cjs]`
  · số đo crm `[SUY-TỪ-REPO: _acceptance/bat-bien-san-pham/do-11-10/mui-gio-crm.md]` · luật 26/09 «cân trên
  mọi kho» và «đổi khuôn phải có đường đọc-cũ» `[SUY-TỪ-REPO: CLAUDE.md]`.
- Chân ngành: `[NGÀNH: The AI-Native SDLC playbook, play «Requirements and design»]` (luật nạp lúc viết,
  cờ có chủ luật, ghi phiên bản luật — `docs/research/2026-09-07-ai-native-sdlc-playbook.md`) ·
  `[NGÀNH: ArchUnit]` (luật kiến trúc viết thành test, vi phạm nêu tên luật) · `[NGÀNH: Conftest/OPA]`
  (policy-as-code: luật khai một chỗ, chạy trên diff/cấu hình, mỗi vi phạm mang mã luật).

## Trục

- **Trục A — tệp luật của kho:** vắng · có, hợp lệ · có, một khối luật sai khuôn · đổi sau khi đã nạp
  [thước CE: luật 26/09 (vắng = không đổi gì) + khuôn marker một nguồn của kit + `[NGÀNH: playbook]` ghi
  phiên bản luật]
- **Trục B — quan hệ của vòng với một luật:** không chạm · theo luật (trích làm căn cứ) · phạm luật ở bước
  thiết kế · phạm luật trên diff (dấu hiệu khai sẵn) · sửa chính tệp luật · nêu một mã không có
  [thước CE: bốn lớp của A2 (mục tiêu / một lối / chỉ người / khó đảo) + `[NGÀNH: Conftest]` (vi phạm trên
  diff) + ADR 0007 (tệp người viết không do máy sửa)]
- **Trục C — mức luật:** thường · khó đảo [thước CE: danh sách khó-đảo của bất biến dừng — khó-đảo luôn là
  câu hỏi]
- **Trục D — mặt đọc:** thẻ Cổng Phạm vi · thẻ Cổng Bằng chứng · hồ sơ đời trước / đã qua cổng
  [thước CE: hai cổng có sẵn — không thêm cổng]

## Không gian (A×B×C×D, gạch ô vô nghĩa)

A=vắng chỉ có một ô có nghĩa (không gì thay đổi ở mọi mặt đọc). A=có × B (6) × C (2) × D (3) = 36 ô; gạch:
B=«không chạm» × C (mức không đổi gì) gộp một ô; B=«sửa tệp luật» không phụ thuộc C và chỉ có nghĩa ở Cổng
Bằng chứng; B=«phạm trên diff» chỉ có nghĩa ở Cổng Bằng chứng; B=«theo luật / phạm ở thiết kế» chỉ có nghĩa
ở Cổng Phạm vi; D=«đời trước» gộp một ô cho mọi B. Còn 13 ô có nghĩa.

## Core

1. A vắng × mọi mặt đọc → không đổi byte nào (luật 26/09) — AC-2.
2. A có × khuôn tệp: viết theo khuôn kit, bộ đọc rút đúng mã · câu · mức · chủ luật · dấu hiệu — AC-1.
3. A có × dòng nạp ở bước thiết kế (phiên bản tệp) + vắng dòng nạp ở hồ sơ nháp → cờ vàng — AC-3.
4. A đổi sau khi nạp → cờ vàng «luật đã đổi sau khi nạp» — AC-3.
5. B theo luật × Cổng Phạm vi → dòng máy đã quyết in mã luật cạnh câu trích — AC-4.
6. B phạm ở thiết kế × C thường/khó đảo × Cổng Phạm vi → câu hỏi nêu mã · câu · chủ luật, nhãn khó-đảo
   đúng mức; ghi sai lớp → đỏ — AC-5.
7. B nêu mã không có → đỏ (thước gắn vật) — AC-6.
8. B sửa tệp luật × Cổng Bằng chứng → mục người khó-đảo, dòng ký không điền sẵn — AC-7.
9. B phạm trên diff × C × Cổng Bằng chứng → khối «Luật sản phẩm bị chạm» nêu mã · câu · tệp:dòng; phát
   lại hình dạng `okr-soat-anh-luot-3` — AC-8.
10. A có, một khối sai khuôn → cờ vàng có tên, luật còn lại vẫn đọc — AC-1.
11. D đời trước / đã qua cổng → không cờ mới — AC-9.
12. Cross: mọi câu luật gom vào thẻ có sẵn, không thêm lượt dừng — AC-10.

(12 ô Core trên 13 ô có nghĩa — vượt 20 %: không gian đã gạch sẵn ô vô nghĩa và mỗi ô Core là một nhánh
mã riêng; gộp tiếp thành 10 tiêu chí ở hợp đồng.)

## Later

- Bộ rà ở lượt chấm nhận tệp luật làm đầu vào và gọi mã luật trong mục ngoài hợp đồng — cần sửa bộ chấm
  (vùng `feature-loop/workflows/` của máy kia).
- Kho khai nhiều tệp luật / tệp ở đường khác gốc kho (khoá config).
- Lệnh đếm «số lần thẻ gọi tên luật» trên mọi hồ sơ của kho — đường đo ngưỡng UAT đọc bằng tay qua sổ
  và tệp `luat-cham.json` lượt đầu.
- Luật có hạn dùng / ngoại lệ có thời hạn (`[NGÀNH: Conftest]` exceptions).

## Never

- Máy sửa tệp luật của kho (ADR 0007, ô cơ hội).
- Kit chở luật mẫu của một tổ chức (kit là engine).
- Cờ «chưa khai luật» cho kho không có tệp (luật 26/09).
- Bộ đọc nghĩa câu luật bằng model ở cổng (thẻ là lớp trình bày, tất định).

## Cross-cutting áp mọi ô Core

- Kho không có tệp: không đổi byte (đo vi phân trên mọi hồ sơ kit + crm trên máy).
- Mỗi phép đo mới có cặp hai chiều trên cùng fixture, thông điệp ghim; fixture do mã sinh.
- Không chạm `lib/**`, `hooks/**`, `feature-loop/scripts/`, `feature-loop/workflows/`, `dieu-phoi/`,
  khối TRONG-DOT.
