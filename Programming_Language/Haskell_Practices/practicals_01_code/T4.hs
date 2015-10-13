module Main where
import M4
import Test.QuickCheck

{- Your code here -}

g0 :: [a] -> [[a]]
g0 xs = map (\n -> take n xs) [0..length xs]

g1 :: [a] -> [Int]
g1 xs = map (\x -> x)  [0..length xs]

{- Test your code using quickCheck -}

correct0 :: ([Int] -> [[Int]]) -> [Int] -> Bool
correct0 f xs = f xs == f0 xs

correct1 :: ([Int] -> [Int]) -> [Int] -> Bool
correct1 f xs = f xs == f1 xs
