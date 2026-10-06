# Review findings: loc-paths-dong-mac-dinh (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The lane can now drop the 'evals_not_machine_touched' list entirely, which contradicts the CHANGELOG's 'can only ADD ids' promise** (r1)
  Người dùng thấy gì: Nếu kho chưa bật khoá và bộ máy đang cài còn cũ, bản ghi ghim lại sẽ không kể được những ô đo bị đổi ngoài làn máy; người đọc dễ hiểu nhầm là không có ô nào bị chạm. Ghi lời nhắc này vào ghi chú phát hành và sửa câu CHANGELOG cho khỏi hứa quá.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **With an engine older than 2.21, the evidence report falsely says every out-of-lane eval 'không khai paths'** (r1)
  Người dùng thấy gì: Khi bộ máy cài trên máy còn là bản cũ, báo cáo bằng chứng có thể ghi sai là các ô đo ngoài làn máy không khai phạm vi theo dõi, trong khi thật ra chúng có khai. Một dòng sai sự thật nằm lại trong hồ sơ đã ký, nhưng chỉ xảy ra với bộ máy cũ.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **With an older engine, the repin record says out-of-lane evals have no `paths` when they do** (r1)
  Người dùng thấy gì: Trên máy dùng bộ máy cũ, bản ghi ghim lại có thể khẳng định sai rằng các ô đo ngoài làn không khai phạm vi theo dõi. Người đọc hồ sơ sẽ hiểu nhầm lý do ô đó vắng khỏi danh sách bị chạm.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính/không phân biệt được với đường lui): ca D6 và ca pkg/a/ của E3 vẫn XANH khi bộ lọc TỪ CHỐI mục** (r1)
  Người dùng thấy gì: Hai ca kiểm tra ở bước chặn trước khi gộp có thể vẫn báo xanh dù bộ lọc đã từ chối mục khai chứ không nhận. Sản phẩm không bị chứng minh là sai, nhưng hai ca đó chưa tự chứng minh được là chúng bắt đúng lỗi.
  file: `_acceptance/loc-paths-dong-mac-dinh/rang/chan-premerge.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 1/2: E9 và SBP16 round-trip từ khối khai báo PATHS-LY-DO, không từ chỗ thật sự phát ra mã lý do** (r1)
  Người dùng thấy gì: Nếu sau này có thêm một lý do từ chối mới trong bộ lọc mà quên khai vào danh sách chung, tài liệu hướng dẫn sẽ thiếu lý do đó mà các kiểm tra vẫn xanh. Người dùng kho sẽ gặp một thông báo mà tài liệu không giải thích.
  file: `_acceptance/loc-paths-dong-mac-dinh/rang/chan-tai-lieu.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2: ô D6 của E1 dùng tên tệp viết tay chưa qua ngoặc git, trong khi cột contract ghi «git in trong ngoặc»** (r1)
  Người dùng thấy gì: Ca thử tên tệp có dấu tiếng Việt chưa dùng đúng chữ mà git in ra khi bật chế độ trích dẫn, nên chưa tự chứng minh được vế đúng chữ git in. Kho có tên tệp có dấu và bật chế độ đó vẫn có thể gặp lệch mà bộ kiểm không báo.
  file: `_acceptance/loc-paths-dong-mac-dinh/rang/ma-tran-d.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
