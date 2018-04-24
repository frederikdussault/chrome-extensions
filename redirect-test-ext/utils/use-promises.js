promises = [];

redirectList.forEach( function(element) {
    promises.push(
        // return a promise

        fetch(domain + element.reqUrl)
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
            
                console.log(response.url);
            }).catch ((error) => {
                console.log('Error: ', error);
            })

    );
});

Promise.all(promises).then(() => 
    console.table(redirectList)
);


