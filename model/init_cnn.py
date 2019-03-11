from keras.models import Sequential
from keras.layers import Conv2D, ZeroPadding2D
from keras.layers import MaxPooling2D
from keras.layers import Flatten
from keras.layers import Dense
from keras.preprocessing.image import ImageDataGenerator

#  Creating Layers for Model
model = Sequential()
model.add(Conv2D(96, (11, 11), strides=(4, 4), input_shape=(150, 220, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(3, 3)))
model.add(ZeroPadding2D(padding=(2, 2)))
model.add(Conv2D(256, (3, 3), strides=(2, 2), activation='relu'))
model.add(MaxPooling2D(pool_size=(3, 3)))
model.add(ZeroPadding2D(padding=(1, 1)))
model.add(Conv2D(384, (3, 3), strides=(1, 1), activation='relu'))
model.add(ZeroPadding2D(padding=(1, 1)))
model.add(Conv2D(384, (3, 3), strides=(1, 1), activation='relu'))
model.add(ZeroPadding2D(padding=(1, 1)))
model.add(Conv2D(256, (3, 3), strides=(1, 1), activation='relu'))
model.add(Flatten())
model.add(Dense(units=128, activation="relu"))
model.add(Dense(units=1, activation="sigmoid"))

#  Compile Model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

#  Setup train/test data
train_data = ImageDataGenerator(rescale=1. / 255, shear_range=0.2, zoom_range=0.2, horizontal_flip=True)
test_data = ImageDataGenerator(rescale=1. / 255)

# Initialize train/test data sets
train_dataset = train_data.flow_from_directory('dataset', target_size=(150, 220), batch_size=32, class_mode='binary')
test_dataset = test_data.flow_from_directory('signatures', target_size=(150, 220), batch_size=32, class_mode='binary')
