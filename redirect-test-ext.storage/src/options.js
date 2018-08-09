/*  
TODO: find how to store data by tab url
TODO: find how to validate JSON string  
*/

// tab information is NOT accessible in option

const statusDelay = 750 + 750;

let testrules = document.getElementById('testrules');
let urlinput = document.getElementById('urlinput');
let statustext = document.getElementById('status');
let validatebtn = document.getElementById('validate');
let savebtn = document.getElementById('save');

// Validates test rules - must be well formated json
function validate_rules() {
  let valid = false;
  let rules = testrules.value;
 
  statustext.textContent = 'Validating ...  // Code to be added';
  setTimeout(function() {
    statustext.textContent = '';
  }, statusDelay);

  //TODO: validate JSON

  return valid;
}

// Saves options to chrome.storage
function save_options() {
  var rules = testrules.value;

  chrome.storage.sync.set({
    testRules: rules
  }, function() {
    // Update status to let user know options were saved.
    statustext.textContent = 'Options saved.';
    setTimeout(function() {
      statustext.textContent = '';
    }, statusDelay);
  });
}

// Restores textarea#testrules box state using the preferences
// stored in chrome.storage.
function restore_options() {
  let defaultOptions = {
    testRules: 'no rules set'
  };

  chrome.storage.sync.get(defaultOptions, function(items) {
    testrules.value = (chrome.runtime.lastError ? null : items.testRules);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('validate').addEventListener('click', validate_rules);
document.getElementById('save').addEventListener('click', save_options);