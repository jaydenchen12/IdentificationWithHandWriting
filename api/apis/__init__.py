from flask_restplus import Api

from .signature_upload import api as ns1
from .login import api as ns2
api = Api(
    title='ML-Signature-Auth',
    version='1.0',
    description='A pipeline for authenticating signatures',
    # All API metadatas
)

api.add_namespace(ns1)
api.add_namespace(ns2)

