/* global siteMetas:false ui:false */

// This extension inject a script in the current tab. Script from which we will fetch information from the DOM.
// The user can select from the testrules which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  /* Popup action functions */

  JSON.isValid = (jsonObj) => {
      debugger;
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
  
  const currentVersion = 'v3.8';
   
  // sitemetas.js - keep stats of all sites
  siteMetas.init();
  ui.init({rowSelector:'#testresults tr'});

  const nTestbtn = document.querySelector('#btnGoTest'),
        nShowErrorsbtn = document.querySelector('#btnShowErrors'),
        nShowGoodbtn = document.querySelector('#btnShowGood'),
        nShowAllbtn = document.querySelector('#btnShowAll'),
        ntestresults = document.querySelector('#testresults'),
        nStatustext = document.querySelector('#statustext'),
        nVersiontext = document.querySelector('#versiontext');
  
  nVersiontext.value = currentVersion;

  nTestbtn.addEventListener('click', () => ui.test(siteMetas.processAll));
  nShowErrorsbtn.addEventListener('click', () => ui.hideRows('good'));
  nShowGoodbtn.addEventListener('click', () => ui.hideRows('error'));
  nShowAllbtn.addEventListener('click', () => ui.showAll());


}); // end document.addEventListener
