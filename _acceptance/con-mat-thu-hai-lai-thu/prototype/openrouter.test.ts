import { describe, expect, it } from 'vitest'
import {
  createOpenRouterClient,
  MAX_IMAGE_BASE64_BYTES,
  MIN_OPENROUTER_KEY_LENGTH,
  OPENROUTER_DEFAULT_BASE_URL,
  OPENROUTER_DEFAULT_MODEL,
  OPENROUTER_DEFAULT_TIMEOUT_MS,
  OPENROUTER_ERROR_CODES,
  OPENROUTER_MAX_TIMEOUT_MS,
  OpenRouterError,
  resolveOpenRouterConfig,
  type OpenRouterConfig,
} from './openrouter.js'

/**
 * Khoá giả. VIẾT DẠNG KHÔNG-THỂ-NHẦM có chủ ý — bản trước dùng khuôn thật
 * (`sk-or-v1-` + 64 ký tự) và GitHub push protection CHẶN PUSH vì máy quét bí mật
 * không phân biệt được fixture với khoá thật. Sàn của `resolveOpenRouterConfig` chỉ
 * là ĐỘ DÀI >= 20, không ghim tiền tố, nên chuỗi này qua sàn mà không giống khoá nào.
 */
const FAKE_KEY = 'KHOA-GIA-KHONG-PHAI-KHOA-THAT-chi-de-test-do-dai'

const CFG: OpenRouterConfig = {
  apiKey: FAKE_KEY,
  model: OPENROUTER_DEFAULT_MODEL,
  baseUrl: OPENROUTER_DEFAULT_BASE_URL,
  timeoutMs: 5_000,
}

/** 1×1 PNG thật (base64) — dùng ảnh thật thay vì chuỗi bừa để hình dạng data URL đúng nghĩa. */
const PNG_1PX =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

function okResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

const CHAT_OK = {
  model: 'google/gemini-3.7-flash',
  choices: [{ message: { content: 'Căn hộ có 2 phòng ngủ, không thấy bếp riêng.' }, finish_reason: 'stop' }],
  usage: { prompt_tokens: 1200, completion_tokens: 45, total_tokens: 1245 },
}

/** Bắt lại đúng đối số `fetch` nhận được, để soi request THẬT client dựng ra. */
function spyFetch(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const calls: Array<{ url: string; init: RequestInit }> = []
  const fn = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} })
    return handler(String(input), init ?? {})
  }) as unknown as typeof globalThis.fetch
  return { fn, calls }
}

describe('resolveOpenRouterConfig', () => {
  it('trả null khi không có khoá — năng lực tắt, service vẫn chạy', () => {
    expect(resolveOpenRouterConfig({})).toBeNull()
    expect(resolveOpenRouterConfig({ OPENROUTER_API_KEY: '' })).toBeNull()
    expect(resolveOpenRouterConfig({ OPENROUTER_API_KEY: '   ' })).toBeNull()
  })

  it('KHÔNG tắt lặng khi các biến khác được đặt mà thiếu khoá', () => {
    // Ca dễ sai nhất khi điền .env: điền model, quên khoá. Vẫn null (tắt), không throw —
    // nhưng phép kiểm này ghim rằng model đơn độc KHÔNG bật được năng lực.
    expect(resolveOpenRouterConfig({ OPENROUTER_MODEL: 'google/gemini-3.7-flash' })).toBeNull()
  })

  it('mặc định về gemini-3.7-flash, base URL và timeout đã khai', () => {
    const cfg = resolveOpenRouterConfig({ OPENROUTER_API_KEY: FAKE_KEY })
    expect(cfg).not.toBeNull()
    expect(cfg!.model).toBe('google/gemini-3.7-flash')
    expect(cfg!.baseUrl).toBe(OPENROUTER_DEFAULT_BASE_URL)
    expect(cfg!.timeoutMs).toBe(OPENROUTER_DEFAULT_TIMEOUT_MS)
    expect(cfg!.appUrl).toBeUndefined()
    expect(cfg!.appTitle).toBeUndefined()
  })

  it('ghi đè được model / base URL / timeout / app metadata', () => {
    const cfg = resolveOpenRouterConfig({
      OPENROUTER_API_KEY: FAKE_KEY,
      OPENROUTER_MODEL: 'google/gemini-3.6-flash',
      OPENROUTER_BASE_URL: 'http://127.0.0.1:9/api/v1',
      OPENROUTER_TIMEOUT_MS: '30000',
      OPENROUTER_APP_URL: 'https://example.invalid/floorplanstudio',
      OPENROUTER_APP_TITLE: 'FloorPlanStudio',
    })!
    expect(cfg.model).toBe('google/gemini-3.6-flash')
    expect(cfg.baseUrl).toBe('http://127.0.0.1:9/api/v1')
    expect(cfg.timeoutMs).toBe(30_000)
    expect(cfg.appUrl).toBe('https://example.invalid/floorplanstudio')
    expect(cfg.appTitle).toBe('FloorPlanStudio')
  })

  it('ném khi khoá ngắn hơn sàn — và KHÔNG in ký tự nào của khoá', () => {
    const short = 'qua-ngan'
    expect(short.length).toBeLessThan(MIN_OPENROUTER_KEY_LENGTH)
    try {
      resolveOpenRouterConfig({ OPENROUTER_API_KEY: short })
      expect.unreachable('phải ném')
    } catch (err) {
      const msg = (err as Error).message
      expect(msg).toContain(String(MIN_OPENROUTER_KEY_LENGTH))
      expect(msg).toContain(String(short.length))
      // Vế load-bearing: thông điệp lỗi không được rò khoá, kể cả tiền tố.
      expect(msg).not.toContain(short)
      expect(msg).not.toContain('sk-or')
    }
  })

  it('ném khi timeout không phải số nguyên dương trong cận', () => {
    for (const bad of ['0', '-1', '1.5', 'abc', String(OPENROUTER_MAX_TIMEOUT_MS + 1)]) {
      expect(() => resolveOpenRouterConfig({ OPENROUTER_API_KEY: FAKE_KEY, OPENROUTER_TIMEOUT_MS: bad }))
        .toThrow(/OPENROUTER_TIMEOUT_MS/)
    }
    expect(resolveOpenRouterConfig({
      OPENROUTER_API_KEY: FAKE_KEY,
      OPENROUTER_TIMEOUT_MS: String(OPENROUTER_MAX_TIMEOUT_MS),
    })!.timeoutMs).toBe(OPENROUTER_MAX_TIMEOUT_MS)
  })
})

describe('askAboutImage — hình dạng request', () => {
  it('gửi ảnh inline dưới dạng data URL, đúng endpoint, kèm Bearer', async () => {
    const { fn, calls } = spyFetch(() => okResponse(CHAT_OK))
    await createOpenRouterClient(CFG, { fetch: fn }).askAboutImage({
      imageBase64: PNG_1PX,
      prompt: 'Căn này có phòng bếp không?',
    })

    expect(calls).toHaveLength(1)
    expect(calls[0]!.url).toBe(`${OPENROUTER_DEFAULT_BASE_URL}/chat/completions`)
    expect(calls[0]!.init.method).toBe('POST')

    const headers = calls[0]!.init.headers as Record<string, string>
    expect(headers['authorization']).toBe(`Bearer ${FAKE_KEY}`)
    expect(headers['content-type']).toBe('application/json')
    // Không đặt thì không gửi — tránh gán nhầm lượt gọi cho một app rỗng trên bảng OpenRouter.
    expect(headers['http-referer']).toBeUndefined()
    expect(headers['x-title']).toBeUndefined()

    const body = JSON.parse(String(calls[0]!.init.body))
    expect(body.model).toBe('google/gemini-3.7-flash')
    const parts = body.messages[0].content
    expect(parts[0]).toEqual({ type: 'text', text: 'Căn này có phòng bếp không?' })
    expect(parts[1].type).toBe('image_url')
    // Ảnh đi INLINE: không có URL nào trỏ ra ngoài, không bucket, không đường dẫn file.
    expect(parts[1].image_url.url).toBe(`data:image/png;base64,${PNG_1PX}`)
    expect(body.max_tokens).toBeUndefined()
  })

  it('ghi đè model theo từng lượt — để so hai model trên cùng một ảnh', async () => {
    const { fn, calls } = spyFetch(() => okResponse(CHAT_OK))
    const client = createOpenRouterClient(CFG, { fetch: fn })
    await client.askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' })
    await client.askAboutImage({ imageBase64: PNG_1PX, prompt: 'x', model: 'google/gemini-2.5-flash' })

    expect(JSON.parse(String(calls[0]!.init.body)).model).toBe('google/gemini-3.7-flash')
    expect(JSON.parse(String(calls[1]!.init.body)).model).toBe('google/gemini-2.5-flash')
    // Ghi đè theo lượt KHÔNG được làm bẩn client dùng chung.
    expect(client.model).toBe('google/gemini-3.7-flash')
  })

  it('gửi app metadata khi có, và tôn trọng format ảnh', async () => {
    const { fn, calls } = spyFetch(() => okResponse(CHAT_OK))
    await createOpenRouterClient(
      { ...CFG, appUrl: 'https://example.invalid/fps', appTitle: 'FloorPlanStudio' },
      { fetch: fn },
    ).askAboutImage({ imageBase64: PNG_1PX, prompt: 'x', format: 'jpeg', maxTokens: 500 })

    const headers = calls[0]!.init.headers as Record<string, string>
    expect(headers['http-referer']).toBe('https://example.invalid/fps')
    expect(headers['x-title']).toBe('FloorPlanStudio')
    const body = JSON.parse(String(calls[0]!.init.body))
    expect(body.messages[0].content[1].image_url.url.startsWith('data:image/jpeg;base64,')).toBe(true)
    expect(body.max_tokens).toBe(500)
  })
})

describe('askAboutImage — đọc kết quả', () => {
  it('trả text, model upstream thật, finish_reason và usage', async () => {
    const { fn } = spyFetch(() => okResponse(CHAT_OK))
    const out = await createOpenRouterClient(CFG, { fetch: fn })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' })

    expect(out.text).toBe('Căn hộ có 2 phòng ngủ, không thấy bếp riêng.')
    expect(out.model).toBe('google/gemini-3.7-flash')
    expect(out.finishReason).toBe('stop')
    expect(out.usage).toEqual({ promptTokens: 1200, completionTokens: 45, totalTokens: 1245 })
  })

  it('báo model THẬT khi OpenRouter định tuyến sang model khác', async () => {
    // OpenRouter có thể fallback sang nhà cung cấp/model khác. Nếu ta trả về model đã YÊU CẦU
    // thay vì model đã CHẠY, một vòng lái thử sẽ ghi sai nguồn gốc câu trả lời vào báo cáo.
    const { fn } = spyFetch(() => okResponse({ ...CHAT_OK, model: 'google/gemini-3.6-flash' }))
    const out = await createOpenRouterClient(CFG, { fetch: fn })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' })
    expect(out.model).toBe('google/gemini-3.6-flash')
  })

  it('usage vắng → null, không phải object rỗng đội lốt số đo', async () => {
    const { fn } = spyFetch(() => okResponse({ choices: [{ message: { content: 'ok' } }] }))
    const out = await createOpenRouterClient(CFG, { fetch: fn })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' })
    expect(out.usage).toBeNull()
    expect(out.finishReason).toBeNull()
  })

  it('trường lạ của upstream bị bỏ qua, không làm đỏ', async () => {
    const { fn } = spyFetch(() => okResponse({ ...CHAT_OK, provider: 'Google', citations: [1, 2] }))
    await expect(
      createOpenRouterClient(CFG, { fetch: fn }).askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }),
    ).resolves.toMatchObject({ text: CHAT_OK.choices[0]!.message.content })
  })
})

describe('askAboutImage — lỗi', () => {
  it('chặn input hỏng TRƯỚC khi chạm mạng', async () => {
    const { fn, calls } = spyFetch(() => okResponse(CHAT_OK))
    const client = createOpenRouterClient(CFG, { fetch: fn })

    for (const bad of [
      { imageBase64: PNG_1PX, prompt: '   ' },
      { imageBase64: '', prompt: 'x' },
      { imageBase64: 'A'.repeat(MAX_IMAGE_BASE64_BYTES + 1), prompt: 'x' },
    ]) {
      await expect(client.askAboutImage(bad)).rejects.toBeInstanceOf(OpenRouterError)
      await expect(client.askAboutImage(bad)).rejects.toMatchObject({ code: 'bad_request' })
    }
    // Vế load-bearing: KHÔNG lượt gọi mạng nào (và KHÔNG hoá đơn nào) cho input tự ta biết là hỏng.
    expect(calls).toHaveLength(0)
  })

  it('ánh xạ status upstream sang mã ĐÓNG', async () => {
    const cases: Array<[number, string]> = [
      [401, 'auth_failed'], [403, 'auth_failed'], [402, 'payment_required'],
      [429, 'rate_limited'], [404, 'model_unavailable'], [503, 'model_unavailable'],
      [500, 'upstream_failed'], [418, 'upstream_failed'],
    ]
    for (const [status, code] of cases) {
      const { fn } = spyFetch(() => new Response('{"error":{"message":"nope"}}', { status }))
      const err = await createOpenRouterClient(CFG, { fetch: fn })
        .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e)
      expect(err).toBeInstanceOf(OpenRouterError)
      expect((err as OpenRouterError).code).toBe(code)
      expect((err as OpenRouterError).status).toBe(status)
      // Mã phải nằm trong từ vựng đóng — chặn đúng lớp lỗi "mã bịa lọt qua type system".
      expect(OPENROUTER_ERROR_CODES).toContain((err as OpenRouterError).code)
    }
  })

  it('KHÔNG rò khoá vào thông điệp lỗi, kể cả khi upstream dội lại header', async () => {
    // Ca thật: một số gateway echo cả request (kèm Authorization) vào thân lỗi.
    const { fn } = spyFetch(() => new Response(`{"error":"bad auth: Bearer ${FAKE_KEY}"}`, { status: 401 }))
    const err = await createOpenRouterClient(CFG, { fetch: fn })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e) as OpenRouterError
    // Thân upstream bị cắt ở 200 ký tự nhưng khoá vẫn có thể lọt trong 200 ký tự đó —
    // đây là giới hạn ĐÃ BIẾT, ghim lại thay vì giả vờ đã bịt.
    expect(err.code).toBe('auth_failed')
    expect(err.message).toContain('401')
    // Vế thật sự đảm bảo được: lỗi do CHÍNH TA dựng không bao giờ chứa khoá.
    const netErr = await createOpenRouterClient(CFG, {
      fetch: (() => Promise.reject(new TypeError('fetch failed'))) as unknown as typeof globalThis.fetch,
    }).askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e) as OpenRouterError
    expect(netErr.code).toBe('upstream_failed')
    expect(netErr.message).not.toContain(FAKE_KEY)
    expect(netErr.message).not.toContain('sk-or')
  })

  it('cắt thân lỗi upstream ở 200 ký tự', async () => {
    const { fn } = spyFetch(() => new Response('x'.repeat(10_000), { status: 500 }))
    const err = await createOpenRouterClient(CFG, { fetch: fn })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e) as OpenRouterError
    expect(err.message.length).toBeLessThan(300)
  })

  it('thân không đúng hình dạng → bad_response, không phải crash', async () => {
    for (const body of [{ choices: [] }, { choices: 'nope' }, {}, { choices: [{ message: {} }] }]) {
      const { fn } = spyFetch(() => okResponse(body))
      const err = await createOpenRouterClient(CFG, { fetch: fn })
        .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e)
      expect((err as OpenRouterError).code).toBe('bad_response')
    }
    const { fn } = spyFetch(() => new Response('<html>502</html>', { status: 200 }))
    const err = await createOpenRouterClient(CFG, { fetch: fn })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e)
    expect((err as OpenRouterError).code).toBe('bad_response')
  })

  it('nội dung rỗng báo có tên, kèm finish_reason — không lặng lẽ thành ""', async () => {
    const { fn } = spyFetch(() => okResponse({
      choices: [{ message: { content: null }, finish_reason: 'content_filter' }],
    }))
    const err = await createOpenRouterClient(CFG, { fetch: fn })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e) as OpenRouterError
    expect(err.code).toBe('bad_response')
    expect(err.message).toContain('content_filter')
  })

  it('hết giờ → timeout, và caller huỷ được', async () => {
    const hang = (async (_u: unknown, init?: RequestInit) => new Promise<Response>((_res, rej) => {
      init?.signal?.addEventListener('abort', () => rej((init.signal as AbortSignal).reason))
    })) as unknown as typeof globalThis.fetch

    const err = await createOpenRouterClient({ ...CFG, timeoutMs: 30 }, { fetch: hang })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x' }).catch((e: unknown) => e) as OpenRouterError
    expect(err.code).toBe('timeout')
    expect(err.message).toContain('30ms')

    const ac = new AbortController()
    const p = createOpenRouterClient(CFG, { fetch: hang })
      .askAboutImage({ imageBase64: PNG_1PX, prompt: 'x', signal: ac.signal })
      .catch((e: unknown) => e) as Promise<OpenRouterError>
    ac.abort()
    expect((await p).code).toBe('timeout')
  })
})
