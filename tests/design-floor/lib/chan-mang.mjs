// Nạp trước (`node --import`) mọi lượt chạy `ui` của bộ đo: mọi đường mạng của node bị thay
// bằng hàm ghi một dòng vào $DF_NET_LOG rồi ném lỗi. Log nằm NGOÀI hộp cát nên không làm
// đổi danh sách tệp mà DF-07 so. DF-09 tự thử bộ chặn này trước khi tin log rỗng.
import { appendFileSync } from 'node:fs';
import { createRequire, syncBuiltinESMExports } from 'node:module';

const require = createRequire(import.meta.url);
const LOG = process.env.DF_NET_LOG;

function chan(ten) {
  return function () {
    if (LOG) appendFileSync(LOG, `${ten}\n`);
    throw new Error(`design-floor: đường mạng bị chặn (${ten})`);
  };
}

const BANG = {
  net: ['connect', 'createConnection', 'createServer'],
  tls: ['connect', 'createServer'],
  http: ['request', 'get', 'createServer'],
  https: ['request', 'get', 'createServer'],
  http2: ['connect', 'createServer', 'createSecureServer'],
  dgram: ['createSocket'],
  dns: ['lookup', 'lookupService', 'resolve', 'resolve4', 'resolve6', 'resolveAny', 'reverse'],
};
for (const [mod, fns] of Object.entries(BANG)) {
  const m = require(mod);
  for (const f of fns) m[f] = chan(`${mod}.${f}`);
}
require('net').Socket.prototype.connect = chan('net.Socket.connect');
const dp = require('dns').promises;
for (const f of ['lookup', 'resolve', 'resolve4', 'resolve6', 'resolveAny', 'reverse']) dp[f] = chan(`dns.promises.${f}`);
globalThis.fetch = chan('fetch');
if (globalThis.WebSocket) globalThis.WebSocket = chan('WebSocket');
if (globalThis.EventSource) globalThis.EventSource = chan('EventSource');
syncBuiltinESMExports();
