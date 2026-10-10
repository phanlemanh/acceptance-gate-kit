---
schema_version: 1
feature: Gói `dieu-phoi` của kit — lõi Điều phối – Thợ (bộ phát lịch, CLI đợt, 4 hook) chuyển từ crm vào kit, bật bằng cách cài gói theo kho, im ở kho không có đợt, chạy tiếp được đợt do bản crm mở
slug: dieu-phoi-dong-goi-loi
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, ci]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-09-dieu-phoi-tho-trong-kit-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-10T00:12:16Z
---

# Acceptance Contract: dieu-phoi-dong-goi-loi

## Context

Hàng DP1 của ô dù `dieu-phoi-tho-trong-kit` (Cổng Đáng: build, 09/10). Lõi Điều phối – Thợ đang sống
trong kho crm (`scripts/dieu-phoi/`, 14 tệp mã, 84 ca test; hồ sơ crm `dieu-phoi-hai-tang` ký 07/10).
Muốn kho thứ hai (OneFlow) dùng thì phải chép mã. Vòng này đưa lõi vào kit thành gói thứ tư
`dieu-phoi`: kho bật bằng cách cài gói ở phạm vi dự án, không gắn tay gì vào `.claude/settings.json`.
Vòng này không thêm lệnh `/dieu-phoi:…`; mở, tiếp tục và bàn giao là các hàng DP2–DP4.

Source input: prompt chủ kho 09/10 + spec `docs/superpowers/specs/2026-10-09-dieu-phoi-tho-trong-kit-design.md`
(Phần I §2, Phần II §8–§11) + mã crm `origin/onehub` `a9e8bc75a` (lần đổi cuối của lõi: `5a2432153`).

Thuật ngữ:
- **gói** = thư mục `dieu-phoi/` của kit, có `.claude-plugin/plugin.json`.
- **thư mục đợt** = thư mục mà symlink `<checkout chính>/.acceptance-runs/dieu-phoi-hien-tai` trỏ tới.
- **kho thử** = kho git do chính ca kiểm dựng trong thư mục tạm, không phải kho thật nào.
- **lệnh S4** = như hồ sơ crm `dieu-phoi-hai-tang`: Workflow có `scriptPath` tới `acceptance-verify.js`,
  hoặc Bash có `repin-lane`, `s4-args` hay `duong-nen.mjs`.

## Criteria

- AC-1: Given marketplace của kit và cây `dieu-phoi/`, When đọc `.claude-plugin/marketplace.json`, `dieu-phoi/.claude-plugin/plugin.json` và `dieu-phoi/hooks/hooks.json`, rồi chạy từng lệnh hook mà `hooks.json` khai (thay `${CLAUDE_PLUGIN_ROOT}` bằng đường của gói) với một đầu vào mẫu của đúng sự kiện, Then marketplace có mục `dieu-phoi` trỏ `./dieu-phoi`; `plugin.json` mang phiên bản bằng phiên bản của `feature-loop`; tập bộ ba (sự kiện, matcher, tệp thân hook) rút từ `hooks.json` bằng đúng bảng viết sẵn {(PreToolUse, `Workflow|Bash`, `hook-chan-s4.mjs`), (PostToolUse, `*`, `hook-nhip.mjs`), (Notification, `idle_prompt|permission_prompt`, `hook-cho-nguoi.mjs`), (UserPromptSubmit, không matcher, `hook-cho-nguoi.mjs`)}; mỗi lệnh tìm được tệp thân trong gói (không lệnh nào thoát 127 hay báo thiếu tệp). Và bộ kiểm gói của Claude Code (`claude plugin validate --strict dieu-phoi`) không báo lỗi; bản sao bỏ lớp `hooks` ngoài cùng của `hooks.json` thì bộ kiểm báo lỗi nêu `hooks`.
- AC-2: Given gói ở ba kho thử — kho trống, kho có `_acceptance/`, kho có đợt đã đóng (symlink đã gỡ) — When mỗi lệnh hook nhận đầu vào của sự kiện của nó, gồm cả lệnh S4 thật (Workflow tới `acceptance-verify.js`, Bash `repin-lane`), Then mọi lệnh thoát 0, stdout rỗng, stderr rỗng, và băm cây tệp của kho thử trước và sau bằng nhau; số ô đo bằng một hằng viết sẵn trong ca. Đối chứng dương cho TỪNG lệnh, trên kho có đợt đang chạy và phiên thuộc một dãy: PreToolUse với lệnh S4 chưa có lượt → thoát 2, stderr bắt đầu `chan-s4: khoá s4`; PostToolUse khi phiên giữ một khoá → tệp `nhip` của khoá đổi; Notification `idle_prompt` → tệp `cho-nguoi/<phiên>.json` được ghi; UserPromptSubmit sau đó → tệp ấy bị xoá.
- AC-3: Given 14 tệp test của lõi chép từ crm `a9e8bc75a` vào kit, When CI của kit chạy bước mà `.github/workflows/gate.yml` khai cho gói, Then bước đó chạy trọn 84 ca trở lên, thoát 0 và không ca nào bị bỏ qua; và lệnh rút từ chính `gate.yml` chạy trên bản sao có một ca bị tiêm lỗi thì thoát khác 0, nêu tên ca.
- AC-4: Given bản chụp thật thư mục đợt crm đang chạy (khuôn 07/10, chụp 09/10), ẩn danh bằng một script trong cây (tập khoá JSON trước và sau ẩn danh bằng nhau, chỉ giá trị đổi), có ít nhất một khoá còn hạn ở giờ chụp và ít nhất một đơn trong `xin/`, When chép vào một kho thử rồi chạy `xem` của gói và một nhịp bộ phát lịch của gói, Then `xem` in đúng tên đợt, khoá đang giữ và số đơn chờ của bản chụp; nhịp không phát sự kiện `loi-nhip`; khoá còn hạn vẫn giữ. Chiều đỏ trên cùng bản chụp: xoá `han_thue_phut.merge` khỏi cấu hình → nhịp phát `loi-nhip` nêu `han_thue_phut`.
- AC-5: Given một đợt đang chạy mà `phat-lich.pid` trỏ một tiến trình còn sống do bản khác dựng, When chạy `chay` của gói, Then lệnh in `bộ phát lịch đang chạy (pid <N>)` và không sinh tiến trình nào. Given `.claude/settings.json` của kho còn khối hook gọi `scripts/dieu-phoi/`, When chạy `xem`, Then đầu ra có thêm một dòng cảnh báo nêu tên tệp settings và việc phải gỡ; settings không có khối đó thì không có dòng cảnh báo.
- AC-6: Given một bản chép CHỈ gồm thư mục `dieu-phoi/`, đặt ngoài cây kit và không có `node_modules` ở thư mục tổ tiên (như bộ nhớ đệm gói), When chạy từ bản chép mọi lệnh hook rút từ `hooks.json` cùng `mo`, `chay`, `xem`, `dong` và một nhịp bộ phát lịch trên một kho thử, Then mã thoát của mỗi lệnh bằng mã thoát của cùng lệnh chạy từ cây nguồn, stderr không có `Cannot find module` hay `ERR_MODULE_NOT_FOUND`; hook chặn S4 gặp lệnh S4 chạy nền chưa bọc (phiên đang giữ khoá) thì dòng lệnh bọc trỏ tới `giu-nhip.mjs` nằm trong đúng bản đang chạy, và tệp đó tồn tại. Chiều đỏ: bản sao chèn một import `../../feature-loop/…` vào `dieu-phoi.mjs` → bản trong cây kit vẫn chạy, bản chép đỏ và nêu tên tệp. Và khuôn `dieu-phoi/scripts/mau/LUAT.md` cùng `dieu-phoi/README.md` không chứa chuỗi `scripts/dieu-phoi/`.
- AC-7: Given cây `dieu-phoi/` và cây `tests/dieu-phoi/fixtures/`, When quét danh sách chuỗi riêng của crm (`onehub`, `crm`, `prisma`, `bunx`, `bun run`, `bun install`, `:3000`, `:3001`, `5432`, `docs/plan/dot-`), Then không dòng nào khớp. Chiều đỏ: tiêm `onehub` vào bản sao một tệp của gói → ca đỏ nêu tệp và số dòng.
- AC-8: Given marketplace của kit có mục `dieu-phoi` và một kho thử trống, When chạy bước khai gói của `acceptance-init` (`scripts/plugin-declare.mjs`) và đọc hai khối khai gói (INIT-PLUGIN-DECLARE, GUIDE-PLUGIN-DECLARE), Then `dieu-phoi@acceptance-gate-kit` KHÔNG nằm trong `enabledPlugins` của kho thử và không nằm trong hai khối; ca PD6 so tập (marketplace trừ các gói bật-theo-lựa-chọn) ∪ superpowers. Chiều đỏ: bản sao bỏ dấu «bật theo lựa chọn» của `dieu-phoi` → kho thử bị bật gói, ca đỏ nêu tên gói.
- AC-9: Given bốn manifest của kit, When chạy phép kiểm đồng bộ phiên bản (P200) và vùng quét chép-bộ-giải (P33), Then P200 đọc cả `dieu-phoi/.claude-plugin/plugin.json` và câu «Khớp phiên bản» của GUIDE có `dieu-phoi`; P33 quét cả cây `dieu-phoi/`. Chiều đỏ: bản sao lệch phiên bản `dieu-phoi` → P200 đỏ nêu `dieu-phoi`; bản sao chép một bản `resolve-plugin.mjs` vào `dieu-phoi/` → P33 đỏ.
- AC-10: Given hook chặn S4 trong một đợt đang chạy, khoá s4 không thuộc phiên gọi, When nhận các lệnh Bash `node --test tests/scripts/repin-lane-lop-cu.test.mjs`, `node --test tests/scripts/s4-args-tran-thuoc.test.mjs`, `grep -n s4-args feature-loop/skills/feature-loop/SKILL.md`, Then thoát 0 không stderr (chiều im); còn `node feature-loop/scripts/repin-lane.mjs --root . --write`, `node <bất kỳ>/scripts/s4-args.mjs …`, `node <…>/duong-nen.mjs …` và Workflow tới `acceptance-verify.js` thì thoát 2 như AC-5 của hồ sơ crm. Phân loại bằng cấu trúc lời gọi (đối số script của `node`, `scriptPath` của Workflow), không so chuỗi con; một hàm của lõi, xuất ra để lớp mod (DP6) dùng lại.
- AC-11: Given một đợt đang chạy với bộ phát lịch đã khởi bằng `chay`, When thư mục gói bị xoá hoặc thay (như lúc nâng gói giữa đợt), Then bộ phát lịch và lệnh bọc giữ nhịp vẫn chạy vì `chay` đã chép lõi vào thư mục đợt kèm phiên bản; nếu bản chép cũng mất thì bộ phát lịch KHÔNG cấp lại khoá nào và phát `can_phan` nêu «lõi vắng». Chiều đỏ: bản sao bỏ bước chép (bộ phát lịch chạy từ chính gói) → xoá gói làm bộ phát lịch ngừng cấp và phát «lõi vắng» ngay, ca «chạy tiếp sau khi xoá gói» đỏ nêu «lõi vắng».
- AC-12: Given khoá s4 của kho đang được giữ, When tới nhịp `git fetch` của bộ phát lịch, Then bộ phát lịch bỏ lượt fetch (ghi một dòng sự kiện), để `origin/<nhánh chính>` không dời giữa một lượt chấm; khoá trống thì fetch như cũ.

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix.

- Chân sản phẩm: [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-09-dieu-phoi-tho-trong-kit-design.md] và hồ sơ crm `dieu-phoi-hai-tang`.
- Chân ngành: [NGÀNH: hệ gói của Claude Code — `hooks/hooks.json` dùng `${CLAUDE_PLUGIN_ROOT}`, bật theo phạm vi dự án].

Trục:
- Trục A · điểm chạm của lõi: PreToolUse(Workflow) | PreToolUse(Bash) | PostToolUse | Notification | UserPromptSubmit | CLI (`mo`, `chay`, `dung`, `dong`, `xem`) | nhịp bộ phát lịch. [thước CE: `hooks.json` của gói + bốn khối hook trong `.claude/settings.json` của crm]
- Trục B · trạng thái kho: chưa cài gói | cài, không đợt | cài, đợt đang chạy do gói mở | cài, đợt do bản crm mở | cài và còn hook cũ trong settings | đợt đã đóng. [thước CE: vòng đời đợt ở spec 05/10 §4.12 + ca chuyển của crm]
- Trục C · đầu vào: hợp lệ | khuôn hỏng (cấu hình, hàng việc, trả lời) | cwd ở thư mục con hay qua symlink | phiên không thuộc dãy nào. [thước CE: 84 ca test crm + các sự cố trong Nhật ký đợt `sau-14-10`]
- Trục D · chỗ gói nằm: cây nguồn kit | bộ nhớ đệm gói. [thước CE: luật kit «đường dẫn suy từ vị trí script»]

Phân loại (lát cắt theo trục B):
- **Core:** B=cài, không đợt / đợt đã đóng → AC-2 · B=đợt do gói mở → AC-3 · B=đợt do bản crm mở → AC-4 · B=hai bản → AC-5 · D → AC-6 · ranh giới «không gì riêng crm» → AC-7 · cài là đủ → AC-1.
- **Later:**
  - Chi phí mỗi lời gọi công cụ khi hook chạy (crm đã chạy thật ba ngày, chưa ai báo chậm).
  - Kiểm phiên bản `dieu-phoi` đi theo mốc phát hành trong răng mốc (P1 của chiến dịch phát hành).
- **Never:**
  - B=chưa cài gói. Nền tảng không nạp gói chưa cài, nên không có gì để đo.
  - Hệ điều hành ngoài macOS. Ngoài phạm vi của ô dù.
- **Cross-cutting:** C=cwd thư mục con hay qua symlink, và C=khuôn hỏng, đã có ca trong 84 ca của crm (AC-3 mang chúng sang).

## Out of scope

- Lệnh `/dieu-phoi:mo-dot`, `/dieu-phoi:tiep-tuc`, `/dieu-phoi:ban-giao` — hàng DP2, DP3, DP4.
- Lệnh con ghi vào thư mục đợt qua CLI (sự cố ghi bị chặn ngày 09/10) — hàng DP3.
- Đọc mức dùng, báo trước hạn mức — hàng DP4.
- Gỡ bản `scripts/dieu-phoi/` và bốn khối hook ở crm — việc của crm, phiên giám sát crm làm ở quãng lặng.
- Sửa hành vi của lõi, TRỪ bốn chỗ soát tổng thể 10/10 chỉ ra là gãy ngay khi chuyển (AC-8, AC-10, AC-11, AC-12). Ngoài bốn chỗ đó vòng chỉ chuyển chỗ; bài học của đợt `sau-14-10` (tự gắn `mo_merge`, giữ hàng gộp khi hoá cũ…) chỉ vào khi đợt thử OneFlow vấp đúng nó.
- Hệ điều hành ngoài macOS.

## Notes

- Nguồn ghim: crm `origin/onehub` `a9e8bc75a`. Trước khi gộp, so lại `git -C <crm> diff a9e8bc75a origin/onehub -- scripts/dieu-phoi/`. Có khác thì đưa phần khác vào, hoặc ghi nó vào ghi chú chuyển cho crm.
- Fixture của AC-4 là bản chụp thật, không viết tay đúng khuôn bên đọc. Đây là ca đọc-cũ, nên vật đo phải là vật bản cũ sinh ra.
- Phiên bản gói theo dòng phiên bản kit, như `feature-loop`.
- Ghi chú chuyển cho crm là một vật máy quét được: lệnh `xem --kiem-chuyen` liệt kê mọi chỗ trong kho còn trỏ `scripts/dieu-phoi/` (settings, hook git, LaunchAgent kiểm chéo, `package.json`, eval của hồ sơ đã ký, `LUAT.md` của đợt đang chạy). Lõi xuất API công khai (`dot.mjs`, `hook-nhip.mjs`) cho lượt kiểm chéo ban đêm của crm nạp qua bộ giải.
- Từ lúc DP1 gộp, lõi ở crm đóng băng: bản vá mới vào gói kit, không vào `scripts/dieu-phoi/` của crm.
- Giới hạn đã khai: vế `claude plugin validate` của AC-1 cần CLI Claude Code trên máy chấm. CI của kit không có CLI này, nên vế ấy chỉ chạy ở lượt chấm trên máy (eval E1b ghi kèm phiên bản CLI). Vế khuôn còn lại của AC-1 chạy cả ở CI.
- **Known limits (Cổng Bằng chứng, ký 10/10, owner định tuyến «ghi Known limits»):** test lõi chép từ crm
  còn mang tên nhánh và đường riêng của crm, vùng quét AC-7 không phủ chúng (Ngoài-1) · vế «khoá s4 đang
  giữ không bị cấp lại» của DP1-11 không thể đỏ vì không có đơn s4 nào xếp hàng (Ngoài-2, Ngoài-8) · kiểm
  pid sống tin mọi tiến trình mang pid đó, pid bị dùng lại thì `chay` từ chối và `dung`/`dong` gửi tín
  hiệu nhầm (Ngoài-6) · E3 so tổng số ca đạt nên mất một nhóm ca lõi vẫn xanh (Ngoài-7) · DP1-04 an-danh
  lấy danh sách tệp và luật đổi tên khoá từ chính module bị đo (Ngoài-9). Sổ:
  `docs/research/known-limits-ledger.tsv`.
- **Mở hợp đồng mới (Cổng Bằng chứng, ký 10/10):** Ngoài-3 (duyệt chạm tệp khi không dò được nhánh mở),
  Ngoài-4 (nhánh của chính phiên bị coi là xung đột), Ngoài-5 (tệp lạ trong `khoa/` làm tắt nhịp) và lỗ
  `machine-cleared` của bộ đọc tiến độ (sổ d-…-19) — ghi hạt giống
  `docs/plans/2026-10-10-hat-giong-loi-dieu-phoi-chuyen-nguyen-tu-crm.md`, không tạo ô.
