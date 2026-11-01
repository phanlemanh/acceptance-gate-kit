# Review findings: khuon-loi (round 1)

## Trong hợp đồng

- **--kiem --write ghi den = sha khai, nhưng đo trên HEAD và cây làm việc chứ không đo ở den**
  file: `scripts/design-floor-khuon.mjs:200`
  severity: medium
  AC: AC-7
  source: conventions
  detail: Nhánh --write chỉ chạy `git rev-parse co.den` rồi ghi giá trị đó vào khuon-cham.json. Còn số đo `ra` thì lấy từ chamKho(root, base): tepVong đọc `base...HEAD`, `diff HEAD` và cả tệp chưa theo dõi, nội dung thì đọc thẳng từ đĩa. Thẻ Cổng Bằng chứng (ban-do-khuon.cjs theCong2) coi `cham.den === verified_commit` là «đã chấm khuôn trên bản đã chấm» và tắt cờ vàng. Vậy khi HEAD khác --den, hoặc cây đang bẩn (chẳng hạn ca mã 6 «cây đổi trong lượt chấm» mà SKILL đã khai), tệp số đo mang sha của lượt chấm nhưng số lại là của một cây khác. Đây đúng là một «dòng tự xưng» không được kiểm. Bên anh em luat-san-pham.cjs --quet làm khác: nó đọc git ở đúng `den` (docTepLuat(root, den), diff `${base}...${den}`). KL-7 chỉ thử ca den = HEAD nên không bắt được lỗi này. Hướng sửa: đo ở den, hoặc từ chối khi HEAD khác den hay cây bẩn.
  lý do vào hợp đồng: AC-7 đòi khuon-cham.json mang den và các số khớp đầu ra bước chấm CÙNG sha; đo trên HEAD/cây bẩn rồi đóng dấu den làm vế này hỏng.

- **--write đóng dấu den lên số đo của cây làm việc hiện tại, không phải của den**
  file: `scripts/design-floor-khuon.mjs:199`
  severity: medium
  AC: AC-7
  source: bugs
  detail: chamKho(root, base) luôn đo HEAD cộng thay đổi chưa commit và tệp chưa theo dõi (tepVong và readFileSync trên cây làm việc). --den chỉ được rev-parse rồi ghi vào trường `den`, không so với HEAD, cũng không checkout den. theCong2 lại dựa đúng vào `cham.den === verified_commit` để tắt cờ «chưa chấm khuôn trên bản đã chấm». Vậy chạy khối KHUON-SAU-S4 khi HEAD đã đi tiếp hay cây bẩn (vd sau commit sửa ở Cổng 2) cho ra khuon-cham.json mang sha lượt chấm mà số liệu lại của cây khác. Thẻ in số đo ấy như của bản đã chấm, và cờ bị tắt nhầm.
  lý do vào hợp đồng: cùng gốc với lỗi trước — số trong khuon-cham.json không khớp đầu ra bước chấm ở sha den mà AC-7 yêu cầu.

- **Hình dạng 3: KL-7 kiểm quan hệ «khuon-cham.json khớp đầu ra bước chấm» và «dòng thẻ khớp tệp» ở một điểm suy biến, ba trong bốn số đều bằng 0**
  file: `tests/scripts/khuon-loi.test.mjs:436`
  severity: medium
  AC: AC-7
  source: measurement
  detail: kiemKL7 dựng nhánh 'vong' chỉ chạm src/man/form/Moi.tsx = manForm() (dòng 427), một màn đúng khuôn. Chạy lại fixture này: khuon-cham.json ra theo_khuon=[Moi.tsx], lech_moi=[], no_cu=[], khong_do=[]. Vì vậy phép so ở dòng 436 (cham.lech_moi.length !== demIn('lệch:'), cùng no_cu và khong_do) chỉ so 0 với 0. Phép so dòng thẻ với tệp ở dòng 440 cũng chỉ so [1,0,0,0]. Hai lỗi sau đều lọt KL-7: (a) bên ghi luôn ghi [] cho lech_moi/no_cu/khong_do; (b) gate-card đọc nhầm hay đảo vị trí ba số «lệch mới · nợ cũ · không đo». AC-7 hứa một QUAN HỆ (số trong tệp = số bước chấm đếm trên cùng sha, số trên thẻ = số trong tệp), nhưng fixture không có lệch, nợ cũ hay chỗ không đo nào nên quan hệ ấy không bị thử ở giá trị nào phân biệt được. KL-7-do/do2 chỉ đo nhánh cờ, không đo các số này.
  lý do vào hợp đồng: AC-7 hứa quan hệ số trong tệp = số bước chấm = số trên thẻ nhưng phép đo chỉ so 0 với 0, nên vế này chưa được chứng minh.

- **Hình dạng 2/3: KL-10 lấy kỳ vọng của dòng --nap từ chính bộ đọc đang đo, và trường dung_khi không được so với hằng ở bất kỳ ca nào**
  file: `tests/scripts/khuon-loi.test.mjs:166`
  severity: medium
  AC: AC-10
  source: measurement
  detail: Dòng 165-169 duyệt B.docThuMuc(kho).nhom rồi đòi dòng --nap chứa n.doi_tuong, n.nhan_viec, n.dung_khi, n.tep, n.mau_dang_chay.tep. Kỳ vọng được tính từ docThuMuc của scripts/ban-do-khuon.cjs, tức chính mã mà design-floor-khuon.mjs --nap dùng để in (dòng 43 của design-floor-khuon.mjs). Điều này trái với luật đo khai ở đầu tệp (dòng 7: kỳ vọng VIẾT TRƯỚC, không tính từ mã sản phẩm). E10 hứa mỗi dòng mang câu đầu sau «Dùng khi». Nếu bộ đọc rút sai câu, ví dụ lấy cả thân, lấy câu «Không dùng», hay lấy chuỗi rỗng (includes('') luôn đúng), thì cả bên in lẫn bên kỳ vọng sai giống nhau và ca vẫn xanh. KL-1 ở dòng 103 lại cố ý gỡ dung_khi khỏi phép so hai dạng YAML, nên không ca nào so dung_khi với một hằng viết trước, ví dụ 'Màn liệt kê nhiều bản ghi cùng loại.'.
  lý do vào hợp đồng: AC-10 đòi dòng --nap mang câu đầu «Dùng khi» đúng; kỳ vọng tính từ chính bộ đọc nên vế này không được đo độc lập.

- **Hình dạng 4: KL-11 ghim thông điệp phải nêu tên hồ sơ bằng một slug một ký tự 'h', nên vế này không ghim gì**
  file: `tests/scripts/khuon-loi.test.mjs:527`
  severity: low
  AC: AC-11
  source: measurement
  detail: Dòng 527 kiểm ['h', 'form-nhap', 'executors.design.khuon'].every(x => a.err.includes(x)). Slug là 'h', và gần như mọi stderr tiếng Việt đều chứa chữ h. Thông điệp die của s4-args bắt đầu bằng «hồ sơ ...», có cả «chạm»; một thông điệp không nêu tên hồ sơ cũng chứa 'h'. Vì vậy lời hứa «thông điệp nêu tên hồ sơ» của AC-11/E11 không được ghim. Muốn ghim thật thì cần một slug không thể khớp ngẫu nhiên, hoặc ghim cụm 'hồ sơ h chạm'.
  lý do vào hợp đồng: AC-11 đòi thông điệp nêu tên hồ sơ; slug một ký tự khiến vế ghim tên không phân biệt được.

- **Hình dạng 4: KL-11-do không phân biệt «lưới bị gỡ» với «s4-args không chạy được trong bản sao», vì bước kiểm bản sao chạy được chỉ chạy design-floor-khuon.mjs**
  file: `tests/scripts/khuon-loi.test.mjs:543`
  severity: medium
  AC: AC-11
  source: measurement
  detail: caDo (dòng 45-46) xác nhận bản sao chạy được bằng cách chạy scripts/design-floor-khuon.mjs --dem, trong khi nhát tiêm của KL-11-do nằm ở feature-loop/scripts/s4-args.mjs, một script khác. Thông điệp ghim «thiếu eval khuôn mà vẫn sinh args» được đẩy ở dòng 527 khi a.ma !== 2 || a.coTep || thiếu chuỗi. Bản sao mà s4-args sập (thoát 1, thiếu tệp phụ thuộc, lỗi cú pháp) cũng đẩy đúng thông điệp ấy. caDo chỉ đòi loi.some(x => x.includes(thongDiep)) và không đòi các hàng đối chứng b/c/d vẫn xanh trên bản sao, nên một bản sao hỏng hạ tầng vẫn cho KL-11-do PASS. Đây đúng là trường hợp không phân biệt được «bắt đúng lỗi» với «chưa bao giờ chạy».
  lý do vào hợp đồng: chiều đỏ của AC-11 phải nêu «thiếu eval khuôn mà vẫn sinh args» khi bỏ lưới; bản sao hỏng hạ tầng cũng cho đỏ nên chiều đỏ không chứng minh được.

- **Hình dạng 5: dòng «số hàng: N» của KL-6, KL-11 (và «số hàng phụ: 1» của KL-5) là hằng in sẵn, không đếm từ ma trận; ma trận còn thiếu hàng AC đã liệt kê**
  file: `tests/scripts/khuon-loi.test.mjs:306`
  severity: low
  AC: AC-1
  source: measurement
  detail: Dòng 306 console.log('số hàng: 3'), dòng 523 console.log('số hàng: 4') và dòng 290 console.log('số hàng phụ: 1') in chữ cố định. Ba hay bốn ca ở đó viết rời, không duyệt một mảng. E6 và E11 đòi «dòng số hàng: 3/4» như bằng chứng số assert = số phần tử (mẫu P105), nhưng xoá hay bỏ một hàng thì dòng này vẫn in đúng số cũ, tức nó đo lời khai chứ không đo số hàng. Ngoài ra ma trận còn thiếu hai hàng mà tiêu chí đã liệt kê: AC-6 nêu `import(` hay `require(` động, KL-6 chỉ có hàng import(...); AC-1 nêu cờ vàng khi thân thiếu «Dùng khi» hay «Không dùng», bảng hang của KL-1 (dòng 106-113) chỉ có hàng thiếu «Dùng khi». Bộ đọc có nhánh riêng cho «Không dùng» (ban-do-khuon.cjs:163) mà không ca nào chạm.
  lý do vào hợp đồng: AC-1 liệt kê cờ vàng cho cả thiếu «Dùng khi» lẫn «Không dùng» nhưng ma trận chỉ có hàng thiếu «Dùng khi».

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **--slug không được kiểm trước khi ghi tệp vào _acceptance/&lt;slug&gt;/ (lệch với luat-san-pham)**
  Người dùng thấy gì: Nếu ai đó gõ tên hồ sơ có dấu đi ngược thư mục, công cụ có thể ghi tệp kết quả ra ngoài thư mục hồ sơ thay vì báo lỗi.
  Căn cứ: Chỉ xảy ra khi người chạy lệnh tự gõ tên bất thường trên máy của mình, không chạm người dùng cuối, sửa sau rẻ và không mất dữ liệu có sẵn.
  file: `scripts/design-floor-khuon.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khuôn đặc tả UX và SKILL nói «máy so» Thẻ việc với nhan_viec, nhưng không có máy nào làm việc đó**
  Người dùng thấy gì: Tài liệu hướng dẫn nói máy sẽ đối chiếu phần mô tả công việc của màn với khai báo của nhóm, nhưng thực tế chưa có bước nào làm vậy nên người đọc có thể tin nhầm là đã được kiểm.
  Căn cứ: Hậu quả nhẹ vì chỉ là câu chữ gây hiểu lầm, không làm sai kết quả chấm; chỉ cần khai rõ giới hạn là đủ và sửa lúc nào cũng rẻ.
  file: `skills/acceptance/references/ux-spec-template.md`
  severity: medium
  Đề xuất: known-limits

- **Vòng khuon-loi sửa test của hồ sơ lo-trinh-gio-may đã ký: đổi một chiều đỏ thành SKIP mà expected của eval đã ký không có**
  Người dùng thấy gì: Một phép kiểm của hồ sơ khác đã ký nay có thể báo bỏ qua thay vì đỏ khi bộ đọc hỏng, và hồ sơ đó sẽ hiện là cũ cần ghim lại.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm, chỉ làm một thước của hồ sơ khác lỏng hơn và cần ghim lại ở đợt phát hành; người quyết nên biết để xếp lịch ghim.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tệp fixture khuon-loi-kho-mau.mjs không nằm trong paths của eval nào, nên vòng sửa chỉ chạm fixture vẫn mang sang màu xanh cũ**
  Người dùng thấy gì: Nếu một lượt sau chỉ sửa dữ liệu mẫu dùng để thử, các phép kiểm có thể được giữ lại màu xanh của lượt trước mà không chạy lại.
  Căn cứ: Chỉ làm lượt sau chấm lỏng hơn mức cần, người dùng cuối không thấy; khai thành giới hạn là đủ vì sửa danh sách đường dẫn rất rẻ khi cần.
  file: `_acceptance/khuon-loi/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Chú thích khoá khuon_loi trong config ghi sai dải ca và chen vào giữa cặp quet_het_han/_rt5**
  Người dùng thấy gì: Một dòng ghi chú trong tệp cấu hình ghi sai dải ca và nằm chưa đúng chỗ, chỉ gây khó đọc cho người bảo trì.
  Căn cứ: Không có hậu quả nào với người dùng hay kết quả chấm; chi phí mở việc riêng lớn hơn lợi ích.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

- **--kiem --write bỏ mất ra.sai: bản đồ hỏng lược đồ vẫn ra khuon-cham.json sạch, lệnh thoát 0, thẻ in dòng Khuôn sạch**
  Người dùng thấy gì: Khi tệp mô tả khuôn của kho bị hỏng cú pháp, thẻ duyệt vẫn in dòng Khuôn sạch như không có lỗi, trong khi cả bản đồ khuôn thực ra đã bị tắt mà không ai hay.
  Căn cứ: Người ký có thể tin là màn đã theo khuôn trong lúc không có gì được kiểm, nên lỗi lọt qua cổng; sửa nên làm sớm và không đắt vì người chạy lại lệnh kiểm vẫn thấy lỗi.
  file: `scripts/design-floor-khuon.mjs`
  severity: high
  Đề xuất: new-contract

- **Kiểm khe bị cắt ở dấu «&gt;» đầu tiên trong thẻ: hàm mũi tên trong thuộc tính báo thiếu khe sai và để lọt thiếu children**
  Người dùng thấy gì: Với những thẻ có xử lý bấm nút viết kiểu hàm mũi tên, công cụ có thể báo thiếu mục dù đã có (trả lại màn oan), hoặc bỏ sót khi thật sự thiếu nội dung.
  Căn cứ: Kiểu viết này rất phổ biến nên người làm sẽ bị trả lại oan hoặc lọt lỗi khá thường xuyên; người dùng cuối không bị ảnh hưởng trực tiếp nhưng sửa cần một vòng riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **Bộ đọc YAML âm thầm bỏ mọi khoá sau một dòng thụt sâu hơn (scalar nhiều dòng, |, &gt;)**
  Người dùng thấy gì: Nếu người viết tệp khuôn dùng một mô tả trải nhiều dòng, các mục khai báo phía sau bị lặng lẽ bỏ qua, có thể khiến nhóm bị chấm sai hoặc quy tắc cấm bị tắt.
  Căn cứ: Chỉ xảy ra khi tệp khuôn dùng cách viết hiếm, người dùng cuối không thấy trực tiếp; khai giới hạn kèm ngưỡng và dặn dùng dạng một dòng là hợp lý.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **gate-card nuốt mọi lỗi của theCong2: thẻ trông như kho không khai bản đồ**
  Người dùng thấy gì: Nếu phần dựng dòng Khuôn trên thẻ gặp lỗi bất ngờ, thẻ im lặng bỏ dòng này và trông y như kho không dùng khuôn.
  Căn cứ: Hiếm gặp và chỉ làm thẻ thiếu thông tin chứ không đưa thông tin sai; người xem chạy lại thẻ là thấy, sửa rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/16 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/lo-trinh-gio-may.test.mjs, _acceptance/khuon-loi/evals.yaml, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
