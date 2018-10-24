/*global QUnit, jQuery*/
QUnit.module("utils.js", function (hooks) {
    hooks.beforeEach(function () {
        ///this.robot = new Robot();
    });

    // Use jQuery for test purpose

    QUnit.test("jQuery dependance", assert => {
        assert.ok(jQuery, "jQuery is there");
    });

    QUnit.test("jQuery test get",  (assert) => {
        function fileExists(url, done, expected) {
             var success = false;

            jQuery.get(url)
            .done(function() {
                success = true;
            })
            .always(function() {
                debugger;
                assert.equal( success, expected, "test resumed from async operation 1" );
                done();
            });
        };

        assert.expect( 1 );
        fileExists("tests.html", assert.async(), true);
        //fileExists("tests.html-asdf", assert.async(), false);
    });
/* 
 */
});