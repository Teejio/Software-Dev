
let queryOptions = { active: true, currentWindow: true };


document.getElementById("boxWidth").onchange = async function(e) {

    let tab = await chrome.tabs.query(queryOptions);
    

    chrome.storage.local.set({ w: this.value });

    chrome.tabs.sendMessage(tab[0].id, {func: "w", val: this.value}, function(response) {

    });
}
document.getElementById("boxHeight").onchange = async function(e) {
    let tab = await chrome.tabs.query(queryOptions);

    chrome.storage.local.set({ h: this.value });
    chrome.tabs.sendMessage(tab[0].id, {func: "h", val: this.value}, function(response) {

    });
}

document.getElementById("boxZoom").onchange = async function(e) {
    let tab = await chrome.tabs.query(queryOptions);

    chrome.storage.local.set({ s: this.value });
    chrome.tabs.sendMessage(tab[0].id, {func: "s", val: this.value}, function(response) {

    });
}

async function loadSettings(){
    document.getElementById("loading").innerHTML = "... loading ..."
let width = await chrome.storage.local.get(["w"]) ?? 100
let height = await chrome.storage.local.get(["h"]) ?? 50
let scale = await chrome.storage.local.get(["s"]) ?? 5

document.getElementById("boxWidth").value = width.w
document.getElementById("boxHeight").value =height.h
document.getElementById("boxZoom").value = scale.s

var variables = ""
for (var name in width)
    variables += name + "\n";
document.getElementById("loading").style.display = "none";
document.getElementById("ctn").style.display = "block"

let tab = await chrome.tabs.query(queryOptions);
   let a = await chrome.tabs.captureVisibleTab();


chrome.tabs.sendMessage(tab[0].id, {func: "main", val: a}, function(response) {

    });
}

 loadSettings()

