/*eslint no-unused-vars: 0*/
/*global sites siteMetas ui*/

// This extension inject a script in the current tab. Script from which we will fetch information from the DOM.
// The user can select from the testrules which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  /* Popup action functions */
  const extensionVersion = '1.3.1';
  document.querySelector("#extVersion").innerHTML = extensionVersion;

  const currentAdstxtVersion = 'v4.2';
   
  // sitemetas.js - keep stats of all sites
  // siteMetas.init();
  siteMetas.init(sites); //from data/sites.js
  ui.init(currentAdstxtVersion, {
    rowSelector:'#testresults tr', 
    testbtnSelector:'#btnGoTest',
    versiontextSelector:'#versiontext',
    testresultsSelector:'#testresults',
    statustextSelector:'#statustext',
    showErrorsbtnSelector:'#btnShowErrors',
    showErrorsbtnSelector:'#btnShowGood',
    showAllbtnSelector:'#btnShowAll',
  });

  siteMetas.fetchSite('http://www.1019rock.ca', console.log);
  siteMetas.fetchSite('https://www.1019rock.ca', console.log);

  //siteMetas.listall(console.log);
  siteMetas.processAll();

}); // end document.addEventListener
