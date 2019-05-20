
from flask_restplus import Namespace, Resource, fields
from flask import request, Flask
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
import pymongo
import sys
import datetime
from . import producer
from bson.objectid import ObjectId

sys.path.append('../model/')
mongoCilent = pymongo.MongoClient("mongodb://mongodocker:27017/")
mongo = mongoCilent["sigml"]

app = Flask(__name__)
api = Namespace('Signature', description='Process')


upload_parser = api.parser()
# Input arguments includes multiple file input
upload_parser.add_argument('file', location='files',
                           type=FileStorage, required=True)
upload_parser.add_argument('token', required=True)
upload_parser.add_argument('user_name', required=True)
@api.route('/verify_signature/')
@api.expect(upload_parser)
class Signature(Resource):
    def post(self):
        file = request.files['file'].read()
        record = mongo.db.jobs.insert_one(
            {'user':  request.args.get('username'),
             'status': 'in_progress',
             'upload_time': datetime.datetime.utcnow(),
             'last_modified': datetime.datetime.utcnow(),
             'confidence': 'None',
             'authorized': 'None',
             'signature_image': file})
        print(str(record.inserted_id), flush=True)     
        producer.produce_msg(str(record.inserted_id))   
        return str(record.inserted_id), 201


get_status_parser = api.parser()
get_status_parser.add_argument('record_id', required=True)
@api.route('/check_status/')
@api.expect(get_status_parser)
class Process(Resource):
    def get(self):
        record = mongo.db.jobs.find_one({'_id':  ObjectId(request.args.get('record_id'))})
        print(record, flush=True)
        if record['status'] == 'completed':
            return {'record_id': record['_id'],
                    'status': record['status'],
                    'authorized': record['authorized'],
                    'confidence': record['confidence']}, 200
        elif record['status'] == 'in_progress':
            return {'status': 'in_progress'}, 203
        else:
            return {'status': 'error'}, 204
