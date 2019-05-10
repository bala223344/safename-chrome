jQuery(function () {

    var details_api_uri = 'http://198.38.93.150/sn'
    //0xc8b759860149542a98a3eb57c14aadf59d6d89b9

    jQuery('body').append('<div id="NH-chrome-popupover"><div class="NH-popover-content"></div></div>')

    var popupContent = $(".NH-popover-content")
    var popup = $("#NH-chrome-popupover")

    jQuery("body").mouseup(function (e) {


        if (window.getSelection) {
            selection = window.getSelection();
        } else if (document.selection) {
            selection = document.selection.createRange();
        }


        var X = $('body').offset().left;
        var Y = $('body').offset().top;

        popup.css({ left: e.pageX, top: e.pageY })
        var selectionStr = selection.toString().trim()
        if (selectionStr != '' && selectionStr.length == 42) {
            popup.show()
            popupContent.html('loading..')

            $.get(details_api_uri + '/' + selectionStr, function (data) {
                if (data && data.addr && data.addr.safeuser) {

                    var status = (data.addr.safeuser.status) ? data.addr.safeuser.status : 'Not secured';
                    var formattedData = `<a target="_new" href="${data.addr.safeuser.alias}">${data.addr.safeuser.alias}</a> <br />  Status : ${status} | Credit Ratings : ${data.addr.safeuser.credit_score}`
                    if (window.getSelection) {
                        if (window.getSelection().empty) {  // Chrome
                            window.getSelection().empty();
                        } else if (window.getSelection().removeAllRanges) {  // Firefox
                            window.getSelection().removeAllRanges();
                        }
                    }
                    popupContent.html(formattedData)
                }
                else {
                    popup.hide()
                    console.log(data.addr);
                }

                //     $( ".result" ).html( data );
                //   alert( "Load was performed." );

            });
            details_api_uri


        } else {
            popup.hide()
        }





        //selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);




    });


})