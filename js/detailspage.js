function initDetailsPage(){
	var page = document.getElementById("subdetails");

	page.addEventListener("pageshow", () => {
		var rssurl = document.getElementById("courier").data;

		document.getElementById("test").innerHTML = rssurl;
	});

	page.addEventListener("pagehide", () => {
		
	});
}