function initAddSubPage(){
	var page = document.getElementById("addsub");

	page.addEventListener("pageshow", () => {
		
	});

	page.addEventListener("pagehide", () => {
		
	});

	document.getElementById('addsub-confirm').addEventListener('click', () => {
		var newSub = addSubValidate();
		if(newSub){
			var currentSubs = getSubs();
			currentSubs.push(newSub);
			setSubs(currentSubs);
			tau.back();
		}
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
