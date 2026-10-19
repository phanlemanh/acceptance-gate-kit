#!/usr/bin/env node
// rang/lich-su-do.mjs — răng «chiều đỏ nằm trong LỊCH SỬ» của hồ sơ nhay-don-nhan-doi (AC-6, E7).
//
// Tìm commit ĐẦU TIÊN đưa `function bg10a` vào tests/scripts/bo-giai-nhay.test.mjs (commit ca), dựng bản
// sao TRỌN cây của sha đó (`git archive`, không chép danh sách tệp tay — bài học P150) và đòi bốn điều:
//   (1) lib ở sha đó CHƯA mang bản vá — ca thật sự đứng trước vật;
//   (2) fixture ở sha đó ĐÃ nhận khoá `e.yaml` — hạ tầng ca có mặt ở commit ca, không ở commit vá;
//   (3) BG10a/BG10d/BG10e ĐỎ với thông điệp của VẬT và KHÔNG có thông điệp hạ tầng của đối chứng;
//   (4) đối chứng dương: bản sao HEAD, cùng ba chân → xanh.
// Lịch sử bị nén (squash) mất commit ca → MÙ (thoát 3), không xanh.
// Đường dẫn suy từ vị trí tệp này. Một lối thoát duy nhất ở cuối.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..');
const TEP_CA = 'tests/scripts/bo-giai-nhay.test.mjs';
const CHAN = 'BG10a,BG10d,BG10e';
const GHIM_VAT = ['DO BG10a: [giua]', 'DO BG10d: lenh trong khong chay', 'DO BG10e: khong dau vet'];
const GHIM_HA_TANG = 'doi chung nhay kep hong';
const BAN_VA = ".replace(/''/g, \"'\")";

const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const tmps = [];
const banSao = (sha) => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'lsd-'));
  tmps.push(d);
  const tar = execFileSync('git', ['-C', ROOT, 'archive', sha], { maxBuffer: 512 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  return d;
};
const chay = (goc) => spawnSync(process.execPath, [path.join(goc, TEP_CA)], {
  encoding: 'utf8', env: { ...process.env, BG_ONLY: CHAN, BG_NO_RED: '1' }, timeout: 600000,
});

let ma = 0;
const loi = [];
try {
  const sha = (git('log', '--reverse', '--format=%H', '-S', 'function bg10a', '--', TEP_CA).split('\n')[0] || '').trim();
  if (!sha) {
    console.error('MU lich-su-do: khong tim thay commit dua «function bg10a» vao tep ca — lich su bi nen hoac chua commit ca');
    ma = 3;
  } else {
    console.log(`commit ca: ${sha}`);
    const d = banSao(sha);
    const lib = fs.readFileSync(path.join(d, 'lib', 'evidence-core.cjs'), 'utf8');
    if (lib.includes(BAN_VA)) loi.push(`(1) lib o ${sha.slice(0, 8)} DA mang ban va — ca khong dung truoc vat`);
    const fx = fs.readFileSync(path.join(d, 'tests', 'scripts', 'gia-lan-fixture.mjs'), 'utf8');
    if (!fx.includes('e.yaml')) loi.push(`(2) fixture o ${sha.slice(0, 8)} chua nhan khoa e.yaml — ha tang ca nam o commit sau`);
    const r = chay(d);
    const out = String(r.stdout || '') + String(r.stderr || '');
    if (r.status !== 1) loi.push(`(3) ba chan o commit ca thoat ${r.status}, doi 1`);
    for (const g of GHIM_VAT) if (!out.includes(g)) loi.push(`(3) thieu ghim vat «${g}»`);
    if (out.includes(GHIM_HA_TANG)) loi.push(`(3) co ghim ha tang «${GHIM_HA_TANG}» — do vi ca chua chay duoc, khong vi vat`);
    const h = chay(banSao('HEAD'));
    if (h.status !== 0) loi.push(`(4) doi chung HEAD thoat ${h.status}: ${String(h.stderr || '').trim().split('\n').slice(-3).join(' | ')}`);
    if (loi.length) { for (const l of loi) console.error(`DO lich-su-do: ${l}`); ma = 1; }
    else console.log(`XANH lich-su-do — commit ca ${sha.slice(0, 8)} do vi vat (3 ghim), HEAD xanh`);
  }
} catch (e) {
  console.error(`MU lich-su-do: ${String(e.message).split('\n')[0]}`);
  ma = 3;
} finally {
  for (const d of tmps) { try { fs.rmSync(d, { recursive: true, force: true }); } catch {} }
}
process.exit(ma);
