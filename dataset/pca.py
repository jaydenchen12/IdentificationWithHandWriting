from skimage.io import imread_collection
from time import time
import logging
import matplotlib.pyplot as plt
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.datasets import fetch_lfw_people
from PIL import Image
import os
train_data = []
for file in os.listdir("unsuper/"):
    img = Image.open("unsuper/"+file, 'r')
    img.resize((300, 300))
    arr = np.array(img).flatten()
    train_data.append(arr)
print(train_data)
target_n = np.full((len(train_data)/2), "true")
target_f = np.full((len(train_data)/2), "false")
total_target = np.concatenate((target_n, target_f), axis=0)
n_components = 80
pca = PCA()
pca.fit(train_data)
print("Projecting the input data on the eigenfaces orthonormal basis")
t0 = time()
X_train_pca = pca.transform(X_train)
X_test_pca = pca.transform(X_test)
print("done in %0.3fs" % (time() - t0))


# #############################################################################
# Train a SVM classification model

print("Fitting the classifier to the training set")
t0 = time()
param_grid = {'C': [1e3, 5e3, 1e4, 5e4, 1e5],
              'gamma': [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.1], }
clf = GridSearchCV(SVC(kernel='rbf', class_weight='balanced'),
                   param_grid, cv=5)
clf = clf.fit(X_train_pca, y_train)
print("done in %0.3fs" % (time() - t0))
print("Best estimator found by grid search:")
print(clf.best_estimator_)
# #############################################################################
# Quantitative evaluation of the model quality on the test set

print("Predicting people's names on the test set")
t0 = time()
y_pred = clf.predict(X_test_pca)
print("done in %0.3fs" % (time() - t0))

print(classification_report(y_test, y_pred, target_names=total_target))
print(confusion_matrix(y_test, y_pred, labels=range(2)))

# #############################################################################
# Qualitative evaluation of the predictions using matplotlib

def plot_gallery(images,  h, w, n_row=3, n_col=4):
    """Helper function to plot a gallery of portraits"""
    plt.figure(figsize=(1.8 * n_col, 2.4 * n_row))
    plt.subplots_adjust(bottom=0, left=.01, right=.99, top=.90, hspace=.35)
    for i in range(n_row * n_col):
        plt.subplot(n_row, n_col, i + 1)
        plt.imshow(images[i].reshape((h, w)), cmap=plt.cm.gray)
        plt.xticks(())
        plt.yticks(())


# plot the result of the prediction on a portion of the test set

plot_gallery(X_test, 5, 5)

# plot the gallery of the most significative eigenfaces

plt.show()
