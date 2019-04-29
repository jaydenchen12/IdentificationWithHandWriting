from flask_restplus import Namespace, Resource, fields
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from flask import Flask
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['sig_ml']
UPLOAD_FOLDER = '/objectstore'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

api = Namespace('Login', description='Authication')
login_parser = api.parser()
login_parser.add_argument('username', required=True)
login_parser.add_argument('password', required=True)
@api.route('/login_tenant')
@api.expect(login_parser)
class Login(Resource):
    def post(self):
        user = db.users.find_one({'username':  request.args.get('username')})
        if user['password'] == request.args.get('password'):
            return {'token': 'abdcefg_test_token'}, 200
        else:
            return "Wrong Password"


create_parser = api.parser()
create_parser.add_argument('username', required=True)
create_parser.add_argument('password', required=True)
create_parser.add_argument('file', location='files',
                           type=FileStorage, required=True, action='append')
@api.route('/create_tenant')
@api.expect(create_parser)
class Signup(Resource):
    def post(self):
        files = request.files['files']
        secure_file_names = []
        if files:
            for file in files:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                secure_file_names.append(filename)
        result = db.users.insert_one(
            {'username':  request.args.get('username'),
             'password': request.args.get('password'),
             'ground_truths': secure_file_names})

        return "User Created!", 201