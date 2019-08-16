var MyFile;
var errorEnum = { 
  "1": "Error_FindRed",
  "2": "Error_FindGreen",
  "3": "Error_Calibration",
  "4": "Error_LabelColor",
  "5": "Error_Reconstruct3D",
  "6": "Error_STLBuild",
  "7": "Error_CalculateFootIndex",
  "98": "Error_ImageRead",
  "99": "Error_Unknown",
};

// ----- On render -----
$(function () {

    $('#profile .dashes').addClass('dragging').removeClass('dragging');
});

$('#profile').on('dragover', function () {
  $('#profile').addClass('hideOnDrag');
    $('#profile .dashes').addClass('dragging showOnDrag');
  $('#profile label').addClass("showOnDrag");
}).on('dragleave', function () {
  $('#profile').removeClass('hideOnDrag');
    $('#profile .dashes').removeClass('dragging showOnDrag');
  $('#profile label').removeClass("showOnDrag");
}).on('drop', function (e) {
  $('#profile').removeClass('hideOnDrag');
    $('#profile .dashes').removeClass('dragging hasImage showOnDrag');
  $('#profile label').removeClass("showOnDrag");

    if (e.originalEvent) {
        var file = e.originalEvent.dataTransfer.files[0];

        var reader = new FileReader();

        MyFile = file;

        reader.readAsDataURL(file);
        reader.onload = onFileLoad;

    }
})
$('#profile').on('click', function (e) {
    $('#mediaFile').click();
});
window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
}, false);
$('#mediaFile').change(function (e) {

    var input = e.target;
    if (input.files && input.files[0]) {
        var file = input.files[0];
    MyFile = file;

        var reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = onFileLoad;
    }
})


function onFileLoad(e) {
  $('#profile').css('background-image', 'url(' + e.target.result + ')');
  $('#profile label').addClass("hasImage");
  $('#profile .dashes').addClass("hasImage");
}


function onUploadSuccess(data) {
  console.log('post done');
  $('#loader').hide();
  
  var isDraw = false;
  try {
    var foot = JSON.parse(data.replace(/NaN/g, "-1"));
    if ('errorCode' in foot) {
      throw false;
    }
  }
  catch (e) {
    showError("Failed Q_Q<br/>" + errorEnum[/[0-9]+/.exec(data)[0]]);
    return;
  }
  
  $('#foot').empty();
  for(var k in foot) {
    if(typeof foot[k] == "number")
      $('#foot').append(k + ': ' + foot[k].toFixed(2) + "<br/>");
    else if(typeof foot[k] != "object")
      $('#foot').append(k + ': ' + foot[k] + "<br/>");
    else
      if(!isDraw) { isDraw = true; removeAllMesh(); drawzq(foot[k]); }
    console.log(k);
  }
  
}

function onUploadFailed(e) {
  $('#loader').hide();
  
  var isDraw = false;
  showError("Failed Q_Q<br/>" + e);
}

$('#uploadFile').click(function (e) {
  var file = MyFile;
  if(!file) return;
  
  $('#loader').show();
  window.location.href = "#";
  
  var formData = new FormData();
  formData.append("file", file);
  formData.append("isLeft", document.getElementById("isLeft").checked);
  formData.append("isBefore", document.getElementById("isBefore").checked);
  
  var POSTURL = 'https://lea8lartoj.execute-api.us-east-2.amazonaws.com/default/Oemal-FAST'; 
  //var POSTURL = '/file_upload';
  
  $.ajax({
      url: POSTURL,
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
    dataType: 'text',
      success: onUploadSuccess,
    error: onUploadFailed
    
  });
  
});