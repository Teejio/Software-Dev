

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message.action == "capture", message.action);
  if (message.action == "capture") {
    

 chrome.tabs.captureVisibleTab().then((a) => sendResponse( sendResponse({status: 200, data: a})));

 
    return true;
  }
  
});


