// //Importing node modules
// 'use strict';
// var http = require('http');
// var fs = require('fs');
// var express = require("express");
// var request = require("request");
// var cors = require('cors');
// var bodyParser = require('body-parser');
// var app = express();
//
//
//
// //--------------- This is all need for the redirect because nodeJS is stupid and its the only way i found to fixing the
// //--------------- cross origins error for loading html pages. --------------------------------------------------------//
// app.use(express.static('./scr/'));
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());
//
// //Pointing express to the current directory and declaring cross origin support
// app.use(express.static("."), cors({
//     'origin': '*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': false
// }));
//
// //--------------------------------------------------------------------------------------------------------------------//
//
// // //Create an instance of a mysql connection
// // var mysql = require('mysql');
// // var con = mysql.createConnection({
// //     host: 'localhost',
// // //	port: '3333',
// //     user: 'root',
// //     password: 'password',
// //     database: 'escortDB'
// // });
// // //Connecting to the new mySql instance
// // con.connect(function (err) {
// //     if (err) {
// //         console.log(err);
// //     } else {
// //         console.log('Successfully connected to database');
// //     }
// // });
//
// app.get('/login', function(req, res) {
//
//     var username = req.query.username;
//     var password = req.query.password;
//     //TODO: This is the connection to our database containing the users
//     // var query = "SELECT * FROM users WHERE users.u_name=\""+ username + "\"";
//     //
//     // con.query(query, function (err, rows) {
//     //     if (err) {
//     //         console.log(err);
//     //         return 'Error processing query.';
//     //     } else {
//     //         console.log(rows);
//     //         if(rows[0].secret.toString() === password){
//     //             res.setHeader('Access-Control-Allow-Origin', '*');
//     //
//     //             res.setHeader("Content-Type", "html");
//     //
//     //             res.redirect("public/signaturePage.html");
//     //         }
//     //     }
//     // });
//
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     //
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.setHeader("Content-Type", "application/x-www-form-urlencoded");
//
//     res.redirect("public/signaturePage.html");
//
// });
//
// app.get('/createUser', function(req, res) {
//
//     var username = req.query.username;
//     var password = req.query.password;
//     // var query = "INSERT INTO `users` VALUES (DEFAULT, \""+ username + "\"," + " \"" + password + "\"," + " null," + " null," + " null)" ;
//
//
//     //TODO: Query for creating a new user
//     // con.query(query, function (err, rows) {
//     //     if (err) {
//     //         console.log(err);
//     //         return 'Error processing query.';
//     //     } else {
//     //         res.send({ result: "good" });
//     //     }
//     // });
//
//     res.send({ result: "good" });
// });
//
// //Returning the table page HTML
// app.post('/saveSig', function (req,res){
//      res.send(".PNG Recieved!");
// });
//
// //Redirect to home page
// app.get('*',function (req, res) {
//     res.redirect('./signaturePage.html');
// });
//
// //Listening to port 8080
// app.listen(8080,function(){
//     console.log('Server Running');
// });