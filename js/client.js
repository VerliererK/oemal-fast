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
            $('#profile').css('background-image', 'url(' + 'https://cdn.glitch.com/034b2a68-30f8-4128-8780-8962b74387b3%2Ftest.jpg?v=1565545089944' + ')');
            $('#profile label').addClass("hasImage");
            $('#profile .dashes').addClass("hasImage");
            //console.log(this.response, typeof this.response);
        }
    }
    xhr.open('GET', 'https://cdn.glitch.com/034b2a68-30f8-4128-8780-8962b74387b3%2Ftest.jpg?v=1565545089944');
    xhr.responseType = 'blob';
    xhr.send();
}

function showError(msg) {
    $('#errorMsg').empty();
    $('#errorMsg').append(msg);
    window.location.href = "#errorModal";
}
