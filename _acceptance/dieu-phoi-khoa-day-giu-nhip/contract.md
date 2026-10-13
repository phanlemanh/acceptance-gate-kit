---
schema_version: 1
feature: Vá gói dieu-phoi (DP10) — khoá do một DÃY giữ cũng tính nhịp khoá (`khoa/<tn>/nhip`), nên dãy chạy lượt dài qua `giu-nhip.mjs` đúng như `LUAT.md` dặn thôi bị bộ phát lịch báo nhầm «khoa-khong-nhip»
slug: dieu-phoi-khoa-day-giu-nhip
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, docs]
status: implemented
design_doc: _acceptance/dieu-phoi-khoa-day-giu-nhip/design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-13T08:38:30Z
---

# Acceptance Contract: dieu-phoi-khoa-day-giu-nhip

## Context

Gốc: phanlemanh/crm-onehub#375, bình luận Mac Studio 13/10 08:16Z (đợt `r2` trên crm; dãy P1 đo, giám sát xác
minh): giám sát nhả nhầm khoá `duong-nen` của P1 khi lượt đang chạy, vì bộ phát lịch báo `khoa-khong-nhip` cho một
khoá mà dãy giữ nhịp bằng `giu-nhip.mjs`. Lỗi của DP8 (`_acceptance/dieu-phoi-on-dinh-r2/`, AC-9): `viecNenGiuNhip`
loại khoá của dãy khỏi nhịp khoá, và ma trận E9 ghim chính hành vi đó. Vòng chạy dưới ô dù
`_acceptance/dieu-phoi-tho-trong-kit/`, như DP2–DP9. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **dãy**, **phiên thợ**, **phiên giám sát**, **bộ phát lịch**, **nhịp sống của phiên**: như `CONTEXT.md`.
- **nhịp khoá** = tệp `khoa/<tài nguyên>/nhip` mà `chamNhip` (hook PostToolUse, `giu-nhip.mjs`) ghi.
- **nhịp phiên** = `song/<session_id>.json` hook PostToolUse ghi, nối theo worktree.
- **ma trận trục D** = {việc nền ngoài dãy `kiem-cheo`, dãy `P1`} × {chạm `chamNhip` sau cấp · chạy qua
  `giu-nhip.mjs` sau cấp · nhịp khoá ghi trước cấp · worktree KHÁC chạm `chamNhip` sau cấp · không chạm}.

## Criteria

- AC-1: Given một đợt mở từ gói, bộ phát lịch thật (đồng hồ giả), dãy `P1` đã ghi danh xin và được cấp `s4` ở nhịp T, When phiên của P1 không gọi công cụ nào (không nhịp phiên) mà chạy `giu-nhip.mjs -- <lệnh ngắn>` từ worktree của P1 sau lúc cấp, rồi nhịp thật ở T+11′ và T+12′, Then không có sự kiện `khoa-khong-nhip` nào. Chiều đỏ: bản sao `phat-lich.mjs` dựng lại ĐÚNG hành vi DP8 — luồn lại tham số `hangViec` qua lời gọi `baoKhoaKhongNhip` → `viecNenGiuNhip` và chèn lại dòng loại dãy (kiểm từng lần thay đã áp) — SAU khi bản lành xanh trên cùng fixture, chạy trọn ma trận AC-2 → danh sách lỗi BẰNG đúng hai thông điệp «dãy P1 chạm nhịp khoá (chamNhip): việc nền giữ nhịp khoá vẫn bị báo khoa-khong-nhip» và «dãy P1 chạy qua giu-nhip.mjs: việc nền giữ nhịp khoá vẫn bị báo khoa-khong-nhip» (nửa kiem-cheo không đổi; thông điệp chỉ sinh khi có sự kiện thật — bộ phát lịch sập thì ra 0 sự kiện, không ra thông điệp).
- AC-2: Given fixture của AC-1, When chạy đủ mười hàng ma trận trục D viết sẵn, Then mỗi hàng ra đúng số sự kiện `khoa-khong-nhip` kỳ vọng — chạm `chamNhip` sau cấp → 0 · `giu-nhip.mjs` sau cấp → 0 · nhịp khoá trước cấp → 1 · worktree khác chạm `chamNhip` sau cấp → 1 · không chạm → 1 — cho CẢ HAI người giữ; mỗi hàng đối chứng đầu vào: không có nhịp phiên (`song/`) nào của worktree người giữ; số hàng in ra bằng 10; nửa `kiem-cheo` và nửa `P1` so bằng nhau theo thứ tự nguồn nhịp; mọi hàng ra 1 mang `can_phan: true` và `ly_do` nêu «nhịp khoá».
- AC-3: Given bộ phát lịch thật và kịch bản DP3-10 (dãy P1 giữ s4), When chạy ca `DP3-10 khoa-khong-nhip` (thân không đổi) và ca `DP3-10-do bo-dieu-kien` trên bản sao gói có `chamNhip` của hook bị tắt (kịch bản `co-nhip` chỉ còn nhịp phiên), Then `DP3-10` xanh; bản sao lành (chỉ tắt `chamNhip`) ra 0 sự kiện; bản sao bỏ thêm điều kiện nhịp phiên ra 1 sự kiện, ca nêu «có nhịp mà vẫn báo» — nhánh nhịp phiên còn chiều đỏ riêng sau vá.
- AC-4: Given fixture của AC-1, When dãy P1 chạy `giu-nhip.mjs` sau lúc cấp rồi thôi chạm nhịp, và bộ phát lịch chạy nhịp ở T+11′ và T+200′ (quá hạn thuê), Then có đúng 1 sự kiện `thu-hoi` của phiên `P1`, khoá `khoa/s4/chu.json` vắng, và 0 sự kiện `khoa-khong-nhip` — nhịp khoá không giữ khoá của dãy quá hạn thuê.
- AC-5: Given `dieu-phoi/README.md` và `scripts/mau/LUAT.md`, When đọc, Then đoạn README nêu việc nền giữ nhịp khoá (đoạn có «ngoài dãy» + `giu-nhip.mjs`, ca DP8-10 xanh) nói khoá của dãy cũng tính nhịp khoá — có «Khoá của dãy» và `giu-nhip.mjs`, không còn câu «vẫn đòi nhịp phiên»; `LUAT.md` mục «Cách xin tài nguyên» vẫn dặn dãy chạy việc nền dài qua `giu-nhip.mjs`. Chiều đỏ: README ở sha ghim `e76684fd51ee1e737329ff7d56465d5fef0018a2` (merge-base của vòng với main, rút bằng `git show`; sha ghim, không suy từ trạng thái gộp) → hàm kiểm nêu «README còn nói khoá của dãy đòi nhịp phiên».
- AC-6: Given cây sau vòng, When chạy suite `tests/dieu-phoi/**/*.test.mjs`, Then mọi ca xanh; và tập ca đã có ở mốc so mà bị đổi thân (khuôn DP8-11: commit gộp PR của nhánh `vong/dieu-phoi-khoa-day-giu-nhip`, chưa gộp thì merge-base với `origin/main`) BẰNG đúng tập khai {`DP3-10-do bo-dieu-kien`, `DP8-09 viec-nen`, `DP8-09-do bo-mien`}, mỗi ca có một dòng sổ `fix` của hồ sơ này nêu tên nó.

## Coverage

Bỏ quét bằng skill `morphological-scan` — dòng sổ `descope` «bỏ coverage-scan — …». Bản vá một lỗ, một trục; không
gian của nó là ma trận trục D viết sẵn trong AC-2 (2 người giữ × 5 nguồn nhịp = 10 hàng), cộng hai nhánh còn giữ:
nhịp phiên (AC-3) và hạn thuê (AC-4).

- Trục D · người giữ khoá × nguồn nhịp: `kiem-cheo` / `P1` × `chamNhip` sau cấp · `giu-nhip.mjs` sau cấp · nhịp
  khoá trước cấp · worktree khác chạm sau cấp · không chạm → AC-1, AC-2. Nhịp phiên một mình → AC-3. Thôi chạm nhịp quá hạn thuê → AC-4.
  [thước CE: `baoKhoaKhongNhip` + `viecNenGiuNhip` + ma trận E9 của DP8]

## Out of scope

- Đổi `giu-nhip.mjs` để ghi nhịp phiên `song/` (phương án (a) đã loại ở design doc — làm sai tín hiệu của
  `tiep-tuc`).
- Sửa phiên giám sát crm hay sự kiện đã ghi ở đợt `r2` (kho tiêu thụ tự nâng bản vá).
- Đổi ngưỡng `NGUONG_SONG_MS`, hạn thuê hay nhịp `NHIP.giuNhipMs`.
- `CHANGELOG.md`, số phiên bản, cắt bản vá 2.29.x — việc của Điều phối M5.
- Sửa hồ sơ đã ký `dieu-phoi-on-dinh-r2` — lời hứa hàng dãy của nó được vòng này thay, ghi ở Notes.

## Notes

- Vòng này THAY một hàng lời hứa của hồ sơ đã ký `dieu-phoi-on-dinh-r2` (AC-9: «dãy `P1` giữ s4 chỉ có nhịp khoá,
  không nhịp phiên → 1 (luật của dãy không đổi)») bằng 0 — căn cứ là lời dặn đã có của `scripts/mau/LUAT.md` và sự
  cố crm 13/10. Hồ sơ cũ không sửa (sổ chỉ thêm); ca của nó đổi thân có tên ở AC-6.
