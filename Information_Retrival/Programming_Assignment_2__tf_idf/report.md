#Code flow:

- load one file
- do tokenization for that file
- repeat for all files
- extract data (tf, idf, posting) from a large set of token
- write to files and store document-wise informaiton (document vector) in MongoDB
- do consine(x,y) using separated script and data from MongoDB

##node constructor.js
``` shell
➜  Programming_Assignment_2__tf_idf git:(master) ✗ node constructor.js
Start at: 2015-11-02T07:09:16.609Z
Processing document #1095, Done: 100%, ETA: 0.0 seconds, Time elapsed 70.6 seconds, ========================================
Stage 3, Done: 100%, ETA: 0.0 seconds, Time elapsed 184.7 seconds, ========================================
End at: 2015-11-02T07:12:21.330Z
Takes: 3 minutes
```

##node cosine.js -x 1 -y 2
``` shell
➜  Programming_Assignment_2__tf_idf git:(master) ✗ node cosine.js -x 1 -y 2
cosine similarity of doc #1 and doc #2: 0.21216294668004565
```
