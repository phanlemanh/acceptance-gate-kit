# Phiên thợ biết mình đang trong đợt (DP7) — design thi công

Gốc: hàng DP7 của `docs/plans/lo-trinh-kit.json` trong ô dù
[`dieu-phoi-tho-trong-kit`](../../../_acceptance/dieu-phoi-tho-trong-kit/opportunity.md) (Cổng Đáng build
09/10, timebox 07/11) · thiết kế chung đã duyệt 10/10:
[spec workflow](2026-10-10-dieu-phoi-workflow-design.md) §16 hàng **T7** và **T15** (phần DP7), §2, §6, §14 ·
hạt giống [sau DP2](../../plans/2026-10-10-hat-giong-mo-dot-dieu-phoi-sau-dp2.md) mục 1 (Ngoài-18) · hạt giống
[lõi chuyển từ crm](../../plans/2026-10-10-hat-giong-loi-dieu-phoi-chuyen-nguyen-tu-crm.md) mục 4.

Câu giao: «Phiên thợ biết mình đang trong đợt: chờ lượt S4 không thành câu hỏi hay vòng thử lại, xong hàng
thì tự mở hàng kế của dãy, quyền merge theo thẻ khởi tạo — kho không có đợt không đổi byte nào».

## 1. Việc

Đợt crm `sau-14-10` đo được ba chỗ phiên thợ không biết mình trong đợt (spec §16 T7, T15):

- Bị hook chặn S4 thì phiên đọc thành lỗi: hỏi chủ kho, hoặc `/goal` đẩy nó tung lượt lại.
- Xong một hàng thì dừng, chờ người bấm chip cho hàng kế, dù bộ phát lịch đã ghi `tiep/<dãy>.json`.
- Thẻ khởi tạo hỏi «quyền tự merge», nhưng câu trả lời chỉ nằm trong chữ tự do `--ly-do` của lệnh `pha`; S5
  của feature-loop vẫn nói «bấm merge là của người».
- Thợ hỏi chủ kho bằng chữ trong hội thoại, bảng chờ người không thấy (luật 52: P2 đứng ~2 giờ, P3 ~1,5 giờ).
- Hỏi đáp brainstorm và Cổng Đáng của hàng phát sinh mọc lên trong từng phiên thợ, mỗi chỗ một lượt gọi
  người ngoài thẻ khởi tạo.

Ở kho kit còn một lỗ chặn thẳng vế «tự mở hàng kế»: bộ phát lịch chỉ coi `signed-off` là xong
(`tienDoCua`), nên hàng đi làn V kết ở `machine-cleared` đứng «đang làm» mãi và dãy không bước sang hàng kế
(hạt giống lõi crm, mục 4).

## 2. Bố cục

```
phiên thợ (feature-loop)                               gói dieu-phoi (bản lõi của đợt: <thư mục đợt>/loi/)
  S0: trong-dot.mjs --root . ──── có symlink? ── không → không in gì, khối Trong đợt không bật
                                   │ có
                                   └── node <thư mục đợt>/loi/dieu-phoi.mjs tho --json
                                          ↳ dãy (phienCuaCwd) · pha · tu_merge · hàng kế (tiep/) · viec_ke
  S1/S4/S5: khối TRONG-DOT của SKILL đọc JSON đó; mọi lần ghi vào thư mục đợt theo LUAT.md của đợt
```

| Tệp | Đổi gì |
|---|---|
| `feature-loop/scripts/trong-dot.mjs` (mới) | Nhận biết đợt, chỉ đọc. Gốc kho chính giải bằng `git rev-parse --git-common-dir` (như `gocKhoChinh` của gói), không bằng `--show-toplevel` — trong một worktree, lệnh sau trả gốc của worktree. Không symlink → thoát 0, không in byte nào. Có symlink → gọi `tho` của bản lõi trong thư mục đợt; JSON `trong_dot:false` (phiên không thuộc dãy) → không in gì; lõi thiếu `tho` → một dòng `trong-dot: …` |
| `feature-loop/skills/feature-loop/SKILL.md` | Khối marker `TRONG-DOT` (§4) |
| `dieu-phoi/scripts/tho.mjs` (mới) | `ngucanhTho(cwd, {slug})` — dựng JSON ngữ cảnh thợ; hằng `VIEC_KE` |
| `dieu-phoi/scripts/dieu-phoi.mjs` | Lệnh con `tho [--slug <s>] [--json]`; cờ `--tu-merge co\|khong` của `pha` |
| `dieu-phoi/scripts/pha.mjs` | Trường `tu_merge` trong `dieu-khien.json`: chỉ đặt được khi chuyển sang `dang-chay`, giữ qua mọi lần đổi pha sau |
| `dieu-phoi/scripts/phat-lich.mjs` | `tienDoCua` đọc tập «đã thông» (`signed-off`, `machine-cleared`, `da-cham-boi-thuc-te`); danh sách chờ người gồm cả yêu cầu `can-nguoi` chưa trả lời |
| `dieu-phoi/scripts/hook-chan-s4.mjs` | Lời chặn trong worktree của một dãy thêm một câu: đây là chờ lượt, không phải lỗi (giữ nguyên tiền tố cũ) |
| `dieu-phoi/commands/mo-dot.md` | Bước 5 truyền `--tu-merge` theo chữ người gõ |
| `dieu-phoi/README.md` | Mục «Phiên thợ trong đợt» |
| `tests/dieu-phoi/trong-dot.test.mjs` (mới) | Ca `DP7-*` |

## 3. Chỗ chọn (mỗi chỗ một dòng sổ quyết định)

1. **Nhận biết đi qua bản lõi của đợt (`<thư mục đợt>/loi/dieu-phoi.mjs`), không qua gói đang cài.** Bản
   lõi là mã bộ phát lịch đang chạy (DP1 AC-11), nên thợ và bộ phát lịch đọc cùng một khuôn. Gói
   `dieu-phoi` có thể không cài ở phạm vi phiên thợ; kho không đợt thì không có symlink, nên không lệnh nào
   của gói được gọi. Loại: `resolve-plugin.mjs --plugin dieu-phoi` (kho không cài gói thì bộ giải thoát khác
   0 — một dòng lỗi ở kho không đợt).
2. **Dãy = `phienCuaCwd` (worktree trong `hang-viec.json`), không đọc `song/`.** Đây là đúng hàm mà hai hook
   của gói dùng, nên «phiên thuộc dãy» có một nguồn. `song/` (DP3) trả lời «phiên còn sống không», không
   trả lời «phiên này là dãy nào»; khối không cần nó và không chép mã DP3.
3. **Khối không chép cách ghi vào thư mục đợt.** Xin lượt, nhả lượt, yêu cầu: «làm đúng mục *Cách xin tài
   nguyên* của LUAT.md». DP3 đổi mục đó sang lệnh con CLI; khối đúng cho cả bản cũ lẫn bản mới mà không sửa.
4. **`tu_merge` là một trường của `dieu-khien.json`, do `pha` ghi.** `pha` đã là bên viết duy nhất của tệp
   và đã nhận chữ duyệt thẻ của người; câu trả lời «quyền tự merge» đi cùng lượt. Vắng (đợt cũ, hoặc
   người không trả) → `null` → thợ đọc là **không tự merge**: bấm merge là khó-đảo, mặc định an toàn.
5. **Hàng kế đọc từ `tiep/<dãy>.json` (bên viết: bộ phát lịch), không tự tính lại.** `tho` thêm hai lớp
   đọc: (a) `--slug <hàng vừa xong>` mà `tiep` còn trỏ hàng đó → `cho-nhip`; (b) hàng kế chưa có quyết
   `build` (Ngoài-18) → `bao-giam-sat`, không mở. Trạng thái quyết đọc bằng `trangThaiQuyet` của thẻ khởi
   tạo — một nguồn với thẻ — và theo đúng phạm vi của thẻ: hàng mang `ma` lộ trình mới xét quyết; hàng không
   mang `ma` là hàng phát sinh mà giám sát đã thêm bằng `hang them` (chính lượt gom Cổng Đáng về giám sát),
   nên đã quyết. Hàng thuộc một ô dù (như DP3, DP4 dưới `dieu-phoi-tho-trong-kit`) có ô riêng được mở ở thẻ
   khởi tạo theo spec §14 chỗ nối 2, nên tới lúc thợ đọc hàng kế, ô ấy mang `decision: build` nếu người đã gõ
   `build`. Hai nguồn quyết — `contract.md` và ô — được tìm ở worktree của dãy trước, rồi ở kho chính.
6. **Tập «đã thông» của `tienDoCua` neo vào kit.** `DA_THONG_CONG_2` của `lib/workspace-record.cjs` cộng
   `da-cham-boi-thuc-te` (ADR 0020). Gói cài riêng nên không nạp lib được; một ca so hai tập (cùng khuôn ca
   DP2-09).
7. **Chờ người có một danh sách.** `trang-thai.json.cho_nguoi` = tệp `cho-nguoi/` (hook) ∪ yêu cầu
   `can-nguoi` chưa có `tra-loi`. Bảng đợt, `xem` và lệnh đếm cùng đọc danh sách đó, nên câu hỏi gửi theo
   đường yêu cầu hiện trên bảng và được đếm một lần (Ngoài-21 của DP2).
8. **Không đổi `GOAL-TEMPLATE` và S5-SHIP-DEFAULT.** Trong đợt brainstorm không hỏi nên không có lượt
   người để vũ trang `/goal`; khối chỉ nói «không in khối GOAL-TEMPLATE». Đổi khuôn goal là đổi byte ở mọi kho.

## 4. Khối TRONG-DOT (bản thảo, chữ cuối nằm trong SKILL)

Đặt ngay sau đoạn «Bất biến dừng». Năm luật, mỗi luật gắn đúng một chỗ của vòng:

| Chỗ | Luật trong đợt |
|---|---|
| S0 | Chạy `node "$WORKFLOWS_DIR/../scripts/trong-dot.mjs" --root .` — đường qua `$WORKFLOWS_DIR` (đã giải ở đầu SKILL), vì ở kho tiêu thụ script nằm trong cache gói, không ở gốc kho. Không in gì → bỏ qua cả khối. Hàng chưa có ô (`moi: true`) → yêu cầu `hang-moi` cho giám sát, không trình Cổng Đáng ở phiên thợ |
| S1 | Không mở hỏi đáp: trả lời từ ô, câu giao, LUAT.md; câu xin duyệt thành dòng sổ `approach`; không in GOAL-TEMPLATE. Câu chỉ người biết → yêu cầu `can-nguoi` trước khi hỏi bằng chữ |
| S4, ghim lại, đường nền | Xin lượt rồi chờ bằng lệnh nền; `chan-s4` là chờ lượt — không BLOCKED, không hỏi, không tung lượt, không đếm round; nhả khi verdict đã ghi |
| S5 | `tu_merge: true` → xin lượt `merge`, gộp theo lệ kho, nhả; `false`/`null` → chỉ PR. Rồi làm đúng `viec_ke` |
| Mọi chỗ | Khó-đảo vẫn là câu hỏi cho người; bảng cổng không đổi |

`viec_ke` ∈ `mo-hang` · `cho-nhip` · `bao-giam-sat` · `cho` · `xong`. Tập này là hằng `VIEC_KE` của
`tho.mjs`; ca round-trip đòi mỗi phần tử có đúng một dòng hướng dẫn trong khối.

## 5. Không gian tiêu chí (morphological-scan, preset test-matrix)

Chân sản phẩm: spec workflow §16 `[SUY-TỪ-REPO: docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md]`,
mã gói `[SUY-TỪ-REPO: dieu-phoi/scripts/]`. Chân ngành: hàng đợi khoá tài nguyên của CI — job chờ khoá ở
trạng thái «pending», không phải «failed» `[NGÀNH: GitHub Actions concurrency groups]`; quyền tự gộp do người
cấp trước một lần cho cả hàng đợi `[NGÀNH: GitHub merge queue / auto-merge]`.

Trục:
- **A. Ngữ cảnh kho:** không đợt · đợt mà phiên không thuộc dãy (giám sát) · đợt lõi cũ (không `tho`) · đợt +
  dãy. [thước CE: ba nhánh của `timThuMucDot` + `phienCuaCwd` + có/không `loi/`]
- **B. Chỗ của vòng:** S0 nhận hàng · S1 brainstorm · S4/ghim lại/đường nền · S5 ship + hàng kế. [CE: bảng
  stage của SKILL]
- **C. Hàng kế:** mở được · chưa quyết/không build · chờ (phụ thuộc, nghỉ, pha không chạy) · dãy xong · nhịp
  chưa cập nhật. [CE: các nhánh trả của `chonHangKe` + Ngoài-18]
- **D. Quyền tự merge:** có · không · vắng. [CE: thẻ khởi tạo `hoi: quyen-tu-merge`]

Core (gom thành tiêu chí): A=không đợt × mọi B (AC-1, AC-9) · A=đợt+dãy × B=S0 nhận biết (AC-1, AC-2) · C đủ
năm nhánh (AC-3) · hàng `machine-cleared` bước sang hàng kế (AC-4) · D ba giá trị (AC-5) · S4 chặn = chờ lượt
(AC-6) · chờ người một danh sách (AC-7) · khối SKILL (AC-8) · không vỡ DP1/DP2 (AC-10) · tài liệu (AC-11).

Later: đếm chạm theo vòng ở năm dòng số của mốc (T15 vế «theo vòng») · hook tự bắt câu hỏi cuối lượt (DP6
«tự bắt việc chờ người») · hai dãy cùng slug (Ngoài-19).
Never: A=giám sát × S5 — giám sát không chạy feature-loop trên hàng của dãy.
