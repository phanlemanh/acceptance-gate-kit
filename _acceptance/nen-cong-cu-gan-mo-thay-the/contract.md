---
schema_version: 1
feature: Chân công cụ của đường nền thôi lấy mảnh BÊN TRONG một phép thay thế làm tên chương trình khi lệnh mở đầu bằng phép gán có giá trị mở phép thay thế (`B=$(git merge-base …) && …`) — bỏ tra và nói ra; phép gán đã đóng đứng trước một tên thiếu thật vẫn đỏ như cũ
slug: nen-cong-cu-gan-mo-thay-the
owner: phanlemanh@gmail.com
risk_tier: T2      # feature-loop/scripts + tests/scripts — không chạm hooks/ lib/ pre-merge/recheck
surfaces: [cli]
status: verified       # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-24T09:43:11Z
design_doc: docs/superpowers/specs/2026-09-24-nen-cong-cu-gan-mo-thay-the-design.md
---

# Acceptance Contract: nen-cong-cu-gan-mo-thay-the

Gốc: ~/dev/crm/.claude/worktrees/goi-thu-hong-man-noi-that/_acceptance/goi-thu-hong-man-noi-that

## Context

Chân `cong_cu` của đường nền (`feature-loop/scripts/duong-nen.mjs`) báo `THIEU merge-base`
cho executor `B=$(git merge-base HEAD origin/onehub) && …`: `tuDau()` bỏ token `B=$(git`
vì nó khớp regex phép gán, rồi lấy `merge-base` — mảnh bên trong `$( )` — làm tên chương
trình. Đo 24/09 ở `~/dev/crm`, `duong-nen.md` của hai slug (`goi-thu-hong-man-noi-that`,
`loi-tac-tu-zalo-noi-dung-nguyen-nhan`), khoá `executors.script.zqw_giu_nqz` và
`executors.script.nzm_giu_da_ky`. Người hưởng: người ký Cổng Phạm vi ở crm — cờ nền đỏ
bật vì kit đọc sai lệnh. Trace nguyên tố 2 (bằng chứng không tự dối).

Source input: prompt (owner báo lỗi kèm chẩn đoán + đặc tả bản vá + đòi ca hai chiều, 2026-09-24) · PR #215 bị cổng t1-escape chặn, owner chọn làn V T2.

## Criteria

- AC-1: Given executor mang NGUYÊN VĂN lệnh `executors.script.zqw_giu_nqz` của crm (phép gán `B=$(git merge-base …)` đứng đầu, phần sau có `&&`, `{ … }`, nháy) — «nguyên văn» do máy kiểm: sha256 của chuỗi fixture bằng sha256 của giá trị `resolveConfigKey` đo trên config crm 24/09 —, When đường nền chạy trên fixture lành với đúng lệnh ấy, Then chân `cong_cu` XANH và KHÔNG bullet `nen cong-cu:` nào mang khoá đó — mảnh bên trong phép thay thế không bị tra như tên chương trình.
- AC-2: Given executor `B=1 khong-co-lenh` (phép gán ĐÃ ĐÓNG đứng trước một tên KHÔNG có trên máy), When đường nền chạy, Then chân `cong_cu` vẫn ĐỎ và dòng đỏ ghim đúng `nen cong-cu: THIEU khong-co-lenh (khoa executors.test.a)`.
- AC-3: Given lượt của AC-1, When đọc stderr, Then có ĐÚNG MỘT dòng «bo qua» gọi đúng khoá executor; và Given lượt của AC-2, Then stderr KHÔNG có dòng «bo qua» nào cho khoá ấy — phép gán đã đóng không bị bỏ tra.
- AC-4: Given bản chép `feature-loop` mà khối marker `CONG-CU-GAN-MO` bị thay bằng vị từ luôn trả «đã đóng», When lượt của AC-1 chạy trên bản chép ấy, Then chân `cong_cu` ĐỎ ghim đúng `nen cong-cu: THIEU merge-base (khoa executors.test.a)` — và lượt CHƯA TIÊM trên cùng bản chép phải XANH trước khi tin chiều đỏ. Và Given khối ấy bị thay bằng vị từ hời hợt «có mặt `$(`», When lượt của AC-6 và AC-7 chạy trên bản chép ấy, Then AC-6 mất dòng ghim (bị bỏ tra) và cả hai lệnh của AC-7 ĐỎ — các ca phân biệt được phép cân với phép dò.
- AC-5: Given toàn bộ ca cũ của đường nền (NEN0…NEN9, NEN-TD1…NEN-TD6) và răng `rang-hoi-quy.sh` của hồ sơ đã ký `nen-cong-cu-lenh-shell`, When chạy sau bản vá, Then mọi ca cũ vẫn PASS và răng ấy vẫn đếm đúng 19 dòng `PASS: NEN` — vòng này không chạm ma trận của hồ sơ đã ký.
- AC-6: Given executor `B=$(pwd) khong-co-lenh` (phép gán ĐÃ ĐÓNG mà giá trị CÓ phép thay thế), When đường nền chạy, Then chân `cong_cu` ĐỎ ghim đúng `nen cong-cu: THIEU khong-co-lenh (khoa executors.test.a)` và stderr 0 dòng «bo qua» — vị từ CÂN ngoặc, không chỉ dò có mặt `$(`.
- AC-7: Given executor mở đầu bằng phép gán có backtick lẻ (`` B=`git rev-parse HEAD` && echo … ``) hoặc `{` dư (`B=${KHONG_CO_BIEN:-mac dinh} echo …`), When đường nền chạy, Then với mỗi lệnh chân `cong_cu` XANH và stderr có ĐÚNG MỘT dòng «bo qua» gọi đúng token đầu (`` B=`git `` / `B=${KHONG_CO_BIEN:-mac`) — hai nhánh còn lại của vị từ đều có ca.

## Coverage

- Trục A — token đầu của lệnh: phép gán đóng (`B=1`, `B=$(pwd)`) | phép gán mở phép thay thế (`B=$(git`, `B=${X:-$(y`, `` B=`y ``) | không phải phép gán [thước CE: `_acceptance/config.yaml` của hai worktree crm (hai khoá mang `B=$(git merge-base …)`) + ca của hồ sơ nen-cong-cu-lenh-shell].
- Trục B — chương trình thật sau phép gán có trên máy: có | không | không áp dụng (từ đầu không phải tên).
- Ô Core: A-mở `(` × B-n/a = AC-1 (chuỗi thật của crm) · A-mở backtick và A-mở `{` × B-n/a = AC-7 · A-đóng không ngoặc × B-không = AC-2 · A-đóng CÓ `$( )` × B-không = AC-6 · A-không-phải-gán đã phủ bởi NEN-TD1…TD6 của hồ sơ trước (AC-5 giữ chúng). Bổ sung sau gap-probe: AC-6, AC-7 và vế sha256 của AC-1.
- Ô Later (khai ở Notes, không làm): A-đóng rồi toán tử (`B=1 && cmd`, `B="$(…)" && cmd`) → từ đầu là `&&`.
- Quét bằng skill `morphological-scan` đã BỎ — xem entry descope trong sổ; không gian hai trục nhỏ, kê tay ở trên.

## Out of scope

- **Bộ tách hiểu cú pháp shell** (theo dõi độ sâu `$( )`/`${ }` qua khoảng trắng) — một parser mới cho một triệu chứng; bản cân ngoặc trên token đủ và giữ luật cũ nguyên vẹn.
- **Bỏ qua toán tử `&&`/`||`/`;`/`|` sau phép gán đóng** — cùng lớp nhưng chưa có neo đo ở kho thật (xem Notes).
- **Sửa hồ sơ đã ký `nen-cong-cu-lenh-shell`** (ma trận 19 ca của `rang-hoi-quy.sh`) — ca của vòng này mang tiền tố `GM` riêng.
- **Sửa gì ở kho crm** — owner chỉ định; bản vá tới crm theo mốc phát hành.

## Notes

- Giới hạn đã biết: `B=1 && cmd` và `B="$(git merge-base x)" && cmd` cho từ đầu `&&` → đỏ oan `THIEU &&`. Lệnh crm hôm nay không vướng (không nháy quanh `$( )`).
- Giới hạn đã biết: literal có nháy chứa `(`/`{` lệch (`X='{' cmd`) bị bỏ tra thay vì tra `cmd` — lệch về phía IM.
- Giới hạn đã biết, CHẠM CỔNG THẬT (gap-probe P2, hoãn): kế thừa Ngoài-1 của `nen-cong-cu-lenh-shell` — chân bỏ tra vẫn khai `cong_cu: xanh`, dòng bỏ tra chỉ ra stderr, không vào `duong-nen.md`. Vòng này chuyển chính hai khoá thật của crm — `executors.script.zqw_giu_nqz` và `executors.script.nzm_giu_da_ky` — từ «đỏ oan» sang «bỏ tra, báo xanh»: nếu `bun` (chương trình thật ở cuối lệnh) vắng trên máy, người ký Cổng Phạm vi ở crm vẫn đọc `nen: xanh` cho hai khoá ấy. Sửa đúng tầng = đổi khuôn tệp + bên đọc thẻ (ghi `bo-qua` vào vật như chân `luoi`/`engine`) — ngoài phạm vi vòng này.
