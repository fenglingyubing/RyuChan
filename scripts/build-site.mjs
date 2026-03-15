import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";

const withCompression = process.argv.includes("--compress");
const env = {
  ...process.env,
  ENABLE_BUILD_COMPRESS: withCompression ? "true" : "false",
};

const steps = [
  "pnpm astro check",
  "pnpm astro build",
  "pnpm exec pagefind --site dist",
  "pnpm exec cpy dist/pagefind/** public/pagefind",
];

function runStep(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      env,
      shell: true,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command}`));
    });
  });
}

for (const step of steps) {
  if (step === steps[0]) {
    await rm("public/pagefind", { force: true, recursive: true });
  }

  await runStep(step);
}
