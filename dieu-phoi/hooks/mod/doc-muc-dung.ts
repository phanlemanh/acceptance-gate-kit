import type { On } from 'claude-code'

// Phần mod đọc mức dùng (spec workflow §4.5, §12.2; hồ sơ dieu-phoi-doi-tai-khoan AC-12): mỗi khi một cửa sổ hạn mức
// nhích một điểm, chuyển rateLimits cho CLI han-muc của gói — mọi luật ở Node. Chỉ quan sát: không nghe sự kiện cổng
// nào, luôn trả next(e) nguyên, lỗi tiến trình không làm vỡ phiên (§12.1, bảng MOD-SU-KIEN).
export const dangKyDocMucDung = (on: On) => {
  on('session.measure', async ($, e, next) => {
    try {
      if (e.changed.includes('rateLimits') && e.rateLimits.length > 0) {
        await $.process.run(
          ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'han-muc', '--nguon', 'mod', '--phien', await $.session.id(), '--doc', JSON.stringify(e.rateLimits)],
          { cwd: await $.session.cwd() },
        )
      }
    } catch {}
    return next(e)
  })
}
