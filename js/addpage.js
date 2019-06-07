define(['./utils.js'], (utils) => {
	var page;
	var sectionChangerWidget, pageIndicatorWidget;
	
	var WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	
	function weekdayButtonHandler(e){
		var button = e.target;
		if(button.style.backgroundColor === 'green')
			button.style.backgroundColor = 'black';
		else
			button.style.backgroundColor = 'green';
	}
	
	function validate(){
		// Get URL & validate it
		var url = document.getElementById("addsub-url").value;
		if(!RegExp('^https?:\/\/.*$').test(url)){
			alert("Please enter a valid URL");
			return false;
		}
	
		// Get selected weekdays to repeat on
		var weekdays = WEEKDAYS.filter(
				day => document.getElementById(day).style.backgroundColor === 'green'
		);
		if(weekdays.length === 0){
			alert("Please select the day(s) of the week this feed usually updates");
			return false;
		}
		
		return {
			url: url,
			time: page.querySelector('#addsub-time').value,
			weekdays: weekdays,
			frequency: page.querySelector('input[name="updateschedule"]:checked').value
		};
	}
	
	function initNew(){
		// Initialize URL field to empty string
		page.querySelector('#addsub-url').value = "";
		
		// Initialize time picker to current time
		var date = new Date();
		var hour = ("00"+date.getHours()).slice(-2);
		var minute = ("00"+date.getMinutes()).slice(-2);
		page.querySelector('#addsub-time').value = hour+":"+minute;
		
		// Initialize all weekday buttons to off
		WEEKDAYS.forEach(day => page.querySelector('#'+day).style.backgroundColor = 'black');
		
		// Make sure weekly button is checked
		page.querySelector('#weeklybtn').checked = true;
		page.querySelector('#biweeklybtn').checked = false;
	}
	
	function initExisting(sub){
		// Initialize URL field to subscription URL
		page.querySelector('#addsub-url').value = sub.url;
		
		// Initialize time picker to subscription time
		page.querySelector('#addsub-time').value = sub.time;
		
		// Switch on all weekday buttons present in subscription
		WEEKDAYS.forEach(day => {
			if(sub.weekdays.includes(day))
				page.querySelector('#'+day).style.backgroundColor = 'green';
			else
				page.querySelector('#'+day).style.backgroundColor = 'black';
		});
		
		// Set frequency switch corresponding to subscription
		var weekly = page.querySelector('#weeklybtn');
		var biweekly = page.querySelector('#biweeklybtn');
		if(sub.frequency === 'weekly'){
			biweekly.checked = false;
			weekly.checked = true;
		}
		else{
			weekly.checked = false;
			biweekly.checked = true;
		}
	}

	// Export initialization function
	return () => {
		console.log("Initializing add subscription page");
		page = document.getElementById("addsub");
	
		page.addEventListener("pageshow", () => {
			sectionChangerWidget = tau.widget.SectionChanger(page.querySelector('.ui-content'), {
				circular: false,
				orientation: 'horizontal',
				useBouncingEffect: false
			});
			var numSections = page.querySelectorAll('section').length;
			pageIndicatorWidget = tau.widget.PageIndicator(page.querySelector("#indicator"), {numberOfPages: numSections});
			sectionChangerWidget.setActiveSection(0);
			pageIndicatorWidget.setActive(0);
			
			var courier =document.getElementById("courier"); 
			if(courier.value === "EDIT")
				initExisting(courier.data);
			else
				initNew();

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
			page.querySelector("#sunday").removeEventListener('click', weekdayButtonHandler);
			page.querySelector("#monday").removeEventListener('click', weekdayButtonHandler);
			page.querySelector("#tuesday").removeEventListener('click', weekdayButtonHandler);
			page.querySelector("#wednesday").removeEventListener('click', weekdayButtonHandler);
			page.querySelector("#thursday").removeEventListener('click', weekdayButtonHandler);
			page.querySelector("#friday").removeEventListener('click', weekdayButtonHandler);
			page.querySelector("#saturday").removeEventListener('click', weekdayButtonHandler);
			sectionChangerWidget.destroy();
			pageIndicatorWidget.destroy();
		});

		page.querySelector('#addsub-confirm').addEventListener('click', () => {
			var newSub = validate();
			if(newSub){
				var courier = document.getElementById('courier'); 
				if(courier.value === "EDIT")
					utils.deleteSub(courier.data.url);
				utils.addSub(newSub);
				tau.back();
			}
		});
		
		page.querySelector('.ui-content').addEventListener("sectionchange", e => {
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
	};
});
