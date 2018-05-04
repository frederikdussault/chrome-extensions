{
    "DNR": {
        "label": 'URLs to not redirect', 
        "arr": 
        [
            {"reqUrl":'/en/', "expStatus":200, "expUrl":'/en/', "reqNotes":'MUST NOT REDIRECT', "fail":0},
            {"reqUrl":'/fr/', "expStatus":200, "expUrl":'/fr/', "reqNotes":'MUST NOT REDIRECT', "fail":0},
            {"reqUrl":'/en/magazines/ebony/', "expStatus":200, "expUrl":'/en/magazines/ebony/', "reqNotes":'MUST NOT REDIRECT', "fail":0}
        ]
    },
    "taxtest": {
        "label": 'Taxonomy tests', 
        "arr": 
        [
            {"reqUrl":'/en/canadian-favourites-magazines/', "expStatus":200, "expUrl":'/en/canadian-favourites-magazines/', "reqNotes":'Could this redirect?', "fail":0},
            {"reqUrl":'/en/magazines/ebony/', "expStatus":200, "expUrl":'/en/magazines/ebony/', "reqNotes":'MUST NOT REDIRECT', "fail":0},
        ]
   },
    'failling': {
        "label": 'URLs still failling', 
        "arr": 
        [
            {"reqUrl":'/specialoffer', "expStatus":200, "expUrl":'https://secure.texture.ca/signin?cid=pricelinedis_0316&utm_medium=dig&utm_source=texture&utm_campaign=2016_3&utm_content=pricelinedis&utm_term=pricelinedis_0316&offer_type=price_line_discount', "reqNotes":'XCROSS SITE', "fail":0},
            {"reqUrl":'/maybonus', "expStatus":200, "expUrl":'/en/', "reqNotes":'', "fail":0},
        ]
    }
};


