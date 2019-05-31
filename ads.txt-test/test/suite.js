/*! ads.txt-watch-tool - v1.3.10 - 2019-05-31 */

/* ====================================
 * Source: test/js/classes/utils.js
 * ==================================== */

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


/* ====================================
 * Source: test/js/classes/data.js
 * ==================================== */

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


/* ====================================
 * Source: test/js/classes/sitemetas.js
 * ==================================== */

/*global QUnit*/
QUnit.module.todo( "sitemeta.js", function( hooks ) {
    hooks.beforeEach( function() {
      ///this.robot = new Robot();
    } );

    let shortList = [
      'zzz.notgood.zzz',    // invalide URL, dite does not exist
      'www.educatall.com',  // site exists but does not have an ads.txt
      'www.kiss959.com',     // redirects to www.959chfm.com
      'www.tsisports.ca',   // site exists, file not okay,
      'www.1019rock.ca',    // site exists, file okay
      'www.1310news.com',
      'www.570news.com'
    ];

    QUnit.test("Test sitemeta.js", assert => {
      assert.ok(true, "this test is fine");
    });

} );


/* ====================================
 * Source: test/js/classes/ui.js
 * ==================================== */

/*global QUnit*/
QUnit.module.todo("ui.js", function (hooks) {
  hooks.beforeEach(function () {
    ///this.robot = new Robot();
  });

  QUnit.todo("Test popup.js", assert => {
    assert.ok(false, "this test is fine");
  });
});


/* ====================================
 * Source: test/js/classes/popup.js
 * ==================================== */

/*global QUnit*/
QUnit.module.todo("popup.js", function (hooks) {
  hooks.beforeEach(function () {
    ///this.robot = new Robot();
  });

  QUnit.todo("Test popup.js", assert => {
    assert.ok(false, "this test is fine");
  });
});