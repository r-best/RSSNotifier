window.onload = function(){
    // TODO:: Do your initialization job
	console.log("INITIALIZING APP");

	// DEBUG: Set up preferences
    tizen.preference.setValue('subs', JSON.stringify([
		{
			url: "http://mbmbam.libsyn.com/rss",
			time: "12:00",
			weekdays: ["monday"],
			frequency: "weekly"
		},{
			url: "http://adventurezone.libsyn.com/rss",
			time: "01:01",
			weekdays: ["thursday"],
			frequency: "biweekly"
		},{
			url: "http://rosebuddies.libsyn.com/rss",
			time: "01:01",
			weekdays: ['wednesday'],
			frequency: "weekly"
		}
	]));

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
    require(['js/listpage.js', 'js/detailspage.js', 'js/addpage.js'], (listPage, detailsPage, addPage) => {
    	listPage();
    	detailsPage();
    	addPage();
    });
};
