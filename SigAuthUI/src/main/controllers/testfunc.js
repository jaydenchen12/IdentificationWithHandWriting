let export_module = {};

var dataurl = "http://mlsignatureauth.com.s3-website-us-east-1.amazonaws.com/";
export_module.dataURLtoBlob = function(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
module.exports = export_module;