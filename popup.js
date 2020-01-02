console.log("Popup script is running!");


let testPrefs = {};
let buttonValue = "Off";

////////////////////////////////EXAMPLE CODE///////////////////////////////////
// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {

    let turnButton = document.getElementById("turnOn");
    let calculateButton = document.getElementById("calculate");
    let clearButton = document.getElementById("clearButton");
    let infoButton = document.getElementById("infoEntity");
    let diffOutput = document.getElementById("diffOutput");
    let textareaOne = document.getElementById("paragraphOne");
    let textareaTwo = document.getElementById("paragraphTwo");

	chrome.storage.sync.get("pOne", function(obj) {
	if(obj.pOne) {
	console.log(obj.pOne);	
	textareaOne.value = obj.pOne;
	diffOutput.innerHTML = diffString(
		textareaOne.value, textareaTwo.value
		);
	}
	});
	
	chrome.storage.sync.get("pTwo", function(obj) {
	if(obj.pTwo) {	
	console.log(obj.pTwo);	
	textareaTwo.value = obj.pTwo;
	diffOutput.innerHTML = diffString(
		textareaOne.value, textareaTwo.value
		);
	}
	});
	
	clearButton.addEventListener("click", function() {
		textareaOne.value = "";
		textareaTwo.value = "";
		chrome.storage.sync.set({'pOne': ""}, function() {
		console.log("Paragraph One storage cleared");
		});
		chrome.storage.sync.set({'pTwo': ""}, function() {
		console.log("Paragraph Two storage cleared");
		});
		diffOutput.innerHTML = "";
	});
	
    textareaOne.addEventListener("input", function () {
        diffOutput.innerHTML = diffString(
            textareaOne.value, textareaTwo.value
        );
		chrome.storage.sync.set({'pOne': textareaOne.value}, function() {
			console.log("Paragraph One Saved");
		});
	});

    textareaTwo.addEventListener("input", function () {
        diffOutput.innerHTML = diffString(
            textareaOne.value, textareaTwo.value
        );
		chrome.storage.sync.set({'pTwo': textareaTwo.value}, function() {
			console.log("Paragraph Two Saved");
		});
	});
	
});


//Set of Diff Checker functions
function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");

    return n;
}

function diffString(o, n) {
    if (o) {
        o = o.replace(/\s+$/, '');
    }
    n = n.replace(/\s+$/, '');

    var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
    var str = "";

    var oSpace = o.match(/\s+/g);
    if (oSpace == null) {
        oSpace = ["\n"];
    } else {
        oSpace.push("\n");
    }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) {
        nSpace = ["\n"];
    } else {
        nSpace.push("\n");
    }

    if (out.n.length == 0) {
        for (var i = 0; i < out.o.length; i++) {
            str += '<span class=\"ins\">' + escape(out.o[i]) + oSpace[i] + '</span>';
        }
    } else {
        if (out.n[0].text == null) {
            for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
                str += '<span class=\"del\">' + escape(out.o[n]) + oSpace[n] + '</span>';
            }
        }

        for (var i = 0; i < out.n.length; i++) {
            if (out.n[i].text == null) {
                str += '<span class=\"ins\">' + escape(out.n[i]) + nSpace[i] + '</span>';
            } else {
                var pre = "";

                for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
                    pre += '<span class=\"del\">' + escape(out.o[n]) + oSpace[n] + "</span>";
                }
                str += " " + out.n[i].text + nSpace[i] + pre;
            }
        }
    }

    return str;
}

function randomColor() {
    return "rgb(" + (Math.random() * 100) + "%, " +
        (Math.random() * 100) + "%, " +
        (Math.random() * 100) + "%)";
}

function diffString2(o, n) {
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));

    var oSpace = o.match(/\s+/g);
    if (oSpace == null) {
        oSpace = ["\n"];
    } else {
        oSpace.push("\n");
    }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) {
        nSpace = ["\n"];
    } else {
        nSpace.push("\n");
    }

    var os = "";
    var colors = new Array();
    for (var i = 0; i < out.o.length; i++) {
        colors[i] = randomColor();

        if (out.o[i].text != null) {
            os += '<span style="background-color: ' + colors[i] + '">' +
                escape(out.o[i].text) + oSpace[i] + "</span>";
        } else {
            os += "<del>" + escape(out.o[i]) + oSpace[i] + "</del>";
        }
    }

    var ns = "";
    for (var i = 0; i < out.n.length; i++) {
        if (out.n[i].text != null) {
            ns += '<span style="background-color: ' + colors[out.n[i].row] + '">' +
                escape(out.n[i].text) + nSpace[i] + "</span>";
        } else {
            ns += "<ins>" + escape(out.n[i]) + nSpace[i] + "</ins>";
        }
    }

    return {
        o: os,
        n: ns
    };
}

function diff(o, n) {
    var ns = new Object();
    var os = new Object();

    for (var i = 0; i < n.length; i++) {
        if (ns[n[i]] == null)
            ns[n[i]] = {
                rows: new Array(),
                o: null
            };
        ns[n[i]].rows.push(i);
    }

    for (var i = 0; i < o.length; i++) {
        if (os[o[i]] == null)
            os[o[i]] = {
                rows: new Array(),
                n: null
            };
        os[o[i]].rows.push(i);
    }

    for (var i in ns) {
        if (ns[i].rows.length == 1 && typeof (os[i]) != "undefined" && os[i].rows.length == 1) {
            n[ns[i].rows[0]] = {
                text: n[ns[i].rows[0]],
                row: os[i].rows[0]
            };
            o[os[i].rows[0]] = {
                text: o[os[i].rows[0]],
                row: ns[i].rows[0]
            };
        }
    }

    for (var i = 0; i < n.length - 1; i++) {
        if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
            n[i + 1] == o[n[i].row + 1]) {
            n[i + 1] = {
                text: n[i + 1],
                row: n[i].row + 1
            };
            o[n[i].row + 1] = {
                text: o[n[i].row + 1],
                row: i + 1
            };
        }
    }

    for (var i = n.length - 1; i > 0; i--) {
        if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
            n[i - 1] == o[n[i].row - 1]) {
            n[i - 1] = {
                text: n[i - 1],
                row: n[i].row - 1
            };
            o[n[i].row - 1] = {
                text: o[n[i].row - 1],
                row: i - 1
            };
        }
    }

    return {
        o: o,
        n: n
    };
}
