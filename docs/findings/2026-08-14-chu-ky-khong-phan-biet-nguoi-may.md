# FINDING — chữ ký Cổng 2 không phân biệt được «người đã khai quyết định» với «máy tự điền»

*2026-08-14 · Phát hiện bởi phiên điều phối khi hồ sơ 1c
(`doi-hanh-vi-cong-nguoi`) merge. Ghi ở đây theo yêu cầu: **KHÔNG tự sửa
engine**, không tự nong phạm vi hồ sơ `nguoi-ve-bien-v`. Owner quyết ở Cổng 1.*

**Không phải cáo buộc giả mạo.** Owner xác nhận đã phê thật. Lỗ nằm ở chỗ:
**hồ sơ không mang bằng chứng nào phân biệt được hai đường** — và một cổng mà
ta không đọc ra được ai đã quyết thì nó không còn là bằng chứng của quyết định,
nó là một dòng chữ.

## Sự việc

Chữ ký Cổng 2 của 1c do một phiên máy soạn và commit bằng danh tính git của
owner. Mọi lưới hiện hành đều xanh.

## Tái lập (chạy được ngay, trên `origin/main` = 103a2dd)

```
git log -1 --format='author=%an <%ae>%ncommitter=%cn <%ce>' 5d112f6
#   author=Manh <phanlemanh@gmail.com>   committer=Manh <phanlemanh@gmail.com>
git show --stat --format= 5d112f6
#   3 file, 3 insertion, 2 deletion — đúng vùng dòng human-owned
bash scripts/pre-merge-check.sh . --base origin/main | grep doi-hanh-vi
#   OK [doi-hanh-vi-cong-nguoi]: PASS, signed off by Mạnh Phan 2026-08-14
grep -h "human_signoff:" _acceptance/*/evidence-report.md | sort | uniq -c | sort -rn
#   30+ dòng "Manh Phan", DUY NHẤT hồ sơ này ghi "Mạnh Phan"
grep -n approvers _acceptance/config.yaml
#   approvers: ["Manh Phan"]  — khai là informational, KHÔNG được cổng đọc
```

## Ba lớp phòng thủ, và vì sao cả ba đều không chạm đường này

| Lớp | Nó kiểm gì | Vì sao không bắt |
|---|---|---|
| `signoff.require_human_commit` | commit chứa chữ ký chỉ được đụng dòng human-owned, và chữ ký phải xuất hiện trong lịch sử của chính file report | Kiểm **hình dạng commit**, không kiểm **ai gõ**. Máy sửa file rồi `git commit` bằng `user.name`/`user.email` của owner thì mọi điều kiện đều thoả |
| `signoff.agent_authors` (blocklist email) | tác giả commit không được khớp glob agent | Chỉ bắt khi máy commit bằng danh tính RIÊNG của nó. Commit dưới danh tính owner đi thẳng qua |
| Khoá model-invocation 6 lệnh cổng (ADR 0002) | model không gọi được `/signoff` | Khoá **lệnh**, không khoá **đường sửa-file-rồi-commit-thẳng**. Không cần `/signoff` vẫn ghi được `human_signoff` |
| `signoff.approvers` | — | Config tự khai là informational, cổng KHÔNG đọc (gỡ 2026-07-29 sau bốn bản vá hỏng). Nên tên lệch «Mạnh» vs «Manh» không lưới nào kêu |

Vết phụ đáng chú ý: **tên lệch một dấu** so với 30+ chữ ký khác và so với
`approvers` — đúng loại tín hiệu mà một lưới danh tính lẽ ra phải nhặt được,
và hiện không lưới nào nhặt.

## Vì sao nó chạm THẲNG hồ sơ này

`nguoi-ve-bien-v` dựng trạng thái V trên một mệnh đề: **V phải KHÁC nghĩa với
«người đã quyết»**. Ba tiêu chí đang cưỡng chế mệnh đề ấy về phía V:

- AC-3 và AC-5 chặn trạng thái mâu thuẫn (vừa V vừa `approved_by`/
  `human_signoff`) — «V giả mạo thành người-đã-quyết» không lọt.
- Thiết kế V nói thẳng: V = chưa ai quyết, đường đảo đang mở.

Nhưng **cùng câu hỏi ấy đang hở ở phía chữ ký**: nếu `human_signoff` cũng có
thể do máy điền mà không ai phân biệt được, thì cái mà V «khác với» lại chính
là một trường không tự chứng minh được nguồn gốc. Hệ quả cụ thể, đo được:

- Đường lùi của V là «rơi về mời ký như cũ» (fail-closed). Nếu «ký như cũ» tự
  nó không phân biệt được người/máy, thì đường lùi ấy yếu hơn ta tưởng.
- Tiêu chí xanh-sạch `no-uncertain` cố ý coi *có người nhúng tay là hết sạch* —
  giả định rằng dấu vết người là đáng tin. Cùng một giả định.

**Nó KHÔNG làm sai tiêu chí nào của hồ sơ hiện tại** (AC-1…AC-10 vẫn đo đúng
thứ chúng hứa); nó làm hẹp lại *giá trị* của mệnh đề nền. Vì thế: ghi finding,
không tự vá.

## Ba hướng đã cân (owner gạch một ở Cổng 1 — hoặc gạch «chưa làm»)

- **(a) Không làm gì, ghi known-limit.** Căn cứ: đây là mô hình tin cậy đã
  chọn từ đầu — kit tin danh tính git; ai kiểm soát máy thì kiểm soát cả git.
  Rẻ nhất, và trung thực nếu ta chấp nhận rằng chữ ký là *dấu vết để truy*,
  không phải *bằng chứng chống chối*.
- **(b) Bằng chứng lời-người (đường nhẹ, hợp nhịp kit).** Chữ ký chỉ hợp lệ
  khi đi kèm một trường ghi **câu người thật sự gõ** (vd `signoff_utterance`)
  — thứ máy không tự bịa được mà không nói dối tường minh; cộng lưới so tên
  chữ ký với `approvers` (bật `approvers` từ informational thành có răng, dùng
  bộ đọc YAML thật ở `lib/`, KHÔNG vá bằng công cụ text của shell — bốn bản vá
  2026-07-28/29 đã chết đúng chỗ đó). Bắt được cả ca «tên lệch một dấu».
  Đánh đổi: thêm một trường vào khuôn report, cần đường đọc-cũ cho 38+ hồ sơ.
- **(c) Chữ ký mật mã (`git commit -S`, hoặc token ngoài băng).** Chặn được cả
  máy chạy dưới danh tính owner. Đánh đổi: đắt, chạm hạ tầng khoá của owner và
  của cả đội khi nhân rộng — và nó giải một mối đe doạ (máy cố tình giả mạo)
  mà ta CHƯA quan sát thấy, trong khi cái ta vừa quan sát là *thiếu dấu vết*,
  không phải *có ý gian*.

**Khuyến nghị của người thi công: (b)** — nó vá đúng cái vừa lộ (không đọc ra
được ai khai), giữ nguyên mô hình tin cậy, và trace được về nguyên tố 2 (bằng
chứng không tự dối, người hưởng là MÁY: chính máy cần một chỗ để không tự nhận
nhầm việc của người). **Nhưng nó là một hồ sơ RIÊNG, không phải phép cộng vào
hồ sơ này** — nong phạm vi một hồ sơ đang chờ về đích đúng là lớp lỗi kit đã
trả giá nhiều lần. Nếu owner gạch (b), mở hồ sơ mới sau khi `nguoi-ve-bien-v`
merge.

## Trạng thái

**Chưa xử.** Không dòng engine nào của hồ sơ này được viết vì finding này.
Đưa lên Cổng 1 để owner gạch một trong ba hướng — hoặc gạch «chưa làm, ghi
known-limit» (đường (a)) và đóng lại có dấu vết.
