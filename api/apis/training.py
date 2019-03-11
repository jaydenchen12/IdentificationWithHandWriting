from flask_restplus import Namespace, Resource, fields

api = Namespace('Training', description='End Points for Training Models')

training_parser = api.parser()
training_parser.add_argument('token', required=True)
@api.route('/retrain_tenant')
@api.expect(training_parser)
class Login(Resource):
    def post(self):
        return {'token': 'abdcefg_test_token'}, 200
