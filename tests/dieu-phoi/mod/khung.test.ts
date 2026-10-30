// Ca của phần mod khung trạng thái đợt (hồ sơ trang-thai-dot-dieu-phoi-tho AC-5, AC-6, AC-7). kiem-khung.mjs chép
// tệp này cạnh phần mod trong một BẢN SAO gói và thay ba chỗ giữ bằng stdout THẬT mà CLI in trong cùng lượt trên
// kho thử dựng từ fixture dot-crm-0910 (round-trip CLI → mod): `xem --json --khung` ở worktree P3, `xem --json --khung`
// ở kho không đợt, và `xem` không cờ ở worktree P3; chỗ giữ thứ tư là gốc của chính bản sao gói (argv của nhịp phải BẰNG nó). Mỗi ca lặp qua hai bề mặt terminal và desktop.
import { test, expect, mock } from 'claude-code/testing'
import { chuKhung, veDai } from '../../scripts/khung.mjs'
import { chuXem } from '../../scripts/mo-hinh.mjs'

const JSON_P3: string = __XEM_JSON_P3__
const JSON_KHONG: string = __XEM_JSON_KHONG__
const CHU_XEM: string = __XEM_CHU__
const GOC_GOI: string = __GOC_GOI__
const SURFACES = ['terminal', 'desktop'] as const
const COT = 160
const BAND = (surface: any) => ({
  plugin: 'dieu-phoi',
  surface,
  component: 'AbovePrompt' as const,
  props: { hasSurvey: false, isWorking: false, maxRows: 4, bodyColumns: COT, scroll: { offset: 0, bodyRows: 3, contentRows: 1 }, view: {} } as any,
})
const PANE = (surface: any) => ({
  plugin: 'dieu-phoi',
  surface,
  component: 'Pane' as const,
  requestId: 'dieu-phoi-dot',
  props: { title: 'Đợt', isFocused: false, bodyColumns: COT, placement: 'inline', scroll: { offset: 0, bodyRows: 20, contentRows: 1 } } as any,
})

// Nền bên dưới gói: process.run trả stdout cho sẵn (hoặc ném), ghi lại mọi lời gọi; ui.open ghi id.
function nen(on: any, o: { stdout?: string; nem?: boolean; ma?: number }) {
  const goi: any[] = []
  const mo: string[] = []
  on('session.start', ($: any, e: any) => ({ cwd: e.cwd }))
  // Bản vẽ của engine khi gói nhường next(e): một Box rỗng, không Text nào.
  on('ui.render', ($: any, e: any) => {
    const { Box } = $.ui.resolve(e)
    return h(Box, {})
  })
  on('session.cwd', () => ({ value: '/tmp/kho-thu/.claude/worktrees/wt-3' }))
  on('session.id', () => ({ value: 'ses-khung' }))
  on('process.run', ($: any, e: any) => {
    goi.push(e)
    if (o.nem) throw new Error('khong chay duoc node')
    return { value: { exitCode: o.ma ?? 0, stdout: o.stdout ?? '', stderr: o.ma ? 'dieu-phoi: hỏng\n' : '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  on('ui.open', ($: any, e: any) => {
    mo.push(e.id)
    return { value: { isPlaced: true } }
  })
  return { goi, mo }
}
async function batDau($: any, clock: any) {
  await $.session.start({ cwd: '/tmp/kho-thu/.claude/worktrees/wt-3', surface: 'terminal', isInteractive: true })
  await clock.advance(1)
}
// Text không giữ khoá: dải là Text đầu tiên của cây gói vẽ.
const chuDai = async (ui: any) => (await ui.find({ type: 'Text' }))?.text?.trimEnd()

test('dai co dot', async ($, on) => {
  const clock = mock.clock(on)
  nen(on, { stdout: JSON_P3 })
  await batDau($, clock)
  for (const s of SURFACES) {
    const ui = await $.ui.mount(BAND(s))
    expect(await chuDai(ui)).toBe(veDai(JSON.parse(JSON_P3), { cot: COT - 8 }))
    expect(await ui.find({ key: 'xem' })).toBeDefined()
    await ui.unmount()
  }
})

test('dai khong dot', async ($, on) => {
  const clock = mock.clock(on)
  nen(on, { stdout: JSON_KHONG })
  await batDau($, clock)
  for (const s of SURFACES) {
    const ui = await $.ui.mount(BAND(s))
    expect(await ui.find({ type: 'Text' })).toBeUndefined()
    expect(await ui.find({ key: 'xem' })).toBeUndefined()
    await ui.unmount()
  }
})

test('dai loi doc', async ($, on) => {
  const clock = mock.clock(on)
  nen(on, { nem: true })
  await batDau($, clock)
  for (const s of SURFACES) {
    const ui = await $.ui.mount(BAND(s))
    expect(await chuDai(ui)).toBe('khung: không đọc được đợt')
    await ui.unmount()
  }
})

test('dai stdout hong', async ($, on) => {
  const clock = mock.clock(on)
  nen(on, { stdout: `(node:1) Warning: rác\n${JSON_P3}` })
  await batDau($, clock)
  for (const s of SURFACES) {
    const ui = await $.ui.mount(BAND(s))
    expect(await chuDai(ui)).toBe('khung: không đọc được đợt')
    await ui.unmount()
  }
})

test('dai survey', async ($, on) => {
  const clock = mock.clock(on)
  nen(on, { stdout: JSON_P3 })
  await batDau($, clock)
  for (const s of SURFACES) {
    const b = BAND(s)
    const ui = await $.ui.mount({ ...b, props: { ...b.props, hasSurvey: true } })
    expect(await ui.find({ type: 'Text' })).toBeUndefined()
    await ui.unmount()
  }
})

test('bam xem mo pane', async ($, on) => {
  const clock = mock.clock(on)
  const { mo } = nen(on, { stdout: JSON_P3 })
  await batDau($, clock)
  for (const s of SURFACES) {
    const ui = await $.ui.mount(BAND(s))
    await ui.press({ key: 'xem' })
    await ui.unmount()
  }
  expect(mo).toEqual(['dieu-phoi-dot', 'dieu-phoi-dot'])
})

// Hồ sơ khung-dot-dinh-vi AC-5: pane vẽ khung định vị, không vẽ chữ `xem` (lệnh /dieu-phoi:xem vẫn trả chữ xem).
test('pane dung chu khung', async ($, on) => {
  const clock = mock.clock(on)
  nen(on, { stdout: JSON_P3 })
  await batDau($, clock)
  for (const s of SURFACES) {
    const ui = await $.ui.mount(PANE(s))
    const dong = (await ui.findAll({ type: 'Text' })).map((x: any) => x.text)
    const mong = chuKhung(JSON.parse(JSON_P3))
    expect(dong).toEqual(mong.split('\n'))
    expect(dong.join('\n')).not.toBe(CHU_XEM.replace(/\n$/, ''))
    expect(dong[0]).toContain('Đợt sau-14-10 — ')
    await ui.unmount()
  }
})

test('pane dang doc', async ($, on) => {
  mock.clock(on)
  nen(on, { stdout: JSON_P3 })
  for (const s of SURFACES) {
    const ui = await $.ui.mount(PANE(s))
    expect((await ui.findAll({ type: 'Text' })).map((x: any) => x.text)).toEqual(['đang đọc đợt…'])
    await ui.unmount()
  }
})

test('pane loi doc', async ($, on) => {
  const clock = mock.clock(on)
  nen(on, { stdout: '', ma: 1 })
  await batDau($, clock)
  for (const s of SURFACES) {
    const ui = await $.ui.mount(PANE(s))
    expect((await ui.findAll({ type: 'Text' }))[0]?.text).toBe('khung: không đọc được đợt')
    await ui.unmount()
  }
})

test('khong mo pane khi khong hoi', async ($, on) => {
  const clock = mock.clock(on)
  const { mo } = nen(on, { stdout: JSON_P3 })
  await batDau($, clock)
  await clock.advance(120000)
  expect(mo.length).toBe(0)
})

test('nhip co dot', async ($, on) => {
  const clock = mock.clock(on)
  const { goi } = nen(on, { stdout: JSON_P3 })
  await $.session.start({ cwd: '/tmp/kho-thu/.claude/worktrees/wt-3', surface: 'terminal', isInteractive: true })
  expect(goi.length).toBe(0)
  await clock.advance(1)
  expect(goi.length).toBe(1)
  console.log('ARGV ' + JSON.stringify(goi[0]))
  expect(goi[0].argv.slice(2)).toEqual(['xem', '--json', '--khung'])
  expect(goi[0].argv[0]).toBe('node')
  expect(goi[0].argv[1]).toBe(`${GOC_GOI}/scripts/dieu-phoi.mjs`)
  expect(goi[0].init.cwd).toBe('/tmp/kho-thu/.claude/worktrees/wt-3')
  expect(goi[0].init.timeoutMs).toBe(10000)
  await clock.advance(20000)
  expect(goi.length).toBe(2)
})

test('nhip khong dot', async ($, on) => {
  const clock = mock.clock(on)
  const { goi } = nen(on, { stdout: JSON_KHONG })
  await batDau($, clock)
  expect(goi.length).toBe(1)
  await clock.advance(20000)
  expect(goi.length).toBe(1)
  await clock.advance(100000)
  expect(goi.length).toBe(2)
})

test('nhip loi 20s', async ($, on) => {
  const clock = mock.clock(on)
  const { goi } = nen(on, { nem: true })
  await batDau($, clock)
  expect(goi.length).toBe(1)
  await clock.advance(20000)
  expect(goi.length).toBe(2)
})

test('lenh xem tra chu', async ($, on) => {
  mock.clock(on)
  const { mo } = nen(on, { stdout: JSON_P3 })
  const r = await $.command.run({ command: 'dieu-phoi:xem' })
  expect(r.text).toBe(chuXem(JSON.parse(JSON_P3)))
  expect(r.text).toBe(CHU_XEM.replace(/\n$/, ''))
  expect(mo).toEqual(['dieu-phoi-dot'])
})
