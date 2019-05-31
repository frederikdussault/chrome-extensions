/**
 * fetchworker
 * Get a list of sites, fetch ads.txt of each
 */

var results = [];
var buster = Date.now();

/**
 * @param {Array of sites} e.data
 */
onmessage = function (e) {
  console.log("Message reçu: ", e);

  let sites = parseInt(e.data);

  // Process
  sites.forEach((site) => {
    console.log(site);

    fetchSite("http://" + site);
    fetchSite("https://" + site);
  });

  // sort results on site
  // TODO verify it executes only after all fetch replies have been processed.  
  results.sort(sortOnSite);

  // TODO verify it executes only after all fetch replies have been processed.  
  postMessage(results);
}

function addAResult(site, url, text) {
  results.push({ site, url, text });
}

// TODO revise code so it returns an array of results
function fetchSite(url) {
  let file = url + '/ads.txt';
  const myRequest = new Request(file + buster);
  var res = {};

  console.log(file);

  // get file content and add results to result table
  fetch(myRequest)
    .then(response => {
      console.table(response);
      res = response;
      const responseText = response.text()

      if (response.status === 200) {
        return responseText;
      } else if (
        (response.status >= 100 && response.status < 200) ||
        response.status > 200
      ) {
        return (responseText) ? responseText : 'ERROR: no data returned';
      } else {
        addAResult('', `ERROR: Response code: ${response.status}`);
        throw new Error('Something went wrong on api server!');
      }
    })
    .then(response => {
      addAResult(file, response.split('\n')[0]);
    })
    .catch((error) => {
      console.error(error);
      addAResult(file, `Message: Is it a valid URL?<br>ERROR: ${error.name}: <b>${error.message}</b>;<br>Response code: <b>${res.status}</b>`);
    });
}