# Đề bài: truy nguyên vì sao vòng làm việc chậm, rồi đề xuất cách tăng tốc

Đề bài dùng chung cho **nhiều máy** và **nhiều kho**. Mỗi máy chạy một bản, điền khối THAM SỐ, ra một báo cáo theo
CÙNG một khuôn, để một phiên tổng hợp gộp được các báo cáo. Đây là việc nghiên cứu **chỉ đọc**: không sửa kho nào,
không đổi luật nào, không push lên nhánh chính. Trả lời bằng tiếng Việt.

## THAM SỐ (điền trước khi chạy)

```
MAY:            <tên máy, vd M5 / Mac Studio / MacBook Pro>
CUA_SO:         <khoảng thời gian đo, vd 2026-10-14T00:00Z .. 2026-10-16T00:00Z>
KHO:            <danh sách kho kèm đường dẫn cục bộ và remote, vd
                 crm-onehub  /Users/<u>/dev/crm-onehub  phanlemanh/crm-onehub  nhánh chính: onehub
                 oneflow     /Users/<u>/dev/oneflow     phanlemanh/oneflow     nhánh chính: main
                 acceptance-gate-kit /Users/<u>/dev/acceptance-gate-kit  phanlemanh/acceptance-gate-kit  nhánh chính: main>
KENH:           <kênh phối hợp giữa các máy, vd issue crm-onehub#375, acceptance-gate-kit#308; hoặc «không có»>
GOC_KY_UC:      <thư mục ký ức của phiên điều phối máy này, vd ~/.claude/projects/<dự-án>/memory/>
PHIEN_DIEU_PHOI:<sessionId phiên điều phối máy này để báo kết quả, hoặc «không có»>
NOI_GHI:        <kho + đường dẫn tệp kết quả, mặc định acceptance-gate-kit/docs/findings/<ngày>-truy-nguyen-toc-do-<may>.md>
```

## Kim chỉ nam (bắt buộc giữ)

Đọc `CLAUDE.md` của acceptance-gate-kit trước tiên. Tóm tắt phần ràng buộc:
- **Mục đích:** sản phẩm tới tay người dùng nhanh hơn mà vẫn tin được. Máy làm và tự chứng minh (màu xanh phải từng
  chạy chiều đỏ). Người chỉ quyết ở ít khoảnh khắc thật.
- **Thước đo, theo thứ tự ưu tiên:**
  1. Số lần gọi người trên mỗi kết quả ship.
  2. Thời gian từ làm-xong tới quyết-được.
  3. Chi phí máy (token · phút) trên mỗi kết quả ship.

  Lượt gọi người đứng TRƯỚC giờ máy: tiết kiệm token mà tăng lượt gọi người là thất bại.
- **Mục tiêu:** ≤3 lượt gọi người mỗi vòng (vòng T3 trần 4), ≤1 chạm mỗi lượt.
- **Ba nguyên tố**, mọi đề xuất phải trace về một trong ba:
  - ý định chốt trước khi làm;
  - bằng chứng không tự dối;
  - khoảnh khắc quyết thật.
- **TRỪ thì máy tự đi; CỘNG cần owner duyệt** (ADR 0018).
- **Luật chiều rộng:** việc kit tự sửa chính nó (meta) mặc định đóng băng, nên đề xuất CỘNG cho kit chỉ ghi thành
  hạt giống.
- **Sửa kit vì sự cố của một kho phải cân trên mọi kho:** «kho không có sự cố này được gì, mất gì?».

## Nguồn số đo (tự dò theo THAM SỐ, đừng đoán)

Với mỗi kho trong KHO:
1. **Dòng thời gian PR:** `gh pr list -R <remote> --state all --search "updated:>=<đầu CUA_SO>" --json
   number,title,createdAt,mergedAt,headRefName`. Với từng PR, đếm số lần push (commit sau lúc mở), số lượt CI và các
   lượt đỏ chập chờn (`gh pr checks`, `gh run list --branch`).
2. **Hồ sơ vòng:** `_acceptance/<slug>/` trong nhánh chính và mọi worktree (`git worktree list`). Đọc:
   - `decisions.jsonl`: giờ của từng cổng, dòng `fix` / `descope` / Treo.
   - `run-log.jsonl` và `usage-report.md`: phút và token của S4.
   - `duong-nen.md`.
   - Nhật ký ghim lại trong `.acceptance-runs/`.
3. **Kênh phối hợp** (KENH): đọc bằng `gh api --paginate .../issues/<n>/comments` (issue có thể >100 bình luận),
   lọc theo CUA_SO. Đếm giờ chờ trả lời, số lần đổi thứ tự lô, số lần «đỏ sẵn», số lần ghi bù.
4. **Ký ức điều phối** (GOC_KY_UC): nhật ký từng bước có giờ UTC.
5. **Transcript các phiên thợ** của máy này: công cụ `ccd_session_mgmt` (`list_sessions`, `list_events`), chỉ đọc.

## Giả thuyết cần đo (thêm cái mạnh hơn nếu thấy)

- **H1 — Làn nặng:** mỗi máy chạy một làn nặng một lúc (S4, ghim lại, đường nền, phiên đo màn, push có pre-push).
  Đo độ dài hàng chờ, và đo các lần chồng làn có gây hỏng không.
- **H2 — Kiểm tra trùng:** pre-push chạy trọn suite, trùng với CI. Đo phút làn mỗi lần push và số lần push mỗi vòng.
- **H3 — «Đỏ sẵn» trên nhánh chính:** hồ sơ đã ký mục dần, vì CI theo PR không chạy eval hồ sơ. Đo giờ máy và giờ
  chờ mà nó gây ra. Kiểm cả hai luật: kit cấm khai not-run trên eval đã ký còn mã thoát, và kit không có lối «đỏ sẵn
  trên nền».
- **H4 — Gộp nối đuôi + «cũ theo paths»:** mỗi lần nhánh chính tiến, mọi vòng đang chờ phải gộp lại và ghim lại.
  Đo số lượt ghim lại thừa và phút của chúng.
- **H5 — Giờ chờ người ở cổng và các chạm thừa:**
  - chốt cỡ hợp đồng;
  - nhãn cross-layer bị pre-merge chặn;
  - quyết định chuyển qua phiên khác không được tính, người phải bấm lại.
- **H6 — Eval «giữ hồ sơ»:** chạy lại hàng chục eval đã ký thì vượt trần thời gian; bị cắt đi thì có lọt lỗi không.
- **H7 — Tin liên phiên trễ:** tin xếp hàng tới khi lượt của thợ kết thúc, nên thợ hành động trước khi đọc.
- **H8 — Kênh phối hợp giữa các máy chậm:** giờ chờ trả lời, và token phải đọc mỗi lần.
- **H9 — Khác biệt giữa các kho:** kho nào không gặp lớp lỗi nào, và vì sao (cấu hình CI, kích thước bộ test, số hồ
  sơ đã ký, bản kit đang cài).

## Đầu ra (khuôn chung, để gộp được)

Ghi vào NOI_GHI theo luật thuật ngữ `CONTEXT.md` và quy tắc hình `docs/reference/DIAGRAM-RULE.md` của kit. Một hình
dòng thời gian một vòng điển hình là đủ.

1. **Bảng gốc nguyên nhân.** Cột: `mã H` · `kho` · `số đo` (giờ máy · giờ chờ · lần · lượt gọi người) · `nguồn
   trích` (đường dẫn / PR / bình luận) · `cạnh tứ diện` (Ý · Hạng mục · Thước · Vật) · `chung mọi kho hay riêng`.
2. **3–4 phương án.** Mỗi phương án là một gói thay đổi nhất quán. Mỗi phương án ghi:
   - thay đổi gì, ở tầng nào (kit · từng kho · luật giữa các máy);
   - TRỪ hay CỘNG;
   - giá dựng (giờ máy);
   - hiệu quả ước trên mỗi vòng: lượt gọi người · giờ chờ · giờ máy;
   - rủi ro tự dối: chiều đỏ còn không;
   - đường đảo;
   - ai phải duyệt;
   - kho KHÔNG gặp sự cố được gì, mất gì.
3. **Chấm điểm** theo thứ tự ưu tiên của kim chỉ nam. Có bước **đối kháng**: một tác tử phản biện thử phá từng phương
   án, ghi phán quyết kèm số.
4. **Một khuyến nghị**, chia làm ba phần:
   - phần máy tự đi được ngay;
   - phần cần owner duyệt, kèm lời mời MỘT dòng;
   - phần chỉ ghi hạt giống kit (đường dẫn `docs/plans/<ngày>-hat-giong-*.md`).

Commit trên một nhánh docs mới, KHÔNG gộp nhánh chính; owner xem trước. Nếu PHIEN_DIEU_PHOI có giá trị, gửi phiên đó
qua `send_message`: đường dẫn tệp, khuyến nghị một đoạn, lời mời owner một dòng.

## Phiên tổng hợp (chạy sau khi các máy xong)

Đọc mọi tệp `docs/findings/<ngày>-truy-nguyen-toc-do-*.md`, gộp bảng gốc nguyên nhân theo `mã H`, tách gốc
**chung mọi máy / mọi kho** khỏi gốc **riêng một nơi**. Ra MỘT khuyến nghị chung theo cùng khuôn mục 4, ưu tiên nghiệm
đúng tầng (kit · luật giữa các máy) cho gốc chung, và nghiệm tại kho cho gốc riêng.
