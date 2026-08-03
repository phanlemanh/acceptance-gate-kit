# Chiến dịch CHỨNG CHỈ TOÀN TUYẾN — chuẩn hoá tài liệu + test từ bước 0 (Trang Tư Vấn)

*30/07/2026 · Quyết Manh: chấp nhận thời gian + token để chạy trọn workflow
từ ý-định-mơ-hồ đến bàn-giao, feedback trực tiếp từng bước. Chiến dịch này
NÂNG CẤP Pilot r2 (plan rollout) thành full run — không thay thế số đo đã
khai. Trạng thái: ĐÃ DUYỆT — Manh, 30/07 (chat). P1 XONG cùng ngày.*

## Vì sao chuẩn hoá TRƯỚC khi test

Phép đo "kit tự dẫn" chỉ trung thực khi nguồn kit đọc là tài liệu mạch lạc —
test trên trầm tích vá là đo khả năng khảo cổ, không đo workflow. Đây là
điều chỉnh có chủ đích so với "spec v2 sau r2": r2 đã nâng thành chứng chỉ
toàn tuyến nên spec v2 trở thành TIỀN ĐỀ của nó.

## PHA P — CHUẨN BỊ (tuần này, trước run)

| # | Việc | Ai | Ước |
|---|---|---|---|
| P1 | **Viết spec v2 hợp nhất** `docs/specs/workflow-v2-spec.md` theo khung 6 chương đã chốt (Nhịp KLĐQ + định lý Quyết · Ba vòng + định tuyến A/B/C/D · Cổng theo câu hỏi · Song diện · 5 planes + budget · Vận hành đội). Nuốt: overview patchwork + discovery-gate0 draft + mọi amendment rải trong plan/chat. Các file cũ đóng dấu `[SUPERSEDED → workflow-v2-spec]`, giữ làm sử liệu | Claude (maintainer), Manh duyệt | 1-2 buổi máy + 30′ duyệt |
| P2 | **Cập nhật lớp người-đọc**: handbook (từ spec v2) + artifact "bức tranh tổng thể" (re-publish cùng URL) + **Sổ tay đọc-lại cho Manh** (thứ tự + thời lượng — mục tiêu: bắt kịp trong ~90′) | Claude | 0.5 buổi |
| P3 | **B2.5 đấu dây consumer** (từ review 30/07): 2 config key + quyết `/proto` shell; pilot-journal thêm luật đếm can-thiệp | Claude, Manh xác nhận | 30′ |
| P4 | **Hoà giải chip r2 đang chạy**: workspace + bảng nợ nó tạo KHÔNG vứt — trở thành INPUT của vòng HIỂU (hồ sơ kiểm kê sẵn) | — | 0 |
| P5 | **Chốt lịch người**: 1 buổi D1-grill (Manh + Claude) · 1 buổi S1-D design-pass · các cổng ~10′ · phiên UAT + danh sách 3-5 môi giới đặt lịch TRƯỚC | Manh | lịch |

## PHA R — RUN TOÀN TUYẾN (Trang Tư Vấn, đường A)

Nguyên tắc: đi qua TỪNG bước theo đúng spec v2 — mỗi bước được phép TIÊU THỤ
hồ sơ cũ làm input (kiểm kê, không amnesia); bước nào skip phải skip-có-tên.
Kit tự dẫn 100%; mọi chỗ hụt ghi lỗ, không đỡ.

| Vòng | Bước | Ghi chú kiểm chứng |
|---|---|---|
| **HIỂU** | D1 grill-mode (bản tay theo spec — LẦN ĐẦU chạy elicitation) với input = toàn hồ sơ r1 + bảng kiểm kê E03 inventory-first → opportunity mới | Đo lớp phòng thủ 1 lần đầu |
| | D2 red-team refresh trạng thái giả định · D2.5 nếu lộ ẩn số mới · D3 quyết theo spec (prototype ý định đã có sử liệu → được phép skip-có-tên) | |
| | **Cổng 0** — checklist 5 mục (kiểm kê · kế thừa tầng thiết kế · AC docs · guard baseline · luật đếm) | Manh ~15′ |
| **LÀM** | S0 → S1 (nạp `ui_standards_skill` — kiểm lưới P86) → **S1-D design-pass** (lần đầu chạy thật, Manh ngồi xem) → **Gate 1 trên bản bấm được** → S2 → Gate 1.5 (T3) → S3 (`/goal`) → S4 (kiểm carry-forward + cap) → **Gate 2** | Đo 5 lưới + design-pass + goal-template trong chiến trận |
| **TRAO** | Phiên UAT (bản tay — chấm kín + commitment device, số so T1′/T2′) → **Cổng UAT** → release theo verdict → S5 đối soát PRD (AC docs) · PRODUCT-MAP chưa built → skip-có-tên | Giả thuyết đo-tại-UAT được kiểm LẦN ĐẦU |

## Kênh feedback trực tiếp (điều Manh yêu cầu — vá luôn lỗ "giữa vòng")

- Mọi feedback của Manh tại bất kỳ bước nào → session đang chạy PHẢI ghi vào
  `pilot-journal.md` mục per-stage (khuôn: bước · nguyên văn feedback · xử lý:
  fix-tại-chỗ / chờ-cổng / lỗ-kit). Không ghi = lỗ.
- Sau mỗi VÒNG (HIỂU/LÀM/TRAO): maintainer session tổng hợp feedback + lỗ
  → 1 trang checkpoint cho Manh, trước khi vào vòng kế.

## Số đo — giữ nguyên 5 số pilot đã khai (plan rollout §Pilot r2) + nhật ký can thiệp A/B/C. Định nghĩa thất bại giữ nguyên.

## Vai

Manh = owner tại cổng + feedback, KHÔNG đỡ nội dung · Session per-vòng =
kit-tự-dẫn (một-worktree-một-phiên) · Maintainer session (đây) = quan sát,
tổng hợp checkpoint, ghi lỗ — không can thiệp content.

## Cần Manh quyết

1. Duyệt chiến dịch (P1 bắt đầu ngay khi gật).
2. Lịch P5 (buổi grill + buổi S1-D + phiên UAT).
3. Xác nhận: chip r2 giữ làm input (không huỷ).
