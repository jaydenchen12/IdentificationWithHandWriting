import numpy as np
from keras.models import load_model
from keras.preprocessing import image

model = load_model('./trained_model_cnn.h5')


def test_image(sig_img):
    test_signature = image.load_img(sig_img, target_size=(150, 220))
    test_signature = image.img_to_array(test_signature)
    test_signature = np.expand_dims(test_signature, axis=0)
    output = model.predict(test_signature)
#    train_dataset.class_indices

    if output[0][0] >= 0.5:
        prediction = [1, output[0][0]]
    else:
        prediction = [0, output[0][0]]
    return prediction


test_case = ['./img/test_images/test_sig1.png',
             './img/test_images/test_sig2.png',
             './img/test_images/test_sig3.png']
for test in test_case:
    print(test_image(test))
