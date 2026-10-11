import type { Register } from 'claude-code'

// Thử nghiệm l của DP0 (đo câu 6): chỉ quan sát, không bao giờ trả lời thay engine. cai.mjs thay hai chỗ giữ
// đường ghi-stdin.mjs và tệp .jsonl lúc cài.
const ghi = async ($: any, du: unknown) => {
  try {
    await $.process.run(['node', '__GHI__', '__TEP__'], { stdin: JSON.stringify(du) })
  } catch {}
}

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    await ghi($, { su_kien: 'session.start', phien: await $.session.id(), usage: await $.session.usage() })
    return r
  })
  on('session.measure', async ($, e, next) => {
    await ghi($, { su_kien: 'session.measure', phien: await $.session.id(), changed: e.changed, rateLimits: e.rateLimits })
    return next(e)
  })
}
