From flask import Flask
app = Flask(__name__)

@app.route('/')
def greetings:
    return 'Hello, welcome to signature authentication with Machine Learning'


if __name == '__main__':
    app.run(debug=True, host='0.0.0.0')