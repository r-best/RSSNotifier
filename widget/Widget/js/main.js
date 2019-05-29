window.onload = function() {
	var text = document.getElementById('content-text');
	tizen.preference.setChangeListener('subs', function(data){
		text.textContent = data.value;
	});
	document.addEventListener('visibilitychange', function(){
		if (document.visibilityState === 'hidden') {
	        /* Store shared data */
	    } else {
	        /* Load stored data and update the page */
	    	if(tizen.preference.exists('subs'))
	    		text.textContent = tizen.preference.getValue('subs')
	    	else
	    		text.textContent = 'Doesnt Exist'
	    }
	});
};
