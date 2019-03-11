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
        return {'token': 'abdcefg_test_token'}, 200


create_parser = api.parser()
create_parser.add_argument('username', required=True)
create_parser.add_argument('password', required=True)
@api.route('/create_tenant')
@api.expect(create_parser)
class Login(Resource):
    def post(self):
        return "User Created!", 201