'use strict';

var api_uri = 'http://safename.io'

if(location.protocol == 'https:') {
     api_uri = 'https://safename.io'
}

//var api_uri = 'http://localhost:8000'

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   
    if (request.contentScriptQuery == "queryAlias") {
      var url = api_uri + '/api/alias/' +
              encodeURIComponent(request.alias);
      fetch(url)
          .then(response => response.text())
          .then(text => {sendResponse(text)})
          .catch(error => console.log(error)
          )
      return true;  // Will respond asynchronously.
    }
     else if (request.contentScriptQuery == "querySafename") {
      var url = api_uri + '/api/sn/' +
              encodeURIComponent(request.sn);
      fetch(url)
          .then(response => response.text())
          .then(text => {sendResponse(text)})
          .catch(error => console.log(error)
          )
      return true;  // Will respond asynchronously.
    }
  
  });

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  
  if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
    chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
    chrome.tabs.executeScript(null, { file: "program.js" });
    chrome.tabs.insertCSS(null, { file: "style.css" });
  });


  }
  

});


