---
schema_version: 1
feature: Phần bộ kiểm còn bám bố cục phẳng (K4-LT, K4-TB, K4-MP, K4-RG) chạy được ở cả bố cục hôm nay lẫn plugins/<tên>/, và nhánh chính hết đỏ ở bang-ten-lo-trinh
slug: phan-du-bo-cuc-moi-vong-ba
owner: phanlemanh@gmail.com
risk_tier: T2               # chỉ tests/ và hồ sơ của chính vòng — không chạm t3_paths
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-16-phan-du-bo-cuc-moi-vong-ba-design.md
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-16T08:57:32Z
---

# Acceptance Contract: phan-du-bo-cuc-moi-vong-ba

## Context

Gốc: kit/_acceptance/phan-du-bo-cuc-moi/ — vòng hai dời K4-LT, K4-TB sang vòng kế; B2 đo thêm K4-MP, K4-RG và một lỗi đỏ
ở nhánh chính. Cổng Đáng 16/11: «Mở vòng ba» (`opportunity.md`).

Thuật ngữ:
- **bố cục cũ** = cây kho này như hôm nay. **kho mới** = kho dựng từ HEAD bằng `khoMoi` của thước vòng hai: bước 1–3 +
  luật đổi tên trên `tests/` + luật chung bước 6, bước 6 bỏ qua tệp tự đúng đường của vòng hai và vòng ba, không bảng vá.
- **bộ dịch** = `tests/bo-cuc.mjs`. **haiCay** = `tests/hai-bo-cuc.mjs` (design §3.2).
- **khoá đích** = dòng của `khoa-dich.tsv` của hồ sơ, cột `cum` chỉ cụm. **túi khoá** của một tệp kiểm = tập tên ca nó in.
- **GOC_VONG** = `795baf96` (đỉnh nhánh chính lúc mở vòng — bản gốc của thước). **MOC_MA_TRAN** = `644e9b49` (mốc mà
  cột «bản gốc in» của ma trận bang-ten-lo-trinh được đo). **thước** = `rang/giu-khoa-3.mjs` của hồ sơ.
- **sau gộp** = bản sao kho có `origin/main` trỏ đúng HEAD.

## Criteria

- AC-1: Given nhánh của vòng, When chạy `tests/scripts/bang-ten-lo-trinh.test.mjs` ở cây đang đứng và sau gộp, Then cả hai
  thoát 0 với túi khoá BẰNG NHAU (8 dòng «PASS: SP <lệnh> · <bố cục> · <tệp khai>» + SP-CHU + SP-NL-DU + SP-NL +
  SP-GOC-GHIM); bản gốc của ma trận là MOC_MA_TRAN ghim, không phụ thuộc `origin/main`; ca canh `SP-GOC-GHIM` chứng bản gốc ghim thiếu nhánh dự phòng (ô
  «thiếu» → khoá `null`) với đối chứng dương (ô «có» → khoá đúng); đổi bản gốc ghim sang HEAD trên bản sao → ô `khac-ten`
  «cũ · thiếu» đỏ «bản gốc in road-map@…, ma trận viết trước null» (đo ở `--chieu-do` của thước, dòng «DO AC-1»).
- AC-2: Given mọi tệp dưới `tests/` gọi `merge-base` ở GOC_VONG hoặc ở HEAD (40 tệp lúc mở vòng), When rà lớp và chạy
  `--sau-gop`, Then `rang/ra-lop-merge-base.md` xếp từng tệp vào đúng một nhóm (A kỳ vọng tuyệt đối theo mốc · B so tương
  đối «nhánh này không đổi X» · C không dùng làm bản gốc) kèm dòng mã làm căn cứ (mỗi số ở cột «Dòng» trỏ một dòng có chữ
  `merge-base` ở GOC_VONG hoặc HEAD), bảng và tập bằng nhau HAI chiều; mọi tệp nhóm A xanh sau gộp mà KHÔNG nhờ miễn môi
  trường — bản gốc đọc từ mốc ghim hoặc neo lịch sử, merge-base chỉ còn là đường lui; và MỌI tệp của tập chạy trong bản sao sau gộp thoát 0, hoặc đỏ Y HỆT (cùng mã thoát, cùng
  tập ca đỏ) ở đối chứng trước gộp trong cùng bản sao — đỏ ấy do môi trường bản sao, không do gộp, in TIN có tên ca; tệp B
  xanh rỗng theo thiết kế, nên một tệp đỏ do gộp là xếp sai hoặc lỗi thật; tệp sập trước khi in ca nào không được miễn;
  chiều đỏ: bang-ten-lo-trinh ở GOC_VONG sau gộp đỏ ở ca SP đúng câu «bản gốc in road-map@».
- AC-3: Given ma trận viết trước {cây phẳng dựng từ HEAD, kho mới dựng từ HEAD, một kho mới mà commit cha của commit dọn
  nhà KHÔNG phẳng}, When gọi `haiCay`, Then cây phẳng → `hienTai: 'phang'`, `phang` là chính cây ấy, `moi` dựng bằng
  `dungKhoMoi`; kho mới (commit CON của HEAD trong bản sao có lịch sử thật, như cây kịch bản của B2) → `hienTai: 'moi'`,
  `phang` là bản bung của cha commit dọn nhà MỚI NHẤT và sha ấy bằng HEAD của bản sao, `moi` là chính cây ấy; kho dọn nhà
  hai lần → cha của lần mới nhất; ô cha không phẳng → lỗi «hai-bo-cuc: cha của commit dọn nhà <sha> không phẳng»; số
  assert bằng số ô.
- AC-4: Given kho mới, When chạy `bo-cuc.test.mjs` và `bang-ten-lo-trinh.test.mjs`, Then mọi khoá đích cụm K4-MP có mặt và
  xanh.
- AC-5: Given kho mới, When chạy các tệp kiểm cụm K4-LT, Then mọi khoá đích cụm K4-LT có mặt và xanh; kho tiêu thụ giả của
  các ca không bị dịch đường (đường kho tiêu thụ giữ dạng của kho tiêu thụ).
- AC-6: Given kho mới, When chạy các tệp kiểm cụm K4-TB, Then mọi khoá đích cụm K4-TB có mặt và xanh; mỗi `git archive` /
  `git show` một commit lịch sử mà ca dùng giải đường qua `pathspec` của bộ dịch (chốt chống rỗng), trừ đường bất biến giữa
  hai bố cục (`tests/` · `_acceptance/`); thước đếm mọi lệnh ấy trong các tệp K4-TB — ở mọi dạng viết (phần tử argv, chuỗi
  `bash -c`/template), chữ `archive` ở dạng chưa biết tính là hỏng — và đỏ khi có lệnh không qua.
- AC-7: Given kho mới, When chạy `recheck-goc-goi-loi.test.mjs`, Then năm khoá K4-RG có mặt và xanh; RG-2 giữ bản gốc
  merge-base sống (nhóm B của AC-2: lời hứa «nhánh này không đổi đầu ra khi kho không có marketplace.json»), bung qua bộ
  dịch theo cây của commit ấy; RG-3 (gỡ ứng viên gốc gói lõi) vẫn đỏ «verifier script not found» với đúng đường.
- AC-8: Given bố cục cũ, When chạy mọi khoá `feature_loop.suite_keys` và `--cu` của thước, Then mọi suite thoát 0 và túi khoá
  của mỗi tệp vòng chạm ở HEAD chứa trọn túi khoá ở bản gốc ghim — không ca nào mất tên hay rời túi.
- AC-9: Given kho mới, When chạy `--chieu-do`, Then bộ dịch thay bằng bản đồng nhất làm mỗi cụm K4-LT, K4-TB, K4-RG có ít nhất
  một ca canh đỏ với thông điệp ghim, và — ở một lượt RIÊNG giữ bộ dịch thật — `haiCay` thay bằng bản luôn bung cây đang
  chạy làm K4-MP đỏ «source lạ»; đối chứng dương: cùng ca xanh với bộ dịch và `haiCay` thật.
- AC-10: Given HEAD bất kỳ của vòng (kể cả sau commit chữ ký), When chạy `--tinh`, Then trong vài giây và trước mọi phép đo dài
  nó so tập tệp vòng sửa dưới `tests/` với khối tự đúng đường ∪ danh sách vẫn-đi-bước-6 của `gui-b2.md` — trong đó
  `tests/scripts/fixtures/routing-baseline.txt` chỉ được bỏ qua khi mọi dòng đổi của nó là dòng THÊM mở đầu bằng slug của
  vòng (dòng nghi thức ký ghi); sửa dòng khác của tệp ấy → «FAIL: TINH» — và chạy bộ tự kiểm của thước; lệch → «FAIL: TINH …», thoát 1, mọi chế
  độ khác dừng trước khi chạy tệp nào; `gui-b2.md` có đủ bốn mục, mục vá thừa rút bằng máy (`--ghi-gui-b2`) khớp khối đã ghi.

## Coverage

Quét ba trục (skill morphological-scan, preset test-matrix, làm tại chỗ):

- Trục cây mà chuỗi đường nói tới: cây đang đứng · commit lịch sử · bản sao gốc gói · kho tiêu thụ giả · cây phẳng của chính
  mã khi đang ở bố cục mới [thước CE: dạng gãy của 25 tệp ở kho mới tạm 16/11 — design §2].
- Trục quan hệ HEAD ↔ nhánh chính: nhánh PR · sau gộp [thước CE: CI đỏ ở `d8c42965`, `795baf96`].
- Trục cụm khoá: K4-LT · K4-TB · K4-MP · K4-RG [thước CE: `khoa-dich.tsv`, đếm 155 + 92 + 225 + 5 = 477 của B2].

Ô có nghĩa → tiêu chí: bang-ten × {PR, sau gộp} → AC-1 · lớp merge-base × sau gộp → AC-2 · cây phẳng của chính mã × {cũ,
mới} → AC-3, AC-4 · K4-LT → AC-5 · K4-TB → AC-6 · K4-RG → AC-7 · mọi cụm × cũ → AC-8 · chiều đỏ → AC-9 · ghép nối B2 +
nghi thức ký → AC-10.

Later: bộ đổi ngược mới → phẳng (design §3.2, lối đã loại). Never: K4-DN, cụm B2 (ngoài vòng theo lời giao).

## Đường đo

- SỐNG — lượt giữ khoá kế của B2 thiếu 0 ở bốn cụm; nhánh chính xanh: số từ lượt đo của B2 (ngoài làn máy), từ `--moi`
  và `--sau-gop` của thước (trong làn) · AC bảo đảm: AC-1, AC-2, AC-4…AC-7.
- CHẾT — ở bố cục cũ một ca xanh hoá đỏ, rời túi khoá, hay chiều đỏ thôi đỏ: số từ `--cu` và suite · AC bảo đảm: AC-8, AC-9.
- Timebox — gộp trước lượt đo lại kế của B2, chậm nhất 04/12/2026: số từ giờ gộp · AC bảo đảm: không AC — ràng buộc lịch.

## Out of scope

- Không sửa gì ở `~/dev/delivery-loop` — vòng chỉ ghi `gui-b2.md`.
- Không đổi byte nào của hồ sơ đã ký (kể cả thước vòng hai `_acceptance/phan-du-bo-cuc-moi/rang/`).
- Không sửa lệnh ký của kit; chờ CI xanh trước khi mời ký chỉ là nhịp của vòng này.
- Không cắt số, không gắn thẻ — đi theo mốc 3.0.
- K4-DN (6 khoá, đổi nghĩa chưa có chủ), nhóm «Ngoài-11» (hạt giống của vòng hai), cụm B2 (KM-1, CT-10-do).
- Tệp so tương đối «bản trước vòng ↔ HEAD» không thuộc lớp của AC-2: sau gộp chúng xanh rỗng theo thiết kế đã có — không sửa.
- P161 (K4-PL): theo lời chủ kho ở Cổng Phạm vi (Hỏi-1).
- RG-2 không ghim mốc: lời hứa của nó là so tương đối (nhóm B).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Số khoá thiếu là số B2 đo (nhận lại); số đo ở kho này ghi ở `duong-nen.md` và design §2.
- Thu hẹp sau Cổng Phạm vi (sổ S3, chờ chủ kho ở Cổng Bằng chứng): AC-5 đạt 153/155 — khoá cấp tệp của
  `cua-tin-hieu-giua-chien-dich.test.mjs` và `kho-moi-cai-goi-road-map.test.mjs` bị CT-10-do, KM-1 (cụm B2, ngoài vòng) chặn;
  thước ghi TIN có tên, không FAIL.
- Sau S4 lượt 1 (sổ S4, chờ chủ kho ở Cổng Bằng chứng): AC-2 nhận «đỏ Y HỆT ở đối chứng trước gộp cùng bản sao» là đỏ do
  môi trường, không do gộp — lượt 1 đỏ đúng hai tệp vì bản sao thiếu jsdom (`khong-do-duoc`, KD0 «JSDOM_VANG» cả ở cây làm
  việc) và cấu hình CLI thật (`kiem-ban-cai`, KB-1); AC-6 đổi chốt máy từ «dòng hứa» sang phép đếm lệnh đọc lịch sử.
- Sau S4 lượt 2 (sổ S4, chờ chủ kho ở Cổng Bằng chứng): vế «mọi tệp nhóm A ghim mốc cố định» của AC-2 viết lại theo
  điều đo được — hai tệp A (`sua-truoc-dot-thu`, `can-cu-s1`) neo commit gộp có trong lịch sử, merge-base chỉ là đường lui,
  nên lời hứa thật là «nhóm A xanh sau gộp không nhờ miễn» (RA-LOP-A) cộng dòng căn cứ trỏ đúng mã (RA-LOP-DONG); AC-6 nói
  rõ «mọi dạng viết» vì 3/8 tệp K4-TB gọi archive trong chuỗi `bash -c`.
- Giới hạn khai (theo lời chủ kho ở Hỏi-2): ở kho mới, cột «cũ» của K4-MP chạy trên cha của commit dọn nhà — mã đóng băng ở
  ngày cắt sang, không phải mã đang kiểm. Ngưỡng mở lại (đếm bằng `git log <commit dọn nhà>..HEAD -- plugins/acceptance-gate/lib
  plugins/acceptance-gate/scripts | wc -l`): ≥ 1 commit kho mới chạm tệp lõi mà K4-MP đọc thì mở vòng dựng bộ đổi ngược.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-17:
  - Ngoài-1: đường ống chép bản gốc bằng git archive trong sáu tệp kiểm K4-TB thiếu pipefail, nên khi hạ tầng hỏng bản gốc thành thư mục rỗng thay vì báo lỗi hạ tầng rõ ràng.
  - Ngoài-2: bước so bản cũ của thước bỏ lọt tệp kiểm bị đổi tên hay xoá, nên một vòng sau đổi tên tệp rồi bỏ bớt ca vẫn có thể báo đạt.
  - Ngoài-3: phép kiểm «đỏ sau gộp» chạy ở điểm mà trước gộp và sau gộp trùng nhau, nên chưa có đối chứng dương chứng minh phép giả lập nhánh chính có tác dụng.
  - Ngoài-4: dòng báo đạt «RA-LOP-A n/m» lấy số tệp đã chạy làm tử số, nên con số có thể gây hiểu nhầm dù kết quả cuối vẫn đỏ đúng khi có lỗi.
