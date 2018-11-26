from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello There'

@app.route('/process')
def upload():
    return "Submit an invoice for process"

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')