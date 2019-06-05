var sectionChangerWidget, pageIndicatorWidget;
var numSections;
function initAddSubPage(){
	console.log("Initializing add subscription page");
	var page = document.getElementById("addsub");

	page.addEventListener("pageshow", () => {
		sectionChangerWidget = tau.widget.SectionChanger(page.querySelector('.ui-content'), {
			circular: false,
			orientation: 'horizontal',
			useBouncingEffect: false
		});
		numSections = page.querySelectorAll('section').length;
		pageIndicatorWidget = tau.widget.PageIndicator(page.querySelector("#indicator"), {numberOfPages: numSections});
		pageIndicatorWidget.setActive(0);

		// Initialize time picker to current time
		var date = new Date();
		var hour = ("00"+date.getHours()).slice(-2);
		var minute = ("00"+date.getMinutes()).slice(-2);
		page.querySelector('input[type="time"]').value = hour+":"+minute;
	});

	page.addEventListener("pagehide", () => {
		sectionChangerWidget.destroy();
		pageIndicatorWidget.destroy();
	});

	page.querySelector('#addsub-confirm').addEventListener('click', () => {
		var newSub = addSubValidate();
		if(newSub){
			var currentSubs = getSubs();
			currentSubs.push(newSub);
			setSubs(currentSubs);
			tau.back();
		}
	});
	
	page.querySelector('.ui-content').addEventListener("sectionchange", e => {
        pageIndicatorWidget.setActive(e.detail.active);
	});
}

function addSubValidate(){
	var url = document.getElementById("addsub-url").value;
	
	if(!RegExp('^https?:\/\/.*$').test(url)){
		alert("Please enter a valid URL");
		return false;
	}
	
	return {
		url: url
	};
}
