/* https://www.texture.ca/wp-admin/tools.php?page=redirection.php */

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

    debugger;
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

  let nTestrules = document.getElementById('testrules');
  let nUrlinput = document.getElementById('urlinput');
  let nStatustext = document.getElementById('status');
  let nValidatebtn = document.getElementById('validate');
  let nSavebtn = document.getElementById('save');
  let storedData = {};

  // tab information is NOT accessible in option

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
    let valid = false;
    let rules = nTestrules.value;
  
    message( 'Validating ...  // Code to be added' );

    //TODO: validate JSON

    return valid;
  }

  // Saves options to chrome.storage
  function storeData(url) {
    
    
    storedData.testRules = nTestrules.value;
    let jsonData = JSON.stringify(storedData);

    /*
    FIXME: Uncaught Error: Invocation of form set(string, function) doesn't match definition set(object items, optional function callback)
/// format should be URL_string: data_object


    var key = "myKey",
        testPrefs = JSON.stringify({
            'val': 10
        });
    var jsonfile = {};
    jsonfile[key] = testPrefs;

    */


    chrome.storage.sync.set(jsonData, function() {
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
  function getStoredData(url) {

    chrome.storage.sync.get(url, function(items) {
      storedData = (chrome.runtime.lastError ? '' : items);
      nTestrules.value = storedData.testRules;

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


  /* --------------------------------------------------------------------- */

  getCurrentTabUrl( (tab, url) => {  // this closure is the callback

    document.addEventListener('DOMContentLoaded', (url) => getStoredData(url) );
    nValidatebtn.addEventListener('click', () => validate_rules() );
    nSavebtn.addEventListener('click', (url) => storeData(url) );

    debugger;
    console.log('tab: '); console.log(tab);
    
    nUrlinput.value = url;

  }); // end getCurrentTabUrl callback
}); // end document.addEventListener
