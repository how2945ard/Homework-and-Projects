#Code flow:

- set K ( #  of clusters ) and docs ( # of documents )
- run script with K and docs
- open and read text file
- do HAC()
- print result to standard output
- redirect standard output to K.txt

##javascript hac.js
``` shell
➜  Programming_Assignment_4_Hierarchical_Agglomerative_Clustering git:(master) ✗ node hac.js --cluster 8 --docs 1095 > 8.txt
➜  Programming_Assignment_4_Hierarchical_Agglomerative_Clustering git:(master) ✗ node hac.js --cluster 13 --docs 1095 > 13.txt
➜  Programming_Assignment_4_Hierarchical_Agglomerative_Clustering git:(master) ✗ node hac.js --cluster 20 --docs 1095 > 20.txt
```