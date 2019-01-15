let scan_buttons = document.getElementsByClassName("scan");

for (let i = 0; i < scan_buttons.length; i++) {
  scan_buttons[i].addEventListener('click', function(){
    alert("clicked :-)");
  });
}
