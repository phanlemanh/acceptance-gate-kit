# Thiết kế — khuon-loi (hàng KH1, mốc 2.37.0)

## 1. Một kết quả

Kho đã khai bản đồ khuôn (`design/patterns/<nhóm>.md`) được kit chấm vật theo khuôn ở bước chấm, bằng một bộ đọc
mà luật lint của chính kho cũng gọi được: vòng dựng màn ngoài khuôn bị trả lại, gọi đúng tên tệp và khối. Kho không
khai bản đồ thì kit không đổi một byte hành vi.

Người hưởng: kho giao diện thứ ba có răng khuôn mà không phải tự dựng lại bộ đọc, răng và số đo, như hai kho thử đã làm
(nguyên tố 2: bằng chứng không tự dối). Hai kho thử dần bỏ được bộ quét tự viết.

Gốc: `crm/_acceptance/khung-chung-ngan-ban-ghi/` (BK1 đã ký) · finding `docs/findings/2026-10-30-ui-dong-nhat-giua-cac-man.md`
§11 · bản phạm vi `docs/plans/pham-vi-ban-do-khuon-kit-3110.md` · tri thức
`acceptance-gate-kit-tri-thuc:wiki/chu-de/ban-do-khuon.md#80a46d525b411191c17d03ff0795f34d34f2597f`.

## 2. Hai bản đồ thật, một lược đồ

Hai kho thử khai bản đồ theo hai cách (đọc 01/11, bản `d8daf37d7` của kho thứ nhất, `main` của kho thứ hai):

| | Kho thứ nhất (1 nhóm) | Kho thứ hai (8 nhóm) |
|---|---|---|
| YAML | mapping khối, thụt lề | một dòng mỗi khoá, `{…}` `[…]` |
| `nhan_dien` | sổ đăng ký: tệp host + danh sách `kind` | danh sách glob |
| Khoá riêng | `khe_tuy_chon`, `cam_ho`, `thay_cho`, `thanh_phan_tang_ngan`, `khuon.lop_trinh_bay` | `luat`, `don_vi` (`man` · `phan-tu`) |
| «Dùng khi / Không dùng» | không có | có, trong thân |
| Phiên bản | không | không |
| Đọc mã | `typescript` của kho | `typescript` của kho |

**Lõi lược đồ v1** (8 khoá chung của hai kho, cũng là 8 khoá hồ sơ BK1 đòi): `nhom` · `doi_tuong` ·
`khuon{ten, nhap}` · `nhan_dien` · `mau_dang_chay{tep}` · `khe_bat_buoc` · `cam_ngoai_khuon` ·
`ngoai_le[{tep, khoi, ly_do}]`. **Mở rộng có tên** (đọc được, không bắt buộc): `don_vi`, `cam_ho`, `thay_cho`,
`khe_tuy_chon`, `luat`, `nhan_viec` (L1), `lop_trinh_bay`, `thanh_phan_tang_ngan`. Khoá lạ → cờ vàng nêu tên khoá, không
đỏ.

`nhan_dien` lõi là danh sách glob. Dạng sổ đăng ký (đối tượng không có `tep:`) → nhóm mang nhãn «không đọc được ở
đây: nhan_dien dạng sổ đăng ký — thêm `tep: [glob]` để bước chấm biết tệp nào thuộc nhóm»; nhóm ấy không bị chấm, không
làm đỏ. Lý do: xếp tệp vào nhóm qua `kind` đòi cây mã của tệp host; kit không có (mục 6).

**Đỏ ở bước đọc (sai lược đồ):** thiếu khoá lõi · `ngoai_le` thiếu `ly_do` hay trỏ tệp không có · `cam_ho` có tên không
nằm trong `cam_ngoai_khuon` · `mau_dang_chay.tep` không có · hai nhóm cùng `nhom`. **Cờ vàng:** khoá lạ · thân thiếu
«Dùng khi» hay «Không dùng» (L2) · thiếu `nhan_viec` (L1). L1 và L2 chỉ là cờ vàng ở v1 để kho thứ nhất không đỏ ngay
khi nhận bản (luật «bộ đọc khoan dung + cờ vàng» trước «đổi mặc định»).

Khuôn tệp ở `skills/acceptance/references/ban-do-khuon-template.md` (marker `BAN-DO-KHUON-TEMPLATE`): lõi + khối mở
rộng có tên, thân có «Dùng khi», «Không dùng» và một ví dụ sai. `--tao <nhóm>` sinh tệp nhóm từ khuôn; bộ kiểm rút
khuôn từ marker (tiền lệ LS-01), không chép tay.

## 3. Ba tệp mới, không chạm `lib/`

| Tệp | Vai |
|---|---|
| `scripts/ban-do-khuon.cjs` | Bộ đọc dùng chung, CJS không phụ thuộc (kho `"type":"module"` gọi qua `createRequire`). Hàm: `docBanDo(text, tep)` → `{nhom, sai[], canh_bao[]}` · `docThuMuc(root, {ghim})` · `nhomCuaTep(banDo, tep)` · `lechTrongTep(nhom, tep, noiDung)` → cặp `{tep, khoi, loai, thay}` · `khongDocDuoc(...)`. CLI `--root <kho> --json` in bản đồ đã chuẩn hoá. Chỉ `require` các hàm `lib/evidence-core.cjs` đang export (`pathGlobToRe`, `parseFlowValue`, `stripYamlComment`) — không sửa lib. |
| `scripts/design-floor-khuon.mjs` | Lệnh khuôn. `--dem` (S0) · `--nap --slug` (S1, ghi `khuon-nap.json`) · `--kiem` (eval S4, chỉ đọc) · `--kiem --write --slug --den <sha>` (sau lượt chấm, ghi `khuon-cham.json`) · `--tao <nhóm>` · `--goi-y-eval --nhom <n>`. Tên theo finding §11.2. |
| `skills/acceptance/references/ban-do-khuon-template.md` | Khuôn tệp bản đồ (mục 2). |

Sửa: `scripts/gate-card.js` (Cổng Bằng chứng: một dòng + cờ vàng, mục 5) · `feature-loop/scripts/s4-args.mjs` (lưới
khuôn, mục 6) · `feature-loop/skills/feature-loop/SKILL.md` (khối mới `KHUON-S0`, `KHUON-S1`, `KHUON-SAU-S4`) · `skills/acceptance/references/ux-spec-template.md`
(mục «Thẻ việc», L1) · `GUIDE.md` §5.2 (nối `executors.design.khuon`) · `_acceptance/config.yaml` của kit (khoá ca đo).
Không chạm `lib/`, `hooks/`, `pre-merge-check.sh` → hạng giữ T2.

Kho nối bước chấm bằng tay như `executors.design.floor`:
`executors.design.khuon: "node <acceptance-gate>/scripts/design-floor-khuon.mjs --kiem --root ."` — không thêm khoá
cấu hình nào khác (finding §11.1 A2). `config:` phải là trọn lệnh của eval (`s4-args.mjs`), nên `--kiem` tự dò base
(`timBase` của `design-floor-s4.mjs`) và tự tìm hồ sơ của vòng: hồ sơ duy nhất có `khuon-nap.json` trong diff.

## 4. Bước chấm (`--kiem`)

Tệp vào chấm = tệp diff `base..HEAD` (cộng cây làm việc) khớp `nhan_dien` của ít nhất một nhóm, trừ `_acceptance/**`.

1. **Nhóm màn** (`don_vi` vắng hay `man`): tệp phải nhập `khuon.ten` và có thẻ `<Ten`; không được nhập (tên gốc, kể cả
   đổi tên bằng `as`, nhập mặc định, truy cập `ns.Ten` sau `import * as ns`) khối trong `cam_ngoai_khuon`, hay khối mở
   bằng một tên của `cam_ho` rồi một chữ hoa. Mỗi lệch là một cặp `(tệp, khối)`; dòng in kèm nhóm và `thay_cho` nếu có.
2. **Nhóm phần tử** (`don_vi: phan-tu`): mỗi thẻ `<Ten …>` trong tệp phải có đủ thuộc tính của `khe_bat_buoc`
   (`children` = thẻ không tự đóng); cấm như nhóm màn.
3. **Quan hệ một nhóm:** tệp khớp `nhan_dien` của từ hai nhóm màn trở lên → đỏ nêu tên các nhóm. Nhóm phần tử được
   chồng. Tệp diff khớp `design.surface_globs` (khoá có sẵn) mà không thuộc nhóm màn nào → một dòng đếm «k tệp giao
   diện ngoài bản đồ», không đỏ (xếp màn mới vào nhóm là việc của người — giới hạn đã khai).
4. **Nợ cũ theo cặp và số lần:** chạy cùng phép kiểm trên bản `base` của từng tệp; mỗi cặp `(tệp, khối)` mang số lần
   xuất hiện. Cặp có ở base với số lần không tăng là nợ cũ, in nhãn, không đỏ; số lần tăng → lệch mới «tăng a → b»
   (gap-probe P0: chỉ đếm cặp thì dán thêm ba chỗ khối cấm vào tệp đã có nợ vẫn ra «0 lệch mới»). Cặp có dòng
   `ngoai_le` với `ly_do` không rỗng → im. Kho thứ hai đo được 7 mục xanh sai khi chấm theo dòng đổi (xoá dòng khe,
   lệch dòng 1, dạng `export default` khác); đếm theo cặp và số lần không phụ thuộc dòng nào đổi — cùng hình dạng bảng
   nợ `{tep, dau_hieu, so}` kho thứ nhất đã dùng.
5. **Không đọc được thì không chặn:** nhóm `nhan_dien` dạng sổ đăng ký · thẻ phần tử mang `{...spread}` (không biết
   khe) · tệp vùng có `import(` hay `require(` động → dòng «không đo được: <tệp> — <lý do>», thoát 0.
6. **Bản ghim:** hồ sơ có `khuon-nap.json` → đọc từng tệp bản đồ ở băm đã ghim (`git cat-file`); bản trên cây khác băm
   ghim → một dòng «bản đồ nhóm X đổi sau khi ghim — chấm theo bản ghim». Nhóm chưa ghim (vòng vừa thêm) → bản trên cây.

Thoát: 0 khi không có lệch mới và bản đồ không sai lược đồ · 1 khi có · 2 khi gọi sai. Không có `design/patterns/` → im,
thoát 0. Bước chấm CHỈ ĐỌC (luật không ghi sau S4); `--write` chạy ở phiên chính sau lượt chấm, đúng nếp
`luat-san-pham.cjs --quet --write`.

## 5. Số đo và thẻ

`khuon-cham.json` (bước sau lượt chấm): `{schema, den, base, ghim, theo_khuon, lech_moi[], no_cu[], khong_do[],
ngoai_ban_do, nhom[]}`. Thẻ Cổng Bằng chứng in MỘT dòng thông tin: «Khuôn: k tệp theo khuôn · n lệch mới · nợ cũ j ·
không đo m» cộng «sổ lệch lọt: N mục» khi kho có `design/patterns/lech-lot.md` (kênh cho thước sau phát hành, không
thêm lượt gọi). `lech-lot.md` và `README.md` là tên dành riêng trong `design/patterns/`, không phải nhóm (bộ đọc bỏ
qua, khai trong khuôn); N đếm dòng mục `- ` theo khuôn sổ ở cùng tệp khuôn, không đếm dòng thô. Kho có bản đồ, hồ sơ chưa qua Cổng 2, diff chạm vùng nhóm, thiếu tệp hay tệp lệch `verified_commit`
→ cờ vàng «chưa chấm khuôn trên bản đã chấm» (đường đọc cũ, tiền lệ `luat-cham.json`). Khối «Khuôn» đầy đủ hai cổng —
nhóm, màn mẫu, ảnh nhúng, ba lối — là KH2 của vòng 2, không làm ở đây. Khuôn KHÔNG chặn làn V: chặn đi qua eval của
hồ sơ (exit 1 → REJECT), không qua vị từ còn-cần-người (tránh lệch đọc-cũ RT13).

## 6. Khuôn vào ngữ cảnh tác tử (S0, S1) và L1

- S0: `--dem` in «khuôn: N nhóm (M màn · K phần tử)» — cả ở bậc M0 (trục riêng, A3). Không có thư mục → im.
- S1 bước mới sau 0d: `--nap --slug` ghi `_acceptance/<slug>/khuon-nap.json` (`{schema, ghim: {<nhóm>: <blob>}}`) và in
  chỉ mục: mỗi nhóm một dòng «nhóm · đối tượng · nhận việc · dùng khi (câu đầu) · tệp bản đồ · màn mẫu». Khối SKILL
  dặn tác tử đọc ĐÚNG tệp bản đồ và màn mẫu của nhóm nó chọn (L9 nạp đúng, nạp ít).
- `--goi-y-eval --nhom <n>` in khối eval khuôn với `paths: [design/patterns/<n>.md, <nhan_dien của n>]` — phạm vi đo
  theo nhóm, không toàn cục, để sửa một nhóm chỉ kéo xét lại hồ sơ của nhóm ấy.
- Khuôn đặc tả UX thêm mục «Thẻ việc» năm trường: ai dùng · việc chính · tần suất · số bản ghi · thiết bị (L1). Bản đồ
  khai `nhan_viec` để máy so khớp.
- **Lưới khuôn ở `s4-args.mjs`** (Hỏi-4, khuyến nghị): kho có `design/patterns/`, diff của vòng chạm `nhan_dien` của
  một nhóm, mà `evals.yaml` không có eval nào mang ref `config:executors.design.khuon` → `s4-args` thoát 2 nêu hồ sơ và
  nhóm, không sinh tệp (cùng nếp «ref không giải được»). Nhờ đó «màn ngoài khuôn bị trả lại» không phụ thuộc tác tử S1
  nhớ chép khối eval, và không đụng vị từ còn-cần-người (RT13). Kho không khai → không đổi. Eval khuôn mang
  `config:executors.design.*` nên khớp cách hiểu đúng chữ «eval design» của lưới tier-mismatch; lưới ấy vẫn là lời
  trong SKILL (#461 còn mở — giới hạn, không làm ở vòng này).

## 7. Đọc theo mẫu chữ — giới hạn đã khai

Kit không phụ thuộc thư viện nào, nên bản đầu đọc mã theo mẫu chữ (khai báo `import`, thẻ JSX mở) thay vì cây mã. Sót:
xuất lại qua tệp gom có đổi tên (`export { Dialog as Hop }`) · thẻ dựng qua biến (`const C = Dialog; <C/>`) · «ở gốc»
không kiểm (chỉ kiểm có dựng khuôn). Nợ cũ: dời một chỗ khối cấm trong cùng tệp mà số lần không đổi thì không thấy. Ngưỡng mở bộ đọc cây mã (DFK-C1): một lệch lọt qua đúng các dạng này. Chọn mẫu chữ
hay chờ DFK-C1 là câu của chủ kho ở Cổng Phạm vi (bản phạm vi dòng 60–62); khuyến nghị: mẫu chữ (DFK-C1 chỉ mở sau 10
vòng DO1 ở invest).

## 8. Cân trên mọi kho

- Kho không có `design/patterns/`: mọi lệnh mới im, thẻ không đổi byte (AC-8 so với bản trước vòng).
- Kho thứ nhất: nhóm `nhan_dien` dạng sổ đăng ký → «không đọc được ở đây» cho tới khi kho thêm `tep:`. Kho này để
  `**/*.md` ở T1, nên sửa bản đồ không làm hồ sơ nào hoá cũ — giới hạn ghi ở GUIDE, kho tự gỡ `design/patterns/**`
  khỏi T1 nếu muốn.
- Kho thứ hai: đọc được trọn; luật lint của kho có thể gọi bộ đọc kit thay `ban-do.mjs`.
- Hành vi cũ không ai dựa: kit chưa có bộ đọc bản đồ nào.

## 9. Không làm

Ba lối chọn khối (KH-C6, vòng 2) · khối «Khuôn» đầy đủ trên thẻ hai cổng, màn mẫu chụp cạnh (KH2, KH3) · khởi tạo bản
đồ từ mã (KH5) · bộ đọc cây mã (DFK-C1) · sinh cấu hình lint (KH4 cũ — hai kho dùng hai bộ lint) · chặn làn V bằng khuôn
· dạy `pre-merge-check.sh` về khuôn · L3–L10.

## 10. Tài liệu đi cùng vòng (T1, ẩn danh theo DP1-07)

Finding `docs/findings/2026-11-01-ban-do-khuon-vao-kit.md` (dàn bài 16 mục của gói giao việc; hai số đã sửa: 1/9 hồ sơ
giao diện có số đo, 0 lệch trong 2 vòng có số đo) · bốn dòng QĐ-9…QĐ-12 vào §13 của finding 30/10 · lộ trình: thêm mục
chờ KH-C6 «ba lối» · hạt giống `docs/plans/2026-11-01-hat-giong-vong-doi-ban-mau.md` · bản phạm vi 31/10 ghi KH4 gộp.

## 11. Độ phủ (quét hình thái, preset test-matrix)

Ba trục — A trạng thái kho {không khai · 1 nhóm · nhiều nhóm · bản đồ sai · đổi sau ghim} · B tệp vòng chạm {đúng khuôn ·
khối cấm / thiếu khuôn / thiếu khe · hai nhóm · ngoài bản đồ · nợ cũ · tài liệu, hồ sơ · không đọc được} · C chỗ hành
động {S0 · S1 nạp · bước chấm · sau lượt chấm + thẻ · lint của kho}. Chân ngành: ESLint `no-restricted-imports`,
eslint-plugin-boundaries, dependency-cruiser (cấm nhập theo vùng); Shopify Polaris (dùng khi / không dùng khi).
Ánh xạ ô Core → AC ở mục Coverage của hợp đồng.
