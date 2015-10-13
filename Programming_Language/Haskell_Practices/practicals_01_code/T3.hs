module Main where
import M3
import Test.QuickCheck

{- Your code here -}

g0 :: Int -> [a] -> [a]
g0 x xs = concat (map (\n-> xs) [0..length xs])

g1 :: [a] -> [Int]
g1 xs = map (\x -> x)  [0..length xs] 


{- Test your code using quickCheck -}

correct0 :: (Int -> [Int] -> [Int]) -> Int -> [Int] -> Bool
correct0 f n xs = f n xs == f0 n xs

correct1 :: ([Int] -> [Int]) -> [Int] -> Bool
correct1 f xs = f xs == f1 xs
