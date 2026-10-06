// ma-tran.mjs — danh sách viết trước của bộ răng hồ sơ gia-lan-ghim-lai: mỗi AC gồm các ca bền phải
// PASS trên cây hiện hành (chiều xanh) và các phép phá phải làm đúng ca FAIL với thông điệp ghim
// (chiều đỏ). `doi` = các cặp [tìm, thay] áp vào bản sao — mỗi «tìm» phải khớp ĐÚNG MỘT lần.
const LANE = 'feature-loop/scripts/repin-lane.mjs';
const LIB = (f) => `feature-loop/scripts/lib/${f}`;
const T = (f) => `tests/scripts/${f}`;

export const MA_TRAN = {
  1: {
    tep: T('repin-lane-chay-lai.test.mjs'),
    ca: ['AC1-bang-chan-tri', 'AC1-rut-ten-ca', 'AC1-suite-chap-chon', 'AC1-eval-chap-chon', 'AC1-do-hai-lan',
      'AC1-model-khong-lai', 'AC1-khoa-vang', 'AC1-sau-song-song', 'AC1-khoa-sai', 'AC1-gioi-han-da-khai'],
    pha: [
      { ten: 'lan-hai-do-van-dat', tep: LANE, doi: [['rec.lan.push(l2); rec.exit = l2.exit;', 'rec.lan.push(l2); rec.exit = 0;']], ca: 'AC1-do-hai-lan', ghim: 'lần hai đỏ vẫn tính đạt' },
      { ten: 'chay-lai-eval-model', tep: LIB('chay-lai.mjs'), doi: [['if (laModel) return { chay: false', 'if (false) return { chay: false']], ca: 'AC1-model-khong-lai', ghim: 'chạy lại eval model thật' },
      { ten: 'chap-chon-im', tep: LANE, doi: [['chapChon.push(rec.chap_chon);', 'void 0;']], ca: 'AC1-suite-chap-chon', ghim: 'chập chờn im' },
      { ten: 'chay-lai-duoi-tai', tep: LANE, doi: [['const xong = new Map(await Promise.all(moi.map(async c => [c, await cho(batDau(c, env))])));',
        'const xong = new Map(await Promise.all(moi.map(async c => { const r1 = await cho(batDau(c, env)); return [c, r1.exit !== 0 ? await cho(batDau(c, env)) : r1]; })));']], ca: 'AC1-sau-song-song', ghim: 'chạy lại dưới tải' },
    ],
  },
  2: {
    tep: T('repin-lane-tran.test.mjs'),
    ca: ['AC2-lib-giet-cay', 'AC2-lib-bay-term', 'AC2-lib-in-nhieu', 'AC2-B1', 'AC2-B2', 'AC2-B3', 'AC2-B3-tach-nhom', 'AC2-B4', 'AC2-B5', 'AC2-B6', 'AC2-B7'],
    pha: [
      { ten: 'chi-giet-pid-bash', tep: LIB('chay-lenh.mjs'), doi: [['const cay = await thuCay(p.pid);', 'const cay = [p.pid];'],
        ["try { process.kill(-p.pid, 'SIGTERM'); } catch { /* nhóm đã tan */ }", ''], ["try { process.kill(-p.pid, 'SIGKILL'); } catch { /* */ }", '']], ca: 'AC2-B1', ghim: 'cháu tiến trình sót' },
      { ten: 'khong-sigkill', tep: LIB('chay-lenh.mjs'), doi: [["guiCa(pids.filter(song), 'SIGKILL');", 'void 0;'], ["try { process.kill(-p.pid, 'SIGKILL'); } catch { /* */ }", '']], ca: 'AC2-B2', ghim: 'không SIGKILL' },
      { ten: 'chi-giet-theo-nhom', tep: LIB('chay-lenh.mjs'), doi: [['const cay = await thuCay(p.pid);', 'const cay = [p.pid];']], ca: 'AC2-B3-tach-nhom', ghim: 'làn lồng sót cháu' },
      { ten: 'trung-ma-lan-do', tep: LANE, doi: [['da_chay_phut: Math.round((Date.now() - tKhoiDong) / 600) / 100 }, 4);', 'da_chay_phut: Math.round((Date.now() - tKhoiDong) / 600) / 100 }, 1);']], ca: 'AC2-B1', ghim: 'trùng mã làn đỏ' },
      { ten: 'pin-khi-vuot-tran', tep: LANE, doi: [["  process.stderr.write(tk.dong + '\\n');\n  process.exit(ma);",
        "  if (kieu === 'vuot-tran') for (const s of perSlug) fs.appendFileSync(path.join(s.ws, 'run-log.jsonl'), JSON.stringify({ kind: 'repin', run_id: runId, sha }) + '\\n');\n  process.stderr.write(tk.dong + '\\n');\n  process.exit(ma);"]], ca: 'AC2-B1', ghim: 'pin trên làn chưa xong' },
    ],
  },
  3: {
    tep: T('repin-lane-tran.test.mjs'),
    ca: ['AC3-TERM', 'AC3-INT', 'AC3-HUP', 'AC3-khong-write-sach'],
    pha: [
      { ten: 'bo-bat-tin-hieu', tep: LANE, doi: [["process.on(sig, () => { ketThucSom('bi-ngat', { tin_hieu: sig }, 128 + so); });", 'void sig, void so;']], ca: 'AC3-TERM', ghim: 'ngắt không để vết' },
    ],
  },
  4: {
    tep: T('repin-lane-tran.test.mjs'),
    ca: ['AC4-xanh', 'AC4-do', 'AC4-vuot-tran', 'AC4-bi-ngat', 'AC4-chi-phi-loi'],
    pha: [
      { ten: 'dem-model-theo-eval', tep: LANE, doi: [['const demModel = () => [...results.values()].filter(r => r.model).reduce((n, r) => n + r.lan.length, 0);',
        'const demModel = () => perSlug.reduce((n, s) => n + s.evals.filter(e => khoa.model_evals.has(`${s.slug}/${e.id}`)).length, 0);']], ca: 'AC4-xanh', ghim: 'đếm model sai' },
      { ten: 'tong-ket-vang-lan-do', tep: LANE, doi: [["  process.stderr.write(tk.dong + '\\n');\n  process.exit(1);", '  process.exit(1);']], ca: 'AC4-do', ghim: 'tổng kết vắng ở làn đỏ' },
    ],
  },
  5: {
    tep: T('repin-lane-env-ci.test.mjs'),
    ca: ['AC5-do-o-ci', 'AC5-eval-rieng', 'AC5-xanh-ghi-env', 'AC5-chay-lai-cung-env', 'AC5-ten-sai', 'AC5-khoa-vang', 'AC5-bien-vang-env'],
    pha: [
      { ten: 'xoa-bien-thay-vi-rong', tep: LANE, doi: [["  ? Object.assign({}, process.env, Object.fromEntries(khoa.repin_ci_blank_env.map(k => [k, ''])))",
        '  ? Object.fromEntries(Object.entries(process.env).filter(([n]) => !khoa.repin_ci_blank_env.includes(n)))']], ca: 'AC5-do-o-ci', ghim: 'xoá biến thay vì rỗng' },
      { ten: 'env-ci-tran-sang-eval', tep: LANE, doi: [['    model: khoa.model_evals.has(`${s.slug}/${e.id}`),', '    model: khoa.model_evals.has(`${s.slug}/${e.id}`),\n    env: envCi || process.env,']], ca: 'AC5-eval-rieng', ghim: 'env CI tràn sang eval' },
      { ten: 'gop-lenh-khac-env', tep: LANE, doi: [['const khoaLenh = (cmd, envTag) => `${envTag}\\0${cmd}`;', 'const khoaLenh = (cmd, envTag) => cmd;']], ca: 'AC5-eval-rieng', ghim: 'gộp lệnh khác env' },
    ],
  },
  6: {
    tep: T('repin-lane-khuon-gia.test.mjs'),
    ca: ['AC6-khuon-writer', 'AC6-skill-ma-4', 'AC6-guide-du-khoa', 'AC6-lan-khoa-rut'],
    pha: [
      { ten: 'khoa-ngoai-khuon', tep: LANE, doi: [['{ tong_ket: tk.obj }));', '{ tong_ket: tk.obj, la_khoa_la: 1 }));']], ca: 'AC6-khuon-writer', ghim: 'khoá ngoài khuôn' },
      { ten: 'khoa-chua-khai-o-guide', tep: 'GUIDE.md', doi: [['| `repin_cost_cmd` |', '| `repin_cost_cmd_bo` |']], ca: 'AC6-guide-du-khoa', ghim: 'khoá chưa khai ở GUIDE' },
    ],
  },
  // AC-7: phép vi phân (vi-phan.mjs) — phép phá áp vào bản SAU, ghim là bằng chứng vi phân nó để lại.
  7: {
    pha: [
      { ten: 'doi-mac-dinh: repin_retry', tep: LIB('lan-khoa.mjs'), doi: [['let retry = 0;', 'let retry = 1;'], ['retry = Number(String(r).trim()); }', 'retry = 1; }']], ghim: '(chạy lại)' },
      { ten: 'doi-mac-dinh: repin_budget_min', tep: LIB('lan-khoa.mjs'), doi: [['let budget = null;', 'let budget = 0.0001;']], ghim: 'mã thoát' },
      { ten: 'doi-mac-dinh: repin_ci_blank_env', tep: LIB('lan-khoa.mjs'), doi: [["const blank = ds('feature_loop.repin_ci_blank_env');", "const blank = ds('feature_loop.repin_ci_blank_env').concat(['PATH']);"]], ghim: 'biến rỗng: PATH' },
      { ten: 'them-ngoai-danh-sach', tep: LANE, doi: [['{ tong_ket: tk.obj }));', '{ tong_ket: tk.obj, them_la: 1 }));']], ghim: 'them_la' },
    ],
    // Khoá mà bật mặc định chỉ đổi tổng kết — phần đã gỡ khỏi phép so (sổ quyết định, fix S3).
    khong_thay_duoc: ['feature_loop.model_evals', 'feature_loop.repin_cost_cmd'],
  },
  // AC-8: bảng số đo (so-do.mjs) — phép phá tắt MỘT điểm, hàng ấy phải không đổi số.
  8: {
    pha: [
      { ten: 'tat-D4', tep: LIB('lan-khoa.mjs'), doi: [['retry = Number(String(r).trim()); }', 'retry = 0; }']], ghim: 'Đ4 không đổi số' },
      { ten: 'tat-D5', tep: LANE, doi: [["process.on(sig, () => { ketThucSom('bi-ngat', { tin_hieu: sig }, 128 + so); });", 'void sig, void so;']], ghim: 'Đ5 không đổi số' },
      { ten: 'tat-D3', tep: LANE, doi: [['const envCi = khoa.repin_ci_blank_env.length', 'const envCi = false && khoa.repin_ci_blank_env.length']], ghim: 'Đ3 không đổi số' },
    ],
  },
};
