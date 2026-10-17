# Kế hoạch thi công — cua-tin-hieu-goc-moi-worktree (RM3b)

Hợp đồng `_acceptance/cua-tin-hieu-goc-moi-worktree/contract.md` (làn V 16/10) · design
`docs/superpowers/specs/2026-10-16-cua-tin-hieu-goc-moi-worktree-design.md`. T2, mọi task tuần tự.

| Task | Files | Verify | Phục vụ |
|---|---|---|---|
| T1 · ca GW-1…GW-6 đỏ trước vật | `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs` | đỏ đúng GW-1/2/3/5/6-gom trên cây chưa sửa; GW-4, GW-6, GW-6-long xanh (giữ hành vi cũ) | E1–E6 |
| T2 · `gocNguon` + bộ đọc | `scripts/tin-hieu.mjs` (chốt đỉnh worktree, `gocKhoChinh` của dot.mjs), `scripts/start-scan.mjs` (`vang`) | GW-2, GW-4, GW-5, GW-6 | E2, E4–E6 |
| T3 · bên ghi người | `scripts/gui-tin-hieu.mjs` (`docCua(root, {gocNguon})`, `gui_tu`, đếm theo nguồn chung), `dieu-phoi/scripts/cua-tin-hieu.mjs` (`docCua` nhận `gocNguon`) | GW-1, GW-3 | E1, E3 |
| T4 · suite | — | ca CT-* của RM3, bộ kiểm gói điều phối, bốn mảnh scripts | toàn hồ sơ |
