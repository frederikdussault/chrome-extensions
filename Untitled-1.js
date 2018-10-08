async function f(path) {
  let res = {};
  try {
    let response1 = await fetch('https://'+path);
    let response2 = await fetch('https://'+path);

    if (response1.ok) res.hs = await response1.text();
 	if (response2.ok) res.h = await response2.text();

	return res;

  } catch(err) {
    alert(err); // TypeError: failed to fetch
  }
}

res = f('www.macleans.ca/ads.txt');



let results = await Promise.all([
  fetch('https://www.macleans.ca/ads.txt'),
  fetch('https://www.macleans.ca/')
]);


Promise.all([
  fetch('https://www.macleans.ca/ads.txt'),
  fetch('https://www.macleans.ca/')
]).then( (responses) => {
    let texts = [];

    responses.forEach( response => { 
        response.text().then( text => {
          texts.push( text.split('\n')[0] );
          return 0;
      });
  });

  return texts;
}).then( (values) => {
    var wrapper = document.querySelector('#leaderboard_container');

    values.forEach( value => { 
        console.log( value );

        var newtext = document.createTextNode(value);
        var newP = document.createElement("p"); 
        newP.appendChild(newtext);
        wrapper.appendChild(newP);
    });
});
