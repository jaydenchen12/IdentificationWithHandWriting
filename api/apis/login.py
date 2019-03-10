from flask_restplus import Namespace, Resource, fields
from werkzeug.datastructures import FileStorage
from flask import Flask

api = Namespace('Login', description='Authication')
login_parser = api.parser()
login_parser.add_argument('username', required=True)
login_parser.add_argument('password', required=True)
@api.route('/login_tenant')
@api.expect(login_parser)
class Login(Resource):
    def post(self):
        response = Flask.jsonify({'token': 'abdcefg_test_token'})
        response.headers.add('Access-Control-Allow-Origin', 'True')
        return response, 200
        # return {'token': 'abdcefg_test_token'}, 200
