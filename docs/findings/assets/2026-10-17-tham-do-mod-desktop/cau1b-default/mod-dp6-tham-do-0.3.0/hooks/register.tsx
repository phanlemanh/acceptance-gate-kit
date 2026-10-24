// dp6-tham-do — mod THĂM DÒ chỉ quan sát (hạt giống docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md §«Đo sống
// §12.3», cộng câu 5–6 của docs/findings/2026-10-17-mods-claude-code-kien-nghi-cho-kit.md K1/K2).
// Luật: mọi hook quan sát trả kết quả của next(e) NGUYÊN VẸN; không hook nào trả allow, deny hay decision.
// Hai ngoại lệ có tên, đều là chính câu hỏi cần đo và không phải quyết định quyền:
//   · câu 5 — hook command.run trả { text } cho đúng lệnh `dp6-tham-do:acceptance-status` (bản sao lệnh markdown mang
//     disable-model-invocation) và lệnh `dp6-ping` mod tự đăng ký (đối chứng dương);
//   · câu 6 — turn.complete của vòng chính, MỘT lần sau mốc 6, trả thêm một dòng { text } dưới câu trả lời.
// Chỉ chạy trong đúng một phiên: phiên khác → im hoàn toàn. Mốc kịch bản do phiên chạy lệnh Bash
// `true # dp6-kich-ban <n> <dau|cuoi>`; mod thấy lệnh đó qua tool.call và ghi dòng mốc theo đúng thứ tự.
// 0.3.0 (17/10, câu 1 chạy lại ở chế độ default — §2.1b): đổi PHIEN + NHAT_KY; thêm nghe classic.PermissionDenied;
// ghi thêm permission_mode + tool_input rút gọn ở ba sự kiện quyền. Vẫn chỉ quan sát: mọi hook trả next(e).
import type { Register } from 'claude-code'

const PHIEN = '5fe2022d-3aa5-4b66-9a85-5d1da2518206'
const NHAT_KY =
  '/private/tmp/claude-501/-Users-manhphan-dev-acceptance-gate-kit--claude-worktrees-focused-easley-7d3bab/5fe2022d-3aa5-4b66-9a85-5d1da2518206/scratchpad/tham-do.jsonl'
const MOC = /#\s*dp6-kich-ban\s+([1-6])\s+(dau|cuoi)\b/
const DONG_DUOI = 'dp6-tham-do · câu 6: dòng này do mod trả qua turn.complete { text }'

let laPhien: boolean | null = null
let hang: Promise<void> = Promise.resolve()
let daVeDai = false
let choDongDuoi = false
const daLietKe = new Set<string>()

async function dungPhien($: any): Promise<boolean> {
  if (laPhien === null) laPhien = (await $.session.id()) === PHIEN
  return laPhien
}

// Ghi tuần tự (đọc rồi ghi lại) để các hook chạy chồng không đè dòng của nhau.
function ghi($: any, dong: Record<string, unknown>): Promise<void> {
  hang = hang
    .then(async () => {
      const luc = new Date(await $.clock.now()).toISOString()
      const cu = (await $.fs.exists(NHAT_KY)) ? await $.fs.read(NHAT_KY) : ''
      await $.fs.write(NHAT_KY, `${cu}${JSON.stringify({ luc, ...dong })}\n`)
    })
    .catch(() => {})
  return hang
}

async function lietKeTacTu($: any, vi_sao: string, agentId: string | null): Promise<void> {
  try {
    const ds: any[] = await $.agent.list()
    await ghi($, {
      su_kien: 'agent.list',
      vi_sao,
      agentId,
      co_agentId_trong_ds: agentId ? ds.some(a => a.id === agentId) : null,
      so: ds.length,
      ds: ds.map(a => ({ id: a.id, type: a.type, status: a.status, description: String(a.description ?? '').slice(0, 60) })),
    })
  } catch (err: any) {
    await ghi($, { su_kien: 'agent.list', vi_sao, loi: String(err?.message ?? err).slice(0, 200) })
  }
}

async function chayLenh($: any, command: string): Promise<void> {
  await ghi($, { su_kien: 'command.run:goi', kich_ban: 5, command })
  try {
    const r = await $.command.run({ command })
    await ghi($, { su_kien: 'command.run:xong', kich_ban: 5, command, text: String(r?.text ?? '').slice(0, 200), context: r?.context ?? null })
  } catch (err: any) {
    await ghi($, { su_kien: 'command.run:loi', kich_ban: 5, command, loi: String(err?.message ?? err).slice(0, 300) })
  }
}

async function kichBan($: any, n: number): Promise<void> {
  if (n === 2) {
    const r: any = await $.ui.open({ id: 'dp6-tham-do', title: 'DP6 thăm dò' })
    await ghi($, { su_kien: 'ui.open', kich_ban: 2, duoc_hoi: false, isPlaced: r?.isPlaced ?? null, reason: r?.reason ?? null })
    $.clock.after(3_000, async () => {
      const p: any[] = await $.ui.panes()
      await ghi($, { su_kien: 'ui.panes', kich_ban: 2, panes: p.map(x => ({ id: x.id, isPlaced: x.isPlaced, isShown: x.isShown })) })
    })
  }
  if (n === 3) {
    $.clock.after(60_000, () => tuThuc($))
  }
  if (n === 4) {
    try {
      const r = await $.process.run(['node', '-v'], { cwd: await $.session.cwd(), timeoutMs: 10_000 })
      await ghi($, { su_kien: 'process.run', kich_ban: 4, exitCode: r.exitCode, stdout: String(r.stdout).trim().slice(0, 40), stderr: String(r.stderr).trim().slice(0, 200) })
    } catch (err: any) {
      await ghi($, { su_kien: 'process.run', kich_ban: 4, loi: String(err?.message ?? err).slice(0, 200) })
    }
  }
  if (n === 5) {
    const ds: any[] = await $.command.list()
    await ghi($, {
      su_kien: 'command.list',
      kich_ban: 5,
      khop: ds.filter(c => /acceptance-status|dp6-ping/.test(c.name)).map(c => ({ name: c.name, source: c.source, plugin: c.plugin ?? null })),
    })
    // $.command.run từ chối khi gọi trong hook mà lượt đang chờ — gọi từ hẹn giờ, chạy khi phiên rảnh.
    $.clock.after(1_000, async () => {
      await chayLenh($, 'dp6-ping')
      await chayLenh($, 'dp6-tham-do:acceptance-status')
    })
  }
  if (n === 6) {
    choDongDuoi = true
    await lietKeTacTu($, 'moc-6', null)
  }
}

async function tuThuc($: any): Promise<void> {
  await ghi($, { su_kien: 'prompt.submit:goi', kich_ban: 3 })
  const r = await $.prompt.submit({
    text: 'dp6 thăm dò, kịch bản 3: lượt này do mod tự gửi bằng $.prompt.submit khi phiên rảnh. Ghi nhận giờ thức rồi tiếp tục các bước thăm dò còn lại.',
  })
  await ghi($, { su_kien: 'prompt.submit:xong', kich_ban: 3, ket_qua: JSON.stringify(r ?? null).slice(0, 200) })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'session.start', surface: (e as any).surface ?? null })
      await $.command.register({ name: 'dp6-ping', description: 'dp6-tham-do: đối chứng dương câu 5' })
    }
    return r
  })

  on('command.run', async ($, e, next) => {
    if (!(await dungPhien($))) return next(e)
    await ghi($, { su_kien: 'command.run', command: e.command, origin: (e as any).origin ?? null })
    if (e.command === 'dp6-ping') return { text: 'dp6-tham-do: dp6-ping được hook trả lời (đối chứng dương)' }
    if (e.command === 'dp6-tham-do:acceptance-status') {
      return { text: 'dp6-tham-do · câu 5: hook command.run trả lời thay lệnh markdown mang disable-model-invocation' }
    }
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const r: any = await next(e)
    if (!(await dungPhien($))) return r
    const vao: any = e
    const lenh = typeof vao.command === 'string' ? vao.command : ''
    const moc = MOC.exec(lenh)
    if (moc) {
      await ghi($, { kich_ban: Number(moc[1]), moc: moc[2] })
      if (moc[2] === 'dau') await kichBan($, Number(moc[1]))
      return r
    }
    const agentId = vao.agentId ?? null
    await ghi($, {
      su_kien: 'tool.call',
      tool: e.tool,
      agentId,
      lenh: lenh.slice(0, 120),
      file_path: typeof vao.file_path === 'string' ? vao.file_path : null,
      deny: r?.deny ?? null,
      isError: r?.isError ?? null,
      text: String(r?.text ?? '').slice(0, 160),
    })
    if (agentId && !daLietKe.has(agentId)) {
      daLietKe.add(agentId)
      await lietKeTacTu($, 'tool.call-cua-tac-tu', agentId)
    }
    return r
  })

  on('tool.check', async ($, e, next) => {
    const r: any = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'tool.check', tool: e.tool, agentId: (e as any).agentId ?? null, decision: r?.decision ?? null, reason: String(r?.reason ?? '').slice(0, 160) })
    }
    return r
  })

  on('classic.Notification', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'classic.Notification', notification_type: (e as any).notification_type ?? null, message: String((e as any).message ?? '').slice(0, 160), agent_id: (e as any).agent_id ?? null, permission_mode: (e as any).permission_mode ?? null })
    }
    return r
  })

  on('classic.PermissionRequest', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'classic.PermissionRequest', tool_name: (e as any).tool_name ?? null, agent_id: (e as any).agent_id ?? null, permission_mode: (e as any).permission_mode ?? null, tool_input: JSON.stringify((e as any).tool_input ?? null).slice(0, 160) })
    }
    return r
  })

  on('classic.PermissionDenied', async ($, e, next) => {
    const r = await next(e)
    if (await dungPhien($)) {
      await ghi($, { su_kien: 'classic.PermissionDenied', tool_name: (e as any).tool_name ?? null, agent_id: (e as any).agent_id ?? null, permission_mode: (e as any).permission_mode ?? null, reason: String((e as any).reason ?? '').slice(0, 160), tool_input: JSON.stringify((e as any).tool_input ?? null).slice(0, 160) })
    }
    return r
  })

  on('turn.complete', async ($, e, next) => {
    const r: any = await next(e)
    if (!(await dungPhien($))) return r
    const agentId = (e as any).agentId ?? null
    await ghi($, { su_kien: 'turn.complete', agentId, reason: (e as any).reason ?? null, answer: String((e as any).answer ?? '').slice(0, 80) })
    if (agentId === null && choDongDuoi) {
      choDongDuoi = false
      await ghi($, { su_kien: 'turn.complete:dong-duoi', kich_ban: 6, text: DONG_DUOI })
      return { ...r, text: DONG_DUOI }
    }
    return r
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await dungPhien($))) return next(e)
    if (!daVeDai) {
      daVeDai = true
      await ghi($, { su_kien: 'ui.render:AbovePrompt', surface: (e as any).surface ?? null })
    }
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text dimColor>DP6 thăm dò đang chạy — chỉ quan sát</Text>
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: 'dp6-tham-do' }, async ($, e, next) => {
    const p: any = (e as any).props ?? {}
    await ghi($, { su_kien: 'ui.render:Pane', surface: (e as any).surface ?? null, bodyColumns: p.bodyColumns ?? null, placement: p.placement ?? null })
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text>DP6 thăm dò — pane mở không do người hỏi</Text>
      </Box>
    )
  })
}
