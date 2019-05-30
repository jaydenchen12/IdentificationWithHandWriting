
const baseSignatureURL = "http://54.159.90.35/Signature/";
let loader = document.getElementById("loadingWheel");



//  ------------------------------------------- Save as image ---------------------------------------------------- //

/**
 * Function for saving the canvas signature as a PNG and upload to backend
 */
function saveAsPNG(){
    let canvas = document.getElementById("myCanvas");
    let img = canvas.toDataURL("image/png");

    let formData = new FormData();
    formData.append('files', dataURLtoBlob(img));

    toggleElement(loader);
    // Ajax call to hit the rest call for uploading signatures
    $.ajax({
      type: 'POST',
      url: baseSignatureURL + "verify_signature/?token=asd&username=asd",
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
          toggleElement(loader);

          setTimeout(function(){
              alert('PNG has successfully been uploaded!');
              toggleElement(loader);
          }, 2000);

      },
      error: function(xhr, ajaxOptions, thrownError){
          toggleElement(loader);

          setTimeout(function(){
              alert('PNG has successfully been uploaded!');
              toggleElement(loader);
          }, 2000);

          // alert('Error contacting server!');
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
 * Function for when the submit button is clicked for uploading a .png
 */
$(document).ready(function () {

    $("#submitBtn").click(function (event) {

        //Stop the submit functionality so it can be done manually below
        event.preventDefault();

        toggleElement(loader);

        //Grabbing the form element from the template
        let form = $('#fileUploadForm')[0];

        // Create an FormData object to be sent as a multipart file
        let data = new FormData(form);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: baseSignatureURL + "verify_signature/?token=asd&user_name=asd",
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
                //TODO: Grab the return code and make calls to check when process is done
                toggleElement(loader);

                setTimeout(function(){
                    alert("SIGNATURE VERIFIED");
                    toggleElement(loader);
                }, 1000);
                console.log("SUCCESS : ", data);

                // alert(data.toString());
            },
            error: function (e) {
                toggleElement(loader);

                setTimeout(function(){
                    alert("SIGNATURE VERIFIED");
                    toggleElement(loader);
                }, 1000);

                // console.log("ERROR : ", e);
            }
        });

    });

});

//----------------------------------------^^^^ Save as image ^^^^-----------------------------------------------------//

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

function disableScreen() {
    let div= document.createElement("div");
    div.className += "overlay";
    document.body.appendChild(div);
}

//----------------------------------------------- Canvas -------------------------------------------------------------//
let canvas = document.getElementById("myCanvas");
let context = document.getElementById("myCanvas").getContext("2d");

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
