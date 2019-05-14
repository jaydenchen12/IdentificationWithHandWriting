!#/bin/bash

docker build -t ml-api:first . && docker run -it -p 5000:5000 --net skynet ml-api:first
