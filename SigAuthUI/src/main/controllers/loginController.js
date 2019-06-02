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
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext('2d');

//Setting user's info on to window session
sessionStorage.setItem("authorization", "false");

/**
 * Function for logging in an existing user and setting the user information on the session storage
 */
function login(){
    let username = $("#username").get(0).value.toString();
    let password = $("#password").get(0).value.toString();

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
            toggleElement(loader);
            toggleDisableScreen();

            setTimeout(function(){
                console.log(msg);

                //Setting session information about the user
                sessionStorage.setItem("authorization", 'true');
                sessionStorage.setItem("user", username);
                sessionStorage.setItem("token", msg.token);

                toggleElement(loader);
                toggleDisableScreen();
                window.location = "../templates/signaturePage.html";
            }, 2000);

        },
        error: function (jgXHR, textStatus, errorThrown) {

            setTimeout(function(){
                toggleElement(loader);
                toggleDisableScreen();
                console.log(errorThrown);
                alert(textStatus);
            }, 2000);

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

    // let formData = new FormData();

    // formData.append("file_0", sig1);
    // formData.append("file_1", sig2);
    // formData.append("file_2", sig3);


    let formData = new FormData();
    formData.append('file_0', dataURLtoBlob(canvas.toDataURL("image/png")));


    if(password === confirmInput) {
        //Rest call for creating new user
        $.ajax({
            type: "POST",
            url: baseLoginURL + "create_tenant?password=" + password + '&username=' + username,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            //Cross Origin Support
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function (msg) {
                //Setting session information about the user
                sessionStorage.setItem("authorization", 'true');
                sessionStorage.setItem("user", username);
                sessionStorage.setItem("token", msg.token);
                window.location = "../templates/signaturePage.html"

            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                alert(textStatus);
            }
        });

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
    // let canvas = document.getElementById("myCanvas");

    let signature = canvas.toDataURL("image/png");



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
    // if (numOfSign === 1) {
    //     sig2 = signature;
    // }
    if (numOfSign > 1) {
        // sig3 = signature;
        // let formData = new FormData();
        // formData.append('files', sig1);
        createUser();
    }

    numOfSign++;
}

function cancel() {
    window.location = "../templates/login.html"
}

function toggleDisableScreen() {
    let overLay = document.getElementById("overLay");

    if(overLay != null){
        overLay.remove();
    } else {
        let div= document.createElement("div");
        div.id = "overLay";
        div.className += "overlay";
        document.body.appendChild(div);
    }
}

/**
 * function to convert the canvas data URL to a blob that will be added to a multipart file
 * @param dataurl
 * @returns {Blob}
 */
function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//----------------------------------------------- Canvas -------------------------------------------------------------//

/**
 * The following functions are event listeners used for the drawing on the canvas
 */
$('#myCanvas').mousedown(function(e){
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});

$('#myCanvas').mousemove(function(e){
    if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

$('#myCanvas').mouseup(function(e){
    paint = false;
});

$('#myCanvas').mouseleave(function(e){
    paint = false;
});

canvas.addEventListener("touchmove", function (e) {
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let paint;

function addClick(x, y, dragging)
{
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#000000";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for(let i=0; i < clickX.length; i++) {
        context.beginPath();
        if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            context.moveTo(clickX[i]-1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}

//  ------------------------------------------- Clear Canvas ----------------------------------------------------- //

function reset() {
    let canvas= document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    ctx.clearRect(0, 0,  canvas.width, canvas.height);
}
//-------------------------------------------^^^^ Clear Canvas ^^^^---------------------------------------------------//


//---------------------------------------------- Mobile Support ------------------------------------------------------//

// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
    mousePos = getTouchPos(canvas, e);
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
    let mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
    let rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);

//-----------------------------------------^^^^ Mobile Support ^^^^---------------------------------------------------//


//  ------------------------------------------^^^^ Canvas ^^^^--------------------------------------------------------//
