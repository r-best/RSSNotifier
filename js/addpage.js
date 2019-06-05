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
		page.querySelector('#addsub-time').value = hour+":"+minute;
		
		// Initialize event handlers on weekday selectors
		page.querySelector("#sunday").addEventListener('click', weekdayButtonHandler);
		page.querySelector("#monday").addEventListener('click', weekdayButtonHandler);
		page.querySelector("#tuesday").addEventListener('click', weekdayButtonHandler);
		page.querySelector("#wednesday").addEventListener('click', weekdayButtonHandler);
		page.querySelector("#thursday").addEventListener('click', weekdayButtonHandler);
		page.querySelector("#friday").addEventListener('click', weekdayButtonHandler);
		page.querySelector("#saturday").addEventListener('click', weekdayButtonHandler);
	});

	page.addEventListener("pagehide", () => {
		sectionChangerWidget.destroy();
		pageIndicatorWidget.destroy();
	});

	page.querySelector('#addsub-confirm').addEventListener('click', () => {
		var newSub = addSubValidate(page);
		if(newSub){
			var currentSubs = getSubs();
			currentSubs.push(newSub);
			setSubs(currentSubs);
			tau.back();
		}
	});
	
	page.querySelector('.ui-content').addEventListener("sectionchange", e => {
		console.log("Changing to section "+ e.detail.active)
        pageIndicatorWidget.setActive(e.detail.active);
		switch(e.detail.active){
			case 0:
				page.querySelector('header h2').innerHTML = "Enter URL";
				break;
			case 1:
				page.querySelector('header h2').innerHTML = "Enter time";
				break;
			case 2:
				page.querySelector('header h2').innerHTML = "Choose weekdays";
				break;
			case 3:
				page.querySelector('header h2').innerHTML = "Update Schedule";
				break;
			default:
				page.querySelector('header h2').innerHTML = "Add subscription";
				break;
		}
	});
}

function weekdayButtonHandler(e){
	var button = e.target;
	if(button.style.backgroundColor === 'green')
		button.style.backgroundColor = 'black';
	else
		button.style.backgroundColor = 'green';
}

function addSubValidate(page){
	// Get URL & validate it
	var url = document.getElementById("addsub-url").value;
	if(!RegExp('^https?:\/\/.*$').test(url)){
		alert("Please enter a valid URL");
		return false;
	}

	// Get selected weekdays to repeat on
	var weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map(
			day => document.getElementById(day).style.backgroundColor === 'green'
	);
	if(!weekdays.includes(true)){
		alert("Please select the day(s) of the week this feed usually updates");
		return false;
	}
	
	return {
		url: url,
		time: page.querySelector('#addsub-time').value,
		weekdays: weekdays,
		biweekly: page.querySelector("#addsub-biweekly").checked
	};
}
