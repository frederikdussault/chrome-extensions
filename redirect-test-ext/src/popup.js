// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {

  let queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {

    let tab = tabs[0];
    let url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(tab); // callback will use tab information such as url for storage
  });
}



// This extension inject a script in the current tab. Script from which we will fetch information from the DOM. 
// The user can select from the dropdown which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  /**
   * @description format a code as js litteral notation: `${name}: ${code.toString()}`
   * @param {string} name function name
   * @param {string} code function code
   * @returns {string} formated code
   */
  function formatCode ( name, code, sep = ',\n\n' ) {
    return `${name}: ${code.toString()}${sep}`
  }
  
  
  /**
   * @description build html select field options based on data object
   * @param {string} elementID
   * @param {string} value
   * @param {string} label
   */
  function appendToDropdown ( elemID, value, label ) {
    // create an option: <option value="${value}">${label}</option>
    // add option to elemID
    let optionEl = document.createElement('option');
        optionEl.setAttribute('value', value);
        optionEl.innerHTML = label;
    elemID.appendChild(optionEl);
  }

  /* ------------------------ */
  const data = JSON.stringify(redirectList);

  let tasks = [
    {
      'name': 'allTasks',
      'label': 'All the options',
      'code': function() {
        //TODO: Add calls to all tasks defined

        setTimeout(function() { alert("All the options clicked!"); }, 1);
      }
    },
    {
      'name': 'execRedirectionTest',
      'label': 'Test the redirections',
      'code': function() {
        let compareAssert = (a, b) => {
          if (a.assert < b.assert) return -1;
          if (a.assert > b.assert) return  1;
      
          return 0;            
        };

        let compareStatus = (a, b) => {
          if (a.resStatus < b.resStatus) return -1;
          if (a.resStatus > b.resStatus) return  1;

          return 0;            
        };

        let compareRequested = (a, b) => {
          if (a.reqUrl < b.reqUrl) return -1;
          if (a.reqUrl > b.reqUrl) return  1;
      
          return 0;
        };

        let compareStatusThenRequested = (a, b) => {
          let res = compareStatus(a, b);

          // status is equal, compare the next level: Requested url
          if ( res === 0 )  {
            return compareRequested(a, b);
          }
      
          return res;
        };

        let compareAssert_Status_Requested = (a, b) => {
          let res = compareStatus(a, b);

          // status is equal, compare the next level: Requested url
          if ( res === 0 )  {
            return compareRequested(a, b);
          }
      
          // status is equal, compare the next level: Requested url
          if ( res === 0 )  {
            return compareAssert(a, b);
          }
      
          return res;
        };

        let compareRequestedThenStatus = (a, b) => {
          let res = compareRequested(a, b);

          // status is equal, compare the next level: Requested url
          if ( res === 0 )  {
            return compareStatus(a, b);
          }
      
          return res;
        };

        console.log(`Number of record to process: ${redirectList.length}.`);
        
        let promises = [];

        redirectList.forEach( function(element) {
            promises.push(
                // return a promise
        
                fetch(domain + element.reqUrl)
                    .then((response) => {
                        let resUrl = (new URL(response.url)).pathname;
        
                        let assert = false;
                        if (404 == element.expStatus && element.expStatus == response.status) {
                            assert = true;
                        }
                        else if (element.expStatus == response.status && element.expUrl == resUrl) {
                            assert = true;
                        }
                    
                        element.resUrl = resUrl;
                        element.resStatus = response.status;
                        element.assert = (assert) ? 'OK' : 'FAIL';
                    
                        //console.log(response.url);
                    }).catch ((error) => {
                        console.log('Error: ', error);
                    })
        
            );
        });
        
        Promise.all(promises).then(() => {
          redirectList.sort(compareStatusThenRequested);
          console.table(redirectList, ['assert','reqUrl','expUrl','expStatus','resUrl','resStatus','reqNotes'])
        });
      }
    },
    {
      'name': 'expandRedirectRules',
      'label': 'Expand all rules',
      'code': function() {
        const n_redirectEditLinks = n_list.querySelectorAll('a.red-ajax');

        n_redirectEditLinks.forEach( a => a.click() );
      }
    },
    {
      'name': 'displayRedirectionRulesNames',
      'label': 'Get and list redirection rules names',
      'code': function() {
        developAllRulesOnRedirectionAdminPage( gatherData, displayNames );
      },
    },
    {
      'name': 'displayRedirectionRulesAsTabulatedCSV',
      'label': 'Get and list redirection rules as csv',
      'code': function() {
        developAllRulesOnRedirectionAdminPage( gatherData, displayDataAsTabulatedCSV );
      },
    },
    {
      'name': 'displayRedirectionRulesAsJson',
      'label': 'Get redirection rules as json',
      'code': function() {
        //TODO: Add code
        setTimeout(function() { alert("displayRedirectionRulesAsJson clicked!"); }, 1);
      },
    }
  ]; // end data

  let dropdown = document.getElementById('dropdown');
  tasks.forEach( ({name, label, code}) => appendToDropdown ( dropdown, name, label ) );

  let scriptString = '';
  tasks.forEach( ({name, label, code}) => scriptString += formatCode ( name, code ) );

  const script = `
  /* RDM Webproducer's Redirection Test tool */
  
  let rdm = (function() {
    return {
      ${scriptString}
    }; // end return
    
  })(); // end rdm


  /** ===========================================================

   * util functions 
  
     ===========================================================*/
  
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

          console.log("gathering rule information... will take " + totaldelay / 1000 + " seconds");
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
  let developAllRulesOnRedirectionAdminPage = ( cbGetData, cbDisplayData ) => {
      // click all redirection edit link present on the page
      const nbLinks = n_redirectEditLinks.length;
      const timedelay =  50;
      const totaldelay = nbLinks * timedelay;

      blockedStatus = true;

      console.log("Clicking on Redirection Edit links. There is " + nbLinks + " links to click. It will take " + (totaldelay / 1000) + " seconds");
      
      window.setTimeout(function() {
          blockedStatus = false;
          alert("Redirection Edit information are opened.");

          // process and display the data if callbacks are provided
          if ( typeof(cbDisplayData) === "function" && typeof(cbGetData) === "function") {
              cbDisplayData( cbGetData() );
          }
      }, totaldelay);
      
      n_redirectEditLinks.forEach( a => a.click() );
  }; //developAllRulesOnRedirectionAdminPage
  `;

  getCurrentTabUrl( (tab) => {  // this closure is the callback
  
    dropdown.addEventListener('change', function() {

      chrome.tabs.executeScript({ // this execute selected code on tab
        code: `{ 

          const n_list = document.querySelector('#the-list');

          let blockedStatus = false;
          let domain = window.location.origin;
          let redirectList = ${data}; 

          //console.log("Number of records loaded " + redirectList.length);

          ${script}

          rdm.${ this.value }();
        }`
      });

    }); // end addEventListener('change')
    
  }); // end callback
}); // end addEventListener
