import { atom, read, update } from 'claude-code'
import type { On } from 'claude-code'
import type { KhungDot } from '../../types'
import { DONG_LOI, chuKhung, chuKy, veDai } from '../../scripts/khung.mjs'
import { chuXem } from '../../scripts/mo-hinh.mjs'

// Phần mod khung trạng thái đợt (DP6b, hồ sơ trang-thai-dot-dieu-phoi-tho, thiết kế §2.3). CHỈ ĐỌC: gọi
// `dieu-phoi.mjs xem --json --khung` theo nhịp, vẽ dải trên ô nhập và pane (khung định vị — hồ sơ khung-dot-dinh-vi),
// trả lời /dieu-phoi:xem bằng chữ `xem` không qua model. Không
// ghi tệp, không nghe sự kiện cổng nào (bảng MOD-SU-KIEN). Hook lệnh cố ý KHÔNG có .catch: CLI lỗi thì hook ném,
// engine bỏ qua nó và chạy lệnh markdown commands/xem.md như cũ — đường lùi là chính lệnh cũ.
const PANE = 'dieu-phoi-dot'
const khung = atom({ plugin: 'dieu-phoi', key: 'khung' } as const, null as KhungDot)

async function docDot($: any): Promise<NonNullable<KhungDot>> {
  const luc = await $.clock.now()
  try {
    const r = await $.process.run(['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'xem', '--json', '--khung'], { cwd: await $.session.cwd(), timeoutMs: 10000 })
    if (r.exitCode !== 0) return { kq: null, loi: String(r.stderr).trim().split('\n')[0] || `thoát ${r.exitCode}`, luc }
    return { kq: JSON.parse(String(r.stdout)), loi: null, luc }
  } catch (err: any) {
    return { kq: null, loi: String(err?.message ?? err).split('\n')[0], luc }
  }
}

const tieuDe = (kq: Record<string, any> | null) => (kq?.dot ? `Đợt ${kq.dot}` : 'Đợt')

// Nhịp: đọc, lưu, hẹn lần kế theo kết quả (20″ khi có đợt hay lỗi, 120″ khi không đợt).
async function nhip($: any): Promise<void> {
  const moi = await docDot($)
  await update($, khung, () => moi)
  $.clock.after(chuKy(moi.loi ? {} : moi.kq), () => {
    void nhip($)
  })
}

export const dangKyKhung = (on: On) => {
  on('session.start', async ($, e, next) => {
    $.clock.after(1, () => {
      void nhip($)
    })
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const k = await read($, khung)
    if (!k) return next(e)
    const dai = veDai(k.loi ? { loi: k.loi } : k.kq, { cot: e.props.bodyColumns - 8 })
    if (dai === null) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    return h(Box, {}, h(Text, {}, `${dai} `), h(Button, { key: 'xem', label: 'xem', onPress: () => $.ui.open({ id: PANE, title: tieuDe(k.kq) }) }))
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const k = await read($, khung)
    const dong: string[] = !k ? ['đang đọc đợt…'] : k.loi ? [DONG_LOI, k.loi] : chuKhung(k.kq).split('\n')
    return h(Box, { flexDirection: 'column' }, ...dong.map((d) => h(Text, {}, d)))
  })

  on('command.run', { command: 'dieu-phoi:xem' }, async ($) => {
    const moi = await docDot($)
    if (!moi.kq) throw new Error(moi.loi ?? DONG_LOI)
    await update($, khung, () => moi)
    void $.ui.open({ id: PANE, title: tieuDe(moi.kq) })
    return { text: chuXem(moi.kq) }
  })
}
