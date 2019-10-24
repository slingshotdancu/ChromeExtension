// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});

let paragraphOne = {};
    paragraphOne.pArrays = [];

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    //Collect the necessary data.    
	var domInfo = {
      total: document.querySelectorAll('*').length,
    };
    // Directly respond to the sender (popup), 
    // through the specified callback.
    response(domInfo);
	} else if((msg.from === 'popup') && (msg.subject === 'buttonOn')) {
	let theMouse = {};
	theMouse.isHovered = false;
	theMouse.hasBeenClicked = false;
	
	$('p').hover(function() {
		theMouse.isHovered = true;
		$(this).css("background-color", "yellow");
	}, function() {
		if(theMouse.hasBeenClicked === true) {
			$(this).css("background-color", "yellow");
			
		} else if(theMouse.hasBeenClicked === false) {
			$(this).css("background-color", "");
		}
	});
	
	
	$('p').on("click", function() {
		if(paragraphOne.pArrays.length < 2) {
			$(this).toggleClass("highlight");
			paragraphOne.pArrays.push(this.textContent.trim());
			console.log(this.textContent.trim());
			//returns all words in the array
			let allWords = splitWords(paragraphOne.pArrays[paragraphOne.pArrays.length-1]);
			console.log(allWords);
			storeParagraphs(allWords);
		} else if(paragraphOne.pArrays.length === 2) {
			console.log(paragraphOne.pArrays);
		}
		});
	response(paragraphOne);
	} else if((msg.from === 'popup') && (msg.subject === 'buttonOff')) {
		$("p").off();
	} else if((msg.from === 'popup') && (msg.subject === 'clear')) {
		$("p").removeClass("highlight");
	} else if((msg.from === 'popup') && (msg.subject === 'reset')) {
		$("p").off().removeClass("highlight");
//TODO empty the array? pArrays.length = 0 might work, this creates a new array, doesn't empty the old one
		paragraphOne.pArrays = [];
		
	}
	return Promise.resolve("Dummy response to keep the console quiet");
});

let splitWords = function(str) {
	let wordsArr = str.split(' ');
	return wordsArr;
}

function uniqueWords(arr) {
	return Array.from(new Set(arr));
}	
function storeParagraphs(paragraphValue) {
	var key = "myKey", testParagraphs = {val: paragraphValue};
	chrome.storage.sync.set({key: testParagraphs}, function() {
	console.log("Storage value is set to: " + testParagraphs.val);
	}); 
}
