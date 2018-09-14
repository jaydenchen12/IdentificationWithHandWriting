from flask import Flask
app = Flask(__name__)

@app.route('/')
class Tnitial(Resource): 
    def get():
        """
        Initial contact point of the backend service
        """
        return 'Hello, welcome to signature authentication with Machine Learning'

@app.route('/datasets/<datasetId>')
class Datasets(Resource):
    def get(datasetId, **kwargs):
        """
        Get the dataset information that was uploaded previously
        """
        pass

    def post(datasetId, **kwargs):
        """
        Post the training dataset to the backend and object store
        """
        pass

if __name == '__main__':
    app.run(debug=True, host='0.0.0.0')