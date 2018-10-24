/*global QUnit*/
QUnit.module("data/sites.js", function () {
  QUnit.test("sites are defined", assert => {
    assert.ok(sites, "sites variable exists");
    assert.ok(Array.isArray(sites), "sites variable is an Array");
    assert.ok(sites.length, "at least one site is defined. Count of " + sites.length);
    assert.ok(
      sites.every((s) => typeof s == "string"),
      "all entries are strings"
    )
  });
});