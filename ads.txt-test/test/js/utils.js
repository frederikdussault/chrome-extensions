/*global QUnit, jQuery*/
QUnit.module("utils.js", function (hooks) {
    hooks.beforeEach(function () {
        ///this.robot = new Robot();
    });

    QUnit.test("jQuery dependance", assert => {
        assert.ok(jQuery, "jQuery is there");
    });

    QUnit.test("jQuery test get",  async (assert) => {
        async function fileExists(url) {
            jQuery.get(url, null)
            .done(function() {
                alert( "second success" );
                return true;
            })
            .fail(function() {
                alert( "error" );
                return false;
            })
        };

        assert.ok(
            await fileExists("tests.html"),
            "file exists");
    });
/* 
 */
});