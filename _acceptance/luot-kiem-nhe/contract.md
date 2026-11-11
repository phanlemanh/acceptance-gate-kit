---
schema_version: 1
feature: Lượt kiểm tự động của kho kit nhẹ đi mà vẫn tin được — bộ kiểm chạy theo mảnh song song trên PR, giữ một lượt chạy trọn trên nhánh chính; bộ chạy kiểm tự xưng và tự so phiên bản Node với lời khai của kho; bảng thời gian từng ca do máy sinh trong chính lượt chạy; ba ca chậm nhất chạy nhanh hơn mà giữ nguyên điều chúng khẳng định
slug: luot-kiem-nhe
owner: phanlemanh@gmail.com
risk_tier: T2      # chạm .github/workflows/gate.yml, tests/**, .nvmrc — không tệp nào khớp t3_paths
surfaces: [ci]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: docs/superpowers/specs/2026-11-11-luot-kiem-nhe-design.md
---

# Acceptance Contract: luot-kiem-nhe

## Context

Lượt kiểm tự động của kho chạy năm bộ kiểm nối đuôi trong một việc, trung vị 58 phút; mỗi lần đẩy, ghim lại hay gộp
nhánh chính vào nhánh làm việc là một lượt, và đoạn ký→gộp chờ đúng lượt ấy. Đo lúc mở vòng (ô cơ hội): ba ca P161,
LM13, LM20 chiếm 20–24 phút mỗi lượt, nên chỉ chia mảnh thì lượt PR còn ~16–20 phút. Người hưởng: chủ kho và các
phiên máy sửa kit (phút chờ mỗi lượt, phút máy mỗi kết quả gộp). Trace: North Star (thước làm-xong→gộp-được, phút máy
trên mỗi kết quả gộp) và nguyên tố 2 (bộ chạy nói ra nó chạy trên Node nào thay vì để tệp ghim làm lời dặn).

Source input: `_acceptance/luot-kiem-nhe/opportunity.md` (Cổng Đáng ký 11/11) · design doc ở frontmatter ·
`_acceptance/ha-tang-khong-dot-luot/` (cơ chế chia mảnh, giới hạn P161).

Mọi ca mới ở tệp `tests/scripts/luot-kiem-nhe.test.mjs`, tên ca mang mã AC (`LKN-AC<n>`). Fixture do code sinh trong
lượt; đường dẫn suy từ vị trí tệp ca; mỗi phép đo có cặp hai chiều trên cùng fixture.

## Criteria

- AC-1: Given `.github/workflows/gate.yml` thật và hai bộ chạy thật, When đọc các lệnh của việc mảnh chạy trên
  `pull_request`, Then tập lệnh gồm đúng `scripts --manh bash`, `scripts --manh mjs:i/n` cho mọi i = 1…n (n rút từ chính
  gate.yml), `plugins --manh vung:k` cho mọi k = 1…K (K = số marker vùng trong bộ chạy plugin thật), bộ móc, bộ
  workflows, bộ điều phối và bước bản đồ; và danh sách tệp mjs của các mảnh (chế độ in danh sách của bộ chạy) rời nhau
  từng đôi, hợp bằng đúng tập của lượt trọn. Chiều đỏ: bản sao gate.yml bỏ mảnh `mjs:<n>/<n>` → đỏ «mảnh thiếu:
  mjs:<n>/<n>»; bản sao thêm `vung:<K+1>` → đỏ «mảnh không có: vung:<K+1>».
- AC-2: Given gate.yml thật, When đọc việc `tests` trên sự kiện đẩy lên nhánh chính, Then nó chạy trọn năm bộ (script,
  móc, plugin, workflows, điều phối) và bước bản đồ, không lệnh nào mang `--manh` hay đặt `SCRIPTS_SHARD` /
  `PLUGINS_SHARD`. Chiều đỏ: bản sao thêm `--manh bash` vào lệnh bộ script của việc trọn → đỏ «lượt trọn bị chia mảnh»;
  bản sao gỡ bộ plugin khỏi việc trọn → đỏ «lượt trọn thiếu bộ: plugins».
- AC-3: Given gate.yml thật, When đọc việc `tests` trên `pull_request`, Then việc có tên hiển thị `tests`, cần (`needs`)
  việc mảnh, chạy kể cả khi mảnh đỏ (`if: always()`), và đỏ khi kết quả việc mảnh khác `success`; việc `gate` giữ tên.
  Chiều đỏ: bản sao gỡ `always()` → đỏ «việc gom bị bỏ qua khi mảnh đỏ — PR đỏ vẫn gộp được»; bản sao gỡ `needs` →
  đỏ «việc gom không chờ mảnh».
- AC-4: Given `tests/bo-chay.sh` và ma trận viết trước mười hai hàng (lời khai × Node đang chạy, Node giả bằng một tệp
  `node` đặt đầu PATH) — khớp: `24`×`24.22.0` · `v24`×`24.22.0` · `24.22`×`24.22.0` · `24.22.0`×`24.22.0`; lệch:
  `22`×`24.22.0` · `24`×`22.11.0` · `24`×`18.20.0` · `24.21`×`24.22.0` · `24.15.0`×`24.22.0`; vắng: không có `.nvmrc`;
  không đọc được: `.nvmrc` rỗng · `lts/*` — When gọi kiểm Node với gốc là thư mục fixture, Then bốn hàng khớp thoát 0 và
  in đúng một dòng `node: v<đang chạy> · kho khai <lời khai> (.nvmrc) · khớp`; năm hàng lệch thoát 3 với `node lệch:
  đang chạy v<…>, kho khai <…> (.nvmrc)`; hàng vắng thoát 3 với «kho chưa khai phiên bản Node»; hai hàng không đọc được
  thoát 3 với «không đọc được lời khai». Số khẳng định = số hàng (12). Hàng `24.21`×`24.22.0` cô lập phép so hai số
  (bản so chỉ số chính sẽ xanh sai ở đúng hàng này). Đối chứng dương: kho thật (`.nvmrc` thật, `node` thật) khớp.
- AC-5: Given một tệp `node` giả đặt đầu PATH báo số chính khác lời khai của kho, When chạy từng bộ chạy bash (script,
  móc, plugin, workflows), Then mỗi bộ thoát 3 với thông điệp «node lệch» trước khi in dòng ca nào. And với MỌI việc
  (job) của gate.yml — tập rút từ chính tệp — bước đầu tiên dùng Node sau `actions/setup-node` là một trong bốn bộ chạy
  hoặc bước `bash tests/bo-chay.sh node`; ca in danh sách việc đã xét và việc nào đi đường nào; lệnh bước kiểm rút từ
  gate.yml chạy dưới Node giả thoát 3. Đối chứng dương trên cùng bốn bộ chạy: Node giả báo đúng số chính của lời khai →
  dòng đầu bộ chạy in ra là dòng `node: … · khớp`. Chiều đỏ: bản sao bộ chạy plugin gỡ dòng gọi kiểm Node → ca đỏ «bộ
  chạy không kiểm Node: plugins»; bản sao gate.yml gỡ bước kiểm của việc `design-eval` → đỏ «việc không kiểm Node:
  design-eval»; bản sao gate.yml thêm một việc mới chạy `node -v` không có bước kiểm → đỏ «việc không kiểm Node: <tên>».
- AC-6: Given `.nvmrc` ở gốc kho và gate.yml thật, When đọc mọi bước `actions/setup-node` của mọi việc, Then mỗi bước
  đọc `node-version-file: .nvmrc` và không bước nào ghi `node-version:`; `.nvmrc` có một dòng là số phiên bản. Chiều
  đỏ: bản sao gate.yml đổi một việc về `node-version: '22'` → đỏ «việc <tên> ghi tay phiên bản Node».
- AC-7: Given bộ chạy chạy trên fixture sinh trong lượt (ca giả có ca ngủ 2 giây và ca thoát ngay), When chạy bộ
  script (một mảnh mjs và mảnh bash), bộ plugin (một vùng), bộ móc, bộ workflows, Then mỗi lượt ghi
  `.acceptance-runs/thoi-gian-ca/<bộ>-<mảnh>.tsv` với số hàng bằng số dòng kết quả ca bộ chạy in (`PASS:`/`FAIL:`, hay
  tiêu đề tệp ở bộ workflows), hàng của ca ngủ có thời gian ≥ 2 giây và đứng đầu danh sách chậm nhất in cuối lượt, còn mọi ca thoát ngay có
  thời gian < 1 giây và không đứng đầu (dưới ngưỡng thì không lên đầu). And
  trên bộ chạy THẬT (bộ móc trọn; bộ plugin vùng có ít ca nhất), số hàng tệp tsv bằng số dòng `PASS:`/`FAIL:` bộ chạy
  in, ca in cả hai số. Chiều đỏ: bản sao `bo-chay.sh` bỏ lần ghi hàng trong hàm ghi đạt → đỏ «bảng thiếu hàng: <bộ> có
  N ca, M hàng».
- AC-8: Given `tests/bo-chay.sh` với biến môi trường của lượt kiểm tự động (`GITHUB_ACTIONS=true`, `GITHUB_STEP_SUMMARY`
  trỏ tệp tạm), When một lượt kết thúc, Then tệp tóm tắt nhận một bảng tối đa 15 hàng chậm nhất có tên bộ và mảnh, và
  nhật ký có nhóm thu gọn chứa trọn bảng; không đặt hai biến ấy → không tệp tóm tắt nào bị ghi. Chiều đỏ: bản sao bỏ
  nhánh tóm tắt → đỏ «lượt kiểm tự động không có bảng thời gian».
- AC-9: Given cây hiện tại và bản cũ của hai tệp ca rút từ điểm rẽ khỏi nhánh chính, When chạy ca P161 và ca LM13, LM20
  bằng bản cũ và bản mới trên cùng cây, Then dòng kết quả của từng ca (dòng tóm tắt `P161 OK: …`, dòng `PASS:` của LM13
  và LM20) bằng nhau, và thời gian hai bản in ra cạnh nhau. Chiều đỏ, cả hai bản trên cùng fixture: (a) một hồ sơ mà thẻ
  hỏng ở đúng MỘT cổng (cổng 2) → hai bản P161 đỏ cùng thông điệp; bản sao bản mới bỏ «cổng» khỏi khoá nhớ → đỏ
  «khoá nhớ gộp hai cổng»; (b) kho fixture có một hồ sơ lệch tập cờ đã định đoạt → hai bản LM13 đỏ cùng tên hồ sơ;
  (c) kho fixture có một hồ sơ lệch bảng định tuyến → hai bản LM20 đỏ cùng tên hồ sơ.

## Coverage

Quét Zwicky rút gọn (preset test-matrix), đầy đủ ở design doc §3.

- **Trục 1 — sự kiện × việc** [thước CE: hai kiểm bắt buộc `gate`, `tests` đọc từ API bảo vệ nhánh chính — SUY-TỪ-REPO;
  NGÀNH: GitHub Actions — việc bị bỏ qua tính là đạt khi xét kiểm bắt buộc]: PR → mảnh (AC-1) · PR → việc gom `tests`
  (AC-3) · đẩy nhánh chính → việc trọn (AC-2) · `gate` giữ tên (AC-3).
- **Trục 2 — lời khai × Node đang chạy** [thước CE: cú pháp `.nvmrc` mà `actions/setup-node` nhận — NGÀNH]: mười hai
  hàng của AC-4 — đủ ba độ chính xác khai (một, hai, ba số) mỗi độ có hàng khớp và hàng lệch, cộng ô gốc của lớp lỗi
  (khai 24, chạy 22); nguồn khai duy nhất (AC-6).
- **Trục 3 — nơi kiểm Node** [SUY-TỪ-REPO: `.github/workflows/gate.yml`]: bốn bộ chạy bash · mọi việc của gate.yml,
  đơn vị là việc (job) (AC-5). Hai việc có bộ chạy riêng (`design-floor`, `design-eval`) kiểm bằng một bước trong
  gate.yml, không sửa bộ chạy của chúng.
- **Trục 4 — đơn vị đo thời gian × môi trường**: tệp mjs · lần ghi đạt/trượt · tệp workflows (AC-7) × máy cá nhân ·
  lượt kiểm tự động (AC-8).
- **Trục 5 — ba ca chậm × tính chất**: kết quả bằng bản cũ · cùng đỏ khi hỏng ở đúng một cổng · khoá nhớ không gộp cổng
  · LM13 và LM20 mỗi ca một chiều đỏ (AC-9).
- `[GIẢ ĐỊNH]` Số phút sau khi đổi là đại lượng máy, không ghim thành ca; đường đo thật là lượt kiểm tự động của PR
  vòng này (mục Đường đo).

## Đường đo

- Phút lượt kiểm của PR (từ lúc việc đầu bắt đầu tới lúc việc `tests` xong) trên lượt thật của PR vòng này, đặt cạnh
  58 phút: số từ API các việc của lượt · AC bảo đảm: AC-1, AC-3, AC-9.
- Phút lượt trọn trên nhánh chính sau khi gộp: số từ API lượt đẩy đầu tiên sau gộp · AC bảo đảm: AC-2, AC-9.
- Tổng phút máy của lượt PR (cộng thời lượng mọi việc, gồm phần chuẩn bị mỗi việc), đặt cạnh tổng phút máy của lượt nền
  (57–67′ ở hai lượt đã đo): số từ API các việc · AC bảo đảm: — (đếm, không phải vật). Chia mảnh nhân phần chuẩn bị lên
  mỗi việc, nên số này có thể không giảm dù giờ đồng hồ giảm — báo cả hai.
- Ca P161 trên lượt kiểm của PR: ngưỡng ≤ 6′ (nền 13–16′), đọc từ bảng thời gian của việc vùng 2 · AC bảo đảm: AC-9.
- Bảng ca chậm nhất: tóm tắt các việc của lượt PR · AC bảo đảm: AC-7, AC-8.
- Ca lệch Node đỏ, khớp im: AC-4, AC-5 trong bộ kiểm.

## Out of scope

- Cắt mốc 2.39 (làn V, làm sau, có phần chỉ-bớt riêng).
- Đổi bố cục thư mục, đổi tên plugin hay lệnh; tách các tệp kiểm lớn hay tách kiểm theo plugin.
- Đổi điều mà bất kỳ ca nào khẳng định, đổi corpus ba ca chậm quét, hay mọi thứ đổi phán quyết của một hồ sơ đã ký.
- Huỷ lượt cũ của cùng PR khi đẩy lượt mới (concurrency) — ghi hạt giống.
- Chia mảnh mjs theo thời gian đo thay cho theo thứ tự tệp; đổi hàm chọn mảnh mà lượt chấm đang dùng.
- Sửa hai bộ chạy riêng của `design-floor` và `design-eval` — hai việc ấy kiểm Node bằng một bước trong gate.yml.
- Giảm số lượt kiểm đỏ (21/60) — vòng này làm mỗi lượt ngắn lại, không tìm vì sao lượt đỏ.

## Notes

- **Giới hạn khai trước:** so Node theo độ chính xác lời khai — khai số chính thì `24.21` và `24.15` cùng khớp, nên lớp
  «đỏ trên 24.21, xanh trên 24.15» không bị chặn; nó chỉ được gọi tên nhờ dòng tự xưng in đủ phiên bản.
- **Giới hạn khai trước:** trên máy cá nhân (bash 3.2) bảng thời gian có độ phân giải giây; khối kiểm không ghi đạt/trượt
  thì thời gian của nó cộng vào ca ghi kế tiếp.
- **Giới hạn khai trước:** bộ điều phối chạy thẳng `node --test`, nên không có bảng của `bo-chay.sh`; thời gian từng ca
  của nó là `duration_ms` mà `node --test` in.
- Ngưỡng mở lại giới hạn vùng 2 của hồ sơ `ha-tang-khong-dot-luot` (vùng 2 > 480 s máy rảnh) đã chạm — trên máy lượt
  kiểm tự động P161 mất 800–950 s; AC-9 là chỗ vòng này trả nó.
