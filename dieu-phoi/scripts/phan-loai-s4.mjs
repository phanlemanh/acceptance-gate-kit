// Phân loại một lệnh Bash theo CẤU TRÚC lời gọi: lệnh này có chạy một script giữ tài nguyên của
// đợt (S4, đường nền) không. Không so chuỗi con — bản cũ so `includes` nên chặn nhầm
// `node --test …repin-lane-lop-cu.test.mjs` hay `grep -n s4-args …`. Một hàm dùng chung cho hook
// chặn S4 và lớp mod (DP6): sửa lỗi phân loại là sửa ở đây.
import path from 'node:path';

// Khoá = tên script bỏ đuôi .mjs/.js/.cjs.
export const BANG_BASH = { 'repin-lane': 's4', 's4-args': 's4', 'duong-nen': 'duong-nen' };

// Vỏ bọc: lệnh đứng trước và chạy lệnh thật. `giaTri` = cờ ăn từ kế; `viTri` = số đối số vị trí bắt buộc
// trước lệnh thật (thời lượng của timeout). Nguồn: GNU coreutils timeout(1), nice(1); BSD caffeinate(8);
// builtin time, command, exec của bash (design DP6 §4 C1). Cờ dạng `--x=y` tự mang giá trị.
export const VO_BOC = {
  timeout: { giaTri: ['-s', '-k', '--signal', '--kill-after'], viTri: 1 },
  nice: { giaTri: ['-n', '--adjustment'], viTri: 0 },
  time: { giaTri: [], viTri: 0 },
  nohup: { giaTri: [], viTri: 0 },
  command: { giaTri: [], viTri: 0 },
  exec: { giaTri: ['-a'], viTri: 0 },
  caffeinate: { giaTri: ['-t', '-w'], viTri: 0 },
};
// env (GNU + BSD env(1)): cờ ăn từ kế; -S/--split-string tách chuỗi thành lệnh.
const ENV_GIA_TRI = new Set(['-u', '--unset', '-C', '--chdir', '-P']);
const ENV_TACH = new Set(['-S', '--split-string']);
const GAN = /^[A-Za-z_][A-Za-z0-9_]*=/;
const SHELL = new Set(['bash', 'sh', 'zsh']);
// Cờ của node nhận một giá trị ở từ kế tiếp.
const CO_NODE_CO_GIA_TRI = new Set(['-r', '--require', '--import', '--loader', '--experimental-loader', '-C', '--conditions', '--env-file', '--input-type', '--title', '--test-reporter', '--test-reporter-destination', '--test-name-pattern']);
const CO_NODE_MA_TRONG = new Set(['-e', '--eval', '-p', '--print']);

// Tách chuỗi lệnh thành các đoạn (mảng từ), cắt ở && || ; | & xuống dòng và ngoặc — ngoài nháy. Chú thích
// `#` bỏ tới hết dòng. Thân heredoc là dữ liệu (POSIX «Here-Document»): thân có nháy bỏ trọn; thân không nháy vẫn
// bị shell thay `$(…)` và backtick, nên chỉ các đoạn đó thành lệnh — TRỪ khi cùng dòng có một trình thông dịch
// đọc stdin (`bash`, `sh -s`, `… | bash`, `node` không tệp script): khi ấy thân CHÍNH LÀ lệnh (design DP6 §4 C1).
export function tachDoan(lenh) {
  const doan = [];
  let tu = [];
  let cur = null;
  let nhay = null;
  let choHeredoc = [];
  let dauDong = 0;
  let soHoc = 0;
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
    // Số học `((…))` / `$((…))`: `<<` trong đó là dịch bit, không mở heredoc.
    if (c === '(' && lenh[i + 1] === '(') {
      soHoc++;
      cat();
      i++;
      continue;
    }
    if (c === ')' && lenh[i + 1] === ')' && soHoc > 0) {
      soHoc--;
      cat();
      i++;
      continue;
    }
    // `#` ở đầu một từ mở chú thích tới hết dòng (dòng xuống vẫn được xử lý).
    if (c === '#' && cur === null && soHoc === 0) {
      const het = lenh.indexOf('\n', i);
      i = (het === -1 ? lenh.length : het) - 1;
      continue;
    }
    // `<<<` là here-string: một từ dữ liệu trên cùng dòng, không có thân.
    if (c === '<' && lenh[i + 1] === '<' && lenh[i + 2] === '<') {
      if (cur === null) cur = '';
      cur += '<<<';
      i += 2;
      continue;
    }
    // `<<DELIM`, `<<-DELIM`, `<<'DELIM'`, `<<"DELIM"` mở heredoc. Dấu mở là trọn một từ shell (gỡ nháy) và phải bắt
    // đầu bằng chữ, `_` hoặc nháy — số học đã loại ở trên, nên `1<<2` lẻ cũng không mở heredoc.
    if (c === '<' && lenh[i + 1] === '<' && soHoc === 0) {
      let m = /^<<(-?)[ \t]*([^\s;&|<>()]+)/.exec(lenh.slice(i));
      if (m && !/^['"\\]*[A-Za-z_]/.test(m[2])) m = null;
      if (m) {
        choHeredoc.push({ delim: m[2].replace(/['"\\]/g, ''), nhay: /['"\\]/.test(m[2]), boTab: m[1] === '-' });
        day();
        i += m[0].length - 1;
        continue;
      }
    }
    if (c === '\n' && choHeredoc.length) {
      cat();
      const dt = doThongDich(doan.slice(dauDong));
      i = docThanHeredoc(lenh, i + 1, choHeredoc, doan, dt) - 1;
      choHeredoc = [];
      dauDong = doan.length;
      continue;
    }
    if ('&|;\n()'.includes(c)) {
      cat();
      if (c === '\n') dauDong = doan.length;
      continue;
    }
    if (cur === null) cur = '';
    cur += c;
  }
  cat();
  return doan;
}

// Trình thông dịch đọc stdin trong các đoạn của một dòng: `'shell'` (`bash`/`sh`/`zsh` không `-c` và không tệp
// script, hoặc có `-s`), `'node'` (node không tệp script, hoặc `-`), hay `null`.
function doThongDich(cacDoan) {
  for (const tu of cacDoan) {
    const i = boVoBoc(tu, 0).i;
    if (i >= tu.length) continue;
    const ten = path.basename(tu[i]);
    const doiSo = tu.slice(i + 1);
    if (SHELL.has(ten)) {
      // Cờ mang giá trị của shell (`-o pipefail`, cụm `-euo pipefail`, `-O opt`, `--rcfile f`) ăn từ kế — giá trị ấy
      // không phải tệp script.
      let doc = 'shell';
      for (let k = 0; k < doiSo.length; k++) {
        const a = doiSo[k];
        if (/^-[a-zA-Z]*c$/.test(a)) {
          doc = null;
          break;
        }
        if (a === '-s') break;
        if (/^[-+][a-zA-Z]*[oO]$/.test(a) || a === '--rcfile' || a === '--init-file') k++;
        else if (!a.startsWith('-') && !a.startsWith('+')) {
          doc = null;
          break;
        }
      }
      if (doc) return doc;
    }
    if (ten === 'node' || ten === 'nodejs') {
      let j = 0;
      let maTrong = false;
      for (; j < doiSo.length; j++) {
        if (CO_NODE_MA_TRONG.has(doiSo[j])) maTrong = true;
        if (CO_NODE_CO_GIA_TRI.has(doiSo[j])) j++;
        else if (!doiSo[j].startsWith('-')) break;
      }
      if (!maTrong && (j >= doiSo.length || doiSo[j] === '-')) return 'node';
    }
  }
  return null;
}

// Đọc thân của các heredoc đang chờ, từ vị trí `tu`; trả vị trí ngay sau dòng đóng cuối (thiếu dòng đóng thì thân
// kéo tới hết chuỗi, như shell). `dt` = trình thông dịch đọc stdin trên dòng mở (doThongDich): `'shell'` thì thân
// là lệnh; `'node'` thì thân là mã JS — nhắc tên một script giữ tài nguyên là coi như chạy nó; không có thì thân là
// dữ liệu, chỉ `$(…)`/backtick của thân không nháy thành lệnh.
function docThanHeredoc(lenh, tu, cho, doan, dt) {
  let i = tu;
  for (const h of cho) {
    const than = [];
    while (i < lenh.length) {
      const het = lenh.indexOf('\n', i);
      const dong = lenh.slice(i, het === -1 ? lenh.length : het);
      i = het === -1 ? lenh.length : het + 1;
      if ((h.boTab ? dong.replace(/^\t+/, '') : dong) === h.delim) break;
      than.push(dong);
    }
    const noi = than.join('\n');
    if (dt === 'shell') {
      doan.push(...tachDoan(noi));
    } else if (dt === 'node') {
      for (const k of Object.keys(BANG_BASH)) if (noi.includes(k)) doan.push(['node', `${k}.mjs`]);
    } else if (!h.nhay) for (const con of thayLenhTrong(noi)) doan.push(...tachDoan(con));
  }
  return i;
}

// Nội dung các lần thay lệnh `$(…)` (không tính `$((…))` số học) và backtick trong một đoạn văn.
function thayLenhTrong(s) {
  const ra = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '$' && s[i + 1] === '(' && s[i + 2] !== '(') {
      let sau = 1;
      let j = i + 2;
      for (; j < s.length && sau > 0; j++) {
        if (s[j] === '(') sau++;
        else if (s[j] === ')') sau--;
      }
      ra.push(s.slice(i + 2, sau === 0 ? j - 1 : j));
      i = j - 1;
    } else if (s[i] === '`') {
      const j = s.indexOf('`', i + 1);
      if (j === -1) break;
      ra.push(s.slice(i + 1, j));
      i = j;
    }
  }
  return ra;
}

const nhayDon = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

// Bỏ tiền tố KEY=val và mọi vỏ bọc (kèm cờ, giá trị, đối số vị trí). Trả `{ i }` = vị trí lệnh thật, hoặc
// `{ tach, i }` khi gặp `env -S <chuỗi>` (phần sau i nối vào chuỗi rồi phân loại lại).
function boVoBoc(tu, i) {
  for (;;) {
    if (i >= tu.length) return { i };
    const t = tu[i];
    if (GAN.test(t)) {
      i++;
      continue;
    }
    if (t === 'env') {
      i++;
      while (i < tu.length) {
        const c = tu[i];
        if (ENV_TACH.has(c)) return { tach: tu[i + 1] ?? '', i: i + 2 };
        if (c.startsWith('--split-string=')) return { tach: c.slice('--split-string='.length), i: i + 1 };
        if (ENV_GIA_TRI.has(c)) i += 2;
        else if (c.startsWith('-') || GAN.test(c)) i++;
        else break;
      }
      continue;
    }
    const vb = VO_BOC[t];
    if (!vb) return { i };
    i++;
    while (i < tu.length && tu[i].startsWith('-') && tu[i] !== '-') i += !tu[i].includes('=') && vb.giaTri.includes(tu[i]) ? 2 : 1;
    i += vb.viTri;
  }
}

const tra = (tep, bang) => bang[path.basename(tep).replace(/\.(mjs|cjs|js)$/, '')] ?? null;

function phanLoaiTu(tu, bang, sau) {
  const b = boVoBoc(tu, 0);
  if (b.tach !== undefined) return phanLoaiLenh([b.tach, ...tu.slice(b.i).map(nhayDon)].join(' '), bang, sau + 1);
  const i = b.i;
  if (i >= tu.length) return null;
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
      // `node --check|-c` chỉ kiểm cú pháp, không chạy script.
      if (t === '--check' || t === '-c') return null;
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
    // `--help` là cờ lạ với cả ba script giữ tài nguyên: chúng đọc hết đối số rồi dừng trước khi làm việc
    // (ca DP6-02 tien-de-help chứng lại trên script thật).
    if (tu.slice(j + 1).includes('--help')) return null;
    return tra(script, bang);
  }
  if (dau.includes('/') || /\.(mjs|cjs|js)$/.test(dau)) return tu.slice(i + 1).includes('--help') ? null : tra(dau, bang);
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
