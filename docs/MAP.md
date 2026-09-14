# Bản đồ tài liệu — acceptance-gate-kit

> Điểm vào duy nhất cho tài liệu của kho này. Bản đồ này **chỉ định tuyến**,
> không chứa nội dung gốc: mỗi sự thật sống ở đúng một nơi, nơi khác chỉ link.
> Khối máy-đọc ở cuối là **bản khai** của kho theo spec
> [`nha-tai-lieu-router`](superpowers/specs/2026-09-13-nha-tai-lieu-router-design.md);
> hôm nay chưa có bộ đọc nào trong engine bind vào nó (P1 của
> [kế hoạch 13/09](plans/2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md)) —
> viết trước để khi P1 hạ cánh, kho kit là đối chứng dương đầu tiên.
> ≠ [`PRODUCT-MAP.md`](../PRODUCT-MAP.md): cái đó là **bản đồ sản phẩm**, máy sinh
> từ hồ sơ `_acceptance/`, đừng sửa tay.

## Cần gì → đọc đâu

| Cần | Đọc | Vòng đời |
|---|---|---|
| Luật bất biến của kho, north star | [`CLAUDE.md`](../CLAUDE.md) | thường-trú |
| Từ chuẩn khi viết SKILL/docs/message | [`CONTEXT.md`](../CONTEXT.md) | thường-trú |
| Vận hành kit ở repo tiêu thụ | [`GUIDE.md`](../GUIDE.md) · [`QUICKSTART.md`](../QUICKSTART.md) · [`README.md`](../README.md) | thường-trú |
| Quy trình v2 — nguồn sự thật duy nhất | [`specs/workflow-v2-spec.md`](specs/workflow-v2-spec.md) | thường-trú |
| Quyết định khó đảo đã chốt | [`adr/`](adr/) | thường-trú |
| Ý chưa thành ô — hạt giống | `plans/*-hat-giong-*.md` | thường-trú |
| Phát hiện, tổng kết, khảo sát | [`findings/`](findings/) · [`research/`](research/) | thường-trú |
| Bàn giao giữa máy/tài khoản | [`handoff/`](handoff/) | thường-trú |
| Nghi thức lái-thử người-lạ (định nghĩa chuẩn) | [`reference/lai-thu-nguoi-la.md`](reference/lai-thu-nguoi-la.md) | thường-trú |
| Luật hình, skin hình | [`reference/DIAGRAM-RULE.md`](reference/DIAGRAM-RULE.md) · [`reference/diagram-skin.md`](reference/diagram-skin.md) | thường-trú |
| Hình chiếu của spec/plan | [`diagrams/`](diagrams/) · `plans/assets/` | thường-trú |
| Design doc của **một vòng** | `superpowers/specs/<ngày>-<slug>-design.md` | theo-vòng |
| Plan thi công của **một vòng** | `superpowers/plans/<ngày>-<slug>.md` | theo-vòng |
| Hồ sơ cổng của một vòng (contract · evals · evidence · sổ) | `../_acceptance/<slug>/` — **nhà kit, không khai ở đây** | theo-vòng |
| Đề xuất đã bác kèm lý do | `../.out-of-scope/` — nhà kit | thường-trú |

## Tầng theo nhịp thay đổi — tầng trên thắng khi mâu thuẫn

1. `CLAUDE.md` · `CONTEXT.md` · `adr/` — đổi bằng quyết định owner.
2. `specs/workflow-v2-spec.md` · `GUIDE.md` — đổi theo mốc phát hành.
3. `plans/*-hat-giong-*` · `findings/` · `handoff/` — đổi theo ngày làm việc.
4. `superpowers/specs|plans/` — sinh mỗi vòng, đóng khi vòng ký.
5. `diagrams/` · `plans/assets/` — chiếu của 1–4, vẽ lại từ nguồn, không sửa tay.

## Bản khai máy đọc

<!-- <<<DOC-HOMES -->
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
đặc-tả         | thường-trú | docs/specs/
ý-định         | thường-trú | docs/plans/
quyết-định     | thường-trú | docs/adr/
phát-hiện      | thường-trú | docs/findings/ · docs/research/
bàn-giao       | thường-trú | docs/handoff/
hình           | thường-trú | docs/diagrams/ · docs/plans/assets/
công-cụ        | thường-trú | docs/tools/
luật-máy       | thường-trú | CLAUDE.md · CONTEXT.md · skills/ · commands/
tài-liệu-người | thường-trú | README.md · GUIDE.md · QUICKSTART.md · docs/reference/
<!-- DOC-HOMES>>> -->

Ghi chú lời khai (13/09/2026, sau dọn nhà):
- `docs/plans/` là nhà **ý-định thường-trú** (27 hạt giống) — 16 plan theo-vòng
  cũ đã dời sang `superpowers/plans/`; `plans/assets/` là hình, khai ở hàng `hình`.
- `docs/specs/` chỉ còn hai đặc-tả thường-trú; 10 design doc theo-vòng đã dời.
- `docs/tools/` giữ `mcp-drive.mjs` (cầu nối lái-thử, không thuộc `scripts/`
  của plugin) — khai lớp `công-cụ` thay vì dời vào engine.
- Kỳ vọng khi P1/P2 hạ cánh: K1 = 0 hai-nhà · K2 = 0 file lạc trên kho này.
  Chiều đỏ của phép kiểm chạy trên bản chép cây **trước** dọn
  (`git archive 8a703c36 docs`), không chạy trên cây thật.
