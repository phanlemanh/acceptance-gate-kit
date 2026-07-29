# feature-loop không tự chạy vòng — chẩn đoán, ĐÃ SỬA 2026-07-29

**Trạng thái:** đã kiểm chứng 2026-07-26; **đã sửa 2026-07-29** (feature-loop
1.17.1) theo đúng 5 đề xuất dưới, áp cho CẢ bản Codex (cùng lớp lỗi ở
`codex/feature-loop-codex`): bất biến dừng ở đầu skill, câu cuối S1/S2/S3 nói
rõ "đi tiếp NGAY", vòng REJECT tự động tới 3 round, in `/goal` thành bắt buộc
không điều kiện. Chưa đo lại trên phiên thật — số 7/7 dưới đây là baseline để
so sau.
**Nguồn:** người dùng báo *"Feature Loop đang không loop, không set goal hoặc
không chạy workflow loop — tôi phải duyệt và chạy bằng tay rất nhiều lần"*
(2026-07-26). Đo trên chính phiên chạy feature `gap-probe-presence-hook`.

## Triệu chứng — đo được

Thiết kế: **2 điểm dừng human** (Gate 1, Gate 2) + Gate 1.5 cho T3.
Thực tế trong một phiên: **7 lần dừng đúng thiết kế** (4 gate + 3 escalation
thật) và **7 lần dừng do agent tự chèn** — người dùng phải can thiệp gấp đôi.

Các lần tự chèn: sau Gate 1 hỏi "tiếp?" · sau Gate 1 v2 hỏi "lập plan?" ·
sau S3 hỏi "chạy S4?" (×2) · sau mỗi vòng findings hỏi "sửa rồi chạy round
kế?" (×3).

## Ba nguyên nhân

### 1. Agent không in gợi ý `/goal` (chính)

`SKILL.md` bắt buộc ở bước duyệt Gate 1: *"IN gợi ý lệnh theo template mục
/goal trong GUIDE, điền sẵn slug"*. Trong phiên đo, agent duyệt Gate 1 **hai
lần và không in lần nào**.

`/goal` là cơ chế DUY NHẤT để đoạn S2→S4 chạy không-người-trông. Điều kiện đều
thoả: GUIDE đòi Claude Code ≥ 2.1.139, máy đo được **2.1.196**; bản skill trong
cache (1.15.0) có dòng đó. Không in ⇒ người dùng không có cách hand-off ⇒ đúng
triệu chứng "không set goal".

### 2. Câu cuối S3 bị đọc thành điểm dừng

> `KHÔNG tự chạy evals — doer ≠ grader, đó là việc của S4.`

Ý đúng: *đừng chạy lệnh eval trong main loop; hãy dispatch Workflow S4 với agent
tươi*. Doer ≠ grader được thoả bởi **agent tươi**, không phải bởi **lượt của
con người**. Agent đọc thành "dừng, chờ người". Tương tự với vòng
REJECT → fix → round kế, vốn được quy định là tự động (tối đa 3 round).

### 3. Không gian âm trong SKILL.md

Skill nói **dừng ở đâu**, nhưng không câu nào nói **"đừng dừng chỗ khác"**. Cả
ba mục `S1`, `S2`, `S3` kết thúc bằng dòng trống, không có "→ đi tiếp X". Chỉ
một chỗ nói rõ: S2 ghi *"T2: đi tiếp luôn, không dừng"*.

Mặc định của agent là *báo cáo rồi chờ*, nên im lặng bị điền bằng priors. Đây
đúng failure mode **Negative Space** trong `writing-great-skills` (xem
`docs/research/2026-07-25-mattpocock-skills-teardown.md`): *mọi quyết định skill
từ chối đưa ra đều bị uỷ cho priors của agent, chứ không nằm trung lập.*

## KHÔNG phải nguyên nhân

`execute-parallel.js` không chạy là **đúng hành vi**: nó chỉ kích hoạt khi plan
có ≥2 task `independent: true`, mà cả hai plan trong phiên đều toàn
`independent: false` (mọi task đụng cùng một file). Workflow **có** chạy — 5
lần S4 `acceptance-verify.js`, 21–24 agent mỗi lần. Nói chính xác:
**workflow chạy, vòng lặp không tự đi.**

## Đề xuất sửa (~10 dòng, chạm `feature-loop/skills/` — T2, không phải t3_paths)

1. Mỗi mục `S1`/`S2`/`S3`/`S4` kết bằng một dòng **"→ đi tiếp `<stage>` NGAY,
   không hỏi"**.
2. Viết lại câu cuối S3 cho hết mơ hồ: *"KHÔNG tự chạy evals trong main loop —
   dispatch Workflow S4 ngay. Doer ≠ grader được thoả bởi agent tươi, KHÔNG
   phải bởi một lượt hỏi người."*
3. Thêm bất biến ở đầu skill: **"Chỉ dừng ở Gate 1 / Gate 1.5 / Gate 2 và ở các
   DỪNG-lỗi được liệt kê. Mọi chỗ khác: đi tiếp."**
4. Vòng REJECT: nói rõ *"fix xong chạy round kế NGAY, không hỏi; chỉ dừng khi
   hết 3 round."*
5. Cân nhắc: đưa việc in `/goal` thành một dòng **bắt buộc, không điều kiện**
   trong bước duyệt Gate 1 (hiện đang là mệnh đề "User muốn rời máy…?" nên dễ
   bị bỏ qua khi người dùng không hỏi).
