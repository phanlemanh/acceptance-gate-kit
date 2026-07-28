# premerge-unjudged-pass — chặn PASS chưa ai phán ở biên merge

**Ngày:** 2026-07-28 · **Slug:** `premerge-unjudged-pass` · **Tier:** T3 · **Làn:** D0

## Vấn đề

`scripts/pre-merge-check.sh` kết luận `clean` trên bốn hình dạng hồ sơ mà không
người nào từng phán. Cả bốn đo sống trên kit 1.23.0 hôm nay, có đối chứng dương
(hồ sơ đủ + chữ ký thật vẫn `OK … clean`, nên phép đo phân biệt được):

| # | Hình dạng | Cổng in ra |
|---|---|---|
| 1 | `human_signoff: PENDING — chờ Manh gật` | `OK [feat-x]: PASS, signed off by PENDING — cho Manh gat` → clean |
| 2 | `evidence-report.md` khai `verdict: PASS`, **không có** `contract.md` | không OK, không VIOLATION — slug tàng hình → clean |
| 3 | `contract.md` thiếu `risk_tier` (hoặc `status`) | tàng hình → clean |
| 4 | `contract.md` khai `status: signed-off`, thiếu `risk_tier`, **không có evidence nào** | tàng hình → clean |

Hình dạng 1 không phải đường tấn công mà là **đường đi bộ bình thường**: người
duyệt mở file định ký, gõ một dòng giữ chỗ trong lúc chờ, commit đúng nghi thức
human-fields-only. Đã kiểm riêng: với `signoff.require_human_commit: true` và
chữ ký nằm trong một commit người chỉ chạm dòng `human_signoff`, cổng **vẫn**
in `signed off by PENDING` rồi clean. `require_human_commit` kiểm *ai commit* và
*commit đó chạm dòng nào*, không kiểm *nội dung có phải một cái tên không* —
nên lỗ này có mặt ở cả cấu hình chặt nhất kit đang tự áp.

Hình dạng 2 và 3 đã gây thương tích thật ở repo tiêu thụ: incident 2026-07-20
(#255) — ba slug `shadcn-g3b-overlay`, `shadcn-g3c-chat`,
`core-inbox-master-detail` cưỡi CI xanh về main. artifact-platform tự vá cục bộ
sau đó (commit `b6cca00b`, ~62 dòng), **kit chưa bao giờ nhận về**. Đây là điểm
đáng lo nhất: kit là thứ phát cổng cho repo khác, nên một fail-open ở đây nhân
bản xuống mọi consumer, và lần này chính consumer phải tự băng bó sau khi bị
thương.

Hình dạng 4 là hình dạng **bản vá của consumer cũng không bắt được** — phát hiện
trong lúc thiết kế feature này. Nó là lý do ta không port nguyên văn.

## Không phải vấn đề ở đây

Giả mạo. Một agent gõ thẳng `human_signoff: Manh Phan` khi Manh chưa ký là một
threat model **khác**, do `require_human_commit` + `agent_authors` + hook lo.
Feature này chặn *thành thật-nhưng-chưa-xong*, không chặn *nói dối*. Ranh giới
đó phải nằm trong contract chứ không được thành kỳ vọng ngầm.

## Phương án đã cân nhắc

**A — Port nguyên văn 3 hunk của artifact-platform.** Rủi ro thấp nhất, mã đã
chạy thật nhiều tháng. Loại vì để nguyên hình dạng 4 mà ta vừa biết là có.

**C — Đảo mặc định: mọi thư mục trong `_acceptance/` phải giải trình.** Bắt hết
kể cả scaffold. Loại vì phá đúng nguyên tắc bản vá gốc dựng lên — *thiếu field ≠
khai báo, còn field có mặt nhưng ngoài phạm vi **là** khai báo và im lặng đúng
thiết kế* — và cái giá rơi lên consumer chứ không lên kit.

**B — Port + đổi vị ngữ kích hoạt (CHỌN).** Giữ kiến trúc 3 hunk, đổi câu hỏi
kích hoạt từ *"evidence có khai PASS không"* thành *"thư mục này có tự nhận đã
qua cổng không"*. Bắt cả bốn. Rẻ hơn A về dài hạn dù nhiều hơn vài dòng: nó sửa
**vị ngữ** chứ không thêm nhánh — A thì mỗi hình dạng mới là một nhánh mới, và
hình dạng 4 đã chứng minh danh sách nhánh sẽ còn dài ra.

## Thiết kế

### Vị ngữ chung

```sh
claims_released() {   # <dir> — 0 iff thư mục TỰ NHẬN đã qua cổng
  [ -f "$1/evidence-report.md" ] &&
    [ "$(fm_field "$1/evidence-report.md" verdict)" = "PASS" ] && return 0
  [ -f "$1/contract.md" ] && case "$(fm_field "$1/contract.md" status)" in
    implemented|verified|signed-off) return 0 ;;
  esac
  return 1
}
```

Dùng `fm_field` (bất kỳ dòng nào) chứ **không** `front_field` (chỉ frontmatter
dẫn đầu) là cố ý, kế thừa lý lẽ của bản gốc: đây là **bộ dò**, và doctrine của
cổng là *rộng-khi-dò / chặt-khi-nhận*. Một fence hỏng hoặc lệch không được phép
mua lấy sự vô hình — đó đúng là thứ đang cần bắt.

### Nhóm 1 — Tàng hình

Hai `continue` câm trong vòng per-slug trở thành có điều kiện:

| Vị trí | Hiện tại | Sau |
|---|---|---|
| `pre-merge-check.sh:451` | `[ -f "$contract" ] \|\| continue` | không contract **∧** `claims_released` → VIOLATION; ngược lại `continue` như cũ |
| `:456`, `:458` | `[ -n "$tier" ] \|\| continue`; `status` lạ rơi `*)` | thiếu `risk_tier` hoặc `status` **∧** `claims_released` → VIOLATION **nêu đích danh field thiếu** |

Hình dạng 4 được bắt chính nhờ nhánh `contract` của `claims_released`; bản port
gốc chỉ có nhánh `evidence`.

### Nhóm 2 — Chữ ký

Chèn sau chốt rỗng sẵn có (`:594`), giữ nguyên thứ tự: rỗng trước, luật mới sau.

```
approvers có ≥1 tên   → chữ ký phải BẮT ĐẦU bằng một tên, kế đó là hết chuỗi
                        hoặc ký tự không-chữ          ; trượt → VIOLATION
approvers khai, 0 tên → VIOLATION (khai-rồi-mà-vô-dụng)
approvers không khai  → lưới đen placeholder + NOTE khuyên khai
```

**Vì sao danh-sách-trắng chứ không danh-sách-đen.** Danh sách placeholder của
bản gốc toàn tiếng Anh (`pending*`, `tbd*`, `todo*`, `n/a*`, `none`, `unsigned*`,
`waiting*`, `>`, `|`, `-`, `<…`), trong khi repo này ký và viết bằng tiếng Việt —
"chờ Manh gật", "chưa ký", "đang chờ" đều lọt. Đuổi theo từng từ là trò không
bao giờ thắng và phụ thuộc ngôn ngữ. Đòi chữ ký **khớp một tên trong
`signoff.approvers`** thì "PENDING" trượt vì nó không phải "Manh Phan", bất kể
ngôn ngữ. Đây cũng là chuẩn của loại sản phẩm này: Gerrit gắn phê duyệt vào lá
phiếu có kiểu thuộc một tài khoản; GitHub CODEOWNERS gắn vào sự kiện review có
danh tính; in-toto/SLSA từ chối artifact vô danh. Không đâu coi phê duyệt là văn
bản tự do.

**Ranh giới khai/không khai.** `signoff.approvers` tới nay là **key trang trí** —
không chỗ nào trong kit đọc nó, và `commands/acceptance-init.md:64` ghi thẳng
`# informational in v1 (not yet machine-enforced)`. Biến nó thành luật là đổi
ngữ nghĩa một key đã công bố, nên biên phải theo đúng tiền lệ RL14 của chính
repo: *không khai* là bỏ-qua-có-tín-hiệu (rơi về lưới đen + NOTE), *khai mà
rỗng* là khai-rồi-mà-vô-dụng (VIOLATION). Mọi repo vẫn có sàn; repo chịu khai
thì được luật chặt.

Tách tên hỗ trợ cả `approvers: ["Manh Phan", "memto"]` (dạng `acceptance-init`
sinh, cả kit lẫn artifact-platform đang dùng) lẫn block list. Key có mặt mà tách
ra 0 tên — kể cả `[]` lẫn cú pháp hỏng — đều vào nhánh VIOLATION, để một config
gõ sai không âm thầm tụt xuống thành "không khai".

**Khớp kiểu tiền tố** vì chữ ký thật dẫn đầu bằng tên rồi tới ngày
(`Manh Phan 2026-07-28`), và `approvers: ["Manh"]` của artifact-platform vẫn nhận
`Manh Phan …` như họ có ý. Không đòi ngày — đó là ràng buộc mới ngoài phạm vi.

### Xử lý lỗi

Fail-closed ở chỗ đã khai, fail-open có tín hiệu ở chỗ chưa khai. Không thêm
đường thoát mới: mọi VIOLATION mới ra **stdout** (CI chỉ grep stdout), cộng vào
biến `violations`, và không đụng sổ luật-đã-chạy — `ran/declared-off/expected`
giữ nguyên `=3`.

Đã đo: `enforcement` off/warn/strict **không** hạ được luật per-slug ở biên merge
(cả ba đều chặn một violation sẵn có). Luật mới nằm cùng vòng lặp nên thừa hưởng
tính chất đó; AC-10 ghim lại để nó không trôi.

### Kiểm thử

Mười ô Core thành case tiền tố `UJ*` trong `tests/scripts/run-tests.sh`. Mỗi case
theo bất biến CLAUDE.md: **đối chứng dương trước** (bản nguyên vẹn phải XANH rồi
mới tin bản bị tiêm là ĐỎ) và **ghim thông điệp** chứ không chỉ mã thoát.

Thêm một lớp mà bốn hình dạng ở trên đòi hỏi: **mutation test cho chính bộ luật
mới** — vô hiệu từng nhánh trong một bản sao rồi xác nhận đúng case tương ứng
đỏ. Không có nó, mười case kia không phân biệt được "bắt đúng lỗi" với "chưa bao
giờ chạy".

### Ngoài code

`commands/acceptance-init.md:64` sau feature này thành lời nói dối, phải sửa —
cùng bản Codex nếu có. Rồi `scripts/sync-plugin-packages.sh` để mirror khỏi
drift (P30 chặn).

## Đã biết là không bắt được

- **Tên đúng kèm đuôi giữ-chỗ.** `Manh Phan — chưa duyệt, chờ họp` khớp
  `approvers: ["Manh Phan"]` và về `clean`. Phản biện context sạch (F4) nêu,
  người duyệt chốt NHẬN ở Cổng 1: gõ đúng tên mình là hành vi ký có ý thức,
  khác với để nguyên `PENDING` của template; còn siết bằng cách đòi phần sau
  tên chỉ được là ngày thì thực chất là ràng buộc định dạng ngày mà mục Out of
  scope đang nói KHÔNG làm, và sẽ đỏ trên chữ ký hợp lệ kiểu
  `Manh Phan 2026-07-28 (đã họp với team)`. Feature vì thế đóng hình dạng *chữ
  ký không phải tên người nào cả*, KHÔNG đóng *tên người kèm đuôi* — bằng chứng
  phải khai đúng chừng đó, không được ngụ ý rộng hơn.
- Giữ-chỗ tiếng Việt **khi repo không khai `approvers`** — lưới đen chỉ có mẫu
  tiếng Anh. Thuốc là khai `approvers`; NOTE sẽ nói đúng câu đó.
- `--slug` lọc trượt một slug hỏng thì slug đó không bị xét. Đúng thiết kế của
  cờ lọc, nhưng phải ghi ra.
- Giả mạo (gõ thẳng tên người duyệt) — threat model khác, xem mục "Không phải
  vấn đề ở đây".

## Kèm theo trong nhánh này

Nhánh `feat/premerge-unjudged-pass` đã gộp sẵn `fix/mk-gp-repo-sha-class`
(`6c30ffb`): `mk_gp_repo` trước đây dựng mọi fixture với cùng cây + cùng author +
cùng message nên sha base chỉ phụ thuộc dấu-thời-gian-giây — đo được ba lần gọi
liên tiếp ra y hệt một sha. Gộp vào đây để **một** vòng verify phủ cả hai thay vì
hai vòng, vì cả hai đều sửa `tests/scripts/run-tests.sh` và đều làm evidence của
bốn slug đã ký thành stale.
