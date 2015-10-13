module Week02 where

import Week00

isSquare :: Int -> Bool
isSquare n = truncate(sqrt(x)) * truncate(sqrt(x)) == n
             where x = fromIntegral n


squares_up_to :: Int -> [Int]
squares_up_to x = filter ( \ x -> isSquare x ) [1..x]

position :: Char -> String -> [Int]
position x y = map snd (filter((x==).fst) (zip y [0..])) 

