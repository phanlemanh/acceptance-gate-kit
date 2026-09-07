'use strict';
// Shim đường đọc-cũ: nguồn thật là ./eval-yaml.cjs (đổi đuôi 2026-09-07 để
// vendor được vào repo tiêu thụ type:module theo INIT-CI-COPY-LIST). Bản
// feature-loop cũ vẫn resolve `lib/eval-yaml.js` — giữ tên này chỉ để trỏ,
// không chép nội dung (MỘT cây nguồn).
module.exports = require('./eval-yaml.cjs');
