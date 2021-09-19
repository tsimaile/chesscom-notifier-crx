var objUsername;
var objPassword;
var objUserToken;
var objIterval;
var objAlertNotify;
var objSoundNotify;
var objMultiTab;

function onload() {
	objUsername 	= document.getElementById("txtUsername");
	objPassword 	= document.getElementById("txtPassword");
	objUserToken	= document.getElementById("txtUserToken");
	objInterval 	= document.getElementById("txtInterval");
	objAlertNotify 	= document.getElementById("chkAlertNotify");
	objSoundNotify 	= document.getElementById("chkSoundNotify");
	objMultiTab 	= document.getElementById("chkMultiTab");

	document.getElementById("title").innerText 	= retMessage("extName") + " " + retMessage("ttlOptions") ;
	document.getElementById("btnSave").value 	= retMessage("btnSave");
	document.getElementById("btnClose").value 	= retMessage("btnClose");

	restoreOptions();
	}
	
function restoreOptions() {
	objUsername.value		= localStorage.username;
	objPassword.value		= localStorage.password;
	objUserToken.value		= localStorage.usertoken;
	objInterval.value		= localStorage.interval;
	objAlertNotify.checked 	= toBool(localStorage.alert);
	objSoundNotify.checked 	= toBool(localStorage.sound);
	objMultiTab.checked		= toBool(localStorage.multitab);
	}

function saveOptions() {
	localStorage.username	= objUsername.value;
	localStorage.password	= objPassword.value;
	localStorage.usertoken	= objUserToken.value;
	localStorage.userId		= 0;
	objInterval.value 		= parseInt(objInterval.value)
	if (objInterval.value < 1 || isNaN(objInterval.value)) objInterval.value = 3;
	if (localStorage.interval != objInterval.value) alert(retMessage("onIntervalChange"));
	localStorage.interval	= objInterval.value;
	localStorage.alert		= objAlertNotify.checked;
	localStorage.sound		= objSoundNotify.checked;
	localStorage.multitab	= objMultiTab.checked;
	closeOptions();
	}
	
function closeOptions() {
	return window.close()
	}