/***
*Dhruv Patel
*Testing mass uploads
*Performs 754 asynchronous requests of image uploads and counts how many requests were dropped 
**/
const fs = require('fs')
const request = require('request')

// count is the number dropped and num is the total sent
let count = 0;
let num = 0;

/**
directory - path to directory full of PNG files
reads all the files in parallel and performs a POST request to upload file
**/
function readDir(directory){
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
            files.forEach((file, index) => {
                    //console.log(typeof(fileStream))
                    fileStream = fs.createReadStream(directory + '/' + file);
                    post(fileStream).then(() => {
                        if(num === files.length){
                            console.log('missed uploads: ', count);
                        }
                    });

        });
        
    });
}
/**
file -  a Stream object that reads file then is sent using HTTP POST
returns a Promise so that the counting can be done synchronously there for the totals are tallied only after all requests are sent.
**/
function post(file){
    return new Promise((resolve) => {
        request.post({
                method: 'POST',
                url: 'http://localhost:5000/Signature/verify_signature/',
                formData: {
                    files:file,
                }
            }, (err, res, body) => {
                    if (body == undefined)
                        count++;
                    num++
                    console.log(body, count + '/' + num);
                    resolve();
                }
        );
    });
}

//post(fs.createReadStream('index.png'));

readDir(process.argv[2]);


