import assert from "node:assert/strict";
import { test } from "node:test";
import { hasAdminAccess } from "../lib/admin-access";

const identity = (emailAddress: string, status = "verified") => ({
  primaryEmailAddressId: "primary",
  emailAddresses: [{ id: "primary", emailAddress, verification: { status } }],
});

test("preserves owner access and accepts multiple explicitly approved admins", () => {
  assert.equal(hasAdminAccess(identity("owner@example.com"), "owner@example.com", "dad@example.com,mom@example.com"), true);
  assert.equal(hasAdminAccess(identity("dad@example.com"), "owner@example.com", "dad@example.com,mom@example.com"), true);
  assert.equal(hasAdminAccess(identity("mom@example.com"), undefined, "dad@example.com,mom@example.com"), true);
  assert.equal(hasAdminAccess(identity(" DAD@example.com "), undefined, " , dad@example.com, "), true);
});

test("denies missing users, configuration, unverified emails, and nonexact matches", () => {
  assert.equal(hasAdminAccess(null, "owner@example.com"), false);
  assert.equal(hasAdminAccess(identity("owner@example.com")), false);
  assert.equal(hasAdminAccess(identity(""), "", " , "), false);
  assert.equal(hasAdminAccess(identity("dad@example.com", "unverified"), undefined, "dad@example.com"), false);
  assert.equal(hasAdminAccess(identity("dad@example.com.attacker.test"), undefined, "dad@example.com"), false);
  assert.equal(hasAdminAccess(identity("other@example.com"), undefined, "dad@example.com"), false);
  assert.equal(hasAdminAccess(identity("dad+other@example.com"), undefined, "dad@example.com"), false);
});

test("does not authorize an approved secondary address or a missing primary address", () => {
  const user = identity("other@example.com");
  user.emailAddresses.push({ id: "secondary", emailAddress: "dad@example.com", verification: { status: "verified" } });
  assert.equal(hasAdminAccess(user, undefined, "dad@example.com"), false);
  assert.equal(hasAdminAccess({ ...user, primaryEmailAddressId: "missing" }, undefined, "dad@example.com"), false);
});
