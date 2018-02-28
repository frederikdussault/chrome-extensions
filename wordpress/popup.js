/* Wordpress Information Extension */
function wpInfo () {
    console.log('WP Info: loaded');

    // get body classes

    // FIXME: continue here
    
    // list them
    for ( let cls of nBody.className.split(' ') ) {
        appendClassInfo( cls );
        appendEditUrl( cls, ['^page-id-(.*)$', '^postid-(.*)$'] );
    }
}

function appendClassInfo ( className = '' ) {
    // TODO: Add code here
    console.log( "appendClassInfo: " + className );
}

function appendEditUrl ( className = '', expressions = [] ) {
    // TODO: Add code here
    console.log( "appendEditUrl: " + className );
    console.log( "expressions: " + expressions );

    // for each expressions, build and append an edit page url
    expressions.forEach(function (pattern) {
        let result = findLike ( className, pattern );
        if (result) {
            // TODO: Add code here
            // build and append an edit page url
        }
    });
}

/**
 * findLike
 * 
 * @description	Find values matching a pattern and returns the matching value. 
 * 
 * @param {string} baseString   String to search from
 * @param {string} pattern Regex string - eg: '^page-id-(.*)$'
 * @returns {string} The matching value
 */
function findLike ( baseString, pattern ) {

    if ( arguments.length < 2 ) return "";

    pattern = new RegExp( pattern );
    let result = "";
    
    if( pattern.test(baseString) ) {
        result = pattern.exec(baseString);  // returns an array or null
    }

    // At this point result might be an array or null - only one element needed
    return getASingleResultFromARegexMatch (result);
}

function getASingleResultFromARegexMatch (result) {
    if ( !result )  // result is null
            return "";

    if ( !result.length ) 
            return result;

    if ( result.length == 1 ) {
            return result[0];            
    }

    if ( result.length > 1 ) { // 
            return result[1];
    }
}


let nBody = document.getElementsByTagName('body')[0];
let nClassList = document.getElementById('classList');
let nEditPageURL = document.getElementById('editPageURL');
let nListInfoBtn = document.getElementById('listInfoBtn').addEventListener('click', wpInfo);


// FIXME: how could I target popup elements? document.getElementsByTagName() and document.getElementsById() work only with document - do not work with window not port.
// 

/**
 * 
 * see https://developer.chrome.com/extensions/devtools
 * See https://developer.chrome.com/extensions/content_scripts
 *  
 */