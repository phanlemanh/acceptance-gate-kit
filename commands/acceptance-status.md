---
description: Show acceptance gate status for all features in this repo
disable-model-invocation: true
---

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/acceptance-gate:approve` · `/acceptance-gate:signoff` · `/acceptance-gate:start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người.

Lệnh này KHÔNG nằm trong ba lệnh có-câu-gộp (bảng trạng thái read-only,
không có câu hỏi cổng nào để gộp); phần áp dụng ở đây là cờ `--repo <path>`:
quét `<path>/_acceptance/` thay vì thư mục hiện tại.

Print a status table for every feature in this repository (or under
`--repo <path>` when given):

1. **Quét máy, không tự đọc hồ sơ:** chạy
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/start-scan.mjs --root .` (hoặc
   `--root <path>` khi có `--repo`) → JSON một dòng. Đây là bộ PHÂN Ô DUY NHẤT
   của kit; lệnh này KHÔNG tự parse frontmatter và KHÔNG tự phán trạng thái.
   Trước đây nó đọc lấy rồi tự chế chữ, nên cùng một hồ sơ mà nó nói «Chờ người
   ký» trong khi lưới trước-merge và máy quét nói «máy đi tiếp, không mời ký».
   `config` là `false` → in đúng một dòng gợi ý `/acceptance-gate:acceptance-init` rồi DỪNG.
2. **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu nào
   sẽ hiện cho người.
3. Print — mỗi phần tử của `groups.gates` / `groups.inProgress` /
   `groups.considering` / `groups.done` / `broken` một hàng. Cột **Tình trạng**
   in `label` NGUYÊN VĂN, cột **Việc kế** in `viecKe` NGUYÊN VĂN; không diễn
   đạt lại, không rút gọn, không tự chế chuỗi nào:

| Việc | Hạng | Tình trạng | Việc kế |
|---|---|---|---|
| login-flow | T2 | chờ chữ ký — Cổng Bằng chứng | người: đọc bằng chứng rồi ký |

4. `vetoOpen` có phần tử → dưới bảng in TÊN từng hồ sơ còn cửa veto mở; đây là
   cùng con số lưới trước-merge in ra.
5. **Mọi nhãn trạng thái đến từ `label`/`viecKe` của máy quét.** Khối dưới đây
   cố ý RỖNG: thêm một chuỗi vào đó là khai một nhãn TỰ CHẾ, và phép đo đòi mọi
   nhãn khai ở đây phải nằm trong bảng `scripts/trang-thai-ho-so.cjs` — không
   thì đỏ nêu đích danh nhãn. Danh sách cấm không đủ: không gian chữ là mở nên
   cấm «Chờ người ký» thì bên viết đặt «Đợi chữ ký» và ca vẫn xanh.

<!-- <<<STATUS-NHAN
STATUS-NHAN>>> -->
