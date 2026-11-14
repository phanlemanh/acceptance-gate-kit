# Gọi chéo — lõi và feature-loop thôi bám bố cục và tên plugin cũ (vòng `goi-cheo-loi-dieu-phoi`) — thiết kế

Soạn 14/11/2026 sau Cổng Đáng (chủ kho: «làm · đường C · neo như ô · ngưỡng như ô»). Hồ sơ:
`_acceptance/goi-cheo-loi-dieu-phoi/`. Nền: ô cơ hội của hồ sơ · hạt giống
`~/dev/delivery-loop/migration/hat-giong-goi-cheo-loi-dieu-phoi.md` · luật đổi chữ và bảng xếp của kịch bản chuyển nhà
(`~/dev/delivery-loop/migration/kich-ban/{don-nha.mjs,bang-xep.json}`, chỉ đọc).

## 1. Việc của vòng, một đoạn

Hôm nay plugin lõi có nguồn `./`, nên bản cài của nó mang cả kho: mọi đường từ lõi sang `dieu-phoi/` hay lên
`.claude-plugin/marketplace.json` đều chạy. Kịch bản chuyển nhà dời lõi vào `plugins/acceptance-gate/` và đổi tên plugin
cơ học; bản cài lõi khi ấy chỉ mang thư mục của nó (đã đo trên bộ đệm cài thật). Vòng này sửa 11 chỗ thuộc lớp «mã của
một plugin chỉ đúng khi lõi là gốc kho, hoặc khi tên plugin là tên cũ», sao cho cùng mã chạy đúng ở cả hai bố cục, mà
không đổi một byte đầu ra ở bố cục hôm nay.

## 2. Năm nhóm, năm cách sửa

| Nhóm | Chỗ | Cách sửa |
|---|---|---|
| A. Lõi gọi tệp của điều phối | `scripts/tin-hieu.mjs`, `scripts/gui-tin-hieu.mjs`, ba mục `INIT-CI-COPY-LIST` | **Đường C (chủ kho chọn):** lõi mang bản chép NGUYÊN VĂN `hinh-dang.mjs`, `cau-hinh.mjs`, `dot.mjs`, `cua-tin-hieu.mjs` ở `scripts/hop-thu/`; hai script import `./hop-thu/…`; danh sách chép trỏ `${CLAUDE_PLUGIN_ROOT}/scripts/hop-thu/<tệp>` → `scripts/hop-thu/` |
| B. Lõi đọc tệp khai chợ | `scripts/plugin-declare.mjs`, `khoaBat` của `scripts/lo-trinh-khoi-tao.mjs` | **Hai nhánh, cùng luật với B′:** có `marketplace.json` cạnh gói (bố cục cũ, kể cả bản cài từ chợ fork) → đọc tệp như cũ, từng byte; vắng (bản cài bố cục mới) → đọc **bảng tên** `lib/ho-goi.cjs` (§3). `--marketplace <tệp>` tường minh vẫn đọc tệp |
| B′. Luật chặn lộ trình | `lib/chan-lo-trinh.cjs` | Chỉ thay hằng `GOI_ROAD_MAP` bằng tên tra từ bảng theo vai. GIỮ luật hai nhánh: có `marketplace.json` cạnh gói → khoá đúng `<tên>@<chợ>`; vắng (bản chép CI, bản cài bố cục mới) → khoan dung theo tiền tố `<tên>@` |
| C. Dò kho kit | `scripts/start-scan.mjs` (`metaOpen`) | Ứng viên manifest = `.claude-plugin/plugin.json` ở gốc (hôm nay) + `<source>/.claude-plugin/plugin.json` của từng mục trong `marketplace.json` ở gốc; mục đầu tiên có tên lõi (từ bảng) thắng; mốc đọc lịch sử của đúng đường ấy |
| D. Kiểm bản cài | `scripts/kiem-ban-cai.mjs` (`p('dieu-phoi')`, `p('feature-loop')`, `p('acceptance-gate')`) | Nhận gói **theo vật** ở cây của ref: gói mang `scripts/dieu-phoi.mjs` · `workflows/acceptance-verify.js` · `scripts/gate-card.js`. Tên mục kết quả (`MUC`) không đổi |
| E. feature-loop tự host | `feature-loop/scripts/{giu-tuoi,thuoc-vat,carry-plan}.mjs` (`HERE/../..`) | Một bộ giải `feature-loop/scripts/goc-loi-tu-host.mjs`: đi ngược từ thư mục script tìm `.claude-plugin/marketplace.json`, lấy `source` của mục `acceptance-gate`; không có thì trả `null` (rơi về `resolve-plugin` như hôm nay) |

Ngoài lớp (đã soát): `pre-merge-check.sh:1916` `"road-map@` — luật `<cũ>@` của kịch bản mang sang · `--plugin
acceptance-gate` — tên lõi không đổi · `~/.claude/dieu-phoi/may` — thư mục trạng thái · `dieu-phoi/hooks/mod/khung.ts`
`../../scripts` — trong chính điều phối.

## 3. Bảng tên — một nguồn mà kịch bản mang sang cơ học

`lib/ho-goi.cjs` khai chợ và sáu plugin theo **vai**, khoá là tên plugin, giá trị là đối tượng:

```js
const CHO = 'acceptance-gate-kit';
const GOI = {
  'acceptance-gate': { vai: 'loi' },
  'feature-loop': { vai: 'feature-loop' },
  'diagram-design': { vai: 'diagram-design' },
  'dieu-phoi': { vai: 'dieu-phoi', luaChon: true },
  'road-map': { vai: 'lo-trinh', luaChon: true },
  'tri-thuc': { vai: 'tri-thuc', luaChon: true },
};
```

Vì sao đúng dạng này: luật đổi chữ của kịch bản áp lên mọi tệp dưới `plugins/` (tập `git ls-files plugins`), gồm mẫu
`'<plugin cũ>': {` và tên chợ `acceptance-gate-kit(?![\w-])`. Bảng viết đúng mẫu đó thì ở cây mới tự thành
`'dispatch': {`, `'roadmap': {`, `CHO = 'delivery-loop'` — kịch bản không cần biết thêm gì. Vai (`'lo-trinh'`,
`'dieu-phoi'`) không khớp mẫu nào nên đứng yên: mã tra theo vai, không theo tên. Thứ tự khoá = thứ tự `plugins` trong
`marketplace.json`, nên `plugin-declare --list` in đúng thứ tự cũ.

Răng (bền, ở `tests/scripts/`): bảng ≡ `marketplace.json` — cùng tập tên theo cùng thứ tự, cùng tập mang dấu
`bat-theo-lua-chon`, cùng tên chợ. Thêm plugin vào chợ mà quên bảng → răng đỏ gọi tên plugin.

Bảng chỉ được đọc khi không có `marketplace.json` cạnh gói (bản cài bố cục mới). Lối loại: chỉ đọc bảng ở mọi ngữ cảnh —
bản cài từ chợ fork ở bố cục cũ sẽ in tên chợ của kit thay tên fork (điều kiện CHẾT của ô; phản biện S1, P1); chỉ đọc
`marketplace.json` — tệp không có ở bản cài bố cục mới (đã đo); hằng chữ trần `'road-map'` — luật đổi chữ cố ý không đổi
chữ trần trong ngoặc (lẫn văn xuôi).

## 4. Bản chép hộp thư — răng từng byte

`scripts/hop-thu/` giữ bốn tệp đúng từng byte bản `dieu-phoi/scripts/`. Răng bền ở `tests/scripts/`: bốn cặp bằng nhau;
phá một byte trên bản sao → đỏ gọi tên tệp. Bản của điều phối là bản gốc; sửa nó thì chép sang — răng đỏ nhắc đúng lệnh.
Tiền lệ: khối `VUNG-GIAO-CHEP` của `scripts/cat-luot.mjs` (ca CV-4). Đây là lệch có kiểm soát khỏi luật «một cây
nguồn» mà chủ kho đã nhận khi chọn C.

Ở kho tiêu thụ khai `tin_hieu`: lượt chép CI của mốc 3.0 chép ba tệp mới vào `scripts/hop-thu/`; ba bản cũ ở
`dieu-phoi/scripts/` thành thừa (vô hại, xoá được). Bản cài lõi chưa chép lại mà nhận `tin-hieu.mjs` mới thì bước bản đồ
`ERR_MODULE_NOT_FOUND` có tên — đúng hành vi của mọi tệp thiếu trong danh sách chép.

`lib/ho-goi.cjs` vào danh sách chép với dấu `[only-if-declared: lo_trinh]` (`chan-lo-trinh.cjs` `require` nó).

## 5. Thước

Ba vật đo, ở cùng nhà với vật:

1. **Răng bền** `tests/scripts/mot-nguon-ten-va-hop-thu.test.mjs` (vào suite qua các mảnh `mjs`): bảng ≡ chợ; hộp thư
   ≡ điều phối. Mỗi răng có đối chứng dương và nhát phá trên bản sao với thông điệp ghim.
2. **Bộ dựng bố cục mới** `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs` (tạm — sống tới ngày cắt, rồi bố cục
   mới là bố cục duy nhất): từ một cây nguồn (cây đang kiểm, hoặc `--ref <sha>`) dựng bằng mã một kho `plugins/<tên>/`
   theo bảng xếp + áp luật đổi chữ của kịch bản (chép quy tắc, §7), rồi tách «bản cài lõi» = riêng
   `plugins/acceptance-gate/`. Chạy từng đường: `plugin-declare --list`, khởi tạo lộ trình, luật chặn lộ trình, nạp
   `tin-hieu`, `gui-tin-hieu`, giải danh sách chép CI rồi nạp bản chép ở kho tiêu thụ, `start-scan` ở kho kit mới,
   nhận gói của `kiem-ban-cai`, feature-loop tự host không `--ag-root`. Chế độ `--chieu-do` dựng từ `593e6837` (trước
   bản sửa) và đòi MỖI ca đỏ với thông điệp ghim; chỉ chạy khi lần lành xanh trên cùng bộ dựng.
3. **Vi phân bố cục cũ** `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs`: cùng bộ kho tiêu thụ do mã sinh (mỗi
   kho chép lớp CI của đúng bản đang chạy; có một bản cài chợ fork), cộng kho kit bố cục cũ cho `start-scan`; chạy bản
   `593e6837` và cây đang kiểm → stdout, stderr, mã thoát bằng nhau từng byte (sau khi thay đường gốc cây), KHÔNG bảng
   khác biệt. Cộng ca HT: phá `scripts/hop-thu/cua-tin-hieu.mjs` trên bản sao cây → ca cửa tín hiệu có sẵn phải đỏ.

Cộng các suite có sẵn của kho (`suite_keys` + `plugins` + `dieu_phoi`), gồm các ca cửa tín hiệu đã sửa để phá bản chép
trong lõi thay vì bản của điều phối.

## 6. Đổi ở bộ kiểm có sẵn

Ba tệp ca phá `dieu-phoi/scripts/cua-tin-hieu.mjs` hay nạp `dieu-phoi/scripts/hinh-dang.mjs` để chứng hành vi của
`tin-hieu`/`gui-tin-hieu` (`cua-tin-hieu-goc-moi-worktree`, `cua-tin-hieu-giua-chien-dich`, `tin-hieu`) đổi sang
`scripts/hop-thu/`. Không đổi thì nhát phá của chúng không chạm vật nữa — chiều đỏ chết lặng (lớp «assertion âm tính
một mình»). Ca của chính điều phối (`tests/dieu-phoi/`) không đổi.

## 6b. RT13 chỉ so hồ sơ có ở mốc (Hỏi-1 — nháp theo khuyến nghị gộp)

Phiên giữ đợt báo 14/11, máy kiểm chéo trên bản kéo tạm của `delivery-loop` (`chuyen-nha` `5192aff2`): ca RT13 đỏ
«kich-ban-chuyen-nha: lệch cho-cong-gia-tri→da-giao-khong-do mà khối không khai». RT13 chạy bộ phân loại tại `cb38ea01`
và bộ hiện tại trên MỌI hồ sơ của cây thật; hồ sơ nào khác lớp phải có dòng trong danh sách đóng `KHAC-BIET-DOC-CU` của
hồ sơ đã ký `ra-co-ten-lam-va-trao`. Ở kho mới có hồ sơ chỉ kho ấy có → mọi lượt chấm ở đó REJECT; ở kho này, mỗi vòng
mới đổi trạng thái lại phải khai một dòng và ghim lại hồ sơ đã ký (~60 phút, tiền lệ PR #502).

Sửa: phép so cũ↔mới chỉ xét hồ sơ có `contract.md` trong cây của mốc `cb38ea01` — đúng nghĩa «đọc-cũ» (bộ đọc mới vẫn
đọc được hồ sơ viết cho bộ cũ). Hồ sơ sinh sau mốc viết cho bộ mới, vẫn qua kiểm «broken rỗng» của bộ mới. Dòng khai cũ
cho hồ sơ sinh sau mốc (ví dụ `mc11-ten-kho`) thành thừa: giữ nguyên tệp đã ký, phép so bỏ qua chúng; chiều đỏ (ii)
chọn dòng khai của một hồ sơ có ở mốc. Lối khác (Hỏi-1): tách thành vòng nhỏ riêng kiểu MC-11 — vòng này gọn hơn, thêm
một PR, một lượt CI, một lượt gộp.

## 7. Giới hạn đã khai

- Bộ dựng bố cục mới CHÉP quy tắc đổi chữ của kịch bản (CI kho này không có kho mới). Hai bản trôi khỏi nhau thì thước
  xanh mà cây thật treo. Bù: đo chéo cuối vòng trên một bản kéo TẠM của `delivery-loop` — lệnh đếm của hạt giống trên
  cây dựng lại từ nhánh vòng phải trả 0. Ngưỡng mở lại: lệnh đếm khác 0 trong khi bộ dựng xanh.
- Bản cài bố cục mới không có `marketplace.json` cạnh gói → luật chặn lộ trình chạy nhánh khoan dung (`roadmap@*`), như
  bản chép CI hôm nay; `plugin-declare` và khởi tạo lộ trình đọc bảng, nên một chợ fork ở bố cục mới in tên chợ của bảng
  (`delivery-loop`) — fork tự sửa bảng như tự sửa `marketplace.json`.
- Bộ dựng đại diện cây của kịch bản (giả định 4 của ô): eval E16 khai `not-run` — cần bản kéo `delivery-loop`; đo chéo
  chạy tay cuối vòng, kết quả ghi vào hồ sơ.
- `kiem-ban-cai` đầy đủ cần CLI `claude`; thước đo phần nhận gói theo vật trên cây của ref, không cài thật.
