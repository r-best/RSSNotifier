function initDetailsPage(){
	console.log("Initializing subscription details page");
	var page = document.getElementById("subdetails");
	var url;
	var listWidget;

	page.addEventListener("pageshow", async() => {
		// Get associated URL from courier and use it to fetch most up-to-date subscription data
		url = document.getElementById("courier").data;
		var sub = await fetchRSS(url);
		
		page.querySelector('.ui-title').innerHTML = sub.name;
		document.getElementById("details-url").innerHTML = url;

		listWidget = tau.helper.SnapListMarqueeStyle.create(document.getElementById('details-list'), {marqueeDelay: 1000});
	});

	page.addEventListener("pagehide", () => {
		listWidget.destroy();
	});

	document.getElementById('details-delete').addEventListener('click', () => {
		if(confirm("Are you sure you want to delete this subscription?")){
			deleteSub(url);
			tau.back();
		}
	});
}
