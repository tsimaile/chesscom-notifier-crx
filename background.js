function onload() {
	// chrome.browserAction.setBadgeBackgroundColor({color:[102,204,0,255]});
	// chrome.browserAction.setBadgeText({text:""});
	checkPrefs();
	var intDelay = Math.floor(Math.random()*1000) + 1000 
	setTimeout  ( "refreshStatus()", intDelay ); // http://www.sean.co.uk/a/webdesign/javascriptdelay.shtm
	setInterval ( "refreshStatus()", localStorage.interval * 60 * 1000 );
	}

chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,255]});
/*
chrome.browserAction.onClicked.addListener(function(tab) {
	gotoNextReadyGame();
	});
*/