chrome.storage.sync.get(['student', 'courseid', 'semester', 'moed'], function (data) {
  const pdfname = '000000000-' + data.semester + "-" + data.courseid + "-" + data.moed;


  function create(htmlStr) {
    var frag = document.createDocumentFragment(),
      temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    return frag;
  }

  const fragment = create('\
      <style>\
        .scan-popup {\
          position: absolute;\
          top: 25px;\
          right: 40px;\
          background: #f6f6f6de;\
          border-radius: 10px;\
          width: 180px;\
          direction: rtl;\
          padding: 20px 25px;\
          text-align: center;\
          font-family: arial, sans-serif;\
        }\
        \
        .scan-popup a {\
          background: #28a745;\
          color: #ffffff;\
          text-decoration: none;\
          padding: 8px 20px;\
          border-radius: 5px;\
          margin-top: 10px;\
          display: inline-block;\
         }\
        .close-s {\
          position: absolute;\
          top: 15px;\
          right: 35px;\
          background: #292929;\
          color: #fff;\
          border-radius: 10px;\
          direction: rtl;\
          padding: 2px 5px;\
          text-align: center;\
          font-family: arial, sans-serif;\
          z-index: 5000;\
          }\
        .hide {\
          -moz-animation: cssAnimation 0.3s linear 15s forwards;\
          /* Firefox */\
          -webkit-animation: cssAnimation 0.3s linear 15s forwards;\
          /* Safari and Chrome */\
          -o-animation: cssAnimation 0.3s linear 15s forwards;\
          /* Opera */\
          animation: cssAnimation 0.3s linear 15s forwards;\
          -webkit-animation-fill-mode: forwards;\
          animation-fill-mode: forwards;\
        }\
        @keyframes cssAnimation {\
          to {\
            width:0;\
            height:0;\
            padding:0px 0px;\
            overflow:hidden;\
          }\
        }\
        @-webkit-keyframes cssAnimation {\
          to {\
            width:0;\
            height:0;\
            padding:0px 0px;\
            display:none;\
          }\
        }\
      </style>\
      <span class="close-s hide" id="close" onclick="document.getElementById(`scan-pop`).style.display=`none`; document.getElementById(`close`).style.display=`none`">x</span>\
      <div class="scan-popup hide" id="scan-pop">\
        <img src="https://testock.tk/assets/images/testock-logo.png" width="190" style="display:block; margin-bottom: 10px;">\
        <a target="_blank" href="http://localhost:4200/upload/' + window.location.href.slice(51) + '/' + pdfname + '   ">העלה את הסריקה</a>\
      </div>\
    ');
  document.body.insertBefore(fragment, document.body.childNodes[0]);

});
