import { test, expect } from 'claude-code/testing'

test('liệt kê: lệnh markdown của gói có trong $.command.list()', async ($) => {
  const ds = await $.command.list()
  const khop = ds.filter(c => /acceptance-status/.test(c.name)).map(c => `${c.name}|${c.source}|${c.plugin ?? ''}`)
  console.log('CAU5 command.list khop =', JSON.stringify(khop), 'tong =', ds.length)
  expect(khop.length).toBeGreaterThan(0)
})

test('chạy: hook trả lời, bên dưới (đứng thay engine) không được gọi', async ($, on) => {
  let duoiDuocGoi = 0
  on('command.run', async (_$, e, next) => { duoiDuocGoi++; return { text: `DUOI:${e.command}` } })
  const r = await $.command.run({ command: 'cau5:acceptance-status' })
  console.log('CAU5 run text =', JSON.stringify(r.text), 'duoiDuocGoi =', duoiDuocGoi)
  expect(r.text).toBe('cau5: hook trả lời thay lệnh markdown')
  expect(duoiDuocGoi).toBe(0)
})

test('đối chứng: tên khác đi xuống bên dưới (hook không nuốt mọi lệnh)', async ($, on) => {
  on('command.run', async (_$, e) => ({ text: `DUOI:${e.command}` }))
  const r = await $.command.run({ command: 'cau5:lenh-khac' })
  console.log('CAU5 doi chung text =', JSON.stringify(r.text))
  expect(r.text).toBe('DUOI:cau5:lenh-khac')
})
