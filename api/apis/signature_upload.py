from flask_restplus import Namespace, Resource, fields
from flask import request
from werkzeug.datastructures import FileStorage

import sys
sys.path.insert(0, '../model/test_signature.py')


import test_signature

api = Namespace('Signature', description='Process')


upload_parser = api.parser()
# Input arguments includes multiple file input
upload_parser.add_argument('file', location='files',
                           type=FileStorage, required=True, action='append') 
upload_parser.add_argument('token', required=True)
upload_parser.add_argument('user_name', required=True)
@api.route('/verify_signature/')
@api.expect(upload_parser)
class Signature(Resource):
    def post(self):
      #  uploaded_file = args['file']  # This is FileStorage instance
        uploaded_file = request.files['file']
        print('files:', type(uploaded_file))
        uploaded_file.save('./signature.png')
       # with open('signature.png', 'wb') as f:
       #     f.write(uploaded_file['file'])
        #url = do_something_with_file(uploaded_file)
        return {'record_id': '1234testing'}, 201


get_status_parser = api.parser()
get_status_parser.add_argument('record_id', required=True)
@api.route('/check_status/')
@api.expect(get_status_parser)
class Process(Resource):
    def get(self):
        return {'status': 'processing'}, 203
