import conurrently from "concurrently";

conurrently([
  {
    command: "bun run dev",
    cwd: "packages/server",
    name: "server",
    prefixColor: "cyan",
  },
  {
    command: "bun run dev",
    cwd: "packages/client",
    name: "client",
    prefixColor: "green",
  },
]);
