// Ca đo số sống của SK1 (hồ sơ suc-khoe-cho-trong-va-toc-do, E9): chạy đúng các lệnh bộ phát lịch chạy trên máy macOS
// thật. Tệp cố ý KHÔNG mang đuôi .test.mjs: bước CI của gói (DP1-03) gom «tests/dieu-phoi/**/*.test.mjs» và đòi 0 ca bỏ
// qua, mà máy CI không phải macOS. Khoá executors.test.dieu_phoi_suc_khoe gọi thẳng tệp này.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { GOI, nap } from './suc-khoe-chung.mjs';

test('SK-09 so-do-song', { skip: process.platform !== 'darwin' ? 'SK-09 cần macOS' : false }, async () => {
  const sk = await nap(GOI, 'suc-khoe.mjs');
  const chay = (c, a) => execFileSync(c, a, { encoding: 'utf8', maxBuffer: 64 << 20 });
  const vm = sk.docVmStat(chay('vm_stat', []));
  const so = {
    swap: sk.docSwap(chay('sysctl', ['vm.swapusage'])),
    apLuc: sk.docApLuc(chay('sysctl', ['-n', 'kern.memorystatus_vm_pressure_level'])),
    load: sk.docLoad(chay('sysctl', ['-n', 'vm.loadavg'])),
    rssLonNhat: sk.docRssLonNhat(chay('ps', ['-axo', 'rss=,comm='])),
    mucTrong: sk.docMucTrong(chay('sysctl', ['-n', 'kern.memorystatus_level'])),
    ramGb: sk.docRamGb(chay('sysctl', ['-n', 'hw.memsize'])),
  };
  const mau = JSON.parse(fs.readFileSync(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json'), 'utf8'));
  const kq = sk.danhGiaSucKhoe(so, mau);
  console.log(`  SK-09 số đo sống · áp lực ${so.apLuc} · khả dụng ${so.mucTrong} % · RAM ${so.ramGb} GB · swap ${kq.ghi.swap} · trống ${kq.choTrongGb?.toFixed(1)} GB · trang page ${vm.coTrang}`);
  for (const k of ['apLuc', 'mucTrong', 'ramGb']) assert.ok(Number.isFinite(so[k]), `${k} đọc được trên máy thật`);
  if (so.apLuc === 1) assert.equal(kq.giamTai, false);
  else assert.equal(kq.giamTai, so.apLuc >= mau.suc_khoe.ap_luc_muc);
});
