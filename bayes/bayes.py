from PIL import Image
from collections import defaultdict
import math, os, pickle

class Bayes_Classifier:
    def __init__(self):
        self.records_real = defaultdict(list)
        self.records_fake = defaultdict(list)
        if (os.path.isfile("records_real.txt") and os.path.isfile("records_fake.txt")):
            self.records_real = self.load("records_real.txt")
            self.records_fake = self.load("records_fake.txt")
        else:
            self.train_real()
            self.train_fake()
            self.records_real = self.load("records_real.txt")
            self.records_fake = self.load("records_fake.txt")

    def train_real(self):
        for k in range(1,6):
            filename = 'true' + str(k) +'.png'
            im = Image.open(filename) # Can be many different formats.
            im = im.convert('1')
            data = list(im.getdata())
            for i in range(len(data)):
                self.records_real[i].append(data[i])
            im.save(filename)
        self.save(self.records_real, "records_real.txt")
    def train_fake(self):
        for k in range(1,6):
            filename = 'fake' + str(k) +'.png'
            im = Image.open(filename) # Can be many different formats.
            im = im.convert('1')
            data = list(im.getdata())
            for i in range(len(data)):
                self.records_fake[i].append(data[i])
            im.save(filename)
        self.save(self.records_fake, "records_fake.txt")

    def classify(self, img):
        im = Image.open(img)
        im = im.convert('1')
        pPos = 0.49
        pNeg = 0.51
        probabilitiesPos = []
        probabilitiesNeg = []
        probabilitiesPos.append(math.log(pPos))
        probabilitiesNeg.append(math.log(pNeg))
        datas = list(im.getdata())
        for i in range(len(datas)):
            #calulating the chance that it is positive and negative
            data = datas[i]
            numberPos = self.getOccurance(i, data, self.records_real)
            numberNeg = self.getOccurance(i, data, self.records_fake)
            # print numberPos, numberNeg
            numberPos = float(numberPos)
            numberNeg = float(numberNeg)
            num = 100 * 100
            pWordPos = numberPos / num
            pWordNeg = numberNeg / num
            condProbPos = numberPos / ( numberNeg + numberPos)
            condProbPosOut = (condProbPos * pWordPos) / pPos
            probabilitiesPos.append(math.log(condProbPosOut))

            condProbNeg = numberNeg / ( numberNeg + numberPos)
            condProbNegOut = (condProbNeg * pWordNeg) / pNeg
            probabilitiesNeg.append(math.log(condProbNegOut))

        totalProbPos = sum(probabilitiesPos)
        totalProbNeg = sum(probabilitiesNeg)
        print totalProbPos, totalProbNeg
        if totalProbPos > totalProbNeg:
            return "Real"
        elif totalProbPos < totalProbNeg:
            return "Fake"
        else:
            return "Neutral"

    def getOccurance(self, index, number, dict):
        record = dict[index]
        count = 0
        for data in record:
           if data == number:
               count += 1
        if count != 0: 
            return count 
        else:
            return 1
    def save(self, dObj, sFilename):
        '''Given an object and a file name, write the object to the file using pickle.'''

        f = open(sFilename, "w")
        p = pickle.Pickler(f)
        p.dump(dObj)
        f.close()

    def load(self, sFilename):
        '''Given a file name, load and return the object stored in the file.'''

        f = open(sFilename, "r")
        u = pickle.Unpickler(f)
        dObj = u.load()
        f.close()
        return dObj

if __name__ == "__main__":
    bayes = Bayes_Classifier()
    for i in range(1,3):
        file = 'test' + str(i) + 'true.png'
        print "classifying " + file + " bayes output:"
        print bayes.classify(file)
        print "input file was real"
    for i in range(1,4):
        file = 'test' + str(i) + 'fake.png'
        print "classifying " + file + " bayes output:"
        print bayes.classify(file)
        print "input file was fake"