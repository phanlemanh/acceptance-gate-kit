// Phân loại một lệnh Bash theo CẤU TRÚC lời gọi: lệnh này có chạy một script giữ tài nguyên của
// đợt (S4, đường nền) không. Không so chuỗi con — bản cũ so `includes` nên chặn nhầm
// `node --test …repin-lane-lop-cu.test.mjs` hay `grep -n s4-args …`. Một hàm dùng chung cho hook
// chặn S4 và lớp mod (DP6): sửa lỗi phân loại là sửa ở đây.
import path from 'node:path';

// Khoá = tên script bỏ đuôi .mjs/.js/.cjs.
export const BANG_BASH = { 'repin-lane': 's4', 's4-args': 's4', 'duong-nen': 'duong-nen' };

const VO_BOC = new Set(['exec', 'time', 'nohup', 'command', 'nice']);
const SHELL = new Set(['bash', 'sh', 'zsh']);
// Cờ của node nhận một giá trị ở từ kế tiếp.
const CO_NODE_CO_GIA_TRI = new Set(['-r', '--require', '--import', '--loader', '--experimental-loader', '-C', '--conditions', '--env-file', '--input-type', '--title', '--test-reporter', '--test-reporter-destination', '--test-name-pattern']);
const CO_NODE_MA_TRONG = new Set(['-e', '--eval', '-p', '--print']);

// Tách chuỗi lệnh thành các đoạn (mảng từ), cắt ở && || ; | & xuống dòng và ngoặc — ngoài nháy.
export function tachDoan(lenh) {
  const doan = [];
  let tu = [];
  let cur = null;
  let nhay = null;
  const day = () => {
    if (cur !== null) tu.push(cur);
    cur = null;
  };
  const cat = () => {
    day();
    if (tu.length) doan.push(tu);
    tu = [];
  };
  for (let i = 0; i < lenh.length; i++) {
    const c = lenh[i];
    if (nhay === "'") {
      if (c === "'") nhay = null;
      else cur += c;
      continue;
    }
    if (nhay === '"') {
      if (c === '"') nhay = null;
      else if (c === '\\' && i + 1 < lenh.length && '"\\$`'.includes(lenh[i + 1])) cur += lenh[++i];
      else cur += c;
      continue;
    }
    if (c === "'" || c === '"') {
      nhay = c;
      if (cur === null) cur = '';
      continue;
    }
    if (c === '\\' && i + 1 < lenh.length) {
      if (cur === null) cur = '';
      cur += lenh[++i];
      continue;
    }
    if (c === ' ' || c === '\t') {
      day();
      continue;
    }
    if ('&|;\n()'.includes(c)) {
      cat();
      continue;
    }
    if (cur === null) cur = '';
    cur += c;
  }
  cat();
  return doan;
}

const tra = (tep, bang) => bang[path.basename(tep).replace(/\.(mjs|cjs|js)$/, '')] ?? null;

function phanLoaiTu(tu, bang, sau) {
  let i = 0;
  // Bỏ tiền tố KEY=val, vỏ bọc (exec, time, nohup…) và `env [cờ] [KEY=val]`.
  for (;;) {
    if (i >= tu.length) return null;
    const t = tu[i];
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(t)) i++;
    else if (VO_BOC.has(t)) i++;
    else if (t === 'env') {
      i++;
      while (i < tu.length && (tu[i].startsWith('-') || /^[A-Za-z_][A-Za-z0-9_]*=/.test(tu[i]))) i++;
    } else break;
  }
  const dau = tu[i];
  const ten = path.basename(dau);
  if (SHELL.has(ten)) {
    for (let j = i + 1; j < tu.length; j++) {
      if (/^-[a-z]*c$/.test(tu[j])) return j + 1 < tu.length ? phanLoaiLenh(tu[j + 1], bang, sau + 1) : null;
      if (!tu[j].startsWith('-')) return tra(tu[j], bang);
    }
    return null;
  }
  if (ten === 'node' || ten === 'nodejs') {
    let j = i + 1;
    for (; j < tu.length; j++) {
      const t = tu[j];
      if (t === '--test' || t.startsWith('--test=')) return null;
      if (CO_NODE_MA_TRONG.has(t)) return null;
      if (CO_NODE_CO_GIA_TRI.has(t)) {
        j++;
        continue;
      }
      if (t.startsWith('-')) continue;
      break;
    }
    if (j >= tu.length) return null;
    const script = tu[j];
    if (path.basename(script) === 'giu-nhip.mjs') {
      const ngan = tu.indexOf('--', j + 1);
      return ngan === -1 ? null : phanLoaiTu(tu.slice(ngan + 1), bang, sau + 1);
    }
    return tra(script, bang);
  }
  if (dau.includes('/') || /\.(mjs|cjs|js)$/.test(dau)) return tra(dau, bang);
  return null;
}

// Tài nguyên mà lệnh giữ (`s4`, `duong-nen`) hoặc null. `sau` chặn đệ quy vô hạn qua `bash -c`.
export function phanLoaiLenh(lenh, bang = BANG_BASH, sau = 0) {
  if (sau > 8 || typeof lenh !== 'string') return null;
  for (const tu of tachDoan(lenh)) {
    const tn = phanLoaiTu(tu, bang, sau);
    if (tn) return tn;
  }
  return null;
}
