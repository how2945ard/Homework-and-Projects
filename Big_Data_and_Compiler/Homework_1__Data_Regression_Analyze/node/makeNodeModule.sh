# This script is used to generate node.js module for raw data

echo 'module.exports = {\n' > dataMod.js
echo 'ad: ' >> dataMod.js
cat raw_data/new_ad.txt >> dataMod.js
echo ',' >> dataMod.js
echo 'visit: ' >> dataMod.js
cat raw_data/new_visit.txt >> dataMod.js
echo ',' >> dataMod.js
echo 'sale: ' >> dataMod.js
cat raw_data/new_sale.txt >> dataMod.js
echo ',' >> dataMod.js
echo '\n}' >> dataMod.js