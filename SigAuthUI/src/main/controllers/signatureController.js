
//  ----------------------------------------------- Canvas ------------------------------------------------------- //
var canvas = document.getElementById("myCanvas");
var context = document.getElementById("myCanvas").getContext("2d");

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

//-------------------------- Mobile Support -------------------------------//

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

//----------------------^^^^ Mobile Support ^^^^---------------------------//


//  ------------------------------------------^^^^ Canvas ^^^^-------------------------------------------------- //


//  ------------------------------------------- Save as image ---------------------------------------------------- //

function saveAsPNG(){
    var canvas = document.getElementById("myCanvas");

    var newCanvas = cloneCanvas(canvas);
    var imgDiv = document.getElementById("imageDiv");
    imgDiv.appendChild(newCanvas);

    var img = canvas.toDataURL("image/png");

    var formData = new FormData();
    formData.append('file', dataURLtoBlob(img));

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

    //Fake return message to users
    alert('PNG has successfully been uploaded!');

}

function uploadPNG(evt){
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'].join('');
                document.getElementById('imageDiv').insertBefore(span, null);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
        var formData = new FormData();
        formData.append('uploadedPNG', dataURLtoBlob(reader.result));
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            processData: false,  // Important!
            contentType: false,
            cache: false,
            url:"http://localhost:5000/Signature/verify_signature/?token=asd&username=asd",
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
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var newContext = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    newContext.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

//  ------------------------------------------- Save as image ---------------------------------------------------- //



//  ------------------------------------------- Clear Canvas ----------------------------------------------------- //

function reset() {
    var canvas= document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    ctx.clearRect(0, 0,  canvas.width, canvas.height);
}
//  ------------------------------------------- Clear Canvas ----------------------------------------------------- //

$(document).ready(function () {

    $("#submitBtn").click(function (event) {

        //stop submit the form, we will post it manually.
        event.preventDefault();

        var form = $('#fileUploadForm')[0];

        // Create an FormData object
        var data = new FormData(form);


        // disabled the submit button
        $("#submitBtn").prop("disabled", true);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url:"http://localhost:5000/Signature/verify_signature/?token=asd&user_name=asd",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                console.log("SUCCESS : ", data);
                $("#submitBtn").prop("disabled", false);

            },
            error: function (e) {
                console.log("ERROR : ", e);
                $("#submitBtn").prop("disabled", false);

            }
        });

    });

});