FROM python:3.7

RUN apt-get update -y

COPY . .

RUN pip install -r requirements.txt

CMD python3 server.py
