const fs = require("fs");
const path = require("path");

const agentFile = path.join(__dirname, "agent.js");

if (fs.existsSync(agentFile)) {
  const sources = fs.readFileSync(agentFile, { encoding: "utf-8" });
  const newSources = sources.replace(
    'Object.defineProperty(exports, "__esModule", { value: true });',
    ""
  );

  fs.writeFileSync(agentFile, newSources, { encoding: "utf-8" });

  console.info(`${agentFile} was sanitized`);
} else {
  console.error(`${agentFile} not found.`);
}
