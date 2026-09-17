# Rà hạ tầng đo — 23 lớp đã gặp, kế hoạch đón được bao nhiêu

> Owner hỏi 17/09, hai lần liền: *bài học hạ tầng của oneflow gặp rất nhiều lần đã vào kế
> hoạch của kit chưa* và *vấn đề hạ tầng kiểm tra trước đã vào kế hoạch chưa — kiểm kỹ xem
> còn thiếu gì*. Mỗi dòng dưới đây đã đối chiếu với code kit (`feature-loop/skills`,
> `feature-loop/workflows/acceptance-verify.js`, `feature-loop/scripts/s4-args.mjs`), với
> hồ sơ và sổ nhớ phiên của crm-onehub, oneflow, và với hồ sơ mốc 2.14.0. Kết: **4 lớp đã
> có nhát chữa · 6 lớp có một nửa · 12 lớp chưa có chỗ nào · 1 giới hạn đã biết.** Owner
> gật cách xếp chỗ ở §4.

## 1. Kit hôm nay kiểm gì trước khi chạy

- **S0 bước 0** (`feature-loop/skills/feature-loop/SKILL.md:102`) — «Preflight dependency
  (chỉ lần đầu mỗi repo/máy)»: skill superpowers có mặt, plugin acceptance-gate giải được.
- **Phase 0** (`skills/acceptance/SKILL.md:29`): `config.yaml` tồn tại, hạng rủi ro, trạng
  thái hồ sơ, chống đụng slug.
- **Không bước nào kiểm**: lệnh của executor có chạy được trên máy này không · suite có
  xanh trên cây chưa đụng không · máy chủ và cổng · nhánh gốc đang nợ vi phạm gì · bản
  engine vendored có lệch bản plugin không.
- Nhát ① của ô `thuoc-co-cua` (tiền đề dry-run) là LLM tự liệt kê tiền đề. R1 cho thấy giới
  hạn của nó: bắt được `uv` thiếu, **không** bắt được `uv` chọn Python 3.9 — vì nó không
  chạy suite thật.

## 2. Bảng 23 lớp

✅ đã có nhát chữa · ◐ có một nửa · ✗ chưa có chỗ nào

| # | Lớp | Bằng chứng | Trạng thái trước lượt rà |
|---|---|---|---|
| | **Trước khi đo** | | |
| 1 | Công cụ hoặc runtime thiếu, sai bản | oneflow R1: thiếu `uv`, rồi `uv` chọn Python 3.9 trong khi SDK đòi ≥ 3.10 | ◐ ① bắt bằng LLM; thiếu phép kiểm tất định |
| 2 | Suite đỏ sẵn trên cây chưa đụng | kit: ca `duong-lui-phai-song --chan ky-lan-song` đỏ từ trước; crm: `retireExhausted` bập bênh; oneflow: `provisioning-events` | ✗ |
| 3 | Vi phạm lưới có sẵn trên nhánh gốc, chỉ lộ lúc mở PR | oneflow #120: ba hồ sơ ghim bằng làn không chạy eval; crm: hai hồ sơ cũ + bốn hồ sơ treo | ✗ — hai ô `cong-chan-theo-ho-so-khong-theo-diff` (07/09) và `premerge-nhu-ci-truoc-khi-mo-pr` (11/09) vẫn ở discovery |
| 4 | Bản engine lệch nhau: vendored · plugin cache · kit | crm vendored 2.9 so 2.14; phiên #50: «mười vi phạm kia là do tôi chạy bản kit, không phải bản CI dùng» | ✗ |
| 5 | Tiền đề hỏng giữa S1 và S4; S4 vẫn dispatch khi tường còn | R1 lượt 1: tường `uv` biết từ 11:56, S4 chạy 12:57, BLOCKED, 41 M | ◐ có «gỡ tường», chưa có «kiểm lại trước mỗi lượt S4» |
| | **Đứng vào chỗ đo** | | |
| 6 | Máy trạng thái của app: onboarding, SSO, khoá, DB | crm: 12 · 6 · 15 hồ sơ vướng | ✅ ① + ④ |
| 7 | Máy chủ trỏ nhầm cây, cổng bị chiếm | crm ×2 trong một phiên; oneflow: cổng 3000 do repo khác giữ | ✅ ④ máy chủ tự xưng cây + SHA |
| 8 | Máy chủ chết giữa lượt | crm: chết theo shell; tự tắt đúng 1 phút 42 giây, nguyên nhân chưa ai truy | ◐ `--chay` của ④ phải kiểm sống trước mỗi eval — chưa viết |
| 9 | Cây của lượt: worktree, `.env`, install, generate | crm 08/09: bảng chẩn đoán 33 mục phải xoá vì đo trong cây chung | ✗ — cách dựng cây chỉ sống trong sổ nhớ phiên |
| | **Trong lượt chấm** | | |
| 10 | Làn chấm chạy MỌI lệnh máy song song, kể cả lệnh suite (`acceptance-verify.js`, khối machine ~dòng 664) | build đua typecheck ở artifact-platform · oneflow · crm (REJECT giả, `tran-mot-lan-uy-thac` vòng 2); E14 đỏ dưới tải làn ui; `sdk/build`; và chính mốc 2.15.0 lượt 1: REJECT vì «chốt cây bẩn bắt nhầm fixture tạm của suite song song» | ◐ «tài nguyên của lượt» mới nói eval, chưa gồm lệnh suite |
| 11 | Trần thời gian công cụ × xếp hàng → chân cuối bị bỏ đói | crm: `khai-bao` mã 2 khi 12 chân xếp hàng | ✗ |
| 12 | Mã thoát đi qua lời khai của agent: workflow tin trường `exitCode` | crm `khoa-lo-giu-tran`: verifier haiku chép sai mã, REJECT giả ở E6 | ✗ — lỗ «bằng chứng tự dối» ở lõi |
| 13 | S4 không nghe `status: not-run` | crm 16/09 phải đổi sang `expected_exit`; R1: E15 khai not-run từ S1 vẫn bị thi hành → BLOCKED | ✗ — hồ sơ `lan-doc-status-not-run` chỉ phủ làn ghim lại và bên đọc pin |
| 14 | Tham số S4: máy sinh tệp, model phải dán hàng chục nghìn ký tự vào lời gọi | R1: một lượt huỷ vì sai bốn trường danh sách; crm: 24 nghìn ký tự | ✗ |
| 15 | Agent nền chết hoặc treo → người gõ «retry», «tiếp tục» | R1: 2 trong 4 câu hạ tầng | ✗ — hạt giống H3 đã chạm ngưỡng hai mốc liền |
| 16 | Hook `/goal` chặn lần dừng hợp lệ | R1: 2 + 7 lần | ✅ vá-trong-mốc 2.15.0 (AC-13) |
| 17 | Phép đo ghi vào hồ sơ đã ký | crm, cả ba worktree | ✅ răng `fc1f0f22` + crm #47; giới hạn: S4 và CI chưa chụp cây |
| 18 | Thước trong hồ sơ đổi mà carry / bỏ-qua vẫn giữ kết quả cũ | crm 06/09 (`--carry-anchor` loại hồ sơ khỏi delta) | ◐ ô draft `bo-qua-phai-thay-dinh-nghia-phep-do`; R ghi «đi cùng mốc nếu owner phê» |
| | **Thước của kit tự dối** | | |
| 19 | Sàn thiết kế báo P0 giả trên nền tối | crm 16/09, ba vòng chấm liền | ✗ — chip mở 16/09, chưa ai bấm |
| 20 | Thẻ cổng đếm `expected_exit` đã khai thành trượt | crm 16/09 07:34 | ✗ — chip chưa ai bấm; thẻ sai là lời mời người sai |
| | **Sau lượt chấm** | | |
| 21 | Nợ nhánh gốc chặn vòng sạch; thiếu `park` cho vòng | crm 06/09; oneflow #120; `normalize-text-vi` phải giữ `signed-off` cho plugin đã rút | ◐ gọi tên ở §4 hồ sơ mốc |
| 22 | Lưới ở máy khác lưới ở CI | `--slug` thu phạm vi → clean giả; object store còn commit cũ; bản vendored | ✗ (ô còn ở discovery) |
| 23 | Token phiên chính không đo được | crm 133 M | giới hạn đã biết; R2 #2 phủ một nửa |

## 3. Mảnh lõi còn thiếu: đường nền hạ tầng ở S1

Một script, không LLM, chạy trước Cổng Phạm vi trên cây chưa đụng:

- **(a)** lệnh đầu của mọi executor trong vòng có trên máy không;
- **(b)** các lệnh suite chạy một lần, TUẦN TỰ, rồi kiểm cây còn sạch — bẩn nghĩa là có
  phép đo ghi vào hồ sơ;
- **(c)** lưới trước-merge chạy đúng như CI (không thu phạm vi theo slug, base là nhánh
  gốc), in vi phạm có sẵn;
- **(d)** in ba bản engine và cờ khi lệch.

Thứ gì đỏ ở đây theo định nghĩa không phải lỗi của vòng, nên được quyết trước cổng, trong
gói Cổng Phạm vi. Diễn lại: R1 — bắt `uv`, Python 3.9, ba hồ sơ nợ cũ, tức 3/4 câu hạ tầng,
41 M của lượt 1, và lần bất ngờ lúc merge; crm — bắt tệp bằng chứng bị ghi đè và bốn hồ sơ
treo. Chi phí: vài phút máy, 0 token; kết quả suite dùng lại được làm nền cho S4.

## 4. Xếp chỗ — owner gật 17/09

- **Ngăn một — đúng/sai, nhỏ, đang đốt lượt chấm hoặc làm thẻ mời sai:** #13 S4 nghe
  `not-run` · #20 thẻ cổng đếm `expected_exit` · #18 `bo-qua-phai-thay`. Owner phê làm
  vá-trong-mốc 2.15.0. **Khi lời phê tới, mốc 2.15.0 đã qua Cổng Phạm vi (13 tiêu chí) và
  đang ở S4 lượt 1 → 2**, nên không mở lại phạm vi mốc giữa lượt chấm: ba mục là nhát mở
  đầu của cửa sổ 2.15 → 2.16 (hoặc bản vá 2.15.1), trừ khi owner nói khác trong phiên cắt mốc.
- **Ngăn hai — vòng `thuoc-co-cua`, gom về hai câu và một cửa:** *đứng được trước khi
  chấm* = đường nền hạ tầng (#1–#4) + tiền đề + gỡ tường + kiểm lại trước MỖI lượt S4 (#5)
  + kiểm máy chủ sống trước mỗi eval (#8) · *chạy không đè nhau* = tài nguyên của lượt gồm
  cả lệnh suite, mặc định tuần tự (#10), thời gian chờ khoá không tính vào trần (#11) ·
  ② cửa cho thước. Đã ghi vào ô.
- **Ngăn ba — gọi tên làm chỗ cắt kế, chưa làm:** #12 mã thoát qua lời khai của agent
  (đứng đầu) · #14 tham số S4 bằng đường dẫn tệp · #9 cây của lượt · #15 tự thử lại một lần
  · #19 sàn thiết kế trên nền tối · #21 #22 đánh thức hai ô đang ngủ, trong đó
  `cong-chan-theo-ho-so-khong-theo-diff` là mắt đầu chuỗi nhân quả ở cả crm lẫn oneflow.

Câu owner hỏi thêm cùng lượt — *giải được hạ tầng thì có chạy được feature-loop song song
không*: điều kiện cần, chưa đủ. Tài nguyên của lượt giải trọn song song trong một lượt chấm
và phần lớn song song trong một vòng; nhiều vòng cùng lúc còn bị chặn bởi tệp dùng chung
(`config.yaml`, bản đồ sản phẩm), chi phí ghim lại nhân theo số vòng (charter 07/08 §1d), và
số cổng người. Ràng buộc thiết kế duy nhất ghi cho ④: **tài nguyên khoá theo mã lượt, không
theo repo** — để không đóng cửa đó.

## 5. Nguồn

`feature-loop/skills/feature-loop/SKILL.md` dòng 102, 190–216 · `skills/acceptance/SKILL.md` dòng 29 ·
`feature-loop/workflows/acceptance-verify.js` (khối machine, `exitCode`, `INFRA_EXITS`) ·
`feature-loop/scripts/s4-args.mjs` · `skills/acceptance/references/tool-kill-rule.md` ·
`_acceptance/lan-doc-status-not-run/` · `_acceptance/release-2-14-0/contract.md` Notes §3 §4 ·
sổ nhớ phiên crm-onehub (`hai-lenh-cong-dua-nhau` · `feature-loop-carry-va-rang-agent` ·
`do-trong-cay-chung-la-do-ban` · `onehub-merge-va-cong-ci` · `phep-do-xanh-chua-chac-do-dung`) ·
oneflow `_acceptance/skill-system-v1/` (sổ `-10` `-11` `-17` `-22` `-23` `-24`, `usage-report.md`) ·
`docs/findings/2026-09-17-quan-sat-r1-ba-dinh.md` · `2026-09-16-truy-nguyen-thuoc-khong-co-cua.md` ·
`2026-09-17-boi-canh-truoc-va-sau-R.md`.
