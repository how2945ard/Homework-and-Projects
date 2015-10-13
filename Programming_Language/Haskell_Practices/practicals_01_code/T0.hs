module Main where
import M0
import Test.QuickCheck

{- Your code here -}

g0 xs = concat (map g1 (g2 xs))

g1 :: (a,a) -> [a]
g1 (x,y) = [x,y]

g2 xs = zip xs (tail xs)

{- Test your code using quickCheck -}

correct0 :: ([Int] -> [Int]) -> [Int] -> Bool
correct0 f xs = f xs == f0 xs

correct1 :: ((Int, Int) -> [Int]) -> (Int, Int) -> Bool
correct1 f (x,y) = f (x,y) == f1 (x,y)

correct2 :: ([Int] -> [(Int, Int)]) -> [Int] -> Bool
correct2 f xs = f xs == f2 xs