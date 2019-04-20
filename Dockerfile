FROM ubuntu:latest
RUN apt-get update -y
RUN apt install python3-pip -y
COPY ./ ./
WORKDIR /api/
RUN ls
RUN pip3 install -r requirements.txt
EXPOSE 5000
CMD python3 api.py
