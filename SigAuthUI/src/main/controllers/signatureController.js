//Base URL to Signature Services
const baseSignatureURL = "http://54.159.90.35/Signature/";

//Loading Wheel
let loader = document.getElementById("loadingWheel");

//User Information
let user = sessionStorage.getItem("user");
let token = sessionStorage.getItem("token");

//Canvas Elements
let canvas = document.getElementById("myCanvas");
let context = document.getElementById("myCanvas").getContext("2d");

//Creating Greeting
if(user != null){
    let para = document.createElement("p");

    para.id = "userWelcome";
    para.alignContent = "center";
    para.textContent = "Hello, " + user + ".";

    let element = document.getElementById("content");
    let child = document.getElementById("Instructions");
    element.insertBefore(para,child);
}
//  ------------------------------------------- Save as image ---------------------------------------------------- //

/**
 * Function for saving the canvas signature as a PNG and upload to backend
 */
function saveAsPNG(uploadedPNG){

    let data;

    if(uploadedPNG != null){
        data = uploadedPNG;
    } else {
        let canvas = document.getElementById("myCanvas");
        let img = canvas.toDataURL("image/png");

        data = new FormData();
        data.append('files', dataURLtoBlob(img));
    }


    toggleElement(loader, true);
    // Ajax call to hit the rest call for uploading signatures
    $.ajax({
      type: 'POST',
      url: baseSignatureURL + "verify_signature/?token=" + token + "&username="+ user,
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      cache: false,
      data: data,
      //Cross Origin Support
      cors: true,
      headers: {
         'Access-Control-Allow-Origin': '*'
      },
      success: function(msg){
          toggleElement(loader, true);
          toggleDisableScreen();

          setTimeout(function(){
              toggleElement(loader, false);
              toggleDisableScreen();
              getRecordStatus(msg);
          }, 2000);

      },
      error: function(e){
          toggleElement(loader, true);
          toggleDisableScreen();

          setTimeout(function(){
              toggleElement(loader, false);
              toggleDisableScreen();
              alert('Error while processing signature!');
              console.log("error:", e);
          }, 2000);

      }
    });
}

/**
 * Function for when the submit button is clicked for uploading a .png
 */
$(document).ready(function () {

    $("#submitBtn").click(function (event) {

        //Stop the submit functionality so it can be done manually below
        event.preventDefault();

        //Grabbing the form element from the template
        let form = $('#fileUploadForm')[0];

        // Create an FormData object to be sent as a multipart file
        let data = new FormData(form);
        saveAsPNG(data);
    });

});

//----------------------------------------^^^^ Save as image ^^^^-----------------------------------------------------//



function getRecordStatus(recordID){

    $.ajax({
        type: "GET",
        url: baseSignatureURL + "check_status/?record_id=" + recordID,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function (data) {
            if(data.status === "complete"){
                alert("You have been successfully: " + data.authorized.toUpperCase() + ".\nWith a confidence level of: " + data.confidence.toPrecision(5));
            }
            console.log("SUCCESS : ", data);
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });

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

/**
 * Function for showing and hiding elements using the display style
 * @param x
 * @param onOff
 */
function toggleElement(x , onOff){
    if(onOff) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
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
