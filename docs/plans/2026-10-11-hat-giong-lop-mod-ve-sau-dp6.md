# Hạt giống — lớp mod chỉ vẽ của gói `dieu-phoi` và đo sống §12.3, tách khỏi DP6

Gốc: `_acceptance/dieu-phoi-lop-mod/` (S1 ngày 11/10/2026: số đo, thiết kế và năm tiêu chí phần mod; Điều
phối M5 tách phạm vi cùng ngày, sổ quyết định của hồ sơ ghi lý do). Hàng lộ trình DP6 (`docs/plans/lo-trinh-kit.json`,
mốc 01/11) mang neo ngoài của việc này: `crm/_acceptance/dieu-phoi-hai-tang` — chủ kho đồng ý đưa Mods vào vòng
10/10. Hạt giống là SỔ, không phải ô.

## Vì sao tách

DP6 ở mốc 01/11, mà hai lỗi lõi đo được ở S1 của DP6 (bộ phân loại S4 bỏ lọt `timeout …`/`env -u … node
…repin-lane.mjs`; giám sát không thức khi thợ chờ người) làm hỏng đúng đợt thử crm ~26/10 chạy gói bản mốc 25/10.
Phần lõi Node ở lại DP6 và đi ngay sau Cổng Phạm vi; phần dưới đây cần khung mod của DP4 (chưa gộp) nên chờ.

## Việc còn lại — đã thiết kế, chưa làm

Ba lời hứa phần mod, đều thuộc vế «Trạng thái đợt hiện ngay trong app» của câu giao DP6:

1. **CLI `xem --json`.** In mô hình `moHinh` dạng JSON cộng `day_cua_cwd`; kho không đợt in `{"dot":null}`,
   thoát 0; `xem` không cờ in như cũ. Một hàm cho `xem`, `bang.html` và khung (spec workflow §16 T8).
2. **Dải trên ô nhập (`AbovePrompt`) và pane.** Mod gọi
   `$.process.run(['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'xem', '--json'], { cwd: $.session.cwd() })` ở
   `session.start` và mỗi 20″ (không đợt: 120″), giữ trong `$.state`; dải một dòng
   `Đợt <tên> · <pha> · S4: <phiên> → HH:MM · chờ lượt <n> · cần anh <n>`, ở phiên thợ thêm `Dãy <id>: <hàng> ·
   <tiến độ>`, giảm tải thì mở đầu `GIẢM TẢI`; lời gọi CLI lỗi → một dòng «khung: không đọc được đợt». Nút «xem»
   trên dải mở pane (bấm nút là «được hỏi» nên pane đặt ở mọi bề rộng — tránh ngưỡng 144 cột của mở «không được
   hỏi», `claude-code.d.ts` 2.1.295 dòng 14118–28). Hàm vẽ thuần ở `dieu-phoi/scripts/khung.mjs` (không import gì).
3. **`/dieu-phoi:xem` không qua model.** Mod nghe `command.run` của lệnh markdown này và trả `{ text }` = `veXem`
   của cùng mô hình, đồng thời mở pane; phiên không có mod chạy tệp lệnh markdown như cũ. Chưa kiểm: hook
   `command.run` trả lời được lệnh markdown của chính gói không — kiểm bằng `claude plugin test`; không được thì
   đăng ký lệnh riêng `dot`.

Răng phần mod: mod của hàng này chỉ nghe {`session.start`, `ui.render`, `ui.press`, `command.run`} — không nghe
`tool.call`, `tool.check`, `classic.PreToolUse`, `classic.PermissionRequest` (đọc từ dòng «hooks: …» của
`claude plugin validate --strict --json` bản ≥ 2.1.287), cộng răng T11 của DP4. Ba đường làm lời gọi chạy không
qua hỏi quyền ngoài `tool.call` (`tool.check` allow, `classic.PreToolUse` allow, `classic.PermissionRequest`
allow) và đường thứ tư (`tool.call` trả `{result}` không gọi `next`) đã báo DP4 ngày 11/10.

## Khung mod của DP4 mà hàng này nối vào (DP4 chốt 11/10, đo trên bản sao)

- `modules` chỉ nhận MỘT mục mỗi gói (mục thứ hai bị validate từ chối: «names one hooks module per plugin»).
  `dieu-phoi/hooks/hooks.json` → `"modules": ["./mod/register.ts"]`; mỗi phần một tệp
  `dieu-phoi/hooks/mod/<phan>.ts` xuất `dangKy<Phan>(on: On)`; `register.ts` chỉ gọi lần lượt các `dangKy…(on)`,
  không tự `on(...)`. Phần của DP4: `mod/doc-muc-dung.ts` → `dangKyDocMucDung`. Phần của hàng này dự kiến
  `mod/khung.ts` → `dangKyKhung`.
- validate gom sự kiện của mọi phần về `./mod/register.ts`, nên bảng `MOD-SU-KIEN` (marker, ở
  `dieu-phoi/scripts/mod-luat.mjs`) khoá theo TỆP PHẦN — hàng này thêm một dòng
  `'./mod/khung.ts': ['session.start', 'ui.render', 'ui.press', 'command.run']`.
- Răng T11 của DP4 (`tests/dieu-phoi/kiem-mod.mjs` + ca DP4-13): validate sạch và `modules` đúng một mục · sự kiện
  quét chữ của mỗi phần ⊆ dòng bảng của phần đó · hợp sự kiện quét chữ == tập validate thấy · mọi tệp dưới
  `hooks/mod/` là `register.ts` hoặc một khoá của bảng · quét «không bao giờ cho phép» trên mọi tệp dưới
  `hooks/mod/**` (chữ `allow` dạng chuỗi hay khoá, và khoá/viết tắt `result` trong đối tượng trả về — phủ đủ bốn
  đường). Hàng này chỉ thêm dòng bảng và tệp phần; răng tự phủ.
- Đính chính của DP4: `claude` 2.1.281 trên PATH VẪN validate được `modules` (báo đúng dòng «hooks:»), chỉ thiếu
  `plugin test` và `gatingHooks`; `kiem-mod.mjs` tìm bản có `plugin test` (PATH, rồi bản của app theo semver).

## Đo sống §12.3 — kế hoạch đã soạn

Một mod chỉ quan sát `dp6-tham-do` trong riêng một phiên (tự kiểm `$.session.id()`), mọi hook trả `next(e)`
nguyên vẹn, nhật ký ghi thẳng vào `evidence/tham-do.jsonl` của hồ sơ hàng mới. Bốn kịch bản, mỗi kịch bản có dòng
mở/đóng: (1) một tác tử Workflow chạy lệnh mà chế độ auto luôn hỏi, người bấm Deny — đối chứng dương là dòng
`tool.call` mang `agentId` bị người từ chối; xem `classic.Notification permission_prompt` có tới phiên cha không ·
(2) dải và pane mở không được hỏi trên desktop (`isPlaced`, `bodyColumns`) · (3) `$.prompt.submit` sau 60″ có
đánh thức phiên desktop không · (4) `$.process.run(['node','-v'])` chạy được trên desktop không (quyết nhánh dự
phòng: đọc thẳng tệp đợt bằng `$.fs` + `moHinh`). Hai chạm người: Enable hot reloading, Deny một hộp quyền.
Mã nguồn mod thăm dò đã qua `validate --strict` 2.1.295 ngày 11/10 (soạn trong scratchpad phiên DP6, không nạp).

Câu 1 quyết một việc của lõi đã gộp ở DP6: hộp quyền của tác tử Workflow có tới hook `Notification` không. Tới
→ vế «không nuốt hộp xin quyền» của DP6 phủ cả ca K3b; không tới → README gói khai «mù: hộp quyền của tác tử
Workflow» và luật 52 của crm còn giá trị.

## Sự thật tài liệu kiểu 2.1.295 đã tra (11/10)

- Tác tử con gọi công cụ thì mod nhận `tool.call` riêng có `agentId` (D12653–60, D12755–56); tác tử Workflow
  «carry ids no list names» (D199–200). Hộp duyệt quyền do engine tự vẽ (D9356–57).
- `AbovePrompt` chỉ ở terminal và desktop (D10253); `Pane` mọi bề mặt (D10310).
- `$.session.send`: «delivered» = đã xếp hàng bên nhận (D11612–16); tin phiên khác tới «as a turn of its own or
  delivered into a running one» (D8897–901).
- `$.prompt.submit` xếp một lượt riêng khi phiên rảnh, «so background work can wake a quiet session»
  (reference.md 158–163).
- Module mod chỉ import tệp tương đối và `"claude-code"` — `phan-loai-s4.mjs` (import `node:path`) bị `validate`
  từ chối, `mo-hinh.mjs` thì qua; `hooks.json` khai cùng lúc `hooks` và `modules` thì qua.
- `claude` trên PATH máy M5 là 2.1.281 (chưa có mod); app desktop chạy 2.1.295.

## Ngưỡng mở thành hàng thi công

DP4 gộp khung mod vào main (mục `modules`, tệp đăng ký, răng T11). Neo: hàng DP6 của lộ trình kit (mốc 01/11) —
hàng đó mở lại vòng với slug riêng cho phần mod, đọc tệp này làm đầu vào brainstorm.

## Luật «thân heredoc là dữ liệu» — đã thu, khuôn thay thế (11/10)

Nguồn: `_acceptance/dieu-phoi-lop-mod/decisions.jsonl` dòng 20 (chủ kho chọn thu phạm vi tại điểm dừng-vá S4 lượt 2).

DP6 dựng luật «thân heredoc là dữ liệu, trừ khi trình thông dịch đọc stdin» rồi thu lại: luật cần một mô hình đủ
của argv `bash`/`sh`/`node`, và hai lượt chấm liền tìm ra lệnh S4 lọt qua chính bộ đọc ấy (`bash -o pipefail <<EOF`,
rồi `bash <<'EOF' 2>&1 | tail`). Bộ phân loại hôm nay quét thân như mọi dòng lệnh; giá phải trả: 2 trên 46.801 lời
gọi Bash đo 11/10 bị chặn nhầm (`cat > tep <<'EOF'` nhắc `repin-lane.mjs`; `python3 - <<'PY'` ghi sổ có tên script).

Khuôn thay thế, an toàn theo hướng chặn (đảo mặc định): thân là dữ liệu CHỈ khi lệnh nhận heredoc thuộc một danh
sách ĐÓNG không chạy thân — `cat`/`tee` có chuyển hướng ra tệp, `git commit -F -`, `gh … --body-file -` — VÀ đoạn
ấy không đổ vào ống `|`. Mọi lệnh nhận khác (kể cả trình thông dịch, kể cả dạng chưa biết) → quét thân như nay. Lọt
chỉ xảy ra nếu một lệnh trong danh sách chạy thân, mà không lệnh nào trong đó làm vậy. Không sửa được ca `python3 -`
(trình thông dịch thật — đúng là phải quét).

Ngưỡng mở thành việc: một lần đo lại bản ghi theo design DP6 §2.1 thấy > 10 lời gọi heredoc chặn nhầm.

Nghiệm đúng tầng cho cả lớp (Điều phối M5 gợi ý 11/10): **S4 tự xưng** — chính `repin-lane.mjs`, `s4-args.mjs`
và `duong-nen.mjs` tự lấy và kiểm khoá tài nguyên lúc khởi, hook chặn chỉ còn là lưới phụ. Bộ phân loại đọc chữ
shell là một tháp: lớp «lệnh S4 lọt qua bộ đọc cú pháp» đã đổi da ba lần trong một vòng (vỏ bọc mang cờ → thân
heredoc cho trình thông dịch kèm cờ mang giá trị → heredoc kèm chuyển hướng). Ngưỡng mở: ≥ 1 lượt S4 thật lọt khoá
sau khi DP6 gộp (đếm ở sổ chạy của đợt thử).

## Phụ lục — mã nguồn mod thăm dò (qua `claude plugin validate --strict` 2.1.295, 11/10)

Ba tệp. Mã phiên và đường nhật ký là của phiên DP6 ngày 11/10 — hàng sau thay bằng phiên và hồ sơ của nó.

`.claude-plugin/plugin.json`:

```json
{ "name": "dp6-tham-do", "version": "0.1.0", "description": "DP6 thăm dò §12.3 — chỉ quan sát, mọi hook trả next(e) nguyên vẹn; chỉ chạy trong phiên DP6", "author": { "name": "Manh Phan" } }
```

`hooks/hooks.json`:

```json
{ "modules": ["./register.tsx"] }
```

`hooks/register.tsx`:

```tsx
// dp6-tham-do — mod THĂM DÒ chỉ quan sát cho hàng DP6 (design §6 của
// docs/superpowers/specs/2026-10-11-dieu-phoi-lop-mod-design.md).
// Luật: mọi hook trả kết quả của next(e) NGUYÊN VẸN; không hook nào trả quyết định của riêng nó
// (không allow, không deny, không decision). Chỉ chạy trong đúng phiên DP6: phiên khác → im hoàn toàn.
// Ghi nhật ký vào evidence/tham-do.jsonl của worktree DP6. Mốc kịch bản do phiên DP6 chạy lệnh Bash
// `true # dp6-kich-ban <n> <dau|cuoi>`; mod thấy lệnh đó qua tool.call và ghi dòng mốc theo đúng thứ tự.
import type { Register } from 'claude-code'

const PHIEN = 'bbb12524-dfdf-4014-9695-73e00c079d4f'
const NHAT_KY =
  '/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/wizardly-gates-c0ac67/_acceptance/dieu-phoi-lop-mod/evidence/tham-do.jsonl'
const MOC = /#\s*dp6-kich-ban\s+([1-4])\s+(dau|cuoi)\b/


let laPhienDp6: boolean | null = null
let hang: Promise<void> = Promise.resolve()
let daVeDai = false

async function dungPhien($: any): Promise<boolean> {
  if (laPhienDp6 === null) laPhienDp6 = (await $.session.id()) === PHIEN
  return laPhienDp6
}

// Ghi tuần tự (đọc rồi ghi lại) để các hook chạy chồng không đè dòng của nhau.
function ghi($: any, dong: Record<string, unknown>): Promise<void> {
  hang = hang
    .then(async () => {
      const luc = new Date(await $.clock.now()).toISOString()
      const cu = (await $.fs.exists(NHAT_KY)) ? await $.fs.read(NHAT_KY) : ''
      await $.fs.write(NHAT_KY, `${cu}${JSON.stringify({ luc, ...dong })}\n`)
    })
    .catch(() => {})
  return hang
}

async function kichBan($: any, n: number): Promise<void> {
  if (n === 2) {
    const r = await $.ui.open({ id: 'dp6-tham-do', title: 'DP6 thăm dò' })
    await ghi($, { su_kien: 'ui.open', kich_ban: 2, duoc_hoi: false, isPlaced: r?.isPlaced ?? null })
  }
  if (n === 3) {
    $.clock.after(60_000, () => tuThuc($))
  }
  if (n === 4) {
    try {
      const r = await $.process.run(['node', '-v'], { cwd: await $.session.cwd(), timeoutMs: 10_000 })
      await ghi($, { su_kien: 'process.run', kich_ban: 4, exitCode: r.exitCode, stdout: String(r.stdout).trim().slice(0, 40), stderr: String(r.stderr).trim().slice(0, 200) })
    } catch (err: any) {
      await ghi($, { su_kien: 'process.run', kich_ban: 4, loi: String(err?.message ?? err).slice(0, 200) })
    }
  }
}

async function tuThuc($: any): Promise<void> {
  await ghi($, { su_kien: 'prompt.submit:goi', kich_ban: 3 })
  const r = await $.prompt.submit({ text: 'dp6 thăm dò, kịch bản 3: lượt này do mod tự gửi khi phiên rảnh. Chỉ trả lời đúng hai chữ «đã thức», không làm gì khác.' })
  await ghi($, { su_kien: 'prompt.submit:xong', kich_ban: 3, ket_qua: JSON.stringify(r ?? null).slice(0, 200) })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) await ghi($, { su_kien: 'session.start', surface: (e as any).surface ?? null })
    return r
  })

  on('tool.call', async ($, e, next) => {
    const r: any = await next(e)
    if (!(await dungPhien($))) return r
    const lenh = typeof (e as any).command === 'string' ? (e as any).command : ''
    const moc = MOC.exec(lenh)
    if (moc) {
      await ghi($, { kich_ban: Number(moc[1]), moc: moc[2] })
      if (moc[2] === 'dau') await kichBan($, Number(moc[1]))
      return r
    }
    await ghi($, {
      su_kien: 'tool.call',
      tool: e.tool,
      agentId: (e as any).agentId ?? null,
      lenh: lenh.slice(0, 120),
      deny: r?.deny ?? null,
      isError: r?.isError ?? null,
      text: String(r?.text ?? '').slice(0, 160),
    })
    return r
  })

  on('tool.check', async ($, e, next) => {
    const r: any = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'tool.check', tool: e.tool, agentId: (e as any).agentId ?? null, decision: r?.decision ?? null, reason: String(r?.reason ?? '').slice(0, 160) })
    }
    return r
  })

  on('classic.Notification', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'classic.Notification', notification_type: (e as any).notification_type ?? null, message: String((e as any).message ?? '').slice(0, 160), agent_id: (e as any).agent_id ?? null })
    }
    return r
  })

  on('classic.PermissionRequest', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'classic.PermissionRequest', tool_name: (e as any).tool_name ?? null, agent_id: (e as any).agent_id ?? null })
    }
    return r
  })

  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'turn.complete', agentId: (e as any).agentId ?? null, reason: (e as any).reason ?? null, answer: String((e as any).answer ?? '').slice(0, 80) })
    }
    return r
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await dungPhien($))) return next(e)
    if (!daVeDai) {
      daVeDai = true
      await ghi($, { su_kien: 'ui.render:AbovePrompt', surface: (e as any).surface ?? null })
    }
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text dimColor>DP6 thăm dò đang chạy — chỉ quan sát</Text>
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: 'dp6-tham-do' }, async ($, e, next) => {
    const p: any = (e as any).props ?? {}
    await ghi($, { su_kien: 'ui.render:Pane', surface: (e as any).surface ?? null, bodyColumns: p.bodyColumns ?? null, placement: p.placement ?? null })
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text>DP6 thăm dò — pane mở không do người hỏi</Text>
      </Box>
    )
  })
}
```

## Mục «mở hợp đồng mới» từ Cổng Bằng chứng DP6 (ký 11/10)

Nguồn: `_acceptance/dieu-phoi-lop-mod/decisions.jsonl` dòng 30 (người ký chọn).

- **Ngoài-17/22/23/33/37 — «bản cũ» theo merge-base sống.** Đã sửa trong vòng (sổ dòng 24–27): bản cũ neo vào
  commit cố định của nhánh chính, lời hứa «nhánh không đổi X» neo vào commit gộp của chính nhánh. Ghi ở đây để
  lớp có dấu: đây là ca thứ sáu của lớp «ca nguyên vẹn neo merge-base sống» trong gói `dieu-phoi` (hạt giống
  `docs/plans/2026-10-11-hat-giong-ca-nguyen-ven-neo-merge-base.md` của DP4 — hàm «mốc PR #N» dùng chung + ca
  quét cấm merge-base trần). Ngưỡng của hạt giống đó (≥ 1 ca mới sau DP4) coi như đã chạm.
- **Ngoài-34 — `can_phan` gắn cho mọi sự kiện `cho-nguoi`.** Yêu cầu `can-nguoi` của DP7 vừa tạo việc chờ người
  vừa mang `can_phan`, nên giám sát thức hai lần cho một yêu cầu. Ngưỡng: đợt thử có ≥ 1 lần giám sát báo trùng
  một việc chờ người.

**Đếm chặn nhầm heredoc (26/10): 3/10.** Thêm một lần thật ở onehub-invest (25/10, dieu-phoi 2.33.1): heredoc ghi ghi
chú nhắc tên script đường nền bị chặn. Xem `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md` mục 9.
