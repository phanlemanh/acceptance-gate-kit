# Bàn giao — dựng Orchestrator–workers hai tầng ở crm (06/10/2026)

**Viết cho:** một phiên Claude Code mới, chạy trên **tài khoản khác**, cùng máy Mac mini. Tài khoản cũ
sắp hết token. Mọi thứ cần đều nằm trên đĩa hoặc trên GitHub; không cần đọc hội thoại cũ.

## 1. Việc cần làm

Chạy **một vòng `/feature-loop` ở kho crm** (`~/dev/crm`, GitHub `phanlemanh/crm-onehub`, nhánh chính
`onehub`), slug **`dieu-phoi-hai-tang`**. Vòng này dựng **bộ công cụ** cho mô hình Orchestrator–workers
hai tầng: `scripts/dieu-phoi/` cùng các hook trong `.claude/settings.json`.

**Không** làm hàng nào của lộ trình sản phẩm. Lộ trình chạy tiếp trên công cụ này ở đợt sau 14/10.

| Đầu vào | Đường dẫn |
|---|---|
| Spec (owner đã duyệt 05/10) | `~/dev/acceptance-gate-kit/docs/superpowers/specs/2026-10-05-orchestrator-workers-hai-tang-design.md` |
| Kế hoạch giai đoạn 1a (9 task TDD, mã đầy đủ) | `~/dev/acceptance-gate-kit/docs/superpowers/plans/2026-10-05-orchestrator-workers-1a.md` |
| Hình kiến trúc · hình hành trình owner | Cùng thư mục spec: `…-hai-tang.html` · `…-hanh-trinh.html` |
| Finding nền (số đo 04/10) | `~/dev/acceptance-gate-kit/docs/findings/2026-10-05-doi-phien-co-dieu-phoi.md` |

Bốn tệp này nằm trên nhánh `docs/doi-phien-co-dieu-phoi` của kit (PR #266). Nếu PR #266 chưa gộp, đọc
thẳng từ nhánh: `git -C ~/dev/acceptance-gate-kit show origin/docs/doi-phien-co-dieu-phoi:<đường dẫn>`.

**Cách chạy vòng:**
- **S1:** hợp đồng lấy từ spec, các mục §3, §4.1–§4.3, §4.5–§4.12, §5 (1a), §5.1, §7, §8. Hạng **T2**.
- **S2:** dùng kế hoạch 1a làm kế hoạch; không viết lại.
- **S3:** làm theo kế hoạch.
- **S4:** như mọi vòng.
- **Owner** duyệt Cổng 1 và ký Cổng 2.

## 2. Những điều đã kiểm, đừng làm lại

- **Mã của kế hoạch đã chạy thử** trên cây tạm ngày 05/10: **50/50 test xanh**; CLI và bộ phát lịch chạy
  tách tiến trình chạy khô được. Lượt thử đã vá ba lỗi:
  1. Node 26 cần glob cho `node --test`, không nhận thư mục.
  2. `git fetch` hỏng làm tê cả nhịp; nay fetch tách riêng.
  3. Tỉ lệ swap báo động giả; nay dùng áp lực bộ nhớ của macOS (≥ 2) hoặc swap > 8 GB.
- **Kit 2.23.0** (cắt 06/10, crm đã nhận ở #281) **không chồng** với kế hoạch. `lan-khoa.mjs` là danh sách
  khoá *cấu hình* của làn ghim lại, không phải khoá tài nguyên. Tên lệnh hook chặn (`repin-lane`,
  `s4-args`, `duong-nen.mjs`, Workflow `acceptance-verify.js`) không đổi.
- **Agent Teams không dùng được cho thợ:** chưa có trong app desktop, và teammate thiếu `Workflow`.
  Subagent cũng thiếu `Workflow`. Thợ phải là phiên cấp cao nhất.
- **`/loop` tự nhịp tắt hẳn khi một vòng quên hẹn giờ.** Phiên giám sát không dùng nó làm nhịp tim.
- **Tin liên phiên có thể bị giữ chờ duyệt rồi bỏ sau 5′.** Đã mất một lời dặn ngày 05/10. Thiết kế chỉ
  dùng tệp cho mọi tín hiệu quan trọng.
- **Merge queue của GitHub không dùng được** (kho private của tài khoản cá nhân). Nhánh `onehub` không có
  luật bảo vệ, nên `--auto` sẽ merge ngay: **không bao giờ dùng `--auto`.**
- **Phiên bản:** CLI 2.1.289. App desktop tự quản Claude Code **2.1.286**; muốn ≥ 2.1.288 phải cập nhật
  app. Trước 2.1.288, lệnh nền của phiên desktop có giới hạn thời gian.

## 3. Hiện trạng crm (06/10 tối)

- **Đợt «lên trước 14/10» đã xong việc:**
  - làn R1 gộp 8/8;
  - Kho lượt 4 và K1 đã gộp;
  - 37 PR gộp trong đợt;
  - PR crm còn mở: chỉ #214.
- **Thẻ đóng đợt** ở `~/dev/crm/.acceptance-runs/dieu-phoi-1410/the-dong-dot.md`, **chờ owner duyệt**.
  Chưa lưu trữ phiên nào, chưa gỡ gì.
- Thư mục khoá `dieu-phoi-1410/khoa/` đang trống, nên S4 rảnh cho vòng này.
- Thư mục đợt cũ **không** phải symlink `dieu-phoi-hien-tai`. Hook mới sẽ im với nó.

## 4. Sau vòng này

1. Owner ký Cổng 2 và gộp PR của vòng.
2. «Mở đợt sau-14-10» theo nghi thức `scripts/dieu-phoi/README.md` (spec §4.11). Nội dung đợt: dãy sửa
   nóng (ưu tiên cao nhất, cho lỗi do người dùng thật báo), K2–K4, làn Deal.
3. Đo thước §6 của spec so với 04/10, rồi ghi kết quả vào finding.

## 5. Ràng buộc của chủ kho

- Trả lời bằng tiếng Việt.
- Chữ ký cổng là việc của người, gõ bằng lệnh (ADR 0002). Chữ «ký» trong chat không thay được lệnh.
- Không ghi cứng thứ gì của crm vào `scripts/dieu-phoi/`. Mọi giá trị riêng kho nằm trong
  `dieu-phoi.config.json` và `hang-viec.json` của đợt (spec §5.1, để sau này đóng gói vào kit).
- Không merge bằng `--auto`; luôn `--match-head-commit`.
