let headerLbl = document.getElementById('headerLbl').innerText;
let student = document.getElementById('LabelStudent').innerText;

let semesterArr = headerLbl.match(/0\d\/20\d\d/g)[0].split('\/');

chrome.storage.sync.set({
  'student': student,
  'courseid': headerLbl.substr(0, 6),
  'semester': semesterArr[1]+semesterArr[0]
}, function(){});

let scan_btns = getAllScanButtons();

for (let i = 0; i < scan_btns.length; i++) {
  scan_btns[i].addEventListener('click', function () {
    const moedMap = {'A' : 1, 'B' : 2, 'C' : 3};
    const moedStr = this.parentNode.parentNode.childNodes[5].innerText.split('_')[1];

    chrome.storage.sync.set({
      'moed': moedMap[moedStr]
    }, function(){});
  });
}

function getAllScanButtons(){
  const all_btns = document.getElementsByClassName('btn');
  let scan_btns = [];

  for (var i = 0; i < all_btns.length; i++) {
    const btn = all_btns[i];

    if (btn.className.match(/scan./g)) {
      scan_btns.push(btn);
    }
  }

  return scan_btns;
}
