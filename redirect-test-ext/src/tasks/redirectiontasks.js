/**
 * Extension's tasks
 */

/**
 * @description Execute tests - redirectList previously injected
 * @param {Array} selectedTestblockKeys - Array of selected testblocks keys
 */
let execRedirectionTest = function( selectedTestblockKeys ) {

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

    let proceed = (testRecords) => {
        console.log(`Number of records to process: ${testRecords.length}.`);
        
        let promises = [];
        const hdrInit = { method: 'HEAD', mode: 'cors' };

        //FIXME: to avoid DoS blockage, split the total records in N-elements chunks

        testRecords.forEach( function(element) {
            promises.push(
                // return a promise
        
                fetch(element.reqUrl, hdrInit)
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
                    }).catch((error) => {
                        console.log('Error: ', error);
                    })
        
            );
        });
        
        Promise.all(promises).then(() => {
            testRecords.sort(compareStatusThenRequested);
            console.table(testRecords, ['assert','reqUrl','expUrl','expStatus','resUrl','resStatus','reqNotes']);
        });
    };  // end proceed

    // console.log('testblocks: ');  console.table(testblocks);

    if (null == selectedTestblockKeys) {
        selectedTestblockKeys = ['DNR'];
    }

    let redirectList = getSelectedData(testblocks, selectedTestblockKeys);
    //console.log('redirectList: '); console.table(redirectList);

    proceed(redirectList);
};


/*
 -------------------------------
    utils
 -------------------------------
*/

  /**
   * @description build the test script
   * @param {Collection of test blocks} testblocks
   * @param {Arrays} keys
   */  
  const getSelectedData = (testblocks, keys) => {

    let testRecords = [];

    keys.forEach( (key) => {
        console.log(key); // block of test records
        testRecords.push( ...testblocks[key].arr );

    });

    return testRecords;
  };