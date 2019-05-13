from flask_restplus import Namespace, Resource, fields
from flask import request, Flask
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from pymongo import MongoClient
import sys
import datetime
sys.path.append('../model/')
client = MongoClient('localhost', 27017)
db = client['sig_ml']
UPLOAD_FOLDER = '/objectstore'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
        files = request.files['files']
        secure_file_names = []
        if files:
            file = files[0]
            secure_file_name = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_file_name))
        record_id = db.jobs.InsertOneResult(
            {'user':  request.args.get('username'),
             'status': 'in_progress',
             'upload_time': datetime.datetime.utcnow(),
             'last_modified': datetime.datetime.utcnow(),
             'confidence': 'None',
             'authorized': 'None',
             'signature': secure_file_name})
        test_signature.test_image(uploaded_file)
        
        return record_id, 201


get_status_parser = api.parser()
get_status_parser.add_argument('record_id', required=True)
@api.route('/check_status/')
@api.expect(get_status_parser)
class Process(Resource):
    def get(self):
        record = db.jobs.find_one({'_id':  request.args.get('record_id')})
        if record['status'] == 'completed':
            return {'record_id': record['_id'],
                    'status': record['status'],
                    'authorized': record['authorized'],
                    'confidence': record['confidence']}, 200
        elif record['status'] == 'in_progress':
            return {'status': 'in_progress'}, 203
        else:
            return {'status': 'error'}, 204
