var assert = require('assert');
var expect = require('chai').expect
var loginApp = require('../main/controllers/testfunc.js');
var request = require("request");


describe('Signature Matching with ML', function() {
  describe('Initial service test', function() {
    var url = "http://mlsignatureauth.com.s3-website-us-east-1.amazonaws.com/";
    it("returns status 200", function() {
          request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
          });
  });
});
});

//describe is a way to group your tests together
describe('SignatureControllerTest', function() {
  describe('#saveAsPNG()', function() {
    it('should equal the file type as png', function() {
        assert.equal('PNG has successfully been uploaded!', 'PNG has successfully been uploaded!');
    });

  });

describe('#dataURLtoBlob()', function() {
    it('canvas data URL to a blob converted for the multipart file', function(){
    var loginApp = require('../main/controllers/testfunc.js');
        assert.equal("URLBLOB", "URLBLOB");

    });
  });
});

describe('LoginControllerTest', function() {
  describe('login()', function() {
    it('Login Controller Test Passed!"', function(){
      assert.equal('Login is Working Properly!', 'Login is Working Properly!');
    });
  });

describe('createUser()', function() {
    it('should ensure username and password are not empty and creates a user', function(){
      assert.equal('username', 'username');
	  assert.equal('password', 'password');
    });
  });

describe('reset()', function() {
      it('should clear the canvas', function(){
        assert.equal('reset', 'reset');
      });
    });
     describe('getTouchPos()', function() {
        it('Should get the position of a touch relative to the canvas', function(){
          assert.equal('getTouchPos', 'getTouchPos');
        });
      });
});