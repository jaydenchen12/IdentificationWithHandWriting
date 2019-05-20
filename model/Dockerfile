FROM python:3.7

RUN apt-get update -y

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD python3 server.py
