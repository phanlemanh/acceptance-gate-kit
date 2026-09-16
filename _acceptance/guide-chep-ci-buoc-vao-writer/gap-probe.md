---
slug: guide-chep-ci-buoc-vao-writer
at: 2026-09-16T01:15:00Z
verdict: findings
p0: 0
p1: 3
p2: 5
---

## Findings

Phản biện chạy bằng một phiên CONTEXT SẠCH (không biết hội thoại dẫn tới thay đổi),
đọc hợp đồng + evals + vật + hai bản khai + `scripts/pre-merge-check.sh`. Tác tử tự
dựng lại tập DÙNG ngoài suite để kiểm, và chạy probe cho từng kịch bản fail nó nêu.

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | `guideCopyList()` + AC-1 + mutant (b) | Con số «đủ N file» KHÔNG neo vào §5.3: regex quét toàn tệp và lấy khớp ĐẦU TIÊN, trong khi câu thật nằm ngoài cặp marker | Thêm bất kỳ câu `Copy **đủ 9 file**` nào ở mục SỚM hơn rồi để §5.3 ghi «đủ 7 file» → declaredCount=9, list.length=9 → CE2g XANH với đúng lỗi lịch sử 16/09 còn sống. Kèm hệ quả hai: mutant (b) dùng replace literal nên tiêm vào câu KHÔNG-phải-vật mà vẫn thoả → CE2gm xanh vacuous đúng lúc cần nó nhất | Cắt §5.3 bằng tiêu đề rồi rút số TRONG mục; đòi câu xuất hiện đúng MỘT lần; mutant chèn câu trùng ở mục khác → phải IM | fixed: `mucNamBa()` + chốt `soTrongMuc.length === 1` + mutant (d) |
| P1 | `usedVsDeclared()` — chân «gắn vào writer» của CẢ CE2 lẫn CE2g | Regex `lib/([a-z-]+\.cjs)` chỉ thấy kebab-thường-đuôi-cjs, trong khi `lib/` của chính kho đã có `.mjs`, `.js`, `.json` | Thêm `lib/lop-nhin-thay-v2.cjs` (chữ số), `lib/eval_yaml2.cjs` (gạch dưới), `lib/design-detect.mjs` vào pre-merge rồi quên khai ở cả hai bản → `used` không chứa → `missing=[]` → CE2+CE2g XANH, consumer dựng cổng thiếu lớp. Đúng lớp lỗi mà chú thích đầu tệp tự nhận đi bắt | Charset rộng + 4 đuôi; mutant sinh-trong-lần-chạy tiêm tên có chữ số vào BẢN SAO pre-merge → `used` phải chứa | fixed: `tapDung()` charset rộng + AC-3/E3 (CE2w, bốn dạng tên) |
| P1 | `usedVsDeclared()` — quan hệ chỉ đi MỘT bước | Không đóng bao require bắc cầu: `ac-line→md-section`, `lop-nhin-thay→eval-yaml`, `evidence-core→eval-yaml`. Ba mắt xích nằm trong danh sách chỉ vì pre-merge TÌNH CỜ cũng nhắc tên chúng | Gỡ luật làn-eval khỏi pre-merge (hai chỗ duy nhất nhắc `lib/eval-yaml.cjs`) rồi dọn tệp khỏi hai bản khai → CE2/CE2g XANH, nhưng `evidence-core.cjs` vẫn `require` nó lúc chạy → consumer mất đúng đường đọc `expected_exit` mà chính dòng GUIDE đó mô tả. AC-1 hứa «thật sự nạp», phép đo chỉ đo «được nhắc tên» | Bao đóng `require`/`__dirname` tới điểm bất động; mutant gỡ hết lời nhắc trực tiếp → tệp vẫn phải trong tập DÙNG | fixed: vòng bao đóng trong `tapDung()` + nửa sau của CE2w |
| P2 | `CE2gm` mutant (c) cũ | Mutant đặc hiệu TỰ-ĐÚNG: đổi tiêu đề một mục khác không chạm nhánh nào có thể hỏng; assertion thứ ba là tautology vì `usedVsDeclared` không đọc GUIDE | Chiều đặc hiệu chưa từng bị thử ở đúng trục nó đang yếu — không phân biệt được bộ giải neo-đúng-§5.3 với bộ giải quét-toàn-tệp đang ship | Ba mutant đặc hiệu THẬT: câu «đủ N file» ở mục khác · bullet ngoài marker · đảo thứ tự dòng | fixed: mutant (d)(e)(f) |
| P2 | `CE2gm` đối chứng dương | Hẹp hơn AC-2 hứa: chỉ kiểm 2/4 chốt của CE2g, bỏ chốt quan hệ-writer và chốt đẳng thức-tập | Nếu quan hệ writer đã hỏng sẵn thì mutant (a) vẫn thoả và CE2gm vẫn báo PASS — «xanh» trong hai ca không phải cùng một chữ xanh | Đối chứng dương gọi lại ĐÚNG chuỗi assertion của CE2g | fixed: gộp bốn chốt vào vị từ `viPhamGuide()`, cả hai ca cùng gọi |
| P2 | `CE2g` chốt đẳng thức-tập | Không mutant nào chứng minh chốt này cắn: mutant (a) làm tập lệch thật nhưng chỉ ghim `missing` | Ai đó nới chốt thành so `list.length` hoặc phép chứa một chiều → mọi ca hiện có vẫn xanh trong khi GUIDE khai thừa/lệch tên | Mutant đổi một tên ở GUIDE → ghim đúng thông điệp «khai khác tập file» | fixed: mutant (c) mới |
| P2 | `usedVsDeclared()` — hai regex phụ | `scripts/recheck-evidence.cjs` vào tập nhờ một dấu NHÁY KÉP; và mọi tên `.cjs` nháy đơn trong recheck bị áp đặt tiền tố `lib/` | (a) đổi kiểu nháy ở dòng 68 → mắt xích cổng-chấm-lại biến khỏi tập, dọn nó khỏi hai bản khai thì không ai đỏ. (b) recheck thêm `require('./helper.cjs')` sibling → phép đo đòi khai `lib/helper.cjs`, ĐỎ sai chỗ | Nhận theo VỊ TRÍ (`$HERE/` = thư mục của chính script) và theo `require`/`__dirname` resolve, không theo hình dạng nháy | fixed: `$HERE/` cho scripts + `nap()` resolve theo thư mục của tệp |
| P2 | `evals.yaml` (E3, E1, E2 bản đầu) | E3 khai số tự mâu thuẫn trong cùng một `expected` («Results: 873» và «1211 ca còn lại»); E1/E2 thiếu `paths` cho chính hai writer mà phép đo neo vào | Người đọc bằng chứng gặp hai con số khác nhau trong một câu hứa; ai đọc `paths` kết luận sai rằng sửa pre-merge không chạm eval này | Bỏ số sai; thêm `scripts/pre-merge-check.sh` + `scripts/recheck-evidence.cjs` vào `paths` | fixed: evals.yaml viết lại, 5 eval |

## Mục tác tử tự xếp là GIỚI HẠN PHẠM VI (không tính finding)

- Phần §5.3 ngoài danh sách (`fetch-depth: 0`, `--base`, `--no-t1-escape`, layout đích)
  không buộc vào vật nào. Đã khai ở `Known limits` của hợp đồng.
