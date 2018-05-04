/* https://www.texture.ca/wp-admin/tools.php?page=redirection.php */

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {

  debugger;

  let queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {

    debugger;

    let tab = tabs[0];
    let url = tab.url;

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

  debugger;

  getCurrentTabUrl( (tab, url) => {  // this closure is the callback

    debugger;
    console.log('tab: '); console.log(tab);

    const nTestrules   = document.getElementById('testrules'),
          nUrlinput    = document.getElementById('urlinput'),
          nStatustext  = document.getElementById('status'),
          nValidatebtn = document.getElementById('validate'),
          nSavebtn     = document.getElementById('save');

          nGetdatabtn = document.getElementById('getdata');
          nClearStorebtn = document.getElementById('clearStore');
          nClearTabbtn = document.getElementById('clearTab');
    
    const storedDataDefault = {
      testRules: ''
    };
    let storedData = {};

    getStoredItems(url);

    nValidatebtn.addEventListener('click', () => validate_rules() );
    nSavebtn.addEventListener(    'click', () => storeData(url) );
    
    nGetdatabtn.addEventListener(   'click', () => getStoredItems(url) );
    nClearStorebtn.addEventListener('click', () => clearAllStore() );
    nClearTabbtn.addEventListener(  'click', () => clearURLStore(url) );

    /* Methods */

    function updateUI(data) {
      console.log( "updateUI - data: " );
      console.log( data );

      nUrlinput.value = url;

      nTestrules.value = data.testRules;
    }

    function message(text, opts) {
      const defaultOpts = {
        class: 'msg',
        delay: 2000
      };

      opts = {...defaultOpts, ...opts};

      setTimeout(function() {
        nStatustext.textContent = text;
        nStatustext.className = opts.class;
      }, opts.delay);  
    }

    // Validates test rules - must be well formated json
    function validate_rules() {

      debugger;
      console.log( "in validate_rules method" );

      let valid = false;
      let rules = nTestrules.value;

      let text = 'Validating ...  // Code to be added';

      console.log( "Message: " + text );
      message( text );

      //TODO: validate JSON

      return valid;
    }

    // Saves options to chrome.storage
    function storeData(url) {
      
      debugger;

      console.log( "in storeData method" );
      console.log( "pre storage set - storedData: " );
      console.log( storedData );

      storedData[url].testRules = nTestrules.value;
      console.log( "pre storage set - storedData[url].testRules: " );
      console.log( storedData[url].testRules );

      let  jsonData = JSON.stringify(storedData);
      console.log( "pre storage set - jsonData: " );
      console.log( jsonData );

      //FIXME: Uncaught Error: Invocation of form set(string, function) doesn't match definition set(object items, optional function callback)
      /// format should be URL_string: data_object

      chrome.storage.sync.set(storedData, function() {
          debugger;

          console.log( "Post storage set - storedData: " );
          console.log( storedData );
    
          console.log( storedData[url] );

          let opt = {}, 
              text = '';

          if (chrome.runtime.lastError) {
            text = 'Storage FAILED!';
            opt = {class: 'error', delay: 2000};
          } else {
            // Update status to let user know options were saved.
            text = 'Data saved.';
          }

          console.log( "Message: " + text );
          message(text, opt);
        });
    }

    // Restores textarea#testrules box state using the preferences
    // stored in chrome.storage.
    function getStoredItems(url) {

      debugger;
      console.trace( "in getStoredItems method" );

      console.log( "pre storage get - storedData: " );
      console.log( storedData );

      chrome.storage.sync.get(url, function(items) {
        debugger;


          /*
          Small issue with save item:
          Should not have created "https://www.texture.ca/wp-admin/tools.php?page=redirection.php":"asdf"

          https://www.texture.ca/wp-admin/tools.php?page=redirection.php :
            "{"testRules":"asdf","https://www.texture.ca/wp-admin/tools.php?page=redirection.php":"asdf"}"
          */

        
        let reply = (chrome.runtime.lastError ? {} : items);
        console.log( "post storage get - reply: " );
        console.log( reply );

        console.log( "post storage get - storedDataDefault: " );
        console.log( storedDataDefault );

        storedData[url] = { ...storedDataDefault, ...reply } ;
        console.log( "post storage get - storedData: " );
        console.log( storedData );

        console.log( "post storage get - storedData[url]: " );
        console.log( storedData[url] );

        updateUI( storedData[url] );

        let opt = {}, 
            text = ''

        if (chrome.runtime.lastError) {
          text = 'Data load FAILED!';
          opt = {class: 'error', delay: 2000};
        } else {
          // Update status to let user know options were saved.
          text = 'Data loaded.';
        }

        console.log( "Message: " + text );
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
