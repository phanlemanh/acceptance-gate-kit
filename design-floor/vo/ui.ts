// Vỏ `ui` của design-floor — do kit viết, KHÔNG vendored. Thay src/cli.ts của upstream (vỏ đó
// đăng ký mọi lệnh, kéo cả kho vào đóng kín): chỉ đăng ký năm lệnh v1 của hợp đồng nhập, và chép
// đúng luật điều phối của src/cli.ts @ a7ad5f1 — đổi vị trí đối số, kiểm cờ lạ theo chữ ký lệnh,
// lỗi bất ngờ thành mã 2. Không ghi sổ sự kiện: bản vá A gỡ đường đó khỏi module lệnh, và vỏ này
// không gắn lại nó.
import { argv, stderr, stdout } from "node:process";

import { parseArgs } from "../vendor/design-os/src/core/cli-args.js";
import { errJson } from "../vendor/design-os/src/core/output.js";
import type { CommandResult } from "../vendor/design-os/src/core/output.js";
import { signatureFor } from "../vendor/design-os/src/core/command-signatures.js";
import { findUnknownFlag, unknownFlagMessage } from "../vendor/design-os/src/core/flag-guard.js";
import { gateCommand } from "../vendor/design-os/src/commands/gate.js";
import { tokenCoverageCommand } from "../vendor/design-os/src/commands/token-coverage.js";
import { reusePlanCommand } from "../vendor/design-os/src/commands/reuse-plan.js";
import { flowCommand } from "../vendor/design-os/src/commands/flow.js";
import { autofixCommand } from "../vendor/design-os/src/commands/autofix.js";

const COMMANDS = Object.fromEntries(
  [gateCommand, tokenCoverageCommand, reusePlanCommand, flowCommand, autofixCommand].map((c) => [c.name, c]),
);

function dispatch(args: string[]): number | Promise<number> {
  const parsed = parseArgs(args);
  const cmd = parsed.command === undefined ? undefined : COMMANDS[parsed.command];
  if (cmd === undefined) {
    stderr.write(`ui: lệnh ngoài design-floor v1 — chỉ có: ${Object.keys(COMMANDS).join(", ")}\n`);
    return 4;
  }
  if (parsed.help) {
    stdout.write(cmd.help + "\n");
    return 0;
  }
  if (!cmd.hasSubcommands && parsed.subcommand !== undefined) {
    parsed.positionals.unshift(parsed.subcommand);
    parsed.subcommand = undefined;
  }
  const sig = signatureFor(parsed.command!, parsed.subcommand);
  if (sig !== null) {
    const unknown = findUnknownFlag(parsed.flags, sig.flags.map((f) => f.name));
    if (unknown !== null) {
      const msg = unknownFlagMessage(unknown);
      const label = parsed.subcommand !== undefined ? `${parsed.command} ${parsed.subcommand}` : parsed.command!;
      const res = parsed.json ? errJson(label, "UNKNOWN_FLAG", msg) : { exitCode: 1, stderr: `ui: ${msg}\n` };
      if (res.stdout !== undefined) stdout.write(res.stdout);
      if (res.stderr !== undefined) stderr.write(res.stderr);
      return res.exitCode;
    }
  }
  const emit = (res: CommandResult): number => {
    if (res.stdout !== undefined) stdout.write(res.stdout);
    if (res.stderr !== undefined) stderr.write(res.stderr);
    return res.exitCode;
  };
  const internalError = (e: unknown): number => {
    stderr.write(`ui: internal error: ${e instanceof Error ? e.message : String(e)}\n`);
    return 2;
  };
  let result: CommandResult | Promise<CommandResult>;
  try {
    result = cmd.run(parsed) as CommandResult | Promise<CommandResult>;
  } catch (e) {
    return internalError(e);
  }
  if (result instanceof Promise) return result.then(emit, internalError);
  return emit(result);
}

void Promise.resolve(dispatch(argv.slice(2))).then((code) => {
  process.exitCode = code;
});
