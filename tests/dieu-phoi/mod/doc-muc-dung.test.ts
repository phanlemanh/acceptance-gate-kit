// Ca của phần mod đọc mức dùng (hồ sơ dieu-phoi-doi-tai-khoan AC-12). kiem-mod.mjs chép tệp này cạnh phần mod trong
// một BẢN SAO gói và nhúng tests/dieu-phoi/fixtures/rate-limits-mod.json vào chỗ giữ của FX — fixture chung với ca CLI.
import { test, expect } from 'claude-code/testing'

const FX = __FIXTURE__ as any
const nen = (on: any, goi: any[], loiTienTrinh = false) => {
  on('session.measure', ($: any, e: any) => ({ changed: e.changed }))
  on('session.id', () => ({ value: 'ses-1' }))
  on('session.cwd', () => ({ value: '/tmp/kho-thu' }))
  on('process.run', ($: any, e: any) => {
    if (loiTienTrinh) throw new Error('khong chay duoc')
    goi.push(e)
    return { value: { exitCode: 0, stdout: '', stderr: '' } }
  })
}

test('goi han-muc khi rateLimits doi', async ($, on) => {
  const goi: any[] = []
  nen(on, goi)
  await $.session.measure({ context: { window: 1000 }, rateLimits: FX.rateLimits, changed: ['rateLimits'] } as any)
  expect(goi.length).toBe(1)
  console.log('ARGV ' + JSON.stringify(goi[0]))
})

test('khong goi khi chi context doi', async ($, on) => {
  const goi: any[] = []
  nen(on, goi)
  await $.session.measure({ context: { window: 1000 }, rateLimits: FX.rateLimits, changed: ['context'] } as any)
  expect(goi.length).toBe(0)
})

test('process.run nem loi van next', async ($, on) => {
  nen(on, [], true)
  const r = await $.session.measure({ context: { window: 1000 }, rateLimits: FX.rateLimits, changed: ['rateLimits'] } as any)
  expect(r).toEqual({ changed: ['rateLimits'] })
})
