# Bàn giao — vòng `dieu-phoi-tho-trong-kit` chuyển sang máy khác (10/10)

Chủ kho chuyển vòng kit này sang một máy trống, để nhường Mac mini cho đợt crm `sau-14-10` đang chạy.
Tài liệu này đủ để một phiên mới, ở máy mới, chạy tiếp mà không ai phải kể lại.

## 1. Đang ở đâu

Nhánh: `claude/musing-morse-d449f5`, đã gồm mọi thứ trên `main` tới #293.

| Vật | Trạng thái |
|---|---|
| Ô dù `_acceptance/dieu-phoi-tho-trong-kit/opportunity.md` | Cổng Đáng **build** (Manh Phan, 09/10 14:30Z). Timebox ghi 31/10, **đang chờ chủ kho dời** (§3) |
| Spec ô dù `docs/superpowers/specs/2026-10-09-dieu-phoi-tho-trong-kit-design.md` | Hàng DP0–DP7, ranh giới lõi / riêng kho / riêng máy |
| Spec workflow `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` | Bản chung cho DP2–DP4, DP6, DP7. §12 mod, §13 người gõ gì, §14 lộ trình, §15 thuật ngữ, **§16 soát tổng thể (thắng các mục trên khi mâu thuẫn)**. **Chờ chủ kho duyệt** |
| Hàng DP1 `_acceptance/dieu-phoi-dong-goi-loi/` | 12 AC, 13 eval, gap-probe 0 P0. **Làn V, cửa veto mở**, `status: approved`. Việc kế: S2 (writing-plans) |
| Lộ trình kit `docs/plans/lo-trinh-kit.json` | DP1 mốc 18/10; DP2, DP3, DP4, DP7 mốc 25/10 (đóng gói xong); crm thử ~26/10; OneFlow thử ~27/10; DP6 mốc 01/11; tinh chỉnh ~05/11. **Chưa gộp vào `main`** |
| Biên bản soát | `_acceptance/dieu-phoi-tho-trong-kit/discovery/` (phản biện workflow, soát đồng bộ, soát tổng thể) |

## 2. Chỉ có trên Mac mini — đã gói, chủ kho chép tay

Gói chuyển giao nằm ở `.acceptance-runs/chuyen-may-2026-10-10/` của worktree trên Mac mini (git bỏ qua thư
mục này; kho kit công khai). Chép cả thư mục sang máy mới bằng AirDrop hoặc ổ chung, không qua git, không
dán vào chat.

| Tệp | Là gì | Đặt ở máy mới |
|---|---|---|
| `bo-nho-kit.tgz` | Bộ nhớ của Claude cho kho kit (91 tệp, có tệp `vong-dieu-phoi-tho-trong-kit.md`) | Bung vào `~/.claude/projects/<thư mục ứng với đường kho kit ở máy mới>/` (§4 bước 5) |
| `dot-crm-sau-14-10-chup.tgz` | Bản chụp thật thư mục đợt crm, nguồn fixture của DP1 AC-4 | Giữ ngoài git; S3 của DP1 ẩn danh bằng `tests/dieu-phoi/an-danh.mjs` rồi mới đưa vào `tests/dieu-phoi/fixtures/dot-crm-0910/` |
| `nhu-cau-dieu-phoi-tho-vao-kit.md` | Bản ghi nhu cầu 09/10 (bản gốc nằm ngoài git ở worktree giám sát crm) | Đọc khi cần; các số đã chép vào ô và spec |
| `sha256.txt`, `chup-luc.txt` | Mã băm và giờ chụp | Kiểm `shasum -a 256 -c sha256.txt` sau khi chép |

**Ở lại Mac mini, không chuyển được:** phép đo DP0. Phép đo gắn với app và tài khoản của máy đang chạy đợt
crm. Ảnh «trước» và quy trình nằm ở `_acceptance/dieu-phoi-tho-trong-kit/discovery/do-tai-khoan/`. Lần
đổi tài khoản thật kế tiếp trên Mac mini, phiên giám sát crm chạy `chup.mjs` theo README đó.

## 3. Câu chờ chủ kho (gộp một dòng)

```
timebox: ___ · oneflow nới luật một-hồ-sơ: ___ · bàn giao chủ động tính vòng thật: ___ · spec workflow: ___ · đẩy lộ trình: ___
```

Máy khuyên: 07/11 · có (một cặp hàng) · có · duyệt · có. Lý do từng câu ở spec workflow §16 và ở bộ nhớ
`vong-dieu-phoi-tho-trong-kit.md`. Đã máy-quyết, có cửa veto: hai đợt thử chạy trên Mac mini (khoá s4 cấp máy
có ở mốc 25/10); không thêm `dieu-phoi/hooks/**` vào `t3_paths`; không đổi tên lệnh.

## 4. Dựng máy mới

1. App Claude, đăng nhập. Claude Code ≥ 2.1.288 (≥ 2.1.286 nếu muốn thử mod).
2. Node 24 trở lên, `git`, `gh auth login` có quyền trên `phanlemanh/acceptance-gate-kit` và `phanlemanh/crm-onehub`.
3. Clone kit: `git clone https://github.com/phanlemanh/acceptance-gate-kit ~/dev/acceptance-gate-kit`;
   `git config user.name "Phan Le Manh"`; `git config user.email phanlemanh@gmail.com`.
4. Clone crm, CHỈ ĐỂ ĐỌC nguồn lõi ở sha ghim: `git clone https://github.com/phanlemanh/crm-onehub ~/dev/crm`
   rồi `git -C ~/dev/crm fetch origin onehub`. DP1 chép `scripts/dieu-phoi/` từ `a9e8bc75a`. Không mở đợt,
   không chạy gì của crm ở máy này.
5. Bộ nhớ: mở một phiên Claude Code bất kỳ trong `~/dev/acceptance-gate-kit` một lần để app tạo
   `~/.claude/projects/<tên>/`. Rồi `tar -xzf bo-nho-kit.tgz -C ~/.claude/projects/<tên>/` (tạo thư mục
   `memory/`). `<tên>` là đường kho với `/` đổi thành `-`, ví dụ `-Users-<người dùng>-dev-acceptance-gate-kit`.
6. Gói kit cho máy này: `claude plugin install acceptance-gate@acceptance-gate-kit`,
   `claude plugin install feature-loop@acceptance-gate-kit`, `claude plugin install superpowers@claude-plugins-official`
   (thêm marketplace `phanlemanh/acceptance-gate-kit` nếu máy chưa có). Máy này không chạy crm nên cài
   thẳng bản mới nhất (2.26.0), không phải chờ quãng lặng.
7. Mở phiên mới trong kho kit, dán prompt ở §5.

**Thuận lợi ở máy mới:** đường nền của DP1 đã hoãn trên Mac mini vì crm giữ khoá s4 và swap cao (sổ
`d-20261009T144334Z-4`). Máy mới trống, nên chạy đường nền ngay.

## 5. Prompt nối tiếp

```
Tiếp tục vòng kit Điều phối – Thợ (ô dù dieu-phoi-tho-trong-kit) trên máy này. Vòng chuyển từ Mac mini ngày 10/10 để nhường hạ tầng cho đợt crm sau-14-10. Trả lời và viết bằng tiếng Việt; tên kỹ thuật giữ nguyên.

1. Đồng bộ: trong worktree của phiên này chạy `git fetch origin` rồi `git merge --ff-only origin/claude/musing-morse-d449f5` (nhánh đó đã gồm main). Không --ff-only được thì dừng và báo, đừng reset.
2. Đọc trước, theo thứ tự: docs/handoff/2026-10-10-dieu-phoi-tho-trong-kit-chuyen-may.md · bộ nhớ vong-dieu-phoi-tho-trong-kit.md · docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md (§16 trước) · _acceptance/dieu-phoi-dong-goi-loi/contract.md và decisions.jsonl.
3. Trình tôi đúng một dòng các câu đang chờ ở §3 của tài liệu bàn giao (đã có khuyến nghị), rồi làm tiếp không chờ: `/feature-loop:feature-loop dieu-phoi-dong-goi-loi`. Hồ sơ đang `approved`, làn V cửa veto mở → vào S2. Chạy đường nền DP1 ngay vì máy này trống.
4. Ràng buộc: không sửa gì ở kho crm (chỉ đọc nguồn lõi tại crm a9e8bc75a); fixture AC-4 lấy từ gói chuyển giao, ẩn danh trước khi commit; phép đo DP0 thuộc Mac mini, không làm ở đây; luật của kho kit theo CLAUDE.md.
```
