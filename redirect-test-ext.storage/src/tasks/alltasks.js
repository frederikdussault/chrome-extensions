/**
 * Extension's tasks
 */

/*
    -------------------------------------
    util functions 
    -------------------------------------
*/
// let blockedStatus = true;

/**
 * gatherData
 * @returns <Array of object> data
 */
let gatherData = (n_redirectNodes) => {

/*     if ( blockedStatus ) {
        console.log("A long process is opening the redirection information fields. Please patient a bit.");
        return [];
    } */

    let data = [],
        nbRules = n_redirectNodes.length;

    if ( nbRules <= 0 ) {
        console.error("No redirection found.  Data gathering stopped.");
    } else {

        const timedelay =  5;
        let totaldelay = nbRules * timedelay;

        totaldelay = (totaldelay < 1000) ? 1000 : totaldelay;  // too fast and table.edit links are not generated yet.

        console.log("gathering rule information... will take " + totaldelay / 1000 + " seconds");

        n_redirectNodes.forEach( (n_rule) => {
            //let n_rule = this;

            if ( n_rule.length <= 0 ) {
                console.log("No rules found.  Data gathering stopped.");
                return;
            }

            // check if input[name="old"], input[name="regex"] and input[name="target"] are present
            if ( 
                n_rule.querySelector('input[name="old"]').length <= 0 ||
                n_rule.querySelector('input[name="regex"]').length <= 0 ||
                n_rule.querySelector('input[name="target"]').length <= 0
            ) {
                console.log("No information found.  Data gathering stopped.");
                return;
            }

            let item = {};
                item.rule    = n_rule.querySelector('input[name="old"]').value;
                item.isRegex = n_rule.querySelector('input[name="regex"]').checked;
                item.target  = n_rule.querySelector('input[name="target"]').value;

            data.push(item);
        });
        
        console.log("Rule information gathering is completed."); 
    }

    return data;
};

/**
 * displayNames
 * @param <Array of object> arrayOfRules
 * @returns none
 */
let displayAsTable = ( arrayOfRules ) => {

    console.log("Number of records loaded " + arrayOfRules.length );
    console.table( arrayOfRules );

};

/**
 * displayNames
 * @param <Array of object> arrayOfRules
 * @returns none
 */
let displayNames = ( arrayOfRules ) => {

    console.log("Number of records loaded " + arrayOfRules.length );

    arrayOfRules.forEach( (r) =>  
        console.log( r.rule )
    );

};

/**
 * displayDatatableAsJson
 * @param <Array of object> arrayOfRules
 * @returns none
 */
let displayDatatableAsJson = ( arrayOfRules ) => {

    console.log("Number of records loaded " + arrayOfRules.length );
    
    // print data array in console, formated as a table
    //console.table( arrayOfRules );

    // print data array in console, formated as a JSON
    console.log( JSON.stringify(arrayOfRules) );
};

/**
* displayDataAsTabulatedCSV
* @param <Array of object> arrayOfRules
* @returns none
*/
let displayDataAsTabulatedCSV = ( arrayOfRules ) => {
    
    console.log("Number of records loaded " + arrayOfRules.length );

    const lineArray = arrayOfRules.map( item => {
        return '"' + 
                item.rule + "\t" + 
                (item.isRegex == true ? 'Y' : 'N') + "\t" + 
                item.target + '"';
    });
    
    var csvContent = lineArray.join( "\\n" );

    // print data array in console, formated as a JSON
    console.log( csvContent );
};


/**
 * developAllRulesOnRedirectionAdminPage
 * @returns none
 */
let developAllRulesOnRedirectionAdminPage = ( nodeList ) => {
    // click all redirection edit link present on the page
    if (nodeList.length < 1) return;

    const nbLinks = nodeList.length;
    const timedelay =  75;
    const totaldelay = nbLinks * timedelay;

    debugger;

    if (totaldelay >= 3000)
        console.log("Clicking on Redirection Edit links. There is " + nbLinks + " links to click. It will take " + (totaldelay / 1000) + " seconds");

    nodeList.forEach( a => a.click() );

    console.log("Redirection Edit information are opened.");
}; //developAllRulesOnRedirectionAdminPage


/*
    -------------------------------------
    Tasks functions
    -------------------------------------
*/

let expandRedirectRules =  function() {
    const n_list = document.querySelector('#the-list');
    const n_redirectEditLinks = n_list.querySelectorAll('a.red-ajax');
    
    developAllRulesOnRedirectionAdminPage( n_redirectEditLinks );
};


let displayRedirectionRulesNames = function() {
    const n_list = document.querySelector('#the-list'),
          n_redirectNodes = n_list.querySelectorAll('table.edit');

    let data = gatherData(n_redirectNodes);

    displayNames( data );
};


let displayRedirectionRulesAsTabulatedCSV = function() {
    const n_list = document.querySelector('#the-list'),
          n_redirectNodes = n_list.querySelectorAll('table.edit');

    let data = gatherData(n_redirectNodes);

    displayDataAsTabulatedCSV( data );
};


let displayRedirectionRulesAsJson = function() {
    const n_list = document.querySelector('#the-list'),
          n_redirectNodes = n_list.querySelectorAll('table.edit');

    let data = gatherData(n_redirectNodes);

    displayDatatableAsJson( data );
};
