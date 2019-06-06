define(() => {
	/**
	 * 
	 * @param rssurl {string} The URL of the RSS feed to subscribe to
	 * @returns An object with 
	 */
	function fetchRSS(rssurl){
		return new Promise((resolve, reject) => {
			var http = new XMLHttpRequest();

			http.onreadystatechange = () => {
				if(http.readyState == http.DONE){
					if(http.status == 200){
						try{
							var rss = new DOMParser().parseFromString(http.responseText, 'text/xml');
							return resolve({
								"name": rss.getElementsByTagName('title')[0].innerHTML,
								"lastUpdate": rss.getElementsByTagName('lastBuildDate')[0].innerHTML
							});
						}
						catch(e){ return resolve({"name": "Error retrieving feed data","lastUpdate": ""});}
					}
					else return resolve({"name": "Error retrieving feed data","lastUpdate": ""});
				}
			};
			http.open("GET", rssurl);
			http.send();
		});
	}

	/**
	 * @returns the list of active subscriptions stored in the app preferences
	 */
	function getSubs(){
		return tizen.preference.exists('subs') ? JSON.parse(tizen.preference.getValue('subs')) : [];
	}

	/**
	 * 
	 * @param subs
	 * @returns
	 */
	function addSub(sub){
		var currentSubs = getSubs();
		currentSubs.push(newSub);
		tizen.preference.setValue('subs', JSON.stringify(subs));
	}
	
	/**
	 * 
	 * @param url
	 * @returns
	 */
	function deleteSub(url){
		var subs = getSubs();
		subs.splice(currentSubs.findIndex((item) => item.url === url ), 1);
		tizen.preference.setValue('subs', JSON.stringify(subs));
	}
	
	return {
		fetchRSS: fetchRSS,
		getSubs: getSubs,
		addSub: addSub,
		deleteSub: deleteSub
	};
});