FROM python:3.7
RUN apt-get update -y

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . . 

EXPOSE 5000

CMD python3 api.py
