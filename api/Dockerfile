FROM python:3.7
RUN apt-get update -y

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD python3 api.py
