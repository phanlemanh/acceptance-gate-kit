# Review findings: chi-tep-vat-keo-xet-lai

## Trong hợp đồng

- **phanTepHoSo falls open when evals.yaml cannot be read: evals with no readable id are treated as 'paths cover nothing'**
  file: `lib/evidence-core.cjs:573`
  severity: medium
  AC: AC-4
  source: bugs
  detail: phanTepHoSo only sets docDuoc=false when evalListsOf returns canhBao (alias, block, empty list). If evals.yaml exists and is non-empty but the reader gets no criterion out of it, there are no canhBao, globs stays empty, and opportunity.md / decisions.jsonl are classed as text files. The stale-evidence check is then skipped with a NOTE. The most common case is an eval item where `id` is not the first key, e.g. `- criterion: AC-1\n    id: E1\n    paths: ["_acceptance/old/**"]`. Reproduced: phanTepHoSo(["_acceptance/old/opportunity.md"],"old",ev) returns {vat:[],chu:["opportunity.md"]}, even though paths does cover that file. In the same case, parseEvals returns [] and staleByPaths (same lib, line ~520) treats `!evs.length` as 'evals-hong' and falls back to the old rule (fail-safe). The new function does not cross-check against parseEvals, so it goes the opposite way and quietly cuts the review. That contradicts the contract ("paths field that cannot be read -> every file is a material file") and the comment in pre-merge-check.sh ("no silent path that reduces review"). Suggested fix: when evalsText is non-empty and either parseEvals returns no eval or the number of ids evalListsOf reads differs from parseEvals, set docDuoc=false. TV4 only tests aliases (`*p`), so this hole is not covered.

- **Hình dạng 5 (tuyên quét lớp nhưng thực chất một điểm): hai mutant của TV6 «ham-vang · dau-ra-hong» cùng đi một đường mã, nhánh đầu-ra-hỏng của case chưa ai đo**
  file: `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs:224`
  severity: medium
  AC: AC-6
  source: measurement
  detail: TV6 và E6 (evals.yaml) nói lớp «bộ phân tệp không phân được» có hai ô: hàm vắng và đầu ra hỏng. Ô dau-ra-hong tiêm `dinh[0] + ' return "rac{";'`, nên phanTepHoSo trả về một chuỗi. Trong node -e của slug_vat_in_diff (scripts/pre-merge-check.sh:784-788), `r.vat` khi đó là undefined, và `r.vat.length` ném TypeError. node thoát khác 0, đầu ra rỗng, `_tv="$(...)" || return 0` bắt nó, giống hệt ô ham-vang (export bị đổi tên nên `l.phanTepHoSo` không gọi được, cũng ném lỗi). Cả hai ô vì thế chỉ chạm nhánh `|| return 0`. Trên thực tế không ô nào sinh ra stdout rác để chạy tới nhánh mặc định của `case "$_tv" in CHU=?*) ... esac; return 0`, tức nhánh lùi về vật khi đầu ra không đọc được, đúng vế «đầu ra không đọc được → coi là vật» mà chú thích ở pre-merge-check.sh:776-777 hứa. Thử bằng một mutant: đảo case thành `VAT) return 0 ;; *) SLUG_TEP_CHU=...; return 1`. TV6 vẫn xanh vì cả hai ô đều thoát ở `|| return 0`. TV1 và TV2 cũng vẫn xanh vì chúng chỉ sinh ra «CHU=...» hoặc «VAT». Muốn đo đúng nhánh này, ô đầu-ra-hỏng phải cho node thoát 0 với stdout lạ, ví dụ thay câu process.stdout.write. Không được để nó crash.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **phanTepHoSo dựng bộ khớp `paths` thứ hai, lệch bộ phân loại sẵn có phanLoaiMucPaths, và lệch theo chiều mở (bớt xét)**
  Người dùng thấy gì: Nếu phép đo của một hồ sơ khai đường dẫn theo dạng lạ (có `./` ở đầu), PR chỉ sửa tệp chữ có thể được bỏ qua bước xét lại bằng chứng cũ dù phép đo đó thật ra đo chính tệp ấy.
  Căn cứ: Hậu quả nhẹ vì chỉ xảy ra với cách viết lạ hiếm gặp, hệ thống vẫn in một dòng ghi chú, và chủ kho tự gỡ được bằng cách viết lại đường dẫn theo dạng thường.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Eval trùng id bị evalListsOf bỏ im lặng: `paths` của nó phủ tệp chữ mà không được tính**
  Người dùng thấy gì: Khi một hồ sơ có hai phép đo trùng mã, PR chỉ sửa tệp chữ có thể được gộp mà không bị xét lại bằng chứng cũ, dù một phép đo đang đo đúng tệp đó.
  Căn cứ: Hậu quả nhẹ vì chỉ xảy ra khi hồ sơ đã tự hỏng, và chủ kho sửa được bằng cách đổi mã trùng; sửa trong hệ thống thì tốn công hơn lợi ích.
  file: `lib/evidence-core.cjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
