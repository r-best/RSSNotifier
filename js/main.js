function fetchRSS(rssurl){
	var http = new XMLHttpRequest();

	http.open("GET", rssurl, false);
	http.send();
	
	if(http.status === 200){
		var rss = new DOMParser().parseFromString(http.responseText, 'text/xml');
		return {
			"name": rss.getElementsByTagName('title')[0].innerHTML,
			"lastUpdate": rss.getElementsByTagName('lastBuildDate')[0].innerHTML
		};
	}
	else{
//		alert("Error fetching RSS feed");
		return {
			"name": "Error retrieving feed data",
			"lastUpdate": ""
		};
	}
}

var SUBS = ["http://mbmbam.libsyn.com/rss", "http://adventurezone.libsyn.com/rss", "http://rosebuddies.libsyn.com/rss"];

// Helper function to create a list element
function genListElement(sub){
	var subscription = fetchRSS(sub);
	
	var li = document.createElement('li');
	
	var textNode = document.createElement('div');
	textNode.setAttribute("class", "ui-marquee ui-marquee-gradient");
	textNode.innerHTML = subscription.name;
	li.appendChild(textNode);
	
	textNode = document.createElement('div');
	textNode.setAttribute("class", "ui-li-sub-text");
	textNode.innerHTML = subscription.lastUpdate;
	li.appendChild(textNode);
	
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
