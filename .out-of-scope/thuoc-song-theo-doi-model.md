# Thước sống theo đời model — BÁC 16/09/2026

**Quyết định:** owner, 16/09, khi rà cả 28 ô «đang cân nhắc» theo North Star.
Ô gốc: `_acceptance/thuoc-song-theo-doi-model/opportunity.md` (mở 07/09, từ
playbook AI-Native SDLC, play «Recurring codebase scans» + «Continuous evals»).

**Đề xuất là gì:** bằng chứng ghi model nào sinh ra nó; một cờ «cũ theo model»
bắn khi đời model đổi; cờ nhạt có việc kế; và một **hình dạng lỗi đo-lường thứ
7** («thước bị nới sau khi đã đỏ») thêm vào bộ phân loại của kit.

**Vì sao có file này:** đề bài này rất dễ nảy lại. Mỗi lần một model mới ra, câu
«hồ sơ ký dưới model đời cũ có còn tin được không» nghe như một câu hỏi phải trả
lời ngay. Ghi lý do ở đây để lần đó đụng lý do trước khi kịp mở ô.

---

## Căn cứ — chi phí CHẮC đổi lấy lợi ích CHƯA ĐO ĐƯỢC LẦN NÀO

| | Lợi | Chi phí |
|---|---|---|
| Bản chất | chặn một hồ sơ ký dưới model đời cũ đọc y như hồ sơ đời nay | cờ bắn theo trục THỜI GIAN, không theo diff mã |
| Số đo tới 16/09 | **0 ca** | ghim lại nhân theo số vòng chạy song song |

**Chi phí là thứ kit đã đo và đã dựng luật để chặn.** `GUIDE.md` §7.1: chi phí
ghim lại nhân theo số vòng chạy song song (N vòng × mỗi merge = N−1 hồ sơ phải
ghim lại), nên **nhịp merge chính là trần của N**. Một cờ bắn theo thời gian phá
đúng cái trần đó: nó không chờ ai merge gì, nó chỉ chờ lịch. Và `CLAUDE.md` đã
chốt nhịp ngược lại — **re-pin theo RELEASE, không theo từng merge**; hồ sơ cũ
hoá stale giữa hai release là trạng thái **CHẤP NHẬN ĐƯỢC**.

**Lợi là suy đoán.** Ô tự khai `0/80 evidence-report.md` ghi model, nhưng không
nêu một lượt chấm nào từng sai vì trục này. Đây là mua bảo hiểm cho một sự cố
chưa xảy ra bằng một cơn bão ghim-lại chắc chắn xảy ra.

## Lý do thứ hai, độc lập — nó nới chính cái thước luật chiều rộng giữ ở MỘT tầng

Vế «hình dạng lỗi đo-lường thứ 7» cộng một mục vào bộ phân loại lỗi đo-lường của
kit. `CLAUDE.md`, «Giới hạn CHIỀU RỘNG» (a): *bộ đo được máy kiểm MỘT tầng — lưới
thường trực là trần; KHÔNG mở vòng đo-thước-của-thước.* Sáu hình dạng hiện có nói
về phép đo **sinh ra đã sai**; hình dạng thứ 7 nói về phép đo **hoá vô hại theo
thời gian** — tức một thước đo tuổi của thước. Cùng họ với
[.out-of-scope/thuoc-cua-thuoc-mot-tang.md](thuoc-cua-thuoc-mot-tang.md).

## Lý do thứ ba — đây là món CỘNG

ADR 0018 (15/09): CỘNG không bị bác vì là CỘNG, nhưng **không tự đi** — owner phê
duyệt đích danh. Ở lượt rà này owner đã đọc và bác.

## Ngưỡng mở lại (đang đếm)

**≥1 lượt chấm sai đo được, mà nguyên nhân gốc là ĐỜI MODEL** — tức một hồ sơ
xanh dưới model cũ, chấm lại y nguyên hợp đồng dưới model mới thì đỏ, và mã không
đổi giữa hai lượt. Một ca là đủ, vì hiện đang đếm từ 0.

Không mở lại vì «có model mới» hay «hồ sơ này ký lâu rồi» — hai điều đó luôn
đúng, không phân biệt được gì.

## Việc CÒN SỐNG, khác hẳn — đừng đọc file này thành «bằng chứng không bao giờ cũ»

Trục **mã đổi** vẫn được theo dõi nguyên như cũ: staleness theo diff, ghim lại
theo release, `evals_hash` và `non_discriminating` vẫn ghi. Án này chỉ bác trục
THỜI GIAN/ĐỜI MODEL.

## Prior requests

- 07/09: đọc playbook AI-Native SDLC → mở ô, chưa điền ngưỡng.
- 16/09: owner rà 28 ô theo North Star → bác, kèm ngưỡng mở lại ở trên.
- Ai muốn mở lại: chỉ ra **ca** đã chạm ngưỡng, và nói nó tránh cơn ghim-lại
  theo lịch bằng cách nào — không mở lại bằng lập luận suông về đời model.
