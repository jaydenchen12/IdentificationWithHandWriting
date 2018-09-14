FROM ubuntu:16.04

MAINTANER Jayden Chen "jaydenchen12@gmail.com"

RUN apt-get update -y && \
    apt-get install -y python-pip python-dev

COPY ./requirements.txt /api/requirements.txt

WORKDIR /api

RUN pip install -r requirements.txt

COPY . /api

ENTRYPOINT [ "python" ]

CMD [ "api.py" ]