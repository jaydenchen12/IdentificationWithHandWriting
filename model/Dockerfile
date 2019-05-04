FROM python:3.7

RUN apt-get update -y

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD python3 test_signature.py
