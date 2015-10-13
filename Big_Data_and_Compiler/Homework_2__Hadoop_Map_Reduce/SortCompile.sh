mkdir temp
javac -classpath hadoop-1.2.1/hadoop-core-1.2.1.jar -d temp WordCount.java
jar -cvf WordCount.jar -C temp/ .
rm -rf temp
mkdir temp
javac -classpath hadoop-1.2.1/hadoop-core-1.2.1.jar -d temp Sort.java
jar -cvf Sort.jar -C temp/ .
rm -rf temp