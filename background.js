'use strict';

var api_uri = 'http://safename.io/api/search?apikey=yLvSHtXTysS1ug4WyajN'

if(location.protocol == 'https:') {
     api_uri = 'https://safename.io/api/search?apikey=yLvSHtXTysS1ug4WyajN'
}

var api_uri = 'http://localhost:8000/api/search?apikey=yLvSHtXTysS1ug4WyajN'
var ajaxReq = null
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   

    if (request.contentScriptQuery == "queryAnything") {
      var url = api_uri + '&q=' +
              request.str;

              ajaxReq = $.ajax({
                url: url, 
                type: 'get',
                beforeSend : function()    {           
                  if(ajaxReq != null) {
                    ajaxReq.abort();
                  }
              },
                success: function(json) {
                  
                  sendResponse(json)
                },
                error: function(xhr, ajaxOptions, thrownError) {
                      if (xhr.status == 404) {
                        sendResponse({error: 404})
                        return

                      }
                     
                      
                        if(thrownError == 'abort' || thrownError == 'undefined') return;
                        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
              }); 


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


