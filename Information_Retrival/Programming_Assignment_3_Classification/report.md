#Code flow:

- check if a doc is a training document
- if training document then put it in `trainingSet`
- otherwise, put it in `testSet`
- train classifier with `NaiveBayesClassifier` and `trainingSet`
- classify documents in `testSet`
- write result to `output.txt`

##python script.py
``` shell
➜  Programming_Assignment_3_Classification git:(master) ✗ python script.py
17 2
18 2
20 8
21 2
22 1
23 2
24 2
25 2
26 8
27 2
.
.
(skipped)
```