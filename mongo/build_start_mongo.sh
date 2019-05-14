#!/bin/sh

docker build -t mongodocker . && docker run -p 27017:27017 --network skynet --name "mongodocker" -it mongodocker