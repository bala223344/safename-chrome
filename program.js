jQuery(function () {


    var api_uri = 'http://localhost:8000'

    //   var api_uri = 'http://safename.io'

    // if(location.protocol == 'https:') {
    //      api_uri = 'https://safename.io'
    // }

    // var api_uri = 'http://198.38.93.150:8082'




    //NH-chrome-child is to look for click inside the popup container..so it can clear the text selection if any  //text selection will be left intact otherwise
    jQuery('body').append('<div id="NH-chrome-popupover"><div class="NH-popover-content NH-chrome-child "></div></div>')

    var popupContent = $(".NH-popover-content")
    var popup = $("#NH-chrome-popupover")

    jQuery("body").mouseup(function (e) {
        //console.log()
        //   if(e.target.id == "NH-chrome-popupover"){

        //  return;
        //}

        if ($(e.target).hasClass('NH-chrome-child')) {
            return;
        }




        if (window.getSelection) {
            selection = window.getSelection();
        } else if (document.selection) {
            selection = document.selection.createRange();
        }



        var X = $('body').offset().left;
        var Y = $('body').offset().top;

        popup.css({ left: e.pageX, top: e.pageY + 30 })
        var selectionStr = selection.toString().trim()

        //for addressess    
        //filter out middle spaces..that means it is a word not an address..
        //no special chars allowed like url
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        //reverse lookup 
        if (selectionStr.startsWith("safename:")) {
            var alias = selectionStr.split(":")[1]
            popup.show()
            popupContent.html('loading..')

            
            $.get(api_uri + '/alias/' + alias, function (data) {

                if (window.getSelection) {
                    if (window.getSelection().empty) {  // Chrome
                        //   window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {  // Firefox
                        //  window.getSelection().removeAllRanges();
                    }
                }

                if(data.length > 0) {
                    //all recs contains user data..so just take the first one
                    var user_data = data[0]
                    var risk_score = ""
                    
                    var profile = ""
                    // if (data.address_safename_enabled == 'no') {
                    //     profile = `Safename: Hidden <br />`
                    //     risk_score = ""
                    // }else {
                    profile = (user_data.address_safename) ? `Safename: <a  class="NH-chrome-child" target="_new" href="https://${user_data.address_safename.toLowerCase()}.safename.io">${user_data.address_safename}</a> <br />` : ""
                            risk_score = `| Profile Risk Score : ${user_data.profile_risk_score}`
                   // }

                   var formattedData = profile

                    for (var i=0; i<data.length; i++) {
                         var addr = data[i]
                         var status = (addr.address_status == "secure" || addr.address_status == "verified") ? `<span class="green">${addr.address_status}</span>` : `<span class="red">${addr.address_status}</span>`;
                         formattedData += `${addr.address}  Status :  ${status} ${risk_score} <br />  `;
                    }
                       
                       
    
                    
    
                        popup.removeClass('not-found')
                        popupContent.html(formattedData)
    
    
                    
                 
    
                    
                }   else {
                    var formattedData = ` Records not found. Submit Using  <a class="NH-chrome-child" target="_new" href="https://safeName.io">SafeName.io</a> `;
                    popup.addClass('not-found')
                    popupContent.html(formattedData)
                    //popup.hide()
                }
               

            });

        } else if (selectionStr != '' && selectionStr.length > 25 && selectionStr.length <= 42 && selectionStr.indexOf(' ') < 0 && !format.test(selectionStr)) {
            
            popup.show()
            popupContent.html('loading..')

            $.get(api_uri + '/sn/' + selectionStr, function (data) {

                if (window.getSelection) {
                    if (window.getSelection().empty) {  // Chrome
                        //   window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {  // Firefox
                        //  window.getSelection().removeAllRanges();
                    }
                }

                if (data && data.address) {
                    var formattedData = ""
                    var profile = ""
                    var risk_score = ""

                    var status = (data.address_status == "secure" || data.address_status == "verified") ? `<span class="green">${data.address_status}</span>` : `<span class="red">${data.address_status}</span>`;

                    if (data.address_safename_enabled == 'no') {
                        profile = `Safename: Hidden <br />`
                        risk_score = ""
                    } else {
                        profile = (data.address_safename) ? `Safename: <a  class="NH-chrome-child" target="_new" href="https://${data.address_safename.toLowerCase()}.safename.io">${data.address_safename}</a> <br />` : ""
                        risk_score = `| Profile Risk Score : ${data.profile_risk_score}`
                    }


                    formattedData = ` ${profile}  Status :  ${status} ${risk_score} <br /> ${data.address} <a class="NH-chrome-child" alt="copy address" title="copy address" id="copy-addr"><img  class="NH-chrome-child"   width="20" src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/ionicons/svg/md-copy.svg"></a> `;

                    popup.removeClass('not-found')
                    popupContent.html(formattedData)


                }
                else {
                    var formattedData = ` Records not found. Submit Using  <a class="NH-chrome-child" target="_new" href="https://safeName.io">SafeName.io</a> `;
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



    });





})
