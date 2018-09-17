FROM ubuntu:16.04

MAINTANER Jayden Chen "jaydenchen12@gmail.com"

RUN apt-get update -y && \
    apt-get install -y python-pip python-dev

RUN mkdir -p /tensorflow/models

RUN apt-get install -y git python-pip

RUN pip install tensorflow

RUN apt-get install -y protobuf-compiler python-pil python-lxml

RUN pip install jupyter

RUN pip install matplotlib

RUN git clone https://github.com/tensorflow/models.git /tensorflow/models

WORKDIR /tensorflow/models/research

RUN protoc object_detection/protos/*.proto --python_out=.

RUN export PYTHONPATH=$PYTHONPATH:`pwd`:`pwd`/slim

RUN jupyter notebook --generate-config --allow-root

EXPOSE 8888
