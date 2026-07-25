# Khoá model-invocation cho 5 thao tác cổng người; acceptance-card giữ mở

`approve`, `signoff`, `acceptance-init`, `acceptance-status`, `acceptance-report`
chỉ được con người gõ tên: Claude qua `disable-model-invocation: true`
(commands/), Codex qua `policy.allow_implicit_invocation: false`
(agents/openai.yaml) — biến ràng buộc prose "never approves on its own" thành
ràng buộc cứng của harness, nhất quán với triết lý không-tin-agent ở tầng
evidence. `acceptance-card` cố tình KHÔNG khoá: feature-loop (cả hai edition)
và approve/signoff model-invoke nó ở cả hai Gate — khoá là gãy loop. Test
P31/P32 giữ cả hai chiều của quyết định này.
