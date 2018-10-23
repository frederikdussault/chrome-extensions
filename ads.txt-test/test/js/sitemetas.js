/*global QUnit*/
QUnit.module.todo( "sitemeta.js", function( hooks ) {
    hooks.beforeEach( function() {
      ///this.robot = new Robot();
    } );

    let sites = [
      'zzz.notgood.zzz', 
      'www.educatall.com', 
      'www.1019rock.ca', 
      'www.1053rock.ca'
    ];

    QUnit.test("Test sitemeta.js", assert => {
      assert.ok(true, "this test is fine");
    });

} );