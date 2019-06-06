define(['./utils.js'], (utils) => {
	var page;
	var sectionChangerWidget, pageIndicatorWidget;
	var numSections;
	var url;
	
	function editButtonClick(){
		alert("Edit not implemented");
	}
	
	function deleteButtonClick(){
		if(confirm("Are you sure you want to delete this subscription?")){
			deleteSub(url);
			tau.back();
		}
	}
	
	function sectionChangeHandler(e){
        pageIndicatorWidget.setActive(e.detail.active);
	}
	
	function buildWeekdaysString(weekdays){
		weekdays = weekdays.map(day => day.charAt(0).toUpperCase() + day.slice(1));

		if(weekdays.length === 1) return weekdays[0];
		
		weekdays[weekdays.length-1] = "and " + weekdays[weekdays.length-1];
		
		if(weekdays.length === 2) return weekdays.join(' ');
		else return weekdays.join(', ');
	}

	// Export initialization function
	return () => {
		console.log("Initializing subscription details page");
		page = document.getElementById("subdetails");
		var sub;
	
		page.addEventListener("pageshow", async() => {
			sectionChangerWidget = tau.widget.SectionChanger(page.querySelector('.ui-content'), {
				circular: false,
				orientation: 'horizontal',
				useBouncingEffect: false
			});
			numSections = page.querySelectorAll('section').length;
			pageIndicatorWidget = tau.widget.PageIndicator(page.querySelector("#indicator"), {numberOfPages: numSections});
			sectionChangerWidget.setActiveSection(0);
			pageIndicatorWidget.setActive(0);

			// Get associated URL from courier and use it to fetch most up-to-date subscription data
			sub = document.getElementById("courier").data;
			var rss = await utils.fetchRSS(sub.url);
			
			page.querySelector('.ui-title').innerHTML = rss.name;
			page.querySelector('#details-lastupdate').innerHTML = rss.lastUpdate;
			page.querySelector("#details-schedule").innerHTML = sub.frequency;
			page.querySelector("#details-days").innerHTML = buildWeekdaysString(sub.weekdays);

			page.querySelector('#details-edit').addEventListener('click', editButtonClick);
			page.querySelector('#details-delete').addEventListener('click', deleteButtonClick);
			page.querySelector('.ui-content').addEventListener("sectionchange", sectionChangeHandler);
		});
	
		page.addEventListener("pagehide", () => {
			page.querySelector('#details-edit').removeEventListener('click', editButtonClick);
			page.querySelector('#details-delete').removeEventListener('click', deleteButtonClick);
			page.querySelector('.ui-content').removeEventListener("sectionchange", sectionChangeHandler);
		});
		
		page.addEventListener('touchmove', e => {
			var index = sectionChangerWidget.getActiveSectionIndex();
			if(index == 2)
				e.preventDefault();
		});
	}
});
