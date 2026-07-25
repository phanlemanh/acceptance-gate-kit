# Định vị plugin anh em bằng resolver, không bằng glob cache

Năm chỗ trong skill từng inline `ls -d $HOME/.claude/plugins/cache/*/<plugin>/*/…`
rồi "lấy bản mới nhất". `ls` sắp theo thứ tự CHỮ: với cache có 1.9.2, 1.11.2,
1.18.0, 1.20.1 thì "mới nhất" ra **1.9.2** — bản cũ nhất; panel judge và template
evidence sẽ chạy bằng luật của bản cũ mà report vẫn xanh, đúng loại false-green
kit sinh ra để chặn. Nay: plugin tự định vị chính mình bằng `${CLAUDE_PLUGIN_ROOT}`
/ `${PLUGIN_ROOT}` (harness cấp sẵn), còn định vị plugin KHÁC đi qua
`feature-loop/scripts/resolve-plugin.mjs` — sắp theo semver, bắt buộc bản được
chọn phải CÓ THẬT các file `--require` (bản cài dở bị bỏ qua thay vì trả về thư
mục chết ở bước sau), và fail loud kèm lệnh cài thay vì lặng lẽ lùi bản cũ.

Phương án đã loại: chỉ dùng prose invocation kiểu "gọi skill, đừng link" — không
đủ, vì workflow `acceptance-verify.js` cần đường dẫn thật của `judge-personas.md`
và `evidence-report-template.md` để truyền cho agent. Test P33 chặn glob mọc lại,
P34 giữ hai edition dùng chung một nguồn.
