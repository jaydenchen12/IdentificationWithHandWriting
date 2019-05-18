
//Init for placing the user name in the header
// var user = sessionStorage.getItem("user");
// if (user === undefined || user === null){
//     user = "Test User"
// }
// var welcome = document.getElementById("welcome");
// var newWelcome = document.createElement("h1");
// newWelcome.innerHTML("Welcome," + user);
// welcome.parentNode.replaceChild(mySpan, welcome);


//  ------------------------------------------- Save as image ---------------------------------------------------- //

/**
 * Function for saving the canvas signature as a PNG and upload to backend
 */
function saveAsPNG(){
    var canvas = document.getElementById("myCanvas");
    var img = canvas.toDataURL("image/png");

    var formData = new FormData();
    formData.append('files', dataURLtoBlob(img));

    // Ajax call to hit the rest call for uploading signatures
    $.ajax({
      type: 'POST',
      url:"http://localhost:5000/Signature/verify_signature/?token=asd&username=asd",
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
      success: function(msg){
          alert('PNG has successfully been uploaded!');
      },
      error: function(xhr, ajaxOptions, thrownError){
          alert('Error contacting server!');
      }
    });
}

/**
 * function to convert the canvas data URL to a blob that will be added to a multipart file
 * @param dataurl
 * @returns {Blob}
 */
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}


/**
 * Function for when the submit button is clicked for uploading a .png
 */
$(document).ready(function () {

    $("#submitBtn").click(function (event) {

        //Stop the submit functionality so it can be done manually below
        event.preventDefault();

        //Grabbing the form element from the template
        var form = $('#fileUploadForm')[0];

        // Create an FormData object to be sent as a multipart file
        var data = new FormData(form);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url:"http://localhost:5000/Signature/verify_signature/?token=asd&user_name=asd",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            //Cross Origin Support
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function (data) {
                console.log("SUCCESS : ", data);
                alert(data.toString());
            },
            error: function (e) {
                console.log("ERROR : ", e);
            }
        });

    });

});

//----------------------------------------^^^^ Save as image ^^^^-----------------------------------------------------//



//----------------------------------------------- Canvas -------------------------------------------------------------//
var canvas = document.getElementById("myCanvas");
var context = document.getElementById("myCanvas").getContext("2d");

/**
 * The following functions are event listeners used for the drawing on the canvas
 */
$('#myCanvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

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
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

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

    for(var i=0; i < clickX.length; i++) {
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
    var canvas= document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
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
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
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
