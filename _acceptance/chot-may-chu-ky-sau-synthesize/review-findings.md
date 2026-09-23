## Trong hợp đồng

- **Khối evidence mở bằng `- run_id:` bị mất giờ carry — bản vá t4 chưa quét hết lớp «chốt hẹp hơn bên đọc»**
  AC: AC-2
  file: `feature-loop/workflows/acceptance-verify.js:131`
  severity: medium
  detail: Bản vá S4-r1 sửa cách chuẩn hoá run_id cho «đúng như bên đọc (extractRunIds)», nhưng chỉ sửa ở các dòng thân khối (cot === cotNoiDung). Dòng MỞ khối (`/^\s*- [A-Za-z_][\w-]*\s*:/`) thì `continue` ngay, không bao giờ rút run_id. Bên đọc thì khác: extractRunIds dùng `^\s*(?:-\s+)?run_id`, nên `- run_id: X` là run_id hợp lệ. Tôi đã chạy lại trên bản HEAD bằng hàm rút nguyên văn giữa hai marker CHOT-TRUONG-NGUOI, với gioTheoRunId={'run-goc-E4':'2026-07-01T00:00:00Z'} và invokedAt='2026-09-23T10:00:00Z'. Khi khối ghi `- eval: E4 / run_id: run-goc-E4 / verified_at: 2026-07-01…` thì doi.verified_at=0, giữ giờ gốc (đúng). Khi CÙNG khối đó đổi thứ tự thành `- run_id: run-goc-E4 / eval: E4 / verified_at: 2026-07-01…` thì extractRunIds vẫn trả ['run-goc-E4'], nhưng chốt lại ra verified_at=2026-09-23T10:00:00Z và doi.verified_at=1. Như vậy engine tự khai rằng một eval carry (không chạy lại) được đo ở giờ của vòng này, đúng hình dạng mà finding t4/AC-2 định chặn, chỉ khác lối vào. CLAUDE.md đòi «sửa phải theo LỚP: quét cả file tìm mọi case cùng hình dạng», và commit 75e24401 tự gọi tên lớp này là «chốt nhận hình dạng HẸP hơn bên đọc», nên đây là lỗ còn sót trong chính bản vá. Test mới CTN-AC2-ngoac chỉ phủ run_id có nháy ở dòng thân, không có ca run_id nằm ở dòng mở khối. Một lệch hẹp hơn cùng lớp: dòng mở khối chỉ nhận đúng `- ` (một dấu cách), còn bên đọc nhận `-\s+`. Với `-  eval:` (hai dấu cách) cả khối không được coi là vị trí trường, nên `human_override: Bot …` trong khối đó giữ nguyên, doi toàn 0. Phần thụt lề này gần với mục known-limits «thụt khác 2 cột» đã có.
  source: conventions

- **Hình dạng 5 — tuyên quét LỚP «chốt nhận hình dạng HẸP hơn bên đọc» nhưng chỉ có 3 điểm-case; 6 mutant cùng lớp trong chính bản sửa S4-r1 vẫn xanh**
  AC: AC-2
  file: `tests/workflows/chot-truong-nguoi.test.mjs:265`
  severity: medium
  detail: Chú thích ở dòng 265–268 và commit 75e24401 gọi tên một LỚP («chốt nhận hình dạng HẸP hơn bên đọc», bên đọc là lib/evidence-core.cjs frontmatterField/extractRunIds), và bản sửa trong acceptance-verify.js (dòng ~108–161) nới RỘNG theo nhiều trục của bên đọc cùng lúc. Test chỉ có ba biến thể điểm (hangRao, hoaKhoa, ngoacRid ở dòng 269–275), không có ma trận viết trước rút từ luật bên đọc. Không có ca nào cho: khoá verified_at viết hoa (RE_GIO được thêm cờ /i), khoá run_id viết hoa (cờ /i), run_id kèm chú thích `# ...` (bên đọc bỏ `\s+#.*$`), run_id trong nháy đơn, frontmatter không có hàng rào đóng (nhánh mới `fmHet = dong.length`), human_override viết hoa trong khối evidence (hoaKhoa chỉ đổi human_signoff/bypass_ack ở frontmatter). Tôi chạy thử trên một bản sao `git archive HEAD` ở scratchpad. Trước hết là đối chứng: gỡ phần chuẩn hoá run_id thì CTN-AC2-ngoac ĐỎ đúng như mong đợi, tức cách tiêm có tác dụng. Sau đó từng mutant sau đều cho '26 passed, 0 failed': (M1) bỏ /i ở RE_GIO; (M2) bỏ `.replace(/\s+#.*$/, '')` ở run_id; (M3) bộ bóc nháy chỉ bóc `"`, không bóc `'`; (M4) `fmHet = dong.length` → `fmHet = fmDau` (frontmatter không đóng thì coi như rỗng); (M5) bỏ /i ở `nd.match(/^run_id.../i)`; (M6) chỉ ép rỗng khoá người viết hoa khi nằm ở frontmatter. Như vậy ctn_ac1/ctn_ac2 (config.yaml, dòng ~422–423, thêm CTN-AC1-mo-dau/CTN-AC1-hoa-thuong/CTN-AC2-ngoac) xanh mà không phân biệt được bản sửa đủ với bản sửa thiếu nửa lớp. Theo mẫu P105, lớp cần một ma trận rút từ luật bên đọc, mỗi trục một ô, và số assert phải bằng số ô.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Rewriting verified_at counts a correct but quoted or commented value as a violation, producing a false chot-truong-nguoi audit line**
    Người dùng thấy gì: Nếu báo cáo đã ghi đúng giờ nhưng dưới dạng có ngoặc kép hoặc kèm chú thích, hệ thống có thể vẫn viết lại dòng đó và ghi nhận sai rằng có người đã sửa vào chỗ không được phép sửa, dù giờ đó vốn đã đúng.
    file: `feature-loop/workflows/acceptance-verify.js`
    severity: low
    Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).