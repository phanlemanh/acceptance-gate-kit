---
schema_version: 1
feature: Đường nền chạy lệnh bằng môi trường của người gọi — tra công cụ và chạy suite qua MỘT cửa `bash -c` + môi trường người gọi, không qua shell đăng nhập nạp lại profile; công cụ vắng thật vẫn đỏ gọi đúng tên khoá ở cả hai chân
slug: nen-chay-bang-moi-truong-nguoi-goi
owner: phanlemanh@gmail.com
risk_tier: T2      # feature-loop/scripts + tests/scripts — không chạm hooks/ lib/ pre-merge/recheck
surfaces: [cli]
status: approved       # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-24T15:38:34Z
design_doc: docs/superpowers/specs/2026-09-24-nen-chay-bang-moi-truong-nguoi-goi-design.md
---

# Acceptance Contract: nen-chay-bang-moi-truong-nguoi-goi

## Context

Đường nền (`feature-loop/scripts/duong-nen.mjs`) chạy `command -v` và từng suite bằng
`bash -lc`. Shell đăng nhập nạp lại profile và đặt lại PATH, nên đường nền đo một máy khác
máy người gọi. Ở crm-onehub 24/09 người gọi đứng trên fnm node 24, `bash -lc` trả node 22
của `/usr/local/bin` → suite `executors.script.build_khong_cache` đỏ «eve requires Node.js
>=24» trên cây chưa chạm, đường nền ghi `nen suite: DO SAN … ma 1` — báo động giả ở chính
khối «Nền hạ tầng» của thẻ Cổng Phạm vi. Người hưởng: người ký Cổng Phạm vi ở mọi kho tiêu
thụ dùng trình quản lý phiên bản (fnm, nvm, asdf, mise) — cờ «nền đỏ» vì lý do sai là cờ
người học cách bỏ qua. Trace nguyên tố 2 (bằng chứng không tự dối).

Source input: prompt (owner giao việc kèm số đo, 2026-09-24) · đo lại trên máy owner cùng
ngày (`bash -lc` → v22.18.0, `bash -c` + env → v24.15.0) · vật và ca kiểm có TRƯỚC khi mở
vòng (PR #217; cổng CI đòi hồ sơ) — khai ở sổ quyết định.

## Criteria

- AC-1: Given HOME có profile đăng nhập ĐẶT LẠI PATH và một công cụ chỉ nằm trong PATH của người gọi, khoá `executors.test.a` (vừa là executor vừa là suite key) chạy công cụ ấy, When đường nền chạy, Then mã 0, bốn chân BẰNG của lượt đối chứng NEN0 (không đổi HOME) và danh sách dòng đỏ đúng một bullet «không có».
- AC-2: Given CÙNG fixture nhưng công cụ vắng thật, When đường nền chạy, Then mã 1 và tập bullet BẰNG ĐÚNG hai dòng nguyên văn `nen cong-cu: THIEU nen-cong-cu-rieng-xyz (khoa executors.test.a)` và `nen suite: DO SAN executors.test.a ma 127`.
- AC-3: Given bản chép `feature-loop/` chạy AC-1 XANH, When cửa chạy lệnh duy nhất (khối `BASH-NGUOI-GOI`) bị đổi về shell đăng nhập (`-c` → `-lc`, đúng một chỗ, tệp đổi thật), Then fixture AC-1 ĐỎ với tập bullet BẰNG ĐÚNG hai dòng của AC-2 — cả hai chân đi qua cùng một cửa, một bản vá chỉ sửa một chân không qua được.
- AC-4: Given các ca đã có của chân suite (NEN0 đối chứng dương, NEN2 đỏ sẵn, NEN3 cây bẩn, NEN4 tuần tự, NEN4b đột biến song song), When chạy sau bản vá, Then tất cả PASS; bản đột biến NEN4b gọi shell giống bản thật (`-c` + môi trường người gọi) — chỉ khác biến đồng thời.
- AC-5: Given các ca đã có của chân công cụ (NEN1, NEN-TD1…NEN-TD6, NEN-LC1…NEN-LC3), When chạy sau bản vá, Then tất cả PASS — luật từ đầu và luật lệnh con không đổi.
- AC-6: Given công cụ CÓ ở cả hai nơi — bản của người gọi (`exit 0`) ở đầu PATH người gọi, bản khác (`exit 42`) ở đầu PATH mà profile đăng nhập đặt — đúng hình dạng đo ở crm (node 24 của fnm vs node 22 của `/usr/local/bin`), When đường nền chạy, Then bản thật mã 0 với bốn chân bằng NEN0; và trên bản chép có cửa bị đổi về shell đăng nhập (như AC-3, bản chép chưa tiêm xanh trước) thì mã 1, chân `cong_cu` XANH, tập bullet BẰNG ĐÚNG một dòng `nen suite: DO SAN executors.test.a ma 42`.

## Coverage

- Trục A — cách gọi shell: đăng nhập (`-lc`) | không đăng nhập + môi trường người gọi (`-c` + env) [thước CE: bash(1) INVOCATION — shell đăng nhập đọc `/etc/profile` rồi file đầu tiên trong `~/.bash_profile`, `~/.bash_login`, `~/.profile`; shell không tương tác không đăng nhập chỉ đọc `$BASH_ENV`].
- Trục B — chân: công cụ (`command -v`) | suite (chạy lệnh).
- Trục C — công cụ: chỉ có trong PATH người gọi | vắng thật | có ở cả hai nơi, profile tìm bản khác trước.
- Trục D — profile: đặt lại PATH | không đụng PATH.
- Ô Core: A-c × B-cả-hai × C-có × D-đặt-lại (AC-1) · A-c × B-cả-hai × C-vắng × D-đặt-lại (AC-2) · A-lc × B-cả-hai × C-có × D-đặt-lại (AC-3, đột biến) · A-c và A-lc × C-cả-hai-khác-bản × D-đặt-lại (AC-6, hình dạng thật của crm).
- Ô đã có ca, giữ: D-không-đụng × mọi hình dạng lệnh (AC-4, AC-5).
- Ô Never: A-lc × C-vắng — shell đăng nhập không còn đường nào trong mã để đo.
- Bỏ quét bằng skill: không gian bốn trục nhị phân liệt kê tay đủ — entry `descope` trong sổ.

## Out of scope

- `$BASH_ENV` người gọi đặt sẵn: `bash -c` vẫn nạp nó — đó là môi trường của người gọi, đúng ý.
- Chân lưới và chân engine: không chạy lệnh của kho qua shell (`bash <pre-merge-check.sh>` và đọc tệp).
- Sửa cache plugin 2.18.3 ở máy owner hay bản vendored ở kho tiêu thụ: nhận qua mốc phát hành kế (re-pin theo RELEASE).

## Notes

- Quét toàn kit (24/09, sau vá): `grep -rnE "(bash|sh|zsh)['\"]?,? *\[?['\"]?(-l[a-z]*c|-[a-z]*l[a-z]*c|--login)|['\"]-l['\"]|--login" scripts lib hooks feature-loop workflows commands skills` → đúng 1 dòng, là chú thích trong khối `BASH-NGUOI-GOI` của `duong-nen.mjs`; không còn lời gọi shell đăng nhập nào trong mã kit. Giới hạn: phép quét đọc chuỗi, không bắt được lời gọi dựng tham số động.
- Neo ngoài (đọc máy tác giả, không là eval): chạy lại đường nền trên worktree crm thật `beautiful-thompson-16c095` sha `28db67028cc7a63ecb4f003221b4fff113819d90` bằng script đã vá (`3ba8edc0`): `suite: xanh` — `build_khong_cache` qua; trước vá cùng worktree ghi `nen suite: DO SAN executors.script.build_khong_cache ma 1`. Đỏ còn lại `THIEU merge-base` ×2 thuộc lớp hồ sơ `nen-cong-cu-gan-bang-lenh-con` (script chạy lượt ấy chưa gộp #216). Tệp `duong-nen.md` của vòng crm trả về bản commit.
