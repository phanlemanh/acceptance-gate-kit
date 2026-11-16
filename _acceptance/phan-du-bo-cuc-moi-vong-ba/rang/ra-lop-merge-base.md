# Rà lớp merge-base — phan-du-bo-cuc-moi-vong-ba (AC-2)

Tập: mọi tệp dưới `tests/` (trừ `fixtures/`) chứa chữ `merge-base` ở `795baf96` — `git grep -l merge-base 795baf96 -- tests`,
40 tệp. Phân loại do một tác tử chỉ-đọc làm 16/11 (đọc mã quanh từng chỗ gọi, không chạy ca), máy chính rà lại nhóm A.
`giu-khoa-3.mjs --sau-gop` đọc bảng này (cột hai) và chạy MỌI tệp của tập sau gộp — bảng xếp sai thì tệp ấy đỏ ở đó.

Nhóm: **A** kỳ vọng tuyệt đối viết theo một mốc, bản gốc lấy bằng merge-base (sau gộp đỏ) · **B** so tương đối «nhánh
này không đổi X» (sau gộp xanh rỗng — thiết kế đã có, tiền lệ `dieu-phoi-lop-mod` d-20261011T092906Z-24) · **C** merge-base
không dùng làm bản gốc (chú thích, chuỗi trong fixture, phạm vi diff, kho thử, thứ tự lịch sử).

| Tệp | Nhóm | Dòng | Căn cứ |
|---|---|---|---|
| `tests/scripts/bang-ten-lo-trinh.test.mjs` | A | 59 | Cột «bản gốc in» của `MA_TRAN` viết sẵn theo 644e9b49 (hai ô `null`), so `g.khoa !== gocIn` — ĐANG ĐỎ; vòng ghim MOC_MA_TRAN. |
| `tests/dieu-phoi/sua-truoc-dot-thu.test.mjs` | A | 487/491 | Kỳ vọng tuyệt đối (`CAU_LICH_CU`), nhưng `mocSo` neo commit gộp PR có trong lịch sử; merge-base chỉ là đường lui khi mất commit gộp. Kit gộp bằng commit gộp → không đỏ; không sửa. |
| `tests/scripts/can-cu-s1.ca.mjs` | A | 250/253 | CC-02 đòi danh sách viết sẵn; `tamVong` neo lịch sử, merge-base là đường lui. Như trên; không sửa. |
| `tests/plugins/run-tests.sh` | B | 6158, 6742, 7409 | P150 so thẻ base với HEAD; P161-E10 `calls >= _base_calls`. |
| `tests/design-floor/moc-s0-s1.mjs` | B | 314 | THE-M0 thẻ bản gốc bằng thẻ kit. |
| `tests/dieu-phoi/trong-dot.test.mjs` | B | 522/524 | DP7-06-do so tiền tố lời chặn; ca chính neo PR #306. |
| `tests/dieu-phoi/tiep-tuc.test.mjs` | B | 266, 786 | Hàng (g) và DP3-11-do đúng với mọi mốc sau DP3. |
| `tests/dieu-phoi/lop-mod.test.mjs` | B | 386, 602 | DP6-03 `lech(song) === 0`; số 7 trên `MOC_BAN_CU` cố định. |
| `tests/dieu-phoi/dp7-chieu-im.mjs` | B | 31 | Đường lui khi chưa gộp: khối SKILL ở base bằng bản mới. |
| `tests/dieu-phoi/mo-dot.test.mjs` | B | 1164 | DP2-11 `deepEqual(moi, cu)`. |
| `tests/dieu-phoi/doi-tai-khoan.test.mjs` | B | 819 | DP4-08 `deepEqual(moi, cu)`. |
| `tests/scripts/khoi-khuon-tren-the-cong.test.mjs` | B | 106 | KK-1 từng byte; KK-6 so đầu ra. |
| `tests/scripts/khuon-loi.test.mjs` | B | 524 | KL-8 so đầu ra và mã. |
| `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs` | B | 87 | ND-1-trang-giu, ND-7 so bằng. |
| `tests/scripts/additive-only.test.mjs` | B | 268 | HEAD ⊇ base. |
| `tests/scripts/recheck-goc-goi-loi.test.mjs` | B | 105 | RG-2/RG-2b so từng byte; mã thoát mong đợi đúng cho cả HEAD. |
| `tests/scripts/luot-kiem-nhe-ca-cham.mjs` | B | 46 | So `a !== b`; dòng 49 `die` khi bản base trùng HEAD — ngoài bộ chạy thường trực, chỉ lượt chấm của hồ sơ ấy gọi. |
| `tests/workflows/lenh-dai-chay-rieng.test.mjs` | C | 406 | Chú thích; base là tag `v2.24.0`. |
| `tests/workflows/baseline-tran-bo-qua-don.test.mjs` | C | 6 | Chú thích và thông điệp của workflow được kiểm. |
| `tests/design-eval/khong-do-duoc.test.mjs` | C | 24 | Chú thích; bản gốc ghim `GOC_SHA`. |
| `tests/dieu-phoi/dp8-crm-that.mjs` | C | 16 | Nhãn của một sha ghim ở kho crm. |
| `tests/dieu-phoi/khung.test.mjs` | C | 17 | Chú thích; bản cũ cố định. |
| `tests/dieu-phoi/on-dinh-r2.test.mjs` | C | 874 | Tầm ca đổi thân neo commit gộp PR. |
| `tests/dieu-phoi/khung-dinh-vi.test.mjs` | C | 20 | Chú thích; bản cũ cố định. |
| `tests/scripts/hskt.test.mjs` | C | 300 | Chú thích; `BASE_SHA` từ `log -S`. |
| `tests/scripts/lan-status-not-run.test.mjs` | C | 607 | Chú thích. |
| `tests/scripts/yaml-chuan.test.mjs` | C | 205 | Chuỗi kim tiêm vào bản sao. |
| `tests/scripts/kiem-ban-cai.ca.mjs` | C | 35 | Đọc số phiên bản ở gốc vòng để quyết bỏ qua. |
| `tests/scripts/ra-soat-lo-trinh.test.mjs` | C | 45 | Chú thích, kho tạm. |
| `tests/scripts/eval-thay-boi.test.mjs` | C | 433 | Chú thích. |
| `tests/scripts/s4-args-main-branch.test.mjs` | C | 59 | Kho thử: `diffBase` bằng merge-base tính độc lập. |
| `tests/scripts/core-untouched.test.mjs` | C | 22 | Chú thích. |
| `tests/scripts/hang-pr.test.mjs` | C | 500 | Chú thích; `MOC_GOC` cố định. |
| `tests/scripts/tin-hieu.test.mjs` | C | 560 | `--is-ancestor`: thứ tự lịch sử. |
| `tests/scripts/ghi-boi-tac-tu-cham.test.mjs` | C | 142 | Chuỗi lệnh trong fixture. |
| `tests/scripts/ngoai-n-khoi-khac.mjs` | C | 2 | Chú thích. |
| `tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs` | C | 504 | Kho thử. |
| `tests/scripts/duong-nen.test.mjs` | C | 267 | Kho thử: truyền `--base`. |
| `tests/scripts/ho-so-nghi.test.mjs` | C | 126 | Chú thích. |
| `tests/scripts/s4-args-vung-vat.test.mjs` | C | 183 | Chú thích; kho thử. |

Kết luận lớp: đúng MỘT tệp đỏ vì lớp này (`bang-ten-lo-trinh`). Hai tệp A còn lại đã có neo lịch sử từ trước; tệp B, C không
sửa. `luot-kiem-nhe-ca-cham.mjs` nổ khi base trùng HEAD nhưng không ở bộ chạy thường trực — ghi ở đây, không sửa.
