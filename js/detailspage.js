function initDetailsPage(){
	var page = document.getElementById("subdetails");
	var listWidget;

	page.addEventListener("pageshow", () => {
		var sub = document.getElementById("courier").data
		var sub = fetchRSS(document.getElementById("courier").data);
		
		document.getElementById("details-url").innerHTML = sub.url;

		listWidget = tau.helper.SnapListMarqueeStyle.create(document.getElementById('details-list'), {marqueeDelay: 1000});
	});

	page.addEventListener("pagehide", () => {
		listWidget.destroy();
	});

	document.getElementById('details-delete').addEventListener('click', () => {
		if(confirm("Are you sure you want to delete this subscription?")){
			var currentSubs = getSubs();
			currentSubs.splice(currentSubs.findIndex((item) => item.url === sub.url ), 1);
			setSubs(currentSubs);
			tau.back();
		}
	});
}