// Saves options to chrome.storage
function save_options() {
  var prefixes = document.getElementById('classPrefixes').value;

  chrome.storage.sync.set({
    classPrefixes: prefixes,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  let defaultOptions = {
    classPrefixes: '"page-id-", "postid-"'
  };

  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(defaultOptions, function(items) {
    document.getElementById('classPrefixes').value = items.classPrefixes;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-button').addEventListener('click', save_options);