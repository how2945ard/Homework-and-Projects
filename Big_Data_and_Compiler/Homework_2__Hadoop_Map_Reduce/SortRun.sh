hadoop fs -rm /temp_input
hadoop fs -rmr /temp_output
hadoop fs -rmr /word_output
hadoop fs -put $1 /temp_input
hadoop jar WordCount.jar WordCount /temp_input /word_output
hadoop jar Sort.jar Sort /word_output /temp_output
hadoop fs -cat /temp_output/* > $2
hadoop fs -rm /temp_input
hadoop fs -rmr /temp_output
hadoop fs -rmr /word_output

