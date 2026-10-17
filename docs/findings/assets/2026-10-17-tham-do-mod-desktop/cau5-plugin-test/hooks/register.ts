import type { Register } from 'claude-code'
export const register: Register = on => {
  on('command.run', { command: 'cau5:acceptance-status' }, async () => ({ text: 'cau5: hook trả lời thay lệnh markdown' }))
}
