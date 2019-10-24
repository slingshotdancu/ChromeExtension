console.log("Popup script is running!");
retrieveButtonState();

////////////////////////////////EXAMPLE CODE///////////////////////////////////
// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {

    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script).
        setDOMInfo);
  });

  // Update the relevant fields with the new data.
  const setDOMInfo = info => {
    document.getElementById('total').textContent = info.total;
  };
  ////////////////////////////////END OF EXAMPLE CODE////////////////////////////////////


let button = document.getElementById("compare");
if(button !== null) {	  
	button.addEventListener('click', () => {
	  chrome.tabs.query({
	  active: true,
	  currentWindow: true
	  }, tabs => {
	  chrome.tabs.sendMessage(
	  tabs[0].id,
	  { from: 'popup', subject: 'compare' },
	    setParagraphs);
	  });
});
};

const setParagraphs = info => {
	document.getElementById('compareP').textContent = info.buttons;
};

let powerState = {};
let turnButton = document.getElementById("turnOn");
let clearButton = document.getElementById("clear");
let resetButton = document.getElementById("reset");

turnButton.addEventListener("click", function() {
	if(turnButton.style.backgroundColor !== "green") {
		turnButton.style.backgroundColor = "green";
		turnButton.textContent = "On";
		setButtonState("On");
		chrome.tabs.query({
		active: true,
		currentWindow: true
		}, function(tabs) {
		chrome.tabs.sendMessage(
		tabs[0].id,
		{ from: 'popup', subject: 'buttonOn' },
		listenForText);
		});
	} else if(turnButton.style.backgroundColor === "green") {
		turnButton.style.backgroundColor = "red";
		turnButton.textContent = "Off";
		setButtonState("Off");
		chrome.tabs.query({
			active: true,
			currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(
			tabs[0].id,
			{ from: 'popup', subject: 'buttonOff' },
		stopListeningForText);
		});
	}
	});
	
	clearButton.addEventListener("click", function() {
		chrome.tabs.query({
		active: true,
		currentWindow: true
		}, function(tabs) {
		chrome.tabs.sendMessage(
		tabs[0].id,
		{ from: 'popup', subject: 'clear' });		
	});
	}); 

	resetButton.addEventListener("click", function() {
		chrome.tabs.query({
		active: true,
		currentWindow: true
		}, function(tabs) {
		chrome.tabs.sendMessage(
		tabs[0].id,
		{ from: 'popup', subject: 'clear' });		
	});
	});

	let listenForText = textObject => {
		if(textObject.newText !== undefined) {
		//alert("It got sent and the copied text is " + textObject.newText);
		let newP = document.createElement('p');
		let textNode = document.createTextNode(textObject.newText);
		newP.appendChild(textNode);
		let copies = document.getElementById("copies");
		copies.append(newP);
		}
	};
});


	let stopListeningForText = textObject => {

	};

	function setButtonState(buttonValue) {
	var key = "myKey", testPrefs = {val: buttonValue};
			chrome.storage.sync.set({key: testPrefs}, function() {
			console.log("Storage value is set to: " + testPrefs.val);
			}); 
		}

	function retrieveButtonState() {
		chrome.storage.sync.get(['key'], function(obj) {
			console.log(obj.key.val);
			if(obj.key.val === "On") {
				console.log("On boot, storage value is " + obj.key.val);	
				document.getElementById("turnOn").click();
			} else if(obj.key.val === "Off") {
				console.log("On boot, storage value is " + obj.key.val);
			}
		});
	}