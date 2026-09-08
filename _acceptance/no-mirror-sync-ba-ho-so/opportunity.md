---
schema_version: 1
slug: no-mirror-sync-ba-ho-so
feature: Ba hồ sơ đã ký còn nợ khoá `executors.script.mirror_sync` đã gỡ — nợ cuối cùng của corpus sau ADR 0014/0015, chờ một lối ra có tên
owner: phanlemanh@gmail.com
stage: discovery
decision: kill
decided_by: Manh Phan
decided_at: 2026-09-08T09:08:13Z
---

## Vấn đề & ai gặp

Hồ sơ `luu-kho-codex-va-nghi-le-design` gỡ khoá `executors.script.mirror_sync`
khỏi `_acceptance/config.yaml` (tiêu chí AC-9 của nó, owner duyệt 12/08 — ADR 0010).
21 hồ sơ đã ký có eval `cmd: config:executors.script.mirror_sync` nên
`recheck-evidence.cjs` đỏ trên chúng vĩnh viễn với thông điệp
`L2 SUBSTANCE x config key not found or empty: "executors.script.mirror_sync"`.
Kit che bằng danh sách có tên hai chiều `MIRROR_SYNC_GRANDFATHER`
(`tests/scripts/mirror-sync-grandfather.mjs`) — che ở RĂNG CORPUS, không nới reader.

08/09/2026: 18 trong 21 hồ sơ ấy đồng thời nợ làn suite-only (ADR 0014) và đã
**lưu kho** theo ADR 0015 (mốc `truoc-luu-kho-no-lan-2026-09-08`). Còn **ba** hồ sơ
KHÔNG nợ làn (đã ghim lại bằng làn eval hoặc chưa từng re-pin) mà vẫn đỏ vì đúng
một eval trỏ khoá chết:

| Hồ sơ | Ký | Eval trỏ `mirror_sync` |
|---|---|---|
| `consumer-copy-cjs` | Phan Le Manh 2026-08-09 | E10 |
| `mot-luot-go-cong-nguoi` | Manh Phan 2026-08-11 | E6 |
| `rang-phep-do-viec-cua-anh` | Manh Phan 2026-08-11 | E6 |

Hệ quả đo được: `pre-merge-check.sh --recheck-all` trên kit đỏ đúng 3 vi phạm này
(mọi vi phạm khác đã hết sau 08/09); pre-merge thường (theo diff PR) im vì luật
recheck thu theo diff — nhưng PR nào chạm một trong ba thư mục này là đỏ ngay.
**Người trả giá:** người mở PR chạm ba hồ sơ ấy; và răng corpus phải nuôi danh
sách 3 tên vĩnh viễn (rút tên hai chiều mỗi lần trạng thái đổi).

## Hai câu để người quyết

1. Ba hồ sơ này còn phải nằm trong corpus không? Nếu KHÔNG → lưu kho cùng khuôn
   ADR 0015 (một tag mới, `git rm` ba thư mục, rút ba tên — danh sách
   `MIRROR_SYNC_GRANDFATHER` về rỗng và tệp `mirror-sync-grandfather.mjs` tới
   trigger xoá đã khai của ADR 0010). Nếu CÓ → phải viết vào vật đã ký: đổi eval
   E10/E6/E6 sang khoá còn sống hoặc gạch có tên trong Known limits rồi ký lại
   (ba lượt gọi người) — hoặc chấp nhận nuôi danh sách 3 tên vô hạn.
2. Khoá `mirror_sync` có được phép hồi sinh dưới dạng `exit 0` để ba eval xanh
   không? Đề xuất: KHÔNG — đó là xanh giả đúng lớp kit cấm; nếu owner muốn, phải
   ghi ADR riêng.

Phép đo hai chiều đã có sẵn cho mọi lối: `tests/scripts/core-untouched.test.mjs`
(JR11b, qua `assertCorpus`) đỏ nếu tên khai mà hồ sơ hết đỏ, và đỏ nếu hồ sơ đỏ
mà không có tên.

## Kết (08/09/2026)

Owner phát ngôn trong phiên: «Lưu kho 3 hồ sơ mirror_sync luôn, rút tên» — tức
chọn lối 1 của câu 1, không hồi sinh khoá (câu 2). Đã thi hành cùng ngày: ba thư
mục rời corpus, giữ trọn ở mốc `truoc-luu-kho-mirror-sync-2026-09-08`;
`MIRROR_SYNC_GRANDFATHER` về rỗng (tệp giữ lại làm răng «corpus sạch tuyệt đối»);
`--recheck-all` trên kit về **0 vi phạm**. Owner phát ngôn «Điền decision» (2026-09-08): `kill` — không mở vòng, việc đã giải
bằng lưu kho; máy ghi hộ đúng ý muốn ấy.
