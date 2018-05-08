/* https://www.texture.ca/wp-admin/tools.php?page=redirection.php */

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {

  ////debugger;

  let queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {

    ////debugger;

    let tab = tabs[0];
    // let url = tab.url; 
    let url = new URL(tab.url).origin; //RETURN THE DOMAIN ONLY

    console.assert(typeof url == 'string', 'tab.url should be a string');

    console.log('tab: '); console.log(tab);
    console.log('url: ' + url);

    callback(tab, url); // callback will use tab information such as url for storage
  });
}


// This extension inject a script in the current tab. Script from which we will fetch information from the DOM.
// The user can select from the testrules which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  //////debugger;

  /* Popup action functions */

  const nTestrules        = document.getElementById('testrules'),
        nUrlinput         = document.getElementById('urlinput'),
        nStatustext       = document.getElementById('status'),
        nTableOfRulesBody = document.getElementById('TableOfRulesBody'),
        nGetfulldata      = document.getElementById('getfulldata'),
        nValidatebtn      = document.getElementById('validate'),
        nSavebtn          = document.getElementById('save'),
        nGetdatabtn       = document.getElementById('getdata'),
        nClearStorebtn    = document.getElementById('clearStore'),
        nClearTabbtn      = document.getElementById('clearTab');

  let tabURL = "";

  nValidatebtn.addEventListener( 'click', () => validate_rules() );

  // Validates test rules - must be well formated json
  function validate_rules() {

    ////debugger;
    console.log( "in validate_rules method" );
    message( "Validating ..." );

    let valid = JSON.isValid( nTestrules.value );

    if (!valid) { message( "Your rule definitions is not a valid JSON object", {class:"error", delay: 2000} ) }
    else {
      message("Good job, your rules are valid JSON!");
    };

    return valid;
  }

  function getUIData() {
    return { 'testRules': nTestrules.value };
  }

  function updateUI(data, url) {
    console.log( "updateUI - data: " );
    console.log( data );

    nUrlinput.value = url;
    nTestrules.value = data.testRules;
  }

  /**
   * @param {chrome storage entries} storedData
   */

  function updateTableOfRules(storedData) {
    console.trace();
    console.table(storedData);

    for (let item in storedData)     {
      if( storedData.hasOwnProperty( item ) ) {

        let row = document.createElement('tr');
        row.setAttribute("class", "storedData");

        let dataType = typeof(storedData[item]);
        let value = "";

        if ( "object" == typeof(storedData[item]) ) {
          console.table(storedData[item]);
          if ( !!storedData[item]["testRules"] ) 
            value = storedData[item]["testRules"].toString();
        } else {
          console.log(storedData[item]);
          value = storedData[item];
        }

        row.innerHTML = 
          `<td class="key">${item}</td><td class="value">${value}</td>`;

        nTableOfRulesBody.innerHTML = "";
        nTableOfRulesBody.appendChild(row);

      }
    }
  }

  function message(text, opts) {
    const defaultOpts = {
      class: 'msg',
      delay: 700
    };

    opts = {...defaultOpts, ...opts};

    console.log(text);
    setTimeout(function() {
      nStatustext.textContent = text;
      nStatustext.className = opts.class;
    }, opts.delay);  
  }

  JSON.isValid = (jsonObj) => {
      //debugger;
      try {
          JSON.parse( jsonObj );
          
          console.log( "jsonObj parsed correctly" );
          return true;
      } catch (error) {
          console.log( "jsonObj not parsed correctly - not a valid JSON format" );
          return false;
      }
  }
  
  JSON.isValidStringified = (jsonObj) => {
      try {
          let stringified = JSON.stringify( jsonObj );
  
          JSON.parse( stringified );
          
          console.log( "stringified parsed correctly" );
          return true;
      } catch (error) {
          console.log( "stringified not parsed correctly - not a valid JSON format" );
  
          console.log("Sorry, can't process")
          return false;
      }
  }
  
  /* Tab action functions */

  getCurrentTabUrl( (tab, url) => {  // this closure is the callback

    //debugger;
    console.log('tab: '); console.log(tab);

    let storedData = {};
    tabURL = url;

    nSavebtn.addEventListener      ( 'click', () => storeData(tabURL) );
    nGetdatabtn.addEventListener   ( 'click', () => getStoredItems(tabURL) );
    nClearStorebtn.addEventListener( 'click', () => clearAllStore() );
    nClearTabbtn.addEventListener  ( 'click', () => clearURLStore(tabURL) );

    nGetfulldata.addEventListener  ( 'click', () => getAllStoredItems() );
    
    nGetdatabtn.click();

    /* Methods */

    // Saves options to chrome.storage
    function storeData(url) {
      
      //debugger;

      // get data from form
      storedData = getUIData();

      // save data

      console.log( "in storeData method" );
      console.log( "pre storage set - storedData: " );
      console.log( storedData );

      var items = {}; // need an object container
      items[url] = storedData;
    
      chrome.storage.sync.set(items, function() {
          let opt = {}, 
              text = '';

          if (chrome.runtime.lastError) {
            text = 'Storage FAILED!';
            opt = {class: 'error', delay: 2000};
          } else {
            // Update status to let user know options were saved.
            text = 'Data saved.';
          }

          message(text, opt);
        });
    }

    // Restores textarea#testrules box state using the preferences
    // stored in chrome.storage.
    function getStoredItems(url) {

      ////debugger;
      console.trace( "in getStoredItems method" );

      console.log( "pre storage get - storedData: " );
      console.log( storedData );

      chrome.storage.sync.get([url], function(items) {
        ////debugger;

        const storedDataDefault = { 'testRules': '' };

        if ( chrome.runtime.lastError || !items  ) {
          // errored out
          // nothing saved yet - undefined
          items = {};
        } 
        
        // let storedData = {};
        if ( items[url] ) {
          // retrieve the stored data
          storedData = items[url];
        } else {
          // save empty values - {}
          storedData = storedDataDefault;
        }

        console.log( "post storage get - url: " );
        console.log( url );

        console.log( "post storage get - items: " );
        console.log( items );

        console.log( "post storage get - items[url]: " );
        console.log( items[url] );

        console.log( "post storage get - storedData: " );
        console.log( storedData );

        updateUI( storedData, url );

        let opt = {}, 
            text = ''

        if (chrome.runtime.lastError) {
          text = 'Data load FAILED!';
          opt = {class: 'error', delay: 2000};
        } else {
          // Update status to let user know options were saved.
          text = 'Data loaded.';
        }

        message(text, opt);
      });
    }

    function getAllStoredItems() {
      ////debugger;
      chrome.storage.sync.get(null, function(items) {
        ////debugger;

        if ( chrome.runtime.lastError || !items  ) {
          // errored out
          // nothing saved yet - undefined
          items = {};
        } 
        
        console.log( "post storage get - items: " );
        console.log( items );

        updateTableOfRules(items)

        let opt = {}, 
            text = ''

        if (chrome.runtime.lastError) {
          text = 'Full data load FAILED!';
          opt = {class: 'error', delay: 2000};
        } else {
          // Update status to let user know options were saved.
          text = 'Data loaded.';
        }

        message(text, opt);
      });
    }

    function clearAllStore() {
      chrome.storage.sync.clear(function() {
          var error = chrome.runtime.lastError;
          if (error) {
              console.error(error);
          }
      });
    }

    function clearURLStore(url) {
      chrome.storage.sync.remove([url], function() {
          var error = chrome.runtime.lastError;
          if (error) {
              console.error(error);
          }
      });
    }

  }); // end getCurrentTabUrl callback

  
}); // end document.addEventListener
