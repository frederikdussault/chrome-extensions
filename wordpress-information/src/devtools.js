const script = `
//Body Class List
/*
Log applied classes on body of document

Added:
log URL of edit link of post and pages
*/

var rdm = (function() {

	var domain = window.location.origin;

    return {
        listBodyClass: function() {
			let el = document.getElementsByTagName('body')[0];
			let values = el.className.split(' ');
			let valuesJoined = values.join(''); 

			console.log( 'RDM - List of classes on body tag' );
			if ( valuesJoined ) {
				console.table( values );
			} else {
				console.log( '    No classes found' );
			}
		},
 
        listHtmlClass: function() {
			let el = document.getElementsByTagName('html')[0];
			let values = el.className.split(' ');
			let valuesJoined = values.join(''); 

			console.log( 'RDM - List of classes on html tag' );
			if ( valuesJoined ) {
				console.table( values );
			} else {
				console.log( '    No classes found' );
			}
		},

        listMetas: function() {
			let elems = document.getElementsByTagName('meta'); 

			console.log( 'RDM - List of metas' );
			if ( elems && elems.length > 0 ) {
				console.table( 
					elems, 
					["name", "property", "http-equiv", "content", "container" ] 
				);
			} else {
				console.log( '    No meta found' );
			}
		},
		
        listEditUrl: function() {
			let el = document.getElementsByTagName('body')[0];
		
			// list them
			for ( cls of el.className.split(' ') ) {
				// display Wordpress edit url
				logWPEditLink ( cls, "page-id-" );
				logWPEditLink ( cls, "postid-" );
		
				function logWPEditLink ( classNameString, beginsWithString ) {
					if ( classNameString.includes( beginsWithString ) ) {
						showLink( findId ( classNameString, beginsWithString ) );
					}
				};
		
				function findId ( string, matchString ) {
					let pos = matchString.length - string.length;
					return string.slice( pos );
				};
				
				function showLink ( pageId ) {
					console.log( "RDM - Page edit url: ");
					console.log( "  " + window.location.origin + "/wp-admin/post.php?post=" + pageId + "&action=edit" );
				};
			}
		},

		list: function() {
			this.listHtmlClass();
			this.listBodyClass();
			this.listMetas();
			this.listEditUrl();			
		}
		
    };  
})();   

rdm.list();
`;

let sElement = document.createElement('script');
sElement.setAttribute('id', 'WpInfoExt');
sElement.innerHTML = script;
document.querySelector('head').appendChild(sElement);
