# Signature-Matching-With-Tensorflow

Signature verification through handwriting analysis is one of the most common tasks in forensic document analysis. It is very important to compare questioned writing/signatures with the genuine one, when it comes to data protection and identity management. We are utilizing machine learning techniques to perform handwriting analysis by matching images of a questioned handwriting with the genuine ones to authenticate writing/signatures. Machine Learning algorithms will adapt and improve their performance as the number of handwriting samples increase for learning and do more accurate analysis.

Tech Stack:
- Python
- Flask
- Tensorflow
- MongoDB
- NodeJs (for testing)

To run the pipeline do the following:

```bash
docker-compose up
```

This will put the backend up. To use the front end just open the file

```
SigAuthUI/src/main/templates/signaturePage.html
```
in your browser!.



### Installing Project on EC2
```bash
# First we need to chmod 400 out public key
$path = ".\MLSigBackend.pem"
# Reset to remove explict permissions
icacls.exe $path /reset
# Give current user explicit read-permission
icacls.exe $path /GRANT:R "$($env:USERNAME):(R)"
# Disable inheritance and remove inherited permissions
icacls.exe $path /inheritance:r

# Now we can ssh into the EC2
ssh -i "MLSigBackend.pem" ubuntu@ec2-35-173-252-77.compute-1.amazonaws.com


#Grant super user
sudo su

#Update apt-get
apt-get update

#install git
apt-get install git-core

##########Docker Installation##########

sudo apt-get update

sudo apt-get install \
    apt-transport-https \#!/Login/post_login
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

#######################################

#For running the docker container persistantly
docker run -d --restart=always -p 80:80 -t my_flask_app

########Messing around with API ports###########

docker build -t api .
docker run --rm -it -p 80:5000 api

##Closing containers
docker-compose down
--volume (Full teardown)
```

### Testing the Backend Endpoints

To test the backend endpoints simply go to [localhost](http://localhost:)

Here you will see 4 different endpoints to test 

- /Login/create_tenant
- /Login/login_tenant
- /Signature/check_status
- /Signature/verify_signature

You can click on them to expand and then there will be fields to enter input thru. It will make calls to the API and return results.

### End to End and Performance Testing

Navigate to the testing folder. `cd testing`
  
To install the needed dependencies you can run 

```bash
npm i
```
In th there are folders with images for testing and a script to act as a client that sends all the pictures in a folder with 1 image per request asynchronously.

Each directory has a different number of imgs (125, 250, 500, 750, 1000).
You pass the name of the directory as an argument like so:
```bash
node upload.js img2
```

The results will print the body returned fromeach requests as well as the number of total requests sent and any failed deliveries.

If you are interested in timing, I used the simple `time` utility from my Unix shell. So my commands looked like this:

```bash
time node upload.js img2
```

    
