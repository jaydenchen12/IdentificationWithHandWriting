//Setting user's info on to window session
sessionStorage.setItem("authorization", false);


/**
 * Function for logging in an existing user and setting the user information on the session storage
 */
function login(){
    var username = $("#username").get(0).value.toString();
    var password = $("#password").get(0).value.toString();

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
}

/**
 * function for creating a new user after they have recorded their signatures
 */
function createUser(){
    var username = $("#username").get(0).value.toString();
    var password = $("#password").get(0).value.toString();
    var confirmInput = $("#confirmInput").get(0).value.toString();

    if(password === confirmInput) {
        //Rest call for creating new user
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/create_tenant?password=" + password + '&username=' + username,
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

        window.location = "../templates/signaturePage.html"
    } else {
        alert("Passwords do not match!")
    }
}

/**
 * Function for toggling the buttons and input fields needed to create a new user
 */
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
    toggleElement(signUp);
}

/**
 * Function for showing and hiding elements using the display style
 * @param x
 */
function toggleElement(x){
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}



/**
 * Function for keeping track of the number of signatures a new user has created
 */
var numOfSign = 0;
function next() {

    //Making a copy of the canvas to save in an array
    var canvas = document.getElementById("myCanvas");

    //For exporting canvas as png
    var img = canvas.toDataURL("image/png");

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
        var loginBtn = document.getElementById("loginBtn");

        toggleElement(instructions);
        toggleElement(createBtn);
        toggleElement(nextBtn);
        toggleElement(loginBtn);
        toggleElement(canvas);

        createUser();
    }
}

