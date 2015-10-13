module Main where
import MChallenge
import Test.QuickCheck

{- Your code here -}


{- Test your code using quickCheck -}

correct0 :: ([Int] -> [Int] -> [Int]) -> [Int] -> [Int] -> Bool
correct0 f xs ys = f xs ys == find xs ys

