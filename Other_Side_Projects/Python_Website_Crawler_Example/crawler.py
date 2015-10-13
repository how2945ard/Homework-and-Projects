import urllib2
# 可以用來發出http request的套件
from bs4 import BeautifulSoup
# BeautifulSoup 是Python好用的用來處理DOM樹的工具
body = urllib2.urlopen("http://www.ettoday.net/dalemon/").read()
# 這邊對"http://www.ettoday.net/dalemon/"發出http request去取回html檔
soup = BeautifulSoup(body)
# 把剛剛讀到的body丟給BeautifulSoup處理

# 選擇('.pic > a > img')這些(個)elements
for img in soup.select('.pic > a > img'):
    print(img.attrs['src'])
    # 印出來
