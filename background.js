// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.



'use strict';


chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  
  if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
    chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
    chrome.tabs.executeScript(null, { file: "program.js" });
    chrome.tabs.insertCSS(null, { file: "style.css" });
  });


  }
  

});


