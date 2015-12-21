# import textblob
from textblob import TextBlob
from textblob.classifiers import NaiveBayesClassifier

trainingSet = [
    [11, 19, 29, 113, 115, 169, 278, 301, 316, 317, 321, 324, 325, 338, 341],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16],
    [813, 817, 818, 819, 820, 821, 822, 824, 825, 826, 828, 829, 830, 832, 833],
    [635, 680, 683, 702, 704, 705, 706, 708, 709, 719, 720, 722, 723, 724, 726],
    [646, 751, 781, 794, 798, 799, 801, 812, 815, 823, 831, 839, 840, 841, 842],
    [995, 998, 999, 1003, 1005, 1006, 1007, 1009,
        1011, 1012, 1013, 1014, 1015, 1016, 1019],
    [700, 730, 731, 732, 733, 735, 740, 744, 752, 754, 755, 756, 757, 759, 760],
    [262, 296, 304, 308, 337, 397, 401, 443, 445, 450, 466, 480, 513, 533, 534],
    [130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 145],
    [31, 44, 70, 83, 86, 92, 100, 102, 305, 309, 315, 320, 326, 327, 328],
    [240, 241, 243, 244, 245, 248, 250, 254, 255, 256, 258, 260, 275, 279, 295],
    [535, 542, 571, 573, 574, 575, 576, 578, 581, 582, 583, 584, 585, 586, 588],
    [485, 520, 523, 526, 527, 529, 530, 531, 532, 536, 537, 538, 539, 540, 541]
]

trainArray = []
testArray = []
for number in range(1, 1096):
    inAnyClass = False
    for classTag in trainingSet:
        if number in classTag:
            classNumber = str(trainingSet.index(classTag) + 1)
            inAnyClass = True
            fileObject = open('./IRTM/' + str(number) + '.txt')
            text = fileObject.read()
            trainArray.append((text, classNumber))
    if not inAnyClass:
        fileObject = open('./IRTM/' + str(number) + '.txt')
        text = fileObject.read()
        testArray.append((text, number))

cl = NaiveBayesClassifier(trainArray)

output = open('./output.txt', 'w')

# Classify some text
for test in testArray:
    classTag = cl.classify(test[0])
    result = str(test[1]) + ' ' + classTag
    print(result)
    output.write(result+'\n')
    output.flush()