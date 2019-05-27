var SUBS = ["http://mbmbam.libsyn.com/rss", "http://adventurezone.libsyn.com/rss", "http://rosebuddies.libsyn.com/rss"];

function fetchRSS(rssurl){
	return new Promise((resolve, reject) => {
		var http = new XMLHttpRequest();

		http.onreadystatechange = () => {
			if(http.readyState == http.DONE){
				if(http.status == 200){
					var rss = new DOMParser().parseFromString(http.responseText, 'text/xml');
					return resolve({
						"name": rss.getElementsByTagName('title')[0].innerHTML,
						"lastUpdate": rss.getElementsByTagName('lastBuildDate')[0].innerHTML
					});
				}
				else{
					return resolve({
						"name": "Error retrieving feed data",
						"lastUpdate": ""
					});
				}
			}
		};
		http.open("GET", rssurl);
		http.send();
	});
}

window.onload = function(){
    // TODO:: Do your initialization job
	console.log("INITIALIZING APP");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', (e) => {
        if(e.keyName === "back"){
        	var page = document.getElementsByClassName('ui-page-active')[0].id;
        	
        	if(page === "sublist")
	        	try {tizen.application.getCurrentApplication().exit();}
	        	catch(ignore) {}
        	else
        		window.history.back();
        }
    });

	// Initialize Pages
	initSubsListPage();
	initDetailsPage();
	initAddSubPage();
};
