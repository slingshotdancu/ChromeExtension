console.log("background script is running!");

//Enables the page action on validation for the selected tab
chrome.runtime.onMessage.addListener(function (msg, sender) {
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
        chrome.pageAction.show(sender.tab.id);
    }
});

let firstSavedParagraph; 
let secondSavedParagraph;
//when the active tab changes, update the paragraphs to appear normalized
chrome.tabs.onActivated.addListener(updateParagraphs);

//get the active tab and update the textarea if the popup has anything in the textarea
function updateParagraphs() {
	chrome.storage.sync.get('pOne', function(obj) {
//update the current tab's popup
	chrome.runtime.sendMessage({paragraphOne: obj.pOne});
		console.log(obj);	
	});

	chrome.storage.sync.get('pTwo', function(obj) {
		chrome.runtime.sendMessage({paragraphTwo: obj.pTwo});
		console.log(obj);	
	});
}


