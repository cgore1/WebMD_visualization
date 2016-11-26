import json
from pprint import pprint

with open('word2vecAndTfidf.json') as data_file:    
    data = json.load(data_file)

tfdata = {};
for i in data:
    tfdata[i['topic']] = i['wordNetMeanings']

with open('tfidfData.json', 'w') as outfile:
    json.dump(tfdata, outfile)

#pprint(data[0])
