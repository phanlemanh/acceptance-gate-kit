# phan-du-bo-cuc-moi — thiết kế

Hồ sơ: `_acceptance/phan-du-bo-cuc-moi/` · Cổng Đáng ký 15/11/2026: build, K3 lối (a), neo và ngưỡng như ô.
Khoá đích: `_acceptance/phan-du-bo-cuc-moi/khoa-dich.tsv` — 415 khoá B2 đo thiếu ở cây kịch bản `ff5e5b5d` (so `644e9b49`),
thêm cột cụm.

## 1. Vấn đề trong một câu

Một đường dẫn trong bộ kiểm chỉ có nghĩa ở **một** cây, mà bộ kiểm dùng cùng một chuỗi cho bốn cây khác nhau: cây đang
đứng, bản bung của một commit lịch sử, bản sao theo gốc plugin, và đường ghi trong hồ sơ đã ký. Kịch bản chuyển nhà đổi chữ
được chuỗi, không đổi được việc chuỗi ấy nói về cây nào — nên sau năm lượt đổi cơ học vẫn còn 415 khoá thiếu, cộng 11 chỗ
xanh giả (ghi chung ở ghi chú phiên giữ đợt).

## 2. Hướng đã chọn — bố cục đọc từ chính cây, một bộ dịch

**Bộ dịch `tests/bo-cuc.mjs`** (ở `tests/`, không ở `tests/lib/` — tên `lib` trùng thư mục gốc của lõi và rơi vào ngoại
lệ của luật bước 6). Đầu vào luôn là **đường viết theo bố cục phẳng** (đúng như bộ kiểm viết hôm nay) cộng **một cây**:

| Cây | Cách nói | Đọc bố cục từ |
|---|---|---|
| cây đang đứng / một thư mục | `{ thuMuc }` | `.claude-plugin/marketplace.json` + `lib/ho-goi.cjs` của gói lõi trong thư mục ấy |
| một commit | `{ kho, ref }` | cùng hai tệp, đọc bằng `git show <ref>:<đường>` |
| bản sao gốc một plugin (bộ đệm cài, lớp CI chép sang kho tiêu thụ) | `{ goiGoc, vai }` | không dịch tiền tố: đường trong gói là đường từ gốc gói |

Luật dịch: tiền tố đầu của đường phẳng là tên một gói phẳng (`feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc`,
`diagram-design`) → vai của nó → tên hiện hành theo `tenTheoVai` của **bảng tên của chính cây ấy** → thư mục nguồn theo
`marketplace.json` của chính cây ấy. Tiền tố là thư mục của lõi (`scripts`, `lib`, `hooks`, `skills`, `commands`,
`vendor`, `evals`, `design-floor`, `.claude-plugin/plugin.json`) → thư mục nguồn của gói vai `loi`. Còn lại (`tests/`,
`_acceptance/`, `docs/`, `.claude/`, tệp khai chợ) → giữ nguyên.

**Chuẩn hoá hai chiều (sửa theo phản biện P0).** Luật bước 6 của kịch bản đổi trước một phần chuỗi sang dạng
`plugins/<gói>/…`, kể cả chuỗi nói về commit lịch sử phẳng. Vì thế đầu vào dạng `plugins/<gói>/<phần còn lại>` được đưa
về vai trước (`acceptance-gate` → `loi`; tên gói mới hay cũ → vai, tra trong hợp của bảng bố cục phẳng, bảng tên của cây
đang chạy và bảng tên mới đóng băng ở cùng tệp `.json`), rồi mới dịch xuôi tới cây đích. Hệ quả: `dich(dich(p)) = dich(p)`,
và `dich('plugins/acceptance-gate/scripts/x', <commit phẳng>) = 'scripts/x'`. Ma trận AC-2 đo cả hai ô.

Hằng mới duy nhất là **bảng bố cục phẳng** (tên gói phẳng → vai, thư mục lõi) ở `tests/fixtures/bo-cuc-phang.json`:
bố cục phẳng là lịch sử đã đóng băng, nên hằng này không bao giờ phải đổi; nó là `.json` dưới `fixtures/` để kịch bản không
viết lại nó. Tên và nguồn đọc từ vật (`ho-goi.cjs`, `marketplace.json`) — không dựng bộ giải tên thứ hai. Commit trước
#503 không có `ho-goi.cjs` → tên lấy đúng tên phẳng; cây không có `marketplace.json` → lỗi có tên
`bo-cuc: <cây> không có .claude-plugin/marketplace.json`, không lùi lặng về phẳng.

API (đặt tên ở S2): dịch một đường · đọc một tệp / bung một thư mục ở một cây · gốc một gói theo vai · tên theo vai ở một
cây · dạng CLI một dòng cho các heredoc trong `run-tests.sh` (Python, bash). Danh sách đóng sắp theo tên (bảng lệnh, tên
gói) **rút từ vật** của cây đang kiểm, không ghim chữ.

**Lối đã loại.** Hằng theo từng tệp (`SCRIPTS = 'plugins/acceptance-gate/scripts'`) chết vì một hằng vẫn chỉ đúng một
cây — đúng gốc lỗi. Đọc `bang-xep.json` của kịch bản chết vì kho này không có nó, và kho mới không giữ kịch bản sau cắt
sang. Để kịch bản thêm luật chết vì bước 6 đã tới năm lượt và vẫn còn 415 khoá thiếu: luật đổi chữ không biết chuỗi thuộc cây nào.

## 3. K2 — sản phẩm còn đường phẳng

- Khối khai chỗ trong `skills/acceptance/references/human-facing-language.md` (`GATE-INVITE-SITES`,
  `GATE-ONESHOT-SITES`, `GATE-END-TURN-SITES`, bảng `COMMAND-NAMES`) và `skills/design-pass/SKILL.md`
  (`REACTION-DEFAULT-SITES`): **giữ dạng phẳng** (đường từ gốc kho phẳng), bên đọc (P188, P193, DP11, LB1, «ca lệnh bấm
  được», «ca nạc phản ứng») giải qua bộ dịch. Lối đổi khuôn sang `<plugin>:<đường>` chết vì nó đổi khuôn của một tài liệu
  luật mà mọi kho tiêu thụ đọc — đổi mặc định là mọi kho trả giá. Cột tên trần của `COMMAND-NAMES` giữ nguyên; bên đọc ghép
  tiền tố từ bảng tên.
- `.claude/settings.json` `permissions.allow` (LM1, song ánh với `feature_loop.suite_keys`): bên đọc so sau khi dịch đường
  trong lệnh; tệp cấu hình không đổi ở vòng này (đổi ở kho mới là việc của kịch bản — ghi vào danh sách gửi B2).
- `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs`: nạp qua bộ dịch (JI12 dùng nó).
- `moi-cong-khong-qua-nut` (MQ, 17 khoá): `LENH_KIT_RE` rút tên gói từ bảng tên thay vì viết trong regex.

## 4. Mã sản phẩm #503 chưa phủ (4 khoá)

- `lib/chan-lo-trinh.cjs` `khoaBat()` tìm `marketplace.json` cạnh gốc gói → thêm nhánh dự phòng theo bảng tên như bản đôi
  ở `scripts/lo-trinh-khoi-tao.mjs` (CK-4-lib).
- `scripts/lo-trinh-khoi-tao.mjs` nhánh dự phòng viết cứng `roadmap@delivery-loop` → ghép từ `tenTheoVai('lo-trinh')` và
  `CHO` của bảng tên (KM-1-do3). Ở bố cục cũ nhánh dự phòng (bản cài gói không có `marketplace.json` cạnh nó) đổi đầu ra
  có chủ ý: hôm nay nó in tên mới ngay cả ở cây cũ, sau sửa in `road-map@acceptance-gate-kit`. Bản cài bố cục cũ luôn có
  tệp khai cạnh gói lõi (nguồn `./`), nên nhánh này không chạy ở kho tiêu thụ nào hôm nay; nhánh chính giữ từng byte.
- Nếu chủ kho gom giới hạn thứ nhất của gọi chéo (Hỏi-2): `chan-lo-trinh` nạp `ho-goi.cjs` lười, lúc cần bảng tên; thiếu
  tệp → lỗi có tên thay vì sập khi nạp (AC-12, chỉ bật khi gom).
- LT-94/LT-94-do (đỏ theo lịch 15/11): mốc «Tới» của fixture đổi từ `2026-11-15` sang `2026-10-20` — vẫn sau hai mốc kia,
  và đã qua nên không bao giờ trùng một ngày chạy về sau; danh sách miễn không nới.
- TH-10-ong / TH-10-do: mã đo trong hồ sơ đã ký `cua-tin-hieu-gom-nhom` — đi lối K3 (§5).

Hai giới hạn đã khai của vòng gọi chéo (`chan-lo-trinh` nạp cứng `ho-goi.cjs` lúc nạp; tên và nguồn chợ có hai bản, `NGUON_CHO`
không có bên đọc) nằm cùng vùng nhưng **không** gom tự động: lên Cổng Phạm vi thành câu hỏi.

## 5. K3 lối (a) — hồ sơ đã ký đọc qua bộ dịch, không đổi byte nào

1. Ca đọc phạm vi, khối khai, `paths` của hợp đồng đã ký (P169, LM5, LM8b, ba ca làn máy, RT13, RT18) dịch từng đường
   trước khi so. Lớp đọc-cũ có tiền lệ: ca so-byte của `lo-trinh-gio-may` gỡ đúng phần mới, kèm đối chứng phần ấy có mặt.
2. `scripts/recheck-evidence.cjs` — bộ giải `verifier:` thêm ứng viên **gốc gói lõi** khi đường không có ở gốc kho
   (gốc gói lõi đọc từ `marketplace.json` của gốc kho git; vắng → không thêm, hành vi cũ). Cứu JR11b, DV4a, L05,
   `lan-status-not-run`. Đây là đường T3 → vòng T3, thêm Gate 1.5.
3. Mã đo trong hồ sơ dùng hằng gốc kho bên trong (`cua-veto-sau-chu-ky/fixture.mjs`,
   `cua-tin-hieu-gom-nhom/rang/cham-bo-vang.mjs`, `stop-patching-law/make-record.mjs`): ca thường trực gọi một bản đặt ở
   `tests/` (bản trong hồ sơ giữ làm sử liệu), hoặc rút đích từ hằng của mã đo rồi dịch. Bản ở `tests/` có răng so với bản
   trong hồ sơ ở bố cục phẳng (khác đúng chỗ gọi bộ dịch) để không trôi.

Lệnh eval của hồ sơ đã ký **vẫn không** chạy lại được ở kho mới — ngoài vòng (ô cơ hội, Out of scope).

## 6. K4 — bốn cụm theo cột `cum` của `khoa-dich.tsv`

| Cụm | Khoá | Tệp | Hình dạng chủ đạo |
|---|---|---|---|
| K4-SC scripts còn lại | 77 | 17 | `git archive`/`git show` lịch sử + cây đang đứng dùng chung hằng; xanh giả (ii) #6–#8, #10 |
| K4-PL plugins + điều phối | 13 | 2 | heredoc Python trong `run-tests.sh` (P161, P91, P93); ca điều phối (TC1, DP2, DP6, DP7) |
| K4-LT lộ trình, tín hiệu | 174 | 16 | kho tiêu thụ giả trùng chữ đường kit (xanh giả #4, #5); bản sao kit thiếu `.claude-plugin` lõi |
| K4-TB thẻ, bản đồ, khuôn | 98 | 9 | bung lõi vào thư mục tạm theo danh sách thư mục phẳng |

Mỗi tệp: thay chuỗi đường bằng lời gọi bộ dịch theo đúng cây chuỗi ấy nói tới. Ca «merge-base sống» (bung
`merge-base HEAD origin/main`) dịch theo dấu của commit bung, nên không lật bố cục vào ngày cắt sang. Chỗ xanh giả loại (ii)
thêm chốt chống rỗng: mỗi pathspec đã dịch phải có thật ở commit (`git cat-file -e`).

Ca đổi nghĩa mà máy quyết ở S3 theo một nguyên tắc: **giữ lời hứa gốc của ca ở cả hai bố cục**; ca nào không giữ được mà
không thêm hành vi đo mới thì lên thẻ.

## 7. Đo — ở cùng nhà với vật

- **Răng bền `tests/scripts/bo-cuc.test.mjs`** (suite scripts nhặt qua glob): cây phẳng (bung HEAD) và cây mới (dựng bằng
  `dungKhoMoi` của hồ sơ gọi chéo) do mã sinh trong lần chạy; ma trận đường × cây viết trước, số assert = số phần tử; lũy
  đẳng; commit lịch sử trước #503; cây thiếu `marketplace.json` → lỗi có tên (đối chứng dương: cây đủ thì xanh).
- **Thước giữ khoá `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`**, ba chế độ:
  - `--cu`: từng tệp kiểm vòng chạm, chạy ở bản gốc (`git archive` trọn cây của merge-base) và ở HEAD → túi khoá HEAD ⊇ túi
    khoá bản gốc, mọi ca xanh.
  - `--moi`: dựng kho mới từ HEAD bằng `dungKhoMoi` (bước 1–3 + luật đổi chữ dưới `plugins/`), chép phần ở lại gốc
    (`tests/`, `_acceptance/`, `docs/`, `.claude/`) rồi chạy **hai biến thể**, đúng thước ô cơ hội đã ký («bước 1–3 + luật
    chung bước 6 của kịch bản, không bảng vá»): (i) chỉ luật đổi tên trên `tests/` — bộ kiểm tự đúng đường; (ii) thêm luật
    chung bước 6 (`buoc6BoKiem` không có bảng vá), CHÉP vào `rang/buoc6-chep.mjs` từ `migration/kich-ban/don-nha.mjs` ở một
    commit ghim của nhánh B2, theo tiền lệ `luat-doi-chu.mjs` (chép, không nạp; rủi ro trôi khai, đo chéo cuối vòng bù).
    Chạy từng tệp kiểm vòng chạm ở mỗi biến thể → mọi khoá đích của các cụm vòng nhận có mặt và xanh; túi khoá ⊇ túi khoá bố
    cục cũ.
  - `--chieu-do`: trên kho mới, thay bộ dịch bằng bản đồng nhất (trả đường phẳng) → các ca canh đã định đỏ với thông điệp
    ghim; không đỏ thì `FAIL: … chiều đỏ không đỏ`.
  Hạ tầng hỏng (archive, chép, node) → thoát 3 «HẠ TẦNG: …», không in PASS.
- **Đo chéo cuối vòng** trên bản kéo tạm của `delivery-loop` (kịch bản thật, có bước 6 và bảng vá đã gỡ mục thừa), chạy tay,
  ghi số vào hồ sơ — ngoài lượt chấm.

## 8. Ghép nối với B2

Mục vá nào của B2 (`va-bo-kiem.json`) mà vòng này làm thừa thì kịch bản dừng ở bước 6 («vá không khớp»). Vòng ghi
`_acceptance/phan-du-bo-cuc-moi/gui-b2.md`: mục vá phải gỡ (tệp, chuỗi cũ), mục cấu hình cần kịch bản đổi
(`.claude/settings.json`), và ca đổi nghĩa — rút bằng máy từ diff của vòng so với bảng vá, không gõ tay.

## 9. Rủi ro

- Diff lớn (≈ 50 tệp kiểm) → lượt chấm dài; đường cắt ở Cổng Phạm vi.
- Bộ dịch sai một luật → nhiều ca cùng sai; răng bền đo ma trận trọn và chiều đỏ trên chính bộ dịch.
- B2 đổi bảng vá song song → danh sách gửi B2 rút lại ở cuối vòng trên đúng đỉnh nhánh B2 lúc ấy.
