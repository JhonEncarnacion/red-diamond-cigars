import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createTranslator } from "next-intl";
import { languages, resolveLocale } from "../i18n/locales";
import { localizeProduct } from "../lib/product-localization";
import { productSchema } from "../lib/validators";

test("browser language detection respects regional variants, quality, fallback and saved choice", () => {
  assert.equal(resolveLocale(undefined, "es-MX, en;q=0.8"), "es");
  assert.equal(resolveLocale(undefined, "en;q=0.3,fr-CA;q=0.9"), "fr");
  assert.equal(resolveLocale(undefined, "ja, de-DE;q=0.7"), "de");
  assert.equal(resolveLocale("en", "es,fr"), "en");
  assert.equal(resolveLocale("invalid", "pt-BR"), "pt");
  assert.equal(resolveLocale(undefined, "fr;q=0,en;q=0.5"), "en");
  assert.equal(resolveLocale(undefined, "es;q=bad,fr;q=0.7"), "fr");
  assert.equal(resolveLocale(undefined, "zh-Hans-CN"), "zh");
  assert.equal(resolveLocale(undefined, "zh-TW, en;q=0.8"), "en");
  assert.equal(resolveLocale(undefined, "ar"), "en");
  assert.equal(resolveLocale(undefined, null), "en");
});

test("every language has a complete catalog with valid, matching interpolation", () => {
  const en = JSON.parse(readFileSync("messages/en.json", "utf8")) as Record<string,string>;
  for (const {code} of languages) {
    const messages = JSON.parse(readFileSync(`messages/${code}.json`, "utf8")) as Record<string,string>;
    assert.deepEqual(Object.keys(messages).sort(), Object.keys(en).sort());
    const translate = createTranslator({locale:code, messages, onError(error) { throw error; }});
    for (const [key, value] of Object.entries(messages)) {
      assert.ok(value.trim(), `${code}: ${key}`);
      const variables = (s:string) => [...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
      assert.deepEqual(variables(value), variables(en[key]), `${code}: ${key}`);
      assert.ok(translate(key, {count:5,name:"Test cigar"}));
    }
  }
});

test("product translations override only populated text fields and preserve shared product data", () => {
  const product = {description:"Original description",strength:"Mild",wrapper:"Corojo",binder:null,filler:null,origin:"Dominican Republic",name:"Cigar",singleValue:10,translations:{es:{description:"Descripción",strength:"",name:"Wrong",singleValue:100}}};
  const result = localizeProduct(product,"es");
  assert.equal(result.description,"Descripción");
  assert.equal(result.strength,"Mild");
  assert.equal(result.name,"Cigar");
  assert.equal(result.singleValue,10);
  assert.equal(product.description,"Original description");
  assert.equal(localizeProduct(product,"fr").description,"Original description");
});

test("admin translations accept partial languages and reject unsupported locales or oversized values", () => {
  const base = {name:"Cigar",slug:"cigar",description:"Original description",strength:"Mild",isActive:true};
  assert.equal(productSchema.safeParse({...base,translations:{es:{description:"Descripción"},fr:{wrapper:""}}}).success,true);
  assert.equal(productSchema.safeParse({...base,translations:{bad:{description:"test"}}}).success,false);
  assert.equal(productSchema.safeParse({...base,translations:{es:{description:"x".repeat(1001)}}}).success,false);
});
