/** 
 * List Wordpress Tools redirections 
*/

/**
 * gatherData
 * @returns <Array of object> data
 */
let gatherData = () => {

    if ( blockedStatus ) {
        setTimeout(function() { alert("A long process is opening the redirection information fields. Please patient a bit."); }, 1);
        console.log("A long process is opening the redirection information fields. Please patient a bit.");
        return [];
    }

    let data = [],
        n_redirectNodes = n_list.querySelectorAll('table.edit'),
        nbRules = n_redirectNodes.length;

    if ( nbRules <= 0 ) {
        console.error("No redirection found.  Data gathering stopped.");
    } else {

        const timedelay =  5;
        let totaldelay = nbRules * timedelay;
        
        totaldelay = (totaldelay < 1000) ? 1000 : totaldelay;  // too fast and table.edit links are not generated yet.

        console.log(`gathering rule information... will take ${totaldelay / 1000} seconds`);
        window.setTimeout(function() { 
            console.log("Rule information gathering is completed."); 
        }, totaldelay);

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
    }

    return data;
}


/**
 * displayDatatable
 * @param <Array of object> arrayOfRules
 * @returns none
 */
let displayDatatableAsJson = ( arrayOfRules ) => {
    
    // print data array in console, formated as a table
    //console.table( arrayOfRules );

    // print data array in console, formated as a JSON
    console.log( "rules, formated as a JSON:\n" + JSON.stringify(arrayOfRules) );
};

/**
 * displayDatatable
 * @param <Array of object> arrayOfRules
 * @returns none
 */
let displayDataAsTabulatedCSV = ( arrayOfRules ) => {
    
    let sep = "\t";
    const lineArray = arrayOfRules.map( item => {
        return `"${item.rule}"${sep}"${item.isRegex == true ? 'Y' : 'N'}"${sep}"${item.target}"`;
    });
    
    var csvContent = lineArray.join("\n");

    // print data array in console, formated as a tabulated csv
    console.log( "rules, formated as a tabulated csv:\n" + csvContent );
};


/**
 * developAllRulesOnRedirectionAdminPage
 * @returns none
 */
let developAllRulesOnRedirectionAdminPage = ( cbGetData, cbDisplayData ) => {
    // click all redirection edit link present on the page
    const nbLinks = n_redirectEditLinks.length;

    const timedelay =  50;
    let   totaldelay = nbLinks * timedelay;

    totaldelay = (totaldelay < 1000) ? 1000 : totaldelay;  // too fast and table.edit links are not generated yet.
    blockedStatus = true;

    console.log(`Clicking on Redirection Edit links. There is ${nbLinks} links to click. It will take ${totaldelay / 1000} seconds`);
    window.setTimeout(function() {
        blockedStatus = false;
        console.log("Redirection Edit information are opened.");

        // process and display the data if callbacks are provided
        if ( typeof(cbDisplayData) === "function" && typeof(cbGetData) === "function") {
            cbDisplayData( cbGetData() );
        }
    }, totaldelay);
    
    n_redirectEditLinks.forEach( a => a.click() );
};


//const $ = jQuery;
const n_list = document.querySelector('#the-list');
const n_redirectEditLinks = n_list.querySelectorAll('a.red-ajax');
let blockedStatus = false;

if ( n_redirectEditLinks.length > 0 ) {
    developAllRulesOnRedirectionAdminPage( gatherData, displayDataAsTabulatedCSV );
} else {
    if ( !blockedStatus ) {
        displayDataAsTabulatedCSV( gatherData() );
    } else {
        setTimeout(function() { alert("A long process is opening the redirection information fields. Please patient a bit."); }, 1);
    }
}
