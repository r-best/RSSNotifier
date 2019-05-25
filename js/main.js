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

var SUBS = ["http://mbmbam.libsyn.com/rss", "http://adventurezone.libsyn.com/rss", "http://rosebuddies.libsyn.com/rss"];

// Helper function to create a list element
function genListElement(sub){
	// Initialize list element
	var li = document.createElement('li');
	
	// Add title & subtitle to list element with placeholder text
	var title = document.createElement('div');
	title.setAttribute("class", "ui-marquee ui-marquee-gradient");
	title.innerHTML = "Loading";
	li.appendChild(title);
	
	var subtitle = document.createElement('div');
	subtitle.setAttribute("class", "ui-li-sub-text");
	subtitle.innerHTML = "Loading";
	li.appendChild(subtitle);
	
	// Asynchronously fetch the real title & subtitle text, update when available
	fetchRSS(sub).then((res) => {
		title.innerHTML = res.name;
		subtitle.innerHTML = res.lastUpdate;
	});
	
	return li;
}

function initSubsListPage(){
    var page = document.getElementById("sublist");
    var listHelper;

	page.addEventListener("pageshow", () => {
		var list = document.getElementById("subs");
		while(list.firstChild) list.removeChild(list.firstChild); // Remove all current list elements
		// Add a new list element for each subscription
		SUBS.forEach(sub => {
			list.appendChild(genListElement(sub));
		});
		listHelper = tau.helper.SnapListMarqueeStyle.create(list, {marqueeDelay: 1000});
	});

	page.addEventListener("pagehide", () => {
		listHelper.destroy();
	});
}

window.onload = function(){
    // TODO:: Do your initialization job
	console.log("INITIALIZING APP");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', (e) => {
        if(e.keyName === "back")
        	try {tizen.application.getCurrentApplication().exit();}
        	catch(ignore) {}
    });

	// Initialize Subscription List Page
	initSubsListPage();
};
