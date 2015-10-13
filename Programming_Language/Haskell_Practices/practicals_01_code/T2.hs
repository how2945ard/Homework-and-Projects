module Main where
import M2
import Test.QuickCheck

{- Your code here -}

g0 :: [a] -> [[a]]
g0 xs = map (\n -> g1 n xs) [0..length xs-1]


g1 :: Int -> [a] -> [a]
g1 x xs =  concat ( [drop (length xs -x) xs, take (length xs -x) xs ] )

{- Test your code using quickCheck -}

correct0 :: ([Int] -> [[Int]]) -> [Int] -> Bool
correct0 f xs = f xs == f0 xs

correct1 :: (Int -> [Int] -> [Int]) -> Int -> [Int] -> Bool
correct1 f n xs = f n xs == f1 n xs
