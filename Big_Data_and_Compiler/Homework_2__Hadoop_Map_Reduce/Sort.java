import java.io.IOException;
import java.util.*;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapred.*;
import org.apache.hadoop.util.*;

public class Sort {

    public static class Map extends MapReduceBase implements Mapper<LongWritable, Text, IntWritable, Text> {
      private Text word = new Text();
      private Text wordcount = new Text();

      public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
        String line = value.toString();
        StringTokenizer tokenizer = new StringTokenizer(line);
        while (tokenizer.hasMoreTokens()) {
          word.set(tokenizer.nextToken());
          wordcount.set(tokenizer.nextToken());
          output.collect(new IntWritable(Integer.parseInt(wordcount.toString())), word);
        }
      }
    }

    public static class Reduce extends MapReduceBase implements Reducer<IntWritable, Text, IntWritable, Text> {
      public void reduce(IntWritable key, Iterator<Text> values, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
        while(values.hasNext()){
          output.collect(key, values.next());
        }
      }
    }

    public static void main(String[] args) throws Exception {
      JobConf conf = new JobConf(Sort.class);
      conf.setJobName("sort");


      conf.setMapOutputKeyClass(IntWritable.class);
      conf.setMapOutputValueClass(Text.class);

      conf.setOutputKeyClass(Text.class);
      conf.setOutputValueClass(IntWritable.class);

      conf.setMapperClass(Map.class);
      conf.setCombinerClass(Reduce.class);
      conf.setReducerClass(Reduce.class);

      conf.setInputFormat(TextInputFormat.class);
      conf.setOutputFormat(TextOutputFormat.class);

      FileInputFormat.setInputPaths(conf, new Path(args[0]));
      FileOutputFormat.setOutputPath(conf, new Path(args[1]));

      JobClient.runJob(conf);
    }
}

