## Trong hợp đồng

### signoff.approvers block-list parser still slurps unrelated list items — fail-open allowlist and suppressed AC-4 config violation
- file: `scripts/pre-merge-check.sh:293`
- severity: medium
- source: bugs
- AC: AC-4

The block-list branch ends its sed range at `/^  [a-zA-Z0-9_-]*:/` — a key at *exactly* two-space indent. Commit 1da6cf6 fixed the indent-2-sibling-with-comment case (UJ1x), but the range still runs to EOF whenever the next key is at indent 0 (or any indent != 2), swallowing every `- item` line encountered before the first indent-2 key.

Repro 1 (fail-open): config with `signoff:` → `approvers:` block list `- "Alice"`, followed by top-level `agent_authors:` / `  - "ci-bot@corp.com"`. Evidence `human_signoff: ci-bot@corp.com 2026-07-28` →
`OK [feat-a]: PASS, signed off by ci-bot@corp.com 2026-07-28` / `pre-merge-check: clean`, exit 0. The blocked bot identity became an approver.

Repro 2 (AC-4 suppressed): `approvers:` with zero items, followed by top-level `baseline_minutes:` / `  - 90`. APPROVERS resolves to `90`, so the new `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name` never fires; instead an unrelated per-slug violation is emitted. Verified: grepping the whole run shows no `VIOLATION [config]` line at all.

A robust fix is to bound the range by indentation relative to the `approvers:` line (only lines more-indented than the key are list items), not by a fixed two-space sibling pattern. Same defect shape exists in the mirrored copy plugins/acceptance-gate/scripts/pre-merge-check.sh.

rationale: Repro 2 dựng đúng fixture AC-4 (approvers khai nhưng tách ra 0 tên) và cho thấy dòng VIOLATION [config] bắt buộc theo AC-4 không xuất hiện vì bộ tách bị trôi sang khoá kế tiếp — đúng hành vi mà AC-4 cấm ("KHÔNG được âm thầm tụt xuống nhánh không khai").

### Mutation harness uj_mut() passes when the mutation filter fails and produces an empty script
- file: `tests/scripts/run-tests.sh:3141`
- severity: medium
- source: bugs
- AC: AC-14

`uj_mut <label> <filter> <fixture>` does `eval "$2" > "$UJMUT"`, guards only with `diff -q "$CHECK" "$UJMUT"` ("mutant must differ from the original"), then asserts the mutant exits **0** on the fixture.

A filter that errors out — awk/sed syntax error, a renamed variable, a source refactor that breaks the script pipeline — leaves `$UJMUT` empty or truncated because the `>` redirect truncates regardless of the command's exit status. An empty file trivially differs from the original (guard passes) and `bash <empty file>` exits 0 (verified: exit=0), which is exactly the asserted value. So all six UJ14 mutation cases turn green while measuring nothing.

This is the CLAUDE.md "assertion âm-tính-một-mình" shape aimed at the very harness built to prevent it: the only signal distinguishing "mutation correctly disabled the rule" from "mutation never ran" is an exit code that a broken filter also produces. Guard should additionally require the mutant to be non-empty and to still be a runnable gate — e.g. assert `bash -n "$UJMUT"` passes and that the mutant is still RED on an unrelated fixture that the mutated branch does not cover.

rationale: AC-14 yêu cầu phép tiêm đột biến phải phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy"; harness uj_mut() mô tả trong finding chính là cơ chế đo cho AC-14 và bị chứng minh cho kết quả xanh giả khi mutant hỏng, nên đây là chính AC-14 thất bại chứ không phải một tiêu chí khác.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **GUIDE.md không cập nhật cho `signoff.approvers` đã được cưỡng chế + 3 lớp VIOLATION mới**
  Người dùng thấy gì: Tài liệu hướng dẫn cấu hình đầy đủ của gói vẫn im lặng về việc danh sách người duyệt giờ bắt buộc và về ba loại cảnh báo mới, nên người vận hành đọc đúng theo tài liệu này có thể cấu hình thiếu mà không biết mình đang bỏ sót bước quan trọng.
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/GUIDE.md:537`
  severity: medium
  Đề xuất: known-limits

- **Bump 1.24.0 không kèm câu "v1.24 …" trong description của 3 manifest — phá nếp release đang có**
  Người dùng thấy gì: Ghi chú phát hành đi kèm bản cập nhật mới không nhắc gì tới thay đổi quan trọng về xác nhận người duyệt, nên người chuẩn bị nâng cấp sẽ không biết cần xem lại cấu hình của mình trước khi lên bản mới.
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/.claude-plugin/plugin.json:4`
  severity: medium
  Đề xuất: known-limits

- **Không có ADR cho quyết định fail-closed "khai approvers mà rỗng = VIOLATION"**
  Người dùng thấy gì: Lý do đổi cách xử lý một mục cấu hình quan trọng chỉ nằm rải rác trong mã nguồn thay vì ở nơi người vận hành thường tra cứu quyết định, nên người sau muốn hiểu vì sao hành vi thay đổi sẽ khó tìm được câu trả lời đầy đủ.
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/scripts/pre-merge-check.sh:300`
  severity: low
  Đề xuất: known-limits

- **acceptance-init scaffolds an angle-bracket placeholder into the now-enforced approvers allowlist — blocks every genuine signature**
  Người dùng thấy gì: Làm đúng theo hướng dẫn khởi tạo mặc định sẽ để sót một giá trị mẫu chưa điền trong danh sách người duyệt; hậu quả là mọi chữ ký thật sau này đều bị từ chối, và thông báo lỗi lại đổ lỗi cho chữ ký chứ không chỉ ra chỗ cấu hình cần sửa, khiến người dùng có thể loay hoay không hiểu vì sao được duyệt vẫn không qua cổng.
  file: `commands/acceptance-init.md:64`
  severity: high
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 2/6 lỗi rơi vào file không bộ đo nào phủ (GUIDE.md, .claude-plugin/plugin.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.


---

## Vòng gia cố (re-pin tối thiểu) — 2026-07-28, delta `1da6cf6..303508a`
Không phải round 3 đầy đủ. Hai làn: machine lane chạy lại ở HEAD, và refute đối kháng CHỈ trên delta chưa ai review.
**Machine lane ở HEAD (303508a): 5/5 xanh** — `bash tests/scripts/run-tests.sh` exit 0, `bash tests/hooks/run-tests.sh` exit 0, `bash tests/plugins/run-tests.sh` exit 0, `bash scripts/sync-plugin-packages.sh --check` exit 0, `bash tests/workflows/run-tests.sh` exit 0.
**Refute: 3/3 góc BÁC BỎ tuyên bố của bản vá.** 13 finding, 11 trong hợp đồng, 7 HIGH.

### Kết luận: delta 303508a NET-XẤU so với 1da6cf6
Hai lăng kính độc lập (parser, regression) cùng bắt được hai hồi quy — corroborate chứ không phải một agent đoán.

#### [HIGH] trong hợp đồng — awk chi va DIEM KET vung — diem MO vung van bam `approvers:` cua khoa khac, bot ky lot (exit 0, clean)
**Kịch bản fail:** /tmp/uj-adv/cfg/s6.yaml (YAML hop le; python yaml.safe_load xac nhan signoff.approvers == ['Manh Phan']):
schema_version: 1 | notifications: | __approvers: | ____- ci-bot@corp.com | signoff: | __required_for: [T2, T3] | __approvers: | ____- "Manh Phan" | __require_human_commit: false
evidence-report.md co `human_signoff: ci-bot@corp.com 2026-07-28` -> `bash scripts/pre-merge-check.sh /tmp/uj-adv/repos/s6-bot` -> EXIT 0, in `OK [feat-ok]: PASS, signed off by ci-bot@corp.com 2026-07-28` + `pre-merge-check: clean`.
Doi chung nguoc tren CUNG fixture: chu ky cua nguoi duyet THAT `Manh Phan 2026-06-20` -> EXIT 1, `VIOLATION [feat-ok]: ... does not name any approver declared in signoff.approvers`. Tuc allowlist ky = list cua khoa `notifications`, khong phai cua `signoff`.
Bien the block-scalar (/tmp/uj-adv/cfg/s5.yaml) cho ket qua y het: khoa `approvers_help: |` chua vi du tai lieu `approvers:` + `- ci-bot@corp.com` (item o ind 6, SAU HON keyind 4) -> ci-bot ky = clean/exit 0, Manh Phan = VIOLATION. Day dung la 'muc list thut sau hon nhung thuoc khoa khac' ma tuyen bo noi da chan.

**Chi tiết:** Nguyen nhan o scripts/pre-merge-check.sh:276-299: `grep -qE '^[[:space:]]*approvers:'`, `sed ... | head -1`, va awk `!seen && /^[[:space:]]*approvers:[[:space:]]*$/` deu KHONG kiem khoa cha la `signoff`, va deu khoa vao lan xuat hien DAU TIEN o bat ky dau trong file — ke ca ben trong gia tri block-scalar cua khoa khac. Delta 303508a chi doi luat KET THUC vung (`ind <= keyind`); luat MO vung giu nguyen khiem khuyet, nen cung lop loi chi doi dau.
He qua kem: AC-4 bi bop nghet lai theo duong vong MOI — /tmp/uj-adv/cfg/s12.yaml de `signoff.approvers:` RONG (safe_load = None) trong khi `notifications.approvers` o tren co ten: dong `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name` KHONG NO, va ci-bot ky -> exit 0 clean. Dung lop UJ1z duoc viet ra de ghim, chi khac la no di qua dau vung thay vi cuoi vung.

#### [HIGH] trong hợp đồng — HOI QUY do chinh delta: block sequence thut NGANG BANG khoa (YAML chuan) bi tu choi — xanh o 1da6cf6, do o 303508a
**Kịch bản fail:** /tmp/uj-adv/cfg/s1 (safe_load = ['Manh Phan','memto']): `__approvers:` roi `__- "Manh Phan"` / `__- "memto"` (item cung cot voi khoa). Chu ky that `Manh Phan 2026-06-20`:
- script 303508a -> EXIT 1, `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name — ... Write it as signoff.approvers: ["<name>"] or a YAML block list`
- script 1da6cf6 (ban truoc delta, chay tu /tmp/uj-adv/kitprev tren CUNG fixture) -> EXIT 0, `pre-merge-check: clean`
Doi chung duong: cung script 303508a voi item thut sau 4 space -> EXIT 0 clean. Nen mau do den tu hinh dang thut, khong phai fixture hong.
Hau qua van hanh: repo tieu thu khai dung hai nguoi duyet that bi chan merge, kem thong diep bao ho 'hay viet thanh YAML block list' — dung thu ho vua viet.

**Chi tiết:** awk `if (ind <= keyind) exit` voi keyind=2 va item ind=2 -> thoat ngay o muc dau -> 0 ten. YAML cho phep block sequence nam cung cot voi khoa mapping cua no; day la style `yq` va nhieu editor sinh ra. AC-1 goi ten chinh che do hong nay ('Fail-closed SAI la che do hong khien consumer go luat thay vi dung no') va doi do theo BANG hinh dang khai bao — nhung UJ1_BLOCK chi co mot kieu thut nen hoi quy di qua toan suite.

#### [HIGH] trong hợp đồng — HOI QUY do chinh delta: `approvers:` co CHU THICH DUOI + block list bi tu choi — dung hinh dang commit message tu nhan da hoc
**Kịch bản fail:** /tmp/uj-adv/cfg/s2 (safe_load = ['Manh Phan']): `__approvers:           # OPTIONAL - ai duoc ky` roi `____- "Manh Phan"`. Chu ky that `Manh Phan 2026-06-20`:
- script 303508a -> EXIT 1, `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name`
- script 1da6cf6 tren CUNG fixture -> EXIT 0, `pre-merge-check: clean`
Doi chung duong: xoa rieng chu thich duoi, giu nguyen moi thu khac -> script 303508a EXIT 0 clean.

**Chi tiết:** awk mo vung bang `/^[[:space:]]*approvers:[[:space:]]*$/` — neo `$` doi khoa TRAN nen chu thich duoi lam `seen` mai bang 0, trong khi nhanh `case` phia tren da strip chu thich nen ap_raw='' va luong van roi vao nhanh block-list -> 0 ten. Day dung la khiem khuyet v1 ma commit message mo ta ('v1 doi khoa TRAN -> khoa co chu thich duoi khong ket thuc duoc vung'), chi chuyen tu ve ket-thuc sang ve mo-dau. Rui ro that: template kit ship `approvers: ["<from 2f>"]   # approvers: enforced — ...` (commands/acceptance-init.md:64), nen nguoi doi sang block list ma giu chu thich roi thang vao day.

#### [MEDIUM] trong hợp đồng — CRLF: nhanh block-list cat trailing-space SAU khi cat dau nhay nen ten con du dau nhay — nguoi duyet that bi tu choi
**Kịch bản fail:** /tmp/uj-adv/cfg/s9.yaml — file CRLF, block list co nhay kep (safe_load = ['Manh Phan']). Chu ky `Manh Phan 2026-06-20` -> EXIT 1, `VIOLATION [feat-ok]: human_signoff "Manh Phan 2026-06-20" does not name any approver declared in signoff.approvers`.
Doi chung duong 1: cung file CRLF nhung ten KHONG nhay (/tmp/uj-adv/cfg/s9b.yaml) -> EXIT 0 clean. Doi chung duong 2: cung noi dung nhung LF + nhay -> EXIT 0 clean. Guard '2-space line schema' KHONG chan CRLF (da do: khong co dong VIOLATION schema nao).

**Chi tiết:** Chuoi sed cua nhanh block: strip `^["']`, roi `["']$`, roi moi `[[:space:]]*$`. Khi ky tu cuoi la CR, mau `["']$` truot nen ten con `Manh Phan"`. Nhanh INLINE cat trailing-space TRUOC khi cat nhay nen mien nhiem — bat doi xung trong cung mot feature. Khong phai hoi quy (1da6cf6 cung do tren fixture nay) nhung van la o 'block list' cua bang AC-1 sai.

#### [MEDIUM] trong hợp đồng — Flow list xuong dong (`approvers: [` + item o dong sau) tach ra 0 ten -> VIOLATION [config] oan
**Kịch bản fail:** /tmp/uj-adv/cfg/s3 (safe_load = ['Manh Phan','memto']): `__approvers: [` / `____"Manh Phan",` / `____"memto"` / `__]`. Chu ky that -> EXIT 1, `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name`. Ca 303508a lan 1da6cf6 deu do (khong phai hoi quy).
Doi chung duong: cung hai ten viet mot dong `approvers: ["Manh Phan", "memto"]` -> EXIT 0 clean.

**Chi tiết:** ap_raw = `[` -> khop `case \[*` -> nhanh inline strip `^\[` va `\]$` tren dung mot dong -> chuoi rong -> 0 ten. Day la dang moi formatter YAML (prettier, yq) sinh ra khi list dai qua cot. O 'inline nhieu ten' cua bang AC-1 chi do dang mot dong nen khong phat hien.

#### [LOW] trong hợp đồng — Bang AC-1 do moi hinh dang khai bao o DUNG MOT diem thut nen khong song duoc voi hoi quy thut
**Kịch bản fail:** UJ1_BLOCK o tests/scripts/run-tests.sh:2811 co dinh `approvers:` tai indent 2 voi item tai indent 4, va khong o nao dat chu thich tren dong khoa. Do do hai hoi quy do duoc o tren (item ngang bang khoa; khoa co chu thich duoi) lot qua toan bo suite ma moi case van xanh — xac nhan bang cach chay ca hai script tren cung fixture va thay doi mau, trong khi suite khong co o nao ung voi chung. Bat ky vong va tiep theo nao cho vung block-list cung se lai lot cung cach.

**Chi tiết:** AC-1 doi 'do theo BANG hinh dang khai bao', truc C liet ke 'block list' nhu MOT gia tri — nhung block list co it nhat 3 bien the phan biet duoc bang code path (item sau hon / item ngang bang / khoa co chu thich duoi), cong inline nhieu dong va CRLF. De nghi nhan bang voi truc 'bien the cu phap', moi o kem doi chung duong nhu UJ1x/UJ1y da lam dung, va them mot o co dinh khoa cha (`approvers:` ngoai `signoff:` KHONG duoc dung).

#### [HIGH] trong hợp đồng — Mutant chết giữa chừng dưới `set -u` thoát 0 — `bash -n` không thể thấy, guard nhận (xanh giả M1)
**Kịch bản fail:** Một bộ lọc sinh mutant lỡ NUỐT một dòng khởi tạo (awk `next` quên `print`, hoặc `sed` địa chỉ quá rộng). Đo thật: `sed "/^violations=0$/d" scripts/pre-merge-check.sh` → bản sao 993/994 dòng (nằm TRONG dung sai 3 dòng), không rỗng, `bash -n` SẠCH → `uj_mut_usable` trả 0 (ACCEPTED). Chạy trên fixture `ujm_sig`: script IN ĐÚNG dòng `VIOLATION [feat-p]: human_signoff "PENDING" does not name any approver...` rồi chết ở `scripts/pre-merge-check.sh:757` với `violations: unbound variable` và **thoát 0** (bash: lỗi số học dưới `set -u` giữ mã thoát của lệnh trước). `uj_mut` chỉ đọc mã thoát → `check "UJ14-sig" 0 0` → PASS. Nhánh định vô hiệu chưa bao giờ được vô hiệu; cổng vẫn đang phản đối, nhưng UJ14 báo xanh. Đây đúng là chế độ hỏng mà CHÍNH script bị đo ghi ở dòng 40-45 ("script chết giữa chừng và thoát 0"), tức không phải giả định lý thuyết.

**Chi tiết:** `bash -n` chỉ kiểm CÚ PHÁP; nó không và không thể bắt cái chết runtime. Vì `pre-merge-check.sh` chỉ có `set -u` (KHÔNG `set -e`), mọi hỏng runtime đều có đường đi tới `exit 0`. Đối chứng đã chạy: bản nguyên vẹn cùng fixture rc=1. Kịch bản /tmp/adv/harness.sh.

#### [HIGH] trong hợp đồng — Vế thứ hai của AC-14 ("các case còn lại giữ nguyên màu") chưa được cài — không có đối chứng HÀNH VI nào sau khi tiêm
**Kịch bản fail:** `uj_mut` chỉ chạy mutant trên ĐÚNG MỘT fixture (`$3`) và chỉ hỏi "có thoát 0 không". Nó không bao giờ chạy mutant trên 5 fixture còn lại để đòi chúng VẪN ĐỎ. Hệ quả đo thật: mutant vô hiệu QUÁ TAY vẫn xanh — `sed "s|violations=\$((violations+1))|violations=\$((violations+0))|g"` (M3, đúng 994/994 dòng) và `sed "s|^  exit 1$|  exit 0|"` (M4, 994/994 dòng) đều qua cả ba điều kiện của `uj_mut_usable` và cho rc=0 → `UJ14-*` PASS, trong khi thứ bị vô hiệu là TOÀN BỘ cổng chứ không phải một nhánh. AC-14 viết rõ "Then ĐÚNG (các) case tương ứng ĐỎ **và các case còn lại giữ nguyên màu**"; vế in đậm là thứ duy nhất phân biệt "tiêm trúng một nhánh" với "giết cả cổng", và nó không tồn tại trong code. `uj_mut_usable` là phép đo HÌNH DẠNG file, không thay thế được phép đo ĐẶC HIỆU đó.

**Chi tiết:** Sửa đúng lớp: sau khi tiêm, chạy mutant trên các fixture KHÔNG thuộc nhánh bị tiêm và đòi exit != 0 (fixture đã có sẵn: UJM_SIG/BLK/NOC/FLD/CTR/CFG, và vòng UJ14ctrl đã chứng minh cả 6 đều đỏ trên bản nguyên vẹn). Phép đo đó bắt được cả M1, M2, M3, M4.

#### [MEDIUM] trong hợp đồng — Luật độ dài dùng `-ge` nên không chặn phía trên: bản sao DÀI hơn có `exit 0` sớm vẫn được nhận
**Kịch bản fail:** Bộ lọc kiểu chèn dòng (đúng hình dạng awk của UJ14b: `print "...if...then"` + `print "fi"`) nếu bám nhầm neo sẽ sinh file DÀI hơn bản gốc mà vẫn hợp cú pháp. Đo thật (M2): `{ echo "exit 0"; cat "$CHECK"; }` → 995/994 dòng, không rỗng, `bash -n` sạch → ACCEPTED, chạy trên fixture ra rc=0 → `UJ14-*` PASS trong khi bản sao không chạy một luật nào. Điều kiện `[ $(wc -l) -ge $((N-3)) ]` chỉ chặn hướng NGẮN đi; mọi hình dạng "ghi thêm" đi lọt hoàn toàn.

**Chi tiết:** Cùng gốc với finding trên: đo kích thước không phải đo hành vi. Một khoảng `[N-3, N+k]` cũng không cứu được M3/M4 (đúng bằng N).

#### [MEDIUM] ngoài hợp đồng — UJ14g không ghim NGƯỠNG của luật độ dài — guard bị làm yếu tuỳ ý vẫn xanh cả 4 assertion
**Kịch bản fail:** Thay `-ge $(( $(wc -l < "$CHECK") - 3 ))` bằng `-ge 21` rồi chạy nguyên văn 4 assertion của UJ14g: PASS=4 FAIL=0 (rỗng bị từ chối, bản nguyên vẹn được nhận, `head -20` bị từ chối vì 20 < 21, lỗi cú pháp bị từ chối). Nhưng guard đã-làm-yếu đó NHẬN `head -30 "$CHECK"` (30/994 dòng) và bản 30 dòng ấy chạy trên fixture ra rc=0 → xanh giả. Nghĩa là UJ14g chỉ chứng minh "có một ngưỡng nào đó > 20", không chứng minh ngưỡng bám vào kích thước bản gốc; nó không phân biệt được guard đủ mạnh với guard chỉ mang tính danh nghĩa. Fixture âm duy nhất (`head -20`) cách biên N-3 tới 971 dòng.

**Chi tiết:** Đã xác nhận `head -20 "$CHECK"` thật sự qua `bash -n` (rc=0), nên UJ14g-cut đúng là đang thử luật độ dài chứ không phải luật cú pháp — vấn đề chỉ là nó thử ở điểm quá xa biên. Muốn ghim: thêm ô ÂM ở đúng biên (N-4 dòng phải bị từ chối) và ô DƯƠNG ở N-3.

#### [HIGH] trong hợp đồng — awk `ind <= keyind` rejects a valid YAML block sequence at the same indent as `approvers:` — was clean before, now a hard merge block
**Kịch bản fail:** A consuming repo writes `signoff:` / `  approvers:` / `  - "Manh Phan"` (block sequence at indent 2, same as the key — valid YAML, accepted by PyYAML and by the pre-303508a script) and signs evidence `human_signoff: Manh Phan 2026-06-20`. Before the delta: exit 0, `pre-merge-check: clean`. After the delta: seen=1, keyind=2, the item line has ind=2 so `ind <= keyind` fires `exit`, APPROVERS is empty, APPROVERS_DECLARED=true → `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name` and exit 1. A correctly signed, correctly configured PR is blocked, and the remedy the message prints is the config the repo already has.

**Chi tiết:** scripts/pre-merge-check.sh:306 (and the identical mirror plugins/acceptance-gate/scripts/pre-merge-check.sh). The new awk treats "deeper indent" as the only membership rule, but YAML block sequences are legally written at the SAME indentation as their parent key. PyYAML confirms `signoff:\n  approvers:\n  - "Manh Phan"\n  require_human_commit: true` parses to `{'signoff': {'approvers': ['Manh Phan'], ...}}`. The old sed range (`/approvers:/,/^  [a-zA-Z0-9_-]*:/`) accepted this shape because `  - "Manh Phan"` does not match the terminator regex. Measured directly: old script (1da6cf6) exit 0 `pre-merge-check: clean`; new script (303508a) exit 1 `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name`. Positive controls on the same harness stay green in BOTH versions: 4-space block list (1 name and 2 names) and inline flow. This is exactly the fail-closed-SAI mode AC-1 names as the mode that makes consumers remove the rule — and the violation text tells the operator to "Write it as ... a YAML block list", which is what they already did.

#### [HIGH] trong hợp đồng — The trailing-comment bug was moved, not fixed: `approvers:  # note` no longer opens the block region, so a previously-clean config now VIOLATES
**Kịch bản fail:** A repo follows the kit's own acceptance-init template, keeps the explanatory trailing comment, and switches to a multi-name block list: `  approvers:            # who may sign` followed by `    - "Manh Phan"`. ap_raw = "" after comment stripping → block branch; the awk start regex requires `approvers:` followed only by whitespace to EOL, so the commented key line does not match, seen stays 0, awk prints nothing, APPROVERS="" while APPROVERS_DECLARED=true → VIOLATION [config] and exit 1 on a config that exited 0 at 1da6cf6 and at every earlier version.

**Chi tiết:** scripts/pre-merge-check.sh:299. The start pattern is `/^[[:space:]]*approvers:[[:space:]]*$/` — it requires a BARE key line. The commit message says v1 was wrong because it demanded a bare key at the END boundary (`agent_authors:   # OPTIONAL …`); the fix hardens the end boundary with indentation but reintroduces the identical bare-key assumption at the START boundary. `ap_raw` strips the trailing comment and is therefore empty, so control reaches the block branch; awk then never sets `seen`, so APPROVERS is empty. Measured: config `  approvers:            # ai duoc ky` / `    - "Manh Phan"` → old exit 0 `clean`, new exit 1 `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name`. PyYAML parses the same text as `{'signoff': {'approvers': ['Manh Phan']}}`. Note the kit's own template (commands/acceptance-init.md:64) ships the approvers line WITH a trailing comment (`approvers: ["<from 2f>"]   # approvers: enforced — …`), so a repo that keeps that comment while converting to block-list style lands straight in this hole. No test in the delta covers it: UJ1_BLOCK, uj1x, uj1y, uj1z all use a bare `approvers:` key with 4-space items.

#### [LOW] ngoài hợp đồng — `agent_authors` was left on the old sed and still swallows the next indent-0 key's list — the same class the commit claims to have closed
**Kịch bản fail:** A repo puts `signoff.agent_authors` as the last key of the signoff block and follows it with any top-level key that owns a list (e.g. `baseline_minutes:` / `  - 90`). The sed terminator requires a 2-space-indented key, never matches the indent-0 key, runs to EOF, and pulls `90` into AGENT_AUTHORS — the agent-author blocklist now contains a number, and any later blocklist glob comparison is done against polluted data.

**Chi tiết:** scripts/pre-merge-check.sh:264 still uses `sed -n '/^  agent_authors:/,/^  [a-zA-Z0-9_-]*:/p'`. Reproduced directly on that pipeline with config `  agent_authors:` / `    - "bot@corp.com"` / `baseline_minutes:` / `  - 90`: output is `bot@corp.com` and `90`. This is not a regression introduced by the delta (the line is untouched), but the commit subject asserts the block-list region class is now bounded by indentation, and UJ1y pins that rule for approvers only. Impact is mild here (spurious extra entries in a blocklist, fail-closed direction), which is why it is low, not a refutation on its own.


---

## Vòng gia cố LẦN 2 — 2026-07-28, delta `1da6cf6..21f6623` (đường A: rút phạm vi)
**Machine lane ở HEAD: 5/5 xanh** (621 case). **Refute: 3/3 góc BÁC BỎ.** 15 finding · 7 trong hợp đồng · 4 HIGH · 6 hồi quy.

### Kết luận: lần thử thứ TƯ cũng hỏng, và lại thêm một hồi quy
Ba finding nặng nhất đã được tác giả tự tái hiện bằng tay:

| hình dạng YAML hợp lệ | 1da6cf6 | 303508a | 21f6623 |
|---|---|---|---|
| `approvers: ["Nguyen, Van A"]` — dấu phẩy TRONG nháy, người lạ ký | lọt | lọt | **lọt** |
| `signoff: {…}` flow mapping — khai rồi mà cổng coi như chưa khai | — | — | **lọt** |
| `signoff :` (khoảng trắng trước dấu hai chấm), người ngoài ký | chặn | chặn | **lọt** ← hồi quy |

Dừng ở đây theo cam kết: không vá lần thứ năm. Quyết định tiếp thuộc về người duyệt.

#### [HIGH · trong hợp đồng] Dấu phẩy BÊN TRONG dấu nháy tách một tên thành nhiều tiền tố được chấp nhận (fail-open)
**Kịch bản fail:** Config: `signoff: / required_for: [T2, T3] / approvers: ["Nguyen, Van A"] / require_human_commit: false`. Một người KHÁC ký `human_signoff: Nguyen Thi B 2026-06-20` (hoặc `Van A Tran 2026-06-20`). Chạy `bash scripts/pre-merge-check.sh <repo>` → in `OK [feat-ok]: PASS, signed off by Nguyen Thi B 2026-06-20` + `pre-merge-check: clean`, exit 0. Mong đợi: VIOLATION + exit != 0 (AC-2).

**Chi tiết:** scripts/pre-merge-check.sh:300 dùng `tr ',' '\n'` trên toàn bộ giá trị inline rồi mới bóc nháy, nên nó không biết dấu phẩy nào nằm trong chuỗi trích dẫn. `approvers: ["Nguyen, Van A"]` — một danh sách inline MỘT DÒNG hoàn toàn hợp lệ — bị tách thành HAI mục `Nguyen` và `Van A`, mỗi mục sau đó được `signoff_names_approver` khớp theo tiền tố độc lập. Allowlist tự nở ra hai tên chưa ai khai. Đây chính là mệnh đề cần bác bỏ: bộ tách inline KHÔNG đọc đúng mọi danh sách inline hợp lệ. Đo sống trên fixture /tmp, có đối chứng dương (`Nguyen, Van A 2026-06-20` → clean/0) và đối chứng âm (`Random Person` → VIOLATION/1). Cùng hành vi ở 1da6cf6 và 303508a nên không phải hồi quy, nhưng 21f6623 tuyên bố đã rút phạm vi về "một dạng đọc đúng" — tuyên bố đó sai ngay trên dạng duy nhất còn được hỗ trợ.

#### [HIGH · trong hợp đồng] Neo vào khối signoff: cấp-0 KHÔNG đóng lỗ khoá-khác — chỉ dời nó vào trong một cấp
**Kịch bản fail:** Config: `signoff:` → `notify:` → `approvers: ["ci-bot@corp.com"]` → rồi `approvers: ["Manh Phan"]`. Bot ký `human_signoff: ci-bot@corp.com 2026-06-20` → `OK [feat-ok]: PASS, signed off by ci-bot@corp.com` + clean, exit 0. Cùng config, người duyệt thật ký `Manh Phan 2026-06-20` → VIOLATION "does not name any approver declared in signoff.approvers", exit 1. Y hệt với block scalar `policy: |` chứa `approvers: ["ghost@old"]`.

**Chi tiết:** awk ở scripts/pre-merge-check.sh:282-286 cắt đúng khối `signoff:` cấp-0, nhưng bên trong khối thì grep/sed (287-289) vẫn là `^[[:space:]]*approvers:` + `head -1`, không hề kiểm ĐỘ SÂU. Mọi `approvers:` lồng sâu hơn — kể cả nội dung của một block scalar tài liệu — đều là ứng viên, và mục xuất hiện TRƯỚC thắng. Hai hình dạng đo sống, cả hai đều cho tên lạ ký được VÀ chặn nhầm người duyệt thật: (a) `signoff.notify.approvers: ["ci-bot@corp.com"]` đặt trước `signoff.approvers: ["Manh Phan"]`; (b) `signoff.policy: |` chứa dòng ví dụ `approvers: ["ghost@old"]`. Hình dạng (b) chính là ví dụ AC-1c gọi tên đích danh ("một ví dụ nằm trong block-scalar tài liệu") — bản vá chỉ đóng biến thể đặt ở cấp-0, biến thể đặt trong khối signoff vẫn nguyên. Commit message tự mô tả lỗ này là "đã đóng"; nó chưa.

#### [HIGH · trong hợp đồng] `signoff:` viết dạng flow mapping làm khai báo approvers TÀNG HÌNH — âm thầm tụt xuống lưới giữ-chỗ tiếng Anh
**Kịch bản fail:** Config 2 dòng: `schema_version: 1` / `signoff: {required_for: [T2, T3], approvers: ["Manh Phan"]}`. Chữ ký giữ-chỗ tiếng Việt `human_signoff: Chờ Manh gật đã` → `OK [feat-ok]: PASS, signed off by Chờ Manh gật đã` + `pre-merge-check: clean`, exit 0. Đúng lớp lỗi feature này sinh ra để chặn, trên một repo đã khai approvers. Với `human_signoff: Random Outsider 2026-06-20` cũng clean/0.

**Chi tiết:** Regex neo khối là `/^signoff:[[:space:]]*(#.*)?$/` (scripts/pre-merge-check.sh:283), đòi dòng `signoff:` phải TRỐNG sau dấu hai chấm. Với `signoff: {required_for: [T2, T3], approvers: ["Manh Phan"]}` — YAML hợp lệ — awk không vào khối, `$ap_block` rỗng, `APPROVERS_DECLARED` không bao giờ được đặt. Không có VIOLATION [config], không có tín hiệu nào: cổng rơi thẳng xuống nhánh "không khai" và chỉ còn `placeholder_signoff` (chỉ biết mẫu tiếng Anh). AC-4 cấm đúng việc này ("KHÔNG được âm thầm tụt xuống nhánh không-khai"), và thông điệp VIOLATION [config] ở dòng 309 tự khai mục đích của nó là chặn "silently downgrade signature checking to the placeholder net" — đây là đường đi qua được mục đích đó. Kèm hệ quả tự mâu thuẫn: khi chữ ký là `PENDING`, cổng khuyên "signoff.approvers is not declared — Consider declaring signoff.approvers" trong khi người vận hành ĐÃ khai.

#### [MEDIUM · trong hợp đồng · HỒI QUY] HỒI QUY: `signoff :` (khoảng trắng trước dấu hai chấm) làm mất hẳn việc kiểm approvers
**Kịch bản fail:** Config: `schema_version: 1` / `signoff :` / `  required_for: [T2, T3]` / `  approvers: ["Manh Phan"]` / `  require_human_commit: false`. Người ngoài ký `human_signoff: Random Outsider 2026-06-20`. 1da6cf6 và 303508a: VIOLATION + exit 1. 21f6623 (HEAD): `OK [feat-ok]: PASS, signed off by Random Outsider 2026-06-20` + clean, exit 0.

**Chi tiết:** `signoff :` là khoá mapping hợp lệ trong YAML (khoảng trắng trước `:` được phép). Ở 1da6cf6 và 303508a, việc dò `approvers:` chạy trên TOÀN file nên vẫn tìm thấy và cưỡng chế đúng. Ở 21f6623, neo cấp-0 `/^signoff:.../` trượt, `APPROVERS_DECLARED` = false, cổng im lặng tụt xuống lưới giữ-chỗ. Đo song song ba bản trên cùng fixture: v1 = VIOLATION/exit 1, v2 = VIOLATION/exit 1, HEAD = clean/exit 0. Đây là hình dạng thứ ba trong chuỗi "vá xong lại chặn nhầm/mở nhầm một hình dạng YAML hợp lệ mới" mà chính commit message tuyên bố đã chấm dứt bằng cách đổi công cụ.

#### [MEDIUM · trong hợp đồng] Thông điệp VIOLATION [config] mới chỉ đường SAI trên chính các dạng inline-một-dòng
**Kịch bản fail:** Config `signoff:` / `approvers: []` (hoặc `approvers: ["Manh #1"]`), chữ ký `Manh Phan 2026-06-20`. Output: `VIOLATION [config]: signoff.approvers is declared but this gate reads only the single-line inline form — write it as signoff.approvers: ["Name One", "Name Two"] on ONE line...`. Người vận hành đọc, thấy mình đã viết đúng một dòng inline, không biết phải sửa gì.

**Chi tiết:** Thông điệp ở scripts/pre-merge-check.sh:309 giả định mọi lần từ chối đều do người dùng viết block list / flow xuống dòng, nên nó bảo "write it as signoff.approvers: [\"Name One\", \"Name Two\"] on ONE line". Nhưng hai dạng ĐÃ ở đúng dạng inline-một-dòng vẫn rơi vào đây: (a) `approvers: []` — allowlist rỗng cố ý; (b) `approvers: ["Manh #1"]` — `#` bên trong chuỗi nháy kép KHÔNG phải chú thích YAML, nhưng bước cắt chú thích ở dòng 289-290 xén thành `["Manh` nên `case \[*\])` trượt. Cả hai fail-CLOSED (không có rủi ro cổng thủng), nhưng người vận hành được bảo đi làm đúng việc họ vừa làm — đúng phản-mẫu mà comment ở dòng 759-762 của chính file này lên án, và AC-15 đòi thông điệp nói được HÀNH ĐỘNG tiếp theo. Bản trước (1da6cf6) nói chính xác hơn cho ca `[]`: "declared but resolves to no approver name".

#### [LOW · ngoài hợp đồng] Hợp đồng cú pháp vừa bị rút KHÔNG được ghi vào tài liệu onboarding mà người vận hành đọc trước
**Kịch bản fail:** Người vận hành repo mới chạy /acceptance-init, làm theo mẫu, viết approvers dạng block list (`approvers:` rồi `  - "Manh Phan"`) vì tài liệu không cấm. Lần chạy pre-merge đầu tiên trong CI đỏ với VIOLATION [config] mà không tài liệu nào của kit nhắc tới ràng buộc một-dòng.

**Chi tiết:** 21f6623 đổi hợp đồng runtime (chỉ inline một dòng) nhưng không chạm tài liệu: /Users/manh-macmini/dev/acceptance-gate-kit/commands/acceptance-init.md:64-70 vẫn chỉ nói "approvers: enforced" + "Declaring it EMPTY is an error", không một chữ nào về việc block list bị từ chối; hai bản mirror plugins/acceptance-gate/skills/acceptance-init/SKILL.md:72 và codex/acceptance-gate/skills/acceptance-init/SKILL.md:72 cũng vậy. Ràng buộc mới chỉ tồn tại trong một dòng lỗi runtime. Một repo mới viết block list (dạng YAML phổ biến nhất cho danh sách) sẽ đỏ ở CI mà tài liệu wire cổng không hề báo trước.

#### [MEDIUM · ngoài hợp đồng] approvers cua khoa LONG trong signoff: van tro thanh allowlist ky (neo cap-0 khong chan duoc)
**Kịch bản fail:** config.yaml:
```
signoff:
  required_for: [T2, T3]
  by_tier:
    T3:
      approvers: ["ci-bot@corp.com"]
  approvers: ["Manh Phan"]
```
evidence-report.md: `human_signoff: ci-bot@corp.com 2026-07-29`.
Chay `scripts/pre-merge-check.sh <repo>` -> `pre-merge-check: clean`, exit 0, in `OK [demo]: PASS, signed off by ci-bot@corp.com 2026-07-29`. Nguoc lai, doi chu ky thanh `Manh Phan 2026-07-29` -> `VIOLATION [demo]: ... does not name any approver declared in signoff.approvers`, exit 1. Dung mot cap bot-qua / nguoi-that-bi-chan y het hinh dang ma commit message tuyen bo da dong.

**Chi tiết:** awk chi neo BIEN cua khoi signoff: cap-0; ben trong khoi no van `sed ... | head -1` tren MOI dong khop `^[[:space:]]*approvers:`, khong phan biet do sau. Bat ky khoa long nao trong signoff (by_tier, notify, escalation, hay mot `note: |` block-scalar chua vi du `approvers: [...]`) ma dung TRUOC dong approvers that se nuot allowlist. Da do luon ban block-scalar-trong-signoff: cung ket qua (bot qua / nguoi that bi chan).

AC-1c chi noi "khoa cap-0 KHAC" va ket luan "cong chi doc approvers ben trong khoi signoff:" — theo nguyen van thi hanh vi nay THOA AC, nen 21 eval khong the bat. Suite hien tai (tests/scripts/run-tests.sh:2848-2864, UJ1c) chi dung `notifications:` cap-0.

Huong NGUOC da kiem sach: config that cua chinh repo (_acceptance/config.yaml) va tests/hooks/fixtures/repo/_acceptance/config.yaml deu rut dung `["Manh Phan"]`; doi chung duong (inline 2 ten, ky bang ten 1 va ten 2) xanh; 9 hinh dang duoc yeu cau kiem — chu thich duoi signoff, signoff co chu thich duoi, signoff la khoa CUOI, khoa cap-0 sau signoff bat dau bang so, dong trong + chu thich cap-0 xen giua, CRLF, thut 4 space, chuoi "signoff:" trong block-scalar cua khoa cap-0 KHAC — deu doc dung.

#### [MEDIUM · ngoài hợp đồng · HỒI QUY] Khoa signoff viet bang mot dang YAML hop le khac -> cong AM THAM bo qua allowlist, khong con VIOLATION (hoi quy vs 1da6cf6)
**Kịch bản fail:** config.yaml:
```
signoff :
  approvers: ["Manh Phan"]
```
(hoac `"signoff":` khoa co nhay, hoac `signoff: {required_for: [T2, T3], approvers: ["Manh Phan"]}` — ca ba deu la YAML hop le).
evidence-report.md: `human_signoff: ci-bot 2026-07-29`.
21f6623 -> `pre-merge-check: clean`, exit 0, `OK [demo]: PASS, signed off by ci-bot 2026-07-29`.
1da6cf6 tren CUNG file -> `VIOLATION [demo]: ... does not name any approver declared in signoff.approvers`, exit 1.
Do la XANH o 1da6cf6, DO o 21f6623.

**Chi tiết:** Regex neo `/^signoff:[[:space:]]*(#.*)?$/` doi dung nguyen van `signoff:` o cot 0. Moi bien the hop le khac lam `ap_block` rong -> `APPROVERS_DECLARED` rong -> cong khong he kiem chu ky, tut xuong luoi den tieng Anh, va vi "ci-bot" khong phai placeholder nen KHONG in ca NOTE lan VIOLATION. Day dung la lop "doc nham/bo qua AM THAM" ma commit tuyen bo da xoa: bay gio no khong doc nham nua, no im lang KHONG DOC — va khong co dong nao noi cho nguoi van hanh biet allowlist ho vua khai dang bi lo. Xac suat go tay thap, nhung huong that bai la fail-open va 1da6cf6 truoc do bat duoc.

#### [LOW · ngoài hợp đồng] HAI khoi `signoff:` -> cong doc khoi DAU, moi parser YAML lay khoi CUOI
**Kịch bản fail:** config.yaml:
```
signoff:
  approvers: ["ci-bot"]
other:
  x: 1
signoff:
  approvers: ["Manh Phan"]
```
`human_signoff: ci-bot 2026-07-29` -> exit 0, `OK [demo]: PASS, signed off by ci-bot`. Doi thanh `Manh Phan 2026-07-29` -> VIOLATION, exit 1. awk `exit` ngay khi gap khoa cap-0 ke tiep nen chi thay khoi DAU, trong khi PyYAML/serializer thong thuong lay khoi CUOI (js-yaml v4 thi nem loi trung khoa). Gia tri cong DUNG khac gia tri config CO NGHIA.

**Chi tiết:** Khoa trung o cap-0 la YAML khong hop le theo spec nen muc do thap; ghi lai vi user hoi dich danh, va vi khong co eval nao ghim huong nay.

#### [LOW · trong hợp đồng · HỒI QUY] Block list approvers (dang YAML thuan tay) tu XANH thanh VIOLATION cung — pha config consumer da co
**Kịch bản fail:** config.yaml:
```
signoff:
  approvers:
    - "Manh Phan"
```
`human_signoff: Manh Phan 2026-07-29`. 1da6cf6 -> exit 0, `OK [demo]: PASS, signed off by Manh Phan`. 21f6623 -> exit 1, `VIOLATION [config]: signoff.approvers is declared but this gate reads only the single-line inline form ...` + `NOTE [demo]: signature NOT checked ...`. Moi repo tieu thu dang khai approvers bang block list (dang idiomatic, va tu 1.23.0 tro ve truoc khoa nay chi la trang tri nen khong ai bi ep viet inline) se bi chan MOI PR cho toi khi sua config.

**Chi tiết:** Day la RUT PHAM VI co chu dinh, khai ro o AC-1b va o thong diep VIOLATION (co vi du viet lai), nen khong phai lo hong — ghi lai vi no la thay doi hanh vi pha vo tuong thich nguoc doi voi consumer, khong chi la thay doi noi bo. Doi chung: chinh AC-1 ban 1da6cf6 tung doi bang {inline, block list} x {ten 1, ten 2} = 4 o xanh, tuc kit tung coi block list la hop le.

#### [HIGH · ngoài hợp đồng · HỒI QUY] Fail-open MỚI: `approvers:` nằm ngoài khối `signoff:` cấp-0 → gate im lặng coi như KHÔNG khai, chữ ký giữ-chỗ đi qua `clean` exit 0
**Kịch bản fail:** Fixture /private/tmp/claude-501/-Users-manh-macmini-dev-acceptance-gate-kit/41f8b0c3-758f-42a8-bec8-76a25c35fdd6/scratchpad/refute/fx2/p1_toplevel — config.yaml có `approvers: ["Manh Phan"]` ở cấp-0 (đặt sai chỗ) và khối `signoff:` không có approvers; evidence-report.md có `human_signoff: Cho duyet 2026-06-20`. 1da6cf6 và 303508a: `VIOLATION [feat-ok]: human_signoff "Cho duyet 2026-06-20" does not name any approver declared in signoff.approvers` + exit 1. 21f6623: `OK [feat-ok]: PASS, signed off by Cho duyet 2026-06-20` + `pre-merge-check: clean` + exit 0, và KHÔNG một dòng NOTE/VIOLATION nào nói rằng allowlist đã bị bỏ qua. Cùng kết quả với fixture fx2/p3_spacecolon (`signoff :` có khoảng trắng trước dấu hai chấm — YAML hợp lệ, awk `/^signoff:[[:space:]]*(#.*)?$/` không khớp). Chạy lại: bash /private/tmp/.../scratchpad/refute/probe2.sh

**Chi tiết:** Việc neo vào khối `signoff:` cấp-0 (scripts/pre-merge-check.sh:282-287) làm mọi `approvers:` đặt sai chỗ trở nên VÔ HÌNH: APPROVERS_DECLARED rỗng → không VIOLATION [config], không NOTE, chữ ký chỉ còn đối mặt lưới đen tiếng Anh (và NOTE khuyên khai approvers cũng không in vì lưới đen không nổ). Đây đúng lớp lỗi feature sinh ra để chặn, và vi phạm doctrine AC-4 'khai-mà-vô-dụng là lỗi, không được âm thầm tụt xuống nhánh không-khai'. Không AC nào phủ: AC-1c giả định signoff.approvers CŨNG tồn tại, AC-4 chỉ phủ signoff.approvers khai-mà-rỗng, AC-5 giả định file không có key. Suite 621 case (0 fail) không có case hình dạng này. Sửa rẻ: nếu file có dòng `approvers:` bất kỳ mà khối signoff cấp-0 không có → một dòng VIOLATION [config] nói approvers nằm sai chỗ.

#### [MEDIUM · ngoài hợp đồng · HỒI QUY] `continue` ở nhánh NOTE 'signature NOT checked' nuốt trọn các luật per-slug ĐỘC LẬP (agent_authors, require_human_commit, stale-evidence, recheck strict)
**Kịch bản fail:** Fixture .../scratchpad/refute/fx2/p4_multi — config block-list + `require_human_commit: true` + `agent_authors: ["*[bot]*"]`, chữ ký `Manh Phan 2026-06-20` nằm trong commit tác giả `claude[bot]@x.io`, evidence khai `exit_code: 1` với recheck strict. 1da6cf6/303508a: `VIOLATION [feat-ok]: signoff commit <sha> authored by "claude[bot]@x.io" — matches signoff.agent_authors blocklist (*[bot]*)`. 21f6623: chỉ `VIOLATION [config]` + `NOTE [feat-ok]: signature NOT checked` — dòng bot-ký, staleness, và recheck KHÔNG bao giờ chạy.

**Chi tiết:** scripts/pre-merge-check.sh:750-756 in NOTE rồi `continue`, bỏ phần còn lại của vòng slug. Các luật bị bỏ không phụ thuộc vào việc đọc được approvers. Lần chạy vẫn exit 1 (nhánh NOTE luôn đi kèm VIOLATION [config]) nên KHÔNG phải lỗ thủng, nhưng danh sách violation không đầy đủ: người vận hành sửa config, chạy lại mới đụng bức tường thứ hai, và báo cáo một lần chạy có vẻ 'chỉ lỗi config' trong khi evidence có thể đã stale hoặc chữ ký do bot commit. Sửa: bỏ `continue`, dùng một cờ để chỉ chặn đúng dòng `OK [...] signed off by ...` cuối vòng.

#### [MEDIUM · trong hợp đồng · HỒI QUY] Block list YAML hợp lệ từng chạy ĐÚNG ở 1da6cf6 (và ở 303508a với dạng thụt sâu/cuối file) nay bị chặn merge
**Kịch bản fail:** Fixture .../scratchpad/refute/fx/p5_two (2 slug, `approvers:` block list thụt sâu, cả hai chữ ký = 'Manh Phan 2026-06-20'): 1da6cf6 và 303508a → 2 dòng `OK [...]` + `pre-merge-check: clean` + exit 0. 21f6623 → `VIOLATION [config]` + 2 dòng NOTE 'signature NOT checked', 0 dòng OK, exit 1. Tương tự fx/c2_block và fx/c5_eof (cả hai bản cũ đều xanh). Repo tiêu thụ đang khai block list — dạng mà thông điệp lỗi của chính 1da6cf6 khuyên dùng ('or a YAML block list') — sẽ đỏ ngay sau khi nâng kit dù chữ ký hợp lệ.

**Chi tiết:** Đây là cắt phạm vi có chủ đích (AC-1b) nên inContract=true, nhưng vẫn là mất hành vi đúng theo đúng câu hỏi đặt ra. Blast radius thật hẹp: `bash scripts/pre-merge-check.sh . --base e290aac` cho output GIỐNG HỆT ở cả ba bản (5 violation stale/PENDING-JUDGMENT, `pre-merge-check: rules ran=3 declared-off=0 expected=3`), và đối chứng dương/âm trên chính config của kit vẫn đúng (chữ ký 'Manh Phan' → OK exit 0; 'Nguoi La' → VIOLATION exit 1 ở cả ba bản). Nhưng KHÔNG tài liệu nào (GUIDE.md, README.md, QUICKSTART.md, commands/acceptance-init.md:64) nói ràng buộc 'một dòng' — người dùng chỉ biết sau khi bị chặn. Nên thêm câu đó vào marker `# approvers: enforced —` ở acceptance-init.

#### [LOW · ngoài hợp đồng] Lỗ 'approvers của khoá KHÁC' chưa đóng hẳn: một map CON bên trong `signoff:` vẫn cướp allowlist
**Kịch bản fail:** Fixture .../scratchpad/refute/fx2/p2_nested — khối `signoff:` chứa `notify:` rồi `    approvers: ["ci-bot"]` đứng TRƯỚC `  approvers: ["Manh Phan"]`. Với chữ ký `ci-bot 2026-06-20`: CẢ BA bản in `OK [feat-ok]: PASS, signed off by ci-bot 2026-06-20` + clean + exit 0. Với fixture p2b_nested_real (chữ ký người duyệt thật `Manh Phan 2026-06-20`): CẢ BA bản VIOLATION + exit 1 — đúng cặp triệu chứng mà commit message tuyên bố đã chữa, chỉ sâu hơn một tầng.

**Chi tiết:** `sed -n 's/^[[:space:]]*approvers:...//p' | head -1` (scripts/pre-merge-check.sh:289) lấy dòng approvers ĐẦU TIÊN trong khối signoff bất kể độ sâu. Không phải hồi quy, nhưng bác bỏ mệnh đề 'khoá cấp-0 là ranh giới DUY NHẤT không mơ hồ' làm cơ sở cho quyết định neo. Sửa rẻ: chỉ nhận dòng approvers ở ĐÚNG mức thụt 2 khoảng trắng trong khối signoff.

#### [LOW · ngoài hợp đồng] Comment biện minh cho quyết định neo là sai sự thật (guard 2-space nằm DƯỚI chỗ phân tích, và không ép 2-space)
**Kịch bản fail:** scripts/pre-merge-check.sh:281 viết 'guard 2-space schema phía trên đã cưỡng chế indent'. Thực tế guard ở dòng 456 — DƯỚI khối phân tích (282-310) — và chỉ báo lỗi khi số khoảng trắng LẺ (`n % 2 == 1`), nên thụt 4 khoảng trắng vẫn qua guard. Không đổi hành vi (guard vẫn cộng violation trong cùng lần chạy), nhưng lý lẽ chống đỡ một quyết định thu hẹp phạm vi không đúng với mã. Đọc: sed -n '276,310p;450,470p' /Users/manh-macmini/dev/acceptance-gate-kit/scripts/pre-merge-check.sh

**Chi tiết:** Sửa bằng cách viết lại comment cho đúng vị trí/phạm vi guard, hoặc dời guard 2-space lên TRƯỚC khối đọc config nếu thật sự muốn nó là tiền đề. Đây là lớp 'comment giữ parity thay cho phép đo' mà CLAUDE.md đã cảnh báo.
