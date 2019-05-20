#!/bin/sh

docker network create skynet

docker rm rabbit

docker run -p 5672:5672 --net skynet --name "rabbit" rabbitmq:latest



