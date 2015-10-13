module Week01 where
twice :: (a -> a) -> (a -> a)
twice f x = f ( f x )

double :: Integer -> Integer
double x = x * 2

doubleAll :: [Integer] -> [Integer]
doubleAll x = map double x

quadAll :: [Integer] -> [Integer]
quadAll x = doubleAll(doubleAll x)
