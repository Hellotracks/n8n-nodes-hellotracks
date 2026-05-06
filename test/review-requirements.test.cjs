"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const rootDir = path.resolve(__dirname, "..");

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

test("package declares n8n-workflow as a peer dependency only", () => {
  const pkg = JSON.parse(readProjectFile("package.json"));

  assert.equal(pkg.peerDependencies?.["n8n-workflow"], "*");
  assert.equal(pkg.devDependencies?.["n8n-workflow"], undefined);
  assert.equal(pkg.dependencies, undefined);
});

test("node uses n8n authentication helper without manual API-Key injection", () => {
  const source = readProjectFile("nodes/Hellotracks/Hellotracks.node.ts");
  const build = readProjectFile("dist/nodes/Hellotracks/Hellotracks.node.js");

  for (const content of [source, build]) {
    assert.match(content, /httpRequestWithAuthentication/);
    assert.doesNotMatch(content, /['"]API-Key['"]/);
    assert.doesNotMatch(content, /getCredentials\(['"]hellotracksApi['"]\)/);
    assert.doesNotMatch(content, /helpers\.httpRequest\(/);
  }
});
