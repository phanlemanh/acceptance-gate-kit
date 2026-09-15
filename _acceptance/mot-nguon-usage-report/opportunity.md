---
schema_version: 1
slug: mot-nguon-usage-report
feature: usage-report về MỘT nguồn — khuôn tiêu đề do bên VIẾT và bên ĐỌC cùng rút, để hai dòng máy-đo của luật (c) thôi hỏng lặng
owner: phanlemanh@gmail.com
stage: discovery
---

# Cơ hội: usage-report về MỘT nguồn — hai dòng máy-đo của luật (c) thôi hỏng lặng

**Mở:** 2026-09-15, từ Ngoài-2 của mốc `release-2-14-0` (owner quyết tại Cổng Bằng chứng,
rồi rà lại cùng ngày bằng câu hỏi «làm thì người dùng kit được gì, không làm thì tác động gì»).

## Vấn đề, đo được

`usage-report.md` có hai đầu không nối nhau:

| | tệp | hành vi |
|---|---|---|
| bên **VIẾT** | `feature-loop/scripts/wf-usage.mjs:180` | in `### <title> — <runId> (…)`; `title` là **chuỗi tự do** người gọi gõ vào `--title` |
| bên **ĐỌC** | `scripts/loop-health.mjs:75` | khớp cứng `/^###\s+S4\s+round\s+(\d+)/gim`; không khớp thì `inS4` không bật |

Không marker chung, không round-trip. Và ca canh nó — `tests/scripts/loop-health.test.mjs:36` —
**tự dựng fixture** đúng khuôn bên ĐỌC (`### S4 round ${n} — wf_x`), nên nó xanh vĩnh viễn trong
khi seam gãy thật. Đây là nguyên văn hình dạng (3) mà `CLAUDE.md` liệt kê: *«bên VIẾT và bên ĐỌC
của một artifact trôi khỏi nhau vì mọi test tự dựng fixture đúng khuôn bên đọc»*.

**Số đo 15/09** — chạy đúng phép đo của `loop-health` trên ba hồ sơ mới nhất:

```
do-tin-tram-phan-loai        roundsUsage=3  tokenS4=53.974.767
chu-ky-khong-tu-lam-hoa-cu   roundsUsage=0  tokenS4=0
release-2-14-0               roundsUsage=0  tokenS4=0   (trước khi sửa tay trong lượt ký)
```

2/3 trả 0. Cái đúng khuôn chỉ đúng vì người gõ tình cờ trúng chữ, không vì luật nào bắt.

## Vì sao đáng làm — người hưởng cụ thể

1. **Owner, mỗi mốc phát hành.** Dòng 4–5 của luật (c) là hai dòng owner thêm 14/09 để đo chi phí
   máy, và luật khai rõ chúng là **máy đo**. Hiện con số `145.925.121` trong bảng năm dòng của
   mốc 2.14.0 là số phiên **cộng tay** — nhãn nói máy đo, xuất xứ là tay người. Luật (c) hoá hình
   thức đúng ở chỗ nó sinh ra để chống hình thức.
2. **Repo tiêu thụ đọc `loop-health`** để biết vòng lặp tốn bao nhiêu: thấy `0` và tưởng không tốn.
3. **Hỏng LẶNG.** Không cờ vàng, không NOTE, không exit khác 0 — chỉ một con số 0 trông như sự thật.

**Không làm thì:** mỗi mốc sau, ai gõ `--title` lệch một chữ là mất phép đo, và không ai biết cho
tới khi có người cộng tay đối chiếu (việc mà mốc này phải làm).

## Ngưỡng nghiệm thu đề xuất

- `wf-usage.mjs` và `loop-health.mjs` rút khuôn tiêu đề từ **một** marker chung, không bên nào
  chép tay; hoặc `wf-usage` nhận `--round <N>` và tự sinh khuôn, `--title` chỉ còn phần chú.
- Ca **round-trip**: sinh usage bằng chính `wf-usage.mjs` (không viết fixture tay) rồi đọc bằng
  `loop-health.mjs` — đúng mẫu `OOC-ITEM-TEMPLATE` + P55 mà `CLAUDE.md` đặt cho seam
  LLM-viết→máy-đọc.
- **Chiều đỏ:** đổi khuôn ở một bên → ca ĐỎ, ghim đúng thông điệp. Chiều im: chạm tệp không phải
  usage-report → ca IM.
- Hồ sơ cũ khuôn lệch: đường đọc-cũ (nhận cả khuôn cũ) **hoặc** một lệnh chuyển đổi — không bắt
  migrate hàng loạt.

## Ngoài phạm vi

- Ngoài-1 của cùng mốc (hồ sơ «tàng hình» khi status chưa arm cổng) — owner hạ xuống Known limits
  15/09: lưới trước-merge đã bắt fail-closed và chặn merge, lỗi là của người thao tác tay, repo
  tiêu thụ đi qua skill thì skill tự đặt status. Không-làm thì người dùng kit gần như không chịu
  tác động.
- Sửa `loop-health` để đọc mọi khuôn tự do — đó là nới bên đọc cho vừa bên viết, tức giữ nguyên
  seam hai nguồn.
