/* ABOUT:
* Chess.com Notifier
* get data from Chess.com web server
* parse responseText to determine if new games are in 'Your Turn to move'
* display statusbar icon-text and/or notification
* further info: https://sites.google.com/site/deexaminer/chess-com-notifier

/* THANKS:
*	Doron Rosenberg and Gmail Notifier for the idea and concepts
*	Martin Baeuml for Firefox add-on

/* ***** BEGIN LICENSE BLOCK *****
The contents of Chess.com Notifier (the "file") are subject to the Mozilla Public License
Version 1.1 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License at
http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS IS"
basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
License for the specific language governing rights and limitations
under the License.

The Original Code is contained within the file.

The Initial Developer of the Original Code is deExaminer.
Portions created by the Initial Developer are Copyright (C) 2008-2011
the Initial Developer. All Rights Reserved.

Contributor(s): .
 * ***** END LICENSE BLOCK ***** */

var userId 				= 0;
var myMove 				= 0;
var myMoveSeen 			= false;
var button				= null;
var strbundle 			= null;
var intervalId 			= 0;
var chesscomHost 		= ".chess.com"; // possibly www. or secure.
var chesscomUrl 		= "http://www.chess.com";

function getMessage (msgID) { document.write(chrome.i18n.getMessage(msgID)); }
function retMessage (msgID) { return chrome.i18n.getMessage(msgID); }

function gotoNextReadyGame () {
	// check current windows and tabs to remove any ItsYourTurn tabs; then open new ItsYourTurn tab
	var url = "";

	chrome.windows.getAll ( null, function (aWins) {
		if (toBool(localStorage.multitab) == false) {
			//alert("multitab = false");
			for (var i = 0; i < aWins.length; i++ ) {
				chrome.tabs.getAllInWindow( aWins[i].id, function (aTabs) {
					for (var j = 0; j < aTabs.length; j++ ) {
						var dotPoint = aTabs[j].url.indexOf(".");
						if (aTabs[j].url.substring(dotPoint, dotPoint + chesscomHost.length) == chesscomHost) {
							chrome.tabs.remove ( aTabs[j].id )
							} 
						}
					})
				}
			}
		if (myMove) {
			nextUrl = chesscomUrl + "/echess/goto_ready_game.html";
		} else {
			nextUrl = chesscomUrl + "/echess/";
		};	
		chrome.tabs.create( { url:nextUrl, selected:true } );
		})
	
	refreshStatus()
	}	// END gotoNextReadyGame
	
function alertNotification () {
		// http://www.tizag.com/javascriptT/javascriptdate.php
		var currentDateTime = new Date();
		var hours = currentDateTime.getHours();
		var minutes = currentDateTime.getMinutes();
		var ampm = "";
		ampm = (hours < 12 ? "AM" : "PM");
		hours = (hours < 13 ? hours : hours - 12);
		if (hours == 0) { hours = 12 };
		minutes = (minutes < 10 ? "0" : "") + minutes;

		var currentTime = hours + ":" + minutes + " " + ampm;
		var msg = retMessage("alertMsg") + localStorage.username;
		
		// http://dev.w3.org/2006/webapi/WebNotifications/publish/Notifications.html
		var notification  = window.webkitNotifications.createNotification(
			"/images/icon48_grn.png", 		// icon
			"Chess.com @ " + currentTime,	// title
			msg); 							// message
			
		// view-source:http://sandbox.gtaero.net/chrome/notifications.php
		notification.onclick	= function () { gotoNextReadyGame(); this.cancel() };
		notification.show();
	}	// END alertNotification

function refreshStatus() {

	chrome.browserAction.setIcon({path:"/images/icon48_blu.png"});
	chrome.browserAction.setTitle({title:retMessage("checking") + localStorage.username});
	
	// chrome.browserAction.setBadgeText({text:"4"});

	if (localStorage.userId == 0) {
		if (localStorage.username != "") {
			getUserId();
		} else {
			chrome.browserAction.setIcon({path:"/images/icon48_red.png"});
			chrome.browserAction.setTitle({title:retMessage("errorUsername") + localStorage.username});
		}
		return;
	}

/*
	function infoReceived()
	{
		var output = httpRequest.responseText;
		// the response either contains a single '0' (meaning currently no move pending)
		// or a single '1' (at least one move pending)
		myMove = (output == '1');

		// update display
		if (myMove) {
			chrome.browserAction.setIcon({path:"/images/icon48_grn.png"});
			chrome.browserAction.setTitle({title:retMessage("myMove")  + localStorage.username});
			if (!myMoveSeen) {
				if (toBool(localStorage.alert)) { alertNotification() };
				if (toBool(localStorage.sound)) { soundNotification() };
				myMoveSeen = true;
			}
		} else {
			chrome.browserAction.setIcon({path:"/images/icon48_clr.png"});
			chrome.browserAction.setTitle({title:retMessage("noMove") + localStorage.username});
			myMoveSeen = false;
		}
	}
		
	var httpRequest			= new XMLHttpRequest();
	var fullUrl = chesscomUrl + "/echess/is_game_ready.html?user_id=" + localStorage.userId;
	// initialise
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4) {			// 4 = request loaded
			if (httpRequest.status == 200) {		// 200 = OK
				//showStatus(httpRequest.responseText);
				return infoReceived();
			} else {
				chrome.browserAction.setIcon({path:"/images/icon48_red.png"});
				chrome.browserAction.setTitle({title:retMessage("errorConnection")});
				myMoveSeen = false;
			}
		}
	}; // END httpRequest.onreadystatechange
	httpRequest.open("GET", fullUrl, true); // get status from Chess.com server
	httpRequest.send(null); 			// send the get
*/
	function infoReceived() // VERSION 2
	{
		var output = httpRequest.responseText;
		alert(output);
		
		var myre1 = new RegExp("([0-9]+)"); // thanks http://regexpal.com/
		var matches = myre1.exec(output);
		// alert (matches[0]);
		// the response either contains a single '0' (meaning currently no move pending)
		// or a single '1' (at least one move pending)
		myMove = matches[0];
		alert(myMove);
		alert(localStorage.mymove);
		// update display
		if (myMove > localStorage.mymove) {
			chrome.browserAction.setIcon({path:"/images/icon48_grn.png"});
			chrome.browserAction.setTitle({title:retMessage("myMove")  + localStorage.username});
			//if (!myMoveSeen) {
				if (toBool(localStorage.alert)) { alertNotification() };
				if (toBool(localStorage.sound)) { soundNotification() };
				//myMoveSeen = true;
			//}
		} else if (myMove == 0) {
			chrome.browserAction.setIcon({path:"/images/icon48_clr.png"});
			chrome.browserAction.setTitle({title:retMessage("noMove") + localStorage.username});
			//myMoveSeen = false;
		}
		localStorage.mymove = myMove;
	}
	
	
	// VERSION 2
	var httpRequest			= new XMLHttpRequest();
	var fullUrl = chesscomUrl + "/api/v2/get_echess_current_games?id=" + localStorage.usertoken;
	// initialise
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4) {			// 4 = request loaded
			if (httpRequest.status == 200) {		// 200 = OK
				//showStatus(httpRequest.responseText);
				return infoReceived();
			} else {
				chrome.browserAction.setIcon({path:"/images/icon48_red.png"});
				chrome.browserAction.setTitle({title:retMessage("errorConnection")});
				myMoveSeen = false;
			}
		}
	}; // END httpRequest.onreadystatechange
	httpRequest.open("GET", fullUrl, true); // get status from Chess.com server
	httpRequest.send(null); 			// send the get


	}
	
	
	
function getUserId() {
		alert("getUserId");
        function infoReceived() {
            var output = httpRequest.responseText;
			
            if (output.length) {
                // cut out the userid from "/home/alerts.html?track_user_id=[0-9]+&return_url=%2Fmembers%2Fsearch.html%3Fname%3DuserName%26country%3D"
                // or from "userName ... /home/send_message.html?id=userId"
                var myre1 = new RegExp("([0-9]+)", "i"); // thanks http://regexpal.com/
                // var myre2 = new RegExp(localStorage.username + "[\\S\\s]*send_message.html.id=([0-9]+)", "i");
                var matches = myre1.exec(output);
				
                if (!matches) {
                    // matches = myre2.exec(output);
                }
                if (matches) {
                    localStorage.userId = matches[0];
					return;
                } else {
					chrome.browserAction.setIcon({path:"/images/icon48_red.png"});
					chrome.browserAction.setTitle({title:retMessage("errorUserNotFound") + localStorage.username});
					myMoveSeen = false;
                }
            }
        }

        // retrieve user id
       //  chesscomnotifier.setStatus(chesscomnotifier.strbundle.getString("retrievingUserId"));

		var httpRequest			= new XMLHttpRequest();
		var fullUrl = chesscomUrl + "/api/get_user_info?username=" + localStorage.username;
		// initialise
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState == 4) {			// 4 = request loaded
				if (httpRequest.status == 200) {		// 200 = OK
					//showStatus(httpRequest.responseText);
					return infoReceived();
				} else {
					chrome.browserAction.setIcon({path:"/images/icon48_red.png"});
					chrome.browserAction.setTitle({title:retMessage("errorConnection")});
					myMoveSeen = false;
				}
			}
		}; // END httpRequest.onreadystatechange
		
        httpRequest.open("GET", fullUrl, true);
        httpRequest.send(null);
	}

function toBool( str ) {
	// http://www.toptip.ca/2009/11/google-chrome-extension-options-page.html
	if ("false" === str)
		return false;
	else 
		return str;
	}
	
function checkPrefs() {
	if (localStorage.username == undefined) 	{ localStorage.username = "" };
	if (localStorage.password == undefined) 	{ localStorage.password = "" };
	if (localStorage.usertoken == undefined) 	{ localStorage.usertoken = "" };
	if (localStorage.userId == undefined) 		{ localStorage.userId = 0 };
	if (localStorage.mymove == undefined) 		{ localStorage.mymove = 0 };
	localStorage.mymove = 0;
	if (localStorage.interval == undefined) 	{ localStorage.interval = 3 };
	if (localStorage.alert == undefined) 		{ localStorage.alert = true };
	if (localStorage.sound == undefined) 		{ localStorage.sound = true };
	if (localStorage.multitab == undefined) 	{ localStorage.multitab = false };
	}

function soundNotification () {
//function soundAlert (sttSound, txtSoundFile) {
	var objAudio = document.getElementById("audio");
	/*switch (sttSound) {
		case "off":
			break;
		case "beep":*/
			objAudio.src = "http://www.ibiblio.org/pub/multimedia/pc-sounds/ding.wav";
		/*	break;
		case "list":
			objAudio.src = urlMyServer + "/audio/alert_" + txtSoundFile + ".wav";
			break;
		case "file":
			objAudio.src = txtSoundFile;
		default:
			alert("Error: 400 soundAlert - unknown getCharPref(sound) [sttSound]");
		}*/
	}
