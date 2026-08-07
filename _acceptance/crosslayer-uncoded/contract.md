---
schema_version: 1
feature: Dấu cross-layer đọc theo cùng luật với judgment — trích dẫn Dấu hết bị chấm như mang Dấu
slug: crosslayer-uncoded
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: draft
approved_by:
approved_at:
time_human_minutes:
  gate1: 0
  gate2: 0
---

# Acceptance Contract: crosslayer-uncoded

## Context

`lib/ac-line.js` đọc Dấu `judgment` qua `uncoded()` — bóc code span đi trước khi dò,
theo đúng lý lẽ nó tự ghi: *một Dấu nằm trong code span là criterion đang TRÍCH DẪN
Dấu, không phải đang MANG Dấu*. Dấu `cross-layer` **không** được hưởng luật đó: nó
không sống trong lib, mà là một regex trần lặp lại ở từng nơi dùng.

Hệ quả không cân xứng với vẻ nhỏ của lỗi. Một hồ sơ **giải thích** Dấu cross-layer
cho người mới — chuyện bình thường trong repo dạy chính khái niệm đó — bị cổng CHẶN
merge vì một Dấu nó chỉ nhắc tên:

```
VIOLATION [feat-q]: AC-1 is tagged (cross-layer) but no eval of it declares
layer: backend-effect — …
exit=1
```

Đây là **lần thứ tư** của cùng một lớp lỗi đã đóng ở ba lát trước (#33 khuôn hẹp,
#34 khuôn hẹp nhất, #35 tham chiếu chéo): bộ dò không biết nhà viết. Ba lát kia sửa
*hình dạng dòng*; lát này sửa *ai được coi là đang nói*.

Không phải hồi quy của #35: khuôn `awk` cũ cũng khớp `.*\(cross-layer\)` bất kể
backtick. `parseAC` đóng được dạng tham chiếu chéo (`AC_XREF`) nhưng không đóng dạng
trích-dẫn-Dấu — hai hình dạng khác nhau, trước nay chỉ một được xử.

Source input: hồ sơ ngược `acceptance-gate-kit#36` (tự mở sau khi lỗi lộ ra lúc viết
hồ sơ `premerge-ac-line`).

## Criteria

- AC-1: Given một criterion trích dẫn Dấu cross-layer bên trong code span và evals của nó **không** khai `layer: backend-effect`, When chạy `pre-merge-check.sh`, Then **không** in `VIOLATION` nào cho criterion đó và exit 0. *Lỗi được sửa, và là nửa nặng: cổng CHẶN merge vì một Dấu criterion không mang. Đối chứng bắt buộc — cùng fixture trên bản chưa sửa phải đỏ.*
- AC-2: Given một criterion **thật sự mang** Dấu cross-layer mà evals thiếu cặp, When chạy `pre-merge-check.sh` **và** `eval-coverage-lint.js`, Then cổng vẫn in `VIOLATION` và lint vẫn in `W4`, đúng tên criterion. *Răng chống hồi quy. Sửa theo chiều này làm cổng IM HƠN, nên phải ghim lại rằng cái đáng chặn vẫn bị chặn — đây là vế dễ mất nhất khi nới một bộ dò.*
- AC-3: Given cùng criterion trích dẫn của AC-1, When chạy `eval-coverage-lint.js`, Then **không** sinh cảnh báo `W4` cho criterion đó. *Nửa advisory của cùng lỗi; hai consumer phải cùng đổi, nếu không thì Cổng 1 và cổng chặn lại bất đồng về việc criterion nào mang Dấu — đúng thứ bệnh mà `#35` vừa đi chữa.*
- AC-4: Given `parseAC`, When soi ma trận năm hình dạng dòng (mang Dấu judgment | trích dẫn judgment | mang Dấu cross-layer | trích dẫn cross-layer | Dấu ở Nhãn), Then hai cột `judgment` và `crossLayer` **đối xứng**: cùng bóc code span, cùng đọc Nhãn lỏng và thân bài chặt. *Đối xứng là phát biểu của bản sửa. Đo bằng ma trận chứ không bằng một ca lẻ, vì lỗi gốc chính là "một Dấu theo luật, Dấu kia thì không" — một ca lẻ không nhìn thấy sự lệch đó.*
- AC-5: Given `scripts/pre-merge-check.sh` sau thay đổi, When so diff với base bằng phép đo DV5, Then **0 dòng luật cũ bị xoá hoặc sửa** — phần sửa là một dòng ĐÈ thêm vào, dòng dò cũ giữ nguyên từng byte. *Luật chỉ-thêm của file này là ngưỡng chết O1. Đây là lần thứ hai nó ép hình dạng bản sửa, và đúng: một cổng chặn không nên bị viết lại, chỉ nên được bồi thêm.*
- AC-6: Given toàn bộ `_acceptance/` của kit **và** của ít nhất một repo tiêu thụ, When so trạng thái Dấu cross-layer của mọi criterion trước và sau thay đổi, Then **0 criterion đổi trạng thái**. *Bán kính thật, đo trước khi sửa. Nới bộ dò theo chiều làm cổng im hơn mà không đo là cách hay nhất để mất một luật đang bảo vệ thật; con số này (556 criterion, 7 → 7) là thứ biện minh cho việc sửa mà không cần sóng kiểm lại hồ sơ.*
- AC-7: Given bản sao `pre-merge-check.sh` bị gỡ đúng dòng đè, When chạy trên fixture của AC-1, Then cổng ĐỎ trở lại đích danh criterion đó — và bản tiêm vẫn phải là bash hợp lệ. *Chống 0-hit-giả. Vế "vẫn parse được" có mặt vì lần trước tôi tiêm bằng cách xoá trắng một dòng, để lại khối rỗng, và case "đỏ" vì script hỏng chứ không vì mất phần sửa; chốt `cmp` vẫn xanh vì file thật sự khác.*
- AC-8: **(judgment)** Given `crossLayer` đọc **Nhãn** lỏng (`/cross-layer/i`, không đòi ngoặc) y như `judgment` đang làm, When cân nhắc, Then đó là lựa chọn đúng so với đòi đúng chuỗi `(cross-layer)` ở cả hai chỗ. *Đọc lỏng ở Nhãn khiến `- AC-1 (bàn về cross-layer): …` bị coi là mang Dấu. Lập luận bảo vệ: nó sao chép nguyên luật của `judgment` nên không đẻ thêm hình dạng thứ hai để nhớ, và nó lệch về phía CHẶN NHIỀU HƠN — chiều an toàn cho một cổng chặn. Đo hiện tại: không hồ sơ nào trong 556 criterion vướng. T3 ⇒ người tự phán.*

## Coverage

Trục dựng từ **ai đang nói** và **nơi Dấu xuất hiện** — hai chiều mà lỗi gốc trộn lẫn.

- **Trục A — vai của chuỗi Dấu:** criterion MANG Dấu | criterion TRÍCH DẪN Dấu (trong code span) | Nhãn có chữ Dấu | không có Dấu — *[CE: comment `uncoded()` trong `lib/ac-line.js` + đo 178 hồ sơ mà nó ghi lại]*
- **Trục B — vị trí trong dòng:** ở Nhãn (giữa id và dấu hai chấm) | ở đầu thân bài | giữa thân bài | trong code span — *[CE: bảng ba biến thể nhà viết của `AC_LINE`]*
- **Trục C — consumer:** `pre-merge-check.sh` (CHẶN) | `eval-coverage-lint.js` (advisory) | `parseAC` (nguồn) — *[CE: #36 liệt kê ba nơi; `gate-card.js` không dò Dấu này]*
- **Trục D — ràng buộc trên chính diff:** chỉ-thêm (DV5) | bán kính bằng 0 | mirror khớp — *[CE: `additive-only.test.mjs`, phép đo 556 criterion, `P30`]*

Ô đáng chú ý: **trục A × trục C** là chỗ lỗi sống — cùng một chuỗi, ba consumer đọc
ba kiểu. AC-2 và AC-3 cố ý đo *cùng một hình dạng* ở *hai consumer*, vì bất đồng giữa
chúng mới là lỗi gốc, không phải bản thân regex.

**Ô để ngoài Core:** Dấu nằm trong khối fence ```` ``` ```` nhiều dòng. `uncoded()` chỉ
bóc code span một dòng; một criterion không thể trải qua fence nên ô này rỗng theo
cấu trúc, không phải bị bỏ.

## Out of scope

- **Không đụng đường fail-open của `eval-coverage-lint.js`** (khuôn hẹp khi thiếu lib): ở đó không có `parseAC` để hỏi, và nó vốn đã hẹp hơn — thêm luật vào đó là dựng lại đúng bản sao mà `#33` vừa gỡ.
- **Không gỡ khuôn `awk` đường lùi trong `pre-merge-check.sh`.** Nó vẫn chấm oan y hệt khi thiếu node; đó là giá đã nhận ở hồ sơ `premerge-ac-line` (AC-4/AC-5) và không mở lại ở đây.
- **Không đổi thông điệp `VIOLATION` / `W4` hiện có** — DV5 cấm, và thông điệp là hợp đồng đầu ra mà suite grep.
- **Không sửa `NEG_RE`, `W7`, hay bất kỳ bộ dò nào khác** dù cùng lớp lỗi — mỗi lớp một lát, để phép đo bán kính còn đọc được.
- **Không dựng luật mới cho `gate-card.js`**: nó không dò Dấu cross-layer, thêm vào là mở rộng phạm vi không qua cổng.

> Out of scope = scope-truth (Cổng 1 duyệt mục này).

## Notes

- **Chiều rủi ro ngược với ba lát trước.** #33/#34/#35 làm bộ dò THẤY NHIỀU HƠN; lát này làm nó CHẶN ÍT HƠN. Vì thế AC-6 (bán kính) và AC-2 (cái đáng chặn vẫn bị chặn) là hai criterion không được bỏ, kể cả khi thấy thừa.
- **Sóng ký lại:** chạm `lib/ac-line.js` + `scripts/pre-merge-check.sh` + `tests/scripts/run-tests.sh` ⇒ evidence của các hồ sơ đã ký thành stale. Chi phí đã biết của một lát T3 ở lõi cưỡng chế, báo giá tại Cổng 1 chứ không để lộ ở Cổng Bằng chứng.
- **Hồ sơ ngược #36** ghi đầy đủ bảng đối xứng, repro, và cảnh báo "đo trước khi nới" — lát này thực hiện đúng lời cảnh báo đó (556 criterion, 7 → 7, 0 đổi).
