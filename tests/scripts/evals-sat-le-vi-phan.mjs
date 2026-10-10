#!/usr/bin/env node
// evals-sat-le-vi-phan.mjs — hồ sơ evals-sat-le-doc-du AC-3 (vế bảy kho, eval E4).
//
// So bộ đọc danh sách của base (3200ba3a) với bộ đọc mới trên mọi `_acceptance/*/evals.yaml` của
// kit (cây đang kiểm) và sáu kho tiêu thụ trên máy này ($HOME/dev/<kho>). Thiếu kho nào → thoát 2
// «không đọc được ở đây» — không bao giờ xanh trên bộ hồ sơ hụt. Ghi trọn đầu ra vào --ghi.
//
//   node tests/scripts/evals-sat-le-vi-phan.mjs --bay-kho [--ghi <tệp>]
//
// exit 0 = 0 lệch ngoài hồ sơ sát lề, mọi lệch ở sát lề theo chiều ĐỌC THÊM (hoặc BỎ RÁC kèm cờ có tên —
// bí danh YAML, AC-5), tổng ≥ 620 hồ sơ, và
// hồ sơ crm thuoc-mot-cho-khai-quet-man có mặt trong danh sách đọc thêm · 1 = vi phạm · 2 = thiếu kho / dùng sai.
import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import * as L from './evals-sat-le-lib.mjs';
import { createRequire } from 'node:module';
const core = createRequire(import.meta.url)(path.join(L.KIT, 'lib', 'evidence-core.cjs'));

const KHO_TIEU_THU = ['crm', 'oneflow', 'artifact-platform', 'radar', 'media-library', 'map'];
const TONG_TOI_THIEU = 620;
const HO_SO_PHAI_DOC_THEM = { kho: 'crm', hoSo: 'thuoc-mot-cho-khai-quet-man' };

const a = process.argv.slice(2);
if (!a.includes('--bay-kho')) { console.error('evals-sat-le-vi-phan: dùng --bay-kho [--ghi <tệp>]'); process.exit(2); }
const iGhi = a.indexOf('--ghi');
const ghi = iGhi >= 0 ? a[iGhi + 1] : null;
if (iGhi >= 0 && !ghi) { console.error('evals-sat-le-vi-phan: --ghi thiếu đường dẫn'); process.exit(2); }

const dong = [];
const noi = s => { dong.push(s); console.log(s); };
const ket = (rc, s) => {
  if (s) (rc ? console.error : console.log)(s), dong.push(s);
  if (ghi) { mkdirSync(path.dirname(path.resolve(ghi)), { recursive: true }); writeFileSync(ghi, dong.join('\n') + '\n'); }
  process.exit(rc);
};

const khos = [L.KIT, ...KHO_TIEU_THU.map(k => path.join(homedir(), 'dev', k))];
for (const k of khos) if (!existsSync(path.join(k, '_acceptance'))) ket(2, `không đọc được ở đây: ${k}`);

let base;
try { base = L.dungBase(); } catch (e) { ket(2, `bản base: ${e.message}`); }
const kq = L.viPhan({ khos, cu: L.docBase(base), moi: L.docLib(L.KIT) });
noi(`base ${L.BASE} · bộ đọc mới: ${L.KIT}`);
for (const t of kq.theoKho) {
  let sha = '?', nhanh = '?';
  try { sha = execFileSync('git', ['-C', t.kho, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); nhanh = execFileSync('git', ['-C', t.kho, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim(); } catch (_) {}
  noi(`${path.basename(t.kho)} sha=${sha} nhanh=${nhanh} ho_so=${t.hoSo} tieu_chi=${t.tieuChi}`);
}
noi(`tong ho_so=${kq.hoSo} tieu_chi=${kq.tieuChi}`);
for (const l of kq.lech) noi(`lech ${l.kho}/${l.hoSo} ${l.id}.${l.key} sat_le=${l.satLe} chieu=${l.chieu} cu=${l.cu} moi=${l.moi}`);
noi(`co ${kq.lech.filter(l => l.chieu === 'bo-rac').map(l => l.kho + '/' + l.hoSo + ' ' + l.id + '.' + l.key).join(', ') || '(khong)'}`);

const vp = [];
if (kq.hoSo < TONG_TOI_THIEU) vp.push(`tổng hồ sơ ${kq.hoSo} < ${TONG_TOI_THIEU}`);
for (const l of kq.lech) {
  if (!l.satLe) vp.push(`lệch ngoài sát lề: ${l.kho}/${l.hoSo} ${l.id}.${l.key}`);
  else if (l.chieu === 'bo-rac') {
    // Bỏ rác chỉ hợp lệ khi bộ đọc mới NÓI RA chỗ ấy bằng cờ có tên (AC-5) — không thì là mất im lặng.
    const co = core.danhSachKhongDoc(l.text).some(c => c.startsWith(`${l.id}.${l.key.replace('@lib', '')} `));
    if (!co) vp.push(`bỏ rác mà không có cờ: ${l.kho}/${l.hoSo} ${l.id}.${l.key}`);
  } else if (l.chieu !== 'doc-them') vp.push(`lệch sai chiều: ${l.kho}/${l.hoSo} ${l.id}.${l.key}`);
}
if (!kq.lech.some(l => l.kho === HO_SO_PHAI_DOC_THEM.kho && l.hoSo === HO_SO_PHAI_DOC_THEM.hoSo && l.chieu === 'doc-them'))
  vp.push(`${HO_SO_PHAI_DOC_THEM.kho}/${HO_SO_PHAI_DOC_THEM.hoSo} không có trong danh sách đọc thêm`);
if (vp.length) ket(1, `VI PHẠM: ${vp.join(' · ')}`);
ket(0, `XANH: ${kq.hoSo} hồ sơ / ${kq.tieuChi} tiêu chí — 0 lệch ngoài sát lề; ở hồ sơ sát lề: ${kq.lech.filter(l => l.chieu === 'doc-them').length} trường đọc thêm, ${kq.lech.filter(l => l.chieu === 'bo-rac').length} trường bỏ rác có cờ`);
