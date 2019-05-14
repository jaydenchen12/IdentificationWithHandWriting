#!/bin/sh

docker create network skynet

docker rm rabbit

docker run -p 5672:5672 --net skynet --name "rabbit" rabbitmq:latest



