function readFile() {
    if (this.files && this.files[0]) {

        var reader = new FileReader();

        reader.addEventListener("load", function (e) {
            document.getElementById("img").src = e.target.result;
        });

        reader.readAsDataURL(this.files[0]);
    }
}

function testPic() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            $('#mediaFile').val('');
            MyFile = this.response;
            $('#profile').css('background-image', 'url(' + 'https://raw.githubusercontent.com/VerliererK/oemal-fast/gh-pages/test.jpg' + ')');
            $('#profile label').addClass("hasImage");
            $('#profile .dashes').addClass("hasImage");
            //console.log(this.response, typeof this.response);
        }
    }
    xhr.open('GET', 'https://raw.githubusercontent.com/VerliererK/oemal-fast/gh-pages/test.jpg');
    xhr.responseType = 'blob';
    xhr.send();
}

function showError(msg) {
    $('#errorMsg').empty();
    $('#errorMsg').append(msg);
    window.location.href = "#errorModal";
}
