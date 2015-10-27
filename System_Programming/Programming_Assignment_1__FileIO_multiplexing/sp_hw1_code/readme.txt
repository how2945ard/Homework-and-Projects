code flow:
  1. do init stuff
  2. use two fd_set
  3. wait on select()
  4. loop though and then enter code blocks ( determined by returned value from select() and request infomation )

IO multiplexing gives me a very different way of thinking.
It takes me some time to understand how to control code flow.
However, after understanding its logic, it is quite fun to work on IO multiplexing.