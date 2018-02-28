const script = `
function DevTools(opts = {}) {
	// Check to see if things are working right. Being that this is recursive it's a little redundant.
	// You can probably do better.
	window.testFunc = function() {
		if (!window.DevTools) {
			console.error("Dev Tools is not working properly. Check your installation.");
			return 1;
		}
		console.log("Dev Tools loaded correctly.");
	};

	// Sample Functions. You might want to modify these.
	window.checkClicks = function() {
		monitorEvents(document.body, "click");
	};

	window.stopCheck = function() {
		unmonitorEvents(document.body);
	}

	window.wpInfo = function() {
		alert('WP Info - yeah!!');
	}

}

DevTools();

`;

let sElement = document.createElement('script');
sElement.innerHTML = script;
document.querySelector('head').appendChild(sElement);


/* 
document.addEventListener('DOMContentLoaded', () => {
	// get body classes
	var body = document.getElementsByTagName('body')[0];
	var listInfoBtn = document.getElementsById('listInfoBtn');
	var container = document.getElementsById('container');
	
	
	listInfoBtn.addEventListener('click', () => {
  
  
	  // FIXME: continue here
  
	  // h1 
	  var newh1 = document.createElement("h1"); 
	  newh1.appendChild( 
		document.createTextNode("Information")
	  );
	  container.appendChild( newh1 );
  
	  // list them
	  for ( cls of body.className.split(' ') ) {
		console.log(cls);
  
		// display Wordpress edit url
		logWPEditLink ( cls, "page-id-" );
		logWPEditLink ( cls, "postid-" );
  
		function logWPEditLink ( classNameString, beginsWithString ) {
		  if ( classNameString.includes( beginsWithString ) ) {
			showLink( findId ( classNameString, beginsWithString ) );
		  }
		};
  
		function findId ( string, matchString ) {
		  let pos = matchString.length - string.length
		  return string.slice( pos );
		};
		
		function showLink ( pageId ) {
		  console.log( "  Page edit url: ");
		  console.log( "  " + "https://www.texture.ca/wp-admin/post.php?post=" + pageId + "&action=edit" );            
		};
	  }
	});
  
  });
   */