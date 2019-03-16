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