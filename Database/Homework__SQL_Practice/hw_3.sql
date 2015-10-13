-- HW3
-- (1) 查詢所有 CategoryName 及每個 Category 所擁有的 Product 個數和 Product 平均價格。

SELECT CategoryName,

  (SELECT COUNT(Price)
   FROM Products
   WHERE Products.CategoryID = Categories.CategoryID
   GROUP BY CategoryID) AS COUNT,

  (SELECT AVG(Price)
   FROM Products
   WHERE Products.CategoryID = Categories.CategoryID
   GROUP BY CategoryID) AS AVERAGE_PRICE
FROM Categories --
--
-- (2) 查詢所有含有 3 個以上 Product，且總訂貨量超過 150 或總訂貨量少於 50 的訂單。

SELECT *,

  (SELECT SUM(Quantity)
   FROM OrderDetails
   WHERE OrderDetails.OrderID = Orders.OrderID) AS Quantity,

  (SELECT COUNT(ProductID)
   FROM OrderDetails
   WHERE OrderDetails.OrderID = Orders.OrderID) AS Product_Count
FROM Orders
WHERE Product_Count >= 3
  AND (Quantity>150
       OR Quantity< 50) --
--
-- (3) 查詢 CustomerName = ‘Chop-suey Chinese’所訂購的 Order 及每筆 Order 的總價錢。

  SELECT O.*,
         SUM(P.Price*OD.Quantity)
  FROM Customers C,
       Orders O,
       OrderDetails OD,
       Products P WHERE C.CustomerID = O.CustomerID
  AND O.OrderID = OD.OrderID
  AND OD.ProductID = P.ProductID
  AND C.CustomerName = 'Chop-suey Chinese'
GROUP BY O.OrderID --
--
-- (4)  查詢 ShipperName = ‘United Package’所處理的訂單的所有 Customer 和 Employee 組合，以及各組合下的訂單數量。(例如，Customer 1 , Employee 1 組合下的訂單數量 ; Customer 1, Employee2 組合下的訂單數量……)

SELECT O.CustomerID,
       O.EmployeeID ,
       COUNT(O.CustomerID) AS NumberOfOrders
FROM Shippers S,
     Orders O,
     Employees E,
     Customers C
WHERE S.ShipperName = 'United Package'
  AND O.ShipperID = S.ShipperID
  AND O.EmployeeID = E.EmployeeID
  AND O.CustomerID = C.CustomerID
GROUP BY O.CustomerID --
--
-- (5) 查詢價格小於 25 元的產品名稱並依銷售數量由多至少排序。

SELECT P.ProductName,
       sum(OD.Quantity) AS Sales
FROM Products P,
     OrderDetails OD
WHERE P.Price < 25
  AND OD.ProductID = P.ProductID
GROUP BY OD.ProductID
ORDER BY Sales DESC; --
--
-- (6) 查詢由 FirstName=’Laura’的員工向位於 Frankfurt 的 Supplier 訂購且單價不低於 40 的商品名稱及訂購數量。


SELECT P.ProductName,
       sum(OD.Quantity) AS Amount
FROM Employees E,
     Suppliers Sup,
     Products P,
     OrderDetails OD
WHERE E.FirstName = 'Laura'
  AND Sup.City = 'Frankfurt'
  AND P.SupplierID = Sup.SupplierID
  AND P.Price >= 40
  AND OD.ProductID = P.ProductID
GROUP BY OD.ProductID --
--
-- (7) 查詢 Order 全部由 LastName=’Peacock’員工所負責的 CustomerID

SELECT O.CustomerID
FROM Employees E,
     Orders O
WHERE E.LastName='Peacock'
  AND O.EmployeeID = E.EmployeeID --
--
-- (8) 查詢訂購的所有商品皆來自 country = ‘UK’ 的 Supplier 的訂單，列出訂單的 OrderID。

  SELECT O.OrderID
  FROM Suppliers Sup,
       Products P,
       OrderDetails OD,
       Orders O WHERE Sup.Country = 'UK'
  AND P.SupplierID = Sup.SupplierID
  AND OD.ProductID = P.ProductID
  AND OD.OrderID = O.OrderID --
--
-- (9) 查詢 sauce 所屬的種類名稱(Description 裡面有出現’sauce’)，並找出此種類中商品名稱有’sauce’之商品名稱及價格

  SELECT P.ProductName,
         P.Price
  FROM Categories Ca,
       Products P WHERE Ca.Description LIKE '%sauce%'
  AND P.ProductName LIKE '%sauce%' --
--
-- (10) 查詢所有不重複的 CustomerID 其 ORDER 是由年紀最小(生日日期最大)的員工所負責的

SELECT DISTINCT O.CustomerID
FROM
Orders O,
Employees E
WHERE O.EmployeeID = E.EmployeeID and E.BirthDate in (SELECT MAX(E.BirthDate) FROM Employees E)
