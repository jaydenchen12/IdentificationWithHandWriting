!#/bin/bash

docker build -t ml-worker:first . && docker run -it --net skynet ml-worker:first



