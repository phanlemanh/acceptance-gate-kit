# ADR 0023 — Chế độ phân loại PR cho CI của kho sống TRONG cổng (`pre-merge-check.sh --hang-pr`)

2026-10-12 · hồ sơ `ci-cua-kho-bo-job-nang` (hàng lộ trình C1), chủ kho phê CỘNG ở Cổng Phạm vi 11/10.
**Bối cảnh:** crm trả ≈ 98 % tiền Actions của tài khoản; 30 % phút của nó là test sản phẩm trên PR không đổi mã
(`docs/findings/2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md` §1.1). crm PR #369 tự lọc PR chỉ T1 bằng
cách rút `glob_variants`/`match_globs` khỏi bản chép cổng bằng `sed` — kit đổi tên hàm là crm mất khoản tiết kiệm mà
không ai biết. **Quyết:** lệnh phân loại là một CỜ của chính `scripts/pre-merge-check.sh`, không phải một script
riêng: cùng tiến trình đọc config (`config_list`), dựng phạm vi diff, chạy khối «Phân loại diff-chịu-cổng»
(`match_globs`), rồi in `hang` · `cham_vat` · `ly_do` và thoát trước mọi luật. Mọi dòng của chế độ nằm giữa marker
`# >>> HANG-PR` … `# <<< HANG-PR`; ca `AC-8` của `tests/scripts/hang-pr.test.mjs` đòi bản cắt marker bằng từng byte
bản đầy đủ khi không cờ, và mọi commit của vòng chỉ chèn trong vùng marker. **Phương án đã loại:** script JS riêng —
bộ khớp `globToRe` của kit lệch bộ khớp bash của cổng (`*.md` với `docs/a.md`: bash khớp, JS không; hạt giống
`docs/plans/2026-10-11-hat-giong-ba-ngu-nghia-glob-t1-skip.md`), nên bit sẽ lệch phán quyết của cổng; script bash
riêng rút hàm bằng `sed` — dựng lại đúng khớp nối của crm, chép lại logic phạm vi diff, và kho đang chép kit phải
chép thêm một tệp. **Khó đảo:** kho nối dây cờ vào workflow; tách chế độ ra lệnh khác sau này là đổi CI của mọi kho
đã nối. **Gây bất ngờ:** tệp cổng cưỡng chế nay làm thêm một việc không cưỡng chế, và chạm nó là hạng T3. **Đánh
đổi:** trả hạng T3 (thêm một cổng duyệt kế hoạch) để có MỘT bộ khớp và MỘT danh sách cho cả cổng lẫn CI của kho.
