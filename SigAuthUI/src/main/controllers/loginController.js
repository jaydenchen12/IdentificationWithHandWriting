//Setting user's info on to window session
sessionStorage.setItem("authorization", false);

function login(){
    var username = $("#username").get(0).value.toString();
    var password = $("#password").get(0).value.toString();

    //Base64 encoding of the password before sending to the server
    var encodedPass = btoa(password);

    // var json = {username:username , password:encodedPass};
    // var userInfo = {username:username , password:password};
    // var json = userInfo.serializeJSON();
    // console.log(json);

    $.ajax({
        type: "POST",
        url: 'http://localhost:5000/Login/login_tenant?password=' + password + '&username=' + username,
        contentType: 'application/json',
        accept: 'application/json',
        //Cross Origin Support
        cors: true ,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function (msg) {
            console.log(msg);
            sessionStorage.setItem("authorization", true);
            sessionStorage.setItem("user", username);
            window.location = "../templates/signaturePage.html";
        },
        error: function (jgXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            alert(textStatus);
        }
    });
    // window.location = "../templates/signaturePage.html";
}


function createUser(){
    var username = $("#username").get(0).value.toString();
    var password = $("#password").get(0).value.toString();
    var confirmInput = $("#confirmInput").get(0).value.toString();

    //Base64 encoding of the password before sending to the server
    var encodedPass = btoa(password);
    if(password === confirmInput) {
        //Rest call for creating new user
        var json = {username: username, password: encodedPass};
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/createUser",
            data: json,
            dataType: "html",
            //Cross Origin Support
            cors: true ,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function (msg) {
                signUp();
                alert("User Successfully Created! You May Now Login.");
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                alert(textStatus);
            }
        });
        alert("User Successfully Created");

        //Faking the creation of user by storing the user information on the session storage
        sessionStorage.setItem("User", username);

        window.location = "login.html"
    } else {
        alert("Passwords do not match!")
    }
}

function signUp() {
    var confirmInput = document.getElementById("confirmInput");
    var confirmText = document.getElementById("confirmText");
    var loginBtn = document.getElementById("loginBtn");
    var nextBtn = document.getElementById("nextBtn");
    var canvas = document.getElementById("myCanvas");
    var instructions = document.getElementById("instructions");
    // var cancel = document.getElementById("cancel");
    var signUp = document.getElementById("signUp");

    toggleElement(confirmInput);
    toggleElement(confirmText);
    toggleElement(loginBtn);
    toggleElement(canvas);
    toggleElement(nextBtn);
    toggleElement(instructions);
    // toggleElement(cancel);
    toggleElement(signUp);
}

//Function for showing and hiding elements using the display style
function toggleElement(x){
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


var numOfSign = 0;
function next() {

    //Making a copy of the canvas to save in an array
    var canvas = document.getElementById("myCanvas");
    var newCanvas = cloneCanvas(canvas);
    var imgDiv = document.getElementById("imageDiv");

    //For exporting canvas as png
    var img = canvas.toDataURL("image/png");
    imgDiv.appendChild(newCanvas);
    // document.write('<img src="'+img+'"/>');

    //Resetting canvas
    var ctx = canvas.getContext('2d');
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    numOfSign++;

    if (numOfSign > 2) {
        var nextBtn = document.getElementById("nextBtn");
        var createBtn = document.getElementById("createBtn");
        var instructions = document.getElementById("instructions");
        // var confirm = document.getElementById("confirm");
        var loginBtn = document.getElementById("loginBtn");

        toggleElement(instructions);
        toggleElement(createBtn);
        toggleElement(nextBtn);
        toggleElement(loginBtn);
        toggleElement(canvas);
        // toggleElement(confirm);

        createUser();
    }
}

