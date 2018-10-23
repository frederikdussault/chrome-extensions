/*eslint no-unused-vars: 0*/
/*global sites siteMetas ui*/

// This extension inject a script in the current tab. Script from which we will fetch information from the DOM.
// The user can select from the testrules which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  /* Popup action functions */

    
  const currentVersion = 'v3.8';
   
  // sitemetas.js - keep stats of all sites
  // siteMetas.init();
  siteMetas.init(sites); //from data/sites.js
  ui.init({rowSelector:'#testresults tr'});

  const nTestbtn = document.querySelector('#btnGoTest'),
        nShowErrorsbtn = document.querySelector('#btnShowErrors'),
        nShowGoodbtn = document.querySelector('#btnShowGood'),
        nShowAllbtn = document.querySelector('#btnShowAll'),
        ntestresults = document.querySelector('#testresults'),  // TODO 
        nStatustext = document.querySelector('#statustext'),    // TODO 
        nVersiontext = document.querySelector('#versiontext');
  
  nVersiontext.value = currentVersion;

  nTestbtn.addEventListener('click', () => ui.test(siteMetas.processAll));
  nShowErrorsbtn.addEventListener('click', () => ui.hideRows('good'));
  nShowGoodbtn.addEventListener('click', () => ui.hideRows('error'));
  nShowAllbtn.addEventListener('click', () => ui.showAll());

  siteMetas.listall(console.log);
  siteMetas.processAll();

}); // end document.addEventListener
