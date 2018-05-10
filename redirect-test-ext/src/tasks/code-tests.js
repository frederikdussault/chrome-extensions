let data = {
    "DNR": {
        "label": "URLs to not redirect", 
        "arr": 
        [
            {"reqUrl":"/en/", "expStatus":200, "expUrl":"/en/", "reqNotes":"MUST NOT REDIRECT", "fail":0},
            {"reqUrl":"/fr/", "expStatus":200, "expUrl":"/fr/", "reqNotes":"MUST NOT REDIRECT", "fail":0},
            {"reqUrl":"/en/magazines/ebony/", "expStatus":200, "expUrl":"/en/magazines/ebony/", "reqNotes":"MUST NOT REDIRECT", "fail":0}
        ]
    },
    "taxtest": {
        "label": "Taxonomy tests", 
        "arr": 
        [
            {"reqUrl":"/en/canadian-favourites-magazines/", "expStatus":200, "expUrl":"/en/canadian-favourites-magazines/", "reqNotes":"Could this redirect?", "fail":0},
            {"reqUrl":"/en/magazines/ebony/", "expStatus":200, "expUrl":"/en/magazines/ebony/", "reqNotes":"MUST NOT REDIRECT", "fail":0}
        ]
   },
    "failling": {
        "label": "URLs still failling", 
        "arr": 
        [
            {"reqUrl":"/specialoffer", "expStatus":200, "expUrl":"https://secure.texture.ca/signin?cid=pricelinedis_0316&utm_medium=dig&utm_source=texture&utm_campaign=2016_3&utm_content=pricelinedis&utm_term=pricelinedis_0316&offer_type=price_line_discount", "reqNotes":"XCROSS SITE", "fail":0},
            {"reqUrl":"/maybonus", "expStatus":200, "expUrl":"/en/", "reqNotes":"", "fail":0}
        ]
    }
};


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

console.assert( !JSON.parse( data ), "Not a valid JSON"  );
console.assert( !JSON.isValid( data ), "Not a valid JSON"  );
console.assert( JSON.isValidStringified( data ), "Valid JSON once stringified"  );

console.assert( !JSON.parse( "" ), "Empty string a valid JSON" );
console.assert( !JSON.isValid( "" ), "Empty string NOT a valid JSON" );

console.assert( !JSON.parse( 0 ), "Empty string a valid JSON" );
console.assert( JSON.isValid( 0 ), "Empty string pass as valid JSON" );

console.assert( JSON.isValid( "{}" ), "Empty object pass as valid JSON" );
console.assert( JSON.isValid( "[]" ), "Empty Array pass as valid JSON" );

console.assert( JSON.isValid( "{'allo':'monde'}" ), "not valid" );
console.assert( JSON.isValid( `{"allo":"monde"}` ), "valid" );

console.assert( JSON.isValid( `['allo', 'monde']` ), "not valid JSON" );
console.assert( JSON.isValid( `["allo", "monde"]` ), "valid JSON" );
