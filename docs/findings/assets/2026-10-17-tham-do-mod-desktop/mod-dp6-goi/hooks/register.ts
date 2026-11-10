// dp6-goi — mod gọi lệnh cho câu 5. Hook command.run của dp6-tham-do bị bỏ qua khi chính dp6-tham-do gọi
// $.command.run («every hook but the calling one» — đo 17/10: cả đối chứng dp6-ping cũng không được trả lời),
// nên lời gọi phải đến từ một gói khác. Chỉ quan sát: session.start trả next(e) nguyên vẹn, không hook cổng nào.
import type { Register } from 'claude-code'

const PHIEN = 'de9f201d-f036-4e2c-9164-f8c4560a2409'
const NHAT_KY =
  '/private/tmp/claude-501/-Users-manhphan-dev-acceptance-gate-kit--claude-worktrees-elated-newton-69cf37/de9f201d-f036-4e2c-9164-f8c4560a2409/scratchpad/tham-do.jsonl'

let hang: Promise<void> = Promise.resolve()
function ghi($: any, dong: Record<string, unknown>): Promise<void> {
  hang = hang
    .then(async () => {
      const luc = new Date(await $.clock.now()).toISOString()
      const cu = (await $.fs.exists(NHAT_KY)) ? await $.fs.read(NHAT_KY) : ''
      await $.fs.write(NHAT_KY, `${cu}${JSON.stringify({ luc, nguon: 'dp6-goi', ...dong })}\n`)
    })
    .catch(() => {})
  return hang
}

async function chay($: any, command: string): Promise<void> {
  await ghi($, { su_kien: 'command.run:goi', kich_ban: 5, command })
  try {
    const r = await $.command.run({ command })
    await ghi($, { su_kien: 'command.run:xong', kich_ban: 5, command, text: String(r?.text ?? '').slice(0, 200) })
  } catch (err: any) {
    await ghi($, { su_kien: 'command.run:loi', kich_ban: 5, command, loi: String(err?.message ?? err).slice(0, 300) })
  }
}

let daChay = false
export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    if (!daChay && (await $.session.id()) === PHIEN) {
      daChay = true
      $.clock.after(2_000, async () => {
        await chay($, 'dp6-ping')
        await chay($, 'dp6-tham-do:acceptance-status')
      })
    }
    return r
  })
}
