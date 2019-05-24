function fetchRSSUpdateTime(rssurl){
	var http = new XMLHttpRequest();
	
	http.onreadystatechange = () => {
		if(http.readyState == http.DONE){
			console.log("HTTP DONE");
			if(http.status == 200){
				box = document.querySelector('#textbox');
				
				rss = new DOMParser().parseFromString(http.responseText, 'text/xml');
				box.innerHTML = rss.getElementsByTagName('lastBuildDate')[0].innerHTML;
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
    	fetchRSSUpdateTime('http://mbmbam.libsyn.com/rss');
    });

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	box = document.querySelector('#textbox');
    	box.innerHTML = box.innerHTML == "Basic" ? "Sample" : "Basic";
    });
    
};
