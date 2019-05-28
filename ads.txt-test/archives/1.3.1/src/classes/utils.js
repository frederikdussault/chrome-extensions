JSON.isValid = (jsonObj) => {
    try {
        JSON.parse( jsonObj );
        
        console.log( "jsonObj parsed correctly" );
        return true;
    } catch (error) {
        console.log( "jsonObj not parsed correctly - not a valid JSON format" );
        return false;
    }
};

JSON.isValidStringified = (jsonObj) => {
    try {
        let stringified = JSON.stringify( jsonObj );

        JSON.parse( stringified );
        
        console.log( "stringified parsed correctly" );
        return true;
    } catch (error) {
        console.log( "stringified not parsed correctly - not a valid JSON format" );

        console.log("Sorry, can't process");
        return false;
    }
};
