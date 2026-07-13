import os from "node:os";
import { spawn } from "node:child_process";

const port = process.env.PORT ?? "3000";

function isIPv4(net) {
  return net.family === "IPv4" || net.family === 4;
}

function getLanIPv4Addresses() {
  const interfaces = os.networkInterfaces();
  const addresses = new Set();

  for (const entries of Object.values(interfaces)) {
    for (const net of entries ?? []) {
      if (!isIPv4(net) || net.internal) continue;
      addresses.add(net.address);
    }
  }

  return [...addresses];
}

function printMobileUrls(ips) {
  console.log("");
  console.log("Angle dev server");
  console.log(`  Local:   http://localhost:${port}`);
  console.log("  Mobile:  use one of these IPs (not 0.0.0.0):");

  if (ips.length === 0) {
    console.log("    (no LAN IPv4 found — check Wi-Fi / Ethernet)");
    console.log("    Windows: ipconfig | findstr IPv4");
    return;
  }

  for (const ip of ips) {
    console.log(`    http://${ip}:${port}`);
  }

  console.log("");
  console.log("Phone and PC must be on the same Wi-Fi.");
  console.log("");
}

const lanIps = getLanIPv4Addresses();
printMobileUrls(lanIps);

const child = spawn("npx", ["next", "dev", "--hostname", "0.0.0.0", "--port", port], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    DEV_ALLOWED_ORIGINS: lanIps.join(","),
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
