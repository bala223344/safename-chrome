'use strict';

var api_uri = 'http://safename.io'

if(location.protocol == 'https:') {
     api_uri = 'https://safename.io'
}

//var api_uri = 'http://localhost:8000'
var ajaxReq = null
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   

    if (request.contentScriptQuery == "queryAlias") {
      var url = api_uri + '/api/alias/' +
              encodeURIComponent(request.alias);

              ajaxReq = $.ajax({
                url: url, 
                type: 'get',
                dataType: 'JSON',
                beforeSend : function()    {           
                  if(ajaxReq != null) {
                    ajaxReq.abort();
                  }
              },
                success: function(json) {
                  sendResponse(json)
                },
                error: function(xhr, ajaxOptions, thrownError) {
                        if(thrownError == 'abort' || thrownError == 'undefined') return;
                        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
              }); 


      return true;  // Will respond asynchronously.
    }
     else if (request.contentScriptQuery == "querySafename") {



      var url = api_uri + '/api/sn/' +
              encodeURIComponent(request.sn);


              ajaxReq = $.ajax({
                url: url, 
                type: 'get',
                dataType: 'JSON',
                beforeSend : function()    {           
                  if(ajaxReq != null) {
                    ajaxReq.abort();
                  }
              },
                success: function(json) {
                  sendResponse(json)
                },
                error: function(xhr, ajaxOptions, thrownError) {
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


