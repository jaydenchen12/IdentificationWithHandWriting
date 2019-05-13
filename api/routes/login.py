from flask_restplus import Namespace, Resource, fields
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from flask import Flask, request
from flask_cors import CORS
# from pymongo.binary import Binary
import pymongo
import datetime

app = Flask(__name__)
mongoCilent = pymongo.MongoClient("mongodb://mongodb:27017/")
mongo = mongoCilent["sigml"]

api = Namespace('Login', description='Authication')
login_parser = api.parser()
login_parser.add_argument('username', required=True)
login_parser.add_argument('password', required=True)
@api.route('/login_tenant')
@api.expect(login_parser)
class Login(Resource):
    def post(self):
        user = mongo.db.users.find_one({'username':  request.args.get('username')})
        if user['password'] == request.args.get('password'):
            return {'token': 'abdcefg_test_token'}, 200
        else:
            return "Wrong Password"


create_parser = api.parser()
create_parser.add_argument('username', required=True)
create_parser.add_argument('password', required=True)
create_parser.add_argument('file_0', location='files',
                           type=FileStorage, required=True)
create_parser.add_argument('file_1', location='files',
                           type=FileStorage, required=True)
create_parser.add_argument('file_2', location='files',
                           type=FileStorage, required=True)
@api.route('/create_tenant')
@api.expect(create_parser)
class Signup(Resource):
    def post(self):
        file0 = request.files['file_0'].read()
        # file1 = request.files['file_1']
        # file2 = request.files['file_2']
        # if files:
        #     for file in files:
        #         filename = secure_filename(file.filename)
        #         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        #         secure_file_names.append(filename)
        result = mongo.db.users.insert_one(
            {'username':  request.args.get('username'),
             'password': request.args.get('password'),
             'create_time': datetime.datetime.utcnow(),
             'ground_truth_1': file0})

        return "User Created!", 201