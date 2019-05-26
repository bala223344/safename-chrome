jQuery(function () {

    
    //var details_api_uri = 'http://localhost:8000/sn'
    var details_api_uri = 'http://safename.io/sn'
    
    if(location.protocol == 'https:') {
         details_api_uri = 'https://safename.io/sn'
    }
    
    //0xc8b759860149542a98a3eb57c14aadf59d6d89b9

    jQuery('body').append('<div id="NH-chrome-popupover"><div class="NH-popover-content"></div></div>')

    var popupContent = $(".NH-popover-content")
    var popup = $("#NH-chrome-popupover")

    jQuery("body").mouseup(function (e) {

     //   console.log('returning');
        if(e.target.id == "NH-chrome-popupover") {
            console.log('returning');
            return;  
        }
          
       //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
      // if($(e.target).closest('#NH-chrome-popupover').length)
        //  return;
        
     

        if (window.getSelection) {
            selection = window.getSelection();
        } else if (document.selection) {
            selection = document.selection.createRange();
        }

        

        var X = $('body').offset().left;
        var Y = $('body').offset().top;

        popup.css({ left: e.pageX, top: e.pageY + 30 })
        var selectionStr = selection.toString().trim()
        //no special chars allowed like url
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        //filter out middle spaces..that means it is a word not an address..
        if (selectionStr != '' && selectionStr.length > 25 && selectionStr.length <= 42 && selectionStr.indexOf(' ') < 0  && !format.test(selectionStr)) {
            popup.show()
            popupContent.html('loading..')

            $.get(details_api_uri + '/' + selectionStr, function (data) {
                
                if (window.getSelection) {
                    if (window.getSelection().empty) {  // Chrome
                        window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {  // Firefox
                        window.getSelection().removeAllRanges();
                    }
                }

                if (data && data.address) {
                    var formattedData = ""

                    var status = (data.address_status == "secure" || data.address_status == "verified") ? `<span class="green">${data.address_status}</span>` : `<span class="red">${data.address_status}</span>` ;
                    var profile = (data.address_safename)  ?`<a target="_new" href="https://${data.address_safename.toLowerCase()}.safename.io">${data.address_safename}.safename.io</a> <br />`:""
                 formattedData = ` ${profile}  Status :  ${status} | Credit Ratings : ${data.profile_risk_score} <br /> ${data.address} <a alt="copy address" title="copy address" id="copy-addr"><img width="20" src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/ionicons/svg/md-copy.svg"></a> `;
                  
                    popup.removeClass('not-found')         
                    popupContent.html(formattedData)
                    
                  
                }
                else {
                    var formattedData = ` Records not found. Submit Using  <a target="_new" href="https://safeName.io">SafeName.io</a> <a alt="copy address" title="copy address" id="copy-addr"><img width="20" src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/ionicons/svg/md-copy.svg"></a>`;
                    popup.addClass('not-found')                    
                    popupContent.html(formattedData)
                    //popup.hide()
                }

                $("#copy-addr").click(function () {
                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val(selectionStr).select();
                    document.execCommand("copy");
                    $temp.remove();
                })

            });
            


       


        } else {
            popup.hide()
        }





        //selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);




    });


   
   

})