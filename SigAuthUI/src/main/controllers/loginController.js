/**
 * File Created By: Anthony Montefiore
 * Unless there a bug then it was made by Andrew Vo
 */

//Base URL
const baseLoginURL = "http://54.159.90.35/Login/";

//Signature tracker
let numOfSign = 0;

//Sign up signatures
let sig1;
let sig2;
let sig3;

let loader = document.getElementById("loadingWheel");

//Setting user's info on to window session
sessionStorage.setItem("authorization", false);


/**
 * Function for logging in an existing user and setting the user information on the session storage
 */
function login(){
    let username = $("#username").get(0).value.toString();
    let password = $("#password").get(0).value.toString();

    toggleElement(loader);
    $.ajax({
        type: "POST",
        url: baseLoginURL + 'login_tenant?password=' + password + '&username=' + username,
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

            disableScreen();
            toggleElement(loader);

            setTimeout(function(){
                window.location = "../templates/signaturePage.html";
            }, 1000);

        },
        error: function (jgXHR, textStatus, errorThrown) {

            disableScreen();
            toggleElement(loader);

            setTimeout(function(){
                window.location = "../templates/signaturePage.html";
            }, 1000);

            // console.log(errorThrown);
            // alert(textStatus);
        }
    });
}

/**
 * function for creating a new user after they have recorded their signatures
 */
function createUser(){
    let username = $("#username").get(0).value.toString();
    let password = $("#password").get(0).value.toString();
    let confirmInput = $("#confirmInput").get(0).value.toString();

    let formData = new FormData();

    formData.append("files", sig1);
    formData.append("files", sig2);
    formData.append("files", sig3);

    if(password === confirmInput) {
        //Rest call for creating new user
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/create_tenant?password=" + password + '&username=' + username,
            //Cross Origin Support
            cors: true ,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
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
    let confirmInput = document.getElementById("confirmInput");
    let confirmText = document.getElementById("confirmText");
    let loginBtn = document.getElementById("loginBtn");
    let nextBtn = document.getElementById("nextBtn");
    let canvas = document.getElementById("myCanvas");
    let instructions = document.getElementById("instructions");
    let cancel = document.getElementById("cancel");
    let signUp = document.getElementById("signUp");

    toggleElement(confirmInput);
    toggleElement(confirmText);
    toggleElement(loginBtn);
    toggleElement(canvas);
    toggleElement(nextBtn);
    toggleElement(instructions);
    toggleElement(signUp);
    toggleElement(cancel);
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
function next() {

    //Making a copy of the canvas to save in an array
    let canvas = document.getElementById("myCanvas");

    let signature = canvas.toDataURL("image/png");

    let formData = new FormData();
    formData.append('files', signature);

    //Resetting canvas
    let ctx = canvas.getContext('2d');
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Assigning the signature to their global letiables so the create user function can grab them
    if (numOfSign === 0) {
        sig1 = signature;
    }
    if (numOfSign === 1) {
        sig2 = signature;
    }
    if (numOfSign > 2) {
        sig3 = signature;
        createUser();
    }

    numOfSign++;
}

function cancel() {
    window.location = "../templates/login.html"
}

function disableScreen() {
    let div= document.createElement("div");
    div.className += "overlay";
    document.body.appendChild(div);
}