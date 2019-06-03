FROM python:3.7
RUN apt-get update -y

COPY requirements.txt .

RUN pip3 install -r requirements.txt

RUN pip3 install gunicorn

COPY . . 

EXPOSE 5000

CMD gunicorn -b 0.0.0.0:5000 api:app -w 6 --preload --threads 6
