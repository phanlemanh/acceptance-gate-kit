# Máy tự định tuyến mục Ngoài-n mà chính máy đề xuất known-limits / wont-fix — thiết kế

Ngày 11/10/2026 · hồ sơ `_acceptance/ngoai-n-tu-dinh-tuyen/` · hạng T2 · CỘNG (chủ kho đồng ý mở vòng 11/10,
phạm vi chốt ở Cổng Phạm vi).

Gốc: `crm-onehub/_acceptance/okr-mau-xoa-cau-hinh` — T2, PASS, 0 UNCERTAIN, năm mục Ngoài-n đều đề xuất
`known-limits`, người định tuyến đúng năm đề xuất ấy rồi ký Cổng 2. Nền đo:
`docs/findings/2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md` §3, §5 (đề 2 + 3), §7 mục 2.

## 1. Vấn đề, một đoạn

Làn V (xanh-sạch, máy đi tiếp không mời ký Cổng 2) có sẵn từ hồ sơ `veto-co-dau-vet`, nhưng ở đợt crm
`sau-14-10` nó bắn **0/71** hồ sơ: 56 hồ sơ bị chặn CHỈ vì còn mục Ngoài-n chưa có dòng sổ `gate2`. Người
định tuyến trùng đề xuất của máy **357/376 (94,9 %)**. Cổng mà câu trả lời hợp lý gần như duy nhất là «ừ» là
trạm thu phí (CLAUDE.md, North Star).

## 2. Ý định và thước

- Người hưởng: chủ kho (bớt lời mời ký và mục phân xử) · phiên Claude Code ở kho tiêu thụ (hồ sơ sạch đi
  tiếp không chờ).
- Nguyên tố: **3 — khoảnh khắc quyết thật** (bỏ trạm thu phí; đảo-rẻ là mặt sau: máy giữ đường đảo thì máy
  được đi trước).
- Dự báo đo bằng **vị từ thật** (`xanhSach` của `scripts/khong-can-nguoi.mjs`) trên 71 hồ sơ signed-off của
  đợt (crm `origin/onehub` 27d47de0, dòng gate2 Ngoài-n của người gỡ khỏi sổ để dựng lại trạng thái trước
  Cổng 2, dòng máy chèn theo đúng điều kiện của thiết kế này):

  | | Hôm nay | Sau |
  |---|--:|--:|
  | Hồ sơ đi làn V (không mời ký) | 0 | **37** |
  | Hồ sơ mời ký Cổng 2 | 71 | **34** |
  | Mục Ngoài-n người phải phân xử | 565 | **172** |
  | Mục máy tự định tuyến | — | 393 |

  Con số 172 (không phải 52 như mô phỏng thô của finding) là giá có chủ đích của ràng buộc «T3 và có
  UNCERTAIN giữ cho người như hôm nay»: 120 mục known-limits/wont-fix nằm trong 12 hồ sơ T3/UNCERTAIN, máy
  không đụng. Giá của 393 mục máy đi trước: theo finding §3, 11/237 mục người từng định tuyến khác đề xuất
  (8 ở một hồ sơ UI `logo-onehub`, chủ yếu «máy: known-limits → người: mở hợp đồng mới») — đảo rẻ, không mất
  dấu (§6).

## 3. Cách làm

### 3.1 Bên ghi — `scripts/dinh-tuyen-may.cjs` (MỚI, gói acceptance-gate)

`node <ag>/scripts/dinh-tuyen-may.cjs --write|--check --root <repo> --slug <slug>`

1. **Khoá kho** `feature_loop.ngoai_n_tu_dinh_tuyen` trong `_acceptance/config.yaml`, đọc bằng
   `resolveConfigKey` của `lib/evidence-core.cjs`. Vắng hoặc `false` → thoát 0, một dòng
   «dinh-tuyen-may: tắt», **0 byte**. `true` → đi tiếp. Giá trị khác → thoát 2 gọi tên khoá + hai giá trị
   hợp lệ, 0 byte. **Mặc định tắt** — bật theo kho (luật «cân trên mọi kho», thứ tự nghiệm bước 3); crm bật
   ở chiến dịch phát hành, không phải ở vòng này.
2. **Điều kiện hồ sơ** — mọi vế phải đúng, sai vế nào thì thoát 0, một dòng «không định tuyến: <vế>»,
   0 byte: `status: verified` · `risk_tier: T2` · `verdict: PASS` · 0 `UNCERTAIN` (cùng regex với
   `xanhSach`) · `bypass_used` không true · `enforcement_mode` khác `off` · `triage_failed` không true ·
   `review-findings.md` không `suspect_empty`, không khối «Chưa phân loại». Mỗi vế mang một mã; tập mã chứa
   mọi mã của khối `EVIDENCE-XANH-SACH-BLOCK` (nguồn duy nhất của sáu điều kiện xanh-sạch) trừ `sections` —
   ca kiểm rút khối và so tập, và vi phân với `khong-can-nguoi.mjs --check` trên cùng fixture (gap-probe F3).
3. **Mục được ghi** — đọc mục bằng `parse` của `lib/out-of-contract.cjs` (CÙNG bộ đọc với thẻ và lưới), nhãn
   `Ngoài-<vị trí>` cùng cách đánh số. Mục được ghi khi: token đề xuất (bằng `tokenOf` — so tiền tố, có đuôi
   chú thích vẫn nhận) là `known-limits` hoặc `wont-fix` **và** sổ chưa có dòng `gate2` nào gọi tên nó (bộ
   đọc `daDinhTuyen` — người hay máy đều tính). `new-contract`, token lạ, thiếu đề xuất → không ghi (vẫn
   của người).
4. **Dòng sổ máy** — một dòng mỗi mục, append vào `decisions.jsonl`, id `d-<UTC>-<n>` với `<n>` = số dòng
   mới (cùng luật DEC-ID-RECIPE). Khuôn đặt MỘT chỗ có marker trong script (`DINH-TUYEN-MAY-LINE`):

   ```
   {"id":"d-<UTC>-<n>","type":"revisit","stage":"gate2","at":"<ISO>","decision":"Ngoài-<n>: <chữ người>","why":"máy tự định tuyến theo đề xuất S4 «<token>» — kho bật feature_loop.ngoai_n_tu_dinh_tuyen","cost_if_wrong":"<câu giá theo token>","may":"dinh-tuyen-ngoai-n","tieu_de":"<tiêu đề mục>","dao":"/acceptance-gate:signoff <slug> Ngoài-<n>: mở hợp đồng mới; Ký"}
   ```

   - `<chữ người>` lấy từ `OOC_GLOSS_NGUOI` (`ghi Known limits` · `chấp nhận, không sửa`) — đúng chữ
     người gõ ở signoff, nên dòng máy và dòng người cùng hình dạng với bộ đọc làn V.
   - **Phân biệt máy/người bằng khoá `may`, KHÔNG bằng `decided_by`.** `scripts/ho-so-tom-tat.cjs`
     (`laNguoi`) coi `decided_by` khác rỗng là dòng của người — đặt `decided_by: "may"` sẽ làm bộ đọc cũ
     đếm máy thành người. Dòng máy không có `decided_by`, nên mọi bộ đọc cũ xếp nó là máy, đúng.
   - `tieu_de` giữ tiêu đề mục lúc ghi — để phát hiện dòng máy trỏ nhầm mục khi lượt chấm sau đổi thứ tự (§5).
   - `dao` — lệnh đảo một dòng (§6).
5. **Notes hợp đồng** — mục `known-limits` thêm một gạch dưới `## Notes` của `contract.md` (vắng mục thì tạo
   ở cuối), như người đang làm ở crm: «Ngoài-<n> (máy định tuyến <ngày>, đề xuất S4 known-limits): <Người
   dùng thấy gì> — `<file>`». `wont-fix` chỉ ghi sổ. Ghi hợp đồng tự kiểm bằng `evaluateContractWrite`
   (cùng luật lưới ghi-lúc-viết) như `khong-can-nguoi.mjs`.
6. **Không chạm** `evidence-report.md` (mục Known limits / Ngoài hợp đồng của báo cáo GIỮ rỗng — đổ Ngoài-n
   vào đó là tự tắt làn V, finding §5 đề 3), `run-log.jsonl`, `review-findings.md`, frontmatter hợp đồng,
   `human_signoff`.
7. Đầu ra: một dòng `dinh-tuyen-may: <k> mục (known-limits <a> · wont-fix <b>) — đảo: <lệnh đảo của mục
   đầu>`; 0 mục → «dinh-tuyen-may: 0 mục». `--check` in cùng dòng, không ghi.
8. **Chạy lại an toàn:** lần hai không ghi byte nào (mục đã có dòng).

### 3.2 Bên đọc làn V — KHÔNG ĐỔI

`daDinhTuyen` (lib, t3) đã nhận mọi dòng `stage: gate2` gọi tên `Ngoài-n` — không đòi người viết. Nên dòng
máy làm `xanhSach`, `khong-can-nguoi.mjs` và `xanh_sach_check` của `pre-merge-check.sh` thấy mục đã định
tuyến mà **không sửa dòng nào** của `lib/**`, `hooks/**`, `pre-merge-check.sh`, `recheck-evidence.cjs`
(t3_paths) và không đổi đường verdict (finder → refute → REJECT) — điều kiện tin cậy của luật (c). 12 kho có
CI đọc `human_signoff` không đổi gì.

### 3.3 Thẻ Cổng Bằng chứng — `scripts/gate-card.js`

Bộ đọc dòng máy đặt cạnh bên ghi (`dinh-tuyen-may.cjs` xuất `docDinhTuyen(ledgerText)` → với mỗi `Ngoài-n`:
dòng gate2 MỚI NHẤT gọi tên nó, là máy hay người). Nhãn tách thành SỐ (cùng hình dạng `NHAN_RE` của lib, kể cả
khoảng «Ngoài-a đến Ngoài-b») — không so chuỗi con, để `Ngoài-1` không lẫn `Ngoài-11` (hồ sơ crm trung bình ~8
mục; gap-probe F2). Bên ghi và thẻ dùng CHUNG hàm này. Thẻ:
- Mục mà dòng mới nhất là máy → ô câu gộp vẫn điền sẵn chữ đề xuất (như hôm nay), nhưng nhãn chuyển từ
  `routing.hoi` sang `routing.bao`; khối «Ngoài hợp đồng» in «Máy đã định tuyến: <chữ người> — đảo:
  `<dao>`» thay câu khuyến nghị.
- Khối «Quyết định CHƯA duyệt» (Treo): dòng máy mang chữ «máy định tuyến» + lệnh đảo.
- `--extract` thêm `out_of_contract.dinh_tuyen_may: [{ nhan, id, de_xuat, dao }]`.
- Dòng người viết SAU dòng máy cho cùng mục → mục thôi là «máy định tuyến» (người thắng).
- Dòng máy có `tieu_de` khác tiêu đề mục hiện tại → cờ vàng «dòng máy trỏ mục đã đổi: Ngoài-n», mục quay
  về `routing.hoi`.
- **Đọc-cũ:** sổ không có dòng nào mang `may` → mọi nhánh mới không chạy; thẻ của mọi hồ sơ đã ký đọc như
  hôm nay (ca LM20 + bản ghi mốc định tuyến `routing-baseline.txt` không đổi dòng nào).

### 3.4 feature-loop — `feature-loop/skills/feature-loop/SKILL.md`

Một khối marker `DINH-TUYEN-MAY`, gọi từ hàng `verified` của bảng trạng thái và từ bước PASS của S4, chạy
**trước** `khong-can-nguoi.mjs --write`:
`node "<acceptance-gate>/scripts/dinh-tuyen-may.cjs" --write --root . --slug <slug>`. Thoát 0 → nói lại
đúng dòng in (gộp vào dòng báo một dòng của làn V khi hồ sơ đi tiếp), commit sổ + hợp đồng cùng gói evidence
máy viết. Thoát 2 → vào Gate 2 (không chạy `khong-can-nguoi`), dòng lý do nằm trong gói Cổng 2. Đường
giải `<acceptance-gate>` qua `resolve-plugin.mjs` như các bước khác.

**Nối DP7:** khối `TRONG-DOT` không đổi. Trong đợt, bước này chạy y như ngoài đợt; dòng báo làn V đi qua bảng
đợt như mọi dòng báo khác. Đợt thử crm 26/10 và OneFlow ~27/10 là chỗ reality đọc số (§7).

## 4. Phương án đã loại

- **Sửa `daDinhTuyen` trong `lib/` để chỉ nhận dòng máy khi tiêu đề khớp** — chặn được dòng máy cũ trỏ
  nhầm mục ngay ở lưới trước-merge, nhưng chạm t3_paths → vòng T3 (thêm Gate 1.5, trần 4) và đổi bộ đọc mà
  12 kho chép. Loại; giới hạn khai ở §5 với ngưỡng.
- **Dùng `decided_by: "may"`** — gọn nhưng `ho-so-tom-tat.cjs` đếm thành người (§3.1 bước 4).
- **Ký Cổng 2 theo lô / đổ Ngoài-n vào Known limits của báo cáo** — đề 2/3 gốc; finding §5 đã bác (lô bỏ
  `human_signoff` làm 12 CI đỏ; Known limits có nội dung tự tắt làn V).
- **Định tuyến cả mục trong hồ sơ T3/UNCERTAIN** (dự báo 565 → 52 thay 172) — ngược ràng buộc đề bài; vẫn
  để người.
- **Bật mặc định** — mọi kho đổi cách ký Cổng 2 dưới chân, kể cả kho chưa đo. Bật theo kho.

## 5. Giới hạn đã khai

- **Dòng máy trỏ nhầm mục sau một lượt chấm mới** (đổi thứ tự/nội dung mục) — cùng giới hạn đã khai cho
  dòng người ở hồ sơ `ho-so-khep-thoi-hoi`. Bên ghi bắt (thoát 2, không ghi) và thẻ cờ vàng; lưới trước-merge
  (lib) KHÔNG bắt. Ngưỡng mở lại (sửa `daDinhTuyen`, vòng T3): ≥1 hồ sơ ở bất kỳ kho nào đi làn V với dòng máy
  mà `tieu_de` ≠ tiêu đề mục hiện tại — đếm bằng `dinh-tuyen-may.cjs --check` trên các hồ sơ `machine-cleared`.
- **Lệnh đảo đi qua chữ ký**: đảo một mục = người ký Cổng 2 với lựa chọn khác cho mục ấy (signoff đã nhận
  hồ sơ `machine-cleared`). Không có lệnh đảo-mà-không-ký. Ngưỡng mở: ≥1 lần owner muốn đảo một mục mà không
  muốn ký hồ sơ.
- Gạch Notes của mục known-limits mà người đảo sang «mở hợp đồng mới» không bị gỡ — hạn chế đó vẫn đúng tới
  khi việc mới sửa nó.

## 6. Đường đảo

Mỗi dòng máy mang `dao` = `/acceptance-gate:signoff <slug> Ngoài-<n>: mở hợp đồng mới; Ký` — lệnh cổng
người (khoá model-invocation, ADR 0002), câu gộp đúng ngữ pháp signoff hiện có. Người sửa chữ sau `Ngoài-<n>:`
nếu muốn lối khác («nâng phạm vi sửa ngay» làm hồ sơ không ký được, quay vòng sửa — đúng luật signoff bước 5).
Dòng người ghi sau dòng máy → thẻ coi mục là người định tuyến. Khoá kho về `false` → máy thôi ghi từ hồ sơ kế;
dòng đã ghi giữ nguyên làm sử liệu.

16/71 hồ sơ của đợt là hồ sơ máy-đi-trước ở Cổng 1 (`veto_state: mo`, không người duyệt). Thân
`commands/signoff.md` hôm nay bảo đọc câu gộp của loại hồ sơ này theo khối `GATE-ONESHOT-LAN-V` (chỉ «đi tiếp»
/ «kéo lại»), trong khi bước 3 lại cho «người ký trong cửa veto». Vòng này thêm MỘT câu vào signoff: câu gộp
có `Ký` (hoặc có `Ngoài-<n>:`) trên hồ sơ máy-đi-trước đi đường ký thường (bước 3–7), không đọc theo khối
làn V — để lệnh đảo chạy được ở cả 16 hồ sơ ấy. Khối `GATE-ONESHOT-LAN-V` không đổi.

## 7. Reality

Đợt thử crm 26/10 (khi crm bật khoá) đọc: số hồ sơ đi làn V / số mời ký, số mục máy định tuyến bị người đảo.
Ngưỡng đáng xem lại thiết kế: tỉ lệ đảo > 10 % số mục máy định tuyến trong một đợt (đo hôm nay: 11/237 ≈
4,6 %).

## 8. Bảng quét (morphological-scan, preset test-matrix)

- Chân sản phẩm: [SUY-TỪ-REPO: lib/out-of-contract.cjs] · [SUY-TỪ-REPO: scripts/khong-can-nguoi.mjs] ·
  [SUY-TỪ-REPO: scripts/gate-card.js] · [SUY-TỪ-REPO: commands/signoff.md].
- Chân ngành: [NGÀNH: GitHub Dependabot auto-merge — máy gộp bản vá theo luật kho bật, người đảo bằng revert]
  (bật theo kho, đảo rẻ) · [NGÀNH: Renovate `automerge` — tắt mặc định, bật theo cấu hình kho].

| Trục | Giá trị | Thước CE |
|---|---|---|
| A · khoá kho | vắng · false · true · giá trị sai | ba nhánh của bộ đọc khoá |
| B · điều kiện hồ sơ | đủ · status≠verified · T3 · verdict≠PASS · UNCERTAIN · bypass · enforcement off · triage_failed · findings sai khuôn/chưa phân loại | sáu điều kiện `xanhSach` + hai cờ triage |
| C · đề xuất của mục | known-limits · wont-fix · new-contract · token lạ/thiếu · có đuôi chú thích | `PROPOSALS` + `tokenOf` |
| D · sổ cho mục | chưa dòng · dòng người · dòng máy khớp · dòng máy lệch tiêu đề · người sau máy | `daDinhTuyen` + khoá `tieu_de` |

Mặt đọc cắt ngang mọi ô: bên ghi · `khong-can-nguoi`/`pre-merge` · thẻ (HTML + `--extract`) · SKILL.

- **Core:** A×B → AC-1, AC-4 · B=đủ × C∈{KL,WF} × D=chưa → AC-2 · C∉{KL,WF} và D≠chưa → AC-3 · mặt lưới →
  AC-5 · D=lệch → AC-6 · mặt thẻ → AC-7, AC-8 · mặt SKILL → AC-9 · khai khoá → AC-10.
- **Later:** lệnh đảo-mà-không-ký (ngưỡng §5) · bên đọc lib kiểm `tieu_de` (ngưỡng §5) · trang lộ trình /
  bản đồ sản phẩm đếm hồ sơ «máy định tuyến» riêng.
- **Never:** máy định tuyến `new-contract` (mở việc là cam kết mới — người) · máy ghi mục Known limits của
  báo cáo (tự tắt làn V).
