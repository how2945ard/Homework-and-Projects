module Week00 where
even_num :: Int -> Bool
even_num x = ((mod x 2) == 0)

area :: Double -> Double
area x = x * x * pi

smaller :: Int -> Int -> Int
smaller x y = if x > y then y else x

st3 :: Int -> Int
st3 x = smaller 3 x

quad :: Int -> Int
quad x = x * x * x * x

square :: Int -> Int
square x = x * x

twice :: (a -> a) -> (a -> a)
twice f x = f ( f x )

quad_twice :: Int -> Int
quad_twice x = twice square x

twice_edit :: (a -> a) -> (a -> a)
twice_edit f = f . f

quad_twice_edit :: Int -> Int
quad_twice_edit x = twice_edit square x
