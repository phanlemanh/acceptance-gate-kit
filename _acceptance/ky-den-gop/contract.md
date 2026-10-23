---
schema_version: 1
feature: Đoạn ký → gộp có thước và có chủ máy — lịch tránh giao hai việc cùng tệp, PR sẵn sàng ngay lúc trình thẻ Cổng Bằng chứng, gộp không chạy lại CI khi PR không trùng tệp với nhánh chính, và lệnh đếm đợt trừ được giờ ký khỏi giờ gộp
slug: ky-den-gop
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-10-23-ky-den-gop-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-23T09:05:00Z
---

# Acceptance Contract: ky-den-gop

## Context

Phiên phân tích ở một kho tiêu thụ ngày 23/10 theo North Star kit (PR #400, đích «gộp được»): đoạn ký → gộp không có
thước, không có chủ máy. Đợt 19–23/10 của kho ấy: 39 PR, mở → gộp trung vị 8,3 giờ; 52 commit ghim lại; 254 lần gộp
nhánh chính vào nhánh. Ca phiếu hai cột (2 tệp mã): ký 11:48, hơn 3 giờ sau chưa gộp — một PR sửa cùng phiếu gộp
trước, hồ sơ cũ đi, phải ghim lại, trong khi giám sát đã biết trùng tệp từ lúc xếp hàng. Chủ kho chốt gói «cắt 80 %»
(C, H, I và phần đo của A ở kit; B, E ở kho tiêu thụ; bỏ D, E+, F). Ước của gói: phiên mở → gộp từ ~9,5–10 giờ xuống ~2 giờ.

Quyết định chủ kho 23/10/2026 cho hạng I, nguyên văn: «Chấp nhận rủi ro mục I: PR không trùng tệp với PR vừa gộp thì
gộp ngay, không chạy lại CI; lỗi lọt qua thì CI trên nhánh chính bắt.» Ghi ở sổ quyết định (dòng `gate1`).

Gốc: `_acceptance/dieu-phoi-dong-goi-loi/` (Ngoài-3, Ngoài-4 → hạt giống `docs/plans/2026-10-10-hat-giong-loi-dieu-phoi-chuyen-nguyen-tu-crm.md`
lỗ 1, lỗ 2 — vòng này đóng hai lỗ ấy). Đề xuất 5 của `docs/plans/2026-10-11-hat-giong-northstar-tu-dot-crm-sau-14-10.md`.

Source input: prompt — phiên giám sát kit chuyển lời chủ kho 23/10; thiết kế ở `design_doc`.

## Criteria

- AC-1: Given đợt hai dãy, dãy P2 có hàng Y đang làm (hoặc đã ký chưa gộp) khai `ranh_gioi` trùng `ranh_gioi` của hàng ưu tiên đầu X của P1, và P1 còn hàng Z không trùng, When bộ phát lịch chạy hai nhịp, Then `tiep/P1.json` giao Z, X mang `sau: ["Y"]`, có đúng một sự kiện `doi-ke-hoach` kiểu `them-sau` và một dòng Nhật ký «x chờ Y gộp trước (trùng tệp)»; đối chứng trên cùng fixture: Y khai vùng khác → P1 nhận X và X không mang `sau`; mọi hàng sẵn sàng đều trùng → `cho: trung-tep`; hai hàng kế của hai dãy trùng vùng trong cùng nhịp → sau hai nhịp đúng MỘT hàng mang `sau` và hàng kia được giao; `sau` không ghi ngược khi hàng kia đã chờ hàng này (không dựng vòng chờ nhau).
- AC-2: Given một PR đang mở mà nhánh không thuộc dãy nào sửa tệp trong vùng của X, When bộ phát lịch chạy hai nhịp, Then X không được giao (P1 nhận Z), X không mang `sau`, có đúng một sự kiện `trung-tep` nêu nhánh và tệp, `trang-thai.json` có bản chụp `nhanh_mo` (tệp theo nhánh, nhánh mỗi dãy); đối chứng: PR ấy là nhánh của chính P1 → X được giao; PR của dãy P2 → quy về hàng đang dở của P2.
- AC-3: Given `trang-thai.json` ghi P2 đang làm Y, When giám sát chạy `hang them <việc> --day P1 --ranh-gioi <glob trùng vùng Y>`, Then hàng mới mang `sau: ["Y"]`; vùng khác → không `sau`; không khai vùng → hàng vẫn được thêm và lệnh in đúng một dòng cảnh báo «không khai ranh_gioi»; thêm một hàng đã có ở dãy khác → vùng tệp đi theo.
- AC-4: Given `gh pr list` lỗi và chưa từng có bản chụp PR, When bộ phát lịch chạy hai nhịp, Then lịch không đứng (X được giao khi không trùng hàng của đợt) và có đúng một sự kiện `trung-tep-mu`; có bản chụp đời trước (dù cũ hơn một phút) mà PR ngoài đợt trong đó sửa vùng X → X vẫn bị giữ, đúng một sự kiện `trung-tep-mu` nêu tuổi bản chụp, bản chụp tốt không bị ghi đè; hàng giao đi mà không khai vùng → đúng một sự kiện `ranh-gioi-vang`, không chặn.
- AC-5: Given dò nhánh mở lỗi (gh lỗi, hoặc `git diff` của một nhánh lỗi), When xét yêu cầu `cham-tep`, Then kết quả `can_phan` nêu «không dò được nhánh mở (<lỗi>)», không máy duyệt; dò được và không ai chạm → máy duyệt; nhánh của chính phiên xin chạm tệp → máy duyệt (hạt giống 10/10 lỗ 1, lỗ 2).
- AC-6: Given kho git thật: nhánh PR sửa phiếu và ký hồ sơ; CI xanh trên đúng đầu nhánh, When `xetGop` chạy với lần lượt: nhánh chính tiến bằng tệp khác + khoá `gop_khong_chay_lai_ci` bật · nhánh chính tiến bằng chính tệp phiếu · khoá vắng hoặc `false` · nhánh đã chứa đỉnh nhánh chính · CI rỗng/đang chạy/thất bại/status PENDING · PR nháp · PR xung đột · hồ sơ ở `verified`, Then lối lần lượt là `khong-trung` · `cu` nêu tệp trùng · `cu` nêu khoá tắt · `moi-nhat` · `cho-ci` nêu check · `chan` · `cu` · `chan` nêu trạng thái; thêm: đỉnh nhánh chính có lượt CI đỏ (`gh run list --branch <chính> --commit <đỉnh>`) → `cu` nêu «CI nhánh chính đỏ», đang chạy hay xanh → `khong-trung`, không đọc được → `cu`; nhánh chính ĐỔI TÊN chính tệp PR sửa → `cu` nêu tên cũ.
- AC-7: Given đợt cho tự gộp, phiên P1 giữ khoá merge, When `dieu-phoi.mjs gop 7` gặp lối `khong-trung`, Then gh nhận đúng `pr merge 7 --merge --match-head-commit <sha đầu nhánh>` (không `--auto`) và `su-kien.jsonl` có một sự kiện `gop`; lối `cu` → không lời gọi merge nào; không giữ khoá hoặc đợt không cho tự gộp → lệnh từ chối trước mọi lời gọi gh; `--xet` in quyết định mà không gộp.
- AC-8: Given hồ sơ `verified`, verdict PASS, vật không đổi sau `verified_commit`, When chạy dòng lệnh của khối `PR-SAN-SANG` trong SKILL feature-loop, Then nhánh lên origin đúng HEAD, PR nháp được mở (nếu chưa có) rồi chuyển sẵn sàng, lệnh in một dòng «PR #n sẵn sàng»; PR đã sẵn sàng → không đổi gì; hợp đồng chưa `verified` · verdict REJECT · vật đổi sau lượt chấm → thoát 2, không đẩy, không gọi gh; `ship_default: branch` → chỉ đẩy; không remote → thoát 3.
- AC-9: Given lịch sử git thật — ký 11:48, một lần gộp nhánh chính vào nhánh, gộp `--no-ff` 15:03 — và hai lượt `ghim-lai` được cấp lúc 11:00 và 13:10, When bộ phát lịch ghi `hang-gop` rồi chạy `dem`, Then `hang-gop` mang `ky_den_gop_phut: 195` và `gop_vao_nhanh: 1`; `dem` in `ky_den_gop.trung_vi_phut 195`, `gop_vao_nhanh.tong 1`, `ghim_lai_sau_ky.tong 1`; gộp squash → giờ ký `null`, hàng vào `chua_do`; hồ sơ đã lên nhánh chính từ trước giờ ký → giờ gộp vẫn là commit gộp mang chữ ký vào (15:03), số đo vẫn 195.
- AC-10: Given bản sao trọn `dieu-phoi/scripts/` và `feature-loop/scripts/` trong thư mục tạm, lần lượt tiêm 22 nhát (bỏ hàm trùng · PR của chính dãy tính trùng · dò PR nuốt lỗi · chạm tệp duyệt khi không dò được · đã ký chưa gộp không tính đang dở · gh lỗi thì giao mù dù có bản chụp · `sau` dựng vòng chờ nhau · `hang them` không ghi sau · bỏ phép giao tệp · bỏ khoá · bỏ đòi CI xanh · không đọc CI nhánh chính · đổi tên chỉ tính tên mới · gộp `--auto` · gộp không cần khoá · đo gộp không theo cha-đầu · giờ gộp = commit đầu chạm hồ sơ · ghim lại không lọc giờ ký · hàng gộp không mang số đo · mở PR khi chưa verified · để PR ở nháp · đẩy khi vật đổi), When chạy tệp ca tương ứng trên bản sao — SAU khi bản sao chưa tiêm xanh với ≥1 ca chạy — Then mỗi nhát làm đỏ ĐÚNG tập ca được nêu tên, chuỗi gốc có trước khi tiêm và vắng sau khi tiêm.

## Coverage

- Trục A — việc dở ở chỗ khác: hàng đang làm | đã ký chưa gộp | hàng kế đã chọn | PR ngoài đợt | PR của dãy khác | PR của chính dãy | đã gộp [thước CE: ca phiếu hai cột]
- Trục B — vùng tệp: trùng tệp | thư mục lồng | thư mục anh em | không khai [thước CE: `glob.mjs` của gói]
- Trục C — đường dò: gh tốt | gh lỗi | một nhánh lỗi diff
- Trục D — lối gộp: moi-nhat | khong-trung | cu (trùng · khoá tắt · xung đột) | cho-ci | chan [thước CE: spec hai tầng §4.4]
- Trục E — điều kiện PR sẵn sàng: verified+PASS | chưa verified | REJECT | vật đổi | ship_default khác pr | hạ tầng
- Chân ngành: [NGÀNH: GitHub merge queue / Bors] — gộp theo bản đã kiểm, `--match-head-commit` thay cho hàng gộp tự động.
- Later: hàng gộp tự động (D). Never: gộp bằng `--auto`.

## Out of scope

- Hàng gộp tự động đầy đủ (D), bằng chứng theo diff (E+), giá theo rủi ro (F) — hạt giống.
- Phía kho tiêu thụ: B, E và việc bật `gop_khong_chay_lai_ci` trong gói đợt khi nhận bản.
- Cắt bản phát hành kit.
- Lỗ 3, lỗ 4 của hạt giống 10/10.

## Notes

- Ca đo: `tests/dieu-phoi/loi/trung-tep.test.mjs` (C-1…C-12), `tests/dieu-phoi/loi/gop.test.mjs` (I-1…I-7),
  `tests/dieu-phoi/loi/do-gop.test.mjs` (DG-1…DG-4), `tests/workflows/pr-san-sang.test.mjs` (H-1…H-6),
  `tests/dieu-phoi/ky-den-gop-mutants.test.mjs` (KDG-M0 + 22 nhát). Khoá chấm: `executors.test.dieu_phoi_ky_den_gop`.
- Ca DP2-13 của `tests/dieu-phoi/mo-dot.test.mjs` ghim trọn đầu ra `dem`; vòng này thêm bốn khoá mới vào bản ghim
  (io giả không có lịch sử git → hàng vào `chua_do`).
- Ca đã ký của vòng trước được sửa theo vật (dòng sổ `fix` S3): DP2-13 (`mo-dot.test.mjs`, bản ghim đầu ra `dem`),
  DP8-08-do bo-khoa và bo-khoa-hang-them (`on-dinh-r2.test.mjs`, nhát tiêm theo khoá ghi đã dời và chữ ký mới),
  SDT-04 dot-cu và SDT-04-do khong-bang-quyet (`sua-truoc-dot-thu.test.mjs`, tách lịch biết tệp khỏi phép so B1).
- Giới hạn đã khai (gap-probe 23/10):
  - Kho chưa đặt lưới trước-gộp làm check bắt buộc: PR sẵn sàng từ lúc trình thẻ, người bấm gộp được trước chữ ký.
    Lối gộp của máy (`gop`) đòi hồ sơ đã thông trên đầu nhánh; S5 vẫn cảnh báo kho chưa nối lưới trước-gộp.
  - Không có lệnh gỡ hàng khỏi đợt, nên `sau` trỏ một hàng không còn trong đợt chỉ xảy ra khi sửa tay `hang-viec.json`;
    khi ấy hàng chờ mãi như mọi `sau` trỏ hàng vắng trước vòng này.
  - So hai glob đều có ký tự đại diện là dư (xem thiết kế): có thể xếp tuần tự hai hàng không thật sự trùng.
- Bản chụp đợt thật 09/10 (ẩn danh, 9 dãy, 69 hàng đều khai vùng tệp): lịch biết tệp đổi hàng kế ở 4/9 dãy.
