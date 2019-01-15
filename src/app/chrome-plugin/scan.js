chrome.storage.sync.get(['student', 'courseid', 'semester', 'moed'], function (data) {
  const pdfname = '000000000-' + data.semester + "-" + data.courseid + "-" + data.moed;
  alert(pdfname);
});
