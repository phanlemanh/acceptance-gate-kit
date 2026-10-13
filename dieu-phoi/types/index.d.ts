// Khế ước kiểu của $.state cho gói dieu-phoi (lớp mod). `claude plugin validate` giữ mọi khoá $.state mà module
// nêu theo đúng tệp này (plugin.json → "types").
export type KhungDot = { kq: Record<string, any> | null; loi: string | null; luc: number } | null

declare module 'claude-code' {
  interface PluginState {
    'dieu-phoi': { khung: KhungDot }
  }
}
