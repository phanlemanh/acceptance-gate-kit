# Đường nền — phép gán mở phép thay thế không nhường từ đầu cho mảnh bên trong

Ngày 2026-09-24 · slug `nen-cong-cu-gan-mo-thay-the` · T2 · làn V · owner: phanlemanh@gmail.com

## Vấn đề (đo được)

Chân `cong_cu` của `feature-loop/scripts/duong-nen.mjs` lấy TỪ ĐẦU của mỗi lệnh
`executors.<loại>.<tên>` bằng `tuDau()`: tách theo khoảng trắng + nháy, BỎ mọi token khớp
phép gán `^[A-Za-z_][A-Za-z0-9_]*=`, lấy token còn lại đầu tiên. Với lệnh

```
B=$(git merge-base HEAD origin/onehub) && { git diff --quiet "$B" -- … || …; } && bun run test -- "…"
```

token đầu là `B=$(git` — khớp regex phép gán nên bị bỏ; token kế là `merge-base`, mảnh
nằm BÊN TRONG `$( )`, bị coi là tên chương trình → `command -v merge-base` không có →
`nen cong-cu: THIEU merge-base`, chân `cong_cu` đỏ, `nen: do`.

Đo 24/09 ở `~/dev/crm`: `duong-nen.md` của hai slug (`goi-thu-hong-man-noi-that`,
`loi-tac-tu-zalo-noi-dung-nguyen-nhan`) đỏ đúng dòng ấy, khoá
`executors.script.zqw_giu_nqz` và `executors.script.nzm_giu_da_ky`. Đối chiếu bằng bộ
đọc một nguồn `resolveConfigKey` trên config thật của hai worktree crm: bản `main` cho từ
đầu `"merge-base"` ở cả hai khoá.

Người hưởng: người ký Cổng Phạm vi ở crm — một cờ «nền đỏ» bật vì kit đọc sai lệnh là cờ
người học cách bỏ qua. Trace nguyên tố 2 (bằng chứng không tự dối).

## Bản vá (owner đặc tả trong lời báo lỗi, 24/09)

Phép gán mà giá trị MỞ phép thay thế chưa đóng trong token (`(` nhiều hơn `)`, `{` nhiều
hơn `}`, hoặc số backtick lẻ — vị từ `moThayThe`, khối marker `CONG-CU-GAN-MO`) KHÔNG còn
bị bỏ như phép gán thường: `tuDau` trả chính token ấy. Vị từ `tenChuongTrinh` có sẵn
(khối `CONG-CU-TU-DAU`, không đổi) thấy `$`/`(` → bỏ tra và in MỘT dòng stderr
`cong-cu: bo qua <khoá> — tu dau «B=$(git» …` theo nếp hiện có. Phép gán ĐÃ ĐÓNG
(`B=1`, `B=$(pwd)`) vẫn bị bỏ như cũ, nên `B=1 khong-co-lenh` vẫn đỏ ghim đúng tên.

Phương án loại: dựng một bộ tách hiểu cú pháp shell (theo dõi độ sâu `$( )`/`${ }` qua
khoảng trắng). Đúng hơn về nguyên tắc nhưng là một parser mới cho một lớp đo đang có một
triệu chứng; bản cân ngoặc trên TOKEN đủ cho triệu chứng và giữ luật cũ nguyên vẹn.

## Ca đo (cùng fixture lành NEN0, đổi đúng một biến: lệnh của `executors.test.a`)

| Ca | Lệnh | Trước vá | Sau vá |
|---|---|---|---|
| GM1 (IM) | NGUYÊN VĂN `zqw_giu_nqz` của crm (sha256 ghim) | ĐỎ `THIEU merge-base` | `cong_cu` xanh · 0 bullet · đúng 1 dòng bo qua |
| GM2 (ĐỎ) | `B=1 khong-co-lenh` | đỏ | vẫn đỏ, ghim `THIEU khong-co-lenh` · 0 dòng bo qua |
| GM3 (đột biến) | chuỗi GM1 trên bản chép gỡ khối `CONG-CU-GAN-MO` | — | lượt chưa tiêm xanh; lượt tiêm đỏ ghim `THIEU merge-base` |
| GM4 (ĐỎ) | `B=$(pwd) khong-co-lenh` — gán đóng CÓ `$( )` | đỏ | vẫn đỏ, ghim `THIEU khong-co-lenh` · 0 dòng bo qua |
| GM5 (IM ×2) | `` B=`git rev-parse HEAD` && echo … `` · `B=${KHONG_CO_BIEN:-mac dinh} echo …` | ĐỎ `THIEU rev-parse` / `THIEU dinh}` | cả hai xanh · đúng 1 dòng bo qua gọi đúng token đầu |
| GM6 (đột biến) | GM4 + GM5 trên bản chép mà vị từ thành «có mặt `$(`» | — | GM4 mất dòng ghim (bị bỏ tra) · cả hai lượt GM5 đỏ |

GM4–GM6 thêm sau gap-probe (P1: không ca nào tách phép CÂN ngoặc khỏi phép DÒ `$(`; P2:
nhánh backtick và `{` của vị từ không có ca).

Tiền tố ca là `GM`, KHÔNG `NEN`: răng `rang-hoi-quy.sh` của hồ sơ đã ký
`nen-cong-cu-lenh-shell` đếm đúng 19 dòng `PASS: NEN` — ma trận của vòng ấy. Vòng này
không chạm hồ sơ đã ký; răng ấy vẫn 19/19 sau vá.

## Giới hạn đã biết (khai, không giấu)

- Cùng lớp, dạng khác, CHƯA vá: `B=1 && cmd` hoặc `B="$(…)" && cmd` (phép thay thế đóng
  trong một token nhờ nháy) cho từ đầu là `&&` → đỏ oan `THIEU &&`. Lệnh crm hiện tại không
  vướng. Chưa có neo đo ở kho thật nên không mở ô.
- Literal có nháy chứa `(`/`{` lệch (`X='{' cmd`) bị bỏ tra thay vì tra `cmd` — lệch về
  phía IM, không về phía đỏ oan.
- Kế thừa Ngoài-1 của hồ sơ trước: chân bỏ tra vẫn khai `cong_cu: xanh`.
