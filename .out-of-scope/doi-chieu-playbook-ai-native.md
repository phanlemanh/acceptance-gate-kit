# Bảy đề xuất từ «The AI-Native SDLC playbook» — BÁC 07/09

**Quyết định:** máy bác, 07/09, qua hai lăng kính đối kháng độc lập trên mỗi đề
xuất; owner đọc kết quả ở
[docs/findings/2026-09-07-doi-chieu-ai-native-sdlc-playbook.md](../docs/findings/2026-09-07-doi-chieu-ai-native-sdlc-playbook.md).
Bản playbook đã lưu tại `docs/research/2026-09-07-ai-native-sdlc-playbook.md`.

**Vì sao có file này:** playbook là tài liệu hay, viết cho tổ chức nhiều người.
Ai đọc nó lần sau sẽ nảy đúng bảy ý dưới đây. Ghi lý do ở đây để lần đó đụng lý
do trước khi kịp mở ô — đúng thứ chính playbook đòi (dòng 1024: «dismiss with a
reason, so the same finding does not return as new»).

---

## 1. Cắt Cổng duyệt kế hoạch (Gate 1.5), hạ trần T3 về 3

**Bác.** Cổng này **có** bản ghi có thẩm quyền (entry sổ quyết định, commit cùng
hồ sơ — bốn hồ sơ T3 thật, trong đó `loi-moi-cong-may-sinh/decisions.jsonl:9,10`
mang thẳng `"stage":"gate1.5"`) và **có** cửa ra đối chiếu bằng máy (khối «Quyết
định CHƯA duyệt» ở `scripts/gate-card.js:930-934`, răng D07/D10). Nó đã làm đổi
một AC đã ký trên số đo 566 AC. Con số «0/1» dùng để buộc tội lấy từ mốc audit
22/08 tự khai «chưa có vòng T3 nào chạy» — đã lỗi thời.
**Việc còn sống, khác hẳn:** áp luật phân-loại-nguồn-căn-cứ xuống cổng này để nó
có ca-rỗng (làn V), như ba cổng kia. Đó là **thêm lối ra**, không phải bỏ cổng.

## 2. Dựng lưới đối chiếu diff với danh sách file của kế hoạch

**Bác.** Kit **cố ý** neo cửa ra vào hợp đồng và sổ quyết định, không vào kế
hoạch (`feature-loop/workflows/acceptance-verify.js:785-791, 869`). Ghim thước
vào một vật do máy sinh là mời lại lớp «đỏ vì hạ tầng chứ không vì vật» — vấp
thật P150, 23/08.

## 3. Thêm bảng phân loại 5 loại vào Cổng Phạm vi

**Bác.** Bộ phân loại trên không gian mở — đúng lớp vừa bị **TRỪ** 02/09 (xem
memory `truy-nguyen-truoc-khi-doi-khuon`: hai vòng vá đều THÊM một bộ phân loại
hợp đồng không đòi, nghiệm đúng là **xoá** nó). Và mô tả sai vật:
`scripts/gate-card.js:573-577` khai «ô duy nhất của cổng này là CHỮ QUYẾT» — một
ô ấy chính là quyết định của người, đã là tối thiểu.

## 4. Máy tự trông bản giao tới lúc merge, tự ghim lại, tự đẩy

**Bác.** Làn ghim-lại máy-một-mình đã sống từ 16/08
(`feature-loop/skills/feature-loop/SKILL.md:32`), có răng cấm làn-đỏ-chống-lưng-
chữ-ký (`scripts/recheck-evidence.cjs:87`, `scripts/pre-merge-check.sh:1091-1109`).
13 commit ≠ 13 lượt gọi người: commit `397e64e3` phủ 30 hồ sơ trong **một** lượt.
**Phần dư thật đã có nhát cắt gọi tên** ở `_acceptance/release-2-8-0/contract.md`:
cho lệnh ký chạy suite ngay trong lượt ghi chữ ký, mục tiêu 0 CI đỏ hậu-chữ-ký.

## 5. Thêm dòng số thứ tư/thứ năm ngoài luật (c)

**Bác.** Ví dụ đã nảy: «tỉ lệ ngưỡng được ký nguyên văn / số lần owner sửa ô điền
sẵn». Thuộc lớp **đo-thước-của-thước** đang park
([`thuoc-cua-thuoc-mot-tang.md`](thuoc-cua-thuoc-mot-tang.md)), ngưỡng mở lại
đang ở **0**.
**Việc còn sống, ngược chiều:** luật (c) đang đòi một con số kit **không rút
được** («≥10» ở 2.7.0, «chưa đếm» ở 2.8.0). Lối đi là **TRỪ** dòng đó, hoặc rút
nó từ vết máy tự để lại — không phải cộng dòng mới.

## 6. «Kit đo chi phí / model bằng tay vì luật một tầng»

**Bác — sai sự kiện.** Kit **có** quan trắc tự động, `usage-report.md` commit
cùng gói (`feature-loop/skills/feature-loop/SKILL.md:237-238`). Lệnh cấm hẹp và
có lý do kỹ thuật: hook không đọc nó (`:240`).

## 7. Ghi thêm dòng vào sổ cái lúc thi công (để chống lời-khai-tự-xác-nhận ở S3)

**Bác.** Sổ đó có bất biến «dòng do máy tính, cấm tự đúc mã»; và
`lib/evidence-core.cjs:175-181` gom mọi `run_id` không lọc loại — thêm dòng ở S3
mở đúng lối tự-đúc mà tầng provenance dựng ra để đóng. Hơn nữa ở S3 bên duy nhất
có thể ghi **chính là bên bị đo**, nên mọi dòng thêm ở đó vẫn là lời khai.
**Đây là GIỚI HẠN ĐÃ KHAI, không phải lỗ vá bằng sổ.** Hình dạng chặn-lúc-ghi đã
bị từ chối 26/07 ([`gap-probe-write-time-hook.md`](gap-probe-write-time-hook.md)).
**Ngưỡng mở lại (đang đếm):** ≥2 vòng S4 đỏ vì «một việc chưa từng chạy lệnh kiểm
của nó» — hôm nay **0/2**.

---

## Prior requests

- **2026-09-07** — lượt khảo sát duy nhất tới nay. Owner đưa link playbook, máy
  tải về `docs/research/`, chấm bằng 30 lượt (3 bản đồ kit · 6 đối chiếu · 1 gộp
  · 18 đối kháng · 2 tổng hợp/phê bình). 18 bài thô → 9 → **0 sống nguyên văn**.
  Bảy đề xuất trên là phần bị bác; phần còn lõi nằm ở mục A và B của hồ sơ
  finding.

## Nếu đề xuất nào ở đây quay lại

Đọc mục **D** của hồ sơ finding trước — nó khai bốn chỗ kit **cố ý** đi ngược
playbook kèm giá đã trả. Playbook tối ưu cho tổ chức nơi thứ khan hiếm là
**người trực**; kit tối ưu cho một owner nơi thứ khan hiếm là **lượt chú ý**.
Đề xuất nào làm tăng lượt gọi người hoặc tăng giờ-kit mà không cắt gì thì không
cần bàn tiếp — luật là **chỉ TRỪ, không CỘNG**.
