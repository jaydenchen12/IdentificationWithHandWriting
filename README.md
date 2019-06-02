# Signature-Matching-With-Tensorflow

Signature verification through handwriting analysis is one of the most common tasks in forensic document analysis. It is very important to compare questioned writing/signatures with the genuine one, when it comes to data protection and identity management. We are utilizing machine learning techniques to perform handwriting analysis by matching images of a questioned handwriting with the genuine ones to authenticate writing/signatures. Machine Learning algorithms will adapt and improve their performance as the number of handwriting samples increase for learning and do more accurate analysis.

Tech Stack:
Python
Flask
Tensorflow
MongoDB backend
Objectstore

To run the pipeline do the following:

```bash
docker-compose up
```
### Installing Project on EC2

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
    apt-transport-https \
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

##Closeing containers
docker-compose down
--volume (Full teardown)


