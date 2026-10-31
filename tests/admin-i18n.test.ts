import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createTranslator } from "next-intl";
import { languages } from "../i18n/locales";
import keys from "../messages/source-keys.json";

const require = createRequire(import.meta.url);

test("admin uses browser preferences without reading the storefront language cookie", async () => {
  for (const [header, expected] of [["es-MX,en;q=0.8", "es"], ["fr-CA", "fr"], ["ja", "en"], [null, "en"]]) {
    const module = { exports: {} as { getAdminI18n(): Promise<{locale: string}>; getAdminText(): Promise<(text: string) => string> } };
    const source = ts.transpileModule(readFileSync("i18n/admin.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    runInNewContext(source, { module, exports: module.exports, require(id: string) {
      if (id === "next/headers") return { headers: async () => new Headers(header ? {"accept-language": header} : {}), cookies() { throw new Error("Must not read storefront cookie"); } };
      if (id === "./locales") return require("../i18n/locales");
      return require(id);
    } });
    assert.equal((await module.exports.getAdminI18n()).locale, expected);
    const t = await module.exports.getAdminText();
    const messages = require(`../messages/${expected}.json`);
    assert.equal(t("Dashboard"), messages[keys.Dashboard]);
  }
});

test("all admin UI literals and status labels have translations", () => {
  const files = ["app/admin", "components/admin"].flatMap(root => readdirSync(root, {recursive: true}).filter(name => String(name).endsWith(".tsx")).map(name => `${root}/${name}`));
  for (const file of files) {
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function check(node: ts.Node) {
      if (ts.isCallExpression(node) && node.expression.getText(source) === "t" && ts.isStringLiteral(node.arguments[0])) {
        assert.ok(node.arguments[0].text in keys, `${file}: ${node.arguments[0].text}`);
      }
      if (ts.isPropertyAssignment(node) && node.name.getText(source) === "label" && ts.isStringLiteral(node.initializer)) {
        assert.ok(node.initializer.text in keys, `${file}: ${node.initializer.text}`);
      }
      ts.forEachChild(node, check);
    }
    check(source);
  }
});

test("admin count messages render zero, singular and plural in every language", () => {
  for (const {code} of languages) {
    const t = createTranslator({locale: code, messages: require(`../messages/${code}.json`), onError(error) { throw error; }});
    for (const count of [0, 1, 5]) {
      for (const source of ["Showing {count} products.", "Showing {count} inquiries.", "Customer requested {count} units."] as const) {
        assert.ok(t(keys[source], {count}).includes(String(count)));
      }
    }
  }
});
