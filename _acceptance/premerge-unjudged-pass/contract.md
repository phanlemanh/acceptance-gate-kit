---
schema_version: 1
feature: Chặn PASS chưa ai phán ở biên merge (chữ ký giữ-chỗ + slug tự khai phát hành không được tàng hình)
slug: premerge-unjudged-pass
risk_tier: T3
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-07-28T12:45:00Z
time_human_minutes:
  gate1: 8
  gate2: 5
owner: omre.cnsp4@onemount.com
---

## Criteria

- AC-3: Given một chữ ký giữ-chỗ nằm trong một commit RIÊNG của người, chỉ chạm dòng `human_signoff` (tức thoả trọn `signoff.require_human_commit: true`), When chạy pre-merge, Then VẪN VIOLATION (lưới giữ-chỗ). Ghim rằng `require_human_commit` KHÔNG cứu được lớp này — nó kiểm ai commit và commit đó chạm dòng nào, không kiểm nội dung có phải một cái tên; đã đo sống trên 1.23.0.
- AC-5: Given một slug có `human_signoff` khớp một mẫu giữ-chỗ tiếng Anh (`PENDING`, `TBD`, `TODO`, `n/a`, `none`, `unsigned`, `waiting`, hoặc block scalar trần `>` `|` `-`, hoặc template chưa điền `<name> <date>`), When chạy pre-merge, Then VIOLATION + exit khác 0. Và chữ ký thật (`Manh Phan 2026-06-20`) phải VẪN qua — lưới đen không được bắt oan.
- AC-6: Given một thư mục dưới `_acceptance/` có `evidence-report.md` khai `verdict: PASS` nhưng KHÔNG có `contract.md`, When chạy pre-merge, Then VIOLATION nêu slug vô hình với cổng trong khi evidence khai PASS + exit khác 0. Hôm nay: không OK, không VIOLATION, clean.
- AC-7: Given một thư mục tự khai đã phát hành và có `contract.md` nhưng THIẾU `risk_tier`, When chạy pre-merge, Then VIOLATION nêu ĐÍCH DANH field thiếu (`risk_tier`) + exit khác 0.
- AC-8: Given một thư mục tự khai đã phát hành và có `contract.md` nhưng THIẾU `status`, When chạy pre-merge, Then VIOLATION nêu ĐÍCH DANH field thiếu (`status`) + exit khác 0. Tách khỏi AC-7 vì hai field đi qua hai đường code khác nhau (`[ -n "$tier" ]` và `case "$status"`), gộp một case thì một trong hai đường không bao giờ được đo. **Ca dưới-ngưỡng bắt buộc:** cùng fixture nhưng `status` CÓ mặt với giá trị chưa-qua-cổng (`draft`, rồi `approved`) → KHÔNG VIOLATION, exit 0. Thiếu ô âm này thì một cài đặt bắt mọi giá trị `status` lạ (kể cả `draft`) vẫn xanh, và cổng sẽ đỏ trên mọi workspace đang làm dở.
- AC-9: Given một thư mục có `contract.md` khai `status: signed-off`, THIẾU `risk_tier`, và KHÔNG có `evidence-report.md` nào, When chạy pre-merge, Then VIOLATION + exit khác 0. Đây là hình dạng mà bản vá cục bộ của repo tiêu thụ KHÔNG bắt được (nó kích hoạt bằng `claims_pass` đọc evidence, mà ở đây không có file evidence để đọc); nó là lý do phương án "port nguyên văn" bị loại.
- AC-10: Given một thư mục "scaffold bỏ hoang" — không `contract.md`, hoặc contract có `status: draft`/`approved`, và không evidence nào khai PASS, When chạy pre-merge, Then KHÔNG có VIOLATION nào từ luật mới và exit 0. Đối chứng dương của nhóm tàng hình: im lặng với thứ chưa tự nhận đã qua cổng là hành vi ĐÚNG, không phải lỗ.
- AC-11: Given bất kỳ fixture đỏ nào ở AC-5/AC-6/AC-7/AC-8/AC-9, When chạy lại với `enforcement: off`, `warn`, và `strict`, Then CẢ BA đều VIOLATION + exit khác 0. `enforcement` chi phối hook write-time, không được hạ luật per-slug ở biên merge — đã đo là đúng với luật sẵn có, ghim để luật mới không trôi khỏi tính chất đó.
- AC-12: Given một lần chạy có VIOLATION từ luật mới, When soi output, Then (a) mọi dòng VIOLATION ra STDOUT (chạy `2>/dev/null` vẫn thấy) — CI chỉ grep stdout; (b) khi lần chạy CÓ truyền `--base`, dòng sổ luật-đã-chạy vẫn NGUYÊN VĂN `pre-merge-check: rules ran=3 declared-off=0 expected=3` — luật mới nằm TRONG luật per-slug đã có sổ, không phải luật thứ tư (chạy không `--base` thì sổ ra `ran=1 declared-off=2 expected=3` như hôm nay, cũng không đổi); (c) chạy hai lần trên cùng cây cho output y hệt (idempotent).
- AC-13: Given `commands/acceptance-init.md` và bản Codex tương ứng nếu có, When đọc dòng mô tả `signoff.approvers`, Then file PHẢI chứa marker CỐ ĐỊNH `# approvers: informational —` kèm câu nói rõ hai điều: (a) khoá này KHÔNG được cổng cưỡng chế, và (b) chữ ký VẪN bị kiểm bằng lưới giữ-chỗ tiếng Anh. Ghim marker chứ không chỉ đo vắng-mặt: xoá dòng cũ mà không viết gì thay thế vẫn xanh, và tài liệu câm về `approvers` để người vận hành tự suy ra mức cưỡng chế. Tài liệu nói sai (hoặc câm) về mức cưỡng chế là lỗi cùng hạng với cổng thủng: người vận hành cấu hình theo tài liệu.
- AC-14: Given một bản sao của `scripts/pre-merge-check.sh` bị vô hiệu ĐÚNG MỘT nhánh của luật mới (lần lượt: chốt lưới giữ-chỗ, chốt contract-missing, chốt field-missing, nhánh `contract` của `claims_released`), When chạy suite trên bản sao đó, Then ĐÚNG (các) case tương ứng ĐỎ và các case còn lại giữ nguyên màu. Không có phép đo này thì các AC trên không phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy" — bất biến assertion-âm-tính-một-mình của CLAUDE.md, và chính là thứ đã để hình dạng 4 sống sót trong bản vá của consumer.
- AC-16: Given ĐÚNG một fixture đỏ của nhóm chữ ký (AC-5) và một của nhóm tàng hình (AC-6), When gọi `pre-merge-check.sh` theo BA cách — có `--base <ref>` | KHÔNG `--base` | `--slug <chính slug đỏ>` — Then cả ba đều `exit != 0` và in CÙNG dòng VIOLATION. Luật mới nằm trong vòng per-slug vốn chạy ở MỌI chế độ gọi; nó TUYỆT ĐỐI không được nằm trong nhánh chỉ sống khi có `--base` (nhánh đó là của gap-probe và T1-escape, hai luật lọc theo diff PR). Không có AC này thì một cài đặt đặt luật mới sau chốt `--base` vẫn xanh toàn suite, trong khi consumer gọi không base — đúng chế độ đã gây incident #255 — không được bảo vệ gì. Kèm ô ÂM: `--slug <slug khác>` thì slug đỏ KHÔNG bị xét và exit 0 (đúng thiết kế cờ lọc, đã ghi ở Notes).
- AC-17: Given `human_signoff` RỖNG (luật sẵn có ở `pre-merge-check.sh:594`), When chạy pre-merge, Then exit khác 0 và dòng nổ là NGUYÊN VĂN thông điệp của chốt rỗng hiện tại (`verdict PASS but human_signoff is empty (Gate 2 pending)`), KHÔNG phải thông điệp của luật mới. Ghim cả nội dung lẫn THỨ TỰ: gộp chốt rỗng vào chốt lưới-giữ-chỗ cho gọn sẽ làm chuỗi rỗng không khớp mẫu nào rồi rơi ra `clean` — một hồi quy fail-open do chính feature này gây ra, trên một luật đang bảo vệ. Chuỗi kỳ vọng chụp từ 1.23.0 TRƯỚC khi sửa, dùng làm mốc.
- AC-15: (judgment) Given một người vận hành repo tiêu thụ, chưa từng đọc kit, thấy một dòng VIOLATION từ luật mới trong output CI, When họ đọc nó, Then họ biết được ba điều: cổng phản đối CÁI GÌ, VÌ SAO đó không phải hồ sơ hợp lệ, và HÀNH ĐỘNG tiếp theo là gì (ký thật / thêm field vào contract) — chứ không chỉ thấy một câu từ chối.

## Coverage

Quét bằng `morphological-scan` (preset `test-matrix`, đã dựng lại trục từ B1 vì trục preset hình dạng app người dùng không khớp một cổng shell). Ba trục sau khi loại trục không phân biệt:

- **Trục A — thư mục tự khai gì về mình:** không khai (scaffold / `status` draft·approved) | chỉ contract khai đã-qua-cổng | chỉ evidence khai PASS | cả hai khai [thước CE: nội bộ — 4 hình dạng đo sống trên 1.23.0 hôm nay + incident 2026-07-20 #255; thước AC-6/7/8/9/10]
- **Trục B — mảnh hồ sơ thiếu hoặc vô hiệu:** đủ & hợp lệ | thiếu `contract.md` | thiếu `risk_tier` | thiếu `status` | chữ ký rỗng (luật cũ, phải SỐNG SÓT nguyên thông điệp và nguyên thứ tự) | chữ ký giữ-chỗ [thước CE: ngành in-toto/SLSA + Gerrit Code-Review — artifact vô danh bị từ chối, phê duyệt là lá phiếu ràng buộc tài khoản chứ không phải văn bản tự do; thước AC-5/6/7/8, riêng giá trị "chữ ký rỗng" là AC-17]
- **Trục C — ~~cấu hình `signoff.approvers`~~ (RÚT 2026-07-29):** trục này bị gỡ khỏi phạm vi. Bốn bản vá liên tiếp cố phân tích danh sách approvers trong YAML bằng công cụ text của shell đều hỏng theo một hình dạng YAML hợp lệ MỚI, ba lần kèm hồi quy chặn nhầm người duyệt thật. Không gian hình dạng hợp lệ là vô hạn còn mỗi bản vá chỉ đóng được tập nghĩ ra được — nên lớp đó bị gỡ hẳn thay vì vá lần năm. Chi tiết + 4 bảng đo trong `review-findings.md`.
- **Trục D — chế độ gọi cổng:** có `--base` | không `--base` | `--slug` trúng | `--slug` trượt [thước CE: nội bộ — chính chế độ không-base là chế độ đã gây incident #255; thước AC-16]

Sau khi gạch các ô vô nghĩa (A=chỉ-evidence ép B=thiếu-contract; A=chỉ-contract loại hai giá trị chữ ký vì không có evidence), 10 ô Core → contract v1 có 15 AC. Phản biện context sạch (`gap-probe.md`) sau đó bổ sung 3 giá trị trục mà v1 để hở — hình dạng khai báo của trục C, giá trị "chữ ký rỗng" của trục B, và toàn bộ trục D — thành AC-1 (bảng), AC-2b, AC-16, AC-17. Con số AC lên 18; ngưỡng 5-15 của template là hướng dẫn, và repo đã có tiền lệ 17 AC ở `t1-escape-event-scope`.

**Trục đã loại vì không phân biệt:** chế độ `enforcement` (off/warn/strict). Đo trực tiếp: cả ba đều chặn một violation per-slug sẵn có, nên nó không đổi kết luận — hạ xuống thành bất biến cross-cutting, ghim ở AC-11 thay vì nhân ba không gian.

**Cross-cutting áp mọi ô Core:** stdout + đếm vào `violations` + không phá sổ luật-đã-chạy + idempotent (AC-12); phép tiêm đột biến chứng minh phép đo sống (AC-14).

## Out of scope

- **Chống giả mạo chữ ký.** Agent gõ thẳng `human_signoff: Manh Phan` khi Manh chưa ký là threat model KHÁC, do `require_human_commit` + `agent_authors` + hook lo. Feature này chặn *thành thật-nhưng-chưa-xong*, không chặn *nói dối*. Trộn hai thứ vào một contract làm cả hai đo không rõ.
- **Chữ ký số / GPG cho `human_signoff`.** Đổi hẳn mô hình tin cậy của cổng, không phải bài toán này.
- **Đảo mặc định "mọi thư mục trong `_acceptance/` phải giải trình".** Đã loại ở thiết kế: phá đúng nguyên tắc *thiếu field ≠ khai báo, field có mặt nhưng ngoài phạm vi LÀ khai báo*, và biến mọi thư mục nháp của consumer thành rác đỏ.
- **Cưỡng chế lớp này ở write-time bằng hook.** Đã từ chối 2026-07-26, hồ sơ ở `.out-of-scope/gap-probe-write-time-hook.md` — guard đọc trạng thái do chính agent bị ràng buộc viết ra.
- **Áp luật cho `status: draft|approved`.** Chưa tự nhận đã qua cổng thì chưa phải việc của biên merge.
- **Sửa `_acceptance/config.yaml` của repo tiêu thụ**, hoặc gỡ bản vá cục bộ của `artifact-platform`. Kit chỉ đổi chính nó; việc consumer bỏ vá cục bộ sau khi nâng kit là lượt riêng.

## Notes

- **Đã biết là không bắt được, cố ý:**
  - **Lưới giữ-chỗ chỉ khớp một bảng TIỀN TỐ ngắn cố định**, không phải "giữ-chỗ tiếng Anh". Đo thật trên bản đã ship: bắt `pending`, `tbd`, `todo`, `n/a`, `none`, `unsigned`, `waiting`, một `>` `|` `-` trần, và template chưa điền `<…>`. **Mọi thứ khác đều QUA** — kể cả giữ-chỗ tiếng Anh ngoài bảng (`FIXME`, `placeholder`, `LGTM`), lời cộc lốc (`ok`, `yes`, `x`, `.`), và mọi cách viết bằng ngôn ngữ khác (`chờ Manh gật`). Bản nháp đầu của mục này viết "lưới chỉ có mẫu tiếng Anh" — SAI, và vòng gia cố cuối bắt được: `FIXME` là tiếng Anh mà vẫn lọt. Khai hẹp hơn sự thật cũng là khai sai.
  - **Tên người kèm đuôi giữ-chỗ** (`Manh Phan — chưa duyệt`) qua, vì lưới chỉ soi TIỀN TỐ.
  - **Người ký không có thẩm quyền** (một cái tên thật, nhưng không phải người được uỷ quyền) qua. Cổng không còn danh sách người duyệt nào để đối chiếu kể từ khi rút phạm vi 2026-07-29; `signoff.approvers` là khoá TRANG TRÍ. Ai kiểm thẩm quyền là việc của `require_human_commit` + `agent_authors` + quy trình review, không phải của luật này.
  - **Bù lại ở tầng vận hành:** khi lưới nổ, cổng in một dòng NOTE nói thẳng bảng tiền tố là ngắn và cố định, để người vận hành không "sửa" bằng cách đổi cách viết rồi đi qua.

- `claims_released()` PHẢI đọc bằng `fm_field` (bất kỳ dòng nào) chứ không `front_field` (chỉ frontmatter dẫn đầu). Đây là bộ DÒ, doctrine là rộng-khi-dò/chặt-khi-nhận: một fence hỏng không được mua lấy sự vô hình — đó đúng là thứ đang cần bắt.
- Luật mới chỉ được có MỘT chỗ trả lời câu "thư mục này có tự nhận đã qua cổng không" (`claims_released`). Ba call-site gọi chung một hàm; viết lại điều kiện lần hai là hình dạng parity-giữ-bằng-comment mà `gap-probe-presence-hook` đã trả giá.
- Case dùng tiền tố `UJ*` (đã kiểm: chưa ai dùng; `GP/GPM/GPB/TE/RL/…` đã hết).
- Nhánh này đã gộp `fix/mk-gp-repo-sha-class` (`6c30ffb`) — vá lớp sha-trùng của `mk_gp_repo` — để một vòng verify phủ cả hai, vì cả hai đều sửa `tests/scripts/run-tests.sh`.
