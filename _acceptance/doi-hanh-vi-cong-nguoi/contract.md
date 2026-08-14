---
schema_version: 1
feature: Bốn lượt đổi hành vi ở cổng người — khối 👉 thôi làm luật mỗi-tin, T1 tuyên-kèm-căn-cứ, quét độ phủ thôi phỏng vấn, khởi tạo một-lần-gạch; lời hứa hành vi chấm bằng hội đồng bắt buộc
slug: doi-hanh-vi-cong-nguoi
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: skills/ · commands/ · feature-loop/ · tests/plugins/ — không dính t3_paths
surfaces: [cli]
status: approved
approved_by: Manh Phan
approved_at: 2026-08-14
---

# Acceptance Contract: doi-hanh-vi-cong-nguoi

## Context

Kit hiện chặn owner ở bốn chỗ không có gì để quyết: mọi tin — kể cả tin
chỉ-báo — phải đeo khối 👉 VIỆC CỦA ANH; kết luận T1 máy đã tự suy chắc chắn
vẫn dừng chờ một cái gật; quét độ phủ mở bằng một lượt phỏng vấn; khởi tạo hỏi
tuần tự từng câu. Bốn hạng mục này owner gạch từ 12/08, từng nằm trong đề bài
1a, và được **hoàn nguyên có chủ đích** khỏi nhánh đó sau ba vòng rà soát đối
kháng: lời hứa của chúng là *hành vi của một agent đọc văn chỉ dẫn*, và thước
chữ (grep) đã chứng minh không đo nổi thứ đó — 8 lượt phá thật đều xanh oan,
7/8 thuộc nhóm này, hai chân đo là hằng đúng. Hồ sơ này làm lại đúng bốn hạng
mục ấy với bộ thước ĐÚNG LOẠI: lớp máy chỉ nhận vai chứng **mực đã in**, lớp
hành vi chấm bằng **hội đồng phiên sạch** — và tại Cổng 0 (14/08) owner đã
quyết: **hội đồng là điều kiện BẮT BUỘC trước Cổng Bằng chứng**, không phải
khuyến nghị.

Source input: docs/plans/2026-08-14-hat-giong-1c-doi-hanh-vi-cong-nguoi.md
(trạng thái Cổng 0 ghi ở đầu file đó)

## Criteria

Bốn hạng mục × hai lớp thước (mực-đã-in / hành-vi), cộng một tiêu chí lưới kế
thừa. Lớp máy của mọi AC lẻ dưới đây dùng CHUNG bộ needle khai ở khối
`NEEDLE-1C` và mốc đối chứng ở `BASE-1C` cuối file — needle vắng trên cây đã
sửa **và** hiện >0 lần trên mốc base, đo bằng cùng một lệnh; cấm mọi phép «đo
quan hệ», «so tập câu», «đối chứng dương tự sinh» (ba câu đã chứng minh là
hằng đúng hoặc miễn trừ mất câu chịu lực ở hồ sơ 1a).

**Hạng mục 1 — khối 👉 thôi làm luật mỗi-tin.**

- AC-1: Given cây đã sửa, When quét nhóm needle `G1` trên các vật khai ở
  `VAT-1C`, Then 0 hit cho TỪNG needle, và bản luật ngôn ngữ mặt người chứa
  luật mới: khối 👉 chỉ sống ở **tin mời cổng** và **trên thẻ cổng**; tin
  chỉ-báo nói thẳng máy đang làm gì tiếp, không đeo khối. Điều khoản
  single-source đổi lời thì MỌI bản chép trong hai manifest
  (`GATE-INVITE-SITES`, `GATE-ONESHOT-SITES`) khớp nguyên văn bản mới, đủ số
  bản chép từng site.
- AC-2: Given một phiên sạch chỉ được đọc bản luật SAU sửa cùng một tình
  huống **tin chỉ-báo** (máy vừa xong một việc trung gian, chưa tới cổng),
  When phiên soạn tin cho người, Then tin nói thẳng máy đang làm gì tiếp và
  không kết bằng khối 👉; ca giữ-gân: cùng phiên nhận tình huống **tin mời
  cổng** thì tin PHẢI kết bằng đúng MỘT khối đủ ba vế. (judgment)

**Hạng mục 3 — quét độ phủ thôi phỏng vấn.**

- AC-5: Given cây đã sửa, When quét nhóm needle `G3`, Then 0 hit, và thang
  nguồn nhánh (b)/(c) của skill quét độ phủ chỉ dẫn: TỰ DỰNG Product
  Context, mỗi dòng gắn `[SUY-TỪ-REPO: <đường dẫn>]` hoặc `[GIẢ ĐỊNH]`, gom
  `[GIẢ ĐỊNH]`/`[NGÀNH]` vào mục Coverage của contract để người gạch MỘT
  lượt tại Cổng 1.
- AC-6: Given một phiên sạch chỉ được đọc skill quét độ phủ SAU sửa cùng một
  repo mẫu có đồ (glossary/schema/tài liệu đặc tả), When phiên chạy bước Product
  Context, Then phiên tự dựng bản nháp có nhãn nguồn từng dòng và không dừng
  phỏng vấn; ca giữ-gân: repo mẫu trắng (không truy được nguồn) thì dòng
  tương ứng mang `[GIẢ ĐỊNH]` chờ người gạch — phiên không bịa đường dẫn
  nguồn. (judgment)

**Hạng mục 4 — khởi tạo một-lần-gạch.**

- AC-7: Given cây đã sửa, When quét nhóm needle `G4`, Then 0 hit, và lệnh
  khởi tạo chỉ dẫn: dò repo TRƯỚC, trình TRỌN bản nháp `config.yaml` trong
  MỘT lượt, ô không suy được đánh dấu `# cần anh`.
- AC-8: Given một phiên sạch chỉ được đọc lệnh khởi tạo SAU sửa cùng một
  repo tiêu thụ mẫu chưa có config, When phiên chạy khởi tạo, Then phiên
  trình trọn bản nháp trong một lượt với ô `# cần anh` ở chỗ không suy được;
  ca giữ-gân: repo mẫu ĐÃ có `_acceptance/config.yaml` thì phiên hiện nó và
  DỪNG, không ghi đè. (judgment)

**Lưới kế thừa.**

- AC-9: Given cây đã sửa, When chạy đủ bốn suite (`scripts` · `hooks` ·
  `plugins` · `workflows`), Then cả bốn XANH; số ca khớp ĐẲNG THỨC bản khai
  máy-đọc `SO-CA-KY-VONG-1C` (không khai sàn); mọi assert chết vì hạng mục 1
  khai đích danh từng dòng trong `tests/plugins/asserts-da-go.txt`; và lời
  khai nói thẳng: bánh cóc P161 KHÔNG phủ được assert sinh sau mốc ghim
  `044968e` (06/08) — hợp đồng 1a từng tuyên ngược, đó là finding H8.

  **[SỬA SAU CỔNG 1 — 14/08, ghi TRƯỚC khi sửa vật, số đo lệch khỏi lời khai]**
  Bản duyệt tiên đoán «assert của P193, ba mục của P189» sẽ chết. Đo thật trên
  cây sửa: **0 assert chết**, nên `asserts-da-go.txt` KHÔNG có dòng mới và số
  ca giữ nguyên 146. Hai lý do, kiểm được:
  · P193 ghim chuỗi con `kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn
    YOUR-MOVE-BLOCK-TEMPLATE` — điều khoản một-lượt-gõ bản mới vẫn chứa nguyên
    chuỗi ấy (chỉ thêm chủ ngữ «tin mời cổng» phía trước), nên assert còn đúng.
  · P189 có ĐÚNG MỘT chân ghim lời cũ (`không cần làm gì`) chứ không phải ba;
    và lời hứa nó đo là *«bản luật CÓ luật cho tin chỉ-báo»*, lời hứa đó KHÔNG
    chết — chỉ nội dung luật đổi. Nên xử theo **đổi-thước-có-hợp-đồng** (nếp
    TE16c của hồ sơ stale-theo-diff-pr): needle chuyển sang `KHÔNG đeo khối`,
    giữ nguyên cả ba lớp phòng thủ (5 mutant chuẩn · 2 mutant cô-lập-lớp ·
    1 đối chứng cô-lập-clause). Điều khoản mời-cổng dùng CÙNG chữ hoa
    `KHÔNG đeo khối` để chân cô-lập-lớp còn nghĩa — chuỗi neo phải có mặt ở
    cả hai lớp thì phép tắt-từng-lớp mới phân biệt được chúng.
  Hệ quả cho eval: E9e chân (b) đổi từ «phải có dòng mới» sang **đẳng thức
  đúng-bằng-0 dòng mới** kèm lý do khai ở đây; giữ nguyên chân bánh cóc P161.

## Coverage

Quét theo ma trận hạng-mục × lớp-thước (nguồn: bảng loại-việc A/B của đề bài
1c, do ba vòng rà soát đối kháng của 1a lập):

- Trục hạng mục: khối-mỗi-tin | scan-phỏng-vấn | init-tuần-tự
  [thước CE: bốn hạng mục owner gạch 12/08; hạng mục T1-xác-nhận ĐÃ RA khỏi
  hồ sơ tại vòng thu phạm vi 14/08 — xem [THU PHẠM VI] ở Notes. Ba hạng mục
  còn lại đủ, không thêm không bớt]
- Trục lớp thước: mực-đã-in (AC-1/5/7, máy) | hành-vi-agent (AC-2/6/8, hội
  đồng bắt buộc) [thước CE: bảng «Đo bằng gì» của đề bài — mỗi hạng mục phủ
  đủ CẢ HAI lớp, 3×2=6 ô = 6 AC]
- Trục lưới kế thừa: assert chết khai đích danh | đẳng thức số ca | giới hạn
  bánh cóc P161 nói thẳng (AC-9) [thước CE: mục «Ràng buộc kế thừa» của đề
  bài, học từ finding H8 của 1a]
- Mỗi eval judgment: ≥3 ca, trong đó ≥1 giữ-gân (đã ghi trong thân AC) và
  ≥1 chống-a-dua (hỏi ngược xem agent có chiều theo câu dẫn); bảng đáp án
  viết TRƯỚC thi công; đề ca không mớm đáp án — chi tiết ở evals.yaml.

## Out of scope

- KHÔNG bỏ khối 👉 khỏi tin mời cổng hay khỏi thẻ cổng — hạng mục 1 chỉ gỡ
  nghĩa vụ mỗi-tin/chỉ-báo; khối tại cổng giữ nguyên khuôn ba vế.
- KHÔNG đổi ngữ pháp câu gộp (`GATE-ONESHOT-GRAMMAR`) và bậc thang suy danh
  tính ĐỌC/CHỌN/CẢNH BÁO/CẠN của hồ sơ may-ganh-nguoi-quyet.
- KHÔNG chạm lưới CI T1 trên diff thật (`pre-merge-check.sh`) — nó là đường
  đảo khiến AC-3/AC-4 an toàn, gỡ nó là đổi bản chất hạng mục 2.
- KHÔNG sửa hồ sơ `_acceptance/` đã ký — sử liệu bất biến, kể cả khi lời
  văn cũ của chúng còn nhắc luật mỗi-tin.
- KHÔNG thêm cơ chế cưỡng chế mới — hồ sơ chỉ TRỪ nghĩa vụ gọi người; nhãn
  `[SUY-TỪ-REPO:]`/`[GIẢ ĐỊNH]` là đổi khuôn nhãn nguồn hiện có của skill
  quét, không phải lớp kiểm mới.

## Notes

- **[THU PHẠM VI — 14/08, owner chọn đường ② sau hội đồng vòng 2]** Hồ sơ này
  nay còn **BA** hạng mục: khối 👉 thôi làm luật mỗi-tin · quét độ phủ thôi
  phỏng vấn · khởi tạo một-lần-gạch. Hạng mục **T1 tuyên-kèm-căn-cứ** đã ra
  khỏi hồ sơ, và vật của nó **hoàn nguyên** về đúng nguyên trạng `origin/main`
  (hai nhánh T1 lại hỏi xác nhận như cũ) — không để lại bản sửa nửa vời.
  Kèm theo: AC-3/AC-4 gỡ, E3/E4 gỡ, hai needle nhóm `G2` gỡ khỏi `NEEDLE-1C`,
  chân `g2` gỡ khỏi bộ răng và khoá `rang_1c_g2` gỡ khỏi config (chân quét một
  nhóm needle rỗng sẽ XANH vĩnh viễn mà không đo gì — đó là cách một phép đo
  chết mà vẫn có màu).
  **Vì sao cắt, nói bằng bằng chứng:** hai vòng hội đồng liên tiếp cho CÙNG
  TÊN LỚP LỖI — *máy đẩy quyết định ngược về người sau khi người đã nêu ý
  (bày menu)*. Vòng 1 lỗi ở nhịp 2; vá; vòng 2 lỗi **dời lên nhịp 1**.
  `STOP-PATCHING-CLAUSE` kích hoạt: khuôn giải sai, không phải chi tiết sai.
  Chi tiết + chẩn đoán khuôn sai: `review-findings.md`.
  Hạng mục bị cắt KHÔNG chết im lặng — đề bài lại ở
  `docs/plans/2026-08-14-hat-giong-t1-tuyen-kem-can-cu.md`.
- **Cổng 0 (14/08, owner):** «hội đồng: bắt buộc». Hệ
  quả thi hành: bốn eval judgment (AC-2/4/6/8) là điều kiện BẮT BUỘC trước
  Cổng Bằng chứng — báo cáo còn hạng mục judgment chưa có lượt hội đồng thì
  KHÔNG đủ điều kiện mời ký, bất kể lớp máy xanh bao nhiêu.
- **Vai lớp máy khai thẳng:** máy chỉ chứng MỰC ĐÃ IN — chuỗi cũ vắng trên
  cây sửa + hiện trên mốc base bằng cùng lệnh, số bản chép nguyên văn khớp
  manifest. Cấm «đo quan hệ», «so tập câu», «đối chứng dương tự sinh» cho
  lời hứa hành vi.
- **Ba lớp lỗi cấm tái phạm** (mỗi chân đo mới phá thử MỘT lần trước khi
  tin): tập so sánh tự loại câu chịu lực · đối chứng dương hằng-đúng
  (chèn-rồi-grep-lại) · mutant không chạy được (đỏ vì crash, không vì vật).
- Needle nào đo ra `base=0` là needle gõ theo trí nhớ → thay bằng cụm có
  thật (đã vấp một lần ngay khi soạn hồ sơ này: cụm T1 bị ngắt dòng giữa
  chừng, needle đầu tiên 0 hit, thay bằng cụm ngắn hơn nằm trọn một dòng).
- Merge SAU 1a — đã thoả: 1a nằm trên main tại `da9aef8`, hồ sơ này rẽ từ
  `BASE-1C`.

### Bản khai máy-đọc

Mốc đối chứng dương (bất biến, không dùng origin/main vì nó còn di chuyển):

<!-- <<<BASE-1C
d6efd36
BASE-1C>>> -->

Needle theo nhóm — cột: nhóm | needle (chuỗi cố định, grep -F). Phạm vi quét:
các file trong `VAT-1C` **TRỪ `tests/**`** (chuỗi luật cũ sống trong assert
của suite là việc của chân E9e/asserts-da-go, không phải của needle; gộp vào
đây thì đối chứng và vật đo lẫn nhau — gap-probe P2):

<!-- <<<NEEDLE-1C
G1|vẫn kết bằng khối, đúng một dòng
G1|ghi rõ "không cần làm gì"
G1|còn việc kế thì kết bằng đúng MỘT khối
G3|tóm tắt cho user xác nhận 1 lần
G3|hỏi user 5 ý
G4|Ask the user, one question at a time
G4|vẫn hỏi từng bước
NEEDLE-1C>>> -->

Manifest kỳ vọng SAU sửa — bản GHIM để bên đo đối chiếu với manifest sống
trong bản luật (chống tập-so-sánh-tự-tham-chiếu, gap-probe P1: site biến khỏi
manifest phải ĐỎ, không được rơi khỏi tập đếm). Hồ sơ này không thêm/bớt site
nào; đổi danh sách site là quyết định người, sửa khối này cùng lượt:

<!-- <<<MANIFEST-KY-VONG-1C
GATE-INVITE-SITES|skills/acceptance/SKILL.md|2
GATE-INVITE-SITES|commands/acceptance-card.md|1
GATE-INVITE-SITES|feature-loop/skills/feature-loop/SKILL.md|2
GATE-ONESHOT-SITES|commands/approve.md|1
GATE-ONESHOT-SITES|commands/signoff.md|1
GATE-ONESHOT-SITES|commands/acceptance-init.md|1
GATE-ONESHOT-SITES|commands/acceptance-status.md|1
GATE-ONESHOT-SITES|commands/acceptance-report.md|1
GATE-ONESHOT-SITES|commands/start.md|1
MANIFEST-KY-VONG-1C>>> -->

Vật chạm (đường dẫn tính từ gốc repo):

<!-- <<<VAT-1C
skills/acceptance/references/human-facing-language.md
skills/acceptance/SKILL.md
commands/acceptance-card.md
commands/approve.md
commands/signoff.md
commands/acceptance-init.md
commands/acceptance-status.md
commands/acceptance-report.md
commands/start.md
feature-loop/skills/feature-loop/SKILL.md
skills/morphological-scan/SKILL.md
tests/plugins/run-tests.sh
tests/plugins/asserts-da-go.txt
VAT-1C>>> -->

Số ca kỳ vọng SAU hồ sơ này, khai ĐẲNG THỨC (đếm theo phương pháp từng suite
như `so-ca.sh` của hồ sơ luu-kho đã ghim; số «trước» đo trên `BASE-1C` bằng
một lượt chạy thật ngày 14/08, số «sau» chốt khi thi công cắt assert — mọi
thay đổi so với «trước» phải khớp từng dòng `asserts-da-go.txt` mới):

<!-- <<<SO-CA-KY-VONG-1C
scripts 686
hooks 54
plugins 146
workflows 463
SO-CA-KY-VONG-1C>>> -->

Số «trước» đo ngày 14/08 trên cây `d6efd36` (sau khi gỡ hai worktree cũ làm
P93 đỏ oan và vẽ lại bản đồ cho hồ sơ này — hai việc môi trường, không chạm
nguồn kit). Assert của P193/P189 chết theo hạng mục 1 là assert TRONG ca, không
xoá ca nào → bốn con số trên đồng thời là số «sau» kỳ vọng. Thi công mà buộc
xoá TRỌN một ca thì sửa khối này bằng một commit sửa-sau-Cổng-1 có dấu vết
(nếp 1b, commit `67b2720`), kèm dòng tương ứng trong `asserts-da-go.txt`.
