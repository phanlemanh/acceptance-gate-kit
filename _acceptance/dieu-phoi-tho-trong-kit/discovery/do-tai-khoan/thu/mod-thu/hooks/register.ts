import type { Register } from 'claude-code'

// Thử nghiệm l của DP0 (đo câu 6): chỉ quan sát, không bao giờ trả lời thay engine, và CHỈ có tác dụng trong
// đúng một phiên đo — phiên khác (thư mục mod có thể nạp ở phiên khác) thì không làm gì, không ghi gì. cai.mjs
// thay ba chỗ giữ lúc cài: mã phiên đo, đường ghi-stdin.mjs, tệp .jsonl.
const PHIEN_DO = '__PHIEN__'
const laPhienDo = async ($: any) => {
  try {
    return (await $.session.id()) === PHIEN_DO
  } catch {
    return false
  }
}
const ghi = async ($: any, du: unknown) => {
  try {
    await $.process.run(['node', '__GHI__', '__TEP__'], { stdin: JSON.stringify(du) })
  } catch {}
}

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    if (await laPhienDo($)) await ghi($, { su_kien: 'session.start', usage: await $.session.usage() })
    return r
  })
  on('session.measure', async ($, e, next) => {
    if (await laPhienDo($)) await ghi($, { su_kien: 'session.measure', changed: e.changed, rateLimits: e.rateLimits })
    return next(e)
  })
}
