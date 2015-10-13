module Main where
import M1
import Test.QuickCheck

{- Your code here -}

g0 :: [a] -> [[a]]
g0 xs = map (\n -> g1 n xs) [0..length xs-1]


g1 :: Int -> [a] -> [a]
g1 x xs =  concat ( [drop x xs, take x xs ] ) 


{- Test your code using quickCheck -}

correct0 :: ([Integer] -> [[Integer]]) -> [Integer] -> Bool
correct0 f xs = f xs == f0 xs

correct1 :: (Int -> [Integer] -> [Integer]) -> Int -> [Integer] -> Bool
correct1 f n xs = f n xs == f1 n xs
