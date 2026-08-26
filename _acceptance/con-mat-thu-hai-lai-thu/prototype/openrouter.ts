import { z } from 'zod'

/**
 * Client VLM qua OpenRouter, dựng cho vòng «Người lạ lái thử».
 *
 * VÌ SAO CÓ FILE NÀY. Bảy câu chuyển phiên người ở
 * `_acceptance/digitize-capability/stranger-drive.md` có ít nhất ba câu chỉ trả lời được khi có
 * người (hoặc một con mắt máy) MỞ ẢNH GỐC ra đối chiếu với đầu ra engine — câu 5 («cả hai căn
 * đều không có phòng bếp — do bản vẽ, do bộ nhãn thiếu loại phòng, hay máy đọc sót?»), câu 2
 * (`labelConfidence: 0` mà `summaryVi` vẫn gọi tên phòng), câu 3 (72,8 hay 106,7 là con số khách
 * cần nghe). Vòng lái thử hiện chạy thuần bằng tool `mcp__floorplanstudio__*` nên người-lạ tự
 * khai «không xác nhận được nội dung 4 file ở M2, vì kiểm nội dung thì phải mở file, mà luật
 * cấm». Đây là đường để mở ảnh mà không phá luật đó: một con mắt thứ hai, ngoài engine.
 *
 * VÌ SAO KHÔNG THÊM DEPENDENCY. `fetch` là built-in từ Node 18; `@types/node` của kho ở ^24.13.2.
 * SDK chính chủ của OpenRouter không mang lại gì mà 60 dòng dưới đây không làm được, trong khi
 * nó kéo theo một cây phụ thuộc đứng ngay cạnh đường xử lý ảnh của service. Kho này đã chọn giá
 * đó một lần rồi (`packages/core` chỉ một runtime dep) — giữ cùng một lựa chọn.
 *
 * VÌ SAO CẤU HÌNH LÀ TUỲ CHỌN, KHÁC `FLOORPLAN_HMAC_KEY`. HMAC là cửa xác thực: thiếu key thì
 * service phải TỪ CHỐI KHỞI ĐỘNG (`resolveHmacKey`, server.ts), vì chạy tiếp nghĩa là chạy với
 * một cửa coi như không tồn tại. OpenRouter thì ngược lại — nó là năng lực THẨM ĐỊNH dùng theo
 * vòng, không nằm trên đường phục vụ request nào. Bắt buộc nó lúc startup sẽ làm mọi deployment
 * hiện có và mọi job CI (không có khoá) chết ngay, để đổi lấy đúng con số không lợi ích an ninh.
 * Nên: THIẾU HẲN → `null` (tắt năng lực, im lặng). CÓ NHƯNG SAI → `throw` (xem `resolveOpenRouterConfig`).
 */

/** Không đọc từ env: đây là địa chỉ API duy nhất của OpenRouter, `OPENROUTER_BASE_URL` chỉ để trỏ mock trong test. */
export const OPENROUTER_DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1'

/**
 * Mặc định `google/gemini-3.7-flash` — đối chiếu `GET /api/v1/models` ngày 2026-08-20 (414 model),
 * không phải trí nhớ. Bốn ứng viên nhận ảnh, mỗi triệu token (in/out) và ngữ cảnh:
 *
 *   google/gemini-3.7-flash   ctx 1 048 576   $0,375 / $1,875   ← mặc định
 *   google/gemini-3.6-flash   ctx 1 048 576   $0,750 / $3,750     (2,0× giá 3.7)
 *   google/gemini-3.5-flash   ctx 1 048 576   $1,500 / $9,000     (4,0× / 4,8×)
 *   google/gemini-2.5-flash   ctx 1 048 576   $0,300 / $2,500     (rẻ hơn 20% vào, đắt hơn 33% ra)
 *
 * `input_modalities` của 3.7-flash: `text,image,video,file,audio` — nhận ảnh trực tiếp, không cần
 * bước OCR trung gian. Nó vừa mới hơn vừa rẻ hơn 3.6/3.5 ở CẢ HAI chiều, nên không có đánh đổi
 * để cân ở đây. Đổi mặc định thì đo lại bảng này (`/api/v1/models` mở, không cần khoá) và cập
 * nhật docblock — đừng đổi một dòng chuỗi rồi để bảng số nói dối.
 *
 * KHÔNG chốt cứng: `OPENROUTER_MODEL` ghi đè, và `askAboutImage({ model })` ghi đè theo từng lượt
 * gọi — một vòng lái thử thường muốn chạy cùng một ảnh qua hai model để so.
 */
export const OPENROUTER_DEFAULT_MODEL = 'google/gemini-3.7-flash'

/**
 * Khoá OpenRouter dạng `sk-or-v1-` + 64 hex = 73 ký tự. Sàn đặt ở 20, KHÔNG ghim tiền tố:
 * OpenRouter còn phát hành khoá provisioning và khoá runtime dạng khác, ghim tiền tố là tự tay
 * từ chối một loại khoá hợp lệ vì một hằng số đoán mò. Sàn này chỉ chặn đúng thứ nó nhắm:
 * `OPENROUTER_API_KEY=""` hoặc `=x` — cấu hình nửa vời trông như đã cấu hình.
 *
 * Đây KHÔNG phải phép kiểm an ninh cùng hạng với `MIN_HMAC_KEY_LENGTH` (32): khoá HMAC do người
 * đặt nên độ dài là proxy cho entropy, còn khoá này do OpenRouter sinh — độ dài không phải thứ
 * ta kiểm soát, và khoá sai thì upstream trả 401, không ai đoán được nó.
 */
export const MIN_OPENROUTER_KEY_LENGTH = 20

/**
 * Trần base64 cho ảnh gửi VLM. Rộng hơn hẳn `MAX_BODY_BYTES` (1 MiB) của route HTTP, có chủ ý:
 * 55 bản vẽ corpus lớn nhất 119 321 byte (base64 ≈ 160 KB), nhưng vòng lái thử cố tình đưa ảnh
 * LẠ — ảnh chụp màn hình, bản scan, ảnh chụp giấy — nên trần corpus là trần sai. 8 MiB base64
 * ≈ 6 MiB ảnh thật, dư ~37× so với bản vẽ corpus lớn nhất, và vẫn dưới trần 20 MiB/request của
 * OpenRouter. Trần này canh CHÍNH TA, không canh upstream: nó bắt lỗi "lỡ đưa nhầm file 200 MB"
 * ở phía mình, trước khi tốn một lượt round-trip và một hoá đơn.
 */
export const MAX_IMAGE_BASE64_BYTES = 8 * 1024 * 1024

/**
 * VLM đọc bản vẽ mất hàng chục giây, và vòng lái thử chạy thủ công chứ không phục vụ người dùng
 * cuối, nên mặc định rộng. Mốc so sánh trong kho: engine digitize p95 = 18,5 s và route
 * `/v1/digitize` cho `timeoutMs` tới 185 000. Giữ CÙNG trần 185 000 để hai đường không lệch
 * nhau — một lượt lái thử thường gọi cả hai trên cùng một ảnh.
 */
export const OPENROUTER_DEFAULT_TIMEOUT_MS = 120_000
export const OPENROUTER_MAX_TIMEOUT_MS = 185_000

/**
 * Từ vựng lỗi ĐÓNG — cùng luật với `DIAG_CODES` (CLAUDE.md) và `ENGINE_ERROR_CODES`: đừng nới
 * thành `string`, đừng hardcode danh sách ở chỗ gọi. Đã có một lần mã bịa lọt qua type system
 * trong kho này vì làm thế.
 */
export const OPENROUTER_ERROR_CODES = [
  'bad_request',        // ta gửi sai (ảnh quá trần, prompt rỗng, model rỗng) — chưa chạm mạng
  'auth_failed',        // 401/403 — khoá sai/hết hạn/không đủ quyền cho model
  'payment_required',   // 402 — hết credit; tách khỏi auth_failed vì cách sửa khác hẳn
  'rate_limited',       // 429
  'model_unavailable',  // 404 model id sai, hoặc 503 nhà cung cấp tắt
  'timeout',            // ta chủ động huỷ theo `timeoutMs`
  'upstream_failed',    // 5xx khác, hoặc mạng đứt
  'bad_response',       // 2xx nhưng thân không đúng hình dạng đã khai
] as const
export type OpenRouterErrorCode = (typeof OPENROUTER_ERROR_CODES)[number]

/**
 * Lỗi KHÔNG BAO GIỜ mang theo khoá.
 *
 * `message` dựng thủ công từ status + đoạn đầu thân trả về, chứ không phải `JSON.stringify` cả
 * request — request có header `Authorization`. Đây là lớp lỗi mà hồ sơ hmac.ts của kho đã dạy
 * một lần: thông điệp lỗi rò ra chỗ không ai ngờ (log, Sentry, màn hình chia sẻ), và một khoá
 * lọt vào log là khoá phải thu hồi.
 */
export class OpenRouterError extends Error {
  constructor(
    readonly code: OpenRouterErrorCode,
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'OpenRouterError'
  }
}

export interface OpenRouterConfig {
  readonly apiKey: string
  readonly model: string
  readonly baseUrl: string
  readonly timeoutMs: number
  /** `HTTP-Referer`/`X-Title` — OpenRouter dùng để gán lượt gọi cho app trên bảng xếp hạng. Tuỳ chọn. */
  readonly appUrl?: string
  readonly appTitle?: string
}

/**
 * Hàm THUẦN, không tự đọc `process.env` — cùng khuôn với `resolveHmacKey` (server.ts) và cùng lý
 * do: test được mà không phải mutate biến môi trường toàn cục hay spawn tiến trình thật.
 *
 * Ba trạng thái, cố ý phân biệt:
 *   - `OPENROUTER_API_KEY` VẮNG/rỗng  → `null`. Năng lực tắt. Service chạy bình thường.
 *   - CÓ nhưng sai (ngắn, model rỗng, timeout ngoài cận) → `throw`. Cấu hình nửa vời nguy hiểm
 *     hơn không cấu hình: nó trông như đã bật, rồi hỏng ở giữa vòng lái thử, và người chạy sẽ
 *     đi tìm lỗi ở engine.
 *   - CÓ và đúng → config.
 */
export function resolveOpenRouterConfig(
  env: Record<string, string | undefined>,
): OpenRouterConfig | null {
  const apiKey = env['OPENROUTER_API_KEY']?.trim()
  if (!apiKey) return null

  if (apiKey.length < MIN_OPENROUTER_KEY_LENGTH) {
    // Chỉ in ĐỘ DÀI, không in ký tự nào của khoá — kể cả tiền tố.
    throw new Error(
      `OPENROUTER_API_KEY must be at least ${MIN_OPENROUTER_KEY_LENGTH} characters ` +
      `(got ${apiKey.length}) — refusing to start with what looks like a placeholder key`,
    )
  }

  const model = env['OPENROUTER_MODEL']?.trim() || OPENROUTER_DEFAULT_MODEL
  if (!model) throw new Error('OPENROUTER_MODEL is set but empty — remove it to use the default')

  const baseUrl = env['OPENROUTER_BASE_URL']?.trim() || OPENROUTER_DEFAULT_BASE_URL

  const rawTimeout = env['OPENROUTER_TIMEOUT_MS']?.trim()
  let timeoutMs = OPENROUTER_DEFAULT_TIMEOUT_MS
  if (rawTimeout) {
    const parsed = Number(rawTimeout)
    if (!Number.isInteger(parsed) || parsed <= 0 || parsed > OPENROUTER_MAX_TIMEOUT_MS) {
      throw new Error(
        `OPENROUTER_TIMEOUT_MS must be an integer in 1..${OPENROUTER_MAX_TIMEOUT_MS} (got ${rawTimeout})`,
      )
    }
    timeoutMs = parsed
  }

  return {
    apiKey,
    model,
    baseUrl,
    timeoutMs,
    ...(env['OPENROUTER_APP_URL']?.trim() ? { appUrl: env['OPENROUTER_APP_URL']!.trim() } : {}),
    ...(env['OPENROUTER_APP_TITLE']?.trim() ? { appTitle: env['OPENROUTER_APP_TITLE']!.trim() } : {}),
  }
}

/**
 * Hình dạng trả về, kiểm bằng zod chứ không tin `as`. Chỉ khai những trường THỰC SỰ đọc — thêm
 * trường vào đây nghĩa là thêm một cách để upstream đổi hình dạng và làm ta đỏ oan. Mặc định
 * `strip` của zod object (KHÔNG phải `strict`) là thứ giữ điều đó đúng: OpenRouter thêm trường
 * mới thì trường đó bị bỏ qua, không ném — đừng đổi sang `.strict()`.
 */
const chatResponseSchema = z.object({
  model: z.string().optional(),
  choices: z.array(z.object({
    message: z.object({ content: z.string().nullable() }).optional(),
    finish_reason: z.string().nullish(),
  })).min(1),
  usage: z.object({
    prompt_tokens: z.number().optional(),
    completion_tokens: z.number().optional(),
    total_tokens: z.number().optional(),
  }).optional(),
})

export interface AskAboutImageRequest {
  /** Ảnh base64 THUẦN (không kèm tiền tố `data:`) — cùng hình dạng `image.dataBase64` của `/v1/digitize`. */
  readonly imageBase64: string
  readonly format?: 'png' | 'jpeg' | 'webp'
  readonly prompt: string
  /** Ghi đè model cho riêng lượt này — dùng khi so hai model trên cùng một ảnh. */
  readonly model?: string
  /**
   * ĐỪNG đặt thấp cho model dòng Gemini 3.x: `max_tokens` tính CẢ token suy luận, vốn không hiện
   * trong text trả về. Đo trên `golden/input.png` (155 788 base64 byte), cùng một prompt 3 dòng,
   * `google/gemini-3.7-flash`:
   *   maxTokens: 300  → completion 296, `finish_reason: length`, CỤT ở dòng 2
   *   không đặt       → completion 377, `finish_reason: stop`,   đủ 3 dòng
   * Một câu trả lời 12 chữ tốn 377 token, tức ~97% là suy luận. Bỏ trống là mặc định đúng; chỉ
   * đặt khi thật sự cần chặn chi phí, và khi đó phải chấp nhận nguy cơ cụt — `finish_reason` là
   * chỗ duy nhất phân biệt "model trả lời xong" với "ta cắt ngang", nên luôn đọc nó.
   */
  readonly maxTokens?: number
  /** Huỷ từ bên ngoài; ghép với timeout nội bộ, cái nào đến trước thắng. */
  readonly signal?: AbortSignal
}

export interface AskAboutImageResult {
  readonly text: string
  /** Model upstream THỰC SỰ chạy — có thể khác model đã yêu cầu khi OpenRouter định tuyến lại. */
  readonly model: string
  readonly finishReason: string | null
  readonly usage: { promptTokens?: number; completionTokens?: number; totalTokens?: number } | null
}

export interface OpenRouterClient {
  readonly model: string
  askAboutImage(req: AskAboutImageRequest): Promise<AskAboutImageResult>
}

/** Tiêm `fetch` để test không chạm mạng. Mặc định là `fetch` toàn cục của Node. */
export interface OpenRouterDeps {
  readonly fetch?: typeof globalThis.fetch
}

export function createOpenRouterClient(
  cfg: OpenRouterConfig,
  deps: OpenRouterDeps = {},
): OpenRouterClient {
  const doFetch = deps.fetch ?? globalThis.fetch

  async function askAboutImage(req: AskAboutImageRequest): Promise<AskAboutImageResult> {
    const prompt = req.prompt?.trim()
    if (!prompt) throw new OpenRouterError('bad_request', 'prompt must not be empty')
    if (!req.imageBase64) throw new OpenRouterError('bad_request', 'imageBase64 must not be empty')
    if (req.imageBase64.length > MAX_IMAGE_BASE64_BYTES) {
      throw new OpenRouterError(
        'bad_request',
        `image is ${req.imageBase64.length} base64 bytes, over the ${MAX_IMAGE_BASE64_BYTES} cap`,
      )
    }

    const model = req.model?.trim() || cfg.model
    const format = req.format ?? 'png'

    // `AbortSignal.timeout` + `AbortSignal.any`: huỷ nội bộ theo `timeoutMs` VÀ tôn trọng signal
    // của caller. Không tự dựng setTimeout — quên clear là giữ event loop sống thêm 2 phút.
    const timeoutSignal = AbortSignal.timeout(cfg.timeoutMs)
    const signal = req.signal ? AbortSignal.any([timeoutSignal, req.signal]) : timeoutSignal

    const headers: Record<string, string> = {
      'authorization': `Bearer ${cfg.apiKey}`,
      'content-type': 'application/json',
    }
    if (cfg.appUrl) headers['http-referer'] = cfg.appUrl
    if (cfg.appTitle) headers['x-title'] = cfg.appTitle

    let res: Response
    try {
      res = await doFetch(`${cfg.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        signal,
        body: JSON.stringify({
          model,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              // OpenRouter nhận data URL trực tiếp — không cần host ảnh ở đâu cả, nên đường này
              // KHÔNG mở ra một bề mặt đọc file hay một bucket public nào (cùng lý luận với
              // quyết định "ảnh inline, tuyệt đối không nhận đường dẫn" ở `/v1/digitize`).
              { type: 'image_url', image_url: { url: `data:image/${format};base64,${req.imageBase64}` } },
            ],
          }],
          ...(req.maxTokens ? { max_tokens: req.maxTokens } : {}),
        }),
      })
    } catch (err) {
      // `AbortSignal.timeout` ném TimeoutError; abort của caller ném AbortError. Phân biệt để
      // người chạy vòng lái thử biết là MÌNH huỷ hay là hết giờ.
      const name = err instanceof Error ? err.name : ''
      if (name === 'TimeoutError') {
        throw new OpenRouterError('timeout', `openrouter request exceeded ${cfg.timeoutMs}ms`)
      }
      if (name === 'AbortError') throw new OpenRouterError('timeout', 'openrouter request aborted by caller')
      // KHÔNG nội suy `err` vào message: một số lỗi undici đính kèm cả request (có header
      // Authorization) vào `cause`. Chỉ lấy `.message`, vốn là chuỗi mô tả tầng mạng.
      throw new OpenRouterError('upstream_failed', err instanceof Error ? err.message : 'network error')
    }

    if (!res.ok) throw await httpError(res)

    let parsed: unknown
    try {
      parsed = await res.json()
    } catch {
      throw new OpenRouterError('bad_response', 'openrouter returned a non-JSON body', res.status)
    }

    const result = chatResponseSchema.safeParse(parsed)
    if (!result.success) {
      throw new OpenRouterError('bad_response', 'openrouter response did not match the expected shape', res.status)
    }

    const choice = result.data.choices[0]!
    const text = choice.message?.content ?? ''
    if (!text) {
      // Rỗng là một câu trả lời HỢP LỆ về mặt giao thức (bộ lọc an toàn, hết token) nhưng vô
      // dụng cho người chạy — báo có tên thay vì trả chuỗi rỗng để nó lặng lẽ thành "" trong báo cáo.
      throw new OpenRouterError(
        'bad_response',
        `model returned no text (finish_reason: ${choice.finish_reason ?? 'unknown'})`,
        res.status,
      )
    }

    const u = result.data.usage
    return {
      text,
      model: result.data.model ?? model,
      finishReason: choice.finish_reason ?? null,
      usage: u
        ? {
          ...(u.prompt_tokens !== undefined ? { promptTokens: u.prompt_tokens } : {}),
          ...(u.completion_tokens !== undefined ? { completionTokens: u.completion_tokens } : {}),
          ...(u.total_tokens !== undefined ? { totalTokens: u.total_tokens } : {}),
        }
        : null,
    }
  }

  return { model: cfg.model, askAboutImage }
}

/**
 * Ánh xạ status → mã ĐÓNG, kèm ≤200 ký tự đầu của thân lỗi upstream.
 *
 * Cắt ở 200: đủ để đọc `"model not found"` hay `"insufficient credits"` — hai câu chiếm gần hết
 * các ca thật — nhưng không đủ để một thân lỗi vài chục KB tràn vào log. Thân lỗi là dữ liệu
 * upstream, KHÔNG phải chỉ thị: nó chỉ được nhúng vào message, không bao giờ được parse ra rồi
 * đem đi quyết định luồng.
 */
async function httpError(res: Response): Promise<OpenRouterError> {
  let detail = ''
  try {
    detail = (await res.text()).slice(0, 200)
  } catch {
    detail = '(unreadable body)'
  }

  const code: OpenRouterErrorCode =
    res.status === 401 || res.status === 403 ? 'auth_failed'
      : res.status === 402 ? 'payment_required'
        : res.status === 429 ? 'rate_limited'
          : res.status === 404 || res.status === 503 ? 'model_unavailable'
            : 'upstream_failed'

  return new OpenRouterError(code, `openrouter returned ${res.status}: ${detail}`, res.status)
}
