jQuery(function () {


      //coins taken from - https://safename.io/coins
      var coins = 
  [{"id":1,"text":"ETH"},{"id":2,"text":"BTC"},{"id":75,"text":"XRP"},{"id":12,"text":"BCH"},{"id":53,"text":"LTC"},{"id":35,"text":"EOS"},{"id":11,"text":"BNB"},{"id":15,"text":"BSV"},{"id":60,"text":"XMR"},{"id":9,"text":"AOA"},{"id":10,"text":"BAT"},{"id":14,"text":"BTG"},{"id":16,"text":"BTS"},{"id":17,"text":"BTT"},{"id":19,"text":"BTM"},{"id":21,"text":"LINK"},{"id":22,"text":"CCCX"},{"id":24,"text":"MCO"},{"id":25,"text":"CRO"},{"id":26,"text":"DAI"},{"id":27,"text":"DASH"},{"id":31,"text":"EKT"},{"id":32,"text":"EGT"},{"id":33,"text":"NRG"},{"id":34,"text":"ENJ"},{"id":3,"text":"ZRX"},{"id":38,"text":"GNT"},{"id":42,"text":"HT"},{"id":44,"text":"ICX"},{"id":45,"text":"INB"},{"id":47,"text":"MIOTA"},{"id":50,"text":"KCS"},{"id":51,"text":"LAMB"},{"id":5,"text":"ELF"},{"id":55,"text":"MKR"},{"id":6,"text":"AE"},{"id":67,"text":"ONT"},{"id":70,"text":"QTUM"},{"id":8,"text":"REP"},{"id":82,"text":"XLM"},{"id":84,"text":"XTZ"},{"id":87,"text":"TRX"},{"id":89,"text":"LEO"},{"id":90,"text":"USDC"},{"id":91,"text":"VET"},{"id":98,"text":"ZEC"},{"id":101,"text":"GPL"},{"id":102,"text":"MATIC"}]


  
    var  coin_hyphen_array = []

    for (var i in coins)
        {
             var str =   "-"+coins[i].text.toLowerCase();
             coin_hyphen_array.push(str);
        }



       // console.log(coin_hyphen_array);
      
        

    //NH-chrome-child is to look for click inside the popup container..so it can clear the text selection if any  //text selection will be left intact otherwise
    jQuery('body').append('<div id="NH-chrome-popupover"><div class="NH-popover-content NH-chrome-child "></div></div>')

    var popupContent = $(".NH-popover-content")
    var popup = $("#NH-chrome-popupover")


    

  



   // coin_hyphen_array.

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
     

        var res = selectionStr.match(/(-\w{3,5}$)/mig);
        

        var found = false
        
        //we found a hyphen match
        if(!found && res && res[0] != -1 && coin_hyphen_array.indexOf(res[0].toLowerCase()) >= 0) {
            found = true
        }

        if (!found && selectionStr.startsWith("safename:") || /\w{1,}.safename.io$/.test(selectionStr)) {
            found = true
        }



        if(!found && selectionStr != '' && selectionStr.length > 25 && selectionStr.length <= 42 && selectionStr.indexOf(' ') < 0 && !format.test(selectionStr)){
            found = true
        }
    
      
        //reverse lookup 
            if(found) {

            
            popup.show()
            popupContent.html('loading..')

            
            chrome.runtime.sendMessage(
                
                    {contentScriptQuery: "queryAnything", str: selectionStr},
                    data => {

                        if(data.error && data.error == "404") {
                            var formattedData = ` Records not found. Submit Using  <a class="NH-chrome-child" target="_new" href="https://safeName.io">SafeName.io</a> `;
                            popup.addClass('not-found')
                            popupContent.html(formattedData)
                        }
                if(data.SN_type) {
                    
                
                    var formattedData = ''
                   
                    if(data.SN_type == 'profile'  || data.SN_type == 'default') {
                        formattedData += (data.public_profile_safename) ? `Safename: <a  class="NH-chrome-child" target="_new" href="http://${data.url}">${data.public_profile_safename}</a> <br /> ${data.public_profile_safename}.safename.io | Profile Risk Score : ${data.profile_risk_score}` : " Profile is hidden "

                        if (data.SN_type == 'default') {
                               var address = (data.address) ? `<br /> ${data.coin_type} : ${data.address} ` : ""
                             formattedData += address

                             formattedData +=  (data.address_safename)? `<br /> Safename : ${data.address_safename} `: "";

                        }
                     

                    }

                    else if(data.SN_type == 'address') {


                        var status = (data.address_status == "secure" || data.address_status == "verified") ? `<span class="green">${data.address_status}</span>` : `<span class="red">${data.address_status}</span>`;

                        
                        if(data.address) {

                            formattedData +=  (data.address_safename)? `Safename : ${data.address_safename} <br />`: "";


                            formattedData += `${data.coin_type} : ${data.address} <a class="NH-chrome-child" alt="copy address" title="copy address" id="copy-addr"><img  class="NH-chrome-child"   width="20" src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/ionicons/svg/md-copy.svg"></a> <br /> Status :  ${status} | Address risk score : ${data.address_risk_score}  <br />

                            `;

                            
                        }
                       

                

                       

                        formattedData += (data.public_profile_safename) ? `Public profile : <a  class="NH-chrome-child" target="_new" href="http://${data.url}">${data.public_profile_safename}.safename.io</a>  | Profile Risk Score : ${data.profile_risk_score}` : " Profile is hidden "

                      
                     

                    }
                  
                    popup.removeClass('not-found')
                    popupContent.html(formattedData)

                    
                }  

                $("#copy-addr").click(function () {
                    copy(data.address)
                })


                    }
                        );

                }

            

        
        
      else {
            popup.hide()
        }



    });


    function copy(txt) {

        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(txt).select();
        document.execCommand("copy");
        $temp.remove();
        $copied = $("<span class='NH-chrome-popupover-copied-msg'>")
        $copied.html("Copied..")
        $copied.css({top: $("#NH-chrome-popupover #copy-addr").offset().top + 30, left: $("#NH-chrome-popupover #copy-addr").offset().left + 0, position:'absolute'})
        $("body").append($copied)
        setTimeout(function(){ $('.NH-chrome-popupover-copied-msg').remove(); }, 1000);

        
    }




})
