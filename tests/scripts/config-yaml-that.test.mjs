// config-yaml-that.test.mjs — `_acceptance/config.yaml` phải là YAML THẬT, không chỉ
// «parser tối giản của kit đọc được».
//
// Vì sao có tệp này: lượt chấm 1 của hồ sơ `khoi-tim-loi-tra-phi-theo-vat` bắt được
// một hồi quy mà MỌI eval của vòng vẫn xanh — sáu khoá executor mới để giá trị TRẦN
// trong khi giá trị chứa `": "`, tổ hợp bị cấm trong plain scalar. Bộ đọc của kit
// (`lib/evidence-core.cjs` → `resolveConfigKey`) là parser tối giản cắt theo `key:` đầu
// dòng nên vẫn trả đúng chuỗi lệnh; còn mọi trình đọc YAML chuẩn — trình soạn thảo, CI
// của kho tiêu thụ, script ngoài — đều ngã ở dòng đó. Đúng hình dạng «thước gắn vào bộ
// đọc riêng của tác giả thay vì vào vật được giao».
//
// Luật ở đây đo VẬT ĐƯỢC GIAO (tệp cấu hình), bằng một bộ đọc ĐỘC LẬP với kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };

// Bộ đọc độc lập: PyYAML. Vắng nó thì ca này KHÔNG được âm thầm xanh — nó phải nói ra.
const coPyYaml = spawnSync('python3', ['-c', 'import yaml'], { encoding: 'utf8' }).status === 0;
if (!coPyYaml) {
  bad('thieu bo doc YAML doc lap (python3 + PyYAML) — ca nay KHONG duoc coi la xanh',
    'cai PyYAML hoac cam mot bo doc khac; im lang o day la mat dung lop loi ca nay di bat');
  console.log(`\nResults: ${pass} passed, ${fail} failed (config-yaml-that)`);
  process.exit(1);
}

const docYaml = (p) => spawnSync('python3', ['-c',
  'import sys,yaml;yaml.safe_load(open(sys.argv[1]));print("OK")', p], { encoding: 'utf8' });

// ── CY1: tệp cấu hình của CHÍNH kho này parse được bằng bộ đọc YAML chuẩn ──
{
  const p = path.join(ROOT, '_acceptance', 'config.yaml');
  const r = docYaml(p);
  if (r.status === 0) ok('CY1 _acceptance/config.yaml la YAML hop le voi bo doc chuan');
  else bad('CY1 _acceptance/config.yaml KHONG phai YAML hop le',
    String(r.stderr || '').split('\n').filter(Boolean).slice(-2).join(' | '));
}

// ── CY2: hai bộ đọc phải nói CÙNG một chuyện về từng khoá executor ──
// Parser tối giản của kit và bộ đọc chuẩn có thể trôi khỏi nhau; ca này buộc mọi giá trị
// `executors.*` giải ra GIỐNG NHAU ở cả hai đường.
{
  const p = path.join(ROOT, '_acceptance', 'config.yaml');
  const txt = readFileSync(p, 'utf8');
  const core = (await import(path.join(ROOT, 'lib', 'evidence-core.cjs'))).default
    || (await import(path.join(ROOT, 'lib', 'evidence-core.cjs')));
  const chuan = JSON.parse(spawnSync('python3', ['-c', `
import sys, json, yaml
d = yaml.safe_load(open(sys.argv[1]))
out = {}
for nhom, muc in (d.get('executors') or {}).items():
    if isinstance(muc, dict):
        for k, v in muc.items():
            if isinstance(v, str): out['executors.%s.%s' % (nhom, k)] = v
print(json.dumps(out))`, p], { encoding: 'utf8' }).stdout);

  const lech = [];
  for (const [khoa, giaTri] of Object.entries(chuan)) {
    const cuaKit = core.resolveConfigKey(txt, khoa);
    if (cuaKit !== giaTri) lech.push(`${khoa}: kit«${String(cuaKit).slice(0, 40)}» ≠ chuan«${String(giaTri).slice(0, 40)}»`);
  }
  const n = Object.keys(chuan).length;
  if (!n) bad('CY2 khong doc duoc khoa executors nao bang bo doc chuan', 'ca nay se xanh tren tap rong');
  else if (!lech.length) ok(`CY2 ${n} khoa executors: bo doc cua kit va bo doc chuan noi CUNG mot chuyen`);
  else bad(`CY2 ${lech.length}/${n} khoa LECH giua hai bo doc`, lech.slice(0, 3).join(' · '));
}

// ── CY3 (chiều đỏ): bản TIÊM đúng hình dạng đã gặp phải ĐỎ ──
// Giá trị trần chứa `": "` — chính lỗi mà lượt chấm 1 bắt. Không có ca này thì CY1 không
// phân biệt được «tệp lành» với «bộ đọc chưa bao giờ chạy».
{
  const d = mkdtempSync(path.join(tmpdir(), 'cfg-yaml-'));
  const lanh = path.join(d, 'lanh.yaml'), tiem = path.join(d, 'tiem.yaml');
  const than = 'schema_version: 1\nexecutors:\n  script:\n    a: "echo x"\n';
  writeFileSync(lanh, than);
  writeFileSync(tiem, than + `    b: bash -c 'grep -q "PASS: X"'\n`);
  const rLanh = docYaml(lanh), rTiem = docYaml(tiem);
  if (rLanh.status === 0 && rTiem.status !== 0)
    ok('CY3 doi chung hai chieu: ban lanh XANH, ban tiem (gia tri tran chua dau hai cham + khoang trang) DO');
  else bad('CY3 phep do khong phan biet duoc ban lanh voi ban tiem',
    `lanh exit=${rLanh.status} · tiem exit=${rTiem.status}`);
}

console.log(`\nResults: ${pass} passed, ${fail} failed (config-yaml-that)`);
process.exit(fail ? 1 : 0);
