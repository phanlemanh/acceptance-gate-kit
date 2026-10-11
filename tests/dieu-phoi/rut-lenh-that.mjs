#!/usr/bin/env node
// rut-lenh-that.mjs — hồ sơ dieu-phoi-lop-mod AC-3. Rút chín lời gọi Bash THẬT đo 11/10 (design §2.1) từ bản
// ghi hội thoại theo (tệp, tool_use_id), ẩn danh, ghi tệp ca. Không gõ tay lời gọi nào: tệp ca là đầu ra của
// script này. Dùng: node tests/dieu-phoi/rut-lenh-that.mjs [--projects <dir>] [--out <tệp>]
// Thoát 0 khi ghi đủ chín dòng · 2 khi thư mục bản ghi vắng · 1 khi thiếu một định danh.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
export const TEP_CA = path.join(DAY, 'fixtures', 'lenh-that-2026-10-11.jsonl');
// <u> = phần tên người dùng trong tên thư mục bản ghi (`-Users-<u>-dev-…`), thay lúc chạy.
export const DANH_SACH = [
  { tep: '-Users-<u>-dev-crm-onehub/e961dd78-18df-479c-b222-626b5031071d.jsonl', tool_use_id: 'toolu_01F5amYzsLqZiwyLE6LJcuqF', nhan: 's4', hinh: 'bo-lot:timeout' },
  { tep: '-Users-<u>-dev-crm-onehub/e961dd78-18df-479c-b222-626b5031071d.jsonl', tool_use_id: 'toolu_01MqsXnkmKmaZr4xQmriH3Dw', nhan: 's4', hinh: 'bo-lot:timeout' },
  { tep: '-Users-<u>-dev-oneflow--claude-worktrees-relaxed-sammet-b381ba/99f5dccb-b708-439b-9cfe-840162211b3e.jsonl', tool_use_id: 'toolu_01DpKjkur1hT8TmFV51Pcd2m', nhan: 's4', hinh: 'bo-lot:env-u' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit/453582f0-0a41-4aae-88c9-0ee68e6fe063.jsonl', tool_use_id: 'toolu_01Bha6MeGgBoLdk8VeMC8Tcj', nhan: null, hinh: 'chan-nham:check' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit/4ee4870f-67ea-490e-a54b-79b88660d13c.jsonl', tool_use_id: 'toolu_017FZkfNBLhwjrZmuQUVwDRr', nhan: null, hinh: 'chan-nham:heredoc' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit/ae39de67-acaa-4cd4-8e29-36405c8c2544.jsonl', tool_use_id: 'toolu_01H5bCZJ6C6JKEV8JQbeDfCD', nhan: null, hinh: 'chan-nham:heredoc' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit--claude-worktrees-zen-shaw-03c3ac/51f8aff8-8ca7-487a-bb1d-99e8194f59ad.jsonl', tool_use_id: 'toolu_015Z9CSu8WPviJnAg9yU6P47', nhan: null, hinh: 'chan-nham:check' },
  { tep: '-Users-<u>-dev-crm-onehub/8b05aa51-86a9-4ab2-a710-b301f6bcc53b.jsonl', tool_use_id: 'toolu_017EVCCzAVeUqjHNA7kveJpS', nhan: null, hinh: 'chan-nham:help' },
  { tep: '-Users-<u>-dev-crm-onehub--claude-worktrees-agitated-kilby-4b9585/b8585b6c-402c-464d-a724-0c3b96ce514d.jsonl', tool_use_id: 'toolu_01TLNuUR2y6YqYxRGEPyG2Mo', nhan: null, hinh: 'chan-nham:help' },
];

// Tên riêng của kho tiêu thụ → tên trung tính (răng DP1-07 cấm chúng trong tests/dieu-phoi/fixtures). Thứ tự
// quan trọng: cụm dài trước cụm con.
export const RIENG_KHO = [
  ['crm-onehub', 'kho-a'], ['onehub', 'kho-a'], ['oneflow', 'kho-b'], ['crm', 'kho'], ['prisma', 'orm'],
  ['bunx', 'npx'], ['bun run', 'npm run'], ['bun install', 'npm install'],
  [':3000', ':8000'], [':3001', ':8001'], ['5432', '5433'], ['docs/plan/dot-', 'docs/ke-hoach/dot-'],
];
// Ẩn danh: đường scratchpad của phiên → /tmp/scratch, tên người dùng → u, địa chỉ thư → u@x, tên riêng của kho
// tiêu thụ → tên trung tính. Không đổi hình dạng lời gọi (vỏ bọc, lệnh, tên script giữ nguyên) nên nhãn phân
// loại không đổi.
export function anDanh(s, user = os.userInfo().username) {
  let ra = s
    .replace(/\/private\/tmp\/claude-\d+\/[^\s'"`;|&)]*/g, '/tmp/scratch')
    .split(user)
    .join('u')
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, 'u@x');
  for (const [cu, moi] of RIENG_KHO) ra = ra.split(new RegExp(cu.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).join(moi);
  // Chữ mà các răng quét toàn kho của kit đọc như vật thật: cặp marker `<<<TÊN`/`TÊN>>>` (P93 đòi mỗi cặp duy nhất
  // toàn kho) và chữ trạng thái «signed-off» (RT13 đòi mọi tệp chứa nó có ca). Tệp ca chỉ cần HÌNH lời gọi — các chữ
  // này nằm trong thân heredoc có nháy hay trong đối số grep, không đổi nhãn phân loại.
  return ra
    .replace(/<<<([A-Z][A-Z0-9_-]*)/g, '<<<x-$1')
    .replace(/([A-Z][A-Z0-9_-]*)>>>/g, '$1-x>>>')
    .replace(/signed-off/gi, 'da-ky');
}

async function timLenh(p, id) {
  const rl = readline.createInterface({ input: fs.createReadStream(p), crlfDelay: Infinity });
  for await (const d of rl) {
    if (!d.includes(id)) continue;
    let o;
    try {
      o = JSON.parse(d);
    } catch {
      continue;
    }
    for (const c of o?.message?.content ?? []) if (c?.type === 'tool_use' && c.id === id) return String(c.input?.command ?? '');
  }
  return null;
}

export async function rut(projects, user = os.userInfo().username) {
  const ra = [];
  for (const m of DANH_SACH) {
    const p = path.join(projects, m.tep.replace('<u>', user));
    const lenh = fs.existsSync(p) ? await timLenh(p, m.tool_use_id) : null;
    if (lenh == null) throw new Error(`rut-lenh-that: không thấy ${m.tool_use_id} trong ${m.tep}`);
    ra.push({ tep: anDanh(m.tep, user), tool_use_id: m.tool_use_id, nhan: m.nhan, hinh: m.hinh, lenh: anDanh(lenh, user) });
  }
  return `${ra.map((x) => JSON.stringify(x)).join('\n')}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const co = (ten, macDinh) => {
    const i = process.argv.indexOf(ten);
    return i > -1 ? process.argv[i + 1] : macDinh;
  };
  const projects = co('--projects', path.join(os.homedir(), '.claude', 'projects'));
  const out = co('--out', TEP_CA);
  if (!fs.existsSync(projects)) {
    console.error(`rut-lenh-that: không có bản ghi hội thoại ở ${projects}`);
    process.exit(2);
  }
  try {
    const noi = await rut(projects);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, noi);
    console.log(`rut-lenh-that: ${DANH_SACH.length} dòng → ${out}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
