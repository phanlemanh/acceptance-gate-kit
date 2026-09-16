---
schema_version: 1
slug: bo-giai-nuot-chu-thich-yaml
feature: Bộ giải evals.yaml nuốt chú thích YAML trên `status: not-run` — lời khai của tác giả bị bỏ lặng
owner: phanlemanh@gmail.com
stage: decided
decision: park
decided_by: Mạnh
decided_at: 2026-09-16T02:19:29Z
---

## Vấn đề & ai gặp

`normaliseEvalStatus(v)` trong `lib/evidence-core.cjs` chạy
`unquoteScalar(...).trim().toLowerCase()` nhưng KHÔNG bóc chú thích YAML đuôi dòng.
`parseEvals` gọi nó không kèm tham số chuẩn hoá nên giá trị thô tới nơi còn nguyên
chú thích.

Đo được:

```
status: not-run  # lý do: máy CI không có DB   →  machineEvalIdsSkipped=[]  machineEvalIds=['E1']
status: not-run                                →  machineEvalIdsSkipped=['E1'] machineEvalIds=[]
```

Tệp anh em trong CÙNG họ tính năng thì có bóc: `expectedExits()` ở
`lib/eval-yaml.cjs` truyền `stripComment`, mà chính đầu tệp ấy khai là «MỘT nguồn
cho mọi bộ đọc dòng». `normaliseEvalStatus` là bộ đọc mới không dùng nguồn đó, nên
hai lời khai trong cùng một `evals.yaml` nay theo hai luật chú thích khác nhau.

**Người trả giá:** tác giả hồ sơ. Viết chú thích lý do cạnh `status: not-run` là
việc tự nhiên và hợp lệ với `expected_exit`. Làn ghim lại vẫn chạy eval đó; nếu nó
tình cờ xanh thì pin xanh và không đâu nói lời khai đã bị bỏ. Nếu nó đỏ thì làn đỏ
với thông điệp về một eval trượt, không phải về lời khai bị nuốt.

**Phát hiện ở:** vòng `cong-nguoi-doc-du-nguon` lượt chấm 8, định đoạt Ngoài-5 tại
Cổng Bằng chứng 13/09/2026.


> **ĐÃ GỘP 2026-09-16 (Mạnh) — đề bài dời trọn vào ô `mot-khuon-cho-ben-viet-va-ben-doc`.**
>
> Bốn ô cùng MỘT lớp — nguyên văn hình dạng (3) trong `CLAUDE.md`: *«bên VIẾT
> và bên ĐỌC của một artifact trôi khỏi nhau vì mọi test tự dựng fixture đúng
> khuôn bên đọc»*. Luật đó đã chỉ sẵn dạng nghiệm: một marker, hai bên cùng rút,
> ca round-trip. Bốn cổng riêng cho một dạng nghiệm là bốn lần hỏi người cho một
> lần quyết. Nội dung ô này giữ nguyên làm sử liệu.

## Ngả sửa (chưa quyết)

1. Cho `normaliseEvalStatus` dùng chung `stripComment` của `lib/eval-yaml.cjs` —
   phép TRỪ, bỏ một luật chú thích tự chế để dùng luật đã khai là một-nguồn.
2. Hoặc cho `parseEvals` truyền `stripComment` làm chuẩn hoá mặc định cho MỌI
   trường, để không bộ đọc mới nào phải nhớ.

Phép đo hai chiều bắt buộc: `status: not-run` có chú thích và không chú thích phải
cho CÙNG một tập `machineEvalIdsSkipped`; bản tiêm bỏ `stripComment` phải làm ô có
chú thích lệch khỏi ô không chú thích.
