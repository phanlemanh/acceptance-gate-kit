#!/usr/bin/env node
// Cầu nối Lái-thử Người-lạ — biến thể MẶT AGENT (docs/lai-thu-nguoi-la.md §3).
// Nói chuyện với một MCP server stdio bằng JSON-RPC thô, để phiên người-lạ chỉ
// thấy đúng thứ một agent thật thấy: mô tả tool + phản hồi. Không đọc source.
//
//   node mcp-drive.mjs --cwd <repo> --server "<lệnh chạy server stdio>" list
//   node mcp-drive.mjs --cwd <repo> --server "<lệnh>" call <tool> '<json args>'
//
// Ví dụ (floorplanstudio):
//   node mcp-drive.mjs --cwd ~/dev/floorplanstudio \
//     --server "npx tsx mcp-server/src/stdio.ts" list
//
// In JSON phản hồi ra stdout; thời gian chờ in ra stderr (dữ liệu cho nhật ký
// vấp). Lưu ý vận hành: người điều phối cấp cho phiên người-lạ NGUYÊN VĂN lệnh
// đã điền sẵn --cwd/--server — đường dẫn kho nằm trong lệnh, không nằm trong
// đề bài, nên người-lạ không có gì để đi lục.
//
// Trần chờ mỗi lời gọi: `MCP_DRIVE_TIMEOUT_MS`, mặc định 120000. Nâng lên khi
// lái một sản phẩm có lời gọi dài (ván lái-thử #3 của mapposter đo được render
// video vượt 120 s; giữ nguyên trần thì lời gọi hỏng vì cầu nối chứ không phải
// vì sản phẩm, và nhật-ký-vấp ghi nhầm chỗ).
//
// HAI KHIẾM KHUYẾT ĐÃ VÁ (phát hiện ở ván lái-thử #3 mapposter, 2026-08-19 —
// cả hai đều khiến người-lạ quy nhầm lỗi cho SẢN PHẨM):
//
//  1. **Cắt stdout ở 64 KiB.** `console.log` rồi `process.exit(0)` ngay sau đó
//     cắt cụt phần ghi bất đồng bộ khi stdout là đường ống: `… list | jq` nhận
//     đúng 65.536 byte và vỡ với `Unfinished string at EOF`, còn cùng lời gọi
//     ghi thẳng ra tệp thì đủ 107.345 byte. Người-lạ kết luận "JSON của sản
//     phẩm hỏng" — sai hoàn toàn. Nay mọi lối thoát đều đi qua `finish()`, nơi
//     chờ stdout/stderr xả xong mới thoát.
//
//  2. **Bỏ lại cả cây tiến trình server.** Vì `shell: true`, `child.pid` là pid
//     của SHELL, còn `npm exec` → `tsx` → `node` là cháu chắt; giết mỗi shell
//     không đụng tới chúng. Ván #3 đếm được 73 tiến trình mồ côi giữ ~3,6 GB,
//     và một trong số đó chiếm cổng dựng hình cố định của sản phẩm khiến MỌI
//     lời gọi sau treo tới hết trần chờ rồi chết. Nay chạy `detached: true` để
//     cả cây nằm trong một NHÓM tiến trình riêng, và `killTree()` giết cả nhóm
//     bằng `process.kill(-pid)`.

import { spawn } from 'node:child_process'

const argv = process.argv.slice(2)
function takeFlag(name) {
  const i = argv.indexOf(name)
  if (i < 0) return undefined
  const v = argv[i + 1]
  argv.splice(i, 2)
  return v
}

const cwd = takeFlag('--cwd')
const serverCmd = takeFlag('--server')
const [mode, toolName, argsJson] = argv

const TIMEOUT_MS = Number(process.env.MCP_DRIVE_TIMEOUT_MS || 120_000)
/** Ân hạn cho cả nhóm tự tắt sau SIGTERM, trước khi dùng SIGKILL. */
const KILL_GRACE_MS = 1500

if (!cwd || !serverCmd || !mode) {
  console.error('dùng: node mcp-drive.mjs --cwd <repo> --server "<lệnh>" list | call <tool> <jsonArgs>')
  process.exit(2)
}

// `detached: true` đặt shell làm tổ trưởng một nhóm tiến trình mới, nên
// `process.kill(-pid)` với tới được mọi cháu chắt nó sinh ra. Không `unref()`:
// ta chủ động quản vòng đời của nó.
const child = spawn(serverCmd, { cwd, shell: true, detached: true, stdio: ['pipe', 'pipe', 'pipe'] })

let buf = ''
const pending = new Map()
let nextId = 1

child.stdout.on('data', (chunk) => {
  buf += chunk.toString()
  let idx
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim()
    buf = buf.slice(idx + 1)
    if (!line) continue
    let msg
    try { msg = JSON.parse(line) } catch { continue }
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id)(msg)
      pending.delete(msg.id)
    }
  }
})

const stderrChunks = []
child.stderr.on('data', (c) => stderrChunks.push(c.toString()))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Nhóm còn sống không? `signal 0` chỉ hỏi, không gửi gì. */
function groupAlive() {
  try { process.kill(-child.pid, 0); return true } catch { return false }
}

const trace = process.env.MCP_DRIVE_DEBUG
  ? (m) => process.stderr.write(`[cầu nối:dọn] ${m}\n`)
  : () => {}

let killed = false
/**
 * Giết CẢ NHÓM tiến trình, không chỉ mỗi shell. Lịch sự trước (SIGTERM), cứng
 * rắn sau (SIGKILL) — server nào lờ SIGTERM vẫn phải đi, nếu không ta lại để
 * lại đúng loại rác mà bản vá này sinh ra để dọn.
 *
 * Vì sao vòng chờ phải kiểm tới cùng chứ không tin SIGTERM: một server đang
 * render giữ CPU có thể chưa kịp chạy trình xử lý tín hiệu trong thời gian ân
 * hạn, và nó là ca hay gặp nhất — người-lạ bỏ ngang đúng lúc render lâu.
 * `MCP_DRIVE_DEBUG=1` in ra từng bước để chẩn đoán khi có nghi ngờ còn sót.
 */
async function killTree() {
  if (killed) return
  killed = true
  try { child.stdin.end() } catch { /* đã đóng */ }
  try {
    process.kill(-child.pid, 'SIGTERM')
    trace(`đã gửi SIGTERM cho nhóm ${child.pid}`)
  } catch (e) {
    trace(`SIGTERM ném ${e.code} — nhóm ${child.pid} có thể đã chết`)
  }

  const deadline = Date.now() + KILL_GRACE_MS
  while (Date.now() < deadline && groupAlive()) await sleep(50)

  if (groupAlive()) {
    trace('còn sống sau ân hạn — chuyển SIGKILL')
    try { process.kill(-child.pid, 'SIGKILL') } catch (e) { trace(`SIGKILL ném ${e.code}`) }
    // Chờ nốt cho tới khi nhóm thật sự biến mất. SIGKILL không thể bị lờ, nên
    // vòng này luôn kết thúc; trần là để không treo vô hạn nếu hệ điều hành
    // đang giữ tiến trình ở trạng thái không ngắt được.
    const hard = Date.now() + KILL_GRACE_MS
    while (Date.now() < hard && groupAlive()) await sleep(50)
  }
  trace(groupAlive() ? 'VẪN CÒN SỐNG sau SIGKILL' : 'nhóm đã sạch')
}

/** Ghi rồi CHỜ XẢ XONG. Đây là chỗ sửa lỗi cắt cụt ở 64 KiB. */
function writeFlushed(stream, text) {
  return new Promise((resolve) => {
    if (!text) return resolve()
    stream.write(text, () => resolve())
  })
}

let finishing = null
/**
 * Lối thoát DUY NHẤT của tiến trình: dọn tiến trình con, xả output, rồi thoát.
 *
 * Phải chỉ-một-chủ. Giết server làm lời gọi JSON-RPC đang chờ hỏng theo, nên
 * nhánh `catch` gọi `finish()` lần thứ hai — và nếu lần hai được phép chạy
 * `process.exit`, nó cắt ngang lần đầu đúng lúc lần đầu đang chờ ân hạn để
 * chuyển sang SIGKILL. Kết quả: cây tiến trình sống sót, cổng dựng hình vẫn bị
 * giữ, tức đúng cái lỗi bản vá này định chữa. Lời gọi sau nhường lượt cho lời
 * gọi đầu và không bao giờ tự thoát.
 */
function finish(code, { out = '', err = '' } = {}) {
  if (finishing) return finishing
  finishing = (async () => {
    await killTree()
    await writeFlushed(process.stdout, out)
    await writeFlushed(process.stderr, err)
    process.exit(code)
  })()
  return finishing
}

// Ctrl-C hay bị khung chạy giết cũng phải dọn — nếu không thì đúng cái ca đã
// sinh ra 73 tiến trình mồ côi: người-lạ bỏ ngang một lời gọi treo.
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => { finish(130, { err: `\n[cầu nối] nhận ${sig}, đã dọn tiến trình server.\n` }) })
}

function send(method, params) {
  const id = nextId++
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`TIMEOUT sau ${TIMEOUT_MS}ms ở ${method}`)),
      TIMEOUT_MS,
    )
    pending.set(id, (msg) => { clearTimeout(timer); resolve(msg) })
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
  })
}

function notify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n')
}

const t0 = Date.now()
try {
  await send('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'stranger-drive', version: '1' },
  })
  notify('notifications/initialized', {})

  let res
  if (mode === 'list') {
    res = await send('tools/list', {})
  } else if (mode === 'call') {
    res = await send('tools/call', {
      name: toolName,
      arguments: argsJson ? JSON.parse(argsJson) : {},
    })
  } else {
    await finish(2, { err: `mode không hiểu: ${mode} (chỉ có list | call)\n` })
  }

  const elapsed = Date.now() - t0
  await finish(0, {
    out: JSON.stringify(res.result ?? res.error, null, 2) + '\n',
    err: `\n[cầu nối] mất ${elapsed}ms\n`,
  })
} catch (err) {
  await finish(1, {
    err: `[cầu nối] LỖI: ${err.message}\n` +
      (stderrChunks.length ? stderrChunks.join('').slice(-2000) + '\n' : ''),
  })
}
