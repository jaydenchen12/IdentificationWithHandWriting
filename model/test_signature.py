import numpy as np
import io
from PIL import Image
from keras.models import load_model
from keras.preprocessing import image
import pymongo
import datetime

mongoCilent = pymongo.MongoClient("mongodb://mongodocker:27017/")
mongo = mongoCilent["sigml"]
model = load_model('./trained_model_cnn.h5')
target_image_size = (150, 220)

def test_image(img):
    test_signature = image.img_to_array(img)
    test_signature = np.expand_dims(test_signature, axis=0)
    output = model.predict(test_signature)
    # train_dataset.class_indices

    if output[0][0] >= 0.5:
        prediction = ["authorized", output[0][0]]
    else:
        prediction = ["not aurthoized", output[0][0]]
    return prediction

def test(signature_id):
    signature = mongo.db.jobs.find_one({'_id':  signature_id})
    #image is stored as binary in the database
    image_binary = signature['signature_image']
    # binary to PIL Image and resized
    img = Image.open(io.BytesIO(image_binary))
    img.resize(target_image_size)
	results = test_image(img)
    mongo.db.jobs.update_one({'_id':  signature_id}, {
                             'status': 'complete',
                             'last_modified': datetime.datetime.utcnow(),
                             'confidence': results[1],
                             'authorized': results[0],
                            })