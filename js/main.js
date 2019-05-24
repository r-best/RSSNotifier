function fetchRSSUpdateTime(rssurl, callback){
	var http = new XMLHttpRequest();
	
	http.onreadystatechange = () => {
		if(http.readyState == http.DONE){
			console.log("HTTP DONE");
			if(http.status == 200){
				box = document.querySelector('#textbox');
				
				rss = new DOMParser().parseFromString(http.responseText, 'text/xml');
				callback(rss.getElementsByTagName('lastBuildDate')[0].innerHTML);
			}
			else{
				alert("Error fetching RSS feed");
			}
		}
	};
	http.open("GET", rssurl);
	http.send();
}

window.onload = function () {
    // TODO:: Do your initialization job
	console.log("INITIALIZING APP");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
	try {
	    tizen.application.getCurrentApplication().exit();
	} catch (ignore) {
	}
    });
    
    document.addEventListener('rotarydetent', () => {
//    	fetchRSSUpdateTime('http://mbmbam.libsyn.com/rss', (updateTime) => {
//    		console.log(updateTime);
//    	});
    });

    document.addEventListener("click", () => {
    	
    });
    
    var page = document.getElementById("sublist"),
    list = document.getElementById("subs"),
    listHelper;

	page.addEventListener("pageshow", () => {
	   listHelper = tau.helper.SnapListMarqueeStyle.create(list, {marqueeDelay: 1000});
	});
	
	page.addEventListener("pagehide", () => {
	   listHelper.destroy();
	});
    
};
