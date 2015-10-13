vertex = -1
skip = false
$result = Array.new

def next_node(current)
	current -=1
	if $bigArray[current]
		$bigArray[current].each do |value|
			return value
		end
	end
	return false
end
# to find next node

def findCircuit(x)
	while(y = next_node(x))
		$bigArray[x-1].delete_at($bigArray[x-1].index(y)) if $bigArray[x-1].index(y)
		$bigArray[y-1].delete_at($bigArray[y-1].index(x)) if $bigArray[y-1].index(x) if x!= y
		findCircuit(y)
		$result.push(y)
	end
end
# to get the route

ARGV.each_with_index do|value,index|
	if value != ","
		value = value.to_i
		if !skip
			if index == 0
				puts "first"
				$bigArray = Array.new(value) { Array.new(0) }
				$adj = Array.new(value){Array.new(value,0)}
			else
				$bigArray[vertex].push(value)
				puts "push: #{value} in #{vertex}"
			end
		end
		skip = false
	else
		skip = true
		vertex += 1
	end
end
# data input
# format and sample input:
#  	6 , 1 2 3 3 4 , 2 1 3 6 6 , 3 1 1 2 4 5 6 , 4 1 3 5 5 , 5 3 4 4 6 , 6 2 2 3 5
# exec code :
# 	irb hw.rb 6 , 1 2 3 3 4 , 2 1 3 6 6 , 3 1 1 2 4 5 6 , 4 1 3 5 5 , 5 3 4 4 6 , 6 2 2 3 5
# need ruby to compile

Eulerian = true
$bigArray.each_with_index do |value,index|
	value.each do |element|
		puts element
	end
	puts "degree for vertex#{index+1}: #{value.count}"
	if (value.count)%2!=0 || (value.count)==0 # graph with unconnected or not-even-degree has no Eulerian circuit
		cause = value.count  == 0 ?  "not connected" : "not even degree"
		puts "can't find Eulerian circuit , for #{cause}"
		Eulerian = false
	end
end


# find the route
if Eulerian
	puts "can found"
	start = nil
	$bigArray.each_with_index do |value,index|
		if value.count> 0 && !start
			start = index+1
		end
		value.each_with_index do |val,idx|
			$adj[val-1][index] += 1
		end
	end
	findCircuit(start)
	$result.push(start)
	puts $result
end