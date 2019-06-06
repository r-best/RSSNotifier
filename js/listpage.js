define(['./utils.js'], (utils) => {
	var page;
	var listWidget;
	
	function refresh(){
		if(listWidget) listWidget.destroy();
		var subs = utils.getSubs();
	
		if(subs.length){
			var list = document.getElementById("subs");
			while(list.firstChild) list.removeChild(list.firstChild); // Remove all current list elements
	
			// Add a new default list element for each subscription
			subs.forEach(sub => list.appendChild(genListElement(sub)));
	
			// Asynchronously fetch the real title & subtitle text for each element, updating when available
			new Promise(async(resolve, reject) => {
				var node = list.childNodes[0];
				while(true){
					var rss = await utils.fetchRSS(node.rssurl);
					node.querySelector("div.ui-marquee.ui-marquee-gradient").innerHTML = rss.name;
					node.querySelector("div.ui-li-sub-text").innerHTML = rss.lastUpdate;
	
					if(node.nextSibling) node = node.nextSibling;
					else break;
				}
				listWidget = tau.helper.SnapListMarqueeStyle.create(list, {marqueeDelay: 1000});
			});
		}
	}
	
	// Helper function to create a list element
	function genListElement(sub){
		// Initialize list element
		var li = document.createElement('li');
		li.rssurl = sub.url;
		li.addEventListener("click", () => {
			document.getElementById("courier").data = sub.url;
			tau.changePage("#subdetails");
		})
		
		// Add title & subtitle to list element with placeholder text
		var title = document.createElement('div');
		title.setAttribute("class", "ui-marquee ui-marquee-gradient");
		title.innerHTML = "Loading";
		li.appendChild(title);
		
		var subtitle = document.createElement('div');
		subtitle.setAttribute("class", "ui-li-sub-text");
		subtitle.innerHTML = "Loading";
		li.appendChild(subtitle);
		
		return li;
	}
	
	// Export initialization function
	return () => {
		console.log("Initializing subscription list page");
	    page = document.getElementById("sublist");

	    refresh();

		page.addEventListener("pageshow", () => {
			refresh();
		});
	
		page.addEventListener("pagehide", () => {
			listWidget.destroy();
		});
	};
});
